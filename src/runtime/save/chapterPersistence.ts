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

export type ChapterPersistenceHost<T> = {
  load: () => Promise<T>;
  save: (state: T) => Promise<void>;
  clear: () => Promise<void>;
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

  async function loadNow(): Promise<T> {
    const childId = await pairedChildId();
    const legacyKey = definition.legacyStorageKey ?? definition.storageKey;

    if (!childId) {
      const stored = await Preferences.get({ key: legacyKey });
      return stored.value === null
        ? definition.createDefaultState()
        : decode(stored.value, legacyKey);
    }

    const key = scopedKey(definition.storageKey, childId);
    const scoped = await Preferences.get({ key });
    if (scoped.value !== null) return decode(scoped.value, key);

    if (!definition.legacyStorageKey) return definition.createDefaultState();

    const legacy = await Preferences.get({ key: definition.legacyStorageKey });
    if (legacy.value === null) return definition.createDefaultState();

    const migratedState = decode(legacy.value, definition.legacyStorageKey);
    await Preferences.set({ key, value: JSON.stringify(migratedState) });
    await Preferences.remove({ key: definition.legacyStorageKey });
    return migratedState;
  }

  async function saveNow(state: T): Promise<void> {
    const childId = await pairedChildId();
    const key = childId
      ? scopedKey(definition.storageKey, childId)
      : definition.legacyStorageKey ?? definition.storageKey;
    const normalized = definition.normalize(state);
    if (!normalized) {
      throw new Error(`Refusing to persist invalid state for ${definition.chapterId}`);
    }
    await Preferences.set({ key, value: JSON.stringify(normalized) });
  }

  async function clearNow(): Promise<void> {
    const childId = await pairedChildId();
    const key = childId
      ? scopedKey(definition.storageKey, childId)
      : definition.legacyStorageKey ?? definition.storageKey;
    await Preferences.remove({ key });
  }

  return {
    load: () => runOrdered(loadNow),
    save: (state) => runOrdered(() => saveNow(state)),
    clear: () => runOrdered(clearNow),
  };
}
