# ACT 2 STORY MOMENT MANIFEST

Status: **WORKING CANON / PRE-PRODUCTION**  
Date: 2026-09-28

## Purpose

This manifest is the production gate between Act 2 paper design and visual generation. Act 2 contains **64 authoritative real-world contribution beats**: 16 each for Stugan, Bryggan, Båthuset and Motorbåten. A contribution beat is not automatically a unique image. Before any production image is generated, every beat must be classified and every new image must receive a deterministic generation contract.

Canonical narrative source: `docs/STORY_DESIGN.md`. If this manifest conflicts with locked story canon, STORY_DESIGN wins until the conflict is deliberately resolved.

## Non-negotiable visual contract

- One generation = one finished production image. **No concept art, contact sheets or spritesheets.**
- Established characters are never regenerated from prose/memory alone. Production sessions begin with the canonical reference batch uploaded into the active image conversation: Adam/child, puppy, Linus, Henning, Mira, Sol and approved Alve reference.
- Adam is **always seen from behind** in Story Moments: canonical cap, backpack, clothes, proportions and silhouette; face never visible or invented.
- NPCs use canonical references only. No free reinterpretation.
- Target look is warm cinematic semi-realistic/photographic SysselCraft storybook rendering, coherent with accepted Story Moments; no anime or generic glossy-animation drift.
- Environment must match the accepted Lake Master and the correct project state 1/4–4/4. Do not casually regenerate accepted master/building states.
- No baked-in dialogue/text unless the beat explicitly requires environmental text already locked by story canon (for example an in-world physical object). UI/dialogue text belongs in runtime.
- No extra characters, buildings, clothing changes or story props unless specified by the beat contract.
- Generation paints; deterministic runtime tooling handles fitting/placement. Never repair a composition problem with non-uniform stretching.

## Beat classification vocabulary

Every beat receives exactly one primary production class:

- **DIALOGUE ONLY** — runtime/in-world staging is sufficient; no dedicated still required.
- **REUSE** — an existing/new image can intentionally serve this beat without continuity loss.
- **NEW IMAGE** — dedicated still required.
- **MAJOR STORY MOMENT** — dedicated high-priority still/cinematic frame required; narrative/emotional composition gets extra acceptance scrutiny.

A beat may also reference persistent runtime props/world-state changes independently of its image class.

## Permanent beat IDs

- `COTTAGE-01` … `COTTAGE-16`
- `JETTY-01` … `JETTY-16`
- `BOATHOUSE-01` … `BOATHOUSE-16`
- `MOTORBOAT-01` … `MOTORBOAT-16`

IDs never change when dialogue, image reuse or production order changes.

## Required beat card

Each of the 64 IDs must contain:

1. **Contribution trigger** — what approved real-world contribution advances into this beat.
2. **Narrative function** — why the beat exists.
3. **Production class** — DIALOGUE ONLY / REUSE / NEW IMAGE / MAJOR STORY MOMENT.
4. **Environment state** — Lake Master + exact project visual stage and persistent props already present.
5. **Characters present** — exact cast.
6. **Canonical character refs** — reference IDs/files required for production.
7. **Adam constraint** — explicit back-view composition when Adam is visible.
8. **Composition/action** — camera, blocking and visible action.
9. **Required props/details** — only story-required objects.
10. **Must NOT show** — continuity traps and forbidden additions.
11. **Continuity in/out** — what must already exist and what becomes persistent afterward.
12. **Dialogue/runtime copy** — locked lines or target dialogue.
13. **Reuse target** — if REUSE, exact image ID and why reuse is valid.
14. **Acceptance checklist** — binary checks before asset can be accepted.

## Two contracts for every generated image

Every NEW IMAGE or MAJOR STORY MOMENT gets both:

### Narrative Contract
- beat IDs served;
- emotional/story purpose;
- exact moment depicted;
- characters and relationships visible;
- continuity before/after;
- story facts that must be readable without dialogue.

### Generation Contract
- canonical reference inputs required;
- environment/stage reference required;
- aspect/framing target;
- camera and composition;
- character placement/pose/expression constraints;
- Adam back-view enforcement;
- required props;
- forbidden additions/changes;
- lighting/weather/time continuity;
- acceptance criteria.

The Generation Contract outranks generator creativity.

## Production image IDs

Generated assets use stable IDs independent of filenames, for example:
- `IMG-A2-COT-001`
- `IMG-A2-JET-001`
- `IMG-A2-BOAT-001` (Båthuset)
- `IMG-A2-MTR-001` (Motorbåten)
- `IMG-A2-FIN-001` (cross-project/finale)

One image may intentionally serve multiple beats only after continuity audit proves that reuse is valid.

## Locked cross-project finale beats

The family return follows `MOTORBOAT-16` but is **not contribution 17**. It receives finale image IDs and narrative/generation contracts while remaining outside the 64 contribution count.

Required finale sequence to preserve during image triage:
1. successful motorboat homecoming;
2. Alve notices open/lit cottage and suspects burglars;
3. clues at cottage + familiar laughter; Alve recognizes it;
4. family is unpacking/using the cottage;
5. major family embrace, Adam slightly behind/back-view;
6. **“Det är Adam. …Han är min kompis.”** payoff;
7. preserved cottage memories noticed;
8. veranda/living-lake payoff: **“Det är inte riktigt som förr.” / “Nej. …Det är bättre.”**

Do not attach an Act 3 reveal directly to this sequence. First true crossing remains Act 3 opening.

## Production workflow / gate

1. Expand all 64 beat cards from STORY_DESIGN.
2. Run a **narrative continuity pass** chronologically: character knowledge, props, project stages, village support, weather/time implications, emotional progression.
3. Assign provisional image classes.
4. Run **image-reuse audit**. Reuse must be narratively and visually honest, not merely cheaper.
5. Create exact Narrative + Generation Contracts for every proposed generated image.
6. Build the Production Queue mapping image IDs → beat IDs.
7. Run final dry-run across the queue: references, environment state, characters, props, day/weather, Adam orientation, persistent changes.
8. Only then generate images, project by project, with the full canonical reference batch uploaded at the start of the production conversation.
9. Reject failed generations internally; never convert a broken image into canon because time was spent on it.
10. Composite/preview accepted images in their actual runtime context before implementation acceptance.

## Current gate status

- [x] Stugan 1–16 paper locked.
- [x] Bryggan 1–16 paper locked.
- [x] Båthuset 1–16 paper locked.
- [x] Motorbåten 1–16 paper locked.
- [x] Family-return finale paper locked.
- [x] Canonical total fixed at 64 contribution beats.
- [x] Manifest schema and visual-production rules established.
- [ ] Expand 64 individual beat cards.
- [ ] Narrative continuity audit.
- [ ] Image triage/reuse audit.
- [ ] Exact image count locked.
- [ ] Generation contracts locked.
- [ ] Production Queue locked.
- [ ] Image generation authorized.

**No Act 2 production Story Moment image generation before the unchecked pre-production gates above are complete.**


## Streamlined triage pass — working table

Before expanding full beat cards, run one compact pass over all 64 beats. This is intentionally cheaper to edit than 64 generation contracts.

For every beat record only:

| Field | Meaning |
|---|---|
| Beat | Permanent ID |
| Core event | One-sentence story action |
| Delivery | LIVE / REUSE / IMAGE / MAJOR |
| Visual delta | What becomes newly visible/persistent after this beat |
| Cast delta | New/changed character presence requiring visual proof |
| Candidate image family | Shared scene/environment group if applicable |
| Notes | Continuity dependency or locked dialogue cue |

### Decision rule
Use this order for every beat:
1. Can Phaser/runtime + dialogue communicate the beat without losing an important reveal/emotion? → **LIVE**.
2. If not, does an already-required image honestly depict the same visual moment/state? → **REUSE**.
3. If not, does the beat require a visual reveal/action that runtime cannot carry well? → **IMAGE**.
4. If the beat is an act/project emotional or cinematic payoff whose composition itself matters → **MAJOR**.

Never create an IMAGE merely because a contribution occurred. Never reuse an image across incompatible project stages, props, weather/time, character knowledge or emotional state.

### Production batching
After triage, group IMAGE/MAJOR candidates by scene family rather than chronological order:
1. Stugan interiors/exteriors;
2. Bryggan/lakeshore;
3. Båthuset/workshop;
4. Motorbåten/slip/water;
5. cross-project finale/family.

Within a family, keep the same canonical reference batch and environment references active. Produce the highest-continuity anchor image first, accept it, then use it as an additional visual continuity reference for later images where the tool/context allows. This does not replace canonical character references.

### Asset-economy target
There is deliberately **no fixed image-count target** before triage. The optimization target is minimum generation attempts while preserving every story beat that materially benefits from a still. A lower image count is not success if it weakens a locked payoff.
