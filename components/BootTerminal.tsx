"use client";

import { useEffect, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

/** One full pass of the boot, then a pause, then it starts over. */
const LOOP_MS = 7_000;

const LINES = [
  { delay: 1350, text: "Xinu for galileo -- version #2 (Irfan Firosh)", accent: true },
  { delay: 1700, text: "233393696 bytes of free memory." },
  { delay: 2050, text: "116557 bytes of Xinu code." },
  { delay: 2400, text: "16817640 bytes of data." },
];

/**
 * The first lines the board prints on boot. The banner prints the author's
 * account username; the name is shown here instead. The raw capture in
 * data/transcript.txt is untouched.
 */
export function BootTerminal() {
  const [pass, setPass] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPass((n) => n + 1), LOOP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <Terminal
      key={pass}
      sequence={false}
      startOnView={false}
      className="h-auto max-h-none w-full max-w-none rounded-xl border-line bg-subtle"
    >
      <TypingAnimation
        delay={250}
        duration={45}
        startOnView={false}
        className="font-mono text-[0.95rem] leading-[1.9] text-ink"
      >
        {"$ cs-console galileo165"}
      </TypingAnimation>

      {LINES.map((line) => (
        <AnimatedSpan
          key={line.text}
          delay={line.delay}
          className={`font-mono text-[0.95rem] leading-[1.9] tabular-nums ${
            line.accent ? "text-accent-text" : "text-muted"
          }`}
        >
          {line.text}
        </AnimatedSpan>
      ))}
    </Terminal>
  );
}
