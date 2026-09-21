# Sysselcraft — Playable MVP Journey

Status: planning map. This is a sequencing document, not permission to implement every item at once.

2026-09-21 evidence: Kalle completed the Recycling stage 1–4 arc on physical iPhone from a clean save, including completion and restart/no-replay checks, plus adult-mode scroll/reset. Stages 2–4 used native test controls, not newly authored production quests. Bakery pacing design may now begin; Henning has not spawned and Bakery remains inactive. The planned gates below include work beyond what this test proves, such as production contribution rules and completed-building interaction. See `TECHNICAL_HANDOFF.md`.

## Product proof we are building toward

A child and parent can use Sysselcraft as a real family loop for long enough to experience not just one quest, but a small village story:

**arrive → meet Linus/puppy → complete real quests with parent approval → watch recycling center grow → meet Henning → begin bakery growth → meet Sol later → understand that the village can expand beyond the opening area.**

The MVP does not need a giant content catalog. It needs this chain to feel coherent, rewarding and technically trustworthy.

## Gate 0 — Visual PoC (CURRENT)

Goal: prove the approved painted storybook + true-2.5D direction in the real Phaser runtime without breaking the already-working quest loop.

Required evidence:
- v4 master background integrated;
- recycling/bakery/clinic production assets render at calibrated positions/scales;
- player/NPC/dog remain coherent enough for the scene;
- dynamic Y-depth works for all movement paths;
- collision/pathfinding match the new background;
- spawn, Linus and first-house quest route remain connected;
- local browser visual pass;
- physical iPhone visual + first-loop regression pass.

Do not expand gameplay before this gate passes. A beautiful concept sheet is not evidence.

## Gate 1 — Remove the post-delivery dead end

Goal: first quest permanently changes a major world object.

Slice:
- truck/material sequence unchanged;
- post-delivery Linus marker/conversation;
- recycling stage 1 reveal;
- persisted/idempotent stage state;
- restart test.

Success feeling: **“I did that.”**

## Gate 2 — Repeatable real-world construction

Goal: prove the game can sustain the loop, not merely perform one scripted trick.

Slice:
- one additional parent-approved quest advances recycling to stage 2;
- no duplicate advancement from reload/review replay;
- world change is visible without numeric progress UI;
- parent flow remains usable.

Success feeling: **“It keeps changing when I help.”**

## Gate 3 — First completed project

Goal: finish recycling stages 3–4 and make the first built place feel real.

Slice:
- four approved contributions total for this onboarding project;
- stage 4 completion presentation;
- completed building is interactable at a lightweight level;
- Linus completion conversation;
- Henning foreshadow;
- full physical-device playthrough of the arc.

Success feeling: **“We built this.”**

Only after this gate should bakery pacing be locked from evidence.

## Gate 4 — First returning resident: Henning

Goal: prove village growth brings people back, not only structures.

Slice:
- arrival cue/scene;
- Henning appears as a character before the bakery is complete;
- warm introduction with a clear reason for being here;
- bakery project becomes meaningful because Henning wants/needs it;
- no giant resident-management system required.

Success feeling: **“Someone came here because the village is alive again.”**

## Gate 5 — Bakery arc

Goal: prove the first-project pattern can evolve rather than repeat mechanically.

Decide from recycling play evidence:
- quest count/pacing;
- how much Linus steps back;
- how Henning owns his own project story;
- whether construction stages need different event rhythm;
- what lightweight function the completed bakery provides.

Avoid cloning recycling with different artwork. The second project should feel familiar enough to understand but richer in character.

## Gate 6 — Sol and clinic

Goal: establish that returning residents have relationships and distinct roles.

Sol arrives after Henning. She is competent, warm, enthusiastic, organized/ambitious and newly graduated, never incompetent-for-comedy.

The clinic arc should begin only after the Henning/bakery experience demonstrates that the resident-project model works. Sol can later connect naturally to Linus's knee/cane situation, showing that the village is becoming a community rather than a set of player-facing kiosks.

## Gate 7 — World expansion proof

Goal: opening area feels intentionally full and the next major project creates spatial expansion.

Rules already locked:
- opening area has family house + recycling + bakery + clinic;
- building #5 belongs in another connected area;
- transition is physical/soft world movement, not a level-select menu;
- progression persists across areas.

MVP only needs one convincing expansion proof, not a continent.

## Cross-cutting backend gates

Do not migrate state families merely because gameplay content reaches them.

Maintain:
- parent approval as authority;
- idempotent rewards/progression;
- local prototype vs Supabase ledger boundary until reconciliation is evidenced;
- observe-only reconciliation until physical two-device proof supports migration;
- one state-family migration at a time.

## Scope brakes

Before MVP journey is coherent, avoid:
- broad crafting system;
- visible XP/building progress meters;
- resident roster UI;
- level-select/world map menu;
- dozens of future buildings;
- deep minigames attached to every building;
- elaborate economy balancing;
- endgame design;
- polishing obsolete visual systems.

## Evidence ladder

For each gate, use the cheapest evidence that can actually answer the question:

1. document/design consistency;
2. type/build/static checks;
3. local browser runtime;
4. physical iPhone;
5. parent/child two-device flow when shared backend behavior is involved.

Do not skip directly from design confidence to “done”.
