# Akt 3 – Kronologisk gameplay-/kartflödeskarta

**Status: ARBETSUTKAST 2026-10-11 – FÖR GRANSKNING. INTE SPIKAT.**  
**Implementation:** Endast befintligt Act 3 chapter intro-skelett och temporär Vuxenläge → X-testport är kodade; allt story-/kart-/minispelsflöde nedan är ännu design.  
**Källor:** `docs/ACT3_STORY_MANIFEST.md`, `docs/ACT3_DIALOG_CANON_RESOLUTION.md`, godkända CITY-dialoger `docs/ACT3_CITY_001_003_GODKAND_2026-10-10.md`, `docs/ACT3_IMPLEMENTATION_PLAN.md`.  
**Regel:** Godkänd manusdialog ska inte skrivas om av en spelplansskiss. Senare godkända ändringar vinner över äldre synopsis/PDF. Följ inga inofficiella plats-/questplaner som om de vore kanon.

## 0. Grundidé som redan är beslutad

- Akt 3-staden: **statisk illustrerad karta med klickbara platsikoner**, ej free-roam. Oupptäckta platser är helt dolda; story-aktiv plats är markerad. Klick öppnar dess nästa Story-beat DIREKT (inget extra miljörum).
- Följande plats saknas aktivt beat? **Deadbeat** som inte konsumerar/ger framsteg. Questväntan återanvänder Runtime 1.1/Act 2:s befintliga backend-auktoritativa progressionsmotor och visar återstående status.
- Hamnens **motorbåt återvänder till den befintliga traverserbara Akt 2-världen**, och därifrån går det till Akt 1-byn. Akt 1/2 får inte ersättas med statiska karta-fiktioner. Normal återresa till staden ska fortsätta fungera; exakt UI där återstår.
- Storybeats kan följas direkt på varandra. **Inga IRL-quests mitt i öppningsmötet, mitt i klimaktiska scener eller i FAMILY/EPILOG.** Pauser med godkända verkliga quests väljs uttryckligen i authoring efter pacing och tests, inte en quest per beat.
- **Alla festinköp hos Mira** via SysselBux och befintlig Story Purchase-ekonomi. Varor köps successivt i valfri ordning när listan introducerats. Butikslista med ägt/saknas; en **enda obligatorisk inköpsgrind nära allra sista förberedelsequestet/innan festen**.
- Saknade inköp där → vanlig dialog: **Nova: ”Vi måste få klart inköpen innan vi kan starta festen!”** → tillbaka till kartan. Ingen extra quest för detta, och inga intermediate purchase gates.
- Minigolf är **godkänt som speltyp** efter HTML-PoC 2026-10-11; *inte PoC-koden* som slutlig implementation. Ordning: minigolf PARK-009, shuffleboard PARK-020 och FAMILY-006.
- Förberedelsespår Henning (mat), Linus (ljus), Mira (möbler & inköp), Sol (musik) bidrar till **EN gemensam familjedag**, inte separata byggspel.

## 1. Hela spelkedjan – föreslagen kronologi

**Legend:** A = automatiskt sammanhängande storybeats; K = kart-/platsval; Q? = förslag på *framtida* questpaus, **inte godkänt antal eller placering**; MG = minispel; SHOP = kan köpa när listan öppnats; F = finale utan IRL-questpauser.

| # | Beat-ID och innehåll | Storyplats / trigger | Kontroll / förslag |
| --- | --- | --- | --- |
| 01 | **OPEN-000–004:** kapitelkort, ankomst, möte med Nova, motorbåten, gamla folkparken | Hamnen; vid första Akt 3-test- eller framtida legitima kapitelstarten | **A**. Sammanhängande intro, inga quests. |
| 02 | **OPEN-005 → PARK-001:** promenad mot folkparken och parkens entré | Folkparken | **K?** Förslag: första stadskartan efter OPEN-004, där hamnen och den nyupptäckta folkparken visas och parken är aktiv. Ett tryck på parken spelar båda beats utan extra klick. *Inte ännu godkänt*. |
| 03 | **PARK-002–008:** bana 7, gamla scenen, stranden, festidé, Henrik, tillstånd och lista | Folkparken (intern rundtur i beatbilder) | **A**. Många scener men EN upptäckt kartplats, inga extra miljörum. |
| 04 | **PARK-009 → PARK-010:** minigolf, Novas första formulering av familjedagen | Folkparken | **MG** minigolf först; sedan **A** PARK-010. Bevara godkända repliker. Lås inte matchens exakta resultat utan dialog-/resultatkontrakt. |
| 05 | **CITY-001–003:** den ljusa retrospelbutiken och vägen hem | Retrospelbutiken (staden) | **K?** Förslag: kartikon för retrobutiken efter PARK-010. **INGEN** hemlig arkad, highscore, NOV eller Rebecka i första besöket! Använd separat senast godkänd CITY-fil. |
| 06 | **HOME-001–008:** Novas mamma, Mira-kopplingen, hemliga festidén, gamla villan, minnena, skattkistan, tvåhemsschemat | Novas hem hos mamman | **K?** Upplås hemikon efter CITY-003:s inbjudan. De åtta beatsen kan kedjas, med val/pauser inom scen men ingen IRL-questgrind. Mamma och pappa får inte höra om festen. |
| 07 | **BOAT-001–005:** Barnet + Alve åker hem utan Nova, Alves parallell till stugan, ny vänskap, stor festplan | Från stadens hamn via sjön till Akt 2 | **K/A**. Motorbåten startar återresans författade storysekvens; efter sista båtscenen aktiveras befintlig Akt 2/1-värld. Får ej teleportera bort story eller kräva extra quests. |
| 08 | **VILLAGE-001–003:** Mira får hälsning från Novas mamma, får veta om hemlig familjefest och ber om lista | Miras butik i byn (Akt 1) | **Storyinteraktion** med Mira. **SHOP** kan introduceras successivt, men exakt katalogupplåsning (första lista här eller senare VILLAGE-009) måste väljas. |
| 09 | **HUNT-001–006:** Nova kallar över barnen, fontänen, busshållplatsklockan, biblioteket, utsikten och glass | Staden: torget → klockan → biblioteket → utsiktsplats → waterfront | **K + klurigheter**. Förslag på storydriven karta med upptäckta ledtrådsmål och begripliga interaktioner, men inte sex fristående nya mini-engines. **Q?** möjlig naturlig paus *före* nästa Nova-inbjudan, inte mitt i en jakt. |
| 10 | **PARK-011–014:** Novas nya plan, bordplacering, kompromisser | Folkparken | **K → A**. Spelaren återser parken. Tillåt förslag på placering som får synlig effekt utan att ändra framtida emotionell arc. **Q?** före eller efter samlad sekvens, ej inuti dialogen. |
| 11 | **PARK-015–018:** Henrik, gamla spelhörnan, val av aktiviteter, 2011 års poängtavla/första dejt | Folkparken | **A/val**. Poängtavlan är central och årtalet 2011 låst. Ingen rewrite av föräldrarnas historia. |
| 12 | **PARK-019–022:** det gamla shuffleboardbordet, första matchen med Nova, nya 2011-minnen, en revanschidé | Folkparken | **MG** shuffleboard i **PARK-020** (senare i story än minigolf); lokala vinst/förlust-repliker får skilja sig men påverkar inte relation/utfall. |
| 13 | **DRAMA-001–005:** pappan ringer, Nova blir besviken, ilska, bråk och att hon lämnar parken | Folkparken | **A** utan IRL-quests. Dramat måste spelas i rätt följd, inte upplösas genom köp eller godkänd quest. |
| 14 | **DRAMA-006–010:** Nova saknas, vid lägenheten, ursäkt och bekännelser som ännu inte avslöjar hela skuldkänslan, en dag utan planering | Novas mammas hem → stadens gator | **K/A**. Kan starta vid aktivt hem; inga godtyckliga questkrav inne i försoningen. Slutar med att Nova visar dem ett hemligt ställe. |
| 15 | **ARCADE-001–006:** hemlig arkad, Rebecka/REB, NOV-rekordet, spelval och ny vänskapstradition | Retrospelbutiken, *dolt arkadrum nu avslöjat* | **A / valfri spelinteraktion**. Introducera arkadens extra innehåll först **efter DRAMA-010 och före DRAMA-011**. Rebecka inte Rut. Rekordet är bonus, inte storyspärr. |
| 16 | **DRAMA-011–015:** båda föräldrarna säger ja till inbjudan, Nova jublande tillbaka, fotot från 2011 och planerna | Meddelande → torget → folkparken | **A**. Festen är fortfarande hemlig för föräldrarna, ingen riktig realtidsdeadline. |
| 17 | **VILLAGE-004–006:** Novas första båttur till sjösidan, Alves stuga och familjefotot | Stadshamnen → Akt 2-stugan | **K/A**. Nova följer med **först nu**. Stugan är traverserbar befintlig Akt 2-värld, storymoment vid rätt punkt. |
| 18 | **VILLAGE-007–010:** Nova ser byn, träffar Mira, går igenom Miras häfte och pratar med Henning | Akt 1-byn: torget → Miras butik → bageriet | **K/A + SHOP**. **VILLAGE-009 är ett separat beat** i kapitelmanifestets 11N mellan 008 och 010. Det ger den tydliga inköpslista-/kataloguppföljningen och Mira minns 2011; placera aldrig detta beat sist eller hoppa över det. |
| 19 | **VILLAGE-011–016:** Linus har ont i ryggen och försöker dölja det, Sol hjälper | Akt 1-byn: torget/förråd | **A + eventuell liten interaktion**. Humor och omsorg, **inte** ett nytt byggprojekt; inga nya stora minispel krävs. |
| 20 | **VILLAGE-017–021:** Sols hemliga sångtalang, duetterna och Nova väljer låt | Akt 1-byn: Sols hus | **A + val**. Ingen ny rytmspel-motor krävs; valfri sång interaktion om senare beslutat. |
| 21 | **VILLAGE-022–026:** en omväg till utsikten, samtal om att något kan bli annorlunda och ändå bra, sjövägen tillbaka | Akt 2-stranden / utsikten → motorbåt → staden | **A/K**. Nova åker tillbaka med dem. Sparvärld och kartstatus bibehålls över kapitelbytet. |
| 22 | **PREP-001–006:** synliga festförberedelser, saknade varor, det gamla fotot, Miras ljusslinga och pappans vita skjorta | Folkparken, kort Mirasamtal | **Q? + SHOP (parallellt)**. Förberedelsebilder måste vara **villkorliga mot vad som redan är köpt/installerat**. Inget pressande riktigt datum. |
| 23 | **REVEAL-001–004:** Nova berättar för kompisarna att hon hoppas att föräldrarna ska bli kära igen; ”Operation Första Dejten” | Folkparken | **A**. Varken Barnet eller Alve ska i förtid förklara att planen inte kan fungera. Novas skuld för middagsutbrottet avslöjas *inte* här. |
| 24 | **SECRET-001–006:** frågar Mira om 2011-musiken, fotografi och album, hennes insikt, Sols överraskning och enskilt råd till Barnet | Miras butik i byn, övriga redan kända platser | **K/A + SHOP**. Hemligheten förblir hemlig för föräldrarna. Mira förstår men avslöjar inte allt för barnen. Exakt växling mellan stad och by är förslag att kartlägga vidare. |
| 25 | **Sista förberedelsegrinden** | Aktiv plats: folkparken (förslag) | **Q + enda köpgrind**: när den sista förberedelsequestens story ska aktiveras, verifiera full obligatorisk inköpslista. Om saknas → Novas EXAKTA repliker ”Vi måste få klart inköpen innan vi kan starta festen!” → karta. När ägandet är komplett fortsätt på samma punkt, utan nytt extrauppdrag. Exakt questantal och sista questets beat-ID ännu ej bestämda. |
| 26 | **FAMILY-001–007:** platsen är klar, Henrik kommenderar, pappa och mamma anländer, minnen och shuffleboard-returmatch, gammalt fotografi | Folkparken | **F**. START efter att alla obligatoriska saker finns och sista questgrinden är uppfylld. Returmatch **FAMILY-006**, mamman vinner. Alla har genuint roligt. |
| 27 | **FAMILY-008–014:** lyckad dag, sista spelet, vanligt samtal om hemresa, Novas besvikelse, Mira låter Barnet finnas där, bänkscenen | Folkparken | **F**. Ingen ny IRL-quest eller inköp. Föräldrarna flyttar inte ihop igen. Den *senast reviderade* bänkscenen A3-FAMILY-014 gäller. |
| 28 | **FAMILY-015–020:** mamman kommer, Nova berättar om middagsutbrottet, båda föräldrarna tydliggör att det aldrig var hennes fel, nytt foto till två hem | Folkparken | **F**. Mamman ska själv leverera den avgörande försäkran om skilsmässan, inte Barnet/Mira. Mamma+pappa fortsätter bo isär. |
| 29 | **EPILOG-001–006:** några dagar senare, tillbaka till Rebeckas arkad, nytt spel, familjefotot finns i båda hemmen, bowlingplaner, vännerna skiljs åt vid båten | Hamnen → arkaden → hamnen | **F**. Ny glad framtid utan att radera sorgen. Sist: båten på sjön och **SLUT PÅ TREDJE KAPITLET**. Tidigare Act 4-tågstation-/kart-hook är struken. |

### 1A. Visuella kartplatsers föreslagna upplåsning (ej ännu beslutad)

| Stadskarteikon | Första relevanta beat / möjligt unlock | Återbesök och regler |
| --- | --- | --- |
| **Hamnen** 🚤 | OPEN-001, från början | Motorbåten går till Akt 2. På storytriggad hemresa spelas BOAT-001–005 och därefter befintlig sjövärld. Senare kan kajen ge deadbeat. |
| **Folkparken** 🌳 | OPEN-004 nämner den; föreslag första tillgång därefter | Aktiv plats för parkbeats, drama, PREP och FAMILY. Samma ikon, **inte** en ny kartplats för bana 7, scen, förråd, spelhörna och strand. |
| **Retrospelbutiken** 🎮 | CITY-001, tidig stadsdag | Endast butik vid första besöket. Den dolda arkaden är en ny **intern storydel på samma plats** först vid ARCADE-001 (efter DRAMA-010); den får gärna då visas som ny markör i samma ikon. |
| **Novas hem hos mamman** 🏠 | CITY-003 inbjuder | HOME-001–008, senare DRAMA-007–010. Pappans hem är **omnämnt**, inte automatiskt ett spelbart kartval. Den gamla villan finns i minnen, inte som en bekväm ny teleportikon. |
| **Torget/fontänen** ⛲ | HUNT-001/002 eller redan vid tidigare stadsbesök (avgörs av innehåll) | Används under HUNT och DRAMA-012; dölj innan det faktiskt blir relevant. |
| **Ledtrådsplatser i skattjakten** 🕒📚🌄🍦 | HUNT-003–006 | Klockan vid busshållplatsen, biblioteket, utsiktsplatsen och glass/vattenfront. Antingen stegvisa temporära kartmarkörer eller en gemensam **Skattjakt**-progression; inget krav på permanent fyra extra stadsikoner. |
| **Spelhallens innehåll** 🕹️ | ARCADE-001 | Först senare; **Rebecka + NOV + REB** förekommer inte i den tidiga CITY-001–003-versionen. |
| **Akt 1/2-världens platser** 🌲 | Befintliga och redan spelbara | VILLAGE-001–026 triggas i riktiga byn/stugan, via befintlig world/storyinteraktion, inte via nya stadsikoner. |
| **Miras butik** 🛒 | Finns i Akt 1, första Act 3-storyinköpskontext i VILLAGE-001–003 | Köp i valfri ordning efter listans upplåsning. Staden ska inte ha separata lamp-/musik-/matbutiker. |

**Förslag för första kartmöte:** direkt efter OPEN-004; hamnen och folkparken synliga, parken aktiv. Klick på folkparken spelar OPEN-005 + PARK-001 utan ny scen. Det är ett förslag från diskussionen, **inte godkänt som låst beslut**.

### 1B. Uppdelning mellan kedjor och questväntan

**Bör få löpa utan IRL-grind mellan beats:**
- OPEN-000–005 + första parkbesöket till PARK-010.
- CITY-001–003 + HOME-001–008 och den storymässiga avfärden BOAT-001–005.
- HUNT-001–006 väl påbörjad; PARK-009 minigolf följt av PARK-010.
- PARK-015–022 när 2011-poängtavlan/shuffleboard introduceras.
- DRAMA-001–010; ARCADE-001–006; DRAMA-011–015.
- Novas första sammanhängande besök i byn VILLAGE-004–026 där det känns dramaturgiskt rimligt (story/interaktionsval inom besöket är okej).
- REVEAL-001–004 där hon öppnar sig; FAMILY-001–020 samt EPILOG-001–006.

**Möjliga pauser för IRL-quests (ej fastställda, inga antal):**
- Efter första hemresan och Miras första briefing före återbesök i staden / HUNT.
- Mellan skattjakten och senare folkparkplanering.
- Mellan naturligt avslutade planerings-/restaureringsetapper runt PARK-011–022 och senare återkomst.
- Under den **långa festförberedelsen**, runt PREP/SECRET, där quests kan driva progress medan Barnet sparar SysselBux och ser parkens utseende växa.
- Sista förberedelsequestet före FAMILY-001, med **enda obligatoriska köpgrinden**.

**Absolut inte:** krav att köpa alla Miras varor i början, en quest per beat, quests mitt i familjedagen, en IRL-städquest som måste göras för att se Novas känslomässiga upplösning eller ett spelresultat som gör föräldrarna till ett par.

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

- Äldre anteckningar anger **135 beats**. Den aktuella upplösningsinventeringen innehåller **138 ID:n**, men saknar **VILLAGE-009** trots att beatet är godkänt och finns separat i huvudmanifestet 11N. Alltså täcker denna karta **139 identifierbara beat-ID:n** om VILLAGE-009 räknas, inte 135. **Detta är en dokumentationsaudit, inte ett påstående om 139 unika implementerade spelkort.** Rensa/fixa inventeringen som ett separat säkert dokumentationspass, inte genom att tysta manuella källluckor.
- \`docs/ACT3_DIALOG_CANON_RESOLUTION.md\` styr version. Ny CITY-001–003 den 10 oktober **ersätter** äldre butik/highscore-variant. A3-ARCADE ligger efter DRAMA-010. A3-VILLAGE-009 har separat senaste Mira-dialog. Park-021 har en senare reviderad version.
- En del sektioner i huvudmanifestet är kondenserade, med senare fullständigare versioner längre ned; använd denna karta för ordning, aldrig som ersättning för faktisk rad-för-rad manusresolution.
- Art-assets och hela Act 3-city runtime saknas som produktionsleverans. Inget är ”DONE” bara för att beat står i detta dokument.

## 3. Designbeslut att godkänna före implementation

1. **Första kartan efter OPEN-004?** Klick på Folkparken → OPEN-005 och PARK-001, utan mellanlandning.
2. **Kartklickens granularitet:** Inom en påbörjad storyplats spelas flera godkända beats i en kedja utan att behöva gå tillbaka till kartan efter varje beat. Gäller den samlade första parkdagen och familjedagen.
3. **Skattjaktens platspresentation:** tillfälliga ledtrådspins eller steg i en enda jaktvy? Undvik tio permanenta stadsikoner.
4. **Exakt tid för Miras köpupplåsning:** VILLAGE-003 eller VILLAGE-009; gärna i steg så barnet kan spara SysselBux tidigt.
5. **Questgrindarnas exakta beats/antal** och om något kan ske parallellt eller om en aktiv location i taget är bättre. Förbjud dubbelförbrukning av claims.
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

**Ägarregel:** Hela denna fil är ett *diskussionsunderlag*, inte en låst ny quest- eller beat-konfiguration. Sätt aldrig LOCKED utan ett senare uttryckligt användargodkännande och GitHub-verifiering.
