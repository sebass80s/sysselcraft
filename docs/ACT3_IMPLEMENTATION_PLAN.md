# Akt 3 — Implementationsbeslut och plan


**Kronologisk helhetskarta (huvudordningen nu LÅST 2026-10-11):** `docs/ACT3_GAMEFLOW_MAP_DRAFT_2026-10-11.md` beskriver hela OPEN→EPILOG. **Användaren har godkänt de stora blockens ordning**, inklusive första stadsdagen → första hemresan utan Nova → skattjakten → 2011-upptäckten → dramat/arkaden → Novas första bybesök → förberedelserna → familjedagen → epilogen. **Platsupplåsningar, detaljerade triggers och IRL-questgrindar är fortfarande DRAFT**, inte nya låsta implementationer.

**Status:** PRODUKTBESLUT LÅSTA 2026-10-11. X-porten ligger i kod; övrig stadskarta, berättelse och minispel ÄNNU INTE IMPLEMENTERADE.  
**Repo/branch:** `sebass80s/sysselcraft` / `nova/runtime-architecture-v1`  
**Källor:** Användarens uttryckliga beslut i implementationsdiskussion 2026-10-11. Story canon: `docs/ACT3_STORY_MANIFEST.md` + `docs/ACT3_DIALOG_CANON_RESOLUTION.md`. Engine canon: `docs/RUNTIME_ARCHITECTURE_1_1.md`, `docs/STATE_OWNERSHIP.md` och `docs/TECHNICAL_HANDOFF.md`.

**Språkbruk:** `LÅST` betyder uttryckligt produktbeslut sparat i GitHub, **inte** att kod är byggd, tester gröna eller bilder uppladdade. Beskriv aldrig något som implementerat utan kod- och testverifiering. För nya beslut gäller: diskuterat i chat ≠ dokumenterat; skriv och läs tillbaka från repo innan ordet `spikat` används.

## 1. Stadskartan och platsnavigation — LÅST

- Akt 3 har **ingen styrbar, fritt utforskbar karta** som Akt 1/2. Den har en **statisk illustrerad stadskarta med klickbara platsikoner**.
- **Platser som ännu inte introducerats/besökts genom berättelsen syns inte på kartan**. När platsen blir känd dyker dess ikon upp. Exakt upplåsningsbeat per plats fastställs i innehållskonfigurationen.
- Ett klick på en plats startar **dess nästa tillgängliga Story-beat direkt**. Inga extra helskärmsmiljöer, ingen gångavatar och inget separat scenrum mellan kartan och beatet.
- För att fortsätta sagan besöker spelaren den **aktiva platsen** (t.ex. hemma hos Nova för pågående Nova-uppdrag). Aktiv plats är synligt markerad, **även när nästa beat väntar på flera godkända quests**.
- Besökt men för tillfället inaktiv/färdig plats får ett **deadbeat**: en kort scen med bild/dialog som kan påminna om vad som redan gjorts eller hänvisa vidare till relevant aktiv plats. Detta är inte en ny quest eller progressionshändelse. Deadbeat ska inte konsumera kommande Story-beat.
- Under väntan på questprogression: **återanvänd Akt 2:s befintliga vänt-/progressionsbeteende**. Vid klick på den aktiva platsen visas en väntedialog med återstående framsteg, inte ett nytt kapitel-/byggsystem.
- Från hamnen klickar barnet på **motorbåten** för att gå tillbaka till Akt 2:s befintliga spelkarta. Sjöområdet och via det byn i Akt 1 ska fortsatt kunna besökas. Akt 2-kartan ska inte ersättas med statiska Akt 3-platser.
- Kartmarkörer styrs av **berättelsens tillgänglighet och väntestatus**, inte av vilka butiksköp som saknas. Inga separata kartbutiker för Linus, Sol eller Henning.
- Om en plats saknar nytt beat väljs lämpligt deadbeat; hur varierade deadbeats ska vara och bildåteranvändning kan preciseras senare utan att ändra navigationsmodellen.

## 2. Story och questprogression — LÅST

- Använd **gemensam Runtime 1.1 Story Engine, chapter host, chapter persistence, backend host och progression/project engine**. Ingen ny Act 3-kopia av dialogmotor, questtransport eller sparsystem.
- Berättelsebeats kan spelas **direkt efter varandra** utan IRL-quest emellan. Bara uttryckligen definierade **progressionsgrindar** väntar på godkända/claimade IRL-quests eller andra specificerade villkor.
- Questframsteg ska hämtas från **samma backend-auktoritativa godkända/claimade progression som Akt 2**. En redan konsumerad händelse får inte ge dubbla steg; flera claimade quests får inte hoppa över en väntande storyscen. Sparning/återstart får inte återspela konsumerade beats.
- Framsteg kan fortsätta över flera dagar; att återvända till aktiv plats under väntan visar aktuell status och låter spelaren fortsätta när grinden är uppfylld.
- **Familjedagen och den efterföljande FAMILY/EPILOG-storysekvensen ska gå att spela sammanhängande utan nya IRL-questkrav.** Spelets egna frivilliga aktiviteter/minispel inom manusets beats är ett annat slags interaktion och får inte bli krav på nya verkliga sysslor mitt i dramat.
- Antal quests per grind, när grindar infaller och exakt koppling beat→plats ska **bestämmas senare** från godkänt manus och pacing. Inga siffror eller exakta priser är beslutade här.

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
3. **Questkoppling:** en faktisk IRL-progressionsgrind, restart mitt i beat, idempotens och backend authority.
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
- FAMILY/EPILOG introducerar inte nya verkliga uppdragsgrindar och tappar aldrig dialogposition vid återstart.

## 7. Öppna designfrågor — INTE SPIKADE

- Exakt stadskartegrafik/platser och vilket beat som först introducerar var och en.
- Hur hemresa tillbaka till Akt 3 från befintlig Akt 2-värld exponeras i runtime; ska vara smidig men får inte radera existerande navigation.
- Om flera storyplatser får vara samtidigt aktiva, och prioritet när så sker. **Blanda inte ihop parallella inköp med parallella aktiva platser.**
- Exakt questantal och fördelning över storyns förberedelser.
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
