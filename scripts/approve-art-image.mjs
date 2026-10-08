#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error("\nSYSSELCRAFT ART APPROVAL FAILED:\n" + message + "\n");
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
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { fail(`Could not read ${file}: ${error.message}`); }
}
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

const args = parseArgs(process.argv.slice(2));
const manifestPath = args.manifest ? String(args.manifest) : null;
const beatId = args.beat ? String(args.beat) : null;
const outputRef = args.output ? String(args.output) : null;
const chatLibraryPath = args["chat-library-path"] ? String(args["chat-library-path"]) : null;
if (!manifestPath || !beatId || (!outputRef && !chatLibraryPath)) {
  fail("Usage: node scripts/approve-art-image.mjs --manifest=<manifest.json> --beat=<beat-id> (--output=<approved-image.png> | --chat-library-path=<persistent-path>) [--approvals=<file>]");
}
if (outputRef && !fs.existsSync(outputRef)) fail(`Approved image does not exist: ${outputRef}`);

const manifest = readJson(manifestPath);
if (!manifest.beats?.some((beat) => beat.id === beatId)) fail(`Unknown beat "${beatId}".`);
const approvalPath = String(args.approvals ?? `image-pipeline/approvals/${manifest.productionId}.json`);
const approvals = fs.existsSync(approvalPath)
  ? readJson(approvalPath)
  : { version: 1, productionId: manifest.productionId, items: {} };

approvals.items ??= {};
approvals.items[beatId] = {
  ...(approvals.items[beatId] ?? {}),
  status: "approved",
  outputRef: outputRef ?? approvals.items[beatId]?.outputRef ?? null,
  chatLibraryPath: chatLibraryPath ?? approvals.items[beatId]?.chatLibraryPath ?? null,
  identityPassed: true,
  continuityPassed: true,
  notes: args.notes ? String(args.notes) : approvals.items[beatId]?.notes ?? ""
};
writeJson(approvalPath, approvals);
console.log(`APPROVED: ${beatId} -> ${outputRef ?? chatLibraryPath}`);
