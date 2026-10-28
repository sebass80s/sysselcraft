import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Explicit batches in the small JSON manifest, not per-beat React code.
// Usage: node scripts/export-act3-story-batches.mjs --check
//        node scripts/export-act3-story-batches.mjs --write
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const write = process.argv.includes("--write");
assert.ok(check !== write, "Specify exactly one of --check or --write");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const source = read("docs/ACT3_STORY_MANIFEST.md");
const inventory = JSON.parse(read("src/game/act3ContentRegistry.json")).beats;
const batches = JSON.parse(read("scripts/act3-story-batches.json")).batches;
let count = 0;
for (const batch of batches) {
  assert.match(batch.output, /^src\/game\/act3[\w-]+\.generated\.ts$/, "Destination must be generated chapter data");
  assert.match(batch.exportName, /^ACT3_[A-Z0-9_]+$/, "Invalid named export");
  assert.ok(Array.isArray(batch.ids) && batch.ids.length > 0, "Nonempty batch");
  const overrides = batch.narrationOverrides ?? {};
  const usedOverrides = new Set();
  const rows = batch.ids.map(id => {
    const row = inventory.find(item => item.id === id);
    assert.ok(row, "Beat missing from Act 3 registry: " + id);
    assert.equal(row.progression.gateKind, "one_new_claim_per_beat", "Cannot batch special gameplay progression");
    assert.equal(row.script.selection, "only_full_heading", "Needs manual canon resolution: " + id);
    assert.equal(row.script.occurrence, 1, "Multiple canonical occurrences need review: " + id);
    const heading = row.script.headingMarker;
    const start = source.indexOf(heading);
    assert.ok(start >= 0, "Missing canonical heading: " + id);
    assert.equal(source.indexOf(heading, start + heading.length), -1, "Repeated heading needs review: " + id);
    const end = source.indexOf("\n### ", start + heading.length);
    const canonical = source.slice(start + heading.length, end < 0 ? source.length : end).trim();
    let hash = 2166136261;
    for (let i = 0; i < canonical.length; i++) hash = Math.imul(hash ^ canonical.charCodeAt(i), 16777619) >>> 0;
    const digest = hash.toString(16).padStart(8, "0");
    assert.equal(digest, row.script.selectedSceneDigestFnv1a32, "Canonical manuscript drift: " + id);
    const lines = canonical.split(/\n\s*\n/).map(paragraph => {
      const match = /^\*\*([^:]+):\*\*\s*(.*)$/s.exec(paragraph);
      if (match) {
        assert.ok(row.script.speakerIds.includes(match[1]), "Unexpected speaker in " + id);
        return { speaker: match[1] === "Barnet" ? "Du" : match[1], text: match[2] };
      }
      const replacement = overrides[paragraph];
      if (replacement !== undefined) usedOverrides.add(paragraph);
      const text = replacement ?? paragraph;
      assert.doesNotMatch(text, /\bBarnet\b/, "Narration needs grammatical Du/dig editing in " + id + ": " + paragraph);
      return { speaker: null, text };
    });
    assert.ok(lines.length > 0, "Empty beat: " + id);
    count += lines.length;
    return { id, title: row.title, image: row.image.publicUrl, sourceDigest: digest, lines };
  });
  assert.equal(usedOverrides.size, Object.keys(overrides).length, "Unused or stale narration overrides in " + batch.output);
  const header = [
    "/**",
    " * GENERATED STORY DATA: " + batch.ids[0] + ".." + batch.ids.at(-1) + ".",
    " * Source: docs/ACT3_STORY_MANIFEST.md, with registry digest assertions.",
    " * Regenerate via scripts/export-act3-story-batches.mjs --write.",
    " * Only grammatical Du/dig narration and the Barnet speaker are changed.",
    " * Runtime 1.1 keeps quest ownership, cursor persistence and presentation.",
    " */",
    'import type { Act3OpeningBeat } from "./act3OpeningContent";',
  ].join("\n");
  const output = header + "\nexport const " + batch.exportName
    + ": readonly Act3OpeningBeat[] = " + JSON.stringify(rows, null, 2) + ";\n";
  const destination = path.join(root, batch.output);
  if (check) {
    assert.equal(fs.readFileSync(destination, "utf8"), output, "Generated content is stale: " + batch.output);
  } else {
    fs.writeFileSync(destination, output);
  }
}
console.log("PASS: " + batches.length + " canonical Act 3 batch(es), " + count
  + " paragraphs, source digests and grammatical POV rewrites " + (check ? "verified" : "generated"));
