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

export const STORY_SPEAKER_PREFIXES = ["Barnet", "Okänd", "Alve", "Henning", "Mira", "Linus", "Sol", "Pappan", "Storasystern", "Hunden", "Valpen"] as const;

export function parseStoryLine(line: string, childName = "Barnet"): ParsedStoryLine {
  const renderedLine = line.replaceAll("{childName}", childName);
  for (const prefix of STORY_SPEAKER_PREFIXES) {
    const marker = `${prefix}:`;
    if (!renderedLine.startsWith(marker)) continue;
    const text = renderedLine.slice(marker.length).trimStart();
    if (prefix === "Barnet") return { text, speaker: childName, speakerTone: "child" };
    if (prefix === "Okänd") return { text, speaker: "Barnet", speakerTone: "default" };
    if (prefix === "Pappan") return { text, speaker: "Alves Pappa", speakerTone: "default" };
    if (prefix === "Storasystern") return { text, speaker: "Alves Syster", speakerTone: "default" };
    if (prefix === "Hunden" || prefix === "Valpen") return { text, speaker: prefix, speakerTone: "dog" };
    return { text, speaker: prefix, speakerTone: "default" };
  }
  return { text: renderedLine };
}
