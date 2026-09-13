"use client";

import { useEffect, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

/** One full pass of the boot, then a pause, then it starts over. */
const LOOP_MS = 11_500;

/**
 * The five lines the board prints before the demo app takes over. The banner
 * prints the author's Purdue username; the name is shown here instead. The
 * raw capture in data/transcript.txt is untouched.
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
      className="max-h-none w-full max-w-none rounded-lg border-line bg-subtle"
    >
      <TypingAnimation
        delay={400}
        duration={95}
        startOnView={false}
        className="font-mono text-[0.8rem] text-ink"
      >
        {"$ cs-console galileo165"}
      </TypingAnimation>

      <AnimatedSpan delay={2900} className="font-mono text-[0.8rem] text-accent-text">
        Xinu for galileo -- version #2 (Irfan Firosh)
      </AnimatedSpan>

      <AnimatedSpan delay={3600} className="font-mono text-[0.8rem] tabular-nums text-muted">
        233393696 bytes of free memory.
      </AnimatedSpan>

      <AnimatedSpan delay={4300} className="font-mono text-[0.8rem] tabular-nums text-muted">
        116557 bytes of Xinu code.
      </AnimatedSpan>

      <AnimatedSpan delay={5000} className="font-mono text-[0.8rem] tabular-nums text-muted">
        16817640 bytes of data.
      </AnimatedSpan>
    </Terminal>
  );
}
