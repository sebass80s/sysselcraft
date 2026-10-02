"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { beginStoryOverlay } from "../../game/storyOverlayBridge";
import { DialogueCard } from "./DialogueCard";
import type { StorySpeakerTone } from "../../game/storyEngine";

type StoryMomentProps = {
  image?: string;
  heading?: string;
  imageFit?: "cover" | "contain";
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
  previousLabel?: string;
  onPrevious?: () => void;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  footer?: ReactNode;
  zIndex?: number;
  background?: string;
  dialogueClassName?: string;
  revealImageBeforeNext?: boolean;
  presentationId?: string;
};

export function StoryMoment({
  image,
  heading,
  imageFit = "cover",
  speaker,
  speakerTone = "default",
  children,
  previousLabel = "Föregående",
  onPrevious,
  nextLabel,
  onNext,
  nextDisabled = false,
  footer,
  zIndex = 20,
  background = "#1d281f",
  dialogueClassName = "",
  revealImageBeforeNext = false,
  presentationId = "",
}: StoryMomentProps) {
  const [imageOnlyPresentationId, setImageOnlyPresentationId] = useState<string | null>(null);
  const imageOnly = imageOnlyPresentationId === presentationId;

  useEffect(() => beginStoryOverlay(), []);

  const style: CSSProperties = { position: "absolute", inset: 0, zIndex, background };
  const handleNext = onNext
    ? () => {
        if (revealImageBeforeNext && image && !imageOnly) {
          setImageOnlyPresentationId(presentationId);
          return;
        }
        onNext();
      }
    : undefined;
  return (
    <section className="shared-story-moment" style={style} role="presentation">
      {image && (
        <div className="shared-story-image" aria-hidden="true">
          <Image src={image} alt="" fill priority sizes="100vw" style={{ objectFit: imageFit }} />
        </div>
      )}
      {!imageOnly && <div className="shared-story-tint" aria-hidden="true" />}
      {!imageOnly && <DialogueCard
        heading={heading}
        speaker={speaker}
        speakerTone={speakerTone}
        previousLabel={previousLabel}
        onPrevious={onPrevious}
        nextLabel={nextLabel}
        onNext={handleNext}
        nextDisabled={nextDisabled}
        footer={footer}
        className={dialogueClassName}
      >
        {children}
      </DialogueCard>}
      {imageOnly && onNext && (
        <div className="shared-story-image-navigation">
          <button
            type="button"
            className="secondary-button shared-story-image-previous"
            onClick={() => setImageOnlyPresentationId(null)}
          >
            Föregående
          </button>
          <button
            type="button"
            className="primary-button shared-story-image-continue"
            onClick={onNext}
          >
            Fortsätt
          </button>
        </div>
      )}
    </section>
  );
}
