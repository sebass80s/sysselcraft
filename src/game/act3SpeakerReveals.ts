import type { StorySpeakerRevealRule } from "../runtime/story/speakerIdentity";

/**
 * Nova introduces herself in OPEN-002, line 13 ("Nova.").
 * Keep the nameplate anonymous DURING her answer; reveal on the next line.
 * The authored dialogue and internal speaker ID always remain unchanged.
 */
export const ACT3_SPEAKER_REVEALS: readonly StorySpeakerRevealRule[] = [{
  speakerId: "Nova",
  concealedLabel: "Tjejen",
  revealedAfter: { beatIndex: 1, lineIndex: 13 },
}];
