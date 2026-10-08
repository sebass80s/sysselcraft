#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const builder = path.join(root, "scripts/build-art-job.mjs");
const qa = path.join(root, "scripts/qa-art-image.mjs");
const approver = path.join(root, "scripts/approve-art-image.mjs");
const sourceManifest = path.join(root, "image-pipeline/batches/poc-art-pipeline-v2.json");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sysselcraft-art-v2-"));
const manifest = path.join(temp, "manifest.json");
const approvals = path.join(temp, "approvals.json");
fs.copyFileSync(sourceManifest, manifest);

function invoke(script, args, allowed = [0]) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8"
  });
  assert.ok(
    allowed.includes(result.status),
    `Unexpected exit ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
  );
  return result;
}

function build(beat, manifestPath = manifest, approvalPath = approvals) {
  const out = path.join(temp, beat + "-" + Math.random().toString(36).slice(2) + ".job.json");
  invoke(builder, [
    `--manifest=${manifestPath}`,
    `--beat=${beat}`,
    `--approvals=${approvalPath}`,
    `--out=${out}`
  ]);
  return JSON.parse(fs.readFileSync(out, "utf8"));
}

function qaPass(beat, checkIds, libraryPath, manifestPath = manifest, approvalPath = approvals) {
  invoke(qa, [
    `--manifest=${manifestPath}`,
    `--beat=${beat}`,
    `--chat-library-path=${libraryPath}`,
    `--pass=${checkIds.join(",")}`,
    `--approvals=${approvalPath}`
  ]);
}

function approve(beat, manifestPath = manifest, approvalPath = approvals) {
  invoke(approver, [
    `--manifest=${manifestPath}`,
    `--beat=${beat}`,
    `--approvals=${approvalPath}`
  ]);
}

const baseChecks = [
  "identity",
  "exact-cast",
  "location",
  "hard-rules",
  "wardrobe",
  "barnet-face-hidden"
];
const continuityChecks = [
  "identity",
  "exact-cast",
  "location",
  "hard-rules",
  "wardrobe",
  "continuity",
  "barnet-face-hidden"
];

// 1. First harbor beat establishes location and contains only canonical identity refs.
const harbor1 = build("V2-001");
assert.equal(harbor1.version, 2);
assert.equal(harbor1.locationId, "town-harbor");
assert.equal(harbor1.establishLocation, true);
assert.equal(
  harbor1.outputContract.repoOutputPath,
  "public/assets/village/story-moments/act3/poc/V2-001.png"
);
assert.equal(harbor1.referenceContract.locationAnchor, null);
assert.equal(harbor1.referenceContract.previousBeatAnchor, null);
assert.deepEqual(harbor1.characters, ["alve", "barnet", "nova"]);
assert.equal(harbor1.characterRefs.length, 3);
assert.deepEqual(harbor1.chatLibraryReferencePaths, [
  "/SysselCraft/Art References/characters/alve.png",
  "/SysselCraft/Art References/characters/barnet.png",
  "/SysselCraft/Art References/characters/nova.png"
]);
assert.match(harbor1.prompt, /EXACT CAST LAW/);
assert.match(harbor1.prompt, /Show exactly these recurring characters: Alve, Barnet, Nova/);
assert.match(harbor1.prompt, /Do not add any extra people or animals/);
assert.match(harbor1.prompt, /Wardrobe is locked/);
assert.deepEqual(harbor1.qa.requiredCheckIds, baseChecks);

// Approval without QA must fail.
{
  const result = invoke(approver, [
    `--manifest=${manifest}`,
    "--beat=V2-001",
    `--approvals=${approvals}`
  ], [1]);
  assert.match(result.stderr, /QA-bound candidate|QA verdict/);
}

// Incomplete QA must not become approvable.
{
  const result = invoke(qa, [
    `--manifest=${manifest}`,
    "--beat=V2-001",
    "--chat-library-path=/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-001.png",
    "--pass=identity,exact-cast,location,hard-rules,wardrobe",
    `--approvals=${approvals}`
  ], [2]);
  assert.match(result.stdout, /QA PENDING/);

  const denied = invoke(approver, [
    `--manifest=${manifest}`,
    "--beat=V2-001",
    `--approvals=${approvals}`
  ], [1]);
  assert.match(denied.stderr, /QA verdict is "pending"/);
}

qaPass(
  "V2-001",
  baseChecks,
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-001.png"
);
approve("V2-001");
{
  const state = JSON.parse(fs.readFileSync(approvals, "utf8"));
  assert.equal(
    state.items["V2-001"].approved.repoOutputPath,
    "public/assets/village/story-moments/act3/poc/V2-001.png"
  );
}

// 2. Second harbor beat gets one stable location anchor + one short-range previous beat.
// They may point to the same raster, but roles remain separate and combined paths dedupe.
const harbor2 = build("V2-002");
assert.equal(harbor2.referenceContract.locationAnchor.beatId, "V2-001");
assert.equal(harbor2.referenceContract.previousBeatAnchor.beatId, "V2-001");
assert.deepEqual(harbor2.chatLibraryLocationAnchorPaths, [
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-001.png"
]);
assert.deepEqual(harbor2.chatLibraryPreviousBeatAnchorPaths, [
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-001.png"
]);
assert.equal(harbor2.chatLibraryImagePaths.length, 4);
assert.deepEqual(harbor2.qa.requiredCheckIds, continuityChecks);

qaPass(
  "V2-002",
  continuityChecks,
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-002.png"
);
approve("V2-002");

// 3. Moving to a new location must NOT drag harbor anchors into the park.
const park1 = build("V2-003");
assert.equal(park1.locationId, "town-park");
assert.equal(park1.referenceContract.locationAnchor, null);
assert.equal(park1.referenceContract.previousBeatAnchor, null);
assert.equal(park1.chatLibraryAnchorPaths.length, 0);
assert.match(park1.prompt, /establishes the canonical visual anchor for location "town-park"/);

qaPass(
  "V2-003",
  baseChecks,
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-003.png"
);
approve("V2-003");

// 4. Continuing in the park uses only park continuity.
const park2 = build("V2-004");
assert.equal(park2.referenceContract.locationAnchor.beatId, "V2-003");
assert.equal(park2.referenceContract.previousBeatAnchor.beatId, "V2-003");
assert.ok(!park2.chatLibraryAnchorPaths.some((item) => item.includes("V2-001") || item.includes("V2-002")));

qaPass(
  "V2-004",
  continuityChecks,
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-004.png"
);
approve("V2-004");

// 5. Returning to harbor restores harbor location lineage and latest harbor beat,
// not the more recent park images.
const harborReturn = build("V2-005");
assert.equal(harborReturn.referenceContract.locationAnchor.beatId, "V2-001");
assert.equal(harborReturn.referenceContract.previousBeatAnchor.beatId, "V2-002");
assert.deepEqual(harborReturn.chatLibraryAnchorPaths.sort(), [
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-001.png",
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-002.png"
].sort());
assert.ok(!harborReturn.chatLibraryAnchorPaths.some((item) => item.includes("V2-003") || item.includes("V2-004")));

// 6. QA is bound to one exact candidate. Swapping candidate after QA invalidates approval.
qaPass(
  "V2-005",
  continuityChecks,
  "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-005-A.png"
);
{
  const state = JSON.parse(fs.readFileSync(approvals, "utf8"));
  state.items["V2-005"].candidate.chatLibraryPath =
    "/SysselCraft/Art References/anchors/poc-art-pipeline-v2/V2-005-B.png";
  fs.writeFileSync(approvals, JSON.stringify(state, null, 2));

  const result = invoke(approver, [
    `--manifest=${manifest}`,
    "--beat=V2-005",
    `--approvals=${approvals}`
  ], [1]);
  assert.match(result.stderr, /QA result does not match the current candidate image/);
}

// 7. Safety contracts fail closed.
{
  const badManifest = path.join(temp, "bad-barnet.json");
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  data.beats[0].barnetFaceHidden = false;
  fs.writeFileSync(badManifest, JSON.stringify(data, null, 2));
  const result = invoke(builder, [
    `--manifest=${badManifest}`,
    "--beat=V2-001",
    `--approvals=${path.join(temp, "bad-barnet-approvals.json")}`,
    `--out=${path.join(temp, "bad-barnet-job.json")}`
  ], [1]);
  assert.match(result.stderr, /must set barnetFaceHidden=true/);
}

{
  const badManifest = path.join(temp, "bad-emotion.json");
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  data.beats[0].emotions.linus = "should not exist";
  fs.writeFileSync(badManifest, JSON.stringify(data, null, 2));
  const result = invoke(builder, [
    `--manifest=${badManifest}`,
    "--beat=V2-001",
    `--approvals=${path.join(temp, "bad-emotion-approvals.json")}`,
    `--out=${path.join(temp, "bad-emotion-job.json")}`
  ], [1]);
  assert.match(result.stderr, /emotion for non-cast character "linus"/);
}

{
  const badManifest = path.join(temp, "cross-location.json");
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  data.beats[2].continuityFrom = "V2-002";
  fs.writeFileSync(badManifest, JSON.stringify(data, null, 2));
  const result = invoke(builder, [
    `--manifest=${badManifest}`,
    "--beat=V2-003",
    `--approvals=${approvals}`,
    `--out=${path.join(temp, "cross-location-job.json")}`
  ], [1]);
  assert.match(result.stderr, /cannot inherit previous-beat continuity across locations/);
}


{
  const badManifest = path.join(temp, "missing-output-path.json");
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  delete data.beats[0].outputPath;
  fs.writeFileSync(badManifest, JSON.stringify(data, null, 2));
  const result = invoke(builder, [
    `--manifest=${badManifest}`,
    "--beat=V2-001",
    `--approvals=${path.join(temp, "missing-output-approvals.json")}`,
    `--out=${path.join(temp, "missing-output-job.json")}`
  ], [1]);
  assert.match(result.stderr, /requires a canonical Act 3 PNG outputPath/);
}

{
  const badManifest = path.join(temp, "duplicate-output-path.json");
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  data.beats[1].outputPath = data.beats[0].outputPath;
  fs.writeFileSync(badManifest, JSON.stringify(data, null, 2));
  const result = invoke(builder, [
    `--manifest=${badManifest}`,
    "--beat=V2-001",
    `--approvals=${path.join(temp, "duplicate-output-approvals.json")}`,
    `--out=${path.join(temp, "duplicate-output-job.json")}`
  ], [1]);
  assert.match(result.stderr, /Duplicate v2 outputPath/);
}

console.log("art pipeline v2: PASS");
