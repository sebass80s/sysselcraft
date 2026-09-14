# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not restart solved work.

## 🚨 READ FIRST — CURRENT STATE (2026-09-14)

Sysselcraft has run as a real native app on the user's physical iPhone via Capacitor/Xcode. Do not restart native migration or run `npx cap add ios` again.

Draft PR **#6** on `nova/vercel-free-batch` is the current batched hardening/design branch. Verify branch head/CI before claims.

## 🔒 CANONICAL VISUAL DIRECTION — DO NOT REINTERPRET

The canonical brief is exactly:

> **En illustrerad isometrisk sagoboksvärld med mjuka organiska former, ganska mycket detalj i vegetation och byggnader, fina och tydliga silhuetter, subtila skuggor och ett målat snarare än rutnätsbundet uttryck.**

The visual references to aim for are the **soft illustrated isometric storybook images created during the questgiver discussion**. They are the intended visual family: warm, gentle, detailed, organic, spatial and painterly.

### Future-Nova warning

**PIXEL ART IS NOT THE DESIGN. DO NOT REVIVE IT.**

The old 16-bit/pixel-art direction and the later pixel-heavy intermediate build are superseded. They remain in repository history only because they happened, not because they are references. Do not infer visual canon from current/historical asset files, screenshots or commits when they conflict with `ART_DIRECTION.md`.

No Space Invaders in the sagovärld: do not introduce crisp pixel aesthetics, nearest-neighbour scaling, deliberately low-resolution sprites, chunky pixel outlines, blocky tile geometry, pixel-RPG UI or retro-game styling as the visual default.

2.5D means spatial depth and occlusion, **not pixel art**.

There is **no mandatory bitmap-versus-vector choice**. SVG/vector, PNG/WebP/bitmap, spritesheets, atlases or hybrids may be used according to what best produces the approved visual result and performs reliably. Format is engineering; appearance is art direction.

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
- Start village sparse/mildly neglected; nature/materiality enriches it before future buildings.
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
- Technical state: `docs/TECHNICAL_HANDOFF.md`
- Persistence authority: `docs/STATE_OWNERSHIP.md` + `docs/RECONCILIATION_PLAN.md`
- Private human/project history: newest `Sysselcraft_Utvecklingsdagbok_v*.docx` in File Library.

If documents disagree about visual style, **`ART_DIRECTION.md` and the exact locked brief above win.** Historical files may describe superseded experiments.

## Private development diary

Every future Nova should retrieve the newest diary at thread start and continue it at meaningful milestones. It is private and must not be committed to GitHub. Preserve genuine screenshots/concept art and never invent screenshots/quotes/events.

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

**Local/native testing is the default.** Use Xcode/physical iPhone for routine visual, UI and gameplay iterations. Use Vercel only when testing genuinely requires a network deployment, remote URL or web-specific behavior.

## Next Nova checklist

1. Read this, `TECHNICAL_HANDOFF`, `STORY_DESIGN`, `ART_DIRECTION`, `STATE_OWNERSHIP`, `RECONCILIATION_PLAN`.
2. Retrieve newest private diary when available.
3. Verify current branch/main/PR/CI rather than trusting stale SHAs.
4. Do not restart Capacitor setup.
5. **Before drawing anything, repeat the visual target to yourself: soft illustrated isometric storybook, not pixel art.**
6. Use the approved questgiver/storybook renders as the intended visual family and `ART_DIRECTION.md` as written authority.
7. Do not infer art direction from obsolete pixel-heavy assets.
8. Prefer local/native QA; do not use Vercel for routine iteration.
9. Preserve and physically regression-test the working quest/approval/delivery loop.
10. Keep reconciliation observe-only until evidence supports migration.
