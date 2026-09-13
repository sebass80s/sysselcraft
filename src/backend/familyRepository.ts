import type { ParentQuestDraft } from "@/game/parentMode";
import { normalizeParentQuestDraft } from "@/game/parentMode";
import { getSupabaseBrowserClient } from "./supabaseClient";
import {
  PROGRESSION_CLASSES,
  createEmptyBackendProgression,
  isProgressionClass,
  isQuestLifecycleState,
  type BackendChild,
  type BackendChildGameState,
  type BackendHousehold,
  type BackendQuest,
} from "./types";

type RpcIdRow = { id: string };
type RpcQuestRow = {
  instance_id: string;
  quest_id: string;
  household_id: string;
  child_id: string;
  title: string;
  description: string;
  progression_class: unknown;
  reward_diamonds: number;
  reward_syssel_bux: number;
  state: unknown;
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
};

function firstRpcId(data: unknown, operation: string): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data.length > 0) {
    const row = data[0] as Partial<RpcIdRow>;
    if (typeof row.id === "string") return row.id;
  }
  throw new Error(`${operation} did not return an id.`);
}

function finiteNonNegative(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function normalizeProgression(value: unknown): BackendChildGameState["progression"] {
  const normalized = createEmptyBackendProgression();
  if (!value || typeof value !== "object" || Array.isArray(value)) return normalized;
  const record = value as Record<string, unknown>;
  for (const key of PROGRESSION_CLASSES) {
    normalized[key] = finiteNonNegative(record[key]);
  }
  return normalized;
}

function normalizeWorldFlags(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

function mapQuest(row: RpcQuestRow): BackendQuest {
  if (!isProgressionClass(row.progression_class)) {
    throw new Error(`Backend returned an invalid progression class for quest ${row.instance_id}.`);
  }
  if (!isQuestLifecycleState(row.state)) {
    throw new Error(`Backend returned an invalid quest state for quest ${row.instance_id}.`);
  }

  return {
    instanceId: row.instance_id,
    questId: row.quest_id,
    householdId: row.household_id,
    childId: row.child_id,
    title: row.title,
    description: row.description,
    progressionClass: row.progression_class,
    reward: {
      diamonds: finiteNonNegative(row.reward_diamonds),
      sysselBux: finiteNonNegative(row.reward_syssel_bux),
    },
    state: row.state,
    createdAt: row.created_at,
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at,
  };
}

export async function createHousehold(name: string): Promise<string> {
  const { data, error } = await getSupabaseBrowserClient().rpc("create_household", {
    p_name: name.trim().slice(0, 60),
  });
  if (error) throw error;
  return firstRpcId(data, "create_household");
}

export async function createChild(householdId: string, displayName: string): Promise<string> {
  const { data, error } = await getSupabaseBrowserClient().rpc("create_child", {
    p_household_id: householdId,
    p_display_name: displayName.trim().slice(0, 40),
  });
  if (error) throw error;
  return firstRpcId(data, "create_child");
}

export async function listHouseholds(): Promise<BackendHousehold[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("households")
    .select("id,name")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, name: row.name }));
}

export async function listChildren(householdId: string): Promise<BackendChild[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("children")
    .select("id,household_id,display_name,dog_name")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    householdId: row.household_id,
    displayName: row.display_name,
    dogName: row.dog_name,
  }));
}

export async function createParentQuest(
  householdId: string,
  childId: string,
  draft: ParentQuestDraft,
): Promise<string> {
  const quest = normalizeParentQuestDraft(draft);
  const { data, error } = await getSupabaseBrowserClient().rpc("create_parent_quest", {
    p_household_id: householdId,
    p_child_id: childId,
    p_title: quest.title,
    p_description: quest.description,
    p_progression_class: quest.progressionClass,
    p_reward_diamonds: quest.reward.diamonds,
    p_reward_syssel_bux: quest.reward.sysselBux,
  });
  if (error) throw error;
  return firstRpcId(data, "create_parent_quest");
}

export async function listChildQuests(childId: string): Promise<BackendQuest[]> {
  const { data, error } = await getSupabaseBrowserClient().rpc("list_child_quests", {
    p_child_id: childId,
  });
  if (error) throw error;
  return ((data ?? []) as RpcQuestRow[]).map(mapQuest);
}

export async function submitQuest(instanceId: string): Promise<void> {
  const { error } = await getSupabaseBrowserClient().rpc("submit_quest", {
    p_instance_id: instanceId,
  });
  if (error) throw error;
}

export async function reviewQuest(instanceId: string, approve: boolean): Promise<void> {
  const { error } = await getSupabaseBrowserClient().rpc("review_quest", {
    p_instance_id: instanceId,
    p_approve: approve,
  });
  if (error) throw error;
}

export async function createChildPairingCode(childId: string): Promise<string> {
  const { data, error } = await getSupabaseBrowserClient().rpc("create_child_pairing_code", {
    p_child_id: childId,
  });
  if (error) throw error;
  if (typeof data !== "string") throw new Error("Pairing code was not returned.");
  return data;
}

export async function redeemChildPairingCode(code: string): Promise<string> {
  const { data, error } = await getSupabaseBrowserClient().rpc("redeem_child_pairing_code", {
    p_code: code.trim().toLowerCase(),
  });
  if (error) throw error;
  return firstRpcId(data, "redeem_child_pairing_code");
}

export async function getChildGameState(childId: string): Promise<BackendChildGameState | null> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("child_game_state")
    .select("child_id,diamonds,syssel_bux,progression,world_flags,updated_at")
    .eq("child_id", childId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    childId: data.child_id,
    diamonds: finiteNonNegative(data.diamonds),
    sysselBux: finiteNonNegative(data.syssel_bux),
    progression: normalizeProgression(data.progression),
    worldFlags: normalizeWorldFlags(data.world_flags),
    updatedAt: data.updated_at,
  };
}
