import { getPairedChildId } from "../../backend/childDeviceBinding";
import { getChildGameState } from "../../backend/familyRepository";
import {
  createBackendAuthoritySnapshot,
  type BackendAuthoritySnapshot,
} from "./backendSync";

export async function loadPairedBackendAuthoritySnapshot(): Promise<BackendAuthoritySnapshot | null> {
  const childId = await getPairedChildId();
  if (!childId) return null;
  const backend = await getChildGameState(childId);
  return backend ? createBackendAuthoritySnapshot(backend) : null;
}
