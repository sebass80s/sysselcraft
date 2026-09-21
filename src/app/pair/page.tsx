"use client";

import { useRouter } from "next/navigation";
import ChildPairingPanel from "@/components/ChildPairingPanel";

export default function PairChildPage() {
  const router = useRouter();
  return <main className="parent-page"><ChildPairingPanel onClose={() => router.push("/")} /></main>;
}
