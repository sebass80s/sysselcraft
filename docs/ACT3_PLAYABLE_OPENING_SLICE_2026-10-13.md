# Akt 3: Spelbar öppning · arbetsbranch 2026-10-13

**Issue #14, 2026-10-13:** PARK-002 har nu en gemensam Runtime 1.1-grind med strikt backend-evidens och save v3. Se [ansvar, tester och begränsningar](ACT3_FIRST_QUEST_BRIDGE_2026-10-13.md). Äldre beskrivningar av helt stängd PARK-002 nedan avser föregående slice.

## Scope
Issue #12: `A3-OPEN-000` remains shared ChapterIntroCard. On a new adult X preview, the six illustrated scenes `A3-OPEN-001–005` and `A3-PARK-001` play one authored paragraph or dialogue utterance at a time using Runtime 1.1 `StoryRunner`/`StoryMoment`/`StoryTranscript`, with the approved images.

- Every scene's source digest is pinned to `src/game/act3ContentRegistry.json`. `scripts/test-act3-opening-canon.mjs` compares the complete paragraph inventory and canonical spoken lines. Editorial OPEN-005 continuity notes are excluded from runtime.
- Narration referring to the child uses *Du/dig*, and speaker `Barnet` is presented as *Du*. The one introduction `Jag heter Barnet` binds the actual player name read from existing Act 1 save. If no name exists (unpaired development preview), the line becomes `Tack!`, rather than showing a fake name.
- Every advance/rewind inside a scene saves before updating the UI. Native failure leaves the current line in place; shared `StoryMoment` displays retry. First chapter-card save likewise shows a retry message.
- Act 3 persistence payload is now v2 with a stable v1 storage key to protect child-scoped legacy data. `migrateAct3RuntimeState` explicitly upgrades v1 `{entered}` states, without fabricating completed beats. Unsupported future versions are rejected, not erased.
- The free intro stops **after PARK-001**. PARK-002 never opens without a new parent-approved and child-claimed IRL quest. This slice **does not yet have authoritative claim connectivity**: its gate deliberately remains closed, and the user is told the preview cannot progress further. No currency, claim, or backend state is mutated by Act 3.
- Folkparken is discovered **on completed PARK-001**, not its earlier mention. The city map then displays Hamnen and Folkparken, the latter highlighted as active. Hamnen still returns to existing Act 2 without BOAT story consumption. All other map nodes remain hidden.
- Debug `/act3-test` uses synthetic, never persisted state and named Testspelaren. Normal `/act3` remains adult-X only; Act 1 and Act 2 remain shipping unchanged.

## Tests and known limitations
New local/CI tests: `npm run test:act3-opening-canon`, `npm run test:act3-opening-state`, `npm run test:act3-opening-ui`; the existing Runtime 1.1 tests still run via `npm run verify`.

**Still required before accepting Issue #12 as fully done:** real backend-authoritative claim bridge to unlock PARK-002 exactly once, end-to-end save/reload browser/iPhone tests, proof for power interruption during write, approved automatic map entry transition if it differs from this proposed flow, and manual iPhone/WKWebView UX review. This PR is a safe first playable vertical slice, not a full story engine for all 140 beats. No Vercel deployment.
