import type { BackendAuthoritySnapshot } from "../runtime/backend/backendSync";
import {
  withBackendClaimBaseline,
  withBackendStoryFlags,
  type Act2RuntimeState,
} from "./act2RuntimeState";

export type Act2BackendContextSelection = {
  worldProgression: number;
  wallet: BackendAuthoritySnapshot["wallet"];
};

export function selectAct2BackendContext(
  snapshot: BackendAuthoritySnapshot,
): Act2BackendContextSelection {
  return {
    worldProgression: snapshot.progression.worldProgression,
    wallet: snapshot.wallet,
  };
}

export function reconcileAct2BackendSnapshot(
  current: Act2RuntimeState,
  snapshot: BackendAuthoritySnapshot,
): { state: Act2RuntimeState; changed: boolean } {
  let next = withBackendClaimBaseline(current, snapshot.progression.worldProgression);
  next = withBackendStoryFlags(next, snapshot.worldFlags);

  const changed =
    next.backendClaimBaseline !== current.backendClaimBaseline
    || next.jettyLifebuoyOwned !== current.jettyLifebuoyOwned
    || next.boathouseSteeringWheelOwned !== current.boathouseSteeringWheelOwned
    || next.motorboatPartsOwned !== current.motorboatPartsOwned;

  return { state: next, changed };
}
