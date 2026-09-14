# Landmark and progression-prop refinement · 2026-09-14

This source-level pass addresses the remaining high-salience props that still read flatter and more icon-like than the redesigned family house, terrain, vegetation and characters.

## Refined runtime assets

- `quest-board.svg`: richer timber/paper layering, pinned notices and softer outline hierarchy;
- `well.svg`: more material separation between timber, stone and water, with subtler structural linework;
- `lamp-post.svg`: toned metal, warmer glass/light treatment and less uniform hard edging;
- `material-stack.svg`: more believable plank/material variation while preserving the first-delivery footprint;
- `truck.svg`: softer painted body panels, clearer glazing/wheels and more internal material detail.

## Why these assets were selected

These objects are disproportionately noticeable because they either act as landmarks or communicate progression. A visually flat quest board or delivery truck can pull the whole scene back toward a prototype even when surrounding vegetation is polished.

## Preserved technical contract

The pass keeps existing filenames, SVG canvas dimensions, runtime keys, origins, placement coordinates and progression timing. No quest state, pathfinding, collision or backend code changes are included.

## Remaining visual proof

The next meaningful decisions are composition-sensitive and should be based on an actual rendered run. On the physical iPhone, verify:

1. the quest board remains readable as a destination without becoming UI-like;
2. the well and lamp add texture without competing with Linus or the family house;
3. the material delivery is immediately visible after approval but does not reveal construction early;
4. truck scale and movement feel plausible relative to the road and characters;
5. all refined props share the same light direction, outline hierarchy and shadow softness as the rest of the village.

Do not alter collision or progression timing merely to match the richer illustrated silhouettes.
