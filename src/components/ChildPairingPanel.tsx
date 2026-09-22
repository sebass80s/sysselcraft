"use client";

import { FormEvent, useEffect, useState } from "react";
import { ensureChildAnonymousSession } from "@/backend/auth";
import { getPairedChildId, setPairedChildId } from "@/backend/childDeviceBinding";
import {
  getBoundChildIdForCurrentSession,
  getChildGameState,
  isChildDeviceBound,
  redeemChildPairingCode,
} from "@/backend/familyRepository";

function normalizePairingCode(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").slice(0, 8);
}

export default function ChildPairingPanel({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Förbereder säker barnsession…");
  const [busy, setBusy] = useState(true);
  const [paired, setPaired] = useState(false);
  const [rePairing, setRePairing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      try {
        await ensureChildAnonymousSession();
        let childId = await getPairedChildId();
        if (cancelled) return;
        if (!childId) {
          const recoveredChildId = await getBoundChildIdForCurrentSession();
          if (cancelled) return;
          if (!recoveredChildId) { setPaired(false); setMessage(""); return; }
          const recoveredState = await getChildGameState(recoveredChildId);
          if (cancelled) return;
          if (!recoveredState) {
            setPaired(false);
            setMessage("En tidigare barnkoppling hittades, men barnets spelstatus kunde inte läsas. Skapa en ny parningskod i föräldraläget.");
            return;
          }
          await setPairedChildId(recoveredChildId);
          if (cancelled) return;
          childId = recoveredChildId;
          setPaired(true);
          setRePairing(false);
          setMessage("Barnkopplingen återställdes på enheten. ✅");
          return;
        }
        const bound = await isChildDeviceBound(childId);
        if (cancelled) return;
        if (!bound) {
          setPaired(false); setRePairing(true);
          setMessage("Den sparade barnkopplingen finns kvar på enheten, men backend-bindningen saknas. Skapa en ny parningskod i föräldraläget och koppla om enheten.");
          return;
        }
        const backendState = await getChildGameState(childId);
        if (cancelled) return;
        if (backendState) { setPaired(true); setMessage("Den här enheten är redan kopplad till Sysselcraft. ✅"); return; }
        setPaired(false); setRePairing(true);
        setMessage("Barnkopplingen är registrerad, men barnets spelstatus kunde inte läsas. Skapa en ny parningskod i föräldraläget och koppla om enheten.");
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Kunde inte starta barnsessionen.");
      } finally { if (!cancelled) setBusy(false); }
    }
    void prepare();
    return () => { cancelled = true; };
  }, []);

  async function pair(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const childId = await redeemChildPairingCode(code);
      if (!(await isChildDeviceBound(childId))) throw new Error("Parningen skapades, men enhetsbindningen kunde inte bekräftas. Försök igen.");
      if (!(await getChildGameState(childId))) throw new Error("Kopplingen skapades, men barnets spelstatus kunde inte läsas. Försök igen.");
      await setPairedChildId(childId);
      setPaired(true); setRePairing(false); setMessage("Enheten är kopplad! 🎉"); setCode("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Parningen misslyckades."); }
    finally { setBusy(false); }
  }

  const showPairingForm = !paired || rePairing;
  return <div className="parent-menu-backdrop" role="presentation">
    <section className="parent-menu-panel" role="dialog" aria-modal="true" aria-labelledby="child-pairing-title">
      <button className="close-button" type="button" onClick={onClose} aria-label="Stäng parning">×</button>
      <span className="parent-menu-kicker">📱 Barnets enhet</span>
      <h2 id="child-pairing-title">Koppla Sysselcraft</h2>
      <p className="parent-menu-note">Skapa en parningskod i föräldraläget och skriv den 8-teckenskoden här. Koden gäller i 15 minuter och kan bara användas en gång.</p>
      {showPairingForm && <form onSubmit={pair}>
        <input aria-label="Parningskod" value={code} onChange={(event) => setCode(normalizePairingCode(event.target.value))} maxLength={8} autoCapitalize="characters" autoComplete="one-time-code" autoCorrect="off" spellCheck={false} placeholder="8 tecken" required />
        <button className="primary-button" disabled={busy || code.length !== 8}>{rePairing ? "Koppla om enheten" : "Koppla enheten"}</button>
      </form>}
      {paired && !rePairing && <button className="secondary-button" type="button" disabled={busy} onClick={() => { setCode(""); setMessage("Skriv den nya parningskoden. Den gamla kopplingen behålls tills en ny kod godkänns."); setRePairing(true); }}>Koppla om till ett annat barn</button>}
      {paired && rePairing && <button className="secondary-button compact" type="button" disabled={busy} onClick={() => { setCode(""); setRePairing(false); setMessage("Den befintliga kopplingen är kvar. ✅"); }}>Avbryt omkoppling</button>}
      {message && <p className="parent-status-message">{message}</p>}
      <button className="secondary-button" type="button" onClick={onClose}>← Tillbaka till byn</button>
    </section>
  </div>;
}
