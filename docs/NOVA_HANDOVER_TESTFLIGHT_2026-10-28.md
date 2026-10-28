# NOVA HANDOVER — TestFlight alpha and Act 3 continuation — 2026-10-28

## Verify reality first

Repo `sebass80s/sysselcraft`; stable integration branch `nova/runtime-architecture-v1`. At the start of this documentation closeout the branch was at `83e8190386c52ee7e0e573350ea8111754592d8d` whose CI [40755280230](https://github.com/sebass80s/sysselcraft/actions/runs/40755280230) subsequently passed. **Docs commits advance HEAD.** Verify latest GitHub HEAD, CI and all Act 3 PR status before changing code or deploying.

This is an ongoing project, not a new start. Runtime Architecture 1.1 governs shared gameplay, saving and chapter architecture. Do not create an Act 3-specific parallel engine.

## Stable alpha now runs through TestFlight

- Apple Developer paid membership is active, app ID `se.sysselcraft.app`.
- The **approved, physically tested** build is **SysselCraft 1.0 (2)** in external testing group **SysselCraft Alpha**. A real iPhone completed the loop: parent login, quest delivery, child completion, parent approval and reward. Parent website: `https://sysselcraft.vercel.app/parent`.
- **Build 1 is expired**. It was accidentally exported without Supabase public environment variables and showed “Supabase is not configured”.
- Current beta includes **Acts 1 and 2** and Quest V2. The unfinished playable **Act 3 is not included**.
- Apple beta review uses a separate test family (test child and diamond reward). Do not commit credentials or reuse Adam's accounts.
- External TestFlight is now **the default iOS distribution**, eliminating the prior weekly 7-day free-provisioning routine. Xcode direct install is reserved for debugging/recovery. TestFlight does not mean public App Store release.
- iPad orientation declaration was corrected in `ios/App/App/Info.plist`. Apple's upload accepted the change; iPad responsiveness/behavior remain untested.

## Release prevention and repeatable steps

`scripts/check-ios-env.mjs` and the `package.json` `ios:sync` script were updated by commit `83e8190`. `npm run ios:sync` now gates the Next.js export and Capacitor sync on `NEXT_PUBLIC_SUPABASE_URL` (HTTPS URL) and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (nonempty), printing no values. It does **not** test live connectivity or prove the project is the intended Supabase instance. Direct Xcode archive of stale bundled assets or manually bypassing the script still needs discipline.

Stable release worktree: `~/Developer/sysselcraft-testflight`. Normal working repo: `~/Developer/sysselcraft`. The latter contains ongoing Act 3 development and local untracked art (`Act 3/`, image-pipeline directories) as well as a modified native `config.xml`. Protect all of them; never use blanket git clean/reset.

For next TestFlight build: select the stable SHA in an isolated clean worktree, provide the correct local gitignored `.env.local`, run `npm ci` when needed and `npm run ios:sync`, inspect native diffs, open existing `ios/App/App.xcodeproj`, verify signing, increment build number, Archive and distribute to App Store Connect. After processing, add to SysselCraft Alpha and submit for Beta App Review if necessary. Smoke-test in TestFlight before broader invitations; expire broken builds. Never `cap add ios`, uninstall Adam's app, or reset local saves. See `docs/IOS_CHECKPOINT.md`.

## Verified continuation clarification (2026-10-28)

**Do not restart Quest V2.** PR #17 (recurring expiry and parent removal) and PR #18 (explicit `Skapa mall`) are **already merged** into the stable integration branch. The old 2026-10-14 Quest V2 handover is historical and its assertions that PR #18 is open, migration unapplied or deployment pending are stale. Quest V2 is already active in the tested TestFlight 1.0 (2) flow and parent web app.

Build guard commit `83e8190` passed [GitHub CI #40755280230](https://github.com/sebass80s/sysselcraft/actions/runs/40755280230) **SUCCESS**. The follow-up agent also checked rejection of missing variables, malformed URL, HTTP URL, and blank publishable key, plus successful acceptance of synthetic valid configuration. Stable docs HEAD `ed2329b` passed [CI #40755805654](https://github.com/sebass80s/sysselcraft/actions/runs/40755805654) **SUCCESS**. These are historical verified observations; still check latest status before a merge.

Act 3's open stacked PR sequence is **#13 (playable opening) → #15 (first quest gate / PARK-002) → #16 (speaker nameplate and dialogue presentation)**. At the continuation checkpoint, PR #16 was awaiting CI verification on its actual HEAD; do not rebuild or reinvent these implemented layers. Confirm current Actions results and branch heads, then continue **from PARK-003** and remaining approved story beats, not from a new opening or Quest V2 implementation. The local art-pipeline/reference-image discipline remains mandatory.

**Release separation:** Keep stable TestFlight 1.0 (2) untouched while advancing Act 3 branches; do not create a TestFlight upload or deploy on every documentation/code commit. Only intentionally integrate and release after acceptance tests.

## Act 3 status / next work

Act 3 remains in separate stack/branches (historically `nova/act3-playable-opening`, `codex/act3-first-quest-bridge`, `nova/act3-story-presentation-qa`). The previously reported local Act 3 HEAD was `28ef6c8`, **not a current-HEAD guarantee**. Inspect branches, CI and open PRs to discover what has since changed. Do not merge unfinished content into the stable alpha automatically.

Story/art constraints: the Child's face must never appear in artwork; preserve model/reference images and established image pipeline; Nova's speaker name must not appear before her introduction; remove beat titles from dialogue UI; keep saved exact story/dialogue sources and Runtime 1.1 ownership. Art output and manual image uploads are separate; never assume a rendered image was uploaded to GitHub.

Quest V2 requirements remain: recurring expired occurrences must not duplicate; parents can remove active quests, and templates must be created explicitly via `Skapa mall`, not silently generated. Preserve child save, pairing, premium/in-game currency and reward history.

## Immediate continuation

1. Recheck latest branch HEAD and Actions (known green: build guard CI #40755280230 and stable docs CI #40755805654).
2. Run a negative local test that `npm run ios:env:check` fails when Supabase public configuration is missing, and a positive test with correct local values. Do not expose key values.
3. Verify docs and release workflow remain aligned. Avoid unnecessary Vercel deployments.
4. Inspect Act 3 PR branches and resume the correct current task, independent of stable TestFlight.
5. Before any future change installed on Adam's phone, confirm preservation of local saves and backend child binding; don't uninstall a signed app to fix a certificate.
