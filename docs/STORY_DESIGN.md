# Sysselcraft — Story & World Design

> Canonical narrative/design document for Sysselcraft. This file describes the world, story, characters and intended emotional progression. Technical implementation details belong elsewhere.

## 1. Narrative promise

Sysselcraft begins small.

A family arrives in a quiet, almost abandoned village. It is not ruined or frightening, but it has clearly seen livelier days. Nature has begun reclaiming empty spaces, some places feel neglected, and only a few signs remain of the community that once existed here.

The child should not be told that completing real-world chores will rebuild the village. That connection is something the player discovers through play.

**The child does meaningful things in the real world, and life slowly returns to the game world.**

Locked principles:
- **Gör saker i verkligheten → världen förändras.**
- **Quests bygger staden. Valutan gör den till din.**
- **Byn är gränssnittet.**
- **Visa progression. Redovisa den inte.**
- The child gets a game. The parent gets a tool.

## 2. Opening situation

The player's family has just moved into an old house in the village. The village initially feels sparse and mildly neglected rather than post-apocalyptic. Empty space matters. Future construction sites must not be advertised in advance with signed plots, lock icons or obvious empty foundations.

The family house establishes that the child belongs here. The rest of the village feels unknown and sleepy. The first person the child meets is **Linus**.

## 3. Linus

Linus is an original resident and has lived in the village his whole life.

- Older man, blue work clothes, walks with a cane.
- Warm, dry and stubbornly optimistic.
- Genuinely happy somebody has moved into the old house.
- Remembers when the village was lively without becoming gloomy or sentimental.
- Hopes people might return someday.

Linus knows the place, but is not an exposition machine. **He never tells the player that chores cause the village to grow or residents to return.**

During the first meeting he asks **“Vad heter du?”** and the child enters their name. This is the first small act of ownership.

Linus's emotional writing is restrained. He rarely names his feelings. Emotion comes through concrete observations, remembered places, pauses and understated actions. This lets him be deeply affected by the village returning without becoming soft or sentimental.

## 4. The puppy

Because so few people remain, Linus has been looking after a puppy. It needs more walking than his knee appreciates, so during the introduction he offers it to the child. The child names it.

The puppy is a companion, not an XP machine. It follows naturally, never blocks pathfinding and provides attachment/life rather than another visible meter.

## 5. The first quest

After Linus and the puppy, the game leads naturally to the first real-world quest: **Bädda sängen**.

The intended loop is:

**Quest appears → child performs it in real life → child marks complete → adult reviews → adult approves → immediate reward → something happens in the village.**

Current prototype reward:
- 5 diamonds
- 10 SysselBux

Hidden progression contribution:
- **Ordning & miljö: 70%**
- **Välmående & rutiner: 30%**

These weights are never shown to the child.

## 6. The first piece of magic

After approval, a truck arrives with materials. The child has done something mundane in reality and something tangible has changed in the village.

**real task → submission → adult approval → reward → truck/material delivery → visible world change**

The child should begin wondering: *What is going to happen if I do another quest?*

After the truck leaves, the experience must no longer dead-end. Linus reacts in-world to the delivery, and that conversation reveals the first construction stage of the **recycling center**. This turns the delivery from an ending into the beginning of village progression.

The exact locked Linus dialogue and staging live in `docs/POST_DELIVERY_PROGRESSION.md`.

## 7. Hidden progression and village growth

Five underlying progression classes:
1. Ordning & miljö
2. Kunskap & skapande
3. Välmående & rutiner
4. Rörelse & aktivitet
5. Gemenskap

The child experiences consequences rather than mathematics: construction, materials, environmental improvements, repaired places, new residents and new interactions.

The village is the progression screen.

### First construction arc

The **recycling center is the first major building project**. For onboarding, its four produced visual stages map to four approved real-world contributions total, including `Bädda sängen` as the contribution that causes delivery/stage 1.

This four-contribution pace is a deliberate **first-project calibration**, not a universal law for later buildings. Do not expose 1/4, percentages or XP costs. Each approved contribution makes the building itself visibly advance.

The full interaction/persistence design is specified in `docs/POST_DELIVERY_PROGRESSION.md`.

When stage 4 completes, the recycling center becomes a real interactable place. Linus names his old friend Henning and hints, in characteristically understated fashion, that he may “råka ringa honom.” The bakery location remains hidden.

## 8. First new resident: Henning

**Henning is the first new resident to arrive after the recycling center's opening construction arc.** He is a baker and an old friend of Linus.

Henning is a respectful homage to the user's late grandfather, so he is treated with warmth and dignity rather than used as a disposable joke character.

### Core personality — LOCKED

Henning is warm, sociable and genuinely good at what he does. He likes people and brings an immediate human warmth that contrasts with Linus's dry restraint.

He also has a recurring appetite for **wild schemes and improbable experiments**. These are a durable part of his character and should occasionally produce surprising world events throughout the game.

The governing writing rule is:

> **Henning does not do crazy things because he is foolish. He does them because a perfectly reasonable thought continues about three steps farther than it should.**

His schemes must therefore have an internal logic. Henning is competent, especially as a baker. Never turn him into the village idiot or a generic comic-relief NPC.

Sometimes an experiment should fail spectacularly. Sometimes it should work brilliantly. The latter is essential: other residents, especially Sol, should occasionally have to admit that an apparently absurd Henning idea actually solved a real problem.

Candidate tonal examples, not mandatory future scenes:
- testing how far the smell of fresh bread carries and somehow ending up on the bakery roof;
- attempting an absurdly large cinnamon bun simply because he needs to know whether it can be baked;
- constructing an unnecessarily ambitious bread-delivery contraption;
- solving an ordinary village problem through a method everyone else initially considers ridiculous.

Do not make every Henning appearance an escapade. His schemes work because they interrupt a baseline of warmth, competence and ordinary village life.

### Henning and Linus

Their old friendship should be visible without explanatory speeches. They know each other's habits and can puncture each other's pretensions. Henning can reveal sides of Linus the child has not seen because he knew him before the player's family arrived.

Candidate relationship tone:

**Henning:** “Du ringde.”

**Linus:** “Det händer ibland.”

**Henning:** “Du sa att det började hända saker här.”

**Linus:** “Jag överdrev tydligen inte.”

Henning's arrival proves something larger than construction materials: **people can come back.**

The story order is:

**recycling center completed → Linus names old friend Henning → later arrival cue → Henning arrives as a person → Henning gives the bakery a human reason to exist → bakery becomes the second major construction arc.**

Henning should have a life and motivation outside being “the bakery unlock.” A strong direction is that he has wanted a place of his own to bake for people, while Linus has previously tried to tempt him to the village. Henning chooses to come while the village is still tiny because he sees that something has begun, not because a progression meter summoned him.

Do not simply pop Henning into existence beside a pre-completed bakery. His arrival is a story event. Exact arrival staging and bakery pacing remain open until the recycling arc has been physically played.

## 9. Second new resident: Sol

**Sol arrives after Henning.** She is a young, newly graduated female doctor, conceptually mid-to-late twenties.

- Competent.
- Warm.
- Enthusiastic.
- Organized and somewhat ambitious.
- New to professional life, but never portrayed as incompetent simply because she is young/newly graduated.

Sol should contrast with both men. Henning carries warmth and impulsive invention; Linus carries memory and restraint; **Sol carries forward motion**. A promising character direction is that she actively chooses the growing village rather than merely being assigned or accidentally ending up there.

She can be practical, energetic and systems-minded without becoming cold. When Henning creates chaos, Sol's instinct is to understand, organize or fix it. Crucially, Henning should occasionally be right, preventing their relationship from collapsing into “responsible woman supervises foolish man.”

Sol broadens the cast and later provides a natural connection back to Linus through his knee/cane situation. That relationship develops through village life rather than exposition in her introduction.

Candidate tonal exchange, not locked scene:

**Sol:** “Hur länge har du haft ont i det där knät?”

**Linus:** “Inte särskilt länge.”

**Henning:** “Tolv år.”

**Linus:** “Ingen frågade dig.”

The emerging ensemble shorthand is useful but not literal dialogue direction:
- **Linus: the village's memory.**
- **Henning: the village's heart.**
- **Sol: the village's future.**

## 10. World structure and resident order

Sysselcraft uses **multiple connected world areas**, not one endlessly expanding mega-map and not a level-select teleport menu. New areas are reached through physical world exits/transitions.

The opening area's four major building slots are locked:
1. Family house — permanent
2. Recycling center — first construction project
3. Bakery — Henning's project
4. Clinic — Sol's project

**Building #5 motivates expansion into the next connected area.** Do not squeeze it into the opening composition.

Locked resident order:
1. Linus — original resident
2. Henning — first new resident, baker
3. Sol — second new resident, doctor

Later residents/buildings remain design space.

### Village naming

The older rule “name the village after all five first-tier buildings” is superseded because the opening area now intentionally contains only four major building slots and building #5 opens the next area.

The emotional principle remains canonical: **the village name must be earned, not entered during setup.** The exact new naming milestone is open design space and must be locked only after multi-area progression is better understood.

## 11. Storytelling rules

Sysselcraft is not a dialogue-heavy branching RPG. Narrative comes mostly through short conversations, arrivals/departures, environmental change, construction/restoration, new interactions and resident callbacks.

Avoid explaining every system in dialogue. Avoid turning Linus into a tutorial narrator. His guidance should diminish as the player learns to read the world.

Residents must increasingly have relationships with **each other**, not only wait for the child to click them. Recurring character dynamics, including Henning's schemes, are a way to make the settlement feel alive between progression milestones.

Avoid exposing future residents/buildings aggressively. Discovery is part of the reward.

## 12. Emotional progression

**Arrival** — This place is quiet. Who lives here?

**Belonging** — Linus knows us. I have a puppy. This is our house.

**Cause and effect** — I did something in real life and something happened here.

**Curiosity** — What happens if I keep going?

**Construction** — The change is accumulating into a real place.

**Return of life** — The first project is finished. Someone new arrives.

**Community** — Residents begin having relationships with one another, not only with the player.

**Expansion** — The opening area fills naturally and the world opens outward.

**Ownership** — This is no longer merely the village we moved into. We helped make it what it is.

The stakes remain intimate: caring for yourself, your home, other people and a community.

## 13. Current narrative boundary

Canonical now:
- opening, Linus and puppy;
- first quest `Bädda sängen`;
- first truck/material event;
- locked post-delivery Linus bridge;
- recycling center as first project;
- four approved contributions total for first recycling onboarding arc;
- recycling completion before Henning;
- Henning as first new resident, Linus's old friend and baker;
- Henning's recurring internally-logical wild schemes as a core character trait;
- Sol after Henning and clinic as her project;
- multi-area world structure and four-building opening-area capacity;
- village naming is earned, but its old five-building trigger is superseded.

Still open until deliberately tested/discussed:
- final copy/content of recycling quests 2–4;
- exact Henning arrival scene/timing;
- bakery quest count/thresholds;
- exact requirements/arrival scene for Sol;
- exact new village-naming milestone;
- identities/professions/order of later residents;
- building #5 and next-area composition;
- detailed endgame.

Build outward only when the preceding part works and feels rewarding.

---

### Document role

This is the canonical story/world design document. `NOVA_HANDOFF_MANIFEST.md` summarizes continuity; implementation architecture belongs in `TECHNICAL_HANDOFF.md`; detailed first-project behavior lives in `POST_DELIVERY_PROGRESSION.md`.
