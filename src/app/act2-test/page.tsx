"use client";

import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import type { Act2VisualStage } from "../../game/act2VisualAssets";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../../game/act2JettyStory";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../../game/act2CabinStory";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../../game/act2BoathouseStory";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../../game/act2MotorboatStory";
import { ACT2_FINALE_BEATS } from "../../game/act2FinaleStory";
import { StoryDebugConsole } from "../../components/story/StoryDebugConsole";
import { StoryMoment } from "../../components/story/StoryMoment";
import { StoryTranscript } from "../../components/story/StoryTranscript";
import type { StoryDebugAct } from "../../game/storyDebug";
import { ACT2_OPENING_BEATS } from "../../game/act2OpeningStory";
import { ACT2_ALVE_DIALOGUE, act2AlveImageForIndex } from "../../game/act2AlveStory";
import { loadSaveState } from "../../game/saveState";

type StoryBeat = {
  id: string;
  title: string;
  image?: string;
  lineImages?: string[];
  body: string[];
  stage?: Act2VisualStage;
};



const STORY_BEATS: StoryBeat[] = [
  ...ACT2_OPENING_BEATS.map((beat, index) => ({
    id: `opening-${String(index + 1).padStart(2, "0")}`,
    title: beat.title,
    image: beat.image,
    body: beat.body,
  })),
  {
    id: "meet-bike",
    title: "Någon är redan här",
    image: "/assets/village/story-moments/act2/meeting-alve/bike.png",
    body: ["Vad är det för cykel? Den verkar inte höra hemma här."],
  },
  {
    id: "alve-intro",
    title: "Första mötet med Alve",
    image: act2AlveImageForIndex(0),
    lineImages: ACT2_ALVE_DIALOGUE.map((_, index) => act2AlveImageForIndex(index)),
    body: ACT2_ALVE_DIALOGUE.map((beat) => {
      const text = beat.text;
      return beat.speaker === "child"
        ? `Barnet: ${text}`
        : beat.speaker === "alve"
          ? `Alve: ${text}`
          : beat.speaker === "unknown"
            ? `Okänd: ${text}`
            : text;
    }),
  },
  {
    id: "project-choice",
    title: "Vad börjar vi med?",
    image: "/assets/village/story-moments/act2/meeting-alve/pick.png",
    body: ["Alve: Du väljer. Stugan, bryggan eller båthuset?"],
  },
  ...CABIN_CONTRIBUTION_BEATS,
  CABIN_WAITING_REACTION,
  ...JETTY_CONTRIBUTION_BEATS.slice(0, 6),
  JETTY_LIFEBUOY_BEAT,
  ...JETTY_CONTRIBUTION_BEATS.slice(6),
  JETTY_COMPLETION_REACTION,
  ...BOATHOUSE_CONTRIBUTION_BEATS.slice(0, 9),
  BOATHOUSE_STEERING_WHEEL_BEAT,
  ...BOATHOUSE_CONTRIBUTION_BEATS.slice(9),
  ...MOTORBOAT_CONTRIBUTION_BEATS,
  ...ACT2_FINALE_BEATS.map((beat) => ({
    ...beat,
    stage: 4 as Act2VisualStage,
  })),

];

const storyGroupForBeat = (beat: StoryBeat) => {
  if (beat.id.startsWith("opening-")) return "Opening";
  if (beat.id === "meet-bike" || beat.id === "alve-intro" || beat.id === "project-choice") return "Meeting Alve";
  if (beat.id.startsWith("boathouse:")) return "Båthuset";
  if (beat.id.startsWith("cabin:")) return "Stugan";
  if (beat.id.startsWith("dock:") || beat.id.startsWith("jetty-")) return "Bryggan";
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
    group: storyGroupForBeat(beat),
    index,
  })),
}];

export default function Act2TestPage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Act2LakeGameHandle | null>(null);
  const [stage, setStage] = useState<Act2VisualStage>(1);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [storyLineIndex, setStoryLineIndex] = useState(0);
  const [childName, setChildName] = useState("Barnet");

  useEffect(() => {
    let cancelled = false;
    void loadSaveState().then((saved) => {
      if (!cancelled && saved?.childName?.trim()) setChildName(saved.childName.trim());
    });
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
  const activeImage = activeBeat?.lineImages?.[storyLineIndex] ?? activeBeat?.image;

  const jumpToDebugEntry = (_actId: string, entryId: string) => {
    const entry = STORY_DEBUG_ACTS[0].entries.find((candidate) => candidate.id === entryId);
    if (!entry) return;
    setStoryIndex(entry.index);
    setStoryLineIndex(0);
    const beat = STORY_BEATS[entry.index];
    if (beat?.stage) chooseStage(beat.stage);
  };

  const closeStory = () => { setStoryIndex(null); setStoryLineIndex(0); };
  const jumpToProject = (project: "cabin" | "dock" | "boathouse") => {
    const firstIndex = STORY_BEATS.findIndex((beat) =>
      project === "cabin"
        ? beat.id.startsWith("cabin:")
        : project === "dock"
          ? beat.id.startsWith("jetty-") || beat.id.startsWith("dock:")
          : beat.id.startsWith("boathouse:"),
    );
    if (firstIndex < 0) return;
    setStoryIndex(firstIndex);
    setStoryLineIndex(0);
    const beat = STORY_BEATS[firstIndex];
    if (beat.stage) chooseStage(beat.stage);
  };
  const nextStory = () => {
    if (storyIndex === null) return;
    const currentBeat = STORY_BEATS[storyIndex];
    if (storyLineIndex < currentBeat.body.length - 1) {
      setStoryLineIndex(storyLineIndex + 1);
      return;
    }
    if (storyIndex >= STORY_BEATS.length - 1) {
      setStoryIndex(null);
      setStoryLineIndex(0);
      chooseStage(4);
      return;
    }
    const nextIndex = storyIndex + 1;
    setStoryIndex(nextIndex);
    setStoryLineIndex(0);
    const nextBeat = STORY_BEATS[nextIndex];
    if (nextBeat.stage) chooseStage(nextBeat.stage);
  };
  const previousStory = () => {
    if (storyIndex === null) return;
    if (storyLineIndex > 0) {
      setStoryLineIndex(storyLineIndex - 1);
      return;
    }
    if (storyIndex <= 0) return;
    const previousIndex = storyIndex - 1;
    const previousBeat = STORY_BEATS[previousIndex];
    setStoryIndex(previousIndex);
    setStoryLineIndex(Math.max(0, previousBeat.body.length - 1));
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
        <button type="button" onClick={() => { setStoryIndex(0); setStoryLineIndex(0); }} style={{
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
        <StoryMoment
          image={activeImage}
          imageFit="contain"
          heading={activeBeat.title}
          zIndex={100}
          background={activeImage ? "rgba(9,14,10,.94)" : "rgba(9,14,10,.28)"}
          dialogueClassName="act2-dialogue-card"
          footer={
            activeBeat.id === "project-choice" ? (
              <div className="story-debug-story-nav">
                <button type="button" className="secondary-button" onClick={previousStory}>← Förra</button>
                <button type="button" className="secondary-button" onClick={() => jumpToProject("cabin")}>Stugan</button>
                <button type="button" className="secondary-button" onClick={() => jumpToProject("dock")}>Bryggan</button>
                <button type="button" className="secondary-button" onClick={() => jumpToProject("boathouse")}>Båthuset</button>
                <button type="button" className="secondary-button" onClick={closeStory}>Stäng</button>
              </div>
            ) : (
              <div className="story-debug-story-nav">
                <button type="button" className="secondary-button" onClick={previousStory} disabled={storyIndex === 0 && storyLineIndex === 0}>
                  ← Förra
                </button>
                <span>{storyIndex! + 1} / {STORY_BEATS.length} · rad {storyLineIndex + 1}/{activeBeat.body.length}</span>
                <button type="button" className="secondary-button" onClick={closeStory}>
                  Stäng
                </button>
                <button type="button" className="primary-button" onClick={nextStory}>
                  {storyIndex === STORY_BEATS.length - 1 && storyLineIndex === activeBeat.body.length - 1 ? "Klar ✓" : "Nästa →"}
                </button>
              </div>
            )
          }
        >
          <StoryTranscript childName={childName} lines={[activeBeat.body[storyLineIndex] ?? activeBeat.body[0]]} />
        </StoryMoment>
      )}
    </main>
  );
}
