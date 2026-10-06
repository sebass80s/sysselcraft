import {
  parseStoryPurchaseTarget,
  storyPurchaseResumeHref,
  storyPurchaseShopHref,
} from "../runtime/purchase/storyPurchaseHandoff";

export const ACT2_PURCHASE_PROJECTS = ["dock", "boathouse", "motorboat"] as const;

export type Act2PurchaseProject = (typeof ACT2_PURCHASE_PROJECTS)[number];

export function parseAct2PurchaseProject(value: string | null): Act2PurchaseProject | null {
  return parseStoryPurchaseTarget(value, ACT2_PURCHASE_PROJECTS);
}

export function act2PurchaseShopHref(project: Act2PurchaseProject): string {
  return storyPurchaseShopHref({
    shopChapterId: "act1",
    queryKey: "act2-purchase",
    target: project,
  });
}

export function act2ResumeHref(project: Act2PurchaseProject): string {
  return storyPurchaseResumeHref({
    chapterId: "act2",
    target: project,
  });
}
