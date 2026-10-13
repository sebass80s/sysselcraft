"use client";

import { useCallback, useEffect, useRef } from "react";

/** Capture a lease per operation. StrictMode remounts cannot revive an old lease. */
export function useChapterPersistenceGuard(expectedChildId: string | null, enabled: boolean) {
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    return () => { generation.current += 1; };
  }, [expectedChildId, enabled]);
  return useCallback(() => {
    const captured = generation.current;
    return { expectedChildId, isActive: () => enabled && captured % 2 === 1 && generation.current === captured };
  }, [expectedChildId, enabled]);
}
