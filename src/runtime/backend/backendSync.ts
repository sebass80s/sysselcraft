import type { BackendChildGameState } from "../../backend/types";

export type BackendAuthoritySnapshot = {
  childId: string;
  wallet: {
    diamonds: number;
    sysselBux: number;
  };
  progression: BackendChildGameState["progression"];
  worldFlags: BackendChildGameState["worldFlags"];
  updatedAt: string;
};

export function createBackendAuthoritySnapshot(
  backend: BackendChildGameState,
): BackendAuthoritySnapshot {
  return {
    childId: backend.childId,
    wallet: {
      diamonds: backend.diamonds,
      sysselBux: backend.sysselBux,
    },
    progression: { ...backend.progression },
    worldFlags: { ...backend.worldFlags },
    updatedAt: backend.updatedAt,
  };
}

export type BackendSyncScheduler = {
  setInterval: (callback: () => void, intervalMs: number) => unknown;
  clearInterval: (handle: unknown) => void;
};

export type BackendSyncControl = {
  isActive: () => boolean;
};

export type BackendSyncLoopOptions<T> = {
  loadSnapshot: () => Promise<T | null>;
  onSnapshot: (snapshot: T, control: BackendSyncControl) => void | Promise<void>;
  onError?: (error: unknown, control: BackendSyncControl) => void | Promise<void>;
  intervalMs?: number;
  scheduler: BackendSyncScheduler;
};

export type BackendSyncLoop = {
  refresh: () => Promise<void>;
  stop: () => void;
};

export function startBackendSyncLoop<T>(
  options: BackendSyncLoopOptions<T>,
): BackendSyncLoop {
  const intervalMs = options.intervalMs ?? 15_000;
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new Error("Backend sync interval must be positive");
  }

  let stopped = false;
  let inFlight: Promise<void> | null = null;
  const control: BackendSyncControl = {
    isActive: () => !stopped,
  };

  async function runOnce(): Promise<void> {
    if (stopped || inFlight) return;

    const cycle = (async () => {
      try {
        const snapshot = await options.loadSnapshot();
        if (stopped || snapshot === null) return;
        await options.onSnapshot(snapshot, control);
      } catch (error) {
        if (stopped) return;
        await options.onError?.(error, control);
      }
    })();

    inFlight = cycle;
    try {
      await cycle;
    } finally {
      if (inFlight === cycle) inFlight = null;
    }
  }

  const timer = options.scheduler.setInterval(() => {
    void runOnce();
  }, intervalMs);

  void runOnce();

  return {
    refresh: runOnce,
    stop() {
      if (stopped) return;
      stopped = true;
      options.scheduler.clearInterval(timer);
    },
  };
}
