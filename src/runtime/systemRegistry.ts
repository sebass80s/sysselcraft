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
    status: "migration-pending",
    owner: "Runtime 1.0",
    note: "Act 2 history must migrate to the shared Story Registry/History system.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.questMarker,
    status: "migration-pending",
    owner: "Interaction System",
    note: "Legacy quest markers are locally drawn in Phaser and must converge on one canonical renderer/asset.",
  },
  {
    id: SYSTEM_COMPONENT_IDS.npcAttentionMarker,
    status: "migration-pending",
    owner: "Interaction System",
    note: "NPC attention/turn-in markers must share one engine primitive.",
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
