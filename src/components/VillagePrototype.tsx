"use client";

import { useEffect, useRef, useState } from "react";
import type { QuestState, VillageGameHandle } from "../game/createVillageGame";

export default function VillagePrototype() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<VillageGameHandle | null>(null);
  const [questState, setQuestState] = useState<QuestState>("available");
  const [questOpen, setQuestOpen] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [sysselBux, setSysselBux] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const { createVillageGame } = await import("../game/createVillageGame");
      if (cancelled || !hostRef.current) return;

      const handle = await createVillageGame(hostRef.current, {
        onQuestOpen: () => setQuestOpen(true),
      });

      if (cancelled) {
        handle.destroy();
        return;
      }

      gameRef.current = handle;
    }

    boot();

    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.setQuestState(questState);
  }, [questState]);

  function submitQuest() {
    setQuestState("pending");
    setQuestOpen(false);
  }

  function approveQuest() {
    setQuestState("approved");
    setDiamonds((value) => value + 5);
    setSysselBux((value) => value + 10);
  }

  function needsCompletion() {
    setQuestState("available");
    setQuestOpen(true);
  }

  return (
    <section className="prototype-shell">
      <header className="prototype-header">
        <div>
          <h1>Sysselcraft</h1>
          <p>Första spelbara kärnloopen</p>
        </div>
        <div className="resource-hud" aria-label="Resurser">
          <strong>💎 {diamonds}</strong>
          <strong>🪙 {sysselBux}</strong>
        </div>
      </header>

      <div className="game-wrap">
        <div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" />
        <div className="game-hint">Tryck i byn för att gå · tryck på questmarkören vid huset</div>

        {questOpen && (
          <div className="quest-card" role="dialog" aria-modal="true" aria-labelledby="quest-title">
            <button className="close-button" onClick={() => setQuestOpen(false)} aria-label="Stäng">×</button>
            <span className="quest-kicker">Dagens första quest</span>
            <h2 id="quest-title">🛏️ Bädda sängen</h2>
            <p>Gå och bädda din säng. Kom tillbaka när du är klar.</p>
            <div className="quest-reward">Belöning: 💎 5 · 🪙 10</div>
            {questState === "available" && <button className="primary-button" onClick={submitQuest}>Jag har bäddat klart</button>}
            {questState === "pending" && <div className="pending-message">⏳ Väntar på en vuxen</div>}
            {questState === "approved" && <div className="approved-message">✓ Godkänd!</div>}
          </div>
        )}

        {questState === "pending" && (
          <aside className="parent-review" aria-label="Vuxenläge prototyp">
            <span>🔐 Vuxenläge · prototyp</span>
            <strong>Bädda sängen</strong>
            <div>
              <button className="primary-button compact" onClick={approveQuest}>Godkänn</button>
              <button className="secondary-button compact" onClick={needsCompletion}>Behöver kompletteras</button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
