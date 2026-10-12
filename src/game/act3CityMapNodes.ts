/** Five stable Act 3 city nodes. All percentages anchor the SVG pin TIP. */
export type Act3CityNodeId = "harbor" | "folkpark" | "nova-home" | "game-shop" | "treasure-hunt";
export type Act3PermanentNodeId = Exclude<Act3CityNodeId, "treasure-hunt">;
export type Act3NodeVisibility = "always-on-city-map" | "discovered-by-story" | "hunt-only";
export type Act3CityMapNode = Readonly<{
  id: Act3CityNodeId;
  iconKey: "harbor" | "folkpark" | "home" | "game-shop" | "treasure-hunt";
  xPct: number;
  yPct: number;
  visibility: Act3NodeVisibility;
  locationRole: "harbor-gateway" | "story-location" | "temporary-story-location";
  label: string;
  confirmText: string;
}>;
export type Act3CityMapVisibilityContext = Readonly<{
  /** Permanent IDs earned through explicit authored story discovery, not a dialogue mention. */
  discoveredPermanentIds: readonly Act3PermanentNodeId[];
  /** Active only during A3-HUNT-001..006. */
  huntActive: boolean;
  /** Only after the secret arcade is revealed after DRAMA-010. */
  arcadeRevealed: boolean;
  /** Can be highlighted even while waiting for an approved quest. */
  activeNodeId: Act3CityNodeId | null;
}>;
export type Act3VisibleCityNode = Act3CityMapNode & Readonly<{ active: boolean }>;
export const ACT3_CITY_MAP_REFERENCE = {
  width: 1672, height: 941,
  aspect: "landscape-16:9", fit: "contain", markerAnchor: "pin-tip",
  // Deliberately null: do not load a mockup that has embedded pins!
  backgroundPublicUrl: null,
  proposedBackgroundPath: "public/assets/village/act3-map/city-background.png",
  iconDirectoryProposal: "public/assets/village/act3-map/nodes/",
} as const;
export const ACT3_CITY_NODES: readonly Act3CityMapNode[] = [
  { id: "harbor", iconKey: "harbor", xPct: 18.9, yPct: 62.5, visibility: "always-on-city-map", locationRole: "harbor-gateway", label: "Hamnen", confirmText: "Vi går till hamnen." },
  { id: "folkpark", iconKey: "folkpark", xPct: 75.4, yPct: 66.8, visibility: "discovered-by-story", locationRole: "story-location", label: "Folkparken", confirmText: "Vi går till parken." },
  { id: "nova-home", iconKey: "home", xPct: 81.8, yPct: 20.2, visibility: "discovered-by-story", locationRole: "story-location", label: "Novas hem", confirmText: "Vi går hem till Nova." },
  { id: "game-shop", iconKey: "game-shop", xPct: 54.3, yPct: 43.3, visibility: "discovered-by-story", locationRole: "story-location", label: "Spelbutiken", confirmText: "Vi går till spelbutiken." },
  { id: "treasure-hunt", iconKey: "treasure-hunt", xPct: 39.2, yPct: 62.6, visibility: "hunt-only", locationRole: "temporary-story-location", label: "Skattjakten", confirmText: "Vi fortsätter skattjakten." },
];
export const ACT3_CITY_CONFIRM_BUTTONS = { accept: "OK", cancel: "Gå tillbaka" } as const;
/** Pure presentation: does not advance story, award currency, or mutate quest/save state. */
export function getVisibleAct3CityNodes(context: Act3CityMapVisibilityContext): readonly Act3VisibleCityNode[] {
  const discovered = new Set(context.discoveredPermanentIds);
  return ACT3_CITY_NODES.filter(node => {
    if (node.visibility === "always-on-city-map") return true;
    if (node.visibility === "hunt-only") return context.huntActive;
    return discovered.has(node.id as Act3PermanentNodeId);
  }).map(node => {
    if (node.id === "game-shop" && context.arcadeRevealed) {
      return { ...node, label: "Arkaden", confirmText: "Vi går till arkaden.", active: node.id === context.activeNodeId };
    }
    return { ...node, active: node.id === context.activeNodeId };
  });
}
/** Hidden nodes cannot open the confirmation prompt. */
export function getAct3CityNodeConfirmation(nodeId: Act3CityNodeId, context: Act3CityMapVisibilityContext) {
  const node = getVisibleAct3CityNodes(context).find(item => item.id === nodeId);
  return node ? { nodeId: node.id, text: node.confirmText, buttons: ACT3_CITY_CONFIRM_BUTTONS } as const : null;
}
