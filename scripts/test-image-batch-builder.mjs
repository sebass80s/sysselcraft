#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const builder = path.join(root, "scripts/build-image-batch.mjs");
const canonicalRegistry = path.join(root, "image-pipeline/character-registry.json");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sysselcraft-image-batch-"));

function run(args) {
  return spawnSync(process.execPath, [builder, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

// 1. Chunking: 6 scenes => 5 + 1.
{
  const batch = path.join(temp, "chunking.json");
  const out = path.join(temp, "chunking-out");
  const approvals = path.join(temp, "chunking-approvals.json");
  writeJson(batch, {
    batchId: "test-chunking",
    batchSize: 5,
    scenes: Array.from({ length: 6 }, (_, i) => ({
      id: `SCENE-${i + 1}`,
      characters: ["sol"],
      prompt: `Test scene ${i + 1}`
    }))
  });

  const result = run([
    `--registry=${canonicalRegistry}`,
    `--batch=${batch}`,
    `--out=${out}`,
    `--approvals=${approvals}`
  ]);
  assert.equal(result.status, 0, result.stderr);

  const first = JSON.parse(fs.readFileSync(path.join(out, "scenes-01.json"), "utf8"));
  const second = JSON.parse(fs.readFileSync(path.join(out, "scenes-02.json"), "utf8"));
  assert.equal(first.count, 5);
  assert.equal(second.count, 1);
  assert.deepEqual(first.tasks[0].characterSheetPaths, [
    "public/assets/village/character-sheets/sol.png"
  ]);
}

// 2. Fail closed if a registry tries to use a runtime asset as character identity.
{
  const registry = JSON.parse(fs.readFileSync(canonicalRegistry, "utf8"));
  registry.characters.sol.characterSheet = "public/assets/village/reboot/sol-runtime.png";
  const badRegistry = path.join(temp, "bad-registry.json");
  const batch = path.join(temp, "bad-registry-batch.json");
  writeJson(badRegistry, registry);
  writeJson(batch, {
    batchId: "test-bad-registry",
    scenes: [{ id: "SCENE-1", characters: ["sol"], prompt: "Test" }]
  });

  const result = run([
    `--registry=${badRegistry}`,
    `--batch=${batch}`,
    `--out=${path.join(temp, "bad-out")}`,
    `--approvals=${path.join(temp, "bad-approvals.json")}`
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must use exactly one PNG under public\/assets\/village\/character-sheets\//);
}

// 3. Anchor-first: scenes are blocked until the anchor is explicitly approved.
{
  const batch = path.join(temp, "anchor.json");
  const out = path.join(temp, "anchor-out");
  const approvals = path.join(temp, "anchor-approvals.json");
  writeJson(batch, {
    batchId: "test-anchor",
    anchors: [{
      id: "ANCHOR-1",
      characters: ["sol", "alve"],
      prompt: "Canonical continuity anchor"
    }],
    scenes: [{
      id: "SCENE-1",
      characters: ["sol", "alve"],
      useAnchors: ["ANCHOR-1"],
      prompt: "Scene using the approved anchor"
    }]
  });

  let result = run([
    `--registry=${canonicalRegistry}`,
    `--batch=${batch}`,
    `--out=${out}`,
    `--approvals=${approvals}`
  ]);
  assert.equal(result.status, 0, result.stderr);
  let status = JSON.parse(fs.readFileSync(path.join(out, "status.json"), "utf8"));
  assert.equal(status.phase, "anchors-required");
  assert.ok(fs.existsSync(path.join(out, "anchors-01.json")));
  assert.equal(fs.existsSync(path.join(out, "scenes-01.json")), false);

  const approvalLog = JSON.parse(fs.readFileSync(approvals, "utf8"));
  approvalLog.items["ANCHOR-1"] = {
    status: "approved",
    outputRef: "approved/anchor-1.png",
    notes: "accepted"
  };
  writeJson(approvals, approvalLog);

  result = run([
    `--registry=${canonicalRegistry}`,
    `--batch=${batch}`,
    `--out=${out}`,
    `--approvals=${approvals}`
  ]);
  assert.equal(result.status, 0, result.stderr);
  status = JSON.parse(fs.readFileSync(path.join(out, "status.json"), "utf8"));
  assert.equal(status.phase, "scenes-ready");

  const scenes = JSON.parse(fs.readFileSync(path.join(out, "scenes-01.json"), "utf8"));
  assert.deepEqual(scenes.tasks[0].anchorReferencePaths, ["approved/anchor-1.png"]);
  assert.deepEqual(scenes.tasks[0].characterSheetPaths, [
    "public/assets/village/character-sheets/sol.png",
    "public/assets/village/character-sheets/alve.png"
  ]);
}

console.log("image batch builder tests: PASS");
