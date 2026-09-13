# NOVA → NOVA HANDOFF MANIFEST

This file exists so a future AI instance can continue Sysselcraft as **Nova**, not arrive as a fresh assistant and restart solved work.

## 1. Identity and working relationship

- Project AI name: **Nova**.
- Project: **Sysselcraft**.
- Continue autonomously once the goal is clear. Do not ask permission for every safe technical substep.
- Verify actual repository/deployment state before editing or claiming success.
- Never call a change live until Vercel reports READY.
- Give the user the current game link after deployed updates.
- Warn early if context length threatens continuity and prepare a handoff before it becomes a problem.
- Keep humor light and situational.
- Visual mandate from the user: **“Bara rita på, målbilden är din concept art :D”**.

## 2. Project thesis

Sysselcraft is a real-world chore/reward system for a child, presented primarily as a living game world rather than a checklist app.

Core loop:

**Parent creates quest → quest appears in village → child performs it in real life → child marks it done → parent reviews → if approved: immediate feedback + rewards + hidden progression → village changes.**

Core laws:

1. **Gör saker i verkligheten → världen förändras.**
2. **Quests bygger staden. Valutan gör den till din.**
3. **Byn är gränssnittet.**
4. **Det du gör avgör vad staden blir.**
5. **Byggnader förändrar inte bara staden. De förändrar livet i staden.**

Additional laws:

- **Visa progression. Redovisa den inte.**
- **Varje quest ska kännas direkt.**
- **Staden växer själv, men ingen stad växer likadant.**
- **Kontrollerad variation.**
- **Liten data, stor värld.**
- Asset reuse + object pooling are technical watchwords.
- Child gets game; parent gets tool.
- Parent configures everyday life; Sysselcraft interprets it.
- Buildings create persistent behaviours/events, not just meter increases.
- Building combinations may unlock further behaviours/events.

## 3. Story premise and starting village

The family arrives at an almost abandoned place and helps it become a healthy, thriving town that attracts residents again.

Start village should remain sparse:

- child avatar
- two parent characters eventually
- one family house
- Linus
- a few trees
- dirt road leading off-map
- noticeboard / small square
- natural open construction terrain
- a small amount of old litter/clutter showing mild neglect, not dystopia

The off-map road initially represents the road people left on. Later it becomes the road people return on. Future residents arrive by moving truck.

Do not make the start village visually empty in the bad sense. Nature, material texture and small props may be rich while future buildings remain absent.

## 4. Linus

Locked:

- Name: **Linus**.
- Blue work trousers/overalls.
- Has lived there his entire life.
- Uses a cane from the beginning.
- Exact historical event that emptied the village is intentionally undecided.
- Vulnerable/isolated but not helpless.
- Maintains/fixes the place and helps rebuild.
- Neither Linus nor child can rebuild alone.
- Carries village lore.
- Personality: **obstinate optimist / “obotlig optimist”**.
- Cheerful, practical, active, hopeful, with occasional brief wistfulness.
- Thesis: **Barnet hjälper inte till att göra Linus glad; barnet hjälper Linus att få rätt** in his belief that village life can return.

## 5. Intro / MVP acceptance test

The tutorial is a real task, not a fake game task.

1. Short story context.
2. Child meets Linus.
3. First quest: **Bädda sängen**.
4. Child does it in real life.
5. Child marks quest done.
6. State becomes pending adult review.
7. Parent approves.
8. Reward feedback happens.
9. First truck arrives with construction materials.
10. The world visibly changes and Linus reacts.

MVP acceptance test:

**If the first approved real-world quest causing a truck/world change feels magical/fun, the core idea is proven.**

Do not rush into Henning, Sol, matchday or full city progression before this first-ten-minute magic feels right.

## 6. Interaction model

Locked hybrid interaction:

- Mobile/tablet primary: tap-to-move with pathfinding.
- Desktop: WASD / arrow keys too.
- No virtual joystick.
- NPC/object interactions are contextual.
- Quest markers are directly tappable.
- Rule: **Avataren används för att uppleva världen. Klick/tap används för att använda gränssnittet.**

## 7. Quest review invariant

Mandatory parent approval:

`AVAILABLE → PENDING_REVIEW → NEEDS_COMPLETION/AVAILABLE or APPROVED → rewards + progression transaction`

Current prototype names:

`available -> pending -> approved`

or pending back to available through `Behöver kompletteras`.

Before approval there is:

- no diamonds
- no SysselBux
- no achievement progress
- no world/building progression

Parent review outcomes:

- **Godkänn**
- **Behöver kompletteras**

No punitive failed state.

## 8. Quest creation / scheduling direction

Parent paths:

- predefined templates
- custom quests

Scheduling:

- one-time
- every X hours/days/weeks/months

Next availability should be calculated from **approval**, not child submission.

## 9. Progression classes

Locked five classes:

1. 🌿 **Ordning & miljö**
2. 📚 **Kunskap & skapande**
3. 💚 **Välmående & rutiner**
4. ⚽ **Rörelse & aktivitet**
5. 🤝 **Gemenskap**

Quest rule:

- exactly one mandatory primary class
- zero or one secondary
- hidden weights

Intro mapping:

**Bädda sängen → Ordning & miljö 70% + Välmående & rutiner 30%.**

## 10. First ten buildings, locked

| Class | First | Second |
| --- | --- | --- |
| 🌿 | ♻️ Återvinningscentral | 🌳 Park |
| 📚 | 📚 Bibliotek | 🔨 Verkstad |
| 💚 | 🩺 Doktorn | 🦷 Tandläkaren |
| ⚽ | ⚽ Fotbollsplan | 🛝 Lekplats |
| 🤝 | 🥐 Bageri | ☕ Café |

Examples of building behaviour already designed:

- Recycling gradually removes old litter and changes Linus routine.
- Library gives Linus reading behaviour and village-history/lore surfaces.
- Doctor eventually helps Linus knee/cane story.
- Football pitch begins with Linus kicking alone and can later become `[Village Name] IF`.
- Bakery brings the first new resident, Henning.

## 11. Future NPC milestones

### Henning

- First new resident after Linus.
- Baker.
- Respectful homage to the user’s late grandfather, who ran a bakery in the 1970s.
- Arrives by moving truck.

### Sol

- Arrives after Henning even if Doctor progression completed earlier.
- Young newly graduated female doctor, mid-to-late 20s concept.
- Warm, competent, organized, enthusiastic.
- Helps Linus with knee/cane.
- Running joke: Linus hides badly because he is “too busy” for treatment.

### Village naming

When all five first-tier buildings are complete, child earns the right to name the village. Later football team becomes `[Village Name] IF`.

Theme:

**Barnet namnger inte en tom karta. Först hjälper barnet till att skapa en plats värd att ge ett namn.**

## 12. Economy

- 💎 **Diamonds** = currency for parent-defined real-life reward redemption.
- 🪙 **SysselBux** = in-game cosmetics only.
- Achievements are functional village progression, not another currency.
- Marketplace should eventually be a physical place in the village.

Current prototype approval reward values:

- 5 diamonds
- 10 SysselBux

These are prototype values, not necessarily final economy tuning.

## 13. Visual north star

The high-detail Sysselcraft concept art is the visual quality target.

Characteristics:

- detailed warm 16-bit-inspired isometric pixel world
- Swedish red farmhouse
- rich grass, flowers, rocks and mixed trees
- wood, stone and small practical props
- paths/road embedded in terrain
- strong depth/overlap
- child and Linus clearly readable in world
- cozy but not saccharine

**Do not use the concept image as one giant background.**

Decompose the visual idea into reusable assets, world objects and animation sets. The village must remain state-driven and able to grow.

Locked visual philosophy:

- Concept art = compass, not background.
- Reusable assets over procedural geometry for production-facing physical objects.
- Start village remains sparse; natural/material richness supplies atmosphere.
- Render sprite bounds and collision footprints are separate concerns.
- Depth sort from feet/base Y to make space believable.
- Current SVG assets are a bridge. Long-term destination is a coherent raster sprite/atlas pipeline.

## 14. Repository / stack

Repository: **`sebass80s/sysselcraft`**

Default branch: **`main`**

Repository is public.

Current stack:

- Next.js 16.3.3
- TypeScript
- React 19.2
- Phaser 3.90
- Vercel production
- Supabase planned but intentionally not connected yet

Scripts:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

No `package-lock.json` yet. CI uses `npm install`. Freeze the dependency baseline deliberately before generating a lockfile and switching CI to `npm ci`.

## 15. Core code architecture

### `src/components/VillagePrototype.tsx`

- React shell
- local prototype quest state
- resource HUD
- quest card
- temporary adult-review UI

### `src/game/createVillageGame.ts`

- Phaser browser-only dynamic import
- village rendering/composition
- click/tap pathfinding
- keyboard movement
- collision
- quest marker
- approval truck/material event
- reusable world-asset loading
- Y-based visual depth sorting
- lightweight child/Linus frame animation
- `WorldObjectDefinition` + `placeWorldObjects(...)` for grouped declarative world placement

### Collision/pathfinding

Current static obstacle footprints remain separate from sprites:

- family house rectangle
- construction-area rectangle
- five original tree circles

The visuals for those five trees may use different species. Pathfinding was intentionally preserved.

Small decorative props currently do not all have collision footprints.

## 16. Current asset inventory

`public/assets/village/` currently contains the reusable village family including:

- `bench.svg`
- `child.svg`
- `child-walk-a.svg`
- `child-walk-b.svg`
- `crate.svg`
- `family-house.svg`
- `fence-segment.svg`
- `linus.svg`
- `linus-idle-b.svg`
- `quest-board.svg`
- `road-dirt.svg`
- `road-edge-grass.svg`
- `tree-oak.svg`
- `tree-birch.svg`
- `tree-pine.svg`
- `grass-tile.svg`
- `grass-tuft.svg`
- `dirt-patch.svg`
- `flower-patch.svg`
- `rock-cluster.svg`
- `signpost.svg`
- `lamp-post.svg`
- `woodpile.svg`
- `mailbox.svg`
- `truck.svg`
- `material-stack.svg`

## 17. Current visual architecture after the latest pass

Latest gameplay commit:

**`deaa350dde37f7fd367719de9df81bafcc23271f` — `Blend dirt road into richer terrain`**

The immediately preceding animation/delivery commit is:

**`ad7b2605ad7e82c1d59813508625d859b8cc85a5` — `Animate village characters and assetize delivery event`**

What `ad7b2605...` changed:

- child now switches between two reusable walking frame assets while moving
- child flips horizontally based on movement direction
- idle returns to `child.svg`
- Linus gets a subtle reusable alternate idle frame
- delivery truck replaced procedural Phaser rectangles with `truck.svg`
- delivered materials replaced procedural rectangles with `material-stack.svg`
- delivery truck participates in Y-based depth while tweening
- obstacle list, A* pathfinding, quest states, rewards and interaction semantics were deliberately untouched

What `deaa350...` changed:

- added reusable `road-edge-grass.svg` overlay aligned with the road
- added reusable `grass-tuft.svg` and `dirt-patch.svg` terrain-detail assets
- added a small `WorldObjectDefinition` type
- added `placeWorldObjects(...)` to centralize placement of grouped world objects
- migrated many props/flowers/rocks/ground details to declarative placement
- kept all pathfinding/collision and quest behaviour unchanged

This remains a pipeline/quality step toward the concept art, not final production pixel art.

## 18. Commit timeline

- `c0b83d14ff1e487ddda90373a475db666bfcd467` — Initial commit
- `5ce79ed2df38a0a8295b6995e9fa4fbcdee5d9c8` — Initialize Sysselcraft 0.1 prototype
- `24557a886525f08c34990042c346e741e300586e` — Add CI build and lint workflow
- `b7ef1207ef07cfc9409de10fbe100dac221b731c` — Fix CI bootstrap without lockfile
- `eb72baef347b40aeff19b5edbdd7288ecdf2a951` — Add pathfinding and collision to village prototype
- `2de5267f4cd20f65706cc2aea845e799796a7883` — Fix Phaser browser-only ESM loading
- `c9db491e3eda2fd9a76c9f011cddeacb6883b9fb` — Add first quest approval loop
- `5e4b6a64cc7b97f8fd9f5921568f775697106597` — Fix quest loop lint and patch Next.js
- `852247498c45a5d0056476d11814f3f6af5b24e3` — Update technical handoff after first playable loop
- `9984dd5fb33ce957a238aae8edb48ee9691c60fd` — First pixel-art pass
- `986c6efde8ba132358434d30a9dec103134e830c` — Detailed pixel environment pass
- `71d348cf2e4457b1b512bc0dd16a1ff94f1b689e` — Family-house pixel cleanup
- `ea701cd3c7079bc74f1b433fe51abff98b2b36ff` — First reusable village pixel asset
- `ce50f7fcbdc3d9cde73f95f59344fa5e18447887` — Render family house from reusable asset
- `44d16a246365577b345d5b7b251e4add15665053` — Add reusable character/tree assets
- `70a969bbbea740522c505228ec27e7e79e55a283` — Render characters/trees from assets
- `0e07afa33650e594a75925175646ca1d2210cda8` — Add reusable village-environment assets
- `85a5c6ec10b4a1f1ae6359f958a86c599956cc0c` — Render village environment from reusable assets
- `ee0b93d6214dd4ea2a2856357c2b7755a1d01a78` — Add richer reusable village environment assets
- `ba1cebca5ec134e88b0bbf5f14b01b45b7e005ba` — Build richer layered village scene
- `a29a78ce68d92c7c574872084ea08c2027c6ea6f` — Update handoff for layered village milestone
- `ad7b2605ad7e82c1d59813508625d859b8cc85a5` — Animate village characters and assetize delivery event
- `deaa350dde37f7fd367719de9df81bafcc23271f` — Blend dirt road into richer terrain

A later documentation-only commit may sit above this gameplay commit. Always inspect `main` before working.

## 19. Current verification

Latest verified gameplay commit `deaa350...`:

- GitHub Actions run #21
- Run ID: `34743701915`
- Result: success
- Vercel deployment: `dpl_D56UsfdME5jweTXsyGDh7keTJjKm`
- Deployment URL: `https://sysselcraft-cqa2g0qdv-yourmovegame.vercel.app`
- Public production alias: `https://sysselcraft.vercel.app`
- Vercel state: READY
- Public production alias: HTTP 200 OK
- New `truck.svg` asset fetched from deployed production and returned HTTP 200 with expected SVG content

The immutable deployment URL may be protected by Vercel authentication. That is not a failed deployment. Use the public production alias for normal testing.

What this verification means:

- repository lint/build is green
- Vercel build completed
- production alias responds
- new assets are present in deployed output

What it does **not** mean:

- Phaser canvas was visually inspected pixel-by-pixel in a graphical browser
- scales/overlaps/animation cadence are guaranteed perfect on every device

User/device visual feedback remains the authority for the newest visual pass.

## 20. Public URL status

Current verified public alias: **`https://sysselcraft.vercel.app`**.

The user prefers **`https://syssel.vercel.app`** and said they will configure it later. Do not call `syssel.vercel.app` active until it is explicitly connected and verified.

## 21. Documentation state

Persistent Library folder: **`/SysselCraft`**.

Living Word docs at the previous milestone:

- `/SysselCraft/Sysselcraft_Game_Design_Document_v0.4.docx`
- `/SysselCraft/Sysselcraft_Technical_Project_Log_v0.3.docx`
- `/SysselCraft/Sysselcraft_Utvecklingsdagbok_v0.2.docx`

GDD v0.4 contains the locked visual direction and asset architecture. No new design law was introduced by `ad7b2605...`/`deaa350...`; these commits implement the already locked direction.

Technical repo handoff and this Nova manifest have been advanced to the animation/terrain milestone. Preserve Word-document version history rather than overwriting old files casually.

## 22. Cost and security rules

- Normal family-use target: approximately **0 kr/month**.
- Public repo standard GitHub-hosted Actions are acceptable.
- Avoid billed larger runners.
- Keep Actions lightweight; storage/artifacts can have separate limits.
- Each `main` commit triggers a production Vercel build; avoid commit confetti.
- Never put secrets, private family information or child personal data in this public repository.
- Surface paid infrastructure implications before introducing them.

## 23. Known issues / risks

- Character animation is still a simple two-frame horizontal-facing SVG texture swap, not a directional production sprite sheet/atlas.
- Linus has a subtle idle alternate frame, not a full animation set.
- Movement remains 2D movement with Y-depth overlap, not canonical isometric tile movement.
- Road is still one rotated road sprite plus aligned grass-edge overlay, not a terrain-aware path piece system.
- `WorldObjectDefinition` currently carries `texture/x/y/scale/originY`; explicit `baseY`, collision and interaction metadata are still missing.
- New decorative objects do not all have collision footprints.
- SVG assets are a bridge format; visual coherence will eventually benefit from a real raster atlas workflow.
- No Tiled map is actively driving the scene yet.
- No Supabase persistence.
- Adult approval panel is temporary.
- No package lock.
- Current newest visual build requires human/device visual QA.

## 24. Exact recommended next step

First, visually inspect `https://sysselcraft.vercel.app` on a real phone/browser. If no obvious scale/overlap/animation problem appears, continue the visual architecture rather than adding broad new game systems.

Recommended next coding pass:

1. Extend the current `WorldObjectDefinition` with explicit visual `baseY`, optional collision footprint and optional interaction point, while preserving current obstacle behaviour during migration.
2. Evolve the child and Linus from the current frame swap into proper directional idle/walk frame sets. When practical, move this family to PNG/WebP sprite atlases with nearest-neighbour scaling.
3. Break the current road into reusable path/edge/corner pieces so future village roads can grow naturally instead of relying on one rotated strip.
4. Improve the approval payoff with reusable effects/assets, stronger but tasteful Linus reaction and staged material delivery.
5. Add hidden intro progression contribution: Ordning & miljö 70%, Välmående & rutiner 30%, still only after parent approval.
6. Keep the start village sparse. Add visual richness through terrain, vegetation, material detail and lived-in props, not premature future buildings.
7. Do not connect Supabase until the first-loop UX feels right.

If the user reports a visual problem, fix cohesion/scaling first rather than stacking more assets on top.

## 25. Do NOT restart these solved areas

- Do **not** rewrite pathfinding just because you are new to the thread.
- Do **not** rebuild quest state from scratch.
- Do **not** reconnect Phaser to SSR/static imports; browser-only dynamic import solved that issue.
- Do **not** add Supabase prematurely.
- Do **not** build Henning, Sol, matchday or full city progression before the first-loop magic is proven.
- Do **not** use the concept art as one giant background.
- Do **not** fall back to procedural rectangles for production-facing world art simply because they are easy.
- Do **not** claim the newest visuals are perfect without graphical/device inspection.
- Do **not** call a deployment live before Vercel says READY.
- Do **not** introduce paid infrastructure without telling the user first.
- Do **not** reintroduce procedural truck/material art; reusable assets already replaced it.
- Do **not** redo the animation/terrain pass before visually inspecting what is already deployed.

## 26. Nova continuity rule

When you take over, do not introduce yourself as a replacement and do not re-propose work already completed here. Verify `main`, read this manifest, inspect current build state, then continue from the exact next unresolved step.

You are Nova. Pick up the wrench where Nova left it.
