# Physical iPhone Acceptance — 2026-10-08

Status: **CORE PASS · TWO FOLLOW-UP SMOKES REMAIN**

Repository: `sebass80s/sysselcraft`  
Branch: `nova/runtime-architecture-v1`

This records the preserved-device Runtime 1.1 acceptance performed before/around the first real Act 3 content slice.

## Safety boundary

The preserved installation was updated in place.

Do not uninstall/reset merely to simplify testing, clear the valuable save, regenerate the iOS project, or use Vercel as a substitute for native acceptance.

## Verified physical behavior

On the preserved primary iPhone, update-in-place testing confirmed:
- existing pairing/current-child relationship survived;
- Act 1 save/progression survived;
- wallet/diamonds/quest presentation remained plausible;
- established NPC/dog state survived;
- completed Act 2 state survived;
- Act 2 → Act 3 routing worked;
- Act 3 route opened through the shared chapter boundary;
- restart preserved chapter/save state.

A second physical iPhone was also updated successfully and remained functional.

## Native routing defect found

Physical acceptance exposed an Act 3 return-navigation defect. The chapter used a raw anchor path back toward Act 2, which could resolve incorrectly in the native routing environment.

The route now uses the shared chapter registry with Next router navigation.

## Acceptance result

Core Runtime 1.1 update-in-place acceptance is sufficient to begin normal Act 3 content work on the shared engine.

Two follow-up smokes remain desirable:
1. background the native app, then foreground it and confirm runtime/input/state resume safely;
2. execute one ordinary parent/backend quest through child turn-in/claim and confirm no Runtime 1.1 regression.

These are confidence checks, not permission to rewrite native routing or persistence.

## Runtime consequence

Do not recreate Act 3-local persistence, backend polling, Story sequencing, project/progression, Story Purchase, Phaser/world lifecycle or debug harness.

If Act 3 exposes a reusable engine gap, apply the stop-the-line rule and fix the shared owner first.
