/** Deterministic, chapter-independent minigolf physics. Coordinates in a 720x360 course. */
export const MINI_GOLF_WIDTH = 720;
export const MINI_GOLF_HEIGHT = 360;
export const MINI_GOLF_HOLE = { x: 630, y: 182, radius: 17 } as const;
export const MINI_GOLF_START = { x: 85, y: 182 } as const;
export const MINI_GOLF_BALL_RADIUS = 9;
export const MINI_GOLF_BUMPERS = [
  { x: 340, y: 90, radius: 33 },
  { x: 340, y: 270, radius: 33 },
  { x: 468, y: 178, radius: 24 },
] as const;
export type MinigolfShot = {
  x: number; y: number; vx: number; vy: number;
  strokes: number; holed: boolean;
};
export const startMinigolf = (): MinigolfShot => ({ ...MINI_GOLF_START, vx: 0, vy: 0, strokes: 0, holed: false });
export const minigolfMoving = (ball: MinigolfShot) => Math.hypot(ball.vx, ball.vy) > 0;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const distance = (x: number, y: number, bx: number, by: number) => Math.hypot(x - bx, y - by);
/** Aiming means pointing from the ball towards a tapped location; force comes from hold duration. */
export function strikeMinigolf(ball: MinigolfShot, target: {x: number; y: number}, charge: number): MinigolfShot {
  if (ball.holed || minigolfMoving(ball)) return ball;
  if (!Number.isFinite(charge) || !Number.isFinite(target.x) || !Number.isFinite(target.y)) return ball;
  const deltaX = target.x - ball.x, deltaY = target.y - ball.y;
  const len = Math.hypot(deltaX, deltaY);
  if (len < 4) return ball;
  const power = clamp(charge, 0.12, 1);
  const speed = 200 + power * 520;
  return { ...ball, vx: deltaX / len * speed, vy: deltaY / len * speed, strokes: ball.strokes + 1 };
}
/** Fixed subdivision prevents frame spikes from tunnelling through rails or bumpers. */
export function advanceMinigolf(ball: MinigolfShot, dtSeconds: number): MinigolfShot {
  if (ball.holed || !minigolfMoving(ball)) return ball;
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) return ball;
  let { x, y, vx, vy } = ball;
  const subdivisions = Math.ceil(Math.min(dtSeconds, 0.064) / (1 / 180));
  const step = Math.min(dtSeconds, 0.064) / subdivisions;
  for (let i = 0; i < subdivisions; i++) {
    x += vx * step; y += vy * step;
    const r = MINI_GOLF_BALL_RADIUS;
    if (x < 24 + r) { x = 24 + r; vx = Math.abs(vx) * .65; }
    if (x > MINI_GOLF_WIDTH - 24 - r) { x = MINI_GOLF_WIDTH - 24 - r; vx = -Math.abs(vx) * .65; }
    if (y < 24 + r) { y = 24 + r; vy = Math.abs(vy) * .65; }
    if (y > MINI_GOLF_HEIGHT - 24 - r) { y = MINI_GOLF_HEIGHT - 24 - r; vy = -Math.abs(vy) * .65; }
    for (const bump of MINI_GOLF_BUMPERS) {
      const dx = x - bump.x, dy = y - bump.y;
      const minDist = bump.radius + r;
      const d = Math.hypot(dx, dy);
      if (d >= minDist) continue;
      const nx = d > 0.001 ? dx / d : 1, ny = d > 0.001 ? dy / d : 0;
      x = bump.x + nx * minDist; y = bump.y + ny * minDist;
      const inward = vx * nx + vy * ny;
      if (inward < 0) { vx -= 1.65 * inward * nx; vy -= 1.65 * inward * ny; }
    }
    if (distance(x, y, MINI_GOLF_HOLE.x, MINI_GOLF_HOLE.y) < MINI_GOLF_HOLE.radius
        && Math.hypot(vx, vy) < 300) {
      return { x: MINI_GOLF_HOLE.x, y: MINI_GOLF_HOLE.y, vx: 0, vy: 0, strokes: ball.strokes, holed: true };
    }
    const damping = Math.exp(-2.7 * step);
    vx *= damping; vy *= damping;
  }
  if (Math.hypot(vx, vy) < 8) { vx = 0; vy = 0; }
  return { x, y, vx, vy, strokes: ball.strokes, holed: false };
}
