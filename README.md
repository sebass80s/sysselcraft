# SysselCraft

SysselCraft is a native iOS (Capacitor/Phaser) family game with a web-based parent interface.

## Current alpha distribution (2026-10-28)

**iOS beta builds are now distributed through Apple TestFlight**, not recurring 7-day Xcode sideloads. The approved and physically tested version is **1.0 (Build 2)**, external group **SysselCraft Alpha**. Build 1 was expired due to missing Supabase configuration. Acts 1–2 and Quest V2 are in the stable beta; **Act 3 remains unfinished on separate development branches**.

- Parent web app: https://sysselcraft.vercel.app/parent
- Native release instructions and preservation rules: [docs/IOS_CHECKPOINT.md](docs/IOS_CHECKPOINT.md)
- Latest transition handover: [docs/NOVA_HANDOVER_TESTFLIGHT_2026-10-28.md](docs/NOVA_HANDOVER_TESTFLIGHT_2026-10-28.md)
- Runtime Architecture 1.1: [docs/RUNTIME_ARCHITECTURE_1_1.md](docs/RUNTIME_ARCHITECTURE_1_1.md)

For iOS releases, use a separate stable worktree with local `.env.local`, then **`npm run ios:sync`**. This command now checks public Supabase configuration before building. Never commit credentials or bypass the preflight by directly copying an older web export. Test backend operations on a physical device before inviting testers.

The canonical development checkout has ongoing Act 3 files and local artwork. Do not reset or clean it to prepare a release.
