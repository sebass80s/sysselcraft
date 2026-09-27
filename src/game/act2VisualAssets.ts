export type Act2RestorationProject = "cabin" | "dock" | "boathouse" | "motorboat";
export type Act2VisualStage = 1 | 2 | 3 | 4;

export const ACT2_WORLD = {
  width: 1983,
  height: 793,
  master: "/assets/village/buildings/act 2/lake-master.png",
} as const;

/**
 * Locked from the 2026-09-27 Lake Master composite acceptance.
 * These values are the visual contract, not progression thresholds.
 * Runtime art must use normalized transparent canvases in the runtime/ folder.
 */
export const ACT2_VISUAL_PLACEMENTS = {
  cabin: {
    x: 575, baseY: 375, width: 350, origin: { x: 0.5, y: 0.92 },
    footprint: { width: 205, height: 72 },
  },
  boathouse: {
    x: 1435, baseY: 505, width: 340, origin: { x: 0.5, y: 0.92 },
    footprint: { width: 205, height: 72 },
  },
  dock: {
    x: 1660, baseY: 515, width: 315, origin: { x: 0.5, y: 0.90 },
    footprint: { width: 190, height: 58 },
  },
  motorboat: {
    x: 1635, baseY: 430, width: 180, origin: { x: 0.5, y: 0.82 },
    footprint: { width: 118, height: 42 },
  },
} as const;

const ACT2_RUNTIME_ROOT = "/assets/village/buildings/act 2/runtime";

export const ACT2_VISUAL_ASSETS: Record<Act2RestorationProject, readonly [string, string, string, string]> = {
  cabin: [1, 2, 3, 4].map((stage) => `${ACT2_RUNTIME_ROOT}/cabin-stage-${stage}.png`) as unknown as readonly [string, string, string, string],
  dock: [1, 2, 3, 4].map((stage) => `${ACT2_RUNTIME_ROOT}/dock-stage-${stage}.png`) as unknown as readonly [string, string, string, string],
  boathouse: [1, 2, 3, 4].map((stage) => `${ACT2_RUNTIME_ROOT}/boat-house-${stage}.png`) as unknown as readonly [string, string, string, string],
  motorboat: [1, 2, 3, 4].map((stage) => `${ACT2_RUNTIME_ROOT}/motorboat-stage-${stage}.png`) as unknown as readonly [string, string, string, string],
};

export const ACT2_NORMALIZED_CANVASES = {
  cabin: { width: 1766, height: 879 },
  dock: { width: 1774, height: 887 },
  boathouse: { width: 1628, height: 991 },
  motorboat: { width: 725, height: 423 },
} as const;

export function getAct2VisualAsset(project: Act2RestorationProject, stage: Act2VisualStage) {
  return ACT2_VISUAL_ASSETS[project][stage - 1];
}

export function getAct2DisplaySize(project: Act2RestorationProject) {
  const placement = ACT2_VISUAL_PLACEMENTS[project];
  const canvas = ACT2_NORMALIZED_CANVASES[project];
  return {
    width: placement.width,
    height: Math.round(canvas.height * placement.width / canvas.width),
  };
}
