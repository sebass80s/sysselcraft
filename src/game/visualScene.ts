export type VisualLayerRole =
  | "ground"
  | "background"
  | "world"
  | "foreground";

export type PaintedAssetSlot = {
  key: string;
  file: string;
  role: VisualLayerRole;
  /** World-space ground contact. Never infer this from image bounds. */
  base?: { x: number; y: number };
  /** Independent collision footprint on the ground plane. */
  collision?: { x: number; y: number; width: number; height: number };
  /** Optional world placement for independent painted layers. */
  placement?: { x: number; y: number; originX?: number; originY?: number };
};

/**
 * Production-art contract for the opening village.
 *
 * These files are deliberately PNG/WebP slots rather than SVG primitives. They are the runtime
 * derivatives of the approved painted master scene described by docs/ART_DIRECTION.md.
 *
 * IMPORTANT: this manifest does not mean the master is flattened into one background. Tall
 * objects/foliage that the child can pass behind/in front of must remain independent layers with
 * explicit ground/base points. Collision and interaction stay independent from image rectangles.
 */
export const OPENING_PAINTED_SCENE: PaintedAssetSlot[] = [
  {
    key: "painted-ground",
    file: "/assets/village/painted/opening-ground.webp",
    role: "ground",
  },
  {
    key: "painted-background",
    file: "/assets/village/painted/opening-background.webp",
    role: "background",
  },
  {
    key: "painted-family-house",
    file: "/assets/village/painted/family-house.webp",
    role: "world",
    placement: { x: 150, y: 250, originY: 1 },
    base: { x: 150, y: 250 },
    collision: { x: 150, y: 165, width: 190, height: 125 },
  },
  {
    key: "painted-house-garden",
    file: "/assets/village/painted/house-garden.webp",
    role: "world",
    placement: { x: 165, y: 292, originY: 1 },
    base: { x: 165, y: 292 },
  },
  {
    key: "painted-linus-place",
    file: "/assets/village/painted/linus-place.webp",
    role: "world",
    placement: { x: 575, y: 310, originY: 1 },
    base: { x: 575, y: 310 },
  },
  {
    key: "painted-north-grove",
    file: "/assets/village/painted/north-grove.webp",
    role: "world",
    placement: { x: 505, y: 190, originY: 1 },
    base: { x: 505, y: 190 },
  },
  {
    key: "painted-west-grove",
    file: "/assets/village/painted/west-grove.webp",
    role: "world",
    placement: { x: -80, y: 500, originY: 1 },
    base: { x: -80, y: 500 },
  },
  {
    key: "painted-east-grove",
    file: "/assets/village/painted/east-grove.webp",
    role: "world",
    placement: { x: 930, y: 505, originY: 1 },
    base: { x: 930, y: 505 },
  },
  {
    key: "painted-foreground-west",
    file: "/assets/village/painted/foreground-west.webp",
    role: "foreground",
    placement: { x: -70, y: 640, originY: 1 },
    base: { x: -70, y: 640 },
  },
  {
    key: "painted-foreground-east",
    file: "/assets/village/painted/foreground-east.webp",
    role: "foreground",
    placement: { x: 900, y: 640, originY: 1 },
    base: { x: 900, y: 640 },
  },
];

export const PAINTED_DYNAMIC_ASSETS = {
  child: {
    southA: "/assets/village/painted/child-south-a.webp",
    southB: "/assets/village/painted/child-south-b.webp",
    northA: "/assets/village/painted/child-north-a.webp",
    northB: "/assets/village/painted/child-north-b.webp",
    sideA: "/assets/village/painted/child-side-a.webp",
    sideB: "/assets/village/painted/child-side-b.webp",
  },
  linus: {
    idleA: "/assets/village/painted/linus-a.webp",
    idleB: "/assets/village/painted/linus-b.webp",
  },
  dog: "/assets/village/painted/dog-puppy.webp",
  deliveryTruck: "/assets/village/painted/truck.webp",
  deliveredMaterials: "/assets/village/painted/material-stack.webp",
  deliverySite: "/assets/village/painted/delivery-site.webp",
} as const;
