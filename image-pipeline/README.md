# SysselCraft Art Pipeline

Status: **v2 production pipeline**

This directory owns repeatable image-production context for SysselCraft. The renderer is deliberately replaceable.

Preferred renderer: **ChatGPT image generation**.

Optional adapters:
- Runway
- local OpenAI API batch generator

The renderer never decides identity or continuity. The pipeline does.

## Operator shorthand: `kör art`

In any future SysselCraft chat, the phrase **`kör art`** means:

> Execute the full Art Pipeline 2.0 for the current requested scene.

Required behavior:
- use the structured v2 beat contract;
- load every declared recurring character's canonical PNG from persistent ChatGPT Library as a real image input;
- use one location anchor and at most one same-location previous-beat anchor when applicable;
- render in ChatGPT image generation by default;
- run the mandatory QA gate;
- persist + approve only accepted candidates.

It must **not** degrade into a standalone prose prompt, guessed character identity, repeated user upload, or silent Runway/API fallback.

## The three reference classes

Every v2 art job separates references by responsibility.

1. **Identity references**
   - one canonical character sheet for every declared recurring character;
   - supplied on every generation;
   - highest authority for face, hair, age read, clothing, proportions and silhouette.

2. **Location anchor**
   - one approved image that establishes a location;
   - controls geography, architecture and environmental visual language;
   - does not control character identity.

3. **Previous-beat anchor**
   - at most one latest approved beat from the same location/continuity group;
   - controls short-range staging, light and flow;
   - does not control character identity.

A location change does not inherit the previous location's anchors.

## Upload once

Canonical recurring-character sheets are registered in:

`image-pipeline/character-registry.json`

Their repository sources live under:

`public/assets/village/character-sheets/`

The same eight canonical sheets are also persisted in ChatGPT Library under:

`/SysselCraft/Art References/characters/`

This means a later ChatGPT conversation can retrieve the real images as image inputs without asking the user to upload them again.

Approved ChatGPT continuity images belong under:

`/SysselCraft/Art References/anchors/<production-id>/<beat-id>.png`

## Manifest v2

Schema:

`image-pipeline/schemas/art-production-v2.schema.json`

PoC:

`image-pipeline/batches/poc-art-pipeline-v2.json`

A production beat defines at least:
- stable beat id;
- location id;
- exact recurring cast;
- authored action/summary;
- exact-cast lock;
- wardrobe lock;
- Barnet face-hidden lock when applicable.

It may additionally define:
- whether this beat establishes a new location;
- shot;
- mood;
- time of day;
- per-character emotion;
- explicit continuity source;
- authored rules and forbidden elements.

## Build a renderer-neutral job

```bash
npm run art:job -- \
  --manifest=image-pipeline/batches/poc-art-pipeline-v2.json \
  --beat=V2-001
```

The job contains:
- canonical identity refs;
- ChatGPT Library refs;
- location anchor;
- previous-beat anchor;
- compiled prompt;
- mandatory QA ids;
- target persistent output path.

## Exact-cast rule

V2 requires `exactCastOnly: true`.

The compiler explicitly instructs the renderer to show exactly the declared recurring cast and no unrequested people or animals.

If Barnet is present, `barnetFaceHidden: true` is mandatory and validation fails closed otherwise.

## QA before approval

A generated image is only a candidate. It cannot become a continuity anchor until QA passes.

Record QA:

```bash
npm run art:qa -- \
  --manifest=<manifest.json> \
  --beat=<beat-id> \
  --chat-library-path=<candidate.png> \
  --pass=identity,exact-cast,location,hard-rules,wardrobe,barnet-face-hidden
```

Continuation beats also require `continuity`.

Then approve:

```bash
npm run art:approve -- \
  --manifest=<manifest.json> \
  --beat=<beat-id>
```

Approval is bound to the exact candidate that was QA-reviewed. Replacing the candidate after QA makes approval fail.

## Fail-closed rules

Generation/approval must stop when:
- a canonical character is unknown;
- a canonical sheet is missing;
- a required persistent ChatGPT reference is missing from registry;
- Barnet is present without the face-hidden contract;
- an emotion is authored for a character outside the cast;
- a continuation location has no approved establishing anchor;
- previous-beat continuity tries to cross locations;
- an approved local anchor disappears;
- any mandatory QA check is missing or failed;
- QA belongs to a different candidate.

## Tests

```bash
npm run test:art-continuity-poc
npm run test:art-pipeline-v2
```

Both are part of `npm run verify`.

The v2 regression explicitly proves:

`harbor -> harbor -> park -> park -> harbor`

On the return to harbor, the resolver restores the original harbor location anchor and the latest approved harbor beat. It does not inherit the more recent park images.

## Legacy batch tooling

`build-image-batch.mjs` and `generate-image-batch.mjs` remain useful as renderer adapters and batch experiments.

They are not the authority for identity or continuity. New Act 3+ production should be authored as v2 manifests and resolved through `build-art-job.mjs`.
