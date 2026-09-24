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

Do not simply pop Henning into existence beside a pre-completed bakery. His arrival is a story event.

### Henning arrival scene — LOCKED

After the recycling center is completed and Linus has already mentioned his old friend, Henning's first appearance is deliberately simple: **the child later finds Henning together with Linus**. The arrival does not need a vehicle, cinematic entrance or spectacle. The surprise is that there is suddenly another person in the quiet village.

The first beat belongs to Linus and Henning before it belongs to the player. Their opening exchange must make it unmistakable, without an exposition dump, that they are **old friends who are genuinely happy to see each other again**. Their familiarity should show through shorthand, teasing, remembered habits and the ease of people who already know one another. Linus may remain emotionally restrained, but the reunion must still feel warm.

The scene then turns toward the child. Henning's decision to come must be connected to what has started happening in the village: Linus told him that things were changing, Henning saw enough to believe him, and the completed recycling center / renewed activity is evidence. The writing should **clearly imply that the child's real-world quest work is the reason this change happened and therefore part of why Henning chose to move here**, while preserving the core mystery. Neither Linus nor Henning should explain the hidden progression system, say that chores magically summon residents, mention XP, or expose game mechanics.

The emotional causal chain is:

**child does real quests → village visibly begins living again → Linus notices and contacts Henning → Henning believes something has truly changed → Henning chooses to come → the child discovers that their actions can bring people back.**

Henning is introduced as a person and old friend first. Bakery comes after his introduction and gains its narrative reason from Henning rather than functioning as the device that summons him.

Bakery quest count/thresholds and the exact later transition from Henning's introduction into the bakery construction arc remain open product decisions.

### Illustrated Story Moments — LOCKED

Major irreversible village milestones may use a **static illustrated Story Moment** rather than an animated cutscene. This is now part of SysselCraft's narrative language.

A Story Moment:
- temporarily pauses normal world input;
- presents one high-quality static illustration of the milestone;
- advances a short dialogue over/with the illustration;
- persists completion before returning control, so restart cannot replay a completed moment;
- returns to the ordinary playable village with the milestone now physically true in the world.

This device is deliberately rare. It is for major changes such as a new resident arriving, not routine NPC conversations or quest turn-ins. The illustration must support the existing storybook art direction rather than introducing a separate cinematic visual identity.

**Henning's arrival is the first Story Moment.** The illustration depicts Linus and Henning reunited in the village. The dialogue begins with their old friendship and happiness at seeing one another again, then turns to the child and implies that the child's work made the village lively enough for Henning to believe Linus and move back. When the Story Moment closes, Henning must exist persistently as a resident in the playable world.

## 8.1 Bakery story arc — LOCKED 2026-09-23

The Bakery is **Henning and the child's shared project**, not a construction project that happens around the child.

Canonical causal rule for resident projects:

**The resident brings the dream, personality and personal reason. The child's real-world actions make the dream possible. Together they change the village.**

The child must therefore be an active participant in milestone conversations. Residents should notice and name the change the child has caused without exposing XP, thresholds or game mechanics. The emotional target is that the child can look at a restored building and think: **“That happened because I did things.”**

For the Bakery arc:
- Henning first realizes what is missing and tells the child about the old bakery.
- He explicitly says that seeing what the child has already done for the village made him believe restoration could be possible.
- The child asks whether **they** can rebuild it; Henning welcomes the partnership.
- Intermediate construction beats include the child's reactions and Henning's recognition of the child's continued contribution.
- Henning's personal arc moves from returning mainly to see Linus toward daring to become a baker here again.
- The finished Bakery is a major emotional payoff and becomes an Illustrated Story Moment rather than merely another construction popup.
- The completion dialogue is locked around the child's ownership of the result: the child says **“Vi gjorde det!”**, Henning agrees, Linus lightly teases Henning, and Henning explicitly tells the child that the Bakery exists because the child made the village feel alive again. The scene closes by turning toward what they will bake first, so completion feels like the beginning of village life rather than a trophy screen.
- Completion is a persistent construction story beat. It may trigger only after Bakery stage 4 is committed, and once completed it must not replay automatically after restart.
- The final beat must frame the result as something Henning and the child achieved together, while making clear that the child's actions are what made Henning willing and able to begin again.
- **Bakery construction cost is locked at 10 real completed contributions total, distributed 1–2–4–3 across stages 1–4.** Cumulative thresholds are therefore **1, 3, 7 and 10** authoritative contributions after the Bakery arc begins. Stage 1 gives immediate visible response after the first contribution; stage 3 carries the largest sustained effort; the final three-contribution push leads into the completed Bakery and Story Moment. A contribution counts only after the authoritative quest lifecycle has reached child turn-in/claim, so approval alone does not advance construction.
- Recycling remains the compact onboarding arc at four contributions total. Later major building projects should generally require more sustained effort than Bakery, but their exact costs remain open product decisions.

This principle should carry forward to later resident projects, including Sol's clinic, while each resident retains a distinct motivation and story.

## 8.2 Mira and the general store — LOCKED 2026-09-23

The village economy gains its first spending place **after the Bakery and before Sol/Clinic**.

Locked causal order:

**Recycling → Henning → Bakery → Mira + lanthandeln → Sol + Clinic**

The old lanthandel is physically present in the opening village from day one as a badly ruined, closed landmark. It is not a four-stage construction project. After the Bakery is completed, the smell of Henning's fresh bread draws Mira into the village. Her arrival uses two Illustrated Story Moments: first she arrives at the Bakery while the ruined lanthandel is only subtly visible in the background; then Mira discovers the old shop with the child and dog.

Mira is self-made, practically skilled, charming and unafraid of physical work. She sees the ruined building as something repairable, promises to restore it herself, and the shop transformation is deliberately a **single-step state change: abandoned → restored/open**. This contrasts with the child's long shared Bakery construction arc and shows that the village now has enough momentum for residents to create change of their own.

Once Mira's arrival story is persistently completed, the world swaps the ruined lanthandel asset for the restored/open asset. The restored building is a real world interaction: the child walks to it and enters the shop interaction rather than opening a detached global shop button.

The shop is the canonical sink for quest-earned SysselBux and Diamonds. Backend wallet authority remains unchanged. Exact first inventory, prices, ownership/inventory representation and purchase transaction are product decisions that must be locked before real spending is enabled; the client must never silently deduct the separate local prototype wallet.

## 9. Second new resident: Sol

**Sol arrives after Henning and after Mira has reopened the lanthandel.** She is a young, newly graduated female doctor, conceptually mid-to-late twenties.

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


### Linus visual canon for Story Moments — LOCKED 2026-09-22

The approved first-meeting illustration establishes Linus's close-up Story Moment appearance:
- middle-aged/older adult but **not very old**;
- slim build;
- clean-shaven;
- completely bald on the crown/top of the head, with sparse **red-blond** hair remaining around the sides/back;
- worn blue worker coveralls;
- work boots;
- hearing protectors/headset with an integrated boom microphone resting around his neck;
- warm, approachable expression.

For player-identification, the child should normally be shown from behind or over the shoulder in Story Moment illustrations. Avoid defining the child's face unless a later product decision explicitly requires it.

The approved first-meeting composition is a warm, emotional village introduction: child foreground/back to camera, Linus seated/leaning near his workshop and welcoming the child, with the village opening behind him. The canonical first-meeting runtime asset is `public/assets/village/story-moments/linus-first-meeting.png`, composed for the game's landscape Story Moment presentation.


## 14. Illustrated Story Moments — LOCKED 2026-09-22

Major irreversible village milestones may use **Illustrated Story Moments**: rare, interactive picture-book sequences inside the game rather than conventional animated cutscenes.

Locked presentation language:
- normal world play pauses while the Story Moment is active;
- one high-quality static landscape illustration fills the game view;
- short stepwise dialogue is presented in a visibly translucent, lightly blurred panel so the illustration remains part of the scene;
- a Story Moment may contain **multiple illustrations** and switch image at a meaningful narrative beat rather than remaining a single splash image;
- when the moment closes, play returns to the ordinary village and the milestone must be physically true in the world;
- completed milestone moments must not replay accidentally after restart;
- use Story Moments deliberately and rarely for major emotional/world-state changes, not routine quest or NPC interactions.

The first physically verified Story Moment is the child's first meeting with Linus. It establishes the reusable visual grammar:
1. `public/assets/village/story-moments/linus-first-meeting.png` opens the meeting.
2. At the puppy reveal, the illustration changes to `public/assets/village/story-moments/linus-puppy-handover.png`, showing Linus handing the puppy to the child.
3. Dialogue continues over the second image through the puppy part of the introduction.

This two-image sequence was physically verified on iPhone on 2026-09-22, including the image transition and translucent dialogue treatment. The result is the target feel: an **interactive illustrated storybook embedded in SysselCraft**, preserving rich narrative presentation without requiring animated cinematics.

### Dialogue nameplates — LOCKED 2026-09-22

The nameplate treatment used by the first Linus meeting is the canonical dialogue pattern for **all dialogue in SysselCraft**:
- the active speaker's nameplate lives in the normal dialogue-card flow, directly above the spoken line;
- do not position nameplates independently over the illustration or against screen coordinates;
- speaker identity may use a consistent character color while preserving the shared layout;
- current locked character colors are **Linus blue**, **Henning green**, and **the child orange**;
- new characters should receive a distinct, readable character color when introduced, while using the same shared nameplate geometry and placement.

This rule applies to Story Moments and ordinary in-world dialogue so speaker identification remains visually consistent throughout the game.

The first-meeting and later Henning-arrival moments form an intentional visual bookend:
- opening: the child enters a quiet village and meets Linus;
- later: after the child's real-world quest work has visibly brought life back, the child finds Linus reunited with Henning.

Henning's arrival is the next major Story Moment candidate and should use the same presentation language while receiving its own illustrations and narrative beats.


## 15. Mira shop economy semantics — LOCKED 2026-09-24

Mira's restored lanthandel supports two deliberately different reward economies:

- **SysselBux** buy cosmetic/digital things that exist inside SysselCraft: clothing, dog items, gifts to residents and other game-visible effects. The first concrete SysselBux inventory is still open design space and must not be invented merely to populate the shop.
- **Diamonds** buy real-life rewards defined and fulfilled by the parent. Examples include an ice cream for 1 💎 or one hour of Nintendo Switch for 5 💎. These examples establish the product model, not a mandatory global catalog.

The parent owns the Diamond catalog: create, edit, pause/archive and fulfill reward entries. The child sees currently active entries in Mira's physical shop. A Diamond purchase is an authoritative transaction: verify balance, deduct exactly once and create a redemption carrying a snapshot of the purchased reward/price. Fulfillment happens later in the parent surface and redemption history remains retained. Never implement Diamond spending as a local client-side subtraction.

This split preserves the fiction cleanly: SysselBux deepen the game world; Diamonds let effort in the game become a parent-agreed real-world privilege or treat. Mira is the in-world bridge for both, without making her the authority over the household economy.


## 16. Current Mira/Diamond implementation boundary — 2026-09-24

The locked economy semantics above are now represented by the current implementation for the Diamond side: parents can define IRL rewards and the child can purchase active rewards through Mira's physical shop using backend-authoritative Diamonds. Redemption fulfillment remains a parent responsibility and history is retained.

This is implementation status, not a change to the fiction or economy design. The first concrete SysselBux catalog remains deliberately open design space. Do not invent SysselBux stock merely to make the shop look fuller.

The Diamond slice has passed backend transactional/authorization testing but is not yet physically accepted end-to-end on the paired iPhone. Do not narratively or technically treat the reward shop as a completed player-facing milestone until that real journey passes.
