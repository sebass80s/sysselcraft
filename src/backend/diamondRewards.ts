import { getSupabaseBrowserClient } from "./supabaseClient";

export type DiamondRewardDefinition = {
  id: string; householdId: string; title: string; description: string; diamondPrice: number; active: boolean;
};
export type DiamondRewardRedemption = {
  id: string; childId: string; title: string; description: string; diamondPrice: number;
  status: "pending_delivery" | "delivered" | "refunded"; purchasedAt: string;
};

export async function listDiamondRewards(householdId: string) {
  const { data, error } = await getSupabaseBrowserClient().from("diamond_reward_definitions" as never)
    .select("id,household_id,title,description,diamond_price,active,archived_at" as never)
    .eq("household_id" as never, householdId as never).is("archived_at" as never, null as never).order("created_at" as never);
  if (error) throw error;
  return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => ({
    id:String(r.id), householdId:String(r.household_id), title:String(r.title), description:String(r.description ?? ""),
    diamondPrice:Number(r.diamond_price), active:Boolean(r.active),
  })) satisfies DiamondRewardDefinition[];
}
export async function createDiamondReward(householdId:string,title:string,description:string,diamondPrice:number) {
 const {error}=await getSupabaseBrowserClient().rpc("create_diamond_reward" as never,{p_household_id:householdId,p_title:title,p_description:description,p_diamond_price:diamondPrice} as never); if(error) throw error;
}
export async function updateDiamondReward(id:string,title:string,description:string,diamondPrice:number,active:boolean) {
 const {error}=await getSupabaseBrowserClient().rpc("update_diamond_reward" as never,{p_reward_id:id,p_title:title,p_description:description,p_diamond_price:diamondPrice,p_active:active} as never); if(error) throw error;
}
export async function archiveDiamondReward(id:string) {
 const {error}=await getSupabaseBrowserClient().rpc("archive_diamond_reward" as never,{p_reward_id:id} as never); if(error) throw error;
}
export async function listDiamondRedemptions(householdId:string) {
 const {data,error}=await getSupabaseBrowserClient().from("diamond_reward_redemptions" as never)
  .select("id,child_id,reward_title_snapshot,reward_description_snapshot,diamond_price_snapshot,status,purchased_at" as never)
  .eq("household_id" as never,householdId as never).order("purchased_at" as never,{ascending:false});
 if(error) throw error;
 return ((data??[]) as unknown as Array<Record<string,unknown>>).map(r=>({id:String(r.id),childId:String(r.child_id),title:String(r.reward_title_snapshot),description:String(r.reward_description_snapshot??""),diamondPrice:Number(r.diamond_price_snapshot),status:r.status as DiamondRewardRedemption["status"],purchasedAt:String(r.purchased_at)}));
}
export async function markDiamondRewardDelivered(id:string){const {error}=await getSupabaseBrowserClient().rpc("mark_diamond_reward_delivered" as never,{p_redemption_id:id} as never);if(error)throw error;}
export async function refundDiamondReward(id:string){const {error}=await getSupabaseBrowserClient().rpc("refund_diamond_reward" as never,{p_redemption_id:id} as never);if(error)throw error;}
export async function purchaseDiamondReward(id:string){const {error}=await getSupabaseBrowserClient().rpc("purchase_diamond_reward" as never,{p_reward_definition_id:id} as never);if(error)throw error;}
