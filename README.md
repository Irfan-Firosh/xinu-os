# XINU on Intel Galileo

Design notes and a recorded hardware boot for a XINU kernel built across six
operating-systems labs at Purdue (CS354, Spring 2026), rendered as a small
Next.js site.

**Live site:** _set once deployed_

## What is here

- `content/writeups/` — five design notes, one per subsystem: process
  management, scheduling, synchronization and deadlock detection, garbage
  collection, and filesystem indirect block resolution. Each names which files
  are the author's before describing anything, and each ends with the defects
  it still has.
- `data/transcript.txt` — serial output captured while the merged kernel
  booted on an Intel Galileo board (`galileo165`) at Purdue.
- `data/replay-events.json` — `[delayMs, text]` pairs derived from `script(1)`
  timing data for that same capture.
- `app/`, `components/`, `lib/` — the site itself.

The site shows only the first five lines of the boot, typed out live. The
board's banner prints the author's Purdue username (`ifirosh`); the site
prints the name instead. `data/transcript.txt` is the untouched capture.

## What is deliberately not here

No kernel source. The tree it documents is private, and stays private for two
reasons: it contains stock XINU (a teaching kernel by Douglas Comer, Purdue
University) and instructor-written starter code that are not the author's to
redistribute, and CS354 still sets these labs. These notes describe designs
and measured behaviour; they quote nothing that would serve as a solution key.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

The build is a fully static export, so `out/` can be served by any static
host.

## Deploying

**Vercel.** Import the repository; the defaults are correct. Then add the
domain under Settings → Domains.

**GitHub Pages.** Build with a base path if serving from a project
subdirectory:

```bash
BASE_PATH=/xinu-os-notes npm run build && touch out/.nojekyll
```

then publish `out/`. A custom domain serves from the root, so drop
`BASE_PATH` in that case.

## Attribution

XINU is a teaching kernel written by Douglas Comer at Purdue University. This
repository carries none of its source. The writing, the site, and the kernel
work being described are by Irfan Firosh.
