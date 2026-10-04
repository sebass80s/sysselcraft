"use client";

import type { ReactNode } from "react";
import type { StorySpeakerTone } from "../../game/storyEngine";

type InlineDialogueCardProps = {
  ariaLabel: string;
  speaker: string;
  speakerTone?: StorySpeakerTone;
  speakerClassName?: string;
  children: ReactNode;
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
  footer?: ReactNode;
};

export function InlineDialogueCard({
  ariaLabel,
  speaker,
  speakerTone = "default",
  speakerClassName = "",
  children,
  nextLabel,
  onNext,
  nextDisabled = false,
  footer,
}: InlineDialogueCardProps) {
  const extraSpeakerClass = speakerClassName ? ` ${speakerClassName}` : "";
  const speakerToneClass = speakerTone === "default" ? "" : ` ${speakerTone}`;
  return (
    <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label={ariaLabel}>
      <span className={`dialogue-speaker${extraSpeakerClass}${speakerToneClass}`}>{speaker}</span>
      {children}
      <button className="primary-button dialogue-next" disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>
      {footer}
    </div>
  );
}
