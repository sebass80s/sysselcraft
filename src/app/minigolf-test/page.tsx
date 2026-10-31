import { notFound } from "next/navigation";
import { MinigolfTouchLab } from "../../components/minigames/MinigolfTouchLab";

/** A dev-only manual touch laboratory. Never included in shipping builds. */
export default function MinigolfTestPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MinigolfTouchLab />;
}
