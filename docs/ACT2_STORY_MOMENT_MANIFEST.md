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


## 64-beat triage v1 — 2026-09-28

This is the first production-economy pass, grounded in the locked paper design. **LIVE means no dedicated still is currently justified.** IMAGE/MAJOR are candidates, not generation authorization. Where STORY_DESIGN intentionally leaves an individual contribution unordered/unauthored, this table says so rather than inventing canon.

### Stugan

| Beat | Core event | Delivery | Visual delta / family | Notes |
|---|---|---|---|---|
| COTTAGE-01 | Enter/air/clear neglected cottage; Alve knows the old layout | LIVE | first worksite activity | Runtime + dialogue carries it |
| COTTAGE-02 | Old height marks are uncovered | IMAGE | height marks become protected persistent prop | Visual discovery worth preserving |
| COTTAGE-03 | Warm old family photograph is found | IMAGE | family photo becomes persistent memory prop | First concrete family reveal |
| COTTAGE-04 | First substantial restoration; Alve reveals hope family may return | MAJOR | cottage 1/4→2/4 | Emotional project thesis |
| COTTAGE-05 | Old family board/card game is recovered | LIVE | game becomes persistent prop | Can stage in runtime/dialogue |
| COTTAGE-06 | Furniture memories / floor-is-lava play | IMAGE | room increasingly usable | Distinct playful visual beat |
| COTTAGE-07 | Rain traps Adam+Alve; they play the old game | MAJOR | new memory in old cottage | Puppy may be present; rain continuity |
| COTTAGE-08 | “Regnet” / “Det ser bättre ut” payoff and next restoration step | REUSE | next cottage stage | Candidate reuse of rain-family scene if stage continuity works; audit required |
| COTTAGE-09 | Childhood drawing “VÅR STUGA” discovered | IMAGE | drawing becomes persistent prop | Must preserve exact in-world drawing concept |
| COTTAGE-10 | Drawing motivates veranda work; ordinary family memories | LIVE | veranda work begins | Dialogue/runtime sufficient |
| COTTAGE-11 | Adam asks if family knows; restoration confirmed as Alve's surprise | LIVE | no required new visual | Character beat |
| COTTAGE-12 | Evidence somebody from home visited unseen; hope surges | MAJOR | mystery object + restored veranda/next stage | Do not show family; exact object still open |
| COTTAGE-13 | Remaining substantial damage addressed | LIVE | incremental work | No unique still needed |
| COTTAGE-14 | Shift from repair to preparing for actual people | LIVE | chairs/sleeping/guest readiness | Runtime props preferred |
| COTTAGE-15 | Alve openly imagines family using the rooms again | IMAGE | cottage reads ready for people | Quiet emotional composition candidate |
| COTTAGE-16 | Cottage complete; nobody arrives; “Inte idag” | MAJOR | final cottage state with all memory props | Family must NOT appear |

**Stugan v1:** 6 LIVE, 5 IMAGE, 4 MAJOR, 1 REUSE candidate = **9 dedicated-image candidates before reuse audit**.

### Bryggan

| Beat | Core event | Delivery | Visual delta / family | Notes |
|---|---|---|---|---|
| JETTY-01 | Begin clearing/inspection, expecting mostly boards | LIVE | worksite starts | Runtime work/dialogue |
| JETTY-02 | Deeper rot/support damage discovered | IMAGE | true scale of damage visible | Visual reveal |
| JETTY-03 | Linus/Recycling salvage reaches lake; Linus reacts briefly | IMAGE | salvage + Linus at lake | First meaningful Linus lake return |
| JETTY-04 | First substantial salvage repair | MAJOR | jetty 1/4→2/4 | First major visual advance |
| JETTY-05 | Repaired section makes swimming tempting; bathing edge still neglected | LIVE | attention shifts toward water access | Runtime dialogue/work |
| JETTY-06 | Sol performs practical bathing-place safety check | IMAGE | Sol at lake; hazards/checklist established | Prevention, no injury |
| JETTY-07 | Adam+Alve clear bathing edge; purchased life buoy arrives ready to mount | LIVE | cleanup + buoy staged | Mira purchase is intermediate, not contribution |
| JETTY-08 | Life buoy mounted; bathing place reads usable | MAJOR | jetty 2/4→3/4 + permanent buoy | Strong causal payoff |
| JETTY-09 | Improve social/summer-use portion of jetty | LIVE | sitting/towel/clear-use space | No new furniture system |
| JETTY-10 | First authored village visitor comes because restoration is happening | IMAGE | first behavioural return to lake | Visitor identity can be chosen during dialogue polish |
| JETTY-11 | Adam+Alve take first proper water break | MAJOR | friendship/use payoff | Not full ensemble swim image |
| JETTY-12 | Finish major mid-stage repair; nearly complete summer place | MAJOR | jetty 3/4→4/4 visually | Ambient pool still locked |
| JETTY-13 | Finish last substantial weak/worksite element | LIVE | final repair | No new mystery/purchase |
| JETTY-14 | Remove work clutter; prepare for ordinary use | LIVE | worksite language disappears | Buoy persists |
| JETTY-15 | Quiet anticipation: who will use it when open? | IMAGE | near-complete social place | Could become REUSE after consolidation |
| JETTY-16 | Jetty complete; ambient-life pool unlocks | MAJOR | completed summer/social identity | Empty state + authored resident pools later |

**Bryggan v1:** 6 LIVE, 5 IMAGE, 5 MAJOR = **10 dedicated-image candidates** before reuse audit.

### Båthuset

| Beat | Core event | Delivery | Visual delta / family | Notes |
|---|---|---|---|---|
| BOATHOUSE-01 | Clearing reveals heavy old locked chest | IMAGE | chest becomes focal prop | Discovery visual |
| BOATHOUSE-02 | Reasonable opening attempts fail | LIVE | chest remains locked | Dialogue/action can carry |
| BOATHOUSE-03 | Henning's excessive solution; cut-away BOOM aftermath | MAJOR | chest opens; soot gag | No instructional depiction of explosives |
| BOATHOUSE-04 | Chest contents + photograph reveal same motorboat/mystery | MAJOR | tools/boat parts/photo become persistent | Act 3 mystery seed |
| BOATHOUSE-05 | Inventory finds; old work area too ruined/disorganized | LIVE | workbench problem established | Runtime staging |
| BOATHOUSE-06 | Clear/repair workbench area | LIVE | workshop starts taking shape | Runtime work |
| BOATHOUSE-07 | Mira organization solution / story purchase occurs around block | IMAGE | workshop supplies arrive | Purchase itself is intermediate, not contribution; exact mapping needs implementation care |
| BOATHOUSE-08 | Workshop becomes functional; photo mounted; “Allt… båten” | MAJOR | workshop state established | Strong visual identity payoff |
| BOATHOUSE-09 | Old hand-drawn soapbox-car plan found | IMAGE | plan becomes project prop | New side-project reveal |
| BOATHOUSE-10 | Collect/reuse parts and build first car | LIVE | car-in-progress | Runtime props/action |
| BOATHOUSE-11 | First test fails harmlessly; wheel comes off | MAJOR | failed prototype | Comic action worth dedicated still |
| BOATHOUSE-12 | Improved car succeeds; friendship payoff | IMAGE | completed soapbox car persists | Could become REUSE only if one composition can honestly carry success/failure, unlikely |
| BOATHOUSE-13 | Clear boat bay/slip area | LIVE | bay opens | Runtime work |
| BOATHOUSE-14 | Old trolley/slip mechanism restored; Linus may help | IMAGE | slip mechanism becomes functional-looking | Early chest parts may pay off |
| BOATHOUSE-15 | Safely test trolley/slip | LIVE | proves motorboat can later be brought in | Runtime animation/dialogue |
| BOATHOUSE-16 | Boathouse complete; “Den.” motorboat payoff | MAJOR | final workshop + photo + car + working slip | Completion Story Moment |

**Båthuset v1:** 5 LIVE, 5 IMAGE, 6 MAJOR = **11 dedicated-image candidates** before reuse audit.

### Motorbåten

| Beat | Core event | Delivery | Visual delta / family | Notes |
|---|---|---|---|---|
| MOTORBOAT-01 | Use restored slip to bring old motorboat into workshop | IMAGE | motorboat physically enters boathouse project space | Strong payoff to boathouse infrastructure |
| MOTORBOAT-02 | Clean/uncover and compare with old photograph; confirm same boat | IMAGE | identity detail becomes readable | Could potentially share image family with 01, not assumed |
| MOTORBOAT-03 | Damage worse than expected; Linus recognizes boat/mystery | LIVE | Linus joins repair support | Dialogue/runtime can carry recognition if boat/photo already established |
| MOTORBOAT-04 | First substantial repair; “Inte idag” setup | MAJOR | motorboat 1/4→2/4 | Thematic seed for beat 15 |
| MOTORBOAT-05 | Missing/unsalvageable need discovered | LIVE | need established | Keep deliberately non-technical |
| MOTORBOAT-06 | Mira can source it; major story-bound SysselBux purchase | IMAGE | package/order story beat | Exact item/price open; shop scene family |
| MOTORBOAT-07 | Package arrives; Alve wants to skip preparation, Linus stops him | LIVE | package at workshop | Runtime/dialogue sufficient |
| MOTORBOAT-08 | First controlled sign of life; “DEN LEVER LUGNT” | MAJOR | motorboat 2/4→3/4 | Comic/emotional mechanical payoff |
| MOTORBOAT-09 | Boat enters water via restored slip and floats | IMAGE | first water state | Distinct visual milestone |
| MOTORBOAT-10 | First powered water test, brief success then stop | MAJOR | boat moves under own power | Henning jetty gag can live on this image/dialogue |
| MOTORBOAT-11 | Village helps make boat journey-ready | IMAGE | safety/practical/provisions accumulate | Ensemble candidate; avoid checklist composition |
| MOTORBOAT-12 | Boat visually 4/4; Adam+Alve give it persistent name | MAJOR | restored named boat | Exact naming UX open; image should not bake dynamic name unless runtime overlay handles it |
| MOTORBOAT-13 | Prepare longer test; Linus deliberately stays ashore | LIVE | final prep | Runtime/dialogue sufficient |
| MOTORBOAT-14 | First real trip; restored lake seen from water | MAJOR | new lake perspective | Explicitly locked Major Story Moment |
| MOTORBOAT-15 | Harmless problem solved independently; “Inte idag” transformed | MAJOR | no damage regression | Character-arc payoff, other side remains undefined |
| MOTORBOAT-16 | Successful homecoming; cottage anomaly noticed; Alve runs | MAJOR | motorboat story complete → finale transition | May need one homecoming image plus finale-family sequence outside 64 |

**Motorbåten v1:** 4 LIVE, 5 IMAGE, 7 MAJOR = **12 dedicated-image candidates** before reuse audit.

### Triage result

Known candidate load before any reuse consolidation:
- Stugan: **9** dedicated-image candidates + 1 REUSE candidate.
- Bryggan: **10** dedicated-image candidates.
- Båthuset: **11** dedicated-image candidates.
- Motorbåten: **12** dedicated-image candidates.
- Family finale: outside the 64 contribution count and still requires its own consolidation pass.

With Bryggan now individually authored, the raw 64-beat pass contains **42 dedicated-image candidates before reuse consolidation**, plus the family finale outside the 64. This is intentionally a ceiling-like first pass, not the production count. Scene-family consolidation and honest reuse now determine the real generation queue.

### Immediate optimization opportunities

1. **Do not generate stage-change proof twice.** If a MAJOR image is already the emotional scene that introduces a new 2/4, 3/4 or 4/4 state, the runtime construction asset remains the canonical persistent proof afterward.
2. **Discovery + reaction may share one image** when the discovered object and characters can coexist honestly in the same composition (for example photograph reveals), with dialogue advancing over the still.
3. **Village-shop purchases should reuse scene families** where character/environment continuity allows, rather than inventing unique shop compositions for every purchase.
4. **Work beats remain LIVE** unless the work itself is the joke/reveal/payoff.
5. **Finale gets protected budget.** Do not cannibalize the family embrace/veranda payoff merely to hit a smaller image count.

### Triage gate update

**JETTY-05…15 are now individually authored in STORY_DESIGN.** The 64 contribution beats are sufficiently granular for the next pass: scene-family consolidation and reuse audit. Exact production image count remains intentionally unlocked until that pass is complete.
