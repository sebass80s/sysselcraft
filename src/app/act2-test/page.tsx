import { notFound } from "next/navigation";

import { Act2Runtime } from "../../components/Act2Runtime";

const ACT2_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

export default function Act2TestPage() {
  if (!ACT2_DEBUG_LAB_ENABLED) notFound();
  return <Act2Runtime debug />;
}
