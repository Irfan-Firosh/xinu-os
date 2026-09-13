export type Section = {
  label: string;
  line: string;
  chart: string;
};

/** One per subsystem: a label, a single sentence, and the diagram. */
export const sections: Section[] = [
  {
    label: "Process management",
    line: "A second creation path changes where a process lands when its top-level function returns.",
    chart: `graph TD
    C{"Which creator?"}
    C -->|"create()"| A["Return address: INITRET"]
    C -->|"createv2()"| B["Return address: INITRETR"]
    A --> U["userret()"]
    B --> T["terminator()"]
    T --> K["announces the PID, calls kill()"]`,
  },
  {
    label: "Scheduling",
    line: "Priority follows behaviour: burn a whole time slice and you are demoted, block early and you are promoted.",
    chart: `graph TD
    L5["Level 5 - 40ms slice"]
    L4["Level 4 - 50ms slice"]
    L3["Level 3 - 60ms slice"]
    L5 -->|"burns full slice"| L4
    L4 -->|"burns full slice"| L3
    L3 -->|"blocks early"| L4
    L4 -->|"blocks early"| L5`,
  },
  {
    label: "Deadlock detection",
    line: "Semaphore ownership and waiting are kept as a graph, and the clock handler walks it for cycles every 500 ms.",
    chart: `graph TD
    P1(["Process 1"]) -->|"waits for"| S2["Semaphore B"]
    S2 -->|"held by"| P2(["Process 2"])
    P2 -->|"waits for"| S1["Semaphore A"]
    S1 -->|"held by"| P1`,
  },
  {
    label: "Garbage collection",
    line: "Every allocation is charged to the process that made it, and kill() reclaims whatever it never freed.",
    chart: `graph TD
    A["Tracked allocation"] --> B["Charged to the process"]
    B --> C{"How does it end?"}
    C -->|"Explicit free"| D["Freed"]
    C -->|"Process terminates"| E["Reclaimed by kill()"]`,
  },
  {
    label: "Filesystem",
    line: "A file offset resolves through direct blocks and then one, two or three levels of indirection.",
    chart: `graph LR
    IDX["Index block"]
    IDX -->|"15 direct"| DIR["7,680 B"]
    IDX -->|"ind"| S1["Singly indirect<br/>73,216 B"]
    IDX -->|"ind2"| D1["Doubly indirect<br/>8,461,824 B"]
    IDX -->|"ind3"| T1["Triply indirect<br/>1,082,203,648 B"]`,
  },
];
