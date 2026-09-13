"use client";

import { FormEvent, useEffect, useState } from "react";
import { ensureChildAnonymousSession } from "@/backend/auth";
import { redeemChildPairingCode } from "@/backend/familyRepository";

const CHILD_ID_KEY = "sysselcraft.backend.childId";

export default function PairChildPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Förbereder säker barnsession…");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    void ensureChildAnonymousSession().then(() => { setBusy(false); setMessage(""); }).catch(error => { setBusy(false); setMessage(error instanceof Error ? error.message : "Kunde inte starta barnsessionen."); });
  }, []);

  async function pair(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const childId = await redeemChildPairingCode(code);
      localStorage.setItem(CHILD_ID_KEY, childId);
      setMessage("Enheten är kopplad! 🎉 Du kan gå tillbaka till Sysselcraft.");
      setCode("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Parningen misslyckades."); }
    finally { setBusy(false); }
  }

  return <main className="parent-page"><section className="parent-login"><span className="parent-menu-kicker">📱 Barnets enhet</span><h1>Koppla Sysselcraft</h1><p>Skriv koden som visas i föräldraläget. Den gäller i 15 minuter och kan bara användas en gång.</p><form onSubmit={pair}><input value={code} onChange={e=>setCode(e.target.value)} maxLength={8} autoCapitalize="characters" autoCorrect="off" spellCheck={false} placeholder="8 tecken" required/><button className="primary-button" disabled={busy || code.trim().length !== 8}>Koppla enheten</button></form>{message && <p className="parent-status-message">{message}</p>}<a href="/">← Tillbaka till byn</a></section></main>;
}
