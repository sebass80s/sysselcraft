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

This four-contribution pace is a deliberate **first-project calibration**, not a universal law for later buildings. Do not expose 1/4, percentages or XP costs. Each claimed/turned-in contribution makes the building itself visibly advance; parent approval alone does not advance construction.

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

The shop is the canonical sink for quest-earned SysselBux and Diamonds. Backend wallet authority remains unchanged. The first implemented inventory is split by currency: parent-defined IRL Diamond rewards use the authoritative Diamond redemption flow, while the narrative flaskpost is the first locked SysselBux purchase at 100 SysselBux. Further SysselBux inventory remains open design space. The client must never silently deduct the separate local prototype wallet.

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

### Sol arrival arc — LOCKED 2026-09-24

Sol's arrival is triggered through the first narrative SysselBux purchase in Mira's shop, not through another anonymous quest threshold. After Mira's lanthandel is open, the child can buy a **flaskpost** item for SysselBux. Its locked implementation price is **100 SysselBux**. Because this purchase gates main-story progression, future economy tuning must preserve accessibility or deliberately revise the gate.

The purchase does not directly unlock Sol as if she were a shop reward. It creates a physical world interaction at the waterfront. The child goes to the pier/water with the dog and sends the bottle out into the world. This is an **Illustrated Story Moment** and should use a dedicated image showing the child from the established non-specific/back-facing perspective throwing the bottle into the water. The emotional beat is curiosity rather than explanation: the child does not know who will find it.

The message is simple and childlike: it tells an unknown reader that the small village is coming alive again, mentions the people who now live there, and invites whoever finds it to visit. Exact dialogue may be polished in implementation, but it must not explicitly ask for a doctor or reveal Sol in advance.

Sol is newly graduated and was originally travelling elsewhere. She has taken a wrong route, but this is an ordinary navigation mistake and must not portray her as helpless or incompetent. While finding her way again she discovers the child's bottle and becomes curious enough to follow the invitation back toward the village.

The existing **`public/assets/village/story-moments/sol-arrival.png`** is the second Illustrated Story Moment. It depicts Sol with travelling bag, doctor's clothes and stethoscope meeting the child and dog at the harbour. The scene is therefore canonically their **first meeting**, not merely a generic portrait of her arrival.

The dramatic sequence is locked as:

**Bakery complete → Mira arrives → lanthandeln opens → child earns/spends SysselBux on flaskpost → child sends bottle from the waterfront → Sol finds it while travelling → Sol follows it to the village → first meeting at the harbour → Sol explores the village → Sol chooses to stay → Clinic project begins.**

At the harbour, Sol can reveal that she is newly qualified as a doctor. The child naturally observes that the village has no doctor. Sol does **not** immediately announce that she is moving in. She was headed elsewhere and initially decides to look around. Seeing the revived Bakery, Mira's reopened shop and the growing community gives her a reason to choose the village herself. This preserves the core character rule that **Sol carries forward motion**: chance brings her the letter, but staying is her own decision.

The clinic is discovered/introduced only after this first meeting and brief exploration beat. Sol's decision to build a life and clinic here should feel like the consequence of what the child has helped create, not a pre-scripted assignment. Her later relationship with Linus's knee/cane and her contrast with Henning remain post-introduction village-life material rather than exposition during arrival.

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


## LOCKED — Sol chooses the village: playable tour → Clinic

**Status: LOCKED 2026-09-24.** This is the canonical continuation immediately after Sol's harbor arrival and her line that she wants to look around first.

### Design intent
Sol must not move in merely because the story needs a doctor. Her defining introduction is that she discovers the recovering village, sees that she can matter there, and **chooses it herself**. This chapter should be a short playable breather after the Flaskpost sequence, not another household-quest gate and not a checklist-heavy quest chain.

### Canonical flow
1. **Harbor handoff.** After the existing arrival scene, control returns to the child. Sol becomes a real runtime NPC at/near the harbor. Talking to her starts the invitation to show her around the village.
2. **Playable village tour.** The child and dog show Sol around. Target length is roughly 3–5 minutes of story/gameplay. Use three natural village stops rather than three separate formal quests. The current intended anchors are the Bakery/Henning, Mira's lanthandel, and a central/community/Linus beat. Each stop should use only a small amount of dialogue and let the restored world itself do the storytelling.
3. **Plant the need, do not manufacture an emergency.** During the later tour beat, Linus may casually reveal his knee/cane issue and brush it off. Sol reacts competently and professionally. This gives the child a natural opportunity to reiterate that the village has no doctor. Linus is not to be portrayed as helpless or used for melodramatic medical jeopardy.
4. **Sol decides.** After the tour, Sol reaches the conclusion herself. Canonical emotional shape: she meant only to visit; she can see that the villagers are building something worthwhile; the village genuinely lacks a doctor; she decides she wants to stay. The exact final copy may be polished in implementation, but the decision must remain Sol's.
5. **Only then reveal the Clinic project.** Linus can know of an old building/place suitable for a surgery/clinic. The story reveals the run-down Clinic stage 1 and starts the next main progression goal: build the Clinic for Sol.
6. **Clinic returns to the core SysselCraft loop.** Unlike the short tour, Clinic construction is real progression: household quests contribute to materials/progress, the four existing Clinic construction stages advance visibly, and completion establishes Sol as the village doctor/resident.

### Character/dramaturgy distinction
- **Henning needs the village.**
- **Mira arrives when the village has become viable again.**
- **Sol finds the village by chance, discovers its people and purpose, and chooses it.**

That distinction is important. Do not collapse Sol's arrival, decision and Clinic unlock into one dialogue sequence.

### Implementation boundaries
- The tour itself must **not** require new household quests.
- It should feel like walking through and experiencing the world, not completing three UI checklist items.
- Sol needs a proper runtime NPC presentation before this chapter is physically accepted. Preserve the established runtime-art rules: transparent character asset, correct proportions, uniform scaling only, and physical iPhone validation.
- The existing Clinic stage assets are the canonical visual construction progression.
- Exact Clinic quest-count/material pacing remains an implementation/progression decision unless separately locked elsewhere.


### LOCKED simplification — no follower AI (2026-09-24)
The tour uses **player travel + story hotspots/cutscenes**, not follower AI. After the harbor arrival, the child moves through the village normally. A discreet story interaction appears at the next canonical stop; tapping it triggers the short Sol scene for that location, then advances the story target to the next stop. Current order: **Bakery → Mira's lanthandel → Linus/central village → Sol's decision → Clinic reveal**. Sol may be presented at the active/last story location as needed for world continuity, but she must not pathfind behind the child. The first two location beats should primarily use the game world and normal dialogue UI; reserve a larger Illustrated Story Moment for Sol's decision to stay if produced. This replaces any earlier follower-mechanic wording.


### LOCKED Clinic construction pacing — 2026-09-24
Clinic construction reuses the existing authoritative unified `worldProgression`; it does **not** introduce clinic materials, a second construction currency, or a parallel quest type.

When Sol chooses to stay and the Clinic project is revealed, persist that child's current authoritative `worldProgression` as the **Clinic baseline**. Only approvals earned after that moment count toward Clinic construction, so earlier household work is preserved as history but cannot instantly complete a newly unlocked building.

Canonical Clinic pacing from that baseline:
- **+0 approvals:** Clinic stage 1 is revealed (old/run-down building).
- **+2 approvals:** stage 2.
- **+4 approvals:** stage 3.
- **+8 approvals:** stage 4, Clinic complete and Sol established as the village doctor/resident.

Each approved backend quest may advance unified world progression exactly once under the existing Quest System v2 idempotency rules. Clinic stage derivation must therefore be based on authoritative progression delta from the stored baseline and must never award, replay or fabricate quest progress client-side.

Short Sol milestone reactions are preferred over additional large cutscenes during construction. Current intended emotional beats are: stage 1, the building needs work; stage 2, Sol can begin to picture the Clinic; stage 3, opening is close; stage 4, completion celebration. Exact dialogue copy may be polished during implementation without changing the progression thresholds.


## TODO — resident idle dialogue pools (locked 2026-09-24)

Parked for a later village-life polish pass.

- Tapping an established resident when no higher-priority story interaction is active should open a lightweight idle conversation.
- Give each resident their own expandable dialogue pool and distinct voice.
- Randomize among eligible idle dialogue entries and avoid immediate repetition where practical.
- Pools must have **no fixed content-size limit**; they are designed to grow freely over time.
- Support progression/world-state-specific entries so residents can react to construction, new arrivals, completed buildings and other village changes.
- Story beats, quest interactions and other authored progression interactions always take priority over idle dialogue.


## 2026-09-25 world attention language

Locked presentation grammar: question mark means a new quest is available to accept; exclamation mark means an approved/completed quest is ready to turn in; speech bubble means authored story/dialogue attention; no marker means ordinary optional interaction. Linus uses a speech bubble at the very start of a fresh game to invite onboarding, and that behavior is browser-verified.


## Post-Clinic bridge toward Act 2 — 2026-09-26

The Clinic completion now ends with a deliberate continuing-play handoff rather than a generic placeholder. Linus explicitly frames the restored village as unfinished, points to empty places and future residents who do not yet know the village exists, and tells the child to keep helping with household quests while the village becomes ready for its next build. Sol supports the forward-looking beat. This preserves the recurring quest loop as meaningful play after the current authored story ends without inventing the identity of the next resident/building. The exact Act 2 trigger and next resident remain future design work.


## LOCKED world/act expansion grammar — 2026-09-26

Future acts may expand beyond the restored village by opening authored exits into new outdoor areas. The child reaches a diegetic transition point such as a road, bridge, path or harbour; activating/crossing it changes to the next area's map and places the child at the corresponding entrance. Returning through that entrance restores the previous area at its matching spawn point. This is the canonical narrative grammar for geographic expansion and avoids turning the village into one indefinitely enlarged map.

Each new outdoor act/area may therefore establish a strongly distinct setting with its own painted background, residents, landmarks, quests and story beats while global progression follows the child between areas. Locked buildings/paths may visibly open through story progression to reveal later areas.

Interiors are a separate presentation grammar. The child's house, Mira's shop and comparable indoor spaces should be presented as fullscreen illustrated scenes with interaction hotspots, in the same family as Story Moments, rather than as additional avatar-navigation maps.

### Child house and SysselBux loop
The child's house is intended to become the first persistent personal interior and a meaningful SysselBux sink. Entering the house opens a fullscreen illustrated room. A first implementation should favor a small set of fixed decoration hotspots/slots over freeform furniture placement. Items bought with SysselBux can unlock owned visual variants for those slots, allowing the child to personalize the room without making ordinary village/story progression depend on spending currency. Quest work changes the shared world; spending SysselBux can express the child's choices inside their personal space.


## LOCKED Act 2 foundation — the lake summer place (2026-09-26)

Act 2 moves the authored adventure from the restored village down to the **lake**, a location already foreshadowed by the bottle-message/Sol story. The lake is a persistent second outdoor area reached through the canonical area-transition system, not an enlargement of the village map.

### Cast principle
Act 2 should deepen the stories and relationships of the established cast rather than replace them with a large new ensemble. The intended major addition is **one new child character**, giving the player their first important peer relationship instead of another adult service-provider/resident. A second new major resident is not currently planned and should require a later explicit story decision.

### The child's connection to the lake
The new boy's family used to have a **summer cottage by the lake**, with its own jetty, boathouse and old motorboat. The family stopped spending summers there as the surrounding area emptied and the property fell into disrepair. The family is not defined by tragedy or loss: they moved on, and the summer place simply became impractical and neglected.

The boy wants to restore the place so his family will **want and be able to spend summers there again**. He returns to the old summer place and meets the player there. His motivation is personal and age-appropriate; he is not a child mechanic. The player, existing residents and household-quest progression provide the practical restoration momentum while friendship with the boy develops through the act.

### Act 2 restoration spine — UPDATED/LOCKED 2026-09-28
The lake area is restored through several visible projects rather than one long boat repair.

The first three restoration projects are available as **player-chosen independent tracks**:
- **Summer cottage** — make the family place usable.
- **Jetty** — restore safe/useful access to the water.
- **Boathouse** — restore the family's lakeside workspace/storage.

The player chooses which of these three to restore first, then chooses between the two remaining projects, then completes the last one. Their stories and dialogue must remain **self-contained and order-independent**. Do not create alternate dialogue branches, prerequisites or narrative variants based on which of the three was completed first. The meaningful choice is which part of the lake place the child wants to bring to life next, not a branching-story matrix.

The **motorboat is visible from the beginning but locked as a restoration project until all three buildings are complete**. Completion state therefore converges cleanly:

**0/3 → 1/3 → 2/3 → 3/3 → motorboat unlocks → Act 2 final restoration → Act 3 bridge.**

Exact quest counts, construction-stage thresholds and individual subquests remain deliberately unlocked until Act 2 production design. Each project should have visible progression so repeated household quests create several meaningful transformation milestones rather than feeling like repeated work on one object.

### Lake-life world response — LOCKED 2026-09-28

Completing a lake project must do more than replace its construction sprite. Each completed project may independently unlock persistent, non-branching changes elsewhere in SysselCraft. These reactions key off the completed project's world state and must not depend on restoration order.

Examples of the intended grammar:
- a completed **summer cottage** can unlock cottage furnishings/decorations or related goods in Mira's shop;
- a completed **jetty** can unlock lake/bathing/fishing-themed goods and lake activities;
- a completed **boathouse** can unlock workshop/boat-related goods or activities;
- completing all three unlocks the **motorboat restoration finale**.

Mira's shop is an important example, not the only allowed response. New quest templates, activities, optional interactions, items and environmental details may also become available when a project is complete. These additions should remain modular so adding one does not create cross-project dialogue dependencies.

### Established residents at the lake — LOCKED 2026-09-28

Act 2 must keep the Act 1 cast alive as residents rather than leaving them standing indefinitely at their old village positions. As the lake restoration progresses, **Linus, Henning, Mira, Sol and other established residents can begin spending time at the lake and using what the child has restored**.

The social transformation should be visible:
- before restoration, the lake summer place feels neglected and quiet;
- as projects complete, residents increasingly visit and use the area;
- when the **jetty is complete**, residents may be at the lake swimming, sitting by/on the jetty or otherwise enjoying the water;
- when the **cottage is complete**, residents may gather around/use the cottage as a social place;
- when the **boathouse is complete**, residents may create activity around the boathouse/work area;
- at **3/3**, the lake should read as a lively summer gathering place for the village before the motorboat finale begins.

This is world-state reactivity, not branching narrative. Resident lake presence and ambient activities should be eligible from simple completion flags and should not require dialogue variants for every possible project order. Residents do not need to be permanently removed from their village roles; authored placement/availability can present them where they make sense while preserving required interactions such as Mira's shop.

The emotional design target is: **the child is not merely repairing three objects; the child is creating a place where the village wants to spend time.**

### Emotional payoff and Act 3 bridge
By the end of Act 2 the cottage, jetty, boathouse and motorboat have been restored. The boy's family returns to the summer place, validating his reason for undertaking the restoration; they may be presented in an illustrated Story Moment rather than requiring full runtime NPC implementations. The boy remains an important recurring peer character who can naturally move between the lake and village stories.

The repaired motorboat is also the deliberate bridge to **Act 3**. The boy remembers that his family used to travel across the lake and knows or partially remembers that there is something on the other side. Act 2 ends with the lake home restored and the boat capable of taking the children onward. The exact destination/content of Act 3 remains intentionally undefined.


## ACT BOUNDARY LOCK — 2026-09-27

**Act 1 is complete and includes the entire Sol/Clinic arc.** The restored village arc comprises Linus/puppy, Recycling, Henning/Bakery, Mira/lanthandel, Flaskpost, Sol's arrival/tour/decision, Clinic construction and Clinic finale, plus the implemented village-life customization loops such as the dog home and child's room. Earlier wording that calls Clinic/Sol a bridge *toward* Act 2 should be read only as historical implementation chronology, not as the act boundary.

**Act 2 starts when authored play moves to the lake summer place.** Sol is not an Act 2 prerequisite, unfinished bridge, or opening Act 2 task. Preserve her completed Act 1 implementation unless a concrete regression is found.


## Act 2 opening, Alve and project-selection UX — LOCKED 2026-09-28

### Foreshadowing and arrival
Late in Act 1, Adam and Linus encounter or establish an old, almost overgrown sign at the forest edge: **“SJÖN →”**. Linus briefly explains that the old path leads to a lake where people from the village used to spend summers, but that nobody seems to use the place anymore. This is story planting only: no quest marker and no immediate Act 2 continuation.

When Act 2 begins, the dog suddenly runs toward that old forest path. Adam recognizes the place and follows. The journey through the forest is a **cutscene/Story Moment sequence, not a playable forest map**: the path becomes increasingly dense and child-adventure eerie, then light returns, the dog reaches the opening first and Adam follows into the large lake reveal. Gameplay then begins on the lake area.

### First encounter with Alve
The lake initially appears abandoned. A **bicycle leaning against a tree** is the first strong clue that somebody is there. Adam then discovers a boy trying to repair the summer cottage himself. The boy arrived by another route, brought some tools and has already discovered that the job is much larger than he expected.

The boy's dialogue nameplate initially reads **“Barnet”**. Adam and the boy must actually introduce themselves. At the moment the boy says his name, the nameplate changes permanently from **Barnet → Alve**.

Alve is a little wild but kind: energetic, impulsive, practical, warm-hearted and inclined to act before checking whether his plan is realistic. He is not destructive or mean. His family has had a difficult period, deliberately left unspecified. He remembers the cottage/lake as a place where his family used to have good summers together, and he came to repair it in the hope that they might want to return.

Adam is the one who offers that they might fix the place together. Alve then asks what they should begin with.

### Project-selection Story Moment — LOCKED
The first restoration choice is presented **inside the cinematic/Story Moment**, not as a detached menu. Three clickable hotspots are active: **Stugan, Bryggan and Båthuset**. Selecting a hotspot only marks/previews that choice; it does not start the project yet. Alve gives a short motivation for the selected object and a confirmation button appears: **“Laga [objekt]”**.

Locked dialogue intent/copy:
- **Bryggan:** “Bryggan är bra. Då kan vi knyta fast båten här sen. Och bada!”
- **Båthuset:** “Båthuset måste vi fixa om vi ska kunna laga båten.”
- **Stugan:** “Stugan... Jag hoppas min familj vill komma hit igen om vi får ordning på den.”

The player may switch between the three hotspots before confirming. Only pressing **“Laga [objekt]”** commits the active project. Alve then confirms the choice with **“Bra val! Vi fixar [objektet] först!”**. “Först” refers only to the player's current choice and does not establish a canonical restoration order.

The motorboat is the visible shared goal but is not one of the three initial selectable projects. The fiction must explain its lock: the cottage, jetty and boathouse restore the place/infrastructure needed before the boat can sensibly be repaired and used. Mechanically, motorboat restoration remains locked until all three independent projects are complete.

### Alve as active-project marker and friend — LOCKED
After a project is chosen, **Alve moves to/appears at the active construction site and visually works there**. This is the primary in-world signal for which restoration project is currently active. The project's own construction sprite also changes through its authored visual stages as progress is made.

Alve is interactable at the active project. Clicking him opens a **short project-specific cutscene/dialogue**. These interactions are not merely quest delivery. They mix:
- comments about the current restoration project and its progress;
- ordinary friend banter, jokes, the dog, the village and shared experiences;
- gradual pieces of Alve's personal story, family memories and why the lake matters to him.

Alve's backstory must be **revealed gradually across Act 2**, not dumped during the first meeting. The game should deliberately leave the exact cause of the family's difficult period unspecified. Instead, Alve opens up through concrete memories and small observations as the friendship develops.

The parallel emotional progression is:
**lake: neglected → restored → alive**
and
**Alve: stranger → building companion → friend → trusts Adam with why the place matters so much**.

When a project is complete, Alve no longer needs to function as its work marker. The restored place can instead gain life through residents and activities enabled by that completion state. The design principle is: **Alve works where the restoration is active; village life appears where restoration is complete.**

Exact quest counts, construction thresholds, individual Alve dialogue pools and detailed resident schedules remain open production decisions.


## Act 2 pacing, SysselBux sinks and whole-village reuse — LOCKED 2026-09-28

### Slow-burn progression
A primary lesson from Act 1 is that major authored content must **not be consumed too quickly**. The four visual states of each Act 2 restoration project do not imply four household quests or one quest per visual step. Major project progression should be deliberately slower, with meaningful events between construction-stage changes.

Exact contribution counts and thresholds remain open until economy/progression balancing, but the target experience is **weeks of living progression rather than a handful of quests completed in a day**. The player should have frequent evidence that effort matters without every reward being another building-stage swap.

Act 2 therefore runs several progression layers in parallel:
- **major restoration progression**: slow movement through the four authored visual states;
- **lake/shore progression**: Alve scenes, worksite details, materials/props, visitors, activities and environmental changes;
- **village progression**: new dialogue, shop stock, building interactions, resident scenes and other consequences back in the Act 1 village.

Project-specific beats follow the currently active restoration track. Global Act 2 beats may react to overall progress/completion state. Neither layer may introduce order-dependent branching among cottage, jetty and boathouse.

### Story-driven SysselBux sinks
Act 2 should integrate **SysselBux into the main story more strongly**. During restoration, Adam and Alve may discover that they need tools, supplies or other concrete items. Some of these needs become story-bound purchases from Mira.

The intended loop is:
**real quests → earn SysselBux → restoration reveals a need → return to village/Mira → buy the needed item → item/dialogue visibly feeds back into the lake project → restoration continues.**

These purchases have an explicit economy purpose: **regularly remove earned SysselBux from circulation so the child does not accumulate an effectively unlimited balance and trivialize later purchases**. They should feel like natural story expenses, not arbitrary toll gates.

Locked safeguards:
- required story purchases must be reasonably affordable from normal quest earnings;
- do not set exact prices until balanced against the real earning rate/economy;
- vary purchase timing rather than imposing a predictable “pay every N quests” pattern;
- optional cosmetic/personal purchases remain valuable choices alongside required story expenses;
- backend wallet authority remains canonical; do not create a parallel local Act 2 currency or client-side deduction path.

### The Act 1 village is Act 2's support network
Act 2 must deliberately reuse **all major restored Act 1 locations**, not only Mira's shop. The village Adam rebuilt becomes the practical/social support network that helps Adam and Alve restore the lake.

Each major location has a distinct reusable role:
- **Återvinningen / Linus:** finding, salvaging and reusing useful materials, fittings, boards, rope, containers or other appropriate supplies.
- **Bageriet / Henning:** food, community, provisions for work at the lake and occasional Henning-style ideas/events that can help or enliven a restoration beat.
- **Sjukhuset / Sol:** care, practical health/safety support and character scenes around minor, age-appropriate mishaps or preparation. Do not manufacture medical emergencies merely to make the Clinic relevant.
- **Lanthandeln / Mira:** new equipment, supplies and story-bound SysselBux purchases.

These are **roles, not rigid fetch-quest templates**. A lake problem may send Adam back into the village for a short authored interaction, then return him to Alve/the active project. Do not force every project through every building, and do not turn the village into a checklist.

This creates the intended Act 2 geography and pacing loop:
**lake restoration ↔ village support ↔ lake restoration**, while ordinary real-world quests continue to power the broader progression.

The narrative payoff is important: Act 1's buildings were not disposable progression trophies. **The world Adam restored in Act 1 becomes the toolkit and community that makes Act 2 possible.**


## Act 2 lake social states, project identities and transport — LOCKED 2026-09-28

### Completed-site ambient life
Completed lake projects unlock **controlled-random ambient social scenes**. Eligible scenes are selected from authored pools when the lake area is entered/loaded and remain stable for the current visit/session; NPCs must not visibly reshuffle or teleport simply because the child moves around. Every pool should include a real chance that nobody is present, so visits feel discovered rather than scheduled.

Ambient scenes may have short optional click dialogue, but they are not required Story Moments and must not gate progression. The pool may grow as more lake projects become complete.

For the completed **jetty**, eligible examples include an empty jetty, Linus + Henning by the water, or Sol + Mira swimming/hanging out. Exact combinations/dialogue pools remain content-production work.

Guiding rule remains: **Alve works where restoration is active; village life appears where restoration is complete.**

### Project identities
The three independent projects must feel different after restoration:
- **Bryggan:** swimming, relaxation, friendship and summer life.
- **Båthuset:** workshop, tools, discoveries, small projects and comic incidents. It establishes a credible place for later motorboat repair. Once complete it may host controlled-random ambient scenes with established residents or Alve and may contain small optional clickable finds/events. It should not merely duplicate the jetty's social-hangout role.
- **Stugan:** the emotional Alve location. Its restoration gradually reveals personal/family memories through objects and concrete details rather than an exposition dump. Candidate devices include an old family photograph, childhood drawing, height marks, old game/toy or other traces of earlier summers. The exact cause of the family's difficult period remains deliberately unspecified.

Completing the cottage does **not** immediately bring Alve's family back. Alve has completed the thing he originally hoped might make them return, but must live with uncertainty while the rest of Act 2 continues.

### Act 2 family payoff
Alve's family returns only at the **end of Act 2**, after the wider lake restoration and motorboat project have naturally allowed significant time to pass.

Locked final reveal structure:
**motorboat complete → quiet aftermath → Adam/Alve notice signs that somebody is inside the restored cottage → because the cottage was established as empty/locked, Alve suspects intruders → they rush to investigate → the people inside are Alve's family.**

The reveal should initially play as an Alve-style “there's someone in the cottage / let's see if they're burglars” discovery rather than announcing the family ceremonially in advance. The family reveal is the emotional payoff for Alve's whole Act 2 arc, not merely the cottage completion reward.

### Alve after Act 2 and the other side of the lake
After the motorboat is restored, **Alve becomes the permanent boat driver/transport character**. Alve + motorboat form the authored transport link from the lake to a future area on the other side and back again.

Produce/use a reusable Story Moment/cinematic scene of **Adam and Alve travelling in the motorboat**. The same visual can carry different dialogue in future story states. The first crossing may later contain Act 3 introduction dialogue; routine later crossings can use shorter contextual dialogue.

Act 2 may subtly seed curiosity about the **other side of the lake**, but the destination itself is explicitly undefined. Hints must remain destination-neutral and still make sense regardless of what Act 3 eventually becomes. Allowed grammar includes vague family memories, traces of old trips, uncertain remarks or unexplained objects. Do not name, depict or promise a specific destination until Act 3 is designed.

Canonical rule: **the mystery exists; the answer is not canon yet.**

## Bryggan restoration arc — LOCKED 2026-09-28

Bryggan uses the canonical **4 + 4 + 4 + 4 = 16 authoritative real-world contributions**. Its identity is bad, vila, kompisar och sommarliv. The arc moves from repairing unsafe timber to making a place people actually want to use. The life-buoy purchase is an intermediate economy/story beat and never substitutes for a contribution.

### Contributions 1–4: the real problem / Linus and Recycling

**1 — Start clearing.** Adam and Alve clear loose debris and damaged boards. Alve initially treats it as an easy plank-replacement job.

**2 — Worse underneath.** More of the old support/timber is rotten than expected. The project now clearly needs sound replacement material rather than cosmetic patching.

**3 — Linus and salvage.** The need sends them naturally to Linus/Återvinningen. Linus helps choose reusable timber/material and comes to the lake with/helping deliver it. His reaction to the old place is brief and restrained: the lake used to matter to the village, but this is not a lore dump.

**4 — First real repair.** Adam and Alve use the salvaged material for the first substantial structural repair. **Bryggan 1/4→2/4.** Salvage can remain visible at the worksite as intermediate feedback.

### Contributions 5–8: make it a bathing place / Sol / life buoy

**5 — The water becomes tempting.** With the worst first section repaired, Alve immediately starts talking about swimming. Adam and Alve clear the approach/edge and discover that making a dock physically stronger is not the same as making the bathing area ready for people.

**6 — Sol inspects.** Sol hears that the children intend to swim and visits in her professional role. She performs a simple, age-appropriate safety check: access into/out of the water and old sharp/rubbish debris around the bathing edge. No injury or manufactured emergency occurs. Sol identifies two jobs: clear the bathing area and add a proper life buoy.

This unlocks the intermediate story/economy chain: **life buoy appears at Mira → Adam buys it with authoritative SysselBux → returns to lake.** Exact price remains open. The purchase is not contribution 7.

**7 — Make Sol's checklist real.** Adam and Alve clear the bathing edge/shoreline and finish the practical safety cleanup. The purchased life buoy is brought to the site and can be staged ready for mounting. Sol need not supervise the work.

**8 — Ready for people.** The life buoy is mounted permanently and the next substantial restoration step is completed. **Bryggan 2/4→3/4.** Alve's focus shifts from “we are fixing a broken dock” to “people can actually be here soon.”

### Contributions 9–12: the lake starts attracting people again

**9 — Prepare the summer end of the dock.** Adam and Alve improve the usable/social part of the jetty: clear remaining clutter and make space to sit, leave towels or climb out after swimming. Keep this as ordinary restoration rather than inventing a new purchased furniture system.

**10 — First visitor.** One established village resident arrives while work is still unfinished and reacts to seeing the place coming back. The visitor should be selected as authored content rather than random ambience at this point. The key story fact is that somebody comes to the lake **because Adam and Alve are restoring it**. This is the first proof that the project is changing village behaviour before completion.

**11 — First proper water break.** Adam and Alve finally take a short break at the usable section of the jetty. This is not the full completed-lake swimming ensemble. It is a small friendship beat: the place they have spent so long repairing can already give them something back. The puppy can remain ashore/nearby as appropriate.

**12 — From worksite toward summer place.** They finish the remaining major mid-stage repair and tidy the social/bathing area. **Bryggan 3/4→4/4 visually**, while final completion still requires the last four contributions. The dock now looks nearly finished and residents can plausibly talk about using it, but the permanent ambient pool remains locked.

### Contributions 13–16: finish it and give it back to the village

**13 — Final weak spot.** Adam and Alve find/finish the last substantial piece that still makes the nearly restored dock read as a worksite. No new mystery or shopping chain is introduced.

**14 — Finish for use, not construction.** They remove leftover work material and make the dock ready for ordinary summer life. Persistent life buoy remains visible. This beat deliberately transitions visual language from tools/materials toward towels, sitting space and clear access.

**15 — Alve realizes they are done building.** A quiet pre-completion beat. Adam and Alve look over the lake and the nearly finished dock and talk about who might come down once it is open. The emphasis is anticipation rather than another repair surprise.

**16 — Bryggan complete.** Final authoritative contribution completes the project and removes Alve's worksite role there. The completion Story Moment should show a genuinely usable summer place with the permanent life buoy and restored structure. The controlled-random jetty ambient pool becomes eligible on later visits, including a real empty state and authored combinations such as Linus+Henning or Sol+Mira.

The completed jetty therefore carries three persistent consequences:
1. visibly restored usable structure;
2. Sol's life buoy permanently mounted;
3. controlled-random swimming/hanging scenes can appear on later lake visits.

Canonical arc: **1–4 discover real damage/reuse Linus material → 5–8 make bathing safe and install life buoy → 9–12 people begin returning before completion → 13–16 finish and hand the place back to summer life.**


## Båthuset restoration arc — LOCKED 2026-09-28

Båthuset keeps its locked identity as **verktyg, fynd, projekt och upptåg**. It is Adam and Alve's workshop/discovery space, not another generic social hangout. The baseline is the same **4 + 4 + 4 + 4 authoritative real-world quest contributions** as the other main Act 2 restoration tracks.

### Contributions 1–4: the locked chest / Henning / first clue across the lake
Adam and Alve begin by clearing the neglected boathouse and discovering old objects. During the work they uncover a **heavy old locked chest/box** buried or wedged among the clutter. The missing/stubborn lock resists their reasonable attempts to open it.

Henning becomes the block's major village-support character. His solution is deliberately excessive and comic: **dynamite**. This is a Story Moment/cinematic gag only, never a usable game mechanic or instructional sequence. The presentation is essentially setup → cut away → **BOOM** → aftermath, with a soot-covered but satisfied Henning and the chest now open.

The chest contains **old tools and useful boat parts**, planting material that can matter later when the motorboat project becomes available. More importantly it contains an **old photograph of the lake during its better days**, tied to Alve's family history. The same now-broken motorboat is visible in the photograph travelling out across the lake. The back carries the handwritten line:

> **“Sista turen över sjön innan hösten.”**

Alve recognizes that the boat in the photograph is the old motorboat at the lake. This is the first strong Act 3 transport/mystery seed: the boat used to take people somewhere across the lake, but neither the photograph nor the dialogue defines the destination.

Target discovery beat:
> **Alve:** “Den där båten…”  
> **Adam:** “Vadå?”  
> **Alve:** “Det är ju den.”  
> **Adam:** “Den på bilden?”  
> **Alve:** “Mm.”  
> **Alve:** “Jag undrar vart de brukade åka.”

Henning's incident also establishes the intended Adam/Alve/village tone:
> **Alve:** “Är alla i din by så här?”  
> **Adam:** “Typ.”  
> **Alve:** “…jag gillar den här byn.”

### Contributions 5–8: the workshop is born / Mira
The second block is a consequence of the chest rather than a new unrelated mystery. Adam and Alve inventory the surviving tools and boat parts and discover that the old work area is too ruined/disorganized to use properly. Their restoration focus shifts toward turning the boathouse into a **real working workshop**.

They clear and repair the work area/workbench. Alve is already eager to work on the motorboat parts, but they first need a usable place to work and a way to organize everything they found.

**Mira** gets the major village-support role in this block. She sees the chaos of loose tools, fittings and boat parts and identifies the practical problem: they do not primarily need more tools, they need to be able to find and use the ones they already have. This can unlock an authored workshop-supply package such as tool storage/pegboard, boxes and suitable work lighting.

This block should contain a natural **story-bound SysselBux purchase from Mira** for the workshop supplies. Exact contents and price remain open for balancing. It is an intermediate story/economy beat and does not replace one of the four real-world quest contributions.

By contribution 8, the boathouse visibly reads as Adam and Alve's functioning project workshop. The photograph from the chest is mounted permanently above/near the workbench, keeping the old motorboat and unanswered trip across the lake present in the environment.

Locked closing exchange:
> **Adam:** “Vad ska vi bygga?”  
> **Alve:** “Allt.”  
> *Alve tittar mot den gamla motorbåten.*  
> **Alve:** “Men först ska vi fixa den gamla båten.”

Alve wants to start immediately, but the motorboat remains the later locked project until the three main lake restorations are complete.

### Contributions 9–12: the soapbox car / friendship
Once the workshop exists, the boathouse should demonstrate its own value rather than functioning only as motorboat preparation. Adam and Alve find an **old hand-drawn plan for a small soapbox car / lådbil** among the remaining material. Alve immediately decides they should build one.

The block becomes their first substantial self-directed workshop project:
1. they discover the old plan and decide to build the car;
2. they collect/reuse suitable parts, naturally allowing Linus/Recycling and existing village resources to contribute without turning the sequence into a rigid building checklist;
3. Alve performs the first test drive, which works briefly before an amusing, harmless failure such as a wheel coming off;
4. they diagnose the problem, improve the build and complete a successful second version.

Target failed-test beat:
> **Adam:** “Gick det bra?”  
> **Alve:** “Japp.”  
> **Adam:** “Hjulet lossnade.”  
> **Alve:** “Då vet vi vad vi ska fixa.”

The block's emotional purpose is friendship. Adam and Alve are no longer merely two children restoring the same place; they are now friends who build ridiculous things together. The completed soapbox car remains as a persistent prop at/around the boathouse and may later imply continued use.

Locked closing exchange:
> **Alve:** “Okej. Den där var övning.”  
> **Adam:** “För vad?”  
> **Alve:** “Båten.”

### Contributions 13–16: prepare the boathouse for the motorboat / completion
The final block pays off the boathouse arc rather than introducing another major side story. Its purpose is to make the restored workshop physically ready for the later motorboat project and to turn it into a persistent part of lake life.

**13 — Make room for the boat.** After the soapbox-car project, Alve notices the obvious remaining problem: the workshop is usable, but the actual boat bay/slip area is still blocked by old clutter and debris. Adam and Alve begin the final clearing work so the motorboat can eventually be brought inside for repair.

**14 — Restore the old boat trolley/slip mechanism.** Clearing reveals the old equipment used to pull a boat into the boathouse. It is seized/damaged. Linus may make a small return here as practical support rather than starting a new large story chain. He recognizes how the old construction works and helps identify what can be reused. Some of the old boat parts recovered from the dynamite-opened chest in contributions 1–4 turn out to belong to or fit this mechanism, giving the early discovery a concrete later payoff.

**15 — Test the mechanism.** Adam and Alve repair and safely test the trolley/slip without beginning the motorboat restoration itself. It works, proving that the boathouse is now ready to receive the boat when progression allows it.

Locked beat:
> **Alve:** “Då kan vi få in båten.”  
> **Adam:** “När vi får laga den.”  
> **Alve:** “När vi får laga den.”

Around this point the world may also begin hinting that the village recognizes the boathouse as a useful workshop, for example through a small broken object left on the workbench with a note asking whether Adam and Alve can fix it. This is flavor/world progression, not a new system or gating quest.

**16 — Båthuset complete.** The final authoritative contribution completes the restoration. The completion Story Moment should visibly preserve the history of the whole arc: functioning workbench and tools, the old photograph mounted on the wall, the soapbox car, and the now-working boat bay/slip. The location should feel like Adam and Alve's established workshop rather than a reset generic building.

Locked completion exchange:
> **Adam:** “Klart.”  
> **Alve:** “Nästan.”  
> **Adam:** “Vad är det som är kvar?”  
> *Alve pekar mot motorbåten.*  
> **Alve:** “Den.”

The motorboat remains progression-locked until all three main lake projects are complete. Båthuset completion therefore ends with a clear future goal rather than starting the motorboat early.

### Completed boathouse ambient identity
Once complete, the boathouse becomes eligible for controlled-random ambient life while retaining its distinct workshop/discovery identity. Examples may include Linus tinkering with something, Mira leaving something to be repaired, Henning being questionably unsupervised around the tools, Alve working on another small project, or an empty workshop with a half-finished project on the bench. Exact pools/dialogue remain content-production work.

Canonical arc shape:
**1–4: discovery/mystery → 5–8: workshop is born → 9–12: Adam/Alve friendship through their own build → 13–16: prepare the site for the motorboat and complete the boathouse.**


## Stugan restoration arc — LOCKED 2026-09-28

Stugan is the emotional Alve location. Its 16 authoritative real-world quest contributions use the same **4 + 4 + 4 + 4** baseline as Bryggan and Båthuset, but the restoration is primarily a vehicle for revealing Alve, his memories and his hope that his family might return. Do not turn it into another material-fetch construction arc.

The exact reason Alve's family has had a difficult period remains deliberately unspecified. The story should communicate the child's experience without diagnosing or explaining the adults' problems.

A central visual rule is that meaningful traces survive the restoration. The finished cottage should contain both **old memories and new memories**, rather than looking reset or generic.

### Contributions 1–4: “Jag vill att det ska bli som förr”
Adam and Alve begin by properly entering, airing and clearing the neglected cottage. Alve instinctively knows where things used to stand, revealing how familiar the place once was.

Target early beat:
> **Adam:** “Du hittar rätt bra här.”  
> **Alve:** “Jag har varit här typ en miljard gånger.”  
> **Alve:** “Eller… var.”

During the clearing they uncover **Alve's old height marks** on a wall/door frame, including traces of other family members. The marks are protected and must remain visible through the completed restoration. This discovery can carry light banter:
> **Alve:** “Jag var jätteliten.”  
> **Adam:** “Du är fortfarande ganska liten.”  
> **Alve:** “Tyst.”

They also find a **family photograph from an earlier summer at the cottage/lake**. This is distinct from the boathouse motorboat photograph. It is an ordinary warm family memory rather than an Act 3 mystery clue.

Target beat:
> **Adam:** “Är det din familj?”  
> **Alve:** “Mm.”  
> **Adam:** “Ni ser glada ut.”  
> **Alve:** “Vi var här hela tiden då.”  
> **Alve:** “Sen slutade vi komma.”

Contribution 4 produces the first substantial cottage visual restoration step. At its close Alve reveals the real motive behind trying to repair the place alone:
> **Adam:** “Det börjar ju faktiskt se bra ut.”  
> **Alve:** “Inte tillräckligt.”  
> **Adam:** “För vad?”  
> **Alve:** “Jag tänkte att om det såg ut som förr…”  
> **Alve:** “…så kanske de skulle vilja komma hit igen.”

This is the block's emotional reveal: Alve is trying to restore a place where his family used to be happy in the hope that it might draw them back.

### Contributions 5–8: “Det kan bli bra på ett nytt sätt”
The second block deliberately brings joy and play into the cottage rather than escalating sadness.

Adam and Alve find an **old worn family board/card game** in a cupboard. Alve remembers rainy days, family cheating/arguments and ordinary summer details. The family should begin to feel like real people through trivial memories rather than exposition.

As they make the room usable again, Alve remembers how furniture used to stand and admits to childhood games such as treating the floor as lava. Adam joins in. A small Story Moment may show them crossing the half-restored room without touching the floor. This establishes why Alve loved the cottage, not merely why he misses it.

A rain shower later traps Adam and Alve inside the cottage. They play the recovered game while the puppy rests nearby and rain hits the windows. Alve predictably cheats:
> **Adam:** “Du fuskar.”  
> **Alve:** “Nej.”  
> **Adam:** “Du flyttade den där.”  
> **Alve:** “Det gjorde vinden.”  
> **Adam:** “Vi är inomhus.”  
> **Alve:** “Jättekonstig vind.”

After the joke, Alve notices:
> **Alve:** “Det låter likadant.”  
> **Adam:** “Vadå?”  
> **Alve:** “Regnet.”

This is important: Alve is now creating a **new good memory** in the cottage with Adam instead of only excavating old ones.

Contribution 8 completes another substantial cottage step. The game remains visible and the protected height marks remain. Locked closing beat:
> **Adam:** “Ser det ut som förr nu?”  
> **Alve:** “Nej.”  
> **Alve:** “Det ser bättre ut.”

The emotional movement is from recreating the past exactly toward accepting that the cottage can become good in a new way.

### Contributions 9–12: “Då måste vi hinna klart”
During continued clearing Adam finds an old **childhood drawing by Alve** showing the cottage, lake, family and an amusingly disproportionate boat, headed **“VÅR STUGA”**. Alve initially tries to deny authorship despite his name being on it:
> **Adam:** “Är det där du?”  
> **Alve:** “Nej.”  
> **Adam:** “Det står Alve bredvid.”  
> **Alve:** “…någon annan Alve.”

The drawing shows the family together on the cottage veranda/outdoor area and motivates restoration of that social space. While working there, Alve recalls ordinary details: breakfast outside, coffee, running toward the lake before putting shoes on, being told to close the door. These mundane memories are preferred over lore exposition.

Adam eventually asks whether Alve's family knows he is restoring the cottage:
> **Adam:** “Vet de att du är här?”  
> **Alve:** “Inte riktigt.”

This confirms that the restoration has been Alve's surprise for them.

Later Adam and Alve return and notice subtle evidence that **someone has visited the cottage while they were away**. Nothing dramatic is shown. They find a small ordinary object that Alve immediately recognizes as coming from home. The object is **Alve's familiar keyring from home**. It is recognizable to Alve but does not reveal which family member visited.

Locked beat:
> **Adam:** “Vad är det?”  
> **Alve:** “Den här är inte härifrån.”  
> **Adam:** “Varifrån är den då?”  
> **Alve:** “Hemma.”

Do not reveal who visited, why, or show the family. The point is that somebody from home has seen the cottage. For Alve this creates renewed hope.

He becomes intensely motivated to finish:
> **Alve:** “De har varit här.”  
> **Adam:** “Det verkar så.”  
> **Alve:** “Då såg de den.”  
> **Adam:** “Stugan?”  
> **Alve:** “Ja.”  
> **Alve:** “Då måste vi hinna klart.”

If Adam asks before what:
> **Alve:** “Bara… innan.”

Contribution 12 produces the next major cottage visual step, including the restored veranda/outdoor area. The childhood drawing can join the family photograph and game as a persistent interior memory object.

### Contributions 13–16: finish everything / wait without being alone
The final block introduces no new major mystery. Adam and Alve give the cottage everything they have and finish what Alve originally set out to do.

Contribution 13 addresses the remaining substantial damage. Contribution 14 increasingly shifts from repairing a building to **preparing a place for people**: arranging chairs, making sleeping space usable, putting things where guests/family could actually return. Contribution 15 lets Alve openly imagine them there again:
> **Alve:** “De kan sova där.”  
> **Alve:** “Och vi kan ha spelet här.”  
> **Alve:** “Och om det regnar…”

Contribution 16 completes Stugan. The completion Story Moment should show the transformation from the abandoned cottage at Alve's introduction into a warm, intact place containing its accumulated history: **height marks, family photograph, childhood drawing, old game and evidence of Adam and Alve's new memories together**.

The family does **not** arrive at cottage completion. Adam and Alve wait briefly, but nobody comes.

Locked completion beat:
> **Adam:** “Tror du de kommer?”  
> **Alve:** “Inte idag.”  
> **Alve:** “Men den är klar.”  
> **Adam:** “Vi kommer ju tillbaka imorgon.”  
> **Alve:** “Ja.”  
> **Alve:** “Vi har ju en båt att laga.”

Alve does not collapse or treat the restoration as a failure. Adam has not “fixed” Alve's family by completing enough chores. The emotional payoff is that Alve no longer has to wait or work alone, and his life at the lake now contains new friendships and memories alongside the old ones.

The previously locked Act 2 family-return payoff remains unchanged: only after the wider lake restoration and motorboat project do Adam and Alve later discover someone unexpectedly inside the cottage and reveal Alve's family. Cottage completion must leave enough uncertainty and time for that final return to matter.

Canonical emotional progression:
**1–4: “Jag vill att det ska bli som förr.” → 5–8: “Det kan bli bra på ett nytt sätt.” → 9–12: “De har varit här; de kanske kommer tillbaka.” → 13–16: “Stugan är klar, men Alve behöver inte vänta ensam.”**


## Motorbåten restoration arc — LOCKED 2026-09-28

Motorbåten unlocks only after Stugan, Bryggan and Båthuset are complete. It uses the same **4+4+4+4 = 16 authoritative real-world contributions**. Unlike the first three projects, its arc is not primarily about saving another place: it gathers the restored lake, village support network, Alve's family history and Adam/Alve friendship into the vehicle that will eventually carry them toward Act 3. The Act 3 destination remains deliberately undefined.

### Contributions 1–4: the old boat becomes a real project
Adam and Alve use the restored boathouse slip to bring the motorboat inside. Alve has been waiting for this throughout the act. They uncover/clean it and compare it with the old boathouse photograph, confirming through a distinctive visual detail that it is the same boat shown on the old trip across the lake. The boat is therefore a physical piece of Alve's family history, not a random wreck.

The damage is much worse than Alve expects. Keep the repair fiction child-readable and non-instructional rather than depicting real motor-repair procedures. Linus becomes the primary adult support because of his salvage/reuse/practical-old-things role. He recognizes the boat but does not define its former destination. Locked mystery beat:
> **Alve:** “Vet du vart den åkte?”  
> **Linus:** “Över sjön.”  
> **Alve:** “Ja, men vart?”  
> **Linus:** “Det får ni väl ta reda på.”

Linus helps classify what can be saved/reused/must be replaced without solving the project for them. Old boat parts from the boathouse chest may pay off here. Contribution 4 produces the first substantial motorboat restoration step, **1/4→2/4**. Locked thematic close:
> **Alve:** “Tror du den kommer funka?”  
> **Linus:** “Inte idag.”  
> **Alve:** “Alla säger så hela tiden.”  
> **Adam:** “Vadå?”  
> **Alve:** “Inte idag.”  
> **Adam:** “Då fortsätter vi imorgon.”

### Contributions 5–8: village support and the first sign of life
Continued sorting/repair reveals one important missing/unsalvageable need. Keep it deliberately non-technical in child-facing dialogue. Linus cannot fabricate it. Mira can source the required replacement/support package, creating the motorboat's major **story-bound SysselBux purchase**. Exact item and price remain open for economy balancing; it must be affordable through normal play and use the authoritative backend wallet.

Mira's tone should recognize the Adam/Alve combination rather than turn the scene into a shop tutorial. Target gag:
> **Mira:** “Så ni tänker verkligen få igång den där gamla båten?”  
> **Adam:** “Ja.”  
> **Mira:** “Och Alve är inblandad?”  
> **Adam:** “Ja.”  
> *Mira funderar.*  
> **Mira:** “Jag beställer två.”

When the package arrives Alve wants to skip ahead and try the boat immediately. Linus stops him; Alve reluctantly accepts that doing the work properly is part of “det löser vi”. Contribution 8 culminates in the first controlled attempt while the boat is still safely at the boathouse/slip. At first nothing happens, then the boat gives a brief first sign of life before stopping again.

Locked comic payoff:
> **Alve:** “Hörde du?!”  
> **Adam:** “Ja.”  
> **Alve:** “DEN LEVER.”  
> **Linus:** “Lugn.”  
> **Alve:** “DEN LEVER LUGNT.”

This advances **2/4→3/4** and shifts the mystery from Alve's past toward Adam and Alve's future: they now know the old boat can plausibly live again.

### Contributions 9–12: onto the lake / from repaired object to their boat
The restored boathouse slip finally pays off as Adam and Alve move the boat into the water. It floats. The first true water test briefly succeeds: the motor runs, they leave the jetty under their own power, travel only a short distance, then it stops and they need help back. This is progress, not a reset.

Target jetty gag:
> **Henning:** “Går det bra?”  
> **Alve:** “JAPP!”  
> **Adam:** “Det gör det inte.”  
> **Alve:** “DET GÅR GANSKA BRA!”

The remaining work is framed as making the boat ready for an actual journey rather than buying another magic engine part. The whole restored Act 1 village can contribute naturally: Linus with reusable practical material, Mira with useful supplies, Sol with simple safety/floating equipment, Henning with provisions. Do not turn these into four mandatory fetch systems.

Contribution 12 leaves the boat visually restored at **4/4**, but not yet proven for a real trip. Adam and Alve give it a persistent name. Exact naming UX/default options remain implementation design, but the chosen name should later be usable in dialogue and visually belong to their boat. This marks the emotional transition from Alve's family's old wreck to Adam and Alve's shared adventure boat.

Locked setup for the final block:
> **Alve:** “Nu är den klar.”  
> **Linus:** “Nej.”  
> **Alve:** “VA?”  
> **Linus:** “Ni har inte provat om den håller hela vägen.”

### Contributions 13–16: the proper test / Act 2 climax
The final block adds no new purchase or major repair. It proves that Adam and Alve can use what they restored.

**13 — Prepare the proper test.** They plan a longer test run along their own side of the lake, explicitly not the Act 3 crossing. Sol's safety contribution, Mira's practical supplies, Henning's excessive provisions and Linus's final check can all pay off. Adam and Alve perform the preparation themselves. Linus deliberately remains behind:
> **Linus:** “Redo?”  
> **Alve:** “Japp.”  
> **Adam:** “Japp.”  
> **Linus:** “Bra. Då behöver ni inte mig.”

**14 — First real trip.** Major Story Moment. Adam and Alve leave the restored jetty and see the restored cottage, boathouse and lake from the water for the first time. Keep the beat simple enough to let the payoff breathe:
> **Alve:** “Adam.”  
> **Adam:** “Mm?”  
> **Alve:** “Vi åker båt.”  
> **Adam:** “Det var planen.”  
> **Alve:** “Jag vet.”  
> *Paus.*  
> **Alve:** “Men vi åker faktiskt båt.”

**15 — Small problem, big character payoff.** A harmless practical issue such as unsecured gear/rope/latch occurs. Do not break the motor again or erase progress. Alve initially lunges to fix it, then stops and applies what he has learned: first make the situation safe, then solve it together with Adam, without an adult rescue. From their turnaround point they can look toward the undefined other side. Alve suggests continuing; Adam answers **“Inte idag.”** Alve accepts and repeats **“Inte idag.”** This line is locked. What Alve once heard as rejection now means *later*.

**16 — Homecoming.** The boat completes the entire test and returns to the restored jetty. Residents who followed the project may be present naturally; puppy can greet them ashore. The motorboat is now story-complete. After a brief ordinary celebration, Alve notices the supposedly empty cottage has changed: the door is open and/or a light is visible. He concludes there are burglars and runs to investigate, Adam following. This transitions directly into the Act 2 family payoff rather than creating a seventeenth contribution.

### Act 2 family-return payoff — LOCKED
The family return is the emotional climax of Act 2 and must receive real dramatic space. It is **not contribution 17** and does not become another quest.

At the cottage, additional clues build tension: a jacket or bag, then familiar laughter from inside. Alve recognizes the laugh and slows before entering. His family is not merely standing there for a reveal: they are unpacking and using the restored cottage, including the recovered old game. The visual message is that they have come back to stay/use the place, not merely inspect Alve's work.

Target reveal:
> **Alve:** “…vad gör ni här?”  
> **Familjemedlem:** “Vi tänkte att det kanske var dags.”  
> **Alve:** “Ska ni stanna?”  
> *Paus.*  
> **Familjemedlem:** “Om vi får.”

Alve finally breaks his usual composure and runs into a family embrace. This is a major Story Moment. Adam remains slightly behind, always under the canonical back-view child rule. A family member notices him:
> **Familjemedlem:** “Och vem är det där?”  
> **Alve:** “Det är Adam.”  
> *Paus.*  
> **Alve:** “Han är min kompis.”

This is a core emotional payoff. Alve arrived at the lake alone trying to restore the past; by the finale he has both his returning family and a real friend.

The family then discovers the preserved history inside the cottage. A family member notices the height marks: **“Ni sparade dem.” / “Klart vi gjorde.”** Alve tries to hide/remove the embarrassing childhood **VÅR STUGA** drawing; Adam insists it stays.

Finally the family steps onto the veranda and sees the whole restored lake: cottage, living jetty, boathouse and motorboat. Locked final family-arc exchange:
> **Familjemedlem:** “Det är inte riktigt som förr.”  
> *Alve tittar ut över sjön och sedan på Adam.*  
> **Alve:** “Nej.”  
> *Paus.*  
> **Alve:** “Det är bättre.”

This explicitly pays off Stugan contribution 8 and the Act 2 theme: Alve did not recreate the old summer; together they made a new one.

Do not immediately undercut the family scene with an Act 3 reveal. Let it land. Later, in normal post-finale play, Adam and Alve can return to the boat and the old photograph/mystery. The first true crossing becomes the **opening of Act 3**, with destination still undefined. After Act 2, Alve + the named motorboat become the permanent transport link across the lake.

Canonical Motorbåten arc: **1–4 history/diagnosis → 5–8 village support/first life → 9–12 water test/their boat → 13–16 independent proper test/homecoming → family return payoff.**

Canonical Act 2 contribution count is now **64 authored contributions total: 16 Stugan + 16 Bryggan + 16 Båthuset + 16 Motorbåten.**
