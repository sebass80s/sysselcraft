import { notFound } from "next/navigation";

import { Act3Skeleton } from "../../components/Act3Skeleton";

const ACT3_DEBUG_LAB_ENABLED = process.env.NODE_ENV !== "production";

export default function Act3TestPage() {
  if (!ACT3_DEBUG_LAB_ENABLED) notFound();
  return <Act3Skeleton debug />;
}
