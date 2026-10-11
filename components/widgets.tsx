"use client";

import { useState, type ReactNode } from "react";
import type { CheckpointView, SavedNote, Slot } from "@/lib/types";
import { useLearn } from "./learn-context";

export async function writeClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
}

export function CopyButton({
  text,
  disabled = false,
  label,
  testId = "copy",
}: {
  text: string;
  disabled?: boolean;
  label?: string;
  testId?: string;
}) {
  const { course } = useLearn();
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="button copy-button"
      data-testid={testId}
      disabled={disabled}
      aria-live="polite"
      onClick={async () => {
        if (disabled) return;
        await writeClipboard(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? course.chrome.copied : (label ?? course.chrome.copy)}
    </button>
  );
}

export function Pending() {
  const { course } = useLearn();
  return <p className="pending">{course.pendingCopy}</p>;
}

export function NotesHtml({ html }: { html: string }) {
  return <div className="notes" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function SlotView({ slot }: { slot: Slot }) {
  if (slot.status === "pending") return <Pending />;
  return <NoteCard note={slot.note} />;
}

export function NoteCard({ note }: { note: Extract<Slot, { status: "ready" }>["note"] }) {
  return (
    <section className="note-card">
      <h5>{note.heading}</h5>
      <p className="meta">
        {note.file}
        {note.date ? ` · ${note.date}` : ""}
      </p>
      <NotesHtml html={note.html} />
    </section>
  );
}

export function CheckRow({ id, label, text }: { id: string; label: string; text?: string }) {
  const { progress, toggle } = useLearn();
  return (
    <label className="check">
      <input type="checkbox" checked={Boolean(progress.checks[id])} onChange={() => toggle(id)} />
      <span>
        <span className="check-label">{label}</span>
        {text ? <span className="check-text">{text}</span> : null}
      </span>
    </label>
  );
}

export function Fold({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="fold">
      <summary>{summary}</summary>
      <div className="fold-body">{children}</div>
    </details>
  );
}

export function PromptBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="prompt">
      <div>
        <p className="eyebrow">{label}</p>
        <pre>{text}</pre>
      </div>
      <CopyButton text={text} />
    </div>
  );
}

function answerKey(checkpointId: string, fieldId: string): string {
  return `${checkpointId}:${fieldId}`;
}

export function Checkpoint({ item, confirmable = true }: { item: CheckpointView; confirmable?: boolean }) {
  const { course, progress, setAnswer, submit, confirm } = useLearn();
  const fields = item.fields ?? [];
  const keys = fields.length > 0 ? fields.map((field) => answerKey(item.id, field.id)) : [answerKey(item.id, "answer")];
  const ready = keys.every((key) => progress.answers[key]?.trim());
  const shown = Boolean(progress.submitted[item.id]);

  return (
    <form
      className="checkpoint"
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) submit(item.id, keys);
      }}
    >
      <p className="question">{item.question}</p>
      {fields.length > 0 ? (
        fields.map((field) => (
          <label key={field.id} className="field">
            <span>{field.label}</span>
            <input
              value={progress.answers[answerKey(item.id, field.id)] ?? ""}
              onChange={(event) => setAnswer(answerKey(item.id, field.id), event.target.value)}
            />
          </label>
        ))
      ) : (
        <label className="field">
          <span>Your answer</span>
          <textarea
            rows={3}
            value={progress.answers[answerKey(item.id, "answer")] ?? ""}
            onChange={(event) => setAnswer(answerKey(item.id, "answer"), event.target.value)}
          />
        </label>
      )}
      {!shown ? (
        <button type="submit" className="button" disabled={!ready}>
          Show the model answer
        </button>
      ) : (
        <div className="model" data-testid="model-answer">
          <p className="eyebrow">Model answer</p>
          <pre>{item.modelAnswer}</pre>
        </div>
      )}
      {confirmable ? (
        <label className="check confirm">
          <input
            type="checkbox"
            data-testid="checkpoint-confirm"
            disabled={!shown}
            checked={Boolean(progress.confirmed[item.id])}
            onChange={(event) => confirm(item.id, event.target.checked)}
          />
          <span>
            <span className="check-label">{course.chrome.confirm}</span>
          </span>
        </label>
      ) : null}
    </form>
  );
}

export function HandoffCard({
  card,
}: {
  card: { id: string; title: string; body: string; sort: number };
}) {
  const { progress, saveNote } = useLearn();
  const saved = progress.notes.some((note) => note.id === card.id);
  const payload = `${card.title}\n\n${card.body}`;
  return (
    <article className="handoff">
      <h5>{card.title}</h5>
      <pre>{card.body}</pre>
      <div className="button-row">
        <CopyButton text={payload} />
        <button
          type="button"
          className="button"
          onClick={() =>
            saveNote({
              id: card.id,
              sort: card.sort,
              title: card.title,
              body: card.body,
              tool: "Handoff",
            } satisfies SavedNote)
          }
        >
          Save to my notes
        </button>
      </div>
      {saved ? <p className="saved-flag">In My notes</p> : null}
    </article>
  );
}
