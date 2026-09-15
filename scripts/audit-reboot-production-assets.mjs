import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const root = join(process.cwd(), "public/assets/village/reboot/production");

const buildingNames = ["recycling-centre", "bakery", "doctor-house"];
const characterNames = ["child", "linus", "henning", "sol"];
const facings = ["north", "south", "east", "west"];
const motions = ["idle", "walk"];

const expected = [];
for (const building of buildingNames) {
  for (let stage = 1; stage <= 4; stage += 1) {
    expected.push(`buildings/${building}/stage-${stage}.webp`);
  }
}
for (const character of characterNames) {
  if (character === "henning" || character === "sol") {
    expected.push(`characters/${character}/reference.webp`);
  }
  for (const motion of motions) {
    for (const facing of facings) {
      expected.push(`characters/${character}/${motion}-${facing}-01.webp`);
      expected.push(`characters/${character}/${motion}-${facing}-02.webp`);
    }
  }
}

function isWebP(bytes) {
  return bytes.length >= 12
    && bytes.subarray(0, 4).toString("ascii") === "RIFF"
    && bytes.subarray(8, 12).toString("ascii") === "WEBP";
}

async function inspect(relativePath) {
  const absolutePath = join(root, relativePath);
  try {
    const info = await stat(absolutePath);
    const bytes = await readFile(absolutePath);
    const validSignature = extname(relativePath) === ".webp" ? isWebP(bytes) : true;
    return {
      path: relativePath,
      exists: true,
      bytes: info.size,
      validSignature,
    };
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return { path: relativePath, exists: false, bytes: 0, validSignature: false };
    }
    throw error;
  }
}

const results = await Promise.all(expected.map(inspect));
const missing = results.filter((item) => !item.exists);
const corrupt = results.filter((item) => item.exists && !item.validSignature);
const present = results.filter((item) => item.exists && item.validSignature);

console.log(`Sysselcraft production assets: ${present.length}/${expected.length} present with valid signatures.`);
if (missing.length) {
  console.log(`\nMissing (${missing.length}):`);
  missing.forEach((item) => console.log(`  - ${item.path}`));
}
if (corrupt.length) {
  console.log(`\nInvalid signature (${corrupt.length}):`);
  corrupt.forEach((item) => console.log(`  - ${item.path}`));
}
if (!missing.length && !corrupt.length) {
  console.log("\nFile presence/signature gate passed. Runtime visual verification is still required.");
}

process.exitCode = missing.length || corrupt.length ? 1 : 0;
