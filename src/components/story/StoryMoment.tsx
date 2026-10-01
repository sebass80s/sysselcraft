"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { DialogueCard } from "./DialogueCard";
import type { StorySpeakerTone } from "../../game/storyEngine";

type StoryMomentProps = {
  image?: string;
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
  scrollable?: boolean;
};

export function StoryMoment({
  image,
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
  scrollable = false,
}: StoryMomentProps) {
  const style: CSSProperties = { position: "absolute", inset: 0, zIndex, background };
  return (
    <section className="shared-story-moment" style={style} role="presentation">
      {image && (
        <div className="shared-story-image" aria-hidden="true">
          <Image src={image} alt="" fill priority sizes="100vw" style={{ objectFit: imageFit }} />
        </div>
      )}
      <div className="shared-story-tint" aria-hidden="true" />
      <DialogueCard
        speaker={speaker}
        speakerTone={speakerTone}
        nextLabel={nextLabel}
        onNext={onNext}
        nextDisabled={nextDisabled}
        footer={footer}
        className={dialogueClassName}
        scrollable={scrollable}
      >
        {children}
      </DialogueCard>
    </section>
  );
}
