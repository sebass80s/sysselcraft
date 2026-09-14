export type ConstructionStage = 1 | 2 | 3 | 4;
export type CardinalFacing = "north" | "south" | "east" | "west";
export type CharacterMotion = "idle" | "walk";

export type BuildingProductionAsset = {
  id: "recycling-centre" | "bakery" | "doctor-house";
  stages: Record<ConstructionStage, string>;
  /** Ground/base point inside the transparent runtime canvas, normalized 0..1. */
  basePoint: { x: number; y: number };
  /** Reserved until the painted asset has been measured in runtime. */
  displaySize?: { width: number; height: number };
};

export type CharacterProductionAsset = {
  id: "child" | "linus" | "henning" | "sol";
  reference: string;
  frames: Record<CharacterMotion, Record<CardinalFacing, readonly string[]>>;
  /** Ground/base point inside each transparent frame, normalized 0..1. */
  basePoint: { x: number; y: number };
};

const REBOOT = "/assets/village/reboot/production";

function buildingStages(name: string): Record<ConstructionStage, string> {
  return {
    1: `${REBOOT}/buildings/${name}/stage-1.webp`,
    2: `${REBOOT}/buildings/${name}/stage-2.webp`,
    3: `${REBOOT}/buildings/${name}/stage-3.webp`,
    4: `${REBOOT}/buildings/${name}/stage-4.webp`,
  };
}

function characterFrames(name: string): CharacterProductionAsset["frames"] {
  const framesFor = (motion: CharacterMotion, facing: CardinalFacing) => [
    `${REBOOT}/characters/${name}/${motion}-${facing}-01.webp`,
    `${REBOOT}/characters/${name}/${motion}-${facing}-02.webp`,
  ] as const;

  return {
    idle: {
      north: framesFor("idle", "north"),
      south: framesFor("idle", "south"),
      east: framesFor("idle", "east"),
      west: framesFor("idle", "west"),
    },
    walk: {
      north: framesFor("walk", "north"),
      south: framesFor("walk", "south"),
      east: framesFor("walk", "east"),
      west: framesFor("walk", "west"),
    },
  };
}

export const BUILDING_PRODUCTION_ASSETS: readonly BuildingProductionAsset[] = [
  {
    id: "recycling-centre",
    stages: buildingStages("recycling-centre"),
    basePoint: { x: 0.5, y: 0.93 },
  },
  {
    id: "bakery",
    stages: buildingStages("bakery"),
    basePoint: { x: 0.5, y: 0.93 },
  },
  {
    id: "doctor-house",
    stages: buildingStages("doctor-house"),
    basePoint: { x: 0.5, y: 0.93 },
  },
] as const;

export const CHARACTER_PRODUCTION_ASSETS: readonly CharacterProductionAsset[] = [
  {
    id: "child",
    reference: "/assets/village/reboot/child.webp",
    frames: characterFrames("child"),
    basePoint: { x: 0.5, y: 0.94 },
  },
  {
    id: "linus",
    reference: "/assets/village/reboot/linus-painted.png",
    frames: characterFrames("linus"),
    basePoint: { x: 0.5, y: 0.96 },
  },
  {
    id: "henning",
    reference: `${REBOOT}/characters/henning/reference.webp`,
    frames: characterFrames("henning"),
    basePoint: { x: 0.5, y: 0.95 },
  },
  {
    id: "sol",
    reference: `${REBOOT}/characters/sol/reference.webp`,
    frames: characterFrames("sol"),
    basePoint: { x: 0.5, y: 0.95 },
  },
] as const;

export const PRODUCTION_ASSET_RULES = {
  format: "webp",
  transparentDynamicAssets: true,
  constructionStages: 4,
  characterDirections: ["north", "south", "east", "west"] as const,
  minimumFramesPerMotionDirection: 2,
  runtimeVerified: false,
} as const;
