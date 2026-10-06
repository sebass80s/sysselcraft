"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { chapterBootMayLoad, deriveChapterRuntimeShell, type ChapterRuntimeShellStatus } from "./chapterRuntimeShell";

export type ChapterRuntimeBootEnvironment = {
  debug: boolean;
  productionEnabled: boolean;
};

export type ChapterRuntimeBootResult<TState, TContext> = {
  accessAllowed: boolean;
  state: TState;
  context: TContext;
  chapterIntroVisible: boolean;
  replaceHref?: string | null;
};

export type ChapterRuntimeHostOptions<TState, TContext> = {
  debug: boolean;
  productionEnabled: boolean;
  createInitialState: () => TState;
  createInitialContext: () => TContext;
  boot: (environment: ChapterRuntimeBootEnvironment) => Promise<ChapterRuntimeBootResult<TState, TContext>>;
  replaceRoute?: (href: string) => void;
};

export type ChapterRuntimeHost<TState, TContext> = {
  state: TState;
  setState: Dispatch<SetStateAction<TState>>;
  context: TContext;
  setContext: Dispatch<SetStateAction<TContext>>;
  ready: boolean;
  accessAllowed: boolean;
  status: ChapterRuntimeShellStatus;
  chapterIntroVisible: boolean;
  setChapterIntroVisible: Dispatch<SetStateAction<boolean>>;
  bootError: string;
};

/**
 * Canonical chapter runtime host lifecycle.
 *
 * The host owns generic boot/access/ready state and cancellation semantics.
 * Chapter adapters provide only chapter-specific loading, reconciliation and
 * initial presentation data. Visiting a shipping-locked chapter never invokes
 * the adapter, preserving the hard no-side-effects boundary.
 */
export function useChapterRuntimeHost<TState, TContext>(
  options: ChapterRuntimeHostOptions<TState, TContext>,
): ChapterRuntimeHost<TState, TContext> {
  const {
    debug,
    productionEnabled,
    createInitialState,
    createInitialContext,
    boot,
    replaceRoute,
  } = options;

  const [state, setState] = useState<TState>(createInitialState);
  const [context, setContext] = useState<TContext>(createInitialContext);
  const [ready, setReady] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [chapterIntroVisible, setChapterIntroVisible] = useState(true);
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) return;

      if (!chapterBootMayLoad({ debug, productionEnabled })) {
        setAccessAllowed(false);
        setChapterIntroVisible(false);
        setReady(true);
        return;
      }

      try {
        const result = await boot({ debug, productionEnabled });
        if (cancelled) return;
        setAccessAllowed(result.accessAllowed);
        setState(result.state);
        setContext(result.context);
        setChapterIntroVisible(result.chapterIntroVisible);
        setBootError("");
        setReady(true);
        if (result.replaceHref && replaceRoute) replaceRoute(result.replaceHref);
      } catch {
        if (cancelled) return;
        setBootError("Kunde inte starta kapitlet just nu.");
        setAccessAllowed(false);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [boot, debug, productionEnabled, replaceRoute]);

  return {
    state,
    setState,
    context,
    setContext,
    ready,
    accessAllowed,
    status: deriveChapterRuntimeShell({
      ready,
      debug,
      productionEnabled,
      accessAllowed,
    }),
    chapterIntroVisible,
    setChapterIntroVisible,
    bootError,
  };
}
