import {
  consumeProgressTrackStep,
  normalizeProgressTrack,
  type ProgressTrackDefinition,
  type ProgressTrackState,
} from "./progressTrack";

export type ProjectProgressDefinition<
  TProject extends string,
  TStage extends number,
> = {
  projects: readonly TProject[];
  track: (project: TProject) => ProgressTrackDefinition<TStage>;
  prerequisites?: Partial<Record<TProject, readonly TProject[]>>;
  completionReactionId?: (project: TProject) => string | null;
};

export type ProjectProgressState<
  TProject extends string,
  TStage extends number,
> = {
  selectedProject: TProject | null;
  projects: Record<TProject, ProgressTrackState<TStage>>;
  consumedCompletionReactionIds: string[];
};

function uniqueStrings(values: readonly string[]) {
  return [...new Set(values.filter((value) => value.length > 0))];
}

export function normalizeProjectProgressState<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
): ProjectProgressState<TProject, TStage> {
  const projects = {} as Record<TProject, ProgressTrackState<TStage>>;
  for (const project of definition.projects) {
    projects[project] = normalizeProgressTrack(
      state.projects[project],
      definition.track(project),
    );
  }

  const selectedProject =
    state.selectedProject
    && definition.projects.includes(state.selectedProject)
    && canSelectProjectProgress(
      { ...state, projects },
      definition,
      state.selectedProject,
    )
      ? state.selectedProject
      : null;

  const validReactionIds = new Set<string>();
  if (definition.completionReactionId) {
    for (const project of definition.projects) {
      const id = definition.completionReactionId(project);
      if (id && projects[project].complete) validReactionIds.add(id);
    }
  }

  return {
    selectedProject,
    projects,
    consumedCompletionReactionIds: uniqueStrings(
      state.consumedCompletionReactionIds,
    ).filter((id) => validReactionIds.has(id)),
  };
}

export function projectPrerequisitesComplete<
  TProject extends string,
  TStage extends number,
>(
  state: Pick<ProjectProgressState<TProject, TStage>, "projects">,
  definition: ProjectProgressDefinition<TProject, TStage>,
  project: TProject,
) {
  const prerequisites = definition.prerequisites?.[project] ?? [];
  return prerequisites.every((required) => state.projects[required]?.complete === true);
}

export function canSelectProjectProgress<
  TProject extends string,
  TStage extends number,
>(
  state: Pick<ProjectProgressState<TProject, TStage>, "projects">,
  definition: ProjectProgressDefinition<TProject, TStage>,
  project: TProject,
) {
  if (!definition.projects.includes(project)) return false;
  if (state.projects[project]?.complete) return false;
  return projectPrerequisitesComplete(state, definition, project);
}

export function selectProjectProgress<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
  project: TProject,
) {
  const normalized = normalizeProjectProgressState(state, definition);
  if (normalized.selectedProject && normalized.selectedProject !== project) {
    return normalized;
  }
  if (!canSelectProjectProgress(normalized, definition, project)) {
    return normalized;
  }
  return { ...normalized, selectedProject: project };
}

export function consumeSelectedProjectProgress<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
  input: {
    project: TProject;
    beatId: string;
    blocked?: boolean;
  },
) {
  const normalized = normalizeProjectProgressState(state, definition);
  if (input.blocked) return normalized;
  if (normalized.selectedProject !== input.project) return normalized;
  if (!canSelectProjectProgress(normalized, definition, input.project)) {
    return normalized;
  }

  const current = normalized.projects[input.project];
  const next = consumeProgressTrackStep({
    state: current,
    definition: definition.track(input.project),
    beatId: input.beatId,
  });
  if (next.contributions === current.contributions) return normalized;

  return {
    ...normalized,
    selectedProject: next.complete ? null : input.project,
    projects: {
      ...normalized.projects,
      [input.project]: next,
    },
  };
}

export function totalProjectProgress<
  TProject extends string,
  TStage extends number,
>(
  state: Pick<ProjectProgressState<TProject, TStage>, "projects">,
  definition: ProjectProgressDefinition<TProject, TStage>,
) {
  return definition.projects.reduce(
    (sum, project) => sum + (state.projects[project]?.contributions ?? 0),
    0,
  );
}

export function projectCompletionReactionPending<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
  project: TProject,
) {
  const id = definition.completionReactionId?.(project) ?? null;
  if (!id) return false;
  return state.projects[project]?.complete === true
    && !state.consumedCompletionReactionIds.includes(id);
}

export function nextPendingProjectCompletionReaction<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
): TProject | null {
  return definition.projects.find((project) =>
    projectCompletionReactionPending(state, definition, project),
  ) ?? null;
}

export function consumeProjectCompletionReaction<
  TProject extends string,
  TStage extends number,
>(
  state: ProjectProgressState<TProject, TStage>,
  definition: ProjectProgressDefinition<TProject, TStage>,
  project: TProject,
) {
  const normalized = normalizeProjectProgressState(state, definition);
  if (!projectCompletionReactionPending(normalized, definition, project)) {
    return normalized;
  }
  const id = definition.completionReactionId?.(project);
  if (!id) return normalized;
  return {
    ...normalized,
    consumedCompletionReactionIds: [
      ...normalized.consumedCompletionReactionIds,
      id,
    ],
  };
}
