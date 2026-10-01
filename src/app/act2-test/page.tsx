"use client";

import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import type { Act2VisualStage } from "../../game/act2VisualAssets";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../../game/act2JettyStory";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../../game/act2CabinStory";

type StoryBeat = {
  id: string;
  title: string;
  image?: string;
  body: string[];
  stage?: Act2VisualStage;
};

const STORY_BEATS: StoryBeat[] = [
  {
    id: "opening-01",
    title: "Valpen sticker",
    image: "/assets/village/story-moments/act2/opening/01-dog-runs-off.png",
    body: [
      "Du hinner knappt reagera innan valpen plötsligt spetsar öronen och springer iväg.",
      "Barnet: Hallå?",
      "Barnet: Vart ska du?",
      "Valpen vänder sig inte ens om. Den bara fortsätter, rakt bort från byn och in mot skogen.",
      "Barnet: Men vänta!",
      "Barnet: Du får inte bara dra sådär.",
      "Valpen försvinner mellan träden. Du tvekar en sekund. Sedan springer du efter.",
    ],
  },
  {
    id: "opening-02",
    title: "In i skogen",
    image: "/assets/village/story-moments/act2/opening/02-into-the-forest.png",
    body: [
      "Stigen blir smalare ju längre in du kommer. Valpen syns långt framför dig mellan träden, som om den redan vet exakt vart den ska.",
      "Barnet: Sakta ner!",
      "Barnet: Jag kommer ju!",
      "Skogen blir tätare omkring dig. Det är inte läskigt. Bara längre bort än du brukar gå.",
      "Barnet: Om du springer vilse får du faktiskt skylla dig själv.",
      "Valpen fortsätter glatt framåt.",
    ],
  },
  {
    id: "opening-03",
    title: "Något där framme",
    image: "/assets/village/story-moments/act2/opening/03-through-the-trees.png",
    body: [
      "Efter en stund förändras ljuset mellan träden. Det blir ljusare längre fram, och mellan stammarna skymtar något blått.",
      "Barnet: Vad är det där?",
      "Det glittrar till mellan grenarna igen. Vatten. Eller något som ser ut som vatten.",
      "Barnet: Har du sprungit hit hela tiden bara för att visa något?",
      "Valpen väntar ett ögonblick, sedan fortsätter den.",
    ],
  },
  {
    id: "opening-04",
    title: "Sjön",
    image: "/assets/village/story-moments/act2/opening/04-first-view-of-the-lake.png",
    body: [
      "Du kommer ut ur skogen och stannar.",
      "Framför dig breder sjön ut sig, blank och stor i ljuset. Valpen har redan hunnit ner mot stranden och nosar omkring som om platsen vore världens mest självklara sak.",
      "För dig är allt nytt: skogen, vattnet, stranden.",
      "Det känns som att du hittat ett helt nytt ställe som ingen berättat om.",
      "Barnet: Oj.",
      "Du tar några steg fram och ser dig omkring. Någonstans här finns det mer än bara sjön. Det känns direkt.",
    ],
  },
  {
    id: "opening-05",
    title: "Där borta",
    image: "/assets/village/story-moments/act2/opening/05-the-bicycle.png",
    body: [
      "När du kommer lite längre fram får du syn på något mellan träden. Du stannar.",
      "Lutad mot en stam, en bit bort, står en cykel. Valpen har också fått syn på den och saktar ner.",
      "Barnet: Va?",
      "Barnet: Vems är den där?",
      "Du kisar mot platsen längre fram. Cykeln står inte mitt i skogen av sig själv. Någon måste ha lämnat den där.",
      "Barnet: Okej…",
      "Du tar några försiktiga steg framåt.",
      "Barnet: Då är det nog någon här.",
    ],
  },
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
  ...CABIN_CONTRIBUTION_BEATS,
  CABIN_WAITING_REACTION,
  ...JETTY_CONTRIBUTION_BEATS.slice(0, 6),
  JETTY_LIFEBUOY_BEAT,
  ...JETTY_CONTRIBUTION_BEATS.slice(6),
  JETTY_COMPLETION_REACTION,
  {
    id: "finale-01",
    title: "Någon är där",
    image: "/assets/village/story-moments/act2/finale/01-something-is-different.png",
    body: [
      "När ni kommer tillbaka mot stugan stannar Alve plötsligt.",
      "Alve: Vänta.",
      "Barnet: Vad?",
      "Alve: Dörren.",
      "Barnet: Vad är det med den?",
      "Alve: Den är öppen.",
      "Ni hör ett ljud inifrån.",
      "Alve: Det är någon där.",
      "Barnet: Ja.",
      "Alve: Det kan vara inbrottstjuvar.",
      "Barnet: I en stuga mitt ute vid sjön?",
      "Alve: Perfekt ställe för inbrottstjuvar.",
      "Barnet: Vad skulle de stjäla?",
      "Alve: Spelet.",
      "Barnet: Ingen bryter sig in för att stjäla ditt gamla spel.",
      "Alve: Du vet inte hur bra det är.",
    ],
    stage: 4,
  },
  {
    id: "finale-02",
    title: "De kom",
    image: "/assets/village/story-moments/act2/finale/02-family-return.png",
    body: [
      "Alve öppnar dörren försiktigt och stannar.",
      "Inne i stugan står hans pappa och storasyster bland väskor och flyttlådor.",
      "Barnet: Alve?",
      "Pappan: Alve?",
      "Alve: Vad gör ni här?",
      "Pappan: Vi tänkte att det var dags.",
      "Alve: Ni kom.",
      "Pappan: Ja.",
      "Pappan: Jag har åkt hitåt flera gånger.",
      "Alve: Hitåt?",
      "Pappan: Jag kom inte hela vägen.",
      "Alve: Varför inte?",
      "Pappan: Det var svårt att vara här.",
      "Pappan: Men den här gången kändes det annorlunda.",
      "Pappan: Du har gjort allt det här?",
      "Alve: Vi gjorde det.",
      "Pappan: Det är fantastiskt.",
      "Storasystern: De är kvar.",
      "Alve: Klart de är.",
      "Pappan: Du satte upp den igen.",
      "Alve: Ja.",
      "Pappan: Bra.",
    ],
    stage: 4,
  },
  {
    id: "finale-03",
    title: "Min kompis",
    image: "/assets/village/story-moments/act2/finale/03-family-embrace.png",
    body: [
      "Alve: Ska ni stanna?",
      "Pappan: Ja.",
      "Alve: Hur länge?",
      "Pappan: Vi tänkte börja med sommaren.",
      "Barnet: Du kan säga det.",
      "Alve: Vadå?",
      "Barnet: Att du är glad.",
      "Alve: Jag är jätteglad.",
      "Alve: Jag försöker bara att inte vara konstig.",
      "Barnet: Det går sådär.",
      "Storasystern går fram först och kastar armarna om Alve. Pappan drar in dem båda.",
      "Låt återföreningen landa.",
      "Storasystern: Och vem är det där?",
      "Alve: Det är min kompis.",
    ],
    stage: 4,
  },
  {
    id: "finale-04",
    title: "Det är bättre",
    image: "/assets/village/story-moments/act2/finale/04-home-again.png",
    body: [
      "En stund senare sitter Barnet och Alve på verandan. För en gångs skull verkar Alve inte ha bråttom någonstans.",
      "Alve: Jag trodde att om jag lagade stugan så skulle allt bli som förr.",
      "Barnet: Blev det det?",
      "Alve: Nej.",
      "Alve: Jag kunde inte laga det som hände.",
      "Alve: Men jag kunde laga stugan.",
      "Barnet: Du lagade mer än stugan.",
      "Alve: Kanske.",
      "Alve: Det är inte riktigt som förr.",
      "Barnet: Nej.",
      "Alve: Det är bättre.",
    ],
    stage: 4,
  },
  {
    id: "finale-departure",
    title: "Första turen",
    body: [
      "Lite senare står Barnet och Alve vid den färdiga motorbåten.",
      "Alve: Nu behöver jag inte vänta här längre.",
      "Barnet: De kom.",
      "Alve: Ja.",
      "Alve: De kom faktiskt.",
      "Alve: Vet du vad jag tänkt på?",
      "Barnet: Det låter farligt.",
      "Alve: Andra sidan.",
      "Barnet: Vad finns där?",
      "Alve: Jag minns inte riktigt.",
      "Alve: Det finns bara ett sätt att ta reda på det.",
      "Pappan: Inte för långt!",
      "Alve: Det där känner jag igen.",
      "Barnet: Kommer du lyssna?",
      "Alve: Självklart.",
      "Alve: Ungefär.",
      "Motorn startar. Båten lämnar bryggan.",
      "Barnet: Redo?",
      "Alve: Japp.",
      "Barnet: Vart åker vi?",
      "Alve: Vi får se.",
      "SLUT PÅ ANDRA KAPITLET",
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
          Spela Act 2-storyn + finalen
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
          background: activeBeat.image ? "rgba(9, 14, 10, .94)" : "rgba(9, 14, 10, .28)",
          display: "grid", placeItems: activeBeat.image ? "center" : "end center", padding: 16,
        }}>
          <div style={{
            width: activeBeat.image ? "min(1180px, 100%)" : "min(920px, 100%)",
            height: activeBeat.image ? "min(92dvh, 760px)" : "auto",
            maxHeight: activeBeat.image ? undefined : "52dvh",
            display: "grid", gridTemplateRows: activeBeat.image ? "1fr auto" : "auto",
            borderRadius: 18, overflow: "hidden", background: activeBeat.image ? "#111711" : "transparent",
            boxShadow: "0 18px 60px rgba(0,0,0,.45)",
          }}>
            {activeBeat.image && (
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
            )}

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
