"use client";

import type { ReactNode } from "react";
import type { StorySpeakerTone } from "../../game/storyEngine";

type DialogueCardProps = {
  heading?: string;
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
  previousLabel?: string;
  onPrevious?: () => void;
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
  previousLabel = "Föregående",
  onPrevious,
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
      {(onPrevious || (nextLabel && onNext)) && (
        <div className="shared-story-navigation">
          {onPrevious && (
            <button
              type="button"
              className="secondary-button dialogue-previous"
              disabled={nextDisabled}
              onClick={onPrevious}
            >
              {previousLabel}
            </button>
          )}
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
        </div>
      )}
      {footer}
    </div>
  );
}
