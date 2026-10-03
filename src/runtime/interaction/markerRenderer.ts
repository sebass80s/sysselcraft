import type { GameObjects, Scene } from "phaser";
import type { InteractionMarkerKind } from "./interactionContract";

export type InteractionMarkerOptions = {
  kind: InteractionMarkerKind;
  x?: number;
  y?: number;
  visible?: boolean;
  interactive?: boolean;
  depth?: number;
};

const GLYPH_BY_KIND: Record<InteractionMarkerKind, string> = {
  "quest-available": "?",
  "quest-turn-in": "!",
  "npc-attention": "…",
};

export function createInteractionMarker(
  scene: Scene,
  options: InteractionMarkerOptions,
): GameObjects.Container {
  const bubble = scene.add.graphics();
  bubble.fillStyle(0x5b3a1f, 0.94);
  bubble.lineStyle(3, 0xffd83d, 1);
  bubble.fillCircle(0, 0, 27);
  bubble.strokeCircle(0, 0, 27);

  const label = scene.add.text(0, -2, GLYPH_BY_KIND[options.kind], {
    color: "#ffd83d",
    fontSize: "30px",
    fontStyle: "bold",
    fontFamily: "Trebuchet MS",
    stroke: "#8a5a00",
    strokeThickness: 4,
    shadow: { color: "#ffcf33", blur: 12, fill: true, stroke: true },
  }).setOrigin(0.5);

  const marker = scene.add.container(options.x ?? 0, options.y ?? 0, [bubble, label])
    .setDepth(options.depth ?? 3000)
    .setSize(76, 76)
    .setVisible(options.visible ?? true);

  if (options.interactive ?? true) marker.setInteractive({ useHandCursor: true });

  scene.tweens.add({
    targets: [bubble, label],
    y: "-=3",
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });

  marker.setData("interactionMarkerKind", options.kind);
  return marker;
}
