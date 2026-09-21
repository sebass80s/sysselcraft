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
