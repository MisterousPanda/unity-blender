import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { assembleCourse, lessonById, loadCourse } from "../lib/assemble";
import { blankProgress, isUnlocked, stageComplete, stageStatus } from "../lib/gates";
import { additionFields, buildAddition, buildBrief, buildCreation, briefFields, creationFields } from "../lib/message";
import {
  ADDITION,
  CAPSTONE,
  CREATION,
  CREATION_BLENDER,
  GROK_LINE,
  HANDOFF_BLENDER,
  HANDOFF_UNITY,
  MCP_EXPLAIN,
  PAIR,
  PENDING,
  STAGE4_CARD,
  STANDING_BRIEF,
  WELCOME,
} from "../lib/verbatim";
import type { Progress } from "../lib/types";

const course = loadCourse();

function walkText(value: unknown): string {
  return JSON.stringify(value);
}

test("six stages stay in order", () => {
  assert.deepEqual(
    course.stages.map((stage) => stage.id),
    ["unity", "blender", "together", "generators", "grok", "supervise"],
  );
  assert.deepEqual(
    course.stages.map((stage) => stage.name),
    [
      "Unity",
      "Blender",
      "Unity and Blender together",
      "World models, Dreamina, and Higgsfield",
      "Creating and adding with Grok",
      "Supervising tool calls",
    ],
  );
});

test("verbatim page copy is on the course", () => {
  const blob = walkText(course);
  for (const text of [
    WELCOME[0],
    WELCOME[1],
    GROK_LINE,
    PENDING,
    CAPSTONE,
    MCP_EXPLAIN,
    "The full split is stage 3.",
    "Where do an object's components show up?",
    "On the object. I select it in the Hierarchy and read them in the Inspector.",
    "1 Blender, 2 Unity, 3 Blender, 4 Unity, 5 Blender.",
    "Handoff, not an addition.",
    "Creation: crate.",
    "Ask Grok to explain this",
    "I did the rep",
    "This matches what I meant",
    "This needs a fresh yes from me",
    "Copy all my notes",
  ]) {
    assert.equal(blob.includes(text), true, text.slice(0, 80));
  }
  assert.equal(lessonById(course, "6.1")?.toolPrompt, PAIR);
  assert.equal(lessonById(course, "4.4")?.handoff?.body, STAGE4_CARD);
});

test("creation, addition, and standing brief round-trip", () => {
  assert.equal(buildCreation(creationFields(CREATION), null), CREATION);
  assert.equal(buildCreation(creationFields(CREATION_BLENDER), null), CREATION_BLENDER);
  assert.equal(buildAddition(additionFields(ADDITION), null), ADDITION);
  assert.equal(buildAddition(additionFields(HANDOFF_BLENDER), null), HANDOFF_BLENDER);
  assert.equal(buildAddition(additionFields(HANDOFF_UNITY), null), HANDOFF_UNITY);
  assert.equal(buildBrief(briefFields(STANDING_BRIEF)), STANDING_BRIEF);
});

test("composer refuses an empty required field and keeps the forbidden line", () => {
  const fields = creationFields(CREATION);
  assert.equal(buildCreation({ ...fields, goal: "  " }, null), null);
  const addition = additionFields(ADDITION);
  assert.equal(buildAddition({ ...addition, already: "" }, "Open the app."), null);
  assert.equal(buildAddition({ ...addition, keep: "" }, null), null);
  const message = buildAddition(addition, "Open grok.com/imagine.");
  assert.ok(message);
  assert.equal(message?.startsWith("Goal: "), true);
  assert.equal(message?.includes("Already exists: "), true);
  assert.equal(message?.includes("Keep unchanged: "), true);
  assert.equal(message?.includes("Manual step: Open grok.com/imagine."), true);
  assert.equal(message?.endsWith("Do not spend, delete, overwrite source files, publish, send messages, or change accounts."), true);
  assert.equal(buildBrief({ ...briefFields(STANDING_BRIEF), fresh: " " }), null);
});

test("mapped notes are ready and agent text stays on stage 6", () => {
  const unity = walkText(course.stages[0]);
  const supervise = walkText(course.stages[5]);
  assert.equal(unity.includes("execute_blender_code"), false);
  assert.equal(unity.includes("grok-imagine-video-1.5"), false);
  assert.equal(supervise.includes("execute_blender_code"), true);
  assert.equal(supervise.includes("What an agent can touch") || supervise.includes("Agent, MCP"), true);
  const lesson = lessonById(course, "1.1");
  assert.ok(lesson);
  assert.equal(lesson.explainNotes[0]?.status, "ready");
  assert.equal(lessonById(course, "1.2")?.notices.some((notice) => notice.source === "notes"), true);
  assert.equal(lessonById(course, "4.1")?.notices.some((notice) => notice.text.startsWith("Video.")), true);
  assert.ok((lessonById(course, "5.1")?.practiceChecks ?? []).some((item) => item.n === 1 && item.required));
  assert.ok((lessonById(course, "5.1")?.practiceChecks ?? []).some((item) => item.n === 2 && !item.required));
});

test("stages unlock only in order", () => {
  const progress = blankProgress();
  assert.equal(isUnlocked("unity", progress, course), true);
  assert.equal(isUnlocked("blender", progress, course), false);
  assert.equal(stageStatus("unity", progress, course), "current");
  assert.equal(stageStatus("blender", progress, course), "not started");

  const finished = completeStage(progress, course.stages[0]);
  assert.equal(stageComplete(course.stages[0], finished, course), true);
  assert.equal(isUnlocked("blender", finished, course), true);
  assert.equal(stageStatus("unity", finished, course), "complete");
  assert.equal(stageStatus("blender", finished, course), "current");
  assert.equal(isUnlocked("together", finished, course), false);
});

test("a missing brief leaves the lesson and does not renumber stages", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "learn-"));
  writeFileSync(path.join(dir, "blender.md"), "# Blender\n\nChecked 2026-10-11.\n\n## Mental model\n\nBlender holds the file.\n");
  const partial = assembleCourse(dir);
  assert.deepEqual(
    partial.stages.map((stage) => stage.id),
    ["unity", "blender", "together", "generators", "grok", "supervise"],
  );
  const lesson = lessonById(partial, "1.1");
  assert.equal(lesson?.explain.startsWith("A scene is the place"), true);
  assert.equal(lesson?.explainNotes[0]?.status, "pending");
  assert.equal(partial.pendingCopy, PENDING);
});

test("an extra heading is filed under more notes and does not add a stage", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "learn-extra-"));
  writeFileSync(
    path.join(dir, "unity.md"),
    "# Unity\n\nResearched 2026-10-11.\n\n## Mental model\n\nA scene.\n\n## Extra tool\n\nThis is not a stage.\n",
  );
  const extra = assembleCourse(dir);
  assert.equal(extra.stages.length, 6);
  const more = extra.stages[0].nodes.find((node) => node.type === "fold" && node.summary === "More from the notes");
  assert.ok(more && more.type === "fold");
  assert.equal(
    more.slots.some((slot) => slot.status === "ready" && slot.note.heading === "Extra tool"),
    true,
  );
});

function completeStage(progress: Progress, stage: (typeof course.stages)[number]): Progress {
  const checks = { ...progress.checks };
  const confirmed = { ...progress.confirmed };
  for (const id of stage.repIds) checks[id] = true;
  for (const id of stage.noticeIds) checks[id] = true;
  for (const id of stage.practiceIds) checks[id] = true;
  for (const id of stage.checkpointIds) confirmed[id] = true;
  const notes = [...progress.notes];
  for (const id of stage.noteIds) {
    notes.push({ id, sort: 1, title: id, body: "Goal: x", tool: "Grok Imagine" });
  }
  return { ...progress, checks, confirmed, notes };
}
