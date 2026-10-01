"use client";

import { Act2Runtime } from "../../components/Act2Runtime";

// Temporary shipping gate. Keep false until Act 2 is physically accepted.
const ACT2_PRODUCTION_ENABLED = false;

export default function Act2Page() {
  return <Act2Runtime productionEnabled={ACT2_PRODUCTION_ENABLED} />;
}
