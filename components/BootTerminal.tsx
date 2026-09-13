"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

/** One full pass of the boot, then a pause, then it starts over. */
const LOOP_MS = 9_000;
const FIRST_LINE_MS = 1_250;
const GAP_MS = 300;

/**
 * Everything the board prints between the console attaching and the demo app
 * taking over. The banner prints the author's account username; the name is
 * shown here instead. The raw capture in data/transcript.txt is untouched.
 */
const LINES: { text: string; tone?: "accent" | "dim" }[] = [
  { text: "Xinu for galileo -- version #2 (Irfan Firosh)", tone: "accent" },
  { text: "Sun Sep 13 02:36:44 AM EDT 2026", tone: "dim" },
  { text: "" },
  { text: "Ethernet Link is Up" },
  { text: " 233393696 bytes of free memory.  Free list:" },
  { text: "           [0x011451E0 to 0x0EFD8FFF]", tone: "dim" },
  { text: "           [0x0FDEF000 to 0x0FDEFFFF]", tone: "dim" },
  { text: "    116557 bytes of Xinu code." },
  { text: "           [0x00100000 to 0x0011C74C]", tone: "dim" },
  { text: "  16817640 bytes of data." },
  { text: "           [0x00120200 to 0x01129FE7]", tone: "dim" },
];

const toneClass = {
  accent: "text-accent-text",
  dim: "text-meta-faint",
  body: "text-muted",
} as const;

export function BootTerminal() {
  const [pass, setPass] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPass((n) => n + 1), LOOP_MS);
    return () => clearInterval(id);
  }, []);

  /* Keep the newest line in view while the pass is still printing. */
  useEffect(() => {
    const pre = box.current?.querySelector("pre");
    if (!pre) return;
    const follow = setInterval(() => {
      pre.scrollTop = pre.scrollHeight;
    }, 120);
    const stop = setTimeout(
      () => clearInterval(follow),
      FIRST_LINE_MS + LINES.length * GAP_MS + 600,
    );
    return () => {
      clearInterval(follow);
      clearTimeout(stop);
    };
  }, [pass]);

  return (
    <div ref={box}>
      <Terminal
        key={pass}
        sequence={false}
        startOnView={false}
        className="h-[580px] max-h-none w-full max-w-none rounded-xl border-line bg-subtle [&>pre]:h-[calc(100%-3.75rem)] [&>pre]:overflow-y-auto [&>pre]:px-6 [&>pre]:py-5"
      >
        <TypingAnimation
          delay={250}
          duration={45}
          startOnView={false}
          className="font-mono text-[1.05rem] leading-[2] text-ink"
        >
          {"$ cs-console galileo165"}
        </TypingAnimation>

        {LINES.map((line, i) => (
          <AnimatedSpan
            key={i}
            delay={FIRST_LINE_MS + i * GAP_MS}
            className={`whitespace-pre font-mono text-[1.05rem] leading-[2] tabular-nums ${
              toneClass[line.tone ?? "body"]
            }`}
          >
            {line.text || " "}
          </AnimatedSpan>
        ))}
      </Terminal>
    </div>
  );
}
