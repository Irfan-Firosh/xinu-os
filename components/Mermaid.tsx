"use client";

import { useEffect, useRef, useState } from "react";

let counter = 0;

/**
 * Renders one mermaid graph. Mermaid is imported dynamically so it stays out
 * of the initial bundle, and its theme variables are read off the live CSS
 * custom properties, which is what keeps a diagram legible in both themes.
 */
export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;

    async function draw() {
      const style = getComputedStyle(document.documentElement);
      const token = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;

      const ink = token("--ink", "#15181c");
      const line = token("--line-strong", "#b4bdc6");
      const surface = token("--surface", "#f8f9fb");
      const accent = token("--accent", "#9a6410");

      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        themeVariables: {
          background: "transparent",
          primaryColor: surface,
          primaryTextColor: ink,
          primaryBorderColor: line,
          secondaryColor: surface,
          tertiaryColor: surface,
          lineColor: accent,
          textColor: ink,
          nodeBorder: line,
          clusterBkg: "transparent",
          clusterBorder: line,
          edgeLabelBackground: surface,
          fontSize: "13px",
        },
      });

      try {
        const { svg: out } = await mermaid.render(
          `mmd-${(counter += 1)}`,
          chart,
          host.current ?? undefined,
        );
        if (live) setSvg(out);
      } catch {
        if (live) setFailed(true);
      }
    }

    void draw();
    return () => {
      live = false;
    };
  }, [chart]);

  if (failed) {
    return (
      <pre className="text-[0.75rem]">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <figure className="my-7 overflow-x-auto rounded-lg border border-line bg-surface px-4 py-6">
      <div
        ref={host}
        className="flex min-w-fit justify-center [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}
