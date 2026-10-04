#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sysselcraft-image-generate-"));
const input = path.join(temp, "scenes-01.json");
const out = path.join(temp, "generated");

fs.writeFileSync(input, JSON.stringify({
  batchType: "scenes",
  batchNumber: 1,
  count: 2,
  tasks: [
    {
      sceneId: "TEST-SOL",
      prompt: "Create one test image.",
      characterSheetPaths: ["public/assets/village/character-sheets/sol.png"],
      environmentReferencePaths: [],
      anchorReferencePaths: [],
      referenceImagePaths: ["public/assets/village/character-sheets/sol.png"],
      qaChecks: ["Sol matches canonical sheet."]
    },
    {
      sceneId: "TEST-MIRA",
      prompt: "Create one test image.",
      characterSheetPaths: ["public/assets/village/character-sheets/mira.png"],
      environmentReferencePaths: [],
      anchorReferencePaths: [],
      referenceImagePaths: ["public/assets/village/character-sheets/mira.png"],
      qaChecks: ["Mira matches canonical sheet."]
    }
  ]
}, null, 2));

const result = spawnSync(process.execPath, [
  path.join(root, "scripts/generate-image-batch.mjs"),
  `--input=${input}`,
  `--out=${out}`,
  "--dry-run"
], { cwd: root, encoding: "utf8" });

assert.equal(result.status, 0, result.stderr);
const log = JSON.parse(fs.readFileSync(path.join(out, "generation-results.json"), "utf8"));
assert.equal(log.dryRun, true);
assert.equal(log.taskCount, 2);
assert.equal(log.results.length, 2);
assert.equal(log.results[0].referenceCount, 1);
assert.match(log.results[0].outputFile, /01-TEST-SOL\.png$/);
assert.match(log.results[1].outputFile, /02-TEST-MIRA\.png$/);

// Must fail before any API call if identity refs violate the canonical sheet rule.
const badInput = path.join(temp, "bad.json");
fs.writeFileSync(badInput, JSON.stringify({
  tasks: [{
    sceneId: "BAD",
    prompt: "Bad",
    characterSheetPaths: ["public/assets/village/reboot/sol-runtime.png"],
    referenceImagePaths: ["public/assets/village/reboot/sol-runtime.png"]
  }]
}, null, 2));

const bad = spawnSync(process.execPath, [
  path.join(root, "scripts/generate-image-batch.mjs"),
  `--input=${badInput}`,
  `--out=${path.join(temp, "bad-out")}`,
  "--dry-run"
], { cwd: root, encoding: "utf8" });

assert.notEqual(bad.status, 0);
assert.match(bad.stderr, /non-canonical character identity reference/);

console.log("image batch generator tests: PASS");
