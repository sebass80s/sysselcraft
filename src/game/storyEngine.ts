export type StorySpeakerTone = "default" | "child" | "dog" | "alve" | "henning" | "mira" | "linus" | "sol";

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

export function storySpeakerTone(speaker: string): StorySpeakerTone {
  if (speaker === "Barnet") return "child";
  if (speaker === "Hunden" || speaker === "Valpen") return "dog";
  if (speaker === "Alve") return "alve";
  if (speaker === "Henning") return "henning";
  if (speaker === "Mira") return "mira";
  if (speaker === "Linus") return "linus";
  if (speaker === "Sol") return "sol";
  return "default";
}

export function parseStoryLine(line: string, childName = "Barnet"): ParsedStoryLine {
  const renderedLine = line.replaceAll("{childName}", childName);
  for (const prefix of STORY_SPEAKER_PREFIXES) {
    const marker = `${prefix}:`;
    if (!renderedLine.startsWith(marker)) continue;
    const text = renderedLine.slice(marker.length).trimStart();
    if (prefix === "Barnet") return { text, speaker: childName, speakerTone: storySpeakerTone(prefix) };
    if (prefix === "Okänd") return { text, speaker: "Barnet", speakerTone: storySpeakerTone(prefix) };
    if (prefix === "Pappan") return { text, speaker: "Alves Pappa", speakerTone: storySpeakerTone(prefix) };
    if (prefix === "Storasystern") return { text, speaker: "Alves Syster", speakerTone: storySpeakerTone(prefix) };
    return { text, speaker: prefix, speakerTone: storySpeakerTone(prefix) };
  }
  return { text: renderedLine };
}
