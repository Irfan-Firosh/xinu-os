"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReplayEvent } from "@/lib/recording";

type Props = {
  events: ReplayEvent[];
  transcript: string;
  durationMs: number;
};

function classifyLine(line: string): string {
  if (/^=== .* ===$/.test(line)) return "text-console-accent";
  if (/no deadlock is detected/.test(line)) return "text-console-dim";
  return "";
}

/**
 * Shows the recorded serial output at rest, and on request retypes it at the
 * pace script(1) recorded while the board was actually running.
 */
export function TerminalReplay({ events, transcript, durationMs }: Props) {
  const [text, setText] = useState(transcript);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (playing && scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [text, playing]);

  function play() {
    if (playing) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(transcript);
      return;
    }

    clearTimers();
    setText("");
    setElapsed(0);
    setPlaying(true);

    let at = 0;
    let buffer = "";
    events.forEach(([delay, chunk]) => {
      at += delay;
      buffer += chunk;
      const snapshot = buffer;
      const stamp = at;
      timers.current.push(
        setTimeout(() => {
          setText(snapshot);
          setElapsed(stamp);
        }, at),
      );
    });

    timers.current.push(
      setTimeout(() => {
        setPlaying(false);
        setElapsed(durationMs);
      }, at + 250),
    );
  }

  const seconds = (elapsed / 1000).toFixed(1);
  const total = (durationMs / 1000).toFixed(1);
  const progress = durationMs === 0 ? 0 : Math.min(100, (elapsed / durationMs) * 100);

  return (
    <div className="overflow-hidden rounded-lg border border-console-line bg-console-bg">
      <div className="flex items-center gap-3 border-b border-console-line px-4 py-2.5">
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-console-dim">
          cs-console galileo165
        </span>
        <span
          className={`ml-auto size-1.5 rounded-full ${playing ? "bg-console-accent" : "bg-console-dim"}`}
          aria-hidden
        />
        <span className="font-mono text-[0.68rem] tabular-nums text-console-dim">
          {playing ? `${seconds}s / ${total}s` : `${total}s captured`}
        </span>
      </div>

      <div
        ref={scroller}
        className="max-h-[26rem] overflow-auto px-4 py-4"
        aria-live="off"
      >
        <pre className="font-mono text-[0.72rem] leading-[1.55] text-console-ink sm:text-[0.78rem]">
          {text.split("\n").map((line, i) => (
            <span key={i} className={`block ${classifyLine(line)}`}>
              {line || " "}
            </span>
          ))}
          {playing && (
            <span className="ml-px inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-console-accent" />
          )}
        </pre>
      </div>

      <div className="flex items-center gap-4 border-t border-console-line px-4 py-3">
        <button
          type="button"
          onClick={play}
          disabled={playing}
          className="rounded border border-console-accent/45 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-console-accent transition-colors hover:bg-console-accent/12 disabled:opacity-45"
        >
          {playing ? "replaying" : "replay in real time"}
        </button>
        <div className="h-px flex-1 bg-console-line">
          <div
            className="h-px bg-console-accent transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
