"use client";

import { getSupabaseBrowserClient } from "./supabaseClient";

export const BOTTLE_MESSAGE_PRICE = 100;
export const FOOTBALL_RUG_PRICE = 30;
export const ROOM_DECOR_PRICES = { footballPoster: 20, computerDesk: 80, trophyShelf: 35, stringLights: 25, aquarium: 60 } as const;
export type RoomDecorKey = keyof typeof ROOM_DECOR_PRICES;
export const DOG_HOME_PRICES = [40, 25, 30, 35] as const;
export const ACT2_JETTY_LIFEBUOY_PRICE = 300;
export type DogHomeUpgradeIndex = 0 | 1 | 2 | 3;

export type StoryItemPurchase = {
  childId: string;
  sysselBux: number;
  alreadyOwned: boolean;
  worldFlags: Record<string, unknown>;
};

async function purchaseStoryItem(itemKey: "bottle_message" | "room_football_rug" | "room_football_poster" | "room_computer_desk" | "room_trophy_shelf" | "room_string_lights" | "room_aquarium" | "dog_home_bed" | "dog_home_bowls" | "dog_home_toys" | "dog_home_cozy" | "act2_jetty_lifebuoy"): Promise<StoryItemPurchase> {
  const { data, error } = await getSupabaseBrowserClient().rpc("purchase_story_item", {
    p_item_key: itemKey,
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

export async function purchaseBottleMessage(): Promise<StoryItemPurchase> {
  return purchaseStoryItem("bottle_message");
}

export async function purchaseFootballRug(): Promise<StoryItemPurchase> {
  return purchaseStoryItem("room_football_rug");
}

const ROOM_DECOR_ITEM_KEYS: Record<RoomDecorKey, "room_football_poster" | "room_computer_desk" | "room_trophy_shelf" | "room_string_lights" | "room_aquarium"> = {
  footballPoster: "room_football_poster", computerDesk: "room_computer_desk", trophyShelf: "room_trophy_shelf", stringLights: "room_string_lights", aquarium: "room_aquarium",
};
export async function purchaseRoomDecor(key: RoomDecorKey): Promise<StoryItemPurchase> {
  return purchaseStoryItem(ROOM_DECOR_ITEM_KEYS[key]);
}

export async function commitStoryBeat(beat: "bottle_message_sent" | "sol_arrival_seen" | "sol_tour_bakery_seen" | "sol_tour_shop_seen" | "sol_tour_linus_seen" | "sol_chose_to_stay"): Promise<Record<string, unknown>> {
  const { data, error } = await getSupabaseBrowserClient().rpc("commit_story_beat", { p_beat_key: beat });
  if (error) throw error;
  return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : {};
}

const DOG_HOME_ITEM_KEYS = ["dog_home_bed", "dog_home_bowls", "dog_home_toys", "dog_home_cozy"] as const;
export async function purchaseDogHomeUpgrade(index: DogHomeUpgradeIndex): Promise<StoryItemPurchase> {
  return purchaseStoryItem(DOG_HOME_ITEM_KEYS[index]);
}


export async function purchaseAct2JettyLifebuoy(): Promise<StoryItemPurchase> {
  return purchaseStoryItem("act2_jetty_lifebuoy");
}
