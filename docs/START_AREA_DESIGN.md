# Sysselcraft Start Area Design

## Locked decision — 2026-09-15

The current 1920 × 640 Phaser village is the **start area** in Sysselcraft's locked multi-area world architecture.

### Start-area building capacity

The start area is deliberately designed around **four major buildings / building plots**:

1. **Family house** — permanent opening anchor and first quest source.
2. **Recycling center** — the first new building project and therefore mandatory in the start area.
3. **Bakery** — later expansion associated with Henning.
4. **Health center / clinic** — later expansion associated with Sol.

These four buildings must fit coherently in the start area while preserving useful movement space, paths, vegetation, readable silhouettes and true 2.5D depth/occlusion.

### Capacity law

**Do not squeeze a fifth major building into the start area merely because future content needs another building.** The fifth major expansion is the design signal to use/open another connected world area under the multi-area architecture.

This is a composition and progression constraint, not a requirement that all four buildings be simultaneously visible within one camera viewport. They belong to the same 1920 × 640 world area and may be encountered as the camera follows the player.

### Composition intent

Current intended districting is:

- recycling center: left side;
- family house / opening anchor: central area;
- bakery: upper/right district;
- health center / clinic: right/lower-right district.

The painted start-area environment is composed **for these four buildings**, rather than forcing the three dynamic buildings into accidental gaps in the older background. Roads, vegetation, walls, clearings and foreground elements should support the four-building composition from the outset.

Future construction locations must **not** be advertised by obvious empty plots, signs or placeholder foundations before progression reveals them. Before construction starts they should read as ordinary grass/nature. The reveal is part of the reward and should remain a surprise.

### Visual production calibration — v4 candidate

The current production package uses the new clean 1920 × 640 start-area master plus normalized four-stage building art. These values are the implementation calibration for the next Phaser integration pass; they remain subject to runtime/browser/iPhone validation before being treated as final collision truth.

| Building | World anchor / base | Render envelope | Collision footprint |
| --- | --- | --- | --- |
| Recycling center | `x=-180`, `baseY=500` | `330 × 236` | `190 × 72` |
| Bakery | `x=835`, `baseY=305` | `330 × 295` | `205 × 72` |
| Clinic | `x=1110`, `baseY=500` | `350 × 279` | `205 × 72` |

Runtime master asset:

`public/assets/village/reboot/start-area-master-1920x640.webp`

Normalized dynamic assets:

- `recycling-stage-1.webp` through `recycling-stage-4.webp`
- `bakery-stage-1.webp` through `bakery-stage-4.webp`
- `clinic-stage-1.webp` through `clinic-stage-4.webp`

All four stages of a building share one fixed ground/base point. The artwork is normalized into a common final envelope so construction can grow visually without the building walking across the map between stages.

The family house is permanent and may remain baked into the master scene. Recycling, bakery and clinic are progression-dependent and must remain separate runtime objects.

### Reusable calibration method for future areas

Do not guess future building scale/placement independently for every new map. Reuse this pipeline:

1. establish the final world/background dimensions and the image-space ↔ Phaser-world coordinate transform;
2. identify permanent composition anchors and intended building base points before coding placement;
3. use the child/avatar and existing permanent architecture as the human-scale reference, while allowing deliberately playful children's-game proportions rather than strict architectural realism;
4. calibrate a modest shared perspective/depth language across nearby buildings;
5. normalize every construction stage to a shared render envelope and fixed ground/base point;
6. define render bounds, collision footprint, interaction/approach points and occlusion/depth base separately;
7. derive navigation obstacles from ground footprints, not from full sprite rectangles;
8. verify required spawn/NPC/quest approach points remain connected after obstacles are applied;
9. inspect the actual Phaser runtime, then physical-device composition, before locking final values.

The background and dynamic assets should be designed together. The world determines where a building belongs, while the environment composition may deliberately make stylized asset proportions read coherently. Avoid forcing an otherwise good asset to architectural realism if doing so destroys the children's-storybook composition.

### Progression implication

Dynamic building locations may visually evolve through construction stages while retaining their world footprint and perspective. The start area therefore acts as the visual proof that Sysselcraft can support a persistent village that changes as the child completes approved real-world quests.

This decision does not yet lock which future expansion opens the next area, the exact exit geometry, or the final topology beyond the start area.
