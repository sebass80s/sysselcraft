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
    body: ["Barnet och Alve börjar riva bort lösa och skadade plankor.", "Alve tror först att det här kommer gå snabbt."],
    stage: 1,
  },
  {
    id: "jetty-02",
    title: "2/16 · Det är värre under",
    image: "/assets/village/story-moments/act2/jetty/01-early-restoration.png",
    body: ["När de får bort de översta plankorna syns problemet tydligare.", "Flera stöd under bryggan är också ruttna."],
    stage: 1,
  },
  {
    id: "jetty-03",
    title: "3/16 · Linus och återbruket",
    image: "/assets/village/story-moments/act2/jetty/02-linus-salvaged-timber.png",
    body: ["Linus hjälper dem hitta friskt virke som går att återanvända.", "Nu har de material som faktiskt kan bära en riktig reparation."],
    stage: 1,
  },
  {
    id: "jetty-04",
    title: "4/16 · Första riktiga lagningen",
    image: "/assets/village/story-moments/act2/jetty/02-linus-salvaged-timber.png",
    body: ["Det återbrukade virket blir den första stora strukturella lagningen.", "Bryggan börjar kännas stadig på riktigt."],
    stage: 2,
  },
  {
    id: "jetty-05",
    title: "5/16 · Det börjar se badbart ut",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-2.png",
    body: ["Alve tittar ut över vattnet och börjar prata om att bada.", "Men en starkare brygga betyder inte automatiskt en säker badplats."],
    stage: 2,
  },
  {
    id: "jetty-06",
    title: "6/16 · Sol kollar badplatsen",
    image: "/assets/village/story-moments/act2/jetty/03-sol-safety-check.png",
    body: ["Sol gör en lugn säkerhetskontroll innan någon börjar bada.", "Badkanten behöver rensas och det ska finnas en riktig livboj."],
    stage: 2,
  },
  {
    id: "jetty-lifebuoy",
    title: "Mellan 6 och 7 · Livbojen",
    image: "/assets/village/story-moments/act2/jetty/04-mira-lifebuoy-purchase.png",
    body: ["Barnet och Alve går tillbaka till byn och köper en riktig livboj av Mira för 300 SysselBux.", "Det här är ett story- och economy-beat, inte en extra contribution."],
    stage: 2,
  },
  {
    id: "jetty-07",
    title: "7/16 · Gör Sols lista verklig",
    image: "/assets/village/story-moments/act2/jetty/05-bathing-edge-cleanup.png",
    body: ["Barnet och Alve röjer badkanten och plockar bort gammalt skräp.", "Den nya livbojen är med tillbaka till sjön."],
    stage: 2,
  },
  {
    id: "jetty-08",
    title: "8/16 · Redo för människor",
    image: "/assets/village/story-moments/act2/jetty/05-bathing-edge-cleanup.png",
    body: ["Livbojen monteras permanent och nästa stora restaureringssteg blir klart.", "Nu känns platsen för första gången som en riktig badplats."],
    stage: 3,
  },
  {
    id: "jetty-09",
    title: "9/16 · Plats för sommaren",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-3.png",
    body: ["De gör den användbara delen av bryggan trevligare och lättare att använda.", "Nu finns plats att sitta, lägga handdukar och komma ner i vattnet."],
    stage: 3,
  },
  {
    id: "jetty-10",
    title: "10/16 · Henning kommer ner",
    image: "/assets/village/story-moments/act2/jetty/07-henning-first-visitor.png",
    body: ["Henning blir den första som kommer ner bara för att bryggan börjar kännas levande igen.", "Det är första beviset på att arbetet förändrar hur byborna använder sjön."],
    stage: 3,
  },
  {
    id: "jetty-11",
    title: "11/16 · Första riktiga vattenpausen",
    image: "/assets/village/story-moments/act2/jetty/08-first-water-break.png",
    body: ["Barnet och Alve tar äntligen en riktig paus vid vattnet.", "För en stund är bryggan inte ett projekt, utan deras plats."],
    stage: 3,
  },
  {
    id: "jetty-12",
    title: "12/16 · Från arbetsplats till sommarplats",
    image: "/assets/village/story-moments/act2/jetty/06-late-restoration.png",
    body: ["De gör den sista stora mittfasreparationen och städar upp den sociala delen.", "Bryggan är nästan klar, men arbetet är inte riktigt över ännu."],
    stage: 4,
  },
  {
    id: "jetty-13",
    title: "13/16 · Sista svaga punkten",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-4.png",
    body: ["Den sista delen som fortfarande känns som en arbetsplats fixas.", "Inga nya mysterier behövs. Bara det sista riktiga jobbet."],
    stage: 4,
  },
  {
    id: "jetty-14",
    title: "14/16 · Gör klart för att använda",
    image: "/assets/village/buildings/act 2/runtime/dock-stage-4.png",
    body: ["Överblivet material och arbetsstök försvinner.", "Platsen börjar handla mer om sommarliv än byggarbete."],
    stage: 4,
  },
  {
    id: "jetty-15",
    title: "15/16 · Är vi klara nu?",
    image: "/assets/village/story-moments/act2/jetty/09-jetty-complete.png",
    body: ["Barnet och Alve stannar upp och tittar ut över sjön.", "För första gången pratar de mer om vilka som kan komma hit än om vad som måste lagas."],
    stage: 4,
  },
  {
    id: "jetty-16",
    title: "16/16 · Bryggan är klar",
    image: "/assets/village/story-moments/act2/jetty/09-jetty-complete.png",
    body: ["Bryggan är färdig och livbojen sitter kvar.", "Arbetsplatsen har blivit en riktig sommarplats som byborna kan använda igen."],
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
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 5 }}>{activeBeat.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.35 }}>
                  {activeBeat.body.map((line) => <div key={line}>{line}</div>)}
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
