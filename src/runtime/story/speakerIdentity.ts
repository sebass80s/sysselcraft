/**
 * Story identity presentation is derived from the authored cursor, never from a
 * second saved "hasMetCharacter" flag. Rewinding and resuming remain deterministic.
 * Every chapter supplies its own reveal rules; the shared engine owns the rule.
 */
export type StoryIdentityCursor = Readonly<{ beatIndex: number; lineIndex: number }>;
export type StorySpeakerRevealRule = Readonly<{
  speakerId: string;
  concealedLabel: string;
  revealedAfter: StoryIdentityCursor;
}>;

export function storySpeakerIntroduced(
  cursor: StoryIdentityCursor,
  rule: StorySpeakerRevealRule,
): boolean {
  return cursor.beatIndex > rule.revealedAfter.beatIndex
    || (cursor.beatIndex === rule.revealedAfter.beatIndex
      && cursor.lineIndex > rule.revealedAfter.lineIndex);
}

export function storySpeakerDisplayName(
  speaker: string | null,
  cursor: StoryIdentityCursor,
  rules: readonly StorySpeakerRevealRule[],
): string | null {
  if (speaker === null) return null;
  const rule = rules.find((candidate) => candidate.speakerId === speaker);
  return rule && !storySpeakerIntroduced(cursor, rule)
    ? rule.concealedLabel : speaker;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g, "\\$&");
}

/** Mask undisclosed names in stage directions, never in spoken dialogue. */
export function storyNarrationDisplayText(
  narration: string,
  cursor: StoryIdentityCursor,
  rules: readonly StorySpeakerRevealRule[],
): string {
  return rules.reduce((text, rule) => {
    if (storySpeakerIntroduced(cursor, rule)) return text;
    const matcher = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegExp(rule.speakerId)}(?=$|[^\\p{L}\\p{N}])`,
      "gu",
    );
    return text.replace(matcher, (_match, prefix: string) => prefix + rule.concealedLabel);
  }, narration);
}
