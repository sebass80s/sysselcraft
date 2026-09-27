# Act 2 visual production checkpoint

Status date: 2026-09-28  
Branch: `nova/local-construction-snapshot`  
Audit base commit: `046bf346216a9be447b3f05ade7707d9230ddf90`

## Locked production method

Act 2 uses one static Lake Master plus separate dynamic stage assets. The master owns terrain, shoreline and water. Stage assets use a fixed world anchor and a common transparent canvas per family so swapping stages never moves the object.

No stage is independently positioned. No non-uniform stretching is allowed. Production cleanup is deterministic: alpha cleanup, transparent crop, common canvas, bottom-center alignment, then runtime downscale.

## Source package

`public/assets/village/buildings/act 2/`

- `lake-master.png`
- `cabin-stage-1.png` … `cabin-stage-4.png`
- `dock-stage-1.png` … `dock-stage-4.png`
- `boat-house-1.png` … `boat-house-4.png`
- `motorboat-stage-1-transparent.png` … `motorboat-stage-4-transparent.png`

17 files total.

## Byte-level audit

All 17 GitHub blobs were matched byte-for-byte against the production source files used during this session.

The source package is complete, but several uploaded images still contain baked checkerboard backgrounds rather than usable alpha. This was caught before runtime integration.

Affected source files:
- cabin stages 2–4
- dock stages 1–2 and 4
- boat-house stage 3

Already-alpha source files remain usable as sources, but all four families should be passed through the same deterministic normalization step before runtime.

## Normalized family geometry

Normalization does not enlarge or redraw source artwork. Transparent outer pixels are cropped; baked neutral checkerboard is converted to alpha; each family is then placed bottom-center on one shared transparent canvas.

| Family | Shared normalized canvas |
| --- | --- |
| Cabin | 1766 × 879 |
| Dock | 1774 × 887 |
| Boat house | 1628 × 991 |
| Motorboat | 725 × 423 |

## Initial world proof geometry

These values are the current visual-production proof settings, to be verified in runtime/iPhone before final lock:

| Family | Display width | World anchor | Origin |
| --- | ---: | --- | --- |
| Cabin | 350 px | (575, 375) | (0.50, 0.92) |
| Boat house | 340 px | (1435, 505) | (0.50, 0.92) |
| Dock | 315 px | (1660, 515) | (0.50, 0.90) |
| Motorboat | 180 px | (1635, 430) | (0.50, 0.82) |

Cabin has already passed the same-anchor visual proof. The remaining families have now been composited against the actual Lake Master using the geometry above.

## Acceptance gates before runtime integration

1. Source package exists and is byte-verified.
2. Alpha is real; no baked checkerboard may enter runtime.
3. All four stages in a family share one canvas and anchor.
4. Composite against the actual Lake Master at runtime scale.
5. Stage 1→4 swap must not jump.
6. Check shoreline/water interaction for dock and boat house.
7. Motorboat remains a separate object from dock and boat house.
8. Final motorboat state may move to a dedicated water anchor if story progression requires it.
9. Only after visual geometry passes should Phaser/runtime integration begin.
10. Final acceptance happens on the physical iPhone.
