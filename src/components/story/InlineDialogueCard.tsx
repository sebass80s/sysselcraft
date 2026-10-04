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
  nextClassName?: string;
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
  nextClassName = "primary-button dialogue-next",
  footer,
}: InlineDialogueCardProps) {
  const extraSpeakerClass = speakerClassName ? ` ${speakerClassName}` : "";
  const speakerToneClass = speakerTone === "default" ? "" : ` ${speakerTone}`;
  return (
    <div className="dialogue-card" role="dialog" aria-modal="true" aria-live="polite" aria-label={ariaLabel}>
      <span className={`dialogue-speaker${extraSpeakerClass}${speakerToneClass}`}>{speaker}</span>
      {children}
      <button className={nextClassName} disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>
      {footer}
    </div>
  );
}
