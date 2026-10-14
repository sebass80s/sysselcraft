
**iPhone-UX-korrigering 2026-10-14 (stackad efter PR #15):** Vanliga illustrerade Akt 3-beats använder den gemensamma Story-motorn **utan synlig scenrubrik**. Behåll titel som tillgänglighetsnamn och i innehållsregistret. Tjejen på kajen visas som **"Tjejen"** på nameplaten tills hon i A3-OPEN-002 säger "Nova."; först nästa dialograd visas **"Nova"**. Scenanvisningar får inte spoila namnet före introduktionen. Detta är en kapitelspecifik deklarativ reveal-regel ovanpå Runtime 1.1:s gemensamma speaker-identity-presenterare, ingen ny Act 3-dialogmotor eller sparflagga. Manus, digests, bilder, questgrind och save v3 förblir oförändrade.
# Akt 3 — Implementationsbeslut och plan

**Issue #14, 2026-10-13:** PARK-002 har nu en gemensam Runtime 1.1-grind med strikt backend-evidens och save v3. Se [ansvar, tester och begränsningar](ACT3_FIRST_QUEST_BRIDGE_2026-10-13.md). Äldre beskrivningar av helt stängd PARK-002 nedan avser föregående slice.

**UI-status 2026-10-13 (Issue #9):** Responsiv kartvy och gemensam bekräftelsedialog är implementerade i `Act3CityMap` och kopplade till befintlig `Act3Skeleton`. X-port och kapitelkort kvarstår. Endast hamnen visas tills riktiga discovery-triggers tillförs; OK där öppnar befintliga Akt 2 utan BOAT-progression. Övriga typade platsval har en uttrycklig framtida Story-integrationsgräns. Se [implementation, tester och begränsningar](ACT3_CITY_MAP_UI_VERIFICATION_2026-10-13.md). Äldre förberedelsestatus nedan beskriver läget före UI-slicen. Fysisk iPhone-acceptans återstår.

**Förberedelse 2026-10-13:** Kartgrafiken ligger i repot och för Codex finns exakt assetschema, geometri och testkontrakt i `docs/ACT3_CODEX_MAP_HANDOVER_2026-10-13.md`. Denna status ersätter 2026-10-12-formuleringen om saknade filer; faktisk UI, storyprogress och iPhone-acceptans återstår.

**2026-10-12: node-schema framtaget, inte kart-runtime:** Fem platser har normaliserade ankarpositioner och rena synlighets-/bekräftelseregler i src/game/act3CityMapNodes.ts och docs/ACT3_CITY_MAP_NODES.md. Popup efter ikontryck: 'Vi går till parken.' med 'OK' och 'Gå tillbaka'. Exakt discovery-beat och iPhone-positioner är fortfarande öppna. Ren baskarta och fem separata textlösa SVG:er finns nu i GitHub (uppladdade i commit 49f2fad7). Asset-URL:er och contain/pinspets-geometri är förberedda i kod med isolerade tester, men kartvyn är fortfarande inte byggd. Ingen quest- eller Story Engine-koppling gjord.


**Statusuppdatering 2026-10-12 (innehållssteg 1):** docs/ACT3_CONTENT_REGISTRY.md och src/game/act3ContentRegistry.json inventerar 140 kronologiska beats, 139 uppladdade scenbilder och tre okopplade extrabilder. OPEN-000 är kapitelkort. Dialogkällorna är spårbara med drifttest, men line-by-line QA och full runtime-dialogexport återstår. Kartplatstriggers är ännu inte godkända och ligger uttryckligen som null. Stadskarta, storyspelning, questgrindar och minispel är fortfarande EJ IMPLEMENTERADE.



**Kronologisk helhetskarta (huvudordning + 1:1-quest-beats LÅSTA 2026-10-11):** `docs/ACT3_GAMEFLOW_MAP_DRAFT_2026-10-11.md` beskriver hela OPEN→EPILOG. **Användaren har godkänt de stora blockens ordning**, inklusive första stadsdagen → första hemresan utan Nova → skattjakten → 2011-upptäckten → dramat/arkaden → Novas första bybesök → förberedelserna → familjedagen → epilogen. **Fem stadsplatser och exakt ett IRL-quest per beat är nu LÅSTA**; ikonernas exakta framträdande, pixelpositioner och transportsparning är fortfarande designfrågor, inte implementerade system.

**Status:** PRODUKTBESLUT LÅSTA 2026-10-11. X-porten ligger i kod; övrig stadskarta, berättelse och minispel ÄNNU INTE IMPLEMENTERADE.  
**Repo/branch:** `sebass80s/sysselcraft` / `nova/runtime-architecture-v1`  
**Källor:** Användarens uttryckliga beslut i implementationsdiskussion 2026-10-11. Story canon: `docs/ACT3_STORY_MANIFEST.md` + `docs/ACT3_DIALOG_CANON_RESOLUTION.md`. Engine canon: `docs/RUNTIME_ARCHITECTURE_1_1.md`, `docs/STATE_OWNERSHIP.md` och `docs/TECHNICAL_HANDOFF.md`.

**Språkbruk:** `LÅST` betyder uttryckligt produktbeslut sparat i GitHub, **inte** att kod är byggd, tester gröna eller bilder uppladdade. Beskriv aldrig något som implementerat utan kod- och testverifiering. För nya beslut gäller: diskuterat i chat ≠ dokumenterat; skriv och läs tillbaka från repo innan ordet `spikat` används.

## 1. Stadskartan och platsnavigation — LÅST

- Akt 3 har **ingen styrbar, fritt utforskbar karta** som Akt 1/2. Den har en **statisk illustrerad stadskarta med klickbara platsikoner**.
- **Progressivt avslöjande LÅST 2026-10-11:** De fem ikonerna är **hela kartans möjliga platser**, inte de fem som visas vid start. **En plats som berättelsen ännu inte har lett spelaren till är helt osynlig, inte grå, låst, frågetecken-markerad eller klickbar**. Ikonen dyker upp först i takt med en explicit storyintroduktion/resa dit; enbart att platsen nämns i dialog räcker inte. Upptäckta permanenta platser behålls synliga vid återbesök och efter omstart. Exakt trigger-beat för varje plats bestäms i innehållskonfigurationen.
- Ett klick på en plats startar **dess nästa tillgängliga Story-beat direkt**. Inga extra helskärmsmiljöer, ingen gångavatar och inget separat scenrum mellan kartan och beatet.
- För att fortsätta sagan besöker spelaren den **aktiva platsen** (t.ex. hemma hos Nova för pågående Nova-uppdrag). Aktiv plats är synligt markerad, **även när nästa beat väntar på flera godkända quests**.
- Besökt men för tillfället inaktiv/färdig plats får ett **deadbeat**: en kort scen med bild/dialog som kan påminna om vad som redan gjorts eller hänvisa vidare till relevant aktiv plats. Detta är inte en ny quest eller progressionshändelse. Deadbeat ska inte konsumera kommande Story-beat.
- Under väntan på questprogression: **återanvänd Akt 2:s befintliga vänt-/progressionsbeteende**. Vid klick på den aktiva platsen visas en väntedialog med återstående framsteg, inte ett nytt kapitel-/byggsystem.
- Från hamnen klickar barnet på **motorbåten** för att gå tillbaka till Akt 2:s befintliga spelkarta. Sjöområdet och via det byn i Akt 1 ska fortsatt kunna besökas. Akt 2-kartan ska inte ersättas med statiska Akt 3-platser.
- Kartmarkörer styrs av **berättelsens tillgänglighet och väntestatus**, inte av vilka butiksköp som saknas. Inga separata kartbutiker för Linus, Sol eller Henning.
- Om en plats saknar nytt beat väljs lämpligt deadbeat; hur varierade deadbeats ska vara och bildåteranvändning kan preciseras senare utan att ändra navigationsmodellen.

## 1A. Fem stadsplatser och returhamn — LÅST 2026-10-11

Användarens låsta modell är **fem kartikoner**, inte en ikon för varje miljö eller beat:

1. **Folkparken:** park-, Henrik-, minigolf-, shuffleboard-, förberedelse-, drama- och FAMILY-beats.
2. **Novas mamma / hemma hos Nova:** HOME och besök/samtal vid mammans lägenhet.
3. **Spelbutiken → Arkaden:** **en och samma platsikon**. Första besöket CITY-001–003 är den vanliga retrospelbutiken, utan arkadspoiler. Först när ARCADE-001 inträffar efter DRAMA-010 får ikonen heta Arkaden och Rebecka/NOV/REB visas. Epilogens arkad återanvänder platsen.
4. **Hamnen:** klick på **motorbåten** är returväg till verkliga **Akt 2** och därifrån **Akt 1**. Hamnen ska finnas tillgänglig även i questväntan. Vanlig returtransport låser **inte upp, förbrukar eller hoppar över** BOAT-beats; dessa ligger fortfarande i den låsta sekvensen med **1 godkänt quest per beat**.
5. **Skattjakten:** **en enda tillfällig ikon endast under HUNT-001–006**, försvinner efter HUNT-006. Torget, klockan, biblioteket, utsikten och glassstället är **inte** egna kartikoner. Varje HUNT-beat kräver fortsatt 1 separat quest.

Gamla/färdiga platser får deadbeat enligt ordinarie Runtime 1.1; oupptäckta platser syns inte. Inga fler stadsikoner för pappans hem, gamla villan, torget, matinköp, Linus, Sol, Henning eller Mira. Miras köp sker i hennes **befintliga butik i Akt 1**, nåbar via hamnen och tidigare världar.

**Fortfarande öppet:** exakt första kartvisning, ikonernas pixelpositioner och detaljerad per-beat triggrouting, temporära rese-/resumeflöden när BOAT-001–005 spelas. **Fem platser och hamnens returroll är däremot låsta.**

**Synlighetskontrakt (för femplatsskartan):** **Hamnen** är känd från ankomsten; **Folkparken** visas först när Nova leder dit; **Spelbutiken** när storyn för första gången leder dit (byter till **Arkaden** först vid den senare arkad-avslöjningen efter DRAMA-010); **Novas mammas hem** först vid inbjudan/vägen dit; **Skattjakten** endast medan HUNT-001–006 är pågående. **Inget annat visas för tidigt.** Den exakta tekniska triggern per beat är ännu öppen. För upptäckta permanentplatser kvarstår ikonen efteråt, och aktiva platser markeras särskilt.

### Speltext: Barnet skrivs som ”du” (LÅST 2026-10-13)

**I spelade beattexter tilltalas spelarkaraktären i andra person.** Kanonmanuset använder ofta `Barnet` för huvudkaraktären, men spelaren ska se `du` i löpande berättartext och `Du` som talarnamn. Exempel: `Barnet kastar repet.` → `Du kastar repet.`; `**Barnet:** Vi kan lägga till där borta.` → talaretiketten `Du` och oförändrad replik `Vi kan lägga till där borta.`. Svensk ordföljd och böjning ska vara grammatisk, inte mekanisk strängersättning.

Detta är en **presentationsregel i runtime/export**, inte en omskrivning av originaldialog. Bevara `Barnet` som kanonisk karaktärsidentitet och som internt ID, behåll de godkända manusen och innehållsregistrets digest oförändrade. Inget oavsiktligt byte av talare eller påverkan på Akt 1/2. Kolla med automatiska testfall att både scenanvisningar och talaretiketter återges som `du`/`Du` i OPEN-001–005 och PARK-001. För långsiktig Act 3-runtime gäller samma regel på senare beats.

## 2. Story och questprogression — LÅST

- Använd **gemensam Runtime 1.1 Story Engine, chapter host, chapter persistence, backend host och progression/project engine**. Ingen ny Act 3-kopia av dialogmotor, questtransport eller sparsystem.
- **QUEST-PACING LÅST 2026-10-11 (senaste beslutet, ersätter äldre storysegmentmodell):** **A3-OPEN-000–005 + A3-PARK-001 är gratis. Från A3-PARK-002 genom A3-SECRET-006 kräver varje individuellt beat-ID exakt ett nytt föräldragodkänt/claimat IRL-quest.** Ingen gruppering av flera beats på samma godkända quest. Dialog, bild/val och minispel inuti ett redan upplåst beat avslutas utan extra IRL-krav. Exempel: PARK-009 inkluderar minigolf, och PARK-010 kräver därefter nästa godkända quest.
- Questframsteg ska hämtas från **samma backend-auktoritativa godkända/claimade progression som Akt 2**. En redan konsumerad händelse får inte ge dubbla steg; flera claimade quests får inte hoppa över en väntande storyscen. Sparning/återstart får inte återspela konsumerade beats.
- Framsteg kan fortsätta över flera dagar; att återvända till aktiv plats under väntan visar aktuell status och låter spelaren fortsätta när grinden är uppfylld.
- **Undantag från 1:1-questloopen:** När festen väl startar ska **FAMILY-001–021** spelas utan nya IRL-questkrav; därefter krävs **ett** nytt godkänt quest för att öppna **EPILOG-001–006**, som därefter spelas sammanhängande utan fler questkrav. Spelaren kan fortfarande delta i manusets spel och val, men inte tvingas till verkliga sysslor mitt i finalen.
- **Antalet följer automatiskt beat-ID:n:** nuvarande manusinventering har **140** identifierade beats (138 i dialogindex plus separat godkända VILLAGE-009). **7 fria introbeats** (OPEN-000–005 + PARK-001), **106 individuella questlåsta beats** (PARK-002–SECRET-006 i godkänd ordning) och **21 questfria FAMILY-beats och 6 epilogbeats bakom en gemensam questgrind** (FAMILY-001–021, EPILOG-001–006). Detta kräver 107 godkända/inlämnade questinstanser totalt (106 individuella + 1 för epilogen) **men inte 106 olika sysslor**; upprepade uppdrag kan räknas via befintlig Quest V2. Vid ändrat manusantal räknas antalet om. Beat→kartplats-/triggerkoppling och priser är fortfarande öppna.

## 3. Miras inköpslista och SysselBux — LÅST

- **Alla obligatoriska föremål köps hos Mira i det befintliga butikssystemet**, inte hos Linus, Sol eller Henning. Deras roller är praktisk hjälp med ljus, musik, mat etc., inte försäljning.
- Först **när berättelsen presenterar inköpslistan** låses respektive Act 3-varor hos Mira upp för köp.
- En **egen åtkomstknapp i Akt 3** låter barnet öppna inköpslistan och se vilka föremål som köpts respektive saknas. UI-detaljer återstår.
- Föreslagna föremål: **stolar, lampor, högtalare och glass**. Det är *kandidater*, inte slutligt fast sortiment. Priser, slutligt sortiment och exakt UI bestäms senare.
- Barnet har **nästan hela Akt 3** på sig att handla och kan köpa varorna i **valfri ordning** när de är upplåsta. **Inköpslistan blockerar inte mellanliggande storybeats.**
- **Enda obligatoriska inköpsgrinden ligger inför sista förberedelsequestet/att starta festen.** Vid grinden verifieras att alla *slutligt definierade obligatoriska* inköp är gjorda. Är inköpen ofullständiga spelas en enkel väntedialog och barnet återgår till kartan, utan extra quests, nya minispel eller andra speciallösningar:
  
  > **Nova:** Vi måste få klart inköpen innan vi kan starta festen!
  
  När varorna är inköpta kan barnet fortsätta direkt från samma berättelsepunkt, utan att behöva göra om tidigare beats.
- Skillnaden mellan **ägd vara** och **berättelsens praktiska förberedelse** får modelleras med befintlig Story Purchase/progression utan att låsa varje förberedelsebeat bakom ett separat köp.
- **Ekonomi- och ägandesanning stannar i nuvarande auktoritativa system** enligt `STATE_OWNERSHIP.md`; ingen extra Act 3-plånbok, klientsidig tilldelning eller lokal återköpslogik.

## 4. Minispel — MINIGOLF BEKRÄFTAT, IMPLEMENTATION EJ VALD

- **Manusordning (LÅST):** **minigolf först i A3-PARK-009**; shuffleboard introduceras senare i **A3-PARK-019**, spelas första gången i **A3-PARK-020** och återkommer under **A3-FAMILY-006**. Förväxla aldrig den kronologiska berättelseordningen med vilken mekanik som prototypas tekniskt först.
- **MINIGOLF GODKÄNT SOM SPELINS LAG:** Användaren provade en fristående webbaserad minigolf-PoC den 2026-10-11 och bekräftade att minigolf fungerar som minispel i SysselCraft. **PoC-koden, grafiken, banorna och exakta kontrollerna är inte låsta** och behöver inte återanvändas.
- **Verifierat designgrepp i PoC:** sikta genom att klicka/toucha banan, hålla inne en **Force-knapp** för slagstyrka och släppa för att skjuta; bollens rullning/friktion fungerade tillräckligt bra för att godkänna *speltypen*. Detta är PoC-feedback, inte en implementerad gameplay-feature i spelet.
- **Teknisk ordning:** minigolf har alltså redan haft sin första spelkänsle-PoC. Fortsätt med en integrerbar minigolfmotor eller jämför alternativ när arbetet når PARK-009; shuffleboard är fortfarande ett senare separat minispel i PARK-020 och FAMILY-006.
- Använd resultaten från den fristående PoC:n som referens; mät kostnad, mobilkänsla och återanvändbarhet innan en *produktionsimplementation* väljs.
- Minispel får inte skapa en fristående parallell game-/save-motor. Eventuell gemensam funktionalitet ska ligga i återanvändbar engine-del.
- Exakta spelregler, antal produktionsbanor, UI, slagräkning, replay, hur minigolfen blir klar och kopplingen till PARK-010 är ännu inte låsta. Förändra inte godkända dialoger oavsiktligt (PARK-010 säger t.ex. att Nova vann med ett slag) och låt aldrig spelresultat styra Novas känslomässiga arc.

## 5. Genomförande i små verifierbara etapper — PLAN, EJ BESTÄLLD IMPLEMENTATION

1. **Kartnavigation/spelkedja:** Chapter intro → statisk karta → hamn/park → storybeat → tillbaka till karta; låst/nyupptäckt plats och Act 2-motorbåtsretur.
2. **Beat- och deadbeat-routing:** plats-ID, uppsättning aktiva beats, återbesök, väntedialog, debughoppa till beat; återanvänd shared Story.
3. **Questkoppling:** visa exakt 1 questgrind mellan varje individuellt beat-ID från PARK-002 till SECRET-006, med test av restart mitt i beat, dubbel-claim, backend authority och säker resa till Akt 1/2 utan skip.
4. **Mira + inköpslista:** storyupplåsning av katalog, återanvänd Story Purchase, ägandestatus, listknapp och EN sista inköpsgrind.
5. **Folkparksminispel:** minigolf är godkänt efter fristående PoC för PARK-009; välj och verifiera produktionsimplementation senare. Shuffleboard följer i PARK-020/FAMILY-006.
6. **Resten av manuset/FINAL:** kanoniska beat-ID:n, godkända bildpaths, låst story före/efter minispel, FAMILY/EPILOG utan IRL-grind.
7. **Acceptance:** automatiserade regressionsprov och fysisk iPhone med bevarad save. Ingen onödig Vercel-deploy eller Actions-budgetbränning.

## 6. Acceptance som ska finnas innan något kallas klart

- Oupptäckt plats syns inte; upptäckt plats syns; aktiv plats tydlig. Klick öppnar beat direkt, inte extra scenrum.
- På aktiv plats i questväntan visas korrekt återstående framsteg; 1, många eller inga backend-claims får inte duplicera/hoppa över beats; restart återupptar deterministiskt.
- Besökt färdig plats öppnar deadbeat utan att påverka progress.
- Motorbåt från hamn tar tillbaka till befintlig Akt 2-karta utan att förstöra Act 1/2-save eller Act 3-återupptagning.
- Innan listan introducerats är Act 3-varor inte tillgängliga. Efter introduktion kan köp ske i valfri ordning hos **Mira**. Ägandestatus överlever restart och följer kanonisk butik/wallet.
- Storyn fortsätter trots ofullständig lista tills **enda slutgrinden** nås. Där visas exakt väntedialog; när sista köp görs återupptas finalen utan att upprepa tidigare quests.
- FAMILY-001–021 introducerar inte extra verkliga uppdragsgrindar och tappar aldrig dialogposition vid återstart. **Ett separat föräldragodkänt quest efter FAMILY-021** låser upp hela EPILOG-001–006, utan fler quests däremellan.

## 7. Öppna designfrågor — INTE SPIKADE

- Exakt stadskartegrafik/platser och vilket beat som först introducerar var och en.
- Hur hemresa tillbaka till Akt 3 från befintlig Akt 2-värld exponeras i runtime; ska vara smidig men får inte radera existerande navigation.
- Om flera storyplatser får vara samtidigt aktiva, och prioritet när så sker. **Blanda inte ihop parallella inköp med parallella aktiva platser.**
- **Questantalet är nu känt från godkända beat-ID:n:** 106 questupplåsningar mellan PARK-002 och SECRET-006 i nuvarande manus, 1 godkänt quest/beat. Öppet är **kartplats, återstart och väntestatus** vid respektive beat samt hur upprepade verkliga quests placeras i vuxenflödet, inte grundantalet.
- Slutligt inköpssortiment och priser.
- Deadbeatvarianter och vilka accepterade illustrationer som kan återanvändas.
- Minigolfens och shuffleboards konkreta regler, återspelning och slutlig implementation. **Att ha minigolf i spelet är beslutat**, men PoC:n får ersättas. Storyordningen PARK-009 → PARK-020 → FAMILY-006 är redan låst.

## Nuvarande kodstatus vid detta beslut

`src/game/act3RuntimeState.ts` har vid planeringstillfället endast `{ version: 1, entered: boolean }` och använder delad `createChapterPersistenceHost`. Det första kapitelkortet finns; **stadskarta, platsrouting, shoppinglista, deadbeats, minispel och Act 3-questgrindar är ännu inte byggda**. Separata commits/tester krävs innan någon av dessa delar får märkas DONE.

## Tillfällig release-spärr och telefon-test — 2026-10-11

**Kodstatus: koden är inlagd i GitHub; automatisk fullverifiering och fysisk iPhone-acceptans återstår.**

- Akt 2:s ordinarie `Till kapitel 3`-knapp är ersatt med statisk text: **Kapitel 3 kommer snart**.
- En direkt öppning av `/act3` är också spärrad. Det är inte tillräckligt att bara gömma menylänken.
- I **Vuxenläge** finns en knapp märkt exakt **X**. Den visar ett lösenordsfält. Den hårdkodade utvecklingskoden är **`nova3`** och är endast ett spoilerskydd för barnet, **inte en säkerhetsfunktion**.
- Efter korrekt lösenord skapas en **engångsbiljett i WebView-flikens `sessionStorage`**. Navigering till `/act3` konsumerar den innan Act 3-save läses. För ny öppning, direktlänk eller sidomladdning krävs ny X-upplåsning. Testpasset som redan är öppet kan fortgå.
- Teståtkomst via X går även om **Akt 2 ännu inte är färdig**. Den normala kapitelgrinden återkommer **först efter uttryckligt releasebeslut**.
- Utvecklingsrouten `/act3-test` förblir dev-only och kan inte nås i produktion.
- Akt 1/2-save, wallet och backend-questprogression ändras inte av själva X-upplåsningen. Akt 3 använder fortsatt sin egen child-scoped sparning; testprogression kan därför kvarstå när vuxen öppnar X igen.
- Implementation: `src/game/act3PreviewAccess.ts`, `src/components/Act3PreviewLauncher.tsx`, `src/components/VillagePrototype.tsx`, `src/components/Act2Runtime.tsx`, `src/components/Act3Skeleton.tsx`.
- Regresstester: `scripts/test-act3-preview-gate.mjs` och ändrat `scripts/test-act3-empty-skeleton.mjs`; båda i `npm run verify`.
- **Återstår:** kör full verifiering från riktig checkout, testa fel/rätt kod och spärrad direktlänk på iPhone, testa appåterstart och bekräfta att befintliga Act 1/2-save-data lever kvar. **Inga verifierade fysiska testresultat ännu.**
- **Release-TODO:** ta bort X-bypass och återställ normalt kapitelkrav vid uttryckligt godkänd Akt 3-release.

**Låst komplettering 2026-10-12:** A3-FAMILY-021 (*Vi gjorde vad vi kunde*) är ett nytt, användargodkänt och manuslåst båtbeat i kvällsljus efter FAMILY-020 och före EPILOG-001 (som fortfarande inleds några dagar senare). Inget nytt IRL-quest. Håll rutt och återresa åtskilda från den ordinarie EPILOG-001-resan. Total nu **140 identifierade beats = 7 gratis intro + 106 questlåsta + 27 questfria FAMILY/EPILOG**.


### Beslut 2026-10-12: Epilogen har EN gemensam questgrind (ersätter tidigare questfri epilog)

- **A3-FAMILY-001–021:** spelas utan ytterligare quests efter befintlig finale-/inköpsgrind.
- **Mellan FAMILY-021 och EPILOG-001:** barnet måste göra **ett nytt, föräldragodkänt IRL-quest** för att låsa upp epilogen. Det är en separat inlämning och inte återanvändning av den sista questen före familjedagen.
- **A3-EPILOG-001–006:** efter upplåsning spelas alla sex beats i ett enda sammanhängande svep utan ytterligare quests. Normal sparning/återupptagning ska fortfarande fungera.
- **Totalen är 107 godkända questinlämningar**: 106 tidigare för PARK-002–SECRET-006 + 1 epiloggrind. Fortfarande **140 beats** totalt, av vilka 106 har individuell questgrind, 6 delar en gemensam questgrind, 21 FAMILY och 7 intro är questfria. Ingen ny story-beat tillkommer.


## LÅST UX-BESLUT 2026-10-12 — Läs FAMILY tillsammans med en vuxen

**Trigger:** när Akt 3:s sista förberedelse-/inköpsgrind är klar och **före A3-FAMILY-001**. Visas en gång på barnets skärm, och **mottagaranpassad föräldrainformation** ska samtidigt vara tillgänglig i kopplat föräldraläge för detta barn. Ingen storyspoiler i meddelandet. Föräldern ska kunna läsa det även om hen öppnar vuxenläget senare (persisted unread/inbox/notice, inte en flyktig toast). Om en push-notis till förälderns enhet stöds i framtiden ska den peka på samma information; designbeslutet innebär **inte** att pushinfrastruktur finns idag.

**Separata mottagaranpassade meddelanden (ersätter tidigare krav på identisk text):**

**Barnskärmen, spoilerfri:**

> **Nu börjar berättelsens avslutning!**
>
> Det som händer nu kan väcka lite stora tankar och känslor.
>
> Vi rekommenderar att du spelar den här delen tillsammans med en vuxen. Då kan ni prata om det som händer, om ni vill.
>
> Du behöver inte göra fler sysslor under den här delen av berättelsen.

**Föräldraläget, innehållsinformation:**

> **Spela gärna nästa kapitel tillsammans! ❤️**
>
> Ditt barn är på väg in i en lite längre del av SysselCrafts berättelse som handlar om vänskap, skilsmässa, skuld och besvikelse.
>
> Nova hoppas kunna få sina föräldrar att bli tillsammans igen och behöver så småningom förstå att deras separation inte är hennes fel.
>
> Vi rekommenderar att du spelar den här delen tillsammans med ditt barn. Berättelsen tar upp känsliga ämnen på ett varsamt sätt och kan ge fina tillfällen att prata om familjer, känslor och sådant vi inte alltid kan förändra.
>
> Ni behöver inte läsa allt på en gång. Det går bra att pausa och fortsätta senare.

**Barnets knappar:** ”Spela tillsammans” och ”Fortsätt själv”. Inget krav på vuxengodkännande och inget tvång att ha en vuxen närvarande. Knapparna går vidare till FAMILY-001, inte till separata manusvarianter. FAMILY-001–021 kan pausas och återupptas från exakt senaste beat/linje. Föräldraläget visar motsvarande informationskort, ingen ny quest eller grind. Meddelandet gäller bara FAMILY-kedjan; **en separat** föräldragodkänd quest krävs senare för att trigga EPILOG-001–006 som spelas i ett svep.

**Implementationsstatus:** detta är dokumenterat produkt-/UX-beslut, **inte** verifierad leverans i app eller faktisk telefon-push. Använd separata kanoniska textkonstanter i implementationen, en för barn och en förälder. Koppla parent notice till aktuellt barn/save och säkerställ idempotens.
