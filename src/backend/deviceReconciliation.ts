import { loadSaveState } from "@/game/saveState";
import { getPairedChildId } from "./childDeviceBinding";
import { getChildGameState } from "./familyRepository";
import { createReconciliationReport, type ReconciliationReport } from "./reconciliation";

export type PairedDeviceReconciliation = {
  childId: string;
  report: ReconciliationReport;
};

export type PairedDeviceReconciliationInspection =
  | { status: "ready"; value: PairedDeviceReconciliation }
  | { status: "not-paired" }
  | { status: "local-save-missing"; childId: string }
  | { status: "backend-state-missing"; childId: string }
  | { status: "local-and-backend-state-missing"; childId: string };

/**
 * Detailed read-only inspection for physical-device migration testing.
 *
 * The status explains why a full report cannot be produced yet. No branch in this function
 * writes to either Capacitor Preferences or Supabase.
 */
export async function inspectPairedDeviceReconciliationDetailed(): Promise<PairedDeviceReconciliationInspection> {
  const childId = await getPairedChildId();
  if (!childId) return { status: "not-paired" };

  const [localSave, backendState] = await Promise.all([
    loadSaveState(),
    getChildGameState(childId),
  ]);

  if (!localSave && !backendState) {
    return { status: "local-and-backend-state-missing", childId };
  }
  if (!localSave) return { status: "local-save-missing", childId };
  if (!backendState) return { status: "backend-state-missing", childId };

  return {
    status: "ready",
    value: {
      childId,
      report: createReconciliationReport(localSave, backendState),
    },
  };
}

/**
 * Compatibility wrapper for callers that only need a complete report or null.
 */
export async function inspectPairedDeviceReconciliation(): Promise<PairedDeviceReconciliation | null> {
  const inspection = await inspectPairedDeviceReconciliationDetailed();
  return inspection.status === "ready" ? inspection.value : null;
}
