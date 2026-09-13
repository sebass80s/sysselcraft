"use client";

import { useEffect, useMemo, useState } from "react";
import { inspectPairedDeviceReconciliation } from "@/backend/deviceReconciliation";
import type { PairedDeviceReconciliation } from "@/backend/deviceReconciliation";
import styles from "./ReconciliationDiagnostics.module.css";

function shouldShowDiagnostics() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "reconciliation";
}

function recommendationLabel(value: PairedDeviceReconciliation["report"]["recommendation"]) {
  switch (value) {
    case "no-op":
      return "matchar";
    case "backend-ahead":
      return "backend före";
    case "local-ahead":
      return "lokalt före";
    default:
      return "granska manuellt";
  }
}

export default function ReconciliationDiagnostics() {
  const [enabled, setEnabled] = useState(false);
  const [result, setResult] = useState<PairedDeviceReconciliation | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEnabled(shouldShowDiagnostics());
  }, []);

  async function refresh() {
    setBusy(true);
    setMessage("");
    try {
      const next = await inspectPairedDeviceReconciliation();
      setResult(next);
      if (!next) {
        setMessage("Ingen komplett paired-device reconciliation kunde byggas ännu.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte läsa reconciliation-läget.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!enabled) return;
    void refresh();
  }, [enabled]);

  const shortChildId = useMemo(() => {
    if (!result) return "";
    return `${result.childId.slice(0, 8)}…${result.childId.slice(-4)}`;
  }, [result]);

  if (!enabled) return null;

  return (
    <aside className={styles.panel} aria-label="Reconciliation-diagnostik">
      <div className={styles.header}>
        <div>
          <strong>🔎 Reconciliation</strong>
          <small>Read-only diagnostik. Skriver inte till lokal save eller Supabase.</small>
        </div>
        {result && (
          <span className={styles.badge}>{recommendationLabel(result.report.recommendation)}</span>
        )}
      </div>

      {result ? (
        <>
          <section className={styles.section}>
            <div>Barn: <code>{shortChildId}</code></div>
            <div className={styles.row}>
              <strong>Ekonomi</strong>
              <span>Lokalt</span>
              <span>Backend</span>
              <span className={styles.match}>{result.report.economy.matches ? "✓" : "≠"}</span>
            </div>
            <div className={styles.row}>
              <span>Diamanter</span>
              <span>{result.report.economy.local.diamonds}</span>
              <span>{result.report.economy.backend.diamonds}</span>
              <span>{result.report.economy.backend.diamonds - result.report.economy.local.diamonds >= 0 ? "+" : ""}{result.report.economy.backend.diamonds - result.report.economy.local.diamonds}</span>
            </div>
            <div className={styles.row}>
              <span>SysselBux</span>
              <span>{result.report.economy.local.sysselBux}</span>
              <span>{result.report.economy.backend.sysselBux}</span>
              <span>{result.report.economy.backend.sysselBux - result.report.economy.local.sysselBux >= 0 ? "+" : ""}{result.report.economy.backend.sysselBux - result.report.economy.local.sysselBux}</span>
            </div>
          </section>

          <section className={styles.section}>
            <strong>Dold progression</strong>
            {result.report.progression.map((entry) => (
              <div className={styles.row} key={entry.key}>
                <code>{entry.key}</code>
                <span>{entry.local}</span>
                <span>{entry.backend}</span>
                <span>{entry.delta >= 0 ? "+" : ""}{entry.delta}</span>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <strong>Första leveransen</strong>
            <div className={styles.row}>
              <span>world flag</span>
              <span>{String(result.report.worldFlags.localFirstDeliveryComplete)}</span>
              <span>{String(result.report.worldFlags.backendFirstDeliveryComplete)}</span>
              <span>{result.report.worldFlags.matches === null ? "?" : result.report.worldFlags.matches ? "✓" : "≠"}</span>
            </div>
          </section>
        </>
      ) : (
        <p className={styles.message}>{message || "Läser paired-device state…"}</p>
      )}

      {message && result && <p className={styles.message}>{message}</p>}

      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={refresh}>
          {busy ? "Läser…" : "↻ Läs igen"}
        </button>
      </div>
    </aside>
  );
}
