# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-14)

Sysselcraft has run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart native migration or run `npx cap add ios` again.

Draft PR **#6** on `nova/vercel-free-batch` is the current batched hardening/design branch. Verify head/CI before claims and use Vercel deliberately.

### MAJOR VISUAL DIRECTION + IMPLEMENTATION

The old 16-bit/pixel-art target is **superseded**. Sysselcraft is canonically an **illustrated isometric storybook world** with soft organic forms, detailed vegetation/buildings, strong silhouettes, subtle shadows and a painted rather than grid-bound expression. The first concept-art image in the private development diary is the visual north star.

A first coordinated full storybook redesign batch has now been implemented across the current playable asset library and the main child-facing React UI. This is not merely a documentation decision anymore.

Do not restore crisp pixel rendering, fixed native pixel grid, nearest-neighbour scaling, hard rectangular shadows or generic white-app-card UI as defaults. Read `docs/ART_DIRECTION.md` and `docs/VISUAL_ASSET_PREP.md` before visual work.

The next visual priority is **real running evidence**: browser/native screenshot plus physical iPhone QA, followed by a second correction pass. Concept art remains the comparison target.

## Architecture direction

Keep React + Phaser + Capacitor, with Supabase as shared family/quest backend and local Capacitor Preferences preserved during reconciliation.

- React = app shell / non-world UI
- Phaser = village rendering/gameplay
- Capacitor = native container/capability bridge
- Supabase = household, child, pairing, parent quests, server-authoritative rewards
- Vercel/web = preview/fallback

Landscape-first. Do not bury domain logic inside Phaser.

## Product thesis

**Parent creates quest → quest appears in village → child performs it in real life → child marks it done → parent reviews → approval gives feedback + rewards + hidden progression → village changes.**

Locked laws:
- Gör saker i verkligheten → världen förändras.
- Quests bygger staden. Valutan gör den till din.
- Byn är gränssnittet.
- Visa progression. Redovisa den inte.
- Parent approval before reward/progression.
- Child gets game; parent gets tool.
- Start village sparse/mildly neglected; nature/materiality enriches it before future buildings.

## Interaction model

- Real child avatar.
- Mobile/tablet tap-to-move with pathfinding.
- Desktop additionally WASD/arrows.
- No virtual joystick.
- Contextual NPC/object approach/interact.
- Quest/UI markers directly tappable.
- **Avataren används för att uppleva världen. Klick/tapp används för att styra/använda spelet.**

## Canonical sources

- Story/world canon: `docs/STORY_DESIGN.md`
- Visual canon: `docs/ART_DIRECTION.md`
- Technical state: `docs/TECHNICAL_HANDOFF.md`
- Persistence authority: `docs/STATE_OWNERSHIP.md` + `docs/RECONCILIATION_PLAN.md`
- Private human/project history: newest `Sysselcraft_Utvecklingsdagbok_v*.docx` in File Library.

## Private development diary

Every future Nova must retrieve the newest diary at thread start and continue it at meaningful milestones. It is private and must not be committed to GitHub. Preserve genuine screenshots/concept art and never invent screenshots/quotes/events. The 2026-09-14 storybook redesign is a major diary milestone.

## State ownership boundary

- pairing does not migrate local save;
- local prototype and backend quests remain separate ledgers for now;
- reconciliation observe-only;
- no max merge/reward replay/retroactive reward fabrication/silent overwrite;
- migrate one state family at a time after physical two-device evidence.

## Systems to preserve

- adaptive Phaser world/camera;
- A*-style tap-to-move;
- keyboard movement;
- separate collision footprints and Y/base-depth sorting;
- reusable asset architecture;
- data-driven dialogue;
- Linus intro + puppy;
- quest marker/approval event;
- truck/material delivery and persisted completion;
- Capacitor Preferences local save;
- Supabase family/pairing/quest boundary;
- idempotent server rewards.

## Deployment / cost law

Repo `sebass80s/sysselcraft` is public. Normal standard GitHub-hosted Actions may be used autonomously. Do not opt into explicitly billed/larger runners or paid services without approval. Vercel deployments are scarce and branch pushes trigger previews, so batch coherent remote pushes.

## Next Nova checklist

1. Read this, `TECHNICAL_HANDOFF`, `STORY_DESIGN`, `ART_DIRECTION`, `STATE_OWNERSHIP`, `RECONCILIATION_PLAN`.
2. Retrieve newest private diary.
3. Verify current main/PR/CI/deployment rather than trusting stale SHAs.
4. Do not restart Capacitor setup.
5. Preserve storybook direction and gameplay geometry.
6. Physically validate the storybook batch and backend pairing/reward loop before claiming those proofs complete.
7. Keep reconciliation observe-only until evidence supports migration.
8. Keep diary private/current.
