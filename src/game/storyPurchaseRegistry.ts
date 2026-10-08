import { ACT2_PURCHASE_CATALOG } from "./act2PurchaseCatalog";
import {
  ACT2_PURCHASE_PROJECTS,
  act2ResumeHref,
  parseAct2PurchaseProject,
  type Act2PurchaseProject,
} from "./act2PurchaseHandoff";
import {
  applyAct2StoryPurchaseResult,
  deriveAct2StoryPurchaseSnapshot,
} from "./act2StoryPurchaseAdapter";
import {
  loadAct2RuntimeState,
  updateAct2RuntimeState,
} from "./act2RuntimeState";
import { JETTY_LIFEBUOY_BEAT } from "./act2JettyStory";
import { BOATHOUSE_STEERING_WHEEL_BEAT } from "./act2BoathouseStory";
import {
  defineStoryPurchaseRegistration,
  resolveStoryPurchaseRegistration,
  type StoryPurchaseBeat,
  type StoryPurchaseOperationContext,
  type StoryPurchaseRegistration,
} from "../runtime/purchase/storyPurchaseRegistry";

function persistenceGuard(context?: StoryPurchaseOperationContext) {
  return context && "expectedChildId" in context
    ? { expectedChildId: context.expectedChildId }
    : undefined;
}

function purchaseStoryBeat(target: Act2PurchaseProject): StoryPurchaseBeat | null {
  if (target === "dock") return JETTY_LIFEBUOY_BEAT;
  if (target === "boathouse") return BOATHOUSE_STEERING_WHEEL_BEAT;
  return null;
}

export const ACT2_STORY_PURCHASE_REGISTRATION = defineStoryPurchaseRegistration({
  id: "act2",
  queryKey: "act2-purchase",
  targets: ACT2_PURCHASE_PROJECTS,
  catalog: ACT2_PURCHASE_CATALOG,
  parseTarget: parseAct2PurchaseProject,
  loadSnapshot: async (context) => {
    const state = await loadAct2RuntimeState(persistenceGuard(context));
    return deriveAct2StoryPurchaseSnapshot(state);
  },
  applyPurchaseResult: async (target, worldFlags, context) => {
    let message = "";
    const state = await updateAct2RuntimeState((current) => {
      const outcome = applyAct2StoryPurchaseResult(current, target, worldFlags);
      message = outcome.message;
      return outcome.state;
    }, persistenceGuard(context));
    return {
      snapshot: deriveAct2StoryPurchaseSnapshot(state),
      message,
    };
  },
  savePurchaseStoryProgress: async (target, lineIndex, context) => {
    const state = await updateAct2RuntimeState((current) => ({
      ...current,
      pendingPurchaseStory: target === "dock" || target === "boathouse" ? target : null,
      purchaseStoryLineIndex: Math.max(0, lineIndex),
    }), persistenceGuard(context));
    return deriveAct2StoryPurchaseSnapshot(state);
  },
  purchaseStoryBeat,
  resumeHref: act2ResumeHref,
});

export const STORY_PURCHASE_REGISTRATIONS = [
  ACT2_STORY_PURCHASE_REGISTRATION,
] as const;

export function resolveRegisteredStoryPurchase(searchParams: URLSearchParams) {
  return resolveStoryPurchaseRegistration(
    searchParams,
    STORY_PURCHASE_REGISTRATIONS as readonly StoryPurchaseRegistration[],
  );
}

export function storyPurchaseRegistrationById(id: string) {
  return (STORY_PURCHASE_REGISTRATIONS as readonly StoryPurchaseRegistration[])
    .find((registration) => registration.id === id) ?? null;
}

export type LoadedStoryPurchaseRegistration = {
  registration: StoryPurchaseRegistration<string>;
  snapshot: Awaited<ReturnType<StoryPurchaseRegistration<string>["loadSnapshot"]>>;
};

export async function loadRegisteredStoryPurchases(): Promise<LoadedStoryPurchaseRegistration[]> {
  return Promise.all(
    (STORY_PURCHASE_REGISTRATIONS as readonly StoryPurchaseRegistration<string>[]).map(
      async (registration) => ({
        registration,
        snapshot: await registration.loadSnapshot(),
      }),
    ),
  );
}
