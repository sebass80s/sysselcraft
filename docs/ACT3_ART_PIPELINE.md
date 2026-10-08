# Act 3 Art Pipeline

Status: **ART PIPELINE 2.0**
Date: 2026-10-08

This is the canonical production contract for Act 3 story art and the template for later chapters.

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
11. upload the **exact same accepted raster** to the beat's declared GitHub `outputPath` on the active SysselCraft branch;
12. verify the resulting GitHub commit/path before considering repository promotion complete.

Hard shorthand rules:
- do not ask the user to re-upload canonical character sheets already in Library;
- do not silently fall back to text-only character descriptions;
- do not silently switch to Runway or another paid renderer;
- canonical character sheets always outrank generated anchors for identity;
- a candidate is not continuity until QA + approval pass.

If the scene is already clear from the current conversation, `kör art` should execute rather than ask the user to restate it.

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
11. upload that exact approved image to `outputContract.repoOutputPath` in GitHub;
12. verify the GitHub commit/path;
13. continue.

No approved QA, no anchor.

## GitHub promotion contract

Every v2 beat must declare one unique runtime asset path under:

`public/assets/village/story-moments/act3/<group>/<filename>.png`

This path is carried into the renderer-neutral job as `outputContract.repoOutputPath` and into approved metadata as `approved.repoOutputPath`.

When the user selects/accepts a candidate and QA passes:
1. keep the accepted raster in ChatGPT Library for continuity;
2. promote that **same raster** to GitHub at `repoOutputPath`;
3. do not rename, recompress, substitute or regenerate it during promotion;
4. verify the GitHub path/commit after upload;
5. only the explicitly selected candidate may replace an existing asset at the same path.

Drafts, rejected generations, stress-test images and PoC outputs are **not** pushed to production asset folders merely because they were generated.

If direct binary transport to GitHub is unavailable in the current tool session, report that limitation instead of claiming the repo image was uploaded. The declared `repoOutputPath` remains the source of truth for the pending promotion.

Two beats may never share the same `outputPath`; manifest validation fails closed on collisions.

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
