# SysselCraft Art Pipeline 2.0

Status: **PRODUCTION PROCESS · 2026-10-11**
Scope: cinematic Act 3 story-moment illustrations. This does **not** supersede `docs/ART_DIRECTION.md` for the world-map/isometric gameplay art.

## Source of truth and order of operations

1. Read the *exact current beat* in `docs/ACT3_STORY_MANIFEST.md` and cross-check `docs/ACT3_DIALOG_CANON_RESOLUTION.md` for later overrides or conflicting copies. Do not invent dialogue from memory.
2. Establish **chronology**: who has arrived, where they are, wardrobe/props already established, what may *not* occur yet.
3. Consult approved character sheets and prior approved scene images. A chat upload is not automatically in GitHub. The manifest must identify precisely which references were actually accessible. Do not claim an inaccessible image was used.
4. Prepare one **shot contract** before generation: beat, exact story moment, cast, camera, setting, wardrobe, props, continuity, prohibited content, source/reference availability.
5. Generate a single image for a single beat, using explicit character identities and exclusions. Do not substitute a generic ensemble scene. For busy scenes, prefer a clear core composition and place others in the background only if justified.
6. **Visually inspect the output** against the shot contract before proposing approval. Check people count/identity, style, clothing, perspective, props, temporal logic and text. If the tool has no robust identity lock, acknowledge uncertainty rather than promising a perfect match.
7. If incorrect, mark **NEEDS_FIX** or **REGENERATE**, describe concrete errors, and use targeted image editing when feasible. Never call an image approved without explicit user acceptance.
8. After user approval, record the approved image's actual file path/location and status. GitHub commits require confirmed upload; chat generation alone is not GitHub persistence.

## Quality gates

- **Narrative:** The exact beat's event is visually evident, not an adjacent beat; no future arrivals or story reveals.
- **Characters:** Faces, hair, age, outfit and silhouettes match approved references; no unintended characters.
- **Player child (Barnet):** Face **never visible**, including profiles or reflections. Red/rust hoodie, blue-white mountain-logo cap, blue cargo trousers, old olive backpack with mountain badge and accessories, per reference.
- **Visual:** cinematic, warm, detailed stylized photorealistic story moment, landscape 16:9, not accidental generic photographic realism. Respect separate isometric art direction for gameplay scenes.
- **Continuity:** Props, wardrobe, time of day, location and architecture match prior approved beats.
- **Text:** Avoid invented signage/names; scoreboard from 2011 may never show Nova as a participant.
- **Approval:** Only the user can mark ACCEPTED. Images flagged as wrong in chat remain rejected even if visually attractive.

## Canonical character-library approach

Use existing authoritative art reference assets first. Proposed location for future reviewed uploads: `public/assets/art-reference/characters/`. **Do not treat this folder as populated merely because a path appears here.** The user can provide artwork; uploader must verify physical files on the chosen branch. Maintain path, checksum or unique identifier, outfit variants and approval date in shot manifest. Preserve adult reference sheets for Nova's mother, blond tired-looking father in his forties, and grey-haired/bearded Henrik. Maintain separate identity for Mira, Sol and Henning.

## Stage outcomes

- `PLANNED`: exact script and image requirements identified.
- `GENERATED_UNREVIEWED`: image produced but no acceptance stated.
- `NEEDS_FIX`: defects identified; targeted edit may suffice.
- `REGENERATE`: scene/identity fundamentally wrong.
- `ACCEPTED`: user explicitly approves the particular image.
- `REPO_VERIFIED`: approved image path in GitHub and commit independently checked.

Never equate `GENERATED_UNREVIEWED` with `ACCEPTED`; never infer a repo upload from an image filename in conversation.

## Release checklist (every beat)

- [ ] Exact dialogue read from repository and canon override checked
- [ ] Shot contract prepared and exclusions listed
- [ ] Character and environment reference *availability* verified
- [ ] Single beat generated
- [ ] Image inspected and mismatch list recorded
- [ ] User explicitly approved the image
- [ ] Asset location, name, and GitHub commit verified if uploaded

## Failure handling

If an image is wrong, explicitly state why, correct the shot contract, and regenerate only after grounding references again. Repeated identity drift after two attempts triggers an approach change (targeted image edit, fewer visible people, reusable background/foreground composition, or a different reference-conditioned tool). Do not repeatedly issue approximately the same prompt while claiming the process has been improved.

For Act 3 use `docs/ACT3_ART_SHOT_MANIFEST.md` as the production ledger. Original dialogue stays in the story manifest; do not copy/paste scripts into the art ledger.
