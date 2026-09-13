import fs from "node:fs";
import path from "node:path";
import events from "@/data/replay-events.json";

/**
 * [delayMs, text] pairs recovered from script(1) timing data captured while
 * the kernel booted on galileo165. The delays are what the hardware actually
 * produced, not an animation curve.
 */
export type ReplayEvent = [number, string];

export const replayEvents = events as ReplayEvent[];

export const transcript: string = fs.readFileSync(
  path.join(process.cwd(), "data", "transcript.txt"),
  "utf8",
);

export const replayDurationMs = replayEvents.reduce((sum, [d]) => sum + d, 0);
