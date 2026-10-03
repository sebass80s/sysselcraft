export type GameUiShellInput = {
  debug?: boolean;
  worldReady: boolean;
  blockingOverlayVisible: boolean;
  projectStatusAvailable?: boolean;
};

export type GameUiShellState = {
  mode: "debug" | "loading" | "overlay" | "world";
  showHud: boolean;
  showProjectStatus: boolean;
};

/**
 * Canonical gameplay chrome rule.
 *
 * HUD visibility belongs to presentation state, never quest/project/story data.
 * Domain state may decide whether the world is ready or an overlay is active,
 * but completed projects, null selections and future chapter progression must
 * not implicitly hide the global shell.
 */
export function deriveGameUiShell(input: GameUiShellInput): GameUiShellState {
  if (input.debug) {
    return { mode: "debug", showHud: false, showProjectStatus: false };
  }
  if (!input.worldReady) {
    return { mode: "loading", showHud: false, showProjectStatus: false };
  }
  if (input.blockingOverlayVisible) {
    return { mode: "overlay", showHud: false, showProjectStatus: false };
  }
  return {
    mode: "world",
    showHud: true,
    showProjectStatus: input.projectStatusAvailable === true,
  };
}
