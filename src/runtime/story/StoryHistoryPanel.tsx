"use client";

import { useMemo, useState } from "react";
import { StoryRunner } from "../../components/story/StoryRunner";
import type { StorySpeakerTone } from "../../game/storyEngine";

export type StoryHistoryReplayBeat = {
  id: string;
  title: string;
  image?: string;
  body: readonly string[];
};

export type StoryHistoryGroup<TBeat extends StoryHistoryReplayBeat = StoryHistoryReplayBeat> = {
  label: string;
  entries: readonly TBeat[];
};

type StoryHistoryPanelProps<TBeat extends StoryHistoryReplayBeat> = {
  open: boolean;
  title?: string;
  eyebrow?: string;
  description?: string;
  groups: readonly StoryHistoryGroup<TBeat>[];
  childName?: string;
  parseLine: (line: string, childName: string) => {
    speaker?: string;
    speakerTone?: StorySpeakerTone;
    text: string;
  };
  onClose: () => void;
  onReplayOpenChange?: (open: boolean) => void;
};

export function StoryHistoryPanel<TBeat extends StoryHistoryReplayBeat>({
  open,
  title = "Historik",
  eyebrow = "STORY",
  description = "Replay ändrar inte framsteg eller belöningar.",
  groups,
  childName = "Barnet",
  parseLine,
  onClose,
  onReplayOpenChange,
}: StoryHistoryPanelProps<TBeat>) {
  const [replay, setReplay] = useState<{ beat: TBeat; lineIndex: number } | null>(null);

  const replayLine = replay
    ? replay.beat.body[replay.lineIndex] ?? null
    : null;

  const replayPresentation = useMemo(
    () => replayLine ? parseLine(replayLine, childName) : null,
    [childName, parseLine, replayLine],
  );

  function setReplayState(next: { beat: TBeat; lineIndex: number } | null) {
    setReplay(next);
    onReplayOpenChange?.(next !== null);
  }

  function openReplay(beat: TBeat) {
    setReplayState({ beat, lineIndex: 0 });
  }

  function previousReplay() {
    if (!replay || replay.lineIndex <= 0) return;
    setReplayState({ ...replay, lineIndex: replay.lineIndex - 1 });
  }

  function advanceReplay() {
    if (!replay) return;
    if (replay.lineIndex + 1 < replay.beat.body.length) {
      setReplayState({ ...replay, lineIndex: replay.lineIndex + 1 });
      return;
    }
    setReplayState(null);
  }

  if (!open && !replay) return null;

  if (replay && replayLine && replayPresentation) {
    return (
      <StoryRunner
        beat={{
          id: `history:${replay.beat.id}:${replay.lineIndex}`,
          image: replay.beat.image,
          imageFit: "contain",
          heading: `${title} · ${replay.beat.title}`,
          speaker: replayPresentation.speaker,
          speakerTone: replayPresentation.speakerTone,
          lines: [replayPresentation.text],
          nextLabel: replay.lineIndex + 1 < replay.beat.body.length ? "Fortsätt" : "Till historiken",
        }}
        onPrevious={replay.lineIndex > 0 ? previousReplay : undefined}
        onNext={advanceReplay}
        zIndex={110}
        background="rgba(6,10,8,.96)"
        childName={childName}
        revealImageBeforeNext={replay.lineIndex + 1 >= replay.beat.body.length}
      />
    );
  }

  return (
    <div className="shared-story-history-overlay" role="presentation">
      <section
        className="shared-story-history-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="shared-story-history-heading">
          <div>
            <span>{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button className="secondary-button compact" type="button" onClick={onClose}>
            Stäng
          </button>
        </div>
        <div className="shared-story-history-groups">
          {groups.map((group) => (
            <section className="shared-story-history-group" key={group.label}>
              <h3>{group.label}</h3>
              <div className="shared-story-history-grid">
                {group.entries.map((beat) => (
                  <button
                    className="shared-story-history-entry"
                    type="button"
                    key={beat.id}
                    onClick={() => openReplay(beat)}
                  >
                    <strong>{beat.title}</strong>
                    <span>Spela upp →</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
