import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-24">
      <p className="label">404</p>
      <h1 className="font-mono text-2xl font-medium tracking-tight text-ink">
        No such page
      </h1>
      <p className="max-w-[60ch] text-[0.92rem] text-ink-2">
        That address does not match any of the design notes.
      </p>
      <Link
        href="/"
        className="mt-2 font-mono text-[0.72rem] uppercase tracking-widest text-accent"
      >
        &larr; Back to the recording
      </Link>
    </main>
  );
}
