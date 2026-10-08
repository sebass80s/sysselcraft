#!/usr/bin/env node
import {
  DEFAULT_REGISTRY,
  parseArgs,
  readJson,
  writeJson,
  validateManifest,
  ensureApprovalState,
  requiredQaChecks,
  candidateKey,
  fail
} from "./lib/art-pipeline.mjs";

try {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = args.manifest ? String(args.manifest) : null;
  const beatId = args.beat ? String(args.beat) : null;
  const outputRef = args.output ? String(args.output) : null;
  const chatLibraryPath = args["chat-library-path"] ? String(args["chat-library-path"]) : null;
  const pass = new Set(String(args.pass ?? "").split(",").map((x) => x.trim()).filter(Boolean));
  const failed = new Set(String(args.fail ?? "").split(",").map((x) => x.trim()).filter(Boolean));

  if (!manifestPath || !beatId || (!outputRef && !chatLibraryPath)) {
    fail("Usage: node scripts/qa-art-image.mjs --manifest=<manifest.json> --beat=<beat-id> (--output=<file> | --chat-library-path=<path>) --pass=<check-ids> [--fail=<check-ids>]");
  }

  const manifest = readJson(manifestPath);
  validateManifest(manifest);
  const beat = manifest.beats.find((item) => item.id === beatId);
  if (!beat) fail(`Unknown beat "${beatId}".`);

  const registry = readJson(String(args.registry ?? DEFAULT_REGISTRY));
  const approvalPath = String(args.approvals ?? `image-pipeline/approvals/${manifest.productionId}.json`);
  const approvals = ensureApprovalState(manifest, approvalPath);

  const hasContinuity = beat.establishLocation !== true || Boolean(beat.continuityFrom);
  const required = manifest.version === 2
    ? requiredQaChecks(beat, hasContinuity)
    : ["identity", "hard-rules"];

  for (const id of [...pass, ...failed]) {
    if (!required.includes(id)) fail(`Unknown/unrequired QA check "${id}" for beat ${beatId}.`);
  }
  for (const id of pass) {
    if (failed.has(id)) fail(`QA check "${id}" cannot both pass and fail.`);
  }

  const missing = required.filter((id) => !pass.has(id) && !failed.has(id));
  const verdict = failed.size > 0 ? "fail" : missing.length === 0 ? "pass" : "pending";
  const candidate = {
    outputRef: outputRef ?? null,
    chatLibraryPath: chatLibraryPath ?? null
  };

  approvals.items[beatId] = {
    ...(approvals.items[beatId] ?? {}),
    status: verdict === "pass" ? "qa-passed" : verdict === "fail" ? "qa-failed" : "qa-pending",
    candidate,
    qa: {
      candidateKey: candidateKey(candidate),
      required,
      passed: [...pass],
      failed: [...failed],
      missing,
      verdict,
      notes: args.notes ? String(args.notes) : ""
    },
    approved: null,
    notes: args.notes ? String(args.notes) : approvals.items[beatId]?.notes ?? ""
  };

  writeJson(approvalPath, approvals);
  console.log(`QA ${verdict.toUpperCase()}: ${beatId}`);
  console.log(`  required: ${required.join(", ")}`);
  console.log(`  passed: ${[...pass].join(", ") || "none"}`);
  console.log(`  failed: ${[...failed].join(", ") || "none"}`);
  console.log(`  missing: ${missing.join(", ") || "none"}`);
  if (verdict !== "pass") process.exitCode = 2;
} catch (error) {
  console.error("\nSYSSELCRAFT ART QA FAILED:\n" + error.message + "\n");
  process.exit(1);
}
