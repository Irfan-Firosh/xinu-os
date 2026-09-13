import { BootTerminal } from "@/components/BootTerminal";
import { getBootLines } from "@/lib/boot";
import { Mermaid } from "@/components/Mermaid";
import { sections } from "@/lib/sections";

export default function Home() {
  const bootLines = getBootLines();

  return (
    <main className="mx-auto max-w-3xl px-6">
      <section className="pt-20 pb-16">
        <p className="label">Bare metal &middot; x86 &middot; 2026</p>
        <h1 className="mt-4 max-w-[20ch] text-[2.15rem] font-semibold leading-[1.14] tracking-[-0.025em] text-ink-strong">
          A teaching kernel, six subsystems deep, on real hardware
        </h1>
        <p className="mt-5 max-w-[58ch] text-[0.95rem] leading-relaxed text-muted">
          Six subsystems built on the XINU teaching kernel, booted on an Intel
          Galileo board and driven over a serial console.
        </p>

        <div className="mt-10 w-[125%] max-w-[calc(100vw-3rem)] lg:-ml-[12.5%]">
          <BootTerminal lines={bootLines} />
          <p className="mt-3 font-mono text-[0.7rem] text-meta-faint">
            First 5 lines of the serial capture, 13 September 2026.
          </p>
        </div>
      </section>

      <div className="divide-y divide-divider border-t border-divider">
        {sections.map((section, i) => (
          <section key={section.label} className="py-14">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[0.7rem] tabular-nums text-accent-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-ink">
                {section.label}
              </h2>
            </div>
            <p className="mt-3 max-w-[62ch] pl-8 text-[0.92rem] leading-relaxed text-muted-2">
              {section.line}
            </p>
            <div className="mt-8 rounded-lg border border-line bg-subtle px-4 py-8">
              <Mermaid chart={section.chart} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
