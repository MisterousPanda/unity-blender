export const STAGE_ORDER = [
  "unity",
  "blender",
  "together",
  "generators",
  "grok",
  "supervise",
] as const;

export type StageId = (typeof STAGE_ORDER)[number];

export type NoteHtml = {
  file: string;
  heading: string;
  html: string;
  date: string | null;
};

export type Slot = { status: "ready"; note: NoteHtml } | { status: "pending" };

export type CheckpointView = {
  id: string;
  question: string;
  modelAnswer: string;
  fields?: { id: string; label: string }[];
};

export type PracticeCheck = {
  id: string;
  n: number;
  text: string;
  required: boolean;
};

export type LessonView = {
  id: string;
  kicker: string;
  title: string;
  explain: string;
  explainRequest: string | null;
  explainNotes: Slot[];
  afterNotes: Slot[];
  toolPrompt: string | null;
  promptLabel: "tool" | "send" | "custom" | null;
  promptTitle: string | null;
  practiceFinish: string | null;
  practiceNote: string | null;
  practice: Slot | null;
  aside: { summary: string; slot: Slot } | null;
  notices: { id: string; text: string; source: "page" | "notes" }[];
  noticeLead: string | null;
  noticeHeading: string | null;
  noticeSlot: Slot | null;
  folds: { summary: string; slot: Slot }[];
  checkpoints: CheckpointView[];
  handoff: { id: string; title: string; body: string; sort: number } | null;
  handoffNote: Slot | null;
  composer: "creation" | "addition" | null;
  repId: string | null;
  requiresNoteId: string | null;
  practiceChecks: PracticeCheck[] | null;
  sort: CheckpointView | null;
  rights: boolean;
};

export type StageNode =
  | { type: "lesson"; lesson: LessonView }
  | { type: "pointer"; text: string }
  | { type: "perishable" }
  | { type: "gate"; checkpoint: CheckpointView }
  | { type: "fold"; summary: string; slots: Slot[] }
  | { type: "keep" }
  | { type: "judge-table" }
  | { type: "heading"; kicker: string; title: string }
  | { type: "catch" }
  | { type: "brief" }
  | { type: "simulator" }
  | { type: "agent"; slots: Slot[] }
  | { type: "capstone" };

export type StageView = {
  id: StageId;
  index: number;
  name: string;
  bar: string;
  goodEnough: string;
  nodes: StageNode[];
  repIds: string[];
  noticeIds: string[];
  checkpointIds: string[];
  practiceIds: string[];
  noteIds: string[];
  extra: "none" | "supervise";
};

export type ToolOption = {
  id: string;
  label: string;
  manual: string;
};

export type ComposerSeed = {
  id: string;
  tab: string;
  noteId: string;
  noteTitle: string;
  noteSort: number;
  form: "creation" | "addition";
  toolId: string;
  countsForGate: boolean;
  fields: Record<string, string>;
};

export type SimCall = {
  id: string;
  title: string;
  text: string;
  decision: "Allow" | "Ask me first" | "Refuse";
  reason: string;
  risky: boolean;
};

export type Course = {
  welcome: [string, string];
  grokLine: string;
  pendingCopy: string;
  chrome: {
    copy: string;
    copied: string;
    explain: string;
    tool: string;
    send: string;
    looked: string;
    rep: string;
    confirm: string;
    notes: string;
    copyNotes: string;
    risky: string;
    reset: string;
  };
  perishable: string;
  handoffNotAddition: string;
  capstone: string;
  pair: string;
  pageDoesNotCall: string;
  pasteRule: string;
  stages: StageView[];
  tools: ToolOption[];
  creationTabs: ComposerSeed[];
  additionTabs: ComposerSeed[];
  calls: SimCall[];
  optionalCalls: SimCall[];
  catchList: { id: string; text: string }[];
  briefFields: { id: string; label: string; initial: string }[];
  keep: string[];
  mayLead: string;
  may: string[];
  waitsLead: string;
  waits: string[];
  judgeRows: { after: string; judge: string; ask: string }[];
};

export type SavedNote = {
  id: string;
  sort: number;
  title: string;
  body: string;
  tool: string;
};

export type Choice = "Allow" | "Ask me first" | "Refuse";

export type Progress = {
  openStage: StageId;
  checks: Record<string, boolean>;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  confirmed: Record<string, boolean>;
  simulator: Record<string, Choice>;
  risky: Record<string, boolean>;
  notes: SavedNote[];
  drafts: Record<string, Record<string, string>>;
  briefSaved: boolean;
};
