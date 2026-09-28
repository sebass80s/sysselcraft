"use client";

import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import type { Act2VisualStage } from "../../game/act2VisualAssets";

type StoryBeat = {
  id: string;
  title: string;
  image: string;
  body: string[];
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
    id: "meet-pick",
    title: "Det är mer jobb än det ser ut",
    image: "/assets/village/story-moments/act2/meeting-alve/pick.png",
    body: ["Alve har tagit med verktyg men underskattat hur mycket som måste göras."],
  },
  {
    id: "meet-shows",
    title: "Alve visar sjön",
    image: "/assets/village/story-moments/act2/meeting-alve/alve-shows.png",
    body: ["Barnet erbjuder sig att hjälpa till.", "Alve börjar visa vad som behöver räddas."],
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
    setStoryIndex(storyIndex + 1);
    if (storyIndex + 1 >= 5) {
      const boathouseProgress = storyIndex + 1 - 5;
      if (boathouseProgress >= 14) chooseStage(4);
      else if (boathouseProgress >= 10) chooseStage(3);
      else if (boathouseProgress >= 5) chooseStage(2);
    }
  };
  const previousStory = () => {
    if (storyIndex === null || storyIndex <= 0) return;
    setStoryIndex(storyIndex - 1);
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
          Spela Alve + Båthuset
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
