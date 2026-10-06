import { chapterRoute } from "../runtime/chapter/chapterRegistry";

export const ACT2_PURCHASE_PROJECTS = ["dock", "boathouse", "motorboat"] as const;

export type Act2PurchaseProject = (typeof ACT2_PURCHASE_PROJECTS)[number];

export function parseAct2PurchaseProject(value: string | null): Act2PurchaseProject | null {
  return ACT2_PURCHASE_PROJECTS.includes(value as Act2PurchaseProject)
    ? value as Act2PurchaseProject
    : null;
}

export function act2PurchaseShopHref(project: Act2PurchaseProject): string {
  return `${chapterRoute("act1")}?act2-purchase=${project}`;
}

export function act2ResumeHref(project: Act2PurchaseProject): string {
  return `${chapterRoute("act2")}?resume=${project}`;
}
