export const FORBIDDEN =
  "Do not spend, delete, overwrite source files, publish, send messages, or change accounts.";

export type CreationFields = {
  goal: string;
  tool: string;
  constraints: string;
  done: string;
  notice: string;
  stop: string;
};

export type AdditionFields = CreationFields & {
  already: string;
  keep: string;
};

function line(label: string, value: string): string {
  return `${label}: ${value.trim().replace(/\s*\n+\s*/g, " ")}`;
}

function toolLine(tool: string): string {
  const trimmed = tool.trim().replace(/\.$/, "");
  return `Tool: ${trimmed}.`;
}

export function buildCreation(fields: CreationFields, manualStep: string | null): string | null {
  const goal = fields.goal.trim();
  const tool = fields.tool.trim();
  const constraints = fields.constraints.trim();
  const done = fields.done.trim();
  const notice = fields.notice.trim();
  const stop = fields.stop.trim();
  if (!goal || !tool || !constraints || !done || !notice || !stop) return null;
  const lines = [
    line("Goal", goal),
    toolLine(tool),
    line("Constraints", constraints),
    line("Done when", done),
    line("Notice", notice),
    line("Stop if", stop),
  ];
  if (manualStep?.trim()) lines.push(line("Manual step", manualStep));
  lines.push(FORBIDDEN);
  return lines.join("\n");
}

export function buildAddition(fields: AdditionFields, manualStep: string | null): string | null {
  const already = fields.already.trim();
  const keep = fields.keep.trim();
  if (!already || !keep) return null;
  const goal = fields.goal.trim();
  const tool = fields.tool.trim();
  const done = fields.done.trim();
  const notice = fields.notice.trim();
  const stop = fields.stop.trim();
  if (!goal || !tool || !done || !notice || !stop) return null;
  const lines = [
    line("Goal", goal),
    toolLine(tool),
    line("Already exists", already),
    line("Keep unchanged", keep),
    line("Done when", done),
    line("Notice", notice),
    line("Stop if", stop),
  ];
  if (manualStep?.trim()) lines.push(line("Manual step", manualStep));
  lines.push(FORBIDDEN);
  return lines.join("\n");
}

export type BriefFields = {
  goal: string;
  allowed: string;
  pipeline: string;
  done: string;
  notice: string;
  stop: string;
  fresh: string;
};

export function buildBrief(fields: BriefFields): string | null {
  const values = [
    fields.goal,
    fields.allowed,
    fields.pipeline,
    fields.done,
    fields.notice,
    fields.stop,
    fields.fresh,
  ];
  if (values.some((value) => !value.trim())) return null;
  return [
    line("Goal", fields.goal),
    line("Allowed tools", fields.allowed),
    line("Pipeline", fields.pipeline),
    line("Done when", fields.done),
    line("Notice", fields.notice),
    line("Stop if", fields.stop),
    line("Fresh yes required for", fields.fresh),
  ].join("\n");
}

export function labeledValue(block: string, label: string): string {
  const line = block.split("\n").find((entry) => entry.startsWith(`${label}: `));
  if (!line) throw new Error(`Missing ${label}`);
  return line.slice(label.length + 2);
}

export function creationFields(block: string): CreationFields {
  return {
    goal: labeledValue(block, "Goal"),
    tool: labeledValue(block, "Tool").replace(/\.$/, ""),
    constraints: labeledValue(block, "Constraints"),
    done: labeledValue(block, "Done when"),
    notice: labeledValue(block, "Notice"),
    stop: labeledValue(block, "Stop if"),
  };
}

export function additionFields(block: string): AdditionFields {
  return {
    goal: labeledValue(block, "Goal"),
    tool: labeledValue(block, "Tool").replace(/\.$/, ""),
    constraints: "",
    already: labeledValue(block, "Already exists"),
    keep: labeledValue(block, "Keep unchanged"),
    done: labeledValue(block, "Done when"),
    notice: labeledValue(block, "Notice"),
    stop: labeledValue(block, "Stop if"),
  };
}

export function briefFields(block: string): BriefFields {
  return {
    goal: labeledValue(block, "Goal"),
    allowed: labeledValue(block, "Allowed tools"),
    pipeline: labeledValue(block, "Pipeline"),
    done: labeledValue(block, "Done when"),
    notice: labeledValue(block, "Notice"),
    stop: labeledValue(block, "Stop if"),
    fresh: labeledValue(block, "Fresh yes required for"),
  };
}

export function explainRequest(title: string, idea: string): string {
  return [
    "Explain this to a beginner in four sentences, and give me one thing to look at in the tool.",
    `Card: ${title}`,
    `Idea: ${idea}`,
    "Do not make or change anything in the tool.",
  ].join("\n");
}
