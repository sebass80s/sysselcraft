import type { ChapterPersistenceHost, ChapterPersistenceOperationGuard } from "./chapterPersistence";

/** Compare the rendered cursor, then transform the latest save, preserving concurrent metadata. */
export function updateChapterFromView<T>(
  persistence: Pick<ChapterPersistenceHost<T>, "update">,
  rendered: T,
  cursor: (state: T) => string,
  transition: (state: T) => T,
  guard: ChapterPersistenceOperationGuard,
) {
  const expected = cursor(rendered);
  return persistence.update(current => cursor(current) === expected ? transition(current) : null, guard);
}
