import { Preferences } from "@capacitor/preferences";
import type { BackendQuest } from "@/backend/types";

const KEY_PREFIX = "sysselcraft.quest-turn-ins.v1";
const AWAITING_KEY_PREFIX = "sysselcraft.quest-awaiting-approval.v1";

export type PendingQuestTurnIn = {
  instanceId: string;
  childId: string;
  title: string;
  reward: { diamonds: number; sysselBux: number };
  approvedAt: string;
};

function key(childId: string) {
  return `${KEY_PREFIX}.${childId}`;
}

function awaitingKey(childId: string) {
  return `${AWAITING_KEY_PREFIX}.${childId}`;
}

async function loadAwaitingApprovalIds(childId: string): Promise<string[]> {
  const { value } = await Preferences.get({ key: awaitingKey(childId) });
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

async function saveAwaitingApprovalIds(childId: string, ids: string[]) {
  await Preferences.set({ key: awaitingKey(childId), value: JSON.stringify([...new Set(ids)]) });
}

export async function rememberAwaitingApproval(childId: string, instanceId: string) {
  const current = await loadAwaitingApprovalIds(childId);
  if (current.includes(instanceId)) return current;
  const next = [...current, instanceId];
  await saveAwaitingApprovalIds(childId, next);
  return next;
}

export async function forgetAwaitingApproval(childId: string, instanceId: string) {
  const current = await loadAwaitingApprovalIds(childId);
  const next = current.filter((id) => id !== instanceId);
  await saveAwaitingApprovalIds(childId, next);
  return next;
}

function normalize(value: unknown, childId: string): PendingQuestTurnIn[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<PendingQuestTurnIn>;
    if (
      typeof candidate.instanceId !== "string" ||
      candidate.childId !== childId ||
      typeof candidate.title !== "string" ||
      typeof candidate.approvedAt !== "string" ||
      !candidate.reward ||
      typeof candidate.reward.diamonds !== "number" ||
      typeof candidate.reward.sysselBux !== "number"
    ) return [];
    return [{
      instanceId: candidate.instanceId,
      childId,
      title: candidate.title,
      approvedAt: candidate.approvedAt,
      reward: {
        diamonds: Math.max(0, candidate.reward.diamonds),
        sysselBux: Math.max(0, candidate.reward.sysselBux),
      },
    }];
  });
}

export async function loadPendingQuestTurnIns(childId: string): Promise<PendingQuestTurnIn[]> {
  const { value } = await Preferences.get({ key: key(childId) });
  if (!value) return [];
  try {
    return normalize(JSON.parse(value), childId);
  } catch {
    return [];
  }
}

async function save(childId: string, turnIns: PendingQuestTurnIn[]) {
  await Preferences.set({ key: key(childId), value: JSON.stringify(turnIns) });
}

export async function rememberApprovedQuestTurnIn(
  childId: string,
  quest: BackendQuest,
): Promise<PendingQuestTurnIn[]> {
  const current = await loadPendingQuestTurnIns(childId);
  if (current.some((item) => item.instanceId === quest.instanceId)) return current;
  const next = [...current, {
    instanceId: quest.instanceId,
    childId,
    title: quest.title,
    reward: { ...quest.reward },
    approvedAt: quest.approvedAt ?? new Date().toISOString(),
  }];
  await save(childId, next);
  return next;
}

export async function recoverAwaitingQuestTurnIns(
  childId: string,
  quests: BackendQuest[],
): Promise<PendingQuestTurnIn[]> {
  const awaiting = await loadAwaitingApprovalIds(childId);
  if (awaiting.length === 0) return loadPendingQuestTurnIns(childId);

  let turnIns = await loadPendingQuestTurnIns(childId);
  const questById = new Map(quests.map((quest) => [quest.instanceId, quest]));
  const keepAwaiting: string[] = [];

  for (const instanceId of awaiting) {
    const quest = questById.get(instanceId);
    if (!quest) {
      keepAwaiting.push(instanceId);
      continue;
    }
    if (quest.state === "pending") {
      keepAwaiting.push(instanceId);
      continue;
    }
    if (quest.state === "approved" && quest.claimedAt === null) {
      turnIns = await rememberApprovedQuestTurnIn(childId, quest);
    }
    // available means rejected; approved+claimed means already collected.
    // Both are terminal for the awaiting-approval marker.
  }

  await saveAwaitingApprovalIds(childId, keepAwaiting);
  return turnIns;
}

export async function claimQuestTurnIn(
  childId: string,
  instanceId: string,
): Promise<PendingQuestTurnIn[]> {
  const current = await loadPendingQuestTurnIns(childId);
  const next = current.filter((item) => item.instanceId !== instanceId);
  await save(childId, next);
  await forgetAwaitingApproval(childId, instanceId);
  return next;
}

export function newlyApprovedQuests(
  previousStates: ReadonlyMap<string, BackendQuest["state"]>,
  nextQuests: BackendQuest[],
): BackendQuest[] {
  return nextQuests.filter(
    (quest) => quest.state === "approved" && quest.claimedAt === null && previousStates.get(quest.instanceId) === "pending",
  );
}
