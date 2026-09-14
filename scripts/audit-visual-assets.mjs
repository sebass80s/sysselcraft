import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const roots = ["src", "public/assets"];
const allowedExtensions = new Set([".css", ".svg", ".ts", ".tsx"]);

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
let crispSvgCount = 0;

for (const path of files) {
  const content = await readFile(path, "utf8");
  const shownPath = relative(process.cwd(), path);

  if (extname(path) === ".svg") {
    svgCount += 1;
    if (!/<svg\b/i.test(content)) problems.push(`${shownPath}: missing <svg> root`);
    if (!/\bviewBox\s*=\s*["'][^"']+["']/i.test(content)) problems.push(`${shownPath}: missing viewBox`);
    if (/shape-rendering\s*=\s*["']crispEdges["']/i.test(content)) crispSvgCount += 1;
  }
}

const grass = await readFile("public/assets/village/grass-tile.svg", "utf8");
const grassSize = grass.match(/viewBox\s*=\s*["']0\s+0\s+(\d+)\s+(\d+)["']/i);
if (!grassSize || Number(grassSize[1]) < 256 || Number(grassSize[2]) < 256) {
  problems.push(
    "public/assets/village/grass-tile.svg: base meadow texture is too small and risks visible repetition",
  );
}

const uiCss = await readFile("src/app/storybook.css", "utf8");
if (!/image-rendering\s*:\s*pixelated/i.test(uiCss)) {
  problems.push("src/app/storybook.css: game canvas must opt into pixelated presentation");
}

const house = await readFile("public/assets/village/family-house.svg", "utf8");
if (!/shape-rendering\s*=\s*["']crispEdges["']/i.test(house)) {
  problems.push("public/assets/village/family-house.svg: flagship building must use crisp pixel geometry");
}

const gameSource = await readFile("src/game/createVillageGame.ts", "utf8");
if (!/setDepth\(1000\s*\+\s*Math\.round\(/.test(gameSource)) {
  problems.push("src/game/createVillageGame.ts: dynamic Y/base depth sorting is missing");
}
if (!/baseY\s*=\s*y/.test(gameSource)) {
  problems.push("src/game/createVillageGame.ts: rendered base depth must remain independently configurable");
}

if (crispSvgCount < 6) {
  problems.push(
    `public/assets: only ${crispSvgCount} SVGs declare crispEdges; the 2.5D pixel-art conversion is not broad enough`,
  );
}

if (problems.length) {
  console.error("Visual regression audit failed:");
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}

console.log(
  `Visual regression audit passed: ${files.length} source/asset files checked, ${svgCount} SVGs validated, ${crispSvgCount} crisp pixel-art SVGs detected.`,
);
