# Sysselcraft Night Graphics Handoff — 2026-09-14

## Scope requested

Prepare the early-game painted asset package:

- recycling centre, four construction stages;
- bakery, four construction stages;
- doctor house/clinic, four construction stages;
- Henning character;
- Sol character;
- animation-ready child;
- animation-ready Linus.

## Verified starting point

Branch at start of this pass: `nova/vercel-free-batch`.

Starting head observed directly from GitHub: `f5237967ff684c1006fae681fe0b73e0292d2f02`.

Canonical documents read before work:

- `docs/NOVA_HANDOFF_MANIFEST.md`
- `docs/TECHNICAL_HANDOFF.md`
- `docs/ART_DIRECTION.md`
- `docs/STORY_DESIGN.md`

The verified gameplay/render baseline remains unchanged by this pass. In particular, `createVillageGame.ts` was deliberately not modified.

## Critical runtime limitation

The automation runtime executing this pass does not expose the image-generation capability required for Sysselcraft's locked concept-art-first production method.

Therefore:

- **no new requested painted image asset is claimed complete;**
- no fake substitutes were produced from SVG primitives;
- no unrelated web imagery was substituted;
- no single-frame character was warped/deformed and called animation;
- no missing asset was wired into Phaser under a false fallback.

This is a capability block, not an art/design decision.

## Completed and committed

### 1. Stable production asset contract

Added `src/game/productionAssets.ts`.

It defines:

- three building series × four stages;
- stable runtime paths under `/assets/village/reboot/production/`;
- normalized base points independent of render bounds;
- child, Linus, Henning and Sol character families;
- north/south/east/west;
- idle + walk;
- minimum two frames per motion/direction;
- explicit status that the production set is not runtime-verified.

The file is intentionally **not imported by the current playable scene yet**.

### 2. Automatic file/signature audit

Added `scripts/audit-reboot-production-assets.mjs`.

It expects:

- 12 building files;
- 64 animation frame files;
- Henning + Sol reference files.

Total expected production files at this first-pass contract: **78**.

The audit checks file presence and WebP RIFF/WEBP magic signatures. It does not pretend to validate art quality, transparency or runtime appearance.

Command:

`node scripts/audit-reboot-production-assets.mjs`

Until real art exists, this command is expected to fail with a missing-file report. That failure is correct behavior.

### 3. Detailed art-production brief

Added `docs/NIGHT_GRAPHICS_PRODUCTION_2026-09-14.md`.

It contains:

- exact runtime filename layout;
- four-stage visual progression for recycling centre, bakery and doctor house;
- Henning visual brief;
- Sol visual brief;
- child animation continuity requirements;
- Linus cane/knee-aware animation requirements;
- generation prompt suffixes for building series, character references and animation sheets;
- quality/acceptance gate before Phaser integration;
- explicit warning not to use legacy SVG fallbacks for missing painted production art.

## Not completed because image generation is unavailable here

- recycling centre stage 1–4 painted masters/runtime images;
- bakery stage 1–4 painted masters/runtime images;
- doctor house stage 1–4 painted masters/runtime images;
- Henning painted reference/frames;
- Sol painted reference/frames;
- child directional idle/walk painted frames;
- Linus directional idle/walk painted frames.

These remain **specified but unproduced**.

## Runtime verification status

No new graphics from this night scope can be runtime-verified because no new graphics were generated.

Existing earlier verified items are not upgraded by this document. The prior painted master, child, Linus, occlusion architecture, truck and delivery materials retain only their previously established status.

Known earlier issue remains: painted puppy has been observed as a black square in runtime and is outside this night's requested asset list.

## Exact recommended next step

When an image-generation-capable Nova/session is available:

1. read `docs/NIGHT_GRAPHICS_PRODUCTION_2026-09-14.md`;
2. generate **one full four-stage building series first**, preferably the recycling centre, on an identical canvas/base point;
3. run the file/signature audit;
4. visually inspect transparency/crop/stage registration;
5. integrate only that series into a non-disruptive construction-stage test;
6. once the stage-swap contract is proven, batch-produce bakery and doctor house using the same method;
7. generate Henning and Sol references before animation frames;
8. generate child/Linus frame families from their current verified identity references;
9. integrate animation only after frame consistency is acceptable.

This ordering tests the riskiest assumption, multi-stage visual registration, before creating a large pile of art.

## Morning status format

### Completely finished

- deterministic runtime naming/asset contract;
- base-point contract for future buildings/characters;
- construction-stage briefs;
- character briefs;
- animation frame contract;
- automatic production-file signature audit;
- truthful integration boundary that protects the working quest loop.

### Produced but not runtime-verified

- code/document scaffolding above. It requires CI/type validation and later use with real assets; it is not a visual-runtime result.

### Failed / blocked

- all actual new painted image generation, because image generation is unavailable in this automation runtime.

### Begin tomorrow with

If image generation is available: produce and validate the four recycling-centre stages against the fixed contract. If not, continue spellogic independently because this pass did not modify the playable loop.
