#!/usr/bin/env node
import {
  parseArgs,
  readJson,
  writeJson,
  validateManifest,
  ensureApprovalState,
  candidateKey,
  fail
} from "./lib/art-pipeline.mjs";

try {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = args.manifest ? String(args.manifest) : null;
  const beatId = args.beat ? String(args.beat) : null;
  if (!manifestPath || !beatId) {
    fail("Usage: node scripts/approve-art-image.mjs --manifest=<manifest.json> --beat=<beat-id> [--approvals=<file>]");
  }

  const manifest = readJson(manifestPath);
  validateManifest(manifest);
  const beat = manifest.beats.find((item) => item.id === beatId);
  if (!beat) fail(`Unknown beat "${beatId}".`);

  const approvalPath = String(args.approvals ?? `image-pipeline/approvals/${manifest.productionId}.json`);
  const approvals = ensureApprovalState(manifest, approvalPath);
  const item = approvals.items[beatId];

  if (!item?.candidate || !candidateKey(item.candidate)) {
    fail(`Beat ${beatId} has no QA-bound candidate image.`);
  }
  if (item.qa?.verdict !== "pass") {
    fail(`Beat ${beatId} cannot be approved because QA verdict is "${item.qa?.verdict ?? "missing"}".`);
  }
  if (item.qa.candidateKey !== candidateKey(item.candidate)) {
    fail(`Beat ${beatId} QA result does not match the current candidate image.`);
  }
  if (item.qa.required.some((checkId) => !item.qa.passed.includes(checkId))) {
    fail(`Beat ${beatId} is missing one or more required QA passes.`);
  }

  approvals.items[beatId] = {
    ...item,
    status: "approved",
    approved: {
      ...item.candidate,
      qaPassed: [...item.qa.passed],
      establishesLocation: beat.establishLocation === true,
      locationId: beat.locationId ?? null,
      repoOutputPath: beat.outputPath ?? null
    },
    notes: args.notes ? String(args.notes) : item.notes ?? ""
  };

  writeJson(approvalPath, approvals);
  console.log(`APPROVED: ${beatId} -> ${candidateKey(item.candidate)}`);
} catch (error) {
  console.error("\nSYSSELCRAFT ART APPROVAL FAILED:\n" + error.message + "\n");
  process.exit(1);
}
