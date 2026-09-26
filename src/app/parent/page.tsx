"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  getBackendAuthState,
  setParentPassword,
  sendParentPasswordBootstrapLink,
  signInParentWithPassword,
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
  reactivateParentQuest,
  setParentQuestRecurrenceTime,
  updateParentQuestV2,
  type ParentQuestDefinition,
  type QuestRecurrenceKind,
} from "@/backend/familyRepository";
import type { BackendChild, BackendHousehold, BackendQuest } from "@/backend/types";
import { isParentQuestDraftReady, type ParentQuestDraft } from "@/game/parentMode";
import { createQuestRequestGuard } from "@/game/questRequestGuard";
import { archiveDiamondReward, createDiamondReward, listDiamondRedemptions, listDiamondRewards, markDiamondRewardDelivered, refundDiamondReward, updateDiamondReward, type DiamondRewardDefinition, type DiamondRewardRedemption } from "@/backend/diamondRewards";

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
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
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
  const [recurrenceTime, setRecurrenceTime] = useState("08:00");
  const [reactivatingQuestId, setReactivatingQuestId] = useState<string | null>(null);
  const [hiddenQuestHistoryIds, setHiddenQuestHistoryIds] = useState<Set<string>>(new Set());
  const [hiddenRewardHistoryIds, setHiddenRewardHistoryIds] = useState<Set<string>>(new Set());
  const [pairingCode, setPairingCode] = useState("");
  const [familyRequests] = useState(createQuestRequestGuard);
  const [childRequests] = useState(createQuestRequestGuard);
  const [diamondRewards, setDiamondRewards] = useState<DiamondRewardDefinition[]>([]);
  const [diamondRedemptions, setDiamondRedemptions] = useState<DiamondRewardRedemption[]>([]);
  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [rewardPrice, setRewardPrice] = useState(1);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<"quests" | "rewards">("quests");


  function clearQuestHistory() {
    const ids = approved.map((quest) => quest.instanceId);
    setHiddenQuestHistoryIds(new Set(ids));
    localStorage.setItem("sysselcraft:hidden-quest-history", JSON.stringify(ids));
  }

  function clearRewardHistory() {
    const ids = diamondRedemptions.filter((item) => item.status !== "pending_delivery").map((item) => item.id);
    setHiddenRewardHistoryIds(new Set(ids));
    localStorage.setItem("sysselcraft:hidden-reward-history", JSON.stringify(ids));
  }

  useEffect(() => {
    familyRequests.activate();
    childRequests.activate();
    return () => {
      familyRequests.deactivate();
      childRequests.deactivate();
    };
  }, [childRequests, familyRequests]);

  const loadDiamondRewards = useCallback(async (id: string) => {
    if (!id) { setDiamondRewards([]); setDiamondRedemptions([]); return; }
    const [catalog, redemptions] = await Promise.all([listDiamondRewards(id), listDiamondRedemptions(id)]);
    setDiamondRewards(catalog); setDiamondRedemptions(redemptions);
  }, []);

  const loadChildQuests = useCallback(async (id: string) => {
    if (!childRequests.isActive()) return false;
    if (!id) {
      childRequests.invalidate();
      setQuests([]);
      setQuestDefinitions([]);
      return true;
    }
    const current = childRequests.begin();
    try {
      const [nextQuests, nextDefinitions] = await Promise.all([
        listChildQuests(id),
        listParentQuestDefinitions(id),
      ]);
      if (!current()) return false;
      setQuests(nextQuests);
      setQuestDefinitions(nextDefinitions);
      return true;
    } catch (error) {
      if (!current()) return false;
      throw error;
    }
  }, [childRequests]);

  const refreshFamily = useCallback(async (
    preferredHousehold?: string,
    preferredChild?: string,
  ) => {
    if (!familyRequests.isActive()) return false;
    const current = familyRequests.begin();
    const hs = await listHouseholds();
    if (!current()) return false;
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
    if (!current()) return false;
    setChildren(cs);

    const nextChildId =
      preferredChild && cs.some((child) => child.id === preferredChild)
        ? preferredChild
        : childId && cs.some((child) => child.id === childId)
          ? childId
          : cs[0]?.id ?? "";

    setChildId(nextChildId);
    await loadChildQuests(nextChildId);
    if (current()) await loadDiamondRewards(nextHouseholdId);
    return current();
  }, [childId, familyRequests, householdId, loadChildQuests, loadDiamondRewards]);

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
        if (parent) {
          familyRequests.activate();
          childRequests.activate();
          refreshSafely();
        } else {
          familyRequests.invalidate();
          childRequests.invalidate();
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
  }, [childRequests, familyRequests, refreshFamily]);

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

  async function submitReward(event: FormEvent) {
    event.preventDefault(); if (!householdId || !rewardTitle.trim() || rewardPrice < 1) return;
    setBusy(true); setMessage("");
    try {
      if (editingRewardId) await updateDiamondReward(editingRewardId,rewardTitle,rewardDescription,rewardPrice,true);
      else await createDiamondReward(householdId,rewardTitle,rewardDescription,rewardPrice);
      setRewardTitle(""); setRewardDescription(""); setRewardPrice(1); setEditingRewardId(null);
      await loadDiamondRewards(householdId); setMessage(editingRewardId ? "Belöningen är uppdaterad. 💎" : "Belöningen finns nu hos Mira. 💎");
    } catch(error){setMessage(error instanceof Error?error.message:"Kunde inte spara belöningen.");} finally{setBusy(false);}
  }
  async function toggleReward(reward: DiamondRewardDefinition) {
    setBusy(true); try { await updateDiamondReward(reward.id,reward.title,reward.description,reward.diamondPrice,!reward.active); await loadDiamondRewards(householdId); } catch(error){setMessage(error instanceof Error?error.message:"Kunde inte ändra belöningen.");} finally{setBusy(false);}
  }
  async function removeReward(reward: DiamondRewardDefinition) {
    if(!window.confirm(`Arkivera "${reward.title}"? Köphistoriken sparas.`))return;
    setBusy(true); try{await archiveDiamondReward(reward.id);await loadDiamondRewards(householdId);}catch(error){setMessage(error instanceof Error?error.message:"Kunde inte arkivera belöningen.");}finally{setBusy(false);}
  }
  async function deliverReward(id:string){setBusy(true);try{await markDiamondRewardDelivered(id);await loadDiamondRewards(householdId);setMessage("Markerad som levererad. 🎁");}catch(error){setMessage(error instanceof Error?error.message:"Kunde inte markera levererad.");}finally{setBusy(false);}}
  async function refundReward(id:string){if(!window.confirm("Refundera köpet och lämna tillbaka diamanterna?"))return;setBusy(true);try{await refundDiamondReward(id);await loadDiamondRewards(householdId);setMessage("Köpet är refunderat och diamanterna återbetalda.");}catch(error){setMessage(error instanceof Error?error.message:"Kunde inte refundera.");}finally{setBusy(false);}}

  async function passwordLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await signInParentWithPassword(email, password);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inloggningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  async function bootstrapPassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await sendParentPasswordBootstrapLink(email, `${window.location.origin}/parent`);
      setMessage("Kolla mejlen. Öppna engångslänken här för att sätta ditt första lösenord. 🔐");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte skicka engångslänken.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await setParentPassword(newPassword);
      setNewPassword("");
      setShowPasswordSetup(false);
      setMessage("Lösenordet är sparat. Nästa gång kan du logga in utan mejllänk. 🔐");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte spara lösenordet.");
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
          "Europe/Stockholm",
        );
        await setParentQuestRecurrenceTime(editingQuestId, recurrenceTime);
        if (reactivatingQuestId === editingQuestId) {
          await reactivateParentQuest(editingQuestId);
          setMessage("Questet är återaktiverat och finns hos barnet. ♻️");
        } else setMessage("Uppdraget är uppdaterat. ✏️");
      } else {
        await createParentQuestV2(
          householdId,
          childId,
          draft,
          recurrenceKind,
          recurrenceWeekdays,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        const createdDefinitions = await listParentQuestDefinitions(childId);
        const newest = createdDefinitions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
        if (newest) await setParentQuestRecurrenceTime(newest.questId, recurrenceTime);
        setMessage("Uppdraget är skickat till Sysselcraft! 🎉");
      }
      setDraft(emptyDraft);
      setRecurrenceKind("once");
      setRecurrenceWeekdays([]);
      setRecurrenceTime("08:00");
      setEditingQuestId(null);
      setReactivatingQuestId(null);
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
    setRecurrenceTime(definition.recurrenceTime || "08:00");
    setReactivatingQuestId(null);
    setMessage("Redigerar uppdrag. Historiska förekomster ändras inte.");
  }

  function beginReactivateDefinition(definition: ParentQuestDefinition) {
    beginEditDefinition(definition);
    setReactivatingQuestId(definition.questId);
    setMessage("Kontrollera uppdraget och tryck Återaktivera quest när det är klart.");
  }

  function cancelEdit() {
    setEditingQuestId(null);
    setReactivatingQuestId(null);
    setDraft(emptyDraft);
    setRecurrenceKind("once");
    setRecurrenceWeekdays([]);
    setRecurrenceTime("08:00");
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
    familyRequests.invalidate();
    childRequests.invalidate();
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
      await loadDiamondRewards(nextHouseholdId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte byta familj.");
    } finally {
      setBusy(false);
    }
  }

  async function changeChild(nextChildId: string) {
    familyRequests.invalidate();
    childRequests.invalidate();
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
    familyRequests.invalidate();
    childRequests.invalidate();
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
          <p>Logga in med mejladress och lösenord.</p>
          <form onSubmit={passwordLogin}>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="din@mejl.se"
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Lösenord"
            />
            <button className="primary-button" disabled={busy}>
              Logga in
            </button>
          </form>
          <form onSubmit={bootstrapPassword}>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="din@mejl.se"
            />
            <button className="secondary-button" disabled={busy}>
              Jag har inget lösenord ännu
            </button>
          </form>
          <small>Har du bara använt mejllänk tidigare? Skicka en sista engångslänk och sätt sedan ett permanent lösenord.</small>
          {message && <p>{message}</p>}
          <a href="/">← Tillbaka till byn</a>
        </section>
      </main>
    );
  }

  const pending = quests.filter((quest) => quest.state === "pending");
  const available = quests.filter((quest) => quest.state === "available");
  const active = quests.filter((quest) => quest.state === "active");
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
          <div>
            <button
              className="secondary-button compact"
              disabled={busy}
              onClick={() => setShowPasswordSetup((visible) => !visible)}
            >
              {showPasswordSetup ? "Avbryt lösenord" : "Sätt lösenord"}
            </button>
            <button
              className="secondary-button compact"
              disabled={busy}
              onClick={() => void logout()}
            >
              Logga ut
            </button>
          </div>
        </header>

        {showPasswordSetup && (
          <section className="parent-tool-card">
            <h2>Sätt lösenord</h2>
            <p>Detta sparas av Supabase Auth på ditt befintliga föräldrakonto. Minst 8 tecken.</p>
            <form onSubmit={savePassword}>
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Nytt lösenord"
              />
              <button className="primary-button" disabled={busy}>Spara lösenord</button>
            </form>
          </section>
        )}

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

            <nav className="parent-tool-card parent-reward-row" aria-label="Föräldrahantering">
              <button type="button" className={adminTab === "quests" ? "primary-button" : "secondary-button"} onClick={() => setAdminTab("quests")}>📋 Sysslor</button>
              <button type="button" className={adminTab === "rewards" ? "primary-button" : "secondary-button"} onClick={() => setAdminTab("rewards")}>💎 Belöningar</button>
            </nav>

            {adminTab === "quests" && <>
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
              <h2>{reactivatingQuestId ? "♻️ Återaktivera quest" : editingQuestId ? "✏️ Redigera uppdrag" : "+ Nytt uppdrag"}</h2>
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
                {recurrenceKind !== "once" && <label>Klockslag<input type="time" value={recurrenceTime} onChange={(event) => setRecurrenceTime(event.target.value)} /><small>Svensk lokal tid</small></label>}
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
                  {reactivatingQuestId ? "Återaktivera quest" : editingQuestId ? "Spara ändringar" : "Skapa uppdrag"}
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

            </>}

            {adminTab === "rewards" && <>
            <section className="parent-tool-card">
              <div className="parent-section-heading"><h2>💎 Verkliga belöningar</h2><span>{diamondRewards.filter(r=>r.active).length}</span></div>
              <p>De här belöningarna kan barnet köpa för diamanter hos Mira.</p>
              <form className="parent-quest-form" onSubmit={submitReward}>
                <input required maxLength={80} placeholder="T.ex. Glass" value={rewardTitle} onChange={e=>setRewardTitle(e.target.value)} />
                <textarea maxLength={240} placeholder="Beskrivning (valfri)" value={rewardDescription} onChange={e=>setRewardDescription(e.target.value)} />
                <label>Pris 💎<input type="number" min="1" max="100000" value={rewardPrice} onChange={e=>setRewardPrice(Number(e.target.value))}/></label>
                <button className="primary-button" disabled={busy || !rewardTitle.trim() || rewardPrice<1}>{editingRewardId?"Spara belöning":"Lägg till hos Mira"}</button>
                {editingRewardId&&<button type="button" className="secondary-button" onClick={()=>{setEditingRewardId(null);setRewardTitle("");setRewardDescription("");setRewardPrice(1)}}>Avbryt</button>}
              </form>
              {diamondRewards.map(reward=><article className="parent-quest-card" key={reward.id}><div><span>{reward.active?"💎":"⏸️"}</span><div><strong>{reward.title}</strong><small>{reward.diamondPrice} 💎 · {reward.active?"Tillgänglig hos Mira":"Pausad"}</small></div></div><div className="parent-quest-actions"><button className="secondary-button compact" disabled={busy} onClick={()=>{setEditingRewardId(reward.id);setRewardTitle(reward.title);setRewardDescription(reward.description);setRewardPrice(reward.diamondPrice)}}>Redigera</button><button className="secondary-button compact" disabled={busy} onClick={()=>void toggleReward(reward)}>{reward.active?"Pausa":"Aktivera"}</button><button className="secondary-button compact" disabled={busy} onClick={()=>void removeReward(reward)}>Arkivera</button></div></article>)}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading"><h2>🎁 Väntar på leverans</h2><span>{diamondRedemptions.filter(r=>r.status==="pending_delivery").length}</span></div>
              {diamondRedemptions.filter(r=>r.status==="pending_delivery").map(redemption=>{const owner=children.find(c=>c.id===redemption.childId);return <article className="parent-quest-card" key={redemption.id}><div><span>🎁</span><div><strong>{redemption.title}</strong><small>{owner?.displayName||"Barnet"} · {redemption.diamondPrice} 💎</small></div></div><div className="parent-quest-actions"><button className="primary-button compact" disabled={busy} onClick={()=>void deliverReward(redemption.id)}>Levererad</button><button className="secondary-button compact" disabled={busy} onClick={()=>void refundReward(redemption.id)}>Refundera</button></div></article>})}
              {!diamondRedemptions.some(r=>r.status==="pending_delivery")&&<div className="parent-empty-state">Inga verkliga belöningar väntar på leverans.</div>}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading"><h2>📜 Belöningshistorik</h2><span>{diamondRedemptions.filter(r=>r.status!=="pending_delivery"&&!hiddenRewardHistoryIds.has(r.id)).length}</span></div>{diamondRedemptions.some(r=>r.status!=="pending_delivery"&&!hiddenRewardHistoryIds.has(r.id))&&<button className="secondary-button compact" disabled={busy} onClick={clearRewardHistory}>Rensa historik</button>}
              {diamondRedemptions.filter(r=>r.status!=="pending_delivery"&&!hiddenRewardHistoryIds.has(r.id)).slice(0,20).map(redemption=>{const owner=children.find(c=>c.id===redemption.childId);return <article className="parent-quest-card" key={redemption.id}><div><span>{redemption.status==="delivered"?"✅":"↩️"}</span><div><strong>{redemption.title}</strong><small>{owner?.displayName||"Barnet"} · {redemption.diamondPrice} 💎 · {redemption.status==="delivered"?"Levererad":"Refunderad"}</small></div></div></article>})}
              {!diamondRedemptions.some(r=>r.status!=="pending_delivery"&&!hiddenRewardHistoryIds.has(r.id))&&<div className="parent-empty-state">Historiken fylls på när en belöning levereras eller refunderas.</div>}
            </section>

            </>}

            <section className="parent-tool-card">
              <h2>{child?.displayName || "Barn"}</h2>
              <p>
                {available.length} nya · {active.length} pågår · {pending.length} väntar · {approved.length} godkända
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

            {adminTab === "quests" && <>
            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Nya uppdrag hos barnet</h2>
                <span>{available.length}</span>
              </div>
              {available.length ? available.map((quest) => (
                <article className="parent-quest-card" key={quest.instanceId}>
                  <div><span>❔</span><div><strong>{quest.title}</strong><small>Väntar på att {child?.displayName || "barnet"} tar uppdraget</small></div></div>
                </article>
              )) : <div className="parent-empty-state">Inga nya uppdrag väntar på att tas.</div>}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Pågår</h2>
                <span>{active.length}</span>
              </div>
              {active.length ? active.map((quest) => (
                <article className="parent-quest-card" key={quest.instanceId}>
                  <div><span>📜</span><div><strong>{quest.title}</strong><small>{child?.displayName || "Barnet"} har tagit uppdraget</small></div></div>
                </article>
              )) : <div className="parent-empty-state">Inga uppdrag pågår just nu.</div>}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Uppdragsmallar</h2>
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
                      <button className="secondary-button compact" disabled={busy} onClick={() => beginEditDefinition(definition)}>Redigera</button>
                      <button className="secondary-button compact" disabled={busy} onClick={() => beginReactivateDefinition(definition)}>Återaktivera</button>
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
                <div className="parent-empty-state">Inga uppdragsmallar ännu.</div>
              )}
            </section>

            <section className="parent-tool-card">
              <div className="parent-section-heading">
                <h2>Senast klara</h2>
                <span>{approved.filter((quest) => !hiddenQuestHistoryIds.has(quest.instanceId)).length}</span>
              </div>
              {approved.length > 0 && <button className="secondary-button compact" disabled={busy} onClick={clearQuestHistory}>Rensa historik</button>}
              {approved.filter((quest) => !hiddenQuestHistoryIds.has(quest.instanceId)).length ? (
                approved.filter((quest) => !hiddenQuestHistoryIds.has(quest.instanceId)).slice(0, 5).map((quest) => (
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
            </>}
          </>
        )}

        {message && <div className="parent-status-message">{message}</div>}
        <a href="/">← Tillbaka till byn</a>
      </section>
    </main>
  );
}
