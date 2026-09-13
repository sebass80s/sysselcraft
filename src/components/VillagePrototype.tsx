"use client";

import { useEffect, useRef, useState } from "react";
import type { QuestState, VillageGameHandle } from "../game/createVillageGame";
import { linusIntroDialogue } from "../game/dialogues";

export default function VillagePrototype() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<VillageGameHandle | null>(null);
  const [questState, setQuestState] = useState<QuestState>("available");
  const [questOpen, setQuestOpen] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [sysselBux, setSysselBux] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dogNameDraft, setDogNameDraft] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogVisible, setDogVisible] = useState(false);

  const dialogueStep = dialogueOpen ? linusIntroDialogue[dialogueIndex] : null;

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const { createVillageGame } = await import("../game/createVillageGame");
      if (cancelled || !hostRef.current) return;

      const handle = await createVillageGame(hostRef.current, {
        onQuestOpen: () => setQuestOpen(true),
        onLinusInteract: () => {
          setDialogueIndex(0);
          setDialogueOpen(true);
        },
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

  useEffect(() => {
    gameRef.current?.setIntroComplete(introComplete);
  }, [introComplete]);

  useEffect(() => {
    gameRef.current?.setDogVisible(dogVisible);
  }, [dogVisible]);

  function advanceDialogue() {
    const nextIndex = dialogueIndex + 1;
    const nextStep = linusIntroDialogue[nextIndex];
    if (!nextStep) return;
    if (nextStep.kind === "reveal-dog") {
      setDogVisible(true);
      setDialogueIndex(nextIndex + 1);
      return;
    }
    setDialogueIndex(nextIndex);
  }

  function finishNaming() {
    const trimmed = dogNameDraft.trim();
    if (!trimmed) return;
    setDogName(trimmed);
    setDogVisible(true);
    setDialogueOpen(false);
    setIntroComplete(true);
    setQuestOpen(true);
  }

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
          {dogName && <strong>🐶 {dogName}</strong>}
          <strong>💎 {diamonds}</strong>
          <strong>🪙 {sysselBux}</strong>
        </div>
      </header>

      <div className="game-wrap">
        <div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" />
        <div className="game-hint">{introComplete ? "Tryck i byn för att gå · tryck på questmarkören vid huset" : "Tryck på Linus för att gå fram och hälsa"}</div>

        {dialogueOpen && dialogueStep && (
          <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite">
            {dialogueStep.kind === "line" && (
              <>
                <span className={`dialogue-speaker ${dialogueStep.speaker === "Barnet" ? "child" : ""}`}>{dialogueStep.speaker}</span>
                <p>{dialogueStep.text}</p>
                <button className="primary-button dialogue-next" onClick={advanceDialogue}>Fortsätt</button>
              </>
            )}
            {dialogueStep.kind === "name-dog" && (
              <>
                <span className="dialogue-speaker dog">🐶 Din nya kompis</span>
                <h2>Vad ska valpen heta?</h2>
                <input
                  className="dog-name-input"
                  value={dogNameDraft}
                  onChange={(event) => setDogNameDraft(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && finishNaming()}
                  maxLength={18}
                  autoFocus
                  placeholder="Skriv ett namn"
                />
                <button className="primary-button dialogue-next" onClick={finishNaming} disabled={!dogNameDraft.trim()}>Det blir namnet!</button>
              </>
            )}
          </div>
        )}

        {questOpen && introComplete && (
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
