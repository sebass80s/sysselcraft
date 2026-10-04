#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const API_URL = "https://api.openai.com/v1/images/edits";
const DEFAULT_MODEL = process.env.SYC_IMAGE_MODEL || "gpt-image-2.5-sunburst";
const DEFAULT_SIZE = process.env.SYC_IMAGE_SIZE || "1536x1024";
const DEFAULT_QUALITY = process.env.SYC_IMAGE_QUALITY || "high";
const MAX_INPUT_IMAGES = 16;

function fail(message) {
  console.error("\nSYSSSELCRAFT IMAGE GENERATION FAILED:\n" + message + "\n");
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

function mimeFor(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    default: fail(`Unsupported reference image format: ${filePath}`);
  }
}

function sanitize(name) {
  return name.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
}

function assertTask(task) {
  if (!task?.sceneId) fail("Every task needs sceneId.");
  if (!task?.prompt) fail(`Task ${task.sceneId} is missing prompt.`);
  if (!Array.isArray(task.referenceImagePaths) || task.referenceImagePaths.length === 0) {
    fail(`Task ${task.sceneId} has no referenceImagePaths.`);
  }
  if (task.referenceImagePaths.length > MAX_INPUT_IMAGES) {
    fail(`Task ${task.sceneId} has ${task.referenceImagePaths.length} refs; API maximum is ${MAX_INPUT_IMAGES}.`);
  }

  for (const ref of task.referenceImagePaths) {
    if (!fs.existsSync(ref)) fail(`Task ${task.sceneId} is missing reference file: ${ref}`);
  }

  for (const charSheet of task.characterSheetPaths ?? []) {
    if (!charSheet.startsWith("public/assets/village/character-sheets/") || !charSheet.endsWith(".png")) {
      fail(`Task ${task.sceneId} contains a non-canonical character identity reference: ${charSheet}`);
    }
  }
}

function buildDryRunRecord(task, config) {
  return {
    sceneId: task.sceneId,
    model: config.model,
    size: config.size,
    quality: config.quality,
    referenceCount: task.referenceImagePaths.length,
    references: task.referenceImagePaths,
    promptLength: task.prompt.length,
    outputFile: config.outputFile,
  };
}

async function generateOne(task, config) {
  const form = new FormData();
  form.set("model", config.model);
  form.set("prompt", task.prompt);
  form.set("size", config.size);
  form.set("quality", config.quality);
  form.set("output_format", "png");
  form.set("n", "1");

  if (/^gpt-image-1(?:\.5)?$/.test(config.model)) {
    form.set("input_fidelity", "high");
  }

  for (const refPath of task.referenceImagePaths) {
    const bytes = fs.readFileSync(refPath);
    const blob = new Blob([bytes], { type: mimeFor(refPath) });
    form.append("image[]", blob, path.basename(refPath));
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: form,
  });

  const requestId = response.headers.get("x-request-id");
  const bodyText = await response.text();
  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    throw new Error(`HTTP ${response.status}: non-JSON response${requestId ? ` (request ${requestId})` : ""}`);
  }

  if (!response.ok) {
    const message = payload?.error?.message || JSON.stringify(payload);
    throw new Error(`HTTP ${response.status}: ${message}${requestId ? ` (request ${requestId})` : ""}`);
  }

  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`API returned no image data${requestId ? ` (request ${requestId})` : ""}`);

  fs.mkdirSync(path.dirname(config.outputFile), { recursive: true });
  fs.writeFileSync(config.outputFile, Buffer.from(b64, "base64"));

  return {
    sceneId: task.sceneId,
    status: "generated",
    outputFile: config.outputFile,
    requestId,
    model: payload.model || config.model,
    size: payload.size || config.size,
    quality: payload.quality || config.quality,
    referenceCount: task.referenceImagePaths.length,
    references: task.referenceImagePaths,
    qaChecks: task.qaChecks ?? [],
    generatedAt: new Date().toISOString(),
  };
}

const args = parseArgs(process.argv.slice(2));
const input = args.input ? String(args.input) : null;
if (!input) {
  fail("Usage: node scripts/generate-image-batch.mjs --input=<scenes-01.json> [--out=<dir>] [--dry-run]");
}

const batch = readJson(input);
if (!Array.isArray(batch.tasks) || batch.tasks.length === 0) fail("Input batch contains no tasks.");

const dryRun = args["dry-run"] === true || args["dry-run"] === "true";
const model = String(args.model || DEFAULT_MODEL);
const size = String(args.size || DEFAULT_SIZE);
const quality = String(args.quality || DEFAULT_QUALITY);
const outDir = String(args.out || path.join("image-pipeline", "generated", path.basename(input, path.extname(input))));
const apiKey = process.env.OPENAI_API_KEY;

if (!dryRun && !apiKey) {
  fail("OPENAI_API_KEY is not set. Export it in your shell or run with --dry-run first.");
}

const results = [];
let hadError = false;

for (let index = 0; index < batch.tasks.length; index += 1) {
  const task = batch.tasks[index];
  assertTask(task);

  const filename = `${String(index + 1).padStart(2, "0")}-${sanitize(task.sceneId)}.png`;
  const outputFile = path.join(outDir, filename);
  const config = { apiKey, model, size, quality, outputFile };

  if (dryRun) {
    results.push({ ...buildDryRunRecord(task, config), status: "dry-run" });
    console.log(`DRY RUN [${index + 1}/${batch.tasks.length}] ${task.sceneId}: ${task.referenceImagePaths.length} refs -> ${outputFile}`);
    continue;
  }

  console.log(`GENERATE [${index + 1}/${batch.tasks.length}] ${task.sceneId}: ${task.referenceImagePaths.length} refs`);
  try {
    const result = await generateOne(task, config);
    results.push(result);
    console.log(`  ✓ ${result.outputFile}`);
  } catch (error) {
    hadError = true;
    const message = error instanceof Error ? error.message : String(error);
    results.push({
      sceneId: task.sceneId,
      status: "failed",
      error: message,
      references: task.referenceImagePaths,
      failedAt: new Date().toISOString(),
    });
    console.error(`  ✗ ${message}`);
  }
}

const resultFile = path.join(outDir, "generation-results.json");
writeJson(resultFile, {
  inputBatch: input,
  dryRun,
  model,
  size,
  quality,
  taskCount: batch.tasks.length,
  generatedCount: results.filter((x) => x.status === "generated").length,
  failedCount: results.filter((x) => x.status === "failed").length,
  results,
});

console.log(`\nResult log: ${resultFile}`);
if (hadError) process.exit(2);
