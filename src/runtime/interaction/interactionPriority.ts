type InteractionPriorityCandidate<TId extends string = string> = {
  id: TId;
  priority: number;
  enabled: boolean;
};

export function resolveInteractionPriority<TId extends string>(
  candidates: readonly InteractionPriorityCandidate<TId>[],
): InteractionPriorityCandidate<TId> | null {
  let winner: InteractionPriorityCandidate<TId> | null = null;

  for (const candidate of candidates) {
    if (!candidate.enabled) continue;
    if (!winner || candidate.priority > winner.priority) winner = candidate;
  }

  return winner;
}
