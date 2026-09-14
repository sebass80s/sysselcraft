"use client";

import { useState } from "react";
import { clearSaveState } from "@/game/saveState";

export default function TestResetControl() {
  const [resetting, setResetting] = useState(false);

  async function resetLocalTestSave() {
    if (resetting) return;

    const confirmed = window.confirm(
      "Nollställ den lokala testsparningen? Barnnamn, hundnamn, lokal quest, resurser och världsläge på den här enheten raderas. Backend-parningen påverkas inte.",
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      await clearSaveState();
      window.location.reload();
    } catch {
      setResetting(false);
      window.alert("Det gick inte att nollställa testsparningen.");
    }
  }

  return (
    <button
      type="button"
      onClick={resetLocalTestSave}
      disabled={resetting}
      aria-label="Nollställ lokal testsparning"
      style={{
        position: "fixed",
        top: "max(3.2rem, calc(env(safe-area-inset-top) + 2.7rem))",
        right: "max(.65rem, env(safe-area-inset-right))",
        zIndex: 60,
        border: "1px solid rgba(31,42,31,.22)",
        borderRadius: "999px",
        padding: ".45rem .65rem",
        background: "rgba(255,253,244,.94)",
        color: "#394239",
        fontSize: ".72rem",
        fontWeight: 800,
        boxShadow: "0 4px 14px rgba(0,0,0,.12)",
      }}
    >
      {resetting ? "Nollställer…" : "🧪 Nollställ test"}
    </button>
  );
}
