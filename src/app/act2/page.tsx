"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Act2LakeGameHandle } from "../../game/createAct2LakeGame";
import {
  createDefaultAct2RuntimeState,
  loadAct2RuntimeState,
  saveAct2RuntimeState,
  type Act2Project,
  type Act2RuntimeState,
} from "../../game/act2RuntimeState";
import { loadSaveState } from "../../game/saveState";

type OpeningBeat = { image: string; title: string; body: string[] };
type DialogueBeat = { speaker?: "Barnet" | "Alve"; text: string; nameReveal?: boolean };

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
  { speaker: "Barnet", text: "Hej." },
  { text: "Pojken vid stugan rycker till och vänder sig om. Han håller fortfarande en lös bräda i handen." },
  { speaker: "Barnet", text: "Är det din cykel där borta?" },
  { speaker: "Barnet", text: "Ja." },
  { text: "Han tittar förbi dig mot Valpen." },
  { speaker: "Barnet", text: "Kom du från byn?" },
  { speaker: "Barnet", text: "Hunden sprang hit. Jag sprang efter." },
  { text: "Pojken nickar mot Valpen." },
  { speaker: "Barnet", text: "Han hittade rätt väg i alla fall." },
  { text: "Du tittar på stugan. En del plankor har flyttats, några verktyg ligger utspridda på marken och det syns tydligt att någon har försökt börja laga den." },
  { speaker: "Barnet", text: "Försöker du fixa den här själv?" },
  { speaker: "Barnet", text: "Ja. Jag tänkte börja med väggen, sedan taket och sedan resten." },
  { text: "Du tittar på det trasiga räcket, den sneda dörren och brädorna som ligger bredvid." },
  { speaker: "Barnet", text: "Det är ganska mycket ‘resten’." },
  { speaker: "Barnet", text: "Jag har märkt det." },
  { text: "Han lägger ifrån sig brädan." },
  { speaker: "Barnet", text: "Det här är min familjs ställe. Vi brukade vara här på somrarna." },
  { speaker: "Barnet", text: "Brukar ni inte vara här längre?" },
  { speaker: "Barnet", text: "Nej." },
  { text: "Han säger det kort och börjar samla ihop verktygen." },
  { speaker: "Barnet", text: "Så jag tänkte laga det." },
  { speaker: "Barnet", text: "Hela stället?" },
  { speaker: "Barnet", text: "Det var planen." },
  { text: "Du ser bort mot sjön. Bryggan är trasig. Båthuset lutar och längre bort står den gamla motorbåten." },
  { speaker: "Barnet", text: "Det är inte bara stugan som är trasig." },
  { speaker: "Barnet", text: "Jag vet." },
  { text: "För första gången ser han lite mindre säker ut." },
  { speaker: "Barnet", text: "Jag trodde faktiskt inte att det var så här mycket." },
  { speaker: "Barnet", text: "Jag kan hjälpa dig." },
  { text: "Han tittar på dig som om du sagt något oväntat." },
  { speaker: "Barnet", text: "Varför?" },
  { speaker: "Barnet", text: "För att du aldrig kommer bli klar själv." },
  { text: "Pojken höjer ögonbrynen." },
  { speaker: "Barnet", text: "Det där var väldigt snällt sagt." },
  { speaker: "Barnet", text: "Jag menade det snällt." },
  { text: "Han försöker hålla sig allvarlig, men börjar le." },
  { speaker: "Barnet", text: "Jag heter {childName}." },
  { speaker: "Barnet", text: "Alve.", nameReveal: true },
  { speaker: "Alve", text: "Okej, {childName}. Om du verkligen tänker hjälpa till så behöver du se resten." },
  { text: "Alve börjar gå mot sjön och du följer efter. Han pekar först mot stugan." },
  { speaker: "Alve", text: "Stugan är värst inuti. Jag har knappt börjat där." },
  { text: "Sedan mot bryggan." },
  { speaker: "Alve", text: "Bryggan går nästan inte att använda längre." },
  { text: "Och sist mot båthuset." },
  { speaker: "Alve", text: "Och båthuset är fullt med gammalt skräp." },
  { text: "Du tittar mot motorbåten." },
  { speaker: "Barnet", text: "Och den?" },
  { speaker: "Alve", text: "Den får vänta." },
  { speaker: "Barnet", text: "Varför?" },
  { speaker: "Alve", text: "För att vi inte ens har någonstans att laga den än. Båthuset måste fungera. Bryggan måste gå att använda. Och jag vill få ordning på stugan." },
  { text: "Han ser över platsen en gång till." },
  { speaker: "Alve", text: "Jag tänkte göra allt själv." },
  { speaker: "Barnet", text: "Det hade tagit hundra år." },
  { speaker: "Alve", text: "Femtio." },
  { speaker: "Barnet", text: "Minst hundra." },
  { text: "Alve funderar." },
  { speaker: "Alve", text: "Okej. Åttio." },
  { text: "Du skrattar. Alve pekar ut de tre platserna igen." },
  { speaker: "Alve", text: "Stugan. Bryggan. Båthuset." },
  { speaker: "Alve", text: "Om vi ska göra det här tillsammans så börjar vi med en av dem." },
  { speaker: "Alve", text: "Vad börjar vi med?" },
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
  const [previewProject, setPreviewProject] = useState<Exclude<Act2Project, "motorboat"> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [act2, act1] = await Promise.all([loadAct2RuntimeState(), loadSaveState()]);
      if (cancelled) return;
      const entered = act2.entered ? act2 : { ...act2, entered: true };
      if (!act2.entered) await saveAct2RuntimeState(entered);
      setState(entered);
      setChildName(act1?.childName || "Barnet");
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready || !state.openingComplete || !hostRef.current) return;
    let disposed = false;
    import("../../game/createAct2LakeGame").then(async ({ createAct2LakeGame }) => {
      if (disposed || !hostRef.current) return;
      gameRef.current = await createAct2LakeGame(hostRef.current, 1);
    });
    return () => {
      disposed = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [ready, state.openingComplete]);

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

  async function chooseProject(project: Exclude<Act2Project, "motorboat">) {
    await commit({ ...state, selectedProject: project });
    setPreviewProject(null);
  }

  if (!ready) return <main className="parent-page"><p>Laddar sjön…</p></main>;

  const opening = OPENING[state.openingIndex];
  const alveBeat = ALVE_DIALOGUE[state.alveIntroIndex];
  const alveKnown = state.alveIntroIndex > ALVE_DIALOGUE.findIndex((beat) => beat.nameReveal);
  const displayText = alveBeat?.text.replaceAll("{childName}", childName);

  return <main style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#1f3427" }}>
    {state.openingComplete && <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-label="Sjön i Act 2" />}

    {!state.openingComplete && <section style={{ position: "absolute", inset: 0, background: "#111" }}>
      <Image src={opening.image} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" style={{ maxHeight: "44vh", overflowY: "auto" }}>
        <span className="dialogue-speaker">{opening.title}</span>
        {opening.body.map((line, index) => <p key={index}>{line.replaceAll("Barnet:", childName + ":")}</p>)}
        <button className="primary-button dialogue-next" onClick={() => void advanceOpening()}>
          {state.openingIndex === OPENING.length - 1 ? "Gå närmare" : "Fortsätt"}
        </button>
      </div>
    </section>}

    {state.openingComplete && !state.bicycleSeen && <section className="story-moment" role="presentation">
      <Image src="/assets/village/story-moments/act2/meeting-alve/bike.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true">
        <span className="dialogue-speaker child">{childName}</span>
        <p>Vad är det för cykel? Den verkar inte höra hemma här.</p>
        <button className="primary-button dialogue-next" onClick={() => void commit({ ...state, bicycleSeen: true })}>Fortsätt</button>
      </div>
    </section>}

    {state.bicycleSeen && !state.alveIntroComplete && <section className="story-moment" role="presentation">
      <Image src="/assets/village/story-moments/act2/meeting-alve/first-hello.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true">
        {alveBeat?.speaker && <span className={`dialogue-speaker ${alveBeat.speaker === "Alve" ? "" : alveKnown ? "child" : ""}`}>
          {alveBeat.speaker === "Alve" ? "Alve" : alveKnown && state.alveIntroIndex >= 38 ? childName : "Barnet"}
        </span>}
        <p>{displayText}</p>
        <button className="primary-button dialogue-next" onClick={() => void advanceAlve()}>
          {state.alveIntroIndex === ALVE_DIALOGUE.length - 1 ? "Välj projekt" : "Fortsätt"}
        </button>
      </div>
    </section>}

    {state.alveIntroComplete && !state.selectedProject && <section className="story-moment" role="presentation">
      <Image src="/assets/village/story-moments/act2/meeting-alve/pick.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true">
        <span className="dialogue-speaker">Alve</span>
        <p>{previewProject ? PROJECT_COPY[previewProject].preview : "Vad börjar vi med?"}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {(Object.keys(PROJECT_COPY) as Exclude<Act2Project, "motorboat">[]).map((project) =>
            <button key={project} className="secondary-button" onClick={() => setPreviewProject(project)}>{PROJECT_COPY[project].label}</button>
          )}
        </div>
        {previewProject && <button className="primary-button dialogue-next" onClick={() => void chooseProject(previewProject)}>
          Laga {PROJECT_COPY[previewProject].object}
        </button>}
      </div>
    </section>}

    {state.selectedProject && <div style={{ position: "absolute", left: 16, bottom: 16, zIndex: 20, background: "rgba(22,28,22,.88)", color: "white", borderRadius: 14, padding: "12px 16px", maxWidth: 380 }}>
      <strong>Alve: Bra val! Vi fixar {PROJECT_COPY[state.selectedProject].object} först!</strong>
      <div style={{ marginTop: 6, opacity: .82 }}>Aktivt projekt: {PROJECT_COPY[state.selectedProject].label} · 0/16</div>
      <a href="/" style={{ display: "inline-block", marginTop: 10, color: "white", textDecoration: "underline" }}>← Till byn</a>
    </div>}
  </main>;
}
