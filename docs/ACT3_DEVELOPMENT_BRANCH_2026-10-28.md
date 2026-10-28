# Akt 3: löpande utvecklingsgren och batchstrategi

Datum: 2026-10-28

## Källor och brancher

- **Aktiv utvecklingsgren:** `nova/act3-development`.
- Grenen skapades från verifierad `nova/act3-park003-gate` HEAD `71b1cf1c`, vilken innehåller arbetet i PR #13 → #15 → #16 → #19.
- **Stabil releasegren:** `nova/runtime-architecture-v1`. TestFlight **1.0 Build 2** till SysselCraft Alpha ska förbli orörd tills hela Akt 3 är kvalitetskontrollerad och användaren uttryckligen vill släppa en ny build.
- Ingen automatisk merge av aktutveckling till stabil branch, ingen Vercel-deployment, ingen ny TestFlight-build, inga ändringar av konton eller sparningar på barnets telefon.

## Överenskommet arbetssätt

Motorn är redan verifierad för flera storybeats och auktoritativa quests. **Skriv inte ett nytt test eller en särskild React-scen för varje beat.** Gruppera vanliga manusbeats som kanonisk, genererad innehållsdata som återanvänder Runtime Architecture 1.1 StoryRunner, samma save-cursor och samma `createClaimGateBridge`.

- `src/game/act3GatedBeats.ts` är ordnad lista av upplåsta beats; varje beat får exakt en ny föräldragodkänd och uthämtad quest, i ordning. En backlog får inte hoppa över osedda beats.
- `scripts/act3-story-batches.json` deklarerar innehållspaket och eventuella **grammatiskt granskade** ändringar av berättarperspektiv (Barnet → Du/dig). Originalmanuset får inte skrivas om.
- `scripts/export-act3-story-batches.mjs --write` genererar TypeScript, `--check` säkerställer att genererat innehåll matchar `ACT3_STORY_MANIFEST.md` och registrerade digester.
- Ett **gemensamt motor-/sparningsregressionstest** räcker för en batch. Kontrollera canon via exportskriptet. Fullständig speltestning av många beats görs som ett **sammanhängande acceptanstest senare**, inte som manuella enskilda kontroller efter varje beat.
- Vid nya figurer används vanliga talar-ID:n i `Act3OpeningLine`. Presentationen fortsätter dölja Novas namn tills hon har sagt det. Barnets ansikte får **aldrig** visas i någon illustration.

## Aktuell spelbar utvecklingsdel

- Kapitlets fria introduktion `OPEN-000–005` och `PARK-001`.
- Questlåsta `PARK-002`, `PARK-003`.
- Nya batchen **`PARK-004–008`**, fem beats och **170 textstycken**, dataexporterade från kanonmanuset. Quest- och sparlogik återanvänds utan egna villkor.
- Stannar uttryckligen **före `PARK-009`**, vars innehåll inkluderar **minigolf**. En minigolfmotor i Runtime 1.1 ska kopplas in under detta beat innan `PARK-009` kan anslutas. `PARK-010` är nästa questlåsta beat efter minigolfen.
- När alla sju questlåsta parkbeats genomförts ligger nästa gated cursor kvar i `waiting` på position 7. Det får inte skrivas som permanent `complete`: listan ska kunna förlängas utan per-beat migrationskod.

## Kvar senare

Stadskartans återstående discovery-/deadbeat-routes och aktiva platser, återresor mellan stad och by med bibehållen progression, minigolf vid PARK-009, shuffleboard vid PARK-020 och FAMILY-006, Miras inköpslista och en slutlig köpgrind, FAMILY som questfri sammanhängande final, epiloggrind och sex sammanhängande epilogbeats, samt iPhone-/bild-/kontinuitetsacceptans.

**Kanonisk originalordning och regler:** `docs/ACT3_GAMEFLOW_MAP_DRAFT_2026-10-11.md`, `docs/ACT3_IMPLEMENTATION_PLAN.md`, `docs/ACT3_STORY_MANIFEST.md`, `docs/ACT3_DIALOG_CANON_RESOLUTION.md`. Dokumentens äldre statustexter som säger att kartan eller storyn ännu inte finns är historiska. Kod och aktuell git-branch har företräde.

## Verifieringsstatus

Grundgrenens PR #19 SHA `71b1cf1c` har både CI och webbläsarregressioner **SUCCESS**. För senaste utvecklings-HEAD krävs separat verifiering av `npm run verify` (inklusive innehållskontroll) och rimlig browser smoke, men ingen stor fullständig beat-för-beat-acceptans ännu. Resultat ska inte påstås innan de verkligen har passerat.
