export type InteractionMarkerKind =
  | "quest-available"
  | "quest-turn-in"
  | "npc-attention";

export type WorldPoint = {
  x: number;
  y: number;
};

export type InteractionActivationZone = {
  anchor: WorldPoint;
  interactionRadius: number;
};

export type InteractionDefinition = {
  id: string;
  kind: "npc" | "quest-source" | "hotspot" | "exit";
  anchor: WorldPoint;
  approachPoint?: WorldPoint;
  interactionRadius: number;
  activationZones?: readonly InteractionActivationZone[];
  marker?: InteractionMarkerKind;
  enabled: boolean;
};

type InteractionRequest = {
  interactionId: string;
  requestedAt: WorldPoint;
};

export type InteractionResolution =
  | { status: "disabled" | "unknown" }
  | {
      status: "approach";
      interaction: InteractionDefinition;
      target: WorldPoint;
    }
  | {
      status: "activate";
      interaction: InteractionDefinition;
    };

function distance(a: WorldPoint, b: WorldPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function resolveInteraction(
  interactions: readonly InteractionDefinition[],
  request: InteractionRequest,
  playerPosition: WorldPoint,
): InteractionResolution {
  const interaction = interactions.find((candidate) => candidate.id === request.interactionId);
  if (!interaction) return { status: "unknown" };
  if (!interaction.enabled) return { status: "disabled" };

  const activationZones: readonly InteractionActivationZone[] = [
    { anchor: interaction.anchor, interactionRadius: interaction.interactionRadius },
    ...(interaction.activationZones ?? []),
  ];

  if (activationZones.some((zone) => distance(playerPosition, zone.anchor) <= zone.interactionRadius)) {
    return { status: "activate", interaction };
  }

  return {
    status: "approach",
    interaction,
    target: interaction.approachPoint ?? interaction.anchor,
  };
}

export type WorldInputState = {
  enabled: boolean;
  blockingOverlayVisible: boolean;
};

export function worldInputEnabled(state: WorldInputState): boolean {
  return state.enabled && !state.blockingOverlayVisible;
}
