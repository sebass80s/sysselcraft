import { Preferences } from "@capacitor/preferences";

export type ChapterPersistenceDefinition<T> = {
  chapterId: string;
  version: number;
  storageKey: string;
  legacyStorageKey?: string;
  childIdStorageKey?: string;
  createDefaultState: () => T;
  migrate?: (value: unknown) => unknown;
  normalize: (value: unknown) => T | null;
};

export type ChapterPersistenceOperationGuard = {
  isActive?: () => boolean;
};

export type ChapterPersistenceHost<T> = {
  load: (guard?: ChapterPersistenceOperationGuard) => Promise<T>;
  save: (state: T, guard?: ChapterPersistenceOperationGuard) => Promise<void>;
  update: (
    updater: (state: T) => T | null | Promise<T | null>,
    guard?: ChapterPersistenceOperationGuard,
  ) => Promise<T>;
  clear: (guard?: ChapterPersistenceOperationGuard) => Promise<void>;
};

type PersistenceTarget = {
  childId: string | null;
  key: string;
};

type ReadResult<T> = {
  state: T;
  legacySourceKey: string | null;
};

const DEFAULT_CHILD_ID_STORAGE_KEY = "sysselcraft.backend.childId";

function assertDefinition<T>(definition: ChapterPersistenceDefinition<T>) {
  if (!definition.chapterId.trim()) throw new Error("Chapter persistence requires chapterId");
  if (!Number.isInteger(definition.version) || definition.version < 1) {
    throw new Error("Chapter persistence requires a positive integer version");
  }
  if (!definition.storageKey.trim()) throw new Error("Chapter persistence requires storageKey");
}

function scopedKey(baseKey: string, childId: string) {
  return `${baseKey}.${childId}`;
}

export function createChapterPersistenceHost<T>(
  definition: ChapterPersistenceDefinition<T>,
): ChapterPersistenceHost<T> {
  assertDefinition(definition);

  let operationQueue: Promise<void> = Promise.resolve();

  function runOrdered<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
    const result = operationQueue.catch(() => undefined).then(operation);
    operationQueue = result.then(() => undefined, () => undefined);
    return result;
  }

  async function pairedChildId() {
    const { value } = await Preferences.get({
      key: definition.childIdStorageKey ?? DEFAULT_CHILD_ID_STORAGE_KEY,
    });
    const childId = value?.trim() ?? "";
    return childId || null;
  }

  async function captureTarget(): Promise<PersistenceTarget> {
    const childId = await pairedChildId();
    return {
      childId,
      key: childId
        ? scopedKey(definition.storageKey, childId)
        : definition.legacyStorageKey ?? definition.storageKey,
    };
  }

  function assertGuardActive(guard?: ChapterPersistenceOperationGuard) {
    if (guard?.isActive && !guard.isActive()) {
      throw new Error(`Stale chapter persistence operation for ${definition.chapterId}`);
    }
  }

  async function assertTargetCurrent(
    target: PersistenceTarget,
    guard?: ChapterPersistenceOperationGuard,
  ) {
    assertGuardActive(guard);
    const currentChildId = await pairedChildId();
    assertGuardActive(guard);
    if (currentChildId !== target.childId) {
      throw new Error(
        `Stale chapter persistence identity for ${definition.chapterId}`,
      );
    }
  }

  function decode(raw: string, key: string): T {
    let candidate: unknown;
    try {
      candidate = JSON.parse(raw);
    } catch {
      throw new Error(`Unreadable persisted chapter state for ${definition.chapterId} at ${key}`);
    }

    const migrated = definition.migrate ? definition.migrate(candidate) : candidate;
    const normalized = definition.normalize(migrated);
    if (!normalized) {
      throw new Error(`Unsupported persisted chapter state for ${definition.chapterId} at ${key}`);
    }
    return normalized;
  }

  async function readTarget(
    target: PersistenceTarget,
    guard?: ChapterPersistenceOperationGuard,
  ): Promise<ReadResult<T>> {
    await assertTargetCurrent(target, guard);

    const stored = await Preferences.get({ key: target.key });
    assertGuardActive(guard);
    if (stored.value !== null) {
      return {
        state: decode(stored.value, target.key),
        legacySourceKey: null,
      };
    }

    if (!target.childId || !definition.legacyStorageKey) {
      return {
        state: definition.createDefaultState(),
        legacySourceKey: null,
      };
    }

    const legacy = await Preferences.get({ key: definition.legacyStorageKey });
    assertGuardActive(guard);
    if (legacy.value === null) {
      return {
        state: definition.createDefaultState(),
        legacySourceKey: null,
      };
    }

    return {
      state: decode(legacy.value, definition.legacyStorageKey),
      legacySourceKey: definition.legacyStorageKey,
    };
  }

  async function writeTarget(
    target: PersistenceTarget,
    state: T,
    guard?: ChapterPersistenceOperationGuard,
  ) {
    const normalized = definition.normalize(state);
    if (!normalized) {
      throw new Error(`Refusing to persist invalid state for ${definition.chapterId}`);
    }

    await assertTargetCurrent(target, guard);
    await Preferences.set({ key: target.key, value: JSON.stringify(normalized) });
    return normalized;
  }

  async function removeLegacyAfterCanonicalWrite(
    target: PersistenceTarget,
    legacySourceKey: string | null,
    guard?: ChapterPersistenceOperationGuard,
  ) {
    if (!legacySourceKey || legacySourceKey === target.key) return;
    await assertTargetCurrent(target, guard);
    await Preferences.remove({ key: legacySourceKey });
  }

  async function loadForTarget(
    target: PersistenceTarget,
    guard?: ChapterPersistenceOperationGuard,
  ): Promise<T> {
    const read = await readTarget(target, guard);

    if (read.legacySourceKey) {
      const normalized = await writeTarget(target, read.state, guard);
      await removeLegacyAfterCanonicalWrite(target, read.legacySourceKey, guard);
      await assertTargetCurrent(target, guard);
      return normalized;
    }

    await assertTargetCurrent(target, guard);
    return read.state;
  }

  async function updateForTarget(
    target: PersistenceTarget,
    updater: (state: T) => T | null | Promise<T | null>,
    guard?: ChapterPersistenceOperationGuard,
  ): Promise<T> {
    const read = await readTarget(target, guard);
    assertGuardActive(guard);
    const next = await updater(read.state);
    assertGuardActive(guard);

    if (next === null) {
      await assertTargetCurrent(target, guard);
      return read.state;
    }

    const normalized = await writeTarget(target, next, guard);
    await removeLegacyAfterCanonicalWrite(target, read.legacySourceKey, guard);
    await assertTargetCurrent(target, guard);
    return normalized;
  }

  return {
    load: (guard) => {
      const target = captureTarget();
      return runOrdered(async () => loadForTarget(await target, guard));
    },
    save: (state, guard) => {
      const target = captureTarget();
      return runOrdered(async () => {
        await writeTarget(await target, state, guard);
      });
    },
    update: (updater, guard) => {
      const target = captureTarget();
      return runOrdered(async () => updateForTarget(await target, updater, guard));
    },
    clear: (guard) => {
      const target = captureTarget();
      return runOrdered(async () => {
        const resolved = await target;
        await assertTargetCurrent(resolved, guard);
        await Preferences.remove({ key: resolved.key });
      });
    },
  };
}
