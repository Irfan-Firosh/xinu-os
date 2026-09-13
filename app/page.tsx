import Link from "next/link";
import { TerminalReplay } from "@/components/TerminalReplay";
import { replayEvents, replayDurationMs, transcript } from "@/lib/recording";
import { benchmark, boot, findings, links } from "@/lib/facts";
import { getWriteups } from "@/lib/writeups";

const bytes = (n: number) => n.toLocaleString("en-US");

export default function Home() {
  const writeups = getWriteups();

  return (
    <main className="mx-auto max-w-6xl px-5">
      {/* ---- thesis + the recording ---------------------------------------- */}
      <section className="grid gap-12 pt-14 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-20">
        <div>
          <p className="label">Purdue CS354 &middot; Spring 2026</p>
          <h1 className="mt-3 font-mono text-[2.1rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
            A teaching kernel, six labs deep, booting on real hardware
          </h1>
          <p className="mt-5 max-w-[60ch] text-[0.98rem] leading-relaxed text-ink-2">
            Six operating-systems labs written on Purdue{`’`}s XINU
            distribution, merged afterward into one kernel tree: a multi-level
            feedback queue scheduler, a semaphore deadlock detector that walks
            a resource-allocation graph from the clock interrupt, a kernel
            garbage collector, and Unix-style indirect block resolution. The
            capture beside this is that merged kernel running on an Intel
            Galileo board in a rack at Purdue, on its first attempt.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-3">
            {[
              { k: "Board", v: boot.board },
              { k: "SoC", v: boot.soc },
              { k: "MAC", v: boot.macAddress },
              { k: "Kernel code", v: `${bytes(boot.codeBytes)} B` },
              { k: "Data segment", v: `${bytes(boot.dataBytes)} B` },
              { k: "Free memory", v: `${bytes(boot.freeMemoryBytes)} B` },
            ].map(({ k, v }) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-1 font-mono text-[0.82rem] tabular-nums text-ink">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:pt-9">
          <TerminalReplay
            events={replayEvents}
            transcript={transcript}
            durationMs={replayDurationMs}
          />
          <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
            Serial output captured with <code className="font-mono">script</code>{" "}
            over the course{`’`}s console server. Replay uses the recorded
            inter-chunk timings, so the pace is the board{`’`}s, not an
            animation. Four hundred and eighteen repeated deadlock-detector
            lines are trimmed from the middle.
          </p>
        </div>
      </section>

      {/* ---- what the capture proves --------------------------------------- */}
      <section className="border-t border-line py-14">
        <p className="label">Read from the capture</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          Three things the output shows
        </h2>
        <div className="mt-8 grid gap-9 md:grid-cols-3">
          {findings.map((f) => (
            <div key={f.label}>
              <h3 className="font-mono text-[0.82rem] font-medium text-accent">
                {f.label}
              </h3>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-2">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- the scheduler benchmark --------------------------------------- */}
      <section className="border-t border-line py-14">
        <p className="label">Scheduler benchmark, self-reported at ~7 s</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          What the feedback queue decided
        </h2>
        <p className="mt-4 max-w-[68ch] text-[0.92rem] leading-relaxed text-ink-2">
          Five processes compete: two that never yield, two that block on I/O
          constantly, and one written to game the classifier. The scheduler
          promotes processes it judges interactive and demotes processes it
          judges compute-heavy. Priority 8 is the best, 1 the worst.
        </p>

        <div className="table-scroll mt-7">
          <table className="w-full min-w-[34rem] border-collapse text-[0.86rem]">
            <thead>
              <tr className="border-b border-line-strong">
                {["PID", "Classification", "CPU ms", "Avg response ms", "Final priority"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-2 pr-6 text-left font-mono text-[0.68rem] font-medium uppercase tracking-widest text-muted"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {benchmark.map((row) => {
                const exploit = row.kind === "Exploit";
                return (
                  <tr
                    key={row.pid}
                    className={`border-b border-line ${exploit ? "bg-accent-soft/60" : ""}`}
                  >
                    <td className="py-2.5 pr-6 font-mono tabular-nums text-muted">
                      {row.pid}
                    </td>
                    <td className={`py-2.5 pr-6 ${exploit ? "font-medium text-accent" : "text-ink-2"}`}>
                      {exploit ? "Exploit (sneaky)" : row.kind}
                    </td>
                    <td className="py-2.5 pr-6 font-mono tabular-nums text-ink">
                      {bytes(row.cpu)}
                    </td>
                    <td className="py-2.5 pr-6 font-mono tabular-nums text-ink-2">
                      {row.avgresp}
                    </td>
                    <td className="py-2.5 pr-6 font-mono tabular-nums text-ink">
                      {row.prio}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[0.8rem] text-muted">
          The exploit sleeps one millisecond before each slice expires, so it is
          never charged for a full quantum and never gets demoted.
        </p>
      </section>

      {/* ---- writeups ------------------------------------------------------ */}
      <section className="border-t border-line py-14">
        <p className="label">Design notes</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          One per subsystem
        </h2>
        <ul className="mt-8 divide-y divide-line border-t border-line">
          {writeups.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/writeups/${w.slug}`}
                className="group flex gap-6 py-6 transition-colors hover:bg-surface-2/50"
              >
                <span className="font-mono text-[0.72rem] tabular-nums text-muted">
                  {String(w.order).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.98rem] font-semibold tracking-tight text-ink group-hover:text-accent">
                    {w.title}
                  </span>
                  <span className="mt-1.5 block max-w-[72ch] text-[0.87rem] leading-relaxed text-muted">
                    {w.blurb.length > 260 ? `${w.blurb.slice(0, 260).trimEnd()}…` : w.blurb}
                  </span>
                </span>
                <span
                  className="ml-auto hidden shrink-0 self-center font-mono text-accent sm:block"
                  aria-hidden
                >
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- scope and honesty --------------------------------------------- */}
      <section className="border-t border-line py-14">
        <p className="label">Scope</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
          What this site is and is not
        </h2>
        <div className="mt-7 grid gap-x-12 gap-y-7 md:grid-cols-2">
          <div className="text-[0.89rem] leading-relaxed text-ink-2">
            <h3 className="font-mono text-[0.8rem] font-medium text-ink">
              No source here
            </h3>
            <p className="mt-2">
              The kernel tree stays private. It carries stock XINU and
              instructor-written starter code that are not mine to redistribute,
              and publishing solutions to an assignment that is still set would
              be a disservice to the course. These notes describe designs and
              quote nothing that would function as an answer key.
            </p>
          </div>
          <div className="text-[0.89rem] leading-relaxed text-ink-2">
            <h3 className="font-mono text-[0.8rem] font-medium text-ink">
              Most of the tree is not mine
            </h3>
            <p className="mt-2">
              XINU is a teaching kernel by Douglas Comer. Its network stack,
              shell, drivers and memory allocator are stock, as are twenty-one
              of the twenty-two files in the filesystem lab{`’`}s scaffold. Each
              writeup names exactly which files are mine before describing them.
            </p>
          </div>
          <div className="text-[0.89rem] leading-relaxed text-ink-2">
            <h3 className="font-mono text-[0.8rem] font-medium text-ink">
              The merged tree is a derivative
            </h3>
            <p className="mt-2">
              Each lab was submitted on its own fresh copy of XINU; no single
              tree held all six at once during the semester. The merge was
              assembled afterward, and two small changes exist only because of
              it: a bounds clamp in the scheduler, and process-table
              initialisers so early-lab creation paths zero fields later labs
              added.
            </p>
          </div>
          <div className="text-[0.89rem] leading-relaxed text-ink-2">
            <h3 className="font-mono text-[0.8rem] font-medium text-ink">
              Known defects are disclosed, not fixed
            </h3>
            <p className="mt-2">
              A garbage-collector leak on a failed free, an unbounded index in
              the triply-indirect branch, and a missing{" "}
              <code className="font-mono text-[0.9em]">kill()</code> case for a
              process blocked in the deadlock-aware wait. Each is named in the
              writeup for its subsystem rather than quietly patched.
            </p>
          </div>
        </div>

        <p className="mt-10 text-[0.85rem] text-muted">
          Source available on request:{" "}
          <a
            href={links.privateRepo}
            className="text-accent underline decoration-1 underline-offset-2"
          >
            Irfan-Firosh/xinu-os-kernel
          </a>{" "}
          (private).
        </p>
      </section>
    </main>
  );
}
