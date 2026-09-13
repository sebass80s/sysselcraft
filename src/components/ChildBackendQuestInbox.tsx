"use client";

import { useEffect, useState } from "react";
import { getBackendAuthState } from "@/backend/auth";
import { getPairedChildId } from "@/backend/childDeviceBinding";
import { getChildGameState, listChildQuests, submitQuest } from "@/backend/familyRepository";
import type { BackendChildGameState, BackendQuest } from "@/backend/types";
import styles from "./ChildBackendQuestInbox.module.css";

const OPEN_REFRESH_MS = 15_000;

export default function ChildBackendQuestInbox() {
  const [childId, setChildId] = useState<string | null>(null);
  const [quests, setQuests] = useState<BackendQuest[]>([]);
  const [gameState, setGameState] = useState<BackendChildGameState | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh(id: string) {
    const [nextQuests, nextGameState] = await Promise.all([
      listChildQuests(id),
      getChildGameState(id),
    ]);
    setQuests(nextQuests);
    setGameState(nextGameState);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const pairedId = await getPairedChildId();
        if (!pairedId || cancelled) return;

        const auth = await getBackendAuthState();
        setChildId(pairedId);

        if (!auth.signedIn || !auth.isAnonymous) {
          if (!cancelled) setMessage("Barnkopplingen behöver förnyas.");
          return;
        }

        await refresh(pairedId);
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Kunde inte hämta uppdragen.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!childId) return;

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") void refresh(childId);
    };
    const refreshOnFocus = () => void refresh(childId);

    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      document.removeEventListener("visibilitychange", refreshIfVisible);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [childId]);

  useEffect(() => {
    if (!open || !childId) return;
    const timer = window.setInterval(() => void refresh(childId), OPEN_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [open, childId]);

  if (!childId) return null;

  const visibleQuests = quests.filter((quest) => quest.state !== "approved");
  const availableCount = quests.filter((quest) => quest.state === "available").length;
  const pendingCount = quests.filter((quest) => quest.state === "pending").length;
  const approvedCount = quests.filter((quest) => quest.state === "approved").length;

  async function markDone(instanceId: string) {
    setBusy(true);
    setMessage("");
    try {
      await submitQuest(instanceId);
      await refresh(childId!);
      setMessage("Klart! Nu väntar uppdraget på en vuxen. ✨");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skicka uppdraget.");
    } finally {
      setBusy(false);
    }
  }

  async function refreshNow() {
    if (!childId) return;
    setBusy(true);
    setMessage("");
    try {
      await refresh(childId);
      setMessage("Uppdragen är uppdaterade.");
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
                    disabled={busy}
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
            <a href="/pair">Koppla om</a>
          </div>
        </section>
      )}
    </aside>
  );
}
