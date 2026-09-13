# XINU on Intel Galileo

A XINU kernel extended with six subsystems and booted on an Intel Galileo
board. This repository holds the design notes and the site that presents them.

**Live site:** _set once deployed_

## XINU

XINU is a teaching kernel written by Douglas Comer at Purdue University. The
kernel this work extends is his: the network stack, the shell, the device
drivers, the memory allocator and the boot path are all upstream code, and so
is the filesystem scaffold that the indirect-block work plugs into. None of
that source is in this repository. The notes below describe only what was
added on top of it, and each one opens by naming which files are mine.

## My code

| Subsystem | What I wrote |
|---|---|
| Process management | Two process-creation variants, one enforcing new policy and one redirecting where a process lands when its top-level function returns; a parent-state query syscall; a boot greeting and a character-writer process |
| Scheduling | A millisecond clock counter driven from the timer interrupt; per-process CPU-time and response-time accounting; a multi-level feedback queue scheduler with a nine-level dispatch table; CPU-bound, I/O-bound and classifier-exploit benchmark processes |
| Synchronization | A bounded circular buffer; three-semaphore producer-consumer coordination; a semaphore deadlock detector that maintains a resource-allocation graph and walks it for cycles from the clock handler |
| Garbage collection | Per-process tracked allocation and free, with reclamation of a process's unfreed blocks when it terminates |
| Filesystem | Four-way block resolution (direct, singly, doubly and triply indirect) replacing a starter version that panicked on any offset past the direct blocks |

## Design notes

One per subsystem. Each covers the problem, the data structure, the mechanism,
the measured result, and the defects it still has.

1. [Process management](content/writeups/01-process-management.md)
2. [Scheduling](content/writeups/02-scheduling.md)
3. [Synchronization and deadlock detection](content/writeups/03-synchronization.md)
4. [Garbage collection](content/writeups/04-garbage-collection.md)
5. [Filesystem: indirect block resolution](content/writeups/05-filesystem.md)

## The recording

`data/transcript.txt` is the serial output captured while the merged kernel
booted on `galileo165`. The site types it out at the pace it was produced.

## Running the site

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```
