import { ACT3_PARK_002 } from "./act3Park002Content";
import { ACT3_PARK_003 } from "./act3Park003Content";

/**
 * Chapter-owned sequence of quest-gated story content.
 * Generic Runtime 1.1 claimGateBridge owns claim authority, durability and
 * one-claim-per-beat advancement. New scenes extend this list, not the engine.
 */
export const ACT3_GATED_BEATS = [ACT3_PARK_002, ACT3_PARK_003] as const;
