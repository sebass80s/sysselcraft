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

function createQuestMarker(scene: Scene, glyph: "?" | "!") {
  const bubble = scene.add.graphics();
  bubble.fillStyle(0x5b3a1f, 0.94);
  bubble.lineStyle(3, 0xffd83d, 1);
  bubble.fillCircle(0, 0, 27);
  bubble.strokeCircle(0, 0, 27);

  const label = scene.add.text(0, -2, glyph, {
    color: "#ffd83d",
    fontSize: "30px",
    fontStyle: "bold",
    fontFamily: "Trebuchet MS",
    stroke: "#8a5a00",
    strokeThickness: 4,
    shadow: { color: "#ffcf33", blur: 12, fill: true, stroke: true },
  }).setOrigin(0.5);

  return { children: [bubble, label], animated: [bubble, label], width: 76, height: 76 };
}

function createNpcAttentionMarker(scene: Scene) {
  const bubble = scene.add.graphics();
  bubble.fillStyle(0xfffbef, 0.98);
  bubble.lineStyle(3, 0x5b3a1f, 1);
  bubble.fillRoundedRect(-29, -21, 58, 42, 14);
  bubble.strokeRoundedRect(-29, -21, 58, 42, 14);
  bubble.fillTriangle(-10, 18, -2, 18, -10, 29);

  const dots = scene.add.text(0, -5, "•••", {
    color: "#5b3a1f",
    fontSize: "22px",
    fontStyle: "bold",
  }).setOrigin(0.5);

  return { children: [bubble, dots], animated: [bubble, dots], width: 76, height: 72 };
}

export function createInteractionMarker(
  scene: Scene,
  options: InteractionMarkerOptions,
): GameObjects.Container {
  const visual = options.kind === "npc-attention"
    ? createNpcAttentionMarker(scene)
    : createQuestMarker(scene, options.kind === "quest-turn-in" ? "!" : "?");

  const marker = scene.add.container(options.x ?? 0, options.y ?? 0, visual.children)
    .setDepth(options.depth ?? 3000)
    .setSize(visual.width, visual.height)
    .setVisible(options.visible ?? true);

  if (options.interactive ?? true) marker.setInteractive({ useHandCursor: true });

  scene.tweens.add({
    targets: visual.animated,
    y: "-=3",
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });

  marker.setData("interactionMarkerKind", options.kind);
  return marker;
}
