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
- **PARK-009 och PARK-010 finns nu i utvecklingskoden.** PARK-009 följer manuset fram till minigolfen. Den shared minigolf-capabilityn (`src/runtime/minigames/minigolfEngine.ts`) driver bollfysik; den mobila React-spelytan ligger i `src/components/minigames/MinigolfGame.tsx`. Sikta genom att peka på banan, håll inne kraftknappen och släpp för slag. Avsluta genom att spela bollen i hålet och trycka Fortsätt berättelsen. Version 1 har en spelbar första bana; fler banor, nivåbalans och mobilkänsla är ännu **inte** godkända av användaren.
- När PARK-009:s 18 kanoniska repliker är slut övergår kapitelcursorn atomiskt till `gatedPhase: "activity"`, utan nytt IRL-quest. Minigolfens knappar kan bara spara avslut efter hole-in; kapitelvärden och claimledger fortsätter hanteras av Runtime 1.1. En avbruten session får börja om just banan, men inte använda samma redan uthämtade quest igen.
- Vid avslutat minigolfspel går cursor till väntan på **ett nytt separat claim** som låser upp PARK-010. PARK-010 har 32 spelbara textstycken (redaktionella manusanteckningar är inte speltext). Låst replik: ”Att mamma och pappa har kul tillsammans igen.”
- För lokal **utveckling enbart** kan `/act3-test?scene=park009` användas för att testa PARK-009 och minigolf utan 8 verkliga quests; den påhittade claimledgern är bara en isolerad React-debugfixture och får aldrig användas mot Supabase, TestFlight eller riktiga barn. Debugvägen är inte åtkomlig i produktionsbygg.
- Efter PARK-010 sparas väntan i `gatedBeatIndex: 9`. Nästa steg blir CITY-001 som en del av större batch- och kartkopplingsarbete. Inga enskilda tester behövs för varje vanlig dialogscen; minigolfens fysik och avslut är däremot en särskild återanvändbar kapabilitet som måste testas.


## Kvar senare

Stadskartans återstående discovery-/deadbeat-routes och aktiva platser, återresor mellan stad och by med bibehållen progression, minigolf vid PARK-009, shuffleboard vid PARK-020 och FAMILY-006, Miras inköpslista och en slutlig köpgrind, FAMILY som questfri sammanhängande final, epiloggrind och sex sammanhängande epilogbeats, samt iPhone-/bild-/kontinuitetsacceptans.

**Kanonisk originalordning och regler:** `docs/ACT3_GAMEFLOW_MAP_DRAFT_2026-10-11.md`, `docs/ACT3_IMPLEMENTATION_PLAN.md`, `docs/ACT3_STORY_MANIFEST.md`, `docs/ACT3_DIALOG_CANON_RESOLUTION.md`. Dokumentens äldre statustexter som säger att kartan eller storyn ännu inte finns är historiska. Kod och aktuell git-branch har företräde.

## Verifieringsstatus

Grundgrenens PR #19 SHA `71b1cf1c` har både CI och webbläsarregressioner **SUCCESS**. Den senaste minigolfkoden ska bedömas efter färdig GitHub CI och browser; tidigare misslyckade körningar kan vara mellancommits och får inte förväxlas med slutlig verifiering. För senaste utvecklings-HEAD krävs separat verifiering av `npm run verify` (inklusive innehållskontroll) och rimlig browser smoke, men ingen stor fullständig beat-för-beat-acceptans ännu. Resultat ska inte påstås innan de verkligen har passerat.
