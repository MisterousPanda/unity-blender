export type BriefSection = {
  level: number;
  heading: string;
  body: string;
};

export type ParsedBrief = {
  preamble: string;
  title: string;
  date: string | null;
  sections: BriefSection[];
};

export function stripFrontmatter(raw: string): string {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) return text;
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return text;
  return text.slice(end + 5);
}

export function findDate(text: string): string | null {
  const match = text.match(/20\d{2}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

export function parseBrief(raw: string): ParsedBrief {
  const text = stripFrontmatter(raw).trim();
  const matches = [...text.matchAll(/^(#{2,3})[ \t]+(.+?)[ \t]*$/gm)];
  const first = matches[0];
  const preamble = (first ? text.slice(0, first.index ?? 0) : text).trim();
  const titleMatch = preamble.match(/^#\s+(.+)$/m);
  const sections: BriefSection[] = matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const level = match[1].length;
    let end = text.length;
    for (let cursor = index + 1; cursor < matches.length; cursor += 1) {
      const nextLevel = matches[cursor][1].length;
      if (nextLevel <= level) {
        end = matches[cursor].index ?? text.length;
        break;
      }
    }
    return {
      level,
      heading: match[2].trim(),
      body: text.slice(start, end).trim(),
    };
  });

  return {
    preamble,
    title: titleMatch?.[1]?.trim() ?? "",
    date: findDate(preamble) ?? findDate(text),
    sections,
  };
}

export function sectionByHeading(brief: ParsedBrief, heading: string): BriefSection | undefined {
  return brief.sections.find((section) => section.heading === heading);
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function topLevelItems(body: string): { intro: string; items: string[] } {
  const items: string[] = [];
  const intro: string[] = [];
  let current = "";
  let seen = false;

  const flush = () => {
    if (current.trim()) items.push(plainText(current));
    current = "";
  };

  for (const line of body.split("\n")) {
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^(\d+)\.\s+(.*)$/.exec(line);
    const item = bullet ?? numbered;
    if (item && !/^\s/.test(line)) {
      seen = true;
      flush();
      current = item[item.length - 1] ?? "";
      continue;
    }
    if (seen && current && /^\s+\S/.test(line)) {
      current += ` ${line.trim()}`;
      continue;
    }
    if (!seen) intro.push(line);
    else if (line.trim() === "") flush();
  }
  flush();
  return { intro: intro.join("\n").trim(), items };
}

export function numberedItems(body: string): { n: number; text: string }[] {
  const items: { n: number; text: string }[] = [];
  let current: { n: number; text: string } | null = null;
  const flush = () => {
    if (!current) return;
    items.push({ n: current.n, text: plainText(current.text) });
    current = null;
  };
  for (const line of body.split("\n")) {
    const match = /^(\d+)\.\s+(.*)$/.exec(line);
    if (match && !/^\s/.test(line)) {
      flush();
      current = { n: Number(match[1]), text: match[2] };
      continue;
    }
    if (current && /^\s+\S/.test(line)) current.text += ` ${line.trim()}`;
  }
  flush();
  return items;
}

export function markdownTable(body: string): string[][] {
  const rows: string[][] = [];
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length === 0) continue;
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")))) continue;
    rows.push(cells.map((cell) => plainText(cell)));
  }
  return rows;
}
