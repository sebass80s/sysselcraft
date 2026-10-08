# Nova Handover — 2026-10-08

Status: **ACT 3 STARTED · ART PIPELINE LOCKED · RUNTIME 1.1 ACTIVE**

Repository: `sebass80s/sysselcraft`  
Branch: `nova/runtime-architecture-v1`

## First rule

Verify branch, HEAD, GitHub CI and Runtime Browser Closeout before changing anything. Repository reality beats this handover, memory and older documentation.

## Current checkpoint

Code checkpoint immediately before this documentation closeout:

`b118978ad51fef1eb81c74891465808fd86276c5`

Verified on this exact code/test checkpoint:
- GitHub Actions CI #2490: **SUCCESS**
- Runtime Browser Closeout #28: **SUCCESS**

That commit fixes the one syntax defect introduced by the first Act 3 title-entry implementation. After the documentation commits, verify the new exact HEAD again.

## What is complete

Runtime Architecture 1.1 shared foundations are closed: Chapter Runtime Host, registry/lifecycle/navigation, child-scoped persistence, backend sync/reconciliation, Story, Story Purchase, project/progression, World/Area Runtime Host and debug/acceptance harness.

Act 1 is established. Preserve it unless fixing a concrete regression.

Act 2 is complete through:

`Motorbåten 16/16 → Efter motorbåten → Någon är där → De kom → Min kompis → Det är bättre → Över sjön → SLUT PÅ ANDRA KAPITLET`

Stable boundary: `act2Complete === true && endCardSeen === true`.

Core physical update-in-place acceptance has been exercised on preserved devices. Read `docs/PHYSICAL_IPHONE_ACCEPTANCE_2026-10-08.md`. Two follow-up smokes remain: background→foreground and ordinary backend quest turn-in/claim. Do not reset/reinstall the preserved device.

## Act 3 story canon

Read `docs/ACT3_STORY_MANIFEST.md` first.

Locked headline:
**KAPITEL 3 — På andra sidan sjön**

Setting: larger Swedish lakeside town/city, more populated and urban than Act 1/2 but intimate and child-scale.

Core trio: Barnet, Alve, Nova. Nova is the emotional protagonist.

Nova's parents are separated. She has linked the separation to a day when she behaved badly and carries the child-logic: **If being bad caused it, being perfect might undo it.**

Hard rule: **the parents do not reunite.**

Central place: city park / folkpark / lakeside recreation area tied to Nova's family memories.

Macro arc: one long family-day/party-preparation arc, not four separate building campaigns.

Support streams:
- Henning: food/cake;
- Linus: lighting;
- Mira: furniture/setup/logistics;
- Sol: music/atmosphere.

The restored motorboat keeps the Act 1 village active as a support network.

The family day genuinely succeeds, but the parents remain separated. Nova's hinge line is **“Men ni hade ju kul.”** Resolution: the separation was her parents' decision, not hers to cause or repair. Theme: **A family can change without ceasing to be a family.**

Current opening direction:
1. chapter title;
2. arrival in town harbour;
3. Nova on dock, headphones on, withdrawn;
4. dock conversation;
5. Nova shows Barnet and Alve the park and warms up.

Only step 1 is implemented in runtime.

## Act 3 runtime current state

Relevant files:
- `src/components/Act3Skeleton.tsx`
- `src/game/act3RuntimeState.ts`
- `src/game/act3DebugFixture.ts`
- `scripts/test-act3-empty-skeleton.mjs`
- `scripts/test-runtime-1-1-browser.mjs`

Current persisted state: `{ version: 1, entered: boolean }`.

Production is locked until Act 2 complete + end card acknowledged. First visit shows shared ChapterIntroCard. Continue persists `entered=true`. Reload must not replay it. Post-title screen is temporary placeholder UI. Harbour/Nova Story content is not implemented yet. Debug route remains `/act3-test`.

## Art Pipeline 2.0

Art is no longer a research task. Production method is locked.

Canonical:
- `docs/ACT3_ART_PIPELINE.md`
- `image-pipeline/README.md`
- `image-pipeline/character-registry.json`

User command: **`kör art`**

Meaning: structured v2 beat → canonical Library refs → one location anchor → at most one same-location previous-beat anchor → ChatGPT image generation → QA → approval → persistent Library anchor.

Hard rules:
- do not ask for established character sheets again;
- generated characters are never sole identity authority;
- exact cast only;
- Barnet's face hidden whenever Barnet is in Story art;
- no reference soup;
- failed candidates never become anchors.

Persistent refs: `/SysselCraft/Art References/characters/`  
Approved anchors: `/SysselCraft/Art References/anchors/<production-id>/<beat-id>.png`

Each production beat owns a unique `outputPath` under `public/assets/village/story-moments/act3/<group>/<filename>.png`.

Final GitHub PNG transfer is intentionally manual:
1. Nova approves and gives exact filename/path;
2. Kalle drag-and-drops the PNG into GitHub;
3. Nova verifies the repo path.

Do not reopen that workflow unless explicitly asked.

## Architecture laws for Act 3

If ordinary Act 3 work cannot be expressed through Runtime 1.1, say so and stop at the boundary. Decide unique gameplay vs missing shared capability. Reusable capability belongs in the shared engine first with the smallest owning regression.

A mechanic first invented for Act 3 is not automatically Act 3-owned.

Do not create `act3Purchase...` clones. Use generic Story Purchase. Backend remains authoritative for quest lifecycle, rewards, wallet, earned-work evidence and backend purchase ownership.

Act 3 local state owns consumed/presented chapter Story/world state only.

## Vercel / CI / native policy

Routine engineering:
- GitHub CI = automated verification;
- Runtime Browser Closeout = browser runtime acceptance;
- Xcode/Capacitor + physical iPhone = native acceptance when needed;
- Vercel = only when explicitly useful/requested.

Do not burn Vercel deployments for ordinary commits.

## Immediate next work

1. Verify final handover HEAD and both CI workflows.
2. Read `docs/ACT3_STORY_MANIFEST.md`.
3. Keep the title-card implementation.
4. Author and lock exact harbour/Nova arrival dialogue before encoding it.
5. Define first playable town/harbour area composition.
6. Use `kör art` for real opening Story images, not old PoC/stress images.
7. Implement opening beats through shared Story/runtime primitives.
8. Stop immediately if a missing reusable engine capability appears.

## Open Act 3 product decisions

Do not silently invent:
- exact harbour arrival dialogue;
- exact town/park map composition;
- progression/contribution count for party-preparation;
- stream ordering/free-choice model;
- exact village-return timing;
- Nova parent names/designs;
- Act 3 purchases/prices;
- chapter close and Act 4 bridge.

Lock product intent first, then encode.

## Final caution

Older MD files contain historical sections. Current top blocks and the documents named here supersede them. Do not delete proven compatibility code or preserved native state merely because an old label looks stale.
