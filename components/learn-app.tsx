"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { blankProgress, frontierStage, isUnlocked, stageStatus } from "@/lib/gates";
import type { Choice, Course, Progress, SavedNote, StageId } from "@/lib/types";
import { STAGE_ORDER } from "@/lib/types";
import { LearnProvider, type LearnApi } from "./learn-context";
import { StageBody } from "./stage-body";
import { CopyButton } from "./widgets";

const STORAGE_KEY = "direct-the-tools-progress-v1";

function sanitize(value: unknown): Progress {
  const blank = blankProgress();
  if (!value || typeof value !== "object") return blank;
  const record = value as Partial<Progress>;
  const openStage = STAGE_ORDER.includes(record.openStage as StageId) ? (record.openStage as StageId) : "unity";
  return {
    ...blank,
    openStage,
    checks: record.checks ?? {},
    answers: record.answers ?? {},
    submitted: record.submitted ?? {},
    confirmed: record.confirmed ?? {},
    simulator: record.simulator ?? {},
    risky: record.risky ?? {},
    notes: Array.isArray(record.notes) ? record.notes : [],
    drafts: record.drafts && typeof record.drafts === "object" ? record.drafts : {},
    briefSaved: Boolean(record.briefSaved),
  };
}

function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch {
    return null;
  }
}

function formatNotes(notes: SavedNote[]): string {
  return [...notes]
    .sort((a, b) => a.sort - b.sort)
    .map((note) => `${note.title}\n\n${note.body}`)
    .join("\n\n");
}

export function LearnApp({ course }: { course: Course }) {
  const [progress, setProgress] = useState<Progress>(blankProgress);
  const [ready, setReady] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const booted = useRef(false);

  useEffect(() => {
    const stored = loadProgress();
    if (stored) setProgress(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;
    if (isUnlocked(progress.openStage, progress, course)) return;
    const next = frontierStage(progress, course);
    setProgress((current) => (current.openStage === next ? current : { ...current, openStage: next }));
  }, [course, progress, ready]);

  useEffect(() => {
    if (!ready) return;
    if (!booted.current) {
      booted.current = true;
      return;
    }
    document.getElementById("stage-top")?.scrollIntoView({ block: "start" });
  }, [progress.openStage, ready]);

  useEffect(() => {
    if (!notesOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notesOpen]);

  const api = useMemo<LearnApi>(
    () => ({
      course,
      progress,
      toggle(id) {
        setProgress((current) => ({ ...current, checks: { ...current.checks, [id]: !current.checks[id] } }));
      },
      setAnswer(key, value) {
        setProgress((current) => ({ ...current, answers: { ...current.answers, [key]: value } }));
      },
      submit(id, keys) {
        setProgress((current) => {
          if (keys.some((key) => !current.answers[key]?.trim())) return current;
          return { ...current, submitted: { ...current.submitted, [id]: true } };
        });
      },
      confirm(id, value) {
        setProgress((current) => ({ ...current, confirmed: { ...current.confirmed, [id]: value } }));
      },
      saveNote(note) {
        setProgress((current) => ({
          ...current,
          notes: [...current.notes.filter((item) => item.id !== note.id), note],
        }));
      },
      setDraft(id, draft) {
        setProgress((current) => ({ ...current, drafts: { ...current.drafts, [id]: draft } }));
      },
      setChoice(id, choice: Choice) {
        setProgress((current) => ({ ...current, simulator: { ...current.simulator, [id]: choice } }));
      },
      setRisky(id, value) {
        setProgress((current) => ({ ...current, risky: { ...current.risky, [id]: value } }));
      },
      saveBrief(body) {
        setProgress((current) => ({
          ...current,
          briefSaved: true,
          notes: [
            ...current.notes.filter((item) => item.id !== "standing-brief"),
            { id: "standing-brief", sort: 610, title: "Standing brief", body, tool: "Standing brief" },
          ],
        }));
      },
    }),
    [course, progress],
  );

  const open = course.stages.find((stage) => stage.id === progress.openStage) ?? course.stages[0];
  const current = course.stages.find((stage) => stageStatus(stage.id, progress, course) === "current");
  const grokUnlocked = isUnlocked("grok", progress, course);
  const notes = [...progress.notes].sort((a, b) => a.sort - b.sort);

  function reset() {
    setProgress(blankProgress());
    setResetArmed(false);
    setNotesOpen(false);
  }

  return (
    <LearnProvider value={api}>
      <div className="shell">
        <header className="top">
          <div>
            <p className="kicker">Six stages</p>
            <h1>Direct the tools</h1>
          </div>
          <button type="button" className="button" data-testid="notes-button" onClick={() => setNotesOpen(true)}>
            {course.chrome.notes}
            {notes.length > 0 ? <span className="count">{notes.length}</span> : null}
          </button>
        </header>

        <section className="welcome" data-testid="welcome">
          {course.welcome.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </section>

        <nav className="rail" aria-label="Journey">
          <ol>
            {course.stages.map((stage) => {
              const status = stageStatus(stage.id, progress, course);
              const unlocked = isUnlocked(stage.id, progress, course);
              const selected = stage.id === open.id;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    className={selected ? "stage-button is-open" : "stage-button"}
                    data-testid={`stage-${stage.id}`}
                    disabled={!unlocked}
                    aria-current={selected ? "page" : undefined}
                    onClick={() => {
                      if (!unlocked) return;
                      setProgress((currentProgress) => ({ ...currentProgress, openStage: stage.id }));
                    }}
                  >
                    <span className="stage-index">{stage.index}</span>
                    <span>
                      <span className="stage-name">{stage.name}</span>
                      <span className="stage-state">{status}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {current ? <p className="bar-line">{current.bar}</p> : null}
          {grokUnlocked ? null : (
            <p className="grok-line" data-testid="grok-line">
              {course.grokLine}
            </p>
          )}
          <div className="reset-box">
            {resetArmed ? <p>Click again to clear progress and notes on this browser.</p> : null}
            <button type="button" className="text-button" onClick={() => (resetArmed ? reset() : setResetArmed(true))}>
              {course.chrome.reset}
            </button>
            {resetArmed ? (
              <button type="button" className="text-button" onClick={() => setResetArmed(false)}>
                Cancel
              </button>
            ) : null}
          </div>
        </nav>

        <main className="main" data-testid="stage-open">
          <StageBody stage={open} />
        </main>
      </div>

      {notesOpen ? (
        <div className="drawer-root">
          <button type="button" className="backdrop" aria-label="Close notes" onClick={() => setNotesOpen(false)} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="notes-title" data-testid="notes-drawer">
            <header className="drawer-head">
              <h2 id="notes-title">{course.chrome.notes}</h2>
              <button ref={closeRef} type="button" className="button" onClick={() => setNotesOpen(false)}>
                Close
              </button>
            </header>
            {notes.length === 0 ? <p>Saved cards show up here in journey order.</p> : null}
            <ol className="note-list">
              {notes.map((note) => (
                <li key={note.id}>
                  <article>
                    <h3>{note.title}</h3>
                    <pre>{note.body}</pre>
                    <CopyButton text={`${note.title}\n\n${note.body}`} />
                  </article>
                </li>
              ))}
            </ol>
            <CopyButton text={formatNotes(notes)} disabled={notes.length === 0} label={course.chrome.copyNotes} testId="copy-all" />
          </aside>
        </div>
      ) : null}
    </LearnProvider>
  );
}
