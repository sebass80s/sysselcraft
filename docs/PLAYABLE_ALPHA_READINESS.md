# Playable Alpha Readiness Audit — 2026-09-21

## Scope and verdict

Audited baseline: `823ea25e9a869fbbfdc585fcb0589d193dd89ddb`, branch `nova/local-construction-snapshot`, canonical workspace `/Users/karoaa/Developer/sysselcraft`. Repository code takes precedence over older handoffs. The pre-existing whitespace-only change in `ios/App/App/config.xml` was preserved and excluded from audit commits.

**Suitable for supervised alpha testing; daily independent use is not yet certified.** The physically proven Recycling slice is a strong baseline, but it does not prove recurring backend quests, auth recovery, update-in-place persistence, or the product boundary between local prototype and backend rewards. No Henning/Bakery decision is needed to run the technical acceptance tests below.

Evidence labels are literal: FIXED means an implementation change with stated validation; VERIFIED OK means only the stated evidence scope; NEEDS PRODUCT/PHYSICAL TEST is an unresolved acceptance gate, not a claim of a live failure. Backend requests in this audit's browser suite are mocked. No live SQL/RPC was executed, no data reset, no save migration, no iOS regeneration, no native sync or production deployment.

## Findings

| ID / priority | Status | Finding, evidence and disposition |
|---|---|---|
| A01 / P1 | FIXED | `loadSaveState` previously returned null for read errors, malformed JSON and unsupported save versions. Village startup treated null as a new game and immediately autosaved defaults. The playable caller now requests strict reading and blocks startup/autosave with a retry message on failure. Missing key alone starts a new game. Original bytes remain intact. Default read behavior used by reconciliation is unchanged. Unit tests cover malformed/empty/future saves, storage failure and retry; browser test confirms no canvas startup or overwrite. |
| A02 / P1 | FIXED | Ordinary autosave swallowed write failures. `VillagePrototype` now requires write success, shows a storage error and retries the latest snapshot without reset/reload. Existing serialized write queue and construction commit semantics are retained. Browser injects storage failure, then verifies successful retry. Force-kill during pending disk writes still requires physical testing. |
| A03 / P1 | FIXED | `/parent/` called `subscribeBackendAuth` outside error handling; missing public config threw synchronously in an effect. Subscription startup is now guarded; the existing asynchronous auth read displays the configuration error. Browser verifies error text and navigation back to the village without an uncaught exception. Inbox startup subscription is guarded too. |
| A04 / P1 | FIXED | Parent initial/auth-triggered `refreshFamily` promises were detached without rejection handling. Failures now produce a visible message instead of unhandled rejections. Code reviewed; live parent auth/network-failure acceptance remains below. |
| A05 / P1 | FIXED | Successful in-app pairing changed Preferences but the mounted inbox only read the binding once. `setPairedChildId` now emits a notification after successful storage; only the bound inbox remounts, discarding old child presentation/subscriptions. The village stays mounted. Mocked native pairing proves new quests appear without navigation or losing the canvas. |
| A06 / P1 | FIXED | The inbox's pairing/re-pair buttons still navigated to `/pair`, unlike the existing native adult-menu pairing flow. Inbox now uses the shared in-app panel on native and `/pair/` on web. Browser with a mocked native platform verifies URL/canvas remain unchanged. Actual WKWebView rerun is still required. |
| A07 / P1 | FIXED | A failed initial inbox fetch set sessionReady false, disabling manual refresh indefinitely. Refresh now rechecks auth and can recover after a transient network failure; successful quiet refresh clears stale errors. Mocked offline-start/retry passes without re-pairing. |
| A08 / P1 | FIXED | Switching selected child/household retained an editingQuestId/draft from the previous child. Switching now cancels that edit and clears the old visible lists before loading. Inspected handler paths; physical multiple-child/slow-response test remains required. |
| A09 / P2 | FIXED | Async Phaser boot/import failures had no user-visible fallback. Startup errors now show a retry surface instead of an unhandled boot rejection. This catches rejected boot/import promises, not every possible later Phaser/WebGL/asset error. Type/build validation; device fault injection remains required. |
| A10 | VERIFIED OK | Existing tests pass for approval/pending/reveal separation, stage 1 delivery, stage 2–4 ordering/idempotency, failed construction save/retry, completion persistence/no replay, legacy saves, navigation and quest-presentation policy. These do not execute live SQL. |
| A11 | VERIFIED OK | Kalle previously verified clean-save onboarding, Bädda sängen, adult approval, truck/delivery/Recycling stage 1–4, Linus/Henning completion hook, force-quit persistence/no replay, adult scroll and reset on physical iPhone (2026-09-21). This is historical user-provided evidence, not a new device run of these audit fixes. |
| A12 | VERIFIED OK | Actual Next routes are `/`, `/pair/`, `/parent/`, plus generated not-found. `output: export` and `trailingSlash: true` produce directory index files. Production build and browser parent-return path pass. No obsolete extra application route was found. Native email-link login is not proven by static route existence. |
| A13 | VERIFIED OK | Native project retains bundle `se.sysselcraft.app`, automatic signing/team, landscape, SceneDelegate and SPM. No native files changed by this audit. Generated assets/cache/userdata remain ignored. No `cap add ios` is needed. |
| A14 | VERIFIED OK | State ownership/reconciliation remain observe-only and unchanged. Local prototype save, local world and backend wallet are still separate. No local progress was uploaded, merged or inferred into backend reward state. |
| A15 | VERIFIED OK | Migration source includes parent/bound-child authorization, review row locks, reward-event uniqueness, immutable instance snapshots, recurrence occurrence-key uniqueness and materialization on child quest listing. This is source inspection only, not proof of deployed migration order/RLS or live concurrency. |
| A16 / P1 | NEEDS PRODUCT/PHYSICAL TEST | Real two-device quest lifecycle: parent create → child source marker/inbox → submit → parent reject/resubmit/approve → exactly one reward. Test background/foreground, double taps, delayed/out-of-order responses and switching children. Parent refresh requests can overlap; no latest-request cancellation was added. Do not certify isolation of rendered responses from source review alone. |
| A17 / P1 | PARTIALLY HARDENED / PHYSICAL TEST REMAINS | Real pairing still needs physical expiry/reuse, wrong-code, anonymous-session expiry, re-pair, reinstall/session-loss and transport-failure acceptance. The server already enforces 15-minute expiry, one-time redemption, row locking and one binding per anonymous auth user. A 2026-09-22 hardening pass added `get_bound_child_id()`: if redemption commits but the response is lost before local Preferences stores the child id, the same anonymous session can recover its own binding on the pairing screen. The RPC rejects non-anonymous sessions and exposes no other user's binding. Reinstall/session loss intentionally still requires a fresh pairing because Supabase anonymous users cannot recover after their session is lost. |
| A18 / P1 | NEEDS PRODUCT/PHYSICAL TEST | Native `/parent/` still offers email magic-link login based on window.location.origin; a `capacitor://localhost` callback is not proof of a working external-mail return. Decide/document parent-on-web versus parent-in-native support and verify configured redirects and account separation. Child session must not be replaced casually. |
| A19 / P1 | NEEDS PRODUCT/PHYSICAL TEST | Daily recurrence: test timezone/day rollover, DST, weekly calendar behavior, missed days, schedule edits/archive, offline then reconnect, and duplicate reads against deployed SQL. Listing is not read-only at the database level: it may materialize due instances. No live listing was performed in this audit. |
| A20 / P1 | VERIFIED CORE / STRESS REMAINS | Physical update-in-place passed on a real iPhone on 2026-09-22: completed Recycling and the rest of the local save survived, completion dialogue did not replay, existing pairing/backend session survived, a newly created quest arrived without re-pairing, and submit → parent approve → Linus attention → child turn-in/reward worked after the update. Storage-pressure/failure recovery remains a separate stress case; unsupported saves fail closed and there is still no backup/export product flow. |
| A21 / P1 | NEEDS PRODUCT/PHYSICAL TEST | Daily-child build still exposes local approval/reset and native stage test controls through adult mode without a real adult gate. Decide supervised alpha policy and test-control visibility before independent daily use. No access or progression rules changed here. |
| A22 / P1 | NEEDS PRODUCT/PHYSICAL TEST | Backend recurring rewards do not yet automatically drive the local Recycling/Bakery world. Two currency/world surfaces can confuse users. This is the explicit ownership boundary, not a technical license to reconcile. Set alpha expectations without migrating saves or inventing thresholds. |
| A23 / P2 | NEEDS PRODUCT/PHYSICAL TEST | Mobile keyboard, safe areas, large text, portrait overlays, long quest text, modal focus, VoiceOver, touch-through to Phaser and long-session thermal/FPS/memory behavior require device QA. Existing adult scrolling is proven, but that does not certify every new panel. |
| A24 / P2 | NEEDS PRODUCT/PHYSICAL TEST | Asset completeness differs from active runtime completeness. Henning has a turnaround but the production-frame manifest points to absent frames; Bakery has four prepared stage assets but is not activated. Older native console observations included WebP decoder warnings; recheck actual visuals/logs on the current build before treating them as harmless. No new character or building activated. |
| A25 / P2 | NEEDS PRODUCT/PHYSICAL TEST | Dead/unwired prototype inventory: `TestResetControl`, `constructionProgression.applyApprovedConstructionContribution`, old stage-4 playtest helpers in `worldDecor`, production manifest and separate `recyclingStory` StoryState helpers have no current gameplay callers. They are not evidence of shipped features. Kept intact because some are deliberate future contracts; removal is not required for this patch. |
| A26 / P2 | NEEDS PRODUCT/PHYSICAL TEST | Delivery reproducibility: package.json uses ranges and no committed npm lockfile. Native SPM pins Capacitor 8.5.2 but fresh npm resolution can drift. Before distributing repeated alpha updates, verify/pin a tested dependency set in a dedicated dependency task and run native regression; this audit did not silently upgrade packages. |

## Focused hardening after integration b662023 — 2026-09-21

This follow-up starts from `b662023faf2e25de2ddaa3089b024ffe1f17fe49` and preserves Nova's single `childPairingBridge` owner and 15-second open / 30-second closed refresh policy.

| Status | Concrete result |
|---|---|
| FIXED | Overlapping child refreshes could publish an older available/pending snapshot after a newer response or submit. A request-generation guard now discards superseded responses and errors, including after auth invalidation/unmount. Background refresh pauses during explicit actions. This affects UI request lifetime only, not reconciliation or backend ownership. |
| FIXED | React's disabled state alone did not prevent two submit handlers in the same tick. A synchronous action guard now admits one request and releases on failure/success. No automatic mutation retry was introduced. |
| VERIFIED OK | `npm run test:quest-recovery` is part of full `npm run verify`: request ordering/action locks/unmount/remount; available → pending → approved presentation; approved history excluded from active lists; next recurring instance isolated; real repository transport errors and read-only refresh RPC selection; binding notification after durable storage, no event on failed storage. Transport/storage are isolated mocks; no Supabase calls occur. |
| VERIFIED OK | Extended optional browser suite executes the built UI: held available response across submit, same-tick double tap (one RPC), server-approved fixture disappears, repeated background reads retain the returned wallet without additional mutation, new occurrence appears once, old-child delayed response cannot overwrite a newly paired child, repeated bridge events produce one pairing dialog, one focus listener after rebind, one poll per 15/30-second interval, and no polling after route unmount. Existing network recovery test remains passing. |
| VERIFIED OK | Save tests now compare the complete normalized valid save across a fresh module lifetime and first autosave, check original durable bytes after a failed write, retry after a rejected write queue, and ordering/immutable snapshots under delayed storage. Existing malformed/future-format read protection tests remain. Only in-memory Preferences are used. |
| NEEDS PRODUCT/PHYSICAL TEST | Exactly-once reward application and recurring-instance creation under concurrent server requests remain database acceptance tests. The client suite verifies no duplicate mutation and no client-side reward accumulation; it does **not** prove SQL idempotency by teaching a mock to be idempotent. No local PostgreSQL test runtime is configured here; no live Supabase writes were made. |
| NEEDS PRODUCT/PHYSICAL TEST | Still run actual parent approval/rejection and recurrence/day-rollover with two devices; pairing/auth expiry and re-pair during real requests; WKWebView background/foreground; update-in-place and force-kill/storage-pressure persistence. Parent-page overlapping refreshes are now guarded as well: family and child loads use latest-request generations, and child/household switches plus auth loss invalidate stale in-flight responses. The request-guard regression is part of `npm run verify`. |

A06 now uses Nova's shared bridge and the existing village pairing panel; the inbox no longer owns a second panel. Inspection plus repeated-event browser testing found no duplicate pairing overlay. Native adult-menu account entry directs the adult to a separate device, but direct native parent-route/auth acceptance (A18) is still not established.

Validation: full `npm run verify` and the extended isolated browser suite were run for this follow-up. Browser tests remain optional because Playwright/browser binaries are not repository dependencies. No native sync, physical save access, production deploy, Supabase write, or push. The pre-existing `ios/App/App/config.xml` diff is excluded and its SHA-256 is checked before/after.

## What to prove before daily use

1. Run A16–A19 with an adult and a child device on the intended deployed backend; record build SHA, OS/device, network scenario and actual results. Preserve existing data. Use dedicated test profiles only with explicit authorization.
2. Install this patch over the existing iPhone app and execute A20, then the already-proven Recycling regression without assuming a reset is required.
3. Decide A21/A22: supervised test build versus independent child build, and honest limits of backend progress versus local world. Henning/Bakery pacing remains outside this audit.
4. Verify device UX and performance (A23/A24). A successful web build is not physical acceptance.

## Validation and reproduction

Audit validation completed successfully on 2026-09-21: full `npm run verify` (including lint and production build) and all five isolated browser scenarios below passed. `git diff --check` passes for audit files; the preserved pre-existing native config diff contains whitespace warnings and is excluded.

- `npm run verify`: visual audit, construction/completion/save tests, lint, TypeScript/static build and quest-presentation tests.
- `scripts/test-recycling-completion-save.mjs` now includes strict read failure/future-version retention tests. Expected injected storage errors are logged during these passing tests.
- Optional `scripts/test-alpha-runtime.mjs`: run after building and serving `out/` locally (e.g. `python3 -m http.server 8766 --bind 127.0.0.1 --directory out`). Supply an available Playwright installation via `PLAYWRIGHT_MODULE` and, if needed, a Chrome executable via `CHROME_EXECUTABLE`; then `node scripts/test-alpha-runtime.mjs`. It is separate from CI verify because browser binaries are not project dependencies. Public backend build config must be present for the mocked pairing case; no secret credentials are needed.
- The runtime suite creates fresh isolated browser contexts. Every non-local request is intercepted; Supabase endpoints are mocked. It tests corrupted-save retention, autosave failure/retry, missing-config parent route/return, native-style in-app pairing with unchanged canvas, and offline inbox retry. It is Chromium emulation, not WKWebView or live backend proof.
- Existing Node module-type warning in quest-presentation test remains non-fatal; do not change package module semantics just to silence it.

Reference checked for the auth subscription contract: https://supabase.com/docs/reference/javascript/auth-onauthstatechange . No new Supabase API or database feature was introduced.


## Physical acceptance update — 2026-09-22

A16 is no longer wholly unproven. On the physical child iPhone plus live parent UI/backend, Kalle verified a one-off quest through **submit -> reject -> same-instance return -> resubmit -> approve -> Linus claim -> force-quit/relaunch**. Live backend inspection at every mutation boundary showed no reward before claim; the final claim produced exactly one reward event and the tested quest did not replay after relaunch. The previously verified offline-approval path also covers child app closed during parent approval and recovery of the Linus turn-in after relaunch.

Therefore the core A16 reward/correction lifecycle and exactly-once restart behavior are **VERIFIED OK in that physical scope**. Remaining A16 acceptance work is narrower: delayed/out-of-order real network responses, aggressive double taps, child switching/multiple-child isolation, and other concurrency/failure cases not exercised by this run. Do not reopen the proven reject/resubmit semantics merely because those stress cases remain.

A19 is also partially reduced: parent UI edit and archive were physically exercised against the live backend; immutable instance snapshots preserved historical title/reward data, and archive prevented the definition from being eligible for future materialization. Live SQL expression checks on 2026-09-22 verified Stockholm local-midnight rollover, spring/fall DST date stability, and ISO week-year behavior across New Year. Migration `20260922_realign_available_occurrence_on_schedule_edit.sql` was applied live and removes only untouched `available` occurrences made stale by a schedule edit; pending/approved history remains immutable. Real physical-device day rollover, weekly/missed-day behavior and offline-next-occurrence materialization remain unproven.

During the A16 run, Linus exposed only the first local pending reward turn-in. An older approved/unclaimed reward was claimed first, after which the newly approved test quest appeared. This is current sequential queue presentation, not a lost approval. Multi-reward UX is a polish item unless product requirements change.


## Quest presentation / recurrence hardening — 2026-09-22

CI #424 is green at `ddee2599e3a08939ad326070f0fa74913ff6afda`. Quest-presentation regression coverage now verifies that local Recycling completion may unlock noticeboard routing without migrating backend/local state, only actionable `available` quests light world-source attention, pending quests remain discoverable without source attention, approved history is excluded from actionable world content, and available work remains primary ahead of pending work. The direct Node test loads the real backend presentation module through an isolated TypeScript transpile harness so production import semantics remain unchanged.

This narrows the remaining alpha gate further toward physical acceptance rather than source uncertainty. The highest-value next physical check is A20: install/update the current branch over the existing iPhone app without uninstall/reset, then verify the existing Recycling completion/save, child pairing, backend quest refresh and any pending Linus turn-in survive the update. A17 pairing expiry/reuse/reinstall/network-loss cases and the remaining A19 real-clock recurrence cases still require device/live acceptance.


## A20 physical update-in-place acceptance — 2026-09-22

**PASS in the tested core scope on a real iPhone.** The existing SysselCraft installation was updated in place without uninstall/reset. After the update, the completed Recycling building remained completed, its completion dialogue did not replay, and the rest of the local save appeared intact. The existing child pairing/backend session also survived: a newly created one-off backend quest (`A20 test`) appeared on the child device without re-pairing. The quest was submitted, approved in parent mode, Linus received the reward-turn-in attention marker, and child turn-in paid the reward and cleared the marker as expected. This provides physical evidence that the current update path preserves the important local world save and backend binding while Quest v2 remains functional across the update.


## Parent refresh + pairing recovery hardening — 2026-09-22

Parent mode now rejects stale async family/quest responses after a newer refresh, child/household switch, auth loss or unmount. The shared request-generation guard has a dedicated regression test in the canonical verify chain. This closes the known A16 source-level race where a delayed old-child response could overwrite the newly selected child's view.

A17 source hardening also found a concrete transport edge: pairing redemption could commit in Postgres and consume the one-time code before the device received the RPC response and persisted its local child id. Live migration `recover_child_binding_for_current_session` adds an anonymous-session-only recovery RPC. The pairing panel now recovers that committed binding when local Preferences has no child id, validates readable game state, and persists the recovered id. Supabase's current anonymous-auth documentation confirms that an anonymous user is tied to its session and cannot recover after sign-out/cleared data/another device, so reinstall/session-loss remains intentionally a fresh-pairing case rather than silent identity migration.

CI #433 is green at `41e1e243b98e77ac07649c83e8b3acdd17411d8d` for the pairing-recovery implementation. Supabase advisors after the DDL show the existing SECURITY DEFINER API warnings plus the intentional no-policy pairing-code table; no new unrelated schema regression was introduced. Physical pairing edge acceptance is still required before A17 can be called fully closed.


## A17 physical pairing acceptance update — 2026-09-22

Physical iPhone acceptance now covers the safe re-pairing edges against the live backend. Opening `Koppla om till ett annat barn` and cancelling preserved the existing child binding. An invalid code (`00000000`) was rejected with `Parningen misslyckades`, after which the existing binding still worked. A fresh code for the same child (`3DAC72BB`) successfully re-paired the device, and attempting to redeem that same code a second time was rejected with `Parningen misslyckades`, confirming one-time redemption in the tested live flow. No uninstall/reset was used and the existing game save was preserved throughout.

A17 therefore has physical evidence for cancel-safe re-pairing, wrong-code rejection, successful same-child re-pairing and code-reuse rejection. Remaining A17 physical gaps are expiry, true response-loss/recovery, anonymous-session expiry/session loss, reinstall, and network loss during redemption. Destructive reinstall/session-loss testing should not be performed against the preserved alpha save without explicit authorization.


## A19 physical weekly recurrence acceptance — 2026-09-22

A live weekly quest (`A19 Veckotest`) was created in the current parent UI for the already paired child. It materialized automatically on the physical iPhone exactly once. Repeated child refreshes (4–5 times) and reopening the quest list did not create duplicate instances. The occurrence then completed the full live flow: child submit -> parent approve -> Linus attention -> child claim -> payout. After claim, another 4–5 refreshes did not rematerialize the weekly quest during the same ISO week. This physically verifies current-week weekly materialization, occurrence uniqueness/idempotency and normal reward lifecycle in the tested scope. Real week-boundary rollover, missed-period behavior and offline-next-period materialization remain unproven.


## A23 physical landscape interaction acceptance — 2026-09-22

The physical iPhone build is intentionally locked to landscape, so portrait-overlay acceptance is not applicable to the current product. In landscape, Kalle physically verified the child quest panel can be scrolled through, opened/closed repeatedly, and followed immediately by normal avatar/world interaction. No clipped interaction, stuck overlay or invisible touch-blocking layer was observed in this pass. Remaining A23 device QA is narrower: long quest text/large text, modal/keyboard focus where applicable, VoiceOver/accessibility, safe-area edge cases on other device sizes, and long-session thermal/FPS/memory behavior.


### A23 long-content landscape check — 2026-09-22

A deliberately long one-time quest (`A23 Lång text`) was physically checked on the iPhone in the landscape child quest panel. Long title/description content remained usable: the panel/card layout and scrolling held and the quest action remained reachable. No content-overflow blocker was observed in this pass.


### A23 live-session performance observation — 2026-09-22

During the continuing physical iPhone acceptance session, the game remained smooth while the other A23 interaction/content checks were performed. No noticeable frame degradation, touch-response degradation or thermal/performance blocker was observed during this session. This is a practical alpha-session observation, not a formal long-duration profiling or memory-leak test.
