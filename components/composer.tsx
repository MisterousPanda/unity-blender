"use client";

import { useState } from "react";
import { buildAddition, buildCreation, type AdditionFields, type CreationFields } from "@/lib/message";
import type { ComposerSeed } from "@/lib/types";
import { useLearn } from "./learn-context";
import { CopyButton } from "./widgets";

const CREATION_FIELDS = [
  ["goal", "Goal"],
  ["constraints", "Constraints"],
  ["done", "Done when"],
  ["notice", "Notice"],
  ["stop", "Stop if"],
] as const;

const ADDITION_FIELDS = [
  ["goal", "Goal"],
  ["already", "Already exists"],
  ["keep", "Keep unchanged"],
  ["done", "Done when"],
  ["notice", "Notice"],
  ["stop", "Stop if"],
] as const;

function withoutMeta(draft: Record<string, string> | undefined, seed: ComposerSeed): Record<string, string> {
  const next = { ...seed.fields, ...(draft ?? {}) };
  delete next.__tool;
  return next;
}

export function Composer({ form }: { form: "creation" | "addition" }) {
  const { course, progress, setDraft, saveNote } = useLearn();
  const seeds = form === "creation" ? course.creationTabs : course.additionTabs;
  const [tabId, setTabId] = useState(seeds[0]?.id ?? "");
  const seed = seeds.find((item) => item.id === tabId) ?? seeds[0];
  if (!seed) return null;

  const stored = progress.drafts[seed.id];
  const toolId = stored?.__tool || seed.toolId;
  const tool = course.tools.find((item) => item.id === toolId) ?? course.tools[0];
  const fields = withoutMeta(stored, seed);
  const order = form === "creation" ? CREATION_FIELDS : ADDITION_FIELDS;
  const missing = order.filter(([key]) => !fields[key]?.trim()).map(([, label]) => label);
  const manual = tool.manual;
  const message =
    form === "creation"
      ? buildCreation(
          {
            goal: fields.goal ?? "",
            tool: tool.label,
            constraints: fields.constraints ?? "",
            done: fields.done ?? "",
            notice: fields.notice ?? "",
            stop: fields.stop ?? "",
          } satisfies CreationFields,
          manual,
        )
      : buildAddition(
          {
            goal: fields.goal ?? "",
            tool: tool.label,
            constraints: "",
            already: fields.already ?? "",
            keep: fields.keep ?? "",
            done: fields.done ?? "",
            notice: fields.notice ?? "",
            stop: fields.stop ?? "",
          } satisfies AdditionFields,
          manual,
        );

  function write(nextFields: Record<string, string>, nextTool = toolId) {
    setDraft(seed.id, { ...nextFields, __tool: nextTool });
  }

  const handoff = toolId === "blender" || toolId === "unity";
  const rest = order.filter(([key]) => key !== "goal");

  return (
    <div className="composer">
      <div className="tabs" role="tablist" aria-label={form === "creation" ? "Creation" : "Addition"}>
        {seeds.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === seed.id}
            className={item.id === seed.id ? "tab is-on" : "tab"}
            onClick={() => setTabId(item.id)}
          >
            {item.tab}
          </button>
        ))}
      </div>
      {handoff ? <p className="handoff-flag">{course.handoffNotAddition}</p> : null}
      <label className="field">
        <span>Goal</span>
        <textarea rows={2} value={fields.goal ?? ""} onChange={(event) => write({ ...fields, goal: event.target.value })} />
      </label>
      <label className="field">
        <span>Tool</span>
        <select value={toolId} onChange={(event) => write(fields, event.target.value)}>
          {course.tools.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {rest.map(([key, label]) => (
        <label key={key} className="field">
          <span>{label}</span>
          <textarea rows={3} value={fields[key] ?? ""} onChange={(event) => write({ ...fields, [key]: event.target.value })} />
        </label>
      ))}
      <div className="locked-line">
        <p className="eyebrow">Manual step</p>
        <p>{manual}</p>
      </div>
      <p className="locked-forbidden">Do not spend, delete, overwrite source files, publish, send messages, or change accounts.</p>
      <div className="prompt">
        <div>
          <p className="eyebrow">{course.chrome.send}</p>
          {message ? <pre>{message}</pre> : <p className="missing">Fill {missing.join(", ")}.</p>}
        </div>
        <CopyButton text={message ?? ""} disabled={!message} />
      </div>
      <div className="button-row">
        <button
          type="button"
          className="button"
          disabled={!message}
          onClick={() => {
            if (!message) return;
            saveNote({
              id: seed.noteId,
              sort: seed.noteSort,
              title: seed.noteTitle,
              body: message,
              tool: tool.label,
            });
          }}
        >
          Save to my notes
        </button>
      </div>
      <p className="card-title">Card title: {seed.noteTitle}</p>
      <p className="quiet">{course.pageDoesNotCall}</p>
    </div>
  );
}
