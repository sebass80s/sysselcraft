import type { SaveStateV1 } from "@/game/saveState";
import {
  PROGRESSION_CLASSES,
  type BackendChildGameState,
  type ProgressionClass,
} from "./types";

export type EconomySnapshot = {
  diamonds: number;
  sysselBux: number;
};

export type ProgressionDelta = {
  key: ProgressionClass;
  local: number;
  backend: number;
  delta: number;
};

export type ReconciliationReport = {
  economy: {
    local: EconomySnapshot;
    backend: EconomySnapshot;
    matches: boolean;
  };
  progression: ProgressionDelta[];
  worldFlags: {
    localFirstDeliveryComplete: boolean;
    backendFirstDeliveryComplete: boolean | null;
    matches: boolean | null;
  };
  recommendation: "no-op" | "inspect-before-merge" | "backend-ahead" | "local-ahead";
};

function finiteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readBackendFirstDeliveryComplete(
  worldFlags: BackendChildGameState["worldFlags"],
): boolean | null {
  const value = worldFlags.firstDeliveryComplete;
  return typeof value === "boolean" ? value : null;
}

export function createReconciliationReport(
  local: SaveStateV1,
  backend: BackendChildGameState,
): ReconciliationReport {
  const localEconomy: EconomySnapshot = {
    diamonds: local.diamonds,
    sysselBux: local.sysselBux,
  };
  const backendEconomy: EconomySnapshot = {
    diamonds: backend.diamonds,
    sysselBux: backend.sysselBux,
  };

  const progression = PROGRESSION_CLASSES.map((key) => {
    const localValue = finiteNumber(local.progression[key]);
    const backendValue = finiteNumber(backend.progression[key]);
    return {
      key,
      local: localValue,
      backend: backendValue,
      delta: backendValue - localValue,
    };
  });

  const localFirstDeliveryComplete = local.worldFlags.firstDeliveryComplete;
  const backendFirstDeliveryComplete = readBackendFirstDeliveryComplete(backend.worldFlags);
  const worldFlagsMatch =
    backendFirstDeliveryComplete === null
      ? null
      : backendFirstDeliveryComplete === localFirstDeliveryComplete;

  const economyMatches =
    localEconomy.diamonds === backendEconomy.diamonds &&
    localEconomy.sysselBux === backendEconomy.sysselBux;
  const progressionMatches = progression.every((entry) => entry.delta === 0);
  const allKnownFieldsMatch = economyMatches && progressionMatches && worldFlagsMatch !== false;

  const backendAhead =
    backendEconomy.diamonds >= localEconomy.diamonds &&
    backendEconomy.sysselBux >= localEconomy.sysselBux &&
    progression.every((entry) => entry.delta >= 0) &&
    (backendFirstDeliveryComplete !== false || !localFirstDeliveryComplete);

  const localAhead =
    localEconomy.diamonds >= backendEconomy.diamonds &&
    localEconomy.sysselBux >= backendEconomy.sysselBux &&
    progression.every((entry) => entry.delta <= 0) &&
    (backendFirstDeliveryComplete !== true || localFirstDeliveryComplete);

  let recommendation: ReconciliationReport["recommendation"] = "inspect-before-merge";
  if (allKnownFieldsMatch) recommendation = "no-op";
  else if (backendAhead && !localAhead) recommendation = "backend-ahead";
  else if (localAhead && !backendAhead) recommendation = "local-ahead";

  return {
    economy: {
      local: localEconomy,
      backend: backendEconomy,
      matches: economyMatches,
    },
    progression,
    worldFlags: {
      localFirstDeliveryComplete,
      backendFirstDeliveryComplete,
      matches: worldFlagsMatch,
    },
    recommendation,
  };
}
