import { getSupabaseBrowserClient } from "./supabaseClient";

export type DiamondRewardDefinition = {
  id: string; householdId: string; title: string; description: string; diamondPrice: number; active: boolean;
};
export type DiamondRewardRedemption = {
  id: string; childId: string; title: string; description: string; diamondPrice: number;
  status: "pending_delivery" | "delivered" | "refunded"; purchasedAt: string;
};

export async function listDiamondRewards(householdId: string) {
  const { data, error } = await getSupabaseBrowserClient().from("diamond_reward_definitions")
    .select("id,household_id,title,description,diamond_price,active,archived_at")
    .eq("household_id", householdId).is("archived_at", null).order("created_at");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id, householdId: r.household_id, title: r.title, description: r.description,
    diamondPrice: r.diamond_price, active: r.active,
  })) satisfies DiamondRewardDefinition[];
}
export async function createDiamondReward(householdId:string,title:string,description:string,diamondPrice:number) {
 const {error}=await getSupabaseBrowserClient().rpc("create_diamond_reward",{p_household_id:householdId,p_title:title,p_description:description,p_diamond_price:diamondPrice}); if(error) throw error;
}
export async function updateDiamondReward(id:string,title:string,description:string,diamondPrice:number,active:boolean) {
 const {error}=await getSupabaseBrowserClient().rpc("update_diamond_reward",{p_reward_id:id,p_title:title,p_description:description,p_diamond_price:diamondPrice,p_active:active}); if(error) throw error;
}
export async function archiveDiamondReward(id:string) {
 const {error}=await getSupabaseBrowserClient().rpc("archive_diamond_reward",{p_reward_id:id}); if(error) throw error;
}
export async function listDiamondRedemptions(householdId:string) {
 const {data,error}=await getSupabaseBrowserClient().from("diamond_reward_redemptions")
  .select("id,child_id,reward_title_snapshot,reward_description_snapshot,diamond_price_snapshot,status,purchased_at")
  .eq("household_id",householdId).order("purchased_at",{ascending:false});
 if(error) throw error;
 return (data??[]).map(r=>({id:r.id,childId:r.child_id,title:r.reward_title_snapshot,description:r.reward_description_snapshot,diamondPrice:r.diamond_price_snapshot,status:r.status as DiamondRewardRedemption["status"],purchasedAt:r.purchased_at}));
}
export async function markDiamondRewardDelivered(id:string){const {error}=await getSupabaseBrowserClient().rpc("mark_diamond_reward_delivered",{p_redemption_id:id});if(error)throw error;}
export async function refundDiamondReward(id:string){const {error}=await getSupabaseBrowserClient().rpc("refund_diamond_reward",{p_redemption_id:id});if(error)throw error;}
export async function listPendingDiamondRewardIds(childId:string){\n const {data,error}=await getSupabaseBrowserClient().from("diamond_reward_redemptions")\n  .select("reward_definition_id").eq("child_id",childId).eq("status","pending_delivery");\n if(error) throw error;\n return new Set((data??[]).map(r=>r.reward_definition_id).filter((id): id is string => Boolean(id)));\n}\nexport async function purchaseDiamondReward(id:string){const {data,error}=await getSupabaseBrowserClient().rpc("purchase_diamond_reward",{p_reward_definition_id:id});if(error)throw error;return data;}
