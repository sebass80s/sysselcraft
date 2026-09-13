# Physical-device reconciliation test plan

Status: **READY FOR REAL DEVICE TEST**

This plan verifies the boundary between the existing Capacitor Preferences save and the Supabase child backend before any automatic migration or authority switch is enabled.

## Guardrails

- The local save remains authoritative for the existing built-in prototype progression until this test is complete.
- Parent-created backend quests and server-issued rewards remain separate from built-in local quest rewards during this phase.
- Reconciliation inspection is read-only.
- Do not overwrite local Preferences or Supabase state automatically from a reconciliation recommendation.
- Any mixed state (`inspect-before-merge`) requires manual inspection before a migration policy is designed.

## Known real test baseline

Before the next physical/browser test, the backend currently has one child profile with:

- 0 diamonds
- 0 SysselBux
- all backend progression classes at 0
- no backend world flags
- one available parent-created quest
- no pending/approved backend quests
- no reward events

This baseline is useful because the first successful real loop should produce an obvious delta.

## Test sequence

1. **Parent session**
   - Sign in at `/parent`.
   - Select the intended child.
   - Generate a fresh pairing code.

2. **Child session**
   - Use a separate browser profile/incognito window or the physical child iPhone.
   - Open `/pair` and redeem the fresh code.
   - Confirm the paired child ID is persisted through the device binding helper.
   - Reload `/pair` and confirm the existing local pairing is accepted only when the current anonymous session can still read that child's backend state.
   - If the anonymous auth session has been replaced/expired while a local child ID remains, confirm `/pair` asks for a fresh pairing code instead of falsely reporting the stale binding as valid.
   - When testing re-pairing, confirm the old local pairing remains intact until a new code has been successfully redeemed and its backend state can be read.
   - Return to the village.

3. **Quest visibility**
   - Open the backend quest inbox.
   - Confirm the parent-created quest appears as `available`.
   - Confirm displayed reward matches the parent-created quest.

4. **Child submission**
   - Press `Jag är klar` once.
   - Confirm the quest changes to `pending`.
   - Refresh/reopen the child quest panel and confirm it remains `pending`.

5. **Parent review**
   - Return to the parent session.
   - Confirm the same quest appears under waiting-for-review.
   - Approve it once.
   - Refresh parent state.

6. **Server-authoritative reward check**
   - Confirm exactly one reward event exists for the quest instance.
   - Confirm backend child currency increased exactly by the configured reward.
   - Confirm progression increased exactly once in the quest's progression class.
   - If approval is invoked again, confirm currency/progression/reward-event count do not increase again.

7. **Child refresh**
   - Return to the child session.
   - Refresh or focus the app.
   - Confirm the approved quest is no longer shown as active/pending.
   - Confirm backend wallet reflects the approved reward.

8. **Reconciliation inspection**
   - Open `/?debug=reconciliation` on the paired device.
   - Record recommendation plus all economy/progression/world-flag deltas.
   - Confirm a missing prerequisite is reported specifically (for example not paired, local save missing or backend state missing) rather than as an undifferentiated failure.
   - Do not write either side based on the report yet.

## Pass criteria

The backend loop passes only if all of the following are true:

- pairing binds the anonymous child session to the correct child profile;
- parent session cannot redeem the pairing code as a child;
- a stale local pairing is not trusted after the anonymous session loses backend access;
- re-pairing does not discard the known-good local child ID before the new binding succeeds;
- child can submit only an available quest;
- parent can approve only a pending quest in their household;
- reward event is created exactly once;
- repeated approval is idempotent;
- child game state reflects exactly one reward;
- child and parent both observe the same backend lifecycle after refresh;
- local Preferences save remains intact;
- reconciliation inspection performs no writes.

## After a successful pass

Only after the above is verified on a real device should we design the first migration rule. The safest likely sequence is:

1. keep built-in story/world state local;
2. keep parent-created quests and their rewards server-authoritative;
3. define an explicit currency/progression merge policy;
4. test that policy against captured reconciliation reports;
5. migrate one state family at a time rather than replacing the local save wholesale.
