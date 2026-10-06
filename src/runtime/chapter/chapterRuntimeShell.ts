export type ChapterRuntimeShellStatus =
  | "loading"
  | "shipping-locked"
  | "progression-locked"
  | "active";

export type ChapterRuntimeShellInput = {
  ready: boolean;
  debug: boolean;
  productionEnabled: boolean;
  accessAllowed: boolean;
};

export function chapterBootMayLoad(
  input: Pick<ChapterRuntimeShellInput, "debug" | "productionEnabled">,
) {
  return input.debug || input.productionEnabled;
}

export function deriveChapterRuntimeShell(
  input: ChapterRuntimeShellInput,
): ChapterRuntimeShellStatus {
  if (!input.ready) return "loading";
  if (!input.debug && !input.productionEnabled) return "shipping-locked";
  if (!input.debug && !input.accessAllowed) return "progression-locked";
  return "active";
}

export type ChapterRuntimeOverlayState = {
  storyUiVisible: boolean;
  blockingOverlayVisible: boolean;
  worldInputEnabled: boolean;
};

export function deriveChapterRuntimeOverlay(
  chapterCardVisible: boolean,
  storyUiVisible: boolean,
): ChapterRuntimeOverlayState {
  const blockingOverlayVisible = chapterCardVisible || storyUiVisible;
  return {
    storyUiVisible,
    blockingOverlayVisible,
    worldInputEnabled: !blockingOverlayVisible,
  };
}
