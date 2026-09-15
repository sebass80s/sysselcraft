# Post-delivery progression design

Status: **design candidate, not yet implemented**.

This document addresses the current physical-iPhone content boundary: after the first approved quest, the truck leaves building material and a wheelbarrow, then the child can walk around but has no further meaningful action.

## Design goal

The first delivery should not feel like the end of a demo. It should become the first visible promise that real-life quests rebuild the village.

Do not immediately introduce another unrelated menu quest. Let the delivered material become the bridge to the next piece of play.

## Recommended continuation

### 1. Delivery settles
The existing truck sequence completes unchanged. Materials and wheelbarrow remain in the world.

### 2. Linus reacts in-world
After the truck has departed, Linus becomes the next contextual source. Use a world marker rather than automatically opening a modal. This preserves agency and reinforces that quests belong to the world.

Narrative job of the exchange:
- acknowledge that the child's real-world action caused something physical to arrive;
- connect the material to rebuilding the recycling center;
- avoid dumping progress numbers or hidden-system explanation;
- point toward the next real-world contribution rather than pretending the whole building can be erected from one made bed.

### 3. Construction state becomes legible
The recycling center is the first building project. Its location should be revealed by progression, not visible as an empty signed plot beforehand.

Candidate reveal behavior:
- before the first delivery: ordinary grass/nature;
- after delivery/Linus reaction: stage 1 construction can appear at the recycling-center base point;
- later approved contributions advance stages 2–4 according to progression rules that remain to be designed/connected to domain state.

This is the first clean demonstration of the product law:

> Gör saker i verkligheten -> världen förändras.

### 4. Next quest source
After the reveal, the next available quest should be surfaced through an appropriate world source. The exact quest content and progression cost are **not locked here**. Do not invent a throwaway quest just to exercise stage 2.

The important UX sequence is:

`approved real action -> visible delivery -> NPC acknowledgement -> world construction change -> next world-sourced opportunity`

## Why Linus owns the bridge

Linus is already the child's guide and the person who has kept faith with the village. His reaction gives emotional meaning to the delivery without turning the game into a tutorial overlay. He should sound pleased that the plan is actually working, not surprised that the game system exists.

The child is helping prove Linus right.

## Product constraints

- Preserve parent approval before all reward/progression.
- Do not make construction advance from child-side clicks alone.
- Do not expose hidden development-class arithmetic.
- Do not require the avatar to walk to a UI-like quest marker before it can be tapped.
- Do not turn delivered materials into a crafting inventory unless a later product decision explicitly introduces crafting.
- Do not reveal bakery/clinic locations merely because the recycling project has started.
- Henning remains the first new resident; Sol arrives later.
- The family house remains a quest source, not the universal quest terminal.

## Smallest useful implementation slice after visual PoC

Once v4 visuals pass the browser/iPhone gate, implement only this continuation first:

1. detect the already-existing completed first-delivery state;
2. expose a post-delivery Linus interaction once;
3. after that interaction, reveal recycling stage 1 at the calibrated location;
4. persist that reveal using the existing progression/state boundary rather than Phaser-only ephemeral state;
5. verify reload/native restart preserves it;
6. leave later construction-stage thresholds/data as a separate product decision.

This slice is deliberately small. It removes the current dead end and proves that an approved real-world action can permanently change a major world object without prematurely designing the whole economy.