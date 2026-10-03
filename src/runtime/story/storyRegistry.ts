export type StoryHistoryPolicy =
  | { mode: "never" }
  | { mode: "after-storyline-complete" }
  | { mode: "after-beat-complete" };

export type StoryBeatDefinition = {
  id: string;
  chapterId: string;
  storylineId: string;
  title: string;
  image?: string;
  body: readonly string[];
  history: StoryHistoryPolicy;
};

export type StoryRegistry = {
  beats: readonly StoryBeatDefinition[];
};

export function createStoryRegistry(
  beats: readonly StoryBeatDefinition[],
): StoryRegistry {
  const beatIds = new Set<string>();
  const storylineOwners = new Map<string, string>();

  for (const beat of beats) {
    if (beatIds.has(beat.id)) throw new Error(`Duplicate story beat id: ${beat.id}`);
    beatIds.add(beat.id);

    const expectedPrefix = `${beat.chapterId}:`;
    if (!beat.storylineId.startsWith(expectedPrefix)) {
      throw new Error(
        `Storyline id "${beat.storylineId}" must be chapter-qualified with "${expectedPrefix}"`,
      );
    }

    const existingChapter = storylineOwners.get(beat.storylineId);
    if (existingChapter && existingChapter !== beat.chapterId) {
      throw new Error(
        `Storyline id "${beat.storylineId}" cannot belong to both "${existingChapter}" and "${beat.chapterId}"`,
      );
    }
    storylineOwners.set(beat.storylineId, beat.chapterId);
  }

  return { beats };
}

export function storyBeatById(
  registry: StoryRegistry,
  beatId: string,
): StoryBeatDefinition | null {
  return registry.beats.find((beat) => beat.id === beatId) ?? null;
}

export function storylinesInChapter(
  registry: StoryRegistry,
  chapterId: string,
): readonly string[] {
  return [...new Set(
    registry.beats
      .filter((beat) => beat.chapterId === chapterId)
      .map((beat) => beat.storylineId),
  )];
}
