import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const roots = ["src", "public/assets"];
const allowedExtensions = new Set([".css", ".svg", ".ts", ".tsx"]);

const forbidden = [
  { label: "Phaser pixelArt disabled", pattern: /\bpixelArt\s*:\s*false\b/ },
  { label: "Phaser antialias enabled", pattern: /\bantialias\s*:\s*true\b/ },
  { label: "Phaser rounded pixels disabled", pattern: /\broundPixels\s*:\s*false\b/ },
];

async function walk(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];
  const entries = await readdir(path);
  const nested = await Promise.all(entries.map((entry) => walk(join(path, entry))));
  return nested.flat();
}

const files = (await Promise.all(roots.map((root) => walk(root))))
  .flat()
  .filter((path) => allowedExtensions.has(extname(path)));

const problems = [];
let svgCount = 0;

for (const path of files) {
  const content = await readFile(path, "utf8");
  const shownPath = relative(process.cwd(), path);
  for (const rule of forbidden) {
    if (rule.pattern.test(content)) problems.push(`${shownPath}: ${rule.label}`);
  }
  if (extname(path) === ".svg") {
    svgCount += 1;
    if (!/<svg\b/i.test(content)) problems.push(`${shownPath}: missing <svg> root`);
    if (!/\bviewBox\s*=\s*["'][^"']+["']/i.test(content)) problems.push(`${shownPath}: missing viewBox`);
  }
}

const grass = await readFile("public/assets/village/grass-tile.svg", "utf8");
const grassSize = grass.match(/viewBox\s*=\s*["']0\s+0\s+(\d+)\s+(\d+)["']/i);
if (!grassSize || Number(grassSize[1]) < 256 || Number(grassSize[2]) < 256) {
  problems.push(
    "public/assets/village/grass-tile.svg: base meadow texture is too small and risks visible repetition",
  );
}

const gameSource = await readFile("src/game/createVillageGame.ts", "utf8");
for (const [label, pattern] of [
  ["Phaser pixelArt must be enabled", /\bpixelArt\s*:\s*true\b/],
  ["Phaser antialias must be disabled", /\bantialias\s*:\s*false\b/],
  ["Phaser roundPixels must be enabled", /\broundPixels\s*:\s*true\b/],
]) {
  if (!pattern.test(gameSource)) problems.push(`src/game/createVillageGame.ts: ${label}`);
}

if (problems.length) {
  console.error("Visual regression audit failed:");
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}

console.log(
  `Visual regression audit passed: ${files.length} source/asset files checked, ${svgCount} SVGs validated for the pixel-art 2.5D direction.`,
);
