"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  getBackendAuthState,
  sendParentMagicLink,
  signOutBackendSession,
  subscribeBackendAuth,
} from "@/backend/auth";
import {
  archiveParentQuest,
  createChild,
  createChildPairingCode,
  createHousehold,
  createParentQuestV2,
  listChildQuests,
  listChildren,
  listHouseholds,
  listParentQuestDefinitions,
  reviewQuest,
  updateParentQuestV2,
  type ParentQuestDefinition,
  type QuestRecurrenceKind,
} from "@/backend/familyRepository";
import type { BackendChild, BackendHousehold, BackendQuest } from "@/backend/types";
import { isParentQuestDraftReady, type ParentQuestDraft } from "@/game/parentMode";

const emptyDraft: ParentQuestDraft = {
  title: "",
  description: "",
  progressionClass: "orderEnvironment",
  reward: { diamonds: 1, sysselBux: 10 },
};

const WEEKDAY_LABELS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

function recurrenceLabel(definition: ParentQuestDefinition) {
  if (definition.recurrenceKind === "daily") return "Varje dag";
  if (definition.recurrenceKind === "weekly") return "Varje vecka";
  if (definition.recurrenceKind === "weekdays") {
    const days = definition.recurrenceWeekdays
      .map((day) => WEEKDAY_LABELS[day - 1])
      .filter(Boolean)
      .join(", ");
    return days || "Valda veckodagar";
  }
  return "En gång";
}

export default function ParentModePage() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [households, setHouseholds] = useState<BackendHousehold[]>([]);
  const [children, setChildren] = useState<BackendChild[]>([]);
  const [quests, setQuests] = useState<BackendQuest[]>([]);
  const [questDefinitions, setQuestDefinitions] = useState<ParentQuestDefinition[]>([]);
  const [householdId, setHouseholdId] = useState("");
  const [childId, setChildId] = useState("");
  const [draft, setDraft] = useState<ParentQuestDraft>(emptyDraft);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [recurrenceKind, setRecurrenceKind] = useState<QuestRecurrenceKind>("once");
  const [recurrenceWeekdays, setRecurrenceWeekdays] = useState<number[]>([]);
  const [pairingCode, setPairingCode] = useState("");

  const loadChildQuests = useCallback(async (id: string) => {
    if (!id) {
      setQuests([]);
      setQuestDefinitions([]);
      return;
    }
    const [nextQuests, nextDefinitions] = await Promise.all([
      listChildQuests(id),
      listParentQuestDefinitions(id),
    ]);
    setQuests(nextQuests);
    setQuestDefinitions(nextDefinitions);
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

    const refreshSafely = () => {
      void refreshFamily().catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Kunde inte hämta familjen.");
      });
    };

    void getBackendAuthState()
      .then((state) => {
        if (cancelled) return;
        const parent = state.signedIn && !state.isAnonymous;
        setSignedIn(parent);
        if (parent) refreshSafely();
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Kunde inte läsa inloggningen.");
        }
      });

    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeBackendAuth((state) => {
        if (cancelled) return;
        const parent = state.signedIn && !state.isAnonymous;
        setSignedIn(parent);
        if (parent) refreshSafely();
        else {
          setHouseholds([]);
          setChildren([]);
          setQuests([]);
        }
      });
    } catch {
      // getBackendAuthState above reports the same configuration error asynchronously.
    }

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
      if (editingQuestId) {
        await updateParentQuestV2(
          editingQuestId,
          draft,
          recurrenceKind,
          recurrenceWeekdays,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        setMessage("Uppdraget är uppdaterat. ✏️");
      } else {
        await createParentQuestV2(
          householdId,
          childId,
          draft,
          recurrenceKind,
          recurrenceWeekdays,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        setMessage("Uppdraget är skickat till Sysselcraft! 🎉");
      }
      setDraft(emptyDraft);
      setRecurrenceKind("once");
      setRecurrenceWeekdays([]);
      setEditingQuestId(null);
      await loadChildQuests(childId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skapa uppdraget.");
    } finally {
      setBusy(false);
    }
  }

  function beginEditDefinition(definition: ParentQuestDefinition) {
    setEditingQuestId(definition.questId);
    setDraft({
      title: definition.title,
      description: definition.description,
      progressionClass: definition.progressionClass,
      reward: { ...definition.reward },
    });
    setRecurrenceKind(definition.recurrenceKind);
    setRecurrenceWeekdays(definition.recurrenceWeekdays);
    setMessage("Redigerar uppdrag. Historiska förekomster ändras inte.");
  }

  function cancelEdit() {
    setEditingQuestId(null);
    setDraft(emptyDraft);
    setRecurrenceKind("once");
    setRecurrenceWeekdays([]);
    setMessage("");
  }

  async function archiveQuestDefinition(definition: ParentQuestDefinition) {
    const confirmed = window.confirm(
      `Ta bort "${definition.title}"? Uppdragshistorik och redan utdelade belöningar sparas.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage("");
    try {
      await archiveParentQuest(definition.questId);
      if (editingQuestId === definition.questId) {
        setEditingQuestId(null);
        setDraft(emptyDraft);
        setRecurrenceKind("once");
        setRecurrenceWeekdays([]);
      }
      await loadChildQuests(childId);
      setMessage("Uppdraget är borttaget. Historiken är sparad.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte ta bort uppdraget.");
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
          ? "Godkänt! Barnet kan nu hämta belöningen hos Linus. ✅"
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
      setMessage("Parningskoden är skapad. Skriv in den på barnets enhet.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skapa parningskod.");
    } finally {
      setBusy(false);
    }
  }

  async function changeHousehold(nextHouseholdId: string) {
    cancelEdit();
    setQuests([]);
    setQuestDefinitions([]);
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
    cancelEdit();
    setQuests([]);
    setQuestDefinitions([]);
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

  async function refreshSelectedChild() {
    if (!childId) return;
    setBusy(true);
    setMessage("");
    try {
      await loadChildQuests(childId);
      setMessage("Uppdragen är uppdaterade.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte uppdatera uppdragen.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setMessage("");
    try {
      await signOutBackendSession();
      setSignedIn(false);
      setHouseholds([]);
      setChildren([]);
      setQuests([]);
      setHouseholdId("");
      setChildId("");
      setPairingCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte logga ut.");
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
  const draftReady =
    isParentQuestDraftReady(draft) &&
    (recurrenceKind !== "weekdays" || recurrenceWeekdays.length > 0);

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
            disabled={busy}
            onClick={() => void logout()}
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
                onClick={() => void refreshSelectedChild()}
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
              <h2>{editingQuestId ? "✏️ Redigera uppdrag" : "+ Nytt uppdrag"}</h2>
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
                <label>
                  Upprepning
                  <select
                    value={recurrenceKind}
                    onChange={(event) => {
                      const next = event.target.value as QuestRecurrenceKind;
                      setRecurrenceKind(next);
                      if (next !== "weekdays") setRecurrenceWeekdays([]);
                    }}
                  >
                    <option value="once">En gång</option>
                    <option value="daily">Varje dag</option>
                    <option value="weekdays">Valda veckodagar</option>
                    <option value="weekly">Varje vecka</option>
                  </select>
                </label>
                {recurrenceKind === "weekdays" && (
                  <div className="parent-reward-row" aria-label="Veckodagar">
                    {[
                      [1, "Mån"], [2, "Tis"], [3, "Ons"], [4, "Tor"],
                      [5, "Fre"], [6, "Lör"], [7, "Sön"],
                    ].map(([day, label]) => (
                      <label key={day}>
                        <input
                          type="checkbox"
                          checked={recurrenceWeekdays.includes(day as number)}
                          onChange={(event) =>
                            setRecurrenceWeekdays((current) =>
                              event.target.checked
                                ? [...current, day as number].sort()
                                : current.filter((value) => value !== day),
                            )
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
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
                  {editingQuestId ? "Spara ändringar" : "Skapa uppdrag"}
                </button>
                {editingQuestId && (
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={busy}
                    onClick={cancelEdit}
                  >
                    Avbryt
                  </button>
                )}
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
                <span>{questDefinitions.length}</span>
              </div>
              {questDefinitions.length ? (
                questDefinitions.map((definition) => (
                  <article className="parent-quest-card" key={definition.questId}>
                    <div>
                      <span>📌</span>
                      <div>
                        <strong>{definition.title}</strong>
                        <small>
                          {recurrenceLabel(definition)} · 💎 {definition.reward.diamonds} · 🪙 {definition.reward.sysselBux}
                        </small>
                      </div>
                    </div>
                    <div className="parent-quest-actions">
                      <button
                        className="secondary-button compact"
                        disabled={busy}
                        onClick={() => beginEditDefinition(definition)}
                      >
                        Redigera
                      </button>
                      <button
                        className="secondary-button compact"
                        disabled={busy}
                        onClick={() => void archiveQuestDefinition(definition)}
                      >
                        Ta bort
                      </button>
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
                        <small>{quest.claimedAt ? "Belöningen är hämtad" : "Godkänt · väntar på att barnet hämtar belöningen"}</small>
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
