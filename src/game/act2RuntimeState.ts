import {
  createChapterPersistenceHost,
  type ChapterPersistenceOperationGuard,
} from "../runtime/save/chapterPersistence";
import { runSequentialMigrations } from "../runtime/save/migrations";
import { progressGateRequired } from "../runtime/progression/progressGate";
import {
  normalizeProgressTrack,
  type ProgressTrackDefinition,
} from "../runtime/progression/progressTrack";
import {
  canSelectProjectProgress,
  consumeProjectCompletionReaction as consumeSharedProjectCompletionReaction,
  consumeSelectedProjectProgress,
  nextAuthoritativeProjectProgressStep,
  nextPendingProjectCompletionReaction,
  normalizeProjectProgressState,
  pendingAuthoritativeProjectProgressCount,
  projectCompletionReactionPending as sharedProjectCompletionReactionPending,
  projectPrerequisitesComplete,
  selectProjectProgress,
  totalProjectProgress,
  type ProjectProgressDefinition,
  type ProjectProgressState,
} from "../runtime/progression/projectProgressEngine";

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
  finaleSchemaVersion: 3;
  entered: boolean;
  productionEntryCommitted: boolean;
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
  pendingPurchaseStory: "dock" | "boathouse" | null;
  purchaseStoryLineIndex: number;
  consumedProjectCompletionIds: string[];
  projects: Record<Act2Project, Act2ProjectState>;
  contributionLineIndex: number;
  completionLineIndex: number;
  finaleLineIndex: number;
  finaleIndex: number;
  familyFinaleConsumed: boolean;
  epilogueConsumed: boolean;
  act2Complete: boolean;
  endCardSeen: boolean;
};

const ACT2_STORAGE_KEY = "sysselcraft.act2.runtime.v1";
const PROJECTS: Act2Project[] = ["cabin", "dock", "boathouse", "motorboat"];
const ACT2_FINALE_SCHEMA_VERSION = 3 as const;

type Act2RuntimeCandidate = Omit<Partial<Act2RuntimeState>, "finaleSchemaVersion"> & {
  finaleSchemaVersion?: unknown;
  selectedProject?: unknown;
  projects?: Partial<Record<Act2Project, unknown>>;
};

function migrateAct2RuntimeCandidate(candidate: Act2RuntimeCandidate): Act2RuntimeCandidate {
  if (candidate.version !== undefined && candidate.version !== 1) {
    throw new Error(`Unsupported Act 2 runtime version: ${String(candidate.version)}`);
  }

  if (
    candidate.finaleSchemaVersion !== undefined
    && candidate.finaleSchemaVersion !== 1
    && candidate.finaleSchemaVersion !== 2
    && candidate.finaleSchemaVersion !== ACT2_FINALE_SCHEMA_VERSION
  ) {
    throw new Error(
      `Unsupported Act 2 finale schema version: ${String(candidate.finaleSchemaVersion)}`,
    );
  }

  const currentVersion = candidate.finaleSchemaVersion === 2
    ? 2
    : candidate.finaleSchemaVersion === ACT2_FINALE_SCHEMA_VERSION
      ? ACT2_FINALE_SCHEMA_VERSION
      : 1;

  return runSequentialMigrations(
    candidate,
    currentVersion,
    ACT2_FINALE_SCHEMA_VERSION,
    [
      {
        from: 1,
        to: 2,
        migrate: (legacy) => {
          const legacyFinaleComplete =
            legacy.familyFinaleConsumed === true
            || legacy.epilogueConsumed === true
            || legacy.act2Complete === true;

          if (!legacyFinaleComplete) {
            return { ...legacy, finaleSchemaVersion: 2 };
          }

          return {
            ...legacy,
            finaleSchemaVersion: ACT2_FINALE_SCHEMA_VERSION,
            finaleIndex: 5,
            finaleLineIndex: 0,
            familyFinaleConsumed: true,
            epilogueConsumed: false,
            act2Complete: false,
            endCardSeen: false,
          };
        },
      },
      {
        from: 2,
        to: 3,
        migrate: (legacy) => {
          const familyFinaleOnly =
            legacy.familyFinaleConsumed === true
            && (legacy.finaleIndex ?? 0) < 5
            && legacy.epilogueConsumed !== true
            && legacy.act2Complete !== true;

          if (!familyFinaleOnly) {
            return { ...legacy, finaleSchemaVersion: ACT2_FINALE_SCHEMA_VERSION };
          }

          return {
            ...legacy,
            finaleSchemaVersion: ACT2_FINALE_SCHEMA_VERSION,
            finaleIndex: 5,
            finaleLineIndex: 0,
            familyFinaleConsumed: true,
            epilogueConsumed: false,
            act2Complete: false,
            endCardSeen: false,
          };
        },
      },
    ],
  ).value;
}

function emptyProject(): Act2ProjectState {
  return { contributions: 0, visibleStage: 0, consumedBeatIds: [], complete: false };
}

export function createDefaultAct2RuntimeState(): Act2RuntimeState {
  return {
    version: 1,
    finaleSchemaVersion: ACT2_FINALE_SCHEMA_VERSION,
    entered: false,
    productionEntryCommitted: false,
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
    pendingPurchaseStory: null,
    purchaseStoryLineIndex: 0,
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
    endCardSeen: false,
  };
}

function normalizeBeatIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && id.length > 0))];
}

export const ACT2_PROJECT_TARGET = 16;
export const ACT2_PROJECT_STAGES = [
  { minContributions: 1, stage: 1 },
  { minContributions: 4, stage: 2 },
  { minContributions: 8, stage: 3 },
  { minContributions: 12, stage: 4 },
] as const;

export function act2ProjectTrackDefinition(
  project: Act2Project,
): ProgressTrackDefinition<1 | 2 | 3 | 4> {
  return {
    targetCount: ACT2_PROJECT_TARGET,
    stages: ACT2_PROJECT_STAGES,
    beatId: (number) => `${project}:${String(number).padStart(2, "0")}`,
  };
}

const ACT2_PROJECT_PROGRESS_DEFINITION: ProjectProgressDefinition<
  Act2Project,
  1 | 2 | 3 | 4
> = {
  projects: PROJECTS,
  track: act2ProjectTrackDefinition,
  prerequisites: {
    motorboat: ["cabin", "dock", "boathouse"],
  },
  completionReactionId: (project) =>
    project === "dock" ? `${project}:completion-reaction` : null,
};

function normalizeProject(value: unknown, project: Act2Project): Act2ProjectState {
  return normalizeProgressTrack(value, act2ProjectTrackDefinition(project));
}

function projectProgressSnapshot(
  state: Pick<Act2RuntimeState, "selectedProject" | "projects" | "consumedProjectCompletionIds">,
): ProjectProgressState<Act2Project, 1 | 2 | 3 | 4> {
  return {
    selectedProject: state.selectedProject,
    projects: state.projects,
    consumedCompletionReactionIds: state.consumedProjectCompletionIds,
  };
}

function applyProjectProgressSnapshot(
  state: Act2RuntimeState,
  progress: ProjectProgressState<Act2Project, 1 | 2 | 3 | 4>,
): Act2RuntimeState {
  return {
    ...state,
    selectedProject: progress.selectedProject,
    projects: progress.projects,
    consumedProjectCompletionIds: progress.consumedCompletionReactionIds,
  };
}

export function prerequisiteCompletionCount(state: Act2RuntimeState) {
  return (ACT2_PROJECT_PROGRESS_DEFINITION.prerequisites?.motorboat ?? [])
    .filter((project) => state.projects[project].complete).length;
}

export function isMotorboatUnlocked(state: Act2RuntimeState) {
  return projectPrerequisitesComplete(
    projectProgressSnapshot(state),
    ACT2_PROJECT_PROGRESS_DEFINITION,
    "motorboat",
  );
}

export function canSelectProject(state: Act2RuntimeState, project: Act2Project) {
  return canSelectProjectProgress(
    projectProgressSnapshot(state),
    ACT2_PROJECT_PROGRESS_DEFINITION,
    project,
  );
}

export function normalizeAct2RuntimeState(value: unknown): Act2RuntimeState {
  const defaults = createDefaultAct2RuntimeState();
  if (!value || typeof value !== "object") return defaults;
  const candidate = migrateAct2RuntimeCandidate(value as Act2RuntimeCandidate);

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
    finaleSchemaVersion: ACT2_FINALE_SCHEMA_VERSION,
    entered: candidate.entered === true,
    productionEntryCommitted: candidate.productionEntryCommitted === true,
    openingIndex: Number.isInteger(candidate.openingIndex)
      ? Math.max(0, Math.min(4, candidate.openingIndex as number))
      : 0,
    openingLineIndex: Number.isInteger(candidate.openingLineIndex)
      ? Math.max(0, Math.min(200, candidate.openingLineIndex as number))
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
    pendingPurchaseStory: candidate.pendingPurchaseStory === "dock" || candidate.pendingPurchaseStory === "boathouse"
      ? candidate.pendingPurchaseStory
      : null,
    purchaseStoryLineIndex: Number.isInteger(candidate.purchaseStoryLineIndex)
      ? Math.max(0, Math.min(200, candidate.purchaseStoryLineIndex as number))
      : 0,
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
    endCardSeen: candidate.endCardSeen === true,
  };

  if (normalized.projects.motorboat.contributions > 0 && !isMotorboatUnlocked(normalized)) {
    normalized.projects.motorboat = emptyProject();
    normalized.motorboatName = null;
    normalized.motorboatPartsOwned = false;
  }

  const normalizedProgress = normalizeProjectProgressState(
    projectProgressSnapshot(normalized),
    ACT2_PROJECT_PROGRESS_DEFINITION,
  );
  normalized.selectedProject = normalizedProgress.selectedProject;
  normalized.projects = normalizedProgress.projects;
  normalized.consumedProjectCompletionIds =
    normalizedProgress.consumedCompletionReactionIds;

  if (
    (normalized.pendingPurchaseStory === "dock" && !normalized.jettyLifebuoyOwned)
    || (normalized.pendingPurchaseStory === "boathouse" && !normalized.boathouseSteeringWheelOwned)
  ) {
    normalized.pendingPurchaseStory = null;
    normalized.purchaseStoryLineIndex = 0;
  }
  if (!normalized.pendingPurchaseStory) normalized.purchaseStoryLineIndex = 0;

  if (!normalized.selectedProject) normalized.contributionLineIndex = 0;

  const pendingCompletionProject = (["dock"] as const)
    .find((project) => normalized.projects[project].complete
      && !normalized.consumedProjectCompletionIds.includes(projectCompletionReactionId(project)));
  if (!pendingCompletionProject) normalized.completionLineIndex = 0;

  if (!normalized.projects.motorboat.complete) {
    normalized.finaleIndex = 0;
    normalized.finaleLineIndex = 0;
    normalized.familyFinaleConsumed = false;
    normalized.epilogueConsumed = false;
    normalized.endCardSeen = false;
  } else {
    // Versioned compatibility repairs run before normalization. From here on,
    // this branch only enforces canonical completion invariants.
    if (candidate.epilogueConsumed === true || candidate.act2Complete === true) {
      normalized.finaleIndex = 5;
      normalized.finaleLineIndex = 0;
      normalized.familyFinaleConsumed = true;
      normalized.epilogueConsumed = true;
    } else {
      normalized.familyFinaleConsumed = normalized.finaleIndex === 5;
    }
  }

  normalized.act2Complete = normalized.epilogueConsumed;
  if (!normalized.act2Complete) normalized.endCardSeen = false;

  return normalized;
}

export function prepareAct2ProductionEntry(state: Act2RuntimeState): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (normalized.productionEntryCommitted) {
    return normalized.entered ? normalized : { ...normalized, entered: true };
  }

  // Before release, the locked production route could still persist entered/baseline.
  // Treat any state without this marker as pre-release residue and establish the
  // real Act 2 journey from a clean baseline. Backend-owned purchase flags are
  // preserved and will be reconciled again from authoritative world_flags.
  const clean = createDefaultAct2RuntimeState();
  return {
    ...clean,
    entered: true,
    productionEntryCommitted: true,
    jettyLifebuoyOwned: normalized.jettyLifebuoyOwned,
    boathouseSteeringWheelOwned: normalized.boathouseSteeringWheelOwned,
    motorboatPartsOwned: normalized.motorboatPartsOwned,
  };
}

export function totalAct2Contributions(state: Act2RuntimeState) {
  return totalProjectProgress(
    projectProgressSnapshot(state),
    ACT2_PROJECT_PROGRESS_DEFINITION,
  );
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
  return pendingAuthoritativeProjectProgressCount({
    state: projectProgressSnapshot(normalized),
    definition: ACT2_PROJECT_PROGRESS_DEFINITION,
    authoritativeCount: worldProgression,
    baselineCount: normalized.backendClaimBaseline,
  });
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
  if (normalized.backendClaimBaseline === null) return null;
  const next = nextAuthoritativeProjectProgressStep({
    state: projectProgressSnapshot(normalized),
    definition: ACT2_PROJECT_PROGRESS_DEFINITION,
    authoritativeCount: worldProgression,
    baselineCount: normalized.backendClaimBaseline,
    blocked: (candidateProject) =>
      act2ContributionBlockedByStoryGate(normalized, candidateProject),
  });
  if (!next || next.visibleStage === 0) return null;
  return {
    project: next.project,
    number: next.number,
    beatId: next.beatId,
    visibleStage: next.visibleStage,
    backlog: next.backlog,
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
  return progressGateRequired(
    normalized.projects.dock.contributions,
    6,
    ACT2_PROJECT_TARGET,
    normalized.jettyLifebuoyOwned,
  );
}

export function boathousePurchaseRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return progressGateRequired(
    normalized.projects.boathouse.contributions,
    9,
    ACT2_PROJECT_TARGET,
    normalized.boathouseSteeringWheelOwned,
  );
}

export function motorboatPartsPurchaseRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return progressGateRequired(
    normalized.projects.motorboat.contributions,
    5,
    ACT2_PROJECT_TARGET,
    normalized.motorboatPartsOwned,
  );
}

export function motorboatNamingRequired(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return progressGateRequired(
    normalized.projects.motorboat.contributions,
    12,
    ACT2_PROJECT_TARGET,
    normalized.motorboatName !== null,
  );
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

export function projectCompletionReactionPending(state: Act2RuntimeState, project: Act2Project) {
  const normalized = normalizeAct2RuntimeState(state);
  return sharedProjectCompletionReactionPending(
    projectProgressSnapshot(normalized),
    ACT2_PROJECT_PROGRESS_DEFINITION,
    project,
  );
}

export function pendingProjectCompletionReaction(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return nextPendingProjectCompletionReaction(
    projectProgressSnapshot(normalized),
    ACT2_PROJECT_PROGRESS_DEFINITION,
  );
}

export function consumeProjectCompletionReaction(
  state: Act2RuntimeState,
  project: Act2Project,
): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  const progress = consumeSharedProjectCompletionReaction(
    projectProgressSnapshot(normalized),
    ACT2_PROJECT_PROGRESS_DEFINITION,
    project,
  );
  const next = applyProjectProgressSnapshot(normalized, progress);
  return progress.consumedCompletionReactionIds.length
    === normalized.consumedProjectCompletionIds.length
      ? next
      : { ...next, completionLineIndex: 0 };
}

export function act2FinalePending(state: Act2RuntimeState) {
  const normalized = normalizeAct2RuntimeState(state);
  return normalized.projects.motorboat.complete && !normalized.epilogueConsumed;
}

export function advanceAct2Finale(state: Act2RuntimeState): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  if (!act2FinalePending(normalized)) return normalized;
  if (normalized.finaleIndex < 5) {
    return {
      ...normalized,
      finaleIndex: normalized.finaleIndex + 1,
      finaleLineIndex: 0,
      familyFinaleConsumed: normalized.finaleIndex === 4,
    };
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
  return applyProjectProgressSnapshot(
    normalized,
    selectProjectProgress(
      projectProgressSnapshot(normalized),
      ACT2_PROJECT_PROGRESS_DEFINITION,
      project,
    ),
  );
}

export function withPresentedContribution(
  state: Act2RuntimeState,
  project: Act2Project,
  beatId: string,
): Act2RuntimeState {
  const normalized = normalizeAct2RuntimeState(state);
  const progress = consumeSelectedProjectProgress(
    projectProgressSnapshot(normalized),
    ACT2_PROJECT_PROGRESS_DEFINITION,
    {
      project,
      beatId,
      blocked: act2ContributionBlockedByStoryGate(normalized, project),
    },
  );
  const next = applyProjectProgressSnapshot(normalized, progress);
  if (next.projects[project].contributions === normalized.projects[project].contributions) {
    return normalized;
  }
  return normalizeAct2RuntimeState({
    ...next,
    contributionLineIndex: 0,
  });
}

const act2Persistence = createChapterPersistenceHost<Act2RuntimeState>({
  chapterId: "act2",
  version: 1,
  storageKey: ACT2_STORAGE_KEY,
  legacyStorageKey: ACT2_STORAGE_KEY,
  createDefaultState: createDefaultAct2RuntimeState,
  normalize: normalizeAct2RuntimeState,
});

export const loadAct2RuntimeState = (guard?: ChapterPersistenceOperationGuard) =>
  act2Persistence.load(guard);
export const saveAct2RuntimeState = (
  state: Act2RuntimeState,
  guard?: ChapterPersistenceOperationGuard,
) => act2Persistence.save(state, guard);
export const updateAct2RuntimeState = (
  updater: (state: Act2RuntimeState) => Act2RuntimeState | null | Promise<Act2RuntimeState | null>,
  guard?: ChapterPersistenceOperationGuard,
) => act2Persistence.update(updater, guard);
export const clearAct2RuntimeStateForPairedChild = (guard?: ChapterPersistenceOperationGuard) =>
  act2Persistence.clear(guard);
