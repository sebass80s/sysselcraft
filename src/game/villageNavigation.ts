import { getVisualProductionObstacles } from "./visualProductionAssets";
export const VIEW_HEIGHT = 640;
export const WORLD_MIN_X = -480;
export const WORLD_MAX_X = 1440;
export const WORLD_WIDTH = WORLD_MAX_X - WORLD_MIN_X;
export const WORLD_HEIGHT = 640;
export const GRID = 32;
export const GRID_COLS = Math.ceil(WORLD_WIDTH / GRID);
export const GRID_ROWS = Math.ceil(WORLD_HEIGHT / GRID);
export const PLAYER_RADIUS = 14;

export type Point = { x: number; y: number };
export type Obstacle =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number };

// v4 image pixels map to world coordinates as x = imageX - 480, y = imageY.
// Ground footprints only; tall artwork is handled separately by foreground masks.
export const STATIC_OBSTACLES: Obstacle[] = [
  { type: "rect", x: -245, y: 250, width: 280, height: 100 }, // cottage and porch
  { type: "rect", x: 175, y: 366, width: 140, height: 48 }, // board / bench
  { type: "rect", x: 80, y: 366, width: 32, height: 30 }, // mailbox post
  { type: "circle", x: 267, y: 373, radius: 23 }, // flower tub
  { type: "circle", x: 332, y: 374, radius: 15 }, // lamp foot
  { type: "rect", x: 460, y: 399, width: 125, height: 62 }, // well masonry
  { type: "circle", x: 750, y: 588, radius: 43 }, // foreground pine trunk
  { type: "rect", x: -290, y: 537, width: 190, height: 42 }, // left low wall
  { type: "rect", x: 1160, y: 574, width: 170, height: 35 }, // foreground fence
  { type: "rect", x: 1190, y: 80, width: 500, height: 160 }, // lake (no exit yet)
  { type: "rect", x: 1320, y: 195, width: 240, height: 80 }, // shore / wall
];
export const REQUIRED_APPROACHES = {
  spawn: { x: 20, y: 455 },
  linus: { x: 230, y: 460 },
  house: { x: -310, y: 340 },
};
const obstacles: Obstacle[] = [...STATIC_OBSTACLES, ...getVisualProductionObstacles()];
function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

export function isWalkable(p: Point, blocking: readonly Obstacle[] = obstacles) {
  if (
    p.x < WORLD_MIN_X + PLAYER_RADIUS ||
    p.y < PLAYER_RADIUS ||
    p.x > WORLD_MAX_X - PLAYER_RADIUS ||
    p.y > WORLD_HEIGHT - PLAYER_RADIUS
  ) {
    return false;
  }
  return !blocking.some((o) =>
    o.type === "rect"
      ? Math.abs(p.x - o.x) <= o.width / 2 + PLAYER_RADIUS &&
        Math.abs(p.y - o.y) <= o.height / 2 + PLAYER_RADIUS
      : distance(p, o) <= o.radius + PLAYER_RADIUS,
  );
}

function cellToPoint(cx: number, cy: number): Point {
  return { x: WORLD_MIN_X + cx * GRID + GRID / 2, y: cy * GRID + GRID / 2 };
}

function pointToCell(p: Point) {
  return {
    x: clamp(Math.floor((p.x - WORLD_MIN_X) / GRID), 0, GRID_COLS - 1),
    y: clamp(Math.floor(p.y / GRID), 0, GRID_ROWS - 1),
  };
}

function findNearestWalkableCell(point: Point, blocking: readonly Obstacle[]) {
  const origin = pointToCell(point);
  for (let r = 0; r <= 8; r++) {
    for (let y = origin.y - r; y <= origin.y + r; y++) {
      for (let x = origin.x - r; x <= origin.x + r; x++) {
        if (
          x >= 0 && y >= 0 && x < GRID_COLS && y < GRID_ROWS &&
          isWalkable(cellToPoint(x, y), blocking)
        ) return { x, y };
      }
    }
  }
  return origin;
}

/** Recover safely if a newly revealed footprint contains the player. */
export function nearestWalkablePoint(point: Point, blocking: readonly Obstacle[]): Point {
  const cell = findNearestWalkableCell(point, blocking);
  return cellToPoint(cell.x, cell.y);
}

export function findPath(startPoint: Point, endPoint: Point, blocking: readonly Obstacle[] = obstacles): Point[] {
  const start = findNearestWalkableCell(startPoint, blocking);
  const goal = findNearestWalkableCell(endPoint, blocking);
  const key = (x: number, y: number) => `${x},${y}`;
  const open = new Map<string, { x: number; y: number; g: number; f: number }>();
  const came = new Map<string, string>();
  const closed = new Set<string>();
  const h = (x: number, y: number) => Math.hypot(goal.x - x, goal.y - y);
  open.set(key(start.x, start.y), { ...start, g: 0, f: h(start.x, start.y) });
  const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while (open.size) {
    const c = [...open.values()].reduce((best, next) => next.f < best.f ? next : best);
    const ck = key(c.x, c.y);
    open.delete(ck);
    if (c.x === goal.x && c.y === goal.y) {
      const cells = [{ x: c.x, y: c.y }];
      let cursor = ck;
      while (came.has(cursor)) {
        cursor = came.get(cursor)!;
        const [x, y] = cursor.split(",").map(Number);
        cells.push({ x, y });
      }
      return cells.reverse().slice(1).map((q) => cellToPoint(q.x, q.y));
    }
    closed.add(ck);
    for (const [dx, dy] of dirs) {
      const x = c.x + dx;
      const y = c.y + dy;
      const nk = key(x, y);
      if (
        closed.has(nk) || x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS ||
        !isWalkable(cellToPoint(x, y), blocking)
      ) continue;
      if (dx && dy && (!isWalkable(cellToPoint(c.x + dx, c.y), blocking) || !isWalkable(cellToPoint(c.x, c.y + dy), blocking))) continue;
      const g = c.g + (dx && dy ? Math.SQRT2 : 1);
      const existing = open.get(nk);
      if (existing && g >= existing.g) continue;
      came.set(nk, ck);
      open.set(nk, { x, y, g, f: g + h(x, y) });
    }
  }
  return [];
}

