/** Figures read directly off the recorded boot. Nothing here is estimated. */

export const boot = {
  board: "galileo165",
  soc: "Intel Quark X1000",
  bannerDate: "Sun Sep 13 02:36:44 AM EDT 2026",
  macAddress: "98:4f:ee:00:4c:34",
  freeMemoryBytes: 233_393_696,
  codeBytes: 116_557,
  codeRange: "0x00100000 to 0x0011C74C",
  dataBytes: 16_817_640,
  dataRange: "0x00120200 to 0x01129FE7",
} as const;

/**
 * The scheduler benchmark's own report, printed by each process after
 * roughly seven seconds of competition. cpu is milliseconds of CPU time
 * consumed; avgresp is mean milliseconds spent on the ready list before
 * being dispatched; prio is the priority the feedback queue settled on.
 */
export const benchmark = [
  { pid: 6, kind: "CPU-bound", at: 7032, cpu: 372, avgresp: 17, prio: 1 },
  { pid: 7, kind: "CPU-bound", at: 7077, cpu: 374, avgresp: 17, prio: 1 },
  { pid: 8, kind: "I/O-bound", at: 7129, cpu: 0, avgresp: 1, prio: 8 },
  { pid: 9, kind: "I/O-bound", at: 7133, cpu: 0, avgresp: 1, prio: 8 },
  { pid: 10, kind: "Exploit", at: 7141, cpu: 5350, avgresp: 1, prio: 8 },
] as const;

export const findings = [
  {
    label: "The classifier is exploitable",
    body: "sneaky() sleeps for one millisecond every time it is about to exhaust its slice, so the scheduler keeps classifying it as I/O-bound. It finished with 5,350 ms of CPU at the top priority of 8, against 372 and 374 ms for the honest CPU-bound processes the scheduler had demoted to priority 1. Fourteen times the CPU, at the best priority in the table.",
  },
  {
    label: "kprintf is not serialised",
    body: "Two benchmark lines in the capture are spliced through each other mid-word: PID 6 CPU-bound clkcounterms=7032 cpu=372 PID 7 CPU-bou... . Each process holds no lock over the console, so a context switch inside a print interleaves the output. The numbers survive; the line structure does not.",
  },
  {
    label: "The lab 5 ram disk is visible in the memory map",
    body: "The boot banner reports 16,817,640 bytes of data against 116,557 bytes of code. Almost all of that data segment is the filesystem lab's 16 MB ram disk, statically reserved, which is why the merged kernel's data section is 144 times its code.",
  },
] as const;

export const links = {
  privateRepo: "https://github.com/Irfan-Firosh/xinu-os-kernel",
  publicRepo: "https://github.com/Irfan-Firosh/xinu-os-notes",
} as const;
