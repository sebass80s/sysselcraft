"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  inspectPairedDeviceReconciliationDetailed,
  type PairedDeviceReconciliation,
  type PairedDeviceReconciliationInspection,
} from "@/backend/deviceReconciliation";
import { decideReconciliation } from "@/backend/reconciliationPolicy";
import styles from "./ReconciliationDiagnostics.module.css";

function subscribeToLocation() {
  return () => {};
}

function getDiagnosticsSnapshot() {
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

function inspectionMessage(inspection: PairedDeviceReconciliationInspection) {
  switch (inspection.status) {
    case "not-paired":
      return "Enheten är inte kopplad till ett barn ännu. Öppna /pair först.";
    case "local-save-missing":
      return "Barnkopplingen finns, men ingen lokal Sysselcraft-save kunde läsas på den här enheten.";
    case "backend-state-missing":
      return "Barnkopplingen finns, men backend saknar child_game_state för barnet.";
    case "local-and-backend-state-missing":
      return "Barnkopplingen finns, men varken lokal save eller backend-state kunde läsas.";
    case "ready":
      return "";
  }
}

export default function ReconciliationDiagnostics() {
  const enabled = useSyncExternalStore(subscribeToLocation, getDiagnosticsSnapshot, () => false);
  const [result, setResult] = useState<PairedDeviceReconciliation | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function readInspection() {
    const inspection = await inspectPairedDeviceReconciliationDetailed();
    if (inspection.status === "ready") {
      setResult(inspection.value);
      setMessage("");
      return;
    }
    setResult(null);
    setMessage(inspectionMessage(inspection));
  }

  async function refresh() {
    setBusy(true);
    setMessage("");
    try {
      await readInspection();
    } catch (error) {
      setResult(null);
      setMessage(error instanceof Error ? error.message : "Kunde inte läsa reconciliation-läget.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    inspectPairedDeviceReconciliationDetailed()
      .then((inspection) => {
        if (cancelled) return;
        if (inspection.status === "ready") {
          setResult(inspection.value);
          setMessage("");
          return;
        }
        setResult(null);
        setMessage(inspectionMessage(inspection));
      })
      .catch((error) => {
        if (cancelled) return;
        setResult(null);
        setMessage(error instanceof Error ? error.message : "Kunde inte läsa reconciliation-läget.");
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const shortChildId = useMemo(() => {
    if (!result) return "";
    return `${result.childId.slice(0, 8)}…${result.childId.slice(-4)}`;
  }, [result]);

  const decision = useMemo(() => {
    return result ? decideReconciliation(result.report) : null;
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
            <div>
              Barn: <code>{shortChildId}</code>
            </div>
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
              <span>
                {result.report.economy.backend.diamonds - result.report.economy.local.diamonds >= 0
                  ? "+"
                  : ""}
                {result.report.economy.backend.diamonds - result.report.economy.local.diamonds}
              </span>
            </div>
            <div className={styles.row}>
              <span>SysselBux</span>
              <span>{result.report.economy.local.sysselBux}</span>
              <span>{result.report.economy.backend.sysselBux}</span>
              <span>
                {result.report.economy.backend.sysselBux - result.report.economy.local.sysselBux >= 0
                  ? "+"
                  : ""}
                {result.report.economy.backend.sysselBux - result.report.economy.local.sysselBux}
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <strong>Dold progression</strong>
            {result.report.progression.map((entry) => (
              <div className={styles.row} key={entry.key}>
                <code>{entry.key}</code>
                <span>{entry.local}</span>
                <span>{entry.backend}</span>
                <span>
                  {entry.delta >= 0 ? "+" : ""}
                  {entry.delta}
                </span>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <strong>Första leveransen</strong>
            <div className={styles.row}>
              <span>world flag</span>
              <span>{String(result.report.worldFlags.localFirstDeliveryComplete)}</span>
              <span>{String(result.report.worldFlags.backendFirstDeliveryComplete)}</span>
              <span>
                {result.report.worldFlags.matches === null
                  ? "?"
                  : result.report.worldFlags.matches
                    ? "✓"
                    : "≠"}
              </span>
            </div>
          </section>

          {decision && (
            <section className={styles.section}>
              <strong>Migrationspolicy</strong>
              <div>Fas: <code>{decision.phase}</code></div>
              <div>Automatisk skrivning: <strong>{decision.automaticWriteAllowed ? "tillåten" : "LÅST"}</strong></div>
              <div>Nästa steg: <code>{decision.nextStep}</code></div>
              {decision.reasons.map((reason) => (
                <small key={reason}>• {reason}</small>
              ))}
            </section>
          )}
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
