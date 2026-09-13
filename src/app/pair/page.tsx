"use client";

import { FormEvent, useEffect, useState } from "react";
import { ensureChildAnonymousSession } from "@/backend/auth";
import { getPairedChildId, setPairedChildId } from "@/backend/childDeviceBinding";
import { redeemChildPairingCode } from "@/backend/familyRepository";

export default function PairChildPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Förbereder säker barnsession…");
  const [busy, setBusy] = useState(true);
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      try {
        await ensureChildAnonymousSession();
        const childId = await getPairedChildId();
        if (cancelled) return;
        setPaired(Boolean(childId));
        setMessage(childId ? "Den här enheten är redan kopplad till Sysselcraft. ✅" : "");
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Kunde inte starta barnsessionen.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void prepare();
    return () => { cancelled = true; };
  }, []);

  async function pair(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const childId = await redeemChildPairingCode(code);
      await setPairedChildId(childId);
      setPaired(true);
      setMessage("Enheten är kopplad! 🎉 Du kan gå tillbaka till Sysselcraft.");
      setCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Parningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="parent-page"><section className="parent-login"><span className="parent-menu-kicker">📱 Barnets enhet</span><h1>Koppla Sysselcraft</h1><p>Skriv koden som visas i föräldraläget. Den gäller i 15 minuter och kan bara användas en gång.</p>{!paired && <form onSubmit={pair}><input value={code} onChange={e=>setCode(e.target.value)} maxLength={8} autoCapitalize="characters" autoCorrect="off" spellCheck={false} placeholder="8 tecken" required/><button className="primary-button" disabled={busy || code.trim().length !== 8}>Koppla enheten</button></form>}{message && <p className="parent-status-message">{message}</p>}<a href="/">← Tillbaka till byn</a></section></main>;
}
