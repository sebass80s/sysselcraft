"use client";

import { parseStoryLine } from "../../game/storyEngine";

type StoryTranscriptProps = {
  lines: readonly string[];
  childName?: string;
};

export function StoryTranscript({ lines, childName = "Barnet" }: StoryTranscriptProps) {
  return (
    <div className="shared-story-transcript">
      {lines.map((line, index) => {
        const parsed = parseStoryLine(line, childName);
        const speakerClass = parsed.speakerTone && parsed.speakerTone !== "default"
          ? ` ${parsed.speakerTone}`
          : "";
        return (
          <div className="shared-story-transcript-line" key={index}>
            {parsed.speaker && (
              <span className={`dialogue-speaker${speakerClass}`}>{parsed.speaker}</span>
            )}
            <p>{parsed.text}</p>
          </div>
        );
      })}
    </div>
  );
}
