"use client";

import { StoryMoment, type StoryPresentationVariant } from "./StoryMoment";
import { StoryTranscript } from "./StoryTranscript";
import type { StoryBeatPresentation } from "../../game/storyEngine";

type StoryRunnerProps = {
  beat: StoryBeatPresentation;
  ariaLabel?: string;
  onPrevious?: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  variant?: StoryPresentationVariant;
  childName?: string;
  revealImageBeforeNext?: boolean;
};

export function StoryRunner({ beat, ariaLabel, onPrevious, onNext, variant = "default", childName, revealImageBeforeNext = false }: StoryRunnerProps) {
  return (
    <StoryMoment
      image={beat.image}
      imageFit={beat.imageFit}
      heading={beat.heading}
      ariaLabel={ariaLabel}
      speaker={beat.speaker}
      speakerTone={beat.speakerTone}
      onPrevious={onPrevious}
      nextLabel={beat.nextLabel}
      onNext={onNext}
      variant={variant}
      revealImageBeforeNext={revealImageBeforeNext}
      presentationId={beat.id}
    >
      <StoryTranscript lines={beat.lines} childName={childName} showSpeakers={!beat.speaker} />
    </StoryMoment>
  );
}
