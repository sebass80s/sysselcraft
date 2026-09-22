import { Preferences } from "@capacitor/preferences";
import type { BackendQuest } from "@/backend/types";

const KEY_PREFIX = "sysselcraft.quest-turn-ins.v1";

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

export async function claimQuestTurnIn(
  childId: string,
  instanceId: string,
): Promise<PendingQuestTurnIn[]> {
  const current = await loadPendingQuestTurnIns(childId);
  const next = current.filter((item) => item.instanceId !== instanceId);
  await save(childId, next);
  return next;
}

export function newlyApprovedQuests(
  previousStates: ReadonlyMap<string, BackendQuest["state"]>,
  nextQuests: BackendQuest[],
): BackendQuest[] {
  return nextQuests.filter(
    (quest) => quest.state === "approved" && previousStates.get(quest.instanceId) === "pending",
  );
}
