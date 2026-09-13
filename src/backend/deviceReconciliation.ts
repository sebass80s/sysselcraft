import { loadSaveState } from "@/game/saveState";
import { getPairedChildId } from "./childDeviceBinding";
import { getChildGameState } from "./familyRepository";
import { createReconciliationReport, type ReconciliationReport } from "./reconciliation";

export type PairedDeviceReconciliation = {
  childId: string;
  report: ReconciliationReport;
};

/**
 * Read-only inspection helper for the migration phase.
 *
 * It deliberately refuses to invent missing state and never writes to either Preferences
 * or Supabase. This is safe to use during physical-device testing before an authority/migration
 * policy is locked.
 */
export async function inspectPairedDeviceReconciliation(): Promise<PairedDeviceReconciliation | null> {
  const childId = await getPairedChildId();
  if (!childId) return null;

  const [localSave, backendState] = await Promise.all([
    loadSaveState(),
    getChildGameState(childId),
  ]);

  if (!localSave || !backendState) return null;

  return {
    childId,
    report: createReconciliationReport(localSave, backendState),
  };
}
