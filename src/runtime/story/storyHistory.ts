import type {
  StoryBeatDefinition,
  StoryRegistry,
} from "./storyRegistry";

export type StoryHistoryProgress = {
  completedBeatIds: ReadonlySet<string>;
  completedStorylineIds: ReadonlySet<string>;
};

type StoryHistoryEntry = {
  chapterId: string;
  storylineId: string;
  beat: StoryBeatDefinition;
};

export function historyEntriesFor(
  registry: StoryRegistry,
  progress: StoryHistoryProgress,
): readonly StoryHistoryEntry[] {
  return registry.beats.flatMap((beat) => {
    const visible =
      beat.history.mode === "after-beat-complete"
        ? progress.completedBeatIds.has(beat.id)
        : beat.history.mode === "after-storyline-complete"
          ? progress.completedStorylineIds.has(beat.storylineId)
          : false;

    return visible
      ? [{ chapterId: beat.chapterId, storylineId: beat.storylineId, beat }]
      : [];
  });
}

/**
 * Replay is deliberately presentation-only.
 *
 * History consumes registry data plus already-completed progress. It owns no
 * persistence, rewards, purchases or progression mutations.
 */
type StoryReplayRequest = {
  beatId: string;
  startLineIndex?: number;
};

export function resolveReplayRequest(
  registry: StoryRegistry,
  progress: StoryHistoryProgress,
  request: StoryReplayRequest,
): { beat: StoryBeatDefinition; lineIndex: number } | null {
  const entry = historyEntriesFor(registry, progress)
    .find(({ beat }) => beat.id === request.beatId);
  if (!entry) return null;

  const maxIndex = Math.max(0, entry.beat.body.length - 1);
  const requested = request.startLineIndex ?? 0;
  return {
    beat: entry.beat,
    lineIndex: Math.max(0, Math.min(maxIndex, requested)),
  };
}
