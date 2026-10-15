import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  additionFields,
  briefFields,
  creationFields,
  explainRequest,
} from "./message";
import {
  markdownTable,
  numberedItems,
  parseBrief,
  plainText,
  sectionByHeading,
  topLevelItems,
  type ParsedBrief,
} from "./parse-brief";
import { renderMarkdown } from "./render-md";
import type {
  CheckpointView,
  ComposerSeed,
  Course,
  LessonView,
  PracticeCheck,
  Slot,
  StageId,
  StageNode,
  StageView,
  ToolOption,
} from "./types";
import {
  ADDITION,
  CAPSTONE,
  CHOOSE_RULE,
  CHROME,
  CREATION,
  CREATION_BLENDER,
  GROK_LINE,
  HANDOFF_BLENDER,
  HANDOFF_NOT_ADDITION,
  HANDOFF_UNITY,
  MCP_EXPLAIN,
  PAGE_DOES_NOT_CALL,
  PAIR,
  PENDING,
  PERISHABLE,
  POINTER,
  RIGHTS,
  STAGE4_CARD,
  STANDING_BRIEF,
  WELCOME,
} from "./verbatim";

const FILES = {
  unity: "unity.md",
  blender: "blender.md",
  comparison: "unity-blender-comparison.md",
  world: "world-models.md",
  dreamina: "dreamina.md",
  higgsfield: "higgsfield.md",
  grok: "grok.md",
} as const;

const MAPPED: Record<string, string[]> = {
  [FILES.unity]: [
    "Mental model",
    "Learn by hand first",
    "Skip at the start",
    "What you must understand before handing work to an LLM",
    "Agent, MCP, and automation surfaces",
    "Unity next to the other tools",
  ],
  [FILES.blender]: [
    "Mental model",
    "Learn by hand first",
    "Skip at the start",
    "What you must understand before an LLM drives Blender",
    "MCP, Python, and agent surfaces",
    "Where Blender sits next to the other tools",
    "Short path",
  ],
  [FILES.comparison]: [
    "What each tool is best at",
    "Differences a beginner will feel",
    "A practical pipeline",
    "Wrong jobs",
    "What you still have to understand if an LLM drives the tool",
    "Where Grok, world models, Dreamina, and Higgsfield plug in",
    "One pass through the tools",
  ],
  [FILES.world]: [
    "Plain-language definition",
    "What is actually shipping",
    "What you learn, and what you hand to the model",
    "How the files enter Blender and Unity",
    "Dreamina, Higgsfield, and Grok",
    "Grok stays the main tool",
    "Uncertainty",
  ],
  [FILES.dreamina]: [
    "What it is and what it outputs",
    "What a beginner needs to understand",
    "How it complements the other tools",
    "What a person must judge before a 3D pipeline",
    "Public API, MCP, and automation",
  ],
  [FILES.higgsfield]: [
    "What it is for",
    "What a beginner needs to understand",
    "How it sits next to the other tools",
    "Automation a learner should know exists",
    "What a person must judge before Blender or Unity",
    "Uncertainty",
  ],
  [FILES.grok]: [
    "Products that matter",
    "What to practice by hand",
    "How Grok leads, and when to hand off",
    "What “additions” means here",
    "MCP and tool use (names only)",
    "What you still have to understand",
  ],
};

const AGENT_HEADINGS: { file: string; heading: string }[] = [
  { file: FILES.unity, heading: "Agent, MCP, and automation surfaces" },
  { file: FILES.blender, heading: "MCP, Python, and agent surfaces" },
  { file: FILES.dreamina, heading: "Public API, MCP, and automation" },
  { file: FILES.higgsfield, heading: "Automation a learner should know exists" },
  { file: FILES.grok, heading: "MCP and tool use (names only)" },
];

const HOME: Record<string, StageId> = {
  [FILES.unity]: "unity",
  [FILES.blender]: "blender",
  [FILES.comparison]: "together",
  [FILES.world]: "generators",
  [FILES.dreamina]: "generators",
  [FILES.higgsfield]: "generators",
  [FILES.grok]: "grok",
};

export const TOOLS: ToolOption[] = [
  {
    id: "imagine",
    label: "Grok Imagine",
    manual:
      "Open grok.com/imagine. For a still, use grok-imagine-image-2.0 and, if the screen offers them, 2k and quality medium. For a new clip from that still, use image-to-video on grok-imagine-video-1.5 and, if the screen offers them, 15 seconds, 1080p, and audio on. You click to generate. Save the file. Usage comes from the shared weekly pool on Ultra. This page does not call Grok.",
  },
  {
    id: "dreamina",
    label: "Dreamina",
    manual:
      "Open Dreamina in the browser. The model picker is the product: Seedream for a still, Seedance for a clip. You click to generate. Spending credits waits for your yes.",
  },
  {
    id: "higgs-video",
    label: "Higgsfield, video (reference)",
    manual:
      "Open the Higgsfield studio the notes name for this shot. You approve Generate. A website unlimited plan is not a promise about agent calls. Higgsfield's notes say MCP spends credits. A batch waits for a fresh yes.",
  },
  {
    id: "higgs-3d",
    label: "Higgsfield, 3D (GLB or Blender insert)",
    manual:
      "Use 3D Jutsu or the Blender add-on. Only a GLB, or objects the add-on actually inserted, can become scene data, and only after the checks in the notes. You approve Generate.",
  },
  {
    id: "marble",
    label: "Marble",
    manual:
      "Start from a Grok still. Marble is the world-model export path in the notes. Export needs a paid plan. Confirm the live plan before you pay.",
  },
  {
    id: "blender",
    label: "Blender",
    manual:
      "You still click in Blender. Check Object mode or Edit mode before you accept a step. Save a copy of the .blend first.",
  },
  {
    id: "unity",
    label: "Unity",
    manual:
      "You still open the Unity Editor. Stop Play mode before you keep an edit. A red Console line means the change failed.",
  },
];

type Library = Map<string, ParsedBrief | null>;

function readLibrary(dir: string): Library {
  const library: Library = new Map();
  for (const file of Object.values(FILES)) {
    const full = path.join(dir, file);
    library.set(file, existsSync(full) ? parseBrief(readFileSync(full, "utf8")) : null);
  }
  return library;
}

function noteFrom(library: Library, file: string, heading: string): Slot {
  const brief = library.get(file);
  if (!brief) return { status: "pending" };
  const section = sectionByHeading(brief, heading);
  if (!section) return { status: "pending" };
  return {
    status: "ready",
    note: {
      file,
      heading,
      date: brief.date,
      html: renderMarkdown(section.body),
    },
  };
}

function bulletPack(library: Library, file: string, heading: string): {
  slot: Slot;
  lead: string | null;
  items: string[];
} {
  const slot = noteFrom(library, file, heading);
  if (slot.status === "pending") return { slot, lead: null, items: [] };
  const brief = library.get(file);
  const section = brief ? sectionByHeading(brief, heading) : undefined;
  if (!section) return { slot, lead: null, items: [] };
  const parsed = topLevelItems(section.body);
  return { slot, lead: plainText(parsed.intro) || null, items: parsed.items };
}

function blankLesson(seed: {
  id: string;
  kicker: string;
  title: string;
  explain: string;
  ask?: boolean;
}): LessonView {
  return {
    id: seed.id,
    kicker: seed.kicker,
    title: seed.title,
    explain: seed.explain,
    explainRequest: seed.ask ? explainRequest(seed.title, seed.explain) : null,
    explainNotes: [],
    afterNotes: [],
    toolPrompt: null,
    promptLabel: null,
    promptTitle: null,
    practiceFinish: null,
    practiceNote: null,
    practice: null,
    aside: null,
    notices: [],
    noticeLead: null,
    noticeHeading: null,
    noticeSlot: null,
    folds: [],
    checkpoints: [],
    handoff: null,
    handoffNote: null,
    composer: null,
    repId: null,
    requiresNoteId: null,
    practiceChecks: null,
    sort: null,
    rights: false,
  };
}

function pageNotices(lesson: LessonView, texts: string[]): void {
  texts.forEach((text, index) => {
    lesson.notices.push({ id: `${lesson.id}:page:${index}`, text, source: "page" });
  });
}

function applyBullets(lesson: LessonView, pack: { slot: Slot; lead: string | null; items: string[] }, heading: string): void {
  if (pack.slot.status === "pending") {
    lesson.noticeHeading = heading;
    lesson.noticeSlot = pack.slot;
    return;
  }
  if (pack.items.length === 0) {
    lesson.explainNotes.push(pack.slot);
    return;
  }
  lesson.noticeHeading = heading;
  lesson.noticeLead = pack.lead;
  pack.items.forEach((text, index) => {
    lesson.notices.push({ id: `${lesson.id}:notes:${index}`, text, source: "notes" });
  });
}

function handoff(id: string, title: string, body: string, sort: number) {
  return { id, title, body, sort };
}

function checkpoint(id: string, question: string, modelAnswer: string, fields?: CheckpointView["fields"]): CheckpointView {
  return { id, question, modelAnswer, fields };
}

function extras(library: Library, file: string): Slot[] {
  const brief = library.get(file);
  if (!brief) return [];
  const mapped = new Set(MAPPED[file] ?? []);
  const slots: Slot[] = [];
  if (brief.preamble.trim()) {
    slots.push({
      status: "ready",
      note: {
        file,
        heading: brief.title || file,
        date: brief.date,
        html: renderMarkdown(brief.preamble),
      },
    });
  }
  for (const section of brief.sections) {
    if (section.level !== 2) continue;
    if (mapped.has(section.heading)) continue;
    slots.push({
      status: "ready",
      note: {
        file,
        heading: section.heading,
        date: brief.date,
        html: renderMarkdown(section.body),
      },
    });
  }
  return slots;
}

function moreFor(library: Library, stageId: StageId): Slot[] {
  return Object.values(FILES)
    .filter((file) => HOME[file] === stageId)
    .flatMap((file) => extras(library, file));
}

function worldOutputNotices(library: Library, lessonId: string): { id: string; text: string; source: "notes" }[] {
  const brief = library.get(FILES.world);
  const section = brief ? sectionByHeading(brief, "Plain-language definition") : undefined;
  if (!section) return [];
  return markdownTable(section.body)
    .filter((row) => row[0] && row[0] !== "Output" && row[2])
    .map((row, index) => ({
      id: `${lessonId}:output:${index}`,
      text: `${row[0]}. ${row[2]}`,
      source: "notes" as const,
    }));
}

function grokPractice(library: Library): PracticeCheck[] {
  const fallback: PracticeCheck[] = [
    { id: "grok-1", n: 1, text: "One thread with a style line and a do-not-change list.", required: true },
    { id: "grok-3", n: 3, text: "One still.", required: true },
    { id: "grok-4", n: 4, text: "One edit or variation, with a sentence about what changed.", required: true },
  ];
  const brief = library.get(FILES.grok);
  const section = brief ? sectionByHeading(brief, "What to practice by hand") : undefined;
  if (!section) return fallback;
  const items = numberedItems(section.body);
  if (items.length === 0) return fallback;
  const required = new Set([1, 3, 4]);
  return items.map((item) => ({
    id: `grok-${item.n}`,
    n: item.n,
    text: item.text,
    required: required.has(item.n),
  }));
}

function textOnly(
  fields: { goal: string; constraints: string; done: string; notice: string; stop: string; already?: string; keep?: string },
  form: "creation" | "addition",
): Record<string, string> {
  const record: Record<string, string> = {
    goal: fields.goal,
    done: fields.done,
    notice: fields.notice,
    stop: fields.stop,
  };
  if (form === "creation") record.constraints = fields.constraints;
  if (fields.already) record.already = fields.already;
  if (fields.keep) record.keep = fields.keep;
  return record;
}

function creationSeed(
  id: string,
  tab: string,
  title: string,
  sort: number,
  block: string,
  toolId: string,
  countsForGate: boolean,
): ComposerSeed {
  const fields = creationFields(block);
  return {
    id,
    tab,
    noteId: id,
    noteTitle: title,
    noteSort: sort,
    form: "creation",
    toolId,
    countsForGate,
    fields: textOnly(fields, "creation"),
  };
}

function additionSeed(
  id: string,
  tab: string,
  title: string,
  sort: number,
  block: string,
  toolId: string,
  countsForGate: boolean,
): ComposerSeed {
  const fields = additionFields(block);
  return {
    id,
    tab,
    noteId: id,
    noteTitle: title,
    noteSort: sort,
    form: "addition",
    toolId,
    countsForGate,
    fields: textOnly(fields, "addition"),
  };
}

function finishStage(
  stage: Omit<StageView, "repIds" | "noticeIds" | "checkpointIds" | "practiceIds" | "noteIds">,
): StageView {
  const repIds: string[] = [];
  const noticeIds: string[] = [];
  const checkpointIds: string[] = [];
  const practiceIds: string[] = [];
  const noteIds: string[] = [];
  for (const node of stage.nodes) {
    if (node.type === "gate") checkpointIds.push(node.checkpoint.id);
    if (node.type !== "lesson") continue;
    const lesson = node.lesson;
    if (lesson.repId) repIds.push(lesson.repId);
    noticeIds.push(...lesson.notices.map((notice) => notice.id));
    checkpointIds.push(...lesson.checkpoints.map((item) => item.id));
    practiceIds.push(...(lesson.practiceChecks ?? []).filter((item) => item.required).map((item) => item.id));
    if (lesson.requiresNoteId) noteIds.push(lesson.requiresNoteId);
  }
  return { ...stage, repIds, noticeIds, checkpointIds, practiceIds, noteIds };
}

function lessonNode(lesson: LessonView): StageNode {
  return { type: "lesson", lesson };
}

export function assembleCourse(dir: string): Course {
  const library = readLibrary(dir);
  const slot = (file: string, heading: string) => noteFrom(library, file, heading);

  const lesson11 = blankLesson({
    id: "1.1",
    kicker: "Lesson 1.1",
    title: "Find the scene",
    explain:
      "A scene is the place where things are. Each thing is an object. Select an object in the Hierarchy and read the Inspector. The Inspector lists that object's components: where it is, what it looks like, and what it does. The Project window holds the files the scene can use. The Console is where errors show up.",
    ask: true,
  });
  lesson11.explainNotes = [slot(FILES.unity, "Mental model")];
  lesson11.toolPrompt =
    "Create a Universal 3D project, or open the one you already started. Find Hierarchy, Scene, Game, Inspector, Project, and Console. Click one object. Write its name and two component names.";
  lesson11.promptLabel = "tool";
  lesson11.practiceFinish = "a note that names one object and at least two of its components.";
  lesson11.practiceNote =
    "Items 1 and 2 are the rep that unlocks the next stage. The rest stay visible. You tick that kind of check on stage 6.";
  lesson11.practice = slot(FILES.unity, "Learn by hand first");
  lesson11.repId = "rep:1.1";
  pageNotices(lesson11, [
    "The object you clicked is the one highlighted in the Scene view.",
    "The Inspector changed when you selected it.",
    "You can point to Hierarchy, Scene, Game, Inspector, Project, and Console.",
  ]);
  lesson11.checkpoints = [
    checkpoint(
      "1.1-q",
      "Where do an object's components show up?",
      "On the object. I select it in the Hierarchy and read them in the Inspector.",
    ),
  ];
  lesson11.handoff = handoff(
    "handoff-1.1",
    "Find the scene",
    "You may ask a model to list the components on a named object. You keep the judgment of whether it is the right object. Making a new mesh is Blender's job, and it comes in stage 2.",
    110,
  );

  const lesson12 = blankLesson({
    id: "1.2",
    kicker: "Lesson 1.2",
    title: "Run Play mode",
    explain:
      "Play mode runs the scene so you can see it behave. The Game view shows the camera's picture while it runs. Stop Play mode before you keep an edit. Changes you make while it is running are discarded when you stop. The Console is the list of errors. A red line means the change is not done. A script is a component too. You can ask for one later. You do not need to write C# to finish this stage.",
    ask: true,
  });
  lesson12.toolPrompt =
    'Place a cube if the scene needs one. Press Play. Watch the Game view. Press Stop. Write what moved, or "nothing moved." Look at the Console and write whether it is clear.';
  lesson12.promptLabel = "tool";
  lesson12.practiceFinish = "one sentence about what Play mode did, plus a second sentence that says you stopped Play mode.";
  lesson12.practiceNote = "Item 2 of Learn by hand first is the rep for this lesson. The full list is on lesson 1.1.";
  lesson12.repId = "rep:1.2";
  pageNotices(lesson12, [
    "You can tell Play mode from editing.",
    "After Stop, the scene matches the saved editing scene.",
    "You did not need to read a script to see the scene run.",
  ]);
  applyBullets(
    lesson12,
    bulletPack(library, FILES.unity, "What you must understand before handing work to an LLM"),
    "What you must understand before handing work to an LLM",
  );
  lesson12.checkpoints = [
    checkpoint(
      "1.2-q",
      "What happens to edits you make while Play mode is running?",
      "They are for the test. They are discarded when I stop. I redo any change I still want after I have stopped.",
    ),
  ];
  lesson12.handoff = handoff(
    "handoff-1.2",
    "Run Play mode",
    "You may ask a model to suggest a component that would make a named object move, and to tell you how to test it in Play mode. You run the test, you stop Play mode, and you decide whether to keep the idea.",
    120,
  );

  const lesson21 = blankLesson({
    id: "2.1",
    kicker: "Lesson 2.1",
    title: "Object mode and Edit mode",
    explain:
      "Blender is where you make and change 3D things. Object mode moves a whole object. Edit mode changes its mesh, the points and faces. Before you move anything, notice which mode you are in.",
    ask: true,
  });
  lesson21.explainNotes = [slot(FILES.blender, "Mental model")];
  lesson21.toolPrompt =
    "Add a cube if the scene does not have one. In Object mode, move it. Switch to Edit mode, move one face, and switch back to Object mode. Say which change moved the whole crate-to-be, and which change altered the mesh.";
  lesson21.promptLabel = "tool";
  lesson21.practiceFinish = "two sentences, one for Object mode and one for Edit mode, each saying what changed.";
  lesson21.practice = slot(FILES.blender, "Learn by hand first");
  lesson21.aside = { summary: "Longer path", slot: slot(FILES.blender, "Short path") };
  lesson21.repId = "rep:2.1";
  pageNotices(lesson21, [
    "You could say which mode you were in before each move.",
    "The object in the Outliner is the one you changed.",
    "You saved the file, or you know you still need to.",
  ]);
  lesson21.checkpoints = [
    checkpoint(
      "2.1-q",
      "What is the difference between moving an object and editing it?",
      "Object mode moves the whole object. Edit mode changes the mesh.",
    ),
  ];
  lesson21.handoff = handoff(
    "handoff-2.1",
    "Object mode and Edit mode",
    "You may ask a model for the steps to add a cube and enter Edit mode in the Blender version named in the notes. You check the mode yourself before you accept the steps.",
    210,
  );

  const lesson22 = blankLesson({
    id: "2.2",
    kicker: "Lesson 2.2",
    title: "Render a still",
    explain:
      "A camera and a light decide the shot. A render is a picture from that camera. The picture is output. The Blender file is still the editable source.",
    ask: true,
  });
  lesson22.toolPrompt =
    "Aim the camera so the crate is fully in frame. Set the crate's material to one flat color. Render one still. Keep the Blender file saved.";
  lesson22.promptLabel = "tool";
  lesson22.practiceFinish = "a still where the crate is fully in frame, and a saved Blender file.";
  lesson22.practiceNote = "Export stays in stage 3.";
  lesson22.repId = "rep:2.2";
  pageNotices(lesson22, [
    "The still matches the camera view.",
    "The crate is the subject.",
    "You can find the saved file and the still as two different results.",
  ]);
  applyBullets(
    lesson22,
    bulletPack(library, FILES.blender, "What you must understand before an LLM drives Blender"),
    "What you must understand before an LLM drives Blender",
  );
  lesson22.checkpoints = [
    checkpoint("2.2-q", "What do you keep editing after a render?", "The Blender file. The render is a picture of it."),
  ];
  lesson22.handoff = handoff(
    "handoff-2.2",
    "Render a still",
    "You may ask a model to draft render settings for one still of a named object. You accept the still only if the object is in frame and you still have the source file.",
    220,
  );

  const jobs = [
    "Model a closed wooden crate.",
    "Make the crate rotate when Play mode runs.",
    "Render a still of the crate from Blender's camera.",
    "Let a player walk around the crate.",
    "Change one face of the crate's mesh.",
  ];
  const lesson31 = blankLesson({
    id: "3.1",
    kicker: "Lesson 3.1",
    title: "Which tool owns the job",
    explain:
      "Give the editable model to Blender. Give the interactive scene to Unity. Give a one-off picture of an idea to a generator later. If a job needs a model and a reaction, it needs both tools, in that order.",
    ask: true,
  });
  lesson31.explainNotes = [
    slot(FILES.comparison, "What each tool is best at"),
    slot(FILES.unity, "Unity next to the other tools"),
    slot(FILES.blender, "Where Blender sits next to the other tools"),
    slot(FILES.comparison, "Wrong jobs"),
  ];
  lesson31.toolPrompt = `For each job, name the tool:\n${jobs.map((job, index) => `${index + 1}. ${job}`).join("\n")}`;
  lesson31.promptLabel = "tool";
  lesson31.practiceFinish = "five labels, then a look at the model routing.";
  lesson31.repId = "rep:3.1";
  pageNotices(lesson31, [
    "Jobs about the mesh or the Blender picture went to Blender.",
    "Jobs about Play mode or a player went to Unity.",
    'You did not give "model it" to Unity or "make it playable" to Blender.',
  ]);
  lesson31.checkpoints = [
    checkpoint("3.1-q", "For each job, name the tool.", "1 Blender, 2 Unity, 3 Blender, 4 Unity, 5 Blender.", jobs.map((label, index) => ({ id: `job-${index + 1}`, label }))),
  ];
  lesson31.handoff = handoff(
    "handoff-3.1",
    "Which tool owns the job",
    "You may ask a model to sort a new list of jobs the same way. You change any line that gives modeling to Unity or playable behavior to Blender.",
    310,
  );

  const lesson32 = blankLesson({
    id: "3.2",
    kicker: "Lesson 3.2",
    title: "The handoff and the seams",
    explain:
      "Export the crate from Blender and import it into a Unity scene. Look before you add any behavior. Check three things: it stands upright, its size is believable next to a default cube, and you know whether its material survived. A gray crate means you rebuild the look in Unity. Keep the Blender file. Unity has a copy.",
    ask: true,
  });
  lesson32.explainNotes = [slot(FILES.comparison, "Differences a beginner will feel")];
  lesson32.toolPrompt =
    "Export the crate and import it into a Unity scene. Look at it from the side and from above. Write three notes: upright or sideways, size compared with a default cube, material kept or needs a rebuild. Do not add gameplay. Do not delete the Blender file.";
  lesson32.promptLabel = "tool";
  lesson32.practiceFinish = "the three notes: upright, size, and material.";
  lesson32.practice = slot(FILES.comparison, "A practical pipeline");
  lesson32.repId = "rep:3.2";
  pageNotices(lesson32, [
    "You looked at orientation before adding a script.",
    "You looked at size before trusting the export.",
    "You can say where the source file still is.",
    "A lost material is a seam to expect, and the mesh can still be the right mesh.",
  ]);
  applyBullets(
    lesson32,
    bulletPack(library, FILES.comparison, "What you still have to understand if an LLM drives the tool"),
    "What you still have to understand if an LLM drives the tool",
  );
  lesson32.checkpoints = [
    checkpoint(
      "3.2-q1",
      "Name one seam you will look for on every import.",
      "I look for a sideways model, a wild scale, or a material that came in gray and still needs a rebuild. Any one of those is enough to pause.",
    ),
    checkpoint(
      "3.2-q2",
      "Write one sentence a model could follow.",
      "Export the crate from Blender in the format named in the notes, import it into the Unity scene, and stop for me to check that it is upright and about the size of a default cube.",
    ),
  ];
  lesson32.handoff = handoff(
    "handoff-3.2",
    "The handoff and the seams",
    "You may ask a model to prepare that export and import. You do the three checks. The model waits if any check fails.",
    320,
  );

  const lesson41 = blankLesson({
    id: "4.1",
    kicker: "Lesson 4.1",
    title: "World models",
    explain:
      "A world model keeps a place in mind and predicts what you would see next. The file you can download is the real product: a video, a splat, a mesh, or a session that ends when you close it. Unity runs objects and rules you can inspect. A video cannot be imported as a level. A mesh still needs a collider, a light, and a script after it lands.",
    ask: true,
  });
  lesson41.explainNotes = [slot(FILES.world, "Plain-language definition")];
  lesson41.toolPrompt =
    "From the notes, pick one shipping example. Write three sentences. What file do you hold after you close the site: video, splat, mesh, or nothing? What does the example claim happens next? Which part of that claim would have to become a rule in Unity if a player depended on it?";
  lesson41.promptLabel = "tool";
  lesson41.practiceFinish = "the three sentences.";
  lesson41.practice = slot(FILES.world, "How the files enter Blender and Unity");
  lesson41.repId = "rep:4.1";
  pageNotices(lesson41, [
    "You can name the file type: video, splat, mesh, or a session with no file.",
    "A convincing bounce is still a picture of a bounce until Unity has the collision.",
    "A mesh that imports the size of a coin is a failed export even when it looks pretty.",
    "You would send back a clip that changes the crate into something else.",
  ]);
  const outputs = worldOutputNotices(library, lesson41.id);
  if (outputs.length > 0) {
    lesson41.noticeHeading = "Plain-language definition";
    lesson41.notices.push(...outputs);
  }
  lesson41.folds = [
    { summary: "Uncertainty", slot: slot(FILES.world, "Uncertainty") },
    { summary: "More from the notes", slot: slot(FILES.world, "What is actually shipping") },
  ];
  lesson41.checkpoints = [
    checkpoint(
      "4.1-q",
      "A clip shows the crate melting into the floor. What do you trust it for?",
      "I trust it as a picture of an idea. I do not import that behavior into Unity as a fact. If the crate must stay solid, I set that in Unity.",
    ),
  ];
  lesson41.handoffNote = slot(FILES.world, "What you learn, and what you hand to the model");
  lesson41.handoff = handoff(
    "handoff-4.1",
    "World models",
    "You may ask a model to describe a world-model preview of the crate. You may ask it to list which preview ideas would become Unity rules. You accept the clip as a preview.",
    410,
  );

  const lesson42 = blankLesson({
    id: "4.2",
    kicker: "Lesson 4.2",
    title: "Dreamina",
    explain:
      "Dreamina is a browser studio for stills and video. You get pixels back, sometimes with generated sound. A picture that looks like a render is still a picture: no units, no pivot, no mesh. Grok decides the shot. You open Dreamina when the notes say this studio is the right renderer. You watch the file before it becomes reference.",
    ask: true,
  });
  lesson42.explainNotes = [slot(FILES.dreamina, "What it is and what it outputs")];
  lesson42.toolPrompt =
    "A single closed wooden crate, three-quarter view, soft daylight, plain gray background, no text, no people.";
  lesson42.promptLabel = "tool";
  lesson42.practiceFinish =
    "one image, plus one sentence about what happened when you changed a single phrase and generated again.";
  lesson42.practice = slot(FILES.dreamina, "What a beginner needs to understand");
  lesson42.repId = "rep:4.2";
  lesson42.rights = true;
  pageNotices(lesson42, [
    "The subject is one crate.",
    "The background and the absence of people and text match the prompt.",
    "You can say what the one edited phrase changed.",
    "You know this file is a reference unless the notes say it can be placed in Unity.",
  ]);
  applyBullets(
    lesson42,
    bulletPack(library, FILES.dreamina, "What a person must judge before a 3D pipeline"),
    "What a person must judge before a 3D pipeline",
  );
  lesson42.checkpoints = [
    checkpoint(
      "4.2-q",
      "What do you have after a Dreamina run?",
      "Generated media, a picture or a clip, as the notes name it. I still have to check the subject. The editable crate remains the Blender file.",
    ),
  ];
  lesson42.handoff = handoff(
    "handoff-4.2",
    "Dreamina",
    "You may ask a model to draft a Dreamina prompt for a mood still of my crate, with subject, lighting, background, and exclusions. You check the image before it becomes reference for the project. Spending credits waits for your yes.",
    420,
  );

  const lesson43 = blankLesson({
    id: "4.3",
    kicker: "Lesson 4.3",
    title: "Higgsfield",
    explain:
      'Higgsfield is a studio for images and directed video, and it has a 3D path. A clip is reference. A GLB, or objects the Blender add-on actually inserted, can become scene data after you check scale, normals, and identity. Camera moves and "physics" in a clip are a look, not a simulation you can scrub in Blender. Grok still decides the shot. You approve Generate.',
    ask: true,
  });
  lesson43.explainNotes = [slot(FILES.higgsfield, "What it is for")];
  lesson43.toolPrompt =
    "A slow push-in toward a single closed wooden crate, three-quarter view, soft daylight, plain gray background, no text, no people. The crate stays the same crate for the whole shot.";
  lesson43.promptLabel = "tool";
  lesson43.practiceFinish =
    "one still or one short motion, plus a sentence that says whether the camera move and the crate's identity held.";
  lesson43.practice = slot(FILES.higgsfield, "What a beginner needs to understand");
  lesson43.repId = "rep:4.3";
  lesson43.rights = true;
  pageNotices(lesson43, [
    "The crate stays the crate through the shot.",
    "The camera does the move you asked for.",
    "New objects did not wander in.",
    "You know the file's next home: reference, a placeable file the notes allow, or send-back.",
  ]);
  applyBullets(
    lesson43,
    bulletPack(library, FILES.higgsfield, "What a person must judge before Blender or Unity"),
    "What a person must judge before Blender or Unity",
  );
  lesson43.folds = [{ summary: "Uncertainty", slot: slot(FILES.higgsfield, "Uncertainty") }];
  lesson43.checkpoints = [
    checkpoint(
      "4.3-q",
      "What do you check on a motion result that a single still cannot show?",
      "That the subject stays itself across the frames, and that the camera move matches the request.",
    ),
  ];
  lesson43.handoff = handoff(
    "handoff-4.3",
    "Higgsfield",
    "You may ask a model to draft a Higgsfield prompt for one camera move around my crate, with exclusions. You watch the result before it is reference. A batch of variations waits for a fresh yes.",
    430,
  );

  const homes = [
    "A crate mesh you can keep editing.",
    "A mood still with the right crate and the wrong extra chair.",
    "A Play mode scene where the crate rotates.",
    "A world-model clip of the crate falling over.",
    "A clip whose crate changes color halfway through.",
  ];
  const lesson44 = blankLesson({
    id: "4.4",
    kicker: "Lesson 4.4",
    title: "Where a picture belongs",
    explain: CHOOSE_RULE,
    ask: true,
  });
  lesson44.explainNotes = [
    slot(FILES.dreamina, "How it complements the other tools"),
    slot(FILES.higgsfield, "How it sits next to the other tools"),
    slot(FILES.comparison, "Where Grok, world models, Dreamina, and Higgsfield plug in"),
    slot(FILES.world, "Dreamina, Higgsfield, and Grok"),
  ];
  lesson44.toolPrompt = `Sort these results. Write one home for each: Blender, Unity, Dreamina or Higgsfield as reference, or send back.\n${homes.map((home, index) => `${index + 1}. ${home}`).join("\n")}`;
  lesson44.promptLabel = "tool";
  lesson44.practiceFinish = "five labels and a look at the model sort.";
  lesson44.sort = checkpoint(
    "4.4-sort",
    "Sort these results.",
    "1. Blender.\n2. Send back, because an extra object failed the notice.\n3. Unity.\n4. Reference for mood. The fall becomes a Unity rule only if you ask for that behavior on purpose.\n5. Send back. The subject did not stay itself.",
    homes.map((label, index) => ({ id: `home-${index + 1}`, label })),
  );
  lesson44.repId = "rep:4.4";
  pageNotices(lesson44, [
    "Editable geometry went to Blender.",
    "Behavior the player relies on went to Unity.",
    'Pixels went to "reference" or "send back," and you can say which.',
  ]);
  lesson44.checkpoints = [
    checkpoint(
      "4.4-q",
      "You like a generated clip, and the crate changes shape halfway. What is your next action?",
      "I send it back. A clip I like is still a failed check if the crate does not stay the crate. I tell Grok what I noticed when I reach stage 5.",
    ),
  ];
  lesson44.handoff = handoff("handoff-4.4", "Where a picture belongs", STAGE4_CARD, 450);

  const lesson51 = blankLesson({
    id: "5.1",
    kicker: "Lesson 5.1",
    title: "Ask for a creation",
    explain:
      "A creation starts in Grok. For a picture or a short clip, the tool is Grok Imagine. The message names constraints, how you will know it is done, and what you will look at. You run the check. A mesh is a handoff: Grok writes the request, Blender holds the file.",
  });
  lesson51.explainNotes = [slot(FILES.grok, "Products that matter")];
  lesson51.composer = "creation";
  lesson51.afterNotes = [
    slot(FILES.grok, "How Grok leads, and when to hand off"),
    slot(FILES.world, "Grok stays the main tool"),
    slot(FILES.comparison, "Where Grok, world models, Dreamina, and Higgsfield plug in"),
  ];
  lesson51.practiceFinish = "a saved creation message.";
  lesson51.practiceNote = PAGE_DOES_NOT_CALL;
  lesson51.practiceChecks = grokPractice(library);
  lesson51.requiresNoteId = "creation-imagine";
  pageNotices(lesson51, [
    "A tool is named.",
    "Done-when can be checked by looking.",
    "Stop-if names a result you would send back.",
    "The forbidden line is still in the message.",
  ]);
  applyBullets(lesson51, bulletPack(library, FILES.grok, "What you still have to understand"), "What you still have to understand");
  lesson51.checkpoints = [
    checkpoint(
      "5.1-q",
      "What is wrong with the request 'make the crate cooler'?",
      "It has no tool, no constraint, and no done-when. I cannot check it. I rewrite it in the creation shape.",
    ),
  ];

  const lesson52 = blankLesson({
    id: "5.2",
    kicker: "Lesson 5.2",
    title: "Ask for an addition",
    explain:
      "An addition is a new piece that feeds the pipeline. It is a variation, an edit, another still, a prompt for a different tool, or a scene idea in words. It is not the assembled 3D scene. The message names the still or clip you already have, and what must stay the same.",
  });
  lesson52.explainNotes = [slot(FILES.grok, "What “additions” means here")];
  lesson52.composer = "addition";
  lesson52.practiceFinish = "one saved Imagine addition.";
  lesson52.practiceNote = "The Blender and Unity tabs stay as reference handoffs. Saving one of them is extra, not the gate.";
  lesson52.repId = "rep:5.2";
  lesson52.requiresNoteId = "addition-imagine";
  pageNotices(lesson52, [
    "Already-exists points at a still, a prompt, or a file you can open.",
    "Keep-unchanged would catch a redesign.",
    "The result is still pixels or words, unless the Tool line is an explicit Blender or Unity handoff.",
  ]);
  lesson52.checkpoints = [
    checkpoint(
      "5.2-q",
      "What does an addition include that a brand-new Imagine still does not?",
      "The picture or prompt I already have, and what must stay unchanged. The assembled scene in Blender or Unity is a handoff, not an addition.",
    ),
  ];

  const lesson53 = blankLesson({
    id: "5.3",
    kicker: "Lesson 5.3",
    title: "A still at the image ceiling",
    explain:
      "Ultra is the top individual tier of The X Subscription, the plan that unifies Grok, Cursor, and X. It is $200 a month, or $2,000 a year, and its included usage is 50 times Plus. That pool is weekly and shared across Chat, Imagine, Voice, Bot, and Cursor’s first-party models. It is not a separate Imagine quota, and xAI does not publish how many images it holds. For a new still, the documented ceiling on grok-imagine-image-2.0 is 2k resolution and quality medium. Auto quality serves low on a new image. One API request can return up to 10 images. An edit can use up to 5 source images. Practice this in grok.com/imagine. This page does not call Grok.",
  });
  lesson53.toolPrompt = `In grok.com/imagine, make one still. Use grok-imagine-image-2.0. If the screen offers resolution and quality, set 2k and medium.
One closed wooden crate, about the size of a cardboard moving box, three-quarter view, soft daylight, plain gray background. No text. No people. No extra objects.
Save the image and save this prompt beside it. Write down the resolution and quality the app actually used.
The Grok watermark stays. The file is a picture, not a mesh.`;
  lesson53.promptLabel = "send";
  lesson53.practiceFinish =
    "one saved still, the prompt saved beside it, and a note of the resolution and quality the app actually used.";
  lesson53.practiceNote =
    "If the screen has no resolution control, use the highest image control it does show and write that down. Do not invent a 2k button.";
  lesson53.repId = "rep:5.3";
  pageNotices(lesson53, [
    "The crate is one object, and nothing you excluded appeared.",
    "You wrote down the resolution and quality the app used.",
    "The Grok watermark is still on the file. There is no setting to remove it.",
    "You saved the file. A hosted image URL is temporary.",
    "You know this draw comes from the shared weekly pool, not a separate Imagine quota.",
  ]);
  lesson53.checkpoints = [
    checkpoint(
      "5.3-q",
      "What is the documented ceiling for a new grok-imagine-image-2.0 still?",
      "Resolution 2k, and quality medium when you pin it. Auto serves low on a new image and medium on an edit. One request can return up to 10 images. An edit can take up to 5 source images. The generation docs list 1k and 2k. The pricing table also lists 1.5K as a billed size.",
    ),
  ];
  lesson53.handoff = handoff(
    "handoff-5.3",
    "Still at the image ceiling",
    "You may ask Grok to draft the 2k, quality-medium crate still in grok.com/imagine. You click generate. You save the file and the prompt. You check the watermark, the subject, and the resolution the app actually used. Spending past the weekly pool waits for a fresh yes.",
    530,
  );

  const lesson54 = blankLesson({
    id: "5.4",
    kicker: "Lesson 5.4",
    title: "A clip at the video ceiling",
    explain:
      "For a new clip, grok-imagine-video-1.5 does text-to-video and image-to-video at native 1080p, from 1 to 15 seconds, with audio on by default and lip-synced speech. The default duration is 8 seconds. Image-to-video locks your still as frame one and keeps its aspect ratio. Reference-to-video on that model allows up to 14 images, up to 3 voice references, and pinned first, last, and up to 4 mid frames, and it tops out at 720p. Editing a clip up to 8.7 seconds, or extending it by 2 to 10 seconds, is the older grok-imagine-video model, and an edit’s output is capped at 720p. In the app, a 720p video falls back to 480p after your tier’s 720p cap. xAI does not publish the size of that cap. A video draws more of the shared weekly pool than a chat message.",
  });
  lesson54.toolPrompt = `In grok.com/imagine, start from the saved crate still. Use image-to-video on grok-imagine-video-1.5.
If the screen offers duration, resolution, and audio, set 15 seconds, 1080p, and audio on.
Slow push-in. The crate stays the same closed wooden crate for the whole shot. Soft daylight, plain gray background. No text. No people. No extra objects.
Save the clip. Write one sentence that names the duration and resolution of the file, and whether the crate and the camera move held.
Do not use reference-to-video for this rep. That path tops out at 720p.`;
  lesson54.promptLabel = "send";
  lesson54.practiceFinish =
    "one saved image-to-video clip, plus a sentence that names its duration, its resolution, and whether the crate and the camera move held.";
  lesson54.practiceNote =
    "Reference-to-video is a different ceiling: up to 14 images and 720p on grok-imagine-video-1.5. Use it only when you need those references, and say so. If a 720p file comes back at 480p, you have passed the tier cap. The cap’s size is not published.";
  lesson54.repId = "rep:5.4";
  pageNotices(lesson54, [
    "The crate stays the same crate for the whole clip.",
    "You wrote down the duration and resolution of the file you saved.",
    "You can say whether the clip has audio.",
    "The Grok watermark is still there.",
    "You did not treat a 720p reference clip as the 1080p image-to-video ceiling.",
  ]);
  lesson54.checkpoints = [
    checkpoint(
      "5.4-q",
      "How is a 15-second image-to-video different from a reference-to-video on grok-imagine-video-1.5?",
      "Image-to-video can be native 1080p, 1 to 15 seconds, with the still locked as frame one and audio on by default. Reference-to-video allows up to 14 images and up to 3 voice references, and it tops out at 720p. Editing or extending a clip is grok-imagine-video, not 1.5.",
    ),
  ];
  lesson54.handoff = handoff(
    "handoff-5.4",
    "Clip at the video ceiling",
    "You may ask Grok to draft one 15-second 1080p image-to-video of the saved crate still, with audio on, in grok.com/imagine. You click generate. You save the file and check duration, resolution, audio, identity, and the watermark. A batch, or any spend past the weekly pool, waits for a fresh yes.",
    540,
  );

  const lesson61 = blankLesson({
    id: "6.1",
    kicker: "Lesson 6.1",
    title: "What will change",
    explain: MCP_EXPLAIN,
  });
  lesson61.toolPrompt = PAIR;
  lesson61.promptLabel = "custom";
  lesson61.promptTitle = "Plain and compact";
  lesson61.checkpoints = [
    checkpoint(
      "6.1-q",
      "What will change?",
      "The Crate object gains a RotateSlowly component. The mesh stays. Play mode has not run.",
    ),
  ];

  const stages: StageView[] = [
    finishStage({
      id: "unity",
      index: 1,
      name: "Unity",
      bar: "Find an object, read its components, start and stop Play mode, and say that Unity's job is the interactive scene.",
      goodEnough:
        "You can find an object, read its components, start and stop Play mode, and say that Unity's job is the interactive scene. You can also say that a script is a component and that you are not expected to write C# on this page.",
      extra: "none",
      nodes: [
        { type: "pointer", text: POINTER },
        lessonNode(lesson11),
        lessonNode(lesson12),
        {
          type: "gate",
          checkpoint: checkpoint(
            "gate-1",
            "A chair should be modeled, and a player should walk around it. Which tool models the chair, and which tool makes the walking?",
            "Blender models the chair. Unity makes the walking. I need both, in that order, once I can move a file between them.",
          ),
        },
        { type: "fold", summary: "Leave for later", slots: [slot(FILES.unity, "Skip at the start")] },
        { type: "fold", summary: "More from the notes", slots: moreFor(library, "unity") },
      ],
    }),
    finishStage({
      id: "blender",
      index: 2,
      name: "Blender",
      bar: "Tell Object mode from Edit mode, say a render is a picture and the .blend file is the source, and point at a primitive you moved or edited.",
      goodEnough:
        "You can tell Object mode from Edit mode, say a render is a picture and the .blend file is the source, and point at a primitive you moved or edited.",
      extra: "none",
      nodes: [
        lessonNode(lesson21),
        lessonNode(lesson22),
        {
          type: "gate",
          checkpoint: checkpoint(
            "gate-2",
            "Can Blender be the place where a player walks around the crate?",
            "Walking around the crate is Unity's job. Blender's job is the crate and pictures of the crate.",
          ),
        },
        { type: "fold", summary: "Leave for later", slots: [slot(FILES.blender, "Skip at the start")] },
        { type: "fold", summary: "More from the notes", slots: moreFor(library, "blender") },
      ],
    }),
    finishStage({
      id: "together",
      index: 3,
      name: "Unity and Blender together",
      bar: "Name Blender, Unity, or both, name the usual order, and write one sentence a model could follow.",
      goodEnough:
        "Given a job, you name Blender, Unity, or both. You name the usual order: make, export, import, check, then interact. You can write one sentence a model could follow. You have seen one seam: up-axis, scale, or a material that did not survive the trip.",
      extra: "none",
      nodes: [
        lessonNode(lesson31),
        lessonNode(lesson32),
        { type: "fold", summary: "More from the notes", slots: moreFor(library, "together") },
      ],
    }),
    finishStage({
      id: "generators",
      index: 4,
      name: "World models, Dreamina, and Higgsfield",
      bar: "Name the file you hold, say what Dreamina and Higgsfield return, and place each result.",
      goodEnough:
        "You can name the file a world model actually gave you: video, splat, mesh, or a session that disappears. Dreamina returns pictures and video, not a mesh. Higgsfield video is reference, and a GLB or a Blender add-on insert is the only scene data. You can place each result on reference, a file you can open in Blender or Unity after the checks, or send back.",
      extra: "none",
      nodes: [
        { type: "perishable" },
        lessonNode(lesson41),
        lessonNode(lesson42),
        lessonNode(lesson43),
        lessonNode(lesson44),
        { type: "fold", summary: "More from the notes", slots: moreFor(library, "generators") },
      ],
    }),
    finishStage({
      id: "grok",
      index: 5,
      name: "Creating and adding with Grok",
      bar: "Write one Imagine creation and one addition, then make one 2k still and one 15-second image-to-video at the documented ceilings.",
      goodEnough:
        "You can write one Grok Imagine creation and one addition, then practice a 2k quality-medium still and a 15-second image-to-video on grok-imagine-video-1.5. You save the files, and you check resolution, duration, audio, identity, and the watermark.",
      extra: "none",
      nodes: [
        { type: "perishable" },
        lessonNode(lesson51),
        lessonNode(lesson52),
        lessonNode(lesson53),
        lessonNode(lesson54),
        { type: "fold", summary: "More from the notes", slots: moreFor(library, "grok") },
      ],
    }),
    finishStage({
      id: "supervise",
      index: 6,
      name: "Supervising tool calls",
      bar: "Read a proposed action, choose Allow, Ask me first, or Refuse, and save a standing brief.",
      goodEnough:
        "You can read a proposed action, say what will change, and choose Allow, Ask me first, or Refuse. You can save a standing brief, and you can match a plain action to a compact tool call.",
      extra: "supervise",
      nodes: [
        lessonNode(lesson61),
        { type: "keep" },
        { type: "judge-table" },
        { type: "heading", kicker: "Lesson 6.2", title: "The standing brief and the simulator" },
        { type: "catch" },
        { type: "brief" },
        { type: "simulator" },
        { type: "agent", slots: AGENT_HEADINGS.map((item) => slot(item.file, item.heading)) },
        { type: "perishable" },
        { type: "capstone" },
      ],
    }),
  ];

  const standing = briefFields(STANDING_BRIEF);

  return {
    welcome: [WELCOME[0], WELCOME[1]],
    grokLine: GROK_LINE,
    pendingCopy: PENDING,
    chrome: CHROME,
    perishable: PERISHABLE,
    handoffNotAddition: HANDOFF_NOT_ADDITION,
    capstone: CAPSTONE,
    pair: PAIR,
    pageDoesNotCall: PAGE_DOES_NOT_CALL,
    pasteRule: "Before this stage is complete, handoff cards are for you to paste. They are not unattended calls.",
    stages,
    tools: TOOLS,
    creationTabs: [
      creationSeed("creation-imagine", "Creation", "Creation: crate.", 510, CREATION, "imagine", true),
      creationSeed("creation-blender", "Handoff: Blender", "Handoff: Blender crate", 511, CREATION_BLENDER, "blender", false),
    ],
    additionTabs: [
      additionSeed("addition-imagine", "Addition", "Addition: crate.", 520, ADDITION, "imagine", true),
      additionSeed("addition-blender", `${HANDOFF_NOT_ADDITION} Blender`, "Handoff: Blender lid", 521, HANDOFF_BLENDER, "blender", false),
      additionSeed("addition-unity", `${HANDOFF_NOT_ADDITION} Unity`, "Handoff: Unity crate", 522, HANDOFF_UNITY, "unity", false),
    ],
    calls: [
      {
        id: "read",
        title: "Read",
        text: "Read the Unity Hierarchy and list the objects. Change nothing.",
        decision: "Allow",
        reason: "Reading leaves the scene as it is.",
        risky: false,
      },
      {
        id: "import",
        title: "Import with a stop",
        text: "Export the crate from Blender and import it into the named Unity scene. Stop if it is sideways or the wrong size.",
        decision: "Allow",
        reason: "The pipeline and the stop match the standing brief.",
        risky: false,
      },
      {
        id: "still-named",
        title: "One still, tool named",
        text: "Generate one mood still in Grok Imagine, which the standing brief names, using the prompt from the creation message.",
        decision: "Allow",
        reason: "The standing brief names Grok Imagine.",
        risky: false,
      },
      {
        id: "still-unnamed",
        title: "One still, tool not named",
        text: "Generate one still in a generator the standing brief does not name.",
        decision: "Ask me first",
        reason: "The job moved to a tool the brief does not allow.",
        risky: false,
      },
      {
        id: "delete",
        title: "Delete the source",
        text: "Delete the Blender file now that Unity has a copy.",
        decision: "Refuse",
        reason: "The Blender file is the source. Unity holds a copy.",
        risky: false,
      },
      {
        id: "spend",
        title: "Spend",
        text: "The site says this model is unlimited. Generate 40 versions through the agent's connection.",
        decision: "Ask me first",
        reason: "A website unlimited plan is not a promise about agent calls. Higgsfield's notes say MCP spends credits. A batch waits for a fresh yes.",
        risky: true,
      },
      {
        id: "publish",
        title: "Publish",
        text: "Publish the Unity build to the web.",
        decision: "Ask me first",
        reason: "Publishing leaves the machine and needs a fresh yes.",
        risky: true,
      },
    ],
    optionalCalls: [
      {
        id: "play-watch",
        title: "Play, then stop",
        text: "Enter Play mode, watch the crate, exit Play mode, and report what moved. Save nothing from Play mode.",
        decision: "Allow",
        reason: "It enters Play only to look, then exits, and it saves nothing from Play mode.",
        risky: false,
      },
      {
        id: "logo",
        title: "Unrequested mark",
        text: "The still has a logo you did not request. Use it as the hero image.",
        decision: "Refuse",
        reason: "The notice failed, and a mark you did not request is a rights question for the notes, not a reason to ship.",
        risky: false,
      },
    ],
    catchList: [
      "Play mode edits are gone after Stop. A red Console line means the change failed. Prefab asset, scene instance, and runtime spawn are three different things.",
      "Blender has no built-in LLM connection. I can tell Object Mode from Edit Mode, and an object from its mesh. I save a copy before an agent runs. I look at applied scale.",
      "An import gets checked against a 1 meter cube and against which way is up. FBX is Unity's production path. A `.blend` dropped in Assets is not that habit. The Blender file stays.",
      "A generated image or clip has no units, no pivot, and no collider.",
      "I can name a world-model result as video, splat, mesh, or a session with no file.",
      "Dreamina does not return a mesh. Higgsfield video is reference. A GLB or a Blender insert still needs the mesh checks.",
      "Grok Imagine does not emit a mesh or a Unity scene. Driving the Unity Editor later is a different job from making a picture.",
      "An agent call that spends, deletes, or writes a scene waits for my yes.",
    ].map((text, index) => ({ id: `catch-${index + 1}`, text })),
    briefFields: [
      { id: "goal", label: "Goal", initial: standing.goal },
      { id: "allowed", label: "Allowed tools", initial: standing.allowed },
      { id: "pipeline", label: "Pipeline", initial: standing.pipeline },
      { id: "done", label: "Done when", initial: standing.done },
      { id: "notice", label: "Notice", initial: standing.notice },
      { id: "stop", label: "Stop if", initial: standing.stop },
      { id: "fresh", label: "Fresh yes required for", initial: standing.fresh },
    ],
    keep: [
      "The goal.",
      "Which tool owns which job.",
      "The pipeline order for this project.",
      "Done-when and the notice list.",
      "The accept or send-back decision.",
      "Stopping a run.",
      "A fresh yes for spending credits or money, deleting, overwriting source files, publishing, sending messages, and changing accounts.",
    ],
    mayLead: "Grok may, once this stage's standing brief is saved, and only inside that brief:",
    may: [
      "Read scenes, files, and the research notes.",
      "Draft prompts, scripts, and export settings.",
      "Call tools the brief allows.",
      "Import, place, and add components along the checklist in the brief.",
      "Report what changed and which notice items to look at.",
    ],
    waitsLead: "Grok waits for a fresh yes when:",
    waits: [
      "The action spends credits or money. A website plan that says unlimited is not a promise about agent calls. Higgsfield's notes say MCP deducts credits. The tool being allowed does not skip this yes.",
      "The action deletes, overwrites a source, publishes, sends, or changes an account.",
      "The action gives the job to a tool the brief does not name.",
      "The result fails a notice item.",
      "The research notes do not document the capability.",
    ],
    judgeRows: [
      {
        after: "Unity",
        judge: "Objects, components, Play mode, discarded Play edits",
        ask: "Explain; later, add a named component and wait for a Play test",
      },
      {
        after: "Blender",
        judge: "Object mode vs Edit mode, source file vs render",
        ask: "Explain; later, create or add mesh, material, light, or camera steps",
      },
      {
        after: "Together",
        judge: "Routing and import seams",
        ask: "Follow a pipeline sentence and stop on a failed seam",
      },
      {
        after: "World models",
        judge: "Preview vs a rule that must hold",
        ask: "Describe a preview and list what would become Unity rules",
      },
      {
        after: "Dreamina and Higgsfield",
        judge: "Pixels versus a mesh or GLB; subject, extras, identity; approve Generate",
        ask: "Draft a prompt inside a Grok message. Dreamina has no first-party MCP in the notes. Higgsfield MCP spends credits",
      },
      {
        after: "Grok stage",
        judge: "The creation and addition shapes",
        ask: "Be the first stop for every creation and addition",
      },
      {
        after: "This stage",
        judge: "Allow, ask, refuse, and the standing brief",
        ask: "Call allowed tools through MCP inside the brief",
      },
    ],
  };
}

export function loadCourse(dir = path.join(process.cwd(), "content/research")): Course {
  return assembleCourse(dir);
}

export function lessonById(course: Course, id: string): LessonView | undefined {
  for (const stage of course.stages) {
    for (const node of stage.nodes) {
      if (node.type === "lesson" && node.lesson.id === id) return node.lesson;
    }
  }
  return undefined;
}
