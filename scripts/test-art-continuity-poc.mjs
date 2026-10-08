#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const builder = path.join(root, "scripts/build-art-job.mjs");
const approver = path.join(root, "scripts/approve-art-image.mjs");
const sourceManifest = path.join(root, "image-pipeline/batches/poc-continuity-chain-01.json");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sysselcraft-art-poc-"));
const manifest = path.join(temp, "manifest.json");
const approvals = path.join(temp, "approvals.json");
fs.copyFileSync(sourceManifest, manifest);

function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function build(beat) {
  const out = path.join(temp, beat + ".job.json");
  run(builder, [
    `--manifest=${manifest}`,
    `--beat=${beat}`,
    `--approvals=${approvals}`,
    `--out=${out}`
  ]);
  return JSON.parse(fs.readFileSync(out, "utf8"));
}

function approve(beat, filename) {
  const output = path.join(temp, filename);
  fs.copyFileSync(
    path.join(root, "public/assets/village/character-sheets/alve.png"),
    output
  );
  run(approver, [
    `--manifest=${manifest}`,
    `--beat=${beat}`,
    `--output=${output}`,
    `--approvals=${approvals}`
  ]);
  return output;
}

const first = build("POC-A3-001");
assert.deepEqual(first.characters, ["alve", "barnet"]);
assert.equal(first.characterSheetPaths.length, 2);
assert.deepEqual(first.chatLibraryReferencePaths, [
  "/SysselCraft/Art References/characters/alve.png",
  "/SysselCraft/Art References/characters/barnet.png"
]);
assert.equal(first.anchorReferencePaths.length, 0);
assert.equal(first.referenceImagePaths.length, 2);
assert.match(first.prompt, /CANONICAL IDENTITY LAW/);
assert.match(first.prompt, /Barnet's face must never be visible/);

const firstOutput = approve("POC-A3-001", "approved-001.png");

const second = build("POC-A3-002");
assert.deepEqual(second.anchorReferencePaths, [firstOutput]);
assert.equal(second.continuityAnchors[0].beatId, "POC-A3-001");
assert.equal(second.referenceImagePaths.length, 3);
assert.match(second.prompt, /CONTINUITY LAW/);

const secondOutput = approve("POC-A3-002", "approved-002.png");

const third = build("POC-A3-003");
assert.deepEqual(third.anchorReferencePaths, [secondOutput, firstOutput]);
assert.deepEqual(third.continuityAnchors.map((x) => x.beatId), [
  "POC-A3-002",
  "POC-A3-001"
]);
assert.equal(third.referenceImagePaths.length, 4);
assert.equal(third.approval.status, "pending");

// Fail closed if an approved anchor disappears from durable storage.
fs.unlinkSync(secondOutput);
const missing = spawnSync(process.execPath, [
  builder,
  `--manifest=${manifest}`,
  "--beat=POC-A3-003",
  `--approvals=${approvals}`,
  `--out=${path.join(temp, "missing.job.json")}`
], { cwd: root, encoding: "utf8" });
assert.notEqual(missing.status, 0);
assert.match(missing.stderr, /Approved anchor file is missing/);

console.log("art continuity PoC: PASS");
