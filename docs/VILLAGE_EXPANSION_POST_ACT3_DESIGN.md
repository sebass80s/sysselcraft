# Village Expansion — free-standing village building feature

**Status: HIGH-LEVEL DESIGN LOCKED 2026-10-12. NOT IMPLEMENTED.**
**Production order: develop AFTER Act 3 and BEFORE Act 4.**
**Source of truth:** This document, referenced from `docs/STORY_DESIGN.md`. It is independent of the Act 3 and Act 4 scripts.

## Why we are doing this

The original SysselCraft idea included a village that would keep growing around Linus. Later acts expanded the adventure beyond the village, while the child's ability to furnish their room using SysselBux proved engaging in testing. Bring back an ongoing sense of *building my own village*, alongside the authored story. Do not replace or rewrite the acts.

The village should continue to change because the child carries out real-world quests, earns SysselBux and decides what to spend them on. Story chapters provide narrative momentum; the village provides lasting, player-directed ownership.

## Locked product decisions

1. **Separate village-building area:** Plan a new adjacent area/screen **to the left of the existing Act 1 village**, not an extension of Act 3's city map. It is still part of the child's home village.
2. **SysselBux economy:** The child can spend earned **SysselBux** to buy buildings/features for the village. This works **parallel to and independently of the main story**. No mandatory village purchases or construction stages may gate Act 3 or Act 4 progression.
3. **Mira is the merchant:** Purchases happen through **Mira's existing shop**, following the already established merchant rule. Linus does not sell buildings. Model the agency and ownership on furnishing the child's room.
4. **Choice and persistence:** The child chooses what to save for and what to build rather than following a required fixed sequence. Once completed, a building becomes a persistent visible part of that child's village across visits/restarts.
5. **Completion beats:** **When a building is finished, it triggers its own short, distinct character/story beat.** This is part of the reward for building, beyond decoration. Use the existing story/beat language and shared engine rather than creating a parallel dialogue system. Trigger only when the completion condition is met, and persist the fact it played so reloading does not duplicate it.
6. **Character and tonal direction:** These independent scenes primarily show everyday village life, comedy and established personalities. **Linus returns as a central comic presence in the village**, without becoming the protagonist of all future acts. The main chapter stories may remain more emotionally serious.
7. **Location in roadmap:** This is a **dedicated development slice after completion of Act 3 and before beginning Act 4**, not Act 3 filler and not an Act 4 story arc. Can continue to function during later chapters.
8. **Optional paid minigames:** Selected completed buildings unlock **replayable minigames at that location**. **Each play/session costs SysselBux (SB)**, paid when starting the game. Building acquisition and play fees are separate SysselBux sinks. The child may replay by paying again. Minigames do **not** reward SB or diamonds and do not bypass real-world, parent-approved quests as the source of currency. No minigame purchase/play is mandatory for story progress.

## First building concepts (examples, not locked final catalog)

- **Fotbollsplan:** Village amateur football field. In the proposed humorous completion beat, **Linus referees a division 7 match and conspicuously rules in the village team's favour**. Preserve the character-based humour. The exact lines, shot list, result and whether the scene recurs are **not yet written/locked**.
- **Glasskiosk:** An ice cream stand that makes the village visibly more lively; completion triggers a distinctive village beat.
- **Lekplats:** Playground, with its own opening/completion beat.
- **Skatepark:** Additional candidate building, not yet confirmed for the first release.

Further catalog ideas may be added after testing; avoid locking a fixed building list prematurely.

### Minigames as optional spending (LOCKED CORE LOOP — 2026-10-12)

**Real-world approved quest → earn SB → buy chosen building at Mira → building completion beat → optionally pay SB to play a minigame on that site → pay SB again for another session.**

Candidate pairings for later design: football field / penalty shootout; ice-cream kiosk / serving orders; playground / timing challenge; skatepark / trick challenge. These examples are **NOT selected minigames or locked rules**. They illustrate how the purchased environment can become interactive. Only appropriate buildings need minigames; a specific game for every building is not yet required.

For a fair child-facing economy, show each play fee before starting, avoid extra charges for mistakes during a session, and tune the price against realistic quest rewards so playing remains accessible. Exact fee values, session duration and retry UX remain OPEN. These are in-game SB fees, **not real-money payments or in-app purchases**.

## Design guardrails

- This is **not** a separate compulsory story questline, and the child does not need to finish the building area to unlock an act.
- Parent-approved real-world quests remain the authoritative way to earn rewards. No fake completion, instant bonus quests, second progression currency or monetized SysselBux.
- Keep save ownership, economy and purchase validation in the shared runtime/domain layer. Reuse existing room/shop and beat patterns where sensible; do not duplicate systems.
- The new left-hand area must not change the **five-icon, gradually revealed Act 3 city map** or spoil existing narrative content.
- Building completion is meaningful both visually and narratively; a decoration-only catalog misses the point.
- Beats here are lighter character vignettes, **not** a demand for new full-screen art or a new visual pipeline unless separately decided.
- Preserve the child's agency: their selection of buildings changes what the village looks like. Do not force the child through a linear sequence of purchases.

## Open for design after Act 3 (do not claim locked)

- Final list of buildings, individual prices, visual stages, purchase and construction completion rules.
- Number/shape of plots, free placement versus zones, moving previously bought buildings.
- Exact left-area map layout, navigation, art and NPC placement.
- Beat scripts, image requirements, whether completed beats can be replayed and any later recurring interactions.
- Which buildings have minigames, which games they contain, game rules, difficulty, scoring, replay and interaction details.
- Exact per-session SB fees, balancing, cancel/refund behavior if a session cannot start, and how sessions/charges persist.
- UX for announcing affordability/build progress, balance and economy calibration.

## Acceptance goals for implementation

- Child can navigate from the established village into the separate left-hand area and back.
- Mira's shop exposes the applicable building purchases, debits **SysselBux** exactly once per valid purchase and preserves state on restart.
- Completing each purchased building causes its distinct beat exactly once and leaves the building visible/persistent.
- Selected finished buildings offer an optional minigame at that site. Starting each valid play charges its advertised SB fee **exactly once**; no additional SB/diamonds are awarded by gameplay. Replay incurs a new fee; failed or cancelled starts must not silently double-charge.
- Ordinary Act 3/Act 4 story, quest approvals, diamonds, save/persistence and existing shop purchases are unaffected.
- A family can engage with the village-building loop while waiting for the next story chapter, without any new compulsory quest.
