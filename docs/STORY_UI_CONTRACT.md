# Story UI contract · LOCKED 2026-10-01

Status: **CANONICAL**

SysselCraft is story-driven. Dialogue speaker identity, nameplates and dialogue body rendering are therefore runtime contracts, not decorative details.

## 1. One speaker, one nameplate

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
