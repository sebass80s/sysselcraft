# Image batch: canonical character-sheet paths (2026-10-13)

## The defect

Two older scripts, `scripts/build-image-batch.mjs` and `scripts/generate-image-batch.mjs`, plus their tests, demanded `public/assets/village/character-sheets/`. The authoritative `image-pipeline/character-registry.json`, `docs/ACT3_ART_SHOT_MANIFEST.md` and `image-pipeline/README.md` already use `public/assets/character-sheets/`. The historical village folder has duplicates of the original eight characters only. The canonical folder has all 12, including later Act 3 characters.

## Fix and restrictions

- Both scripts now exclusively validate identity reference PNG paths under `public/assets/character-sheets/`.
- Existing positive builder and generator tests point to the canonical files.
- New negative tests explicitly reject the historical village duplicates, even when physically present. Runtime sprites or arbitrary generated frames must not become identity sources.
- No PNGs, manifests, approvals, registry records, saved data, or story code are modified.
- The generator test uses `--dry-run` and does not send images to an external service.
- This is independent of PR #10 (Act 3 map UI).

## Run locally

```sh
npm run test:image-batch
npm run test:image-generate
npm run verify
```

These commands must run from a checkout containing the canonical sheet images. If full CI is skipped, report that separately rather than claiming a green full suite.
