import type { GameObjects, Input, Types } from "phaser";

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 640;
const GRID = 32;
const PLAYER_RADIUS = 14;

type Point = { x: number; y: number };
type Obstacle =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number };

const obstacles: Obstacle[] = [
  { type: "rect", x: 150, y: 165, width: 190, height: 125 },
  { type: "rect", x: 675, y: 405, width: 180, height: 105 },
  { type: "circle", x: 105, y: 115, radius: 28 },
  { type: "circle", x: 155, y: 485, radius: 28 },
  { type: "circle", x: 410, y: 105, radius: 28 },
  { type: "circle", x: 790, y: 120, radius: 28 },
  { type: "circle", x: 875, y: 475, radius: 28 },
];

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isWalkable(point: Point) {
  if (
    point.x < PLAYER_RADIUS ||
    point.y < PLAYER_RADIUS ||
    point.x > WORLD_WIDTH - PLAYER_RADIUS ||
    point.y > WORLD_HEIGHT - PLAYER_RADIUS
  ) {
    return false;
  }

  return !obstacles.some((obstacle) => {
    if (obstacle.type === "rect") {
      const halfW = obstacle.width / 2 + PLAYER_RADIUS;
      const halfH = obstacle.height / 2 + PLAYER_RADIUS;
      return Math.abs(point.x - obstacle.x) <= halfW && Math.abs(point.y - obstacle.y) <= halfH;
    }

    return distance(point, obstacle) <= obstacle.radius + PLAYER_RADIUS;
  });
}

function cellToPoint(cx: number, cy: number): Point {
  return { x: cx * GRID + GRID / 2, y: cy * GRID + GRID / 2 };
}

function pointToCell(point: Point) {
  return {
    x: clamp(Math.floor(point.x / GRID), 0, Math.floor(WORLD_WIDTH / GRID) - 1),
    y: clamp(Math.floor(point.y / GRID), 0, Math.floor(WORLD_HEIGHT / GRID) - 1),
  };
}

function findNearestWalkableCell(point: Point) {
  const origin = pointToCell(point);
  const maxRadius = 8;

  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let y = origin.y - radius; y <= origin.y + radius; y += 1) {
      for (let x = origin.x - radius; x <= origin.x + radius; x += 1) {
        if (x < 0 || y < 0 || x >= WORLD_WIDTH / GRID || y >= WORLD_HEIGHT / GRID) continue;
        if (isWalkable(cellToPoint(x, y))) return { x, y };
      }
    }
  }

  return origin;
}

function findPath(startPoint: Point, endPoint: Point): Point[] {
  const start = findNearestWalkableCell(startPoint);
  const goal = findNearestWalkableCell(endPoint);
  const key = (x: number, y: number) => `${x},${y}`;
  const open = new Map<string, { x: number; y: number; g: number; f: number }>();
  const cameFrom = new Map<string, string>();
  const closed = new Set<string>();

  const heuristic = (x: number, y: number) => Math.hypot(goal.x - x, goal.y - y);
  open.set(key(start.x, start.y), { ...start, g: 0, f: heuristic(start.x, start.y) });

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  while (open.size > 0) {
    const current = [...open.values()].reduce((best, node) => (node.f < best.f ? node : best));
    const currentKey = key(current.x, current.y);
    open.delete(currentKey);

    if (current.x === goal.x && current.y === goal.y) {
      const cells = [{ x: current.x, y: current.y }];
      let cursor = currentKey;
      while (cameFrom.has(cursor)) {
        cursor = cameFrom.get(cursor)!;
        const [x, y] = cursor.split(",").map(Number);
        cells.push({ x, y });
      }
      return cells.reverse().slice(1).map((cell) => cellToPoint(cell.x, cell.y));
    }

    closed.add(currentKey);

    for (const [dx, dy] of directions) {
      const x = current.x + dx;
      const y = current.y + dy;
      const nextKey = key(x, y);
      if (closed.has(nextKey) || x < 0 || y < 0 || x >= WORLD_WIDTH / GRID || y >= WORLD_HEIGHT / GRID) continue;
      if (!isWalkable(cellToPoint(x, y))) continue;

      if (dx !== 0 && dy !== 0) {
        if (!isWalkable(cellToPoint(current.x + dx, current.y)) || !isWalkable(cellToPoint(current.x, current.y + dy))) continue;
      }

      const stepCost = dx !== 0 && dy !== 0 ? Math.SQRT2 : 1;
      const g = current.g + stepCost;
      const existing = open.get(nextKey);
      if (existing && g >= existing.g) continue;

      cameFrom.set(nextKey, currentKey);
      open.set(nextKey, { x, y, g, f: g + heuristic(x, y) });
    }
  }

  return [];
}

export async function createVillageGame(parent: HTMLElement) {
  const Phaser = await import("phaser");

  class VillageScene extends Phaser.Scene {
    private player?: GameObjects.Arc;
    private path: Point[] = [];
    private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
    private targetMarker?: GameObjects.Arc;

    create() {
      this.cameras.main.setBackgroundColor("#9fc77c");
      this.drawVillage();

      this.player = this.add.circle(430, 405, PLAYER_RADIUS, 0xefc04f).setStrokeStyle(4, 0x6e531d).setDepth(20);
      this.targetMarker = this.add.circle(430, 405, 7, 0xffffff, 0.35).setStrokeStyle(2, 0x6e531d, 0.65).setVisible(false);

      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" });
        this.wasd = keys as Record<"up" | "down" | "left" | "right", Input.Keyboard.Key>;
      }

      this.input.on("pointerdown", (pointer: Input.Pointer) => {
        if (!this.player) return;
        const target = { x: pointer.worldX, y: pointer.worldY };
        this.path = findPath({ x: this.player.x, y: this.player.y }, target);
        const finalPoint = this.path.at(-1);
        if (finalPoint) this.targetMarker?.setPosition(finalPoint.x, finalPoint.y).setVisible(true);
      });
    }

    update(_: number, delta: number) {
      if (!this.player) return;

      const keyboardVector = this.getKeyboardVector();
      if (keyboardVector.lengthSq() > 0) {
        this.path = [];
        this.targetMarker?.setVisible(false);
        keyboardVector.normalize().scale(190 * (delta / 1000));
        this.tryMove(keyboardVector.x, keyboardVector.y);
        return;
      }

      const next = this.path[0];
      if (!next) return;

      const current = { x: this.player.x, y: this.player.y };
      const remaining = distance(current, next);
      if (remaining < 4) {
        this.path.shift();
        if (this.path.length === 0) this.targetMarker?.setVisible(false);
        return;
      }

      const speed = Math.min(180 * (delta / 1000), remaining);
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      this.tryMove(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    private getKeyboardVector() {
      const vector = new Phaser.Math.Vector2();
      const up = this.cursors?.up.isDown || this.wasd?.up.isDown;
      const down = this.cursors?.down.isDown || this.wasd?.down.isDown;
      const left = this.cursors?.left.isDown || this.wasd?.left.isDown;
      const right = this.cursors?.right.isDown || this.wasd?.right.isDown;

      if (up) vector.y -= 1;
      if (down) vector.y += 1;
      if (left) vector.x -= 1;
      if (right) vector.x += 1;
      return vector;
    }

    private tryMove(dx: number, dy: number) {
      if (!this.player) return;
      const nextX = { x: this.player.x + dx, y: this.player.y };
      if (isWalkable(nextX)) this.player.x = nextX.x;

      const nextY = { x: this.player.x, y: this.player.y + dy };
      if (isWalkable(nextY)) this.player.y = nextY.y;
    }

    private drawVillage() {
      const road = this.add.rectangle(490, 360, 1100, 82, 0xc8b384).setAngle(-18);
      road.setStrokeStyle(3, 0xb49d72, 0.8);

      this.add.rectangle(150, 165, 190, 125, 0xd7c2a1).setStrokeStyle(4, 0x755c45).setDepth(5);
      this.add.text(94, 155, "Familjens hus", { color: "#2b241e", fontSize: "15px" }).setDepth(6);

      const linus = this.add.circle(575, 285, 18, 0x3d6fb6).setStrokeStyle(4, 0x1f3e69).setDepth(10);
      this.add.text(linus.x - 22, linus.y - 42, "Linus", {
        color: "#17324f",
        fontSize: "14px",
        backgroundColor: "#ffffffcc",
        padding: { x: 4, y: 2 },
      }).setDepth(11);
      this.add.rectangle(linus.x + 21, linus.y + 12, 4, 34, 0x6c4a2f).setAngle(8).setDepth(11);

      this.add.rectangle(675, 405, 180, 105, 0xa8845b).setStrokeStyle(3, 0x6e543a).setDepth(5);
      this.add.text(613, 397, "Tom byggplats", { color: "#fff5dc", fontSize: "14px" }).setDepth(6);

      const treePoints: Point[] = [
        { x: 105, y: 115 }, { x: 155, y: 485 }, { x: 410, y: 105 }, { x: 790, y: 120 }, { x: 875, y: 475 },
      ];
      treePoints.forEach(({ x, y }) => this.add.circle(x, y, 28, 0x4f8a46).setStrokeStyle(5, 0x376d31).setDepth(8));

      this.add.text(18, 18, "Sysselcraft 0.1 · pathfinding + collision", {
        color: "#203020",
        fontSize: "15px",
        backgroundColor: "#ffffffcc",
        padding: { x: 7, y: 5 },
      }).setDepth(30);
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: "#9fc77c",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
    },
    scene: VillageScene,
  });

  return () => game.destroy(true);
}
