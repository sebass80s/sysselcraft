# Act 3 · Story-art shot manifest

Status: **WORKING PRODUCTION LEDGER · 2026-10-11**
Authoritative dialogue: `docs/ACT3_STORY_MANIFEST.md` plus latest explicit overrides and `docs/ACT3_DIALOG_CANON_RESOLUTION.md`.
Production rules: `docs/ART_PIPELINE_V2.md`.

**Evidence policy:** Conversations show image generations, but generated art must not be called accepted or uploaded without explicit user approval or GitHub verification. Earlier sequences reported as completed in conversation are **not** bulk-certified here. Do not invent per-file asset paths.

## FAMILY-001–007 audit

| Beat | Narrative anchor | Status and warning |
| --- | --- | --- |
| FAMILY-001 | Nova greets Barnet and Alve and proudly shows completed festival; Henning serves pastries, Sol tests audio, Linus carries sign | Generated again following earlier bad images; acceptance not independently certified |
| FAMILY-002 | Henrik blows whistle while holding binder; Nova annoyed; Alve startled; Sol objects at distance | Generated corrected scene; acceptance not independently certified |
| FAMILY-003 | Father arrives at gate in jeans and dark jacket/ordinary shirt; hugs Nova; Barnet and Alve nearby | Generated corrected hug; acceptance not independently certified |
| FAMILY-004 | Mother arrives and greets father near game corner; warm but NOT reconciled | Generated; acceptance not independently certified |
| FAMILY-005 | Mother and father recognize 2011 scoreboard near shuffleboard; Nova excited | Generated; acceptance not independently certified |
| FAMILY-006 | Mother wins shuffleboard rematch, celebrates; father jokingly protests; children cheer | Generated; acceptance not independently certified |
| **FAMILY-007** | Mira photographs Nova between both parents at game corner; Nova holds one hand from each; Alve and Barnet nearby | **REGENERATE**: multiple attempts with severe character drift and invented clothing/scoreboard details. Do not reuse as accepted |

### Locked shot contract · FAMILY-007

**Beat:** `A3-FAMILY-007 – Det gamla fotografiet`. Exact action: *Mira takes a photograph of Nova standing between her mother and father, holding their hands, beside the existing shuffleboard game corner*. The parents are cheerful at the festival, but **not** romantically reunited. The image should visually foreshadow the different second photo in FAMILY-020.

**Composition:** Landscape 16:9 cinematic, warm SysselCraft story-art look. Nova is center between mother and father holding both hands. Mira is at a slightly off-center foreground camera position photographing them. Barnet and Alve may be secondary to simplify identity fidelity. Player child strictly back to camera, never profile or face. Keep existing game table and wooden 2011 scoreboard visible only if readable text can be historically correct.

**Person locks from approved character sheets (must actually load/reference user-provided images):**
- **Nova:** auburn/red short straight bob with *straight bangs*, freckles, muted teal oversized sweatshirt, faded jeans, black headphones at neck.
- **Mother:** brown hair in ponytail, chunky **beige/tan knitted cardigan**, simple light top, blue jeans, small round gold pendant, light sneakers. **Not blonde.**
- **Father:** blonde tousled short hair, tired gentle appearance ~40s, white button-front shirt, **grey cardigan**, blue jeans, casual brown shoes. **Not dark-haired; not navy shirt/olive jacket.** The *historical* iconic white shirt from 2011 is a joke; do not replace this day's established outfit with it.
- **Mira:** brown hair in messy bun with sunglasses on head, charcoal/dark work shirt, olive-grey cargo trousers, tool belt, boots. **Not knitted white sweater, not blonde.**
- **Alve:** short spiky/messy orange-brown hair, freckles, olive green hoodie, cargo **shorts**, tool belt, gloves and heavy boots.
- **Barnet:** rust-red hoodie, blue-white mountain-logo baseball cap, olive worn mountain-badge backpack with metal bottle/compass, blue cargo trousers. Seen *entirely from behind*, no face.
- **No unrelated adults and no invented wardrobe changes.**

**Scoreboard:** Legacy 2011 names of the parents only if known/legible; **Nova was not born yet** and must not appear on a 2011 scoreboard. Prefer an old board with year 2011 and illegible/distant historic tallies rather than hallucinating player names or scores.

**Visual check:** compare father, mother and Mira side-by-side with reference sheets *before* showing the user. If reference images are not available to the image-generation step, do not pretend that text descriptions guarantee likeness.

**Asset status:** Latest two attempts from conversation were explicitly rejected for identity/stylistic drift; final accepted image **not yet produced**. No GitHub asset path verified.

## Remaining FAMILY / EPILOG

- FAMILY-008–020: Shot contracts **TO_PREPARE** one at a time before generation. Narrative must follow latest canonical full-dialogue transcriptions, not summary markers that state the full dialogues are missing.
- EPILOG-001–006: Shot contracts **TO_PREPARE**. Check revised closing script, boat continuity and photo continuity first.

## Verified canonical character sheets

Directory: `public/assets/character-sheets/` on branch `nova/runtime-architecture-v1`. Confirmed individually through GitHub repository file API on 2026-10-11.

| Character | Verified file |
| --- | --- |
| Nova | `public/assets/character-sheets/nova.png` |
| Barnet | `public/assets/character-sheets/barnet.png` |
| Alve | `public/assets/character-sheets/alve.png` |
| Mira | `public/assets/character-sheets/mira.png` |
| Sol | `public/assets/character-sheets/sol.png` |
| Linus | `public/assets/character-sheets/linus.png` |
| Henning | `public/assets/character-sheets/henning.png` |
| Valpen | `public/assets/character-sheets/puppy.png` |
| Novas mamma | `public/assets/character-sheets/mamma-nova.png` |
| Novas pappa | `public/assets/character-sheets/pappa-nova.png` |
| Henrik | `public/assets/character-sheets/henrik.png` |

All eleven paths exist in the repository. File existence is verified, **not** image appearance, direct availability to the image-generation model, or identity fidelity. For FAMILY-007 prioritize loading and visually comparing `nova.png`, `mamma-nova.png`, `pappa-nova.png`, `mira.png`, `alve.png`, and `barnet.png` before generating. Previous attempts remain rejected.

Environmental references for the park, shuffleboard and 2011 props still need asset-path verification separately.
