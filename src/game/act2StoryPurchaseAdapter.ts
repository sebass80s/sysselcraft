import {
  boathousePurchaseRequired,
  jettyPurchaseRequired,
  motorboatPartsPurchaseRequired,
  withBackendStoryFlags,
  type Act2RuntimeState,
} from "./act2RuntimeState";
import type { Act2PurchaseProject } from "./act2PurchaseHandoff";

export type Act2StoryPurchaseStatus = Record<
  Act2PurchaseProject,
  { owned: boolean; needed: boolean }
>;

export type Act2StoryPurchaseSnapshot = {
  status: Act2StoryPurchaseStatus;
  purchaseStory: "dock" | "boathouse" | null;
  purchaseStoryLineIndex: number;
};

export type Act2StoryPurchaseOutcome = {
  state: Act2RuntimeState;
  message: string;
  purchaseStory: "dock" | "boathouse" | null;
  purchaseStoryLineIndex: number;
};

export function deriveAct2StoryPurchaseStatus(
  state: Act2RuntimeState,
): Act2StoryPurchaseStatus {
  return {
    dock: {
      owned: state.jettyLifebuoyOwned,
      needed: jettyPurchaseRequired(state),
    },
    boathouse: {
      owned: state.boathouseSteeringWheelOwned,
      needed: boathousePurchaseRequired(state),
    },
    motorboat: {
      owned: state.motorboatPartsOwned,
      needed: motorboatPartsPurchaseRequired(state),
    },
  };
}

export function deriveAct2StoryPurchaseSnapshot(
  state: Act2RuntimeState,
): Act2StoryPurchaseSnapshot {
  return {
    status: deriveAct2StoryPurchaseStatus(state),
    purchaseStory: state.pendingPurchaseStory,
    purchaseStoryLineIndex: state.purchaseStoryLineIndex,
  };
}

export function applyAct2StoryPurchaseResult(
  state: Act2RuntimeState,
  project: Act2PurchaseProject,
  worldFlags: Record<string, unknown>,
): Act2StoryPurchaseOutcome {
  const withFlags = withBackendStoryFlags(state, worldFlags);
  const purchaseStory =
    project === "dock" || project === "boathouse"
      ? project
      : null;
  const next = purchaseStory
    ? {
        ...withFlags,
        pendingPurchaseStory: purchaseStory,
        purchaseStoryLineIndex: 0,
      }
    : withFlags;

  const message =
    project === "dock"
      ? "Livbojen är er! Ta med den tillbaka till bryggan. 🛟"
      : project === "boathouse"
        ? "Ratten är er! Nu kan lådbilen byggas klart. 🛞"
        : "Reservdelspaketet är beställt! Tillbaka till motorbåten. 📦";

  return {
    state: next,
    message,
    purchaseStory,
    purchaseStoryLineIndex: 0,
  };
}
