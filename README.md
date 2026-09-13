# XINU on Intel Galileo

Design notes and a recorded hardware boot for a XINU kernel extended with six
subsystems, presented as a small Next.js site.

**Live site:** _set once deployed_

## What is here

- `content/writeups/` — five design notes, one per subsystem: process
  management, scheduling, synchronization and deadlock detection, garbage
  collection, and filesystem indirect block resolution. Each names which files
  are mine before describing anything, and each ends with the defects it still
  has.
- `data/transcript.txt` — serial output captured while the merged kernel booted
  on an Intel Galileo board (`galileo165`).
- `data/replay-events.json` — `[delayMs, text]` pairs derived from `script(1)`
  timing data for that same capture.
- `app/`, `components/`, `lib/` — the site itself.

The site types the whole capture out once, then offers a replay control. Two
lines are dropped from the display, the board's MAC address and an identity
line, and the banner's account username is shown as a name; the drop happens
in `lib/boot.ts`, and `data/transcript.txt` is the untouched capture.

## What is deliberately not here

No kernel source. XINU is a teaching kernel written by Douglas Comer, and the
tree these notes describe also carries starter code written by others. Neither
is mine to redistribute. These notes describe designs and measured behaviour;
they quote nothing that would function as a solution to the exercises behind
them.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

The build is a fully static export, so `out/` can be served by any static host.

## Deploying

**Vercel.** Import the repository; the defaults are correct. Add the domain
under Settings → Domains.

**GitHub Pages.** Build with a base path when serving from a project
subdirectory:

```bash
BASE_PATH=/xinu-os npm run build && touch out/.nojekyll
```

then publish `out/`. A custom domain serves from the root, so drop `BASE_PATH`
in that case.

## Attribution

XINU is a teaching kernel written by Douglas Comer. This repository carries
none of its source. The writing, the site, and the kernel work described are by
Irfan Firosh.
