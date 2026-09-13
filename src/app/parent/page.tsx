"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  getBackendAuthState,
  sendParentMagicLink,
  signOutBackendSession,
  subscribeBackendAuth,
} from "@/backend/auth";
import {
  createChild,
  createChildPairingCode,
  createHousehold,
  createParentQuest,
  listChildQuests,
  listChildren,
  listHouseholds,
  reviewQuest,
} from "@/backend/familyRepository";
import type { BackendChild, BackendHousehold, BackendQuest } from "@/backend/types";
import { isParentQuestDraftReady, type ParentQuestDraft } from "@/game/parentMode";

const emptyDraft: ParentQuestDraft = {
  title: "",
  description: "",
  progressionClass: "orderEnvironment",
  reward: { diamonds: 1, sysselBux: 10 },
};

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

  const loadChildQuests = useCallback(async (id: string) => {
    setQuests(id ? await listChildQuests(id) : []);
  }, []);

  const refreshFamily = useCallback(async (
    preferredHousehold?: string,
    preferredChild?: string,
  ) => {
    const hs = await listHouseholds();
    setHouseholds(hs);

    const nextHouseholdId =
      preferredHousehold && hs.some((household) => household.id === preferredHousehold)
        ? preferredHousehold
        : householdId && hs.some((household) => household.id === householdId)
          ? householdId
          : hs[0]?.id ?? "";

    setHouseholdId(nextHouseholdId);
    setPairingCode("");

    if (!nextHouseholdId) {
      setChildren([]);
      setChildId("");
      setQuests([]);
      return;
    }

    const cs = await listChildren(nextHouseholdId);
    setChildren(cs);

    const nextChildId =
      preferredChild && cs.some((child) => child.id === preferredChild)
        ? preferredChild
        : childId && cs.some((child) => child.id === childId)
          ? childId
          : cs[0]?.id ?? "";

    setChildId(nextChildId);
    await loadChildQuests(nextChildId);
  }, [childId, householdId, loadChildQuests]);

  useEffect(() => {
    let cancelled = false;

    void getBackendAuthState()
      .then((state) => {
        if (cancelled) return;
        const parent = state.signedIn && !state.isAnonymous;
        setSignedIn(parent);
        if (parent) void refreshFamily();
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Kunde inte läsa inloggningen.");
        }
      });

    const unsubscribe = subscribeBackendAuth((state) => {
      if (cancelled) return;
      const parent = state.signedIn && !state.isAnonymous;
      setSignedIn(parent);
      if (parent) void refreshFamily();
      else {
        setHouseholds([]);
        setChildren([]);
        setQuests([]);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [refreshFamily]);

  useEffect(() => {
    if (!signedIn || !childId) return;

    const refreshQuietly = () => {
      void loadChildQuests(childId).catch(() => {
        // Keep the last known parent view if a background refresh fails.
      });
    };
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") refreshQuietly();
    };

    window.addEventListener("focus", refreshQuietly);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.removeEventListener("focus", refreshQuietly);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [childId, loadChildQuests, signedIn]);

  async function magicLink(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await sendParentMagicLink(email, `${window.location.origin}/parent`);
      setMessage("Kolla mejlen. Vi har skickat en inloggningslänk.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inloggningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  async function bootstrap() {
    const familyName = window.prompt("Vad ska familjen heta?", "Min familj")?.trim();
    if (!familyName) return;
    const childName = window.prompt("Vad heter barnet?")?.trim();
    if (!childName) return;

    setBusy(true);
    setMessage("");
    try {
      const nextHouseholdId = await createHousehold(familyName);
      const nextChildId = await createChild(nextHouseholdId, childName);
      await refreshFamily(nextHouseholdId, nextChildId);
      setMessage("Familjen är skapad. 🏡");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skapa familjen.");
    } finally {
      setBusy(false);
    }
  }

  async function submitDraft(event: FormEvent) {
    event.preventDefault();
    if (!householdId || !childId || !isParentQuestDraftReady(draft)) {
      setMessage("Fyll i både uppdrag och beskrivning innan du skickar det.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      await createParentQuest(householdId, childId, draft);
      setDraft(emptyDraft);
      await loadChildQuests(childId);
      setMessage("Uppdraget är skickat till Sysselcraft! 🎉");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skapa uppdraget.");
    } finally {
      setBusy(false);
    }
  }

  async function review(instanceId: string, approve: boolean) {
    setBusy(true);
    setMessage("");
    try {
      await reviewQuest(instanceId, approve);
      await loadChildQuests(childId);
      setMessage(
        approve
          ? "Godkänt! Belöningen är utdelad. ✅"
          : "Uppdraget är skickat tillbaka till barnet.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Granskningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  async function makePairingCode() {
    if (!childId) return;
    setBusy(true);
    setMessage("");
    try {
      setPairingCode(await createChildPairingCode(childId));
      setMessage("Parningskoden är redo på barnets enhet.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skapa parningskod.");
    } finally {
      setBusy(false);
    }
  }

  async function changeHousehold(nextHouseholdId: string) {
    setHouseholdId(nextHouseholdId);
    setPairingCode("");
    setBusy(true);
    setMessage("");
    try {
      const cs = await listChildren(nextHouseholdId);
      setChildren(cs);
      const nextChildId = cs[0]?.id ?? "";
      setChildId(nextChildId);
      await loadChildQuests(nextChildId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte byta familj.");
    } finally {
      setBusy(false);
    }
  }

  async function changeChild(nextChildId: string) {
    setChildId(nextChildId);
    setPairingCode("");
    setBusy(true);
    setMessage("");
    try {
      await loadChildQuests(nextChildId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte byta barn.");
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn) {
    return (
      <main className="parent-page">
        <section className="parent-login">
          <span className="parent-menu-kicker">🔐 Föräldraläge</span>
          <h1>Välkommen vuxen</h1>
          <p>Logga in med din mejladress. Du får en säker engångslänk.</p>
          <form onSubmit={magicLink}>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="din@mejl.se"
            />
            <button className="primary-button" disabled={busy}>
              Skicka inloggningslänk
            </button>
          </form>
          {message && <p>{message}</p>}
          <a href="/">← Tillbaka till byn</a>
        </section>
      </main>
    );
  }

  const pending = quests.filter((quest) => quest.state === "pending");
  const active = quests.filter((quest) => quest.state === "available");
  const approved = quests.filter((quest) => quest.state === "approved");
  const child = children.find((candidate) => candidate.id === childId);
  const draftReady = isParentQuestDraftReady(draft);

  return (
    <main className="parent-page">
      <section className="parent-dashboard">
        <header>
          <div>
            <span className="parent-menu-kicker">🏡 Sysselcraft</span>
            <h1>Föräldraläge</h1>
            <p>Skapa uppdrag och följ vad som händer i byn.</p>
          </div>
          <button
            className="secondary-button compact"
            onClick={async () => {
              await signOutBackendSession();
              setSignedIn(false);
            }}
          >
            Logga ut
          </button>
        </header>

        {households.length === 0 ? (
          <section className="parent-tool-card">
            <h2>Starta familjen</h2>
            <p>Skapa familj och första barnprofilen för att koppla ihop Sysselcraft.</p>
            <button className="primary-button" onClick={bootstrap} disabled={busy}>
              Skapa familj
            </button>
          </section>
        ) : (
          <>
            <section className="parent-tool-card parent-quest-form">
              <label>
                Familj
                <select
                  value={householdId}
                  disabled={busy}
                  onChange={(event) => void changeHousehold(event.target.value)}
                >
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Barn
                <select
                  value={childId}
                  disabled={busy || children.length === 0}
                  onChange={(event) => void changeChild(event.target.value)}
                >
                  {children.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.displayName}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="secondary-button compact"
                disabled={busy || !childId}
                onClick={() => void loadChildQuests(childId)}
              >
                ↻ Uppdatera
              </button>
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Väntar på dig</h2>
                <span>{pending.length}</span>
              </div>
              {pending.length ? (
                pending.map((quest) => (
                  <article className="parent-quest-card" key={quest.instanceId}>
                    <div>
                      <span>✨</span>
                      <div>
                        <strong>{quest.title}</strong>
                        <small>
                          {child?.displayName || "Barnet"} säger att uppdraget är klart · 💎{" "}
                          {quest.reward.diamonds} · 🪙 {quest.reward.sysselBux}
                        </small>
                      </div>
                    </div>
                    <div className="parent-quest-actions">
                      <button
                        className="primary-button compact"
                        disabled={busy}
                        onClick={() => review(quest.instanceId, true)}
                      >
                        Godkänn
                      </button>
                      <button
                        className="secondary-button compact"
                        disabled={busy}
                        onClick={() => review(quest.instanceId, false)}
                      >
                        Skicka tillbaka
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="parent-empty-state">
                  Inga uppdrag väntar på godkännande just nu. ✨
                </div>
              )}
            </section>

            <section className="parent-tool-card">
              <h2>+ Nytt uppdrag</h2>
              <form className="parent-quest-form" onSubmit={submitDraft}>
                <input
                  required
                  maxLength={60}
                  placeholder="Vad ska göras?"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
                <textarea
                  required
                  maxLength={240}
                  placeholder="Kort beskrivning"
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
                <select
                  value={draft.progressionClass}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      progressionClass: event.target.value as ParentQuestDraft["progressionClass"],
                    })
                  }
                >
                  <option value="orderEnvironment">Ordning & miljö</option>
                  <option value="knowledgeCreativity">Kunskap & kreativitet</option>
                  <option value="wellbeingRoutine">Välmående & rutin</option>
                  <option value="movementActivity">Rörelse & aktivitet</option>
                  <option value="community">Gemenskap</option>
                </select>
                <div className="parent-reward-row">
                  <label>
                    💎
                    <input
                      type="number"
                      min="0"
                      value={draft.reward.diamonds}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          reward: { ...draft.reward, diamonds: Number(event.target.value) },
                        })
                      }
                    />
                  </label>
                  <label>
                    🪙
                    <input
                      type="number"
                      min="0"
                      value={draft.reward.sysselBux}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          reward: { ...draft.reward, sysselBux: Number(event.target.value) },
                        })
                      }
                    />
                  </label>
                </div>
                <button className="primary-button" disabled={busy || !childId || !draftReady}>
                  Skapa uppdrag
                </button>
              </form>
            </section>

            <section className="parent-tool-card">
              <h2>{child?.displayName || "Barn"}</h2>
              <p>
                {active.length} aktiva · {pending.length} väntar · {approved.length} klara
              </p>
              <button
                className="secondary-button"
                onClick={makePairingCode}
                disabled={busy || !childId}
              >
                Koppla barnets enhet
              </button>
              {pairingCode && (
                <div className="pairing-code">
                  <small>Parningskod, giltig i 15 minuter</small>
                  <strong>{pairingCode.toUpperCase()}</strong>
                  <small>
                    Öppna <b>/pair</b> på barnets enhet.
                  </small>
                </div>
              )}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Aktiva uppdrag</h2>
                <span>{active.length}</span>
              </div>
              {active.length ? (
                active.map((quest) => (
                  <article className="parent-quest-card" key={quest.instanceId}>
                    <div>
                      <span>📌</span>
                      <div>
                        <strong>{quest.title}</strong>
                        <small>
                          💎 {quest.reward.diamonds} · 🪙 {quest.reward.sysselBux}
                        </small>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="parent-empty-state">Inga aktiva uppdrag.</div>
              )}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Senast klara</h2>
                <span>{approved.length}</span>
              </div>
              {approved.length ? (
                approved.slice(0, 5).map((quest) => (
                  <article className="parent-quest-card" key={quest.instanceId}>
                    <div>
                      <span>✅</span>
                      <div>
                        <strong>{quest.title}</strong>
                        <small>Godkänt och belönat</small>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="parent-empty-state">Historiken fylls på när uppdrag godkänns.</div>
              )}
            </section>
          </>
        )}

        {message && <div className="parent-status-message">{message}</div>}
        <a href="/">← Tillbaka till byn</a>
      </section>
    </main>
  );
}
