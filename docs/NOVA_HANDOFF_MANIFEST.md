# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-15)

Sysselcraft has run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart native migration or run `npx cap add ios` again.

Draft PR **#6** on `nova/vercel-free-batch` is the current batched hardening/design branch. Verify branch head/CI before claims.

## 🔒 FUNDAMENTAL COLLABORATION RULE — TRUTH BEFORE MOMENTUM

This is the most important working rule for every future Nova. It outranks the desire to sound confident, keep momentum or preserve an existing plan.

**Never invent project state, capability, evidence, success, test results, files, screenshots, runtime behavior or conclusions.**

- If you do not know, say **you do not know**.
- If you cannot do something with the available tools or required quality, say **you cannot do it**.
- If something is only a hypothesis, label it as a hypothesis.
- If something has not been tested, call it **unverified**, not working, green, complete or proven.
- Verify repository/runtime state directly whenever possible instead of relying on stale handoff state.
- Do not hide a limitation by delivering a weaker substitute and describing it as the requested result.

Nova is not an automatic “yes” machine. If the user is moving too far, too fast, skipping an important proof, expanding scope before a risky assumption is tested, or proposing a direction likely to waste working implementation, Nova must say so before the project commits to it.

> **The user says what they actually want. Nova says what is actually known, possible, uncertain and risky. Reality wins over the plan.**

A failed experiment is useful evidence. A fabricated success is project damage.

## 🔒 AUTONOMOUS EXECUTION LAW

After the user says “kör”, “kör på”, “bara kör”, “bygg på nu”, “fortsätt”, or equivalent, continue autonomously through verify → implement → checks → evidence → fix → continue. Do not stop merely to narrate the next step. Stop only for a genuine external dependency, product decision, credential/permission, physical-device/local result, or risky destructive action that requires the user. If one subtask is blocked, continue other useful work.

## 🔒 CANONICAL VISUAL DIRECTION

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

**PIXEL ART IS NOT THE DESIGN. DO NOT REVIVE IT.** The old pixel-heavy states are historical evidence, not visual references.

## 🔒 TRUE 2.5D

Sysselcraft must be genuine 2.5D, not a flat top-down field with isometric-looking stickers. Preserve coherent perspective, object base points, Y-depth, foreground occlusion, contact shadows, ground-plane roads and separate render/collision/interaction/occlusion geometry. Y-sorting alone is not true 2.5D.

Read `docs/ART_DIRECTION.md`, `docs/VISUAL_ASSET_PREP.md` and `docs/TECHNICAL_HANDOFF.md` before visual work.

## Architecture direction

Keep React + Phaser + Capacitor, with Supabase as shared family/quest backend and local Capacitor Preferences preserved during reconciliation.

- React = app shell / non-world UI
- Phaser = village rendering/gameplay
- Capacitor = native container/capability bridge
- Supabase = household, child, pairing, parent quests, server-authoritative rewards
- Vercel/web = preview/fallback when genuinely needed

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
- Quests belong to the world, not only the house.

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
- Start-area canon: `docs/START_AREA_DESIGN.md`
- Technical state: `docs/TECHNICAL_HANDOFF.md`
- Persistence authority: `docs/STATE_OWNERSHIP.md` + `docs/RECONCILIATION_PLAN.md`
- **Private human/project history: private repo `sebass80s/sysselcraft-diary`, canonical living file `diary/Sysselcraft_Utvecklingsdagbok.md`.**

If documents disagree about visual style, `ART_DIRECTION.md` and the exact locked brief above win. Historical files may describe superseded experiments.

## 🔒 PRIVATE DEVELOPMENT DIARY — ACTIVE CONTINUITY DUTY

The development diary is not optional archival cleanup. It is Sysselcraft's private, human-readable project memory and should grow alongside the game.

- The diary lives in the **private GitHub repository `sebass80s/sysselcraft-diary`**, not in this public repository.
- At thread start, read `diary/Sysselcraft_Utvecklingsdagbok.md` in that private repo as part of project continuity when access is available.
- Update it **fairly often** when something story-worthy happens. Do not wait only for giant milestones.
- Good triggers: meaningful design decisions, first-time proofs, visible transformations, notable bugs/failures, architectural turns, character/world insights, physical-device breakthroughs and memorable Kalle/Nova moments.
- Prefer several short honest entries over reconstructing weeks of history later.
- Do not turn it into a changelog. Routine dependency bumps, tiny refactors and mechanical commits do not deserve entries unless they matter to the story.
- Explain **what changed, why it mattered, what we learned, and how the project felt at that point**.
- Preserve genuine Kalle/Nova quotes and project folklore when they genuinely occurred.
- Never fabricate a screenshot, runtime result, quote, commit, date or event.
- Preserve wrong turns. When direction changes, record both the abandoned direction and why it was abandoned. Do not rewrite earlier history to make the project look clairvoyant.
- Add genuine screenshots/concept art to the private diary repo when useful and technically available.
- Historical Word diary versions belong under `archive/` when imported. The known historical diary reached v0.7 before the private repo was created.
- GDD/design documents remain sources of design truth; Technical Handoff remains technical truth. **The diary is the journey.**

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
- Linus-to-house first-quest onboarding;
- quest marker/approval event;
- truck/material delivery and persisted completion;
- Capacitor Preferences local save;
- Supabase family/pairing/quest boundary;
- idempotent server rewards.

## Deployment / cost law

Repo `sebass80s/sysselcraft` is public. Normal standard GitHub-hosted Actions may be used autonomously. Do not opt into explicitly billed/larger runners or paid services without approval.

**Local/native testing is the default.** Use local browser and Xcode/physical iPhone for routine visual, UI and gameplay iterations. Use Vercel only when testing genuinely requires a network deployment, remote URL or web-specific behavior.

## Visual acceptance gate

Before calling the graphics redesign complete, verify in the running game and then on physical iPhone:

1. first glance reads as soft illustrated isometric storybook + true 2.5D;
2. it cannot reasonably be mistaken for pixel art, a tiled retro game or a flat sticker field;
3. child can visibly pass both behind and in front of appropriate tall objects;
4. terrain/road boundaries reveal no distracting rectangular asset bounds or grid seams;
5. contact shadows, object bases and occlusion agree;
6. house, Linus, child, dog and quest markers remain readable at native landscape-iPhone scale;
7. the previously verified quest/approval/truck/delivery loop still works.

## Next Nova checklist

1. Read this, `TECHNICAL_HANDOFF`, `STORY_DESIGN`, `ART_DIRECTION`, `STATE_OWNERSHIP`, `RECONCILIATION_PLAN`.
2. Read the private living diary in `sebass80s/sysselcraft-diary` and keep it moving during the project.
3. Verify current branch/main/PR/CI rather than trusting stale SHAs.
4. Do not restart Capacitor setup.
5. Apply truth-before-momentum before project-status claims.
6. Preserve and physically regression-test the working quest/approval/delivery loop.
7. Keep reconciliation observe-only until evidence supports migration.
