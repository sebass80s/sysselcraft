import {
  act2FinalePending,
  boathousePurchaseRequired,
  jettyPurchaseRequired,
  motorboatNamingRequired,
  motorboatPartsPurchaseRequired,
  pendingProjectCompletionReaction,
  type Act2RuntimeState,
} from "./act2RuntimeState";

export type Act2RuntimeUiFlags = {
  contributionTurnInOpen: boolean;
  cabinRevisitOpen: boolean;
  historyOpen: boolean;
  historyReplayOpen: boolean;
};

export function deriveAct2RuntimeBlockers(
  state: Act2RuntimeState,
  flags: Act2RuntimeUiFlags,
) {
  const completionProject = pendingProjectCompletionReaction(state);
  const projectChooserVisible =
    state.alveIntroComplete
    && !state.selectedProject
    && !state.projects.motorboat.complete
    && !completionProject;

  const jettyPurchaseGate =
    state.selectedProject === "dock" && jettyPurchaseRequired(state);
  const boathousePurchaseGate =
    state.selectedProject === "boathouse" && boathousePurchaseRequired(state);
  const motorboatPurchaseGate =
    state.selectedProject === "motorboat" && motorboatPartsPurchaseRequired(state);
  const namingRequired =
    state.selectedProject === "motorboat" && motorboatNamingRequired(state);
  const purchaseRequired =
    jettyPurchaseGate || boathousePurchaseGate || motorboatPurchaseGate;
  const finalePending = act2FinalePending(state);

  const storyUiVisible =
    !state.openingComplete
    || (state.openingComplete && !state.bicycleSeen)
    || (state.bicycleSeen && !state.alveIntroComplete)
    || projectChooserVisible
    || finalePending
    || Boolean(completionProject)
    || purchaseRequired
    || namingRequired
    || flags.contributionTurnInOpen
    || flags.cabinRevisitOpen
    || flags.historyOpen
    || flags.historyReplayOpen;

  return {
    completionProject,
    projectChooserVisible,
    jettyPurchaseGate,
    boathousePurchaseGate,
    motorboatPurchaseGate,
    namingRequired,
    purchaseRequired,
    finalePending,
    storyUiVisible,
  };
}
