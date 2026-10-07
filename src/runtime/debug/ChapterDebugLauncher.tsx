"use client";

import { useRef } from "react";

type ChapterDebugLauncherProps = {
  enabled: boolean;
  label: string;
  onOpen: () => void;
};

export function ChapterDebugLauncher({
  enabled,
  label,
  onOpen,
}: ChapterDebugLauncherProps) {
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCountRef = useRef(0);
  const tapResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!enabled) return null;

  const cancelHold = () => {
    if (!holdTimerRef.current) return;
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  };

  const open = () => {
    cancelHold();
    onOpen();
  };

  const startHold = () => {
    cancelHold();
    holdTimerRef.current = setTimeout(open, 650);
  };

  const registerTap = () => {
    tapCountRef.current += 1;
    if (tapResetRef.current) clearTimeout(tapResetRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      open();
      return;
    }
    tapResetRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      tapResetRef.current = null;
    }, 1800);
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch") startHold();
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "touch") cancelHold();
      }}
      onPointerCancel={(event) => {
        if (event.pointerType !== "touch") cancelHold();
      }}
      onClick={registerTap}
      onContextMenu={(event) => event.preventDefault()}
      style={{
        position: "absolute",
        top: "max(8px, env(safe-area-inset-top))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 35,
        border: 0,
        borderRadius: 999,
        padding: "6px 11px",
        background: "rgba(22,28,22,.72)",
        color: "rgba(255,255,255,.82)",
        fontSize: 12,
        fontWeight: 800,
        touchAction: "none",
      }}
    >
      {label}
    </button>
  );
}
