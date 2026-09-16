# Construction Reveal Policy

> LOCKED product/technical decision, 2026-09-16. This document supersedes the earlier Recycling stage-1 exception in `TECHNICAL_HANDOFF.md` that allowed the truck reveal to start immediately after parent approval.

## Core rule

**No important construction/world-change presentation may start merely because the parent pressed Approve.**

Parent approval may earn and persist progression, but the visible reveal waits until the child is naturally at the relevant world location. This prevents truck/build animations from happening off-camera when the avatar is elsewhere in the village.

Canonical sequence for every construction stage, including Recycling stage 1:

`parent approval -> progression earned -> pending construction event -> resident attention -> HUD prompt -> guide resident at building site -> child travels there -> resident conversation/interaction -> reveal presentation -> visible stage committed`

The product principle remains:

> **Gör saker i verkligheten -> världen förändras.**

The reveal should be experienced in the world, not silently occur behind the camera.

## Resident attention

When earned progression makes a new construction stage ready:

- create/persist a pending construction reveal;
- move/place the authored guide resident beside the relevant building site;
- show the generic resident-attention HUD mechanism, initially rendered as **"Linus vill prata med dig"** for Recycling;
- show the appropriate world attention marker on the resident;
- do not teleport the child and do not automatically pan/teleport the camera to fake attendance;
- the child travels to the resident using normal world movement;
- the reveal may begin only after the child reaches/interacts with the resident at the site.

The mechanism must remain generic under the hood (`resident wants to talk` / resident attention). Recycling uses Linus; later authored flows may use Henning, Sol or another resident.

> **NPCs are residents, not buttons.**

### Reveal secrecy / spoiler rule

Resident attention exists to bring the child to the reveal, **not to explain the reveal before it happens**.

- Before the reveal, resident dialogue may signal that something has happened, changed, arrived or is worth seeing, but must not name or describe the new building, construction stage, delivered structure or other meaningful surprise.
- HUD attention copy must remain similarly non-spoiling. `Linus vill prata med dig` is guidance; it does not explain the reward.
- Do not use dialogue such as "the recycling station is being built" or otherwise announce the visual payoff before the child witnesses it.
- Prefer curiosity-driving copy in the spirit of: `Du, kom hit ett slag. Det har hänt något här som jag tror att du vill se.` Exact authored dialogue may evolve, but the secrecy rule is locked.
- Once the reveal has begun or the visual change is visible, residents may naturally acknowledge or discuss what the child can now see.
- Apply the same rule to future residents and buildings unless an authored story beat intentionally requires foreknowledge.

**The resident points toward the surprise; the world delivers it.**

## Recycling stages 1-4

All Recycling construction stages use the same resident-attention gate.

### Stage 1

The truck/delivery sequence remains the stage-1 reveal presentation, but **it no longer starts immediately after parent approval**.

Required flow:

`first quest approved -> stage 1 earned/pending -> HUD "Linus vill prata med dig" -> Linus beside Recycling site -> child visits Linus -> non-spoiling conversation/interact -> truck/delivery reveal starts while child/camera are at the site -> stage 1 visible/collision committed`

The existing truck animation/timing/reveal should otherwise be preserved. The change is its trigger/choreography, not its visual identity.

### Stages 2-4

Use the same pattern:

`stage earned -> pending -> Linus at Recycling -> HUD attention -> child visits -> non-spoiling conversation/interact -> construction reveal -> visible stage + collision committed`

Do not invent new product progression thresholds merely to exercise stages 2-4. Development/test triggers may be used when clearly isolated from production behavior.

## State and reliability laws

`progression earned`, `pending reveal`, and `visible/revealed stage` are separate durable concepts.

- Earned progression survives reload/app close even if the reveal has not been seen.
- Pending reveal survives reload/app close until successfully consumed.
- Choosing to talk later must keep the reveal pending.
- A completed reveal must not replay because of reload or duplicate/repeated progression events.
- If persistence/commit fails, keep the reveal pending for retry rather than visually advancing into an unsaved state.
- The visible building stage and the corresponding collision/navigation footprint activate together at reveal commit.
- Presentation is not the source of truth for whether progression was earned.
- Do not expose hidden numeric progress to explain the event. **Visa progression. Redovisa den inte.**

## Camera/composition acceptance rule

A construction reveal fails product QA if the meaningful visual change can occur while the child/camera are elsewhere and therefore miss it.

Resident attention is the default choreography for bringing the player to the correct location. Prefer this diegetic solution over forced camera teleport/pan.

A reveal also fails narrative QA if the resident-attention dialogue gives away the meaningful surprise before the child witnesses it. Arrival and interaction should build anticipation rather than replace the visual reveal with exposition.

## Implementation boundary

Construction progression and pending/revealed state belong above Phaser in domain/game state. Phaser presents resident placement, HUD/world attention, movement/interactions and the reveal animation/rendering.

This policy applies to current and future construction systems unless a future authored event explicitly defines another in-world method that guarantees the player is present for the reveal.
