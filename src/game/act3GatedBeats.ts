import type { Act3OpeningBeat } from "./act3OpeningContent";
import { ACT3_PARK_002 } from "./act3Park002Content";
import { ACT3_PARK_003 } from "./act3Park003Content";
import { ACT3_PARK_BATCH_004_008 } from "./act3Park004To008.generated";
import { ACT3_PARK_009, ACT3_PARK_010 } from "./act3Park009And010Content";

/**
 * Chapter-owned authored quest-gated beats. Runtime 1.1 owns all state,
 * verified fresh claim consumption, atomic save and story presentation.
 *
 * PARK-009 hands control to its minigolf activity after the canonical dialogue.
 * Append future canonical batches here after their chapter interactions exist.
 */
export const ACT3_GATED_BEATS: readonly Act3OpeningBeat[] = [
  ACT3_PARK_002,
  ACT3_PARK_003,
  ...ACT3_PARK_BATCH_004_008,
  ACT3_PARK_009,
  ACT3_PARK_010,
];
