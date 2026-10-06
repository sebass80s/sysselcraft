import { chapterRoute, type ChapterId } from "../chapter/chapterRegistry";

export function parseStoryPurchaseTarget<TTarget extends string>(
  value: string | null,
  allowedTargets: readonly TTarget[],
): TTarget | null {
  return allowedTargets.includes(value as TTarget)
    ? value as TTarget
    : null;
}

export function storyPurchaseShopHref<TTarget extends string>(input: {
  shopChapterId: ChapterId;
  queryKey: string;
  target: TTarget;
}) {
  return `${chapterRoute(input.shopChapterId)}?${encodeURIComponent(input.queryKey)}=${encodeURIComponent(input.target)}`;
}

export function storyPurchaseResumeHref<TTarget extends string>(input: {
  chapterId: ChapterId;
  queryKey?: string;
  target: TTarget;
}) {
  const queryKey = input.queryKey ?? "resume";
  return `${chapterRoute(input.chapterId)}?${encodeURIComponent(queryKey)}=${encodeURIComponent(input.target)}`;
}
