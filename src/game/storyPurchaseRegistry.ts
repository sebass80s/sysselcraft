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
  saveAct2RuntimeState,
} from "./act2RuntimeState";
import { JETTY_LIFEBUOY_BEAT } from "./act2JettyStory";
import { BOATHOUSE_STEERING_WHEEL_BEAT } from "./act2BoathouseStory";
import {
  defineStoryPurchaseRegistration,
  resolveStoryPurchaseRegistration,
  type StoryPurchaseBeat,
  type StoryPurchaseRegistration,
} from "../runtime/purchase/storyPurchaseRegistry";

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
  loadSnapshot: async () => {
    const state = await loadAct2RuntimeState();
    return deriveAct2StoryPurchaseSnapshot(state);
  },
  applyPurchaseResult: async (target, worldFlags) => {
    const current = await loadAct2RuntimeState();
    const outcome = applyAct2StoryPurchaseResult(current, target, worldFlags);
    await saveAct2RuntimeState(outcome.state);
    return {
      snapshot: deriveAct2StoryPurchaseSnapshot(outcome.state),
      message: outcome.message,
    };
  },
  savePurchaseStoryProgress: async (target, lineIndex) => {
    const current = await loadAct2RuntimeState();
    const next = {
      ...current,
      pendingPurchaseStory: target === "dock" || target === "boathouse" ? target : null,
      purchaseStoryLineIndex: Math.max(0, lineIndex),
    };
    await saveAct2RuntimeState(next);
    return deriveAct2StoryPurchaseSnapshot(next);
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
