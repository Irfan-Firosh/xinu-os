"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef } from "react";
import { Mermaid } from "./Mermaid";

/**
 * Renders a writeup. The one thing this does beyond plain markdown is lift
 * ```mermaid fences out into rendered diagrams.
 */
export function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...rest }: ComponentPropsWithoutRef<"code">) {
            if (className?.includes("language-mermaid")) {
              return <Mermaid chart={String(children).trimEnd()} />;
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          pre({ children }: ComponentPropsWithoutRef<"pre">) {
            // A mermaid fence becomes a <figure>, which must not be wrapped
            // in <pre>; every other fence keeps its code block.
            const only = Array.isArray(children) ? children[0] : children;
            const cls =
              typeof only === "object" && only !== null && "props" in only
                ? String(
                    (only as { props?: { className?: string } }).props?.className ?? "",
                  )
                : "";
            if (cls.includes("language-mermaid")) return <>{children}</>;
            return <pre>{children}</pre>;
          },
          table({ children }: ComponentPropsWithoutRef<"table">) {
            return (
              <div className="table-scroll">
                <table>{children}</table>
              </div>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
