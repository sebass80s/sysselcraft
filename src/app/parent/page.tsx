"use client";

import { FormEvent, useEffect, useState } from "react";
import { sendParentMagicLink, signOutBackendSession } from "@/backend/auth";
import { createChild, createChildPairingCode, createHousehold, createParentQuest, listChildQuests, listChildren, listHouseholds, reviewQuest } from "@/backend/familyRepository";
import { getSupabaseBrowserClient } from "@/backend/supabaseClient";
import type { BackendChild, BackendHousehold, BackendQuest } from "@/backend/types";
import type { ParentQuestDraft } from "@/game/parentMode";

const emptyDraft: ParentQuestDraft = { title: "", description: "", progressionClass: "orderEnvironment", reward: { diamonds: 1, sysselBux: 10 } };

export default function ParentModePage() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [households, setHouseholds] = useState<BackendHousehold[]>([]);
  const [children, setChildren] = useState<BackendChild[]>([]);
  const [quests, setQuests] = useState<BackendQuest[]>([]);
  const [householdId, setHouseholdId] = useState("");
  const [childId, setChildId] = useState("");
  const [draft, setDraft] = useState<ParentQuestDraft>(emptyDraft);
  const [pairingCode, setPairingCode] = useState("");

  async function refreshFamily(preferredHousehold?: string, preferredChild?: string) {
    const hs = await listHouseholds();
    setHouseholds(hs);
    const h = preferredHousehold || householdId || hs[0]?.id || "";
    setHouseholdId(h);
    if (!h) { setChildren([]); setQuests([]); return; }
    const cs = await listChildren(h);
    setChildren(cs);
    const c = preferredChild || childId || cs[0]?.id || "";
    setChildId(c);
    setQuests(c ? await listChildQuests(c) : []);
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getSession().then(({ data }) => {
      const parent = Boolean(data.session && !data.session.user.is_anonymous);
      setSignedIn(parent);
      if (parent) void refreshFamily();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const parent = Boolean(session && !session.user.is_anonymous);
      setSignedIn(parent);
      if (parent) void refreshFamily();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function magicLink(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try { await sendParentMagicLink(email, `${window.location.origin}/parent`); setMessage("Kolla mejlen. Vi har skickat en inloggningslänk."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Inloggningen misslyckades."); }
    finally { setBusy(false); }
  }

  async function bootstrap() {
    const familyName = window.prompt("Vad ska familjen heta?", "Min familj")?.trim();
    if (!familyName) return;
    const childName = window.prompt("Vad heter barnet?")?.trim();
    if (!childName) return;
    setBusy(true);
    try { const h = await createHousehold(familyName); const c = await createChild(h, childName); await refreshFamily(h, c); setMessage("Familjen är skapad. 🏡"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Kunde inte skapa familjen."); }
    finally { setBusy(false); }
  }

  async function submitDraft(e: FormEvent) {
    e.preventDefault(); if (!householdId || !childId) return;
    setBusy(true);
    try { await createParentQuest(householdId, childId, draft); setDraft(emptyDraft); setQuests(await listChildQuests(childId)); setMessage("Uppdraget är skickat till Sysselcraft! 🎉"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Kunde inte skapa uppdraget."); }
    finally { setBusy(false); }
  }

  async function review(instanceId: string, approve: boolean) {
    setBusy(true);
    try { await reviewQuest(instanceId, approve); setQuests(await listChildQuests(childId)); setMessage(approve ? "Godkänt! Belöningen är utdelad. ✅" : "Uppdraget är skickat tillbaka."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Granskningen misslyckades."); }
    finally { setBusy(false); }
  }

  async function makePairingCode() {
    if (!childId) return; setBusy(true);
    try { setPairingCode(await createChildPairingCode(childId)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Kunde inte skapa parningskod."); }
    finally { setBusy(false); }
  }

  if (!signedIn) return <main className="parent-page"><section className="parent-login"><span className="parent-menu-kicker">🔐 Föräldraläge</span><h1>Välkommen vuxen</h1><p>Logga in med din mejladress. Du får en säker engångslänk.</p><form onSubmit={magicLink}><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="din@mejl.se"/><button className="primary-button" disabled={busy}>Skicka inloggningslänk</button></form>{message && <p>{message}</p>}<a href="/">← Tillbaka till byn</a></section></main>;

  const pending = quests.filter(q => q.state === "pending");
  const active = quests.filter(q => q.state === "available");
  const child = children.find(c => c.id === childId);

  return <main className="parent-page"><section className="parent-dashboard"><header><div><span className="parent-menu-kicker">🏡 Sysselcraft</span><h1>Föräldraläge</h1><p>Skapa uppdrag och följ vad som händer i byn.</p></div><button className="secondary-button compact" onClick={async()=>{await signOutBackendSession(); setSignedIn(false);}}>Logga ut</button></header>
    {households.length === 0 ? <section className="parent-tool-card"><h2>Starta familjen</h2><p>Skapa familj och första barnprofilen för att koppla ihop Sysselcraft.</p><button className="primary-button" onClick={bootstrap} disabled={busy}>Skapa familj</button></section> : <>
      <section className="parent-tool-card"><div className="parent-section-heading"><h2>Väntar på dig</h2><span>{pending.length}</span></div>{pending.length ? pending.map(q=><article className="parent-quest-card" key={q.instanceId}><div><span>✨</span><div><strong>{q.title}</strong><small>{child?.displayName || "Barnet"} säger att uppdraget är klart · 💎 {q.reward.diamonds} · 🪙 {q.reward.sysselBux}</small></div></div><div className="parent-quest-actions"><button className="primary-button compact" disabled={busy} onClick={()=>review(q.instanceId,true)}>Godkänn</button><button className="secondary-button compact" disabled={busy} onClick={()=>review(q.instanceId,false)}>Skicka tillbaka</button></div></article>) : <div className="parent-empty-state">Inga uppdrag väntar på godkännande just nu. ✨</div>}</section>
      <section className="parent-tool-card"><h2>+ Nytt uppdrag</h2><form className="parent-quest-form" onSubmit={submitDraft}><input required maxLength={60} placeholder="Vad ska göras?" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/><textarea required maxLength={240} placeholder="Kort beskrivning" value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/><select value={draft.progressionClass} onChange={e=>setDraft({...draft,progressionClass:e.target.value as ParentQuestDraft["progressionClass"]})}><option value="orderEnvironment">Ordning & miljö</option><option value="knowledgeCreativity">Kunskap & kreativitet</option><option value="wellbeingRoutine">Välmående & rutin</option><option value="movementActivity">Rörelse & aktivitet</option><option value="community">Gemenskap</option></select><div className="parent-reward-row"><label>💎 <input type="number" min="0" value={draft.reward.diamonds} onChange={e=>setDraft({...draft,reward:{...draft.reward,diamonds:Number(e.target.value)}})}/></label><label>🪙 <input type="number" min="0" value={draft.reward.sysselBux} onChange={e=>setDraft({...draft,reward:{...draft.reward,sysselBux:Number(e.target.value)}})}/></label></div><button className="primary-button" disabled={busy}>Skapa uppdrag</button></form></section>
      <section className="parent-tool-card"><h2>{child?.displayName || "Barn"}</h2><p>{active.length} aktiva uppdrag · {quests.filter(q=>q.state==="approved").length} klara</p><button className="secondary-button" onClick={makePairingCode} disabled={busy}>Koppla barnets enhet</button>{pairingCode && <div className="pairing-code"><small>Parningskod, giltig i 15 minuter</small><strong>{pairingCode.toUpperCase()}</strong></div>}</section>
    </>}{message && <div className="parent-status-message">{message}</div>}<a href="/">← Tillbaka till byn</a></section></main>;
}
