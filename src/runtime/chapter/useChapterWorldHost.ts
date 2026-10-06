"use client";

import { useEffect, useRef } from "react";

export type ChapterWorldHostOptions<TWorld, TSnapshot> = {
  active: boolean;
  snapshot: TSnapshot;
  mount: () => Promise<TWorld | null>;
  sync: (world: TWorld, snapshot: TSnapshot) => void | Promise<void>;
  destroy: (world: TWorld) => void;
};

/**
 * Shared lifecycle for a chapter's world adapter.
 *
 * Chapters provide world-specific mount/sync/destroy adapters. The host owns
 * cancellation, one active world instance, initial synchronization and cleanup.
 */
export function useChapterWorldHost<TWorld, TSnapshot>(
  options: ChapterWorldHostOptions<TWorld, TSnapshot>,
) {
  const { active, snapshot, mount, sync, destroy } = options;
  const worldRef = useRef<TWorld | null>(null);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    if (!active) return;

    let disposed = false;

    void mount().then(async (world) => {
      if (!world) return;
      if (disposed) {
        destroy(world);
        return;
      }
      worldRef.current = world;
      await sync(world, snapshotRef.current);
    });

    return () => {
      disposed = true;
      const world = worldRef.current;
      worldRef.current = null;
      if (world) destroy(world);
    };
  }, [active, destroy, mount, sync]);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;
    void sync(world, snapshot);
  }, [snapshot, sync]);

  return worldRef;
}
