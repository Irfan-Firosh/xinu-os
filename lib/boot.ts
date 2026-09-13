import fs from "node:fs";
import path from "node:path";

export type Tone = "accent" | "dim" | "body";
export type BootLine = { text: string; tone: Tone };

/**
 * The captured serial output, prepared for display. Two lines are dropped
 * (the board's MAC address and the identity line) and the banner's account
 * username is replaced with the author's name. data/transcript.txt itself is
 * the untouched capture.
 */
export function getBootLines(): BootLine[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "transcript.txt"),
    "utf8",
  );

  return raw
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => !/MAC address/.test(line))
    .filter((line) => !/^Irfan Firosh, /.test(line))
    .map((line) => line.replace("(ifirosh)", "(Irfan Firosh)"))
    .map((line) => ({ text: line.trimEnd(), tone: toneFor(line) }))
    .filter((line, i, all) => !(line.text === "" && all[i - 1]?.text === ""));
}

function toneFor(line: string): Tone {
  if (/^=== .* ===$/.test(line.trim())) return "accent";
  if (/^Xinu for galileo/.test(line)) return "accent";
  if (/no deadlock is detected/.test(line)) return "dim";
  if (/^\s+\[0x[0-9A-F]+ to 0x[0-9A-F]+\]/.test(line)) return "dim";
  return "body";
}
