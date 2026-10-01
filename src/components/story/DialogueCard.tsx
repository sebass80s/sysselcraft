"use client";

import type { ReactNode } from "react";
import type { StorySpeakerTone } from "../../game/storyEngine";

type DialogueCardProps = {
  heading?: string;
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  footer?: ReactNode;
  className?: string;
};

export function DialogueCard({
  heading,
  speaker,
  speakerTone = "default",
  children,
  nextLabel,
  onNext,
  nextDisabled = false,
  footer,
  className = "",
}: DialogueCardProps) {
  const speakerClass = speakerTone === "default" ? "" : ` ${speakerTone}`;
  return (
    <div
      className={`dialogue-card story-moment-dialogue shared-story-dialogue ${className}`.trim()}
      role="dialog"
      aria-modal="true"
    >
      {heading && <h2 className="shared-story-heading">{heading}</h2>}
      {speaker && <span className={`dialogue-speaker${speakerClass}`}>{speaker}</span>}
      <div className="shared-story-body">{children}</div>
      {nextLabel && onNext && (
        <button
          type="button"
          className="primary-button dialogue-next"
          disabled={nextDisabled}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      )}
      {footer}
    </div>
  );
}
