"use client";

import ChildPairingPanel from "@/components/ChildPairingPanel";

export default function PairChildPage() {
  return <main className="parent-page"><ChildPairingPanel onClose={() => { window.location.href = "/"; }} /></main>;
}
