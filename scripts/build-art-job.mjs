#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DEFAULT_REGISTRY = "image-pipeline/character-registry.json";
const CANONICAL_SHEET_ROOT = "public/assets/village/character-sheets/";

function fail(message) {
  console.error("\nSYSSELCRAFT ART JOB FAILED:\n" + message + "\n");
  process.exit(1);
}

function parseArgs(argv) {
  const out = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const [key, ...rest] = raw.slice(2).split("=");
    out[key] = rest.length ? rest.join("=") : true;
  }
  return out;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Could not read ${filePath}: ${error.message}`);
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function canonicalCharacterRefsFor(beat, registry) {
  return (beat.characters ?? []).map((id) => {
    const character = registry.characters?.[id];
    if (!character) fail(`Unknown character "${id}" in beat ${beat.id}.`);
    const sheet = character.characterSheet;
    if (
      typeof sheet !== "string" ||
      !sheet.startsWith(CANONICAL_SHEET_ROOT) ||
      !sheet.endsWith(".png")
    ) {
      fail(`Character "${id}" does not use a canonical PNG character sheet.`);
    }
    if (!fs.existsSync(sheet)) fail(`Missing canonical sheet for "${id}": ${sheet}`);
    if (!character.chatLibraryPath) fail(`Character "${id}" has no persistent ChatGPT Library path.`);
    return {
      characterId: id,
      repoPath: sheet,
      chatLibraryPath: character.chatLibraryPath
    };
  });
}

function ensureApprovalState(manifest, approvalPath) {
  const state = fs.existsSync(approvalPath)
    ? readJson(approvalPath)
    : { version: 1, productionId: manifest.productionId, items: {} };

  state.version ??= 1;
  state.productionId = manifest.productionId;
  state.items ??= {};

  for (const beat of manifest.beats) {
    state.items[beat.id] ??= {
      status: "pending",
      outputRef: null,
      identityPassed: false,
      continuityPassed: false,
      notes: ""
    };
  }

  writeJson(approvalPath, state);
  return state;
}

function sameCharacters(a = [], b = []) {
  if (a.length !== b.length) return false;
  const aa = [...a].sort();
  const bb = [...b].sort();
  return aa.every((value, index) => value === bb[index]);
}

function approvedAnchorsFor(beat, manifest, approvals) {
  const policy = beat.continuity?.policy ?? manifest.continuity?.policy ?? "latest-approved-same-group";
  const depth = Math.max(0, Number(beat.continuity?.anchorDepth ?? manifest.continuity?.anchorDepth ?? 2));
  if (policy === "none" || depth === 0) return [];

  const index = manifest.beats.findIndex((item) => item.id === beat.id);
  if (index < 0) fail(`Beat ${beat.id} is not in manifest order.`);

  const group = beat.continuityGroup ?? manifest.continuityGroup ?? "default";
  const candidates = manifest.beats
    .slice(0, index)
    .filter((candidate) => (candidate.continuityGroup ?? manifest.continuityGroup ?? "default") === group)
    .filter((candidate) => {
      const approval = approvals.items?.[candidate.id];
      return approval?.status === "approved" &&
        (approval.outputRef || approval.chatLibraryPath) &&
        approval.identityPassed === true &&
        approval.continuityPassed === true;
    });

  let eligible = candidates;
  if (policy === "latest-approved-same-cast") {
    eligible = candidates.filter((candidate) => sameCharacters(candidate.characters, beat.characters));
  } else if (policy !== "latest-approved-same-group") {
    fail(`Unsupported continuity policy "${policy}" in beat ${beat.id}.`);
  }

  return eligible.slice(-depth).reverse().map((candidate) => ({
    beatId: candidate.id,
    outputRef: approvals.items[candidate.id].outputRef ?? null,
    chatLibraryPath: approvals.items[candidate.id].chatLibraryPath ?? null
  }));
}

function compilePrompt(beat, registry, anchors) {
  const names = (beat.characters ?? []).map((id) => registry.characters[id]?.displayName ?? id);
  const lines = [
    "Create ONE finished SysselCraft story image.",
    "",
    "BEAT:",
    beat.summary,
    "",
    "CANONICAL IDENTITY LAW:",
    "- The supplied canonical character sheets are the primary authority for recurring character identity.",
    "- Preserve face, hair, clothing, age read, proportions and silhouette.",
    "- Do not invent or reinterpret recurring characters.",
  ];

  if (names.length) lines.push(`- Required recurring characters: ${names.join(", ")}.`);

  if (anchors.length) {
    lines.push(
      "",
      "CONTINUITY LAW:",
      "- The supplied approved continuity anchors show the already-accepted visual series.",
      "- Preserve established rendering language, scale, clothing, geography and character read from those anchors.",
      "- Canonical character sheets outrank anchors if an anchor contains accidental identity drift."
    );
  }

  for (const rule of registry.globalRules ?? []) lines.push("- " + rule);

  if (beat.shot) lines.push("", "SHOT:", beat.shot);
  if (beat.mood) lines.push("MOOD:", beat.mood);

  if (beat.rules?.length) {
    lines.push("", "BEAT RULES:", ...beat.rules.map((rule) => "- " + rule));
  }
  if (beat.mustNot?.length) {
    lines.push("", "MUST NOT SHOW:", ...beat.mustNot.map((rule) => "- " + rule));
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const args = parseArgs(process.argv.slice(2));
const manifestPath = args.manifest ? String(args.manifest) : null;
const beatId = args.beat ? String(args.beat) : null;
if (!manifestPath || !beatId) {
  fail("Usage: node scripts/build-art-job.mjs --manifest=<manifest.json> --beat=<beat-id> [--out=<job.json>] [--approvals=<approvals.json>]");
}

const manifest = readJson(manifestPath);
if (!manifest?.productionId || !Array.isArray(manifest.beats) || manifest.beats.length === 0) {
  fail("Manifest requires productionId and non-empty beats[].");
}

const beat = manifest.beats.find((item) => item.id === beatId);
if (!beat) fail(`Unknown beat "${beatId}".`);
if (!beat.summary) fail(`Beat ${beatId} requires summary.`);

const registry = readJson(String(args.registry ?? DEFAULT_REGISTRY));
const approvalPath = String(args.approvals ?? `image-pipeline/approvals/${manifest.productionId}.json`);
const approvals = ensureApprovalState(manifest, approvalPath);
const anchors = approvedAnchorsFor(beat, manifest, approvals);
const characterRefs = canonicalCharacterRefsFor(beat, registry);
const characterSheetPaths = characterRefs.map((ref) => ref.repoPath);
const chatLibraryReferencePaths = characterRefs.map((ref) => ref.chatLibraryPath);
const environmentReferencePaths = uniq([
  ...(manifest.environmentRefs ?? []),
  ...(beat.environmentRefs ?? [])
]);

for (const ref of environmentReferencePaths) {
  if (!fs.existsSync(ref)) fail(`Missing environment reference for ${beat.id}: ${ref}`);
}

const anchorReferencePaths = anchors.map((anchor) => anchor.outputRef).filter(Boolean);
const chatLibraryAnchorPaths = anchors.map((anchor) => anchor.chatLibraryPath).filter(Boolean);
for (const ref of anchorReferencePaths) {
  if (!fs.existsSync(ref)) fail(`Approved anchor file is missing for ${beat.id}: ${ref}`);
}

const qaChecks = uniq([
  ...(registry.globalQaChecks ?? []),
  ...(manifest.qaChecks ?? []),
  ...(beat.qaChecks ?? []),
  ...(beat.mustNot ?? []).map((item) => "Must not contain: " + item)
]);

const job = {
  version: 1,
  productionId: manifest.productionId,
  beatId: beat.id,
  title: beat.title ?? beat.id,
  continuityGroup: beat.continuityGroup ?? manifest.continuityGroup ?? "default",
  characters: beat.characters ?? [],
  characterRefs,
  characterSheetPaths,
  chatLibraryReferencePaths,
  environmentReferencePaths,
  continuityAnchors: anchors,
  anchorReferencePaths,
  chatLibraryAnchorPaths,
  referenceImagePaths: uniq([
    ...characterSheetPaths,
    ...environmentReferencePaths,
    ...anchorReferencePaths
  ]),
  prompt: compilePrompt(beat, registry, anchors),
  qaChecks,
  approval: approvals.items[beat.id],
  outputContract: {
    aspectRatio: beat.aspectRatio ?? manifest.aspectRatio ?? "16:9",
    targetPath: beat.outputPath ?? null,
    chatLibraryPath: `${registry.chatLibraryAnchorRoot ?? "/SysselCraft/Art References/anchors"}/${manifest.productionId}/${beat.id}.png`
  }
};

const outPath = String(args.out ?? `image-pipeline/out/${manifest.productionId}/${beat.id}.job.json`);
writeJson(outPath, job);
console.log(`ART JOB READY: ${beat.id}`);
console.log(`  canonical refs: ${characterSheetPaths.length}`);
console.log(`  ChatGPT persistent refs: ${chatLibraryReferencePaths.length}`);
console.log(`  continuity anchors: ${anchors.length}`);
console.log(`  local anchor refs: ${anchorReferencePaths.length}`);
console.log(`  ChatGPT anchor refs: ${chatLibraryAnchorPaths.length}`);
console.log(`  output: ${outPath}`);
