"use client";

import { useMemo, useState } from "react";
import type { StoryDebugAct } from "../../game/storyDebug";

type StoryDebugConsoleProps = {
  acts: StoryDebugAct[];
  activeActId: string;
  activeEntryId?: string | null;
  onJump: (actId: string, entryId: string) => void;
  onCloseStory: () => void;
};

export function StoryDebugConsole({
  acts,
  activeActId,
  activeEntryId = null,
  onJump,
  onCloseStory,
}: StoryDebugConsoleProps) {
  const [open, setOpen] = useState(false);
  const [actId, setActId] = useState(activeActId);
  const activeAct = useMemo(
    () => acts.find((act) => act.id === actId) ?? acts[0],
    [acts, actId],
  );
  const [entryId, setEntryId] = useState(
    activeEntryId ?? activeAct?.entries[0]?.id ?? "",
  );

  const entries = activeAct?.entries ?? [];
  const selectedExists = entries.some((entry) => entry.id === entryId);
  const selectedEntryId = selectedExists ? entryId : entries[0]?.id ?? "";

  return (
    <div className="story-debug-console">
      <button
        type="button"
        className="story-debug-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        🧪 Story Debug
      </button>

      {open && (
        <div className="story-debug-panel" role="dialog" aria-label="Story Debug Console">
          <div className="story-debug-heading">
            <strong>Story Debug Console</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="Stäng debugpanelen">×</button>
          </div>

          <label>
            Akt
            <select
              value={activeAct?.id ?? ""}
              onChange={(event) => {
                const nextActId = event.target.value;
                setActId(nextActId);
                const first = acts.find((act) => act.id === nextActId)?.entries[0];
                setEntryId(first?.id ?? "");
              }}
            >
              {acts.map((act) => <option key={act.id} value={act.id}>{act.label}</option>)}
            </select>
          </label>

          <label>
            Beat / scen
            <select value={selectedEntryId} onChange={(event) => setEntryId(event.target.value)}>
              {entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.group ? `${entry.group} · ` : ""}{entry.label}
                </option>
              ))}
            </select>
          </label>

          <div className="story-debug-actions">
            <button
              type="button"
              className="primary-button"
              disabled={!activeAct || !selectedEntryId}
              onClick={() => activeAct && selectedEntryId && onJump(activeAct.id, selectedEntryId)}
            >
              Hoppa dit
            </button>
            <button type="button" className="secondary-button" onClick={onCloseStory}>
              Stäng story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
