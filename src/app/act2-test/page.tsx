"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import type { Act2VisualStage } from "../../game/act2VisualAssets";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../../game/act2JettyStory";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../../game/act2CabinStory";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../../game/act2BoathouseStory";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../../game/act2MotorboatStory";
import { ACT2_FINALE_BEATS } from "../../game/act2FinaleStory";
import { StoryDebugConsole } from "../../components/story/StoryDebugConsole";
import type { StoryDebugAct } from "../../game/storyDebug";

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
  ...BOATHOUSE_CONTRIBUTION_BEATS.slice(0, 9),
  BOATHOUSE_STEERING_WHEEL_BEAT,
  ...BOATHOUSE_CONTRIBUTION_BEATS.slice(9),
  ...CABIN_CONTRIBUTION_BEATS,
  CABIN_WAITING_REACTION,
  ...JETTY_CONTRIBUTION_BEATS.slice(0, 6),
  JETTY_LIFEBUOY_BEAT,
  ...JETTY_CONTRIBUTION_BEATS.slice(6),
  JETTY_COMPLETION_REACTION,
  ...MOTORBOAT_CONTRIBUTION_BEATS,
  ...ACT2_FINALE_BEATS.map((beat) => ({ ...beat, stage: 4 as Act2VisualStage })),
];


const storyGroupForIndex = (index: number) => {
  if (index <= 4) return "Opening";
  if (index <= 10) return "Meeting Alve";
  const beat = STORY_BEATS[index];
  if (!beat) return "Story";
  if (beat.id.startsWith("boathouse:")) return "Båthuset";
  if (beat.id.startsWith("cabin:")) return "Stugan";
  if (beat.id.startsWith("dock:")) return "Bryggan";
  if (beat.id.startsWith("motorboat:")) return "Motorbåten";
  if (beat.id.startsWith("finale:") || beat.id.startsWith("epilogue:")) return "Finale";
  return "Story";
};

const STORY_DEBUG_ACTS: StoryDebugAct[] = [{
  id: "act2",
  label: "Act 2 · Sjön",
  entries: STORY_BEATS.map((beat, index) => ({
    id: beat.id,
    label: beat.title,
    group: storyGroupForIndex(index),
    index,
  })),
}];

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

  const jumpToDebugEntry = (_actId: string, entryId: string) => {
    const entry = STORY_DEBUG_ACTS[0].entries.find((candidate) => candidate.id === entryId);
    if (!entry) return;
    setStoryIndex(entry.index);
    const beat = STORY_BEATS[entry.index];
    if (beat?.stage) chooseStage(beat.stage);
  };

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

      <StoryDebugConsole
        acts={STORY_DEBUG_ACTS}
        activeActId="act2"
        activeEntryId={activeBeat?.id ?? null}
        onJump={jumpToDebugEntry}
        onCloseStory={closeStory}
      />

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
                <Image
                  src={activeBeat.image}
                  alt={activeBeat.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
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
