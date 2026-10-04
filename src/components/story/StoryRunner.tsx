"use client";

import { StoryMoment } from "./StoryMoment";
import { StoryTranscript } from "./StoryTranscript";
import type { StoryBeatPresentation } from "../../game/storyEngine";

type StoryRunnerProps = {
  beat: StoryBeatPresentation;
  ariaLabel?: string;
  onPrevious?: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  zIndex?: number;
  background?: string;
  dialogueClassName?: string;
  childName?: string;
  revealImageBeforeNext?: boolean;
};

export function StoryRunner({ beat, ariaLabel, onPrevious, onNext, zIndex, background, dialogueClassName, childName, revealImageBeforeNext = false }: StoryRunnerProps) {
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
      zIndex={zIndex}
      background={background}
      dialogueClassName={dialogueClassName}
      revealImageBeforeNext={revealImageBeforeNext}
      presentationId={beat.id}
    >
      <StoryTranscript lines={beat.lines} childName={childName} showSpeakers={!beat.speaker} />
    </StoryMoment>
  );
}
