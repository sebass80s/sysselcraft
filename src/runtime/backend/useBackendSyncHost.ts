"use client";

import { useEffect, useRef } from "react";
import {
  startBackendSyncLoop,
  type BackendSyncControl,
} from "./backendSync";

export type BackendSyncHostOptions<T> = {
  active: boolean;
  loadSnapshot: () => Promise<T | null>;
  onSnapshot: (snapshot: T, control: BackendSyncControl) => void | Promise<void>;
  onError?: (error: unknown, control: BackendSyncControl) => void | Promise<void>;
  intervalMs?: number;
};

export function useBackendSyncHost<T>({
  active,
  loadSnapshot,
  onSnapshot,
  onError,
  intervalMs = 15_000,
}: BackendSyncHostOptions<T>) {
  const loadSnapshotRef = useRef(loadSnapshot);
  const onSnapshotRef = useRef(onSnapshot);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    loadSnapshotRef.current = loadSnapshot;
    onSnapshotRef.current = onSnapshot;
    onErrorRef.current = onError;
  }, [loadSnapshot, onSnapshot, onError]);

  useEffect(() => {
    if (!active) return;

    const loop = startBackendSyncLoop<T>({
      intervalMs,
      scheduler: {
        setInterval: (callback, ms) => window.setInterval(callback, ms),
        clearInterval: (handle) => window.clearInterval(handle as number),
      },
      loadSnapshot: () => loadSnapshotRef.current(),
      onSnapshot: (snapshot, control) => onSnapshotRef.current(snapshot, control),
      onError: (error, control) => onErrorRef.current?.(error, control),
    });

    return () => loop.stop();
  }, [active, intervalMs]);
}
