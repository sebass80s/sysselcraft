import type {
  StoryPurchaseDefinition,
} from "./storyPurchaseFlow";

export type StoryPurchaseStatus = {
  owned: boolean;
  needed: boolean;
};

export type StoryPurchaseSnapshot<TTarget extends string> = {
  status: Record<TTarget, StoryPurchaseStatus>;
  purchaseStory: TTarget | null;
  purchaseStoryLineIndex: number;
};

export type StoryPurchaseOperationContext = {
  expectedChildId?: string | null;
};

export type StoryPurchaseBeat = {
  image?: string;
  title: string;
  body: readonly string[];
};

export type StoryPurchaseApplyResult<TTarget extends string> = {
  snapshot: StoryPurchaseSnapshot<TTarget>;
  message: string;
};

export type StoryPurchaseRegistration<TTarget extends string = string> = {
  id: string;
  queryKey: string;
  targets: readonly TTarget[];
  catalog: Record<TTarget, StoryPurchaseDefinition<TTarget>>;
  parseTarget: (value: string | null) => TTarget | null;
  loadSnapshot: (
    context?: StoryPurchaseOperationContext,
  ) => Promise<StoryPurchaseSnapshot<TTarget>>;
  applyPurchaseResult: (
    target: TTarget,
    worldFlags: Record<string, unknown>,
    context?: StoryPurchaseOperationContext,
  ) => Promise<StoryPurchaseApplyResult<TTarget>>;
  savePurchaseStoryProgress: (
    target: TTarget | null,
    lineIndex: number,
    context?: StoryPurchaseOperationContext,
  ) => Promise<StoryPurchaseSnapshot<TTarget>>;
  purchaseStoryBeat: (target: TTarget) => StoryPurchaseBeat | null;
  resumeHref: (target: TTarget) => string;
};

export function defineStoryPurchaseRegistration<TTarget extends string>(
  registration: StoryPurchaseRegistration<TTarget>,
) {
  return registration;
}

export function resolveStoryPurchaseRegistration(
  searchParams: URLSearchParams,
  registrations: readonly StoryPurchaseRegistration[],
) {
  for (const registration of registrations) {
    const target = registration.parseTarget(searchParams.get(registration.queryKey));
    if (target) return { registration, target };
  }
  return null;
}
