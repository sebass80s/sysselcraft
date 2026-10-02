"use client";

import { Act2Runtime } from "../../components/Act2Runtime";

// Act 2 is now reachable after the persisted Chapter 1 end-card gate.
const ACT2_PRODUCTION_ENABLED = true;

export default function Act2Page() {
  return <Act2Runtime productionEnabled={ACT2_PRODUCTION_ENABLED} />;
}
