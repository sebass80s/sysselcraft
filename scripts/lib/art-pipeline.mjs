import fs from "node:fs";
import path from "node:path";

export const DEFAULT_REGISTRY = "image-pipeline/character-registry.json";
export const CANONICAL_SHEET_ROOT = "public/assets/village/character-sheets/";

export function fail(message) {
  const error = new Error(message);
  error.name = "SysselCraftArtPipelineError";
  throw error;
}

export function parseArgs(argv) {
  const out = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const [key, ...rest] = raw.slice(2).split("=");
    out[key] = rest.length ? rest.join("=") : true;
  }
  return out;
}

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Could not read ${filePath}: ${error.message}`);
  }
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

export function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

export function validateManifest(manifest) {
  if (!manifest?.productionId || !Array.isArray(manifest.beats) || manifest.beats.length === 0) {
    fail("Manifest requires productionId and non-empty beats[].");
  }

  const ids = new Set();
  for (const beat of manifest.beats) {
    if (!beat?.id) fail("Every beat requires id.");
    if (ids.has(beat.id)) fail(`Duplicate beat id "${beat.id}".`);
    ids.add(beat.id);
    if (!beat.summary) fail(`Beat ${beat.id} requires summary.`);
  }

  if (manifest.version === 2) {
    for (const beat of manifest.beats) validateV2Beat(beat);
  } else if (manifest.version !== 1) {
    fail(`Unsupported art manifest version "${manifest.version}".`);
  }
}

function validateV2Beat(beat) {
  if (!beat.locationId) fail(`Beat ${beat.id} requires locationId in v2.`);
  if (!Array.isArray(beat.characters)) fail(`Beat ${beat.id} requires characters[] in v2.`);
  if (new Set(beat.characters).size !== beat.characters.length) fail(`Beat ${beat.id} has duplicate characters.`);
  if (beat.exactCastOnly !== true) fail(`Beat ${beat.id} must set exactCastOnly=true in v2.`);
  if (typeof beat.wardrobeLock !== "boolean") fail(`Beat ${beat.id} requires wardrobeLock boolean in v2.`);
  if (beat.characters.includes("barnet") && beat.barnetFaceHidden !== true) {
    fail(`Beat ${beat.id} contains Barnet and must set barnetFaceHidden=true.`);
  }
  for (const emotionId of Object.keys(beat.emotions ?? {})) {
    if (!beat.characters.includes(emotionId)) {
      fail(`Beat ${beat.id} defines emotion for non-cast character "${emotionId}".`);
    }
  }
}

export function canonicalCharacterRefsFor(beat, registry) {
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
      displayName: character.displayName ?? id,
      repoPath: sheet,
      chatLibraryPath: character.chatLibraryPath
    };
  });
}

export function ensureApprovalState(manifest, approvalPath) {
  const state = fs.existsSync(approvalPath)
    ? readJson(approvalPath)
    : { version: 2, productionId: manifest.productionId, items: {} };

  state.version = Math.max(2, Number(state.version ?? 1));
  state.productionId = manifest.productionId;
  state.items ??= {};

  for (const beat of manifest.beats) {
    state.items[beat.id] ??= {
      status: "pending",
      candidate: null,
      qa: null,
      approved: null,
      notes: ""
    };
  }

  writeJson(approvalPath, state);
  return state;
}

export function isApproved(item) {
  return item?.status === "approved" &&
    item.approved &&
    (item.approved.outputRef || item.approved.chatLibraryPath) &&
    item.qa?.verdict === "pass";
}

export function approvalReference(item, beatId) {
  if (!isApproved(item)) return null;
  return {
    beatId,
    outputRef: item.approved.outputRef ?? null,
    chatLibraryPath: item.approved.chatLibraryPath ?? null
  };
}

export function v1ApprovedAnchorsFor(beat, manifest, approvals) {
  const policy = beat.continuity?.policy ?? manifest.continuity?.policy ?? "latest-approved-same-group";
  const depth = Math.max(0, Number(beat.continuity?.anchorDepth ?? manifest.continuity?.anchorDepth ?? 2));
  if (policy === "none" || depth === 0) return [];

  const index = manifest.beats.findIndex((item) => item.id === beat.id);
  const group = beat.continuityGroup ?? manifest.continuityGroup ?? "default";
  const candidates = manifest.beats.slice(0, index).filter((candidate) => {
    const item = approvals.items?.[candidate.id];
    return (candidate.continuityGroup ?? manifest.continuityGroup ?? "default") === group && isApproved(item);
  });

  let eligible = candidates;
  if (policy === "latest-approved-same-cast") {
    eligible = candidates.filter((candidate) => {
      const aa = [...(candidate.characters ?? [])].sort();
      const bb = [...(beat.characters ?? [])].sort();
      return aa.length === bb.length && aa.every((value, i) => value === bb[i]);
    });
  } else if (policy !== "latest-approved-same-group") {
    fail(`Unsupported continuity policy "${policy}" in beat ${beat.id}.`);
  }

  return eligible.slice(-depth).reverse().map((candidate) =>
    approvalReference(approvals.items[candidate.id], candidate.id)
  ).filter(Boolean);
}

export function resolveV2Anchors(beat, manifest, approvals) {
  const index = manifest.beats.findIndex((item) => item.id === beat.id);
  if (index < 0) fail(`Beat ${beat.id} is not in manifest order.`);

  const previous = manifest.beats.slice(0, index);
  const group = beat.continuityGroup ?? manifest.continuityGroup ?? "default";

  let previousBeat = null;
  if (beat.continuityFrom) {
    const candidate = previous.find((item) => item.id === beat.continuityFrom);
    if (!candidate) fail(`Beat ${beat.id} continuityFrom "${beat.continuityFrom}" is not an earlier beat.`);
    if (candidate.locationId !== beat.locationId) {
      fail(`Beat ${beat.id} cannot inherit previous-beat continuity across locations (${candidate.locationId} -> ${beat.locationId}).`);
    }
    previousBeat = candidate;
  } else {
    previousBeat = [...previous].reverse().find((candidate) =>
      candidate.locationId === beat.locationId &&
      (candidate.continuityGroup ?? manifest.continuityGroup ?? "default") === group &&
      isApproved(approvals.items?.[candidate.id])
    ) ?? null;
  }

  if (previousBeat && !isApproved(approvals.items?.[previousBeat.id])) {
    fail(`Beat ${beat.id} requires approved previous beat ${previousBeat.id}.`);
  }

  let locationBeat = null;
  if (!beat.establishLocation) {
    locationBeat = previous.find((candidate) =>
      candidate.locationId === beat.locationId &&
      candidate.establishLocation === true &&
      isApproved(approvals.items?.[candidate.id]) &&
      approvals.items[candidate.id].qa?.passed?.includes("location")
    ) ?? null;

    if (!locationBeat) {
      fail(`Beat ${beat.id} requires an approved location-establishing beat for "${beat.locationId}".`);
    }
  }

  return {
    locationAnchor: locationBeat
      ? approvalReference(approvals.items[locationBeat.id], locationBeat.id)
      : null,
    previousBeatAnchor: previousBeat
      ? approvalReference(approvals.items[previousBeat.id], previousBeat.id)
      : null
  };
}

export function requiredQaChecks(beat, hasContinuityAnchor = false) {
  const checks = ["identity", "exact-cast", "location", "hard-rules"];
  if (beat.wardrobeLock) checks.push("wardrobe");
  if (hasContinuityAnchor) checks.push("continuity");
  if ((beat.characters ?? []).includes("barnet")) checks.push("barnet-face-hidden");
  return uniq(checks);
}

export function compileV2Prompt(beat, registry, refs, anchors) {
  const names = refs.map((ref) => ref.displayName);
  const emotionLines = Object.entries(beat.emotions ?? {}).map(([id, emotion]) => {
    const displayName = registry.characters?.[id]?.displayName ?? id;
    return `- ${displayName}: ${emotion}`;
  });

  const lines = [
    "Create ONE finished SysselCraft story image.",
    "",
    "AUTHORED BEAT:",
    beat.summary,
    "",
    "EXACT CAST LAW:",
    names.length
      ? `- Show exactly these recurring characters: ${names.join(", ")}.`
      : "- Show no recurring characters.",
    "- Do not add any extra people or animals unless the beat explicitly requests them.",
    "- Do not remove or substitute any declared character.",
    "",
    "CANONICAL IDENTITY LAW:",
    "- Every declared recurring character has a supplied canonical character sheet.",
    "- Those canonical sheets are the highest authority for face, hair, age read, clothing, proportions and silhouette.",
    "- Never infer recurring character identity from continuity or location anchors."
  ];

  if (beat.wardrobeLock) {
    lines.push("- Wardrobe is locked: preserve canonical clothing exactly unless this beat explicitly authors a change.");
  }

  if (anchors.locationAnchor) {
    lines.push(
      "",
      "LOCATION ANCHOR LAW:",
      `- Use the approved "${beat.locationId}" location anchor for geography, architecture and environmental visual continuity.`,
      "- Do not copy character identity from the location anchor."
    );
  } else if (beat.establishLocation) {
    lines.push(
      "",
      "LOCATION ESTABLISHMENT:",
      `- This image establishes the canonical visual anchor for location "${beat.locationId}".`
    );
  }

  if (anchors.previousBeatAnchor) {
    lines.push(
      "",
      "PREVIOUS-BEAT CONTINUITY LAW:",
      `- Use approved beat ${anchors.previousBeatAnchor.beatId} only for short-range continuity such as staging, light and scene flow.`,
      "- Canonical character sheets still outrank the previous beat for identity."
    );
  }

  for (const rule of registry.globalRules ?? []) lines.push("- " + rule);

  if (beat.shot) lines.push("", "SHOT:", beat.shot);
  if (beat.mood) lines.push("MOOD:", beat.mood);
  if (beat.timeOfDay) lines.push("TIME OF DAY:", beat.timeOfDay);
  if (emotionLines.length) lines.push("", "CHARACTER EMOTIONS:", ...emotionLines);
  if (beat.rules?.length) lines.push("", "BEAT RULES:", ...beat.rules.map((rule) => "- " + rule));
  if (beat.mustNot?.length) lines.push("", "MUST NOT SHOW:", ...beat.mustNot.map((rule) => "- " + rule));

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function candidateKey(candidate) {
  if (!candidate) return null;
  return candidate.chatLibraryPath
    ? `library:${candidate.chatLibraryPath}`
    : candidate.outputRef
      ? `file:${candidate.outputRef}`
      : null;
}

export function assertLocalReferenceExists(ref, label) {
  if (ref && !fs.existsSync(ref)) fail(`${label} file is missing: ${ref}`);
}
