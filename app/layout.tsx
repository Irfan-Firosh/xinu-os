import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { getWriteups } from "@/lib/writeups";
import { links } from "@/lib/facts";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XINU on Intel Galileo",
  description:
    "Design notes and a recorded hardware boot for a XINU kernel built across six operating-systems labs: a feedback-queue scheduler, a semaphore deadlock detector, a kernel garbage collector and Unix-style indirect block resolution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const writeups = getWriteups();

  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <head>
        {/* Applied before paint so a stored theme choice does not flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
            <Link
              href="/"
              className="font-mono text-sm font-medium tracking-tight text-ink"
            >
              xinu<span className="text-accent">/</span>galileo
            </Link>

            <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
              {writeups.map((w) => (
                <Link
                  key={w.slug}
                  href={`/writeups/${w.slug}`}
                  className="shrink-0 rounded px-2.5 py-1.5 text-[0.8rem] text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {w.title.split(":")[0]}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 border-l border-line pl-3">
              <a
                href={links.privateRepo}
                className="rounded px-2 py-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-muted transition-colors hover:text-ink"
                title="Source repository (private)"
              >
                src
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-24 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-10 text-[0.8rem] leading-relaxed text-muted">
            <p className="max-w-[68ch]">
              Coursework for Purdue CS354, Spring 2026. XINU is a teaching
              kernel written by Douglas Comer at Purdue University; this site
              documents work added on top of it and carries none of its source,
              nor any course-supplied starter code. Written by Irfan Firosh.
            </p>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-widest">
              Captured on {`“`}galileo165{`”`} &middot; Intel Quark X1000
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
