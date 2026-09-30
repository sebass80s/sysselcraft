# ACT 2 STORY MOMENT MANIFEST

Status: **WORKING CANON / PRE-PRODUCTION**  
Date: 2026-09-28

## Purpose

This manifest is the production gate between Act 2 paper design and visual generation. Act 2 contains **64 authoritative real-world contribution beats**: 16 each for Stugan, Bryggan, Båthuset and Motorbåten. A contribution beat is not automatically a unique image. Before any production image is generated, every beat must be classified and every new image must receive a deterministic generation contract.

Canonical narrative source: `docs/STORY_DESIGN.md`. If this manifest conflicts with locked story canon, STORY_DESIGN wins until the conflict is deliberately resolved.

## Non-negotiable visual contract

- One generation = one finished production image. **No concept art, contact sheets or spritesheets.**
- Established characters are never regenerated from prose/memory alone. Production sessions begin with the canonical reference batch uploaded into the active image conversation: Barnet, puppy, Linus, Henning, Mira, Sol and approved Alve reference.
- Barnet is **always seen from behind** in Story Moments: canonical cap, backpack, clothes, proportions and silhouette; face never visible or invented.
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
7. **Barnet constraint** — explicit back-view composition when Adam is visible.
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
- Barnet back-view enforcement;
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

## Locked Act 2 opening sequence — 2026-09-30

The Act 2 opening is a **five-image non-contribution cinematic bridge** from the Act 1 village into the lake area. It occurs before the existing close bicycle beat and first Alve meeting. It is not part of the 64 contribution count.

Emotional progression: **impulse → pursuit → anticipation → discovery → human trace**.

| ID | Canonical asset | Story function | Locked staging |
|---|---|---|---|
| OPEN-001 | `/assets/village/story-moments/act2/opening/01-dog-runs-off.png` | Valpen triggers Act 2 | At the **forest edge**, the boundary between the familiar village/outskirts and the woods must read clearly. Valpen is actively running into the forest; Barnet follows, back-facing. Not already deep in the woods. |
| OPEN-002 | `/assets/village/story-moments/act2/opening/02-into-the-forest.png` | Pursuit leaves the known world behind | Forest is now **very dense**. Barnet runs along the path, back-facing. Valpen is **far ahead**, small in frame. No lake reveal yet. |
| OPEN-003 | `/assets/village/story-moments/act2/opening/03-through-the-trees.png` | Anticipation before reveal | Light changes ahead; only a restrained hint of blue/water through trees. Valpen leads. The full lake must not yet be revealed. |
| OPEN-004 | `/assets/village/story-moments/act2/opening/04-first-view-of-the-lake.png` | Major Act 2 world reveal | Barnet exits the trees and sees the lake for the first time. Barnet remains small/back-facing; Valpen is nearer the shore. Nature, scale and openness dominate. No civilization. |
| OPEN-005 | `/assets/village/story-moments/act2/opening/05-the-bicycle.png` | First human trace / bridge to Alve | The bicycle is visible **from a clear distance**. Barnet and Valpen have not reached it yet. This must not duplicate the following close bicycle beat. |

### Locked opening dialogue/runtime copy — REVISED 2026-09-30

The following is the exact canonical runtime dialogue for OPEN-001…OPEN-005. It supersedes the earlier shorter/ping-pong version. The sequence remains a non-contribution cinematic bridge and ends with the distant bicycle discovery before the separate close bicycle beat.

**OPEN-001 — Valpen sticker**

Du och Valpen är nästan framme vid skogsbrynet när han plötsligt stannar.

Öronen åker upp.

Han står helt stilla och tittar in mellan träden.

> **Barnet:** “Vad är det?”

Valpen tar några steg framåt, nosar i luften och sedan far han iväg.

> **Barnet:** “Hallå!”

Han springer rakt över den sista öppna marken och in bland träden.

> **Barnet:** “Valpen! Vänta!”

Du hinner bara se svansen försvinna bakom en gran.

Du tittar tillbaka mot byn.

Sedan mot skogen.

> **Barnet:** “Du får inte bara dra sådär.”

Inget svar. Bara något som prasslar längre in.

Du springer efter.

**OPEN-002 — In i skogen**

Stigen är tydlig i början, men blir snabbt smalare.

Grenar hänger ut över den och marken är full av rötter, mossa och gamla löv.

Valpen syns långt framför dig mellan träden.

> **Barnet:** “Sakta ner! Jag kommer ju!”

Han stannar ett ögonblick och tittar tillbaka.

Sedan springer han vidare.

> **Barnet:** “Jaha. Tack.”

Ju längre du kommer desto tätare blir skogen. Bakom dig går det nästan inte längre att se var du kom ifrån.

Du kliver över en rot och duckar under en låg gren.

> **Barnet:** “Du vet väl vart du ska?”

Valpen fortsätter utan att tveka.

> **Barnet:** “Bra. För det gör inte jag.”

**OPEN-003 — Något där framme**

Efter en stund märker du att skogen förändras.

Det blåser lite mer mellan träden.

Ljuset framför dig är starkare.

Valpen saktar äntligen ner.

> **Barnet:** “Vad har du hittat?”

Du går ikapp honom.

Mellan två stammar glittrar något blått till långt där framme.

Du tar några steg åt sidan för att se bättre.

Det glittrar igen.

> **Barnet:** “Är det vatten?”

Valpen börjar gå mot ljuset.

Inte springa längre.

Nästan som om han väntar på dig.

> **Barnet:** “Var det hit du skulle?”

Han fortsätter framåt.

Du följer efter.

**OPEN-004 — Sjön**

Träden tar plötsligt slut.

Du kommer ut ur skogen och stannar.

Framför dig ligger en stor sjö.

Vattnet sträcker sig långt bort mellan skogsklädda stränder och klippor. Efter den täta skogen känns platsen nästan enorm.

Valpen springer ner mot vattnet och börjar nosa längs strandkanten.

Du blir stående kvar en stund.

> **Barnet:** “Oj.”

Du går långsamt ner mot stranden.

Det finns inga hus omkring dig. Ingen väg. Ingen butik. Ingen som ropar från byn.

Bara sjön, skogen och den gamla stigen bakom dig.

> **Barnet:** “Hur har jag aldrig sett det här?”

Valpen är redan på väg vidare längs stranden.

> **Barnet:** “Du tänker inte börja springa igen va?”

Han fortsätter.

> **Barnet:** “Såklart.”

Du följer efter.

**OPEN-005 — Cykeln**

Efter en bit lämnar ni stranden och går in bland träden igen.

Inte långt.

Valpen stannar.

Den här gången ser du direkt vad han tittar på.

Längre fram står en cykel lutad mot ett träd.

Du stannar också.

> **Barnet:** “Va?”

Cykeln är långt bort, men den är alldeles för ren och hel för att ha stått där övergiven särskilt länge.

Valpen börjar gå mot den.

> **Barnet:** “Vems är den där?”

Du tittar runt mellan träden.

För första gången känns platsen inte tom längre.

Någon har cyklat hit.

Och om cykeln är kvar så borde personen också vara det.

> **Barnet:** “Okej…”

Du börjar gå mot cykeln.

> **Barnet:** “Då är det någon här.”

After OPEN-005, continue directly into the existing close bicycle beat (meeting-alve/bike.png) and then the revised canonical Alve meeting sequence in STORY_DESIGN.md. OPEN-005 must remain the distant discovery; the next beat earns the close inspection.

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
| COTTAGE-12 | Evidence somebody from home visited unseen; hope surges | MAJOR | mystery object + restored veranda/next stage | Do not show family; exact object locked: Alve's familiar keyring from home |
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


## Scene-family consolidation pass v1 — 2026-09-28

The raw triage intentionally over-counted visual candidates. This pass asks a stricter question: **which moments truly need a distinct composition?** Stage changes remain persistent runtime assets and dialogue can advance over a held still. The queue below is a proposed production set, not generation authorization.

### Stugan scene families
- **IMG-A2-COT-001 — Memory discoveries.** Serves COTTAGE-02 + COTTAGE-03 as one authored discovery sequence/composition: uncovered height marks plus family photograph, with dialogue changing over the held image. Do not require two separate stills unless composition audit proves both cannot read clearly.
- **IMG-A2-COT-002 — Why Alve is rebuilding.** COTTAGE-04 MAJOR. First substantial restoration and Alve's family-return hope.
- **IMG-A2-COT-003 — Floor is lava.** COTTAGE-06. Playful friendship image.
- **IMG-A2-COT-004 — Rain/game.** COTTAGE-07 + COTTAGE-08. One MAJOR rain composition can carry cheating dialogue, “Regnet” and “Det ser bättre ut” if the stage swap happens immediately after/under runtime rather than requiring a second still.
- **IMG-A2-COT-005 — VÅR STUGA drawing.** COTTAGE-09. Discovery composition.
- **IMG-A2-COT-006 — Someone was here.** COTTAGE-12 MAJOR. Evidence from home, no family shown.
- **IMG-A2-COT-007 — Ready for people.** COTTAGE-15 + COTTAGE-16 candidate consolidation: warm finished/near-finished cottage, Alve imagining family, then completion dialogue. Must audit whether final-stage state can honestly serve both beats.

**Stugan proposed queue: 7 images** (down from 9 dedicated candidates + reuse candidate).

### Bryggan scene families
- **IMG-A2-JET-001 — Worse underneath.** JETTY-02. Damage reveal.
- **IMG-A2-JET-002 — Linus returns to lake.** JETTY-03 + JETTY-04 candidate consolidation: salvage arrival and first major repair payoff. Stage transition can happen in runtime after dialogue.
- **IMG-A2-JET-003 — Sol safety visit.** JETTY-06. One image carries inspection dialogue and life-buoy requirement.
- **IMG-A2-JET-004 — Life buoy installed.** JETTY-08 MAJOR. Permanent safety/social milestone.
- **IMG-A2-JET-005 — First visitor / first use.** JETTY-10 + JETTY-11 candidate family. Prefer one authored visitor who can plausibly witness/join the first water break; exact visitor must be locked before generation. If that harms the friendship beat, split.
- **IMG-A2-JET-006 — Summer place complete.** JETTY-12 + JETTY-15 + JETTY-16 candidate consolidation. Use the final beautiful jetty composition for near-completion anticipation and completion dialogue while runtime owns the actual 4/4 persistent state. Do not populate it with the later random ambient pool during the completion moment unless story specifically calls for it.

**Bryggan proposed queue: 6 images** (down from 10 candidates).

### Båthuset scene families
- **IMG-A2-BOAT-001 — Locked chest discovered.** BOATHOUSE-01 + BOATHOUSE-02. One composition, dialogue covers failed reasonable attempts.
- **IMG-A2-BOAT-002 — BOOM aftermath.** BOATHOUSE-03 MAJOR. Soot-covered Henning, open chest; never depict actionable explosive setup.
- **IMG-A2-BOAT-003 — Photograph/motorboat mystery.** BOATHOUSE-04 MAJOR. Chest contents + photograph readable enough for reaction.
- **IMG-A2-BOAT-004 — Mira/workshop transformation.** BOATHOUSE-07 + BOATHOUSE-08 candidate consolidation. Prefer workshop-supply arrival leading directly into functioning-workshop payoff; Mira need not remain in final workshop frame if continuity demands split.
- **IMG-A2-BOAT-005 — Soapbox plan.** BOATHOUSE-09.
- **IMG-A2-BOAT-006 — Wheel-off test.** BOATHOUSE-11 MAJOR.
- **IMG-A2-BOAT-007 — Successful soapbox car.** BOATHOUSE-12. Needed because failure and success communicate different story facts.
- **IMG-A2-BOAT-008 — Slip restored.** BOATHOUSE-14. Linus support can occur through dialogue/runtime around this composition.
- **IMG-A2-BOAT-009 — Workshop complete / “Den.”** BOATHOUSE-16 MAJOR. Must preserve workbench, photo, soapbox car and working slip.

**Båthuset proposed queue: 9 images** (down from 11 candidates).

### Motorbåten scene families
- **IMG-A2-MTR-001 — Old boat enters workshop / same boat.** MOTORBOAT-01 + MOTORBOAT-02 consolidation: boat on restored slip with old photograph available for comparison.
- **IMG-A2-MTR-002 — First substantial repair / “Inte idag”.** MOTORBOAT-04 MAJOR.
- **IMG-A2-MTR-003 — Mira package.** MOTORBOAT-06. Reuse the canonical Mira/shop environment family rather than inventing a new visual language.
- **IMG-A2-MTR-004 — First sign of life.** MOTORBOAT-08 MAJOR.
- **IMG-A2-MTR-005 — It floats.** MOTORBOAT-09.
- **IMG-A2-MTR-006 — First powered attempt.** MOTORBOAT-10 MAJOR; Henning's shore dialogue can run over same still.
- **IMG-A2-MTR-007 — Village makes it journey-ready.** MOTORBOAT-11. Ensemble only if canonical references can be held reliably; otherwise prefer runtime dialogue over multiplying stills.
- **IMG-A2-MTR-008 — Their named boat.** MOTORBOAT-12 MAJOR. Do not bake a dynamic player-chosen name into generated pixels; render/overlay name in runtime if required.
- **IMG-A2-MTR-009 — We are actually boating.** MOTORBOAT-14 MAJOR. Reusable foundation for later ordinary crossings only if future continuity matches.
- **IMG-A2-MTR-010 — “Inte idag” on the water.** MOTORBOAT-15 MAJOR. Distinct emotional composition looking toward undefined other side; show no Act 3 destination.
- **IMG-A2-MTR-011 — Homecoming / cottage anomaly.** MOTORBOAT-16 MAJOR. Can carry arrival dialogue and transition attention toward open/lit cottage.

**Motorbåten proposed queue: 11 images** (down from 12 candidates).

### Family finale protected queue
These are outside the 64 contribution count and are not aggressively collapsed because they carry the Act 2 emotional climax.

**Family continuity lock:** finale art shows **Alve's father + older sister in her early teens** returning to the cottage. Alve's mother does not physically return in Act 2. Child-facing dialogue only establishes that **mamma blev sjuk** and that the family stopped coming afterward; adult players can infer the deeper loss from her absence and the old family photograph. The mother may appear only in clearly historical material such as that photograph.
- **IMG-A2-FIN-001 — Something is wrong at the cottage.** Alve + Adam approach; jacket/bag/open door/light; suspense, no family reveal yet.
- **IMG-A2-FIN-002 — Familiar laughter / family reveal.** Alve recognizes what he hears/sees; father + early-teen older sister visibly unpacking/using cottage. The mother is absent except in the old historical family photograph.
- **IMG-A2-FIN-003 — Family embrace.** MAJOR. Alve is embraced by father + early-teen older sister; Adam slightly behind and strictly back-facing. The mother must not appear physically. Dialogue continues into the friendship payoff: “Det är min kompis.”
- **IMG-A2-FIN-004 — Preserved memories.** Height marks / game / VÅR STUGA discovery by family. Candidate REUSE of FIN-002 if composition can honestly show these details; do not force.
- **IMG-A2-FIN-005 — Veranda / living lake / “Det är bättre.”** MAJOR final Act 2 emotional image. Must show restored lake without revealing Act 3 destination. The dialogue thesis is **“Jag kunde inte laga det som hände. Men jag kunde laga stugan.”** followed by **“Du lagade mer än stugan.”**

**Finale protected queue: 5 images, with FIN-004 a consolidation candidate.**

**Canonical finale asset filenames on disk — LOCKED:**
- FIN-001 → `public/assets/village/story-moments/act2/finale/01-something-is-different.png`
- FIN-002 → `public/assets/village/story-moments/act2/finale/02-family-return.png`
- FIN-003 → `public/assets/village/story-moments/act2/finale/03-family-embrace.png`
- FIN-005 → `public/assets/village/story-moments/act2/finale/04-home-again.png`

The sequence is intentionally numbered **01–04 on disk** even though the protected manifest IDs retain FIN-001/002/003/005 for historical stability. FIN-004 remains merged into FIN-002 and must not receive a separate file unless the manifest is explicitly reopened.

### Consolidated count v1
- Stugan: 7
- Bryggan: 6
- Båthuset: 9
- Motorbåten: 11
- Finale: 5

**Proposed maximum production queue after first consolidation: 38 images.** If FIN-004 folds into FIN-002, 37. This is substantially below the raw candidate ceiling but still intentionally conservative: no story payoff has been deleted merely to chase a target number.

### Next reduction pass
Before writing generation contracts, challenge each of these 38 with three tests:
1. Can the same story fact be communicated by the accepted runtime world + dialogue with no emotional loss?
2. Can two adjacent image IDs share one composition without lying about stage/props/cast/time?
3. Is this image memorable enough that Adam would notice its absence?

Only survivors receive Generation Contracts.


## Ruthless reduction pass v2 — 2026-09-28

Applied the three locked tests to the 38-image v1 queue: runtime sufficiency, honest adjacent consolidation, and “would Adam notice the missing still?”. This pass protects reveals/payoffs and removes stills whose only job is to document work already visible in runtime assets.

### Stugan: 7 → 6
- **KEEP COT-001 Memory discoveries** — height marks + family photo are foundational visual evidence.
- **KEEP COT-002 Why Alve is rebuilding** — emotional thesis.
- **CUT COT-003 Floor is lava as dedicated still** — the joke/play can run as in-world dialogue/animation; the stronger friendship image is the rain scene immediately afterward.
- **KEEP COT-004 Rain/game** — MAJOR, unique mood/new memory.
- **KEEP COT-005 VÅR STUGA drawing** — concrete memory object and later finale callback.
- **KEEP COT-006 Someone was here** — mystery/hope reveal needs visual evidence.
- **KEEP COT-007 Ready for people / cottage completion** — carries COTTAGE-15→16.

### Bryggan: 6 → 4
- **CUT JET-001 Worse underneath** — damaged runtime jetty + dialogue can communicate deeper rot.
- **KEEP JET-002 Linus returns / salvage repair** — first Act 1 resident returning to lake and first major restoration payoff.
- **KEEP JET-003 Sol safety visit** — distinct character/world-support scene; establishes life-buoy causality.
- **CUT JET-004 Life buoy installed as dedicated still** — permanent buoy and stage advance are better shown directly in runtime; dialogue can celebrate installation.
- **KEEP JET-005 First visitor / first use** — proof the lake is becoming social again. Lock visitor during contract pass; composition should privilege Adam+Alve friendship rather than crowd spectacle.
- **KEEP JET-006 Summer place complete** — project completion payoff.

### Båthuset: 9 → 7
- **KEEP BOAT-001 Locked chest discovered** — mystery object setup.
- **KEEP BOAT-002 BOOM aftermath** — unique comic MAJOR.
- **KEEP BOAT-003 Photograph/motorboat mystery** — Act 3 seed.
- **CUT BOAT-004 Mira/workshop transformation as dedicated still** — Mira purchase can occur in existing shop presentation; workshop stage/state is visible in runtime. Preserve locked dialogue there.
- **KEEP BOAT-005 Soapbox plan** — visual object starts the self-directed friendship project.
- **KEEP BOAT-006 Wheel-off test** — unique comic action.
- **CUT BOAT-007 Successful soapbox-car still** — completed car becomes a persistent runtime prop; success dialogue can occur beside it. Failure image + persistent finished prop communicates the arc without another still.
- **KEEP BOAT-008 Slip restored** — important physical setup/payoff for later motorboat project.
- **KEEP BOAT-009 Workshop complete / “Den.”** — completion MAJOR.

### Motorbåten: 11 → 8
- **KEEP MTR-001 Old boat enters workshop / same boat** — joins boathouse payoff to photograph history.
- **KEEP MTR-002 First substantial repair / “Inte idag”** — thematic setup.
- **CUT MTR-003 Mira package as dedicated still** — use existing shop presentation + runtime package at worksite. No need to redraw Mira for a transaction.
- **KEEP MTR-004 First sign of life** — MAJOR.
- **CUT MTR-005 It floats as dedicated still** — runtime boat-in-water state can carry the short “den flyter” joke.
- **KEEP MTR-006 First powered attempt** — MAJOR and genuinely different action.
- **CUT MTR-007 Village makes it journey-ready as dedicated still** — ensemble generation is expensive/error-prone and the story fact is better delivered through individual village interactions + accumulating runtime props.
- **KEEP MTR-008 Their named boat** — ownership/emotional transition; exact name rendered in runtime, not generated pixels.
- **KEEP MTR-009 We are actually boating** — MAJOR, new viewpoint and later transport visual foundation.
- **KEEP MTR-010 “Inte idag” on water** — character-arc payoff and mystery horizon.
- **KEEP MTR-011 Homecoming / cottage anomaly** — finale transition.

### Finale: 5 → 4
- **KEEP FIN-001 Something is wrong at cottage** — suspense before reveal.
- **MERGE FIN-002 + FIN-004 → FIN-002 Family reveal / returned home** — family unpacking/using cottage with old game and preserved memories visible in environment. Dialogue can later call attention to height marks/drawing without a separate still.
- **KEEP FIN-003 Family embrace / “Han är min kompis”** — protected emotional MAJOR.
- **KEEP FIN-005 Veranda / “Det är bättre”** — protected final Act 2 image.

### Production queue v2

| Family | v1 | v2 |
|---|---:|---:|
| Stugan | 7 | **6** |
| Bryggan | 6 | **4** |
| Båthuset | 9 | **7** |
| Motorbåten | 11 | **8** |
| Finale | 5 | **4** |
| **TOTAL** | **38** | **29** |

**29 images is the current proposed production queue.** This pass removes 9 generation targets without deleting a locked narrative beat. Removed moments are explicitly reassigned to runtime/dialogue/persistent props rather than silently disappearing.

### Stop condition for further cutting
Do not chase a smaller number for its own sake. A third reduction pass should only remove an image if a concrete runtime/reuse replacement is named. In particular, protect:
- Stugan rain/new-memory beat;
- somebody-was-here clue;
- Henning BOOM aftermath;
- motorboat photograph mystery;
- soapbox failure;
- first motor life;
- first powered attempt;
- first real boat trip;
- transformed “Inte idag”;
- family suspense/reveal/embrace/veranda payoff.

### Next gate
The 29-image queue is now small enough to begin **contract drafting by scene family**. Draft contracts before generation, starting with Stugan because it has the most contained cast/environment continuity. No image generation is authorized by this reduction pass alone.


## Proof-of-concept visual locks — 2026-09-28

The first Barnet + Alve Story Moment pipeline test produced an accepted keeper. The following rules are now production constraints for all Act 2 Story Moments:

### Canonical character reference pack
The local production reference pack contains clean canonical sheets for:
- Barnet
- Alve
- Linus
- Henning
- Mira
- Sol
- Valpen

These sheets are identity ground truth. Upload the relevant sheets into the active image-production conversation before generating a scene. Do not reconstruct established characters from prose or memory when a sheet exists.

### Barnet
- Always shown from behind or a rear angle.
- Face must never be shown or invented.
- Preserve canonical cap, backpack, clothes, shoes, proportions and silhouette.

### Valpen — default presence rule
- **Valpen is present in every Story Moment in which Barnet appears.**
- Unless the locked story beat explicitly gives Valpen an action, Valpen is a passive/background participant only.
- Passive examples: sitting, lying down, standing nearby, quietly looking/nosing around.
- Do not let Valpen steal focus, initiate action, alter blocking, or create a new story event unless the beat explicitly requires it.
- Use the canonical Valpen reference sheet, not a generic puppy.

### Act 2 background rule
- **No visible civilization in Act 2 lake Story Moments unless a later locked story beat explicitly establishes it.**
- No Act 1 village skyline, church, house rows, harbor, modern boat traffic, streets or unrelated buildings in the distance.
- Background language is isolated lake wilderness: forest, water, rocks, reeds, overgrown paths and the established Act 2 project locations.
- Residents may appear when the story brings them to the lake, but the background must not imply the village is physically adjacent.

### First meeting — accepted visual contract
The accepted first-meeting composition establishes the intended baseline:
- Barnet arrives at the neglected cottage and is seen strictly from behind.
- Valpen accompanies Barnet but remains passive.
- Alve is already attempting to repair the cottage alone, with ordinary hand tools and visibly over-ambitious work around him.
- Alve looks up with **mild suspicion / guarded surprise**, not fear, hostility or immediate friendliness.
- Alve does not present the cottage or ask for help in the image; Barnet has interrupted his work.
- The cottage reads as an abandoned/neglected family cottage at an isolated lake, not a harbor shed or boathouse.
- Warm cinematic semi-realistic CGI/storybook rendering consistent with the canonical character sheets and accepted SysselCraft Story Moments.
- Landscape composition suitable for the game's iPhone Story Moment presentation.

This accepted first-meeting image is the proof that the character-sheet workflow can preserve Barnet + Alve + Valpen in one production composition. Future generations should use this workflow rather than treating each Story Moment as a fresh character-design task.


## Stugan production contracts - LOCKED PRE-GENERATION 2026-09-28

This section completes the image-production gate for Stugan only. It deliberately reduces the 16 contribution beats to nine production stills. Every omitted beat remains authored gameplay delivered through runtime dialogue, project-state changes or persistent props. Do not generate extra Stugan images unless a concrete runtime acceptance test proves one of these nine cannot carry its assigned story function.

### Stugan beat-to-delivery map

| Beat | Delivery | Production handling |
|---|---|---|
| COTTAGE-01 | LIVE | Enter/air/clear in runtime. Alve's familiarity comes through dialogue. |
| COTTAGE-02 | IMAGE | Served by COT-001 together with COTTAGE-03. |
| COTTAGE-03 | IMAGE | Served by COT-001 together with COTTAGE-02. |
| COTTAGE-04 | MAJOR | COT-002. First substantial restoration and Alve's motive. |
| COTTAGE-05 | LIVE | Recover old game in runtime; game becomes persistent prop. |
| COTTAGE-06 | LIVE | Floor-is-lava memory/play in runtime. No dedicated still. |
| COTTAGE-07 | MAJOR | COT-003. Rain + old game + first new good cottage memory. |
| COTTAGE-08 | REUSE | Continue dialogue over COT-003, then swap persistent cottage stage in runtime. |
| COTTAGE-09 | IMAGE | COT-004. VÅR STUGA drawing discovery. |
| COTTAGE-10 | LIVE | Veranda work and ordinary memories in runtime. |
| COTTAGE-11 | LIVE | Family-knowledge dialogue in runtime. |
| COTTAGE-12 | MAJOR | COT-005. Evidence somebody from home visited unseen. |
| COTTAGE-13 | LIVE | Remaining repair in runtime. |
| COTTAGE-14 | LIVE | Prepare chairs/sleeping/guest readiness through persistent props. |
| COTTAGE-15 | REUSE | Alve imagines family using the ready cottage over COT-006. |
| COTTAGE-16 | MAJOR | COT-006. Cottage complete; nobody arrives. |

### Shared visual contract for all nine Stugan images

Required reference inputs before generation:
- canonical Barnet character sheet;
- canonical Alve character sheet;
- canonical Valpen character sheet;
- the accepted Act 2 cottage/stuga environment state appropriate to the beat, preferably the actual runtime stage asset or a screenshot/composite from the accepted Lake Master;
- once COT-001 is accepted, accepted Stugan stills may be secondary continuity references. They never replace canonical character sheets.

Hard locks:
- Barnet is always rear/rear-three-quarter only. Never show or invent the face.
- Preserve Barnet's canonical cap, backpack, red hoodie, blue cargo pants, shoes, proportions and silhouette.
- Valpen is present whenever Barnet appears, passive unless the beat explicitly requires otherwise.
- Alve must match the canonical sheet, including child proportions, hair/freckles, clothing and practical/wild personality.
- Warm cinematic semi-realistic CGI/storybook look. No anime, glossy-cartoon drift, enlarged eyes or chibi proportions.
- Landscape/iPhone Story Moment framing.
- No visible civilization: no village skyline, church, house rows, harbor, streets, unrelated buildings or modern boat traffic.
- Do not add Linus, Henning, Mira, Sol, Alve's family or other people to any of these nine images.
- Do not add the motorboat mystery photograph from Båthuset. The Stugan family photograph is a separate ordinary family memory.
- Do not bake runtime dialogue into pixels.
- Persistent memory objects survive later Stugan images once introduced: height marks, family photo, old game and VÅR STUGA drawing according to chronology.
- The cottage evolves from neglected to warm/usable without losing its recognizable identity. Do not redesign it between stills.
- Alve's family never appears in the Stugan 1-16 image batch. Their return belongs after MOTORBOAT-16.

### IMG-A2-COT-001 - Memory discoveries

Serves COTTAGE-02 + COTTAGE-03. Half-cleared neglected cottage interior. Alve has exposed old height marks on a wall/door frame while the newly found ordinary family photograph is also readable as an object in the scene. Dialogue first focuses on the marks and then the photo without changing image.

Composition: interior medium-wide. Barnet rear-facing, looking toward Alve/marks. Alve close enough to marks/photo that the discoveries connect visually to him. Valpen passive near Barnet or floor edge. Room still reads neglected and early-restoration.

Required: height marks, small family photograph, clearing/work traces, canonical characters.
Must not show: invented readable family names/dates, family physically present, pristine room, Båthuset motorboat photo, extra workers.
Continuity out: height marks protected forever; family photo becomes persistent cottage memory.
Acceptance: both discoveries readable without prop-close-up composition; Barnet face invisible; Alve canonical; Valpen passive; cottage clearly early-stage.

### IMG-A2-COT-002 - Why Alve is rebuilding

Serves COTTAGE-04. First substantial restoration payoff and emotional thesis. Alve reveals he hoped that making the cottage look like before might make his family want to return.

Exact moment: after visible first restoration progress, Barnet and Alve pause and look at what they achieved. Alve is quieter/more vulnerable than usual, not melodramatic.

Composition: warm medium-wide interior or threshold showing meaningful improvement over COT-001 while preserving cottage identity. Barnet rear-facing. Alve emotional focal point. Valpen passive.
Required: protected height marks if that wall is visible, family photo deliberately kept, repaired/cleared area.
Must not show: family, fully completed cottage, rain-game setup, fully restored veranda.
Runtime dialogue carries the locked COTTAGE-04 exchange.
Continuity out: cottage advances to next persistent visual stage; Alve's motive is known.

### IMG-A2-COT-003 - Rain and the old game

Serves COTTAGE-07 + COTTAGE-08. Alve stops merely excavating old happiness and creates a new good cottage memory with Barnet. This is the strongest friendship image in the Stugan batch.

Exact moment: rain against windows. Barnet and Alve are inside the partly restored cottage playing the recovered worn family board/card game. Alve has playful energy supporting the cheating joke. Valpen rests nearby.

Composition: cozy interior wide/medium-wide. Rain clearly visible without making room gloomy. Barnet strictly rear/rear-three-quarter. Alve visible across/beside game. Valpen relaxed. Old memory props may sit naturally in background.
Required: old game, rain, partial restoration, prior memory props if visible.
Must not show: family, storm damage, horror/sadness framing, finished cottage, unrelated toys.
Runtime dialogue: cheating joke, then the locked rain exchange and COTTAGE-08 payoff. Persistent stage swap happens in runtime after/around this held image.
Continuity out: old game remains persistent; scene is a new Barnet+Alve memory.

### IMG-A2-COT-004 - VÅR STUGA

Serves COTTAGE-09. Reveal Alve's childhood drawing and let an ordinary embarrassing childhood object motivate veranda restoration.

Exact moment: Barnet has found the old drawing. Alve recognizes it and is mildly embarrassed/defensive.
Composition: interior medium shot, Barnet rear-facing holding or indicating drawing while Alve reacts. Valpen passive. Drawing reads as a child's drawing of cottage + lake + family + amusingly disproportionate boat, headed VÅR STUGA. If generated fine lettering is unreliable, runtime close-up/overlay may carry exact text instead.
Required: childlike drawing; established memory props where composition permits.
Must not show: Act 3 destination, Båthuset motorboat photo, family physically present, invented family lore.
Runtime dialogue carries the locked denial joke.
Continuity out: drawing becomes persistent cottage memory and motivates veranda work.

### IMG-A2-COT-005 - Someone was here

Serves COTTAGE-12. A subtle visual mystery changes Alve's hope. Somebody from home has visited while Barnet and Alve were away, but story withholds who and why.

Exact moment: Barnet and Alve notice a small ordinary object from Alve's home that was not in cottage before. Alve recognizes it immediately.

LOCKED PROP: the clue is **Alve's familiar keyring from home**. It is mundane, visually legible and personal enough for Alve to recognize without identifying which family member visited.

Composition: restored-progress cottage/veranda vicinity. Barnet rear-facing. Alve focused on clue, surprised/newly hopeful rather than frightened. Valpen passive. Restored veranda/progress places scene late in third block.
Must not show: family member, silhouette, vehicle, identifying footprints, explanatory note, burglary framing, Act 3 clue.
Runtime dialogue carries the locked “Hemma” and “Då måste vi hinna klart” exchange.
Continuity out: Alve knows somebody from home has seen cottage; identity remains unknown.

### IMG-A2-COT-006 - Complete, but not today

Serves COTTAGE-15 + COTTAGE-16. Show finished emotional place containing old memories and new ones. Alve can imagine family here, but nobody arrives. Hopeful, not abandoned.

Exact moment: cottage complete and genuinely ready for people. Barnet and Alve have finished arranging it and pause after briefly waiting. Alve's attention can suggest empty doorway/path without making composition lonely.

Composition: beautiful wide establishment of completed cottage interior/threshold with enough environment to read accumulated history. Barnet rear-facing. Alve relaxed/thoughtful. Valpen passive. This is definitive Stugan completion still.
Required persistent history: height marks, family photo, old game, VÅR STUGA drawing, evidence room is ready for people, subtle evidence of Barnet+Alve's new memories. Natural composition, not checklist tableau.
Must not show: Alve's family, surprise visitors, motorboat restoration underway, Act 3 destination, generic reset interior.
Runtime dialogue carries COTTAGE-15 imagination then locked completion exchange ending with “Vi har ju en båt att laga.”
Continuity out: Stugan story-complete and remains warm usable place; family return reserved for post-MOTORBOAT-16.

### Stugan production queue and stop gate

Generate in this order only after required references are uploaded into active image conversation:
1. IMG-A2-COT-001 Memory discoveries
2. IMG-A2-COT-002 Why Alve is rebuilding
3. IMG-A2-COT-003 Rain and the old game
4. IMG-A2-COT-004 VÅR STUGA
5. IMG-A2-COT-005 Someone was here
6. IMG-A2-COT-006 Complete, but not today

Stugan production count is now locked at **nine accepted-intent stills**: the six narrative/memory stills plus three restoration-work stills added after visual continuity review showed that the 16-contribution arc otherwise skipped too much of the actual rebuilding.

Do not start image generation until:
- Barnet, Alve and Valpen canonical sheets are present in active image conversation;
- a reliable Stugan environment/stage reference is present for the relevant still;
- the COTTAGE-12 clue is Alve's familiar keyring from home.

No Linus/Henning/Mira/Sol reference is needed for this nine-image Stugan batch.


### Stugan restoration-work addendum — LOCKED AFTER PRODUCTION REVIEW 2026-09-28

Runtime/story review exposed one concrete visual gap in the original six-still economy pass: Stugan showed discoveries and emotional payoffs but too little of Barnet and Alve physically restoring the building. Three work stills are therefore canonical production requirements. They do **not** create extra contribution beats; they visualize existing restoration progress between the locked 1–16 beats.

- **IMG-A2-COT-007 — Early restoration work.** Barnet and Alve actively clear/repair the still badly damaged cottage. Barnet strictly rear-facing, canonical cap/backpack/clothes; Alve canonical; Valpen passive. Cottage remains clearly early-stage.
- **IMG-A2-COT-008 — Mid restoration work.** Barnet and Alve repair structural/porch elements together with visible progress but substantial work remaining. Same character locks and isolated-lake environment.
- **IMG-A2-COT-009 — Veranda restoration.** Barnet and Alve actively restore the veranda/outdoor area motivated by the VÅR STUGA drawing. This visually bridges COTTAGE-09 through COTTAGE-12 and the restored-veranda state.

Hard acceptance for all three work stills:
- Barnet is visible only from behind/rear-three-quarter; face never visible.
- Alve matches the canonical reference sheet and semi-realistic style.
- Valpen is present and passive.
- Background is isolated Act 2 lake wilderness only: forest, water, rocks, reeds/nature. **No church, village, house rows, harbor, roads, modern boat traffic or other civilization.**
- Use the accepted Stugan stage progression as visual ground truth; do not redesign the cottage.
- No extra characters or invented story events.

Failed generations that showed Barnet from the front or visible civilization are explicitly rejected and are **not canon assets**.

### Stugan image-production status — 2026-09-28

The Stugan Story Moment production pass is complete at the conversation/creative-acceptance level: **9 intended production stills total** (COT-001…COT-009). The six narrative stills cover memory discoveries, Alve's motive, rain/game friendship, VÅR STUGA, the home-keyring clue and completed cottage. The three added work stills cover the missing physical-restoration rhythm.

This does **not** mean runtime integration is complete. Next implementation gate is: place the accepted exported files under the Act 2 Stugan Story Moment asset folder, map them to the correct contribution beats, then verify the 1–16 sequence in isolated `/act2-test` before any production Act 2 map/save integration.


### Stugan runtime acceptance — 2026-09-28

The exported Stugan set is now present in repo at `public/assets/village/story-moments/act2/cabin/`: ordered narrative stills `1.png` through `6.png` plus `renovating-cabin1.png`, `renovating-cabin2.png`, and `renovating-cabin3.png`.

The isolated `/act2-test` sequence was wired in commit `3155894ebc62edb74b117c479b0676133b638c4a`. The three work stills were placed into the authored rhythm rather than treated as extra contributions: early work at 1/16, mid work at 5–6/16, veranda work at 10–11/16. The six ordered narrative stills retain their canonical story order. Kalle played the resulting browser flow and accepted the visual/story sequence on 2026-09-28.

**Status: Stugan Story Moment production + isolated browser acceptance complete. Production Act 2 save/map integration remains deliberately NOT done.**


## ACT 2 IMAGE GENERATION PROTOCOL — HARD LOCK 2026-09-29

This protocol exists because prose rules alone did not prevent prompt/style drift during Bryggan production. It is a mechanical production gate, not optional guidance.

### Core law

**Do not freely rewrite image-generation prompts between images.** Every Act 2 production generation must use the same frozen base contract below. Only the per-image variables may change.

Allowed variables:
- `IMAGE_ID`
- `CAST`
- `VISUAL_STAGE_REFERENCE`
- `ACTION`
- `CONTINUITY_OBJECTS`
- `IMAGE_SPECIFIC_MUST_NOT_SHOW`

Everything else is frozen. Do not creatively paraphrase, embellish, shorten, substitute a style synonym, or add an aesthetic label.

### Reference hierarchy

1. The correct accepted environment/stage image is authority for project geometry/state and Act 2 environment.
2. Canonical character sheets are authority for character identity, clothing, proportions and silhouette only.
3. Character-sheet backgrounds are NEVER environment references and must be ignored.
4. The locked story/Story Moment contract is authority for action, cast and continuity.
5. If references conflict or a required reference is absent, STOP. Do not improvise.

### Frozen base generation contract — COPY VERBATIM

> Create ONE finished landscape/iPhone SysselCraft Story Moment for IMAGE_ID.
>
> Use VISUAL_STAGE_REFERENCE as the visual authority for the restoration project's geometry, construction state and lake environment. Do not redesign the accepted project stage.
>
> Use the supplied canonical character sheets ONLY for the identities, clothing, proportions and silhouettes of CAST. Ignore every background/environment visible in character reference sheets.
>
> STYLE LOCK: warm cinematic semi-realistic CGI / photographic storybook. Natural human anatomy and proportions. Natural small eyes. Realistic skin, hair, fabric, wood, water and vegetation. Subtle believable facial expressions. Cinematic natural daylight and physically believable materials. Preserve the established SysselCraft character identities without converting them into an animated-film aesthetic.
>
> ABSOLUTELY FORBIDDEN STYLE DRIFT: cartoon, glossy cartoon, animated-film aesthetic, Pixar-like rendering, Disney-like rendering, anime, chibi, giant or exaggerated eyes, oversized heads, plastic toy-like skin/materials, caricatured faces, flat vector/clipart styling.
>
> CHILD LOCK: Barnet/Adam is shown only from the back or rear-three-quarter. His face must never be visible, inferred or invented. Preserve his canonical cap, red hoodie, blue cargo pants, blue/gray shoes, rugged olive/brown backpack and established body proportions.
>
> PUPPY LOCK: when Barnet is present, Valpen is present unless the image contract explicitly says otherwise. Valpen remains passive/background unless the image contract explicitly authors an action.
>
> ALVE LOCK: when Alve is present, preserve his canonical messy reddish-brown hair, freckles, natural/small eyes, olive/gray hoodie, gray-brown cargo shorts, sturdy brown boots, work gloves, tool belt/pouches and established natural proportions.
>
> ENVIRONMENT LOCK: isolated Act 2 lake wilderness only: lake, forest, rocks, reeds and natural vegetation consistent with VISUAL_STAGE_REFERENCE. Absolutely no village skyline, church, houses, house rows, harbor, roads, vehicles, modern traffic, unrelated buildings, random people or other signs of civilization.
>
> COMPOSITION LOCK: one coherent full-frame image only. No diptych, split screen, collage, contact sheet, sprite sheet, multiple panels, inset image, UI, caption or baked-in text.
>
> CAST LOCK: show exactly CAST and no additional people or characters.
>
> ACTION: ACTION
>
> CONTINUITY OBJECTS: CONTINUITY_OBJECTS
>
> IMAGE-SPECIFIC MUST NOT SHOW: IMAGE_SPECIFIC_MUST_NOT_SHOW
>
> Do not add story events, props, purchases, injuries, residents, construction progress or environmental features not authorized by the image contract.

### Visual-anchor production law — EDIT FIRST

Once an Act 2 Story Moment series has an accepted production image, **fresh text-to-image is no longer the default path for subsequent images in that series**.

The default continuation path is:

1. use the latest accepted production image as the visual anchor;
2. use the correct accepted stage image as geometry/state authority;
3. use canonical character sheets only to preserve/resolve character identity details;
4. edit the anchored image toward the next locked story state;
5. describe in text only the required change in action/cast/stage/continuity;
6. preserve all unmentioned rendering, character, camera and material decisions from the accepted anchor.

Fresh text-to-image is allowed only when:
- no accepted production anchor exists yet for that series; or
- a deliberate production reset has been explicitly chosen because the anchor itself is unsuitable.

For Bryggan, once an image has been accepted and the user advances with `next` / `nästa` / the next production ID, that image becomes the continuity anchor for the following edit unless a later accepted frame supersedes it.

Hard prohibitions:
- do not redescribe an established recurring character from scratch when that character exists in the accepted anchor;
- do not ask the image model to reinterpret the overall SysselCraft style after an anchor exists;
- do not replace visual continuity with prose continuity;
- do not introduce new style language in edit mode;
- do not use a rejected generation as an anchor;
- do not perform a fresh generation for a continuation ID when the compiler requires `--anchor`.

The repository prompt compiler must fail closed when a continuation image lacks an explicit accepted anchor declaration.

### Mandatory execution path — FAIL CLOSED

**Direct freehand image prompting is forbidden for Act 2 production images.**
**Knowing, remembering, paraphrasing or merely checking that an IMAGE_ID exists in the compiler is NOT execution of the protocol.**

Before ANY Act 2 production image generation:

1. Identify the exact locked `IMAGE_ID`.
2. Confirm the required character + stage references are actually present in the active image conversation.
3. Execute or mechanically render the repository prompt compiler for that exact ID and those exact refs:
   `npm run image:act2:prompt -- <IMAGE_ID> --refs=<comma-separated refs actually present>`
4. Capture the COMPLETE compiler output for this exact generation attempt.
5. Perform a literal pre-call audit of that captured packet:
   - packet IMAGE_ID equals the intended next production ID;
   - packet CAST contains exactly the allowed cast;
   - packet references the correct stage;
   - packet contains the frozen STYLE LOCK and ABSOLUTELY FORBIDDEN STYLE DRIFT blocks;
   - packet ACTION/CONTINUITY/MUST-NOT-SHOW are the compiler-owned values for this ID;
   - no extra person, prop, building, vehicle, animal action or story event has been manually added.
6. If the compiler cannot be executed/rendered, any required ref is absent, or any audit item fails: **STOP. Do not call image generation.**
7. Only after steps 1–6 pass may image generation be invoked.
8. The generation instruction must be the captured compiler packet **verbatim**. Do not rewrite, summarize, beautify, shorten, translate, reinterpret or append to it.
9. If the image tool requires instructions to be supplied through conversation context rather than a prompt field, place the COMPLETE captured compiler packet immediately before the image-tool call and invoke the tool without inventing a substitute prompt.
10. After generation, perform the acceptance check below before advancing the queue.

#### Anti-bypass law — added after failed JET-002 attempt 2026-09-29

The following are explicitly INVALID and must abort generation:

- checking only that the IMAGE_ID exists in `scripts/act2-image-prompt.mjs`;
- reading the manifest and then writing a fresh prompt from memory;
- writing a shorter or more "natural" prompt for the image tool;
- adding aesthetic terms such as `painterly`, `animated`, `3D storybook`, `Pixar-like` or other unsanctioned style language;
- adding any cast member not emitted by the compiler;
- adding a building, vehicle, boat, motor, prop or action not emitted by the compiler;
- calling image generation without having the complete current compiler packet in the same execution step.

**Protocol success is proven by execution, not by intent. A generated image produced without the exact current compiler packet is automatically rejected even if it happens to look correct.**

Bryggan reference declarations:
- `IMG-A2-JET-005`: `--refs=barnet,alve,valpen,bryggan-stage-1`
- `IMG-A2-JET-001`: `--refs=barnet,alve,linus,valpen,bryggan-stage-1`
- `IMG-A2-JET-002`: `--refs=barnet,alve,sol,valpen,bryggan-stage-2`
- `IMG-A2-JET-006`: `--refs=barnet,alve,valpen,bryggan-stage-2`
- `IMG-A2-JET-007`: `--refs=barnet,alve,valpen,bryggan-stage-3`
- `IMG-A2-JET-003`: `--refs=barnet,alve,henning,valpen,bryggan-stage-3`
- `IMG-A2-JET-004`: `--refs=barnet,alve,valpen,bryggan-stage-4`

The compiler owns the exact cast/action/continuity/must-not-show payload for these IDs. If story canon changes, update the manifest and compiler together before generating again.

**Important:** declaring a ref on the command line is an assertion that the corresponding canonical image is visibly present in the active conversation. Never fake a declaration to make preflight pass.


### Mandatory preflight before EVERY generation

Before invoking image generation, resolve all of these from repo + active conversation:

- [ ] Exact `IMAGE_ID` matches the locked production queue.
- [ ] Exact per-image contract has been reread, not recalled from memory.
- [ ] Correct accepted visual stage reference is present in the active image conversation.
- [ ] Every required canonical character reference is present in the active image conversation.
- [ ] `CAST` lists every visible character and no others.
- [ ] `ACTION` is copied from the locked beat/contract without adding a new story event.
- [ ] `CONTINUITY_OBJECTS` matches this point in the story.
- [ ] `IMAGE_SPECIFIC_MUST_NOT_SHOW` includes the per-image prohibitions.
- [ ] Frozen style/environment/Child/puppy/composition blocks remain unchanged.
- [ ] Exactly ONE production image is requested.

If any box cannot be checked, **do not generate**. Resolve the missing reference/decision first.

### Mandatory acceptance check after EVERY generation

Do not advance to the next production ID until the generated image has been checked against:

1. correct cast;
2. canonical character identities/proportions;
3. Barnet face hidden;
4. Valpen passive unless explicitly authored;
5. correct accepted project stage/geometry;
6. correct authored action;
7. correct continuity objects;
8. isolated wilderness with zero civilization leakage;
9. semi-realistic photographic/cinematic Story Moment style with zero cartoon/animated-film drift;
10. one image only, no panels/text/UI;
11. every image-specific `must not show` rule.

A failure on any item means the generation is rejected and does not count as a production image. **Never use a rejected image as a visual reference for later images.**

### Queue discipline

A user reply such as `2`, `next`, `nästa` or `kör vidare` means advance to the next unresolved **production ID in the locked queue**, not regenerate the previous image. Always identify the next ID from the manifest before generation.

### Drift rule

If two consecutive generations fail because of prompt/style/cast/reference drift, STOP generation and reread this protocol plus the exact per-image contract before another attempt. Do not compensate by improvising a new aesthetic prompt.


## Bryggan production contracts - LOCKED POST-PRODUCTION 2026-09-29

Bryggan image production is complete in the repository. The earlier seven-still pre-generation plan is superseded by the **nine accepted production assets** now present under:

`public/assets/village/story-moments/act2/jetty/`

The story still uses **16 authoritative real-world contributions**. Image count, contribution count and visual stage count remain separate concepts.

**Economy lock:** the life-buoy purchase is story-canonical. Its current locked provisional price is **300 SysselBux** and may be rebalanced later. No price is baked into the artwork.

### Authoritative Bryggan asset set

| # | Asset | Purpose |
|---:|---|---|
| 01 | `01-early-restoration.png` | Adam + Alve begin clearing the damaged jetty and discover deeper rot. |
| 02 | `02-linus-salvaged-timber.png` | Linus returns with reusable timber/material for the first substantial repair. |
| 03 | `03-sol-safety-check.png` | Sol performs the calm bathing-area safety inspection. |
| 04 | `04-mira-lifebuoy-purchase.png` | Adam buys the proper life buoy from Mira in the village shop. |
| 05 | `05-bathing-edge-cleanup.png` | Adam + Alve clear the bathing edge and bring/mount the new life buoy. |
| 06 | `06-late-restoration.png` | Later substantial restoration work while the jetty is nearing completion. |
| 07 | `07-henning-first-visitor.png` | Henning becomes the first authored social visitor before completion. |
| 08 | `08-first-water-break.png` | Adam + Alve take their first proper water break; friendship is the focus. |
| 09 | `09-jetty-complete.png` | Definitive completed Bryggan / summer-place image. |

All nine files have been verified on branch `nova/local-construction-snapshot`.

### Bryggan beat-to-delivery map

| Beat | Delivery | Authoritative visual handling |
|---|---|---|
| JETTY-01 | IMAGE | `01-early-restoration.png` — Adam + Alve clear damaged boards/debris. |
| JETTY-02 | REUSE | Continue over `01-early-restoration.png`; deeper support rot is discovered. |
| JETTY-03 | IMAGE | `02-linus-salvaged-timber.png` — Linus returns with reused sound timber/material. |
| JETTY-04 | REUSE | `02-linus-salvaged-timber.png` carries the first substantial repair sequence; runtime stage swap 1/4→2/4. |
| JETTY-05 | LIVE | Alve talks swimming; attention shifts to the bathing edge. |
| JETTY-06 | IMAGE | `03-sol-safety-check.png` — Sol inspects bathing access and identifies cleanup + life-buoy needs. |
| INTERMEDIATE ECONOMY BEAT | IMAGE | `04-mira-lifebuoy-purchase.png` — Adam buys the proper life buoy from Mira. **This is not a real-world contribution.** Price is **300 SysselBux** (provisional; may be rebalanced later). |
| JETTY-07 | IMAGE | `05-bathing-edge-cleanup.png` — Adam + Alve clear the bathing edge; new life buoy is present for mounting. |
| JETTY-08 | REUSE | `05-bathing-edge-cleanup.png` carries the mounting transition; runtime stage swap 2/4→3/4 makes the life buoy permanent. |
| JETTY-09 | LIVE | Social/summer-use portion is improved in runtime. |
| JETTY-10 | IMAGE | `07-henning-first-visitor.png` — Henning is the first authored social visitor. |
| JETTY-11 | IMAGE | `08-first-water-break.png` — Adam + Alve take their first proper water break; friendship remains focal. |
| JETTY-12 | IMAGE | `06-late-restoration.png` — later substantial restoration work; supports runtime 3/4→4/4 progression. |
| JETTY-13 | LIVE | Last substantial weak/worksite element is finished. |
| JETTY-14 | LIVE | Remaining work clutter is removed; visual language shifts to ordinary summer use. |
| JETTY-15 | REUSE | `09-jetty-complete.png` carries the quiet pre-completion anticipation over the essentially finished physical state. |
| JETTY-16 | MAJOR | `09-jetty-complete.png` — authoritative completion; worksite role ends and later ambient use becomes eligible. |

**Important ordering note:** numeric asset filenames reflect the final folder/production sequence chosen during image production. Runtime story mapping remains authoritative. In story order, the late-restoration beat at JETTY-12 occurs after Henning's JETTY-10 visit and the JETTY-11 water break even though its file is named `06-late-restoration.png`.

### Shared visual contract for the final Bryggan set

- Barnet remains rear/rear-three-quarter only; face is never intentionally shown or invented.
- Preserve canonical cap, backpack, clothing, shoes, proportions and silhouette.
- Valpen is present with Barnet where authored and remains secondary/passive unless explicitly part of the moment.
- Alve matches the canonical character sheet and remains the active restoration companion.
- Landscape/iPhone Story Moment framing; warm cinematic semi-realistic SysselCraft rendering.
- Lake Story Moments use isolated Act 2 wilderness. No village skyline, church, house rows, harbor, roads or unrelated civilization in lake scenes.
- The Mira purchase is the explicit exception because it takes place in **Mira's village shop**, not at the lake.
- Accepted Bryggan stage geometry remains authoritative.
- No extra residents beyond the exact authored cast.
- The life buoy first becomes a story object after Sol identifies the need and is purchased from Mira in `04-mira-lifebuoy-purchase.png`.
- Once mounted through JETTY-08, the life buoy persists in all later Bryggan states.
- No completed social crowd is canonized before completion.
- No baked-in dialogue/UI text.

### Final image/story contracts

#### 01 — Early restoration
Asset: `01-early-restoration.png`  
Serves JETTY-01 + JETTY-02. Adam and Alve clear loose debris/damaged boards and discover deeper rotten supports/timber. No replacement timber has arrived yet.

#### 02 — Linus + salvaged timber
Asset: `02-linus-salvaged-timber.png`  
Serves JETTY-03 + JETTY-04. Linus provides practical continuity from Återvinningen and sound reused material for the first substantial repair. Jetty remains incomplete.

#### 03 — Sol safety check
Asset: `03-sol-safety-check.png`  
Serves JETTY-06. Sol performs a calm prevention/safety inspection because Adam and Alve intend to swim. Nobody is hurt. She identifies shoreline/bathing-edge cleanup and the need for a proper life buoy.

#### 04 — Mira life-buoy purchase
Asset: `04-mira-lifebuoy-purchase.png`  
Intermediate economy/story beat between JETTY-06 and JETTY-07. Adam buys the proper life buoy from Mira in her village shop; Alve may accompany him. This image is **not** contribution 7 and does not increase restoration contribution count. The current locked provisional price is **300 SysselBux** and may be rebalanced later.

#### 05 — Bathing-edge cleanup
Asset: `05-bathing-edge-cleanup.png`  
Serves JETTY-07 + transition into JETTY-08. Adam and Alve clear the bathing edge after Sol's inspection. The newly purchased life buoy is present and becomes permanently mounted through this sequence.

#### 06 — Late restoration
Asset: `06-late-restoration.png`  
Serves JETTY-12. Adam and Alve continue the substantial later repair/tidy work while the location is nearing completion. Life buoy persists. The scene remains visibly a worksite.

#### 07 — Henning first visitor
Asset: `07-henning-first-visitor.png`  
Serves JETTY-10. **Henning is locked as the first social visitor.** Sol's earlier visit is a safety inspection, not the social-return beat. Henning's arrival demonstrates that restoration is changing village behaviour before completion.

#### 08 — First water break
Asset: `08-first-water-break.png`  
Serves JETTY-11. Adam and Alve take their first proper water break at the now-usable section. Friendship is the emotional center; this is not the post-completion ambient crowd.

#### 09 — Jetty complete
Asset: `09-jetty-complete.png`  
Serves JETTY-15 + JETTY-16. Definitive completion image using the accepted stage-4 Bryggan. Permanent life buoy remains. Construction clutter is gone. Adam + Alve can finally experience the location as a real summer place rather than a worksite.

### Bryggan continuity / reuse audit — FINAL

- 01 may serve JETTY-01→02 because the same clearing work reveals the deeper damage.
- 02 may serve JETTY-03→04 because salvage arrival and first major structural repair are one causal sequence; persistent stage swap remains runtime-authoritative.
- 03 is unique to Sol's safety inspection.
- 04 is unique to the village-shop economy beat and does **not** consume a restoration contribution.
- 05 may serve JETTY-07→08 because cleanup and life-buoy mounting are one causal sequence.
- 07 and 08 are now separate images. The earlier plan to reuse the Henning frame for the first water break is superseded.
- 06 remains the dedicated late-restoration frame for JETTY-12.
- 09 may serve JETTY-15→16 because both beats share the essentially finished physical state; dialogue/progression distinguishes anticipation from authoritative completion.
- No image crosses an incompatible life-buoy continuity boundary.

### Bryggan production status

- [x] 16 beats mapped to delivery.
- [x] Narrative continuity audit complete.
- [x] Life-buoy economy beat represented separately from contribution count.
- [x] Henning locked as first social visitor.
- [x] First water break has its own dedicated image.
- [x] Exact final production asset count: **9**.
- [x] All 9 production assets verified in `public/assets/village/story-moments/act2/jetty/`.
- [x] Final completion image corrected so Barnet is shown from behind.
- [x] Bryggan Story Moment image production complete.

The old seven-image Bryggan production queue is superseded by this nine-asset final manifest.

## 2026-09-30 production status + epilogue bridge

This section supersedes older pre-generation gate language that still says Act 2 image generation is unauthorized. Image production has already proceeded under the later locked production contracts. Do not reopen accepted asset families merely because historical checklist items remain above.

### Opening status
OPEN-001…OPEN-005 are complete and present under:

`public/assets/village/story-moments/act2/opening/`

Canonical files:
- `01-dog-runs-off.png`
- `02-into-the-forest.png`
- `03-through-the-trees.png`
- `04-first-view-of-the-lake.png`
- `05-the-bicycle.png`

They are wired into the isolated `/act2-test` story flow before the existing close bicycle beat. This is story-lab integration only, not production Act 1→Act 2 progression.

### Finale status
The family-return finale uses father + early-teen older sister only. No little brother. The mother is absent physically and remains only in historical memory/photo continuity.

Canonical finale files remain:
- `finale/01-something-is-different.png`
- `finale/02-family-return.png`
- `finale/03-family-embrace.png`
- `finale/04-home-again.png`

The emotional thesis remains:
> **Alve:** “Jag kunde inte laga det som hände.”  
> **Alve:** “Men jag kunde laga stugan.”  
> **Barnet:** “Du lagade mer än stugan.”

### New locked gratitude beat
Scene 4 / departure now includes an explicit friendship payoff before the other-side conversation. Alve drops his usual deflection and says:
- this would never have happened without Barnet;
- on the day Barnet found him he was **“helt lost”**;
- he thought fixing enough things would make everything solve itself;
- he did not know where to begin;
- he could not have repaired the cottage, jetty and boat alone;
- he thanks Barnet directly;
- after Barnet says that is what friends do, Alve says he is glad Barnet is his friend.

Exact dialogue lives in `STORY_DESIGN.md` and is authoritative.

### Epilogue Story Moment queue — LOCKED TARGET, ART INCOMPLETE

The final departure/Act 3 bridge uses four target images. These are outside the 64 contribution count and after the family payoff:

| ID | Working filename | Function |
|---|---|---|
| EPI-001 | `01-leaving-the-jetty.png` | Leaving the restored lake; carries the gratitude/friendship payoff. Family may appear only far in the background. |
| EPI-002 | `02-across-the-lake.png` | Freedom/motion on open water; transitions from closure toward curiosity. |
| EPI-003 | `03-the-other-side.png` | Distant undefined opposite shore; mystery only, no Act 3 destination reveal. |
| EPI-004 | `04-into-the-unknown.png` | Wide final chapter image; boat continues toward the unknown before black/end card. |

Target folder when accepted/uploaded:
`public/assets/village/story-moments/act2/epilogue/`

**Do not claim this folder/assets are complete until repo verification proves it.** Image work was intentionally paused for the night on 2026-09-30.

EPI-001 composition rule from the latest accepted direction: if the motor geometry is hard to preserve, crop/zoom so the whole boat is not shown rather than inventing an incorrect motor placement. Canonical boat reference has the outboard at the stern. Barnet remains rear-facing.

### Implementation boundary
Story/art production and production gameplay integration are now separate workstreams. The runtime/state execution order is canonical in `docs/ACT2_IMPLEMENTATION_PLAN.md`. `/act2-test` remains an acceptance lab and must not become production save authority.

