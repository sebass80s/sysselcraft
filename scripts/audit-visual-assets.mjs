import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const roots = ["src", "public/assets"];
const allowedExtensions = new Set([".css", ".svg", ".ts", ".tsx"]);

const forbidden = [
  { label: "SVG crispEdges rendering", pattern: /shape-rendering\s*=\s*["']crispEdges["']/i },
  { label: "pixelated CSS image rendering", pattern: /image-rendering\s*:\s*(?:pixelated|crisp-edges)/i },
  { label: "Phaser pixelArt enabled", pattern: /\bpixelArt\s*:\s*true\b/ },
  { label: "Phaser antialias disabled", pattern: /\bantialias\s*:\s*false\b/ },
  { label: "forced rounded pixels", pattern: /\broundPixels\s*:\s*true\b/ },
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

if (problems.length) {
  console.error("Visual regression audit failed:");
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}

console.log(
  `Visual regression audit passed: ${files.length} source/asset files checked, ${svgCount} SVGs validated.`,
);
