/**
 * LOCKED PRESENTATION EXPORT of OPEN-001..005 and PARK-001.
 * Source: docs/ACT3_STORY_MANIFEST.md and act3ContentRegistry.json digests.
 * Spoken dialogue is verbatim, except the player-name token and Du speaker label.
 * Narration uses second-person Du/dig. Never edit without source QA.
 */
export type Act3OpeningLine = Readonly<{speaker: "Du" | "Nova" | "Alve" | null; text: string}>;
export type Act3OpeningBeat = Readonly<{
  id: string;
  title: string;
  image: string;
  sourceDigest: string;
  lines: readonly Act3OpeningLine[];
}>;
export const ACT3_OPENING_BEATS: readonly Act3OpeningBeat[] = [
  {
    "id": "A3-OPEN-001",
    "title": "Hamnen",
    "image": "/assets/village/story-moments/act3/open/OPEN-001.png",
    "sourceDigest": "6e459134",
    "lines": [
      {
        "speaker": null,
        "text": "Motorbåten glider in mellan bryggorna."
      },
      {
        "speaker": null,
        "text": "Längs kajen ligger segelbåtar och små motorbåtar. Bakom hamnen reser sig flera våningar höga hus. En buss stannar vid torget och människor promenerar längs vattnet."
      },
      {
        "speaker": "Alve",
        "text": "Kolla alla båtar! Den där har till och med två motorer."
      },
      {
        "speaker": "Du",
        "text": "Vi kan lägga till där borta."
      },
      {
        "speaker": null,
        "text": "Alve hoppar upp på bryggan med förtöjningslinan."
      },
      {
        "speaker": "Alve",
        "text": "Kasta hit den andra tampen!"
      },
      {
        "speaker": null,
        "text": "Du kastar repet."
      },
      {
        "speaker": "Alve",
        "text": "Sådär. Nu kommer vi åtminstone inte driva iväg."
      },
      {
        "speaker": null,
        "text": "De kliver upp på bryggan."
      },
      {
        "speaker": "Alve",
        "text": "Undrar om det finns någon som säljer glass här."
      },
      {
        "speaker": "Du",
        "text": "Vi kan börja med att hitta centrum."
      }
    ]
  },
  {
    "id": "A3-OPEN-002",
    "title": "Tjejen på kajen",
    "image": "/assets/village/story-moments/act3/open/OPEN-002.png",
    "sourceDigest": "a95c028d",
    "lines": [
      {
        "speaker": null,
        "text": "På en bänk längre bort sitter en tjej med stora hörlurar. Hon håller mobilen i handen och har dragit upp knäna mot bröstet."
      },
      {
        "speaker": null,
        "text": "Du går fram till henne."
      },
      {
        "speaker": "Du",
        "text": "Ursäkta, vet du hur man kommer till centrum?"
      },
      {
        "speaker": null,
        "text": "Tjejen tittar upp och drar av sig ena hörluren."
      },
      {
        "speaker": "Nova",
        "text": "Vad?"
      },
      {
        "speaker": "Du",
        "text": "Centrum. Vi har precis kommit hit med båten."
      },
      {
        "speaker": "Nova",
        "text": "Trappan bakom kiosken. Sen rakt fram."
      },
      {
        "speaker": "Du",
        "text": "Tack! Jag heter {childName}."
      },
      {
        "speaker": "Nova",
        "text": "Jaha?"
      },
      {
        "speaker": "Du",
        "text": "Vad heter du?"
      },
      {
        "speaker": "Nova",
        "text": "Brukar du gå fram till folk du inte känner och fråga vad de heter?"
      },
      {
        "speaker": "Du",
        "text": "Ibland."
      },
      {
        "speaker": null,
        "text": "Nova granskar dig."
      },
      {
        "speaker": "Nova",
        "text": "Nova."
      },
      {
        "speaker": "Du",
        "text": "Bor du här?"
      },
      {
        "speaker": "Nova",
        "text": "Ja. Och jag försöker faktiskt lyssna på musik."
      },
      {
        "speaker": null,
        "text": "Hon sätter tillbaka hörluren."
      },
      {
        "speaker": null,
        "text": "Du vänder sig mot Alve, som står vid båten."
      },
      {
        "speaker": "Alve",
        "text": "Fick du veta var centrum ligger?"
      },
      {
        "speaker": "Du",
        "text": "Bakom kiosken."
      },
      {
        "speaker": null,
        "text": "Nova har hört dem och lyfter blicken igen."
      }
    ]
  },
  {
    "id": "A3-OPEN-003",
    "title": "Båten",
    "image": "/assets/village/story-moments/act3/open/OPEN-003.png",
    "sourceDigest": "503890be",
    "lines": [
      {
        "speaker": "Nova",
        "text": "Vänta. Är det ni som kom med den där gamla motorbåten?"
      },
      {
        "speaker": "Du",
        "text": "Ja."
      },
      {
        "speaker": "Nova",
        "text": "Den såg ut att knappt komma in i hamnen."
      },
      {
        "speaker": "Du",
        "text": "Vi har renoverat den. Den fungerar faktiskt ganska bra nu."
      },
      {
        "speaker": "Nova",
        "text": "Har ni renoverat en motorbåt?"
      },
      {
        "speaker": "Du",
        "text": "Jag och Alve. Fast vi fick hjälp också."
      },
      {
        "speaker": "Nova",
        "text": "Var kommer ni ifrån?"
      },
      {
        "speaker": "Du",
        "text": "Andra sidan sjön. Det finns en liten by där och en stuga ute i skogen."
      },
      {
        "speaker": "Nova",
        "text": "Och ni åkte hit bara för att titta runt?"
      },
      {
        "speaker": "Du",
        "text": "Vi ville se vad som fanns på andra sidan sjön."
      },
      {
        "speaker": "Nova",
        "text": "Ni kunde väl ha kollat på en karta?"
      },
      {
        "speaker": "Du",
        "text": "Det är roligare att åka båt."
      },
      {
        "speaker": "Nova",
        "text": "Får ni verkligen åka så långt själva?"
      },
      {
        "speaker": "Du",
        "text": "Ja. Varför?"
      },
      {
        "speaker": "Nova",
        "text": "Mina föräldrar skulle aldrig komma överens om det."
      },
      {
        "speaker": null,
        "text": "Nova tittar ner på mobilen. Ett meddelande har dykt upp på skärmen."
      },
      {
        "speaker": null,
        "text": "Hon läser det, suckar och lägger undan telefonen."
      },
      {
        "speaker": "Du",
        "text": "Har det hänt något?"
      },
      {
        "speaker": "Nova",
        "text": "Nej."
      },
      {
        "speaker": "Du",
        "text": "Du ser ledsen ut."
      },
      {
        "speaker": "Nova",
        "text": "Jag är mest trött på att alla ska bestämma saker hela tiden."
      },
      {
        "speaker": "Du",
        "text": "Vadå för saker?"
      },
      {
        "speaker": "Nova",
        "text": "Strunt samma. Du känner inte ens mig."
      },
      {
        "speaker": null,
        "text": "Du tittar mot motorbåten."
      },
      {
        "speaker": "Du",
        "text": "Nä. Men du får gärna följa med och kolla på stan."
      },
      {
        "speaker": "Nova",
        "text": "Jag bor ju här."
      },
      {
        "speaker": "Du",
        "text": "Just det. Då kanske du kan visa oss något istället."
      },
      {
        "speaker": null,
        "text": "Nova tittar upp igen."
      },
      {
        "speaker": "Nova",
        "text": "Ni vet alltså verkligen ingenting om den här stan?"
      },
      {
        "speaker": "Du",
        "text": "Inte ens var parken ligger. Finns det något roligt att göra här?"
      }
    ]
  },
  {
    "id": "A3-OPEN-004",
    "title": "Den gamla parken",
    "image": "/assets/village/story-moments/act3/open/OPEN-004.png",
    "sourceDigest": "a68db241",
    "lines": [
      {
        "speaker": "Nova",
        "text": "Det finns ett köpcentrum. Och en biograf."
      },
      {
        "speaker": "Du",
        "text": "Något utomhus?"
      },
      {
        "speaker": "Nova",
        "text": "Det finns en park vid vattnet. En gammal folkpark."
      },
      {
        "speaker": "Du",
        "text": "Vad finns där?"
      },
      {
        "speaker": "Nova",
        "text": "Minigolf, en scen, ett kafé. En badbrygga också."
      },
      {
        "speaker": "Du",
        "text": "Det låter ju kul."
      },
      {
        "speaker": "Nova",
        "text": "Det var bättre förr. Nu är halva minigolfbanan trasig och lamporna vid scenen fungerar knappt."
      },
      {
        "speaker": "Du",
        "text": "Varför lagar ingen det?"
      },
      {
        "speaker": "Nova",
        "text": "Vet inte. Kommunen kanske inte bryr sig."
      },
      {
        "speaker": "Du",
        "text": "Vi skulle kunna hjälpa till."
      },
      {
        "speaker": null,
        "text": "Nova tittar upp från mobilen."
      },
      {
        "speaker": "Nova",
        "text": "Med vadå?"
      },
      {
        "speaker": "Du",
        "text": "Laga minigolfbanan. Eller lamporna."
      },
      {
        "speaker": "Nova",
        "text": "Du har inte ens sett parken."
      },
      {
        "speaker": "Du",
        "text": "Nej, men vi hade aldrig lagat en motorbåt heller."
      },
      {
        "speaker": null,
        "text": "Nova kastar en blick mot båten."
      },
      {
        "speaker": "Nova",
        "text": "Du tror att ni kan komma hit och börja laga saker som ni hittar?"
      },
      {
        "speaker": "Du",
        "text": "Vi kan åtminstone titta på vad som behöver göras."
      },
      {
        "speaker": "Nova",
        "text": "Det är inte så enkelt."
      },
      {
        "speaker": "Du",
        "text": "Det var inte båten heller."
      },
      {
        "speaker": null,
        "text": "Nova blir tyst en stund."
      },
      {
        "speaker": "Nova",
        "text": "Det finns faktiskt ett gammalt förråd bakom scenen. Där brukade de ha verktyg och färg."
      },
      {
        "speaker": "Du",
        "text": "Finns det kvar?"
      },
      {
        "speaker": "Nova",
        "text": "Jag vet inte. Det är länge sedan jag var där."
      },
      {
        "speaker": "Du",
        "text": "Ska vi gå och kolla?"
      },
      {
        "speaker": "Nova",
        "text": "Varför är du så intresserad av den där parken?"
      },
      {
        "speaker": "Du",
        "text": "Du sa ju att den brukade vara rolig. Det vore synd om den bara fick stå och förfalla."
      },
      {
        "speaker": null,
        "text": "Nova tittar bort mot stan."
      },
      {
        "speaker": "Nova",
        "text": "Den var faktiskt riktigt fin en gång."
      },
      {
        "speaker": "Du",
        "text": "Vill du visa oss?"
      },
      {
        "speaker": "Nova",
        "text": "Jag kan visa var den ligger. Men jag lovar inte att ni får hålla på med någonting där."
      },
      {
        "speaker": "Du",
        "text": "Vi börjar med att titta."
      },
      {
        "speaker": null,
        "text": "Nova stoppar mobilen i bakfickan och hänger hörlurarna runt halsen."
      },
      {
        "speaker": "Nova",
        "text": "Okej. Men då går vi längs vattnet. Det är närmare."
      },
      {
        "speaker": null,
        "text": "Alve kommer tillbaka från båten."
      },
      {
        "speaker": "Alve",
        "text": "Ska vi någonstans?"
      },
      {
        "speaker": "Du",
        "text": "Nova ska visa oss en park."
      },
      {
        "speaker": "Alve",
        "text": "Har de glass där?"
      },
      {
        "speaker": "Nova",
        "text": "Det finns ett kafé."
      },
      {
        "speaker": "Alve",
        "text": "Perfekt."
      },
      {
        "speaker": "Nova",
        "text": "Jag sa inte att det var öppet."
      },
      {
        "speaker": null,
        "text": "Nova börjar gå längs kajen."
      },
      {
        "speaker": null,
        "text": "Du och Alve följer efter."
      }
    ]
  },
  {
    "id": "A3-OPEN-005",
    "title": "På väg mot parken",
    "image": "/assets/village/story-moments/act3/open/OPEN-005.png",
    "sourceDigest": "68ce843f",
    "lines": [
      {
        "speaker": null,
        "text": "De lämnar hamnen och följer strandpromenaden."
      },
      {
        "speaker": null,
        "text": "En cyklist ringer på klockan när de går för brett över gångvägen."
      },
      {
        "speaker": "Nova",
        "text": "Håll till höger. Det är cykelbana på andra sidan strecket."
      },
      {
        "speaker": null,
        "text": "Du flyttar sig."
      },
      {
        "speaker": "Du",
        "text": "Hur länge har du bott här?"
      },
      {
        "speaker": "Nova",
        "text": "Hela livet."
      },
      {
        "speaker": "Du",
        "text": "Då måste du kunna varenda väg."
      },
      {
        "speaker": "Nova",
        "text": "Nästan. Jag brukade cykla hit hela tiden."
      },
      {
        "speaker": "Du",
        "text": "Till parken?"
      },
      {
        "speaker": "Nova",
        "text": "Mm. Vi spelade minigolf där nästan varje helg."
      },
      {
        "speaker": "Du",
        "text": "Vilken bana var svårast?"
      },
      {
        "speaker": "Nova",
        "text": "Sjuan. Den hade en liten bro där bollen alltid fastnade."
      },
      {
        "speaker": "Du",
        "text": "Fick du någonsin i den?"
      },
      {
        "speaker": "Nova",
        "text": "En gång. På första slaget, faktiskt."
      },
      {
        "speaker": "Du",
        "text": "Då får du visa hur man gör."
      },
      {
        "speaker": null,
        "text": "Nova tittar på dig."
      },
      {
        "speaker": "Nova",
        "text": "Om banan ens finns kvar."
      },
      {
        "speaker": null,
        "text": "De fortsätter längs vattnet."
      },
      {
        "speaker": null,
        "text": "Längre fram skymtar parkens gamla entréskylt mellan träden."
      }
    ]
  },
  {
    "id": "A3-PARK-001",
    "title": "Parken",
    "image": "/assets/village/story-moments/act3/park/PARK-001.png",
    "sourceDigest": "f35966ec",
    "lines": [
      {
        "speaker": null,
        "text": "En bred grusgång leder fram till två gamla tegelpelare. Mellan dem hänger en stor skylt med texten FOLKPARKEN."
      },
      {
        "speaker": null,
        "text": "Bakom entrén breder parken ut sig. Höga träd, gräsmattor och blomrabatter. Några barn leker vid en klätterställning och längre bort hörs musik från ett kafé."
      },
      {
        "speaker": "Nova",
        "text": "Här är den."
      },
      {
        "speaker": "Du",
        "text": "Oj, den är ju jättestor!"
      },
      {
        "speaker": "Alve",
        "text": "Större än hela min tomt."
      },
      {
        "speaker": "Nova",
        "text": "Det finns en badplats på andra sidan också. Och minigolf bakom lekplatsen."
      },
      {
        "speaker": "Du",
        "text": "Vad brukar du göra här?"
      },
      {
        "speaker": "Nova",
        "text": "Inte så mycket längre."
      },
      {
        "speaker": "Du",
        "text": "Men när du var här förut?"
      },
      {
        "speaker": "Nova",
        "text": "Minigolf. Badade. Köpte alldeles för dyr glass."
      },
      {
        "speaker": "Alve",
        "text": "Hur dyr?"
      },
      {
        "speaker": "Nova",
        "text": "För dyr för dig."
      },
      {
        "speaker": "Alve",
        "text": "Det vet du inte."
      },
      {
        "speaker": null,
        "text": "Nova ler lite och börjar gå."
      },
      {
        "speaker": "Nova",
        "text": "Kom. Jag ska visa er den bästa banan."
      }
    ]
  }
];

/** Replace the player's name in one authored introduction, never invent one. */
export function renderAct3OpeningText(text: string, childName: string): string {
  if (!text.includes("{childName}")) return text;
  const name = childName.trim();
  return name && name.toLocaleLowerCase("sv") !== "barnet"
    ? text.replaceAll("{childName}", name)
    : text.replace("Tack! Jag heter {childName}.", "Tack!").replaceAll("{childName}", "");
}
