"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  advanceMinigolf, minigolfMoving, MINI_GOLF_BALL_RADIUS, MINI_GOLF_BUMPERS,
  MINI_GOLF_HEIGHT, MINI_GOLF_HOLE, MINI_GOLF_WIDTH, startMinigolf, strikeMinigolf,
} from "../../runtime/minigames/minigolfEngine";
import styles from "./MinigolfGame.module.css";

type MinigolfGameProps = { onComplete: () => Promise<void> };

/**
 * Small landscape-friendly gameplay surface. The parent chapter owns durable
 * activity completion, story/quest state and child identity. This component
 * owns only the ephemeral ball physics and user input.
 */
export function MinigolfGame({ onComplete }: MinigolfGameProps) {
  const [ball, setBall] = useState(startMinigolf);
  const [aim, setAim] = useState({ x: 610, y: 182 });
  const [charging, setCharging] = useState(false);
  const [charge, setCharge] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const downAt = useRef<number | null>(null);
  const pointerId = useRef<number | null>(null);
  // iOS Safari may suppress click or pointerup for a touch-and-hold gesture.
  // Preserve pointer, touch, and plain click paths without firing twice.
  const handledRelease = useRef(false);
  const moving = minigolfMoving(ball);

  useEffect(() => {
    if (!moving) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last > 0) {
        const dt = Math.min((now - last) / 1000, 0.048);
        setBall(current => advanceMinigolf(current, dt));
      }
      last = now;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [moving]);

  useEffect(() => {
    if (!charging) return;
    let frame = 0;
    const tick = () => {
      setCharge(Math.min(1, Math.max(0, (performance.now() - (downAt.current ?? performance.now())) / 1100)));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [charging]);

  function aimAt(event: ReactPointerEvent<SVGSVGElement>) {
    if (moving || ball.holed || charging || saving) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // SVG uses preserveAspectRatio="meet": account for the letterboxing in
    // landscape layouts, otherwise aim and touch targets don't line up.
    const scale = Math.min(rect.width / MINI_GOLF_WIDTH, rect.height / MINI_GOLF_HEIGHT);
    if (!scale) return;
    const padX = (rect.width - MINI_GOLF_WIDTH * scale) / 2;
    const padY = (rect.height - MINI_GOLF_HEIGHT * scale) / 2;
    setAim({
      x: Math.min(MINI_GOLF_WIDTH, Math.max(0, (event.clientX - rect.left - padX) / scale)),
      y: Math.min(MINI_GOLF_HEIGHT, Math.max(0, (event.clientY - rect.top - padY) / scale)),
    });
  }
  function beginCharge() {
    if (moving || ball.holed || saving || downAt.current !== null) return false;
    downAt.current = performance.now();
    handledRelease.current = false;
    setCharge(0);
    setCharging(true);
    return true;
  }
  function releaseCharge(shoot: boolean) {
    const began = downAt.current;
    if (began === null) return;
    downAt.current = null;
    setCharging(false);
    setCharge(0);
    if (shoot && !ball.holed && !minigolfMoving(ball)) {
      const power = Math.min(1, Math.max(0.12, (performance.now() - began) / 1100));
      handledRelease.current = true;
      setBall(prev => strikeMinigolf(prev, aim, power));
      setError("");
    }
  }
  function onForceDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (beginCharge()) {
      pointerId.current = event.pointerId;
      // Pointer capture can fail on older iOS WebKit versions. Touch end and
      // the native click fallback still need to work if it does.
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* touch fallback */ }
    }
  }
  function onForceUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    releaseCharge(true);
  }
  function onForceCancel(event: ReactPointerEvent<HTMLButtonElement>) {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    releaseCharge(false);
  }
  function onForceClick() {
    // A normal tap must also shoot. Some iPhone browsers send click but omit
    // pointerup/touchend when focus or the browser's gesture recognizer wins.
    if (handledRelease.current) {
      handledRelease.current = false;
      return;
    }
    if (ball.holed || minigolfMoving(ball) || saving) return;
    // Click-only fallback. Hold duration is used when we saw a press-start.
    const began = downAt.current;
    downAt.current = null;
    setCharging(false);
    setCharge(0);
    const power = began === null ? .25 : Math.min(1, Math.max(.12, (performance.now() - began) / 1100));
    setBall(prev => strikeMinigolf(prev, aim, power));
    setError("");
  }
  function onForceKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) beginCharge();
  }
  function onForceKeyUp(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    releaseCharge(true);
  }
  async function finish() {
    if (!ball.holed || saving) return;
    setSaving(true);
    setError("");
    try {
      await onComplete();
    } catch {
      setError("Kunde inte spara resultatet. Försök igen.");
    } finally {
      setSaving(false);
    }
  }
  const aimDirection = Math.atan2(aim.y - ball.y, aim.x - ball.x);
  const aimLength = 64;
  return (
    <section className={styles.overlay} role="dialog" aria-modal="true" aria-label="Minigolf">
      <header className={styles.header}>
        <div><span className={styles.kicker}>FOLKPARKENS MINIGOLF</span><strong className={styles.heading}>Första banan</strong></div>
        <div className={styles.stroke}>Slag <strong>{ball.strokes}</strong></div>
      </header>
      <div className={styles.course}>
        <svg
          role="img"
          aria-label="Minigolfbana med boll, hinder och hål. Peka där du vill slå."
          viewBox={`0 0 ${MINI_GOLF_WIDTH} ${MINI_GOLF_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={aimAt}
          className={styles.field}
        >
          <rect x="13" y="13" width="694" height="334" rx="48" fill="#c6a87b"/>
          <rect x="25" y="25" width="670" height="310" rx="36" fill="#477e58"/>
          <rect x="41" y="41" width="638" height="278" rx="22" fill="#579269" stroke="#82ad7c" strokeWidth="4"/>
          <path d="M120 67 Q340 120 620 58 M125 294 Q345 245 615 304" stroke="#b8d8a7" opacity=".16" strokeWidth="6" fill="none"/>
          {MINI_GOLF_BUMPERS.map((bumper,i) => (
            <g key={i}>
              <circle cx={bumper.x+3} cy={bumper.y+5} r={bumper.radius+2} fill="#1d513e" opacity=".5"/>
              <circle cx={bumper.x} cy={bumper.y} r={bumper.radius} fill="#bda486" stroke="#f3dcab" strokeWidth="5"/>
              <circle cx={bumper.x} cy={bumper.y} r={bumper.radius-9} fill="#8d7155"/>
            </g>
          ))}
          <circle cx={MINI_GOLF_HOLE.x} cy={MINI_GOLF_HOLE.y} r="20" fill="#bed7b3"/>
          <circle cx={MINI_GOLF_HOLE.x} cy={MINI_GOLF_HOLE.y} r={MINI_GOLF_HOLE.radius} fill="#172d27"/>
          <path d={`M${MINI_GOLF_HOLE.x} ${MINI_GOLF_HOLE.y} V91`} stroke="#f4efe1" strokeWidth="3"/>
          <path d={`M${MINI_GOLF_HOLE.x} 91 L${MINI_GOLF_HOLE.x+34} 102 L${MINI_GOLF_HOLE.x} 116 Z`} fill="#e6a55d"/>
          {!moving && !ball.holed && (
            <>
              <line x1={ball.x} y1={ball.y}
                x2={ball.x+Math.cos(aimDirection)*aimLength}
                y2={ball.y+Math.sin(aimDirection)*aimLength}
                stroke="#fff5b5" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 7"/>
              <circle cx={aim.x} cy={aim.y} r="14" fill="none" stroke="#fff5b5" strokeWidth="3" strokeDasharray="4 4"/>
            </>
          )}
          {!ball.holed && <>
            <ellipse cx={ball.x+3} cy={ball.y+5} rx={MINI_GOLF_BALL_RADIUS+2} ry="6" fill="#193c2f" opacity=".4"/>
            <circle cx={ball.x} cy={ball.y} r={MINI_GOLF_BALL_RADIUS} fill="#fffdf0" stroke="#c8d7cb" strokeWidth="2"/>
            <circle cx={ball.x-3} cy={ball.y-3} r="2" fill="#ffffff"/>
          </>}
        </svg>
      </div>
      <div className={styles.controls}>
        {ball.holed ? (
          <>
            <p className={styles.instructions}>I hål på {ball.strokes} slag! Bra spelat.</p>
            <button type="button" className={styles.action} disabled={saving} onClick={() => void finish()}>
              {saving ? "Sparar…" : "Fortsätt berättelsen"}
            </button>
          </>
        ) : (
          <>
            <p className={styles.instructions}>{moving ? "Bollen rullar…" : "Peka på banan för att sikta. Håll inne Slå för styrka och släpp."}</p>
            <div className={styles.power} aria-label={`Slagstyrka ${Math.round(charge*100)} procent`}><span style={{ width:`${Math.round(charge*100)}%` }}/></div>
            <button type="button" className={styles.action} disabled={moving || saving}
              onPointerDown={onForceDown} onPointerUp={onForceUp} onPointerCancel={onForceCancel}
              onTouchStart={() => { beginCharge(); }} onTouchEnd={() => releaseCharge(true)}
              onTouchCancel={() => releaseCharge(false)}
              onClick={onForceClick}
              onKeyDown={onForceKeyDown} onKeyUp={onForceKeyUp} onBlur={() => releaseCharge(false)}>
              {charging ? "Släpp för att slå" : "Tryck eller håll · Slå"}
            </button>
            <button type="button" className={styles.reset} disabled={moving || saving} onClick={() => {
              releaseCharge(false); setBall(startMinigolf()); setAim({x:610,y:182});setError("");
            }}>Börja om banan</button>
          </>
        )}
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </section>
  );
}
