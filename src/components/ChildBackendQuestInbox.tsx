"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { requestChildPairingOpen } from "@/game/childPairingBridge";
import { getBackendAuthState, subscribeBackendAuth } from "@/backend/auth";
import { CHILD_BINDING_CHANGED, getPairedChildId } from "@/backend/childDeviceBinding";
import {
  claimQuestReward,
  getChildGameState,
  isChildDeviceBound,
  listChildQuests,
  submitQuest,
} from "@/backend/familyRepository";
import type { BackendChildGameState, BackendQuest } from "@/backend/types";
import { presentBackendQuests, primaryPresentedQuest, questSourceCounts } from "@/game/backendQuestPresentation";
import { publishBackendWallet } from "@/game/backendWalletBridge";
import { createQuestRequestGuard } from "@/game/questRequestGuard";
import { loadSaveState, saveSaveState, withConstructionState } from "@/game/saveState";
import { syncBakeryContributionProgress, syncClinicContributionProgress, syncRecyclingContributionProgress } from "@/game/construction";
import {
  claimQuestTurnIn,
  loadPendingQuestTurnIns,
  recoverAwaitingQuestTurnIns,
  rememberAwaitingApproval,
  type PendingQuestTurnIn,
} from "@/game/questTurnInState";
import {
  publishQuestPresentation,
  QUEST_SOURCE_OPEN_EVENT,
  type QuestPresentationSource,
  type QuestSourceOpenEventDetail,
} from "@/game/questPresentationBridge";
import styles from "./ChildBackendQuestInbox.module.css";

const OPEN_REFRESH_MS = 15_000;
const BACKGROUND_REFRESH_MS = 30_000;

export default function ChildBackendQuestInbox() {
  const [bindingVersion, setBindingVersion] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const reloadBinding = () => setBindingVersion((version) => version + 1);
    window.addEventListener(CHILD_BINDING_CHANGED, reloadBinding);
    return () => window.removeEventListener(CHILD_BINDING_CHANGED, reloadBinding);
  }, []);
  const openPairing = () => {
    if (Capacitor.isNativePlatform()) requestChildPairingOpen();
    else router.push("/pair/");
  };
  return <BoundChildQuestInbox key={bindingVersion} onPair={openPairing} />;
}

function BoundChildQuestInbox({ onPair }: { onPair: () => void }) {
  const [childId, setChildId] = useState<string | null>(null);
  const [pairingChecked, setPairingChecked] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [needsPairing, setNeedsPairing] = useState(false);
  const [quests, setQuests] = useState<BackendQuest[]>([]);
  const [gameState, setGameState] = useState<BackendChildGameState | null>(null);
  const [localRecyclingCenterStage, setLocalRecyclingCenterStage] = useState(0);
  const [open, setOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<QuestPresentationSource | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingTurnIns, setPendingTurnIns] = useState<PendingQuestTurnIn[]>([]);
  const [questCompleteMoment, setQuestCompleteMoment] = useState<{ title: string; diamonds: number; sysselBux: number; image: string } | null>(null);

  const [requests] = useState(createQuestRequestGuard);
  useEffect(() => {
    requests.activate();
    return () => requests.deactivate();
  }, [requests]);

  const refresh = useCallback(async (id: string) => {
    if (!requests.isActive()) return false;
    const current = requests.begin();
    try {
      const bound = await isChildDeviceBound(id);
      if (!current()) return false;
      if (!bound) {
        setNeedsPairing(true);
        setQuests([]);
        setGameState(null);
        setMessage("Barnkopplingen behöver förnyas.");
        return false;
      }

      const [nextQuests, nextGameState, localSave] = await Promise.all([
        listChildQuests(id),
        getChildGameState(id),
        loadSaveState(),
      ]);
      if (!current()) return false;
      setNeedsPairing(false);
      const nextTurnIns = await recoverAwaitingQuestTurnIns(id, nextQuests);
      if (!current()) return false;
      setPendingTurnIns(nextTurnIns);
      setQuests(nextQuests);
      setGameState(nextGameState);
      setLocalRecyclingCenterStage(localSave?.worldFlags.recyclingCenterStage ?? 0);

      if (localSave && nextGameState) {
        let snapshot = localSave;
        let recyclingBaseline = snapshot.worldFlags.recyclingClaimBaseline;
        let recyclingBaselineStage = snapshot.worldFlags.recyclingClaimBaselineStage;
        if (recyclingBaseline === undefined) {
          recyclingBaseline = Math.max(0, Math.floor(nextGameState.progression.worldProgression));
          recyclingBaselineStage = snapshot.construction.revealed.recycling;
          snapshot = { ...snapshot, worldFlags: { ...snapshot.worldFlags, recyclingClaimBaseline: recyclingBaseline, recyclingClaimBaselineStage: recyclingBaselineStage } };
          await saveSaveState(snapshot, true);
        } else if (recyclingBaselineStage === undefined) {
          recyclingBaselineStage = snapshot.construction.revealed.recycling;
          snapshot = { ...snapshot, worldFlags: { ...snapshot.worldFlags, recyclingClaimBaselineStage: recyclingBaselineStage } };
          await saveSaveState(snapshot, true);
        }
        const nextRecycling = syncRecyclingContributionProgress(
          snapshot.construction,
          nextGameState.progression.worldProgression,
          recyclingBaseline,
          recyclingBaselineStage ?? 0,
        );
        if (nextRecycling !== snapshot.construction) {
          snapshot = withConstructionState(snapshot, nextRecycling);
          await saveSaveState(snapshot, true);
          window.dispatchEvent(new CustomEvent("sysselcraft:construction-save-changed"));
        }
        let baseline = snapshot.worldFlags.bakeryClaimBaseline;
        let baselineStage = snapshot.worldFlags.bakeryClaimBaselineStage;
        const bakeryStarted = snapshot.construction.revealed.bakery > 0 || snapshot.construction.earned.bakery > 0;
        if (baseline === undefined && bakeryStarted) {
          baseline = Math.max(0, Math.floor(nextGameState.progression.worldProgression));
          baselineStage = snapshot.construction.revealed.bakery;
          snapshot = { ...snapshot, worldFlags: { ...snapshot.worldFlags, bakeryClaimBaseline: baseline, bakeryClaimBaselineStage: baselineStage } };
          await saveSaveState(snapshot, true);
        } else if (baseline !== undefined && baselineStage === undefined) {
          baselineStage = snapshot.construction.revealed.bakery;
          snapshot = { ...snapshot, worldFlags: { ...snapshot.worldFlags, bakeryClaimBaselineStage: baselineStage } };
          await saveSaveState(snapshot, true);
        }
        if (baseline !== undefined) {
          const nextConstruction = syncBakeryContributionProgress(snapshot.construction, nextGameState.progression.worldProgression, baseline, baselineStage ?? 0);
          if (nextConstruction !== snapshot.construction) {
            snapshot = withConstructionState(snapshot, nextConstruction);
            await saveSaveState(snapshot, true);
            window.dispatchEvent(new CustomEvent("sysselcraft:construction-save-changed"));
          }
        }
        const clinicBaseline = snapshot.worldFlags.clinicProgressionBaseline;
        if (snapshot.worldFlags.solChoseToStay && clinicBaseline !== undefined) {
          const nextConstruction = syncClinicContributionProgress(snapshot.construction, nextGameState.progression.worldProgression, clinicBaseline);
          if (nextConstruction !== snapshot.construction) {
            snapshot = withConstructionState(snapshot, nextConstruction);
            await saveSaveState(snapshot, true);
            window.dispatchEvent(new CustomEvent("sysselcraft:construction-save-changed"));
          }
        }
      }
      return true;
    } catch (error) {
      if (!current()) return false;
      throw error;
    }
  }, [requests]);

  const refreshQuietly = useCallback(
    async (id: string) => {
      if (!requests.isActive() || requests.isBusy()) return;
      try {
        if (await refresh(id)) setMessage("");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Kunde inte synka uppdragen.");
      }
    },
    [refresh, requests],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const pairedId = await getPairedChildId();
        if (cancelled) return;

        setPairingChecked(true);
        if (!pairedId) return;

        setChildId(pairedId);
        setPendingTurnIns(await loadPendingQuestTurnIns(pairedId));
        const auth = await getBackendAuthState();
        if (cancelled) return;

        if (!auth.signedIn || !auth.isAnonymous) {
          setSessionReady(false);
          setQuests([]);
          setGameState(null);
          setMessage("Barnkopplingen behöver förnyas.");
          return;
        }

        setSessionReady(true);
        const refreshed = await refresh(pairedId);
        if (!cancelled && refreshed) setMessage("");
      } catch (error) {
        if (!cancelled) {
          setPairingChecked(true);
          setSessionReady(false);
          setMessage(error instanceof Error ? error.message : "Kunde inte hämta uppdragen.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!childId) return;

    try {
      return subscribeBackendAuth((state) => {
        const ready = state.signedIn && state.isAnonymous;
        setSessionReady(ready);

        if (!ready) {
          requests.invalidate();
          setQuests([]);
          setGameState(null);
          setMessage("Barnkopplingen behöver förnyas.");
          return;
        }

        void refreshQuietly(childId);
      });
    } catch {
      // Initial load reports configuration/session errors; do not crash the village.
      return;
    }
  }, [childId, refreshQuietly, requests]);

  useEffect(() => {
    if (!childId || !sessionReady || needsPairing) return;

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") void refreshQuietly(childId);
    };
    const refreshOnFocus = () => void refreshQuietly(childId);

    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      document.removeEventListener("visibilitychange", refreshIfVisible);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [childId, needsPairing, refreshQuietly, sessionReady]);

  useEffect(() => {
    if (!childId || !sessionReady || needsPairing) return;
    const refreshWallet = () => void refreshQuietly(childId);
    window.addEventListener("sysselcraft:backend-wallet-refresh", refreshWallet);
    return () => window.removeEventListener("sysselcraft:backend-wallet-refresh", refreshWallet);
  }, [childId, needsPairing, refreshQuietly, sessionReady]);

  useEffect(() => {
    if (!childId || !sessionReady || needsPairing) return;
    const refreshInterval = open ? OPEN_REFRESH_MS : BACKGROUND_REFRESH_MS;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshQuietly(childId);
    }, refreshInterval);
    return () => window.clearInterval(timer);
  }, [open, childId, needsPairing, refreshQuietly, sessionReady]);

  useEffect(() => {
    const openSource = (event: Event) => {
      const detail = (event as CustomEvent<QuestSourceOpenEventDetail>).detail;
      if (!detail?.source) return;
      setSourceFilter(detail.source);
      setOpen(true);
    };
    window.addEventListener(QUEST_SOURCE_OPEN_EVENT, openSource);
    return () => window.removeEventListener(QUEST_SOURCE_OPEN_EVENT, openSource);
  }, []);

  useEffect(() => {
    publishBackendWallet(gameState ? { diamonds: gameState.diamonds, sysselBux: gameState.sysselBux } : null);
  }, [gameState]);

  useEffect(() => {
    const snapshot = presentBackendQuests(quests, gameState, { recyclingCenterStage: localRecyclingCenterStage });
    const counts = questSourceCounts(snapshot);
    if (pendingTurnIns.length > 0) counts.linus += 1;
    publishQuestPresentation({ counts });
  }, [quests, gameState, localRecyclingCenterStage, pendingTurnIns]);

  if (!pairingChecked) return null;

  // Pairing and re-pairing live in SysselCraft → Vuxenläge.
  // Keep the quest dock out of the village HUD until a valid child binding exists.
  if (!childId || needsPairing) return null;

  const presented = presentBackendQuests(quests, gameState, { recyclingCenterStage: localRecyclingCenterStage });
  const allVisibleQuests = [...presented.available, ...presented.pending];
  const visibleQuests = sourceFilter
    ? allVisibleQuests.filter(({ quest, presentation }) =>
        quest.state === "available" && presentation.destination === sourceFilter)
    : allVisibleQuests;
  const availableCount = presented.available.length;
  const pendingCount = presented.pending.length;
  const approvedCount = quests.filter((quest) => quest.state === "approved").length;
  const primaryWorldQuest = primaryPresentedQuest(presented);
  const turnIn = pendingTurnIns[0] ?? null;

  async function claimReward(instanceId: string) {
    if (!childId || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const claimedTurnIn = pendingTurnIns.find((item) => item.instanceId === instanceId) ?? null;
      await claimQuestReward(instanceId);
      if (!requests.isActive()) return;
      const next = await claimQuestTurnIn(childId, instanceId);
      setPendingTurnIns(next);
      await refresh(childId);
      if (requests.isActive()) {
        setOpen(false);
        setSourceFilter(null);
        if (claimedTurnIn) {
          const imageNumber = claimedTurnIn.instanceId.charCodeAt(claimedTurnIn.instanceId.length - 1) % 2 === 0 ? "01" : "02";
          setQuestCompleteMoment({
            title: claimedTurnIn.title,
            diamonds: claimedTurnIn.reward.diamonds,
            sysselBux: claimedTurnIn.reward.sysselBux,
            image: `/assets/village/story-moments/linus-turnin-${imageNumber}.png.png`,
          });
        }
        setMessage("Belöningen är din! ✨");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte markera belöningen som hämtad.");
    } finally {
      setBusy(false);
    }
  }

  async function markDone(instanceId: string) {
    if (!childId || !sessionReady || needsPairing || !requests.startAction()) return;
    setBusy(true);
    setMessage("");
    try {
      await submitQuest(instanceId);
      if (!requests.isActive()) return;
      await rememberAwaitingApproval(childId, instanceId);
      if (!requests.isActive()) return;
      const refreshed = await refresh(childId);
      if (refreshed) setMessage("Klart! Nu väntar uppdraget på en vuxen. ✨");
    } catch (error) {
      if (requests.isActive()) setMessage(error instanceof Error ? error.message : "Kunde inte skicka uppdraget.");
    } finally {
      requests.finishAction();
      if (requests.isActive()) setBusy(false);
    }
  }

  async function refreshNow() {
    if (!childId || needsPairing || !requests.startAction()) return;
    setBusy(true);
    setMessage("");
    try {
      const auth = await getBackendAuthState();
      if (!requests.isActive()) return;
      const ready = auth.signedIn && auth.isAnonymous;
      setSessionReady(ready);
      if (!ready) { setNeedsPairing(true); return; }
      const refreshed = await refresh(childId);
      if (refreshed) setMessage("Uppdragen är uppdaterade.");
    } catch (error) {
      if (requests.isActive()) setMessage(error instanceof Error ? error.message : "Kunde inte uppdatera.");
    } finally {
      requests.finishAction();
      if (requests.isActive()) setBusy(false);
    }
  }

  return (
    <>
      {questCompleteMoment && (
        <section className={styles.questCompleteMoment} aria-label="Uppdrag klart">
          <Image src={questCompleteMoment.image} alt="" fill priority sizes="100vw" />
          <div className={styles.questCompleteCard}>
            <strong>✨ Uppdrag klart!</strong>
            <h2>{questCompleteMoment.title}</h2>
            <p>💎 {questCompleteMoment.diamonds} · 🪙 {questCompleteMoment.sysselBux}</p>
            <button className="primary-button" type="button" onClick={() => setQuestCompleteMoment(null)}>Fortsätt</button>
          </div>
        </section>
      )}
      <aside className={styles.dock} aria-label="Föräldrauppdrag">
      <button
        className={styles.toggle}
        type="button"
        data-world-channel={primaryWorldQuest?.presentation.channel}
        onClick={() => {
          setSourceFilter(null);
          setOpen((value) => !value);
        }}
      >
        📜 Uppdrag
        {(availableCount + pendingCount) > 0 && <span>{availableCount + pendingCount}</span>}
      </button>

      {open && (
        <section className={styles.panel} role="dialog" aria-modal="true" aria-label="Aktiva uppdrag">
          <button className={styles.closeButton} type="button" onClick={() => { setOpen(false); setSourceFilter(null); }} aria-label="Stäng uppdrag">×</button>
          <header>
            <div>
              <strong>{sourceFilter === "noticeboard" ? "Anslagstavlan" : sourceFilter === "home" ? "Hemma" : sourceFilter === "linus" ? "Linus" : sourceFilter === "bakery" ? "Bageriet" : "Uppdrag hemifrån"}</strong>
              <small>{sourceFilter ? "Uppdrag som hör hemma här" : "Skickade av en vuxen"}</small>
            </div>
            {gameState && (
              <div className={styles.wallet}>
                💎 {gameState.diamonds} · 🪙 {gameState.sysselBux}
              </div>
            )}
          </header>

          {sourceFilter === "linus" && turnIn && (
            <article className={styles.quest} data-presentation="reward">
              <strong>✨ Uppdrag godkänt!</strong>
              <p>Snyggt jobbat! Jag hörde att du fixade <strong>{turnIn.title}</strong>.</p>
              <small>Belöning: 💎 {turnIn.reward.diamonds} · 🪙 {turnIn.reward.sysselBux}</small>
              <button
                className="primary-button compact"
                disabled={busy}
                onClick={() => void claimReward(turnIn.instanceId)}
              >
                Hämta belöningen
              </button>
            </article>
          )}

          {visibleQuests.length === 0 && !(sourceFilter === "linus" && turnIn) ? (
            <div className="parent-empty-state">
              {approvedCount > 0 ? "Alla uppdrag är klara just nu. 🌱" : "Inga nya uppdrag just nu. 🌱"}
            </div>
          ) : (
            visibleQuests.map(({ quest, presentation }) => (
              <article className={styles.quest} key={quest.instanceId} data-presentation={presentation.channel}>
                <strong>{quest.title}</strong>
                <p>{quest.description}</p>
                <small>
                  Belöning: 💎 {quest.reward.diamonds} · 🪙 {quest.reward.sysselBux}
                </small>
                {quest.state === "available" ? (
                  <button
                    className="primary-button compact"
                    disabled={busy || !sessionReady}
                    onClick={() => markDone(quest.instanceId)}
                  >
                    Jag är klar
                  </button>
                ) : (
                  <div className="pending-message">⏳ Väntar på en vuxen</div>
                )}
              </article>
            ))
          )}

          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.footer}>
            <button className="secondary-button compact" disabled={busy} onClick={refreshNow}>
              ↻ Uppdatera
            </button>
            <button type="button" onClick={onPair}>Koppla om</button>
          </div>
        </section>
      )}
    </aside>
    </>
  );
}
