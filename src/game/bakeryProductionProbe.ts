"use client";

export type BakeryProductionProbe = {
  baseline: number;
  worldProgression: number;
  contributions: number;
  projectedStage: 0 | 1 | 2 | 3 | 4;
};

export const BAKERY_PRODUCTION_PROBE_EVENT = "sysselcraft:bakery-production-probe";

let baseline: number | null = null;
let latestWorldProgression: number | null = null;

function stageFor(contributions: number): 0 | 1 | 2 | 3 | 4 {
  if (contributions >= 10) return 4;
  if (contributions >= 7) return 3;
  if (contributions >= 3) return 2;
  if (contributions >= 1) return 1;
  return 0;
}

function snapshot(): BakeryProductionProbe | null {
  if (baseline === null || latestWorldProgression === null) return null;
  const contributions = Math.max(0, Math.floor(latestWorldProgression) - baseline);
  return { baseline, worldProgression: latestWorldProgression, contributions, projectedStage: stageFor(contributions) };
}

function publish() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BakeryProductionProbe | null>(BAKERY_PRODUCTION_PROBE_EVENT, { detail: snapshot() }));
}

export function observeBakeryProductionWorldProgression(value: number) {
  latestWorldProgression = Math.max(0, Math.floor(value));
  publish();
}

export function startBakeryProductionProbe(): BakeryProductionProbe | null {
  if (latestWorldProgression === null) return null;
  baseline = latestWorldProgression;
  publish();
  return snapshot();
}

export function stopBakeryProductionProbe() {
  baseline = null;
  publish();
}

export function getBakeryProductionProbe() {
  return snapshot();
}
