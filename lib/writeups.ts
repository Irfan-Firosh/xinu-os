import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "content", "writeups");

export type Writeup = {
  slug: string;
  /** Ordinal from the filename prefix, e.g. "01" -> 1. */
  order: number;
  title: string;
  /** First paragraph of the "The problem" section, used as a summary. */
  blurb: string;
  markdown: string;
};

/** "01-process-management.md" -> { order: 1, slug: "process-management" } */
function parseName(filename: string): { order: number; slug: string } {
  const match = /^(\d+)-(.+)\.md$/.exec(filename);
  if (!match) {
    throw new Error(`Writeup filename must be NN-slug.md, got: ${filename}`);
  }
  return { order: Number(match[1]), slug: match[2] };
}

function firstHeading(markdown: string, fallback: string): string {
  const line = markdown.split("\n").find((l) => l.startsWith("# "));
  return line ? line.slice(2).trim() : fallback;
}

/** The lead paragraph under "## The problem", flattened to one line. */
function leadParagraph(markdown: string): string {
  const lines = markdown.split("\n");
  const start = lines.findIndex((l) => /^## (The problem|Attribution)/.test(l));
  if (start === -1) return "";
  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("#")) break;
    if (line.trim() === "") {
      if (body.length > 0) break;
      continue;
    }
    body.push(line.trim());
  }
  return body
    .join(" ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}

export function getWriteups(): Writeup[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const { order, slug } = parseName(filename);
      const markdown = fs.readFileSync(path.join(DIR, filename), "utf8");
      return {
        slug,
        order,
        title: firstHeading(markdown, slug),
        blurb: leadParagraph(markdown),
        markdown,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getWriteup(slug: string): Writeup | undefined {
  return getWriteups().find((w) => w.slug === slug);
}
