"use client";

import { getSupabaseBrowserClient } from "./supabaseClient";

export const BOTTLE_MESSAGE_PRICE = 100;

export type StoryItemPurchase = {
  childId: string;
  sysselBux: number;
  alreadyOwned: boolean;
  worldFlags: Record<string, unknown>;
};

export async function purchaseBottleMessage(): Promise<StoryItemPurchase> {
  const { data, error } = await getSupabaseBrowserClient().rpc("purchase_story_item", {
    p_item_key: "bottle_message",
  });
  if (error) throw error;
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Ogiltigt svar från storyköpet.");
  const row = data as Record<string, unknown>;
  return {
    childId: typeof row.child_id === "string" ? row.child_id : "",
    sysselBux: typeof row.syssel_bux === "number" ? Math.max(0, row.syssel_bux) : 0,
    alreadyOwned: row.already_owned === true,
    worldFlags: row.world_flags && typeof row.world_flags === "object" && !Array.isArray(row.world_flags) ? row.world_flags as Record<string, unknown> : {},
  };
}


export async function commitStoryBeat(beat: "bottle_message_sent" | "sol_arrival_seen" | "sol_tour_bakery_seen" | "sol_tour_shop_seen" | "sol_tour_linus_seen" | "sol_chose_to_stay"): Promise<Record<string, unknown>> {
  const { data, error } = await getSupabaseBrowserClient().rpc("commit_story_beat", { p_beat_key: beat });
  if (error) throw error;
  return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : {};
}
