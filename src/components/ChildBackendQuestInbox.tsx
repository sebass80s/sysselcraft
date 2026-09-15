"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBackendAuthState, subscribeBackendAuth } from "@/backend/auth";
import { getPairedChildId } from "@/backend/childDeviceBinding";
import {
  getChildGameState,
  isChildDeviceBound,
  listChildQuests,
  submitQuest,
} from "@/backend/familyRepository";
import type { BackendChildGameState, BackendQuest } from "@/backend/types";
import styles from "./ChildBackendQuestInbox.module.css";

const OPEN_REFRESH_MS = 15_000;

export default function ChildBackendQuestInbox() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [pairingChecked, setPairingChecked] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [needsPairing, setNeedsPairing] = useState(false);
  const [quests, setQuests] = useState<BackendQuest[]>([]);
  const [gameState, setGameState] = useState<BackendChildGameState | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async (id: string) => {
    const bound = await isChildDeviceBound(id);
    if (!bound) {
      setNeedsPairing(true);
      setQuests([]);
      setGameState(null);
      setMessage("Barnkopplingen behöver förnyas.");
      return false;
    }

    setNeedsPairing(false);
    const [nextQuests, nextGameState] = await Promise.all([
      listChildQuests(id),
      getChildGameState(id),
    ]);
    setQuests(nextQuests);
    setGameState(nextGameState);
    return true;
  }, []);

  const refreshQuietly = useCallback(
    async (id: string) => {
      try {
        await refresh(id);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Kunde inte synka uppdragen.");
      }
    },
    [refresh],
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

    return subscribeBackendAuth((state) => {
      const ready = state.signedIn && state.isAnonymous;
      setSessionReady(ready);

      if (!ready) {
        setQuests([]);
        setGameState(null);
        setMessage("Barnkopplingen behöver förnyas.");
        return;
      }

      void refreshQuietly(childId);
    });
  }, [childId, refreshQuietly]);

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
    if (!open || !childId || !sessionReady || needsPairing) return;
    const timer = window.setInterval(() => void refreshQuietly(childId), OPEN_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [open, childId, needsPairing, refreshQuietly, sessionReady]);

  if (!pairingChecked) return null;

  if (!childId) {
    return (
      <aside className={styles.dock} aria-label="Koppla barnets enhet">
        <button className={styles.toggle} type="button" onClick={() => router.push("/pair")}>
          📱 Koppla enhet
        </button>
      </aside>
    );
  }

  if (needsPairing) {
    return (
      <aside className={styles.dock} aria-label="Koppla om barnets enhet">
        <button className={styles.toggle} type="button" onClick={() => router.push("/pair")}>
          📱 Koppla om enhet
        </button>
      </aside>
    );
  }

  const visibleQuests = quests.filter((quest) => quest.state !== "approved");
  const availableCount = quests.filter((quest) => quest.state === "available").length;
  const pendingCount = quests.filter((quest) => quest.state === "pending").length;
  const approvedCount = quests.filter((quest) => quest.state === "approved").length;

  async function markDone(instanceId: string) {
    if (!childId || !sessionReady || needsPairing) return;
    setBusy(true);
    setMessage("");
    try {
      await submitQuest(instanceId);
      await refresh(childId);
      setMessage("Klart! Nu väntar uppdraget på en vuxen. ✨");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skicka uppdraget.");
    } finally {
      setBusy(false);
    }
  }

  async function refreshNow() {
    if (!childId || !sessionReady || needsPairing) return;
    setBusy(true);
    setMessage("");
    try {
      const refreshed = await refresh(childId);
      if (refreshed) setMessage("Uppdragen är uppdaterade.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte uppdatera.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className={styles.dock} aria-label="Föräldrauppdrag">
      <button className={styles.toggle} type="button" onClick={() => setOpen((value) => !value)}>
        📜 Uppdrag
        {(availableCount + pendingCount) > 0 && <span>{availableCount + pendingCount}</span>}
      </button>

      {open && (
        <section className={styles.panel}>
          <header>
            <div>
              <strong>Uppdrag hemifrån</strong>
              <small>Skickade av en vuxen</small>
            </div>
            {gameState && (
              <div className={styles.wallet}>
                💎 {gameState.diamonds} · 🪙 {gameState.sysselBux}
              </div>
            )}
          </header>

          {visibleQuests.length === 0 ? (
            <div className="parent-empty-state">
              {approvedCount > 0 ? "Alla uppdrag är klara just nu. 🌱" : "Inga nya uppdrag just nu. 🌱"}
            </div>
          ) : (
            visibleQuests.map((quest) => (
              <article className={styles.quest} key={quest.instanceId}>
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
            <button className="secondary-button compact" disabled={busy || !sessionReady} onClick={refreshNow}>
              ↻ Uppdatera
            </button>
            <button type="button" onClick={() => router.push("/pair")}>Koppla om</button>
          </div>
        </section>
      )}
    </aside>
  );
}
