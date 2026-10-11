# Akt 3 – Kronologisk gameplay-/kartflödeskarta

**Status 2026-10-11: HELA HUVUDORDNINGEN OCH EXAKT 1 QUEST PER BEAT FRÅN PARK-002 TILL SECRET-006 GODKÄNDA. Kart-/UX-detaljer är arbetsutkast.**
**Implementation:** Endast befintligt Act 3 chapter intro-skelett och temporär Vuxenläge → X-testport är kodade; allt story-/kart-/minispelsflöde nedan är ännu design.  
**Källor:** `docs/ACT3_STORY_MANIFEST.md`, `docs/ACT3_DIALOG_CANON_RESOLUTION.md`, godkända CITY-dialoger `docs/ACT3_CITY_001_003_GODKAND_2026-10-10.md`, `docs/ACT3_IMPLEMENTATION_PLAN.md`.  
**Regel:** Godkänd manusdialog ska inte skrivas om av en spelplansskiss. Senare godkända ändringar vinner över äldre synopsis/PDF. Följ inga inofficiella plats-/questplaner som om de vore kanon.

## Senaste godkända questkontrakt: exakt ett quest per beat (LÅST 2026-10-11)

- **GRATIS:** `A3-OPEN-000–005` samt **`A3-PARK-001`**.
- **EXAKT 1:1:** Från **`A3-PARK-002`** till och med **`A3-SECRET-006`**: **ett nytt godkänt och inlämnat IRL-quest ger ett, och endast ett, nytt beat-ID** i kronologisk ordning. Detta ersätter alla äldre förslag om ”storydelar” med flera beat-ID:n eller längre questfria mellanpartier. Ett beat kan innehålla dialog, bilder, spelval och ett minispel utan extra quest under samma beat. **PARK-009** innehåller minigolf; **PARK-010** kräver ett nytt quest.
- **FINALE:** Efter sista story-/förberedelsequestet och den redan beslutade enda inköpsgrinden hos Mira spelas **`A3-FAMILY-001–021` utan quests; därefter ETT godkänt IRL-quest som startar `A3-EPILOG-001–006` sammanhängande**. Inget extra quest för att kontrollera inköpslistan; det 107:e questet är en separat, senare epiloggrind.
- **RÄKNING:** Dialoginventeringen har 138 unika beat-ID:n och saknar separat godkända `VILLAGE-009`. Tillsammans blir det **140**: 7 gratis startbeats + **106 questlåsta beats** + 21 questfria FAMILY-beats + 6 epilogbeats bakom en gemensam questgrind. **106 godkända inlämningar betyder inte 106 unika sysslor**. Upprepade föräldragodkända sysslor kan fortsätta ge progress via befintliga Quest V2/Runtime 1.1-regler. Ändras manusets beatantal, ändras siffran.
- **INGEN DUBBELFÖRBRUKNING:** en claim får inte släppa flera beats och flera ackumulerade claims får inte hoppa över osedda beats. Spara progression och aktuell scen över resor mellan kapitel/omstart.
- **FORTFARANDE ÖPPET:** exakt första kartvisning, ikonplacering/upplåsningsbeat, deadbeat-repliker, replay-val, köp/priser och hur man visar väntan/återupptar båtresor. **LÅST:** fem stadsikoner enligt 1A, PARK-001 gratis, 1 quest per beat till SECRET-006.

## Godkänt: hela aktens huvudordning (LOCKED 2026-10-11)

Användaren godkände uttryckligen att denna övergripande ordning ”känns rätt”. Det låser **ordningen mellan stora manusblock**. Även exakta 1:1-grindar per beat är nu låsta enligt översta avsnittet; kartdetaljer återstår.

1. **OPEN-000–005**: ankomst till hamnen, möte med Nova och väg till folkparken.
2. **PARK-001–010**: parken, Henrik, familjedagsidén och första **minigolfen PARK-009**.
3. **CITY-001–003 → HOME-001–008**: första besöket i retrobutiken (ingen arkad ännu), Novas mamma, två hem, skattkistan och familjehistorien.
4. **BOAT-001–005 → VILLAGE-001–003**: Barnet och Alve reser till byn **utan Nova** och besöker Mira.
5. **HUNT-001–006**: Novas skattjakt genom staden.
6. **PARK-011–022**: fortsatt planering, upptäckt av poängtavlan från 2011 och senare **shuffleboard PARK-020**.
7. **DRAMA-001–010**: pappasamtalet, konflikt och vänskapens försoning.
8. **ARCADE-001–006**: hemliga arkaden hos Rebecka, **först efter DRAMA-010**.
9. **DRAMA-011–015**: båda föräldrarna säger ja och Novas nya optimism.
10. **VILLAGE-004–026, inklusive VILLAGE-009 mellan 008 och 010**: Nova följer med över sjön; stugan, Mira, Henning, Linus och Sol.
11. **PREP-001–006 → REVEAL-001–004 → SECRET-001–006**: festen tar form, den djupare hemliga planen och sista förberedelserna. Miras inköp pågår **parallellt nästan hela akten**.
12. **Enda obligatoriska inköpsgrinden** inför sista förberedelsequestet/att starta festen; saknade varor ger Novas redan låsta väntedialog.
13. **FAMILY-001–021**: lyckad familjedag, sanningen om Novas skuldkänslor och det nya familjefotot; **inga IRL-questkrav mitt i finalen**.
14. **EPILOG-001–006**: några dagar senare, spelhallen och båten, **SLUT PÅ TREDJE KAPITLET** utan tidigare struken Act 4-krok.

**Fortfarande öppet:** kartlayout och exakt upplåsningstid, köppriser, deadbeat-dialoger, spelregler och beat-resume. **LÅST:** fem kartplatser enligt 1A samt ett quest per beat från PARK-002 till SECRET-006.

## 0. Grundidé som redan är beslutad

- Akt 3-staden: **statisk illustrerad karta med klickbara platsikoner**, ej free-roam. Oupptäckta platser är helt dolda; story-aktiv plats är markerad. Klick öppnar dess nästa Story-beat DIREKT (inget extra miljörum).
- Följande plats saknas aktivt beat? **Deadbeat** som inte konsumerar/ger framsteg. Questväntan återanvänder Runtime 1.1/Act 2:s befintliga backend-auktoritativa progressionsmotor och visar återstående status.
- Hamnens **motorbåt återvänder till den befintliga traverserbara Akt 2-världen**, och därifrån går det till Akt 1-byn. Akt 1/2 får inte ersättas med statiska karta-fiktioner. Normal återresa till staden ska fortsätta fungera; exakt UI där återstår.
- **SENASTE BESLUT:** OPEN-000–005 och PARK-001 är gratis. Därefter exakt ett godkänt quest per individuellt beat från PARK-002 till SECRET-006. Ingen sammanslagning av flera beats till ett storysegment. FAMILY/EPILOG är questfria efter finalgrinden. Se översta avsnittet.
- **Alla festinköp hos Mira** via SysselBux och befintlig Story Purchase-ekonomi. Varor köps successivt i valfri ordning när listan introducerats. Butikslista med ägt/saknas; en **enda obligatorisk inköpsgrind nära allra sista förberedelsequestet/innan festen**.
- Saknade inköp där → vanlig dialog: **Nova: ”Vi måste få klart inköpen innan vi kan starta festen!”** → tillbaka till kartan. Ingen extra quest för detta, och inga intermediate purchase gates.
- Minigolf är **godkänt som speltyp** efter HTML-PoC 2026-10-11; *inte PoC-koden* som slutlig implementation. Ordning: minigolf PARK-009, shuffleboard PARK-020 och FAMILY-006.
- Förberedelsespår Henning (mat), Linus (ljus), Mira (möbler & inköp), Sol (musik) bidrar till **EN gemensam familjedag**, inte separata byggspel.

## 1. Hela spelkedjan – föreslagen kronologi

**Legend:** A = inne i ett upplåst beat löper dess dialog/spel sammanhängande; K = kart-/platsval; **Q = 1 nytt godkänt quest per beat-ID från PARK-002 till SECRET-006**; MG = minispel inuti ett beat, ingen extra grind; SHOP = inköp parallellt; F = FAMILY/EPILOG utan quests.

| # | Beat-ID och innehåll | Storyplats / trigger | Kontroll / förslag |
| --- | --- | --- | --- |
| 01 | **OPEN-000–004:** kapitelkort, ankomst, möte med Nova, motorbåten, gamla folkparken | Hamnen; vid första Akt 3-test- eller framtida legitima kapitelstarten | **GRATIS**, intro. |
| 02 | **OPEN-005 → PARK-001:** promenad mot folkparken och parkens entré | Folkparken | **GRATIS:** OPEN-005 och PARK-001. Första questet låser PARK-002. Första kartvisningen är ännu förslag. |
| 03 | **PARK-002–008:** bana 7, gamla scenen, stranden, festidé, Henrik, tillstånd och lista | Folkparken (intern rundtur i beatbilder) | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 04 | **PARK-009 → PARK-010:** minigolf, Novas första formulering av familjedagen | Folkparken | **Q/MG:** 1 quest till PARK-009 inklusive minigolf. Nästa godkända quest låser separat PARK-010. |
| 05 | **CITY-001–003:** den ljusa retrospelbutiken och vägen hem | Retrospelbutiken (staden) | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 06 | **HOME-001–008:** Novas mamma, Mira-kopplingen, hemliga festidén, gamla villan, minnena, skattkistan, tvåhemsschemat | Novas hem hos mamman | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 07 | **BOAT-001–005:** Barnet + Alve åker hem utan Nova, Alves parallell till stugan, ny vänskap, stor festplan | Från stadens hamn via sjön till Akt 2 | **Q/K:** BOAT-001–005 kräver 5 quests, ett per beat. Båtens scenposition/sparning mellan beats måste hanteras säkert. |
| 08 | **VILLAGE-001–003:** Mira får hälsning från Novas mamma, får veta om hemlig familjefest och ber om lista | Miras butik i byn (Akt 1) | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 09 | **HUNT-001–006:** Nova kallar över barnen, fontänen, busshållplatsklockan, biblioteket, utsikten och glass | Staden: torget → klockan → biblioteket → utsiktsplats → waterfront | **Q/K:** HUNT-001–006 kräver 6 quests, ett per beat; ledtrådslösning ingår i sitt beat utan extra quest. |
| 10 | **PARK-011–014:** Novas nya plan, bordplacering, kompromisser | Folkparken | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 11 | **PARK-015–018:** Henrik, gamla spelhörnan, val av aktiviteter, 2011 års poängtavla/första dejt | Folkparken | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 12 | **PARK-019–022:** det gamla shuffleboardbordet, första matchen med Nova, nya 2011-minnen, en revanschidé | Folkparken | **Q/MG:** PARK-019–022 kräver 4 quests, ett per beat; shuffleboard i PARK-020 ingår i just det beatet. |
| 13 | **DRAMA-001–005:** pappan ringer, Nova blir besviken, ilska, bråk och att hon lämnar parken | Folkparken | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 14 | **DRAMA-006–010:** Nova saknas, vid lägenheten, ursäkt och bekännelser som ännu inte avslöjar hela skuldkänslan, en dag utan planering | Novas mammas hem → stadens gator | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 15 | **ARCADE-001–006:** hemlig arkad, Rebecka/REB, NOV-rekordet, spelval och ny vänskapstradition | Retrospelbutiken, *dolt arkadrum nu avslöjat* | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 16 | **DRAMA-011–015:** båda föräldrarna säger ja till inbjudan, Nova jublande tillbaka, fotot från 2011 och planerna | Meddelande → torget → folkparken | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 17 | **VILLAGE-004–006:** Novas första båttur till sjösidan, Alves stuga och familjefotot | Stadshamnen → Akt 2-stugan | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 18 | **VILLAGE-007–010:** Nova ser byn, träffar Mira, går igenom Miras häfte och pratar med Henning | Akt 1-byn: torget → Miras butik → bageriet | **Q/SHOP:** VILLAGE-007–010 kräver 4 quests, inklusive separat godkända VILLAGE-009. Köp är parallella. |
| 19 | **VILLAGE-011–016:** Linus har ont i ryggen och försöker dölja det, Sol hjälper | Akt 1-byn: torget/förråd | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 20 | **VILLAGE-017–021:** Sols hemliga sångtalang, duetterna och Nova väljer låt | Akt 1-byn: Sols hus | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 21 | **VILLAGE-022–026:** en omväg till utsikten, samtal om att något kan bli annorlunda och ändå bra, sjövägen tillbaka | Akt 2-stranden / utsikten → motorbåt → staden | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 22 | **PREP-001–006:** synliga festförberedelser, saknade varor, det gamla fotot, Miras ljusslinga och pappans vita skjorta | Folkparken, kort Mirasamtal | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 23 | **REVEAL-001–004:** Nova berättar för kompisarna att hon hoppas att föräldrarna ska bli kära igen; ”Operation Första Dejten” | Folkparken | **Q:** Varje individuellt beat-ID i denna grupp kräver **ett separat godkänt IRL-quest**, inga gratis följdbeats. Spel/minnessekvens inom beatet ingår. |
| 24 | **SECRET-001–006:** frågar Mira om 2011-musiken, fotografi och album, hennes insikt, Sols överraskning och enskilt råd till Barnet | Miras butik i byn, övriga redan kända platser | **Q/SHOP:** SECRET-001–006 kräver 6 quests, ett per beat. SECRET-006 är sista questlåsta beatet. |
| 25 | **Sista förberedelsegrinden** | Aktiv plats: folkparken (förslag) | **ENDA KÖPGRINDEN:** kontroll av nödvändiga Mira-varor vid sista förberedelse-/festgrinden, **inget extra IRL-quest för kontrollen**. |
| 26 | **FAMILY-001–007:** platsen är klar, Henrik kommenderar, pappa och mamma anländer, minnen och shuffleboard-returmatch, gammalt fotografi | Folkparken | **F:** FAMILY-001–007 utan ytterligare IRL-quests, efter köpgrinden och sista före-final-questet. |
| 27 | **FAMILY-008–014:** lyckad dag, sista spelet, vanligt samtal om hemresa, Novas besvikelse, Mira låter Barnet finnas där, bänkscenen | Folkparken | **F:** FAMILY-008–014 utan ytterligare IRL-quests. |
| 28 | **FAMILY-015–020:** mamman kommer, Nova berättar om middagsutbrottet, båda föräldrarna tydliggör att det aldrig var hennes fel, nytt foto till två hem | Folkparken | **F:** FAMILY-015–021 utan ytterligare IRL-quests. **FAMILY-021** är ett nytt godkänt kvällsbeat i motorbåten på hemvägen, direkt efter 020 och före EPILOG-001. |
| 29 | **EPILOG-001–006:** några dagar senare, tillbaka till Rebeckas arkad, nytt spel, familjefotot finns i båda hemmen, bowlingplaner, vännerna skiljs åt vid båten | Hamnen → arkaden → hamnen | **F:** Ett nytt godkänt quest öppnar EPILOG-001, därefter EPILOG-001–006 i ett svep utan fler quest. |

### 1A. Stadskartans fem platser – LÅST 2026-10-11

**Exakt fem möjliga kartplatser totalt, men ALDRIG alla fem synliga från början.** Ikonerna ska **avslöjas successivt när berättelsen leder Barnet till respektive plats**. Okända platser syns inte ens som grå/låsta/frågeteckenikoner, och får inte kunna klickas. Ett namn som bara nämns i dialog avslöjar inte automatiskt ikonens position. Redan upptäckta permanenta platser fortsätter synas efter platsbyte och omstart, även när de inte är aktiva. Skattjaktsikonen är undantaget: den finns bara under aktiv HUNT-001–006 och försvinner därefter. Akt 1/2:s spelvärldar förblir utanför stadskartan.

| Plats / en och samma ikon | Storykoppling | Visning / funktion |
| --- | --- | --- |
| **Folkparken** 🌳 | OPEN-005/PARK-001–022; DRAMA i parken; PREP, REVEAL och FAMILY | Introduceras under OPEN-004–005. PARK-001 är gratis, från PARK-002 ett godkänt quest/beat. Här ryms bana sju, scenen, 2011-poängtavlan, spelhörnan, minigolf och shuffleboard **utan nya ikoner**. |
| **Hemma hos Novas mamma** 🏠 | HOME-001–008; senare DRAMA-beats vid lägenheten | Egen ikon när Novas mamma/hem introducerats i storyn (CITY-003:s inbjudan). Inte separat ikon för pappans lägenhet eller Novas gamla villa. |
| **Spelbutiken → Arkaden** 🎮 | Första CITY-001–003, senare ARCADE-001–006 och EPILOG | **Samma enda ikon med dynamiskt namn.** Första besöket visar endast en vanlig retrospelbutik. **Efter DRAMA-010** introduceras Rebeckas hemliga spelhall i ARCADE-001; först **då** får ikonen heta **Arkaden**. Aldrig Rebecka/NOV/REB/highscore eller hemlig arkad i första CITY-besöket. |
| **Hamnen** 🚤 | OPEN-intro; BOAT-001–005; resor mellan staden och tidigare kapitel; EPILOG | Motorbåt i hamnen är **returknapp till den riktiga Akt 2-kartan** (därifrån Akt 1). Den ska vara tillgänglig även vid väntan på nya IRL-quests. **Vanlig transport får inte konsumera/skip:a BOAT-beats**, som kräver ett separat godkänt quest per beat i ordinarie kronologi. Rutt-/sparpresentation under en storybåtsekvens löses tekniskt senare. |
| **Skattjakten** 🗺️ | HUNT-001–006 | **Endast aktiv under skattjakten.** En enda tillfällig kartikon för hela jakten, inte separata ikoner för torget, fontänen, busshållplatsens klocka, biblioteket, utsiktsplatsen eller glassstället. Varje HUNT-beat kräver fortfarande **ett godkänt quest**. När HUNT-006 är klart tas ikonen bort. |

**Ingen sjätte stadsikon** för torg, bibliotek, skola, den gamla villan, spelhörna, Miras butik, Henning, Linus eller Sol. Torget/stadsgatorna kan finnas i beatbilder och interaktioner utan egna permanenta pins. Bybor och bybutik besöks via **Hamnen → Akt 2 → Akt 1** och deras befintliga world-/storyinteraktioner. Världsbytet får aldrig nollställa story, quest, inköp eller pairing.

**Successiv kartupplåsning:** Hamnen är känd efter landstigningen; Folkparken blir synlig när Nova leder barnet dit; Spelbutiken avslöjas först när de kommer dit (hette **inte** Arkaden då); hemmet hos Novas mamma blir synligt vid inbjudan/besöket; Skattjakten visas endast så länge HUNT-sviten pågår. **Det är presentationens ordning som är låst, inte exakta beat-triggers eller pixelpositioner.** Den första kartvyn får inte läcka framtida platser.

**Redan låst globalt:** en aktiv Story-plats markeras tydligt, uppdragsväntan ger samma väntedialog som i Akt 2 och besök till känd inaktiv plats kan ge deadbeat utan progression.

**Ej ännu specificerat:** pixelpositioner/layout i stadsbilden, exakt ikon-appear-beat för alla fem, vilken ikon som markeras under rena sms-/transportbeats, detaljer kring tillfälliga hemresor mitt i BOAT-001–005 och exakt deadbeat-replik. Detta hindrar inte att **antalet platser och deras roller är låsta**.

**Förslag (fortfarande öppet):** visa första stadskartan efter OPEN-004. Då är Hamnen och Folkparken synliga; tryck på parken spelar gratis OPEN-005 och PARK-001. Första questgrinden ligger före PARK-002.

### 1B. Questloop – alltid ett IRL-quest per individuellt beat

Använd det **senaste låsta kontraktet överst i detta dokument**. Varje nytt godkänt/inlämnat quest kan låsa upp nästa **enskilda beat-ID** från PARK-002 till SECRET-006. Inget beat i denna del är gratis eller grupperas med ett annat beat under samma quest. Spelaren kan genomföra bild, dialog och minispel **inne i** ett redan upplåst beat utan extra quest. FAMILY/EPILOG kräver inga nya quests. Om antalet beat-ID:n ändras ska totalen (nu **106**) räknas om.

### 1C. Förberedelse-/inköpsmodell

**Samlat mål:** ”Gör folkparken redo för familjedagen”. Det är en projektbåge, inte fyra avgränsade byggnader.

| Funktion / stödperson | Synliga payoffs | Runtimeansvar |
| --- | --- | --- |
| Henning: mat/tårta | Matbord, jordgubbstårta och bakverk i FAMILY | Kanoniska dialogbeats; ev. framtida questmoment utan separat kodmotor |
| Linus: ljus | Ljusslingor/scenlampor | Berättelse och konditionerad miljödekor; köpen görs **inte** hos Linus |
| Mira: praktiska saker | Bord, stolar, dukar, dekorationer m.m. | **Enda säljstället**. SysselBux, Story Purchase, bestående ägande/inköpslista |
| Sol: musik | Ljud, högtalare, stämning, sång | Story- och musikval, ej egen köpbutik |

**Detalj att bestämma:** kan Miras första Act 3-produkter köpas direkt efter VILLAGE-003 när hon får önskelistan, och utökas efter VILLAGE-009 med häftet? Denna modell passar ”hela akten på sig”, men katalog och priser är fortfarande öppna och är *inte* låsta här. PREP-001–006 får aldrig rita ut ospenderade/ej monterade festvaror som om de redan var inköpta.

### 1D. Spelmoment och resultat

- **Minigolf**, PARK-009 → PARK-010: speltypen godkänd efter webbaserad PoC, men regel, slutligt antal banor, vinst/förlust och bildmässig finish inte låsta. PARK-010 innehåller i nuvarande godkänd dialog att Nova vann ”med ett slag”. Lös kontraktet (t.ex. storytävlingen avgörs separat eller grenanpassad dialog *efter godkännande*) utan att anta spelaren förlorar varje match.
- **Shuffleboard**, PARK-020: spelaren möter Nova. Frivillig extramatch är återspelbar om vi senare bestämmer det. **FAMILY-006:** föräldrarnas manusstyrda returmatch med mamman som vinnare.
- **Skattjakt**, HUNT-001–006: spelaren ska faktiskt lösa ledtrådar på lämpligt sätt, med rimliga hintar. Ett större separat minispel är inte nödvändigt.
- **Arkadspel**, ARCADE-001–006 och EPILOG: karaktärernas lek och val finns i manus. Inga nya spelmotorer **krävs** för att göra storyn spelbar; optional bonusutmaningar kan beslutas senare.
- Övriga små val (bordsplacering, sång, kasta macka): kan vara storyinteraktioner utan nya game engines. Oavsett val: respektera Novas känsloarc och slut.

### 1E. Sparning, deadbeats, väntan, kapitelbyten

- Persisted Act 3 chapter state ska minst kunna representera current story beat/line, upptäckta stadsplatser, aktuellt mål/väntgrind, avslutad minigame-reaktion och familjedagens avslutsmarkör. Använd **shared Chapter Persistence Host** och migration, inte ny backend/game engine.
- Backend fortsätter äga parent approvals/claims, wallet och köp. Inga lokala godkända quests, extra valutor eller max-merger av sparningar.
- Deadbeats vid inaktiva redan upptäckta platser använder canonical bilder eller återbrukad bild och kort återbesöksdialog. De får varken visa framtida spoiler eller konsumera quest claim.
- En active quest väntar på godkända real-world claims utan att vara omöjlig att återöppna. Akt 1/2 kan besökas utan att tappa Act 3:s story och child-scoped save.
- Tillfälliga \`Vuxenläge → X\` gäller endast utvecklingsåtkomst. **Släpp inte ordinarie Akt 2→3** förrän vi uttryckligen godkänt Act 3-release och tagit bort X-bypass.

## 2. Källrevision och saker som kräver verklighetscheck

- Äldre anteckningar anger **135 beats**. Den aktuella upplösningsinventeringen innehåller **138 ID:n**, men saknar **VILLAGE-009** trots att beatet är godkänt och finns separat i huvudmanifestet 11N. Alltså täcker denna karta **140 identifierbara beat-ID:n** om VILLAGE-009 räknas, inte 135. **Detta är en dokumentationsaudit, inte ett påstående om 140 unika implementerade spelkort.** Rensa/fixa inventeringen som ett separat säkert dokumentationspass, inte genom att tysta manuella källluckor.
- \`docs/ACT3_DIALOG_CANON_RESOLUTION.md\` styr version. Ny CITY-001–003 den 10 oktober **ersätter** äldre butik/highscore-variant. A3-ARCADE ligger efter DRAMA-010. A3-VILLAGE-009 har separat senaste Mira-dialog. Park-021 har en senare reviderad version.
- En del sektioner i huvudmanifestet är kondenserade, med senare fullständigare versioner längre ned; använd denna karta för ordning, aldrig som ersättning för faktisk rad-för-rad manusresolution.
- Art-assets och hela Act 3-city runtime saknas som produktionsleverans. Inget är ”DONE” bara för att beat står i detta dokument.

## 3. Designbeslut att godkänna före implementation

1. **Första kartan efter OPEN-004?** Klick på Folkparken → OPEN-005 och PARK-001, utan mellanlandning.
2. **Kartklick mellan beats:** exakt ett quest per beat-ID är låst. Bestäm endast presentation av väntan/kartan efter ett avslutat beat; FAMILY/EPILOG löper obrutet.
3. **Skattjaktens platspresentation:** tillfälliga ledtrådspins eller steg i en enda jaktvy? Undvik tio permanenta stadsikoner.
4. **Exakt tid för Miras köpupplåsning:** VILLAGE-003 eller VILLAGE-009; gärna i steg så barnet kan spara SysselBux tidigt.
5. **Questantal:** med nuvarande manus **106** beatupplåsningar; 1 quest per beat är låst. Bestäm endast hur flera tillgängliga platser och backend-claims hanteras utan dubbelförbrukning.
6. **Vill vi ha valbara minigame-replay?** och hur PARK-010:s manus om Novas vinst stämmer med spelarens resultat.
7. **Detaljsekvens för PREP, REVEAL och SECRET** över stad/by/folkpark, och sista questets exakta plats. Allt finns i manuscript, men trigger-/kartplacering är inte spikad.
8. **Epilogens spelhall**: återspela något minispel eller visa genom Story UI utan en ny motor? Den godkända avslutningen har **ingen Act 4-tågkart-hook**.

## 4. Förslag till implementeringsordning (inte verkställande beslut)

- **Slice A:** Intro 000–005, upptäckt stadskarta, hamn, parken, kart→Story-sekvens och Act 2-retur.
- **Slice B:** PARK 001–010 inklusive minigolf; CITY/HOME första dagen med persistent beat-resume.
- **Slice C:** Första BOAT/VILLAGE 001–003 och HUNT 001–006; idempotenta questpauser och aktiv/död plats.
- **Slice D:** PARK 011–022, shuffleboard, DRAMA/ARCADE och storykedjan.
- **Slice E:** Novas första bybesök 004–026 via riktiga Akt 2/1-världar; Mira och SysselBux-katalog/inköpslista.
- **Slice F:** PREP/REVEAL/SECRET, köpgrind, FAMILY och EPILOG, med full iPhone/save-acceptance.
- Inga onödiga Vercel-deploys eller GitHub Actions-kostnader. Avsluta varje slice med regressionskontroller, dokumentation och fysisk acceptans när den faktiskt behövs.

**Ägarregel:** Huvudkronologin, **de fem typerna av stadskarteikoner i 1A**, och **OPEN-000–005 + PARK-001 gratis → exakt 1 godkänt quest per beat från PARK-002 till SECRET-006 → questfri FAMILY/EPILOG** är låsta. Exakta ikonpositioner, minispelsregler och köp är fortsatt förslag. Ingen Act 3-storyruntime är implementerad än.

**Nytt låst slutbeat 2026-10-12:** A3-FAMILY-021 *Vi gjorde vad vi kunde*, godkänd kvällsresa på sjön med Alve och Barnet, direkt efter familjefotot i FAMILY-020 och före epilogen några dagar senare. Inget questkrav för 021. Visuellt ankare: kvällens motorbåt, stadsljus på avstånd, de två vännerna återvänder hem.


### Beslut 2026-10-12: Epilogen har EN gemensam questgrind (ersätter tidigare questfri epilog)

- **A3-FAMILY-001–021:** spelas utan ytterligare quests efter befintlig finale-/inköpsgrind.
- **Mellan FAMILY-021 och EPILOG-001:** barnet måste göra **ett nytt, föräldragodkänt IRL-quest** för att låsa upp epilogen. Det är en separat inlämning och inte återanvändning av den sista questen före familjedagen.
- **A3-EPILOG-001–006:** efter upplåsning spelas alla sex beats i ett enda sammanhängande svep utan ytterligare quests. Normal sparning/återupptagning ska fortfarande fungera.
- **Totalen är 107 godkända questinlämningar**: 106 tidigare för PARK-002–SECRET-006 + 1 epiloggrind. Fortfarande **140 beats** totalt, av vilka 106 har individuell questgrind, 6 delar en gemensam questgrind, 21 FAMILY och 7 intro är questfria. Ingen ny story-beat tillkommer.


## LÅST UX-BESLUT 2026-10-12 — Läs FAMILY tillsammans med en vuxen

**Trigger:** när Akt 3:s sista förberedelse-/inköpsgrind är klar och **före A3-FAMILY-001**. Visas en gång på barnets skärm, och **samma text** ska samtidigt vara tillgänglig i kopplat föräldraläge för detta barn. Ingen storyspoiler i meddelandet. Föräldern ska kunna läsa det även om hen öppnar vuxenläget senare (persisted unread/inbox/notice, inte en flyktig toast). Om en push-notis till förälderns enhet stöds i framtiden ska den peka på samma information; designbeslutet innebär **inte** att pushinfrastruktur finns idag.

**Delad, ordagrant identisk meddelandetext (barnskärm och föräldraläge):**

> **Nu börjar berättelsens avslutning!**
>
> Det som händer nu kan väcka lite stora tankar och känslor.
>
> Vi rekommenderar att du spelar den här delen tillsammans med en vuxen. Då kan ni prata om det som händer, om ni vill.
>
> Du behöver inte göra fler sysslor under den här delen av berättelsen.

**Barnets knappar:** ”Spela tillsammans” och ”Fortsätt själv”. Inget krav på vuxengodkännande och inget tvång att ha en vuxen närvarande. Knapparna går vidare till FAMILY-001, inte till separata manusvarianter. FAMILY-001–021 kan pausas och återupptas från exakt senaste beat/linje. Föräldraläget visar motsvarande informationskort, ingen ny quest eller grind. Meddelandet gäller bara FAMILY-kedjan; **en separat** föräldragodkänd quest krävs senare för att trigga EPILOG-001–006 som spelas i ett svep.

**Implementationsstatus:** detta är dokumenterat produkt-/UX-beslut, **inte** verifierad leverans i app eller faktisk telefon-push. Använd en gemensam textkonstant i implementationen för att undvika textdrift mellan ytorna. Koppla parent notice till aktuellt barn/save och säkerställ idempotens.
