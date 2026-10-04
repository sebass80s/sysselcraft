"use client";

import type { ReactNode } from "react";
import type { StorySpeakerTone } from "../../game/storyEngine";

type InlineDialogueCardProps = {
  ariaLabel: string;
  speaker: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
};

export function InlineDialogueCard({
  ariaLabel,
  speaker,
  speakerTone = "default",
  children,
  nextLabel,
  onNext,
  nextDisabled = false,
}: InlineDialogueCardProps) {
  const speakerClass = speakerTone === "default" ? "" : ` ${speakerTone}`;
  return (
    <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label={ariaLabel}>
      <span className={`dialogue-speaker${speakerClass}`}>{speaker}</span>
      {children}
      <button className="primary-button dialogue-next" disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>
    </div>
  );
}
