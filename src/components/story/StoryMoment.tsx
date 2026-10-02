"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { DialogueCard } from "./DialogueCard";
import type { StorySpeakerTone } from "../../game/storyEngine";

type StoryMomentProps = {
  image?: string;
  heading?: string;
  imageFit?: "cover" | "contain";
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
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
  const [imageOnly, setImageOnly] = useState(false);
  useEffect(() => {
    setImageOnly(false);
  }, [presentationId]);

  const style: CSSProperties = { position: "absolute", inset: 0, zIndex, background };
  const handleNext = onNext
    ? () => {
        if (revealImageBeforeNext && image && !imageOnly) {
          setImageOnly(true);
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
        nextLabel={nextLabel}
        onNext={handleNext}
        nextDisabled={nextDisabled}
        footer={footer}
        className={dialogueClassName}
      >
        {children}
      </DialogueCard>}
      {imageOnly && onNext && (
        <button
          type="button"
          className="shared-story-image-continue"
          aria-label="Fortsätt"
          onClick={onNext}
        />
      )}
    </section>
  );
}
