import type { Course, LessonView, Progress, StageId, StageView } from "./types";
import { STAGE_ORDER } from "./types";

export function blankProgress(): Progress {
  return {
    openStage: "unity",
    checks: {},
    answers: {},
    submitted: {},
    confirmed: {},
    simulator: {},
    risky: {},
    notes: [],
    drafts: {},
    briefSaved: false,
  };
}

export function lessonComplete(lesson: LessonView, progress: Progress): boolean {
  if (lesson.repId && !progress.checks[lesson.repId]) return false;
  if (lesson.notices.some((notice) => !progress.checks[notice.id])) return false;
  if (lesson.checkpoints.some((checkpoint) => !progress.confirmed[checkpoint.id])) return false;
  if (lesson.practiceChecks?.some((item) => item.required && !progress.checks[item.id])) return false;
  if (lesson.requiresNoteId && !imagineNote(progress, lesson.requiresNoteId)) return false;
  return true;
}

export function imagineNote(progress: Progress, noteId: string): boolean {
  return progress.notes.some((note) => note.id === noteId && note.tool === "Grok Imagine");
}

export function stageComplete(stage: StageView, progress: Progress, course: Course): boolean {
  if (stage.repIds.some((id) => !progress.checks[id])) return false;
  if (stage.noticeIds.some((id) => !progress.checks[id])) return false;
  if (stage.checkpointIds.some((id) => !progress.confirmed[id])) return false;
  if (stage.practiceIds.some((id) => !progress.checks[id])) return false;
  if (stage.noteIds.some((id) => !imagineNote(progress, id))) return false;
  if (stage.extra === "supervise") {
    if (course.catchList.some((item) => !progress.checks[item.id])) return false;
    if (course.calls.some((call) => !progress.simulator[call.id])) return false;
    if (!progress.briefSaved) return false;
  }
  return true;
}

export function isUnlocked(stageId: StageId, progress: Progress, course: Course): boolean {
  const index = course.stages.findIndex((stage) => stage.id === stageId);
  if (index <= 0) return true;
  return stageComplete(course.stages[index - 1], progress, course);
}

export function stageStatus(
  stageId: StageId,
  progress: Progress,
  course: Course,
): "not started" | "current" | "complete" {
  const stage = course.stages.find((item) => item.id === stageId);
  if (!stage) return "not started";
  if (stageComplete(stage, progress, course)) return "complete";
  if (!isUnlocked(stageId, progress, course)) return "not started";
  const frontier = course.stages.find(
    (item) => isUnlocked(item.id, progress, course) && !stageComplete(item, progress, course),
  );
  return frontier?.id === stageId ? "current" : "not started";
}

export function frontierStage(progress: Progress, course: Course): StageId {
  const next = STAGE_ORDER.find(
    (id) => isUnlocked(id, progress, course) && stageStatus(id, progress, course) !== "complete",
  );
  return next ?? "supervise";
}
