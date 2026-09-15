# Codex local handoff — v4 start-area integration

Status: **prepared implementation handoff; not evidence of local integration or runtime success.**

Use this when the user's local `sysselcraft` working tree is open in Codex.

## Mission

Integrate the verified v4 start-area master and normalized construction assets into the **existing real Phaser VillageScene** while preserving the physically verified first quest/approval/truck/delivery loop.

Do not expand progression in this pass. Gate 0 is visual/runtime proof only.

## Safety first

Before changing anything:

1. run `git status --short` and inspect the local tree;
2. preserve all pre-existing modifications and especially `ios/`;
3. **do not** run pull/reset/clean/stash;
4. **do not** stage, commit, push or deploy;
5. do not run `npx cap add ios`;
6. do not overwrite unrelated local work merely to match remote.

The local tree has previously contained valuable uncommitted Phaser/native work. Treat that as user data.

## Remote v4 source

The v4 art upload was verified on branch `nova/vercel-free-batch` at commit:

`e10445dba4543a3fda5d92f5bee92227de69cbc6`

Bring **only these 13 files** from that remote commit/branch into the local working tree without merging/pulling unrelated branch changes:

- `public/assets/village/reboot/start-area-master-1920x640.webp`
- `public/assets/village/reboot/recycling-stage-1.webp`
- `public/assets/village/reboot/recycling-stage-2.webp`
- `public/assets/village/reboot/recycling-stage-3.webp`
- `public/assets/village/reboot/recycling-stage-4.webp`
- `public/assets/village/reboot/bakery-stage-1.webp`
- `public/assets/village/reboot/bakery-stage-2.webp`
- `public/assets/village/reboot/bakery-stage-3.webp`
- `public/assets/village/reboot/bakery-stage-4.webp`
- `public/assets/village/reboot/clinic-stage-1.webp`
- `public/assets/village/reboot/clinic-stage-2.webp`
- `public/assets/village/reboot/clinic-stage-3.webp`
- `public/assets/village/reboot/clinic-stage-4.webp`

If the files already exist locally, verify their provenance/content before replacing them.

## v4 calibration

Use these as the next runtime calibration, not unquestionable final collision truth:

| Building | world x | baseY | render envelope | ground footprint |
| --- | ---: | ---: | --- | --- |
| recycling | -180 | 500 | 330x236 | 190x72 |
| bakery | 835 | 305 | 330x295 | 205x72 |
| clinic | 1110 | 500 | 350x279 | 205x72 |

All four stages for each building share a fixed base point/render envelope. Do not let construction stages walk across the map.

Family house remains baked into the master. Recycling/bakery/clinic remain separate runtime objects.

## Required implementation behavior

- Replace the old runtime master background with `start-area-master-1920x640.webp`.
- Integrate the v4 building placements/footprints into the existing production-asset runtime rather than creating a parallel demo scene.
- Keep render bounds, base/depth point, collision footprint and interaction/approach geometry separate.
- Ensure dynamic player depth updates for **all movement paths**, including tap/pathfinding movement, not only keyboard/direct movement.
- Audit old static obstacles against the new background. Old-background obstacle coordinates are not automatically valid just because the world remains 1920x640.
- Derive building navigation obstacles from ground footprints, not full image rectangles.
- Keep future sites visually hidden as ordinary nature until progression reveals them. Do not invent construction progression in this Gate 0 pass.

## Preserve these invariants

Do not regress:
- painted child;
- painted Linus;
- repaired painted puppy;
- tap-to-move/A*;
- desktop movement;
- camera follow;
- contextual interactions;
- Linus intro;
- Linus -> family-house first-quest onboarding;
- first quest;
- parent mode/approval;
- truck arrival/delivery/departure;
- materials + wheelbarrow remaining afterward;
- Capacitor/native boundaries;
- Supabase/local state authority boundaries.

Do not refactor backend/approval/reward code unless a concrete compile/runtime dependency makes it unavoidable.

## Pathfinding diagnostic

After obstacle recalibration, statically/runtime-check as far as locally possible that these required points remain mutually reachable:
- player spawn;
- Linus interaction approach;
- family-house first-quest approach.

Also make sure no new building footprint seals a required corridor.

## Local verification

Run only safe local checks, preferably:
- TypeScript/typecheck;
- local production build if already supported by project scripts;
- relevant local static tests/checks that do not invoke remote CI;
- inspect exact diff;
- final `git status --short`.

Do **not** use Vercel or GitHub Actions.

If localhost can be started safely, do so only for local visual/runtime evidence. Do not claim visual success from compilation alone.

## Stop/report condition

Continue fixing locally discoverable issues until the next blocker genuinely requires the user/Nova to inspect runtime or a physical device.

Report:
1. exact files changed;
2. exact asset import method/provenance;
3. final building geometry and obstacle changes;
4. how dynamic player depth is handled for keyboard and tap/path movement;
5. pathfinding/reachability evidence;
6. local commands/checks and exact results;
7. remaining visual/runtime uncertainty;
8. final `git status --short`;
9. explicit confirmation that `ios/` and unrelated local work were not reset/cleaned/stashed/staged/committed/pushed/deployed.

Do not commit. Nova reviews the diff/evidence first.
