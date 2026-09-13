"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";
import type { BootLine } from "@/lib/boot";

const FIRST_LINE_MS = 1_150;
const GAP_MS = 220;

const toneClass = {
  accent: "text-accent-text",
  dim: "text-meta-faint",
  body: "text-muted",
} as const;

/** Types the capture out once. A replay control appears when it finishes. */
export function BootTerminal({ lines }: { lines: BootLine[] }) {
  const [pass, setPass] = useState(0);
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const replay = useCallback(() => {
    setDone(false);
    setPass((n) => n + 1);
  }, []);

  /* Follow the newest line that has actually appeared. Every line reserves its
     space from the start, so scrolling to the bottom would run past the output
     into blank rows not yet revealed. Reveal is read from the DOM rather than
     from a clock, because the pass begins when the component mounts, not when
     this effect is scheduled. The scroll fires once per new line rather than on
     every tick, which is what keeps it from stuttering. */
  useEffect(() => {
    const pre = box.current?.querySelector("pre");
    const code = pre?.firstElementChild;
    if (!pre || !code) return;

    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const children = [...code.children];
    const last = children[children.length - 1];

    pre.scrollTop = 0;
    let seen = 0;

    const follow = setInterval(() => {
      let count = 0;
      let newest: Element | null = null;
      for (const child of children) {
        if (parseFloat(getComputedStyle(child).opacity) > 0.5) {
          count += 1;
          newest = child;
        }
      }

      if (newest && count !== seen) {
        seen = count;
        const overshoot =
          newest.getBoundingClientRect().bottom - pre.getBoundingClientRect().bottom;
        if (overshoot > 0) {
          pre.scrollTo({
            top: pre.scrollTop + overshoot,
            behavior: smooth ? "smooth" : "auto",
          });
        }
      }

      if (newest === last) {
        clearInterval(follow);
        setDone(true);
      }
    }, 110);

    return () => clearInterval(follow);
  }, [pass]);

  return (
    <div ref={box}>
      {/* Height is reserved so the control appearing does not shift the page. */}
      <div className="mb-3 flex h-8 items-center justify-end">
        {done && (
          <button
            type="button"
            onClick={replay}
            aria-label="Replay the boot"
            className="flex size-8 items-center justify-center rounded-md bg-accent text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        )}
      </div>

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
          className="font-mono text-[0.95rem] leading-[1.95] text-ink"
        >
          {"$ cs-console galileo165"}
        </TypingAnimation>

        {lines.map((line, i) => (
          <AnimatedSpan
            key={i}
            delay={FIRST_LINE_MS + i * GAP_MS}
            className={`whitespace-pre font-mono text-[0.95rem] leading-[1.95] tabular-nums ${toneClass[line.tone]}`}
          >
            {line.text || " "}
          </AnimatedSpan>
        ))}
      </Terminal>
    </div>
  );
}
