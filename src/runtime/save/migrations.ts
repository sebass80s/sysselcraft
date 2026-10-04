export type VersionedMigration<T> = {
  from: number;
  to: number;
  migrate: (value: T) => T;
};

type MigrationResult<T> = {
  value: T;
  version: number;
};

export function runSequentialMigrations<T>(
  value: T,
  currentVersion: number,
  targetVersion: number,
  migrations: readonly VersionedMigration<T>[],
): MigrationResult<T> {
  if (!Number.isInteger(currentVersion) || currentVersion < 0) {
    throw new Error("Invalid current schema version");
  }
  if (!Number.isInteger(targetVersion) || targetVersion < currentVersion) {
    throw new Error("Invalid target schema version");
  }

  let version = currentVersion;
  let migrated = value;

  while (version < targetVersion) {
    const step = migrations.find(
      (candidate) => candidate.from === version && candidate.to === version + 1,
    );
    if (!step) {
      throw new Error(`Missing migration ${version} -> ${version + 1}`);
    }
    migrated = step.migrate(migrated);
    version = step.to;
  }

  return { value: migrated, version };
}
