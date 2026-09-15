# Sysselcraft painted production assets

This tree is reserved for the post-hero-slice production art defined in `docs/NIGHT_GRAPHICS_PRODUCTION_2026-09-14.md` and `src/game/productionAssets.ts`.

## Expected layout

```text
production/
  buildings/
    recycling-centre/stage-1.webp ... stage-4.webp
    bakery/stage-1.webp ... stage-4.webp
    doctor-house/stage-1.webp ... stage-4.webp
  characters/
    child/{idle,walk}-{north,south,east,west}-01.webp/-02.webp
    linus/{idle,walk}-{north,south,east,west}-01.webp/-02.webp
    henning/reference.webp + animation frames
    sol/reference.webp + animation frames
```

No placeholder art belongs here. Missing painted assets must remain missing until real concept-art-first production files exist and pass the acceptance gate.

Run `npm run production:audit` to check expected file presence and WebP signatures. A failing audit is expected until the production set has actually been generated.
