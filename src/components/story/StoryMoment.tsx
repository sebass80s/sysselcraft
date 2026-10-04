"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { beginStoryOverlay } from "../../game/storyOverlayBridge";
import { DialogueCard } from "./DialogueCard";
import type { StorySpeakerTone } from "../../game/storyEngine";

type StoryMomentProps = {
  image?: string;
  heading?: string;
  ariaLabel?: string;
  imageFit?: "cover" | "contain";
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  children: ReactNode;
  previousLabel?: string;
  onPrevious?: () => void | Promise<void>;
  nextLabel?: string;
  onNext?: () => void | Promise<void>;
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
  ariaLabel,
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
  const navigationPending = useRef(false);
  const [pending, setPending] = useState(false);
  const [navigationError, setNavigationError] = useState("");

  async function navigate(action: () => void | Promise<void>) {
    if (navigationPending.current || nextDisabled) return;
    navigationPending.current = true;
    setPending(true);
    setNavigationError("");
    try {
      await action();
      setImageOnlyPresentationId(null);
    } catch {
      setNavigationError("Kunde inte spara. Försök igen.");
    } finally {
      navigationPending.current = false;
      setPending(false);
    }
  }

  useEffect(() => beginStoryOverlay(), []);

  const style: CSSProperties = { position: "absolute", inset: 0, zIndex, background };
  const handleNext = onNext
    ? () => {
        if (revealImageBeforeNext && image && !imageOnly) {
          setImageOnlyPresentationId(presentationId);
          return;
        }
        void navigate(onNext);
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
        ariaLabel={ariaLabel}
        speaker={speaker}
        speakerTone={speakerTone}
        previousLabel={previousLabel}
        onPrevious={onPrevious ? () => void navigate(onPrevious) : undefined}
        nextLabel={nextLabel}
        onNext={handleNext}
        nextDisabled={nextDisabled || pending}
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
            disabled={nextDisabled || pending}
            onClick={() => setImageOnlyPresentationId(null)}
          >
            Föregående
          </button>
          <button
            type="button"
            className="primary-button shared-story-image-continue"
            disabled={nextDisabled || pending}
            onClick={() => void navigate(onNext)}
          >
            Fortsätt
          </button>
        </div>
      )}
      {navigationError && <p className="shared-story-navigation-error" role="alert">{navigationError}</p>}
    </section>
  );
}
