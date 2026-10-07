# Runtime Architecture 1.1 — Handover 2026-10-06

## ABSOLUT FÖRSTA REGEL

Verifiera repo-verkligheten innan du ändrar någonting.

Repository: `sebass80s/sysselcraft`  
Branch: `nova/runtime-architecture-v1`

Senast verifierade kodcheckpoint:

`6f0acedd335e4b97913cc096b9d6ebd8c1300059`

GitHub Actions **#2275: SUCCESS** på exakt den SHA:n.

Den senaste verifierade kodcheckpointen före docs-closeout är:

`13d6f99a29f948b64dc74b2f3b214456cb5e7d74`

GitHub Actions **#2248: SUCCESS** på exakt den SHA:n.

Repo-verkligheten vinner alltid över denna handover, tidigare chattar, minne och dokumentation.

## Uppdraget

Runtime 1.1 bygger inte bara "lite mer shared code". Målet är fuel-principen:

> Framtida Act 3/4/5/6 ska huvudsakligen bestå av content, config, chapter-state och world/area-data/adapters. Redan löst runtimebeteende ska inte kopieras eller uppfinnas igen per kapitel.

Historiska problem som Runtime 1.1 ska göra svåra eller omöjliga:
- font- och layoutdrift mellan kapitel;
- egen Story-navigation per kapitel;
- Continue-knappar som fastnar;
- HUD/world-input under blockers;
- separata shop/purchase-specialfall;
- egen save/load/migration per kapitel;
- egen backend polling/reconciliation per kapitel;
- ännu en specialbyggd Phaser-runtime för varje ny area;
- nya chapter-specifika debugharnesses.

## Hård arbetsregel

Arbeta i SMÅ slices.

Kalle har uttryckligen bett om detta eftersom stora pass gör att prompt/tråd kan krascha. En slice ska:
1. verifiera branch/HEAD/CI;
2. förstå exakt ägarskap;
3. göra en avgränsad förändring;
4. låsa kontraktet med rätt regressionstest;
5. köra full `npm run verify` via CI;
6. inte gå vidare förrän checkpointen är grön;
7. dokumentera först när ett faktiskt delmål är stängt.

Undvik source-shape-test-whack-a-mole genom att uppdatera gamla implementationstester till den nya ägargränsen, inte bara nya strängar.

## Runtime 1.1 status

### 1. Shared Chapter Runtime Host — STÄNGD ✅

Verifierad kodcheckpoint:
- `c926c7a518e6b40b07acd3f7cf8285af1150962e`
- CI #2121 SUCCESS

Shared:
- chapter boot/access/ready/status;
- chapter intro visibility/lifecycle boundary;
- world mount/sync/destroy lifecycle;
- shared overlay authority för shell + world input.

Viktigt: detta stänger lifecycle-hosten, inte full backend sync eller full World/Area Engine.

### 2. Generic Progression / Project Engine — STÄNGD ✅

Verifierad kodcheckpoint:
- `4bfec68e695b15c3925c077b62a66db27787702b`
- CI #2149 SUCCESS

Shared:
- configured target counts/stage thresholds;
- sequential/idempotent consumption;
- selection/prerequisites/active-track lock;
- authoritative backlog composition;
- completion/auto-deselect;
- exactly-once completion reactions.

Act 2:s 16 är nu config, inte dold generic motorlogik.

### 3. Shared Story UI / sequencing / inputs / history / cards / choices — STÄNGD ✅

Verifierad kodcheckpoint:
- `4d6fef7f89e64223a986ab164feddf48a3d388d9`
- CI #2200 SUCCESS

Shared:
- canonical Story typography, safe area, overflow, navigation;
- semantic presentation variants istället för rå chapter-z-index/background;
- shared naming/text input;
- intro/end cards;
- Story History/replay shell;
- linear sequence primitives;
- standard choice layout.

Act 2 opening, Alve intro, contributions, completion reactions, cabin revisit och finale använder shared sequencing.

### 4. Generic Story Purchase integration — STÄNGD ✅

Verifierad kodcheckpoint:
- `13d6f99a29f948b64dc74b2f3b214456cb5e7d74`
- CI #2248 SUCCESS

Docs-closeout:
- `eb7df728adea783c676fe697738be62200430fc9`
- CI #2252 SUCCESS

Shared/generic:
- `purchaseStoryItem(itemKey)` transport;
- Story Purchase definitions;
- Story Purchase registry;
- catalog-driven Mira rendering;
- generic purchase dispatcher;
- generic handoff/return resolution;
- chapter adapter for stock/snapshot/post-purchase state;
- optional restart-safe post-purchase Story Moment;
- generic insufficient-funds based on registered item price.

Fuel-test result:
- ett framtida Act 3 story-item ska registreras som data/adapter;
- det ska inte kräva `if (act3...)`, nytt Mira-shopkort, ny `buyAct3...`-funktion, ny backend-wrapper eller ny handoff-branch.

## DET SOM ÅTERSTÅR

Fortsätt i denna ordning. Hoppa inte till Act 3 gameplay.

### 5. Generic chapter persistence host — STÄNGD ✅

Verifierad kodcheckpoint:
- `6f0acedd335e4b97913cc096b9d6ebd8c1300059`
- GitHub Actions **#2275 SUCCESS** på exakt den SHA:n.

Shared persistence äger nu:
- child-scoped Preferences I/O och canonical key construction;
- ordered load/save/clear;
- strict unreadable/unsupported persisted-state handling;
- safe legacy-key migration;
- canonical write före destruktiv legacy cleanup;
- chapter-supplied migration + normalization hosting.

Act 2 är migrerad till shared hosten och äger fortfarande endast sin state-shape, defaults, normalizer, finale/schema migrationer och chapter-specifika invariants.

Fuel-proof:
- en neutral framtida chapter-definition under `scripts/fixtures/chapter-persistence-fuel-proof.ts` kan migrate/load/save/clear via shared hosten utan egen `Preferences`-kod;
- fuel-proofen är regressionstäckt i `test:chapter-persistence`.

Backend-owned quest/wallet/earned-work evidence är oförändrat auktoritativt.

### 6. Shared backend synchronization/reconciliation — STÄNGD ✅

Verifierad kodcheckpoint:
- `9c6b0661879374ed85e166b2b314a202eb685751`
- GitHub Actions **#2300 SUCCESS** på exakt den SHA:n.

Shared backend runtime äger nu:
- canonical wallet/progression/worldFlags authority snapshots;
- paired-child lookup och backend game-state fetch;
- polling lifecycle och default cadence;
- max en request i flight;
- cancellation/stale-response safety;
- React host lifecycle/cleanup;
- error/recovery dispatch.

Act 2 äger endast sin chapter-adapter:
- vilka snapshotfält presentationen behöver;
- hur authoritative progression/world flags reconcileras till lokal Act 2 presentation state;
- idempotent persist/update när den lokala presentationen faktiskt ändras.

Boot-hydration och kontinuerlig polling använder samma shared authority source. Act 2 importerar inte längre pairing/backend transport eller snapshot construction direkt.

### 7. Full World / Area Runtime Host — NÄSTA

### 7. Full World / Area Runtime Host

`useChapterWorldHost` stängde mount/sync/destroy-lifecycle men inte hela world engine.

Återstår att dela tillräckligt av:
- scene lifecycle;
- player/dog creation/follow;
- keyboard/touch plumbing;
- camera follow;
- common input enable/disable;
- interaction plumbing;
- labels/prompts;
- common movement-loop lifecycle.

Area-specifikt får förbli:
- karta/assets/placements;
- collision-data;
- movement/navigation strategy, t.ex. A* i byn vs direkt lake movement.

Målet är att Act 3 inte ska behöva kopiera en ny `createAct3...Game.ts` för etablerad motorlogik.

### 8. Common chapter debug / acceptance harness

Nuvarande debugverktyg är för chapter-specifika.

Shared harness ska kunna konfigureras med chapter fixtures och standard actions:
- launch/reset;
- synthetic progress/wallet where safe;
- state inspection;
- standard chapter jumps/probes.

Unika chapter-probes får vara extensions.

### 9. Empty Act 3 skeleton proof

Detta är arkitekturens syratest.

Bygg ett minimalt tomt Act 3 som endast använder:
- chapter registration/metadata;
- versioned chapter state via shared persistence;
- story/content definitions;
- project/progression definitions om det behövs;
- purchase definitions om det behövs;
- world/area data/adapters;
- genuinely unique mechanics only.

Om tomma Act 3 kräver kopierad engine-logik är Runtime 1.1 fortfarande öppen.

`/act3` är idag bara en read-only boundary/placeholder. Det finns ingen Act 3 gameplay-runtime ännu.

### 10. Full automated + browser verification

Efter 5–9:
- full `npm run verify`;
- focused empty-Act3/fuel regression;
- browser smoke på chapter transitions, Story, shop, HUD/world-input, save/reload;
- ingen Vercel krävs för vanlig arkitekturverifiering.

### 11. Physical iPhone update-in-place acceptance — SIST

Hård ordning:

`finish Runtime 1.1 engine -> empty Act 3 proof -> full automated/browser verification -> physical iPhone update-in-place acceptance`

Föreslå inte fysisk iPhone-testning före detta.

Preserve befintlig save/backend. Reset/reinstall inte telefonen för att göra test enklare.

## Vercel

Automatiska Git-deploys är avstängda.

Repo `vercel.json` använder global `"deploymentEnabled": false` och Vercel-projektets ignore-build är satt för att ignorera Git-triggerade builds.

Arkitekturmodell:
- GitHub CI = automatisk verifiering;
- Xcode/Capacitor = riktig native build;
- Vercel = manuell web-preview endast när Kalle uttryckligen vill ha den.

Skapa inte Vercel-deploys under vanligt Runtime 1.1-arbete.

## Native / iOS

Next exporteras statiskt till `out`; Capacitor använder `webDir: "out"`.

Gör aldrig:
- `npx cap add ios`;
- regenerera native iOS-projektet;
- reset/reinstall av bevarad fysisk save utan uttrycklig anledning.

## Act 2

Act 2 är innehållsmässigt färdig som kapitel. Runtime 1.1 använder Act 2 som verklig konsument för att pressa fram generiska motorgränser.

Invariants att bevara:
- 16 contributions per project, 64 total;
- Brygga/Båthus/Stuga före Motorbåt;
- backend work/reward evidence authoritative;
- local Act 2 state äger consumed/presented story/world state;
- legacy finale migration behåller redan konsumerad historik;
- completed Act 2 + end card acknowledged exponerar Act 3 boundary;
- Alve saknas efter completed + endCardSeen.

Förändra inte story/content bara för att förenkla motorrefaktor.

## Save / ownership

Läs `STATE_OWNERSHIP.md` och `SAVE_COMPATIBILITY_AUDIT.md` innan punkt 5.

Grundlag:
- local migration får bara reparera historiska lokala former när evidensen finns lokalt och konverteringen är ren/ownership-locked;
- backend quest lifecycle, rewards, wallet och earned-work evidence är backend-authoritative;
- invariant repair, backend recovery och storage migration ska inte maskeras som "migration" bara för att centralisera kod;
- successful new write måste ske före destruktiv legacy-key cleanup.

## Testfilosofi

Ändra det smalaste testet som faktiskt äger kontraktet.

Nuvarande viktiga suites:
- `test:chapter-lifecycle`
- `test:chapter-runtime-shell`
- `test:project-progress-engine`
- `test:story-ui`
- `test:story-purchase-flow`
- `test:act2-runtime`
- `test:act2-full-flow`
- `test:act2-closeout`
- `test:ui-shell`
- save/construction regression suites

Undvik att lägga fem regex-guards för samma implementation i fem filer.

## Första arbetsorder till nästa Nova

1. Verifiera branch `nova/runtime-architecture-v1`.
2. Verifiera att HEAD fortfarande är `eb7df728adea783c676fe697738be62200430fc9` eller förstå exakt vad som ändrats sedan denna handover.
3. Verifiera CI på exakt HEAD.
4. Läs:
   - `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`
   - `docs/RUNTIME_ARCHITECTURE_1_1.md`
   - `docs/RUNTIME_1_1_FUEL_AUDIT.md`
   - `docs/STATE_OWNERSHIP.md`
   - `docs/SAVE_COMPATIBILITY_AUDIT.md`
   - `docs/TECHNICAL_HANDOFF.md`
5. Punkt 5 är stängd på `6f0acedd335e4b97913cc096b9d6ebd8c1300059` / CI #2275 SUCCESS.
6. Punkt 6 är stängd på `9c6b0661879374ed85e166b2b314a202eb685751` / CI #2300 SUCCESS.
7. Starta Runtime 1.1 punkt 7: Full World/Area Runtime Host med audit/contract först.
8. Centralisera endast bevisat gemensam scene/player/dog/input/camera/interaction/lifecycle-logik. Lämna karta, assets, collision-data och movement/navigation strategy area-specifikt.
9. Gå därefter i ordning 8 -> 9 -> automated/browser -> fysisk iPhone.

## Slutstatus

Runtime 1.1 är **inte färdig**.

Stängt:
- 1 Shared Chapter Runtime Host ✅
- 2 Generic Progression / Project Engine ✅
- 3 Shared Story UI / sequencing / inputs / history / cards / choices ✅
- 4 Generic Story Purchase integration ✅
- 5 Generic chapter persistence host ✅
- 6 Shared backend synchronization/reconciliation ✅

Öppet:
- 7 Full World/Area Runtime Host
- 8 Common debug/acceptance harness
- 9 Empty Act 3 proof
- full automated/browser closeout
- final physical iPhone update-in-place acceptance

Det viktigaste: börja inte bygga Act 3 gameplay ännu. Gör klart motorn tills tomma Act 3 kan vara bränsle, inte ännu ett specialbygge.
