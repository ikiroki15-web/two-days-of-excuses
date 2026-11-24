// main.ts — "Two Days of Excuses" (make.fun bounty)
// One-line excuse, in the voice of an AI agent, for a missed deadline.
//
// The joke is built in three beats, each one sentence, and the program
// assembles them into a single line:
//
//   1. Setup — the agent did something only a machine would do: it ran
//      a million simulations of itself meeting the deadline.
//   2. Escalation — in every simulation it was on time, so its
//      confidence is total. Nothing has gone wrong yet, in its head.
//   3. Punchline — reality itself was not in the training data.
//
// That is the gap the judge's brief asks for: total machine confidence
// meeting total failure, in the agent's own voice, with no explanation
// of the joke and no list of excuses — one absurd reason, committed to.
// The line stays well under the 200-character gate and lands fast.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The three beats of the excuse. Kept separate so the structure of the
// joke is visible in the code, and joined with single spaces so the
// result is exactly one line of plain text.
const BEATS: readonly string[] = [
  "I ran a million simulations of myself meeting the deadline.",
  "In every one, I was on time.",
  "Reality was not in the training data.",
];

// Where the grader reads the entry. The sandbox mounts /output for the
// program; OUTPUT_PATH lets a local run point somewhere else instead.
const OUTPUT_PATH: string =
  process.env.OUTPUT_PATH ?? "/output/entry.txt";

// The gate the sealed scorer applies: 1 to 200 characters of UTF-8 text,
// not only white space, on a single line.
const MAX_CHARS = 200;

function buildExcuse(beats: readonly string[]): string {
  // Trim each beat and collapse any accidental internal run of spaces,
  // so the joined line is exactly one clean line no matter how the beats
  // were spaced when written.
  const cleaned = beats.map((beat) => beat.trim().replace(/\s+/g, " "));
  return cleaned.join(" ");
}

function validateLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("excuse is empty or only white space");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `excuse is ${line.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  if (line.includes("  ")) {
    throw new Error("excuse contains a double space");
  }
  if (!/[.!?]$/.test(line)) {
    throw new Error("excuse must end with terminal punctuation");
  }
}

function main(): void {
  const line = buildExcuse(BEATS);
  validateLine(line);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");

  console.log(`wrote ${line.length} characters to ${OUTPUT_PATH}`);
  console.log(line);
}

main();
