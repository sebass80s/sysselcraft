"use client";

import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import type { Act2VisualStage } from "../../game/act2VisualAssets";

type StoryBeat = {
  id: string;
  title: string;
  image: string;
  body: string[];
  stage?: Act2VisualStage;
};

const STORY_BEATS: StoryBeat[] = [
  {
    id: "meet-bike",
    title: "Någon är redan här",
    image: "/assets/village/story-moments/act2/meeting-alve/bike.png",
    body: ["Vad är det för cykel? Den verkar inte höra hemma här."],
  },
  {
    id: "meet-first",
    title: "Första mötet",
    image: "/assets/village/story-moments/act2/meeting-alve/first-hello.png",
    body: ["Alve försöker laga stugan själv.", "Han ser först lite misstänksam ut när Barnet kommer fram."],
  },
  {
    id: "meet-reality-check",
    title: "Det är mer jobb än det ser ut",
    image: "/assets/village/story-moments/act2/meeting-alve/a-lot-of-work.png",
    body: ["Alve har verkligen försökt själv, men börjar inse hur mycket som behöver göras.", "Barnet ser att det här är större än ett litet fix."],
  },
  {
    id: "meet-pick",
    title: "Vad ska vi börja med?",
    image: "/assets/village/story-moments/act2/meeting-alve/pick.png",
    body: ["Alve pekar ut Stugan, Bryggan och Båthuset.", "Välj vad ni ska reparera först."],
  },
  {
    id: "meet-shows",
    title: "Bra val",
    image: "/assets/village/story-moments/act2/meeting-alve/alve-shows.png",
    body: ["Valet är gjort och UI-skyltarna försvinner.", "Alve bekräftar vad ni ska börja reparera."],
  },
  {
    id: "meet-friend",
    title: "En ny kompis",
    image: "/assets/village/story-moments/act2/meeting-alve/new-friend.png",
    body: ["Alve börjar le.", "Nu känns det mindre som två främlingar och mer som början på ett lag."],
  },
  {
    id: "boat-01",
    title: "1/16 · Under bråten",
    image: "/assets/village/story-moments/act2/boathouse/under-the-rubble.png",
    body: ["Barnet och Alve börjar röja det gamla båthuset.", "Något tungt verkar ligga fast under bråten."],
  },
  {
    id: "boat-02",
    title: "2/16 · Den låsta kistan",
    image: "/assets/village/story-moments/act2/boathouse/finding-chest.png",
    body: ["De får fram en gammal tung kista.", "Låset sitter fast och vägrar ge med sig."],
  },
  {
    id: "boat-03",
    title: "3/16 · Henning har en idé",
    image: "/assets/village/story-moments/act2/boathouse/henning-will-blow-it-open.png",
    body: ["De ber Henning om hjälp.", "Hennings lösning är betydligt mer ambitiös än någon hade tänkt sig."],
  },
  {
    id: "boat-04a",
    title: "4/16 · BOOM",
    image: "/assets/village/story-moments/act2/boathouse/henning-after-tnt.png",
    body: ["Klipp bort. BOOM. Klipp tillbaka.", "Alve: Är alla i din by så här?", "Barnet: Typ.", "Alve: …jag gillar den här byn."],
  },
  {
    id: "boat-04b",
    title: "4/16 · Ett gammalt fotografi",
    image: "/assets/village/story-moments/act2/boathouse/find-photography.png",
    body: ["I kistan finns gamla verktyg, båtdelar och ett gammalt fotografi från sjön."],
  },
  {
    id: "boat-04c",
    title: "4/16 · Den där båten…",
    image: "/assets/village/story-moments/act2/boathouse/looking-at-boat-photo.png",
    body: ["Alve: Den där båten…", "Barnet: Vadå?", "Alve: Det är ju den.", "Barnet: Den på bilden?", "Alve: Mm.", "Alve: Jag undrar vart de brukade åka."],
  },
  {
    id: "boat-05",
    title: "5/16 · Fynden måste få en plats",
    image: "/assets/village/story-moments/act2/boathouse/alve-finds-a-tool.png",
    body: ["Barnet och Alve går igenom verktygen och båtdelarna från kistan.", "Det gamla arbetsområdet är för rörigt för att användas ordentligt."],
  },
  {
    id: "boat-06",
    title: "6–8/16 · Mira ordnar verkstaden",
    image: "/assets/village/story-moments/act2/boathouse/mira-you-need-more-tools.png",
    body: ["Mira ser kaoset och hjälper dem göra arbetsplatsen användbar.", "Mira: Ni behöver inte fler verktyg. Ni behöver kunna hitta de ni redan har.", "Alve: Men först ska vi fixa den gamla båten."],
  },
  {
    id: "boat-09",
    title: "9/16 · En gammal ritning",
    image: "/assets/village/story-moments/act2/boathouse/boxcar-blueprint.png",
    body: ["I det som återstår hittar de en gammal ritning till en lådbil.", "Alve bestämmer omedelbart att de ska bygga den."],
  },
  {
    id: "boat-10",
    title: "10/16 · Lådbilen byggs",
    image: "/assets/village/story-moments/act2/boathouse/boxcar-built.png",
    body: ["De återanvänder delar och bygger sin första riktiga verkstadspryl tillsammans."],
  },
  {
    id: "boat-11",
    title: "11/16 · Första provturen",
    image: "/assets/village/story-moments/act2/boathouse/boxcar-broken.png",
    body: ["Barnet: Gick det bra?", "Alve: Japp.", "Barnet: Hjulet lossnade.", "Alve: Då vet vi vad vi ska fixa."],
  },
  {
    id: "boat-12",
    title: "12/16 · Version två",
    image: "/assets/village/story-moments/act2/boathouse/boxcar-working.png",
    body: ["Den förbättrade lådbilen fungerar.", "Alve: Okej. Den där var övning.", "Barnet: För vad?", "Alve: Båten."],
  },
  {
    id: "boat-13-15",
    title: "13–15/16 · Gör plats för båten",
    image: "/assets/village/story-moments/act2/boathouse/boat-ramp.png",
    body: ["Båtplatsen röjs och den gamla slipvagnen återställs.", "Några gamla delar från kistan visar sig passa.", "Alve: Då kan vi få in båten.", "Barnet: När vi får laga den.", "Alve: När vi får laga den."],
  },
  {
    id: "boat-16",
    title: "16/16 · Båthuset är klart",
    image: "/assets/village/story-moments/act2/boathouse/16.png",
    body: ["Verkstaden, fotografiet, lådbilen och slipen finns kvar som spår av hela resan.", "Barnet: Klart.", "Alve: Nästan.", "Barnet: Vad är det som är kvar?", "Alve: Den."],
  },
  {
    id: "cottage-01", title: "1/16 · Vi börjar här", image: "/assets/village/story-moments/act2/cabin/renovating-cabin1.png",
    body: ["Barnet och Alve börjar röja den försummade stugan.", "Alve hittar fortfarande runt som om han aldrig varit borta."],
  },
  {
    id: "cottage-02-03", title: "2–3/16 · Spåren från förr", image: "/assets/village/story-moments/act2/cabin/1.png",
    body: ["De hittar Alves gamla längdmarkeringar och ett familjefoto från en tidigare sommar.", "Alve: Vi var här hela tiden då.", "Alve: Sen slutade vi komma."],
  },
  {
    id: "cottage-04", title: "4/16 · Som förr", image: "/assets/village/story-moments/act2/cabin/2.png",
    body: ["Första stora renoveringssteget är klart.", "Alve: Jag tänkte att om det såg ut som förr…", "Alve: …så kanske de skulle vilja komma hit igen."],
  },
  {
    id: "cottage-05-06", title: "5–6/16 · Stugan vaknar", image: "/assets/village/story-moments/act2/cabin/renovating-cabin2.png",
    body: ["De hittar det gamla familjespelet och fortsätter göra rummet användbart.", "Gamla minnen blandas med nytt arbete tillsammans."],
  },
  {
    id: "cottage-07-08", title: "7–8/16 · Regnet", image: "/assets/village/story-moments/act2/cabin/3.png",
    body: ["Regnet håller dem inne och de spelar det gamla spelet.", "Alve: Det låter likadant.", "Barnet: Vadå?", "Alve: Regnet.", "Barnet: Ser det ut som förr nu?", "Alve: Nej. Det ser bättre ut."],
  },
  {
    id: "cottage-09", title: "9/16 · VÅR STUGA", image: "/assets/village/story-moments/act2/cabin/4.png",
    body: ["Barnet hittar Alves gamla teckning av stugan, sjön och familjen.", "Teckningen visar verandan och ger dem nästa idé."],
  },
  {
    id: "cottage-10-11", title: "10–11/16 · Verandan", image: "/assets/village/story-moments/act2/cabin/renovating-cabin3.png",
    body: ["De börjar återställa verandan från teckningen.", "Barnet: Vet de att du är här?", "Alve: Inte riktigt."],
  },
  {
    id: "cottage-12", title: "12/16 · Någon har varit här", image: "/assets/village/story-moments/act2/cabin/5.png",
    body: ["De hittar Alves välbekanta nyckelring hemifrån.", "Barnet: Varifrån är den då?", "Alve: Hemma.", "Alve: De har varit här.", "Alve: Då måste vi hinna klart."],
  },
  {
    id: "cottage-13-15", title: "13–15/16 · Gör plats för människor", image: "/assets/village/story-moments/act2/cabin/6.png",
    body: ["De sista skadorna lagas och stugan görs redo för människor igen.", "Alve börjar föreställa sig familjen här.", "Men ingen kommer ännu."],
  },
  {
    id: "cottage-16", title: "16/16 · Stugan är klar", image: "/assets/village/story-moments/act2/cabin/6.png",
    body: ["Längdmarkeringarna, fotot, spelet och VÅR STUGA finns kvar.", "Barnet: Tror du de kommer?", "Alve: Inte idag.", "Alve: Men den är klar.", "Barnet: Vi kommer ju tillbaka imorgon.", "Alve: Ja. Vi har ju en båt att laga."],
  },
  {
    id: "jetty-01",
    title: "1/16 · Vi börjar röja",
    image: "/assets/village/story-moments/act2/jetty/01-early-restoration.png",
    body: [
      "Alve: Det här ser faktiskt ganska enkelt ut. Vi river bort de dåliga plankorna, sätter dit nya och sen är det klart.",
      "Barnet: Du låter väldigt säker.",
      "Alve: Jag har tittat på bryggan typ hundra gånger. Det är bara trä.",
      "Barnet: Det brukar vara då saker går fel.",
      "Alve: Inte den här gången. Den här gången har jag en plan.",
      "Barnet: Vad är planen?",
      "Alve: Att börja där.",
      "Barnet: Det där är inte en plan.",
      "Alve: Det är början på en plan.",
      "Ni sätter igång och börjar dra bort lösa plankor och skräp.",
      "Alve: Ser du? Det går ju bra.",
      "Barnet: Vi har jobbat i två minuter.",
      "Alve: Exakt. Och inget har gått sönder ännu.",
    ],
    stage: 1,
  },
  {
    id: "jetty-02",
    title: "2/16 · Det är värre under",
    image: "/assets/village/story-moments/act2/jetty/01-early-restoration.png",
    body: [
      "När ni fått bort mer av ytan syns de ruttna stöden undertill.",
      "Barnet: Alve, kom och titta på det här.",
      "Alve: Vad är det?",
      "Barnet: Jag tror inte det bara är plankorna.",
      "Alve: Den där är rutten.",
      "Barnet: Mm.",
      "Alve: Och den där också.",
      "Barnet: Mm.",
      "Alve: Okej. Den där med.",
      "Barnet: Fortfarande bara trä?",
      "Alve: Det är väldigt mycket trä.",
      "Barnet: Och ganska lite av det verkar vilja vara en brygga längre.",
      "Alve: Vi kan inte bara lägga nya plankor ovanpå det här.",
      "Barnet: Nej. Vi behöver nytt virke. Bra virke.",
      "Alve: Har du något sånt?",
      "Barnet: Inte jag. Men jag känner någon som brukar kunna hitta användbara grejer bland gammalt material.",
      "Alve: Vem då?",
      "Barnet: Linus. Han håller till vid Återvinningen.",
      "Alve: Tror du han har virke?",
      "Barnet: Om någon har det, så är det nog Linus.",
      "Alve: Okej. Då frågar vi honom.",
    ],
    stage: 1,
  },
  {
    id: "jetty-03",
    title: "3/16 · Linus och återbruket",
    image: "/assets/village/story-moments/act2/jetty/02-linus-salvaged-timber.png",
    body: [
      "Linus kommer ner med användbart virke från Återvinningen.",
      "Linus: Jag började misstänka att ni inte menade två plankor när ni bad om hjälp.",
      "Barnet: Vi trodde att det var två plankor.",
      "Alve: Jag trodde det.",
      "Linus: Det förklarar saken.",
      "Linus: Det här har stått blött alldeles för länge. Ni hade kunnat lägga nytt ovanpå, men då hade ni fått göra om allt igen ganska snart.",
      "Alve: Så du har något bättre?",
      "Linus: Jag har sådant som redan haft ett liv och fortfarande har ett kvar.",
      "Barnet: Återbruk.",
      "Linus: Precis. Det fina med gammalt material är att man redan vet vad det klarar.",
      "Barnet: Har du varit här mycket?",
      "Linus: Förr.",
      "Alve: Hur mycket är 'förr'?",
      "Linus: När den där bryggan fortfarande höll och Henning hade mer hår.",
      "Barnet: Var alla här nere då?",
      "Linus: Ganska ofta. Bad, fika, fiske. Sånt som händer när en plats faktiskt används.",
      "Linus: Sen slutade folk komma. Och när folk slutar komma märker ingen när saker börjar gå sönder.",
      "Alve: Då får vi väl få folk att börja komma igen.",
      "Linus: Börja med att få bryggan att stå kvar.",
      "Alve: Detaljer.",
    ],
    stage: 1,
  },
  {
    id: "jetty-04",
    title: "4/16 · Första riktiga lagningen",
    image: "/assets/village/story-moments/act2/jetty/02-linus-salvaged-timber.png",
    body: [
      "Alve: Det här känns redan mycket bättre.",
      "Barnet: Vi har inte ens satt dit allt än.",
      "Alve: Nej, men nu har vi plankor som inte går sönder när man tittar på dem.",
      "Linus: Det där kommer hålla.",
      "Alve: Hörde du?",
      "Barnet: Ja.",
      "Alve: Han sa att det kommer hålla.",
      "Linus: Jag sa inte att ni var klara.",
      "Alve: Du måste lära dig att fira små segrar, Linus.",
      "Linus: Och du måste lära dig skillnaden på en liten seger och en färdig brygga.",
      "Alve: Den rör sig nästan inte alls.",
      "Barnet: Nästan?",
      "Alve: Okej. Då fortsätter vi lite till.",
      "Linus: Nu har ni i alla fall något att bygga vidare på.",
      "Alve: Det var exakt det jag tänkte säga.",
      "Linus: Naturligtvis.",
    ],
    stage: 2,
  },
  {
    id: "jetty-05",
    title: "5/16 · Det börjar se badbart ut",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-2.png",
    body: [
      "Alve: Vet du vad som är det bästa med en brygga?",
      "Barnet: Att den inte ramlar ihop?",
      "Alve: Det är ganska bra. Men nej.",
      "Barnet: Vad då?",
      "Alve: Man kan hoppa från den.",
      "Barnet: Vi har precis fått den att sluta gå sönder.",
      "Alve: Exakt. Perfekt timing.",
      "Alve: Vattnet ser faktiskt rätt skönt ut.",
      "Barnet: Badkanten ser inte lika skön ut.",
      "Alve: Det där kan vi väl bara flytta på?",
      "Barnet: Kanske. Men vi borde nog kolla så att det faktiskt är säkert först.",
      "Alve: Du låter väldigt vuxen nu.",
      "Barnet: Jag känner Sol.",
      "Alve: Vem är Sol?",
      "Barnet: Hon driver sjukhuset i byn. Hon brukar ha koll på sånt här.",
      "Alve: Måste hon komma hit innan vi badar?",
      "Barnet: Jag tänker inte förklara för henne varför vi inte frågade.",
      "Alve: Bra argument.",
    ],
    stage: 2,
  },
  {
    id: "jetty-06",
    title: "6/16 · Sol kollar badplatsen",
    image: "/assets/village/story-moments/act2/jetty/03-sol-safety-check.png",
    body: [
      "Sol: Så det är här ni tänker bada?",
      "Alve: När vi är klara.",
      "Alve: Okej. Jag tänkte kanske lite tidigare.",
      "Sol: Det är bra att du sa det.",
      "Sol: Bryggan börjar se fin ut. Men en bra brygga och en bra badplats är inte riktigt samma sak.",
      "Alve: Vad är det som saknas?",
      "Sol: Först behöver ni få bort allt gammalt skräp här nere. Det räcker med en vass metallbit eller en trasig flaska för att en väldigt bra baddag ska bli väldigt dålig.",
      "Barnet: Det kan vi rensa.",
      "Sol: Bra. Och ni behöver göra det lätt att komma upp ur vattnet också.",
      "Alve: Sen kan vi bada?",
      "Sol: En sak till.",
      "Alve: Jag visste att det skulle komma en sak till.",
      "Sol: En riktig livboj.",
      "Alve: Behöver vi verkligen det om vi kan simma?",
      "Sol: Förhoppningen är att ni aldrig behöver använda den. Men om någon behöver den vill man inte börja leta efter en då.",
      "Barnet: Var hittar vi en?",
      "Sol: Fråga Mira. Om hon inte har en inne kan hon säkert ordna en.",
      "Alve: Okej. Rensa stranden. Livboj. Sen bada.",
      "Sol: När platsen är klar.",
      "Alve: Alla här gillar verkligen ordet 'sen'.",
      "Sol: Det brukar betyda att man får göra roliga saker fler gånger.",
    ],
    stage: 2,
  },
  {
    id: "jetty-lifebuoy",
    title: "Mellan 6 och 7 · Livbojen",
    image: "/assets/village/story-moments/act2/jetty/04-mira-lifebuoy-purchase.png",
    body: [
      "Mira: En livboj?",
      "Barnet: Sol säger att vi behöver en till bryggan.",
      "Mira: Då behöver ni en livboj.",
      "Alve: Jag tycker fortfarande att bryggan känns ganska säker.",
      "Mira: Tycker Sol det?",
      "Alve: ...inte riktigt.",
      "Mira: Då lyssnar vi på Sol.",
      "Alve: Den där ser väldigt officiell ut.",
      "Mira: Det är ofta bra när säkerhetsgrejer ser ut som säkerhetsgrejer.",
      "Barnet: Hur mycket kostar den?",
      "KÖP: 300 SysselBux",
      "Mira: Bra. Då är den er.",
      "Alve: Kan man provkasta den?",
      "Mira: Inte inne i butiken.",
      "Alve: Jag frågade bara.",
      "Mira: Och jag svarade väldigt snabbt.",
      "Mira: Försök helst att aldrig behöva använda den.",
      "Barnet: Det är planen.",
      "Alve: Min plan är att bada.",
      "Alve: Säkert.",
    ],
    stage: 2,
  },
  {
    id: "jetty-07",
    title: "7/16 · Röj badkanten",
    image: "/assets/village/story-moments/act2/jetty/05-bathing-edge-cleanup.png",
    body: [
      "Alve: Okej. Jag trodde vi skulle laga en brygga.",
      "Barnet: Det gör vi.",
      "Alve: Just nu plockar jag upp en gammal burk ur leran.",
      "Barnet: En viktig del av bryggbygge.",
      "Alve: Jag börjar förstå varför vuxna alltid säger att saker tar längre tid än man tror.",
      "Barnet: Här är mer.",
      "Alve: Hur hamnar allt det här ens här?",
      "Barnet: Folk har väl lämnat det.",
      "Alve: Då är folk dåliga på sjöar.",
      "Barnet: Nej, Valpen.",
      "Alve: Han hjälper till.",
      "Barnet: Han försöker äta det vi ska slänga.",
      "Alve: Han har en annan arbetsmetod.",
      "Alve: När vi hängt upp den där är vi nästan klara, va?",
      "Barnet: Med den här delen.",
      "Alve: Jag hörde bara 'nästan klara'.",
    ],
    stage: 2,
  },
  {
    id: "jetty-08",
    title: "8/16 · Redo för människor",
    image: "/assets/village/story-moments/act2/jetty/05-bathing-edge-cleanup.png",
    body: [
      "Barnet: Sitter den ordentligt?",
      "Alve: Japp.",
      "Barnet: Ordentligt-japp eller Alve-japp?",
      "Alve: Ordentligt-japp.",
      "Barnet: Det börjar faktiskt se ut som en riktig badplats.",
      "Alve: Det är en riktig badplats.",
      "Barnet: Den är fortfarande inte klar.",
      "Alve: Du förstör väldigt många fina ögonblick med fakta.",
      "Alve: Men tänk sen. När allt är klart.",
      "Barnet: Vadå?",
      "Alve: Folk kan komma hit. Bada. Sitta här. Vara vid sjön.",
      "Barnet: Det hade varit fint.",
      "Alve: Precis.",
      "Alve: Och då får vi bada.",
      "Barnet: Där kom det.",
    ],
    stage: 3,
  },
  {
    id: "jetty-09",
    title: "9/16 · Plats för sommaren",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-3.png",
    body: [
      "Alve: Okej, nu börjar den se ut som en plats man faktiskt vill vara på.",
      "Barnet: Det hjälper att det inte ligger plankor och verktyg överallt.",
      "Alve: Jag tyckte det såg rätt hemtrevligt ut med verktygen.",
      "Barnet: Du tycker verktyg är inredning.",
      "Alve: Bra verktyg är inredning.",
      "Barnet: Här skulle man kunna lägga handdukar.",
      "Alve: Och sitta.",
      "Barnet: Och komma ner i vattnet utan att klättra över något.",
      "Alve: Och hoppa.",
      "Barnet: Du har verkligen fastnat för det där.",
      "Alve: Det är en väldigt hoppvänlig brygga.",
      "Alve: Vet du vad som är konstigt?",
      "Barnet: Vadå?",
      "Alve: Förut såg jag bara allt som var trasigt.",
      "Barnet: Och nu?",
      "Alve: Nu ser jag mest vad man kan göra här när vi är klara.",
      "Barnet: Det är nog ett bra tecken.",
      "Alve: Eller så tänker jag bara väldigt mycket på att bada.",
      "Barnet: Också möjligt.",
    ],
    stage: 3,
  },
  {
    id: "jetty-10",
    title: "10/16 · Henning kommer ner",
    image: "/assets/village/story-moments/act2/jetty/07-henning-first-visitor.png",
    body: [
      "Henning: Jaha. Så det är här ni har gömt er.",
      "Barnet: Hej Henning.",
      "Alve: Vem är det?",
      "Barnet: Henning. Han har bageriet i byn.",
      "Henning: Och tydligen följer jag numera efter intressanta rykten.",
      "Alve: Vilka rykten?",
      "Henning: Att det faktiskt händer något nere vid sjön igen.",
      "Henning: Det här var inte dåligt.",
      "Alve: Det är inte klart.",
      "Henning: Det är därför jag sa 'inte dåligt' och inte 'klart'.",
      "Barnet: Kom du ner bara för att titta?",
      "Henning: Ja.",
      "Alve: Bara för att titta?",
      "Henning: Man får faktiskt göra saker utan att de är ett uppdrag.",
      "Henning: Det börjar kännas som en plats igen.",
      "Barnet: Vad menar du?",
      "Henning: En brygga som ingen använder är mest bara trä över vatten.",
      "Henning: Men när folk börjar komma hit igen, då är det en brygga på riktigt.",
      "Alve: Han sitter ju här nu.",
      "Barnet: Mm.",
      "Alve: Då fungerar planen.",
      "Henning: Vilken plan?",
      "Alve: Att få folk att komma tillbaka.",
      "Henning: Då kan ni räkna en.",
    ],
    stage: 3,
  },
  {
    id: "jetty-11",
    title: "11/16 · Första riktiga vattenpausen",
    image: "/assets/village/story-moments/act2/jetty/08-first-water-break.png",
    body: [
      "Alve: Äntligen.",
      "Barnet: Äntligen vad?",
      "Alve: Vi använder bryggan.",
      "Barnet: Vi sitter på den.",
      "Alve: Exakt. Det räknas.",
      "Barnet: Du är ovanligt nöjd för någon som inte fått hoppa i ännu.",
      "Alve: Jag väntar bara på rätt tillfälle.",
      "Alve: Henning hade rätt.",
      "Barnet: Om vad?",
      "Alve: Att det börjar kännas som en riktig plats.",
      "Barnet: Jag trodde det var det hela tiden.",
      "Alve: Nej. Förut var det bara den gamla trasiga bryggan.",
      "Alve: Nu känns den annorlunda.",
      "Barnet: Hur då?",
      "Alve: Som vår plats.",
      "Barnet: Ja.",
      "Barnet: Vår plats.",
      "Alve: Vår plats.",
    ],
    stage: 3,
  },
  {
    id: "jetty-12",
    title: "12/16 · Från arbetsplats till sommarplats",
    image: "/assets/village/story-moments/act2/jetty/06-late-restoration.png",
    body: [
      "Alve: Nu börjar jag få slut på saker att laga.",
      "Barnet: Det låter som ett bra problem.",
      "Alve: Lite konstigt ändå.",
      "Barnet: Vadå?",
      "Alve: Förut såg allt trasigt ut. Nu får man nästan leta efter det.",
      "Barnet: Kommer du ihåg hur den såg ut när vi började?",
      "Alve: Tyvärr.",
      "Barnet: Jag trodde faktiskt inte den skulle bli så här bra.",
      "Alve: Jag gjorde det.",
      "Alve: Okej. Jag hoppades.",
      "Alve: Det är bättre än jag tänkte.",
      "Barnet: Det där lät nästan som ett erkännande.",
      "Alve: Säg inget till Linus.",
    ],
    stage: 4,
  },
  {
    id: "jetty-13",
    title: "13/16 · Sista svaga punkten",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-4.png",
    body: [
      "Barnet: Där.",
      "Alve: Nej.",
      "Barnet: Jo.",
      "Alve: Jag tänker låtsas att jag inte såg det.",
      "Barnet: Det kommer fortfarande vara trasigt.",
      "Alve: Då var det en dålig plan.",
      "Alve: Det är inte jättemycket.",
      "Barnet: Det sa du i början också.",
      "Alve: Det här är annorlunda.",
      "Barnet: Hur då?",
      "Alve: Nu vet jag att du kommer påminna mig om det om jag har fel.",
      "Alve: Så.",
      "Barnet: Så?",
      "Alve: Nu får du hitta något mer.",
      "Barnet: Jag tror faktiskt inte jag kan.",
      "Alve: På riktigt?",
      "Barnet: På riktigt.",
    ],
    stage: 4,
  },
  {
    id: "jetty-14",
    title: "14/16 · Gör klart för att använda",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-4.png",
    body: [
      "Alve: Vad gör vi med allt det här?",
      "Barnet: Plankorna tillbaka till Linus. Verktygen bort. Skräpet slänger vi.",
      "Alve: Så vi städar.",
      "Barnet: Ja.",
      "Alve: Det känns som ett väldigt tråkigt sätt att bli klar på.",
      "Barnet: Vill du hellre lämna allt här?",
      "Alve: Nej. Det förstör lite.",
      "Alve: Oj.",
      "Barnet: Vad?",
      "Alve: Den ser större ut utan allt skräp.",
      "Barnet: Den ser färdig ut.",
      "Alve: Nästan.",
      "Barnet: Vad är kvar nu?",
      "Alve: Jag vet faktiskt inte.",
    ],
    stage: 4,
  },
  {
    id: "jetty-15",
    title: "15/16 · Är vi faktiskt klara?",
    image: "/assets/village/story-moments/act2/jetty/09-jetty-complete.png",
    body: [
      "Alve: Det känns konstigt.",
      "Barnet: Vadå?",
      "Alve: Att det inte finns något mer som är trasigt.",
      "Barnet: Vi kan säkert hitta något om vi letar riktigt noga.",
      "Alve: Nej tack.",
      "Alve: Tror du folk kommer hit nu?",
      "Barnet: Henning gjorde ju det.",
      "Alve: Ja, men fler.",
      "Barnet: Sol kanske kommer. Mira också.",
      "Alve: Linus då?",
      "Barnet: Han sa ju att alla brukade vara här förr.",
      "Alve: Då kanske han kommer tillbaka också.",
      "Barnet: Det tror jag.",
      "Alve: Tänk om det blir fullt här.",
      "Barnet: Då får vi väl dela med oss.",
      "Alve: Mm.",
      "Alve: Fast vår plats är fortfarande vår plats.",
      "Barnet: Klart den är.",
    ],
    stage: 4,
  },
  {
    id: "jetty-16",
    title: "16/16 · Bryggan är klar",
    image: "/assets/village/story-moments/act2/jetty/09-jetty-complete.png",
    body: [
      "Barnet: Inga lösa plankor.",
      "Alve: Japp.",
      "Barnet: Badkanten är röjd.",
      "Alve: Japp.",
      "Barnet: Livbojen sitter där den ska.",
      "Alve: Ordentligt-japp.",
      "Barnet: Då är den klar.",
      "Barnet: Alve?",
      "Alve: Jag vet.",
      "Barnet: Du ser inte så glad ut.",
      "Alve: Jo. Jag bara...",
      "Alve: När vi började var det bara jag här.",
      "Alve: Nu är du här. Linus har varit här. Sol. Henning.",
      "Barnet: Och Mira hjälpte till.",
      "Alve: Precis.",
      "Alve: Vi gjorde faktiskt det.",
      "Barnet: Vi gjorde det.",
      "Alve: Bryggan är klar.",
      "Barnet: Bryggan är klar.",
    ],
    stage: 4,
  },
  {
    id: "jetty-finale",
    title: "Nästa dag · Folk har kommit tillbaka",
    image: "/assets/village/story-moments/act2/jetty/10-everyone-swimming.png",
    body: [
      "Nästa dag går ni ner mot sjön igen. Redan innan ni ser bryggan hör ni röster och plask från vattnet.",
      "Alve: Hör du?",
      "Barnet: Japp.",
      "Alve: Oj.",
      "Barnet: Du sa ju att det kanske skulle bli fullt.",
      "Alve: Jag trodde inte det skulle hända direkt.",
      "Henning: Där är byggarna!",
      "Linus: Ni har gjort ett riktigt bra jobb här.",
      "Sol: Verkligen. Det är tryggt, fint och folk vill faktiskt vara här.",
      "Mira: Ni fick hela platsen att kännas levande igen.",
      "Henning: Och jag tänker ta åt mig lite av äran bara för att jag dök upp tidigt.",
      "Linus: Nej.",
      "Henning: Värt ett försök.",
      "Alve: De kom tillbaka.",
      "Barnet: Japp.",
      "Alve: Alla?",
      "Barnet: Nästan.",
      "Mira: Det här är er förtjänst.",
      "Sol: Ni gav byn tillbaka sjön.",
      "Alve: Det blev ganska bra.",
      "Barnet: Ganska?",
      "Alve: Okej då. Jättebra.",
      "Henning: Nu tänker ni väl inte stå där hela dagen?",
      "Alve: Nej.",
      "Alve: Nu badar vi.",
      "Barnet: Nu badar vi.",
    ],
    stage: 4,
  },
];

export default function Act2TestPage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Act2LakeGameHandle | null>(null);
  const [stage, setStage] = useState<Act2VisualStage>(1);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("../../game/createAct2LakeGame").then(async ({ createAct2LakeGame }) => {
      if (cancelled || !hostRef.current) return;
      gameRef.current = await createAct2LakeGame(hostRef.current, 1);
    });
    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  const chooseStage = (next: Act2VisualStage) => {
    setStage(next);
    gameRef.current?.setStage(next);
  };

  const activeBeat = storyIndex === null ? null : STORY_BEATS[storyIndex];

  const closeStory = () => setStoryIndex(null);
  const nextStory = () => {
    if (storyIndex === null) return;
    if (storyIndex >= STORY_BEATS.length - 1) {
      setStoryIndex(null);
      chooseStage(4);
      return;
    }
    const nextIndex = storyIndex + 1;
    setStoryIndex(nextIndex);
    const nextBeat = STORY_BEATS[nextIndex];
    if (nextBeat.stage) {
      chooseStage(nextBeat.stage);
    } else if (nextIndex >= 5 && nextIndex < 19) {
      const boathouseProgress = nextIndex - 5;
      if (boathouseProgress >= 14) chooseStage(4);
      else if (boathouseProgress >= 10) chooseStage(3);
      else if (boathouseProgress >= 5) chooseStage(2);
    } else if (nextIndex >= 19 && nextIndex < 29) {
      const cottageProgress = nextIndex - 19;
      if (cottageProgress >= 9) chooseStage(4);
      else if (cottageProgress >= 7) chooseStage(3);
      else if (cottageProgress >= 4) chooseStage(2);
      else chooseStage(1);
    }
  };
  const previousStory = () => {
    if (storyIndex === null || storyIndex <= 0) return;
    const previousIndex = storyIndex - 1;
    setStoryIndex(previousIndex);
    const previousBeat = STORY_BEATS[previousIndex];
    if (previousBeat.stage) chooseStage(previousBeat.stage);
  };

  return (
    <main style={{ width: "100vw", height: "100dvh", overflow: "hidden", background: "#17251c", position: "relative" }}>
      <div ref={hostRef} style={{ width: "100%", height: "100%" }} />

      <div style={{
        position: "fixed", top: "max(10px, env(safe-area-inset-top))", left: 12,
        zIndex: 20, display: "flex", gap: 8, alignItems: "center",
      }}>
        <div style={{
          padding: "7px 10px", borderRadius: 9,
          background: "rgba(255,255,255,.82)", color: "#283326", fontWeight: 700,
        }}>
          Akt 2 · sjön · testmiljö
        </div>
        <button type="button" onClick={() => setStoryIndex(0)} style={{
          minHeight: 38, border: 0, borderRadius: 9, padding: "0 13px",
          fontWeight: 800, cursor: "pointer", background: "#f4d780", color: "#283326",
        }}>
          Spela Alve + Båthuset + Stugan + Bryggan
        </button>
      </div>

      <div style={{
        position: "fixed", left: "50%", bottom: "max(12px, env(safe-area-inset-bottom))",
        transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 8,
        padding: 8, borderRadius: 14, background: "rgba(30, 38, 27, .82)",
        boxShadow: "0 4px 20px rgba(0,0,0,.25)",
      }}>
        {([1, 2, 3, 4] as Act2VisualStage[]).map((value) => (
          <button key={value} type="button" onClick={() => chooseStage(value)} style={{
            minWidth: 54, minHeight: 44, border: 0, borderRadius: 10,
            fontWeight: 800, fontSize: 16, cursor: "pointer",
            background: stage === value ? "#f4d780" : "#f5f0df",
            color: "#283326",
          }}>
            {value}/4
          </button>
        ))}
      </div>

      {activeBeat && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(9, 14, 10, .94)",
          display: "grid", placeItems: "center", padding: 16,
        }}>
          <div style={{
            width: "min(1180px, 100%)", height: "min(92dvh, 760px)",
            display: "grid", gridTemplateRows: "1fr auto",
            borderRadius: 18, overflow: "hidden", background: "#111711",
            boxShadow: "0 18px 60px rgba(0,0,0,.45)",
          }}>
            <div style={{ position: "relative", minHeight: 0, background: "#0b0f0c" }}>
              <img
                src={activeBeat.image}
                alt={activeBeat.title}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
              <button type="button" onClick={closeStory} aria-label="Stäng" style={{
                position: "absolute", top: 12, right: 12, width: 42, height: 42,
                borderRadius: 21, border: 0, cursor: "pointer", fontSize: 22, fontWeight: 800,
                background: "rgba(255,255,255,.9)", color: "#283326",
              }}>×</button>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center",
              gap: 14, padding: "14px 16px max(14px, env(safe-area-inset-bottom))",
              background: "rgba(245,240,223,.98)", color: "#283326",
            }}>
              <button type="button" onClick={previousStory} disabled={storyIndex === 0} style={{
                minWidth: 88, minHeight: 46, border: 0, borderRadius: 11, fontWeight: 800,
                cursor: storyIndex === 0 ? "default" : "pointer", opacity: storyIndex === 0 ? .35 : 1,
                background: "#d7d2bf", color: "#283326",
              }}>
                ← Förra
              </button>
              <div style={{ minWidth: 0, maxHeight: "34dvh", overflowY: "auto", paddingRight: 6 }}>
                <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 5 }}>{activeBeat.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.35 }}>
                  {activeBeat.body.map((line, index) => <div key={`${activeBeat.id}-${index}`}>{line}</div>)}
                </div>
                <div style={{ marginTop: 7, fontSize: 12, opacity: .65 }}>
                  {storyIndex! + 1} / {STORY_BEATS.length}
                </div>
              </div>
              <button type="button" onClick={nextStory} style={{
                minWidth: 88, minHeight: 46, border: 0, borderRadius: 11, fontWeight: 900,
                cursor: "pointer", background: "#f4d780", color: "#283326",
              }}>
                {storyIndex === STORY_BEATS.length - 1 ? "Klar ✓" : "Nästa →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
