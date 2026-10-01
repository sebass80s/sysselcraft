# Barnet runtime visual spec · LOCKED 2026-10-01

Status: **CANONICAL RUNTIME CHARACTER TARGET**

This document locks the current canonical visual identity for Barnet/the child avatar and defines the implementation contract for bringing the playable runtime avatar closer to that reference without changing gameplay behaviour.

## Canonical reference

The canonical Barnet reference approved by Kalle on 2026-10-01 is the turnaround/reference sheet with rear and rear-three-quarter views plus detail studies of the cap, backpack, cargo trousers and shoes.

This reference supersedes older child descriptions that mention a yellow top or a generic painted child silhouette.

### Identity lock

Barnet must read immediately as the same child seen in current Act 2 Story Moments:

- warm brown hair visible below the cap;
- two-tone **blue + warm beige cap** with the dark mountain/triangle mark;
- **dark red / brick-red hoodie**;
- **blue cargo trousers** with visible pocket volume and gathered lower legs;
- **blue/gray rugged shoes** with warm neutral soles;
- **large olive/brown adventure backpack** with brown leather straps/buckles and the same family of mountain/triangle mark;
- bottle carried at the side of the backpack when the runtime silhouette can support it clearly;
- compact child proportions, sturdy rather than skinny;
- strong rear-view silhouette defined first by cap + hair + hood + backpack + cargo-trouser volume.

The backpack is not a minor accessory. At gameplay scale it is one of Barnet's primary identity shapes.

## Runtime source currently in use

Act 2 currently loads:

`/assets/village/reboot/child.webp`

from `src/game/createAct2LakeGame.ts`.

Treat this as the current implementation asset, **not** as visual canon. If it conflicts with the locked reference above, the reference wins.

## Runtime refinement goal

Create/derive a replacement runtime asset that preserves the canonical Barnet identity at native landscape-iPhone scale while remaining compatible with the existing Phaser character contract.

The pass should improve, in priority order:

1. cap silhouette and two-tone blue/beige read;
2. backpack size, shape and olive/brown material read;
3. red hoodie read around shoulders/hood;
4. blue cargo-trouser volume and side-pocket silhouette;
5. robust blue/gray shoe shape;
6. warm brown hair breaking the cap silhouette naturally;
7. compact child body proportions matching Story Moments.

Do not solve identity mainly through tiny texture detail. The character must remain recognizable when viewed at actual gameplay size.

## Orientation contract

Runtime movement may require left/right facing through mirroring, but the canonical read is rear or rear-three-quarter.

- Do not invent a front-facing face as part of this pass.
- Do not make the runtime child read like a front-facing sticker.
- Side/rear movement variants should preserve the same cap, backpack, hoodie and cargo-trouser identity.
- Mirroring must not make asymmetric signature details visually nonsensical. If the backpack bottle/patch becomes problematic under flip, simplify the runtime derivative rather than breaking the silhouette.

## Technical contract

The visual pass must not casually change gameplay behaviour.

Preserve unless a real runtime issue requires a deliberate follow-up:

- player movement speed;
- tap-to-move/pathfinding;
- keyboard movement;
- player ground/base position;
- collision footprint;
- interaction distances;
- camera-follow behaviour;
- Y/base-depth sorting;
- existing world scale;
- Act 1 and Act 2 save/progression state.

A richer silhouette must **not** silently enlarge collision.

If the replacement asset dimensions differ, explicitly preserve the same perceived ground contact and gameplay-scale height via origin/scale adjustments in code.

## Rendering target

Barnet belongs to the same warm illustrated SysselCraft family as the accepted runtime residents and Story Moments.

Avoid:

- pixel-art treatment;
- flat vector/sticker appearance;
- generic chibi redesign;
- realistic adult-like anatomy;
- tiny head / long legs;
- backpack reduced to an unreadable blob;
- yellow-shirt legacy styling;
- arbitrary new logos or clothing;
- visual details that only work at full-resolution source size.

## Acceptance gate

The new runtime Barnet is accepted only after a real running-game comparison, preferably on physical iPhone.

Check:

1. At first glance, Barnet resembles the canonical 2026-10-01 reference.
2. The blue/beige cap is readable at gameplay scale.
3. The red hoodie remains visible around the backpack.
4. The olive/brown backpack is a major silhouette feature, not a small patch.
5. Blue cargo trousers read as cargo trousers rather than generic straight pants.
6. Shoes remain distinct from trousers and ground.
7. Hair is visible beneath the cap.
8. The child remains clearly smaller/younger than adult residents.
9. Ground contact, movement, depth sorting and collision feel unchanged.
10. The asset remains legible against both Act 1 village vegetation and the Act 2 lake environment.

## Implementation rule

Do **not** regenerate the runtime child from prose alone when the canonical reference image is available in the active image conversation. Use the approved reference as the identity authority and derive the runtime candidate from it.

The implementation is not complete when a new image file exists. It is complete when the candidate has been integrated into the running game and visually compared at native scale.
