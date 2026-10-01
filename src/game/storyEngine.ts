export type StorySpeakerTone = "default" | "child" | "dog";

export type StoryBeatPresentation = {
  id: string;
  image?: string;
  imageFit?: "cover" | "contain";
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  lines: readonly string[];
  nextLabel: string;
};
