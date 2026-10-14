# Issue #14 — första backendgrinden och Runtime 1.1

Bas: `nova/act3-playable-opening`, `4ba3a4f19a759f57739c60446f3cab3d3c9d0564`. Separat branch: `codex/act3-first-quest-bridge`. Stackad PR; ingen merge eller Vercel-deploy.

## Levererat beteende

Efter sista PARK-001-radens lyckade sparning börjar Runtime 1.1 läsa barnets backendräknare. Den första verifierade snapshoten under väntan sparas som **en enda baseline**. Approval utan claim ändrar inte räknaren. En ny claim efter denna baseline kan öppna PARK-002, med exakt en förbrukad claim och sparad `playing`-fas innan bilden/dialogen visas.

Pollning får endast spara verifierad evidens. Karttryck öppnar väntedialogen. `Kontrollera uppdrag` gör alltid en ny backendläsning innan eventuell scenstart; cachad evidens får aldrig öppna scenen offline. Flera nya claims ger fortfarande högst ett beat. Varje rad sparas före presentation, Föregående stannar inom beatet, och efter PARK-002 är denna slice slut. Återstart av redan sparad `playing`-fas kan fortsätta offline eftersom dess claim redan är reserverad/förbrukad.

Folkparken är aktiv och hamnen behåller befintlig Akt 2-retur utan BOAT-förbrukning. Vuxen-X krävs före save- eller backendläsning. Debugläget har syntetiska saves, ingen backend eller claimgrind.

## Gemensam motor — ingen import av Act 3

| Fil | Ansvar |
|---|---|
| `src/runtime/progression/claimGate.ts` | Typad ledger, strikt count/child/timestamp-validering, engångsbaseline, regressionsskydd och nästa beat från konfigurerade ID:n. Återanvänder `pendingAuthoritativeProgressCount` och dess gemensamma deltaaritmetik. |
| `src/runtime/progression/claimGateBridge.ts` | Binder generisk adapter till gemensam persistence. Färsk backendläsning, ledger och optional scenstart i **samma köade update**. Refresh startar aldrig ett beat. |
| `src/runtime/backend/pairedClaimEvidence.ts` | Barnbunden, läsande adapter för rå `child_game_state.progression.worldProgression`, med parningskontroll före/efter I/O. Ingen RPC/mutation. Krävs eftersom befintliga visningssnapshotens normalisering kan omvandla saknad/ogiltig räknare till 0. |
| `src/runtime/save/updateChapterFromView.ts` | Jämför renderad cursor med senaste sparade cursor innan övergång; bevarar metadata från samtidiga uppdateringar och stoppar dubbla/stale navigationer. |
| `src/runtime/save/useChapterPersistenceGuard.ts` | Per-operation livscykelgeneration och förväntat barn. Cleanup/StrictMode kan inte återaktivera en gammal operations lease. |

Oförändrade befintliga motorägare återanvänds: `createChapterPersistenceHost.update` för barnscope, serialisering, stale-check och rollback; `useBackendSyncHost`/`startBackendSyncLoop` för pollning/cancellation; chapter host, `StoryRunner`, `StoryMoment`, `storyLineAt`, `advanceStoryLine` och `previousStoryLineIndex` för presentation och navigering. Inget kopierat Act 3-poll-, save-, claim- eller Story-system.

## Endast Akt 3-innehåll och tunna adaptrar

- `src/game/act3FirstQuestGate.ts`: konfiguration med en enda beat (`A3-PARK-002`), när grinden väntar, ledgerfältet och kapitelns fas/cursor. Radsteg återanvänder shared storySequence.
- `src/game/act3Park002Content.ts`: 28 kanoniska stycken, titel **Bana sju**, godkänd `PARK-002.png`. Digest `da09a1b3`; hela paragraf-/talare-/textinventeringen jämförs automatiskt med manifestet. Endast `Barnet`-talaretiketten blir `Du`. Manus och bild är oförändrade.
- `src/game/act3RuntimeState.ts`: save v3 och dess invariantregler/migration. Behåller nyckeln `sysselcraft.act3.runtime.v1`. v1 får orörd `entered`; v2 behåller opening beat/rad. Varken migration eller offline skapar baseline eller claims. Corrupt/future save vägras och lämnas kvar.
- `src/game/act3DebugFixture.ts`: v3 och barnidentitet i host-context, utan backendprogress i debug.
- `src/components/Act3Skeleton.tsx`: komponerar befintliga hosts, map och Story UI; tillför väntetext och kapitelval. Alla produktionsövergångar använder gemensam atomic update med förväntad barnidentitet och livscykelguard.

V3-ledgern innehåller `baseline`, `consumed`, `observedCount`, `observedAt`. `park002Phase` är `waiting | playing | complete`; `park002LineIndex` är strikt begränsad till den kanoniska scenen. `consumed=1` sparas atomiskt med `playing` för att reservera en claim även om appen avslutas innan första bildrutan. Baseline/high-water-mark är läst evidens, inte en ny lokal källa till godkända quests.

## Bevis för Akt 4–6

`npm run test:claim-gate` kör samma motor/bridge/persistence med två oberoende fiktiva kapitel:

- `forest`: ID:n `TREE/STREAM`, baseline 20, consumed 0.
- `space`: ID:n `ORBIT/MOON/MARS`, baseline 80, consumed 1.

Båda testar approval-only, fel identitet, null/ogiltigt/offline, baseline en gång, regressiva snapshots, backlog, dubbelstart, reload, skrivfel, child-switch rollback och lifecycle-stale. Separat test verifierar rå backendadapter och StrictMode-generationsguard. Ingen ändring i enginekod mellan konfigurationerna.

Akt 4 behöver bara tillföra beat-ID:n, egen state/migration, adapterfunktionerna `waiting/ledger/withLedger/startBeat` och sin Story-presentation. Den använder samma bridge, read-adapter, sync- och persistencehost. Detta gäller den verifierade **en claim per beat**-mekaniken; andra questmodeller eller nya gameplayfunktioner ska först modelleras i motorn, inte kopieras in i kapitlet.

## Verifiering

- `npm run verify`: PASS (inklusive lint, production build, befintliga regressionssviter, nytt fuel-test och riktiga PARK-002-testet).
- `scripts/test-runtime-1-1-browser.mjs`: PASS, sex befintliga scenarios inklusive X, child-scoped saves och hamnretur.
- `scripts/test-act3-city-map-browser.mjs`: PASS, fyra viewportformat.
- `scripts/test-act3-opening-browser.mjs`: PASS, alla 139 fria rader och debug-grinden.
- `scripts/test-act3-first-quest-browser.mjs`: PASS, riktig Next/React med isolerad browserprofil och mockad backend. V2→v3, baseline 100, approval-only, fel barn, ogiltig räknare, offline, failed write, ny claim/backlog, alla 28 rader/Du, reload/Föregående, stopp efter beat och hamn utan progressionsändring.
- `test:act3-first-quest`: faktiska save-/bridge-adaptrar; v1/v2→v3, sista PARK-001-radens race med poll/dubbeltap, varje PARK-002-rads restart/skrivfel, backlog och stale barn. `test:claim-gate` verifierar även operationens livscykel.
- Nytt browser-test ingår i Runtime Browser Closeout-workflow. Båda workflows startas uttryckligen med `workflow_dispatch` på arbetsbranchen; körningslänkar och slutstatus redovisas i PR.

## Livebackend: läskontroll, inga verkliga questmutationer

2026-10-13 lästes de **installerade** SQL-funktionerna i Sysselcraft-projektet `gaszngmvoromihkkvjaa` (Postgres 17.6.1.166) via `pg_get_functiondef`, inte bara migrationsfilen. `review_quest` ändrar approved-status/metadata utan att öka progression. `claim_quest_reward` kontrollerar bound child, låser instansen, använder `reward_events ... on conflict (quest_instance_id) do nothing` och ökar `worldProgression` endast vid `row_count=1` innan `claimed_at` sätts. Unikheten kontrollerades också via indexdefinitionerna.

Detta är en live-kontraktskontroll plus integrationstest mot isolerade backend-svar. **Ingen riktig familjs quest skapades, godkändes eller claimades av testerna.** Ingen fysisk iPhone, verklig strömavbrottstestning eller full förälder–barn-transaktion på livekonton påstås.

## Kvarstående gränser / manuellt test

Ingen blockerande engine-lucka kvar för den testade en-claim-per-beat-grinden. Nästa storybeats, fler discovery-triggers, minispel, inköp och generell cross-device/cloud-savekonflikthantering ingår inte. Local chapter save behåller Runtime 1.1:s befintliga enhets-/barnscope; ett återställt lokalt save är inte en global serverledger.

På kopplad barnenhet: Vuxenläge → X → `nova3`, spela klart gratis PARK-001 online och låt grinden få sin första verifierade snapshot. Gamla claims räknas inte. Godkänn ett nytt uppdrag i föräldraläget; enbart approval ska inte öppna något. Hämta belöningen via barnets befintliga questflöde (Akt 3 gör aldrig claim-RPC). Återvänd via X, välj Folkparken och `Kontrollera uppdrag`. PARK-002 ska spela en gång och sedan stanna. Hamnen är tillgänglig från kartan. Testa restart utan att rensa/avinstallera befintliga saves. Om första snapshoten fås först efter en claim räknas den som historik; vänta på etablerad baseline innan den nya uppgiften claimas.
