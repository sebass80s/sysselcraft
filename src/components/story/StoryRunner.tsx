"use client";

import { StoryMoment } from "./StoryMoment";
import { StoryTranscript } from "./StoryTranscript";
import type { StoryBeatPresentation } from "../../game/storyEngine";

type StoryRunnerProps = {
  beat: StoryBeatPresentation;
  onNext: () => void;
  zIndex?: number;
  background?: string;
  scrollable?: boolean;
  dialogueClassName?: string;
  childName?: string;
};

export function StoryRunner({ beat, onNext, zIndex, background, scrollable, dialogueClassName, childName }: StoryRunnerProps) {
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
      scrollable={scrollable}
      dialogueClassName={dialogueClassName}
    >
      <StoryTranscript lines={beat.lines} childName={childName} />
    </StoryMoment>
  );
}
