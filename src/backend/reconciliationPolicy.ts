import type { ReconciliationReport } from "./reconciliation";

export const RECONCILIATION_PHASE = "observe-only" as const;

export type ReconciliationNextStep =
  | "run-physical-baseline"
  | "inspect-backend-ahead"
  | "inspect-local-ahead"
  | "inspect-conflict";

export type ReconciliationDecision = {
  phase: typeof RECONCILIATION_PHASE;
  automaticWriteAllowed: false;
  recommendation: ReconciliationReport["recommendation"];
  nextStep: ReconciliationNextStep;
  reasons: string[];
};

/**
 * Converts a diagnostic report into an explicit migration decision.
 *
 * During the current phase every result remains read-only. Even a clean `no-op` report is not
 * permission to start copying state automatically. The first physical two-device test must be
 * captured before a versioned migration rule is designed.
 */
export function decideReconciliation(report: ReconciliationReport): ReconciliationDecision {
  switch (report.recommendation) {
    case "no-op":
      return {
        phase: RECONCILIATION_PHASE,
        automaticWriteAllowed: false,
        recommendation: report.recommendation,
        nextStep: "run-physical-baseline",
        reasons: [
          "Known local and backend fields currently agree.",
          "Agreement is only a diagnostic baseline; migration semantics are not locked yet.",
        ],
      };
    case "backend-ahead":
      return {
        phase: RECONCILIATION_PHASE,
        automaticWriteAllowed: false,
        recommendation: report.recommendation,
        nextStep: "inspect-backend-ahead",
        reasons: [
          "Backend state is consistently ahead of the local state in the fields we can compare.",
          "Copying it locally could replay rewards or world effects unless the delta source is known.",
        ],
      };
    case "local-ahead":
      return {
        phase: RECONCILIATION_PHASE,
        automaticWriteAllowed: false,
        recommendation: report.recommendation,
        nextStep: "inspect-local-ahead",
        reasons: [
          "Local state is consistently ahead of the backend in the fields we can compare.",
          "Uploading it could mint historical progress without an authoritative reward event.",
        ],
      };
    default:
      return {
        phase: RECONCILIATION_PHASE,
        automaticWriteAllowed: false,
        recommendation: report.recommendation,
        nextStep: "inspect-conflict",
        reasons: [
          "Local and backend state disagree in different directions or contain an unknown world flag.",
          "Mixed state must be inspected manually before any migration rule can be considered.",
        ],
      };
  }
}
