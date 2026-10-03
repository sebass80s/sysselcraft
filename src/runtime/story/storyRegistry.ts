export type StoryHistoryPolicy =
  | { mode: "never" }
  | { mode: "after-storyline-complete" }
  | { mode: "after-beat-complete" };

export type StoryBeatDefinition = {
  id: string;
  chapter: string;
  storyline: string;
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
  const ids = new Set<string>();
  for (const beat of beats) {
    if (ids.has(beat.id)) throw new Error(`Duplicate story beat id: ${beat.id}`);
    ids.add(beat.id);
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
  chapter: string,
): readonly string[] {
  return [...new Set(
    registry.beats
      .filter((beat) => beat.chapter === chapter)
      .map((beat) => beat.storyline),
  )];
}
