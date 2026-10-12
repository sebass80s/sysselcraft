# NOVA HANDOVER — Akt 3 epilogbilder, incident 2026-10-12

**Status:** Bildproduktion PAUSAD efter upprepade pipelinebrott. Nästa instans får INTE tolka genererade bilder som godkända. Manus finns låst på GitHub. Detta dokument är operativ handover, inte nya manusbeslut.

## A. ABSOLUT: KÖR ART ÄR EN PIPELINE, INTE FRI BILDGENERERING

Läs i denna ordning: `docs/ACT3_STORY_MANIFEST.md`, `docs/ACT3_DIALOG_CANON_RESOLUTION.md`, `docs/ACT3_ART_PIPELINE.md`, `docs/ART_PIPELINE_V2.md`, `docs/ACT3_ART_SHOT_MANIFEST.md`, denna handover och relevanta `image-pipeline/`-kontrakt. Det är **obligatoriskt att hämta exakt pågående beat från repo vid varje ny bild**, även när användaren bara säger ”kör art” eller ”nästa”. Tidigare svar, senaste bilder och minnesanteckningar ersätter aldrig manuset.

**För varje enskilt beat:**
1. Hämta hela exakta beatsektionen; kontrollera senare kanoniska revisioner. Citera minst två korta manusankare internt i shot-kontraktet; scenen måste hända just i detta beat, inte före eller efter.
2. Upprätta strikt shot-kontrakt: beat-ID, *exakt handling och känsla*, cast (alla närvarande personer), plats/interiör, tid, kameravinkel, kläder, rekvisita, tillåtna miljöankare och uttryckligen förbjudna element. Dra INTE slutsatser om foto från föregående beats.
3. Ladda de verkliga bildreferenserna som visuella indata, inte bara beskrivningar. **Om generatorns möjlighet att konsumera bilderna inte kan säkerställas, säg det och STOPPA före generering**; utge aldrig en text-only prompting för att vara ref-guided. De uppladdade karaktärsbladen från 12 oktober fanns i bildproduktionschatten men deras existens är INTE ett kvitto på att generatorn använde dem. För återstart i ny chat: säkerställ faktisk visuell tillgång genom på nytt bifogade bilder eller underbyggd connector/library-lösning. Referensbilder i repo är inte automatiskt bifogade genereringsmodellen.
4. Identitetsauktoritet är karaktärsblad > accepterade scenbilder > text. Accepterade tidigare bilder styr bara lokal scenkontinuitet; aldrig ny identitet. Högst en relevant föregående godkänd scen som miljöankare. Ingen random bild från annan dag.
5. Generera **ett** beat, **en** scen. Om användaren säger ”nästa bild” ska nästa beat hämtas och scenens nya kontrakt skrivas om från grunden. Blanda aldrig ihop FAMILY-021-båtfärden med EPILOG-002 arkadhallen.
6. Granska färdig bild mot manus, *samtliga* referensark, cast, kostym, visuell gestaltning, scoreboards, anatomi och hårda regler. Underkänn på första materiella fel. Visa inte en underkänd bild som godkänd. Efter två misslyckanden STOPPA och byt arbetsmetod i samråd med användaren i stället för reflexmässiga försök.
7. Användaren godkänner bildkandidaten; först därefter angiv korrekt PNG/filnamn och GitHub-path. Användaren sköter **manuell drag-and-drop till GitHub**. Påstå aldrig att verktygets genererade PNG finns i repo förrän GitHub-path och blob verifierats.

**Hård regel, noll undantag: BARNETS ANSIKTE FÅR ALDRIG SYNAS, inte ens profil, ögon, spegelbild eller reflex.** Visa Barnet strikt bakifrån, med kanonisk blåvit mössa/bergsemblem, röd hoodie, olivgrön ryggsäck med emblem och flaska, blå cargobyxor. En trekvartsbild som visar kind/ögon är FEL.

## B. Vilka referenser användaren redan bifogat i produktionstråden

- Karaktärsblad: **Nova**, **Alve**, **Barnet**, **Rebecka**. Rebecka: lång rödbrun hår, olivgrön arbetsjacka, svart pixel-invader-T-shirt, jeans, verktygsbälte/väska, röda sneakers; **inte** vit blus/overall/namnbricka om sådan kostym inte är spikad i beatet. Manus för EPILOG-002 säger dock att håret då är uppsatt i slarvig knut: följ beatets tillfälliga frisyr utan att byta identitet/kläder.
- Plats-/kontinuitetsankare: uppladdad **Golden-Hour Harbor Encounter(1)** (hamnen, NOT som bevis för personernas position i EPILOG-001), **ARCADE-005** (Rebecka och de tre barnen vid maskinen, spelhall), **FAMILY-020** (godkänt nytt familjefoto inuti en mobil).
- Uppladdningar finns i den tidigare produktionschatten; en separat instans behöver faktiskt ha dem som åtkomliga bildindata. Återanvänd aldrig enbart muntligt påstående ”jag har referenserna”. Repo innehåller karaktärsbladen i `public/assets/character-sheets/` för Nova, Barnet och Alve, men bekräfta faktiskt filinnehåll och ref-input. Kontrollera om Rebeckas blad är sparat eller behöver användarens uppladdning.
- **FAMILY-020:** användaren godkände familjefotot och bad därefter specifikt att det skulle synas *på en mobils skärm*; den mobilen är rätt epilogankare. Fotot är inte bevisligen uppladdat i GitHub av användaren.

## C. Exakt manus / scen för epilogen

`A3-EPILOG-001 – Ett meddelande`: Några dagar efter festen, **Barnet och Alve har just kommit till stadens hamn med motorbåten**. Alve tittar på mobil med Novas meddelanden ”Var är ni?”, ”Bra. Kom till Rebeckas. NU.”, ”Och ta med ert mod.” **Nova är INTE fysiskt där.** Spela som dagtid, inte FAMILY-021:s nattliga återfärd. En tidigare kandidat råkade rita Nova (röd bob/teal sweatshirt) i hamnen; en annan visade Barnets ansikte. Senaste kandidaten visade två rätt klädda personer bakifrån vid mobil och hamn; **ingen explicit användaracceptans eller repo-upload verifierad**.

`A3-EPILOG-002 – Rekordet`: **INNE I Rebeckas spelhall.** Nova framför gamla rekordmaskinen; skärm **REB – 98 500**, **NOV – 98 450** (*femtio poäng skillnad*). Alve och Barnet ser på, Rebecka kommer fram bakom disken och skämtar att hon är REB. Bildens centrala motiv ska vara **Nova, maskinen och de fyra närvarande personerna**; Barnet enbart rygg. Godkänd ARCADE-005 kan ge miljöreferens men dess gamla maskinskärm/händelse får inte ersätta 002. **Senaste kandidaten** med fyra karaktärer vid maskinen (Nova pekar, Rebecka åt sidan, Alve vid kontroller, Barnet bakifrån) hade fel skärmsiffror: REB **987560** och NOV saknades på andraplats; **inte uttryckligen godkänd**.

`A3-EPILOG-003 – En utmaning`: **INNE I samma spelhall**: Nova räcker fram spelkontrollen till Barnet; Barnet får spela, sedan Alve. Alve startar och faller direkt i hål; humor. Rebecka närvarande. Välj **en tydlig bildhändelse från beatet**, gärna Nova som räcker över kontrollen med Rebecka och Alve i närheten, **Barnet strikt bakifrån**. Förväxla inte Nova med Rebecka. Senaste kandidaten utelämnade Nova helt, bytte Rebeckas identitet och kläder, behöll fel fokus på highscores. **REGENERATE.**

`A3-EPILOG-004 – Två fotografier`: Efter spelet sitter **tre barn** på en liten soffa bakom arkadmaskinerna; Nova visar nya foto på sin telefon, berättar att pappa skrivit ut två kopior (ett hos vardera förälder). Pratar om kommande bowling med båda föräldrarna; inte ett romantiskt återföreningslöfte. **Bildankare FAMILY-020 på mobilskärm**. Ansiktet på Barnet får inte synas.

`A3-EPILOG-005 – En ny utmaning`: Rebecka vid soffan, Nova reser sig självsäkert för en sista utmaning: ”Jag ska slå rekordet.” Det kan finnas återspelbar spelarmöjlighet/val; **lägg inte in ett påhittat fast utfall** i bilden. Fortfarande i spelhall.

`A3-EPILOG-006 – Tre kompisar`: Efter spelet går **Barnet, Nova och Alve** från spelhallen till **hamnen**. Nova säger ”Ni är mina bästa kompisar.” Alve och Barnet kliver i motorbåten; Nova vinkar från bryggan. Sedan ser Nova **nya FAMILY-020-fotot på mobilen** och ler; båten åker ut; `SLUT PÅ TREDJE KAPITLET`. Välj en definierad sekvensbild enligt bildplan, inte ett montage med text om inte beslutat. Här behövs sannolikt särskild slutbild med mobilen; låt manus styra och fråga vid behov om bilddelning av de separata motiven.

**Spara inte nya repliker i handovern som ersättning för manus. GitHub-manifestet är facit.**

## D. Incidentrapport, dagens undvikbara fel (2026-10-12)

1. EPILOG-001 fick felaktigt **Nova på bild**, trots uttrycklig exklusion. Vid korrigering fick Barnet synligt ansikte/profil. Först senare kandidat visade Barnet från ryggen, men den har inte uttryckligen godkänts.
2. EPILOG-002 fick **en bild utanför ”SPEL & LEK”**, sedan en bild i entrén utan Nova, sedan en annan utanför Rebeckas med fel beat; alla bröt mot att manus är INNE VID REKORDMASKINEN.
3. Användaren frågade vad manus faktiskt sade och påpekade att bildpipeline inte följdes. Efter utfästelse att förbättra processen genererades ändå **FAMILY-021 kvälls-båtbild** när aktuell beställning var **EPILOG-002 arkad**. Detta är ett processfel i beat-resolving, inte en AI-estetisk slump.
4. Nästa EPILOG-002-kandidat var för första gången på rätt plats med rätt cast men hade **fel scoreboardsiffror**; ingen explicit slutacceptans.
5. EPILOG-003-kandidaten saknade **Nova**, felaktigt avbildad Rebecka (ljus skjorta och hängselbyxor), medan Nova enligt manuset är den som ger Barnet spelkontrollen.
6. Användaren upplevde att hela lediga morgonen gick förlorad, har uttryckligen bett om noggrann dokumentation. Respektera detta; be inte om samma referenser om de faktiskt finns tillgängliga, och aldrig låtsas de används. Ingen ny art produceras som del av denna handover.

**Orsak:** Genomförandet hoppade förbi kanoniska preflight-steg trots att `ACT3_ART_PIPELINE.md` uttryckligen sade STOPP vid osäker referenstillgång, fel beat eller cast. Att säga ”nu ska jag följa pipen” utan verifierbara indata var inte en fix. Även om verktyget visade bilder var det INTE tekniskt fastställt vilka referenser som var faktiska generatorindata. Erkänn osäkerheten.

## E. Nuvarande status och konkret start för nästa Nova

- **Nästa beat att rätta och producera:** `A3-EPILOG-003 – En utmaning`. Inget slutgodkänt EPILOG-003.
- **EPILOG-001:** senare kandidat visuellt rimligare, **acceptans oklart**, verifiera med användaren eller deras faktiskt sparade filer.
- **EPILOG-002:** senaste kandidat har rätt cast/plats men **fel numeriskt rekord**; **inte explicit godkänd**.
- **EPILOG-003:** **REGENERATE** p.g.a. saknad Nova och fel Rebecka.
- **EPILOG-004–006:** inga verifierat godkända produktionsbilder från dagens pass.
- **Ingen** av dagens genererade bilder är verifierad GitHub-upload; användaren gör drag-and-drop efter godkännande. Hävdar inte att något är klart.
- Manus `A3-FAMILY-021` kvällsbåten spikat, men är **INTE** epilogens ankomst/arkadscener.
- Nuvarande flödesbeslut: 106 individuella questgrindar före FAMILY, **FAMILY-001–021 questfri**, **ett separat godkänt quest öppnar hela EPILOG-001–006 utan fler avbrott**, totalt 107 quests. Textstöd till vuxen före FAMILY skild från barnets spoilerfria text; Akt 2 har motsvarande inför familjefinalen. Ingen runtime-implementation bekräftad.

## F. Handover-operativ kommandotolkning

- Vid ”vad är nästa beat?”: hämta/visa ordagrant aktuellt kanoniskt manus, **generera inte bild**.
- Vid ”kör art”: läs hela aktuella beatet från GitHub igen och kör full pipeline. Allt annat än just det beatet är oacceptabelt.
- Vid ”nästa”: avse efterföljande **manus-beat**, inte nästa improviserade bildvinkel från föregående scener.
- Visa aldrig barnet framifrån eller från ansiktssidan, ens för att ”se mobilen”.
- Behåll Rebecka och Nova som två tydligt olika rödhåriga personer.
- Ingen extra/annan plats, tid på dygnet, roll eller rekvisita som ersätter låst action.
- **Ingen ny bild** före nästa explicita användarbegäran; just nu gäller handover/dokumentation.
