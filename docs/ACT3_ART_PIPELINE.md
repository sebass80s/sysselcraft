# Act 3 Art Pipeline

Status: **ART PIPELINE 2.0 · LOCKED PRODUCTION METHOD**
Date: 2026-10-08

This is the canonical production contract for Act 3 story art and the template for later chapters.

## Production lock — 2026-10-08

This workflow is now locked for production. Normal Act 3 work should use it, not redesign it. Change it only if Kalle explicitly asks or a concrete production failure proves the contract insufficient.

## Chat shorthand — `kör art`

The user command **`kör art`** is the canonical shorthand for executing the full SysselCraft **Art Pipeline 2.0**.

It never means “generate an image from prose only”.

When the user says `kör art` for a scene/beat, the active assistant must:

1. read this document plus `image-pipeline/README.md`;
2. resolve the scene into the structured v2 beat contract;
3. resolve the exact recurring cast from `image-pipeline/character-registry.json`;
4. retrieve every canonical cast PNG from ChatGPT Library at `/SysselCraft/Art References/characters/` as actual image inputs;
5. resolve at most one approved location anchor;
6. resolve at most one approved previous-beat anchor from the same location/continuity group;
7. generate with ChatGPT image generation unless the user explicitly chooses another renderer;
8. visually QA identity, exact cast, location, hard rules, wardrobe, continuity and Barnet face-hidden where applicable;
9. reject failed candidates instead of letting them enter continuity;
10. persist an accepted image under the pipeline's Library anchor/output path and mark it approved;
11. tell the user the exact canonical filename and GitHub `outputPath`;
12. the user drag-and-drops that exact accepted PNG into GitHub;
13. verify that the file exists at the declared path before considering repo promotion complete.

Hard shorthand rules:
- do not ask the user to re-upload canonical character sheets already in Library;
- do not silently fall back to text-only character descriptions;
- do not silently switch to Runway or another paid renderer;
- canonical character sheets always outrank generated anchors for identity;
- a candidate is not continuity until QA + approval pass.

If the scene is already clear from the current conversation, `kör art` should execute rather than ask the user to restate it.

## Mandatory pre-generation gate (2026-10-09)

For **every** `kör art <beat-id>`, fail closed **before** invoking image generation.

1. **Read canonical script:** locate the exact heading `### <beat-id> —` in `docs/ACT3_STORY_MANIFEST.md`. Read the entire section, and quote at least two exact, relevant lines. If absent, STOP. Never infer a beat from the previous image.
2. **Build scene contract:** extract real location, action, story chronology, character cast, wardrobe, and forbidden elements. Compare the proposed image scene to all fields. Contradiction, ambiguity or unauthored subject: STOP.
3. **Real character references:** read actual PNGs for every cast member, not just filenames, descriptions or registry paths. Confirm they are made available to the image generator as image inputs. If that cannot be confirmed, STOP, rather than generating from text alone.
4. **Location continuity:** use only approved anchors belonging to this location and continuity group. If a required anchor cannot be retrieved or matched, STOP.
5. **Final instruction audit:** immediately before tool invocation, compare the full submitted image instruction to the exact scene contract. A changed place, story beat, clothing, or cast is a STOP. Do not improvise a scene.
6. **Visual QA:** after generation verify cast, face/hair, wardrobe, scene, action, continuity, and hidden face of Barnet. A failed image is rejected, never approved or used as an anchor.

### Enforcement scope

This is a mandatory **assistant pre-call guard** for ChatGPT's built-in generator. A repo script cannot intercept or cancel that hosted tool call; the assistant must decline to call it if the guard is not satisfied. Do not claim a cryptographically enforced guarantee over the ChatGPT tool.

For external or file-backed workflows, `scripts/preflight-art-job.mjs` provides a separate fail-closed CLI audit requiring beat-specific manuscript evidence, a locked scene contract in `image-pipeline/contracts/<beat-id>.json`, the exact final renderer prompt in a text file, its matching SHA-256 receipt, and fingerprints of actual input files. The script blocks if any word in the final prompt differs from the approved contract. No contract means STOP. Its evidence receipt requires operator/renderer confirmation; self-reported fields alone cannot prove that a remote renderer consumed the images. This CLI does not authorize using paid APIs or Runway. **Important:** Even an exact textual match cannot prove that image generation will obey the prompt. For the built-in ChatGPT generator the assistant must inspect the final tool instruction itself and abstain when a contract cannot be matched. The CLI does not intercept the hosted tool.

## Goal

SysselCraft may need hundreds of images. Production must therefore survive long sequences, location changes and new conversations without:
- character drift after a few images;
- repeated user uploads;
- improvised beat interpretation;
- bad generations becoming future references.

## Canonical ownership

**Identity**
- `image-pipeline/character-registry.json`
- canonical PNG character sheets
- the same real PNGs persisted in ChatGPT Library

**Story intent**
- structured v2 beat manifests
- schema: `image-pipeline/schemas/art-production-v2.schema.json`

**Continuity**
- `scripts/build-art-job.mjs`
- approved location anchor
- latest approved previous beat from the same location

**Acceptance**
- `scripts/qa-art-image.mjs`
- `scripts/approve-art-image.mjs`

**Renderer**
- ChatGPT image generation is preferred.
- Runway/OpenAI API may be adapters.
- Changing renderer never changes canonical refs or continuity lineage.

## Upload-once contract

The eight recurring canonical character sheets have been persisted under:

`/SysselCraft/Art References/characters/`

A future chat must retrieve those files as actual image inputs before generation. Knowing the filename or describing the character in prose is not grounding.

The bridge was exercised with Alve and Barnet as actual Library-backed image inputs. The continuity sequence remained recognizably stable across multiple generated images without re-upload from the user.

## Reference hierarchy

For every v2 generation:

### 1. Canonical character sheets

Always supplied for every character in the exact cast.

They are the highest identity authority.

### 2. Location anchor

At most one.

The first approved `establishLocation: true` beat establishes that place.

Later beats at that location use it for:
- geography;
- architecture;
- environmental palette;
- landmark placement.

When the story changes location, the old location anchor is dropped.

### 3. Previous-beat anchor

At most one.

The resolver chooses the latest approved beat from the same:
- location;
- continuity group.

It controls short-range continuity only:
- staging;
- lighting;
- local scene flow.

It never outranks character sheets.

## Why this replaces the old chain

Do not feed every previous image into every new image.

That creates reference soup and lets small errors accumulate.

The production formula is instead:

```text
structured beat
+ canonical sheet for every cast member
+ one stable location anchor
+ one recent same-location beat
= renderer job
```

## Exact cast

Every v2 beat sets:

`exactCastOnly: true`

The compiled prompt requires exactly the declared recurring characters and forbids invented people/animals.

Example:

```json
{
  "characters": ["alve", "barnet", "nova"],
  "exactCastOnly": true
}
```

Nova must therefore receive `nova.png` as an actual image input. A prior generated Nova is not sufficient identity authority.

## Barnet

If `barnet` is in the cast:

`barnetFaceHidden: true`

is mandatory.

Validation fails before generation if this contract is absent.

Visual QA must also pass `barnet-face-hidden` before approval.

## Beat content

A v2 beat can explicitly encode:

```json
{
  "id": "A3-004",
  "locationId": "town-harbor",
  "establishLocation": false,
  "characters": ["alve", "barnet", "nova"],
  "summary": "Alve and Barnet talk with Nova on the dock.",
  "shot": "medium-wide conversation",
  "mood": "cautious but warmer",
  "timeOfDay": "late afternoon",
  "emotions": {
    "alve": "friendly and attentive",
    "barnet": "listening",
    "nova": "still subdued but engaging"
  },
  "exactCastOnly": true,
  "wardrobeLock": true,
  "barnetFaceHidden": true
}
```

This is what allows the art system to read a beat instead of reconstructing it from chat memory.

## QA gate

A candidate image is not continuity.

Required v2 QA categories are selected deterministically:
- `identity`
- `exact-cast`
- `location`
- `hard-rules`
- `wardrobe` when locked
- `continuity` when anchors are used
- `barnet-face-hidden` when Barnet is present

Only an explicit all-pass QA result may be approved.

Approval is tied to the exact candidate path. Candidate substitution after QA fails closed.

## Location-return behavior

The v2 regression contains this route:

`town-harbor -> town-harbor -> town-park -> town-park -> town-harbor`

Expected return behavior:
- location anchor: original approved harbor establishment;
- previous-beat anchor: latest approved harbor beat;
- no park anchors.

This is the core mechanism that allows long chapters without visual-location contamination.

## Production loop

For each real story beat:

1. author/confirm structured beat;
2. build art job;
3. retrieve every canonical cast image from Library;
4. retrieve location anchor if required;
5. retrieve previous-beat anchor if required;
6. pass those actual images into ChatGPT image generation;
7. visually inspect candidate;
8. record QA;
9. reject or approve;
10. save approved image to the job's Library output path;
11. give the user the exact filename and `outputContract.repoOutputPath`;
12. user drag-and-drops the accepted PNG into GitHub;
13. verify the resulting GitHub path;
14. continue.

No approved QA, no anchor.

## GitHub promotion contract

Every v2 beat must declare one unique runtime asset path under:

`public/assets/village/story-moments/act3/<group>/<filename>.png`

This path is carried into the renderer-neutral job as `outputContract.repoOutputPath` and into approved metadata as `approved.repoOutputPath`.

**Locked production method:** the user performs the final GitHub binary upload by drag-and-drop.

When a candidate is selected and QA passes:
1. persist the accepted raster in ChatGPT Library for continuity;
2. report the exact canonical filename and `repoOutputPath`;
3. the user drag-and-drops that exact PNG into GitHub;
4. verify afterward that the file exists at the declared repo path.

Why this is locked:
- it is faster than maintaining a binary-upload bridge inside chat;
- it avoids pretending a tool session can always transport generated PNG bytes into GitHub;
- it keeps the pipeline deterministic because the manifest still owns the destination path;
- the user only performs the final binary transport, not prompt/ref/continuity work.

Drafts, rejected generations, stress-test images and PoC outputs are not promoted unless explicitly selected.

Two beats may never share the same `outputPath`; manifest validation fails closed on collisions.

A future assistant must **not reopen or automate this final drag-and-drop step unless the user explicitly asks to change the pipeline**.

## Stop rules

Do not generate if:
- any declared character reference cannot be retrieved as an actual image;
- a location continuation lacks its establishing anchor;
- the beat is ambiguous about a locked visual fact;
- the renderer cannot accept all required refs.

Do not approve if:
- identity drifted;
- cast is wrong;
- wardrobe changed without authoring;
- location drifted;
- Barnet's face is visible;
- an unauthored object/person/animal appeared in a meaningful way;
- beat action/emotion is wrong.

## Scale principle

References define identity.
Beats define story.
Location anchors define place.
One previous beat defines local continuity.
QA decides canon.
Generation only paints.
