"use client";

import { StoryMoment } from "./StoryMoment";
import { StoryTranscript } from "./StoryTranscript";
import type { StoryBeatPresentation } from "../../game/storyEngine";

type StoryRunnerProps = {
  beat: StoryBeatPresentation;
  onNext: () => void;
  zIndex?: number;
  background?: string;
  dialogueClassName?: string;
  childName?: string;
  revealImageBeforeNext?: boolean;
};

export function StoryRunner({ beat, onNext, zIndex, background, dialogueClassName, childName, revealImageBeforeNext = false }: StoryRunnerProps) {
  return (
    <StoryMoment
      image={beat.image}
      imageFit={beat.imageFit}
      heading={beat.heading}
      speaker={beat.speaker}
      speakerTone={beat.speakerTone}
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
