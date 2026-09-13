import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { links } from "@/lib/facts";
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
    "A teaching kernel extended with six subsystems and booted on real hardware: a feedback-queue scheduler, a semaphore deadlock detector, a kernel garbage collector and indirect block resolution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <header className="border-b border-divider">
          <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
            <span className="font-mono text-[0.82rem] text-ink">
              xinu<span className="text-accent">/</span>galileo
            </span>
            <a
              href={links.repo}
              className="ml-auto font-mono text-[0.7rem] uppercase tracking-[0.16em] text-meta transition-colors hover:text-accent-hover"
            >
              Notes &#8599;
            </a>
          </div>
        </header>

        {children}

        <footer className="border-t border-divider">
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="max-w-[62ch] text-[0.8rem] leading-relaxed text-meta">
              XINU is a teaching kernel written by Douglas Comer. This
              documents work added on top of it and carries none of its
              source.
            </p>
            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-meta-faint">
              Irfan Firosh
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
