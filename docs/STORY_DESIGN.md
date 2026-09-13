# Sysselcraft — Story & World Design

> Canonical narrative/design document for Sysselcraft. This file describes the world, story, characters and intended emotional progression. Technical implementation details belong elsewhere.

## 1. Narrative promise

Sysselcraft begins small.

A family arrives in a quiet, almost abandoned village. It is not ruined or frightening, but it has clearly seen livelier days. Nature has begun reclaiming empty spaces, some places feel neglected, and only a few signs remain of the community that once existed here.

The child should not be told that completing real-world chores will rebuild the village. That connection is something the player discovers through play.

The central narrative idea is:

**The child does meaningful things in the real world, and life slowly returns to the game world.**

The village is therefore both setting and progression display. We show change instead of explaining systems with bars and percentages.

Locked design principles:

- **Gör saker i verkligheten → världen förändras.**
- **Quests bygger staden. Valutan gör den till din.**
- **Byn är gränssnittet.**
- **Visa progression. Redovisa den inte.**
- The child gets a game. The parent gets a tool.

## 2. Opening situation

The player's family has just moved into an old house in the village.

The village should initially feel sparse and mildly neglected rather than post-apocalyptic. Empty space matters. Early visual enrichment should come from nature, paths, materials, traces of former village life and small environmental details rather than prematurely placing all future buildings.

The family house establishes that the child belongs here. The rest of the village should initially feel unknown and slightly sleepy.

The first person the child meets is **Linus**.

## 3. Linus

Linus is an original resident and has lived in the village his whole life.

### Character

- Older man.
- Blue work clothes.
- Walks with a cane.
- Warm, dry and stubbornly optimistic.
- Genuinely happy that somebody has finally moved into the old house.
- Remembers when the village was lively.
- Misses those days without becoming gloomy or sentimental.
- Hopes people might return someday.

Linus should feel like a person who stayed when others left. He knows the place, its history and its little peculiarities, but he is not an exposition machine.

Most importantly, **Linus never tells the player that chores cause the village to grow or residents to return.** The game should allow the child to notice that relationship themselves.

### First meeting

When the child first speaks with Linus, he is surprised and pleased to discover that the family has moved into the old house.

Early in the conversation he asks:

**“Vad heter du?”**

The child enters their own name. From that point onward the game uses that name instead of the generic speaker label “Barnet”.

This is the first small act of ownership: the player is not merely controlling an anonymous game character. They have arrived in this place.

## 4. The puppy

Because so few people remain in the village, Linus has been looking after a puppy.

The puppy needs more walking and activity than Linus's knee appreciates. During the introduction, Linus offers the puppy to the child.

The child gets to name it.

The puppy then becomes the child's companion in the village.

### Puppy design rules

- The puppy is a companion, not an XP machine.
- It should follow the player's avatar naturally.
- It must never mechanically block movement or pathfinding.
- Its purpose is emotional attachment, life and companionship.
- Do not turn it into another visible progression meter.

The puppy also quietly reinforces one of Sysselcraft's themes: the village does not only need buildings. It needs relationships and living things.

## 5. The first quest

After the introduction with Linus and the puppy, the game leads naturally into the first real-world quest:

## **Bädda sängen**

The task itself is deliberately ordinary. The magic comes from what happens around it.

The intended first-loop sequence is:

**Quest appears → child goes away and performs the task in real life → child marks it complete → task waits for adult review → adult approves → child receives immediate reward → something happens in the village.**

Current prototype reward:

- 5 diamonds
- 10 SysselBux

Approval also contributes hidden progression:

- **Ordning & miljö: 70%**
- **Välmående & rutiner: 30%**

These percentages are implementation/progression weights, not information that should be displayed to the child.

## 6. The first piece of magic

The first approved quest must demonstrate Sysselcraft's central promise.

After approval, a truck arrives with materials. The event should feel like a consequence in the world rather than a UI reward animation wearing a village costume.

The child has done something mundane in reality, and now something tangible has changed in the village.

The first-loop proof is therefore:

**real task → submission → adult approval → reward → truck/material delivery → visible world change**

This moment matters more than adding lots of later content. Do not rush past it.

The child should begin wondering:

*What is going to happen if I do another quest?*

That curiosity is more valuable than explaining a progression system.

## 7. Hidden progression and village growth

Sysselcraft currently has five underlying progression classes:

1. **Ordning & miljö**
2. **Kunskap & skapande**
3. **Välmående & rutiner**
4. **Rörelse & aktivitet**
5. **Gemenskap**

Quests can contribute to one or several classes with different hidden weights.

The child should generally experience the consequences rather than inspect the mathematics. Progression should manifest through things such as:

- construction activity
- new materials
- environmental improvements
- repaired or changed places
- new residents
- new interactions
- signs that the village is becoming alive again

The village is the progression screen.

## 8. First new resident: Henning

**Henning is the first new resident to arrive after the game's opening phase.**

He is a baker.

Henning is also a respectful homage to the user's late grandfather, so the character should be treated with warmth and dignity rather than used as a disposable joke character.

Henning's arrival is important because it proves something larger than a pile of construction materials: **people can come back.**

The game should not reveal this possibility too early through menus, locked character slots or a complete building roster. His arrival should have some capacity to surprise the child.

The exact quest threshold/build sequence leading to Henning is not yet canonically locked and should be designed only after the first quest loop feels good.

## 9. Second new resident: Sol

**Sol arrives after Henning.**

She is a young, newly graduated female doctor, conceptually in her mid-to-late twenties.

### Character

- Competent.
- Warm.
- Enthusiastic.
- Organized and somewhat ambitious.
- New to professional life, but never portrayed as incompetent simply because she is young or newly graduated.

Sol broadens the village cast and eventually provides a natural character connection back to Linus: she can help him with his knee/cane situation later in the story.

That relationship should develop as village life returns rather than being dumped into her introduction as exposition.

## 10. Resident order and village naming

Current locked order:

1. **Linus** — original resident
2. **Henning** — first new resident, baker
3. **Sol** — second new resident, doctor

Later residents and the exact first-tier building roster remain design space unless separately locked.

The village itself should not receive its player-chosen name immediately.

**Village naming is earned after all five first-tier buildings have been established.**

By that point the child has helped turn an almost empty place into *their* village. Naming it then becomes a meaningful ownership moment rather than another setup form at the start of the game.

## 11. Storytelling rules

Sysselcraft is not intended to become a dialogue-heavy branching RPG.

Narrative should mostly be delivered through:

- short character conversations
- arrivals and departures
- environmental change
- construction and restoration
- new interactions becoming possible
- small callbacks between residents
- the player's own real-world actions producing consequences

Avoid explaining every system in dialogue.

Avoid turning Linus into a tutorial narrator.

Avoid making the child avatar silent merely to simplify writing. The child can participate in conversations, with their chosen name used naturally.

Avoid exposing future residents/buildings too aggressively before they matter. Discovery is part of the reward.

## 12. Emotional progression

The broad emotional arc should move roughly through these stages:

**Arrival** — This place is quiet. Who lives here?

**Belonging** — Linus knows us. I have a puppy. This is our house.

**Cause and effect** — I did something in real life and something happened here.

**Curiosity** — What happens if I keep going?

**Return of life** — Things are changing. Someone new has arrived.

**Community** — Residents begin having relationships with one another, not only with the player.

**Ownership** — This is no longer merely the village we moved into. We helped make it what it is.

The long-term story should grow outward from this arc rather than becoming a conventional save-the-world plot. Sysselcraft's stakes are intimate: caring for yourself, your home, other people and a community.

## 13. Current narrative boundary

The opening, Linus, puppy, first quest, first-loop material event, Henning-before-Sol order, Sol's core characterization and eventual village-naming milestone are canonical.

Anything beyond those points should be treated as **open design space** until deliberately discussed and locked.

In particular, do not prematurely canonize:

- exact number of quests before Henning arrives
- exact construction stages for the bakery
- exact requirements for Sol
- identities/professions/order of later residents
- full building roster
- detailed endgame

Build outward only when the preceding part of the experience works and feels rewarding.

---

### Document role

This is the canonical **story/world design** document. `NOVA_HANDOFF_MANIFEST.md` should summarize enough narrative state for continuity, while implementation architecture and operational rules belong in `TECHNICAL_HANDOFF.md`.
