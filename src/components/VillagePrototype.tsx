"use client";

import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import type { QuestState, VillageGameHandle } from "../game/createVillageGame";
import { linusIntroDialogue } from "../game/dialogues";
import {
  applyQuestProgression,
  createEmptyProgression,
  makeBedQuest,
  type ProgressionState,
  type QuestId,
} from "../game/quests";
import {
  initialConstruction,
  syncConstructionProgression,
  earnConstruction,
  residentAttention,
  commitConstructionReveal,
  recyclingCompletionPending,
  commitRecyclingCompletion,
  type ConstructionState,
} from "../game/construction";
import { constructionPresentation } from "../game/constructionPresentation";
import { recyclingCompletionDialogue } from "../game/recyclingStory";
import { clearSaveState, loadSaveState, saveSaveState, withConstructionState, type SaveStateV1 } from "../game/saveState";
import { getRecyclingCenterStatus } from "../game/worldProgression";
import {
  QUEST_PRESENTATION_EVENT,
  getLatestQuestPresentation,
  requestQuestSourceOpen,
  type QuestPresentationEventDetail,
} from "../game/questPresentationBridge";

export default function VillagePrototype() {
  const [construction, setConstruction] = useState(initialConstruction);
  const constructionRef = useRef(construction);
  const latestSaveRef = useRef<SaveStateV1 | null>(null);
  const constructionWriteRef = useRef(false);
  const [constructionBusy, setConstructionBusy] = useState(false);
  const [constructionError, setConstructionError] = useState("");
  const [constructionDialogueId, setConstructionDialogueId] = useState<string | null>(null);
  const [recyclingStoryOpen, setRecyclingStoryOpen] = useState(false);
  const [recyclingStoryIndex, setRecyclingStoryIndex] = useState(0);
  const attention = residentAttention(construction);
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<VillageGameHandle | null>(null);
  const restoredQuestStateRef = useRef<QuestState>("available");
  const restoredIntroCompleteRef = useRef(false);
  const restoredDogVisibleRef = useRef(false);
  const childNameInputRef = useRef<HTMLInputElement>(null);
  const dogNameInputRef = useRef<HTMLInputElement>(null);
  const approvalLockRef = useRef(false);
  const [saveReady, setSaveReady] = useState(false);
  const [questState, setQuestState] = useState<QuestState>("available");
  const [questOpen, setQuestOpen] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [sysselBux, setSysselBux] = useState(0);
  const [completedQuestIds, setCompletedQuestIds] = useState<QuestId[]>([]);
  const [progression, setProgression] = useState<ProgressionState>(createEmptyProgression);
  const [introComplete, setIntroComplete] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [childName, setChildName] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogVisible, setDogVisible] = useState(false);
  const [childNameCanSubmit, setChildNameCanSubmit] = useState(false);
  const [dogNameCanSubmit, setDogNameCanSubmit] = useState(false);
  const [parentMenuOpen, setParentMenuOpen] = useState(false);
  const [resettingSave, setResettingSave] = useState(false);

  const dialogueStep = dialogueOpen ? linusIntroDialogue[dialogueIndex] : null;
  const recyclingStoryLine = recyclingStoryOpen ? recyclingCompletionDialogue[recyclingStoryIndex] : null;
  const pendingCount = questState === "pending" ? 1 : 0;
  const recyclingCenterStage = construction.revealed.recycling;
  const recyclingCenterStatus = getRecyclingCenterStatus(recyclingCenterStage);
  const nativeTestControls = Capacitor.isNativePlatform();

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const saved = await loadSaveState();
      if (cancelled) return;

      if (saved) {
        constructionRef.current = saved.construction;
        setConstruction(saved.construction);
        restoredQuestStateRef.current = saved.questStates.makeBed;
        restoredIntroCompleteRef.current = saved.introComplete;
        restoredDogVisibleRef.current = saved.dogVisible;
        approvalLockRef.current = saved.completedQuestIds.includes(makeBedQuest.id);

        setQuestState(saved.questStates.makeBed);
        setDiamonds(saved.diamonds);
        setSysselBux(saved.sysselBux);
        setCompletedQuestIds(saved.completedQuestIds);
        setProgression(saved.progression);
        setIntroComplete(saved.introComplete);
        setDialogueOpen(saved.dialogueOpen);
        setDialogueIndex(saved.dialogueIndex);
        setChildName(saved.childName);
        setDogName(saved.dogName);
        setDogVisible(saved.dogVisible);
        setChildNameCanSubmit(Boolean(saved.childName.trim()));
        setDogNameCanSubmit(Boolean(saved.dogName.trim()));
        if (recyclingCompletionPending(saved.construction)) {
          setRecyclingStoryIndex(0);
          setRecyclingStoryOpen(true);
        }
      }

      setSaveReady(true);
    }

    restore();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!saveReady || resettingSave || constructionWriteRef.current) return;
    const snapshot: SaveStateV1 = {
      version: 1, questStates: { makeBed: questState }, completedQuestIds, progression,
      diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, construction,
      worldFlags: { firstDeliveryComplete: recyclingCenterStage >= 1, recyclingCenterStage },
    };
    latestSaveRef.current = snapshot;
    void saveSaveState(snapshot);
  }, [construction, constructionBusy, saveReady, resettingSave, questState, completedQuestIds, progression, diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, recyclingCenterStage]);

  useEffect(() => {
    const syncQuestPresentation = (event: Event) => {
      const detail = (event as CustomEvent<QuestPresentationEventDetail>).detail;
      gameRef.current?.setNoticeboardAttention((detail?.counts.noticeboard ?? 0) > 0);
    };
    window.addEventListener(QUEST_PRESENTATION_EVENT, syncQuestPresentation);
    return () => window.removeEventListener(QUEST_PRESENTATION_EVENT, syncQuestPresentation);
  }, []);

  useEffect(() => {
    if (!saveReady) return;
    let cancelled = false;
    async function boot() {
      const { createVillageGame } = await import("../game/createVillageGame");
      if (cancelled || !hostRef.current) return;
      const handle = await createVillageGame(hostRef.current, {
        onQuestOpen: () => setQuestOpen(true),
        onNoticeboardInteract: () => requestQuestSourceOpen("noticeboard"),
        onConstructionInteract: (id) => {
          if (residentAttention(constructionRef.current)?.id !== id) { gameRef.current?.setConstructionDialogueOpen(false); return; }
          setConstructionDialogueId(id);
        },
        onLinusInteract: () => { setDialogueIndex(0); setDialogueOpen(true); },
      });
      if (cancelled) { handle.destroy(); return; }
      gameRef.current = handle;
      handle.setNoticeboardAttention(getLatestQuestPresentation().counts.noticeboard > 0);
      handle.setDogVisible(restoredDogVisibleRef.current);
      handle.setIntroComplete(restoredIntroCompleteRef.current);
      handle.setQuestState(restoredQuestStateRef.current);
      handle.setConstruction(constructionPresentation(constructionRef.current));
    }
    boot();
    return () => { cancelled = true; gameRef.current?.destroy(); gameRef.current = null; };
  }, [saveReady]);

  useEffect(() => { gameRef.current?.setQuestState(questState); }, [questState]);
  useEffect(() => { gameRef.current?.setIntroComplete(introComplete); }, [introComplete]);
  useEffect(() => { gameRef.current?.setDogVisible(dogVisible); }, [dogVisible]);
  useEffect(() => { gameRef.current?.setConstruction(constructionPresentation(construction)); }, [construction]);

  async function persistConstruction(next: ConstructionState, revealId?: string) {
    if (constructionWriteRef.current || !latestSaveRef.current || next === constructionRef.current) return;
    constructionWriteRef.current = true; setConstructionBusy(true); setConstructionError("");
    try {
      const commit = async () => {
        const snapshot = withConstructionState(latestSaveRef.current!, next);
        await saveSaveState(snapshot, true); latestSaveRef.current = snapshot; constructionRef.current = next; setConstruction(next);
        gameRef.current?.setConstruction(constructionPresentation(next));
      };
      if (revealId) {
        const game = gameRef.current; if (!game) throw new Error("Village is not ready");
        setConstructionDialogueId(null); await game.presentConstructionReveal(revealId, commit);
      } else await commit();
      setConstructionDialogueId(null); gameRef.current?.setConstructionDialogueOpen(false);
      if (revealId === "recycling:4" && recyclingCompletionPending(next)) { setRecyclingStoryIndex(0); setRecyclingStoryOpen(true); }
    } catch {
      setConstructionError("Det gick inte att spara. Försök igen.");
      if (revealId && residentAttention(constructionRef.current)?.id === revealId) setConstructionDialogueId(revealId);
      else gameRef.current?.setConstructionDialogueOpen(false);
    } finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  async function advanceRecyclingStory() {
    if (!recyclingStoryLine || constructionBusy) return;
    const nextIndex = recyclingStoryIndex + 1;
    if (nextIndex < recyclingCompletionDialogue.length) { setRecyclingStoryIndex(nextIndex); return; }
    const next = commitRecyclingCompletion(constructionRef.current);
    if (next === constructionRef.current || !latestSaveRef.current) { setRecyclingStoryOpen(false); return; }
    constructionWriteRef.current = true; setConstructionBusy(true); setConstructionError("");
    try {
      const snapshot = withConstructionState(latestSaveRef.current, next); await saveSaveState(snapshot, true);
      latestSaveRef.current = snapshot; constructionRef.current = next; setConstruction(next); setRecyclingStoryOpen(false); setRecyclingStoryIndex(0);
    } catch { setConstructionError("Det gick inte att spara. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  function advanceDialogue() {
    const nextIndex = dialogueIndex + 1; const nextStep = linusIntroDialogue[nextIndex];
    if (!nextStep) { setDialogueOpen(false); setIntroComplete(true); return; }
    if (nextStep.kind === "reveal-dog") { setDogVisible(true); setDialogueIndex(nextIndex + 1); return; }
    setDialogueIndex(nextIndex);
  }
  function finishChildNaming() { const trimmed = childNameInputRef.current?.value.trim() ?? ""; if (!trimmed) return; setChildName(trimmed); setChildNameCanSubmit(true); advanceDialogue(); }
  function finishDogNaming() { const trimmed = dogNameInputRef.current?.value.trim() ?? ""; if (!trimmed) return; setDogName(trimmed); setDogNameCanSubmit(true); setDogVisible(true); setDialogueIndex((index) => index + 1); }
  function submitQuest() { if (questState !== "available") return; setQuestState("pending"); setQuestOpen(false); }
  function approveQuest() {
    if (questState !== "pending" || approvalLockRef.current || completedQuestIds.includes(makeBedQuest.id)) return;
    approvalLockRef.current = true; setQuestState("approved"); setCompletedQuestIds((ids) => [...ids, makeBedQuest.id]);
    const earnedProgression = applyQuestProgression(progression, makeBedQuest); setProgression(earnedProgression);
    const nextConstruction = syncConstructionProgression(constructionRef.current, earnedProgression); constructionRef.current = nextConstruction; setConstruction(nextConstruction);
    setDiamonds((value) => value + makeBedQuest.reward.diamonds); setSysselBux((value) => value + makeBedQuest.reward.sysselBux); setParentMenuOpen(false);
  }
  function needsCompletion() { if (questState !== "pending") return; setQuestState("available"); setParentMenuOpen(false); setQuestOpen(true); }
  async function resetPrototypeSave() {
    if (resettingSave) return;
    if (!window.confirm("Nollställ Sysselcraft-testet? Barnnamn, hundnamn, quest, resurser och världsläge raderas på den här enheten.")) return;
    setResettingSave(true);
    try { await clearSaveState(); window.location.reload(); } catch { setResettingSave(false); window.alert("Det gick inte att nollställa sparningen."); }
  }

  const speakerName = dialogueStep?.kind === "line" && dialogueStep.speaker === "Barnet" ? childName || "Barnet" : dialogueStep?.kind === "line" ? dialogueStep.speaker : "";
  const recyclingSpeakerName = recyclingStoryLine?.speaker === "Barnet" ? childName || "Barnet" : recyclingStoryLine?.speaker ?? "";

  return <section className="prototype-shell">
    <header className="prototype-header"><div className="prototype-brand-row"><h1>Sysselcraft</h1><button className="parent-menu-button" type="button" onClick={() => setParentMenuOpen(true)} aria-label={pendingCount ? `Öppna vuxenläge, ${pendingCount} quest väntar` : "Öppna vuxenläge"}>🔐 Vuxenläge{pendingCount > 0 && <span className="parent-menu-badge">{pendingCount}</span>}</button><p>Första spelbara kärnloopen</p></div><div className="resource-hud" aria-label="Resurser">{dogName && <strong>🐶 {dogName}</strong>}<strong>💎 {diamonds}</strong><strong>🪙 {sysselBux}</strong></div></header>
    <div className="game-wrap"><div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" /><div className="game-hint">{attention ? `${attention.residentName} vill prata med dig` : introComplete ? "Tryck i byn för att gå · tryck på questmarkören vid huset" : "Tryck på Linus för att gå fram och hälsa"}</div>
    {constructionDialogueId && attention?.id === constructionDialogueId && <div className="dialogue-card" role="dialog" aria-modal="true" aria-label="Byggplatsens samtal"><span className="dialogue-speaker">{attention.residentName}</span><p>{attention.dialogue}</p><button className="primary-button" disabled={constructionBusy} onClick={() => void persistConstruction(commitConstructionReveal(constructionRef.current, attention.id), attention.id)}>{constructionBusy ? "Sparar…" : "Fortsätt"}</button><button className="secondary-button" disabled={constructionBusy} onClick={() => { setConstructionDialogueId(null); gameRef.current?.setConstructionDialogueOpen(false); }}>Senare</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {recyclingStoryOpen && recyclingStoryLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Återvinningscentralen är färdig"><span className={`dialogue-speaker ${recyclingStoryLine.speaker === "Barnet" ? "child" : ""}`}>{recyclingSpeakerName}</span><p>{recyclingStoryLine.text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceRecyclingStory()}>{constructionBusy ? "Sparar…" : recyclingStoryIndex === recyclingCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {dialogueOpen && dialogueStep && !recyclingStoryOpen && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite">{dialogueStep.kind === "line" && <><span className={`dialogue-speaker ${dialogueStep.speaker === "Barnet" ? "child" : ""}`}>{speakerName}</span><p>{dialogueStep.text}</p><button className="primary-button dialogue-next" onClick={advanceDialogue}>Fortsätt</button></>}{dialogueStep.kind === "name-child" && <><span className="dialogue-speaker">Linus</span><h2>Vad heter du?</h2><input ref={childNameInputRef} className="dog-name-input" defaultValue={childName} onInput={(event) => setChildNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishChildNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ditt namn" /><button className="primary-button dialogue-next" onClick={finishChildNaming} disabled={!childNameCanSubmit}>Det är jag!</button></>}{dialogueStep.kind === "name-dog" && <><span className="dialogue-speaker dog">🐶 Din nya kompis</span><h2>Vad ska valpen heta?</h2><input ref={dogNameInputRef} className="dog-name-input" defaultValue={dogName} onInput={(event) => setDogNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishDogNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ett namn" /><button className="primary-button dialogue-next" onClick={finishDogNaming} disabled={!dogNameCanSubmit}>Det blir namnet!</button></>}</div>}
    {questOpen && introComplete && !recyclingStoryOpen && <div className="quest-card" role="dialog" aria-modal="true" aria-labelledby="quest-title"><button className="close-button" onClick={() => setQuestOpen(false)} aria-label="Stäng">×</button><span className="quest-kicker">Dagens första quest</span><h2 id="quest-title">{makeBedQuest.icon} {makeBedQuest.title}</h2><p>{makeBedQuest.description}</p><div className="quest-reward">Belöning: 💎 {makeBedQuest.reward.diamonds} · 🪙 {makeBedQuest.reward.sysselBux}</div>{questState === "available" && <button className="primary-button" onClick={submitQuest}>Jag har bäddat klart</button>}{questState === "pending" && <div className="pending-message">⏳ Väntar på en vuxen</div>}{questState === "approved" && <div className="approved-message">✓ Godkänd!</div>}</div>}
    {parentMenuOpen && !recyclingStoryOpen && <div className="parent-menu-backdrop" role="presentation" onMouseDown={() => setParentMenuOpen(false)}><section className="parent-menu-panel" role="dialog" aria-modal="true" aria-labelledby="parent-menu-title" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setParentMenuOpen(false)} aria-label="Stäng vuxenläge">×</button><span className="parent-menu-kicker">🔐 Lokal testkontroll</span><h2 id="parent-menu-title">Första quest-loopen</h2><p className="parent-menu-note">Den här panelen finns bara för den lokala prototypquesten Bädda sängen medan save-migreringen testas. Familjekonto och nya föräldrauppdrag hanteras i det riktiga föräldraläget.</p><a className="secondary-button" href="/parent">Öppna föräldraläget</a>
    <div className="parent-profile-card"><span>Barn</span><strong>{childName || "Inte namngivet ännu"}</strong>{dogName && <small>Kompis: 🐶 {dogName}</small>}</div><div className="parent-profile-card"><span>Byutveckling</span><strong>🏗️ {recyclingCenterStatus.title}</strong><small>{recyclingCenterStatus.status}</small></div><div className="parent-section-heading"><h3>Lokal prototyp att godkänna</h3>{pendingCount > 0 && <span>{pendingCount}</span>}</div>
    {questState === "pending" ? <article className="parent-quest-card"><div><span>{makeBedQuest.icon}</span><div><strong>{makeBedQuest.title}</strong><small>Barnet har markerat uppgiften som klar.</small></div></div><div className="parent-quest-actions"><button className="primary-button compact" onClick={approveQuest}>Godkänn</button><button className="secondary-button compact" onClick={needsCompletion}>Behöver kompletteras</button></div></article> : <div className="parent-empty-state">✓ Inget lokalt prototypuppdrag väntar just nu.</div>}
    {nativeTestControls && <div className="parent-profile-card"><span>IPHONE TEST · ingen produkttröskel</span>{[2,3,4].map((stage) => <button key={stage} className="secondary-button" disabled={constructionBusy || construction.revealed.recycling !== stage - 1 || construction.earned.recycling >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `recycling:${stage}`))}>TEST: tjäna in Recycling stage {stage}</button>)}<small>Syns endast i den installerade native-appen. Varje steg kräver att föregående reveal är klar.</small>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    <div className="parent-menu-footer"><span>Den lokala loopen behålls tills reconciliation är testad på fysisk iPhone.</span><button className="debug-reset-button" type="button" onClick={resetPrototypeSave} disabled={!saveReady || resettingSave || constructionBusy}>↺ Nollställ testsparning</button></div></section></div>}
    </div>
  </section>;
}
