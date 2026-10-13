# Codex-handover: Akt 3 stadskarta | 2026-10-13

## Handoff

Arbetsuppgift: implementera den klickbara React/Next-kartvyn enligt Issue #9. OBS: arbetet från detta förberedelsepass är **inte** en implementation av UI eller storygates. Koden ska byggas på separat branch med PR-bas nova/runtime-architecture-v1.

### Nu finns grafik och rena helpers

- Godkänd REN karta: public/assets/village/act3-map/city-background.png (1672×941; ej ikonmockupen).
- Ikoner (5): public/assets/village/act3-map/nodes/{harbor,folkpark,home,game-shop,treasure-hunt}-icon.svg. Alla textlösa, 124×136 viewBox.
- Datakontrakt: src/game/act3CityMapNodes.ts med ACT3_CITY_NODES, getVisibleAct3CityNodes, getAct3CityNodeConfirmation och ACT3_CITY_ICON_URLS.
- Exakt SVG-pinnspets vid x=62/124, y=102/136. Spetsens topplägesoffset vid displaybredd 62 px blir 51 px, inte 68 px. Använd src/game/act3CityMapGeometry.ts eller geometriskt likvärdig DOM/CSS. Kartan visas med contain utan avklipp; noder ska vara i bildens reella innehållsyta, inte i letterbox.
- Testerna scripts/test-act3-city-map-assets.mjs och scripts/test-act3-city-map-geometry.mjs är anslutna till npm run verify.

### Runtime integration: viktigt

- Nuvarande src/components/Act3Skeleton.tsx är enda entry, med useChapterRuntimeHost, ChapterIntroCard, ChapterRuntimeBoundary, debug-fixture och adults-only preview via consumeAct3PreviewEntry. Använd dessa. Rör inte X-porten.
- src/game/act3RuntimeState.ts sparar idag **endast** {version:1,entered:boolean} med shared createChapterPersistenceHost. Ändra inte tyst formatet. För platsupptäckter och Story-progress krävs en separat medveten save/migrationsdesign; detta kan tas i nästa slice.
- Den första spelbara OPEN-introsekvensen saknas ännu. Visa inte allt oöppnat storyinnehåll som en debug-genväg bara för att kartan finns.
- HÅLL presentationskomponenten ren: props med Act3CityMapVisibilityContext och onConfirmNode(nodeId), inga egna quest-/valuta-/progressionsskrivningar.
- Placering/synlighet: Hamnen alltid synlig på kartan. Permanenta platser först efter explicit discovery; skattjakt tillfälligt under HUNT-001..006, spelbutiken heter Arkaden först efter avslöjandet.
- Karttryck öppnar dialog 'Vi går till parken.' med 'OK' och 'Gå tillbaka'; avbryt ska inte ändra någonting, OK anropar endast värdens nodcallback, inte direkt story-complete.
- Normal resa från Hamnen till sjön får inte konsumera BOAT-001..005 storyquests.

### Kända begränsningar och testgräns

- Full npm run verify, iPhone-layout och spar/resume är inte verifierade i detta förberedelsepass. Inga Vercel-deploys eller GitHub Action-minutes användes.
- scripts/test-act3-empty-skeleton.mjs innehåller text-/regexkontroller på nuvarande Act3Skeleton.tsx; bevara dessa eller uppdatera avsiktligt och testbart när du kopplar in UI.
- docs/ACT3_CONTENT_REGISTRY.md: 140 beats, 139 bilder, 3 extras. mapLocationId är fortfarande null för samtliga beats. Storymanuset inklusive det nya A3-DRAMA-007 får inte ändras av kartjobb.
- Förberedelsepasset har bara public-URL-konfiguration, matematiska positionshjälpare och tester. UI, Story Engine, quest-gates och save-uppgradering återstår.

### Arbetssekvens för Codex

1. Verifiera aktuell branch/HEAD och läs Issue #9 plus docs/ACT3_CITY_MAP_NODES.md.
2. Kör npm run test:act3-city-map-nodes, npm run test:act3-city-map-assets, npm run test:act3-city-map-geometry.
3. Implementera statisk kartkomponent med positionering i 16:9 contenuta, accessible touch targets och en modal för bekräftelse.
4. Koppla till befintliga Act3Skeleton utan att gå förbi vuxen-X eller chapter intro. Undvik ogrundad storyprogression.
5. Lägg till UI- och modaltester. Kontrollera lint/build och relevanta Runtime 1.1-testsviter. Öppna PR mot nova/runtime-architecture-v1.
