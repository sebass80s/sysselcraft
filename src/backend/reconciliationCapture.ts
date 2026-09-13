import type { PairedDeviceReconciliation } from "./deviceReconciliation";
import { decideReconciliation } from "./reconciliationPolicy";

export type ReconciliationCaptureV1 = {
  version: 1;
  capturedAt: string;
  childId: string;
  report: PairedDeviceReconciliation["report"];
  decision: ReturnType<typeof decideReconciliation>;
};

/**
 * Creates a stable, shareable read-only capture of the current reconciliation state.
 * The capture contains no auth tokens or secrets and performs no writes.
 */
export function createReconciliationCapture(
  value: PairedDeviceReconciliation,
  capturedAt = new Date().toISOString(),
): ReconciliationCaptureV1 {
  return {
    version: 1,
    capturedAt,
    childId: value.childId,
    report: value.report,
    decision: decideReconciliation(value.report),
  };
}

export function serializeReconciliationCapture(value: PairedDeviceReconciliation): string {
  return JSON.stringify(createReconciliationCapture(value), null, 2);
}
