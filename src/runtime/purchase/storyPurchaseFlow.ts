export type StoryPurchaseExit<TTarget> =
  | { action: "resume"; target: TTarget }
  | { action: "stay" };

export function purchaseShortfall(balance: number, price: number) {
  const safeBalance = Number.isFinite(balance) ? Math.max(0, Math.floor(balance)) : 0;
  const safePrice = Number.isFinite(price) ? Math.max(0, Math.floor(price)) : 0;
  return Math.max(0, safePrice - safeBalance);
}

export function resolveStoryPurchaseExit<TTarget>(
  target: TTarget,
  requiredItemOwned: boolean,
): StoryPurchaseExit<TTarget> {
  return requiredItemOwned
    ? { action: "resume", target }
    : { action: "stay" };
}


export type StoryPurchaseCurrency = "sysselbux" | "diamonds";

export type StoryPurchasePresentation = {
  gate: {
    title: string;
    text: string;
    detail: string;
  };
  shop: {
    icon: string;
    title: string;
    description: string;
    requirement: string;
  };
};

export type StoryPurchaseDefinition<TTarget, TId extends string = string> = {
  id: TId;
  target: TTarget;
  currency: StoryPurchaseCurrency;
  price: number;
  presentation: StoryPurchasePresentation;
};

export function defineStoryPurchase<TTarget, TId extends string>(
  definition: StoryPurchaseDefinition<TTarget, TId>,
) {
  return definition;
}
