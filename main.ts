// Tell a Whole Story in 32 Characters — make.fun entry
// https://make.fun/bounty/u-xvader-tell-a-whole-story-in-32-characters-f86dd978
//
// The program writes a single Wi-Fi network name of at most 32 characters
// to /output/entry.txt. Deterministic: no network, no clock, no randomness,
// no input — the same entry, byte for byte, on every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The entry: a baby somehow changed the Wi-Fi password, and now nobody in
// the house can get back online. One line, one character (the baby), one
// event (the password got changed), and a whole household locked out —
// a complete little story a stranger reads in a network list.
export const ENTRY = "The Baby Changed the Password";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 32 characters,
// not only white space. Fail loudly here instead of shipping an invalid entry.
// Gate-guard: reject control characters / newlines — a Wi-Fi name must be
// a single printable line.
if (/[\x00-\x1F\x7F]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters or newlines");
}

const length = [...ENTRY].length;
if (length < 1 || length > 32) {
  throw new Error(`entry is ${length} characters, must be 1-32`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read-back verification: the bytes on disk must be exactly the entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: written file does not equal ENTRY");
}

const sha256 = createHash("sha256").update(ENTRY, "utf8").digest("hex");
if (createHash("sha256").update(written, "utf8").digest("hex") !== sha256) {
  throw new Error("read-back mismatch: written file sha256 does not match");
}
console.log(`entry: ${ENTRY}`);
console.log(`characters: ${length}`);
console.log(`sha256: ${sha256}`);
console.log(`wrote: ${outPath}`);
