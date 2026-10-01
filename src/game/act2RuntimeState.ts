import { Preferences } from "@capacitor/preferences";

export type Act2Project = "cabin" | "dock" | "boathouse" | "motorboat";
export type Act2PrerequisiteProject = Exclude<Act2Project, "motorboat">;

export type Act2ProjectState = {
  contributions: number;
  visibleStage: 0 | 1 | 2 | 3 | 4;
  consumedBeatIds: string[];
  complete: boolean;
};

export type Act2RuntimeState = {
  version: 1;
  entered: boolean;
  openingIndex: number;
  openingLineIndex: number;
  openingComplete: boolean;
  bicycleSeen: boolean;
  alveIntroIndex: number;
  alveIntroComplete: boolean;
  selectedProject: Act2Project | null;
  backendClaimBaseline: number | null;
  jettyLifebuoyOwned: boolean;
  boathouseSteeringWheelOwned: boolean;
  motorboatPartsOwned: boolean;
  motorboatName: string | null;
  consumedProjectCompletionIds: string[];
  projects: Record<Act2Project, Act2ProjectState>;
  contributionLineIndex: number;
  completionLineIndex: number;
  finaleLineIndex: number;
  finaleIndex: number;
  familyFinaleConsumed: boolean;
  epilogueConsumed: boolean;
  act2Complete: boolean;
};

const KEY = "sysselcraft.act2.runtime.v1";
const PROJECTS: Act2Project[] = ["cabin", "dock", "boathouse", "motorboat"];

function emptyProject(): Act2ProjectState {
  return { contributions: 0, visibleStage: 0, consumedBeatIds: [], complete: false };
}

export function createDefaultAct2RuntimeState(): Act2RuntimeState {
  return {
    version: 1,
    entered: false,
    openingIndex: 0,
    openingLineIndex: 0,
    openingComplete: false,
    bicycleSeen: false,
    alveIntroIndex: 0,
    alveIntroComplete: false,
    selectedProject: null,
    backendClaimBaseline: null,
    jettyLifebuoyOwned: false,
    boathouseSteeringWheelOwned: false,
    motorboatPartsOwned: false,
    motorboatName: null,
    consumedProjectCompletionIds: [],
    contributionLineIndex: 0,
    completionLineIndex: 0,
    finaleLineIndex: 0,
    projects: {
      cabin: emptyProject(),
      dock: emptyProject(),
      boathouse: emptyProject(),
      motorboat: emptyProject(),
    },
    finaleIndex: 0,
    familyFinaleConsumed: false,
    epilogueConsumed: false,
    act2Complete: false,
  };
}

function normalizeBeatIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && id.length > 0))];
}

function visibleStageForContributions(contributions: number): 0 | 1 | 2 | 3 | 4 {
  if (contributions <= 0) return 0;
  return Math.min(4, 1 + Math.floor(contributions / 4)) as 1 | 2 | 3 | 4;
}

function canonicalConsumedBeatIds(project: Act2Project, contributions: number) {
  return Array.from(
    { length: contributions },
    (_, index) => `${project}:${String(index + 1).padStart(2, "0")}`,
  );
}

function normalizeProject(value: unknown, project: Act2Project): Act2ProjectState {
  const candidate = value && typeof value === "object" ? value as Partial<Act2ProjectState> : {};
  const contributions = Number.isInteger(candidate.contributions)
    ? Math.max(0, Math.min(16, candidate.contributions as number))
    : 0;
  return {
    contributions,
    visibleStage: visibleStageForContributions(contributions),
    consumedBeatIds: canonicalConsumedBeatIds(project, contributions),
    complete: contributions >= 16,
  };
}

export function prerequisiteCompletionCount(state: Act2RuntimeState) {
  return (["cabin", "dock", "boathouse"] as Act2PrerequisiteProject[])
    .filter((project) => state.projects[project].complete).length;
}

export function isMotorboatUnlocked(state: Act2RuntimeState) {
  return prerequisiteCompletionCount(state) === 3;
}

export function canSelectProject(state: Act2RuntimeState, project: Act2Project) {
  if (state.projects[project].complete) return false;
  if (project === "motorboat") return isMotorboatUnlocked(state);
  return true;
}

export function normalizeAct2RuntimeState(value: unknown): Act2RuntimeState {
  const defaults = createDefaultAct2RuntimeState();
  if (!value || typeof value !== "object") return defaults;
  const candidate = value as Partial<Act2RuntimeState> & {
    selectedProject?: unknown;
    projects?: Partial<Record<Act2Project, unknown>>;
  };

  const projects = {
    cabin: normalizeProject(candidate.projects?.cabin, "cabin"),
    dock: normalizeProject(candidate.projects?.dock, "dock"),
    boathouse: normalizeProject(candidate.projects?.boathouse, "boathouse"),
    motorboat: normalizeProject(candidate.projects?.motorboat, "motorboat"),
  };

  const selected = PROJECTS.includes(candidate.selectedProject as Act2Project)
    ? candidate.selectedProject as Act2Project
    : null;

  const normalized: Act2RuntimeState = {
    version: 1,
    entered: candidate.entered === true,
    openingIndex: Number.isInteger(candidate.openingIndex)
      ? Math.max(0, Math.min(4, candidate.openingIndex as number))
      : 0,
    openingComplete: candidate.openingComplete === true,
    bicycleSeen: candidate.bicycleSeen === true,
    alveIntroIndex: Number.isInteger(candidate.alveIntroIndex)
      ? Math.max(0, candidate.alveIntroIndex as number)
      : 0,
    alveIntroComplete: candidate.alveIntroComplete === true,
    selectedProject: selected,
    backendClaimBaseline: typeof candidate.backendClaimBaseline === "number" && Number.isInteger(candidate.backendClaimBaseline) && candidate.backendClaimBaseline >= 0
      ? candidate.backendClaimBaseline
      : null,
    jettyLifebuoyOwned: candidate.jettyLifebuoyOwned === true,
    boathouseSteeringWheelOwned: candidate.boathouseSteeringWheelOwned === true,
    motorboatPartsOwned: candidate.motorboatPartsOwned === true,
    motorboatName: typeof candidate.motorboatName === "string" && candidate.motorboatName.trim().length > 0
      ? candidate.motorboatName.trim().slice(0, 24)
      : null,
    consumedProjectCompletionIds: normalizeBeatIds(candidate.consumedProjectCompletionIds),
    projects,
    contributionLineIndex: Number.isInteger(candidate.contributionLineIndex)
      ? Math.max(0, Math.min(200, candidate.contributionLineIndex as number))
      : 0,
    completionLineIndex: Number.isInteger(candidate.completionLineIndex)
      ? Math.max(0, Math.min(200, candidate.completionLineIndex as number))
      : 0,
    finaleLineIndex: Number.isInteger(candidate.finaleLineIndex)
      ? Math.max(0, Math.min(200, candidate.finaleLineIndex as number))
      : 0,
    finaleIndex: Number.isInteger(candidate.finaleIndex)
      ? Math.max(0, Math.min(5, candidate.finaleIndex as number))
      : 0,
    familyFinaleConsumed: candidate.familyFinaleConsumed === true,
    epilogueConsumed: candidate.epilogueConsumed === true,
    act2Complete: candidate.act2Complete === true,
  };

  if (normalized.projects.motorboat.contributions > 0 && !isMotorboatUnlocked(normalized)) {
    normalized.projects.motorboat = emptyProject();
    normalized.motorboatName = null;
    normalized.motorboatPartsOwned = false;
  }

  if (normalized.selectedProject && !canSelectProject(normalized, normalized.selectedProject)) {
    normalized.selectedProject = null;
  }

  const validCompletionIds = new Set<string>();
  if (normalized.projects.cabin.complete) validCompletionIds.add(projectCompletionReactionId("cabin"));
  if (normalized.projects.dock.complete) validCompletionIds.add(projectCompletionReactionId("dock"));
  normalized.consumedProjectCompletionIds = normalized.consumedProjectCompletionIds
    .filter((id) => validCompletionIds.has(id));

  if (!normalized.selectedProject) normalized.contributionLineIndex = 0;

  const pendingCompletionProject = (["cabin", "dock"] as const)
    .find((project) => normalized.projects[project].complete
      && !normalized.consumedProjectCompletionIds.includes(projectCompletionReactionId(project)));
  if (!pendingCompletionProject) normalized.completionLineIndex = 0;

  if (!normalized.projects.motorboat.complete) {
    normalized.finaleIndex = 0;
    normalized.finaleLineIndex = 0;
    normalized.familyFinaleConsumed = false;
    normalized.epilogueConsumed = false;
  } else {
    if (normalized.finaleIndex === 5 && !normalized.familyFinaleConsumed) {
      normalized.finaleIndex = 4;
      normalized.finaleLineIndex = 0;
    }
    if (normalized.familyFinaleConsumed && normalized.finaleIndex < 5) {
      normalized.finaleIndex = 5;
      normalized.finaleLineIndex = 0;
    }
    if (normalized.epilogueConsumed && !normalized.familyFinaleConsumed) {
      normalized.epilogueConsumed = false;
    }
  }

  normalized.act2Complete = normalized.epilogueConsumed;

  return normalized;
}

export function totalAct2Contributions(state: Act2RuntimeState) {
  return PROJECTS.reduce((sum, project) => sum + state.projects[project].contributions, 0);
}

export function withBackendClaimBaseline(state: Act2RuntimeState, worldProgression: number): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (normalized.backendClaimBaseline !== null) return normalized;
  const baseline = Number.isFinite(worldProgression) ? Math.max(0, Math.floor(worldProgression)) : 0;
  return { ...normalized, backendClaimBaseline: baseline };
}

export function pendingBackendContributionCount(state: Act2RuntimeState, worldProgression: number) {
  const normalized = normalizeAct2RuntimeState(state);
  if (normalized.backendClaimBaseline === null) return 0;
  const authoritative = Number.isFinite(worldProgression) ? Math.max(0, Math.floor(worldProgression)) : 0;
  return Math.max(0, authoritative - normalized.backendClaimBaseline - totalAct2Contributions(normalized));
}

export type Act2ContributionCandidate = {
  project: Act2Project;
  number: number;
  beatId: string;
  visibleStage: 1 | 2 | 3 | 4;
  backlog: number;
};

export function nextAct2Contribution(
  state: Act2RuntimeState,
  worldProgression: number,
): Act2ContributionCandidate | null {
  const normalized = normalizeAct2RuntimeState(state);
  const project = normalized.selectedProject;
  if (!project || !canSelectProject(normalized, project)) return null;
  if (act2ContributionBlockedByStoryGate(normalized, project)) return null;
  const backlog = pendingBackendContributionCount(normalized, worldProgression);
  if (backlog < 1) return null;
  const number = normalized.projects[project].contributions + 1;
  if (number > 16) return null;
  return {
    project,
    number,
    beatId: `${project}:${String(number).padStart(2, "0")}`,
    visibleStage: Math.min(4, 1 + Math.floor(number / 4)) as 1 | 2 | 3 | 4,
    backlog,
  };
}

export function withBackendStoryFlags(
  state: Act2RuntimeState,
  worldFlags: Record<string, unknown>,
): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  return {
    ...normalized,
    jettyLifebuoyOwned: worldFlags.act2JettyLifebuoyOwned === true,
    boathouseSteeringWheelOwned: worldFlags.act2BoathouseSteeringWheelOwned === true,
    motorboatPartsOwned: worldFlags.act2MotorboatPartsOwned === true,
  };
}

export function jettyPurchaseRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.dock.contributions >= 6
    && normalized.projects.dock.contributions < 16
    && !normalized.jettyLifebuoyOwned;
}

export function boathousePurchaseRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.boathouse.contributions >= 9
    && normalized.projects.boathouse.contributions < 16
    && !normalized.boathouseSteeringWheelOwned;
}

export function motorboatPartsPurchaseRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.motorboat.contributions >= 5
    && normalized.projects.motorboat.contributions < 16
    && !normalized.motorboatPartsOwned;
}

export function motorboatNamingRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.motorboat.contributions >= 12
    && normalized.projects.motorboat.contributions < 16
    && normalized.motorboatName === null;
}

export function act2ContributionBlockedByStoryGate(state: Act2RuntimeState, project: Act2Project) {
  if (project === "dock") return jettyPurchaseRequired(state);
  if (project === "boathouse") return boathousePurchaseRequired(state);
  if (project === "motorboat") {
    return motorboatPartsPurchaseRequired(state) || motorboatNamingRequired(state);
  }
  return false;
}

export function withMotorboatName(state: Act2RuntimeState, name: string): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  const nextName = name.trim().slice(0, 24);
  if (!nextName || normalized.projects.motorboat.contributions < 12) return normalized;
  return { ...normalized, motorboatName: nextName };
}

export function projectCompletionReactionId(project: Act2Project) {
  return `${project}:completion-reaction`;
}

const PROJECTS_WITH_COMPLETION_REACTIONS: readonly Act2Project[] = ["cabin", "dock"];

export function projectCompletionReactionPending(state: Act2RuntimeState, project: Act2Project) {
  const normalized = normalizeAct2RuntimeState(state);
  if (!PROJECTS_WITH_COMPLETION_REACTIONS.includes(project)) return false;
  const id = projectCompletionReactionId(project);
  return normalized.projects[project].complete
    && !normalized.consumedProjectCompletionIds.includes(id);
}

export function consumeProjectCompletionReaction(
  state: Act2RuntimeState,
  project: Act2Project,
): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (!projectCompletionReactionPending(normalized, project)) return normalized;
  const id = projectCompletionReactionId(project);
  return {
    ...normalized,
    consumedProjectCompletionIds: [...normalized.consumedProjectCompletionIds, id],
    completionLineIndex: 0,
  };
}

export function act2FinalePending(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.motorboat.complete && !normalized.epilogueConsumed;
}

export function advanceAct2Finale(state: Act2RuntimeState): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (!act2FinalePending(normalized)) return normalized;
  if (normalized.finaleIndex < 4) {
    return { ...normalized, finaleIndex: normalized.finaleIndex + 1, finaleLineIndex: 0 };
  }
  if (normalized.finaleIndex === 4) {
    return { ...normalized, finaleIndex: 5, finaleLineIndex: 0, familyFinaleConsumed: true };
  }
  return normalizeAct2RuntimeState({
    ...normalized,
    familyFinaleConsumed: true,
    finaleLineIndex: 0,
    epilogueConsumed: true,
    act2Complete: true,
  });
}

export function withSelectedProject(state: Act2RuntimeState, project: Act2Project): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (normalized.selectedProject && normalized.selectedProject !== project) return normalized;
  if (!canSelectProject(normalized, project)) return normalized;
  return { ...normalized, selectedProject: project };
}

export function withPresentedContribution(
  state: Act2RuntimeState,
  project: Act2Project,
  beatId: string,
  visibleStage: 0 | 1 | 2 | 3 | 4,
): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (!beatId || normalized.projects[project].complete) return normalized;
  if (normalized.selectedProject !== project) return normalized;
  if (project === "motorboat" && !isMotorboatUnlocked(normalized)) return normalized;
  if (act2ContributionBlockedByStoryGate(normalized, project)) return normalized;
  const current = normalized.projects[project];
  if (current.consumedBeatIds.includes(beatId)) return normalized;

  const contributions = Math.min(16, current.contributions + 1);
  const nextProject: Act2ProjectState = {
    contributions,
    visibleStage: Math.max(current.visibleStage, visibleStage) as 0 | 1 | 2 | 3 | 4,
    consumedBeatIds: [...current.consumedBeatIds, beatId],
    complete: contributions >= 16,
  };

  return normalizeAct2RuntimeState({
    ...normalized,
    selectedProject: nextProject.complete ? null : project,
    contributionLineIndex: 0,
    projects: { ...normalized.projects, [project]: nextProject },
  });
}

export async function loadAct2RuntimeState(): Promise<Act2RuntimeState> {
  const { value } = await Preferences.get({ key: KEY });
  if (!value) return createDefaultAct2RuntimeState();
  try {
    return normalizeAct2RuntimeState(JSON.parse(value));
  } catch {
    return createDefaultAct2RuntimeState();
  }
}

export async function saveAct2RuntimeState(state: Act2RuntimeState): Promise<void> {
  await Preferences.set({ key: KEY, value: JSON.stringify(normalizeAct2RuntimeState(state)) });
}
