"use client";

import { StoryMoment } from "./StoryMoment";
import type { StoryBeatPresentation } from "../../game/storyEngine";

type StoryRunnerProps = {
  beat: StoryBeatPresentation;
  onNext: () => void;
  zIndex?: number;
  background?: string;
  scrollable?: boolean;
};

export function StoryRunner({ beat, onNext, zIndex, background, scrollable }: StoryRunnerProps) {
  return (
    <StoryMoment
      image={beat.image}
      imageFit={beat.imageFit}
      speaker={beat.speaker}
      speakerTone={beat.speakerTone}
      nextLabel={beat.nextLabel}
      onNext={onNext}
      zIndex={zIndex}
      background={background}
      scrollable={scrollable}
    >
      {beat.lines.map((line, index) => <p key={index}>{line}</p>)}
    </StoryMoment>
  );
}
