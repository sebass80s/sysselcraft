export type ChapterDebugSession<TState, TContext> = {
  state: TState;
  context: TContext;
  chapterIntroVisible: boolean;
};

export type ChapterDebugProbeResult = {
  ok: boolean;
  details?: Record<string, unknown>;
};

export type ChapterDebugFixture<TState, TContext> = {
  chapterId: string;
  route: string;
  debugRoute: string;
  createSession: (params: URLSearchParams) => ChapterDebugSession<TState, TContext>;
  createResetState: () => TState;
  inspect: (state: TState, context: TContext) => Record<string, unknown>;
  probes?: Record<string, (state: TState, context: TContext) => ChapterDebugProbeResult>;
};

export function launchChapterDebug<TState, TContext>(
  fixture: ChapterDebugFixture<TState, TContext>,
  params: URLSearchParams,
): ChapterDebugSession<TState, TContext> {
  return fixture.createSession(params);
}

export function resetChapterDebugState<TState, TContext>(
  fixture: ChapterDebugFixture<TState, TContext>,
): TState {
  return fixture.createResetState();
}

export function inspectChapterDebugState<TState, TContext>(
  fixture: ChapterDebugFixture<TState, TContext>,
  state: TState,
  context: TContext,
) {
  return {
    chapterId: fixture.chapterId,
    route: fixture.route,
    debugRoute: fixture.debugRoute,
    ...fixture.inspect(state, context),
  };
}

export function runChapterDebugProbe<TState, TContext>(
  fixture: ChapterDebugFixture<TState, TContext>,
  probeId: string,
  state: TState,
  context: TContext,
): ChapterDebugProbeResult {
  const probe = fixture.probes?.[probeId];
  if (!probe) {
    return {
      ok: false,
      details: { reason: "unknown-probe", probeId },
    };
  }
  return probe(state, context);
}
