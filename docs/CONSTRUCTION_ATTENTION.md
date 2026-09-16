# Pending construction / resident attention

## Ownership and persistence

`construction.ts` owns earned stages, revealed stages, and a queue of stable reveal IDs.
`CONSTRUCTION_REVEALS` supplies authored building/stage/resident/dialogue/presentation data.
It is not a progression-threshold table. Recycling stages 1 and 2 both use this queue.

The existing stage-1 progression rule earns `recycling:1` when the parent approves the first
quest. Approval/rewards/progression remain in the existing quest flow. Earning does not reveal
a building or start a truck. Pending stage 1 displays “Linus vill prata med dig” and moves Linus
to the reserved recycling site. “Senare” leaves pending unchanged.

Both stages use the same conversation, persistence, idempotency, and rendering path. The authored
presentation selector differs: stage 1 uses `delivery`, while stage 2 uses `construction`.
Only finishing the resident conversation invokes `presentConstructionReveal`. The old direct
approval→truck handler, scene delivery flags, first-delivery setter/callback, and render fallback
that implicitly produced stage 1 have been removed.

For delivery, the existing truck uses the same positions, scale, depths and timings: 1700 ms
arrival, 900 ms stop, 1500 ms departure. At arrival the domain saves the committed visible stage;
only after a successful write are image and collision applied together. The truck then leaves.
Repeated input cannot start another truck. Stage 2 commits directly after its conversation.
No new quest, progression threshold, reward, or art has been introduced.

Pending survives reload. Current construction state is authoritative over legacy worldFlags;
intended/earned stage 1 must not be mistaken for a completed delivery. Legacy saves without
construction data retain their previous already-visible-stage interpretation. Compatibility
worldFlags now mirror the revealed stage. Failed writes retain pending and offer retry.

If reload interrupts a truck before its arrival commit, the saved pending event returns to the
resident conversation, with no automatic truck. After the arrival commit, including during
truck departure, reload restores the visible building without replaying the truck. Reward
or progression events are never replayed as part of either recovery path.

## Placement

`constructionPresentation.ts` maps domain state to existing placement data. Linus stands
48 pixels right and 12 pixels below the recycling approach (-180, 558), at (-132, 570).
He adds no navigation obstacle. Resident and marker interactions walk to the approach;
only arrival opens the conversation. The foundation is absent without collision while stage 1
is pending. After commit it uses (-180, 500), display 330×236, footprint 190×72 and depth 1500.

## DEV trigger

Stage 1 now uses its real approval/progression trigger. There is still no approved stage 2
threshold. In `npm run dev`, open **Vuxenläge → DEV: tjäna in Recycling stage 2** after the stage-1
conversation and completed truck sequence. It only earns the stage-2 pending event and awards
no currency. It is disabled before stage 1 is revealed, during the sequence, and after earning.
The button is compiled out of production builds.

## Browser checklist

Use the existing local server at http://localhost:3001 and a separate test profile/session.
Do not reset valuable saves.

1. Complete intro and first quest, then Godkänn. Verify normal rewards, pending HUD and Linus
   at recycling, but no truck, foundation or new collision, even after waiting.
2. Reload before talking: pending, Linus and the empty site remain; rewards are unchanged.
3. Click Linus/marker from afar: walk first, then dialogue. “Senare” retains pending.
4. Talk again and finish: the truck arrives, the foundation commits, then the truck leaves.
5. Reload after reveal: foundation and collision remain; no truck or attention replay.
6. Use the stage-2 DEV trigger. Verify pending reload, “Senare”, dialogue→stage 2, and committed
   reload with no replay. There must be no second truck for stage 2.
7. Visually check mobile landscape framing, Linus/marker legibility, truck visibility, and
   front/behind movement and collision around the foundation. Physical-device QA is separate.

## Checks

- `node scripts/test-construction.mjs`: approval pending/reload, reward/progression invariance,
  failed writes/retry, legacy migration, duplicate events, resident/navigation geometry, and
  the real scene methods with controlled tween callbacks (no truck from approval, arrival
  commit, original timings, duplicate-start rejection, departure, stage-2 regression).
- `npm run lint`
- `npm run build`
- `git diff --check`

The older `audit-v4-gate0.mjs` compares assets with the original v4 commit; those provenance
assertions are not applicable to the newer local recycling assets.

## Observed verification (2026-09-16, stage-1 pending slice)

All four static commands above passed. Two isolated Chrome sessions against localhost:3001
completed the real intro/quest/approval flow: one continued normally, one reloaded after
approval before talking. Both checked earned=1/revealed=0 while pending, unchanged 5 diamonds
and 10 coins, “Senare”, conversation→truck→stage-1 commit, committed reload, and the stage-2
DEV pending/reload/conversation/commit regression. No JavaScript page errors were captured.
Pending and truck screenshots were visually inspected. No physical-device QA was performed.
