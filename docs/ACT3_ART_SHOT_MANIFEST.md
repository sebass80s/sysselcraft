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
- EPILOG-001–002 and 004–006: Shot contracts **TO_PREPARE**. EPILOG-003 now has a source-grounded contract in `image-pipeline/contracts/A3-EPILOG-003.json`, **but its actual reference-image inputs, approved arcade anchor and renderer availability are still NOT VERIFIED**. No EPILOG art is approved by this contract. Check revised closing script, boat continuity and photo continuity first.

## Verified canonical character sheets

Directory: `public/assets/character-sheets/` on branch `nova/runtime-architecture-v1`. Confirmed individually through GitHub repository file API, with Rebecka and the full twelve-character set rechecked on 2026-10-12.

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
| Rebecka | `public/assets/character-sheets/rebecka.png` |

All twelve paths exist in the repository; Rebecka's file was verified on 2026-10-12. File existence is verified, **not** image appearance, direct availability to the image-generation model, or identity fidelity. For FAMILY-007 prioritize loading and visually comparing `nova.png`, `mamma-nova.png`, `pappa-nova.png`, `mira.png`, `alve.png`, and `barnet.png` before generating. Previous attempts remain rejected.

Environmental references for the park, shuffleboard and 2011 props still need asset-path verification separately.


## EPILOG ART INCIDENT UPDATE — 2026-10-12 (authoritative production status)

Read `docs/ACT3_EPILOG_ART_HANDOVER_2026-10-12.md` **before any EPILOG art generation**. Today's attempts repeatedly violated the existing pipeline. All below are **unapproved** unless the user subsequently explicitly accepts them and the actual file is verified.

| Beat | Latest evidenced status | Blocker / exact requirement |
|---|---|---|
| EPILOG-001 | GENERATED_UNREVIEWED | Latest image showed Barnet strictly from behind and Alve with phone in harbor; user approval not recorded; earlier variants erroneously included Nova or exposed Barnet's face |
| EPILOG-002 | NEEDS_FIX | Latest image finally inside arcade with Nova, Alve, Barnet and Rebecka, but wrong highscores. Canon is REB **98 500** and NOV **98 450**, precisely 50 difference. No user acceptance recorded |
| EPILOG-003 | REGENERATE · CONTRACT_PREPARED | Latest image omitted Nova and changed Rebecka; exact locked manuscript scene contract now exists. Before any generation, attach real refs for Nova, Barnet, Alve, Rebecka and the approved ARCADE-005 environment anchor |
| EPILOG-004 | TO_PREPARE | Three children on couch; Nova displays FAMILY-020 photo on phone; bowling/family discussion |
| EPILOG-005 | TO_PREPARE | Rebecka and Nova challenge at arcade; don't invent minigame result |
| EPILOG-006 | TO_PREPARE | Friends at harbor, Nova waves as boat leaves; new FAMILY-020 photo on her phone for ending |

**Reference registry correction 2026-10-12:** All twelve sheets are registered under `public/assets/character-sheets/`, including Rebecka, Nova, Alve and Barnet; GitHub presence does not mean renderer image inputs were attached. The original eight are also present under the historical village path with matching blobs. No existing accepted images were changed.

**Hard stops:** Never show Barnet face or profile. Identity sheets must truly be visible to generator (uploaded/accessible refs alone are not proof of consumption). Exact script beat and cast/location first. Reject anything that places EPILOG-002 outside arcade or EPILOG-003 without Nova. GitHub upload is user's manual step; no image repo existence verified. 
