export type WorldActorImage = {
  setOrigin: (x: number, y: number) => WorldActorImage;
  setDisplaySize: (width: number, height: number) => WorldActorImage;
  setDepth: (depth: number) => WorldActorImage;
  setVisible: (visible: boolean) => WorldActorImage;
};

export type WorldActorScene<TImage extends WorldActorImage> = {
  add: {
    image: (x: number, y: number, texture: string) => TImage;
  };
};

export type WorldActorDefinition = {
  x: number;
  y: number;
  texture: string;
  depth: number;
  visible?: boolean;
};

export const WORLD_PLAYER_VISUAL = {
  originX: 0.5,
  originY: 0.94,
  width: 74,
  height: 118,
} as const;

export const WORLD_DOG_VISUAL = {
  originX: 0.5,
  originY: 0.88,
  width: 66,
  height: 55,
} as const;

function createWorldActor<TImage extends WorldActorImage>(
  scene: WorldActorScene<TImage>,
  definition: WorldActorDefinition,
  visual: { originX: number; originY: number; width: number; height: number },
) {
  const actor = scene.add.image(definition.x, definition.y, definition.texture)
    .setOrigin(visual.originX, visual.originY)
    .setDisplaySize(visual.width, visual.height)
    .setDepth(definition.depth) as TImage;
  if (definition.visible !== undefined) actor.setVisible(definition.visible);
  return actor;
}

export function createWorldPlayer<TImage extends WorldActorImage>(
  scene: WorldActorScene<TImage>,
  definition: WorldActorDefinition,
) {
  return createWorldActor(scene, definition, WORLD_PLAYER_VISUAL);
}

export function createWorldDog<TImage extends WorldActorImage>(
  scene: WorldActorScene<TImage>,
  definition: WorldActorDefinition,
) {
  return createWorldActor(scene, definition, WORLD_DOG_VISUAL);
}
