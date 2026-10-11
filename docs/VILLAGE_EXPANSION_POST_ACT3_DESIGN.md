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
8. **Optional paid minigames:** Selected completed buildings unlock **replayable minigames at that location**. **Normally each play/session costs SysselBux (SB)**, paid when starting the game. Building acquisition and play fees are separate SysselBux sinks. The child may replay by paying again. Minigames do **not** reward SB or diamonds and do not bypass real-world, parent-approved quests as the source of currency. No minigame purchase/play is mandatory for story progress.
9. **NPC-gifted free rounds when funds are low:** Linus or another established villager may sometimes gift a free minigame round when the child's **SB balance is too low to afford a play**. This is a limited, characterful exception, **not** an automatic or unlimited free-play mode. Redeeming a gift waives the SB fee once, without adding SB or diamonds. Exact triggers, limits and frequency remain open.
10. **Durable SB spending power:** The village economy must offer **useful, attractive, optional SB spending opportunities beyond finite building purchases**. Repeatable paid minigames are the first approved evergreen SB sink. Develop and test further repeatable or renewable spending opportunities as needed so SB remains desirable long after the village is built. Avoid inflation through unchecked payouts and do not make spending mandatory for chapter progression.

## First building concepts (examples, not locked final catalog)

- **Fotbollsplan:** Village amateur football field. In the proposed humorous completion beat, **Linus referees a division 7 match and conspicuously rules in the village team's favour**. Preserve the character-based humour. The exact lines, shot list, result and whether the scene recurs are **not yet written/locked**.
- **Glasskiosk:** An ice cream stand that makes the village visibly more lively; completion triggers a distinctive village beat.
- **Lekplats:** Playground, with its own opening/completion beat.
- **Skatepark:** Additional candidate building, not yet confirmed for the first release.

Further catalog ideas may be added after testing; avoid locking a fixed building list prematurely.

### Minigames as optional spending (LOCKED CORE LOOP — 2026-10-12)

**Real-world approved quest → earn SB → buy chosen building at Mira → building completion beat → optionally pay SB to play a minigame on that site → pay SB again for another session (unless an occasional low-funds NPC gift covers that session).**

Candidate pairings for later design: football field / penalty shootout; ice-cream kiosk / serving orders; playground / timing challenge; skatepark / trick challenge. These examples are **NOT selected minigames or locked rules**. They illustrate how the purchased environment can become interactive. Only appropriate buildings need minigames; a specific game for every building is not yet required.

For a fair child-facing economy, show each play fee before starting, avoid extra charges for mistakes during a session, and tune the price against realistic quest rewards so playing remains accessible. Exact fee values, session duration and retry UX remain OPEN. These are in-game SB fees, **not real-money payments or in-app purchases**.

### Occasional courtesy plays from villagers — LOW-FUNDS RULE (LOCKED DIRECTION 2026-10-12)

**Linus or another established NPC can occasionally offer a free round when the child cannot currently afford the normal SB fee.** The gift is framed as personal kindness and humour, not a system that instructs children to spend all their money to get free games. Example tone (NOT final dialogue): Linus offers a free try at football, insisting that any controversial referee decisions were correct.

Low balance is an **eligibility condition**, not an automatic guaranteed reward. The exact definition can be evaluated against the specific minigame's entry price (a sensible candidate is `balance < entryFee`), but no number or rule is finalized. Limit how often such gifts can appear, prevent repeated NPC-tapping or intentional balance-draining from creating an unlimited free-play exploit, and persist any gift/consumption across restarts. A redeemed free round **waives one entry fee**; it does **not** mint SB, diamonds, or an exchangeable item. Do not assume daily login bonuses, timed calendars, or a fixed grant rate without later design approval.

### Long-term SB economy — EVERGREEN SPENDING (LOCKED DESIGN GOAL 2026-10-12)

**SysselBux must retain meaningful optional uses even after every currently available building or furniture item has been bought.** A one-time catalog alone cannot support long-term retention. Repeatable per-session fees for minigames are the first concrete SB sink. Additional potential sinks to explore (NOT locked to build): changing seasonal decorations, customizing/upgrading play areas, occasional village events and consumable activities. Keep them cosmetic/entertainment-oriented and optional, never as pay-to-advance chapter gates. Review currency earning rate versus spending appeal and costs during real family tests; avoid both worthless hoarding and a frustrating scarcity spiral. All SB earning remains tied to legitimate parent-approved real-world quests.

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
- NPC free-round eligibility/threshold, cadence, caps, character presentation, consumption/persistence, and anti-farming protection.
- Which additional appealing **repeatable SB sinks** to ship after initial building and room catalogs, and how to balance SB earning versus spending based on tests.
- UX for announcing affordability/build progress, balance and economy calibration.

## Acceptance goals for implementation

- Child can navigate from the established village into the separate left-hand area and back.
- Mira's shop exposes the applicable building purchases, debits **SysselBux** exactly once per valid purchase and preserves state on restart.
- Completing each purchased building causes its distinct beat exactly once and leaves the building visible/persistent.
- Selected finished buildings offer an optional minigame at that site. Starting each valid play normally charges its advertised SB fee **exactly once**; no additional SB/diamonds are awarded by gameplay. Replay normally incurs a new fee; failed or cancelled starts must not silently double-charge.
- If the child has too few SB for a play, a **limited, occasional NPC courtesy round** may be offered and consumed once at no cost, with persistent, non-farmable behavior. This does not generate or refund SB.
- Once available buildings/furniture are purchased, there are still worthwhile optional ways to **spend** SB (starting with replayable paid minigames).
- Ordinary Act 3/Act 4 story, quest approvals, diamonds, save/persistence and existing shop purchases are unaffected.
- A family can engage with the village-building loop while waiting for the next story chapter, without any new compulsory quest.
