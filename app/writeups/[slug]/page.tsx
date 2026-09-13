import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getWriteup, getWriteups } from "@/lib/writeups";

export function generateStaticParams() {
  return getWriteups().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) return {};
  return {
    title: `${writeup.title} — XINU on Intel Galileo`,
    description: writeup.blurb.slice(0, 180),
  };
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) notFound();

  const all = getWriteups();
  const index = all.findIndex((w) => w.slug === slug);
  const previous = all[index - 1];
  const next = all[index + 1];

  return (
    <main className="mx-auto max-w-6xl px-5">
      <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16">
        <article className="min-w-0">
          <p className="label">
            Design note {String(writeup.order).padStart(2, "0")} of{" "}
            {String(all.length).padStart(2, "0")}
          </p>
          <div className="mt-4">
            <MarkdownBody markdown={writeup.markdown} />
          </div>

          <nav className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-7">
            {previous && (
              <Link href={`/writeups/${previous.slug}`} className="group">
                <span className="label block">Previous</span>
                <span className="mt-1 block text-[0.9rem] font-medium text-ink group-hover:text-accent">
                  &larr; {previous.title}
                </span>
              </Link>
            )}
            {next && (
              <Link href={`/writeups/${next.slug}`} className="group ml-auto text-right">
                <span className="label block">Next</span>
                <span className="mt-1 block text-[0.9rem] font-medium text-ink group-hover:text-accent">
                  {next.title} &rarr;
                </span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="order-first lg:order-last">
          <div className="lg:sticky lg:top-20">
            <p className="label">All notes</p>
            <ul className="mt-3 space-y-2.5 border-t border-line pt-3">
              {all.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/writeups/${w.slug}`}
                    className={`flex gap-2.5 text-[0.82rem] leading-snug transition-colors ${
                      w.slug === slug
                        ? "text-accent"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[0.7rem] tabular-nums">
                      {String(w.order).padStart(2, "0")}
                    </span>
                    <span>{w.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-6 inline-block font-mono text-[0.7rem] uppercase tracking-widest text-muted hover:text-ink"
            >
              &larr; Recording
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
