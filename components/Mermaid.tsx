"use client";

import { useEffect, useRef, useState } from "react";

let counter = 0;

/** Renders one diagram, themed from the page's own CSS custom properties. */
export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;

    async function draw() {
      const style = getComputedStyle(document.documentElement);
      const token = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;

      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        flowchart: { useMaxWidth: false, curve: "basis", padding: 12, nodeSpacing: 36, rankSpacing: 48 },
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        themeVariables: {
          background: "transparent",
          primaryColor: token("--canvas", "#ffffff"),
          primaryTextColor: token("--ink", "#17233a"),
          primaryBorderColor: token("--border-strong", "#dfe3e8"),
          secondaryColor: token("--surface", "#f6f7f8"),
          tertiaryColor: token("--surface-subtle", "#fafbfb"),
          lineColor: token("--accent", "#f44f5f"),
          textColor: token("--ink", "#17233a"),
          nodeBorder: token("--border-strong", "#dfe3e8"),
          clusterBkg: "transparent",
          clusterBorder: token("--border", "#e3e6ea"),
          edgeLabelBackground: token("--canvas", "#ffffff"),
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
        /* A diagram that will not parse is left out rather than shown broken. */
      }
    }

    void draw();
    return () => {
      live = false;
    };
  }, [chart]);

  return (
    <div className="w-full">
      <div
        ref={host}
        className="flex justify-center [&_svg]:h-auto [&_svg]:!w-auto [&_svg]:!max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
