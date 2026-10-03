# Story UI contract · LOCKED 2026-10-01

Status: **CANONICAL**

SysselCraft is story-driven. Dialogue speaker identity, nameplates and dialogue body rendering are therefore runtime contracts, not decorative details.

## 1. One speaker, one nameplate, one reply

A dialogue card is atomic: **one nameplate + one authored reply/narration unit + one click to advance**.

Never reduce click count by stacking several authored speakers or several dialogue turns inside the same rendered card. Click reduction belongs in the writing layer: remove redundant turns and rewrite the remaining replies so each carries more useful content while still fitting comfortably in one card.

A rendered dialogue line may show the speaker name in exactly one nameplate.

- Speaker prefixes such as `Barnet:`, `Alve:`, `Linus:` are authoring syntax only.
- Prefixes must never remain in rendered body text.
- If `StoryRunner` receives an explicit `beat.speaker`, that component owns the nameplate and `StoryTranscript` must not render a second one.
- If there is no explicit speaker, `StoryTranscript` may derive the nameplate through `parseStoryLine()`.

## 2. Child identity

The real player's/tester's name must never be hardcoded in runtime source.

The child name comes from the canonical save state:

- Act 1: `VillagePrototype` restores `saved.childName`.
- Act 2 production: loads Act 1 save and uses `act1.childName`.
- Story Debug: loads the same save and uses `saved.childName`.
- `Barnet` is only the fallback before a name exists.

Authored story text refers to the playable child with:
- speaker prefix: `Barnet:`
- inline token: `{childName}`

`parseStoryLine()` owns `{childName}` substitution for Story Engine content.

## 3. Unknown Alve before reveal

Before Alve introduces himself, his internal debug/authoring prefix is `Okänd:`.

It renders as nameplate **Barnet**, but it must never be confused with the playable child's `Barnet:` prefix.

After the name reveal, authored/runtime speaker identity is `Alve`.

## 4. Nameplate placement

Nameplates live **inside the dialogue card in normal document flow, immediately before dialogue body content**.

Do not position them above/outside the card with:
- absolute positioning;
- negative `top`;
- translate offsets.

Reason: Story Moment and viewport wrappers legitimately use `overflow: hidden`; exterior nameplates are therefore fragile and can be clipped on iPhone or debug routes.

The global `.dialogue-speaker` style is the visual authority for both the shared Story Engine and legacy Act 1 dialogue cards. Long names must remain bounded by the card.

## 5. Legacy Act 1 and shared Story Engine

Act 1 still contains older manually rendered dialogue cards in `VillagePrototype.tsx`. They intentionally use the same:
- `.dialogue-card`
- `.dialogue-speaker`

classes as the shared Story Engine. Global nameplate styling must therefore remain compatible with both systems until those legacy cards are migrated.

Do not add route-specific positioning rules for Act 2 nameplates.

## 6. Rendering pipeline

Canonical Story Engine pipeline:

`authored line → parseStoryLine(line, childName) → speaker + body → DialogueCard / StoryTranscript → global dialogue CSS`

Do not bake display names into authored body strings in debug routes.

## 7. Regression gates

`npm run test:story-ui` protects:
- no real tester name hardcoded in `src`;
- in-card nameplate positioning;
- bounded long-name layout;
- no duplicate StoryRunner/StoryTranscript nameplates;
- saved child identity in Story Debug;
- central Act 2 speaker parsing;
- player/unknown-Alve identity separation;
- child-name interpolation without prefix leakage.

`npm run test:act2-story` additionally walks all authored Act 2 body lines and rejects speaker-prefix or `{childName}` leakage.

Both tests are part of `npm run verify`.

## Acceptance rule

A story-system change is not accepted solely because one screenshot looks correct.

It must preserve:
1. correct speaker identity;
2. exactly one nameplate;
3. clean body text;
4. saved child name;
5. stable in-card placement;
6. production/debug parity;
7. regression tests.

## 8. Production/debug parity

Act 2 production and Story Debug must render the **same `Act2Runtime` component**.

Routes are intentionally thin:
- `/act2` supplies the production shipping gate and real persisted/backend state.
- `/act2-test` supplies `debug` mode only.

Debug mode may alter or synthesize state, expose reset/grant controls, and bypass the temporary shipping/access gate. It must not maintain its own copies of:
- project chooser UI;
- opening/Alve/finale renderers;
- contribution cards;
- purchase/naming gates;
- nameplate logic;
- story image selection.

The debug route must not persist its Act 2 runtime state. Its purpose is to drive the real production renderer through isolated test state.

**Rule:** if a story/UI bug can exist in production but not in debug because the two render different components, the debug architecture is wrong.


## 9. Act 2 closeout navigation — 2026-10-03

“Föregående” moves within the current authored beat; consumed contributions/finale beats are not reopened. In full-image mode it restores the last dialogue without any persistence or progression change. Returning forward exposes the image again before the next beat.

StoryMoment awaits promise-returning navigation and disables both directions while a save is pending. A failed write leaves the current presentation retryable. The image navigation wrapper owns absolute safe-area positioning; both buttons are static flex children with minimum 44px height. Act 2 supplies a per-line presentation id, including opening lines. Chapter title/end cards publish the same overlay boundary as StoryMoment so external quest UI stays suppressed.

`test:act2-closeout` executes the actual components with an isolated hook host and actual save/load functions with in-memory Preferences. It covers image Previous, duplicate pending navigation, save-failure retry, every epilogue-line restart, child-scoped storage and compatibility with completed legacy saves. Physical WKWebView acceptance remains required.

## 10. Act 2 closeout + gameplay shell — LOCKED 2026-10-03

Physical iPhone testing reached the complete Act 2 ending and established the final presentation boundary.

### Global gameplay shell
`src/game/uiShellState.ts` is the pure authority for global gameplay chrome:
- world not ready → no HUD;
- blocking Story/Chapter overlay → no HUD;
- playable world with no blocking overlay → HUD visible;
- project status is optional and independent of global HUD visibility.

Therefore a null/finished project, idle NPC state or completed chapter can never implicitly remove the resource/navigation shell.

### Story overlay ownership
StoryMoment and chapter cards explicitly publish/supply blocking presentation state. External quest UI and global chrome are suppressed only while those overlays are active. Save-backed navigation remains awaited, transition-locked and retryable.

### Alve/lake boundary
- During active Act 2, `selectedProject=null` is valid and Alve remains at his idle anchor.
- After `act2Complete && endCardSeen`, Act 2 is closed and Alve is intentionally absent.
- The completed HUD keeps village navigation and adds `Till kapitel 3 →`.

### Legacy ending
A pre-marker five-beat-complete save resumes only the newly added **Över sjön** epilogue once. Already consumed family/veranda beats are not reopened. Current-schema completed saves do not replay.

### Regression ownership
The UI-shell state matrix belongs in `scripts/test-ui-shell-state.mjs`. Act 2 closeout tests should cover chapter-specific behavior and must not duplicate brittle regexes for internal shell implementation shape.
