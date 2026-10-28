# Preserved physical iPhone checkpoint — 2026-09-21

Canonical workspace: `/Users/karoaa/Developer/sysselcraft`.
Branch: `nova/local-construction-snapshot`.

The existing native project was copied from the readable historical Dokument donor without changing that donor, then synced with the canonical web build. Kalle verified build, signing and launch on physical iPhone, followed by the clean-save Recycling test recorded in `TECHNICAL_HANDOFF.md`. `ios/` must never be regenerated; do not run `cap add ios`.

## Versioned native baseline

- `ios/App/App.xcodeproj/project.pbxproj` and shared SwiftPM `Package.resolved`.
- `AppDelegate.swift`, `SceneDelegate.swift`, `Info.plist`, storyboards and app/splash asset catalogs.
- `ios/App/CapApp-SPM/Package.swift`, package source and supporting package files.
- `ios/debug.xcconfig`, `ios/App/App/capacitor.config.json`, `ios/App/App/config.xml`, and targeted ignore rules.
- Root `capacitor.config.ts` remains the source configuration. Native generated configuration is intentionally retained as the tested baseline; inspect its diff after sync.

Preserved settings: bundle ID `se.sysselcraft.app`; automatic signing with development team `C5XCT75WJ2`; landscape left/right; iOS 15 minimum; scene lifecycle using `SceneDelegate` and `CAPBridgeViewController`; Capacitor SPM 8.5.2 and Preferences plugin (8.0.1 in the tested installation). Signing credentials/profiles are not stored in Git; another developer needs authorized signing access.

## Ignored local/generated content

Generated `ios/App/App/public/`, Pods/build/output, DerivedData, SwiftPM `.build`, generated Cordova plugin output, `.DS_Store`, `xcuserdata`, `*.xcuserstate` and the Xcode IDEWorkspaceChecks marker are not versioned. Existing local files are retained, not deleted. Shared SwiftPM `Package.resolved` is versioned, not hidden by a blanket workspace/package ignore.

ESLint excludes only `ios/App/App/public/**` because these are compiled copies of the web application, not authored sources. Native sources are not excluded wholesale.

## Continue from a checkout

1. Verify the canonical path, branch and Git status; preserve local work.
2. Install JavaScript dependencies if absent. The current package ranges are not a full npm dependency lock; review resolved Capacitor versions against `Package.swift` before sync. The tested core/CLI/iOS version is 8.5.2.
3. Run `npm run verify` (includes the current static production build).
4. Run `npx --no-install cap sync ios` on the existing project and review native diffs. This creates the ignored web export/config-dependent artifacts needed to build.
5. Open `ios/App/App.xcodeproj` in Xcode; resolve SPM dependencies, choose the physical iPhone, and Run. Never use `cap add ios`.

The local Recycling slice is separate from backend pairing/reconciliation. Backend tests require the public environment configuration described in `NATIVE_BACKEND_TEST_PRECHECK.md`; the clean-save Recycling test does not certify those flows.

## Scope of this checkpoint

The adult panel fix restores vertical overflow after the shared storybook theme's `overflow: hidden` and sizes the panel inside top/bottom safe areas. It changes no game logic. Native stage 2–4 test controls remain available so playtesting does not invent production quests.

Henning is mentioned in the completion dialogue but is not spawned. Bakery remains stage 0/inactive. Bakery pacing can now be designed from Kalle's four-stage playtest; thresholds and exact Henning arrival are deliberately not implemented here.


## CURRENT NATIVE CHECKPOINT — ACT 1 CLOSEOUT 2026-09-27

The 2026-09-21 Recycling-only scope above is historical. The preserved native project remains valid, but the game has advanced through the complete Act 1 village arc, including Sol/Clinic. **Sol and Clinic are completed Act 1 content.**

Current native workflow:
1. Work only in `/Users/karoaa/Developer/sysselcraft` on `nova/local-construction-snapshot`.
2. Run `npm run syssel`. The helper verifies the canonical repo/branch, preserves the known local `ios/App/App/config.xml` modification, pulls fast-forward only, builds and syncs the existing iOS project.
3. Press Run in Xcode over the existing installed app.

Never run `cap add ios`, regenerate the native project, uninstall the app, reset Adam's save, clean/stash/delete local native state merely for acceptance testing, or move the canonical repo back into OneDrive.

Act 1 physical/backend work accumulated well beyond the original Recycling checkpoint, including Quest V2 approval/claim recovery and release smoke, Diamond purchase/delivery, parent quest administration, construction persistence and late-game Clinic restart safety. Treat the detailed dated evidence in `TECHNICAL_HANDOFF.md` as the evidence log.

**Next native production target is Act 2 at the lake.** Prefer isolated harnesses/Test-Ture for destructive progression testing. Adam's existing installation is valuable live progression and must be preserved.


## Current project handover pointer — 2026-10-06

This document remains authoritative for its own domain. Current Runtime Architecture 1.1 execution status and continuation order are tracked in `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`.

Verified Runtime 1.1 docs baseline before this closeout: `eb7df728adea783c676fe697738be62200430fc9`, GitHub Actions #2252 SUCCESS. Runtime items 1–4 are closed; generic chapter persistence is next. This pointer does not change the domain decisions recorded above.

## CURRENT DISTRIBUTION: TestFlight alpha — 2026-10-28

**This section supersedes the historical 7-day/free-signing and routine Xcode-cable distribution instructions above.** The normal iOS beta distribution route is now **Apple TestFlight**, not weekly sideloading. Xcode Run remains an exceptional direct-device debug/recovery option only.

- Apple Developer Program active; app `SysselCraft`; bundle ID `se.sysselcraft.app`.
- **TestFlight 1.0 (Build 2)** is Apple-approved, in external testing group **SysselCraft Alpha**, and tested successfully on a real iPhone with parent sign-in, Supabase, quest turn-in, parent approval, and rewards. **Build 1 is expired** because its exported web bundle omitted Supabase public config.
- Stable beta content: Acts 1–2 and Quest V2; **unfinished Act 3 is NOT included**. Do not merge/publish stacked Act 3 PRs as part of maintenance.
- The parent app is on `https://sysselcraft.vercel.app/parent`. Apple beta review has a separate demo family; never share real family credentials in Git or screenshots.
- Before installing a new build over Adam's older directly signed app, safeguard/verify his save, backend binding and currencies. Never uninstall to repair signing.
- iPad orientation metadata was updated in `ios/App/App/Info.plist` for upload acceptance; responsive iPad gameplay itself has not yet been fully verified.

### Release build procedure

Use a **clean, separate worktree** for stable releases rather than the local Act 3 development directory. Ensure its local `.env.local` (never committed) contains valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Check the **target Supabase project** before release; a present but incorrect URL/key can still point at the wrong backend.

1. Check branch/HEAD, worktree state, configuration, and CI; use the intended stable commit only. Preserve existing local files, especially `ios/App/App/config.xml`, `Act 3/` and image-pipeline assets.
2. Run `npm ci` as needed, then **`npm run ios:sync`**. It now runs `npm run ios:env:check` before `next build` and `cap sync ios`, failing if either public Supabase variable is missing/blank or the URL is not HTTPS. Do **not** bypass the guard using direct `npx cap sync` or stale `out/`.
3. Open `ios/App/App.xcodeproj`; select the paid developer team and Any iOS Device, increment the **build number** (keep marketing version unless intentionally releasing a new version), Product → Archive → Distribute App → App Store Connect.
4. Once processed, answer export compliance appropriately, add the new build to SysselCraft Alpha, supply brief What to Test notes and submit to external Beta App Review if required.
5. Validate the new build in TestFlight on a physical device: pairing, quests, approval and reward issuance. Expire faulty old builds. Do not equate an Xcode successful archive with a functional backend integration.

`npm run ios:env:check` checks presence and URL structure, **not live backend connectivity** or correctness of the target project. There is no guarantee that an Xcode-only archive cannot package stale files; release hygiene and a smoke test remain mandatory.

**Build-guard source:** `scripts/check-ios-env.mjs`, `package.json`; stable branch commit `83e8190386c52ee7e0e573350ea8111754592d8d`. At the handover check, [CI run 40755280230](https://github.com/sebass80s/sysselcraft/actions/runs/40755280230) was still in progress; recheck before declaring green.
