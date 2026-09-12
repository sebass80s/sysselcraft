"use client";

import { useEffect, useRef } from "react";

export default function VillagePrototype() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyGame: (() => void) | undefined;
    let cancelled = false;

    async function boot() {
      const { createVillageGame } = await import("../game/createVillageGame");
      if (cancelled || !hostRef.current) return;
      destroyGame = await createVillageGame(hostRef.current);
    }

    boot();

    return () => {
      cancelled = true;
      destroyGame?.();
    };
  }, []);

  return (
    <section className="prototype-shell">
      <header className="prototype-header">
        <div>
          <h1>Sysselcraft</h1>
          <p>Första tekniska prototypen</p>
        </div>
        <strong>🏘️ 0.1</strong>
      </header>
      <div className="game-wrap">
        <div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" />
        <div className="game-hint">Tryck eller klicka i byn för att gå dit · WASD/piltangenter på dator</div>
      </div>
    </section>
  );
}
