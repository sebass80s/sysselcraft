# Post-delivery progression design

Status: **product/design direction and Linus dialogue locked for the first recycling arc; exact real-world quest copy remains content work. Not yet implemented.**

This document addresses the current physical-iPhone content boundary: after the first approved quest, the truck leaves building material and a wheelbarrow, then the child can walk around but has no further meaningful action.

## Design goal

The first delivery becomes the first visible promise that real-life quests rebuild the village. Teach the product through consequences, not through progression-class tutorials.

> I do useful things for real. Things happen here.

## Locked first-project arc: recycling center

The recycling center advances through four visual/story stages. For onboarding this means **four approved real-world contributions total**, including `Bädda sängen`. This is first-project pace calibration, not a universal economy law.

Never display 1/4, percentages, XP bars or construction costs to the child. The building is the progress indicator.

## Beat 1 — delivery settles

The existing truck sequence completes unchanged. Materials and wheelbarrow remain. Give the delivery a little breathing space before another interaction appears.

## Beat 2 — Linus notices (LOCKED DIALOGUE)

After the truck departs, Linus gains a contextual world marker. The player chooses to speak to him.

**Linus:** “Nämen titta. Det där var mer virke än jag väntade mig.”

**Barnet:** “Vad ska vi ha allt till?”

**Linus:** “Hm. Det stod en gammal återvinningsbod här förr.”

**Linus:** “Inte mycket att skryta med. Men den gjorde nytta.”

**Barnet:** “Kan vi bygga upp den igen?”

**Linus:** “Tja... virke har vi ju tydligen.”

**Linus:** “Vi får väl se vad det kan bli av det här.”

The scene ends without Linus announcing a game mechanic. Stage 1 then appears in the world.

### Performance note

Linus's emotion is mostly carried by restraint. He is genuinely affected by seeing the village stir again, but he protects that feeling with dry understatement. Do not make him gushy, teary or openly sentimental. Small pauses and what he chooses *not* to say should carry more weight than soft dialogue.

## Beat 3 — stage 1 appears

The recycling location is revealed for the first time and `recycling-stage-1` appears. Before this moment the ground is ordinary nature with no sign, foundation outline, lock icon or future-building marker.

Stage 1 is the permanent world consequence of the first approved quest and must survive reload/native restart.

## Beat 4 — next real action

After the reveal, control returns. Three subsequent approved quests each advance exactly one stage. Their content should be ordinary, useful household/environment/routine tasks, varied and short enough to preserve early momentum. Exact quest copy remains open.

Candidate pool only: tidy one defined area; help sort household recycling; put clothes where they belong; clear one's place after a meal; another small household reset. Do not hard-code all merely because they are listed here.

## Beat 5 — stage 2 (LOCKED OPTIONAL DIALOGUE)

No mandatory conversation. If the child approaches Linus:

**Linus:** “Det tar sig.”

**Barnet:** “Tror du den blir färdig?”

**Linus:** “Virket verkar ju inte bygga tillbaka sig självt.”

**Linus:** “Men jag börjar bli försiktigt hoppfull.”

The last line is about as emotionally explicit as Linus should normally become. His humor immediately keeps it in character.

## Beat 5b — stage 3 (LOCKED OPTIONAL DIALOGUE)

The building is now recognizable. If the child approaches Linus:

**Barnet:** “Nu ser det ju faktiskt ut som ett hus!”

**Linus:** “Jag vet. Jag blev nästan orolig själv.”

**Linus:** “Nu börjar jag känna igen stället.”

### Emotional staging

After “Nu börjar jag känna igen stället”, allow a small beat before control returns. Do not add a sentimental follow-up. The implication is enough: Linus remembers the village when it was alive.

## Beat 6 — stage 4 completion (LOCKED DIALOGUE)

The fourth approved contribution completes `recycling-stage-4`. This deserves a larger world moment than stages 2–3, but not a generic level-up screen.

Recommended presentation: normal approval/reward → return to village → restrained construction cue draws attention → stage 4 replaces stage 3 → completed building becomes interactable → Linus completion scene.

**Barnet:** “Linus! Kom och titta!”

**Linus:** “Jag ser, jag ser. Mina ben är gamla, inte ögonen.”

**Linus:** “Där har vi den.”

**Barnet:** “Var den så här förut?”

**Linus:** “Nej.”

**Linus:** “Den är bättre nu.”

### Emotional beat

This is the emotional center of the scene. Give “Nej.” its own beat before “Den är bättre nu.” Linus is acknowledging that the child is not restoring *his* old village. They are making something new, and he prefers it. Do not explain this subtext in dialogue.

Then:

**Linus:** “Det var länge sedan den här delen av byn såg ut att behövas igen.”

**Barnet:** “Vad menar du?”

**Linus:** “Folk bygger inte saker på platser de tänker överge.”

Pause. Then the Henning hook:

**Linus:** “Vet du... jag har faktiskt en gammal vän som brukade säga att han skulle flytta hit den dag det började hända saker igen.”

**Barnet:** “Vem då?”

**Linus:** “Henning.”

**Barnet:** “Tror du han kommer?”

**Linus:** “Ingen aning.”

**Linus:** “Men jag kanske råkar ringa honom.”

End the scene there. Do not add a wink, explanation or bakery reveal.

### Why this scene is allowed to feel more

Linus does not become softer; the situation becomes more important. Three emotional facts are communicated while he remains himself:

1. **“Den är bättre nu.”** He accepts that the new village does not have to reproduce his memories.
2. **“Folk bygger inte saker på platser de tänker överge.”** His hope is expressed as practical observation rather than a speech about hope.
3. **“en gammal vän” / “råkar ringa honom.”** Henning matters personally to Linus, but Linus hides initiative behind dry casualness.

This is the preferred Linus-writing technique going forward: put emotion in concrete observations, pauses, remembered places and understated actions. Avoid having him name his feelings unless a later story beat truly earns it.

## Recycling center as first functional building

A completed building must not be only scenery, but do not create a large crafting/inventory subsystem merely to justify it. Minimum role: tappable/contextually interactable, acknowledges completion, and can later host environment/order-related quest flavor or village improvements. No complex minigame is required for the first slice.

## Henning bridge

Henning remains the first new resident. Completing recycling unlocks the possibility that somebody has noticed the village changing.

`recycling complete -> Linus names old friend Henning -> quiet interval / later arrival cue -> Henning arrives as a person -> bakery gains a human reason to exist`

Henning should not pop into existence beside a completed bakery. Exact arrival staging and bakery pacing remain open until the recycling arc has been physically played.

## Why Linus owns the bridge

Linus kept faith with the village. His guidance diminishes naturally: meaningful first-delivery conversation → optional middle-stage reactions → meaningful completion scene → later residents increasingly own their own stories. This prevents him becoming a permanent quest announcer.

## UX/state rules

- Parent approval is the only authority that advances real-world quest progression.
- Construction never advances from child-side clicks alone.
- Hidden development arithmetic and numeric building progress stay hidden.
- Quest/UI markers remain directly tappable.
- Delivered materials are environmental storytelling, not crafting inventory.
- Bakery and clinic locations remain ordinary nature until their own progression reveals them.
- Henning is first new resident; Sol arrives later.
- Stage state survives reload/native restart and transitions are idempotent.

## Smallest implementation slices after visual PoC

### Slice A — remove current dead end
1. detect completed first-delivery state;
2. expose locked post-delivery Linus interaction once;
3. reveal recycling stage 1;
4. persist reveal;
5. verify reload/native restart.

### Slice B — prove repeatable construction
1. one subsequent parent-approved quest advances stage 2;
2. verify approval idempotency;
3. verify restart persistence;
4. verify no future site leaks.

### Slice C — finish first project
1. enable stages 3–4 through same domain rule;
2. add restrained stage-change presentation;
3. make completed recycling interactable;
4. implement locked Linus completion/Henning scene;
5. physically play full four-contribution arc before locking bakery pacing.

## Still open

- final quest 2–4 content/copy;
- custom-parent-quest substitution behavior during onboarding;
- exact delay/session timing before Henning arrives;
- Henning's arrival scene;
- bakery quest count/thresholds;
- detailed recycling functionality.
