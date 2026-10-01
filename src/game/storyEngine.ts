export type StorySpeakerTone = "default" | "child" | "dog";

export type StoryBeatPresentation = {
  id: string;
  image?: string;
  imageFit?: "cover" | "contain";
  heading?: string;
  speaker?: string;
  speakerTone?: StorySpeakerTone;
  lines: readonly string[];
  nextLabel: string;
};


export type ParsedStoryLine = {
  text: string;
  speaker?: string;
  speakerTone?: StorySpeakerTone;
};

const STORY_SPEAKER_PREFIXES = ["Barnet", "Alve", "Henning", "Mira", "Linus", "Sol", "Pappan", "Storasystern", "Hunden", "Valpen"] as const;

export function parseStoryLine(line: string, childName = "Barnet"): ParsedStoryLine {
  for (const prefix of STORY_SPEAKER_PREFIXES) {
    const marker = `${prefix}:`;
    if (!line.startsWith(marker)) continue;
    const text = line.slice(marker.length).trimStart();
    if (prefix === "Barnet") return { text, speaker: childName, speakerTone: "child" };
    if (prefix === "Hunden" || prefix === "Valpen") return { text, speaker: prefix, speakerTone: "dog" };
    return { text, speaker: prefix, speakerTone: "default" };
  }
  return { text: line };
}
