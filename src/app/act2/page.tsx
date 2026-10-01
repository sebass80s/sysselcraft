"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import {
  createDefaultAct2RuntimeState,
  act2FinalePending,
  advanceAct2Finale,
  isMotorboatUnlocked,
  loadAct2RuntimeState,
  consumeProjectCompletionReaction,
  boathousePurchaseRequired,
  jettyPurchaseRequired,
  motorboatNamingRequired,
  motorboatPartsPurchaseRequired,
  nextAct2Contribution,
  prerequisiteCompletionCount,
  projectCompletionReactionPending,
  saveAct2RuntimeState,
  withBackendClaimBaseline,
  withBackendStoryFlags,
  withMotorboatName,
  withPresentedContribution,
  withSelectedProject,
  type Act2Project,
  type Act2RuntimeState,
} from "../../game/act2RuntimeState";
import { loadSaveState } from "../../game/saveState";
import { getPairedChildId } from "../../backend/childDeviceBinding";
import { getChildGameState } from "../../backend/familyRepository";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../../game/act2JettyStory";
import { CABIN_CONTRIBUTION_BEATS, CABIN_WAITING_REACTION } from "../../game/act2CabinStory";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../../game/act2BoathouseStory";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../../game/act2MotorboatStory";
import { ACT2_FINALE_BEATS } from "../../game/act2FinaleStory";
import { StoryMoment } from "../../components/story/StoryMoment";
import { StoryRunner } from "../../components/story/StoryRunner";

type OpeningBeat = { image: string; title: string; body: string[] };
type DialogueBeat = { speaker?: "child" | "unknown" | "alve"; text: string; nameReveal?: boolean };

const OPENING: OpeningBeat[] = [
  {
    image: "/assets/village/story-moments/act2/opening/01-dog-runs-off.png",
    title: "Valpen sticker",
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
    image: "/assets/village/story-moments/act2/opening/02-into-the-forest.png",
    title: "In i skogen",
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
    image: "/assets/village/story-moments/act2/opening/03-through-the-trees.png",
    title: "Något där framme",
    body: [
      "Efter en stund förändras ljuset mellan träden. Det blir ljusare längre fram, och mellan stammarna skymtar något blått.",
      "Barnet: Vad är det där?",
      "Det glittrar till mellan grenarna igen. Vatten. Eller något som ser ut som vatten.",
      "Barnet: Har du sprungit hit hela tiden bara för att visa något?",
      "Valpen väntar ett ögonblick, sedan fortsätter den.",
    ],
  },
  {
    image: "/assets/village/story-moments/act2/opening/04-first-view-of-the-lake.png",
    title: "Sjön",
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
    image: "/assets/village/story-moments/act2/opening/05-the-bicycle.png",
    title: "Där borta",
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
];

const ALVE_DIALOGUE: DialogueBeat[] = [
  { speaker: "child", text: "Hej." },
  { text: "Pojken vid stugan rycker till och vänder sig om. Han håller fortfarande en lös bräda i handen." },
  { speaker: "child", text: "Är det din cykel där borta?" },
  { speaker: "unknown", text: "Ja." },
  { text: "Han tittar förbi dig mot Valpen." },
  { speaker: "unknown", text: "Kom du från byn?" },
  { speaker: "child", text: "Hunden sprang hit. Jag sprang efter." },
  { text: "Pojken nickar mot Valpen." },
  { speaker: "unknown", text: "Han hittade rätt väg i alla fall." },
  { text: "Du tittar på stugan. En del plankor har flyttats, några verktyg ligger utspridda på marken och det syns tydligt att någon har försökt börja laga den." },
  { speaker: "child", text: "Försöker du fixa den här själv?" },
  { speaker: "unknown", text: "Ja. Jag tänkte börja med väggen, sedan taket och sedan resten." },
  { text: "Du tittar på det trasiga räcket, den sneda dörren och brädorna som ligger bredvid." },
  { speaker: "child", text: "Det är ganska mycket ‘resten’." },
  { speaker: "unknown", text: "Jag har märkt det." },
  { text: "Han lägger ifrån sig brädan." },
  { speaker: "unknown", text: "Det här är min familjs ställe. Vi brukade vara här på somrarna." },
  { speaker: "child", text: "Brukar ni inte vara här längre?" },
  { speaker: "unknown", text: "Nej." },
  { text: "Han säger det kort och börjar samla ihop verktygen." },
  { speaker: "unknown", text: "Så jag tänkte laga det." },
  { speaker: "child", text: "Hela stället?" },
  { speaker: "unknown", text: "Det var planen." },
  { text: "Du ser bort mot sjön. Bryggan är trasig. Båthuset lutar och längre bort står den gamla motorbåten." },
  { speaker: "child", text: "Det är inte bara stugan som är trasig." },
  { speaker: "unknown", text: "Jag vet." },
  { text: "För första gången ser han lite mindre säker ut." },
  { speaker: "unknown", text: "Jag trodde faktiskt inte att det var så här mycket." },
  { speaker: "child", text: "Jag kan hjälpa dig." },
  { text: "Han tittar på dig som om du sagt något oväntat." },
  { speaker: "unknown", text: "Varför?" },
  { speaker: "child", text: "För att du aldrig kommer bli klar själv." },
  { text: "Pojken höjer ögonbrynen." },
  { speaker: "unknown", text: "Det där var väldigt snällt sagt." },
  { speaker: "child", text: "Jag menade det snällt." },
  { text: "Han försöker hålla sig allvarlig, men börjar le." },
  { speaker: "child", text: "Jag heter {childName}." },
  { speaker: "unknown", text: "Alve.", nameReveal: true },
  { speaker: "alve", text: "Okej, {childName}. Om du verkligen tänker hjälpa till så behöver du se resten." },
  { text: "Alve börjar gå mot sjön och du följer efter. Han pekar först mot stugan." },
  { speaker: "alve", text: "Stugan är värst inuti. Jag har knappt börjat där." },
  { text: "Sedan mot bryggan." },
  { speaker: "alve", text: "Bryggan går nästan inte att använda längre." },
  { text: "Och sist mot båthuset." },
  { speaker: "alve", text: "Och båthuset är fullt med gammalt skräp." },
  { text: "Du tittar mot motorbåten." },
  { speaker: "child", text: "Och den?" },
  { speaker: "alve", text: "Den får vänta." },
  { speaker: "child", text: "Varför?" },
  { speaker: "alve", text: "För att vi inte ens har någonstans att laga den än. Båthuset måste fungera. Bryggan måste gå att använda. Och jag vill få ordning på stugan." },
  { text: "Han ser över platsen en gång till." },
  { speaker: "alve", text: "Jag tänkte göra allt själv." },
  { speaker: "child", text: "Det hade tagit hundra år." },
  { speaker: "alve", text: "Femtio." },
  { speaker: "child", text: "Minst hundra." },
  { text: "Alve funderar." },
  { speaker: "alve", text: "Okej. Åttio." },
  { text: "Du skrattar. Alve pekar ut de tre platserna igen." },
  { speaker: "alve", text: "Stugan. Bryggan. Båthuset." },
  { speaker: "alve", text: "Om vi ska göra det här tillsammans så börjar vi med en av dem." },
  { speaker: "alve", text: "Vad börjar vi med?" },
];

const PROJECT_COPY: Record<Act2Project, { label: string; preview: string; object: string }> = {
  cabin: { label: "Stugan", object: "stugan", preview: "Stugan... Jag hoppas min familj vill komma hit igen om vi får ordning på den." },
  dock: { label: "Bryggan", object: "bryggan", preview: "Bryggan är bra. Då kan vi knyta fast båten här sen. Och bada!" },
  boathouse: { label: "Båthuset", object: "båthuset", preview: "Båthuset måste vi fixa om vi ska kunna laga båten." },
  motorboat: { label: "Motorbåten", object: "motorbåten", preview: "Den får vänta tills Stugan, Bryggan och Båthuset är klara." },
};

export default function Act2Page() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Act2LakeGameHandle | null>(null);
  const [state, setState] = useState<Act2RuntimeState>(createDefaultAct2RuntimeState);
  const [ready, setReady] = useState(false);
  const [childName, setChildName] = useState("Barnet");
  const [previewProject, setPreviewProject] = useState<Act2Project | null>(null);
  const [backendWorldProgression, setBackendWorldProgression] = useState<number | null>(null);
  const backendWorldProgressionRef = useRef<number | null>(null);
  const [backendSyncError, setBackendSyncError] = useState("");
  const [motorboatNameDraft, setMotorboatNameDraft] = useState("");
  const [contributionTurnInOpen, setContributionTurnInOpen] = useState(false);
  const [act2AccessAllowed, setAct2AccessAllowed] = useState(false);

  function hasPendingAlveTurnIn(candidateState: Act2RuntimeState, worldProgression: number | null) {
    if (worldProgression === null || !candidateState.selectedProject) return false;
    const blockedByPurchase =
      (candidateState.selectedProject === "dock" && jettyPurchaseRequired(candidateState))
      || (candidateState.selectedProject === "boathouse" && boathousePurchaseRequired(candidateState))
      || (candidateState.selectedProject === "motorboat" && motorboatPartsPurchaseRequired(candidateState));
    const blockedByNaming =
      candidateState.selectedProject === "motorboat" && motorboatNamingRequired(candidateState);
    return !blockedByPurchase
      && !blockedByNaming
      && !act2FinalePending(candidateState)
      && nextAct2Contribution(candidateState, worldProgression) !== null;
  }


  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [act2, act1, childId] = await Promise.all([
        loadAct2RuntimeState(),
        loadSaveState(),
        getPairedChildId(),
      ]);
      if (cancelled) return;
      setChildName(act1?.childName || "Barnet");
      const clinicComplete =
        act1?.worldFlags?.clinicCompletionSeen === true
        || (act1?.construction.revealed.clinic ?? 0) >= 4;
      if (!clinicComplete) {
        setAct2AccessAllowed(false);
        setReady(true);
        return;
      }
      setAct2AccessAllowed(true);
      let entered: Act2RuntimeState = act2.entered ? act2 : { ...act2, entered: true };
      if (childId) {
        try {
          const backend = await getChildGameState(childId);
          if (cancelled) return;
          if (backend) {
            backendWorldProgressionRef.current = backend.progression.worldProgression;
            setBackendWorldProgression(backend.progression.worldProgression);
            entered = withBackendClaimBaseline(entered, backend.progression.worldProgression);
            entered = withBackendStoryFlags(entered, backend.worldFlags);
          }
        } catch {
          if (!cancelled) setBackendSyncError("Kunde inte läsa questframsteg just nu.");
        }
      }
      await saveAct2RuntimeState(entered);
      if (cancelled) return;
      setState(entered);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready || !state.openingComplete || !hostRef.current) return;
    let disposed = false;
    import("../../game/createAct2LakeGame").then(async ({ createAct2LakeGame }) => {
      if (disposed || !hostRef.current) return;
      gameRef.current = await createAct2LakeGame(hostRef.current, 1, {
        onAlveTurnIn: () => setContributionTurnInOpen(true),
      });
      const latest = await loadAct2RuntimeState();
      gameRef.current.setActiveProject(latest.selectedProject);
      gameRef.current.setProjectStages({
        cabin: latest.projects.cabin.visibleStage,
        dock: latest.projects.dock.visibleStage,
        boathouse: latest.projects.boathouse.visibleStage,
        motorboat: latest.projects.motorboat.visibleStage,
      });
      gameRef.current.setAlveTurnInAvailable(
        hasPendingAlveTurnIn(latest, backendWorldProgressionRef.current),
      );
    });
    return () => {
      disposed = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [ready, state.openingComplete]);

  useEffect(() => {
    gameRef.current?.setProjectStages({
      cabin: state.projects.cabin.visibleStage,
      dock: state.projects.dock.visibleStage,
      boathouse: state.projects.boathouse.visibleStage,
      motorboat: state.projects.motorboat.visibleStage,
    });
  }, [
    state.projects.cabin.visibleStage,
    state.projects.dock.visibleStage,
    state.projects.boathouse.visibleStage,
    state.projects.motorboat.visibleStage,
  ]);

  useEffect(() => {
    gameRef.current?.setActiveProject(state.selectedProject);
  }, [state.selectedProject]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const sync = async () => {
      try {
        const childId = await getPairedChildId();
        if (!childId) return;
        const backend = await getChildGameState(childId);
        if (!cancelled && backend) {
          backendWorldProgressionRef.current = backend.progression.worldProgression;
          setBackendWorldProgression(backend.progression.worldProgression);
          setBackendSyncError("");
          const current = await loadAct2RuntimeState();
          const next = withBackendStoryFlags(current, backend.worldFlags);
          const ownershipChanged =
            next.jettyLifebuoyOwned !== current.jettyLifebuoyOwned
            || next.boathouseSteeringWheelOwned !== current.boathouseSteeringWheelOwned
            || next.motorboatPartsOwned !== current.motorboatPartsOwned;
          if (ownershipChanged) {
            await saveAct2RuntimeState(next);
            if (!cancelled) setState(next);
          }
        }
      } catch {
        if (!cancelled) setBackendSyncError("Kunde inte läsa questframsteg just nu.");
      }
    };
    void sync();
    const timer = window.setInterval(() => void sync(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ready]);

  useEffect(() => {
    const pending = hasPendingAlveTurnIn(state, backendWorldProgression);
    gameRef.current?.setAlveTurnInAvailable(pending);
  }, [state, backendWorldProgression]);

  async function commit(next: Act2RuntimeState) {
    await saveAct2RuntimeState(next);
    setState(next);
  }

  async function advanceOpening() {
    if (state.openingIndex < OPENING.length - 1) {
      await commit({ ...state, openingIndex: state.openingIndex + 1 });
    } else {
      await commit({ ...state, openingComplete: true, bicycleSeen: false });
    }
  }

  async function advanceAlve() {
    const beat = ALVE_DIALOGUE[state.alveIntroIndex];
    const nextIndex = state.alveIntroIndex + 1;
    if (nextIndex >= ALVE_DIALOGUE.length) {
      await commit({ ...state, alveIntroComplete: true, alveIntroIndex: ALVE_DIALOGUE.length - 1 });
      return;
    }
    await commit({ ...state, alveIntroIndex: nextIndex });
    if (beat?.nameReveal) {
      // The next rendered Alve line now uses the permanent Alve nameplate.
    }
  }

  async function chooseProject(project: Act2Project) {
    const next = withSelectedProject(state, project);
    if (next.selectedProject !== project) return;
    await commit(next);
    setPreviewProject(null);
  }

  if (!ready) return <main className="parent-page"><p>Laddar sjön…</p></main>;
  if (!act2AccessAllowed) {
    return <main className="parent-page">
      <h1>Stigen är inte öppen än</h1>
      <p>Det finns mer att göra i byn innan vägen mot sjön öppnas.</p>
      <a className="primary-button" href="/">Tillbaka till byn</a>
    </main>;
  }

  const opening = OPENING[state.openingIndex];
  const alveBeat = ALVE_DIALOGUE[state.alveIntroIndex];
  const displayText = alveBeat?.text.replaceAll("{childName}", childName);
  const prerequisiteDone = prerequisiteCompletionCount(state);
  const motorboatUnlocked = isMotorboatUnlocked(state);
  const availablePrerequisites = (["cabin", "dock", "boathouse"] as const)
    .filter((project) => !state.projects[project].complete);
  const motorboatPreview = !state.projects.boathouse.complete
    ? "Jag vill också börja med båten. Men först måste vi laga båthuset. Vi behöver verkstaden och slipen om vi ska kunna göra det ordentligt."
    : prerequisiteDone < 3
      ? "Snart. Men de andra byggena är viktigare först. Om vi ska få hela platsen att fungera igen kan vi inte bara fixa båten och lämna resten."
      : "Nu. Nu fixar vi den.";
  const selectionPrompt = prerequisiteDone === 0
    ? "Vad börjar vi med?"
    : prerequisiteDone === 1
      ? "En klar. Förut var allt trasigt. Nu är det en sak mindre. Så. Vad tar vi nu?"
      : prerequisiteDone === 2
        ? "Två klara. Då är det bara en kvar. Den har väntat länge nog."
        : "Stugan är klar. Bryggan är klar. Båthuset är klart. Det är dags.";
  const jettyPurchaseGate = state.selectedProject === "dock" && jettyPurchaseRequired(state);
  const boathousePurchaseGate = state.selectedProject === "boathouse" && boathousePurchaseRequired(state);
  const motorboatPurchaseGate = state.selectedProject === "motorboat" && motorboatPartsPurchaseRequired(state);
  const namingRequired = state.selectedProject === "motorboat" && motorboatNamingRequired(state);
  const purchaseRequired = jettyPurchaseGate || boathousePurchaseGate || motorboatPurchaseGate;
  const purchaseGateBeat = jettyPurchaseGate ? JETTY_LIFEBUOY_BEAT : boathousePurchaseGate ? BOATHOUSE_STEERING_WHEEL_BEAT : null;
  const purchaseGateCopy = jettyPurchaseGate
    ? { title: "Bryggan · nästa steg", text: "Sol vill att ni skaffar en riktig livboj innan arbetet fortsätter.", detail: "Mira kan ordna den i lanthandeln för 200 SysselBux." }
    : boathousePurchaseGate
      ? { title: "Båthuset · nästa steg", text: "Lådbilen behöver en riktig ratt innan ni kan bygga vidare.", detail: "Mira har en som passar för 200 SysselBux." }
      : { title: "Motorbåten · nästa steg", text: "Linus har konstaterat att några delar inte går att rädda.", detail: "Mira kan beställa reservdelspaketet för 200 SysselBux." };
  const contributionCandidate = backendWorldProgression === null || purchaseRequired || namingRequired
    ? null
    : nextAct2Contribution(state, backendWorldProgression);
  const activeContributionBeat = contributionCandidate?.project === "dock"
    ? JETTY_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
    : contributionCandidate?.project === "cabin"
      ? CABIN_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
      : contributionCandidate?.project === "boathouse"
        ? BOATHOUSE_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
        : contributionCandidate?.project === "motorboat"
          ? MOTORBOAT_CONTRIBUTION_BEATS[contributionCandidate.number - 1] ?? null
          : null;
  const activeContributionLine = contributionTurnInOpen
    ? activeContributionBeat?.body[state.contributionLineIndex] ?? null
    : null;
  const finalePending = act2FinalePending(state);
  const activeFinaleBeat = finalePending ? ACT2_FINALE_BEATS[state.finaleIndex] ?? null : null;
  const activeFinaleLine = activeFinaleBeat?.body[state.finaleLineIndex] ?? null;
  const completionProject = (["cabin", "dock"] as const)
    .find((project) => projectCompletionReactionPending(state, project)) ?? null;
  const activeCompletionBeat = completionProject === "cabin"
    ? CABIN_WAITING_REACTION
    : completionProject === "dock"
      ? JETTY_COMPLETION_REACTION
      : null;
  const activeCompletionLine = activeCompletionBeat?.body[state.completionLineIndex] ?? null;

  async function advanceFinaleStory() {
    if (!activeFinaleBeat) return;
    if (state.finaleLineIndex + 1 < activeFinaleBeat.body.length) {
      await commit({ ...state, finaleLineIndex: state.finaleLineIndex + 1 });
      return;
    }
    await commit(advanceAct2Finale(state));
  }

  async function advanceCompletionReaction() {
    if (!completionProject || !activeCompletionBeat) return;
    if (state.completionLineIndex + 1 < activeCompletionBeat.body.length) {
      await commit({ ...state, completionLineIndex: state.completionLineIndex + 1 });
      return;
    }
    await commit(consumeProjectCompletionReaction(state, completionProject));
  }

  async function advanceContributionStory() {
    if (!contributionCandidate || !activeContributionBeat) return;
    if (state.contributionLineIndex + 1 < activeContributionBeat.body.length) {
      await commit({ ...state, contributionLineIndex: state.contributionLineIndex + 1 });
      return;
    }
    const next = withPresentedContribution(
      state,
      contributionCandidate.project,
      contributionCandidate.beatId,
      contributionCandidate.visibleStage,
    );
    await commit(next);
    setContributionTurnInOpen(false);
  }

  return <main style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#1f3427" }}>
    {state.openingComplete && <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-label="Sjön i Act 2" />}

    {!state.openingComplete && <StoryRunner
      beat={{
        id: `act2:opening:${state.openingIndex}`,
        image: opening.image,
        speaker: opening.title,
        lines: opening.body.map((line) => line.replaceAll("Barnet:", childName + ":")),
        nextLabel: state.openingIndex === OPENING.length - 1 ? "Gå närmare" : "Fortsätt",
      }}
      onNext={() => void advanceOpening()}
      dialogueClassName="act2-dialogue-card"
      background="#111"
      scrollable
    />}

    {state.openingComplete && !state.bicycleSeen && <StoryRunner
      beat={{
        id: "act2:bicycle",
        image: "/assets/village/story-moments/act2/meeting-alve/bike.png",
        speaker: childName,
        speakerTone: "child",
        lines: ["Vad är det för cykel? Den verkar inte höra hemma här."],
        nextLabel: "Fortsätt",
      }}
      onNext={() => void commit({ ...state, bicycleSeen: true })}
      dialogueClassName="act2-dialogue-card"
    />}

    {state.bicycleSeen && !state.alveIntroComplete && <StoryRunner
      beat={{
        id: `act2:alve-intro:${state.alveIntroIndex}`,
        image: "/assets/village/story-moments/act2/meeting-alve/first-hello.png",
        speaker: alveBeat?.speaker ? (alveBeat.speaker === "child" ? childName : alveBeat.speaker === "alve" ? "Alve" : "Barnet") : undefined,
        speakerTone: alveBeat?.speaker === "child" ? "child" : "default",
        lines: displayText ? [displayText] : [],
        nextLabel: state.alveIntroIndex === ALVE_DIALOGUE.length - 1 ? "Välj projekt" : "Fortsätt",
      }}
      onNext={() => void advanceAlve()}
      dialogueClassName="act2-dialogue-card"
    />}

    {state.alveIntroComplete && !state.selectedProject && !state.projects.motorboat.complete && !completionProject && <section className="story-moment" role="presentation">
      <Image src="/assets/village/story-moments/act2/meeting-alve/pick.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="dialogue-card story-moment-dialogue act2-dialogue-card" role="dialog" aria-modal="true">
        <span className="dialogue-speaker">Alve</span>
        <p>{previewProject === "motorboat" ? motorboatPreview : previewProject ? PROJECT_COPY[previewProject].preview : selectionPrompt}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {availablePrerequisites.map((project) =>
            <button key={project} className="secondary-button" onClick={() => setPreviewProject(project)}>{PROJECT_COPY[project].label}</button>
          )}
          <button className="secondary-button" onClick={() => setPreviewProject("motorboat")}>
            {motorboatUnlocked ? "Motorbåten" : "🔒 Motorbåten"}
          </button>
        </div>
        {previewProject && (previewProject !== "motorboat" || motorboatUnlocked) && <button className="primary-button dialogue-next" onClick={() => void chooseProject(previewProject)}>
          Laga {PROJECT_COPY[previewProject].object}
        </button>}
      </div>
    </section>}

    {finalePending && activeFinaleBeat && activeFinaleLine && <StoryRunner
      beat={{
        id: `act2:finale:${state.finaleIndex}:${state.finaleLineIndex}`,
        image: activeFinaleBeat.image,
        imageFit: "contain",
        speaker: activeFinaleBeat.title,
        lines: [activeFinaleLine.replace(/^Barnet:/, childName + ":")],
        nextLabel: state.finaleLineIndex + 1 < activeFinaleBeat.body.length ? "Fortsätt" : state.finaleIndex === ACT2_FINALE_BEATS.length - 1 ? "SLUT PÅ ANDRA KAPITLET" : "Nästa",
      }}
      onNext={() => void advanceFinaleStory()}
      dialogueClassName="act2-dialogue-card"
      zIndex={100}
      background="rgba(6,10,8,.96)"
    />}
    {completionProject && activeCompletionBeat && activeCompletionLine && <StoryRunner
      beat={{
        id: `act2:completion:${completionProject}:${state.completionLineIndex}`,
        image: activeCompletionBeat.image,
        imageFit: "contain",
        speaker: activeCompletionBeat.title,
        lines: [activeCompletionLine.replace(/^Barnet:/, childName + ":")],
        nextLabel: state.completionLineIndex + 1 < activeCompletionBeat.body.length ? "Fortsätt" : "Tillbaka till projekten",
      }}
      onNext={() => void advanceCompletionReaction()}
      dialogueClassName="act2-dialogue-card"
      zIndex={90}
      background="rgba(9,14,10,.94)"
    />}
    {purchaseRequired && <section style={{ position:"absolute", inset:0, zIndex:78, background:"rgba(9,14,10,.94)" }} role="presentation">
      {purchaseGateBeat?.image && <Image src={purchaseGateBeat.image} alt="" fill priority sizes="100vw" style={{ objectFit:"contain" }} />}
      <div className="dialogue-card story-moment-dialogue act2-dialogue-card" role="dialog" aria-modal="true">
        <span className="dialogue-speaker">{purchaseGateCopy.title}</span>
        <p>{purchaseGateCopy.text}</p>
        <p>{purchaseGateCopy.detail}</p>
        <a className="primary-button dialogue-next" href="/">Till Mira i byn</a>
      </div>
    </section>}
    {namingRequired && <section style={{ position:"absolute", inset:0, zIndex:85, background:"rgba(9,14,10,.94)", display:"grid", placeItems:"center" }} role="presentation">
      <div className="dialogue-card story-moment-dialogue act2-dialogue-card" role="dialog" aria-modal="true">
        <span className="dialogue-speaker">Vår båt</span>
        <p>Alve: Den behöver ett namn.</p>
        <input
          value={motorboatNameDraft}
          onChange={(event) => setMotorboatNameDraft(event.target.value)}
          maxLength={24}
          placeholder="Skriv båtens namn"
          aria-label="Båtens namn"
        />
        <button className="primary-button dialogue-next" disabled={!motorboatNameDraft.trim()} onClick={() => void commit(withMotorboatName(state, motorboatNameDraft))}>
          Spara namnet
        </button>
      </div>
    </section>}
    {contributionTurnInOpen && contributionCandidate && activeContributionBeat && activeContributionLine && <StoryMoment
      image={activeContributionBeat.image}
      imageFit="contain"
      speaker={activeContributionBeat.title}
      nextLabel={state.contributionLineIndex + 1 < activeContributionBeat.body.length ? "Fortsätt" : "Klart"}
      onNext={() => void advanceContributionStory()}
      zIndex={80}
      background="rgba(9,14,10,.94)"
      dialogueClassName="act2-dialogue-card"
      footer={contributionCandidate.backlog > 1 ? <small>{contributionCandidate.backlog - 1} questframsteg väntar bakom detta beat.</small> : undefined}
    >
      <p>{activeContributionLine.replace(/^Barnet:/, childName + ":")}</p>
    </StoryMoment>}
    {backendSyncError && <div role="status" style={{ position:"absolute", right:16, top:16, zIndex:30, background:"rgba(0,0,0,.65)", color:"white", padding:"8px 12px", borderRadius:10 }}>{backendSyncError}</div>}
    {state.selectedProject && !finalePending && <div style={{ position: "absolute", left: 16, bottom: 16, zIndex: 20, background: "rgba(22,28,22,.88)", color: "white", borderRadius: 14, padding: "12px 16px", maxWidth: 380 }}>
      <strong>Alve: {prerequisiteDone === 0 ? `Bra val! Vi fixar ${PROJECT_COPY[state.selectedProject].object} först!` : state.selectedProject === "motorboat" ? "Nu fixar vi den." : `Bra. Då kör vi på ${PROJECT_COPY[state.selectedProject].object}.`}</strong>
      <div style={{ marginTop: 6, opacity: .82 }}>Aktivt projekt: {PROJECT_COPY[state.selectedProject].label} · {state.projects[state.selectedProject].contributions}/16</div>
      {contributionCandidate && !purchaseRequired && !namingRequired && <div style={{ marginTop: 6, color: "#f4d780", fontWeight: 800 }}>Ett klart uppdrag väntar hos Alve.</div>}
      <a href="/" style={{ display: "inline-block", marginTop: 10, color: "white", textDecoration: "underline" }}>← Till byn</a>
    </div>}
  </main>;
}
