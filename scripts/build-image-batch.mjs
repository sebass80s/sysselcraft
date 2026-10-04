#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const CANONICAL_SHEET_ROOT = "public/assets/village/character-sheets/";

function fail(message) {
  console.error("\nSYSSSELCRAFT IMAGE BATCH FAILED:\n" + message + "\n");
  process.exit(1);
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

function parseArgs(argv) {
  const out = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const [key, ...rest] = raw.slice(2).split("=");
    out[key] = rest.length ? rest.join("=") : true;
  }
  return out;
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function assertCanonicalSheetPath(sheetPath, characterId) {
  if (typeof sheetPath !== "string" || !sheetPath.startsWith(CANONICAL_SHEET_ROOT) || !sheetPath.endsWith(".png")) {
    fail(`Character "${characterId}" must use exactly one PNG under ${CANONICAL_SHEET_ROOT}`);
  }
  if (!fs.existsSync(sheetPath)) {
    fail(`Missing canonical character sheet for "${characterId}": ${sheetPath}`);
  }
}

function validateRegistry(registry) {
  if (!registry?.characters || typeof registry.characters !== "object") fail("Registry is missing characters.");
  for (const [id, character] of Object.entries(registry.characters)) {
    if (Array.isArray(character.characterSheet)) fail(`Character "${id}" may have only one canonical character sheet.`);
    assertCanonicalSheetPath(character.characterSheet, id);
  }
}

function validateManifest(manifest) {
  if (!manifest?.batchId) fail("Batch manifest is missing batchId.");
  if (!Array.isArray(manifest.scenes)) fail("Batch manifest must contain scenes[].");
  if (manifest.anchors && !Array.isArray(manifest.anchors)) fail("anchors must be an array.");
}

function ensureApprovals(manifest, approvalPath) {
  const approvals = fs.existsSync(approvalPath)
    ? readJson(approvalPath)
    : { batchId: manifest.batchId, items: {} };

  approvals.batchId = manifest.batchId;
  approvals.items ??= {};

  for (const item of [...(manifest.anchors ?? []), ...manifest.scenes]) {
    approvals.items[item.id] ??= { status: "pending", outputRef: null, notes: "" };
  }

  writeJson(approvalPath, approvals);
  return approvals;
}

function buildPrompt(scene, registry, characterNames, anchorRefs) {
  const lines = [
    "Create ONE finished SysselCraft story image.",
    "",
    scene.prompt?.trim() ?? "",
    "",
    "CANONICAL CHARACTER LAW:",
    "- Use ONLY the supplied canonical character sheets as identity references for recurring characters.",
    "- Preserve face, hair, clothing, proportions and silhouette from those sheets.",
    "- Never infer identity from runtime sprites, prior story images or environment references."
  ];

  if (characterNames.length) {
    lines.push("- Required recurring characters: " + characterNames.join(", ") + ".");
  }

  if (anchorRefs.length) {
    lines.push(
      "",
      "ANCHOR LAW:",
      "- The approved anchor image(s) control continuity of composition/rendering where relevant.",
      "- Character sheets remain the sole identity authority."
    );
  }

  if (registry.globalRules?.length) {
    lines.push("", "GLOBAL RULES:", ...registry.globalRules.map((rule) => "- " + rule));
  }

  if (scene.rules?.length) {
    lines.push("", "SCENE RULES:", ...scene.rules.map((rule) => "- " + rule));
  }

  if (scene.mustNot?.length) {
    lines.push("", "MUST NOT SHOW:", ...scene.mustNot.map((rule) => "- " + rule));
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function buildTask(scene, manifest, registry, approvals, role = "scene") {
  if (!scene.id) fail("Every scene and anchor needs an id.");

  const characterSheetPaths = [];
  const characterNames = [];

  for (const characterId of scene.characters ?? []) {
    const character = registry.characters[characterId];
    if (!character) fail(`Unknown character "${characterId}" in ${scene.id}.`);
    assertCanonicalSheetPath(character.characterSheet, characterId);
    characterSheetPaths.push(character.characterSheet);
    characterNames.push(character.displayName ?? characterId);
  }

  const anchorRefs = [];
  for (const anchorId of scene.useAnchors ?? []) {
    const approval = approvals.items?.[anchorId];
    if (!approval || approval.status !== "approved" || !approval.outputRef) {
      fail(`Scene ${scene.id} requires anchor ${anchorId}, but it is not approved with an outputRef.`);
    }
    anchorRefs.push(approval.outputRef);
  }

  const environmentRefs = uniq([
    ...(manifest.globalEnvironmentRefs ?? []),
    ...(scene.environmentRefs ?? [])
  ]);

  const referenceImagePaths = uniq([
    ...characterSheetPaths,
    ...environmentRefs,
    ...anchorRefs
  ]);

  const qaChecks = uniq([
    ...(registry.globalQaChecks ?? []),
    ...(scene.qaChecks ?? []),
    ...(scene.mustNot ?? []).map((x) => "Must not contain: " + x)
  ]);

  return {
    sceneId: scene.id,
    title: scene.title ?? scene.id,
    role,
    aspectRatio: scene.aspectRatio ?? manifest.aspectRatio ?? "landscape",
    characters: scene.characters ?? [],
    characterSheetPaths,
    environmentReferencePaths: environmentRefs,
    anchorReferencePaths: anchorRefs,
    referenceImagePaths,
    prompt: buildPrompt(scene, registry, characterNames, anchorRefs),
    qaChecks,
    approval: approvals.items?.[scene.id] ?? { status: "pending", outputRef: null, notes: "" }
  };
}

function writeChunks(tasks, batchSize, outDir, prefix) {
  const groups = chunk(tasks, batchSize);
  groups.forEach((tasksInBatch, index) => {
    writeJson(path.join(outDir, `${prefix}-${String(index + 1).padStart(2, "0")}.json`), {
      batchType: prefix,
      batchNumber: index + 1,
      count: tasksInBatch.length,
      tasks: tasksInBatch
    });
  });
  return groups.length;
}

const args = parseArgs(process.argv.slice(2));
const registryPath = String(args.registry ?? "image-pipeline/character-registry.json");
const batchPath = args.batch ? String(args.batch) : null;
if (!batchPath) fail("Usage: node scripts/build-image-batch.mjs --batch=<manifest.json> [--batch-size=5]");

const registry = readJson(registryPath);
const manifest = readJson(batchPath);
validateRegistry(registry);
validateManifest(manifest);

const batchSize = Math.max(1, Number(args["batch-size"] ?? manifest.batchSize ?? 5));
const outDir = String(args.out ?? path.join("image-pipeline", "out", manifest.batchId));
const approvalPath = String(args.approvals ?? path.join("image-pipeline", "approvals", manifest.batchId + ".json"));

const approvals = ensureApprovals(manifest, approvalPath);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const pendingAnchors = (manifest.anchors ?? []).filter((anchor) => {
  const approval = approvals.items?.[anchor.id];
  return !approval || approval.status !== "approved" || !approval.outputRef;
});

if (pendingAnchors.length) {
  const anchorTasks = pendingAnchors.map((anchor) => buildTask({ ...anchor, useAnchors: [] }, manifest, registry, approvals, "anchor"));
  const fileCount = writeChunks(anchorTasks, batchSize, outDir, "anchors");
  writeJson(path.join(outDir, "status.json"), {
    batchId: manifest.batchId,
    phase: "anchors-required",
    pendingAnchors: pendingAnchors.map((x) => x.id),
    generatedBatchFiles: fileCount,
    approvalLog: approvalPath,
    nextStep: "Generate anchors, mark them approved with outputRef in the approval log, then rerun."
  });
  console.log(`Anchor-first gate active: ${anchorTasks.length} anchor task(s) written to ${outDir}`);
  process.exit(0);
}

const sceneTasks = manifest.scenes.map((scene) => buildTask(scene, manifest, registry, approvals, "scene"));
const fileCount = writeChunks(sceneTasks, batchSize, outDir, "scenes");
writeJson(path.join(outDir, "status.json"), {
  batchId: manifest.batchId,
  phase: "scenes-ready",
  sceneCount: sceneTasks.length,
  batchSize,
  generatedBatchFiles: fileCount,
  approvalLog: approvalPath
});

console.log(`Scenes ready: ${sceneTasks.length} scene task(s) in ${fileCount} batch file(s), max ${batchSize} each.`);
