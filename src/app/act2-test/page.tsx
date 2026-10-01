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

type StoryBeat = {
  id: string;
  title: string;
  image?: string;
  body: string[];
  stage?: Act2VisualStage;
};

const OPENING: OpeningBeat[] = [
  {
    image: "/assets/village/story-moments/act2/opening/01-dog-runs-off.png",
    title: "Valpen sticker",
    body: [
      "Du och Valpen är nästan framme vid skogsbrynet när han plötsligt stannar.",
      "Öronen åker upp.",
      "Han står helt stilla och tittar in mellan träden.",
      "Barnet: Vad är det?",
      "Valpen tar några steg framåt, nosar i luften och sedan far han iväg.",
      "Barnet: Hallå!",
      "Han springer rakt över den sista öppna marken och in bland träden.",
      "Barnet: Valpen! Vänta!",
      "Du hinner bara se svansen försvinna bakom en gran.",
      "Du tittar tillbaka mot byn.",
      "Sedan mot skogen.",
      "Barnet: Du får inte bara dra sådär.",
      "Inget svar. Bara något som prasslar längre in.",
      "Du springer efter.",
    ],
  },
  {
    image: "/assets/village/story-moments/act2/opening/02-into-the-forest.png",
    title: "In i skogen",
    body: [
      "Stigen är tydlig i början, men blir snabbt smalare.",
      "Grenar hänger ut över den och marken är full av rötter, mossa och gamla löv.",
      "Valpen syns långt framför dig mellan träden.",
      "Barnet: Sakta ner! Jag kommer ju!",
      "Han stannar ett ögonblick och tittar tillbaka.",
      "Sedan springer han vidare.",
      "Barnet: Jaha. Tack.",
      "Ju längre du kommer desto tätare blir skogen. Bakom dig går det nästan inte längre att se var du kom ifrån.",
      "Du kliver över en rot och duckar under en låg gren.",
      "Barnet: Du vet väl vart du ska?",
      "Valpen fortsätter utan att tveka.",
      "Barnet: Bra. För det gör inte jag.",
    ],
  },
  {
    image: "/assets/village/story-moments/act2/opening/03-through-the-trees.png",
    title: "Något där framme",
    body: [
      "Efter en stund märker du att skogen förändras.",
      "Det blåser lite mer mellan träden.",
      "Ljuset framför dig är starkare.",
      "Valpen saktar äntligen ner.",
      "Barnet: Vad har du hittat?",
      "Du går ikapp honom.",
      "Mellan två stammar glittrar något blått till långt där framme.",
      "Du tar några steg åt sidan för att se bättre.",
      "Det glittrar igen.",
      "Barnet: Är det vatten?",
      "Valpen börjar gå mot ljuset.",
      "Inte springa längre.",
      "Nästan som om han väntar på dig.",
      "Barnet: Var det hit du skulle?",
      "Han fortsätter framåt.",
      "Du följer efter.",
    ],
  },
  {
    image: "/assets/village/story-moments/act2/opening/04-first-view-of-the-lake.png",
    title: "Sjön",
    body: [
      "Träden tar plötsligt slut.",
      "Du kommer ut ur skogen och stannar.",
      "Framför dig ligger en stor sjö.",
      "Vattnet sträcker sig långt bort mellan skogsklädda stränder och klippor. Efter den täta skogen känns platsen nästan enorm.",
      "Valpen springer ner mot vattnet och börjar nosa längs strandkanten.",
      "Du blir stående kvar en stund.",
      "Barnet: Oj.",
      "Du går långsamt ner mot stranden.",
      "Det finns inga hus omkring dig. Ingen väg. Ingen butik. Ingen som ropar från byn.",
      "Bara sjön, skogen och den gamla stigen bakom dig.",
      "Barnet: Hur har jag aldrig sett det här?",
      "Valpen är redan på väg vidare längs stranden.",
      "Barnet: Du tänker inte börja springa igen va?",
      "Han fortsätter.",
      "Barnet: Såklart.",
      "Du följer efter.",
    ],
  },
  {
    image: "/assets/village/story-moments/act2/opening/05-the-bicycle.png",
    title: "Cykeln",
    body: [
      "Efter en bit lämnar ni stranden och går in bland träden igen.",
      "Inte långt.",
      "Valpen stannar.",
      "Den här gången ser du direkt vad han tittar på.",
      "Längre fram står en cykel lutad mot ett träd.",
      "Du stannar också.",
      "Barnet: Va?",
      "Cykeln är långt bort, men den är alldeles för ren och hel för att ha stått där övergiven särskilt länge.",
      "Valpen börjar gå mot den.",
      "Barnet: Vems är den där?",
      "Du tittar runt mellan träden.",
      "För första gången känns platsen inte tom längre.",
      "Någon har cyklat hit.",
      "Och om cykeln är kvar så borde personen också vara det.",
      "Barnet: Okej…",
      "Du börjar gå mot cykeln.",
      "Barnet: Då är det någon här.",
    ],
  },
];

const STORY_BEATS: StoryBeat[] = OPENING.map((beat, index) => ({
  id: `opening-${String(index + 1).padStart(2, "0")}`,
  title: beat.title,
  image: beat.image,
  body: beat.body,
})).concat([
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

]);


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
  const [storyLineIndex, setStoryLineIndex] = useState(0);

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
    setStoryLineIndex(0);
    const beat = STORY_BEATS[entry.index];
    if (beat?.stage) chooseStage(beat.stage);
  };

  const closeStory = () => { setStoryIndex(null); setStoryLineIndex(0); };
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
          image={activeBeat.image}
          imageFit="contain"
          heading={activeBeat.title}
          zIndex={100}
          background={activeBeat.image ? "rgba(9,14,10,.94)" : "rgba(9,14,10,.28)"}
          dialogueClassName="act2-dialogue-card"
          scrollable
          footer={
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
          }
        >
          <StoryTranscript lines={[activeBeat.body[storyLineIndex] ?? activeBeat.body[0]]} />
        </StoryMoment>
      )}
    </main>
  );
}
