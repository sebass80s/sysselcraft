"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import ChildPairingPanel from "./ChildPairingPanel";
import type { VillageGameHandle } from "../game/createVillageGame";
import { henningArrivalDialogue, linusIntroDialogue } from "../game/dialogues";
import {
  createEmptyProgression,
  type ProgressionState,
} from "../game/quests";
import {
  initialConstruction,
  earnConstruction,
  residentAttention,
  commitConstructionReveal,
  recyclingCompletionPending,
  commitRecyclingCompletion,
  bakeryCompletionPending,
  commitBakeryCompletion,
  startClinicConstruction,
  type ConstructionState,
} from "../game/construction";
import { constructionPresentation } from "../game/constructionPresentation";
import { recyclingCompletionDialogue } from "../game/recyclingStory";
import { bakeryCompletionDialogue } from "../game/bakeryStory";
import { MIRA_ARRIVAL_SCENE_2_START, miraArrivalDialogue } from "../game/miraStory";
import { bottleMessageDialogue, clinicCompletionDialogue, solArrivalDialogue, solTourDialogue, type SolTourStop } from "../game/solStory";
import { listDiamondRewards, purchaseDiamondReward, type DiamondRewardDefinition } from "../backend/diamondRewards";
import { BOTTLE_MESSAGE_PRICE, commitStoryBeat, purchaseBottleMessage } from "../backend/storyShop";
import { getPairedChildId } from "../backend/childDeviceBinding";
import { getSupabaseBrowserClient } from "../backend/supabaseClient";
import { clearSaveState, loadSaveState, saveSaveState, withConstructionState, type SaveStateV1 } from "../game/saveState";
import { getRecyclingCenterStatus } from "../game/worldProgression";
import { CHILD_PAIRING_OPEN_EVENT } from "../game/childPairingBridge";
import { BACKEND_WALLET_EVENT, getLatestBackendWallet, publishBackendWallet, type BackendWalletSnapshot } from "../game/backendWalletBridge";
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
  const [clinicStoryIndex, setClinicStoryIndex] = useState<number | null>(null);
  const [clinicStoryReplayIndex, setClinicStoryReplayIndex] = useState<number | null>(null);
  const [clinicCompletionSeen, setClinicCompletionSeen] = useState(false);
  const [miraStoryIndex, setMiraStoryIndex] = useState<number | null>(null);
  const [miraStoryReplayIndex, setMiraStoryReplayIndex] = useState<number | null>(null);
  const [bottleStoryIndex, setBottleStoryIndex] = useState<number | null>(null);
  const [bottleLetterOpen, setBottleLetterOpen] = useState(false);
  const [solStoryIndex, setSolStoryIndex] = useState<number | null>(null);
  const [bottleMessagePurchased, setBottleMessagePurchased] = useState(false);
  const [bottleMessageSent, setBottleMessageSent] = useState(false);
  const [solArrivalSeen, setSolArrivalSeen] = useState(false);
  const [solTourBakerySeen, setSolTourBakerySeen] = useState(false);
  const [solTourShopSeen, setSolTourShopSeen] = useState(false);
  const [solTourLinusSeen, setSolTourLinusSeen] = useState(false);
  const [solChoseToStay, setSolChoseToStay] = useState(false);
  const [solTourStoryStop, setSolTourStoryStop] = useState<SolTourStop | null>(null);
  const [solTourStoryIndex, setSolTourStoryIndex] = useState(0);
  const [shopPanelOpen, setShopPanelOpen] = useState(false);
  const [abandonedShopDialogueIndex, setAbandonedShopDialogueIndex] = useState<number | null>(null);
  const [shopCurrency, setShopCurrency] = useState<"diamonds" | "sysselbux">("diamonds");
  const [shopRewards, setShopRewards] = useState<DiamondRewardDefinition[]>([]);
  const [shopBusy, setShopBusy] = useState(false);
  const [shopMessage, setShopMessage] = useState("");
  const attention = residentAttention(construction);
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<VillageGameHandle | null>(null);
  const restoredIntroCompleteRef = useRef(false);
  const restoredDogVisibleRef = useRef(false);
  const childNameInputRef = useRef<HTMLInputElement>(null);
  const dogNameInputRef = useRef<HTMLInputElement>(null);
  const [saveReady, setSaveReady] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [sysselBux, setSysselBux] = useState(0);
  const [backendWallet, setBackendWallet] = useState<BackendWalletSnapshot | null>(() => getLatestBackendWallet());
  const [progression, setProgression] = useState<ProgressionState>(createEmptyProgression);
  const [introComplete, setIntroComplete] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [linusStoryMomentOpen, setLinusStoryMomentOpen] = useState(false);
  const [linusStoryReplayIndex, setLinusStoryReplayIndex] = useState<number | null>(null);
  const [henningStoryIndex, setHenningStoryIndex] = useState<number | null>(null);
  const [henningStoryReplayIndex, setHenningStoryReplayIndex] = useState<number | null>(null);
  const [henningArrivalSeen, setHenningArrivalSeen] = useState(false);
  const [miraArrivalSeen, setMiraArrivalSeen] = useState(false);
  const [henningDialogueOpen, setHenningDialogueOpen] = useState(false);
  const [henningDialogueIndex, setHenningDialogueIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [childName, setChildName] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogVisible, setDogVisible] = useState(false);
  const [childNameCanSubmit, setChildNameCanSubmit] = useState(false);
  const [dogNameCanSubmit, setDogNameCanSubmit] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [parentMenuOpen, setParentMenuOpen] = useState(false);
  const [resettingSave, setResettingSave] = useState(false);
  const [childPairingOpen, setChildPairingOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [saveRetryBusy, setSaveRetryBusy] = useState(false);
  const [bootError, setBootError] = useState(false);
  const [debugToolsEnabled, setDebugToolsEnabled] = useState(false);
  const [solSafeTestOpen, setSolSafeTestOpen] = useState(false);
  const [solSafeTestPhase, setSolSafeTestPhase] = useState<"shop" | "water" | "letter" | "bottle" | "arrival" | SolTourStop | "done">("shop");
  const [solSafeTestIndex, setSolSafeTestIndex] = useState(0);

  const dialogueStep = dialogueOpen ? linusIntroDialogue[dialogueIndex] : null;
  const recyclingStoryLine = recyclingStoryOpen ? recyclingCompletionDialogue[recyclingStoryIndex] : null;
  const recyclingCenterStage = construction.revealed.recycling;
  const recyclingCenterStatus = getRecyclingCenterStatus(recyclingCenterStage);
  const nativePlatform = Capacitor.isNativePlatform();
  const nativeTestControls = nativePlatform && debugToolsEnabled;
  const storyMomentReplayControl = nativePlatform && debugToolsEnabled;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebugToolsEnabled(new URLSearchParams(window.location.search).get("debug") === "tools");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reloadConstruction = async () => {
      try {
        const saved = await loadSaveState(true);
        if (!saved) return;
        latestSaveRef.current = saved;
        constructionRef.current = saved.construction;
        setConstruction(saved.construction);
      } catch {
        setConstructionError("Byggframstegen kunde inte läsas om.");
      }
    };
    window.addEventListener("sysselcraft:construction-save-changed", reloadConstruction);
    return () => window.removeEventListener("sysselcraft:construction-save-changed", reloadConstruction);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const saved = await loadSaveState(true);
      if (cancelled) return;

      if (saved) {
        constructionRef.current = saved.construction;
        setConstruction(saved.construction);
        restoredIntroCompleteRef.current = saved.introComplete;
        restoredDogVisibleRef.current = saved.dogVisible;

        setDiamonds(saved.diamonds);
        setSysselBux(saved.sysselBux);
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
        setMiraArrivalSeen(saved.worldFlags.miraArrivalSeen === true);
        setBottleMessagePurchased(saved.worldFlags.bottleMessagePurchased === true);
        setBottleMessageSent(saved.worldFlags.bottleMessageSent === true);
        setSolArrivalSeen(saved.worldFlags.solArrivalSeen === true);
        setSolTourBakerySeen(saved.worldFlags.solTourBakerySeen === true);
        setSolTourShopSeen(saved.worldFlags.solTourShopSeen === true);
        setSolTourLinusSeen(saved.worldFlags.solTourLinusSeen === true);
        setSolChoseToStay(saved.worldFlags.solChoseToStay === true);
        setClinicCompletionSeen(saved.worldFlags.clinicCompletionSeen === true);
        if (recyclingCompletionPending(saved.construction)) {
          setRecyclingStoryIndex(0);
          setRecyclingStoryOpen(true);
        } else if (bakeryCompletionPending(saved.construction)) {
          setBakeryStoryIndex(0);
        } else if (saved.construction.completedStoryBeats.includes("bakery:completion") && saved.worldFlags.miraArrivalSeen !== true) {
          setMiraStoryIndex(0);
        } else if (saved.construction.revealed.clinic >= 4 && saved.worldFlags.clinicCompletionSeen !== true) {
          setClinicStoryIndex(0);
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
      version: 1, progression,
      diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, construction,
      worldFlags: {
        ...latestSaveRef.current?.worldFlags,
        firstDeliveryComplete: recyclingCenterStage >= 1,
        recyclingCenterStage,
        henningArrivalSeen,
        miraArrivalSeen,
        bottleMessagePurchased,
        bottleMessageSent,
        solArrivalSeen,
        solTourBakerySeen, solTourShopSeen, solTourLinusSeen, solChoseToStay,
        clinicCompletionSeen,
      },
    };
    latestSaveRef.current = snapshot;
    void saveSaveState(snapshot, true).then(
      () => setSaveError(false),
      () => setSaveError(true),
    );
  }, [construction, constructionBusy, saveReady, resettingSave, progression, diamonds, sysselBux, introComplete, dialogueOpen, dialogueIndex, childName, dogName, dogVisible, recyclingCenterStage, henningArrivalSeen, miraArrivalSeen, bottleMessagePurchased, bottleMessageSent, solArrivalSeen, solTourBakerySeen, solTourShopSeen, solTourLinusSeen, solChoseToStay, clinicCompletionSeen]);

  useEffect(() => {
    const syncQuestPresentation = (event: Event) => {
      const detail = (event as CustomEvent<QuestPresentationEventDetail>).detail;
      gameRef.current?.setQuestSourceAttention("noticeboard", (detail?.counts.noticeboard ?? 0) > 0 ? "?" : null);
      gameRef.current?.setQuestSourceAttention("home", (detail?.counts.home ?? 0) > 0 ? "?" : null);
      const linusTurnIns = detail?.turnIns?.linus ?? 0;
      gameRef.current?.setQuestSourceAttention("linus", linusTurnIns > 0 ? "!" : (detail?.counts.linus ?? 0) > 0 ? "?" : null);
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
        onQuestSourceInteract: (source) => requestQuestSourceOpen(source),
        onConstructionInteract: (id) => {
          if (residentAttention(constructionRef.current)?.id !== id) { gameRef.current?.setConstructionDialogueOpen(false); return; }
          setConstructionDialogueId(id);
          setConstructionDialogueIndex(0);
        },
        onLinusInteract: () => {
          const flags = latestSaveRef.current?.worldFlags;
          if (flags?.solArrivalSeen && flags.solTourShopSeen && !flags.solTourLinusSeen) { setSolTourStoryStop("linus"); setSolTourStoryIndex(0); return; }
          // The naming/dog sequence is onboarding only. Once intro is complete, Linus must
          // never restart it when tapped again.
          if (restoredIntroCompleteRef.current) return;
          setDialogueIndex(0);
          setDialogueOpen(true);
          setLinusStoryMomentOpen(true);
        },
        onHenningInteract: () => {
          const flags = latestSaveRef.current?.worldFlags;
          if (flags?.solArrivalSeen && !flags.solTourBakerySeen) { setSolTourStoryStop("bakery"); setSolTourStoryIndex(0); return; }
          setHenningDialogueIndex(0); setHenningDialogueOpen(true);
        },
        onBottleMessageInteract: () => { setBottleLetterOpen(true); gameRef.current?.setConstructionDialogueOpen(true); },
        onSolInteract: () => {
          const flags = latestSaveRef.current?.worldFlags;
          if (flags?.solTourLinusSeen && !flags.solChoseToStay) { setSolTourStoryStop("decision"); setSolTourStoryIndex(0); }
        },
        onAbandonedShopInteract: () => {
          setAbandonedShopDialogueIndex(0);
          gameRef.current?.setConstructionDialogueOpen(true);
        },
        onShopInteract: () => {
          const flags = latestSaveRef.current?.worldFlags;
          if (flags?.solTourBakerySeen && !flags.solTourShopSeen) { setSolTourStoryStop("shop"); setSolTourStoryIndex(0); return; }
          gameRef.current?.setConstructionDialogueOpen(true); setShopPanelOpen(true); setShopCurrency("diamonds"); setShopMessage("");
          void (async () => {
            try {
              const childId = await getPairedChildId();
              if (!childId) throw new Error("Barnets enhet är inte kopplad.");
              const client = getSupabaseBrowserClient();
              const { data: child, error } = await client.from("children").select("household_id").eq("id", childId).single();
              if (error) throw error;
              setShopRewards((await listDiamondRewards(child.household_id)).filter((reward) => reward.active));
            } catch (error) { setShopMessage(error instanceof Error ? error.message : "Kunde inte hämta Miras varor."); }
          })();
        },
      });
      if (cancelled) { handle.destroy(); return; }
      gameRef.current = handle;
      const questPresentation = getLatestQuestPresentation();
      const questSources = questPresentation.counts;
      handle.setQuestSourceAttention("noticeboard", questSources.noticeboard > 0 ? "?" : null);
      handle.setQuestSourceAttention("home", questSources.home > 0 ? "?" : null);
      handle.setQuestSourceAttention("linus", (questPresentation.turnIns?.linus ?? 0) > 0 ? "!" : questSources.linus > 0 ? "?" : null);
      handle.setDogVisible(restoredDogVisibleRef.current);
      handle.setHenningVisible(latestSaveRef.current?.worldFlags.henningArrivalSeen === true);
      handle.setSolVisible(latestSaveRef.current?.worldFlags.solArrivalSeen === true);
      handle.setShopOpen(latestSaveRef.current?.worldFlags.miraArrivalSeen === true);
      handle.setBottleMessageReady(latestSaveRef.current?.worldFlags.bottleMessagePurchased === true && latestSaveRef.current?.worldFlags.bottleMessageSent !== true);
      const solFlags = latestSaveRef.current?.worldFlags;
      handle.setSolTourStop(!solFlags?.solArrivalSeen || solFlags.solChoseToStay ? null : !solFlags.solTourBakerySeen ? "bakery" : !solFlags.solTourShopSeen ? "shop" : !solFlags.solTourLinusSeen ? "linus" : "decision");
      handle.setIntroComplete(restoredIntroCompleteRef.current);
      handle.setConstruction(constructionPresentation(constructionRef.current));
    }
    void boot().catch(() => {
      if (!cancelled) setBootError(true);
    });
    return () => { cancelled = true; gameRef.current?.destroy(); gameRef.current = null; };
  }, [saveReady]);

  useEffect(() => { gameRef.current?.setIntroComplete(introComplete); }, [introComplete]);
  useEffect(() => { gameRef.current?.setDogVisible(dogVisible); }, [dogVisible]);
  useEffect(() => { gameRef.current?.setHenningVisible(henningArrivalSeen); }, [henningArrivalSeen]);
  useEffect(() => { gameRef.current?.setSolVisible(solArrivalSeen); }, [solArrivalSeen]);
  useEffect(() => { gameRef.current?.setBottleMessageReady(bottleMessagePurchased && !bottleMessageSent); }, [bottleMessagePurchased, bottleMessageSent]);
  useEffect(() => {
    const stop = !solArrivalSeen || solChoseToStay ? null : !solTourBakerySeen ? "bakery" : !solTourShopSeen ? "shop" : !solTourLinusSeen ? "linus" : "decision";
    gameRef.current?.setSolTourStop(stop);
  }, [solArrivalSeen, solTourBakerySeen, solTourShopSeen, solTourLinusSeen, solChoseToStay]);
  useEffect(() => {
    if (!saveReady || !bottleMessageSent || solArrivalSeen || bottleLetterOpen || bottleStoryIndex !== null || solStoryIndex !== null) return;
    const timer = window.setTimeout(() => setSolStoryIndex(0), 1200);
    return () => window.clearTimeout(timer);
  }, [saveReady, bottleMessageSent, solArrivalSeen, bottleLetterOpen, bottleStoryIndex, solStoryIndex]);
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
      if (revealId === "clinic:4") { setClinicStoryIndex(0); }
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
      if (!snapshot.worldFlags.henningArrivalSeen) { setParentMenuOpen(false); setConstructionDialogueId(null); setHenningStoryIndex(0); }
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
      latestSaveRef.current = snapshot; constructionRef.current = next; setConstruction(next); setBakeryStoryIndex(null); setMiraStoryIndex(0);
    } catch { setConstructionError("Det gick inte att spara. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  async function advanceClinicStory() {
    if (clinicStoryIndex === null || !latestSaveRef.current || constructionWriteRef.current) return;
    const nextIndex = clinicStoryIndex + 1;
    if (nextIndex < clinicCompletionDialogue.length) { setClinicStoryIndex(nextIndex); return; }
    constructionWriteRef.current = true; setConstructionBusy(true); setConstructionError("");
    try {
      const snapshot: SaveStateV1 = { ...latestSaveRef.current, worldFlags: { ...latestSaveRef.current.worldFlags, clinicCompletionSeen: true } };
      await saveSaveState(snapshot, true); latestSaveRef.current = snapshot; setClinicCompletionSeen(true); setClinicStoryIndex(null);
    } catch { setConstructionError("Det gick inte att spara klinikens avslutning. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  function replayClinicStoryMoment() { setParentMenuOpen(false); setConstructionDialogueId(null); setClinicStoryReplayIndex(0); }
  function advanceClinicStoryReplay() { setClinicStoryReplayIndex((index) => index === null ? null : index + 1 < clinicCompletionDialogue.length ? index + 1 : null); }

  async function advanceMiraStory() {
    if (miraStoryIndex === null || constructionWriteRef.current || !latestSaveRef.current) return;
    const nextIndex = miraStoryIndex + 1;
    if (nextIndex < miraArrivalDialogue.length) { setMiraStoryIndex(nextIndex); return; }
    constructionWriteRef.current = true; setConstructionBusy(true); setConstructionError("");
    try {
      const snapshot: SaveStateV1 = {
        ...latestSaveRef.current,
        worldFlags: { ...latestSaveRef.current.worldFlags, miraArrivalSeen: true },
      };
      await saveSaveState(snapshot, true);
      latestSaveRef.current = snapshot;
      setMiraArrivalSeen(true);
      gameRef.current?.setShopOpen(true);
      setMiraStoryIndex(null);
    } catch { setConstructionError("Det gick inte att spara. Försök igen."); }
    finally { constructionWriteRef.current = false; setConstructionBusy(false); }
  }

  async function buyBottleMessage() {
    if (shopBusy || bottleMessagePurchased) return;
    if (!window.confirm(`Köpa Flaskpost för ${BOTTLE_MESSAGE_PRICE} 🪙?`)) return;
    setShopBusy(true); setShopMessage("");
    try {
      const purchase = await purchaseBottleMessage();
      const currentWallet = getLatestBackendWallet() ?? backendWallet;
      const purchasedWallet: BackendWalletSnapshot = {
        diamonds: currentWallet?.diamonds ?? diamonds,
        sysselBux: purchase.sysselBux,
      };
      setBackendWallet(purchasedWallet);
      publishBackendWallet(purchasedWallet);
      setBottleMessagePurchased(true);
      if (latestSaveRef.current) {
        const snapshot = { ...latestSaveRef.current, worldFlags: { ...latestSaveRef.current.worldFlags, bottleMessagePurchased: true } };
        latestSaveRef.current = snapshot;
        await saveSaveState(snapshot, true);
      }
      gameRef.current?.setBottleMessageReady(true);
      setShopMessage("Flaskposten är din! Ta den ner till vattnet. 🍾");
      window.dispatchEvent(new Event("sysselcraft:backend-wallet-refresh"));
    } catch (error) {
      const text = error instanceof Error ? error.message : "Köpet misslyckades.";
      setShopMessage(text.includes("insufficient sysselbux") ? "Du har inte tillräckligt många SysselBux." : text);
    } finally { setShopBusy(false); }
  }

  function advanceBottleLetter() {
    setBottleLetterOpen(false);
    setBottleStoryIndex(0);
  }

  async function advanceBottleStory() {
    if (bottleStoryIndex === null || constructionBusy) return;
    if (bottleStoryIndex + 1 < bottleMessageDialogue.length) { setBottleStoryIndex(bottleStoryIndex + 1); return; }
    setConstructionBusy(true);
    try {
      await commitStoryBeat("bottle_message_sent");
      setBottleMessageSent(true);
      if (latestSaveRef.current) {
        const snapshot = { ...latestSaveRef.current, worldFlags: { ...latestSaveRef.current.worldFlags, bottleMessageSent: true } };
        latestSaveRef.current = snapshot;
        await saveSaveState(snapshot, true);
      }
      gameRef.current?.setBottleMessageReady(false);
      gameRef.current?.setConstructionDialogueOpen(false);
      setBottleStoryIndex(null);
    } catch { setConstructionError("Flaskposten kunde inte sparas. Försök igen."); }
    finally { setConstructionBusy(false); }
  }

  async function advanceSolStory() {
    if (solStoryIndex === null || constructionBusy) return;
    if (solStoryIndex + 1 < solArrivalDialogue.length) { setSolStoryIndex(solStoryIndex + 1); return; }
    setConstructionBusy(true);
    try {
      await commitStoryBeat("sol_arrival_seen");
      setSolArrivalSeen(true);
      if (latestSaveRef.current) {
        const snapshot = { ...latestSaveRef.current, worldFlags: { ...latestSaveRef.current.worldFlags, solArrivalSeen: true } };
        latestSaveRef.current = snapshot;
        await saveSaveState(snapshot, true);
      }
      setSolStoryIndex(null);
    } catch { setConstructionError("Sols ankomst kunde inte sparas. Försök igen."); }
    finally { setConstructionBusy(false); }
  }

  async function advanceSolTourStory() {
    if (!solTourStoryStop || constructionBusy || !latestSaveRef.current) return;
    const lines = solTourDialogue[solTourStoryStop];
    if (solTourStoryIndex + 1 < lines.length) { setSolTourStoryIndex(solTourStoryIndex + 1); return; }
    const beat = solTourStoryStop === "bakery" ? "sol_tour_bakery_seen" : solTourStoryStop === "shop" ? "sol_tour_shop_seen" : solTourStoryStop === "linus" ? "sol_tour_linus_seen" : "sol_chose_to_stay";
    setConstructionBusy(true); setConstructionError("");
    try {
      const flags = await commitStoryBeat(beat);
      const nextFlags = { ...latestSaveRef.current.worldFlags };
      if (solTourStoryStop === "bakery") { nextFlags.solTourBakerySeen = true; setSolTourBakerySeen(true); }
      else if (solTourStoryStop === "shop") { nextFlags.solTourShopSeen = true; setSolTourShopSeen(true); }
      else if (solTourStoryStop === "linus") { nextFlags.solTourLinusSeen = true; setSolTourLinusSeen(true); }
      else {
        nextFlags.solChoseToStay = true; setSolChoseToStay(true);
        if (typeof flags.clinicProgressionBaseline === "number") nextFlags.clinicProgressionBaseline = flags.clinicProgressionBaseline;
      }
      let snapshot = { ...latestSaveRef.current, worldFlags: nextFlags };
      if (solTourStoryStop === "decision") {
        const nextConstruction = startClinicConstruction(snapshot.construction);
        snapshot = withConstructionState(snapshot, nextConstruction);
        constructionRef.current = nextConstruction; setConstruction(nextConstruction);
        gameRef.current?.setConstruction(constructionPresentation(nextConstruction));
      }
      latestSaveRef.current = snapshot; await saveSaveState(snapshot, true);
      setSolTourStoryStop(null); setSolTourStoryIndex(0);
    } catch { setConstructionError("Sols berättelse kunde inte sparas. Försök igen."); }
    finally { setConstructionBusy(false); }
  }

  async function buyDiamondReward(reward: DiamondRewardDefinition) {
    if (shopBusy) return;
    if (!window.confirm(`Köpa "${reward.title}" för ${reward.diamondPrice} 💎?`)) return;
    setShopBusy(true); setShopMessage("");
    try {
      await purchaseDiamondReward(reward.id);
      setBackendWallet((wallet) => wallet ? { ...wallet, diamonds: Math.max(0, wallet.diamonds - reward.diamondPrice) } : wallet);
      window.dispatchEvent(new Event("sysselcraft:backend-wallet-refresh"));
      setShopMessage(`Köpt! Be en vuxen om ${reward.title}. 🎁`);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Köpet misslyckades.";
      setShopMessage(text.includes("insufficient diamonds") ? "Du har inte tillräckligt många diamanter." : text);
    } finally { setShopBusy(false); }
  }

  function closeShop() {
    setShopPanelOpen(false);
    gameRef.current?.setConstructionDialogueOpen(false);
  }

  function openSolSafeTest() { setParentMenuOpen(false); setSolSafeTestPhase("shop"); setSolSafeTestIndex(0); setSolSafeTestOpen(true); }
  function advanceSolSafeTest() {
    const phase = solSafeTestPhase;
    const lines = phase === "bottle" ? bottleMessageDialogue : phase === "arrival" ? solArrivalDialogue : (["bakery","shop","linus","decision"] as string[]).includes(phase) ? solTourDialogue[phase as SolTourStop] : [];
    if (solSafeTestIndex + 1 < lines.length) { setSolSafeTestIndex((i) => i + 1); return; }
    setSolSafeTestIndex(0);
    if (phase === "bottle") setSolSafeTestPhase("arrival");
    else if (phase === "arrival") setSolSafeTestPhase("bakery");
    else if (phase === "bakery") setSolSafeTestPhase("shop");
    else if (phase === "shop") setSolSafeTestPhase("linus");
    else if (phase === "linus") setSolSafeTestPhase("decision");
    else if (phase === "decision") setSolSafeTestPhase("done");
  }

  function replayMiraStoryMoment() {
    setParentMenuOpen(false); setConstructionDialogueId(null); setMiraStoryReplayIndex(0);
  }
  function advanceMiraStoryReplay() {
    setMiraStoryReplayIndex((index) => index === null ? null : index + 1 < miraArrivalDialogue.length ? index + 1 : null);
  }

  function replayBakeryStoryMoment() {
    setParentMenuOpen(false); setConstructionDialogueId(null); setBakeryStoryReplayIndex(0);
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
   
    setConstructionDialogueId(null);
    setLinusStoryReplayIndex(0);
  }
  function replayHenningStoryMoment() {
    setParentMenuOpen(false);
   
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
  async function resetPrototypeSave() {
    if (resettingSave) return;
    if (!window.confirm("Nollställ Sysselcraft-testet? Barnnamn, hundnamn, quest, resurser och världsläge raderas på den här enheten.")) return;
    setResettingSave(true);
    try { await clearSaveState(); window.location.reload(); } catch { setResettingSave(false); window.alert("Det gick inte att nollställa sparningen."); }
  }

  const speakerName = dialogueStep?.kind === "line" && dialogueStep.speaker === "Barnet" ? childName || "Barnet" : dialogueStep?.kind === "line" ? dialogueStep.speaker : "";
  const recyclingSpeakerName = recyclingStoryLine?.speaker === "Barnet" ? childName || "Barnet" : recyclingStoryLine?.speaker ?? "";
  const bakeryStoryLine = bakeryStoryIndex === null ? null : bakeryCompletionDialogue[bakeryStoryIndex];
  const clinicStoryLine = clinicStoryIndex === null ? null : clinicCompletionDialogue[clinicStoryIndex];
  const clinicStoryReplayLine = clinicStoryReplayIndex === null ? null : clinicCompletionDialogue[clinicStoryReplayIndex];
  const clinicSpeakerName = clinicStoryLine?.speaker === "Barnet" ? childName || "Barnet" : clinicStoryLine?.speaker ?? "";
  const clinicReplaySpeakerName = clinicStoryReplayLine?.speaker === "Barnet" ? childName || "Barnet" : clinicStoryReplayLine?.speaker ?? "";
  const bakeryStoryReplayLine = bakeryStoryReplayIndex === null ? null : bakeryCompletionDialogue[bakeryStoryReplayIndex];
  const bakerySpeakerName = bakeryStoryLine?.speaker === "Barnet" ? childName || "Barnet" : bakeryStoryLine?.speaker ?? "";
  const bakeryReplaySpeakerName = bakeryStoryReplayLine?.speaker === "Barnet" ? childName || "Barnet" : bakeryStoryReplayLine?.speaker ?? "";
  const miraStoryLine = miraStoryIndex === null ? null : miraArrivalDialogue[miraStoryIndex];
  const miraStoryReplayLine = miraStoryReplayIndex === null ? null : miraArrivalDialogue[miraStoryReplayIndex];
  const miraSpeakerName = miraStoryLine?.speaker === "Barnet" ? childName || "Barnet" : miraStoryLine?.speaker ?? "";
  const miraReplaySpeakerName = miraStoryReplayLine?.speaker === "Barnet" ? childName || "Barnet" : miraStoryReplayLine?.speaker ?? "";
  const miraStoryText = miraStoryLine?.text.replace("[barnets namn]", childName || "Barnet") ?? "";
  const miraReplayText = miraStoryReplayLine?.text.replace("[barnets namn]", childName || "Barnet") ?? "";
  const solTourStoryLine = solTourStoryStop ? solTourDialogue[solTourStoryStop][solTourStoryIndex] : null;
  const solTourSpeakerName = solTourStoryLine?.speaker === "Barnet" ? childName || "Barnet" : solTourStoryLine?.speaker === "Hunden" ? dogName || "Hunden" : solTourStoryLine?.speaker ?? "";
  const solTourImage = solTourStoryStop === "bakery" ? "/assets/village/story-moments/sol-tour-bakery.png" : solTourStoryStop === "shop" ? "/assets/village/story-moments/sol-tour-shop.png" : solTourStoryStop === "linus" ? (solTourStoryIndex >= 1 ? "/assets/village/story-moments/sol-tour-linus-knee.png" : "/assets/village/story-moments/sol-tour-linus.png") : solTourStoryStop === "decision" ? "/assets/village/story-moments/sol-stays.png" : "";
  const abandonedShopDialogue = [
    { speaker: "Barnet", text: "Linus, vad är det där för hus?" },
    { speaker: "Linus", text: "Det där? Det är den gamla lanthandeln." },
    { speaker: "Barnet", text: "En affär? Varför är den stängd?" },
    { speaker: "Linus", text: "Den har varit övergiven länge. Förr kunde man köpa nästan allt där. Mat, verktyg, godis... ja, det viktiga." },
    { speaker: "Barnet", text: "Kan vi inte öppna den igen?" },
    { speaker: "Linus", text: "Vi behöver någon som vill driva den först." },
    { speaker: "Barnet", text: "Vem då?" },
    { speaker: "Linus", text: "Ingen aning. Kanske dyker rätt person upp någon dag." },
  ] as const;
  const abandonedShopDialogueLine = abandonedShopDialogueIndex === null ? null : abandonedShopDialogue[abandonedShopDialogueIndex];
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
    <header className="prototype-header"><div className="prototype-brand-row"><button className="prototype-brand-button" type="button" onClick={() => setMainMenuOpen((open) => !open)} aria-expanded={mainMenuOpen} aria-haspopup="menu" aria-label="Öppna SysselCraft-menyn"><Image className="prototype-brand-logo" src="/assets/village/sysselcraft-logo.png" alt="" width={360} height={124} priority /></button>{mainMenuOpen && <div className="main-menu-popover" role="menu"><button className="parent-menu-button" role="menuitem" type="button" onClick={() => { setMainMenuOpen(false); setParentMenuOpen(true); }}>🔐 Vuxenläge</button></div>}</div><div className="resource-hud" aria-label="Resurser">{dogName && <strong>🐶 {dogName}</strong>}<strong>💎 {backendWallet?.diamonds ?? diamonds}</strong><strong>🪙 {backendWallet?.sysselBux ?? sysselBux}</strong></div></header>
    <div className="game-wrap"><div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" /><div className="game-hint">{attention ? `${attention.residentName} vill prata med dig` : introComplete ? "Tryck i byn för att gå · tryck på personer och questmarkörer för att interagera" : "Tryck på Linus för att gå fram och hälsa"}</div>
    {shopPanelOpen && <div className="mira-shop" role="dialog" aria-modal="true" aria-labelledby="shop-title">
      <Image className="mira-shop-scene" src="/assets/village/mira-shop-interior.png" alt="" fill priority sizes="100vw" />
      <div className="mira-shop-ui">
        <button className="mira-shop-close" onClick={closeShop} aria-label="Gå tillbaka till byn">← Till byn</button>
        <div className="mira-shop-wallet" aria-label="Dina pengar"><strong>🪙 {backendWallet?.sysselBux ?? sysselBux}</strong><strong>💎 {backendWallet?.diamonds ?? diamonds}</strong></div>
        <section className="mira-shop-counter" aria-labelledby="shop-title">
          <h2 id="shop-title" className="sr-only">Miras lanthandel</h2>
          <nav className="mira-shop-tabs" aria-label="Välj butikshylla">
            <button type="button" className={shopCurrency === "sysselbux" ? "active" : ""} onClick={() => { setShopCurrency("sysselbux"); setShopMessage(""); }}>🪙 Saker till min värld</button>
            <button type="button" className={shopCurrency === "diamonds" ? "active" : ""} onClick={() => { setShopCurrency("diamonds"); setShopMessage(""); }}>💎 Verkliga belöningar</button>
          </nav>
          <div className="mira-shop-shelf">
            {shopCurrency === "diamonds" ? <>
              <div className="mira-shop-grid">{shopRewards.map((reward) => <article className="mira-shop-item" key={reward.id}><div><span>🎁</span><strong>{reward.title}</strong>{reward.description && <p>{reward.description}</p>}</div><button className="primary-button" disabled={shopBusy || (backendWallet?.diamonds ?? diamonds) < reward.diamondPrice} onClick={() => void buyDiamondReward(reward)}>💎 {reward.diamondPrice} · Köp</button></article>)}</div>
              {shopRewards.length === 0 && !shopMessage && <p className="mira-shop-empty">Inga diamantbelöningar på hyllan just nu.</p>}
            </> : <div className="mira-shop-grid"><article className="mira-shop-item"><div><span>🍾</span><strong>Flaskpost</strong><p>Skriv ett meddelande till någon där ute. Vem vet vem som hittar det?</p></div><button className="primary-button" disabled={shopBusy || bottleMessagePurchased || (backendWallet?.sysselBux ?? sysselBux) < BOTTLE_MESSAGE_PRICE} onClick={() => void buyBottleMessage()}>{bottleMessagePurchased ? "✓ Köpt" : `🪙 ${BOTTLE_MESSAGE_PRICE} · Köp`}</button></article></div>}
            {shopMessage && <p className="pending-message mira-shop-message" role="status">{shopMessage}</p>}
          </div>
        </section>
      </div>
    </div>}
    {bottleLetterOpen && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/bottle-letter.png" alt="Barnet läser brevet som ska skickas som flaskpost" fill priority sizes="100vw" /></div>}
    {bottleLetterOpen && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-label="Brevet i flaskposten"><span className="dialogue-speaker child">{childName || "Barnet"}</span><p>Brevet är klart.</p><button className="primary-button dialogue-next" onClick={advanceBottleLetter}>Gå till vattnet</button></div>}
    {bottleStoryIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/bottle-message.png" alt="" fill priority sizes="100vw" /></div>}
    {bottleStoryIndex !== null && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-label="Skicka flaskpost"><span className={`dialogue-speaker ${bottleMessageDialogue[bottleStoryIndex].speaker === "Barnet" ? "child" : "dog"}`}>{bottleMessageDialogue[bottleStoryIndex].speaker === "Hunden" ? dogName || "Hunden" : childName || "Barnet"}</span><p>{bottleMessageDialogue[bottleStoryIndex].text.replace("{dogName}", dogName || "kompis")}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceBottleStory()}>{constructionBusy ? "Sparar…" : bottleStoryIndex === bottleMessageDialogue.length - 1 ? "Kasta iväg!" : "Fortsätt"}</button></div>}
    {solStoryIndex !== null && <div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/sol-arrival.png" alt="" fill priority sizes="100vw" /></div>}
    {solStoryIndex !== null && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-label="Sol kommer till byn"><span className={`dialogue-speaker henning-story-speaker ${solArrivalDialogue[solStoryIndex].speaker === "Barnet" ? "child" : "sol"}`}>{solArrivalDialogue[solStoryIndex].speaker === "Barnet" ? childName || "Barnet" : "Sol"}</span><p>{solArrivalDialogue[solStoryIndex].text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceSolStory()}>{constructionBusy ? "Sparar…" : solStoryIndex === solArrivalDialogue.length - 1 ? "Se dig omkring" : "Fortsätt"}</button></div>}
    {solTourStoryStop && solTourStoryLine && <><div className="story-moment" role="presentation"><Image src={solTourImage} alt="" fill priority sizes="100vw" /></div><div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-label="Sol ser sig omkring i byn"><span className={`dialogue-speaker henning-story-speaker ${solTourStoryLine.speaker === "Barnet" ? "child" : solTourStoryLine.speaker.toLowerCase()}`}>{solTourSpeakerName}</span><p>{solTourStoryLine.text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceSolTourStory()}>{constructionBusy ? "Sparar…" : solTourStoryIndex === solTourDialogue[solTourStoryStop].length - 1 ? (solTourStoryStop === "decision" ? "Vi bygger kliniken!" : "Fortsätt rundturen") : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div></>}
    {miraStoryIndex !== null && <div className="story-moment" role="presentation"><Image src={miraStoryIndex >= MIRA_ARRIVAL_SCENE_2_START ? "/assets/village/story-moments/mira-discovers-lanthandel.png" : "/assets/village/story-moments/mira-arrival.png"} alt="" fill priority sizes="100vw" /></div>}
    {miraStoryIndex !== null && miraStoryLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Mira kommer till byn"><span className={`dialogue-speaker henning-story-speaker ${miraStoryLine.speaker === "Barnet" ? "child" : miraStoryLine.speaker.toLowerCase()}`}>{miraSpeakerName}</span><p>{miraStoryText}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceMiraStory()}>{constructionBusy ? "Sparar…" : miraStoryIndex === miraArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {miraStoryReplayIndex !== null && <div className="story-moment" role="presentation"><Image src={miraStoryReplayIndex >= MIRA_ARRIVAL_SCENE_2_START ? "/assets/village/story-moments/mira-discovers-lanthandel.png" : "/assets/village/story-moments/mira-arrival.png"} alt="" fill priority sizes="100vw" /></div>}
    {miraStoryReplayIndex !== null && miraStoryReplayLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Testvisning av Mira kommer till byn"><span className={`dialogue-speaker henning-story-speaker ${miraStoryReplayLine.speaker === "Barnet" ? "child" : miraStoryReplayLine.speaker.toLowerCase()}`}>{miraReplaySpeakerName}</span><p>{miraReplayText}</p><button className="primary-button dialogue-next" onClick={advanceMiraStoryReplay}>{miraStoryReplayIndex === miraArrivalDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {clinicStoryIndex !== null && clinicStoryLine && <div className="story-moment" role="presentation"><Image src={clinicStoryLine.scene === "complete" ? "/assets/village/story-moments/sol-clinic-complete.png" : "/assets/village/story-moments/sol-treats-linus.png"} alt="" fill priority sizes="100vw" /></div>}
    {clinicStoryIndex !== null && clinicStoryLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Sols klinik är färdig"><span className={`dialogue-speaker henning-story-speaker ${clinicStoryLine.speaker === "Barnet" ? "child" : clinicStoryLine.speaker.toLowerCase()}`}>{clinicSpeakerName}</span><p>{clinicStoryLine.text}</p><button className="primary-button dialogue-next" onClick={advanceClinicStory}>{clinicStoryIndex === clinicCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {clinicStoryReplayIndex !== null && clinicStoryReplayLine && <div className="story-moment" role="presentation"><Image src={clinicStoryReplayLine.scene === "complete" ? "/assets/village/story-moments/sol-clinic-complete.png" : "/assets/village/story-moments/sol-treats-linus.png"} alt="" fill priority sizes="100vw" /></div>}
    {clinicStoryReplayIndex !== null && clinicStoryReplayLine && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Testvisning av Sols färdiga klinik"><span className={`dialogue-speaker henning-story-speaker ${clinicStoryReplayLine.speaker === "Barnet" ? "child" : clinicStoryReplayLine.speaker.toLowerCase()}`}>{clinicReplaySpeakerName}</span><p>{clinicStoryReplayLine.text}</p><button className="primary-button dialogue-next" onClick={advanceClinicStoryReplay}>{clinicStoryReplayIndex === clinicCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
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
    {abandonedShopDialogueLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Den övergivna lanthandeln"><span className={`dialogue-speaker ${abandonedShopDialogueLine.speaker === "Barnet" ? "child" : ""}`}>{abandonedShopDialogueLine.speaker === "Barnet" ? childName || "Barnet" : "Linus"}</span><p>{abandonedShopDialogueLine.text}</p><button className="primary-button dialogue-next" onClick={() => { if (abandonedShopDialogueIndex !== null && abandonedShopDialogueIndex + 1 < abandonedShopDialogue.length) setAbandonedShopDialogueIndex(abandonedShopDialogueIndex + 1); else { setAbandonedShopDialogueIndex(null); gameRef.current?.setConstructionDialogueOpen(false); } }}>{abandonedShopDialogueIndex !== null && abandonedShopDialogueIndex + 1 < abandonedShopDialogue.length ? "Nästa" : "Klart"}</button></div>}
    {constructionDialogueId && attention?.id === constructionDialogueId && constructionDialogueLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Byggplatsens samtal"><span className={`dialogue-speaker ${constructionDialogueLine.speaker === "Barnet" ? "child" : constructionDialogueLine.speaker.toLowerCase()}`}>{constructionSpeakerName}</span><p>{constructionDialogueLine.text}</p><button className="primary-button" disabled={constructionBusy} onClick={() => { if (constructionDialogueIndex + 1 < attention.dialogue.length) setConstructionDialogueIndex((index) => index + 1); else void persistConstruction(commitConstructionReveal(constructionRef.current, attention.id), attention.id); }}>{constructionBusy ? "Sparar…" : constructionDialogueIndex + 1 < attention.dialogue.length ? "Nästa" : "Fortsätt"}</button><button className="secondary-button" disabled={constructionBusy} onClick={() => { setConstructionDialogueId(null); setConstructionDialogueIndex(0); gameRef.current?.setConstructionDialogueOpen(false); }}>Senare</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {recyclingStoryOpen && recyclingStoryLine && <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label="Återvinningscentralen är färdig"><span className={`dialogue-speaker ${recyclingStoryLine.speaker === "Barnet" ? "child" : ""}`}>{recyclingSpeakerName}</span><p>{recyclingStoryLine.text}</p><button className="primary-button dialogue-next" disabled={constructionBusy} onClick={() => void advanceRecyclingStory()}>{constructionBusy ? "Sparar…" : recyclingStoryIndex === recyclingCompletionDialogue.length - 1 ? "Klart" : "Fortsätt"}</button>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {linusStoryReplayStep && !recyclingStoryOpen && <div className="dialogue-card story-moment-dialogue" role="dialog" aria-modal="true" aria-live="polite" aria-label="Replay av Linus första möte">{linusStoryReplayStep.kind === "line" && <><span className={`dialogue-speaker ${linusStoryReplayStep.speaker === "Barnet" ? "child" : ""}`}>{linusStoryReplaySpeaker}</span><p>{linusStoryReplayStep.text}</p></>}{linusStoryReplayStep.kind === "name-child" && <><span className="dialogue-speaker">Linus</span><h2>Vad heter du?</h2><p><strong>{childName || "Barnet"}</strong></p></>}{linusStoryReplayStep.kind === "reveal-dog" && <><span className="dialogue-speaker">Linus</span><p>🐶 Valpen kommer fram.</p></>}{linusStoryReplayStep.kind === "name-dog" && <><span className="dialogue-speaker dog">🐶 Din nya kompis</span><h2>Vad ska valpen heta?</h2><p><strong>{dogName || "Valpen"}</strong></p></>}<button className="primary-button dialogue-next" onClick={advanceLinusStoryReplay}>{linusStoryReplayIndex === linusIntroDialogue.length - 1 ? "Klart" : "Fortsätt"}</button></div>}
    {dialogueOpen && dialogueStep && !recyclingStoryOpen && <div className={`dialogue-card ${linusStoryMomentOpen ? "story-moment-dialogue" : ""}`} role="dialog" aria-modal="true" aria-live="polite">{dialogueStep.kind === "line" && <><span className={`dialogue-speaker ${dialogueStep.speaker === "Barnet" ? "child" : ""}`}>{speakerName}</span><p>{dialogueStep.text}</p><button className="primary-button dialogue-next" onClick={advanceDialogue}>Fortsätt</button></>}{dialogueStep.kind === "name-child" && <><span className="dialogue-speaker">Linus</span><h2>Vad heter du?</h2><input ref={childNameInputRef} className="dog-name-input" defaultValue={childName} onInput={(event) => setChildNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishChildNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ditt namn" /><button className="primary-button dialogue-next" onClick={finishChildNaming} disabled={!childNameCanSubmit}>Det är jag!</button></>}{dialogueStep.kind === "name-dog" && <><span className="dialogue-speaker dog">🐶 Din nya kompis</span><h2>Vad ska valpen heta?</h2><input ref={dogNameInputRef} className="dog-name-input" defaultValue={dogName} onInput={(event) => setDogNameCanSubmit(Boolean(event.currentTarget.value.trim()))} onKeyDown={(event) => event.key === "Enter" && finishDogNaming()} maxLength={18} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="words" spellCheck={false} inputMode="text" enterKeyHint="done" placeholder="Skriv ett namn" /><button className="primary-button dialogue-next" onClick={finishDogNaming} disabled={!dogNameCanSubmit}>Det blir namnet!</button></>}</div>}
    {parentMenuOpen && !recyclingStoryOpen && <div className="parent-menu-backdrop" role="presentation" onMouseDown={() => setParentMenuOpen(false)}><section className="parent-menu-panel" role="dialog" aria-modal="true" aria-labelledby="parent-menu-title" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setParentMenuOpen(false)} aria-label="Stäng vuxenläge">×</button><span className="parent-menu-kicker">🔐 Vuxenläge</span><h2 id="parent-menu-title">Vuxenläge</h2><p className="parent-menu-note">Här ser du barnets koppling till familjen. Uppdrag skapas och godkänns av en vuxen på förälderns egen enhet.</p>{nativePlatform ? <><div className="parent-profile-card"><span>FÖRÄLDRAKONTO</span><strong>Öppnas på förälderns enhet</strong><small>Backend-uppdrag godkänns i SysselCraft föräldraläge på en separat webbläsare/enhet. Barnets app behåller sin anonyma barnsession.</small></div><button className="secondary-button" type="button" onClick={openSolSafeTest}>☀️ TEST: Sol-story utan att ändra sparning</button></> : <a className="secondary-button" href="/parent/">Öppna föräldraläget</a>}<button className="secondary-button" type="button" onClick={() => { setParentMenuOpen(false); setChildPairingOpen(true); }}>Koppla den här barnenheten</button>
    <div className="parent-profile-card"><span>Barn</span><strong>{childName || "Inte namngivet ännu"}</strong>{dogName && <small>Kompis: 🐶 {dogName}</small>}</div><div className="parent-profile-card"><span>Byutveckling</span><strong>🏗️ {recyclingCenterStatus.title}</strong><small>{recyclingCenterStatus.status}</small></div>
    {storyMomentReplayControl && <div className="parent-profile-card"><span>STORY MOMENT · testvisning</span><button className="secondary-button" type="button" onClick={replayLinusStoryMoment}>🎬 Spela Linus första möte</button><button className="secondary-button" type="button" onClick={replayHenningStoryMoment}>🥖 Spela Hennings ankomst</button><button className="secondary-button" type="button" onClick={replayBakeryStoryMoment}>🥐 Spela färdigt bageri</button><button className="secondary-button" type="button" onClick={replayMiraStoryMoment}>🔧 Spela Miras ankomst</button><small>Spelar bara upp scenerna. Din sparning och progression ändras inte.</small></div>}
    {nativeTestControls && <div className="parent-profile-card"><span>IPHONE TEST · ingen produkttröskel</span>{[2,3,4].map((stage) => <button key={`recycling-${stage}`} className="secondary-button" disabled={constructionBusy || construction.revealed.recycling !== stage - 1 || construction.earned.recycling >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `recycling:${stage}`))}>TEST: tjäna in Recycling stage {stage}</button>)}{[1,2,3,4].map((stage) => <button key={`bakery-${stage}`} className="secondary-button" disabled={constructionBusy || construction.revealed.bakery !== stage - 1 || construction.earned.bakery >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `bakery:${stage}`))}>TEST: tjäna in Bakery stage {stage}</button>)}{[2,3,4].map((stage) => <button key={`clinic-${stage}`} className="secondary-button" disabled={constructionBusy || construction.revealed.clinic !== stage - 1 || construction.earned.clinic >= stage} onClick={() => void persistConstruction(earnConstruction(constructionRef.current, `clinic:${stage}`))}>TEST: tjäna in Clinic stage {stage}</button>)}<a className="secondary-button" href="/?debug=reconciliation">TEST: reconciliation-diagnostik</a><button className="secondary-button" type="button" onClick={openSolSafeTest}>☀️ TEST: Sol-story utan att ändra sparning</button><small>Syns endast i den installerade native-appen. Varje steg kräver att föregående reveal är klar.</small>{constructionError && <p role="alert">{constructionError}</p>}</div>}
    {storyMomentReplayControl && construction.revealed.clinic >= 4 && <div className="parent-profile-card"><span>STORY MOMENT TEST</span><button className="secondary-button" onClick={replayClinicStoryMoment}>▶ Sol + färdiga kliniken</button></div>}
    {nativeTestControls && <div className="parent-menu-footer"><span>Debugverktyg · aktiverade med ?debug=tools</span><button className="debug-reset-button" type="button" onClick={resetPrototypeSave} disabled={!saveReady || resettingSave || constructionBusy}>↺ Nollställ testsparning</button></div>}</section></div>}
    </div>
    {solSafeTestOpen && (() => {
      const phase = solSafeTestPhase;
      const tour = (["bakery","shop","linus","decision"] as string[]).includes(phase) ? phase as SolTourStop : null;
      const lines = phase === "bottle" ? bottleMessageDialogue : phase === "arrival" ? solArrivalDialogue : tour ? solTourDialogue[tour] : [];
      const line = lines[solSafeTestIndex];
      const image = phase === "bottle" ? "/assets/village/story-moments/bottle-message.png" : phase === "arrival" ? "/assets/village/story-moments/sol-arrival.png" : tour === "bakery" ? "/assets/village/story-moments/sol-tour-bakery.png" : tour === "shop" ? "/assets/village/story-moments/sol-tour-shop.png" : tour === "linus" ? "/assets/village/story-moments/sol-tour-linus.png" : tour === "decision" ? "/assets/village/story-moments/sol-stays.png" : null;
      return <div className="parent-menu-backdrop" role="presentation"><section className="parent-menu-panel" role="dialog" aria-modal="true" aria-label="Säkert test av Sol-story"><button className="close-button" onClick={() => setSolSafeTestOpen(false)} aria-label="Stäng test">×</button><span className="parent-menu-kicker">☀️ SOL STORY · SÄKERT TEST</span>
        {phase === "shop" && <><h2>Miras lanthandel</h2><p>🍾 Flaskpost · 25 SysselBux</p><button className="primary-button" onClick={() => setSolSafeTestPhase("water")}>TESTKÖP</button></>}
        {phase === "water" && <><h2>Gå ner till vattnet</h2><button className="primary-button" onClick={() => setSolSafeTestPhase("letter")}>🍾 Flaskpost</button></>}
        {phase === "letter" && <><div className="story-moment" role="presentation"><Image src="/assets/village/story-moments/bottle-letter.png" alt="" fill priority sizes="100vw" /></div><p>Brevet är klart.</p><button className="primary-button" onClick={() => setSolSafeTestPhase("bottle")}>Gå till vattnet</button></>}
        {image && <div className="story-moment" role="presentation"><Image src={image} alt="" fill priority sizes="100vw" /></div>}
        {line && <><span className="dialogue-speaker">{line.speaker}</span><p>{line.text.replace("{dogName}", dogName || "kompis")}</p><button className="primary-button" onClick={advanceSolSafeTest}>{solSafeTestIndex === lines.length - 1 ? "Fortsätt" : "Nästa"}</button></>}
        {phase === "done" && <><h2>Sol väljer att stanna ☀️</h2><p>Testkedjan är klar. Sparning och backend är orörda.</p><button className="primary-button" onClick={() => setSolSafeTestOpen(false)}>Klart</button></>}
        <small>Isolerat testläge. Inga köp, story-beats eller save-skrivningar görs.</small>
      </section></div>;
    })()}
    {saveError && <div className="parent-menu-backdrop"><section className="parent-menu-panel" role="alert">
      <h2>Framstegen kunde inte sparas</h2><p>Stäng inte appen ännu. Försök spara igen.</p>
      <button className="primary-button" disabled={saveRetryBusy || constructionBusy} onClick={() => void retrySave()}>{saveRetryBusy ? "Sparar…" : "Försök spara igen"}</button>
    </section></div>}
    {childPairingOpen && <ChildPairingPanel onClose={() => setChildPairingOpen(false)} />}
  </section>;
}
