/**
 * Runtime Architecture 1.0 canonical system registry.
 *
 * Reusable game-system concepts are declared here once and consumed by
 * chapter/area configuration. Chapter code must not create parallel copies.
 */

export const SYSTEM_ASSETS = {
  brandLogo: "/assets/village/sysselcraft-logo.png",
} as const;

export const SYSTEM_COMPONENT_IDS = {
  gameUiShell: "game-ui-shell",
  storyMoment: "story-moment",
  dialogueCard: "dialogue-card",
  storyHistory: "story-history",
  questMarker: "quest-marker",
  npcAttentionMarker: "npc-attention-marker",
  interactable: "interactable",
  purchaseGate: "purchase-gate",
} as const;

export type SystemComponentId =
  (typeof SYSTEM_COMPONENT_IDS)[keyof typeof SYSTEM_COMPONENT_IDS];

export type CanonicalSystemStatus = "canonical" | "migration-pending";

export type CanonicalSystemRegistration = {
  id: SystemComponentId;
  status: CanonicalSystemStatus;
  owner: string;
  note: string;
};

export const CANONICAL_SYSTEMS: readonly CanonicalSystemRegistration[] = [
  {
    id: SYSTEM_COMPONENT_IDS.gameUiShell,
    status: "canonical",
    owner: "Runtime 1.0",
    note: "One persistent shell must frame every playable area.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.storyMoment,
    status: "canonical",
    owner: "Story Engine",
    note: "Shared fullscreen story presentation.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.dialogueCard,
    status: "canonical",
    owner: "Story Engine",
    note: "Shared dialogue/nameplate presentation.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.storyHistory,
    status: "canonical",
    owner: "Runtime 1.0",
    note: "Shared Story Registry/History is canonical and the Act 2 development runtime consumes it.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.questMarker,
    status: "canonical",
    owner: "Interaction System",
    note: "Canonical shared renderer exists and current Act 1/Act 2 quest markers consume it.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.npcAttentionMarker,
    status: "canonical",
    owner: "Interaction System",
    note: "Canonical shared renderer exists and current Village story/NPC attention markers consume it.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.interactable,
    status: "migration-pending",
    owner: "Interaction System",
    note: "Hotspots, approach points and pointer priority require one shared contract.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.purchaseGate,
    status: "migration-pending",
    owner: "Progression Engine",
    note: "Existing purchase behavior is reused but presentation/gating becomes shared.",
  },
] as const;
