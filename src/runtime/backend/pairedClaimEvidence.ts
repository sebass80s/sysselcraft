import { getPairedChildId } from "../../backend/childDeviceBinding";
import { getSupabaseBrowserClient } from "../../backend/supabaseClient";
import type { ClaimEvidence } from "../progression/claimGate";

/** Read raw evidence: the display snapshot normalizer would coerce bad counts to 0. */
export async function loadPairedClaimEvidence(): Promise<ClaimEvidence | null> {
  const childId = await getPairedChildId();
  if (!childId) return null;
  const { data, error } = await getSupabaseBrowserClient()
    .from("child_game_state")
    .select("child_id,progression,updated_at")
    .eq("child_id", childId)
    .maybeSingle();
  if (error) throw error;
  if (!data || await getPairedChildId() !== childId) return null;
  const progression = data.progression;
  const count = progression && typeof progression === "object" && !Array.isArray(progression)
    ? progression.worldProgression : undefined;
  if (typeof count !== "number") throw new Error("Missing claim counter");
  // Strict validation belongs to observeClaimEvidence; never normalize missing data.
  return { childId: data.child_id, count, updatedAt: data.updated_at };
}
