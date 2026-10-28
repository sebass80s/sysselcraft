import type { Act3OpeningBeat } from "./act3OpeningContent";
import { ACT3_PARK_002 } from "./act3Park002Content";
import { ACT3_PARK_003 } from "./act3Park003Content";
import { ACT3_PARK_BATCH_004_008 } from "./act3Park004To008.generated";

/**
 * Chapter-owned authored quest-gated beats. Runtime 1.1 owns all state,
 * verified fresh claim consumption, atomic save and story presentation.
 *
 * Keep PARK-009 outside this list until minigolf inside that beat is
 * implemented. Never accidentally "play" a gameplay beat as plain dialogue.
 * Append future canonical batches here after their chapter interactions exist.
 */
export const ACT3_GATED_BEATS: readonly Act3OpeningBeat[] = [
  ACT3_PARK_002,
  ACT3_PARK_003,
  ...ACT3_PARK_BATCH_004_008,
];
