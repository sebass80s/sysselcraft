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


### Act 2 path selector after project completion — LOCKED

The project selector remains an in-Story-Moment choice, never a detached menu. It is also revised so the **Motorbåten is always visible as a fourth hotspot**, even before it is available. This keeps the boat present as the long-term goal instead of making it suddenly appear only after 3/3.

Selectable restoration hotspots derive from completion state:
- **Stugan**
- **Bryggan**
- **Båthuset**
- **Motorbåten** — always visible, but locked until Stugan, Bryggan and Båthuset are all complete.

The three building tracks remain order-independent. The selector must never assume a canonical restoration order.

**Initial / 0 of 3 complete**
The player may choose freely between Stugan, Bryggan and Båthuset. Motorbåten is visible but locked.

The existing first-choice preview intent remains:
- **Bryggan:** “Bryggan är bra. Då kan vi knyta fast båten här sen. Och bada!”
- **Båthuset:** “Båthuset måste vi fixa om vi ska kunna laga båten.”
- **Stugan:** “Stugan... Jag hoppas min familj vill komma hit igen om vi får ordning på den.”

Confirmation button:
- **“Laga [objekt]”**

After confirmation:

> **Alve:** “Bra val! Vi fixar [objektet] först!”

“Först” refers only to the player's chosen current project and does not establish canonical project order.

**After 1 of 3 projects is complete**
Alve and Barnet briefly acknowledge the milestone at the completed location.

> **Alve:** “En klar.”

He looks toward what remains.

> **Alve:** “Det känns lite konstigt.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Förut var allt trasigt. Nu är det en sak mindre.”

Alve smiles.

> **Alve:** “Så. Vad tar vi nu?”

The selector then shows the two unfinished building projects plus the always-visible Motorbåten hotspot.

The two remaining building previews should use short, timeless project motivations that remain valid regardless of which project was completed first. Do not use wording that assumes this is the player's first visit to the selector.

Confirmation button:
- **“Laga [objekt]”**

After confirmation:

> **Alve:** “Bra. Då kör vi på [objektet].”

**After 2 of 3 projects are complete**
The selector still appears. Only the final unfinished building project is actionable, while Motorbåten remains visible but locked.

Short transition:

> **Alve:** “Två klara.”  
> **Barnet:** “Då är det bara en kvar.”

Alve looks toward the final unfinished building.

> **Alve:** “Japp.”

Short pause.

> **Alve:** “Den har väntat länge nog.”

The player confirms the remaining building with:

- **“Laga [sista projektet]”**

After confirmation:

> **Alve:** “Då gör vi klart hela stället.”

**Motorbåten locked-state dialogue**
Clicking the Motorbåten hotspot before all three buildings are complete must produce an in-fiction explanation rather than only a grey lock.

If **Båthuset is not complete**, this reason takes priority:

> **Alve:** “Jag vill också börja med båten. Men först måste vi laga båthuset. Vi behöver verkstaden och slipen om vi ska kunna göra det ordentligt.”

If **Båthuset is complete but Stugan and/or Bryggan remain unfinished**:

> **Alve:** “Snart. Men de andra byggena är viktigare först. Om vi ska få hela platsen att fungera igen kan vi inte bara fixa båten och lämna resten.”

If **exactly one non-boathouse building remains unfinished**, the line may become specific:

> **Alve:** “Båten är nästan nästa grej. Men vi gör klart [Stugan/Bryggan] först, sen kan vi lägga allt på båten.”

These locked-state responses do not create branching story canon. They only explain the current lock from authoritative completion state.

**After 3 of 3 projects are complete**
Do not show a separate path selector transition that hides or replaces the boat. Instead, the same Motorbåten hotspot becomes unlocked.

The convergence Story Moment acknowledges that the whole lake place is ready:

Ni står en stund och ser ut över området.

Stugan är klar. Bryggan är klar. Båthuset är klart.

För första gången finns inget av de tre stora projekten kvar att reparera.

Alve är ovanligt tyst.

> **Barnet:** “Vad tänker du på?”

Alve tittar först mot stugan, sedan bryggan och sedan båthuset.

> **Alve:** “När vi började här kändes det som att allt behövde lagas samtidigt.”

Han ler lite.

> **Alve:** “Nu är allt det där faktiskt klart.”

Du följer hans blick.

> **Barnet:** “Inte riktigt allt.”

Alve tittar på dig.

Sedan mot motorbåten.

Han börjar le på riktigt.

> **Alve:** “Nej.”

Paus.

> **Alve:** “Inte allt.”

Han går några steg mot båthuset.

> **Alve:** “Vi har platsen. Verkstaden. Bryggan.”

Han tittar på båten.

> **Alve:** “Det är dags.”  
> **Barnet:** “För vad?”

Alve vänder sig om mot dig.

> **Alve:** “För att äntligen fixa båten.”

The Motorbåten hotspot is now actionable. Its newly unlocked selection confirmation may use:

> **Alve:** “Nu.”  
> **Barnet:** “Nu?”  
> **Alve:** “Nu fixar vi den.”

Canonical progression:
**0/3 → choose 1 of 3 buildings; Motorbåten visible/locked**
**1/3 → choose 1 of 2 buildings; Motorbåten visible/locked**
**2/3 → confirm final building; Motorbåten visible/locked**
**3/3 → Motorbåten unlocks in the same selector grammar**

Implementation must derive available/locked hotspot states from authoritative project completion flags, never from hard-coded restoration order.


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

### First Alve meeting dialogue — LOCKED

This is the exact canonical first-meeting dialogue after OPEN-001…005 and the close bicycle beat. The unknown boy's nameplate reads **Barnet** until he introduces himself; at **“Alve.”** it changes permanently to **Alve**. The scene should feel concrete and grounded in what the children can actually see and do, with fewer one-line ping-pong exchanges than the superseded version.

> **Barnet:** “Hej.”

Pojken vid stugan rycker till och vänder sig om. Han håller fortfarande en lös bräda i handen.

> **Barnet:** “Är det din cykel där borta?”

> **Barnet:** “Ja.”

Han tittar förbi dig mot Valpen.

> **Barnet:** “Kom du från byn?”

> **Barnet:** “Hunden sprang hit. Jag sprang efter.”

Pojken nickar mot Valpen.

> **Barnet:** “Han hittade rätt väg i alla fall.”

Du tittar på stugan. En del plankor har flyttats, några verktyg ligger utspridda på marken och det syns tydligt att någon har försökt börja laga den.

> **Barnet:** “Försöker du fixa den här själv?”

> **Barnet:** “Ja. Jag tänkte börja med väggen, sedan taket och sedan resten.”

Du tittar på det trasiga räcket, den sneda dörren och brädorna som ligger bredvid.

> **Barnet:** “Det är ganska mycket ‘resten’.”

Pojken tittar på stugan igen.

> **Barnet:** “Jag har märkt det.”

Han lägger ifrån sig brädan.

> **Barnet:** “Det här är min familjs ställe. Vi brukade vara här på somrarna.”

> **Barnet:** “Brukar ni inte vara här längre?”

> **Barnet:** “Nej.”

Han säger det kort och börjar samla ihop verktygen.

> **Barnet:** “Så jag tänkte laga det.”

> **Barnet:** “Hela stället?”

> **Barnet:** “Det var planen.”

Du ser bort mot sjön. Bryggan är trasig. Båthuset lutar och längre bort står den gamla motorbåten.

> **Barnet:** “Det är inte bara stugan som är trasig.”

> **Barnet:** “Jag vet.”

För första gången ser han lite mindre säker ut.

> **Barnet:** “Jag trodde faktiskt inte att det var så här mycket.”

> **Barnet:** “Jag kan hjälpa dig.”

Han tittar på dig som om du sagt något oväntat.

> **Barnet:** “Varför?”

> **Barnet:** “För att du aldrig kommer bli klar själv.”

Pojken höjer ögonbrynen.

> **Barnet:** “Det där var väldigt snällt sagt.”

> **Barnet:** “Jag menade det snällt.”

Han försöker hålla sig allvarlig, men börjar le.

> **Barnet:** “Jag heter Adam.”

Pojken tvekar ett ögonblick.

> **Barnet:** “Alve.”

**Nameplate changes: Barnet → Alve.**

> **Alve:** “Okej, Adam. Om du verkligen tänker hjälpa till så behöver du se resten.”

Alve börjar gå mot sjön och du följer efter.

Han pekar först mot stugan.

> **Alve:** “Stugan är värst inuti. Jag har knappt börjat där.”

Sedan mot bryggan.

> **Alve:** “Bryggan går nästan inte att använda längre.”

Och sist mot båthuset.

> **Alve:** “Och båthuset är fullt med gammalt skräp.”

Du tittar mot motorbåten.

> **Barnet:** “Och den?”

Alve stannar.

> **Alve:** “Den får vänta.”

> **Barnet:** “Varför?”

> **Alve:** “För att vi inte ens har någonstans att laga den än. Båthuset måste fungera. Bryggan måste gå att använda. Och jag vill få ordning på stugan.”

Han ser över platsen en gång till.

> **Alve:** “Jag tänkte göra allt själv.”

> **Barnet:** “Det hade tagit hundra år.”

> **Alve:** “Femtio.”

> **Barnet:** “Minst hundra.”

Alve funderar.

> **Alve:** “Okej. Åttio.”

Du skrattar.

Alve pekar ut de tre platserna igen.

> **Alve:** “Stugan. Bryggan. Båthuset.”

Han tittar på dig.

> **Alve:** “Om vi ska göra det här tillsammans så börjar vi med en av dem.”

> **Alve:** “Vad börjar vi med?”

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
- **Stugan:** the emotional Alve location. Its restoration gradually reveals personal/family memories through objects and concrete details rather than an exposition dump. Candidate devices include an old family photograph, childhood drawing, height marks, old game/toy or other traces of earlier summers.

**Alve family backstory — LOCKED:** Alve's mother became seriously ill and later died. Act 2 must **never state her death outright in child-facing dialogue**. The child-facing layer only establishes sparse facts such as **“mamma blev sjuk”**, that the family stopped coming to the cottage afterward, and that Alve's father finds the place difficult to return to. A younger child can understand only that the family went through something sad; an adult player should be able to infer the full history by combining the clues. Do not turn this into a twist, diagnosis scene, grief monologue or exposition dump.

The cottage was one of the family's happiest places before the illness. Afterward Alve's father could not bring himself to return, while Alve reacted in the opposite direction and kept coming back, trying to repair the place himself. This explains why Alve is often at the lake during the day and why his project is emotionally urgent rather than evidence that the family simply neglected the property. Alve initially believes that making the cottage “som förr” might make the family return; his Act 2 growth is accepting that neither the cottage nor the family can literally become what they were, but that they can make a good new life there.

At the Act 2 finale the returning household consists of **Alve's father and his older sister in her early teens**. His mother is absent. She may remain present only through old photographs, remembered habits and preserved objects. The old family photograph should include her, making the later absence readable without dialogue for players who notice it.

Completing the cottage does **not** immediately bring Alve's family back. Alve has completed the thing he originally hoped might make them return, but must live with uncertainty while the rest of Act 2 continues.

### Act 2 family payoff
Alve's family returns only at the **end of Act 2**, after the wider lake restoration and motorboat project have naturally allowed significant time to pass.

Locked final reveal structure:
**motorboat complete → quiet aftermath → Adam/Alve notice signs that somebody is inside the restored cottage → because the cottage was established as empty/locked, Alve suspects intruders → they rush to investigate → the people inside are Alve's family.**

The reveal should initially play as an Alve-style “there's someone in the cottage / let's see if they're burglars” discovery rather than announcing the family ceremonially in advance. The family reveal is the emotional payoff for Alve's whole Act 2 arc, not merely the cottage completion reward.

### Act 2 finale dialogue — family return and first crossing

This sequence is the locked emotional ending of Act 2. It triggers **after the motorboat restoration is complete** and after the quiet aftermath. It pays off the entire Alve/family arc and then immediately uses the repaired motorboat as the bridge into the next chapter.

#### Scene 1 — After the motorboat

Motorbåten är klar. För första gången finns det inget stort projekt kvar vid sjön.

Barnet och Alve står nere vid vattnet och tittar på båten.

> **Alve:** “Den fungerar.”  
> **Barnet:** “Japp.”  
> **Alve:** “På riktigt.”  
> **Barnet:** “På riktigt.”

Alve lägger handen på relingen.

> **Alve:** “Det är lite konstigt.”  
> **Barnet:** “Vadå?”  
> **Alve:** “När jag kom hit var allt trasigt.”

Han tittar bort mot stugan, bryggan och båthuset.

> **Alve:** “Nu är inget trasigt längre.”  
> **Barnet:** “Vi kan säkert hitta något.”  
> **Alve:** “Nej.”  
> **Barnet:** “Du brukar gilla projekt.”  
> **Alve:** “Jag har fått nog av projekt för typ fem minuter.”

Barnet ler.

> **Barnet:** “Vad gör vi då?”

Alve tittar ut över sjön.

> **Alve:** “Vi skulle kunna åka.”  
> **Barnet:** “Vart?”  
> **Alve:** “Vet inte.”  
> **Barnet:** “Bra plan.”  
> **Alve:** “Jag har blivit bättre på planer.”  
> **Barnet:** “Har du?”  
> **Alve:** “Lite.”

Ni börjar gå tillbaka mot stugan.

#### Scene 2 — Någon är där

När ni kommer närmare stugan stannar Alve plötsligt.

> **Alve:** “Vänta.”  
> **Barnet:** “Vad?”  
> **Alve:** “Dörren.”

Barnet tittar.

> **Barnet:** “Vad är det med den?”  
> **Alve:** “Den är öppen.”  
> **Barnet:** “Glömde vi stänga?”  
> **Alve:** “Nej.”

Alve går några steg närmare.

> **Alve:** “Jag stänger alltid.”  
> **Barnet:** “Alltid?”  
> **Alve:** “Nu gör jag det.”

Ni hör ett ljud inifrån. Alve stelnar till.

> **Alve:** “Det är någon där.”  
> **Barnet:** “Ja.”  
> **Alve:** “Det kan vara inbrottstjuvar.”  
> **Barnet:** “I en stuga mitt ute vid sjön?”  
> **Alve:** “Perfekt ställe för inbrottstjuvar.”  
> **Barnet:** “Vad skulle de stjäla?”

Alve tänker.

> **Alve:** “Spelet.”  
> **Barnet:** “Ingen bryter sig in för att stjäla ditt gamla spel.”  
> **Alve:** “Du vet inte hur bra det är.”

Ett nytt ljud hörs därinne.

> **Alve:** “Okej.”  
> **Barnet:** “Vad gör vi?”  
> **Alve:** “Vi smyger fram.”  
> **Barnet:** “Varför?”  
> **Alve:** “Så de inte märker oss.”  
> **Barnet:** “Och sen?”  
> **Alve:** “Det kommer i nästa del av planen.”  
> **Barnet:** “Du har fortfarande inte blivit bättre på planer.”  
> **Alve:** “Tyst.”

Ni går försiktigt fram mot dörren.

#### Scene 3 — Familjen

Alve öppnar dörren försiktigt.

Han stannar.

Inne i stugan håller hans pappa på att ställa ner en väska. Alves storasyster, i tidiga tonåren, står bredvid en flyttlåda med några saker hemifrån i famnen.

**Mamman är inte där.** Ingen kommenterar hennes frånvaro. Det gamla familjefotot, där hon finns med, är fortfarande synligt i stugan.

Alve säger ingenting.

> **Barnet:** “Alve?”

Pappan vänder sig om.

> **Pappan:** “Alve?”

Alve tar ett steg fram.

> **Alve:** “Vad gör ni här?”

Det kommer ut lite för snabbt.

> **Pappan:** “Vi tänkte att det var dags.”

Alve tittar runt. Fler väskor. Några saker hemifrån. Den gamla nyckelringen ligger på ett bord.

> **Alve:** “Ni kom.”  
> **Pappan:** “Ja.”

Alve står fortfarande helt still.

Pappan tittar runt i den lagade stugan.

> **Pappan:** “Jag har åkt hitåt flera gånger.”  
> **Alve:** “Hitåt?”  
> **Pappan:** “Jag kom inte hela vägen.”

Alve tittar på honom.

> **Alve:** “Varför inte?”

Pappan blir tyst ett ögonblick och ser mot rummet omkring sig.

> **Pappan:** “Det var svårt att vara här.”

Alve svarar inte.

> **Pappan:** “Men den här gången kändes det annorlunda.”

Han tittar på Alve, sedan mot Barnet.

> **Pappan:** “Du har gjort allt det här?”

Alve tittar mot Barnet.

> **Alve:** “Vi gjorde det.”

Barnet ler.

> **Pappan:** “Det är fantastiskt.”  
> **Alve:** “Det var ganska mycket jobb.”  
> **Barnet:** “Ganska?”  
> **Alve:** “Okej. Väldigt mycket jobb.”

Storasystern upptäcker märkena på väggen.

> **Storasystern:** “De är kvar.”

Alve tittar dit.

> **Alve:** “Klart de är.”

Pappan ser familjefotot och stannar upp lite längre än vid de andra sakerna.

> **Pappan:** “Du satte upp den igen.”  
> **Alve:** “Ja.”

Pappan nickar.

> **Pappan:** “Bra.”

Storasystern får syn på det gamla spelet på bordet och lyfter kartongen.

> **Storasystern:** “Den här finns kvar också.”  
> **Alve:** “Ingen får ändra reglerna.”  
> **Storasystern:** “Du menar dina regler?”  
> **Alve:** “Det finns bara regler.”

Barnet börjar skratta.

> **Barnet:** “Nu vet vi var han fått det ifrån.”  
> **Alve:** “Va?”

Ingen svarar direkt.

Alve tittar runt i rummet igen. Sedan på sin familj.

> **Alve:** “Ska ni stanna?”

Pappan svarar direkt.

> **Pappan:** “Ja.”

Alve blinkar.

> **Alve:** “Hur länge?”  
> **Pappan:** “Vi tänkte börja med sommaren.”

Alve försöker säga något, men får inte riktigt fram det.

> **Barnet:** “Du kan säga det.”  
> **Alve:** “Vadå?”  
> **Barnet:** “Att du är glad.”  
> **Alve:** “Jag är jätteglad.”

Paus.

> **Alve:** “Jag försöker bara att inte vara konstig.”  
> **Barnet:** “Det går sådär.”

Alve skrattar till. Storasystern går fram först och kastar armarna om honom. Pappan följer efter och drar in dem båda. Alve försvinner nästan in i familjekramen.

Låt återföreningen landa visuellt innan nästa replik.

Storasystern tittar förbi Alve mot Barnet.

> **Storasystern:** “Och vem är det där?”

Alve tittar tillbaka.

> **Alve:** “Det är min kompis.”

#### Scene 3b — Verandan

En stund senare har väskorna börjat hitta sina platser. Dörren står öppen bakom er och pappan och storasystern rör sig inne i stugan som om de försiktigt lär känna den igen.

Barnet och Alve sitter på verandan. För en gångs skull verkar Alve inte ha bråttom någonstans.

> **Alve:** “Jag trodde att om jag lagade stugan så skulle allt bli som förr.”  
> **Barnet:** “Blev det det?”

Alve tittar in genom den öppna dörren.

> **Alve:** “Nej.”

Paus.

> **Alve:** “Jag kunde inte laga det som hände.”  
> **Alve:** “Men jag kunde laga stugan.”

Barnet tittar på honom.

> **Barnet:** “Du lagade mer än stugan.”

Alve säger inget först. Han ser på pappan och storasystern därinne, på fotot som sitter kvar och på det gamla spelet som står framme igen.

> **Alve:** “Kanske.”

Han lutar sig tillbaka.

> **Alve:** “Det är inte riktigt som förr.”  
> **Barnet:** “Nej.”

Alve ler lite.

> **Alve:** “Det är bättre.”

Låt scenen vila här. Raden betyder inte att förlusten var bra eller att någon blivit ersatt; den betyder att Alve slutat försöka återskapa det förflutna och kan acceptera ett nytt liv som också får vara bra.

#### Scene 4 — Första turen

Lite senare står Barnet och Alve vid bryggan.

Familjen är kvar vid stugan bakom dem. Väskor har burits in, dörren står öppen och platsen känns för första gången riktigt bebodd.

Alve tittar mot motorbåten.

> **Alve:** “Så.”  
> **Barnet:** “Så?”  
> **Alve:** “Den fungerar.”  
> **Barnet:** “Det har vi redan konstaterat.”  
> **Alve:** “Ja, men nu känns det annorlunda.”  
> **Barnet:** “Hur då?”

Alve tittar tillbaka mot stugan.

> **Alve:** “Nu behöver jag inte vänta här längre.”

Barnet följer hans blick.

> **Barnet:** “De kom.”  
> **Alve:** “Ja.”

Paus.

> **Alve:** “De kom faktiskt.”

Alve blir tyst en stund.

> **Alve:** “Du vet…”  
> **Alve:** “Det här hade aldrig hänt utan dig.”  
> **Barnet:** “Jo då. Du gjorde ju också allt.”  
> **Alve:** “Nej, jag menar det.”  
> **Alve:** “Den dagen du kom var jag helt lost.”  
> **Alve:** “Jag bara gick runt här och trodde att om jag lagade tillräckligt mycket så skulle allting lösa sig.”  
> **Alve:** “Men jag visste inte ens var jag skulle börja längre.”  
> **Barnet:** “Du började ju ändå.”  
> **Alve:** “Ja.”  
> **Alve:** “Men jag hade aldrig klarat det själv.”  
> **Alve:** “Inte stugan. Inte bryggan. Inte båten. Inget av det.”  
> **Barnet:** “Tur att jag kom då.”  
> **Alve:** “Ja.”  
> **Alve:** “Väldigt tur.”  
> **Alve:** “Tack.”  
> **Barnet:** “Det är ju det kompisar gör.”  
> **Alve:** “Mm.”  
> **Alve:** “Då är jag glad att du är min kompis.”

Barnet ler.

> **Barnet:** “Jag sa ju att de kanske skulle göra det.”  
> **Alve:** “Du sa att du hoppades.”  
> **Barnet:** “Nästan samma sak.”

Alve tittar ut över sjön.

> **Alve:** “Vet du vad jag tänkt på?”  
> **Barnet:** “Det låter farligt.”  
> **Alve:** “Andra sidan.”  
> **Barnet:** “Vad finns där?”  
> **Alve:** “Jag minns inte riktigt.”  
> **Barnet:** “Har du varit där?”  
> **Alve:** “När jag var mindre. Med familjen.”  
> **Barnet:** “Och du kommer inte ihåg?”  
> **Alve:** “Lite.”  
> **Barnet:** “Vad minns du?”  
> **Alve:** “Träd.”  
> **Barnet:** “Starkt.”  
> **Alve:** “Vatten.”  
> **Barnet:** “Vi står vid en sjö.”  
> **Alve:** “Jag försöker.”

Barnet skrattar. Alve kliver ner i båten.

> **Alve:** “Det finns bara ett sätt att ta reda på det.”

Du tittar på honom.

> **Barnet:** “Är det här en av dina planer?”  
> **Alve:** “Ja.”  
> **Barnet:** “Har den fler delar den här gången?”

Alve tittar på motorn.

> **Alve:** “Starta båten.”

Han pekar ut över sjön.

> **Alve:** “Åk ditåt.”  
> **Barnet:** “Två delar.”  
> **Alve:** “Jag blir bättre.”

Barnet kliver ner i båten.

Från stugan hörs pappan ropa:

> **Pappan:** “Inte för långt!”

Alve tittar på Barnet.

> **Alve:** “Det där känner jag igen.”  
> **Barnet:** “Kommer du lyssna?”  
> **Alve:** “Självklart.”

Paus.

> **Alve:** “Ungefär.”

Motorn startar.

Båten lämnar bryggan.

Barnet tittar tillbaka mot stugan, bryggan och hela platsen ni byggt upp tillsammans. Alve tittar framåt.

> **Barnet:** “Redo?”  
> **Alve:** “Japp.”  
> **Barnet:** “Vart åker vi?”

Alve ler.

> **Alve:** “Vi får se.”

Båten fortsätter ut över sjön.

Sedan svart.

## SLUT PÅ ANDRA KAPITLET

The act therefore ends with **Barnet and Alve physically leaving in the restored motorboat**. Do not stop on a “someday” promise or a stationary teaser. The first departure itself is the final authored image/action of Act 2.

### Alve after Act 2 and the other side of the lake
After the motorboat is restored, **Alve becomes the permanent boat driver/transport character**. Alve + motorboat form the authored transport link from the lake to a future area on the other side and back again.

Produce/use a reusable Story Moment/cinematic scene of **Adam and Alve travelling in the motorboat**. The same visual can carry different dialogue in future story states. The first crossing may later contain Act 3 introduction dialogue; routine later crossings can use shorter contextual dialogue.

Act 2 may subtly seed curiosity about the **other side of the lake**, but the destination itself is explicitly undefined. Hints must remain destination-neutral and still make sense regardless of what Act 3 eventually becomes. Allowed grammar includes vague family memories, traces of old trips, uncertain remarks or unexplained objects. Do not name, depict or promise a specific destination until Act 3 is designed.

Canonical rule: **the mystery exists; the answer is not canon yet.**

## Bryggan restoration arc — LOCKED 2026-09-28

Bryggan uses the canonical **4 + 4 + 4 + 4 = 16 authoritative real-world contributions**. Its identity is bad, vila, kompisar och sommarliv. The arc moves from repairing unsafe timber to making a place people actually want to use. The life-buoy purchase is an intermediate economy/story beat and never substitutes for a contribution.

### Stugan dialogue lock — beats 1–3

These scenes are project-order independent and must not refer to Bryggan or Båthuset as already completed.

**1/16 — Vi börjar här**

Ni öppnar stugan ordentligt. Luften står stilla och det luktar damm, trä och gammal sommar.

> **Barnet:** “Det luktar konstigt här inne.”  
> **Alve:** “Det luktar stuga.”  
> **Barnet:** “Är stuglukt mest damm?”  
> **Alve:** “Damm, trä… gamla filtar. Och lite så där instängt.”  
> **Barnet:** “Det låter inte som en särskilt bra reklam.”  
> **Alve:** “Du skulle fattat om du varit här förut.”

Alve går in som om kroppen minns vägen. Han flyttar en stol, kliver över en låda och tittar mot ett tomt hörn.

> **Barnet:** “Du hittar rätt bra här.”  
> **Alve:** “Jag har varit här typ en miljard gånger.”  
> **Alve:** “Eller… var.”  
> **Barnet:** “När då?”  
> **Alve:** “Varje sommar nästan. Vi kom hit tidigt och åkte hem sent. Ibland sov vi här hur länge som helst.”  
> **Barnet:** “Så du kan hela huset utantill?”  
> **Alve:** “Nästan.”  
> **Alve:** “Soffan stod där.”  
> **Barnet:** “Det finns ingen soffa.”  
> **Alve:** “Nej, men det gjorde.”  
> **Alve:** “Bordet stod där. Och där brukade vi lägga handdukar.”  
> **Barnet:** “Varför?”  
> **Alve:** “För att vi kom direkt från sjön.”  
> **Barnet:** “Och vuxna tyckte det var en bra idé?”  
> **Alve:** “Absolut inte.”  
> **Barnet:** “Gjorde ni det ändå?”  
> **Alve:** “Varje gång.”

Ni börjar bära ut gamla saker och öppna fönstren.

> **Barnet:** “Det här är mer jobb än jag trodde.”  
> **Alve:** “Det ser värre ut än det är.”  
> **Barnet:** “Det där låter som något man säger precis innan man hittar ännu mer jobb.”  
> **Alve:** “Eller precis innan allt går jättebra.”  
> **Barnet:** “Vilket tror du på?”  
> **Alve:** “Det andra.”  
> **Alve:** “Kom igen. Vi börjar här.”

**2/16 — Märkena på väggen**

När ni flyttar undan en gammal möbel syns flera bleka streck och små namn på dörrkarmen.

> **Barnet:** “Vänta.”  
> **Alve:** “Vad?”  
> **Barnet:** “Det är något på väggen.”  
> **Alve:** “De är kvar.”  
> **Barnet:** “Vad är det?”  
> **Alve:** “Märkena.”  
> **Alve:** “Den där är jag.”  
> **Barnet:** “Du var jätteliten.”  
> **Alve:** “Jag var jätteliten.”  
> **Barnet:** “Du är fortfarande ganska liten.”  
> **Alve:** “Tyst.”

Barnet följer strecken uppåt.

> **Barnet:** “Är alla dina?”  
> **Alve:** “Nej. Några är mina. Några är familjens.”  
> **Barnet:** “Gjorde ni nya varje sommar?”  
> **Alve:** “När någon kom ihåg.”  
> **Alve:** “Den där sommaren trodde jag att jag hade blivit jättelång.”  
> **Barnet:** “Hade du det?”  
> **Alve:** “Tre centimeter.”  
> **Barnet:** “Imponerande.”  
> **Alve:** “Jag var väldigt stolt.”  
> **Barnet:** “Så hela familjen finns typ kvar här.”  
> **Alve:** “Lite.”

Alve stryker försiktigt med fingret över ett av märkena.

> **Alve:** “Vi målar inte över dem.”  
> **Barnet:** “Nej.”  
> **Alve:** “Inte ens om resten av väggen ser konstig ut.”  
> **Barnet:** “Då får den vara konstig.”  
> **Alve:** “Bra.”  
> **Barnet:** “Vi kan fixa runtomkring.”  
> **Alve:** “Exakt.”  
> **Alve:** “De får vara kvar.”

**3/16 — Fotot**

När ni fortsätter röja lossnar en gammal kartong från väggen. Bakom den ligger ett blekt fotografi.

> **Barnet:** “Jag hittade något.”  
> **Alve:** “Om det är en spindel så är den din.”  
> **Barnet:** “Det är ett foto.”  
> **Alve:** “Får jag se?”  
> **Barnet:** “Är det din familj?”  
> **Alve:** “Mm.”  
> **Barnet:** “Är det här nere vid sjön?”  
> **Alve:** “Ja. Där borta vid vattnet.”  
> **Barnet:** “Och det där är du?”  
> **Alve:** “Japp.”  
> **Barnet:** “Du hade väldigt konstiga badbyxor.”  
> **Alve:** “Det där var inte mitt beslut.”  
> **Barnet:** “Säkert.”  
> **Alve:** “Jag var ett barn. Jag hade ingen kontroll.”  
> **Barnet:** “Du är ett barn nu också.”  
> **Alve:** “Nu har jag bättre badbyxor.”

Barnet tittar på fotot igen.

> **Barnet:** “Ni ser glada ut.”  
> **Alve:** “Vi var här hela tiden då.”  
> **Barnet:** “Varje sommar?”  
> **Alve:** “Nästan.”  
> **Barnet:** “Vad gjorde ni?”  
> **Alve:** “Badade. Åt frukost ute. Grillade. Spelade kort.”  
> **Alve:** “Någon brukade alltid bränna korven.”  
> **Barnet:** “Vem?”  
> **Alve:** “Jag tänker inte skvallra.”  
> **Barnet:** “Det var du.”  
> **Alve:** “Jag fick inte ens grilla.”  
> **Barnet:** “Det låter rätt bra.”  
> **Alve:** “Det var det.”  
> **Barnet:** “Vad hände sen?”

Alve tittar på fotot lite längre.

> **Alve:** “Mamma blev sjuk.”  
> **Barnet:** “Jaha.”  
> **Alve:** “Efter det kom vi nästan aldrig hit.”  
> **Barnet:** “Varför inte?”  
> **Alve:** “Jag vet inte riktigt.”  
> **Alve:** “Pappa ville inte.”  
> **Barnet:** “Och du?”  
> **Alve:** “Jag ville.”

Barnet låter bilden vila i handen en stund.

> **Barnet:** “Vi kan sätta upp fotot igen.”  
> **Alve:** “Här?”  
> **Barnet:** “Ja. När vi har fixat väggen.”  
> **Alve:** “Så man kan se det?”  
> **Barnet:** “Precis.”  
> **Alve:** “Bra.”  
> **Barnet:** “Bredvid märkena kanske.”  
> **Alve:** “Ja.”


### Contributions 1–4: the real problem / Linus and Recycling

**1 — Start clearing.** Adam and Alve clear loose debris and damaged boards. Alve initially treats it as an easy plank-replacement job.

**2 — Worse underneath.** More of the old support/timber is rotten than expected. The project now clearly needs sound replacement material rather than cosmetic patching.

**3 — Linus and salvage.** The need sends them naturally to Linus/Återvinningen. Linus helps choose reusable timber/material and comes to the lake with/helping deliver it. His reaction to the old place is brief and restrained: the lake used to matter to the village, but this is not a lore dump.

**4 — First real repair.** Adam and Alve use the salvaged material for the first substantial structural repair. **Bryggan 1/4→2/4.** Salvage can remain visible at the worksite as intermediate feedback.

### Stugan dialogue lock — beats 4–6

**4/16 — Som förr**

Ni har fått undan mycket av skräpet. För första gången går det att se hur stugan faktiskt skulle kunna bli igen.

> **Barnet:** “Det börjar ju faktiskt se bra ut.”

Alve tittar runt, men ser inte riktigt nöjd ut.

> **Alve:** “Inte tillräckligt.”  
> **Barnet:** “Inte tillräckligt för vad?”

Alve svarar inte direkt.

> **Barnet:** “Alve?”  
> **Alve:** “Jag tänkte att om det såg ut som förr…”  
> **Alve:** “…så kanske de skulle vilja komma hit igen.”  
> **Barnet:** “Din familj?”  
> **Alve:** “Mm.”  
> **Barnet:** “Är det därför du försökte fixa allt själv?”  
> **Alve:** “Jag tänkte att det kanske skulle gå.”  
> **Barnet:** “Allt det här?”  
> **Alve:** “Jag hade inte riktigt tittat på allt samtidigt.”  
> **Barnet:** “Det var kanske smart.”  
> **Alve:** “Det var väldigt smart tills du kom och började peka på saker.”

Barnet ler lite.

> **Barnet:** “Tror du det räcker om det blir som förr?”

Alve tittar runt igen.

> **Alve:** “Jag vet inte.”  
> **Barnet:** “Men du hoppas.”  
> **Alve:** “Ja.”  
> **Alve:** “Det var bra här då.”  
> **Barnet:** “Då gör vi det bra här igen.”  
> **Alve:** “Som förr?”

Barnet tittar på märkena, fotot och allt ni redan hunnit fixa.

> **Barnet:** “Kanske.”  
> **Barnet:** “Eller bra på något annat sätt.”

Alve funderar på det.

> **Alve:** “Vi kan börja med att få dörren att gå att stänga.”  
> **Barnet:** “Det känns rimligt.”

**5/16 — Det gamla spelet**

När ni går igenom ett skåp hittar Alve en sliten låda längst in.

> **Alve:** “Nej.”  
> **Barnet:** “Vad?”

Alve drar fram lådan.

> **Alve:** “Den här finns kvar.”  
> **Barnet:** “Vad är det?”  
> **Alve:** “Ett spel.”  
> **Barnet:** “Det ser väldigt gammalt ut.”  
> **Alve:** “Tack.”  
> **Barnet:** “Jag menade spelet.”  
> **Alve:** “Bra.”

Han öppnar lådan. Några delar ligger huller om buller.

> **Barnet:** “Är allt med?”  
> **Alve:** “Ingen aning.”  
> **Barnet:** “Bra början.”  
> **Alve:** “Vi spelade det här hela tiden när det regnade.”  
> **Barnet:** “Var det kul?”  
> **Alve:** “Ibland.”  
> **Barnet:** “Det låter inte så övertygande.”  
> **Alve:** “Det blev mest bråk.”  
> **Barnet:** “Om spelet?”  
> **Alve:** “Om reglerna.”  
> **Barnet:** “Vilka regler?”  
> **Alve:** “Exakt.”

Barnet tittar misstänksamt på honom.

> **Barnet:** “Du hittade på regler.”  
> **Alve:** “Nej.”  
> **Barnet:** “Du ser ut som någon som hittar på regler när du håller på att förlora.”  
> **Alve:** “Det där är en väldigt allvarlig anklagelse.”  
> **Barnet:** “Är den fel?”

Alve börjar lägga tillbaka delarna i lådan.

> **Alve:** “Det viktiga är att spelet fortfarande finns.”  
> **Barnet:** “Det där var inte ett svar.”  
> **Alve:** “Det var ett mycket bättre ämne.”  
> **Barnet:** “Ska vi behålla det?”  
> **Alve:** “Ja.”  
> **Barnet:** “Även om delar saknas?”  
> **Alve:** “Vi kan fixa det.”  
> **Barnet:** “Du säger det om väldigt många saker.”  
> **Alve:** “Och nu är vi två.”

**6/16 — Golvet är lava**

När ni fortsätter flytta möbler börjar Alve plötsligt undvika en del av golvet.

> **Barnet:** “Vad gör du?”  
> **Alve:** “Inget.”

Alve kliver från en stol till en gammal låda.

> **Barnet:** “Du går inte på golvet.”  
> **Alve:** “Jag går på vissa delar av golvet.”  
> **Barnet:** “Varför?”  
> **Alve:** “För att de andra är lava.”  
> **Barnet:** “Är du seriös?”  
> **Alve:** “Extremt.”  
> **Barnet:** “Vi håller på att renovera en stuga.”  
> **Alve:** “Ja.”  
> **Barnet:** “Och nu är golvet lava.”  
> **Alve:** “Det brukade vara det.”  
> **Barnet:** “Hur visste man vilka delar som var lava?”  
> **Alve:** “Man bara visste.”  
> **Barnet:** “Det låter väldigt rättvist.”  
> **Alve:** “Det var det inte.”

Alve tar sig över till andra sidan.

> **Barnet:** “Lekte ni så här när du var liten?”  
> **Alve:** “Japp. Från soffan till stolen, sen till mattan och upp på trappsteget.”  
> **Barnet:** “Och om man trampade fel?”  
> **Alve:** “Då dog man.”  
> **Barnet:** “Hårt.”  
> **Alve:** “Man fick börja om efter ungefär fem sekunder.”  
> **Barnet:** “Mindre hårt.”

Alve tittar tillbaka på Barnet.

> **Alve:** “Kommer du eller?”  
> **Barnet:** “Jag tänker använda golvet.”  
> **Alve:** “Fegt.”

Barnet tar ett steg mot honom och stannar.

> **Barnet:** “Vilken del var säker?”

Alve ler.

> **Alve:** “Jag visste det.”

Barnet kliver upp på en låda.

> **Barnet:** “Om jag ramlar är det ditt fel.”  
> **Alve:** “Om du ramlar i lava har vi större problem.”

Ni tar er genom rummet mellan möbler och lådor.

> **Barnet:** “Det här var faktiskt ganska kul.”  
> **Alve:** “Jag vet.”  
> **Barnet:** “Säg inget.”  
> **Alve:** “För sent.”


### Contributions 5–8: make it a bathing place / Sol / life buoy

**5 — The water becomes tempting.** With the worst first section repaired, Alve immediately starts talking about swimming. Adam and Alve clear the approach/edge and discover that making a dock physically stronger is not the same as making the bathing area ready for people.

**6 — Sol inspects.** Sol hears that the children intend to swim and visits in her professional role. She performs a simple, age-appropriate safety check: access into/out of the water and old sharp/rubbish debris around the bathing edge. No injury or manufactured emergency occurs. Sol identifies two jobs: clear the bathing area and add a proper life buoy.

This unlocks the intermediate story/economy chain: **life buoy appears at Mira → Adam buys it with authoritative SysselBux → returns to lake.** The locked price is **200 SysselBux**. The purchase is not contribution 7.

**7 — Make Sol's checklist real.** Adam and Alve clear the bathing edge/shoreline and finish the practical safety cleanup. The purchased life buoy is brought to the site and can be staged ready for mounting. Sol need not supervise the work.

**8 — Ready for people.** The life buoy is mounted permanently and the next substantial restoration step is completed. **Bryggan 2/4→3/4.** Alve's focus shifts from “we are fixing a broken dock” to “people can actually be here soon.”

### Stugan dialogue lock — beats 7–9

**7/16 — Regnet**

Ni har hunnit jobba en stund när regnet börjar slå mot rutorna. Först försiktigt, sedan ordentligt.

> **Barnet:** “Det där låter inte som ett litet regn.”  
> **Alve:** “Nej.”

Alve tittar ut genom fönstret.

> **Alve:** “Vi kommer ingenstans på ett tag.”  
> **Barnet:** “Vi kan fortsätta här inne.”  
> **Alve:** “Vi har flyttat nästan allt som går att flytta utan att något rasar.”  
> **Barnet:** “Så vad gör man i en stuga när det regnar?”

Alve tittar mot det gamla spelet.

> **Alve:** “Jag har en idé.”  
> **Barnet:** “Det där brukar vara farliga ord.”  
> **Alve:** “Inte den här gången.”  
> **Barnet:** “Det sa du säkert när du hittade på reglerna också.”  
> **Alve:** “Jag hittade inte på regler.”

Ni sätter er på golvet med spelet mellan er. Valpen kryper ihop bredvid.

Efter en stund flyttar Alve en pjäs.

> **Barnet:** “Du fuskar.”  
> **Alve:** “Nej.”  
> **Barnet:** “Du flyttade den där.”  
> **Alve:** “Det gjorde vinden.”

Barnet tittar mot de stängda fönstren.

> **Barnet:** “Vi är inomhus.”  
> **Alve:** “Jättekonstig vind.”  
> **Barnet:** “Flytta tillbaka den.”  
> **Alve:** “Då förstör du naturens gång.”  
> **Barnet:** “Alve.”  
> **Alve:** “Okej då.”

Ni fortsätter spela. Efter en stund blir Alve tyst och lyssnar.

> **Barnet:** “Vad?”  
> **Alve:** “Inget.”  
> **Barnet:** “Du slutade fuska. Något är fel.”  
> **Alve:** “Jag fuskar fortfarande inte.”  
> **Alve:** “Det låter likadant.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Regnet.”  
> **Barnet:** “Som när ni brukade vara här?”  
> **Alve:** “Mm.”  
> **Barnet:** “Var ni också fast inne då?”  
> **Alve:** “Hela tiden.”  
> **Barnet:** “Och då spelade ni det här?”  
> **Alve:** “Ja.”  
> **Barnet:** “Och fuskade?”  
> **Alve:** “Vi har redan pratat om det här.”

Barnet ler. Regnet fortsätter mot rutorna.

**8/16 — Det ser bättre ut**

Regnet har slutat. Ni står mitt i rummet och tittar på hur mycket som redan förändrats. Spelet ligger kvar framme.

> **Barnet:** “Det känns annorlunda här nu.”  
> **Alve:** “Ja.”  
> **Barnet:** “För att vi har fixat mer?”

Alve tittar runt.

> **Alve:** “Inte bara.”  
> **Barnet:** “Vad då?”  
> **Alve:** “Jag vet inte.”  
> **Alve:** “När vi började tänkte jag mest på hur det såg ut förut.”  
> **Barnet:** “Och nu?”  
> **Alve:** “Nu tänker jag på idag också.”

Barnet tittar mot spelet.

> **Barnet:** “När du fuskade?”  
> **Alve:** “När vinden flyttade min pjäs.”  
> **Barnet:** “Just det.”

Ni börjar ställa tillbaka några saker på sina platser.

> **Barnet:** “Ser det ut som förr nu?”

Alve stannar upp och tittar runt ordentligt.

> **Alve:** “Nej.”

Barnet väntar. Alve ler lite.

> **Alve:** “Det ser bättre ut.”  
> **Barnet:** “Bättre än förr?”  
> **Alve:** “Annorlunda bättre.”  
> **Barnet:** “Det låter väldigt praktiskt.”  
> **Alve:** “Det är en riktig sorts bättre.”  
> **Barnet:** “Bra.”

Alve flyttar försiktigt spelet till en hylla där det får stå kvar.

> **Alve:** “Vi ställer det här.”  
> **Barnet:** “Så vi hittar det nästa gång det regnar?”  
> **Alve:** “Precis.”  
> **Barnet:** “Och nästa gång spelar vi med riktiga regler.”  
> **Alve:** “Vi får se.”

**9/16 — VÅR STUGA**

När ni går igenom en gammal låda hittar Barnet ett vikt papper längst ner.

> **Barnet:** “Vad är det här?”  
> **Alve:** “Ingen aning.”

Barnet vecklar försiktigt ut pappret. Det är en gammal barnteckning av stugan, sjön, familjen och en alldeles för stor båt. Överst står det med stora bokstäver: **VÅR STUGA**.

> **Barnet:** “Den här är fantastisk.”  
> **Alve:** “Nej.”  
> **Barnet:** “Jo.”  
> **Alve:** “Lägg tillbaka den.”  
> **Barnet:** “Är det där du?”  
> **Alve:** “Nej.”

Barnet pekar.

> **Barnet:** “Det står Alve bredvid.”  
> **Alve:** “…någon annan Alve.”  
> **Barnet:** “Som också bodde här?”  
> **Alve:** “Tydligen.”  
> **Barnet:** “Och hade exakt din familj?”  
> **Alve:** “Väldigt vanligt namn.”

Barnet studerar bilden.

> **Barnet:** “Varför är båten nästan lika stor som stugan?”  
> **Alve:** “Perspektiv.”  
> **Barnet:** “Den ligger på gräset.”  
> **Alve:** “Konst behöver inte förklara sig.”

Barnet pekar på figurerna framför huset.

> **Barnet:** “Är ni här ute?”

Alve tittar.

> **Alve:** “På verandan.”  
> **Barnet:** “Den ser större ut på bilden.”  
> **Alve:** “Jag ritade den så som den borde vara.”  
> **Barnet:** “Smart.”

Alve tar teckningen och granskar den längre.

> **Alve:** “Vi brukade äta frukost där.”  
> **Barnet:** “På verandan?”  
> **Alve:** “Mm. Och fika. Och ibland middag.”  
> **Barnet:** “Ni gjorde mycket ätande.”  
> **Alve:** “Det var en viktig del av semestern.”

Barnet tittar på teckningen igen.

> **Barnet:** “Vem sparade den här?”  
> **Alve:** “Mamma.”  
> **Barnet:** “Till och med den här?”  
> **Alve:** “Hon sparade allt.”  
> **Barnet:** “Allt?”  
> **Alve:** “Typ. Särskilt sånt hon trodde att jag skulle skämmas för senare.”  
> **Barnet:** “Smart.”  
> **Alve:** “Nej.”

Han pekar på dörren på teckningen.

> **Alve:** “Jag sprang alltid ut härifrån ner mot sjön.”  
> **Barnet:** “Med skor?”  
> **Alve:** “Aldrig.”  
> **Barnet:** “Varför inte?”  
> **Alve:** “Det tog för lång tid.”  
> **Barnet:** “Hur lång tid tar det att ta på skor?”  
> **Alve:** “Exakt. För lång tid.”

Barnet tittar från teckningen mot den slitna verandan utanför.

> **Barnet:** “Vi borde fixa den.”  
> **Alve:** “Verandan?”  
> **Barnet:** “Ja.”  
> **Alve:** “Som på bilden?”  
> **Barnet:** “Kanske inte exakt.”

Barnet tittar på den gigantiska båten.

> **Barnet:** “Jag vet inte om vi har plats.”

Alve skrattar.

> **Alve:** “Verandan först.”


### Contributions 9–12: the lake starts attracting people again

**9 — Prepare the summer end of the dock.** Adam and Alve improve the usable/social part of the jetty: clear remaining clutter and make space to sit, leave towels or climb out after swimming. Keep this as ordinary restoration rather than inventing a new purchased furniture system.

**10 — First visitor.** One established village resident arrives while work is still unfinished and reacts to seeing the place coming back. The visitor should be selected as authored content rather than random ambience at this point. The key story fact is that somebody comes to the lake **because Adam and Alve are restoring it**. This is the first proof that the project is changing village behaviour before completion.

**11 — First proper water break.** Adam and Alve finally take a short break at the usable section of the jetty. This is not the full completed-lake swimming ensemble. It is a small friendship beat: the place they have spent so long repairing can already give them something back. The puppy can remain ashore/nearby as appropriate.

**12 — From worksite toward summer place.** They finish the remaining major mid-stage repair and tidy the social/bathing area. **Bryggan 3/4→4/4 visually**, while final completion still requires the last four contributions. The dock now looks nearly finished and residents can plausibly talk about using it, but the permanent ambient pool remains locked.

### Stugan dialogue lock — beats 10–12

**10/16 — Verandan**

Ni börjar plocka undan runt verandan. Teckningen ligger framme som en liten ritning, trots att proportionerna är helt hopplösa.

> **Barnet:** “Så här såg den ut?”  
> **Alve:** “Ungefär.”  
> **Barnet:** “På teckningen är den dubbelt så stor.”  
> **Alve:** “Jag ritade efter känsla.”  
> **Barnet:** “Du hade mycket känsla.”  
> **Alve:** “Jag hade stora planer.”

Ni börjar flytta bort gammalt bråte och lösa plankor.

> **Barnet:** “Vad gjorde ni här ute?”  
> **Alve:** “Åt frukost.”  
> **Barnet:** “Det vet jag.”  
> **Alve:** “Fikade.”  
> **Barnet:** “Det vet jag också.”  
> **Alve:** “Ibland satt vi bara här.”  
> **Barnet:** “Och gjorde vad?”  
> **Alve:** “Inget särskilt.”

Du tittar på honom.

> **Barnet:** “Det låter ganska tråkigt.”  
> **Alve:** “Nej.”  
> **Barnet:** “Vad gjorde man när man gjorde inget särskilt?”  
> **Alve:** “Pratade. Tittade på sjön. Någon drack kaffe. Någon sa åt mig att inte springa med blöta fötter.”  
> **Barnet:** “Gjorde du det ändå?”  
> **Alve:** “Självklart.”  
> **Barnet:** “Det börjar finnas ett mönster här.”  
> **Alve:** “Jag var konsekvent.”

Ni får loss en gammal bräda och hittar mer av verandans ursprungliga kant.

> **Barnet:** “Här fortsätter den.”  
> **Alve:** “Jag visste det.”  
> **Barnet:** “Nej, det gjorde du inte.”  
> **Alve:** “Jag hoppades väldigt självsäkert.”

Barnet skrattar.

> **Barnet:** “Vi kan göra plats för bord här igen.”  
> **Alve:** “Och stolar.”  
> **Barnet:** “Och frukost.”  
> **Alve:** “Och fika.”  
> **Barnet:** “Du har prioriteringar.”  
> **Alve:** “Bra prioriteringar.”

**11/16 — Vet de om det här?**

Ni fortsätter arbeta ute på verandan. För första gången börjar den faktiskt kännas som en plats där någon skulle kunna sitta igen.

> **Barnet:** “Alve?”  
> **Alve:** “Mm?”  
> **Barnet:** “Vet din familj att du gör det här?”

Alve fortsätter med det han håller på med.

> **Alve:** “Inte riktigt.”  
> **Barnet:** “Inte riktigt?”  
> **Alve:** “De vet att stugan finns.”  
> **Barnet:** “Det hoppas jag.”  
> **Alve:** “Jag menar att de inte vet att jag håller på och fixar den.”  
> **Barnet:** “Så det är en överraskning?”

Alve tvekar.

> **Alve:** “Typ.”  
> **Barnet:** “En väldigt stor överraskning.”  
> **Alve:** “Ja.”  
> **Barnet:** “Tänk om de kommer hit innan vi är klara.”

Alve stannar upp.

> **Alve:** “Det gör de nog inte.”  
> **Barnet:** “Hur vet du det?”  
> **Alve:** “Pappa kommer inte hit längre.”  
> **Barnet:** “Sen din mamma blev sjuk?”  
> **Alve:** “Mm.”  
> **Barnet:** “Varför?”  
> **Alve:** “Jag vet inte riktigt.”  
> **Alve:** “Jag tror det är svårt för honom.”  
> **Barnet:** “Att vara här?”  
> **Alve:** “Ja.”

Barnet låter det vara en stund.

> **Barnet:** “Och när vi är klara?”  
> **Alve:** “Då kanske.”  
> **Barnet:** “Har du tänkt säga till dem?”  
> **Alve:** “Jag vet inte.”  
> **Barnet:** “Hur ska de veta att den är klar annars?”  
> **Alve:** “Jag har inte kommit så långt i planen.”  
> **Barnet:** “Du och dina planer.”  
> **Alve:** “De blir bättre.”  
> **Barnet:** “Gör de?”  
> **Alve:** “Den här har ju dig nu.”

Barnet tystnar lite.

> **Barnet:** “Det var faktiskt ett ganska bra svar.”  
> **Alve:** “Jag vet.”

Ni fortsätter arbeta.

**12/16 — Någon har varit här**

När ni kommer tillbaka till stugan nästa gång står något inte riktigt som ni lämnade det.

> **Barnet:** “Var den där lådan där förut?”  
> **Alve:** “Nej.”

Ni går in. Det är inget stort. Ingen dörr står öppen, inget är förstört. Men något känns annorlunda.

Barnet ser något på golvet.

> **Barnet:** “Vad är det?”

Alve böjer sig ner och plockar upp en liten nyckelring. Han stannar.

> **Alve:** “Den här är inte härifrån.”  
> **Barnet:** “Varifrån är den då?”  
> **Alve:** “Hemma.”  
> **Barnet:** “Hemma hos dig?”  
> **Alve:** “Ja.”

Barnet tittar mot dörren.

> **Barnet:** “Så någon har varit här.”

Alve säger inget först. Sedan tittar han runt i stugan.

> **Alve:** “De har varit här.”  
> **Barnet:** “Det verkar så.”  
> **Alve:** “Då såg de den.”  
> **Barnet:** “Stugan?”  
> **Alve:** “Ja.”  
> **Alve:** “Och allt vi har gjort.”  
> **Barnet:** “Ja.”

Alve tittar ut mot verandan.

> **Alve:** “Då måste vi hinna klart.”  
> **Barnet:** “Innan vad?”

Alve svarar inte direkt.

> **Alve:** “Bara… innan.”  
> **Barnet:** “Tror du de kommer tillbaka?”

Alve tittar på nyckelringen.

> **Alve:** “Jag vet inte.”  
> **Barnet:** “Men du tror det.”  
> **Alve:** “Jag hoppas.”

Han stoppar nyckelringen försiktigt i fickan.

> **Alve:** “Kom igen.”  
> **Barnet:** “Nu igen?”  
> **Alve:** “Nu på riktigt.”  
> **Barnet:** “Vad gjorde vi innan?”  
> **Alve:** “Övade.”


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

### Bryggan post-completion finisher — LOCKED CONCEPT

After JETTY-16 is completed, the next visit/day should pay off the entire social arc with a dedicated illustrated Story Moment: **the restored jetty is now full of village life.** This is not another contribution and does not delay completion. It is the emotional/social finisher showing that Adam and Alve really succeeded in bringing people back to the lake.

The scene should take place the **next day**, not immediately in the same completion moment. The restored stage-4 jetty and permanent life buoy remain authoritative. Several established Act 1 residents are swimming, sitting, talking or relaxing around the jetty, with Adam and Alve seeing the result of their work. Keep the ensemble natural rather than posed like a group portrait. The image should feel like an ordinary summer day that would not have happened before the restoration.

This finisher is **separate from the later controlled-random ambient pool**. It is a one-time authored payoff image. Afterward, normal repeat visits may use the controlled-random empty/resident combinations already defined for the completed jetty.


### Bryggan dialogue lock — beats 1–8

Scene descriptions address the player as **ni**. Barnet is the Act 1 continuity bridge to village residents Alve may not yet know.

**1/16 — Vi börjar röja**  
Image: `01-early-restoration.png`.

> **Alve:** “Det här ser faktiskt ganska enkelt ut. Vi river bort de dåliga plankorna, sätter dit nya och sen är det klart.”  
> **Barnet:** “Du låter väldigt säker.”  
> **Alve:** “Jag har tittat på bryggan typ hundra gånger. Det är bara trä.”  
> **Barnet:** “Det brukar vara då saker går fel.”  
> **Alve:** “Inte den här gången. Den här gången har jag en plan.”  
> **Barnet:** “Vad är planen?”  
> **Alve:** “Att börja där.”  
> **Barnet:** “Det där är inte en plan.”  
> **Alve:** “Det är början på en plan.”  
>  
> Ni sätter igång och börjar dra bort lösa plankor och skräp.  
>  
> **Alve:** “Ser du? Det går ju bra.”  
> **Barnet:** “Vi har jobbat i två minuter.”  
> **Alve:** “Exakt. Och inget har gått sönder ännu.”

**2/16 — Det är värre under**  
Reuse: `01-early-restoration.png`.

När ni fått bort mer av ytan syns de ruttna stöden undertill.

> **Barnet:** “Alve, kom och titta på det här.”  
> **Alve:** “Vad är det?”  
> **Barnet:** “Jag tror inte det bara är plankorna.”  
> **Alve:** “Den där är rutten.”  
> **Barnet:** “Mm.”  
> **Alve:** “Och den där också.”  
> **Barnet:** “Mm.”  
> **Alve:** “Okej. Den där med.”  
> **Barnet:** “Fortfarande bara trä?”  
> **Alve:** “Det är väldigt mycket trä.”  
> **Barnet:** “Och ganska lite av det verkar vilja vara en brygga längre.”  
> **Alve:** “Vi kan inte bara lägga nya plankor ovanpå det här.”  
> **Barnet:** “Nej. Vi behöver nytt virke. Bra virke.”  
> **Alve:** “Har du något sånt?”  
> **Barnet:** “Inte jag. Men jag känner någon som brukar kunna hitta användbara grejer bland gammalt material.”  
> **Alve:** “Vem då?”  
> **Barnet:** “Linus. Han håller till vid Återvinningen.”  
> **Alve:** “Tror du han har virke?”  
> **Barnet:** “Om någon har det, så är det nog Linus.”  
> **Alve:** “Okej. Då frågar vi honom.”

**3/16 — Linus och återbruket**  
Image: `02-linus-salvaged-timber.png`.

Linus kommer ner med användbart virke från Återvinningen. Alve behöver inte ha träffat honom tidigare.

> **Linus:** “Jag började misstänka att ni inte menade två plankor när ni bad om hjälp.”  
> **Barnet:** “Vi trodde att det var två plankor.”  
> **Alve:** “Jag trodde det.”  
> **Linus:** “Det förklarar saken.”  
> **Linus:** “Det här har stått blött alldeles för länge. Ni hade kunnat lägga nytt ovanpå, men då hade ni fått göra om allt igen ganska snart.”  
> **Alve:** “Så du har något bättre?”  
> **Linus:** “Jag har sådant som redan haft ett liv och fortfarande har ett kvar.”  
> **Barnet:** “Återbruk.”  
> **Linus:** “Precis. Det fina med gammalt material är att man redan vet vad det klarar.”  
> **Barnet:** “Har du varit här mycket?”  
> **Linus:** “Förr.”  
> **Alve:** “Hur mycket är ‘förr’?”  
> **Linus:** “När den där bryggan fortfarande höll och Henning hade mer hår.”  
> **Barnet:** “Var alla här nere då?”  
> **Linus:** “Ganska ofta. Bad, fika, fiske. Sånt som händer när en plats faktiskt används.”  
> **Linus:** “Sen slutade folk komma. Och när folk slutar komma märker ingen när saker börjar gå sönder.”  
> **Alve:** “Då får vi väl få folk att börja komma igen.”  
> **Linus:** “Börja med att få bryggan att stå kvar.”  
> **Alve:** “Detaljer.”

**4/16 — Första riktiga lagningen**  
Reuse: `02-linus-salvaged-timber.png`; runtime stage 1/4→2/4 after the scene.

> **Alve:** “Det här känns redan mycket bättre.”  
> **Barnet:** “Vi har inte ens satt dit allt än.”  
> **Alve:** “Nej, men nu har vi plankor som inte går sönder när man tittar på dem.”  
> **Linus:** “Det där kommer hålla.”  
> **Alve:** “Hörde du?”  
> **Barnet:** “Ja.”  
> **Alve:** “Han sa att det kommer hålla.”  
> **Linus:** “Jag sa inte att ni var klara.”  
> **Alve:** “Du måste lära dig att fira små segrar, Linus.”  
> **Linus:** “Och du måste lära dig skillnaden på en liten seger och en färdig brygga.”  
> **Alve:** “Den rör sig nästan inte alls.”  
> **Barnet:** “Nästan?”  
> **Alve:** “Okej. Då fortsätter vi lite till.”  
> **Linus:** “Nu har ni i alla fall något att bygga vidare på.”  
> **Alve:** “Det var exakt det jag tänkte säga.”  
> **Linus:** “Naturligtvis.”

**5/16 — Det börjar se badbart ut**  
LIVE over runtime jetty stage 2.

> **Alve:** “Vet du vad som är det bästa med en brygga?”  
> **Barnet:** “Att den inte ramlar ihop?”  
> **Alve:** “Det är ganska bra. Men nej.”  
> **Barnet:** “Vad då?”  
> **Alve:** “Man kan hoppa från den.”  
> **Barnet:** “Vi har precis fått den att sluta gå sönder.”  
> **Alve:** “Exakt. Perfekt timing.”  
> **Alve:** “Vattnet ser faktiskt rätt skönt ut.”  
> **Barnet:** “Badkanten ser inte lika skön ut.”  
> **Alve:** “Det där kan vi väl bara flytta på?”  
> **Barnet:** “Kanske. Men vi borde nog kolla så att det faktiskt är säkert först.”  
> **Alve:** “Du låter väldigt vuxen nu.”  
> **Barnet:** “Jag känner Sol.”  
> **Alve:** “Vem är Sol?”  
> **Barnet:** “Hon driver sjukhuset i byn. Hon brukar ha koll på sånt här.”  
> **Alve:** “Måste hon komma hit innan vi badar?”  
> **Barnet:** “Jag tänker inte förklara för henne varför vi inte frågade.”  
> **Alve:** “Bra argument.”

**6/16 — Sol kollar badplatsen**  
Image: `03-sol-safety-check.png`.

> **Sol:** “Så det är här ni tänker bada?”  
> **Alve:** “När vi är klara.”  
> **Alve:** “Okej. Jag tänkte kanske lite tidigare.”  
> **Sol:** “Det är bra att du sa det.”  
> **Sol:** “Bryggan börjar se fin ut. Men en bra brygga och en bra badplats är inte riktigt samma sak.”  
> **Alve:** “Vad är det som saknas?”  
> **Sol:** “Först behöver ni få bort allt gammalt skräp här nere. Det räcker med en vass metallbit eller en trasig flaska för att en väldigt bra baddag ska bli väldigt dålig.”  
> **Barnet:** “Det kan vi rensa.”  
> **Sol:** “Bra. Och ni behöver göra det lätt att komma upp ur vattnet också.”  
> **Alve:** “Sen kan vi bada?”  
> **Sol:** “En sak till.”  
> **Alve:** “Jag visste att det skulle komma en sak till.”  
> **Sol:** “En riktig livboj.”  
> **Alve:** “Behöver vi verkligen det om vi kan simma?”  
> **Sol:** “Förhoppningen är att ni aldrig behöver använda den. Men om någon behöver den vill man inte börja leta efter en då.”  
> **Barnet:** “Var hittar vi en?”  
> **Sol:** “Fråga Mira. Om hon inte har en inne kan hon säkert ordna en.”  
> **Alve:** “Okej. Rensa stranden. Livboj. Sen bada.”  
> **Sol:** “När platsen är klar.”  
> **Alve:** “Alla här gillar verkligen ordet ‘sen’.”  
> **Sol:** “Det brukar betyda att man får göra roliga saker fler gånger.”

**Intermediate economy beat — Livbojen hos Mira**  
Image: `04-mira-lifebuoy-purchase.png`. Not a contribution. Price: **200 SysselBux**.

> **Mira:** “En livboj?”  
> **Barnet:** “Sol säger att vi behöver en till bryggan.”  
> **Mira:** “Då behöver ni en livboj.”  
> **Alve:** “Jag tycker fortfarande att bryggan känns ganska säker.”  
> **Mira:** “Tycker Sol det?”  
> **Alve:** “…inte riktigt.”  
> **Mira:** “Då lyssnar vi på Sol.”  
> **Alve:** “Den där ser väldigt officiell ut.”  
> **Mira:** “Det är ofta bra när säkerhetsgrejer ser ut som säkerhetsgrejer.”  
> **Barnet:** “Hur mycket kostar den?”  
>  
> UI purchase: **200 SysselBux**.  
>  
> **Mira:** “Bra. Då är den er.”  
> **Alve:** “Kan man provkasta den?”  
> **Mira:** “Inte inne i butiken.”  
> **Alve:** “Jag frågade bara.”  
> **Mira:** “Och jag svarade väldigt snabbt.”  
> **Mira:** “Försök helst att aldrig behöva använda den.”  
> **Barnet:** “Det är planen.”  
> **Alve:** “Min plan är att bada.”  
> **Alve:** “Säkert.”

**7/16 — Röj badkanten**  
Image: `05-bathing-edge-cleanup.png`.

> **Alve:** “Okej. Jag trodde vi skulle laga en brygga.”  
> **Barnet:** “Det gör vi.”  
> **Alve:** “Just nu plockar jag upp en gammal burk ur leran.”  
> **Barnet:** “En viktig del av bryggbygge.”  
> **Alve:** “Jag börjar förstå varför vuxna alltid säger att saker tar längre tid än man tror.”  
> **Barnet:** “Här är mer.”  
> **Alve:** “Hur hamnar allt det här ens här?”  
> **Barnet:** “Folk har väl lämnat det.”  
> **Alve:** “Då är folk dåliga på sjöar.”  
> **Barnet:** “Nej, Valpen.”  
> **Alve:** “Han hjälper till.”  
> **Barnet:** “Han försöker äta det vi ska slänga.”  
> **Alve:** “Han har en annan arbetsmetod.”  
> **Alve:** “När vi hängt upp den där är vi nästan klara, va?”  
> **Barnet:** “Med den här delen.”  
> **Alve:** “Jag hörde bara ‘nästan klara’.”

**8/16 — Redo för människor**  
Reuse: `05-bathing-edge-cleanup.png`; runtime stage 2/4→3/4 and life buoy becomes persistent.

> **Barnet:** “Sitter den ordentligt?”  
> **Alve:** “Japp.”  
> **Barnet:** “Ordentligt-japp eller Alve-japp?”  
> **Alve:** “Ordentligt-japp.”  
> **Barnet:** “Det börjar faktiskt se ut som en riktig badplats.”  
> **Alve:** “Det är en riktig badplats.”  
> **Barnet:** “Den är fortfarande inte klar.”  
> **Alve:** “Du förstör väldigt många fina ögonblick med fakta.”  
> **Alve:** “Men tänk sen. När allt är klart.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Folk kan komma hit. Bada. Sitta här. Vara vid sjön.”  
> **Barnet:** “Det hade varit fint.”  
> **Alve:** “Precis.”  
> **Alve:** “Och då får vi bada.”  
> **Barnet:** “Där kom det.”


**9/16 — Plats för sommaren**  
LIVE over runtime jetty stage 3.

> **Alve:** “Okej, nu börjar den se ut som en plats man faktiskt vill vara på.”  
> **Barnet:** “Det hjälper att det inte ligger plankor och verktyg överallt.”  
> **Alve:** “Jag tyckte det såg rätt hemtrevligt ut med verktygen.”  
> **Barnet:** “Du tycker verktyg är inredning.”  
> **Alve:** “Bra verktyg är inredning.”  
> **Barnet:** “Här skulle man kunna lägga handdukar.”  
> **Alve:** “Och sitta.”  
> **Barnet:** “Och komma ner i vattnet utan att klättra över något.”  
> **Alve:** “Och hoppa.”  
> **Barnet:** “Du har verkligen fastnat för det där.”  
> **Alve:** “Det är en väldigt hoppvänlig brygga.”  
> **Alve:** “Vet du vad som är konstigt?”  
> **Barnet:** “Vadå?”  
> **Alve:** “Förut såg jag bara allt som var trasigt.”  
> **Barnet:** “Och nu?”  
> **Alve:** “Nu ser jag mest vad man kan göra här när vi är klara.”  
> **Barnet:** “Det är nog ett bra tecken.”  
> **Alve:** “Eller så tänker jag bara väldigt mycket på att bada.”  
> **Barnet:** “Också möjligt.”

**10/16 — Henning kommer ner**  
Image: `07-henning-first-visitor.png`.

> **Henning:** “Jaha. Så det är här ni har gömt er.”  
> **Barnet:** “Hej Henning.”  
> **Alve:** “Vem är det?”  
> **Barnet:** “Henning. Han har bageriet i byn.”  
> **Henning:** “Och tydligen följer jag numera efter intressanta rykten.”  
> **Alve:** “Vilka rykten?”  
> **Henning:** “Att det faktiskt händer något nere vid sjön igen.”  
> **Henning:** “Det här var inte dåligt.”  
> **Alve:** “Det är inte klart.”  
> **Henning:** “Det är därför jag sa ‘inte dåligt’ och inte ‘klart’.”  
> **Barnet:** “Kom du ner bara för att titta?”  
> **Henning:** “Ja.”  
> **Alve:** “Bara för att titta?”  
> **Henning:** “Man får faktiskt göra saker utan att de är ett uppdrag.”  
> **Henning:** “Det börjar kännas som en plats igen.”  
> **Barnet:** “Vad menar du?”  
> **Henning:** “En brygga som ingen använder är mest bara trä över vatten.”  
> **Henning:** “Men när folk börjar komma hit igen, då är det en brygga på riktigt.”  
> **Alve:** “Han sitter ju här nu.”  
> **Barnet:** “Mm.”  
> **Alve:** “Då fungerar planen.”  
> **Henning:** “Vilken plan?”  
> **Alve:** “Att få folk att komma tillbaka.”  
> **Henning:** “Då kan ni räkna en.”

**11/16 — Första riktiga vattenpausen**  
Image: `08-first-water-break.png`.

> **Alve:** “Äntligen.”  
> **Barnet:** “Äntligen vad?”  
> **Alve:** “Vi använder bryggan.”  
> **Barnet:** “Vi sitter på den.”  
> **Alve:** “Exakt. Det räknas.”  
> **Barnet:** “Du är ovanligt nöjd för någon som inte fått hoppa i ännu.”  
> **Alve:** “Jag väntar bara på rätt tillfälle.”  
> **Alve:** “Henning hade rätt.”  
> **Barnet:** “Om vad?”  
> **Alve:** “Att det börjar kännas som en riktig plats.”  
> **Barnet:** “Jag trodde det var det hela tiden.”  
> **Alve:** “Nej. Förut var det bara den gamla trasiga bryggan.”  
> **Alve:** “Nu känns den annorlunda.”  
> **Barnet:** “Hur då?”  
> **Alve:** “Som vår plats.”  
> **Barnet:** “Ja.”  
> **Barnet:** “Vår plats.”  
> **Alve:** “Vår plats.”


**12/16 — Från arbetsplats till sommarplats**  
Image: `06-late-restoration.png`; runtime stage becomes visually 4/4 after the scene, while the restoration line remains incomplete until contribution 16.

Ni gör den sista stora reparationen och städar upp runt den del som ska användas för bad och häng.

> **Alve:** “Nu börjar jag få slut på saker att laga.”  
> **Barnet:** “Det låter som ett bra problem.”  
> **Alve:** “Lite konstigt ändå.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Förut såg allt trasigt ut. Nu får man nästan leta efter det.”  
> **Barnet:** “Kommer du ihåg hur den såg ut när vi började?”  
> **Alve:** “Tyvärr.”  
> **Barnet:** “Jag trodde faktiskt inte den skulle bli så här bra.”  
> **Alve:** “Jag gjorde det.”  
> **Alve:** “Okej. Jag hoppades.”  
> **Alve:** “Det är bättre än jag tänkte.”  
> **Barnet:** “Det där lät nästan som ett erkännande.”  
> **Alve:** “Säg inget till Linus.”

**13/16 — Sista svaga punkten**  
LIVE over runtime jetty stage 4.

> **Barnet:** “Där.”  
> **Alve:** “Nej.”  
> **Barnet:** “Jo.”  
> **Alve:** “Jag tänker låtsas att jag inte såg det.”  
> **Barnet:** “Det kommer fortfarande vara trasigt.”  
> **Alve:** “Då var det en dålig plan.”  
> **Alve:** “Det är inte jättemycket.”  
> **Barnet:** “Det sa du i början också.”  
> **Alve:** “Det här är annorlunda.”  
> **Barnet:** “Hur då?”  
> **Alve:** “Nu vet jag att du kommer påminna mig om det om jag har fel.”  
> **Alve:** “Så.”  
> **Barnet:** “Så?”  
> **Alve:** “Nu får du hitta något mer.”  
> **Barnet:** “Jag tror faktiskt inte jag kan.”  
> **Alve:** “På riktigt?”  
> **Barnet:** “På riktigt.”

**14/16 — Gör klart för att använda**  
LIVE over runtime jetty stage 4.

> **Alve:** “Vad gör vi med allt det här?”  
> **Barnet:** “Plankorna tillbaka till Linus. Verktygen bort. Skräpet slänger vi.”  
> **Alve:** “Så vi städar.”  
> **Barnet:** “Ja.”  
> **Alve:** “Det känns som ett väldigt tråkigt sätt att bli klar på.”  
> **Barnet:** “Vill du hellre lämna allt här?”  
> **Alve:** “Nej. Det förstör lite.”  
> **Alve:** “Oj.”  
> **Barnet:** “Vad?”  
> **Alve:** “Den ser större ut utan allt skräp.”  
> **Barnet:** “Den ser färdig ut.”  
> **Alve:** “Nästan.”  
> **Barnet:** “Vad är kvar nu?”  
> **Alve:** “Jag vet faktiskt inte.”

**15/16 — Är vi faktiskt klara?**  
Image: `09-jetty-complete.png`. This is the quiet pre-completion beat; contribution 16 still remains.

> **Alve:** “Det känns konstigt.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Att det inte finns något mer som är trasigt.”  
> **Barnet:** “Vi kan säkert hitta något om vi letar riktigt noga.”  
> **Alve:** “Nej tack.”  
> **Alve:** “Tror du folk kommer hit nu?”  
> **Barnet:** “Henning gjorde ju det.”  
> **Alve:** “Ja, men fler.”  
> **Barnet:** “Sol kanske kommer. Mira också.”  
> **Alve:** “Linus då?”  
> **Barnet:** “Han sa ju att alla brukade vara här förr.”  
> **Alve:** “Då kanske han kommer tillbaka också.”  
> **Barnet:** “Det tror jag.”  
> **Alve:** “Tänk om det blir fullt här.”  
> **Barnet:** “Då får vi väl dela med oss.”  
> **Alve:** “Mm.”  
> **Alve:** “Fast vår plats är fortfarande vår plats.”  
> **Barnet:** “Klart den är.”

**16/16 — Bryggan är klar**  
Reuse: `09-jetty-complete.png`. After this scene, Bryggan is officially complete and the normal completed-jetty ambient pool becomes eligible on later visits.

> **Barnet:** “Inga lösa plankor.”  
> **Alve:** “Japp.”  
> **Barnet:** “Badkanten är röjd.”  
> **Alve:** “Japp.”  
> **Barnet:** “Livbojen sitter där den ska.”  
> **Alve:** “Ordentligt-japp.”  
> **Barnet:** “Då är den klar.”  
> **Barnet:** “Alve?”  
> **Alve:** “Jag vet.”  
> **Barnet:** “Du ser inte så glad ut.”  
> **Alve:** “Jo. Jag bara…”  
> **Alve:** “När vi började var det bara jag här.”  
> **Alve:** “Nu är du här. Linus har varit här. Sol. Henning.”  
> **Barnet:** “Och Mira hjälpte till.”  
> **Alve:** “Precis.”  
> **Alve:** “Vi gjorde faktiskt det.”  
> **Barnet:** “Vi gjorde det.”  
> **Alve:** “Bryggan är klar.”  
> **Barnet:** “Bryggan är klar.”

**Post-completion finisher — Nästa dag**  
Image: `10-everyone-swimming.png`. One-time authored Story Moment after completion, not contribution 17 and not part of the repeat ambient pool.

Nästa dag går ni ner mot sjön igen. Redan innan ni ser bryggan hör ni röster och plask från vattnet. Barnen syns inte i payoff-bilden; bilden visar resultatet av deras arbete genom att byborna använder platsen.

Den låsta payoff-bilden visar **Linus, Henning, Sol och Mira i vattnet** och **Valpen kvar på bryggan bredvid fikakorg och handdukar**. Den restaurerade stage-4-bryggan och den permanenta livbojen ska vara kvar. Inga extra bybor läggs till.

> **Alve:** “Hör du?”  
> **Barnet:** “Japp.”  
> **Alve:** “Oj.”  
> **Barnet:** “Du sa ju att det kanske skulle bli fullt.”  
> **Alve:** “Jag trodde inte det skulle hända direkt.”  
> **Henning:** “Där är byggarna!”  
> **Linus:** “Ni har gjort ett riktigt bra jobb här.”  
> **Sol:** “Verkligen. Det är tryggt, fint och folk vill faktiskt vara här.”  
> **Mira:** “Ni fick hela platsen att kännas levande igen.”  
> **Henning:** “Och jag tänker ta åt mig lite av äran bara för att jag dök upp tidigt.”  
> **Linus:** “Nej.”  
> **Henning:** “Värt ett försök.”  
> **Alve:** “De kom tillbaka.”  
> **Barnet:** “Japp.”  
> **Alve:** “Alla?”  
> **Barnet:** “Nästan.”  
> **Mira:** “Det här är er förtjänst.”  
> **Sol:** “Ni gav byn tillbaka sjön.”  
> **Alve:** “Det blev ganska bra.”  
> **Barnet:** “Ganska?”  
> **Alve:** “Okej då. Jättebra.”  
> **Henning:** “Nu tänker ni väl inte stå där hela dagen?”  
> **Alve:** “Nej.”  
> **Alve:** “Nu badar vi.”  
> **Barnet:** “Nu badar vi.”



## Båthuset restoration arc — LOCKED 2026-09-28

### Båthuset dialogue recovery audit — corrected 2026-09-30

Historical repo review first suggested that only the 1–16 beat structure and key exchanges had survived. That conclusion was stale.

**The full line-by-line Båthuset dialogue does exist and is canonical in this document below.** It was authored and committed in successive dialogue-lock commits on 2026-09-29, covering the complete 1–16 arc:
- 1–3: locked chest / Henning setup;
- 4–6: BOOM / photograph / Mira sees the workshop problem;
- 7–9: workshop takes form / “Vår verkstad” / lådbil drawing + the 200 SysselBux steering-wheel economy beat;
- 10–12: build / failed test / successful second version;
- 13–15: clear boat bay / Linus explains the slipvagn / safe mechanism test;
- 16: complete boathouse / “Den.” payoff.

The earlier condensed `/act2-test` implementation commit `edbe647bf20f6756fc7d6fc53020c9a28f613d5e` remains useful as the original Story Moment mapping, but it is **not** the source of truth for dialogue completeness.

Do not recreate or paraphrase this arc from memory. Use the full Båthuset dialogue blocks in `STORY_DESIGN.md` as canonical text.

Båthuset keeps its locked identity as **verktyg, fynd, projekt och upptåg**. It is Adam and Alve's workshop/discovery space, not another generic social hangout. The baseline is the same **4 + 4 + 4 + 4 authoritative real-world quest contributions** as the other main Act 2 restoration tracks.

### Båthuset dialogue lock — beats 1–3

**1/16 — Under bråten**

Ni börjar röja det gamla båthuset.

Det luktar trä, sjö och gammalt damm. Överallt ligger trasiga plankor, lådor, rep och saker som ingen verkar ha rört på väldigt länge.

Alve står mitt i röran och ser nästan nöjd ut.

> **Barnet:** “Du ser väldigt glad ut för någon som står mitt i ett jättestök.”  
> **Alve:** “Det är bra stök. Man vet aldrig vad som finns under.”

Du lyfter undan en gammal låda.

> **Barnet:** “Jag hoppas på något som inte har åtta ben.”  
> **Alve:** “Jag hoppas på verktyg. Eller en hemlig lucka.”  
> **Barnet:** “Varför skulle det finnas en hemlig lucka i ett båthus?”  
> **Alve:** “För att det hade varit bättre om det gjorde det.”

Ni fortsätter röja.

En stor hög med gammalt bråte längst in verkar sitta ovanligt hårt.

Alve försöker dra undan en planka men den rör sig knappt.

> **Alve:** “Det är något under.”  
> **Barnet:** “Hur vet du det?”  
> **Alve:** “För att allt annat flyttar på sig och det här vägrar.”

Ni börjar försiktigt ta bort saker ovanifrån.

Efter en stund syns kanten på något mörkt och tungt.

> **Barnet:** “Det där är inte golvet.”

Alve sätter sig på huk och försöker se bättre.

> **Alve:** “Det är en låda.”  
> **Barnet:** “Det är en väldigt stor låda.”  
> **Alve:** “Ännu bättre.”  
> **Barnet:** “Varför?”  
> **Alve:** “För att stora lådor innehåller bättre saker än små lådor.”  
> **Barnet:** “Det där har du hittat på.”  
> **Alve:** “Det känns sant.”

Ni får undan tillräckligt mycket för att se att det är en gammal tung kista.

Alve tittar på den med ett stort leende.

> **Alve:** “Okej. Nu blev det här projektet mycket bättre.”  
> **Barnet:** “Vi skulle laga båthuset.”  
> **Alve:** “Det gör vi.”

Han pekar på kistan.

> **Alve:** “Fast först tar vi reda på vad det där är.”

**2/16 — Den låsta kistan**

Ni har fått fram hela kistan.

Den är tung, smutsig och har ett gammalt lås som ser ut att ha suttit där ungefär lika länge som båthuset.

Alve drar i locket.

Det rör sig inte.

Han drar hårdare.

Fortfarande ingenting.

> **Barnet:** “Jag tror den är låst.”

Alve släpper taget och tittar på dig.

> **Alve:** “Jag märkte det.”  
> **Barnet:** “Ville bara hjälpa.”

Alve börjar undersöka låset.

> **Alve:** “Det här borde gå.”  
> **Barnet:** “Med vad?”  
> **Alve:** “Något.”

Du tittar runt på alla gamla saker omkring er.

> **Barnet:** “Bra plan.”

Alve provar först försiktigt.

Sedan lite mindre försiktigt.

Till slut sätter han sig bredvid kistan.

> **Alve:** “Den hatar mig.”  
> **Barnet:** “Det är ett lås.”  
> **Alve:** “Det är personligt nu.”

Ni provar flera rimliga sätt att få upp den, men låset sitter fast.

Efter en stund lutar du dig mot väggen.

> **Barnet:** “Vi kanske behöver hjälp.”

Alve tittar fortfarande på kistan.

> **Alve:** “Jag vill inte ge upp mot en låda.”  
> **Barnet:** “Vi ger inte upp. Vi hittar bara någon som är bättre på gamla lås.”

Alve funderar.

> **Alve:** “Linus?”  
> **Barnet:** “Kanske.”

Paus.

> **Alve:** “Eller Henning.”

Du tittar på honom.

> **Barnet:** “Varför Henning?”  
> **Alve:** “Jag vet inte. Han känns som någon som har idéer.”

Du tänker på Henning.

> **Barnet:** “Det där är både sant och lite oroande.”

Alve reser sig.

> **Alve:** “Perfekt. Då frågar vi honom.”

**3/16 — Henning har en idé**

Henning kommer ner till båthuset och tittar på kistan.

Han går ett långsamt varv runt den.

Alve väntar.

Du väntar.

Henning fortsätter titta.

Till slut får Alve nog.

> **Alve:** “Har du någon idé?”

Henning nickar långsamt.

> **Henning:** “Japp.”  
> **Barnet:** “En normal idé?”

Henning tittar på dig.

> **Henning:** “Vad menar du med normal?”

Du tittar på Alve.

Alve tittar tillbaka.

> **Alve:** “Det där var inte ett bra svar.”

Henning böjer sig ner och granskar låset.

> **Henning:** “Det är gammalt. Rostigt. Och sitter ordentligt.”  
> **Alve:** “Det vet vi.”  
> **Henning:** “Ni har försökt få upp det?”  
> **Barnet:** “Ja. Försiktigt.”

Alve hostar lite.

> **Barnet:** “Mestadels försiktigt.”

Henning reser sig.

> **Henning:** “Då behöver vi något som är mindre försiktigt.”

Alve lyser upp.

> **Alve:** “Jag gillar redan den här planen.”

Du tittar misstänksamt på Henning.

> **Barnet:** “Hur mycket mindre försiktigt?”

Henning ler.

> **Henning:** “Tillräckligt.”

Paus.

> **Barnet:** “Henning.”  
> **Henning:** “Jag har dynamit.”

Alve vänder sig mot dig med ett ansiktsuttryck som säger att detta är den bästa dagen hittills.

> **Alve:** “Han har dynamit.”  
> **Barnet:** “Jag hörde.”  
> **Alve:** “Varför har bagaren dynamit?”

Henning rycker på axlarna.

> **Henning:** “Det är en lång historia.”

Du tittar på Alve.

> **Barnet:** “Vi ska inte fråga.”  
> **Alve:** “Jag vill väldigt gärna fråga.”

Henning börjar ordna med sin plan.

Vi klipper bort långt innan något praktiskt visas.

Alve lutar sig lite mot dig.

> **Alve:** “Är det här normalt här?”

Du tittar på Henning.

Sedan tillbaka på Alve.

> **Barnet:** “Tyvärr börjar det kännas så.”

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

### Båthuset dialogue lock — beats 4–6

**4/16 — BOOM**

Vi lämnar båthuset.

Henning gör det Henning tänker göra, helt utanför bild.

Sedan:

**BOOM.**

När ni kommer tillbaka står Henning framför båthuset med sot i ansiktet och ett väldigt nöjt uttryck.

Kistan är öppen.

Alve stannar.

> **Alve:** “Är alla i din by så här?”

Du tittar på Henning.

Sedan på Alve.

> **Barnet:** “Typ.”

Alve nickar långsamt.

> **Alve:** “…jag gillar den här byn.”

Henning borstar lite sot från ärmen.

> **Henning:** “Det gick ju bra.”  
> **Barnet:** “Det beror lite på hur man räknar.”  
> **Henning:** “Kistan är öppen.”

Alve går redan mot den.

> **Alve:** “Det är det viktiga.”

Ni sätter er bredvid kistan och börjar gå igenom innehållet.

Där finns gamla verktyg, beslag, repstumpar och delar som ser ut att ha hört till båtar.

Alve plockar upp en metallbit.

> **Alve:** “Den här ser viktig ut.”  
> **Barnet:** “Vet du vad det är?”  
> **Alve:** “Nej.”  
> **Barnet:** “Då vet vi att den är viktig.”

Längre ner hittar du ett gammalt fotografi.

Du blåser bort dammet.

Bilden visar sjön för många år sedan. Bryggan är hel. Båthuset ser nytt ut. Folk är ute på vattnet.

Och mitt i bilden syns en motorbåt.

Alve lutar sig närmare.

> **Alve:** “Den där båten…”  
> **Barnet:** “Vadå?”  
> **Alve:** “Det är ju den.”

Du tittar från bilden mot den gamla båten.

> **Barnet:** “Den på bilden?”  
> **Alve:** “Mm.”

På baksidan av fotografiet står det:

**“Sista turen över sjön innan hösten.”**

Alve läser texten en gång till.

Sedan tittar han ut genom båthusets öppning, över sjön.

> **Alve:** “Jag undrar vart de brukade åka.”

**5/16 — Fynden**

Nästa gång ni kommer tillbaka ligger allt från kistan utspritt över golvet.

Verktyg på ett ställe. Båtdelar på ett annat. Några saker ni fortfarande inte har en aning om vad de är till för.

Alve står mitt bland högarna.

> **Alve:** “Jag har gjort ett system.”

Du tittar omkring.

> **Barnet:** “Vilket system?”

Alve pekar.

> **Alve:** “Saker jag förstår. Saker jag nästan förstår. Och saker som antagligen är väldigt viktiga.”

Den sista högen är störst.

> **Barnet:** “Du förstår alltså nästan ingenting.”  
> **Alve:** “Jag förstår att vi behöver spara allt.”

Du plockar upp fotografiet igen.

Alve märker det direkt.

> **Alve:** “Jag har tänkt på den där.”  
> **Barnet:** “Båten?”  
> **Alve:** “Ja. Den ser inte gammal ut där.”

Han tittar bort mot motorbåten.

> **Alve:** “Och nu står den bara där.”  
> **Barnet:** “Den har nog stått där länge.”

Alve går fram till båten och lägger handen på sidan.

> **Alve:** “Tänk om några av delarna i kistan hör till den.”  
> **Barnet:** “Då kanske vi kan använda dem senare.”

Alve vänder sig om.

> **Alve:** “Senare?”  
> **Barnet:** “Vi håller fortfarande på med båthuset.”

Alve ser sig omkring.

Trasigt arbetsbord. Verktyg på golvet. Bråte i hörnen.

Han suckar.

> **Alve:** “Okej. Jag erkänner att det här inte är världens bästa verkstad.”  
> **Barnet:** “Det är knappt en verkstad.”  
> **Alve:** “Än.”

Han plockar upp fotografiet och sätter det försiktigt mot väggen.

> **Alve:** “Men den där stannar här.”

**6/16 — Mira ser problemet**

Mira kommer ner till båthuset och stannar i dörröppningen.

Hon tittar på golvet.

Sedan på arbetsbordet.

Sedan på Alves tre högar.

> **Mira:** “Vad har hänt här?”  
> **Alve:** “Vi organiserar.”

Mira tittar på dig.

> **Barnet:** “Han organiserar.”  
> **Mira:** “Det förklarar en del.”

Hon går fram till verktygen.

> **Mira:** “Ni har faktiskt hittat en hel del användbart. Problemet är att allt ligger överallt.”

Alve pekar på sina högar.

> **Alve:** “Inte överallt. På tre väldigt tydliga ställen.”

Mira tittar på den sista högen.

> **Mira:** “Ni behöver inte fler verktyg. Ni behöver kunna hitta de ni redan har.”

Hon pekar på den gamla arbetsplatsen.

> **Mira:** “Fixa arbetsbordet först. Sedan behöver ni någonstans att hänga verktygen, lådor till smådelarna och bättre ljus här inne. Annars kommer ni lägga halva tiden på att leta efter saker.”

Alve tittar runt.

> **Alve:** “Det låter mindre roligt än att bygga något.”  
> **Mira:** “Det är därför man gör det först.”

Du tittar på Alve.

> **Barnet:** “Hon låter lite som Linus.”  
> **Alve:** “Alla vuxna verkar dela en hemlig bok.”

Mira ler.

> **Mira:** “Vi får den när vi fyller arton.”

Alve tittar mot motorbåten.

> **Alve:** “När verkstaden är klar kan vi börja med den.”  
> **Barnet:** “När de andra projekten är klara.”

Alve suckar, men inte särskilt hårt.

> **Alve:** “Jag vet.”

Han tittar tillbaka på arbetsbordet.

> **Alve:** “Okej. Då bygger vi en riktig verkstad först.”

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

### Båthuset dialogue lock — beats 7–9

**7/16 — Verkstaden tar form**

Nästa gång ni kommer tillbaka har Mira ordnat det ni behöver.

Lådor, förvaring, krokar och bättre belysning ligger samlat vid arbetsbordet.

Alve tittar på allt.

> **Alve:** “Det här är väldigt många saker för att kunna hitta andra saker.”  
> **Barnet:** “Det är ungefär hela poängen med förvaring.”

Ni sätter igång.

Det gamla arbetsbordet blir stadigt igen. Verktyg får egna platser. Smådelarna från kistan hamnar i lådor istället för i Alves tre högar.

Efter en stund står Alve mitt i rummet och ser sig omkring.

> **Alve:** “Jag hatar att erkänna det här.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Mira hade rätt. Det är faktiskt lättare när man inte behöver leta efter hammaren varje gång.”

Du pekar på väggen.

> **Barnet:** “Fotot då?”

Alve tar försiktigt upp det gamla fotografiet.

Han funderar en stund och hänger det ovanför arbetsbordet.

> **Alve:** “Där.”  
> **Barnet:** “Bra plats.”

Alve tittar på bilden.

På båten ute på sjön.

Sedan på den gamla motorbåten som står i båthuset.

> **Alve:** “Nu känns det nästan som att den väntar på oss.”  
> **Barnet:** “Båten?”  
> **Alve:** “Ja.”

Han vänder tillbaka mot arbetsbordet.

> **Alve:** “Men först verkstaden.”

Du tittar på honom.

> **Barnet:** “Du sa det själv.”  
> **Alve:** “Skriv upp datumet.”

**8/16 — Vår verkstad**

När ni kommer tillbaka är båthuset förändrat.

Det är fortfarande gammalt. Fortfarande lite snett här och där.

Men det fungerar.

Arbetsbordet är helt. Verktygen hänger där de ska. Lådorna är märkta. Fotografiet sitter kvar på väggen.

Alve lägger ifrån sig ett verktyg på rätt plats.

Du ser det.

> **Barnet:** “Du la tillbaka den.”  
> **Alve:** “Jag gör det nu.”  
> **Barnet:** “Frivilligt?”  
> **Alve:** “Jag vill inte prata om det.”

Ni sätter er en stund på arbetsbänken och tittar ut över sjön.

> **Barnet:** “Det blev faktiskt bra.”

Alve nickar.

> **Alve:** “Det känns inte som ett gammalt båthus längre.”

Han tittar runt.

> **Alve:** “Det känns som vår verkstad.”

Det blir tyst en stund.

Sedan reser han sig igen.

> **Alve:** “Vad ska vi bygga?”  
> **Barnet:** “Vi har precis blivit klara.”  
> **Alve:** “Exakt. Då behöver vi något att använda verkstaden till.”

Han ser sig omkring bland lådorna, hyllorna och delarna ni sparat.

> **Barnet:** “Vad tänker du bygga?”

Alve ler.

> **Alve:** “Allt.”

Sedan tittar han mot den gamla motorbåten.

> **Alve:** “Men först ska vi fixa den gamla båten.”

Du skakar på huvudet.

> **Barnet:** “Inte än.”

Alve tittar på dig.

> **Alve:** “Jag vet.”

Paus.

> **Alve:** “Men jag kan tänka på den.”

**9/16 — En gammal ritning**

Ni går igenom det sista som fortfarande ligger kvar i ett hörn av båthuset.

Gamla papper. Några brädor. En burk med skruvar som kanske är äldre än både dig och Alve tillsammans.

Du drar fram en hopvikt pappersbit.

> **Barnet:** “Vad är det här?”

Alve kommer fram.

Ni vecklar ut den på arbetsbordet.

Det är en handritad plan.

Fyra hjul. En enkel ram. Ett säte.

Alve lutar sig närmare.

> **Alve:** “Det där är en lådbil.”  
> **Barnet:** “Ser ut så.”

Alve tittar från ritningen till verkstaden.

Sedan tillbaka på ritningen.

Du känner igen blicken direkt.

> **Barnet:** “Nej.”  
> **Alve:** “Du vet inte ens vad jag tänkte säga.”  
> **Barnet:** “Jo.”  
> **Alve:** “Okej, vad då?”  
> **Barnet:** “Att vi ska bygga den.”

Alve ler stort.

> **Alve:** “Bra. Då är vi överens.”

Du tittar på ritningen igen.

Den är gammal och lite sliten, men fortfarande tydlig nog.

> **Barnet:** “Tror du den här faktiskt har blivit byggd någon gång?”  
> **Alve:** “Kanske. Eller så hann någon aldrig.”

Han skjuter ritningen mot mitten av arbetsbordet.

> **Alve:** “Då är det väl dags.”

Du tittar på verkstaden ni precis gjort klar.

Verktygen.

Delarna.

Allt har plötsligt ett syfte.

> **Barnet:** “Okej. Vi bygger en lådbil.”

Alve slår händerna mot bordet.

> **Alve:** “Äntligen.”

### Båthuset economy beat — ratt till lådbilen

This is an **intermediate story/economy beat between 9/16 and 10/16** and does not replace a real-world quest contribution.

Ni har börjat plocka fram delar till lådbilen.

Alve lägger ut allt på arbetsbordet.

> **Alve:** “Fyra hjul, trä, skruvar, ett säte… vi har nästan allt.”

Du tittar på ritningen.

> **Barnet:** “Inte allt.”

Alve följer ditt finger.

Där framme på ritningen sitter en ratt.

Han tittar på delarna igen.

> **Alve:** “Okej. Vi har ingen ratt.”  
> **Barnet:** “Det känns som en ganska viktig del.”  
> **Alve:** “Man kan säkert styra på något annat sätt.”

Du tittar på honom.

> **Barnet:** “Vi köper en ratt.”

Alve suckar.

> **Alve:** “Du har blivit väldigt tråkigt klok sedan du började umgås med Linus.”

Hos Mira lägger hon fram en liten enkel ratt som passar projektet.

> **Mira:** “Till en lådbil?”  
> **Barnet:** “Japp.”

Mira tittar på Alve.

> **Mira:** “Ska du köra den?”  
> **Alve:** “Japp.”

Mira skjuter ratten lite närmare dig.

> **Mira:** “Tvåhundra SysselBux.”

**KÖP: 200 SysselBux**

Efter köpet tar Alve upp ratten.

> **Alve:** “Nu har vi allt.”  
> **Mira:** “Det där är exakt den sortens mening som brukar göra mig nervös.”  
> **Alve:** “Du kommer ändra dig när du ser den.”  
> **Mira:** “Det är också en mening som gör mig nervös.”

**Economy lock:** 200 SysselBux.

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

### Båthuset dialogue lock — beats 10–12

**10/16 — Lådbilen byggs**

Ni lägger ritningen mitt på arbetsbordet och börjar bygga.

Ratten från Mira ligger bredvid.

Alve håller upp den.

> **Alve:** “Det här är definitivt den viktigaste delen.”  
> **Barnet:** “Viktigare än hjulen?”  
> **Alve:** “Man måste kunna känna att man kör något.”

Ni återanvänder trä, beslag och delar ni hittat i båthuset.

Arbetet tar längre tid än Alve först tänkt, men den här gången klagar han inte särskilt mycket.

Efter ett tag börjar något faktiskt likna en lådbil.

Alve backar några steg.

> **Alve:** “Okej. Den ser snabb ut.”  
> **Barnet:** “Den står still.”  
> **Alve:** “Den ser snabbt stillastående ut.”

Du testar ratten.

Den sitter fast.

Alve trycker försiktigt på ett hjul.

> **Alve:** “Det där sitter också.”  
> **Barnet:** “Säger du det som ett faktum eller ett hopp?”  
> **Alve:** “Lite av båda.”

Ni gör klart de sista detaljerna.

När ni till slut rullar ut lådbilen framför båthuset stannar Alve bredvid den.

> **Alve:** “Det här är det första vi byggt här som inte fanns innan.”

Du tittar tillbaka mot verkstaden.

> **Barnet:** “Inte illa för ett gammalt båthus.”

Alve tittar på lådbilen igen.

> **Alve:** “Vi borde testa den.”  
> **Barnet:** “Jag visste att du skulle säga det.”

**11/16 — Första provturen**

Ni hittar en kort, lugn sträcka där lådbilen kan testas.

Alve sätter sig bakom ratten.

> **Barnet:** “Du behöver inte försöka slå något rekord.”  
> **Alve:** “Jag tänkte mest försöka komma framåt.”  
> **Barnet:** “Bra början.”

Alve skjuter ifrån.

Lådbilen börjar rulla.

Först försiktigt.

Sedan lite snabbare.

Alve skrattar.

> **Alve:** “Den funkar!”

Du följer efter.

Sedan hörs ett ljud.

Ett hjul lossnar och rullar åt sidan.

Lådbilen stannar snabbt och odramatiskt.

Du kommer fram.

Alve sitter kvar och tittar efter hjulet.

> **Barnet:** “Gick det bra?”  
> **Alve:** “Japp.”

Du tittar på bilen.

> **Barnet:** “Hjulet lossnade.”

Alve följer din blick.

> **Alve:** “Då vet vi vad vi ska fixa.”

Du börjar skratta.

Alve kliver ur och hämtar hjulet.

> **Alve:** “Det här var ett test.”  
> **Barnet:** “Som gick sönder.”  
> **Alve:** “Som visade exakt vad som behövde bli bättre.”

Han håller upp hjulet.

> **Alve:** “Det är nästan mer användbart.”  
> **Barnet:** “Nästan.”

Ni tar tillbaka lådbilen till verkstaden.

För första gången ser misslyckandet inte ut att irritera Alve särskilt mycket.

Han lägger hjulet på arbetsbordet.

> **Alve:** “Version två.”

**12/16 — Version två**

Ni går igenom lådbilen tillsammans.

Inte bara hjulet som lossnade.

Allt.

Den här gången försöker Alve inte skynda.

När du märker det säger du inget först.

Efter en stund tittar han upp.

> **Alve:** “Vad?”  
> **Barnet:** “Inget.”  
> **Alve:** “Du gjorde den där blicken.”  
> **Barnet:** “Vilken blick?”  
> **Alve:** “Den där ‘Alve gör något oväntat vettigt’-blicken.”

Du ler.

> **Barnet:** “Jag tänkte bara att du inte verkar ha bråttom.”

Alve fortsätter arbeta.

> **Alve:** “Det gick ju fort förra gången.”

Han tittar mot hjulet.

> **Alve:** “Det hjälpte inte så mycket.”

Ni gör klart version två.

När den rullas ut ser den nästan likadan ut.

Men den är bättre byggd.

Alve sätter sig bakom ratten igen.

> **Alve:** “Redo?”  
> **Barnet:** “Jag står bredvid. Du är den som ska köra.”  
> **Alve:** “Bra poäng.”

Han rullar iväg.

Den här gången håller alla fyra hjulen sig där de ska.

Alve kommer tillbaka med ett stort leende.

> **Alve:** “Nu fungerade den på riktigt.”

Du går runt bilen och tittar.

> **Barnet:** “Och alla hjulen är kvar.”  
> **Alve:** “Överdrivet lyxigt.”

Ni rullar tillbaka lådbilen till båthuset och ställer den bredvid arbetsbänken.

Alve ser på den en stund.

> **Alve:** “Okej. Den där var övning.”  
> **Barnet:** “För vad?”

Alve tittar mot den gamla motorbåten.

> **Alve:** “Båten.”

### Båthuset dialogue lock — beats 13–15

**13/16 — Gör plats för båten**

Efter lådbilen står ni kvar i verkstaden och tittar runt.

Det har blivit mycket bättre här inne.

Men längst in där motorbåten ska kunna tas in ligger fortfarande gammalt bråte, plankor och delar i vägen.

Alve följer din blick.

> **Alve:** “Okej. Jag ser problemet.”  
> **Barnet:** “Vilket av dem?”  
> **Alve:** “Det stora problemet som är ungefär lika brett som en båt.”

Ni går fram till den gamla båtplatsen.

Alve försöker uppskatta utrymmet.

> **Alve:** “Om vi ska laga båten här inne så måste den faktiskt få plats här inne.”  
> **Barnet:** “Bra början.”

Alve nickar mot lådbilen.

> **Alve:** “Vi kanske måste flytta den.”  
> **Barnet:** “Du säger det som att det gör ont.”  
> **Alve:** “Lite.”

Ni börjar röja.

Det går snabbare än förr, mest för att ni faktiskt vet var saker ska hamna nu.

Efter ett tag börjar den gamla båtplatsen synas igen.

På golvet finns spår efter något tungt som en gång rullats in och ut.

Alve böjer sig ner.

> **Alve:** “Vad är det här?”  
> **Barnet:** “Ser ut som att något har gått här.”

Alve följer spåren med blicken.

De går hela vägen mot vattnet.

> **Alve:** “Båten.”

Han tittar upp.

> **Alve:** “Det måste ha funnits något som drog in den.”

**14/16 — Den gamla slipen**

Linus kommer ner och tittar på det ni hittat.

Han går längs spåren och stannar vid resterna av den gamla mekanismen.

> **Linus:** “Det här är inte bara spår. Här har suttit en slipvagn.”

Alve tittar på honom.

> **Alve:** “En vadå?”

Linus pekar mot spåren som går ner mot vattnet.

> **Linus:** “En slipvagn. Tänk dig en låg vagn som båten står på. Den går på de här spåren så man kan dra båten upp ur vattnet och in i båthuset utan att behöva lyfta hela båten.”

Alve följer spåren med blicken.

> **Alve:** “Så båten åkte på en liten vagn?”  
> **Linus:** “Ungefär. Vagnen går i vattnet, båten hamnar ovanpå och sedan drar man in allt tillsammans.”  
> **Barnet:** “Det låter mycket enklare än att bära båten.”  
> **Linus:** “Det är själva poängen.”

Alve ser genast intresserad ut.

> **Alve:** “Kan vi laga den?”

Linus undersöker delarna.

> **Linus:** “Kanske. Mycket är rostigt, men själva konstruktionen ser ut att gå att rädda.”

Ni hämtar fram delarna från kistan igen.

Alve börjar jämföra dem med mekanismen.

Plötsligt håller han upp en av de gamla metallbitarna.

> **Alve:** “Den här passar ju.”

Linus tar emot den och provar.

Den passar faktiskt.

> **Barnet:** “Så den viktiga saken var viktig?”

Alve tittar triumferande på dig.

> **Alve:** “Jag sa ju det.”  
> **Barnet:** “Du visste inte ens vad den var.”  
> **Alve:** “Detaljer.”

Linus fortsätter gå igenom delarna.

> **Linus:** “Det här är bra. Några av sakerna ni hittade i kistan hör faktiskt hit.”

Alve tittar bort mot det gamla fotografiet på väggen.

> **Alve:** “Så de sparade delar till allt.”  
> **Linus:** “Förmodligen. Förr lagade man ofta sådant här istället för att kasta det.”  
> **Barnet:** “Det låter som du.”  
> **Linus:** “Då var de kloka.”

Alve ler.

> **Alve:** “Där kom det.”

Ni börjar återställa mekanismen tillsammans.

**15/16 — Den fungerar**

Den gamla slipvagnen är på plats igen.

Inte blank och ny.

Men hel.

Alve står bredvid den och försöker inte se alltför förväntansfull ut.

Det går sådär.

> **Alve:** “Vi måste testa den.”  
> **Barnet:** “Ja.”

Alve tittar på dig.

> **Alve:** “Du sa ja väldigt snabbt.”  
> **Barnet:** “Det är nästan som att test är en del av att laga saker.”  
> **Alve:** “Jag känner att du och Linus har pratat för mycket.”

Ni testar mekanismen utan motorbåten först.

Vagnen rör sig långsamt längs spåret.

In.

Ut.

In igen.

Allt håller.

Alve går bredvid och tittar på varje del.

När vagnen stannar på sin plats står han kvar en stund.

> **Alve:** “Den fungerar.”  
> **Barnet:** “Japp.”

Alve tittar mot motorbåten.

> **Alve:** “Då kan vi få in båten.”  
> **Barnet:** “När vi får laga den.”

Alve nickar.

Den här gången utan protest.

> **Alve:** “När vi får laga den.”

Han ser sig omkring i båthuset.

Verkstaden. Fotografiet. Lådbilen. Slipen.

Allt är redo.

> **Alve:** “Det känns faktiskt som att vi byggt hela platsen för den.”  
> **Barnet:** “Inte bara för den.”

Alve tittar på lådbilen.

Sedan på arbetsbordet.

> **Alve:** “Nej.”

Han ler.

> **Alve:** “Men ganska mycket för den.”

### Båthuset dialogue lock — beat 16

**16/16 — Båthuset är klart**

När ni kommer tillbaka till båthuset nästa gång finns det egentligen inget kvar att reparera.

Verkstaden fungerar. Verktygen har sina platser. Fotografiet sitter ovanför arbetsbordet. Lådbilen står parkerad vid väggen. Slipvagnen fungerar och båtplatsen är röjd.

Alve står mitt i allt och ser sig omkring.

> **Barnet:** “Klart.”

Alve tittar runt ett varv till.

> **Alve:** “Nästan.”

Du följer hans blick.

> **Barnet:** “Vad är det som är kvar?”

Alve pekar mot motorbåten.

> **Alve:** “Den.”

Du tittar på honom.

> **Barnet:** “Båthuset är klart.”  
> **Alve:** “Jag vet.”

Han går fram till arbetsbordet och tittar på fotografiet från kistan.

Den gamla bilden visar båten ute på sjön, från en tid när allt här användes.

> **Alve:** “När vi hittade den här trodde jag mest att vi hade hittat ännu en gammal grej.”  
> **Barnet:** “Och nu?”

Alve ser sig omkring.

> **Alve:** “Nu känns det som att allt här hänger ihop. Verktygen, delarna, slipen, båten…”

Han tittar på lådbilen och ler.

> **Alve:** “Och en väldigt snabb bil.”  
> **Barnet:** “Med fyra hjul.”  
> **Alve:** “Numera.”

Han går fram till motorbåten.

> **Alve:** “Förut stod den bara här och blev äldre. Nu har vi faktiskt någonstans att laga den.”

Du tittar mot båten.

> **Barnet:** “När det är dags.”

Alve nickar.

Den här gången utan att protestera.

> **Alve:** “När det är dags.”

Han lägger handen mot båten.

> **Alve:** “Men då är det vår tur.”  
> **Barnet:** “Vår tur?”

Alve tittar från båten till fotografiet och sedan ut över sjön.

> **Alve:** “Att ta reda på om den fortfarande kan åka någonstans.”

**Order-independence lock:** this scene must remain valid whether Båthuset is the first, second or third restoration project. It must not assume that Stugan or Bryggan is unfinished or complete.

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

### Stugan dialogue lock — beats 13–15

**13/16 — Det sista riktiga jobbet**

Ni går igenom stugan en gång till och letar efter det som fortfarande faktiskt behöver lagas.

> **Barnet:** “Det börjar bli svårt att hitta trasiga saker.”  
> **Alve:** “Bra.”  
> **Barnet:** “Du låter nästan besviken.”  
> **Alve:** “Jag har blivit väldigt bra på att laga saker.”  
> **Barnet:** “Du kan fortsätta någon annanstans sen.”  
> **Alve:** “Jag tänkte mer att folk kunde börja sluta ha sönder saker.”

Barnet pekar mot en del av väggen.

> **Barnet:** “Där då?”  
> **Alve:** “Den räknas knappt.”  
> **Barnet:** “Den är sprucken.”  
> **Alve:** “Lite.”  
> **Barnet:** “Och lös.”  
> **Alve:** “Lite mer.”  
> **Barnet:** “Och du kan se ut genom den.”

Alve lutar sig fram och tittar genom springan.

> **Alve:** “Fin utsikt.”  
> **Barnet:** “Vi lagar den.”  
> **Alve:** “Ja.”

Ni börjar plocka fram det ni behöver.

> **Alve:** “Det här kanske är sista riktiga lagningen.”  
> **Barnet:** “Säg inte så.”  
> **Alve:** “Varför?”  
> **Barnet:** “Då hittar vi säkert något jättestort bakom väggen.”

Alve stannar.

> **Alve:** “Nu gjorde du mig nervös.”  
> **Barnet:** “Bra. Då är vi två.”

Ni arbetar vidare tills den sista skadan är borta. Alve känner försiktigt på väggen.

> **Alve:** “Stadig.”  
> **Barnet:** “Ordentligt-stadig?”  
> **Alve:** “Har du också börjat med sånt nu?”  
> **Barnet:** “Jag lär mig.”  
> **Alve:** “Ordentligt-stadig.”

**14/16 — Gör plats för människor**

Nu är det inte längre särskilt mycket som behöver repareras. I stället börjar ni ställa i ordning.

> **Alve:** “Vad gör vi nu?”  
> **Barnet:** “Gör den redo.”  
> **Alve:** “Den är ju nästan klar.”  
> **Barnet:** “Redo för människor.”

Alve tittar runt.

> **Alve:** “Det är människor här.”  
> **Barnet:** “Fler människor.”  
> **Alve:** “Jaha.”

Ni flyttar ett bord och börjar ställa fram stolar.

> **Alve:** “Den där stod nog där förut.”  
> **Barnet:** “Vill du ha den där nu?”

Alve tänker efter.

> **Alve:** “Nej.”  
> **Barnet:** “Bra.”  
> **Alve:** “Varför?”  
> **Barnet:** “För den stod jättedumt.”  
> **Alve:** “Det gjorde den faktiskt.”

Ni flyttar den till ett annat ställe.

> **Alve:** “Så här är bättre.”  
> **Barnet:** “Annorlunda bättre?”  
> **Alve:** “Exakt.”

Ni fortsätter ordna plats att sitta och sova.

> **Barnet:** “Om någon kommer hit nu kan de faktiskt stanna.”

Alve saktar ner lite.

> **Alve:** “Mm.”  
> **Barnet:** “Vi kan lägga filtar där.”  
> **Alve:** “Och göra plats här.”

Han flyttar undan några saker.

> **Alve:** “Så man slipper ha väskor mitt på golvet.”  
> **Barnet:** “Du tänker väldigt mycket på var folk ska ha sina saker.”  
> **Alve:** “Man vill ju inte att någon ska komma hit och känna att de är i vägen.”

Du tittar på honom.

> **Barnet:** “Det kommer de nog inte göra.”

Alve nickar och fortsätter.

> **Alve:** “Bra.”

**15/16 — Om de kommer**

Stugan är i princip färdig. Ni går runt och tittar på alla små platser som nu går att använda igen.

Alve stannar vid sovplatserna.

> **Alve:** “De kan sova där.”  
> **Barnet:** “Mm.”

Alve går vidare.

> **Alve:** “Och vi kan ha spelet här.”  
> **Barnet:** “Med riktiga regler.”  
> **Alve:** “Vi får se.”

Han tittar ut genom fönstret.

> **Alve:** “Och om det regnar…”  
> **Barnet:** “Då kan vi fuska inomhus.”  
> **Alve:** “Exakt.”

Barnet tittar runt.

> **Barnet:** “Du har tänkt ganska mycket på det här.”  
> **Alve:** “Lite.”  
> **Barnet:** “Lite?”  
> **Alve:** “Okej. Ganska mycket.”

Han går bort till fotot.

> **Alve:** “Jag undrar vad de skulle säga.”  
> **Barnet:** “Om stugan?”  
> **Alve:** “Om allt.”  
> **Barnet:** “De skulle nog märka att du jobbat mycket.”  
> **Alve:** “Vi.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Att vi jobbat mycket.”

Barnet ler.

> **Barnet:** “Ja.”

Alve tittar runt igen.

> **Alve:** “Tänk om de inte vill komma ändå.”

Barnet svarar inte direkt.

> **Barnet:** “Då är stugan fortfarande här.”

Alve tittar på honom.

> **Barnet:** “Och vi är här.”

Paus.

> **Alve:** “Ja.”  
> **Barnet:** “Och spelet.”  
> **Alve:** “Spelet är viktigt.”  
> **Barnet:** “Trots reglerna.”  
> **Alve:** “Speciellt reglerna.”

Alve tittar runt en sista gång.

> **Alve:** “Det känns som att någon skulle kunna komma hit nu.”  
> **Barnet:** “Det gör det.”


### Stugan waiting-state dialogue — after completion, before family return

This scene becomes available when **Stugan is complete but the wider Act 2 return condition has not yet been met**. It is an optional/revisit emotional scene, not contribution 17. The completed cottage remains visually finished. The family still does not appear.

Ni sitter utanför den färdiga stugan en stund. Allt är klart nu. Dörren går att stänga, verandan är lagad och inne i stugan står spelet och fotot kvar.

> **Barnet:** “Väntar du på dem?”

Alve svarar inte direkt.

> **Alve:** “Lite.”  
> **Barnet:** “Gör du det varje gång vi kommer hit?”

Alve rycker på axlarna.

> **Alve:** “Kanske.”  
> **Barnet:** “Tror du att de kommer?”

Alve tittar ner.

> **Alve:** “Jag vet inte.”  
> **Barnet:** “Inte alls?”  
> **Alve:** “Ibland tror jag det.”  
> **Barnet:** “Och ibland?”

Alve tittar mot stugan.

> **Alve:** “Ibland tänker jag att om de ville komma så hade de redan gjort det.”

Barnet blir tyst en stund.

> **Barnet:** “Men någon var ju här.”  
> **Alve:** “Ja.”  
> **Barnet:** “Nyckelringen.”  
> **Alve:** “Jag vet.”  
> **Barnet:** “Så de vet hur det ser ut nu.”  
> **Alve:** “Ja.”

Paus.

> **Barnet:** “Tror du att din familj någonsin kommer tillbaka?”

Alve funderar länge innan han svarar.

> **Alve:** “Jag hoppas det.”  
> **Barnet:** “Det var inte riktigt det jag frågade.”  
> **Alve:** “Jag vet.”

Barnet väntar.

> **Alve:** “Jag vet faktiskt inte.”  
> **Alve:** “Jag tror det är svårare för pappa att komma hit än för mig.”  
> **Barnet:** “För att det påminner om förr?”  
> **Alve:** “Kanske.”

Alve ser mot verandan.

> **Alve:** “När jag började laga stugan tänkte jag att om jag bara gjorde den fin igen så skulle allt bli som förut.”  
> **Barnet:** “Men det blev inte så.”  
> **Alve:** “Nej.”  
> **Barnet:** “Är du ledsen för det?”

Alve tänker efter.

> **Alve:** “Lite.”

Sedan tittar han på Barnet.

> **Alve:** “Men inte lika mycket som jag trodde.”  
> **Barnet:** “Varför inte?”  
> **Alve:** “För att det inte känns tomt här längre.”

Barnet tittar mot stugan.

> **Barnet:** “Fast de inte är här?”  
> **Alve:** “Du är ju här.”

Paus.

> **Barnet:** “Ja.”  
> **Alve:** “Och Valpen.”  
> **Barnet:** “Han räknas väldigt mycket.”  
> **Alve:** “Och vi har saker kvar att göra.”  
> **Barnet:** “Båten.”

Alve nickar.

> **Alve:** “Båten.”

Barnet reser sig.

> **Barnet:** “Då väntar vi inte hela dagen.”

Alve ler lite.

> **Alve:** “Nej.”

Han kastar en sista blick mot vägen.

> **Alve:** “Men kanske lite till.”


Contribution 16 completes Stugan. The completion Story Moment should show the transformation from the abandoned cottage at Alve's introduction into a warm, intact place containing its accumulated history: **height marks, family photograph, childhood drawing, old game and evidence of Adam and Alve's new memories together**.

### Stugan dialogue lock — beat 16

**16/16 — Stugan är klar**

Ni står utanför stugan och tittar på den. För första gången finns det inget kvar som måste lagas.

> **Barnet:** “Så.”  
> **Alve:** “Så?”  
> **Barnet:** “Nu är den klar.”

Alve tittar på stugan en lång stund.

> **Alve:** “Ja.”  
> **Barnet:** “Det där lät inte särskilt övertygande.”  
> **Alve:** “Jag försöker bara vänja mig vid det.”  
> **Barnet:** “Vid vad?”  
> **Alve:** “Att det inte finns något mer att fixa.”

Barnet tittar mot verandan.

> **Barnet:** “Vi kan alltid hitta något om du blir desperat.”  
> **Alve:** “Nej tack.”

Ni går in en sista gång. Märkena finns kvar på väggen. Fotot sitter uppe. Spelet står på sin plats. Teckningen **VÅR STUGA** finns kvar.

Alve går långsamt genom rummet.

> **Alve:** “Det ser inte ut som förr.”  
> **Barnet:** “Nej.”  
> **Alve:** “Bra.”  
> **Barnet:** “Bra?”  
> **Alve:** “Det är vårt nu också.”

Paus.

> **Barnet:** “Tror du de kommer?”

Alve tittar mot dörren.

> **Alve:** “Inte idag.”  
> **Barnet:** “Hur vet du det?”  
> **Alve:** “Det bara känns så.”

Barnet väntar.

> **Alve:** “Men den är klar.”  
> **Barnet:** “Det är den.”

Alve ser på fotot igen.

> **Alve:** “Jag hoppas de får se den.”  
> **Barnet:** “Det tror jag.”  
> **Alve:** “Du vet inte det.”  
> **Barnet:** “Nej.”  
> **Barnet:** “Men jag hoppas också.”

Alve nickar. Sedan tittar han ut mot sjön.

> **Barnet:** “Vi kommer ju tillbaka imorgon.”  
> **Alve:** “Ja.”  
> **Barnet:** “Och då?”  
> **Alve:** “Vi har ju en båt att laga.”  
> **Barnet:** “Du har redan börjat tänka på nästa grej?”  
> **Alve:** “Någon måste.”  
> **Barnet:** “Det är tydligen vi.”

Alve går mot dörren.

> **Alve:** “Bra.”

Han tittar tillbaka på stugan en sista gång.

> **Alve:** “Då går vi.”


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
**1–4: “Jag vill att det ska bli som förr.” → 5–8: “Det kan bli bra på ett nytt sätt.” → 9–12: “Pappa har svårt att återvända, men någon har varit här.” → 13–16: “Stugan är klar, men Alve behöver inte vänta ensam.” → Act 2 finale: “Familjen kan återvända utan att låtsas att allt är som förr.”**

Adult-readable subtext: **mamma blev sjuk → familjen slutade komma → mamman dog off-screen before Act 2 → pappan undvek stugan because it hurt → Alve kept returning and repairing → the restored place, preserved memories and new life finally make it possible for pappan och storasystern to come back.** The death itself remains unspoken in child-facing dialogue.


## Motorbåten restoration arc — LOCKED 2026-09-28

Motorbåten unlocks only after Stugan, Bryggan and Båthuset are complete. It uses the same **4+4+4+4 = 16 authoritative real-world contributions**. Unlike the first three projects, its arc is not primarily about saving another place: it gathers the restored lake, village support network, Alve's family history and Adam/Alve friendship into the vehicle that will eventually carry them toward Act 3. The Act 3 destination remains deliberately undefined.

### Motorbåten dialogue lock — beats 1–3

**Narration rule:** player-facing prose uses **du/ni**, never “Barnet” in third person. **Barnet** remains the dialogue speaker label.

**1/16 — Äntligen båten**

Ni står i det färdiga båthuset och tittar på motorbåten.

Alve står helt stilla ovanligt länge.

> **Barnet:** “Du tänker säga det, eller hur?”  
> **Alve:** “Vadå?”  
> **Barnet:** “Att vi äntligen får börja med båten.”

Alve försöker låta lugn.

> **Alve:** “Jag tänkte faktiskt inte säga det.”

Paus.

> **Alve:** “ÄNTLIGEN.”  
> **Barnet:** “Där var det.”

Alve går runt båten och tittar på den från alla håll.

> **Alve:** “Vi har lagat stugan.”  
> **Barnet:** “Japp.”  
> **Alve:** “Bryggan.”  
> **Barnet:** “Japp.”  
> **Alve:** “Båthuset.”  
> **Barnet:** “Jag ser vart det här är på väg.”

Alve lägger handen på båten.

> **Alve:** “Nu är det din tur.”  
> **Barnet:** “Pratar du med båten?”  
> **Alve:** “Den har väntat länge.”  
> **Barnet:** “Det har du också.”  
> **Alve:** “Exakt.”

Ni börjar dra undan det som legat över båten och göra plats runt den.

> **Barnet:** “Den ser ganska ledsen ut.”  
> **Alve:** “Den ser gammal ut.”  
> **Barnet:** “Den kan vara båda.”

Alve torkar bort smuts från sidan.

> **Alve:** “Jag minns den nästan så här.”  
> **Barnet:** “Trasig?”  
> **Alve:** “Nej.”

Han tittar på den en stund.

> **Alve:** “Större.”  
> **Barnet:** “Du var mindre.”

Alve tittar på Barnet.

> **Alve:** “Det behöver inte vara förklaringen till allt.”  
> **Barnet:** “Det förklarar ganska mycket.”

Ni fortsätter röja fram båten.

> **Alve:** “Tänk om den faktiskt går att få igång.”  
> **Barnet:** “Det är väl därför vi är här.”  
> **Alve:** “Ja.”

Paus.

> **Alve:** “Men tänk om den gör det.”

Den här gången svarar Barnet inte med ett skämt.

> **Barnet:** “Då åker vi.”

Alve ler.

> **Alve:** “Då åker vi.”

**2/16 — Samma båt**

När ni går igenom båten upptäcker Barnet en detalj på sidan.

> **Barnet:** “Vänta.”  
> **Alve:** “Vad?”  
> **Barnet:** “Har inte jag sett den där förut?”  
> **Alve:** “Båten?”  
> **Barnet:** “Nej, den där.”

Du pekar på ett gammalt märke i sidan.

Alve böjer sig ner.

> **Alve:** “Jag vet inte.”  
> **Barnet:** “Fotot.”  
> **Alve:** “Vilket foto?”

Du tittar på honom.

> **Barnet:** “Det vi hittade i båthuset.”  
> **Alve:** “Just det.”  
> **Barnet:** “Det som du tittade på jättelänge.”  
> **Alve:** “Jag tittade normalt länge.”

Ni tar fram det gamla fotografiet och jämför.

Alve blir tyst.

> **Barnet:** “Det är samma märke.”  
> **Alve:** “Ja.”  
> **Barnet:** “Så det är samma båt.”

Alve håller fotot bredvid båten.

> **Alve:** “Det är den.”  
> **Barnet:** “Din familjs båt.”  
> **Alve:** “Mm.”

Han tittar på människorna på fotografiet och sedan på båten framför sig.

> **Barnet:** “Kommer du ihåg när ni åkte med den?”  
> **Alve:** “Lite.”  
> **Barnet:** “Vart åkte ni?”

Alve tänker.

> **Alve:** “Ut på sjön.”  
> **Barnet:** “Det förstod jag.”  
> **Alve:** “Jag var liten.”  
> **Barnet:** “Det har vi också förstått.”  
> **Alve:** “Jag minns mest ljudet.”  
> **Barnet:** “Motorn?”  
> **Alve:** “Mm. Och vinden.”

Han kisar mot fotot.

> **Alve:** “Och att man inte fick stå upp.”  
> **Barnet:** “Gjorde du det ändå?”

Alve tittar på honom.

> **Alve:** “Jag börjar ångra att jag berättat saker för dig.”  
> **Barnet:** “Så ja.”  
> **Alve:** “Kanske.”

Du tittar på fotografiet igen.

> **Barnet:** “Det är lite konstigt.”  
> **Alve:** “Vadå?”  
> **Barnet:** “Först var den bara en gammal båt.”  
> **Alve:** “Och nu?”  
> **Barnet:** “Nu vet vi att den varit någonstans.”

Alve tittar ut genom båthusöppningen över sjön.

> **Alve:** “Ja.”  
> **Barnet:** “Och du vet inte vart.”  
> **Alve:** “Nej.”

Paus.

> **Alve:** “Än.”

**3/16 — Linus känner igen den**

Linus kommer ner till båthuset för att titta på projektet.

Han går ett varv runt båten utan att säga något.

> **Alve:** “Nå?”  
> **Linus:** “Den är gammal.”  
> **Alve:** “Det visste vi.”  
> **Linus:** “Den har stått länge.”  
> **Alve:** “Det visste vi också.”  
> **Linus:** “Den är i sämre skick än du hoppas.”

Alve tittar på Barnet.

> **Alve:** “Han gör så här med flit.”  
> **Barnet:** “Jag tror det.”

Linus böjer sig ner och tittar på några av de gamla delarna ni hittade i båthuset.

> **Linus:** “Men allt är inte skräp.”

Alve lyser upp.

> **Alve:** “Så den går att laga?”  
> **Linus:** “Jag sa inte det.”  
> **Alve:** “Linus.”

Linus ler lite.

> **Linus:** “Ja. Jag tror det.”

Alve vänder sig direkt mot Barnet.

> **Alve:** “Hörde du?”  
> **Barnet:** “Jag står här.”  
> **Alve:** “Han tror den går att laga.”  
> **Linus:** “Om ni gör jobbet ordentligt.”  
> **Alve:** “Den delen hörde jag mindre tydligt.”

Linus tittar på fotografiet.

> **Linus:** “Var hittade ni den här?”  
> **Barnet:** “I kistan.”

Linus granskar bilden.

> **Alve:** “Känner du igen båten?”  
> **Linus:** “Ja.”

Alve blir genast allvarligare.

> **Alve:** “Vet du vart den åkte?”  
> **Linus:** “Över sjön.”  
> **Alve:** “Ja, men vart?”

Linus räcker tillbaka fotografiet.

> **Linus:** “Det får ni väl ta reda på.”  
> **Alve:** “Du vet.”  
> **Linus:** “Jag vet att en sjö har två sidor.”  
> **Alve:** “Det där är inte ett svar.”  
> **Linus:** “Det var inte meningen heller.”

Du tittar på Alve.

> **Barnet:** “Han är ganska bra på det här.”  
> **Alve:** “Fruktansvärt bra.”

Linus pekar mot båten.

> **Linus:** “Börja med båten framför er. Andra sidan finns kvar senare.”

Alve tittar ut över vattnet igen.

> **Alve:** “Sen.”  
> **Linus:** “Precis.”  
> **Alve:** “Jag börjar verkligen ogilla det ordet.”

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

### Motorbåten dialogue lock — beats 4–6

**4/16 — Inte idag**

Ni har jobbat vidare med båten tillsammans med Linus. En del går att rädda, annat får bytas, och för första gången börjar den faktiskt se ut som något som skulle kunna bli en båt igen.

Alve står med händerna i sidorna och granskar resultatet.

> **Alve:** “Nu då?”  
> **Linus:** “Nu vadå?”  
> **Alve:** “Nu borde den väl nästan funka.”

Linus tittar på honom.

> **Linus:** “Nej.”  
> **Alve:** “Du behövde inte svara så snabbt.”  
> **Linus:** “Jag visste svaret redan.”

Du tittar på båten.

> **Barnet:** “Den ser mycket bättre ut.”  
> **Alve:** “Exakt.”  
> **Linus:** “Det är inte samma sak som att den fungerar.”  
> **Alve:** “Du är väldigt dålig på att bygga upp stämningen.”  
> **Linus:** “Jag försöker bygga en båt.”

Alve böjer sig ner och tittar på en av delarna ni sorterat.

> **Alve:** “Den här sparar vi?”  
> **Linus:** “Ja.”  
> **Alve:** “Och den där?”  
> **Linus:** “Nej.”  
> **Alve:** “Varför inte?”  
> **Linus:** “För att den är slut.”  
> **Alve:** “Kan man inte laga den?”  
> **Linus:** “Allt går inte att laga.”

Alve blir tyst en sekund.

> **Alve:** “Det där låter väldigt vuxet.”  
> **Linus:** “Det var inte meningen.”

Du håller upp en annan gammal del.

> **Barnet:** “Den här då?”

Linus tittar.

> **Linus:** “Den kan vi använda.”

Alve tar den direkt.

> **Alve:** “Bra.”  
> **Barnet:** “Du gillar den.”  
> **Alve:** “Jag gillar saker vi slipper kasta.”  
> **Linus:** “Då har du lärt dig något.”  
> **Alve:** “Säg inte det till någon.”

Ni fortsätter en stund.

Till slut backar Linus undan och tittar på båten.

> **Linus:** “Det räcker för idag.”  
> **Alve:** “Va?”  
> **Linus:** “För idag.”  
> **Alve:** “Men vi är ju igång.”  
> **Linus:** “Precis.”  
> **Alve:** “Det där är ett dåligt argument för att sluta.”

Linus börjar plocka ihop verktygen.

> **Alve:** “Tror du den kommer funka?”

Linus tittar på båten.

> **Linus:** “Inte idag.”

Alve suckar djupt.

> **Alve:** “Alla säger så hela tiden.”  
> **Barnet:** “Vadå?”  
> **Alve:** “Inte idag.”

Du tittar på båten.

> **Barnet:** “Då fortsätter vi imorgon.”

Alve tittar på dig. Sedan på båten.

> **Alve:** “Okej.”

Paus.

> **Alve:** “Men tidigt.”  
> **Barnet:** “Hur tidigt?”  
> **Alve:** “Jättetidigt.”  
> **Linus:** “Nej.”  
> **Alve:** “Du behöver verkligen sluta svara så snabbt.”

**5/16 — Det som saknas**

Nästa gång ni fortsätter har Alve redan lagt ut delarna på golvet i små högar.

Du stannar i dörren.

> **Barnet:** “Vad har hänt här?”  
> **Alve:** “Ordning.”  
> **Barnet:** “Det där ser inte ut som ordning.”  
> **Alve:** “Jo.”

Alve pekar.

> **Alve:** “Bra saker.”

En annan hög.

> **Alve:** “Dåliga saker.”

En tredje.

> **Alve:** “Saker jag inte vet.”  
> **Barnet:** “Det är den största högen.”  
> **Alve:** “Jag är fortfarande i början.”

Linus kommer in och tittar på golvet.

> **Linus:** “Vad är det här?”  
> **Alve:** “System.”  
> **Linus:** “Nej.”  
> **Barnet:** “Jag sa nästan samma sak.”

Linus går igenom delarna och stannar vid en tom plats.

> **Linus:** “Här har vi problemet.”  
> **Alve:** “Vilket problem?”  
> **Linus:** “Några av delarna till motorn är för slitna. De går inte att rädda.”  
> **Alve:** “Kan vi hitta gamla?”  
> **Linus:** “Inte sådana jag skulle sätta tillbaka i den här båten.”  
> **Barnet:** “Så vad behöver vi?”  
> **Linus:** “Ett reservdelspaket.”  
> **Alve:** “Har du ett?”  
> **Linus:** “Nej.”  
> **Alve:** “Kan du göra ett?”  
> **Linus:** “Nej.”  
> **Alve:** “Du säger nej väldigt mycket idag.”  
> **Linus:** “Mira kan få tag på ett.”

Alve tittar på dig.

> **Alve:** “Lanthandeln?”  
> **Barnet:** “Lanthandeln.”  
> **Alve:** “Bra. Då går vi.”

Han börjar redan gå.

> **Linus:** “Alve.”

Alve stannar.

> **Alve:** “Vad?”  
> **Linus:** “Ta reda på vad ni ska köpa först.”

Alve går tillbaka.

> **Alve:** “Just det.”  
> **Barnet:** “Bra plan.”  
> **Alve:** “Jag hade nästan hela.”

Linus förklarar vad reservdelspaketet ska lösa, enkelt och utan tekniska motorinstruktioner.

Du lyssnar. Alve nickar väldigt allvarligt.

När Linus är klar blir det tyst.

> **Barnet:** “Kommer du ihåg allt?”  
> **Alve:** “Nej.”  
> **Linus:** “Jag skriver ner det.”  
> **Alve:** “Det var också min plan.”

**6/16 — Mira beställer två**

Ni kommer in till Mira med lappen från Linus.

Mira läser den. Sedan läser hon den en gång till.

> **Mira:** “Så ni tänker verkligen få igång den där gamla båten?”  
> **Barnet:** “Ja.”  
> **Mira:** “Och Alve är inblandad?”  
> **Barnet:** “Ja.”

Mira tittar på Alve.

> **Alve:** “Hej.”

Mira tittar tillbaka på beställningen.

> **Mira:** “Jag beställer ett reservdelspaket.”  
> **Alve:** “Bra.”  
> **Mira:** “Och en extra av den viktigaste delen.”  
> **Alve:** “Varför?”  
> **Mira:** “För att du är inblandad.”

Du börjar skratta.

> **Alve:** “Vad betyder ens det?”  
> **Mira:** “Att jag har träffat dig.”  
> **Alve:** “Jag tycker inte om vart det här samtalet är på väg.”

Mira lägger undan lappen.

> **Mira:** “Det blir 200 SysselBux.”

Alve tittar på dig.

> **Alve:** “Vi har råd, eller hur?”  
> **Barnet:** “Ja.”  
> **Alve:** “Bra. För jag har redan bestämt mig.”  
> **Mira:** “Det märktes.”

Du betalar 200 SysselBux genom den auktoritativa story-item-köpsfunktionen.

Mira gör klart beställningen.

> **Mira:** “Det kommer inte göra båten färdig.”  
> **Alve:** “Jag vet.”

Mira tittar på honom lite misstänksamt.

> **Mira:** “Gör du?”  
> **Alve:** “Ja.”  
> **Mira:** “Och du tänker inte försöka starta den direkt?”

Alve blir tyst.

Du tittar på honom.

Mira tittar på honom.

> **Alve:** “Vad räknas som direkt?”  
> **Mira:** “Alve.”  
> **Alve:** “Okej.”

Han tittar på dig.

> **Alve:** “Inte direkt.”  
> **Barnet:** “Det där lät inte särskilt pålitligt.”  
> **Mira:** “Därför beställde jag två.”

**Economy lock:** the motorboat story purchase is a **reservdelspaket** costing **200 SysselBux**. It must use the authoritative backend wallet and is an intermediate story/economy beat, not a contribution.

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

### Motorbåten dialogue lock — beats 7–9

**7/16 — Paketet kommer**

Nästa gång ni kommer till båthuset ligger ett paket på arbetsbänken.

Alve stannar mitt i steget.

> **Alve:** “Är det där…”  
> **Barnet:** “Japp.”  
> **Alve:** “Redan?”  
> **Barnet:** “Mira sa att det skulle komma.”  
> **Alve:** “Jag trodde vuxna sa så för att få barn att gå hem.”

Du går fram till paketet. Alve är redan bredvid dig.

> **Barnet:** “Du tänker öppna det innan Linus kommer.”  
> **Alve:** “Nej.”

Paus.

> **Alve:** “Jag tänkte öppna det väldigt försiktigt innan Linus kommer.”  
> **Barnet:** “Det är samma sak.”  
> **Alve:** “Inte alls.”

Linus kommer in genom dörren. Han tittar på Alve. Sedan på paketet. Sedan på Alve igen.

> **Linus:** “Nej.”  
> **Alve:** “Jag har inte gjort något.”  
> **Linus:** “Bra.”  
> **Alve:** “Du kan inte säga nej i förväg.”  
> **Linus:** “Jag börjar lära mig.”

Linus öppnar paketet tillsammans med er.

Alve tittar ner i lådan.

> **Alve:** “Det där ser mindre spännande ut än jag hade tänkt mig.”  
> **Barnet:** “Vad hade du tänkt dig?”  
> **Alve:** “Något mer… båtmotorigt.”  
> **Linus:** “Det här är båtmotorigt.”  
> **Alve:** “Det ser ut som en låda med saker.”  
> **Linus:** “Det är ungefär vad reservdelar är.”

Ni börjar jobba. Linus visar vad som ska användas, men låter er göra så mycket som möjligt själva.

Efter en stund lutar sig Alve tillbaka.

> **Alve:** “Nu.”  
> **Linus:** “Nej.”  
> **Alve:** “Du vet inte ens vad jag skulle säga.”  
> **Linus:** “Jo.”  
> **Alve:** “Vad då?”  
> **Linus:** “Att ni ska prova att starta den.”

Alve blir tyst.

> **Barnet:** “Han börjar bli läskigt bra på dig.”  
> **Alve:** “Det här är ett problem.”  
> **Linus:** “Ni är inte klara.”  
> **Alve:** “Men vi har satt dit de nya sakerna.”  
> **Linus:** “Ja.”  
> **Alve:** “Och den ser redo ut.”  
> **Linus:** “Den ser mindre trasig ut.”  
> **Alve:** “Det är nästan samma sak.”  
> **Linus:** “Nej.”

Alve suckar.

> **Alve:** “Vad ska vi göra då?”

Linus pekar mot resten av båten.

> **Linus:** “Fortsätta.”

Alve tittar på dig.

> **Alve:** “Det här projektet innehåller väldigt mycket fortsätta.”  
> **Barnet:** “Det brukar projekt göra.”  
> **Alve:** “Jag saknar delen där man är klar.”

**8/16 — Den lever**

Ni har gjort klart det Linus ville att ni skulle göra. Båten står fortfarande säkert i båthuset.

Alve har varit ovanligt tyst de senaste minuterna.

> **Barnet:** “Nu tänker du väldigt högt utan att säga något.”  
> **Alve:** “Jag väntar.”  
> **Barnet:** “På vad?”

Alve tittar på Linus. Linus fortsätter kontrollera båten.

> **Alve:** “På ett ord.”

Linus tittar upp.

> **Linus:** “Okej.”

Alve stirrar på honom.

> **Alve:** “Var det ordet?”  
> **Linus:** “Ja.”  
> **Alve:** “Får vi prova?”  
> **Linus:** “Ja.”

Alve ser på dig.

> **Alve:** “Han sa ja.”  
> **Barnet:** “Jag hörde.”  
> **Alve:** “Det händer aldrig.”  
> **Linus:** “Vill ni prova eller vill ni prata om att ni får prova?”  
> **Alve:** “Prova.”

Ni gör ett första försök.

Ingenting händer.

Alve stirrar på båten.

> **Alve:** “Okej.”  
> **Barnet:** “Okej?”  
> **Alve:** “Den kanske behöver tänka.”  
> **Linus:** “Båtar tänker inte.”  
> **Alve:** “Det vet du inte.”

Ni provar igen.

Fortfarande ingenting.

Alve sjunker ihop lite.

> **Alve:** “Det här var mindre dramatiskt än jag hade planerat.”  
> **Barnet:** “Du hade planerat dramatik?”  
> **Alve:** “Lite.”

Linus tittar lugnt på båten.

> **Linus:** “En gång till.”

Ni försöker igen.

Ett kort ljud hörs från motorn.

Sedan tystnar den.

Alve fryser till.

> **Alve:** “Hörde du?!”  
> **Barnet:** “Ja.”  
> **Alve:** “DEN LEVER.”  
> **Linus:** “Lugn.”  
> **Alve:** “DEN LEVER LUGNT.”

Du börjar skratta.

> **Linus:** “Den startade i ungefär en sekund.”  
> **Alve:** “Det var en väldigt bra sekund.”  
> **Barnet:** “En historisk sekund.”  
> **Alve:** “Exakt.”

Linus försöker se sträng ut, men ler lite.

> **Linus:** “Det är framsteg.”

Alve tittar på båten.

> **Alve:** “Hörde du?”  
> **Barnet:** “Nu pratar du med båten igen.”  
> **Alve:** “Den förtjänar beröm.”

Alve klappar försiktigt på sidan.

> **Alve:** “Bra jobbat.”  
> **Barnet:** “Det var vi som jobbade.”  
> **Alve:** “Vi kan också få beröm.”

Han håller upp handen. Du slår till den.

> **Alve:** “Bra jobbat.”

**9/16 — Ner i vattnet**

För första gången sedan ni började med motorbåten ska den lämna båthuset.

Ni står vid slipen och tittar på den.

> **Alve:** “Den ser nervös ut.”  
> **Barnet:** “Det är en båt.”  
> **Alve:** “Man kan se det på den.”  
> **Barnet:** “Var?”

Alve pekar vagt.

> **Alve:** “Där.”  
> **Barnet:** “Övertygande.”

Linus står bredvid och håller upp en hand.

> **Linus:** “Lugnt nu.”  
> **Alve:** “Jag är lugn.”  
> **Barnet:** “Du har sagt det ungefär fyra gånger.”  
> **Alve:** “Det är för att jag är väldigt lugn.”

Ni hjälper till att få båten ner mot vattnet.

När den till slut ligger i sjön blir Alve helt tyst.

Du tittar på honom.

> **Barnet:** “Vad?”  
> **Alve:** “Den flyter.”  
> **Barnet:** “Det är bra för en båt.”  
> **Alve:** “Jag vet.”

Han går närmare kanten.

> **Alve:** “Men den flyter faktiskt.”

Linus kontrollerar att allt ser bra ut.

> **Linus:** “Det här är bara första testet.”  
> **Alve:** “Ja.”  
> **Linus:** “Ni åker inte långt.”  
> **Alve:** “Nej.”  
> **Linus:** “Ni gör inget dumt.”

Alve tittar på dig.

> **Barnet:** “Titta inte på mig.”  
> **Alve:** “Jag sa inget.”  
> **Linus:** “Jag såg.”

Alve kliver försiktigt ner i båten. Du kliver efter.

För ett ögonblick händer ingenting. Vattnet rör sig mjukt runt skrovet.

Alve tittar tillbaka mot båthuset.

> **Alve:** “Den har stått där inne jättelänge.”  
> **Barnet:** “Mm.”  
> **Alve:** “Och nu är den här.”  
> **Barnet:** “I sjön.”  
> **Alve:** “I sjön.”

Han ler.

> **Alve:** “Det känns som att det borde vara musik.”  
> **Barnet:** “Vill du sjunga?”  
> **Alve:** “Absolut inte.”

Linus ropar från land.

> **Linus:** “Redo?”

Alve tittar på dig.

> **Alve:** “Redo?”  
> **Barnet:** “Japp.”

Alve tar ett djupt andetag.

> **Alve:** “Okej.”

Han tittar på båten.

> **Alve:** “Nu får du visa vad du kan.”

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

### Motorbåten dialogue lock — beats 10–12

**10/16 — Första turen**

Motorn går. Inte bara ett hostande ljud den här gången. Den går faktiskt.

Alve stirrar på den som om han inte riktigt litar på vad han hör.

> **Alve:** “Den går.”  
> **Barnet:** “Japp.”  
> **Alve:** “Den går fortfarande.”  
> **Barnet:** “Japp.”  
> **Alve:** “Vi borde kanske säga något mer.”  
> **Barnet:** “Kör?”

Alve tittar upp.

> **Alve:** “Kör.”

Ni lämnar bryggan långsamt.

Linus står kvar på land med armarna i kors.

Alve tittar bakåt.

> **Alve:** “Vi åker.”  
> **Barnet:** “Det brukar hända när man kör båt.”  
> **Alve:** “Nej, men vi åker.”

Du tittar tillbaka mot bryggan. Den blir sakta mindre.

> **Barnet:** “Vi har faktiskt lämnat land.”  
> **Alve:** “Jag vet.”

Paus.

> **Alve:** “Det här är fantastiskt.”

Ni kommer en liten bit ut.

Alve håller blicken framåt.

> **Alve:** “Tror du vi kan åka längre?”  
> **Barnet:** “Linus sa inte långt.”  
> **Alve:** “Det här är inte långt.”  
> **Barnet:** “Än.”

Alve ler.

Sedan hostar motorn.

Alve slutar le.

> **Alve:** “Nej.”

Motorn hostar igen.

> **Alve:** “Nej nej nej.”

Den stannar.

Tystnad.

Båten glider sakta vidare en liten bit.

> **Barnet:** “Den stannade.”  
> **Alve:** “Jag märkte det.”  
> **Barnet:** “Vill du att jag säger att det gick ganska bra?”  
> **Alve:** “Inte än.”

Från bryggan hörs Henning ropa.

> **Henning:** “GÅR DET BRA?”  
> **Alve:** “JAPP!”

Du tittar på honom.

> **Barnet:** “Det gör det inte.”  
> **Alve:** “DET GÅR GANSKA BRA!”

Henning vinkar glatt.

> **Barnet:** “Varför sa du så?”  
> **Alve:** “För att det gick väldigt bra precis innan det slutade gå bra.”

Du börjar skratta. Alve gör det också.

> **Alve:** “Vi kom i alla fall ut.”  
> **Barnet:** “Och nu ska vi tillbaka.”  
> **Alve:** “Detaljer.”

**11/16 — Tillbaka igen**

Efter en stund får ni hjälp tillbaka till bryggan.

Alve hoppar iland.

> **Henning:** “Det såg väldigt bra ut.”  
> **Barnet:** “Tills det inte gjorde det.”  
> **Henning:** “Jag tittade mest i början.”  
> **Alve:** “Bra val.”

Linus kommer fram.

> **Linus:** “Hur gick det?”  
> **Alve:** “Perfekt.”

Du tittar på honom.

> **Alve:** “Nästan perfekt.”

Linus tittar på dig.

> **Barnet:** “Vi kom ungefär dit.”

Du pekar ut över vattnet.

> **Linus:** “Och sen?”  
> **Barnet:** “Sen slutade den gå.”  
> **Alve:** “Men innan dess gick den.”  
> **Linus:** “Det är därför man testar.”  
> **Alve:** “Jag trodde test betydde att man skulle se om den fungerade.”  
> **Linus:** “Det gjorde ni.”  
> **Alve:** “Och?”

Linus tittar på båten.

> **Linus:** “Den fungerar.”

Alve lyser upp.

> **Linus:** “Inte tillräckligt bra än.”

Alve sjunker ihop igen.

> **Alve:** “Du borde verkligen lägga till hela meningen direkt.”

Henning tittar ner i båten.

> **Henning:** “Behöver ni hjälp?”  
> **Alve:** “Kan du laga båtmotorer?”  
> **Henning:** “Nej.”  
> **Alve:** “Då är svaret lite oklart.”  
> **Henning:** “Jag kan ta med fika.”

Alve tänker.

> **Alve:** “Okej. Du är med.”

Linus skakar på huvudet.

Ni börjar gå igenom vad som återstår.

Den här gången låter Alve inte lika otålig.

> **Barnet:** “Du försöker inte starta den igen.”  
> **Alve:** “Nej.”  
> **Barnet:** “Är du sjuk?”  
> **Alve:** “Jag tänkte vänta tills vi vet varför den stannade.”

Linus tittar upp.

> **Linus:** “Bra.”

Alve ser genast irriterad ut.

> **Alve:** “Säg inte det så där.”  
> **Linus:** “Hur då?”  
> **Alve:** “Som att jag lär mig saker.”

**12/16 — Vår båt**

Efter ännu mer arbete står motorbåten vid bryggan igen.

Den ser färdig ut nu. Inte ny, men hel. Användbar. Er.

Sol har lämnat säkerhetsutrustning. Mira har fixat det praktiska ni saknade. Henning har lyckats ställa en alldeles för stor påse fika i båten.

Alve tittar ner i den.

> **Alve:** “Varför är det så mycket mat?”  
> **Barnet:** “Henning.”  
> **Alve:** “Det svarade faktiskt på frågan.”

Linus går ett sista varv runt båten.

> **Alve:** “Nu är den klar.”  
> **Linus:** “Nej.”

Alve snurrar runt.

> **Alve:** “VA?”  
> **Linus:** “Ni har inte provat om den håller hela vägen.”  
> **Alve:** “Vi har ju kört den.”  
> **Linus:** “En liten bit.”  
> **Barnet:** “Och blivit hämtade.”  
> **Alve:** “Det behöver vi inte ta upp varje gång.”

Linus klappar på relingen.

> **Linus:** “Den ser klar ut.”  
> **Alve:** “Bra.”  
> **Linus:** “Nu ska ni bevisa att den är det.”

Alve suckar, men ler samtidigt.

> **Alve:** “Okej.”

Han går runt båten och stannar vid sidan.

> **Alve:** “Den behöver ett namn.”  
> **Barnet:** “Gör den?”  
> **Alve:** “Alla bra båtar har namn.”  
> **Barnet:** “Hur många båtar känner du?”  
> **Alve:** “Det är inte viktigt.”

Du tittar på båten.

> **Barnet:** “Vad ska den heta då?”

Alve tänker länge.

> **Alve:** “Jag vet inte.”  
> **Barnet:** “Starkt.”  
> **Alve:** “Det måste vara bra.”  
> **Barnet:** “Jag kan döpa den.”

Alve tittar på dig.

> **Alve:** “Okej.”  
> **Alve:** “Men välj något bra.”  
> **Barnet:** “Ingen press.”  
> **Alve:** “Jättemycket press.”

**Naming interaction lock:** after this dialogue, the player names the motorboat. The chosen name becomes persistent and may be reused in later dialogue/UI where technically practical. The boat is now emotionally framed as **Barnet and Alve's shared adventure boat**, not merely Alve's family's old motorboat.

### Motorbåten dialogue lock — beats 13–15

**13/16 — Det riktiga testet**

Nästa gång ni kommer ner till bryggan står båten redo. Alve går igenom sakerna ombord en efter en.

> **Barnet:** “Vad gör du egentligen?”  
> **Alve:** “Kontrollerar allt. Jag har lärt mig att om man missar något så dyker Linus upp och kontrollerar det åt en ändå, så jag försöker ligga före.”

Linus kommer gående bakom er.

> **Linus:** “Bra tänkt.”

Alve suckar.

> **Alve:** “Där är han.”

Sol lämnar säkerhetsutrustningen i båten.

> **Sol:** “Det här ska med. Ni har kommit långt, men en fungerande båt betyder också att man måste vara lite smartare än när den bara står på land.”  
> **Alve:** “Vi har redan grejer.”  
> **Sol:** “Nu har ni rätt grejer.”

Mira räcker över en liten påse.

> **Mira:** “Och det här är sådant ni kommer önska att ni tog med om något litet strular. Inte spännande, men väldigt bra att ha.”  
> **Alve:** “Det där lät misstänkt genomtänkt.”  
> **Mira:** “Därför får du inte packa upp det och börja använda saker på måfå.”

Henning kommer med en betydligt större påse.

> **Barnet:** “Det där är inte säkerhetsutrustning.”  
> **Henning:** “Nej, det är viktigare. Färdkost.”  
> **Barnet:** “Vi ska testa båten, inte korsa Atlanten.”  
> **Henning:** “Man vet aldrig hur hungrig man blir av att nästan korsa Atlanten.”

Alve nickar uppskattande.

> **Alve:** “Äntligen någon som planerar ordentligt.”

Linus går ett sista varv runt båten.

> **Linus:** “Ni har det ni behöver. Ni har gått igenom båten. Ni vet hur långt ni ska köra och när ni ska vända. Så, redo?”  
> **Alve:** “Japp.”  
> **Barnet:** “Japp.”

Linus nickar.

> **Linus:** “Bra. Då behöver ni inte mig.”

Alve tittar på honom.

> **Alve:** “Vänta. Ska du inte följa med?”  
> **Linus:** “Nej. Hela poängen med testet är att ni ska visa att ni kan använda båten själva. Jag finns kvar här om något händer, men ni behöver inte ha en vuxen bredvid er för varje steg.”

Alve tittar på båten igen.

> **Alve:** “Det här känns mycket större än det gjorde för fem minuter sen.”  
> **Barnet:** “Du ville ju köra.”  
> **Alve:** “Jag vill fortfarande köra. Jag vill bara att du också ska vilja det.”  
> **Barnet:** “Jag sitter redan i båten.”

Alve ler.

> **Alve:** “Bra svar.”

**14/16 — Vi åker båt**

Motorn startar utan att tveka. Ni lämnar bryggan och glider ut över sjön.

En stund säger ingen någonting.

Du tittar tillbaka på stugan, bryggan och båthuset.

> **Alve:** “Det ser nästan konstigt ut härifrån. När vi började var allt trasigt eller tomt, och nu ser det ut som om det alltid har varit så här.”  
> **Barnet:** “Fast vi vet hur det såg ut.”  
> **Alve:** “Ja. Det är nog därför det känns så konstigt.”

Han pekar tillbaka mot land.

> **Alve:** “Bryggan höll nästan på att falla sönder. Båthuset gick knappt att använda. Stugan var tom. Och båten stod bara där inne och blev äldre.”  
> **Barnet:** “Nu används allt.”  
> **Alve:** “Ja.”

Han blir tyst och tittar framåt.

> **Alve:** “Barnet.”  
> **Barnet:** “Mm?”  
> **Alve:** “Vi åker faktiskt båt.”  
> **Barnet:** “Det var ju planen.”  
> **Alve:** “Jag vet. Men det är skillnad på att planera något och att plötsligt vara mitt ute på sjön i båten man har lagat själv.”

Du ler.

> **Barnet:** “Vår båt.”  
> **Alve:** “Ja. Vår båt.”

Ni fortsätter längs er sida av sjön.

> **Alve:** “Jag undrar hur långt den klarar egentligen.”  
> **Barnet:** “Vi ska inte ta reda på allt idag.”

Alve tittar mot andra sidan. Du märker det direkt.

> **Barnet:** “Jag såg den där blicken.”  
> **Alve:** “Vilken blick?”  
> **Barnet:** “Den som betyder att du funderar på att bara fortsätta tills någon stoppar dig.”

Alve skrattar.

> **Alve:** “Okej. Jag tänkte lite så.”

Sedan tittar han framåt igen.

> **Alve:** “Men inte idag.”

Du tittar på honom.

> **Barnet:** “Det där var oväntat.”  
> **Alve:** “Jag lär mig faktiskt saker ibland.”  
> **Barnet:** “Säg inte det högt. Linus kanske hör dig från land.”

**15/16 — Inte idag**

Ni har kommit längre bort än under något tidigare test. Motorn går jämnt.

Sedan hörs ett klonk bakom er.

Alve börjar resa sig direkt.

> **Barnet:** “Vänta. Båten först.”

Han stannar och sätter sig igen.

> **Alve:** “Just det. Först ser vi till att inget händer, sen fixar vi grejen.”

Tillsammans ordnar ni det som lossnat utan dramatik.

Efteråt lutar sig Alve tillbaka.

> **Alve:** “Det där gick faktiskt ganska bra.”  
> **Barnet:** “Ja. Du kastade dig inte på problemet direkt.”  
> **Alve:** “Jag tänkte göra det.”  
> **Barnet:** “Det märktes.”  
> **Alve:** “Men jag gjorde det inte.”  
> **Barnet:** “Det är framsteg.”

Alve ser misstänksam ut.

> **Alve:** “Du börjar låta som Linus.”

Ni fortsätter till platsen där ni bestämt att ni ska vända.

Den andra sidan av sjön ligger framför er.

Alve blir tyst.

> **Barnet:** “Du tänker på den.”  
> **Alve:** “Ja.”

Han tittar över vattnet.

> **Alve:** “Vi skulle kunna fortsätta. Båten fungerar, vi har allt med oss och vi har till och med Hennings katastrofmängd mat.”  
> **Barnet:** “Det skulle vi.”

Alve tittar på dig.

> **Barnet:** “Men inte idag.”

Alve säger inget först. Sedan nickar han.

> **Alve:** “Inte idag.”

Paus.

> **Barnet:** “Du brukar hata de orden.”

Alve tittar mot andra sidan.

> **Alve:** “Ja. Men jag tror jag fattar dem bättre nu. ‘Inte idag’ betyder ju inte att man aldrig kommer dit.”  
> **Barnet:** “Precis.”

Alve vänder båten tillbaka.

Efter en stund syns stugan igen långt borta.

> **Alve:** “Då åker vi hem.”

Du tittar på honom.

> **Barnet:** “Hem?”

Alve följer din blick mot stugan.

Sedan svarar han mycket enklare.

> **Alve:** “Ja.”

### Motorbåten dialogue lock — beat 16

**16/16 — Hem igen**

Båten glider tillbaka mot bryggan.

Den här gången stannar den inte. Inget hostar, inget lossnar och ingen behöver komma och hämta er.

Alve sitter tyst en stund och tittar mot land.

> **Alve:** “Det känns nästan konstigt att allt bara fungerar nu. Förut hann man knappt bli glad innan något gick sönder igen.”  
> **Barnet:** “Vi har väl blivit bättre på att laga saker.”  
> **Alve:** “Eller bättre på att inte förstöra dem direkt.”

När ni närmar er bryggan står de andra där och väntar.

> **Alve:** “Jag tänker säga att hela turen gick perfekt.”  
> **Barnet:** “Även delen där grejerna lossnade?”  
> **Alve:** “Den delen var en övning i problemlösning.”

Ni lägger till.

Linus tittar först på båten och sedan på er.

> **Linus:** “Ni kom tillbaka själva, båten är hel och motorn går fortfarande. Det får räknas som ett godkänt test.”

Alve tittar misstänksamt på honom.

> **Alve:** “Det kommer inget ‘men’?”  
> **Linus:** “Nej.”

Alve väntar lite.

> **Alve:** “Det där kändes nästan läskigare.”

Linus ler.

> **Linus:** “Bra jobbat.”

Valpen springer fram och nosar direkt på Hennings matsäck.

> **Alve:** “Vi har varit ute på sjön och bevisat att båten fungerar, och han bryr sig om mackor.”  
> **Henning:** “Han förstår vad som är viktigt.”

Sol tittar på båten.

> **Sol:** “Hur kändes den?”

Alve ser tillbaka över sjön.

> **Alve:** “Som att den inte längre är den gamla båten vi hittade i båthuset.”

Han lägger handen på relingen.

> **Alve:** “Nu är den vår.”

Du tittar på båten.

> **Barnet:** “Det är den.”

Alve ler.

> **Alve:** “Så då är vi klara?”

Linus nickar.

> **Linus:** “Med båten, ja.”

Alve tittar på dig.

> **Alve:** “Jag tar det.”

**Boundary lock:** beat 16 ends the motorboat project itself. It must **not** begin the cottage/family discovery. The already locked Act 2 finale remains a separate post-project Story Moment: quiet aftermath → open cottage / suspected intruders → family return → first departure in the restored boat → **SLUT PÅ ANDRA KAPITLET**.

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

### Act 2 family-return payoff — superseded summary

The authoritative dialogue is **Act 2 finale dialogue — family return and first crossing** above. Do not maintain a second divergent reveal script here.

Locked family facts:
- Alve's mother became ill and later died before Act 2; her death is never stated outright in child-facing dialogue.
- The returning household is **Pappan + storasyster i tidiga tonåren**.
- The mother remains visible only through memories and the old family photograph.
- The father has avoided the cottage because returning there is emotionally difficult. His line **“Jag har åkt hitåt flera gånger. …Jag kom inte hela vägen.”** is the strongest adult-facing clue.
- The reveal still pays off **“Vi gjorde det”**, the preserved memories, the father-and-sister embrace, **“Det är min kompis.”**, and the quiet veranda thesis **“Jag kunde inte laga det som hände. Men jag kunde laga stugan.”**
- The thematic resolution remains: the family does not recreate the past; they become able to live at the place again in a new form.

Canonical Motorbåten arc: **1–4 history/diagnosis → 5–8 village support/first life → 9–12 water test/their boat → 13–16 independent proper test/homecoming → family return payoff.**

Canonical Act 2 contribution count is now **64 authored contributions total: 16 Stugan + 16 Bryggan + 16 Båthuset + 16 Motorbåten.**
