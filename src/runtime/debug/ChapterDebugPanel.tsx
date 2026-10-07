"use client";

import type { ReactNode } from "react";
import type { ChapterDebugProbeResult } from "./chapterDebugHarness";

export type ChapterDebugAction = {
  id: string;
  label: string;
  onRun: () => void;
};

export type ChapterDebugProbeView = {
  id: string;
  label: string;
  result: ChapterDebugProbeResult;
};

type ChapterDebugPanelProps = {
  visible: boolean;
  chapterLabel: string;
  inspection: Record<string, unknown>;
  onReset: () => void;
  actions?: readonly ChapterDebugAction[];
  probes?: readonly ChapterDebugProbeView[];
  children?: ReactNode;
};

export function ChapterDebugPanel({
  visible,
  chapterLabel,
  inspection,
  onReset,
  actions = [],
  probes = [],
  children,
}: ChapterDebugPanelProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "max(8px, env(safe-area-inset-top))",
        right: 10,
        zIndex: 150,
        display: "grid",
        gap: 6,
        maxWidth: 360,
        padding: 7,
        borderRadius: 10,
        background: "rgba(22,28,22,.88)",
        color: "white",
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <button className="secondary-button compact" type="button" onClick={onReset}>
          ↺ {chapterLabel}
        </button>
        {actions.map((action) => (
          <button
            key={action.id}
            className="secondary-button compact"
            type="button"
            onClick={action.onRun}
          >
            {action.label}
          </button>
        ))}
        <span style={{ fontSize: 12, fontWeight: 800 }}>DEBUG · production UI</span>
      </div>

      {probes.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 11 }}>
          {probes.map((probe) => (
            <span key={probe.id}>
              {probe.result.ok ? "✅" : "❌"} {probe.label}
            </span>
          ))}
        </div>
      )}

      <details style={{ fontSize: 11 }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>State inspection</summary>
        <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap", maxHeight: 180, overflow: "auto" }}>
          {JSON.stringify(inspection, null, 2)}
        </pre>
      </details>

      {children}
    </div>
  );
}
