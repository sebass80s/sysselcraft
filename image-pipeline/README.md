# SysselCraft Art Pipeline

Status: **v2.2 production pipeline**

This directory owns repeatable image-production context for SysselCraft. The renderer is deliberately replaceable.

Preferred renderer: **ChatGPT image generation**.

Optional adapters:
- Runway
- local OpenAI API batch generator

The renderer never decides identity or continuity. The pipeline does.

## Production lock

Art Pipeline 2.2 is the locked SysselCraft production method. Normal chapter work should use it, not redesign it. The final GitHub PNG drag-and-drop step is intentional.

## Art Pipeline 2.2 — locked visual-reference production method (2026-10-09)

**Status: LOCKED by user.** Use this method for Act 3 art unless explicitly changed by the user. This upgrades the operator workflow, not the underlying ChatGPT image model.

1. **Canon first:** Read the exact requested beat in `docs/ACT3_STORY_MANIFEST.md` and its matching locked contract, creating and validating a contract from canon when absent. Confirm cast, location, scene action and continuity before generation.
2. **Real reference images first:** Use the canonical character-sheet images, preferably the versions attached directly to the current ChatGPT image-production conversation. Treat the generation as reference-guided image transformation/editing; keep identity, face, hair, wardrobe and proportions fixed. Do not silently replace supplied images with text-only descriptions.
3. **Single-character sanity checks:** The 2026-10-09 tests visually produced a strong Nova seated portrait and an Alve seated portrait. A later three-character bench image visually preserved Nova, Alve and Barnet more faithfully than prior attempts. These are observed results, **not** a technical receipt proving which reference images the hosted generator consumed.
4. **Exact-cast group scenes:** For combinations, preserve every individual canonical sheet as the identity authority. Barnet is only seen from behind, with canonical cap, red hoodie, olive backpack, blue trousers and trail shoes.
5. **Same-location continuity:** Use approved location and previous-beat anchors only; never treat test pictures or rejected images as approved production continuity.
6. **Fail closed:** If exact beat, canonical refs, reference access, required anchors, final scene instructions or image-tool grounding cannot be confirmed, STOP before generation. Do not use unrelated props, people, animals, or previous beat content.
7. **Post-render review:** Check every character's silhouette, face, hair and clothing, anatomy, original beat, environment and story action. Reject on any mismatch. Only promote images after QA and explicit approval; user handles final GitHub PNG drag-and-drop.

**Honest limitation:** The GitHub preflight program cannot intercept ChatGPT's built-in image-generation calls; reference consumption and pixel-exact consistency are not technically guaranteed. This is a locked working method supported by the observed visual tests, not proof of a fully automated or deterministic renderer. Do not claim otherwise.

**No switch to Runway or paid OpenAI API without explicit authorization.**

## Operator shorthand: `kör art`

In any future SysselCraft chat, the phrase **`kör art`** means:

> Execute the full Art Pipeline 2.2 for the current requested scene.

Required behavior:
- use the structured v2 beat contract;
- load every declared recurring character's canonical PNG from persistent ChatGPT Library as a real image input;
- use one location anchor and at most one same-location previous-beat anchor when applicable;
- render in ChatGPT image generation by default;
- run the mandatory QA gate;
- persist + approve only accepted candidates.

It must **not** degrade into a standalone prose prompt, guessed character identity, repeated user upload, or silent Runway/API fallback.

## 2.1 pre-call stop gate

For every `kör art <beat-id>`, **read the exact script and its committed `image-pipeline/contracts/<beat-id>.json`**. The contract must contain the exact foreground cast, verbatim manuscript evidence, visual requirements, explicit forbidden motifs, and the full final image-generation prompt. If there is no contract, or it conflicts with the manuscript, STOP without making an image. Never improvise from a previous beat.

Fetch actual character sheet images and verify they are available to the rendering operation. No verified images means STOP. The final prompt must be the exact locked `finalPrompt`. Visual QA follows every generation.

`scripts/preflight-art-job.mjs` enforces this for file-backed jobs when a complete evidence receipt exists, but cannot intercept ChatGPT's built-in image tool. The assistant must enforce the same pre-call gate and report limitations accurately.

Regression: `node scripts/test-art-contracts-v21.mjs`.

## Canonical Prop Registry

Recurring props use `image-pipeline/prop-registry.json`, with canonical reference PNGs under `public/assets/village/prop-sheets/`.

First registered prop: `folkpark-game-table`, from A3-PARK-016. Its exact reference is `public/assets/village/prop-sheets/folkpark-game-table.png`. Never redraw its scoring surface or wooden pucks freely.

A v2 beat that features it must declare `"props": ["folkpark-game-table"]`. `scripts/build-art-job.mjs` then verifies the PNG exists and includes it in `propRefs`, `referenceImagePaths`, the compiled render prompt, and `prop-identity`/`prop-continuity` QA checks. Preflight includes the prop PNG in its physical image input receipt.

**Scope:** This is supported in generated manifest-based art jobs. Built-in ChatGPT image calls cannot be intercepted by repo scripts and still require deliberate reference attachment and visual QA. An uploaded binary is not proof the model used it.

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
- target persistent Library output path;
- exact GitHub runtime output path.

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

## GitHub promotion

Every v2 beat has a mandatory, unique `outputPath` under:

`public/assets/village/story-moments/act3/<group>/<filename>.png`

`build-art-job.mjs` exposes it as `outputContract.repoOutputPath`.
`approve-art-image.mjs` stores it as `approved.repoOutputPath`.

**Locked workflow:** after QA + approval, ChatGPT reports the exact filename/path and the user drag-and-drops the selected PNG into GitHub.

ChatGPT then verifies that the file exists at the expected path.

The user should never need to:
- re-upload character refs;
- decide continuity anchors;
- invent filenames;
- decide destination folders.

Only the final binary transport to GitHub is manual.

Do not push drafts, rejected candidates, stress-test images or PoC images unless explicitly selected.

Do not reopen this manual promotion step unless the user explicitly asks to change the production pipeline.

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
