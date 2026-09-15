# Post-delivery progression design

Status: **product/design direction locked for the first recycling arc; exact real-world quest copy remains content work. Not yet implemented.**

This document addresses the current physical-iPhone content boundary: after the first approved quest, the truck leaves building material and a wheelbarrow, then the child can walk around but has no further meaningful action.

## Design goal

The first delivery should not feel like the end of a demo. It becomes the first visible promise that real-life quests rebuild the village.

The opening progression must teach the product through consequences, not through a tutorial about progression classes. The child should gradually infer:

> I do useful things for real. Things happen here.

## Locked first-project arc: recycling center

The recycling center is the first major construction project. It advances through the four already-produced visual stages. These stages are **story beats**, not four arbitrary XP thresholds.

The first project should be short enough that a child sees meaningful progress quickly, but long enough that a finished building feels earned. The intended rhythm is:

`first approved quest -> delivery -> stage 1 reveal -> approved contribution -> stage 2 -> approved contribution -> stage 3 -> approved contribution -> stage 4 -> completion moment`

For the first project, this means **four approved real-world contributions total**, including the already-established first quest `Bädda sängen`. This is a deliberate onboarding exception/pace calibration, not yet a universal economy rule for every later building.

Do not display “1/4”, percentages, XP bars or construction costs to the child. The building itself is the progress indicator.

## Beat 1 — the delivery settles

The existing truck sequence completes unchanged. Materials and wheelbarrow remain in the world.

The truck departure creates a short breathing space. Do not immediately cover the delivery with another modal.

## Beat 2 — Linus notices

After the truck has departed, Linus gains a contextual world marker. The player chooses to speak to him.

His job is not to explain hidden progression. He notices that materials have arrived and gives them meaning.

Target tone/candidate dialogue:

**Linus:** “Nämen titta. Det där var mer virke än jag väntade mig.”

**Linus:** “Det stod en gammal återvinningsbod här förr. Inte mycket att skryta med, men den gjorde nytta.”

**Linus:** “Vi kanske ska se vad det kan bli av det här.”

The exact copy may be polished during implementation, but preserve three things: Linus is pleased, he speaks about the place rather than a game mechanic, and he does not tell the child that chores fill a construction meter.

## Beat 3 — stage 1 appears

When the Linus exchange finishes, the recycling-center location is revealed for the first time and `recycling-stage-1` appears at its calibrated base point.

Before this moment the same ground is ordinary nature. There is no sign, foundation outline, lock icon or future-building marker.

This is the first major “wait, I did that?” moment. Let the visual change carry it. A restrained construction sound/particle flourish is appropriate later, but no giant reward panel is required.

Stage 1 is the permanent world consequence of the first approved quest. It must persist across reload/native restart.

## Beat 4 — the world asks for another real action

After the stage-1 reveal, the game returns control. The next real-world quest is surfaced through the world, not auto-launched as a compulsory form.

For the first recycling arc, the following three approved quests should each advance exactly one visual stage. Their **content should be ordinary, useful household/environment/routine tasks**, matching the first project's Ordning & miljö character without becoming three recycling-themed roleplay tasks.

Content rules for these onboarding quests:

- doable without buying or fetching special equipment;
- short enough that early momentum survives;
- visibly useful in ordinary family life;
- varied enough not to feel like “clean three things in a row”;
- parent may choose/substitute an equivalent quest through the existing parent system where supported;
- no fake in-game busywork stands in for the real action;
- approval remains mandatory before construction advances.

Candidate content pool for later copy selection, **not locked quest text**:
- put away a small set of belongings / tidy one defined area;
- help sort household recycling;
- put dirty clothes in the laundry basket / put clean clothes away;
- clear one's place after a meal;
- help with one small household reset appropriate to the family.

Do not hard-code all of these merely because they are listed here.

## Beat 5 — stages 2 and 3

Each subsequent approved contribution advances one stage after the normal approval/reward feedback.

The change should happen in the world when the child returns/sees the village, not as a sterile progress notification.

### Stage 2
The site unmistakably looks like construction has begun. Linus does not need a full conversation. A short optional reaction is enough if the player approaches him.

Candidate bark:

**Linus:** “Det tar sig.”

### Stage 3
The building should now be recognizable as the future recycling center. This is where anticipation replaces mystery: the child knows what is coming and wants to see it finished.

Candidate bark:

**Linus:** “Nu börjar jag känna igen stället.”

Do not interrupt every approval with mandatory Linus dialogue. The world is increasingly capable of speaking for itself.

## Beat 6 — stage 4 completion

The fourth approved contribution completes `recycling-stage-4`.

This deserves a larger world moment than stages 2–3, but still not a generic level-up screen. Recommended sequence:

1. normal parent approval/reward completes;
2. on return to village, construction sound/activity draws attention toward the site;
3. stage 4 replaces stage 3;
4. the finished building receives its normal interaction affordance;
5. Linus has a completion conversation;
6. after the conversation, a new narrative beat foreshadows the **first returning resident**, Henning, without revealing the bakery location yet.

Candidate completion exchange:

**Linus:** “Där har vi den.”

**Linus:** “Det var länge sedan den här delen av byn såg ut att behövas igen.”

Then, after a beat:

**Linus:** “Vet du… jag känner faktiskt någon som brukade säga att han skulle flytta hit den dag det började hända saker igen.”

Do not name Henning in advance unless the final arrival scene benefits from it. Surprise is valuable.

## Recycling center as first functional building

A completed building must not be only scenery. However, the first implementation should avoid creating a large crafting/inventory subsystem simply to justify it.

Minimum product role after completion:

- it is tappable/contextually interactable;
- it acknowledges that the building is complete and part of the village;
- it can later become the natural world home for environment/order-related quest flavor, recycling interactions or village improvements;
- no complex minigame is required for the first playable slice.

The important first reward is that a previously empty piece of nature is now a real place.

## Henning bridge

Henning remains the **first new resident**. Completing the recycling center does not instantly build his bakery. Instead it unlocks the story beat that somebody has noticed the village changing.

Recommended bridge:

`recycling complete -> Linus hint -> short quiet interval / next session -> arrival cue -> Henning arrives as a person before his finished bakery exists`

Henning should not simply pop into existence next to a completed bakery. His arrival is the larger proof that village growth can bring **people** back, not only buildings.

The bakery then becomes the second major construction arc, with Henning giving it a human reason to exist. Exact bakery stages/quest count remain open until the recycling arc has been played and its pacing measured.

This deliberately preserves the ability to learn from the first four-contribution arc before establishing a universal building economy.

## Why Linus owns the bridge

Linus is already the child's guide and the person who has kept faith with the village. His reaction gives emotional meaning to the delivery without turning him into a tutorial overlay.

His role should diminish naturally as the player understands the world:

- first delivery: meaningful conversation;
- middle construction stages: optional short reactions;
- completion: meaningful conversation;
- later projects: residents increasingly own their own stories.

This prevents Linus from becoming a permanent quest announcer.

## UX/state rules

- Parent approval is the only authority that advances real-world quest progression.
- Construction never advances from child-side clicks alone.
- Do not expose hidden development-class arithmetic.
- Do not expose numeric building progress to the child during this onboarding arc.
- Quest/UI markers remain directly tappable; the avatar need not physically cross the map merely to activate UI-like affordances.
- Delivered materials are environmental storytelling, not a crafting inventory.
- Bakery and clinic locations remain ordinary nature until their own progression reveals them.
- Henning is first new resident; Sol arrives later.
- Family house remains a quest source, not the universal quest terminal.
- Stage state must live outside transient Phaser scene state and survive reload/native restart.
- A stage transition should be idempotent. Replaying/reopening an approval must never grant another construction step.

## Smallest implementation slices after visual PoC

Do not implement the whole arc in one risky blob.

### Slice A — remove the current dead end
1. detect the already-existing completed first-delivery state;
2. expose post-delivery Linus interaction once;
3. after interaction reveal recycling stage 1;
4. persist reveal through the existing state boundary;
5. verify reload/native restart preserves it.

### Slice B — prove repeatable construction
1. connect one subsequent parent-approved quest to stage 2;
2. verify approval is idempotent;
3. verify stage survives restart;
4. verify no future site is leaked.

### Slice C — finish the first project
1. enable stages 3 and 4 using the same domain rule;
2. add restrained stage-change presentation;
3. make completed recycling center interactable;
4. add Linus completion conversation and Henning foreshadow;
5. physically play the full four-contribution arc before locking bakery pacing.

## What remains deliberately open

- final copy/content of quests 2–4;
- whether parents can substitute custom quests during onboarding without weakening narrative pacing;
- exact delay/session timing between recycling completion and Henning's arrival;
- Henning's exact arrival scene;
- bakery quest count and thresholds;
- detailed recycling-center functionality beyond being a completed world place.

These should be decided from play evidence rather than silently becoming architecture.
