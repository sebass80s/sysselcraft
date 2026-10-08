#!/usr/bin/env node
import {
  DEFAULT_REGISTRY,
  parseArgs,
  readJson,
  writeJson,
  validateManifest,
  canonicalCharacterRefsFor,
  ensureApprovalState,
  v1ApprovedAnchorsFor,
  resolveV2Anchors,
  requiredQaChecks,
  compileV2Prompt,
  uniq,
  assertLocalReferenceExists,
  fail
} from "./lib/art-pipeline.mjs";

function compileV1Prompt(beat, registry, refs, anchors) {
  const names = refs.map((ref) => ref.displayName);
  const lines = [
    "Create ONE finished SysselCraft story image.",
    "",
    "BEAT:",
    beat.summary ?? beat.prompt ?? "",
    "",
    "CANONICAL IDENTITY LAW:",
    "- Use ONLY the supplied canonical character sheets as identity references for recurring characters.",
    "- Preserve face, hair, clothing, proportions and silhouette from those sheets.",
    "- Never infer identity from runtime sprites, prior story images or environment references."
  ];
  if (names.length) lines.push("- Required recurring characters: " + names.join(", ") + ".");
  if (anchors.length) {
    lines.push(
      "",
      "CONTINUITY LAW:",
      "- Approved anchors control continuity where relevant.",
      "- Character sheets remain the sole identity authority."
    );
  }
  for (const rule of registry.globalRules ?? []) lines.push("- " + rule);
  if (beat.rules?.length) lines.push("", "BEAT RULES:", ...beat.rules.map((rule) => "- " + rule));
  if (beat.mustNot?.length) lines.push("", "MUST NOT SHOW:", ...beat.mustNot.map((rule) => "- " + rule));
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function referencePaths(ref) {
  return {
    local: ref?.outputRef ? [ref.outputRef] : [],
    library: ref?.chatLibraryPath ? [ref.chatLibraryPath] : []
  };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = args.manifest ? String(args.manifest) : null;
  const beatId = args.beat ? String(args.beat) : null;
  if (!manifestPath || !beatId) {
    fail("Usage: node scripts/build-art-job.mjs --manifest=<manifest.json> --beat=<beat-id> [--out=<job.json>] [--approvals=<approvals.json>]");
  }

  const manifest = readJson(manifestPath);
  validateManifest(manifest);
  const beat = manifest.beats.find((item) => item.id === beatId);
  if (!beat) fail(`Unknown beat "${beatId}".`);

  const registry = readJson(String(args.registry ?? DEFAULT_REGISTRY));
  const approvalPath = String(args.approvals ?? `image-pipeline/approvals/${manifest.productionId}.json`);
  const approvals = ensureApprovalState(manifest, approvalPath);
  const characterRefs = canonicalCharacterRefsFor(beat, registry);
  const characterSheetPaths = characterRefs.map((ref) => ref.repoPath);
  const chatLibraryReferencePaths = characterRefs.map((ref) => ref.chatLibraryPath);
  const environmentReferencePaths = uniq([
    ...(manifest.environmentRefs ?? []),
    ...(beat.environmentRefs ?? [])
  ]);
  for (const ref of environmentReferencePaths) assertLocalReferenceExists(ref, `Environment reference for ${beat.id}`);

  let prompt;
  let locationAnchor = null;
  let previousBeatAnchor = null;
  let legacyAnchors = [];

  if (manifest.version === 2) {
    const resolved = resolveV2Anchors(beat, manifest, approvals);
    locationAnchor = resolved.locationAnchor;
    previousBeatAnchor = resolved.previousBeatAnchor;
    prompt = compileV2Prompt(beat, registry, characterRefs, resolved);
  } else {
    legacyAnchors = v1ApprovedAnchorsFor(beat, manifest, approvals);
    prompt = compileV1Prompt(beat, registry, characterRefs, legacyAnchors);
  }

  const localLocation = referencePaths(locationAnchor).local;
  const libraryLocation = referencePaths(locationAnchor).library;
  const localPrevious = referencePaths(previousBeatAnchor).local;
  const libraryPrevious = referencePaths(previousBeatAnchor).library;
  const localLegacy = legacyAnchors.flatMap((ref) => referencePaths(ref).local);
  const libraryLegacy = legacyAnchors.flatMap((ref) => referencePaths(ref).library);

  for (const ref of [...localLocation, ...localPrevious, ...localLegacy]) {
    assertLocalReferenceExists(ref, `Approved anchor for ${beat.id}`);
  }

  const hasContinuityAnchor = Boolean(locationAnchor || previousBeatAnchor || legacyAnchors.length);
  const qaCheckIds = manifest.version === 2
    ? requiredQaChecks(beat, hasContinuityAnchor)
    : ["identity", "hard-rules", ...(hasContinuityAnchor ? ["continuity"] : [])];

  const customQaChecks = uniq([
    ...(registry.globalQaChecks ?? []),
    ...(manifest.qaChecks ?? []),
    ...(beat.qaChecks ?? []),
    ...(beat.mustNot ?? []).map((item) => "Must not contain: " + item)
  ]);

  const job = {
    version: manifest.version,
    productionId: manifest.productionId,
    beatId: beat.id,
    title: beat.title ?? beat.id,
    locationId: beat.locationId ?? null,
    establishLocation: beat.establishLocation === true,
    continuityGroup: beat.continuityGroup ?? manifest.continuityGroup ?? "default",
    characters: beat.characters ?? [],
    exactCastOnly: manifest.version === 2 ? beat.exactCastOnly : null,
    wardrobeLock: manifest.version === 2 ? beat.wardrobeLock : null,
    characterRefs,
    referenceContract: {
      identity: characterRefs,
      locationAnchor,
      previousBeatAnchor,
      legacyAnchors
    },
    // Backward-compatible v1 alias. V2 consumers must use the typed referenceContract fields.
    continuityAnchors: manifest.version === 1 ? legacyAnchors : [],
    characterSheetPaths,
    chatLibraryReferencePaths,
    environmentReferencePaths,
    locationAnchorReferencePaths: localLocation,
    chatLibraryLocationAnchorPaths: libraryLocation,
    previousBeatAnchorReferencePaths: localPrevious,
    chatLibraryPreviousBeatAnchorPaths: libraryPrevious,
    anchorReferencePaths: uniq([...localLegacy, ...localLocation, ...localPrevious]),
    chatLibraryAnchorPaths: uniq([...libraryLegacy, ...libraryLocation, ...libraryPrevious]),
    referenceImagePaths: uniq([
      ...characterSheetPaths,
      ...environmentReferencePaths,
      ...localLocation,
      ...localPrevious,
      ...localLegacy
    ]),
    chatLibraryImagePaths: uniq([
      ...chatLibraryReferencePaths,
      ...libraryLocation,
      ...libraryPrevious,
      ...libraryLegacy
    ]),
    prompt,
    qa: {
      requiredCheckIds: qaCheckIds,
      customChecks: customQaChecks
    },
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
  console.log(`  manifest version: ${manifest.version}`);
  console.log(`  canonical refs: ${characterRefs.length}`);
  console.log(`  location anchor: ${locationAnchor?.beatId ?? "none"}`);
  console.log(`  previous beat anchor: ${previousBeatAnchor?.beatId ?? "none"}`);
  console.log(`  required QA: ${qaCheckIds.join(", ")}`);
  console.log(`  output: ${outPath}`);
} catch (error) {
  console.error("\nSYSSELCRAFT ART JOB FAILED:\n" + error.message + "\n");
  process.exit(1);
}
