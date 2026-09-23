"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import ChildPairingPanel from "./ChildPairingPanel";
import type { QuestState, VillageGameHandle } from "../game/createVillageGame";
import { henningArrivalDialogue, linusIntroDialogue } from "../game/dialogues";
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
  bakeryCompletionPending,
  commitBakeryCompletion,
  type ConstructionState,
} from "../game/construction";
import { constructionPresentation } from "../game/constructionPresentation";
import { recyclingCompletionDialogue } from "../game/recyclingStory";
import { bakeryCompletionDialogue } from "../game/bakeryStory";
import { clearSaveState, loadSaveState, saveSaveState, withConstructionState, type SaveStateV1 } from "../game/saveState";
import { getRecyclingCenterStatus } from "../game/worldProgression";
import { CHILD_PAIRING_OPEN_EVENT } from "../game/childPairingBridge";
import { BACKEND_WALLET_EVENT, getLatestBackendWallet, type BackendWalletSnapshot } from "../game/backendWalletBridge";
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
  const [constructionDialogueIndex, setConstructionDialogueIndex] = useState(0);
  const [recyclingStoryOpen, setRecyclingStoryOpen] = useState(false);
  const [recyclingStoryIndex, setRecyclingStoryIndex] = useState(0);
  const [bakeryStoryIndex, setBakeryStoryIndex] = useState<number | null>(null);
  const [bakeryStoryReplayIndex, setBakeryStoryReplayIndex] = useState<number | null>(null);
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
  const [backendWallet, setBackendWallet] = useState<BackendWalletSnapshot | null>(() => getLatestBackendWallet());
  const [completedQuestIds, setCompletedQuestIds] = useState<QuestId[]>([]);
  const [progression, setProgression] = useState<ProgressionState>(createEmptyProgression);
  const [introComplete, setIntroComplete] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [linusStoryMomentOpen, setLinusStoryMomentOpen] = useState(false);
  const [linusStoryReplayIndex, setLinusStoryReplayIndex] = useState<number | null>(null);
  const [henningStoryIndex, setHenningStoryIndex] = useState<number | null>(null);
  const [henningStoryReplayIndex, setHenningStoryReplayIndex] = useState<number | null>(null);
  const [henningArrivalSeen, setHenningArrivalSeen] = useState(false);
  const [henningDialogueOpen, setHenningDialogueOpen] = useState(false);
  const [henningDialogueIndex, setHenningDialogueIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [childName, setChildName] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogVisible, setDogVisible] = useState(false);
  const [childNameCanSubmit, setChildNameCanSubmit] = useState(false);
  const [dogNameCanSubmit, setDogNameCanSubmit] = useState(false);
  const [parentMenuOpen, setParentMenuOpen] = useState(false);
  const [resettingSave, setResettingSave] = useState(false);
  const [childPairingOpen, setChildPairingOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [saveRetryBusy, setSaveRetryBusy] = useState(false);
  const [bootError, setBootError] = useState(false);

  const dialogueStep = dialogueOpen ? linusIntroDialogue[dialogueIndex] : null;
  const recyclingStoryLine = recyclingStoryOpen ? recyclingCompletionDialogue[recyclingStoryIndex] : null;
  const pendingCount = questState === "pending" ? 1 : 0;
  const recyclingCenterStage = construction.revealed.recycling;
  const recyclingCenterStatus = getRecyclingCenterStatus(recyclingCenterStage);
  const nativePlatform = Capacitor.isNativePlatform();
  const debugToolsEnabled = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "tools";
  const nativeTestControls = nativePlatform;
  const storyMomentReplayControl = nativePlatform;

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const saved = await loadSaveState(true);
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
        setHenningArrivalSeen(saved.worldFlags.henningArrivalSeen === true);
        if (recyclingCompletionPending(saved.construction)) {
          setRecyclingStoryIndex(0);
          setRecyclingStoryOpen(true);
        } else if (bakeryCompletionPending(saved.construction)) {
          setBakeryStoryIndex(0);
        } else if (saved.construction.revealed.recycling >= 4 && saved.worldFlags.henningArrivalSeen !== true) {
          setHenningStoryIndex(0);
        }
      }

      setSaveReady(true);
    }

    void restore().catch((error) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : "Sparningen kunde inte läsas.");
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const syncBackendWallet = (event: Event) => setBackendWallet((event as CustomEvent<BackendWalletSnapshot | null>).detail ?? null);
    window.addEventListener(BACKEND_WALLET_EVENT, syncBackendWallet);
    return () => window.removeEventListener(BACKEND_WALLET_EVENT, syncBackendWallet);
  }, []);

  useEffect(() => {
    const openChildPairing = () => setChildPairingOpen(true);
    window.addEventListener(CHILD_PAIRING_OPEN_EVENT, openChildPairing);
    return () => window.removeEventListener(CHILD_PAIRING_OPEN_EVENT, openChildPairing);
  }, []);

  useEffect(() => {
    if (!saveReady || resettingSave || constructionWriteRef.current) return;
    const snapshot: SaveStateV1 = {
      version: 1, questStates: { makeBed: questState }, completedQuestIds, progression,
      diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, construction,
      worldFlags: { firstDeliveryComplete: recyclingCenterStage >= 1, recyclingCenterStage, henningArrivalSeen },
    };
    latestSaveRef.current = snapshot;
    void saveSaveState(snapshot, true).then(
      () => setSaveError(false),
      () => setSaveError(true),
    );
  }, [construction, constructionBusy, saveReady, resettingSave, questState, completedQuestIds, progression, diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, recyclingCenterStage, henningArrivalSeen]);

  useEffect(() => {
    const syncQuestPresentation = (event: Event) => {
      const detail = (event as CustomEvent<QuestPresentationEventDetail>).detail;
      gameRef.current?.setQuestSourceAttention("noticeboard", (detail?.counts.noticeboard ?? 0) > 0);
      gameRef.current?.setQuestSourceAttention("home", (detail?.counts.home ?? 0) > 0);
      gameRef.current?.setQuestSourceAttention("linus", (detail?.counts.linus ?? 0) > 0);
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
        onQuestSourceInteract: (source) => requestQuestSourceOpen(source),
        onConstructionInteract: (id) => {
          if (residentAttention(constructionRef.current)?.id !== id) { gameRef.current?.setConstructionDialogueOpen(false); return; }
          setConstructionDialogueId(id);
          setConstructionDialogueIndex(0);
        },
        onLinusInteract: () => { setDialogueIndex(0); setDialogueOpen(true); if (!restoredIntroCompleteRef.current) setLinusStoryMomentOpen(true); },
        onHenningInteract: () => { setHenningDialogueIndex(0); setHenningDialogueOpen(true); },
      });
      if (cancelled) { handle.destroy(); return; }
      gameRef.current = handle;
      const questSources = getLatestQuestPresentation().counts;
      handle.setQuestSourceAttention("noticeboard", questSources.noticeboard > 0);
      handle.setQuestSourceAttention("home", questSources.home > 0);
      handle.setQuestSourceAttention("linus", questSources.linus > 0);
      handle.setDogVisible(restoredDogVisibleRef.current);
      handle.setHenningVisible(latestSaveRef.current?.worldFlags.henningArrivalSeen === true);
      handle.setIntroComplete(restoredIntroCompleteRef.current);
      handle.setQuestState(restoredQuestStateRef.current);
      handle.setConstruction(constructionPresentation(constructionRef.current));
    }
    void boot().catch(() => {
      if (!cancelled) setBootError(true);
    });
    return () => { cancelled = true; gameRef.current?.destroy(); gameRef.current = null; };
  }, [saveReady]);

  useEffect(() => { gameRef.current?.setQuestState(questState); }, [questState]);
  useEffect(() => { gameRef.current?.setIntroComplete(introComplete); }, [introComplete]);
  useEffect(() => { gameRef.current?.setDogVisible(dogVisible); }, [dogVisible]);
  useEffect(() => { gameRef.current?.setHenningVisible(henningArrivalSeen); }, [henningArrivalSeen]);
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
      if (revealId === "bakery:4" && bakeryCompletionPending(next)) { setBakeryStoryIndex(0); }
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
      if (!snapshot.worldFlags.henningArrivalSeen) { setQuestOpen(false); setParentMenuOpen(false); setConstructionDialogueId(null); setHenningStoryIndex(0); }
    } catch { setConstructionError("Det gick inte att spara. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  async function advanceHenningStory() {
    if (henningStoryIndex === null || constructionWriteRef.current || !latestSaveRef.current) return;
    const nextIndex = henningStoryIndex + 1;
    if (nextIndex < henningArrivalDialogue.length) {
      setHenningStoryIndex(nextIndex);
      return;
    }
    constructionWriteRef.current = true;
    setConstructionBusy(true);
    setConstructionError("");
    try {
      const snapshot: SaveStateV1 = {
        ...latestSaveRef.current,
        worldFlags: { ...latestSaveRef.current.worldFlags, henningArrivalSeen: true },
      };
      await saveSaveState(snapshot, true);
      latestSaveRef.current = snapshot;
      setHenningArrivalSeen(true);
      gameRef.current?.setHenningVisible(true);
      setHenningStoryIndex(null);
    } catch {
      setConstructionError("Det gick inte att spara. Försök igen.");
    } finally {
      constructionWriteRef.current = false;
      setConstructionBusy(false);
    }
  }


  async function advanceBakeryStory() {
    if (bakeryStoryIndex === null || constructionWriteRef.current || !latestSaveRef.current) return;
    const nextIndex = bakeryStoryIndex + 1;
    if (nextIndex < bakeryCompletionDialogue.length) { setBakeryStoryIndex(nextIndex); return; }
    const next = commitBakeryCompletion(constructionRef.current);
    if (next === constructionRef.current) { setBakeryStoryIndex(null); return; }
    constructionWriteRef.current = true; setConstructionBusy(true); setConstructionError("");
    try {
      const snapshot = withConstructionState(latestSaveRef.current, next);
      await saveSaveState(snapshot, true);
      latestSaveRef.current = snapshot; constructionRef.current = next; setConstruction(next); setBakeryStoryIndex(null);
    } catch { setConstructionError("Det gick inte att spara. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  function replayBakeryStoryMoment() {
    setParentMenuOpen(false); setQuestOpen(false); setConstructionDialogueId(null); setBakeryStoryReplayIndex(0);
  }
  function advanceBakeryStoryReplay() {
    setBakeryStoryReplayIndex((index) => index === null ? null : index + 1 < bakeryCompletionDialogue.length ? index + 1 : null);
  }

  function advanceDialogue() {
    const nextIndex = dialogueIndex + 1; const nextStep = linusIntroDialogue[nextIndex];
    if (!nextStep) { setDialogueOpen(false); setLinusStoryMomentOpen(false); setIntroComplete(true); return; }
    if (nextStep.kind === "reveal-dog") { setDogVisible(true); setDialogueIndex(nextIndex + 1); return; }
    setDialogueIndex(nextIndex);
  }
  function replayLinusStoryMoment() {
    setParentMenuOpen(false);
    setQuestOpen(false);
    setConstructionDialogueId(null);
    setLinusStoryReplayIndex(0);
  }
  function replayHenningStoryMoment() {
    setParentMenuOpen(false);
    setQuestOpen(false);
    setConstructionDialogueId(null);
    setHenningStoryReplayIndex(0);
  }
  function advanceHenningStoryReplay() {
    setHenningStoryReplayIndex((index) => {
      if (index === null) return null;
      return index + 1 < henningArrivalDialogue.length ? index + 1 : null;
    });
  }
  function advanceLinusStoryReplay() {
    setLinusStoryReplayIndex((index) => {
      if (index === null) return null;
      return index + 1 < linusIntroDialogue.length ? index + 1 : null;
    });
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
  const bakeryStoryLine = bakeryStoryIndex === null ? null : bakeryCompletionDialogue[bakeryStoryIndex];
  const bakeryStoryReplayLine = bakeryStoryReplayIndex === null ? null : bakeryCompletionDialogue[bakeryStoryReplayIndex];
  const bakerySpeakerName = bakeryStoryLine?.speaker === "Barnet" ? childName || "Barnet" : bakeryStoryLine?.speaker ?? "";
  const bakeryReplaySpeakerName = bakeryStoryReplayLine?.speaker === "Barnet" ? childName || "Barnet" : bakeryStoryReplayLine?.speaker ?? "";
  const constructionDialogueLine = attention?.dialogue[constructionDialogueIndex] ?? null;
  const constructionSpeakerName = constructionDialogueLine?.speaker === "Barnet" ? childName || "Barnet" : constructionDialogueLine?.speaker ?? "";
  const linusStoryReplayStep = linusStoryReplayIndex === null ? null : linusIntroDialogue[linusStoryReplayIndex];
  const linusStoryReplaySpeaker = linusStoryReplayStep?.kind === "line" && linusStoryReplayStep.speaker === "Barnet" ? childName || "Barnet" : linusStoryReplayStep?.kind === "line" ? linusStoryReplayStep.speaker : "Linus";

  async function retrySave() {
    if (!latestSaveRef.current || saveRetryBusy || constructionWriteRef.current) return;
    setSaveRetryBusy(true);
    try { await saveSaveState(latestSaveRef.current, true); setSaveError(false); }
    catch { setSaveError(true); }
    finally { setSaveRetryBusy(false); }
  }

  if (bootError) return <section className="parent-page"><div className="parent-tool-card" role="alert">
    <h1>Byn kunde inte startas</h1><p>Din sparning finns kvar. Försök öppna byn igen.</p>
    <button className="primary-button" onClick={() => window.location.reload()}>Försök igen</button>
  </div></section>;

  if (loadError) return <section className="parent-page"><div className="parent-tool-card" role="alert">
    <h1>Sparningen kunde inte öppnas</h1><p>{loadError}</p>
    <button className="primary-button" onClick={() => window.location.reload()}>Försök läsa igen</button>
  </div></section>;

  return <section className="prototype-shell">
    <header className="prototype-header"><div className="prototype-brand-row"><h1>Sysselcraft</h1><button className="parent-menu-button" type="button" onClick={() => setParentMenuOpen(true)} aria-label={pendingCount ? `Öppna vuxenläge, ${pendingCount} quest väntar` : "Öppna vuxenläge"}>🔐 Vuxenläge{pendingCount > 0 && <span className="parent-menu-badge">{pendingCount}</span>}</button><p>Första spelbara kärnloopen</p></div><div className="resource-hud" aria-label="Resurser">{dogName && <strong>🐶 {dogName}</strong>}<strong>💎 {backendWallet?.diamonds ?? diamonds}</strong><strong>🪙 {backendWallet?.sysselBux ?? sysselBux}</strong></div></header>
    <div className="game-wrap"><div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" /><div className="game-hint">{attention ? `${attention.residentName} vill prata med dig` : introComplete ? "Tryck i byn för att gå · tryck på questmarkören vid huset" : "Tryck på Linus för att gå fram och hälsa"}</div>
    {bakeryStoryIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/bakery-completion.png" alt="" fill priority sizes="100vw" /></div>}
    {bakeryStoryIndex !== null && bakeryStoryLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Bageriet är färdigt"><span className={`dialogue-speaker henning-story-speaker ${bakeryStoryLine.speaker === "Barnet" ? "child" : bakeryStoryLine.speaker.toLowerCase()}`}>{bakerySpeakerName}</span><p>{bakeryStoryLine.text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceBakeryStory()}>{constructionBusy ? "Sparar…" : bakeryStoryIndex === bakeryCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {bakeryStoryReplayIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/bakery-completion.png" alt="" fill priority sizes="100vw" /></div>}
    {bakeryStoryReplayIndex !== null && bakeryStoryReplayLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Testvisning av färdigt bageri"><span className={`dialogue-speaker henning-story-speaker ${bakeryStoryReplayLine.speaker === "Barnet" ? "child" : bakeryStoryReplayLine.speaker.toLowerCase()}`}>{bakeryReplaySpeakerName}</span><p>{bakeryStoryReplayLine.text}</p><button className="primary-button dialogue-next" onClick={advanceBakeryStoryReplay}>{bakeryStoryReplayIndex === bakeryCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {henningDialogueOpen && (() => {
      const henningDialogue = [
        { speaker: "Henning", text: "Hej igen! Jag börjar faktiskt känna mig hemma här redan." },
        { speaker: "Henning", text: "Linus har förstås hunnit berätta en massa historier om byn. Jag är inte säker på att jag tror på allihop." },
        { speaker: "Linus", text: "Du trodde på dem när du kom hit!" },
        { speaker: "Henning", text: "Jag sa inte att jag inte tyckte om dem." },
        { speaker: "Henning", text: "Men det är något som saknas här..." },
        { speaker: "Henning", text: "Jag behöver fundera lite. Kom tillbaka och prata med mig senare." },
      ] as const;
      const step = henningDialogue[henningDialogueIndex];
      const last = henningDialogueIndex === henningDialogue.length - 1;
      return <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Prata med Henning"><span className={`dialogue-speaker henning-story-speaker ${step.speaker.toLowerCase()}`}>{step.speaker}</span><p>{step.text}</p><button className="primary-button dialogue-next" onClick={() => { if (last) { setHenningDialogueOpen(false); setHenningDialogueIndex(0); } else setHenningDialogueIndex((index) => index + 1); }}>{last ? "Klart" : "Nästa"}</button></div>;
    })()}
    {henningStoryReplayIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/henning-arrival.png" alt="" fill priority sizes="100vw" /></div>}
    {henningStoryReplayIndex !== null && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Testvisning av Henning kommer till byn"><span className={`dialogue-speaker henning-story-speaker ${henningArrivalDialogue[henningStoryReplayIndex].speaker === "Barnet" ? "child" : henningArrivalDialogue[henningStoryReplayIndex].speaker.toLowerCase()}`}>{henningArrivalDialogue[henningStoryReplayIndex].speaker === "Barnet" ? childName || "Barnet" : henningArrivalDialogue[henningStoryReplayIndex].speaker}</span><p>{henningArrivalDialogue[henningStoryReplayIndex].text}</p><button className="primary-button dialogue-next" onClick={advanceHenningStoryReplay}>{henningStoryReplayIndex === henningArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {henningStoryIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/henning-arrival.png" alt="" fill priority sizes="100vw" /></div>}
    {henningStoryIndex !== null && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Henning kommer till byn"><span className={`dialogue-speaker henning-story-speaker ${henningArrivalDialogue[henningStoryIndex].speaker === "Barnet" ? "child" : henningArrivalDialogue[henningStoryIndex].speaker.toLowerCase()}`}>{henningArrivalDialogue[henningStoryIndex].speaker === "Barnet" ? childName || "Barnet" : henningArrivalDialogue[henningStoryIndex].speaker}</span><p>{henningArrivalDialogue[henningStoryIndex].text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceHenningStory()}>{constructionBusy ? "Sparar…" : henningStoryIndex === henningArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {((linusStoryMomentOpen && dialogueOpen) || linusStoryReplayIndex !== null) && !recyclingStoryOpen && <div className="story-moment" role="presentation"><Image src={(linusStoryReplayIndex !== null ? linusStoryReplayIndex : dialogueIndex) >= linusIntroDialogue.findIndex((step) => step.kind === "reveal-dog") ? "/assets/village/story-moments/linus-puppy-handover.png" : "/assets/village/story-moments/linus-first-meeting.png"} alt="" fill priority sizes="100vw" /></div>}
    {constructionDialogueId && attention?.id === constructionDialogueId && constructionDialogueLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Byggplatsens samtal"><span className={`dialogue-speaker ${constructionDialogueLine.speaker === "Barnet" ? "child" : constructionDialogueLine.speaker.toLowerCase()}`}>{constructionSpeakerName}</span><p>{constructionDialogueLine.text}</p><button className="primary-button" disabled={constructionBusy} onClick={() => { if (constructionDialogueIndex + 1 < attention.dialogue.length) setConstructionDialogueIndex((index) => index + 1); else void persistConstruction(commitConstructionReveal(constructionRef.current, attention.id), attention.id); }}>{constructionBusy ? "Sparar…" : constructionDialogueIndex + 1 < attention.dialogue.length ? "Nästa" : "Fortsätt"}</button><button className="secondary-button" disabled={constructionBusy} onClick={() => { setConstructionDialogueId(null); setConstructionDialogueIndex(0); gameRef.current?.setConstructionDialogueOpen(false); }}>Senare</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {recyclingStoryOpen && recyclingStoryLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Återvinningscentralen är färdig"><span className={`dialogue-speaker ${recyclingStoryLine.speaker === "Barnet" ? "child" : ""}`}>{recyclingSpeakerName}</span><p>{recyclingStoryLine.text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceRecyclingStory()}>{constructionBusy ? "Sparar…" : recyclingStoryIndex === recyclingCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {linusStoryReplayStep && !recyclingStoryOpen && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Replay av Linus första möte">{linusStoryReplayStep.kind === "line" && <><span className={`dialogue-speaker ${linusStoryReplayStep.speaker === "Barnet" ? "child" : ""}`}>{linusStoryReplaySpeaker}</span><p>{linusStoryReplayStep.text}</p></>}{linusStoryReplayStep.kind === "name-child" && <><span className="dialogue-speaker">Linus</span><h2>Vad heter du?</h2><p><strong>{childName || "Barnet"}</strong></p></>}{linusStoryReplayStep.kind === "reveal-dog" && <><span className="dialogue-speaker">Linus</span><p>🐶 Valpen kommer fram.</p></>}{linusStoryReplayStep.kind === "name-dog" && <><span className="dialogue-speaker dog">🐶 Din nya kompis</span><h2>Vad ska valpen heta?</h2><p><strong>{dogName || "Valpen"}</strong></p></>}<button className="primary-button dialogue-next" onClick={advanceLinusStoryReplay}>{linusStoryReplayIndex === linusIntroDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {dialogueOpen && dialogueStep && !recyclingStoryOpen && <div className={`dialogue-card ${linusStoryMomentOpen ? "story-moment-dialogue" : ""}`} role="dialog" aria-modal="true" aria-live="polite">{dialogueStep.kind === "line" && <><span className={`dialogue-speaker ${dialogueStep.speaker === "Barnet" ? "child" : ""}`}>{speakerName}</span><p>{dialogueStep.text}</p><button className="primary-button dialogue-next" onClick={advanceDialogue}>Fortsätt</button></>}{dialogueStep.kind === "name-child" && <><span className="dialogue-speaker">Linus</span><h2>Vad heter du?</h2><input ref={childNameInputRef} className="dog-name-input" defaultValue={childName} onInput={(event) => setChildNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishChildNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ditt namn" /><button className="primary-button dialogue-next" onClick={finishChildNaming} disabled={!childNameCanSubmit}>Det är jag!</button></>}{dialogueStep.kind === "name-dog" && <><span className="dialogue-speaker dog">🐶 Din nya kompis</span><h2>Vad ska valpen heta?</h2><input ref={dogNameInputRef} className="dog-name-input" defaultValue={dogName} onInput={(event) => setDogNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishDogNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ett namn" /><button className="primary-button dialogue-next" onClick={finishDogNaming} disabled={!dogNameCanSubmit}>Det blir namnet!</button></>}</div>}
    {questOpen && introComplete && !recyclingStoryOpen && <div className="quest-card" role="dialog" aria-modal="true" aria-labelledby="quest-title"><button className="close-button" onClick={() => setQuestOpen(false)} aria-label="Stäng">×</button><span className="quest-kicker">Dagens första quest</span><h2 id="quest-title">{makeBedQuest.icon} {makeBedQuest.title}</h2><p>{makeBedQuest.description}</p><div className="quest-reward">Belöning: 💎 {makeBedQuest.reward.diamonds} · 🪙 {makeBedQuest.reward.sysselBux}</div>{questState === "available" && <button className="primary-button" onClick={submitQuest}>Jag har bäddat klart</button>}{questState === "pending" && <div className="pending-message">⏳ Väntar på en vuxen</div>}{questState === "approved" && <div className="approved-message">✓ Godkänd!</div>}</div>}
    {parentMenuOpen && !recyclingStoryOpen && <div className="parent-menu-backdrop" role="presentation" onMouseDown={() => setParentMenuOpen(false)}><section className="parent-menu-panel" role="dialog" aria-modal="true" aria-labelledby="parent-menu-title" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setParentMenuOpen(false)} aria-label="Stäng vuxenläge">×</button><span className="parent-menu-kicker">🔐 Vuxenläge</span><h2 id="parent-menu-title">Vuxenläge</h2><p className="parent-menu-note">Här hanteras barnets första lokala uppdrag och kopplingen till familjen. Nya föräldrauppdrag hanteras på förälderns egen enhet.</p>{nativePlatform ? <div className="parent-profile-card"><span>FÖRÄLDRAKONTO</span><strong>Öppnas på förälderns enhet</strong><small>Backend-uppdrag godkänns i SysselCraft föräldraläge på en separat webbläsare/enhet. Barnets app behåller sin anonyma barnsession.</small></div> : <a className="secondary-button" href="/parent/">Öppna föräldraläget</a>}{nativePlatform && <button className="secondary-button" type="button" onClick={() => { setParentMenuOpen(false); setChildPairingOpen(true); }}>Koppla den här barnenheten</button>}
    <div className="parent-profile-card"><span>Barn</span><strong>{childName || "Inte namngivet ännu"}</strong>{dogName && <small>Kompis: 🐶 {dogName}</small>}</div><div className="parent-profile-card"><span>Byutveckling</span><strong>🏗️ {recyclingCenterStatus.title}</strong><small>{recyclingCenterStatus.status}</small></div><div className="parent-section-heading"><h3>Lokal prototyp att godkänna</h3>{pendingCount > 0 && <span>{pendingCount}</span>}</div>
    {questState === "pending" ? <article className="parent-quest-card"><div><span>{makeBedQuest.icon}</span><div><strong>{makeBedQuest.title}</strong><small>Barnet har markerat uppgiften som klar.</small></div></div><div className="parent-quest-actions"><button className="primary-button compact" onClick={approveQuest}>Godkänn</button><button className="secondary-button compact" onClick={needsCompletion}>Behöver kompletteras</button></div></article> : <div className="parent-empty-state">✓ Inget lokalt prototypuppdrag väntar just nu.</div>}
    {storyMomentReplayControl && <div className="parent-profile-card"><span>STORY MOMENT · testvisning</span><button className="secondary-button" type="button" onClick={replayLinusStoryMoment}>🎬 Spela Linus första möte</button><button className="secondary-button" type="button" onClick={replayHenningStoryMoment}>🥖 Spela Hennings ankomst</button><button className="secondary-button" type="button" onClick={replayBakeryStoryMoment}>🥐 Spela färdigt bageri</button><small>Spelar bara upp scenerna. Din sparning och progression ändras inte.</small></div>}
    {nativeTestControls && <div className="parent-profile-card"><span>IPHONE TEST · ingen produkttröskel</span>{[2,3,4].map((stage) => <button key={`recycling-${stage}`} className="secondary-button" disabled={constructionBusy || construction.revealed.recycling !== stage - 1 || construction.earned.recycling >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `recycling:${stage}`))}>TEST: tjäna in Recycling stage {stage}</button>)}{[1,2,3,4].map((stage) => <button key={`bakery-${stage}`} className="secondary-button" disabled={constructionBusy || construction.revealed.bakery !== stage - 1 || construction.earned.bakery >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `bakery:${stage}`))}>TEST: tjäna in Bakery stage {stage}</button>)}<a className="secondary-button" href="/?debug=reconciliation">TEST: reconciliation-diagnostik</a><small>Syns endast i den installerade native-appen. Varje steg kräver att föregående reveal är klar.</small>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {nativeTestControls && <div className="parent-menu-footer"><span>Debugverktyg · aktiverade med ?debug=tools</span><button className="debug-reset-button" type="button" onClick={resetPrototypeSave} disabled={!saveReady || resettingSave || constructionBusy}>↺ Nollställ testsparning</button></div>}</section></div>}
    </div>
    {saveError && <div className="parent-menu-backdrop"><section className="parent-menu-panel" role="alert">
      <h2>Framstegen kunde inte sparas</h2><p>Stäng inte appen ännu. Försök spara igen.</p>
      <button className="primary-button" disabled={saveRetryBusy || constructionBusy} onClick={() => void retrySave()}>{saveRetryBusy ? "Sparar…" : "Försök spara igen"}</button>
    </section></div>}
    {childPairingOpen && <ChildPairingPanel onClose={() => setChildPairingOpen(false)} />}
  </section>;
}
