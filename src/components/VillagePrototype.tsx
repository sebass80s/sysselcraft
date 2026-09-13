"use client";

import { useEffect, useRef, useState } from "react";
import type { QuestState, VillageGameHandle } from "../game/createVillageGame";
import { linusIntroDialogue } from "../game/dialogues";
import { makeBedQuest } from "../game/quests";
import { clearSaveState, loadSaveState, saveSaveState } from "../game/saveState";

export default function VillagePrototype() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<VillageGameHandle | null>(null);
  const restoredFirstDeliveryCompleteRef = useRef(false);
  const childNameInputRef = useRef<HTMLInputElement>(null);
  const dogNameInputRef = useRef<HTMLInputElement>(null);
  const [saveReady, setSaveReady] = useState(false);
  const [questState, setQuestState] = useState<QuestState>("available");
  const [questOpen, setQuestOpen] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [sysselBux, setSysselBux] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [childName, setChildName] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogVisible, setDogVisible] = useState(false);
  const [childNameCanSubmit, setChildNameCanSubmit] = useState(false);
  const [dogNameCanSubmit, setDogNameCanSubmit] = useState(false);
  const [resettingSave, setResettingSave] = useState(false);

  const dialogueStep = dialogueOpen ? linusIntroDialogue[dialogueIndex] : null;

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const saved = await loadSaveState();
      if (cancelled) return;

      if (saved) {
        setQuestState(saved.questStates.makeBed);
        setDiamonds(saved.diamonds);
        setSysselBux(saved.sysselBux);
        setIntroComplete(saved.introComplete);
        setDialogueOpen(saved.dialogueOpen);
        setDialogueIndex(saved.dialogueIndex);
        setChildName(saved.childName);
        setDogName(saved.dogName);
        setDogVisible(saved.dogVisible);
        setChildNameCanSubmit(Boolean(saved.childName.trim()));
        setDogNameCanSubmit(Boolean(saved.dogName.trim()));
        restoredFirstDeliveryCompleteRef.current = saved.worldFlags.firstDeliveryComplete;
      }

      setSaveReady(true);
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saveReady || resettingSave) return;

    void saveSaveState({
      version: 1,
      questStates: { makeBed: questState },
      diamonds,
      sysselBux,
      introComplete,
      dialogueOpen,
      dialogueIndex,
      childName,
      dogName,
      dogVisible,
      worldFlags: {
        firstDeliveryComplete: questState === "approved",
      },
    });
  }, [
    saveReady,
    resettingSave,
    questState,
    diamonds,
    sysselBux,
    introComplete,
    dialogueOpen,
    dialogueIndex,
    childName,
    dogName,
    dogVisible,
  ]);

  useEffect(() => {
    if (!saveReady) return;

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
      handle.setDogVisible(dogVisible);
      handle.setFirstDeliveryComplete(restoredFirstDeliveryCompleteRef.current);
      handle.setIntroComplete(introComplete);
      handle.setQuestState(questState);
    }

    boot();

    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [saveReady]);

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

  function finishChildNaming() {
    const trimmed = childNameInputRef.current?.value.trim() ?? "";
    if (!trimmed) return;
    setChildName(trimmed);
    setChildNameCanSubmit(true);
    advanceDialogue();
  }

  function finishDogNaming() {
    const trimmed = dogNameInputRef.current?.value.trim() ?? "";
    if (!trimmed) return;
    setDogName(trimmed);
    setDogNameCanSubmit(true);
    setDogVisible(true);
    setDialogueOpen(false);
    setIntroComplete(true);
    setQuestOpen(true);
  }

  function submitQuest() {
    if (questState !== "available") return;
    setQuestState("pending");
    setQuestOpen(false);
  }

  function approveQuest() {
    if (questState !== "pending") return;
    setQuestState("approved");
    setDiamonds((value) => value + makeBedQuest.reward.diamonds);
    setSysselBux((value) => value + makeBedQuest.reward.sysselBux);
  }

  function needsCompletion() {
    if (questState !== "pending") return;
    setQuestState("available");
    setQuestOpen(true);
  }

  async function resetPrototypeSave() {
    if (resettingSave) return;
    const confirmed = window.confirm(
      "Nollställ Sysselcraft-testet? Barnnamn, hundnamn, quest, resurser och världsläge raderas på den här enheten.",
    );
    if (!confirmed) return;

    setResettingSave(true);
    try {
      await clearSaveState();
      window.location.reload();
    } catch {
      setResettingSave(false);
      window.alert("Det gick inte att nollställa sparningen.");
    }
  }

  const speakerName =
    dialogueStep?.kind === "line" && dialogueStep.speaker === "Barnet"
      ? childName || "Barnet"
      : dialogueStep?.kind === "line"
        ? dialogueStep.speaker
        : "";

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

        <button
          className="debug-reset-button"
          type="button"
          onClick={resetPrototypeSave}
          disabled={!saveReady || resettingSave}
          aria-label="Nollställ testsparning"
          title="Utvecklarverktyg: nollställ testsparning"
        >
          ↺ Test
        </button>

        {dialogueOpen && dialogueStep && (
          <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite">
            {dialogueStep.kind === "line" && (
              <>
                <span className={`dialogue-speaker ${dialogueStep.speaker === "Barnet" ? "child" : ""}`}>{speakerName}</span>
                <p>{dialogueStep.text}</p>
                <button className="primary-button dialogue-next" onClick={advanceDialogue}>Fortsätt</button>
              </>
            )}
            {dialogueStep.kind === "name-child" && (
              <>
                <span className="dialogue-speaker">Linus</span>
                <h2>Vad heter du?</h2>
                <input
                  ref={childNameInputRef}
                  className="dog-name-input"
                  defaultValue={childName}
                  onInput={(event) => setChildNameCanSubmit(Boolean(event.currentTarget.value.trim()))}
                  onKeyDown={(event) => event.key === "Enter" && finishChildNaming()}
                  maxLength={18}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  inputMode="text"
                  enterKeyHint="done"
                  placeholder="Skriv ditt namn"
                />
                <button className="primary-button dialogue-next" onClick={finishChildNaming} disabled={!childNameCanSubmit}>Det är jag!</button>
              </>
            )}
            {dialogueStep.kind === "name-dog" && (
              <>
                <span className="dialogue-speaker dog">🐶 Din nya kompis</span>
                <h2>Vad ska valpen heta?</h2>
                <input
                  ref={dogNameInputRef}
                  className="dog-name-input"
                  defaultValue={dogName}
                  onInput={(event) => setDogNameCanSubmit(Boolean(event.currentTarget.value.trim()))}
                  onKeyDown={(event) => event.key === "Enter" && finishDogNaming()}
                  maxLength={18}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  inputMode="text"
                  enterKeyHint="done"
                  placeholder="Skriv ett namn"
                />
                <button className="primary-button dialogue-next" onClick={finishDogNaming} disabled={!dogNameCanSubmit}>Det blir namnet!</button>
              </>
            )}
          </div>
        )}

        {questOpen && introComplete && (
          <div className="quest-card" role="dialog" aria-modal="true" aria-labelledby="quest-title">
            <button className="close-button" onClick={() => setQuestOpen(false)} aria-label="Stäng">×</button>
            <span className="quest-kicker">Dagens första quest</span>
            <h2 id="quest-title">{makeBedQuest.icon} {makeBedQuest.title}</h2>
            <p>{makeBedQuest.description}</p>
            <div className="quest-reward">Belöning: 💎 {makeBedQuest.reward.diamonds} · 🪙 {makeBedQuest.reward.sysselBux}</div>
            {questState === "available" && <button className="primary-button" onClick={submitQuest}>Jag har bäddat klart</button>}
            {questState === "pending" && <div className="pending-message">⏳ Väntar på en vuxen</div>}
            {questState === "approved" && <div className="approved-message">✓ Godkänd!</div>}
          </div>
        )}

        {questState === "pending" && (
          <aside className="parent-review" aria-label="Vuxenläge prototyp">
            <span>🔐 Vuxenläge · prototyp</span>
            <strong>{makeBedQuest.title}</strong>
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
