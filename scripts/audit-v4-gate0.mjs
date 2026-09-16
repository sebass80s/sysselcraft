import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import sharp from 'sharp';

// Execute the actual pure navigation and production runtime modules, without a DOM.
const temporary = mkdtempSync(join(tmpdir(), 'sysselcraft-gate0-'));
try {
  for (const name of ['visualProductionAssets', 'visualProductionRuntime', 'villageNavigation']) {
    const source = readFileSync(`src/game/${name}.ts`, 'utf8');
    writeFileSync(join(temporary, `${name}.js`), ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText);
  }
  const require = createRequire(import.meta.url);
  const assets = require(join(temporary, 'visualProductionAssets.js'));
  const runtime = require(join(temporary, 'visualProductionRuntime.js'));
  const nav = require(join(temporary, 'villageNavigation.js'));
  const paths = ['public/assets/village/reboot/start-area-master-1920x640.webp',
    ...Object.values(assets.VISUAL_PRODUCTION_ASSETS).flat().map(p => `public${p}`)];
  for (const path of paths) {
    const bytes = readFileSync(path);
    const expected = execFileSync('git', ['rev-parse', `e10445dba4543a3fda5d92f5bee92227de69cbc6:${path}`], { encoding: 'utf8' }).trim();
    const actual = execFileSync('git', ['hash-object', path], { encoding: 'utf8' }).trim();
    assert.equal(actual, expected, `v4 provenance: ${path}`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, 'webp');
    await sharp(bytes).raw().toBuffer(); // Decode pixels, not just file headers.
    if (path.includes('master')) {
      assert.equal(metadata.width, 1920); assert.equal(metadata.height, 640);
    } else assert.equal(metadata.hasAlpha, true, `${path}: transparent canvas`);
  }
  console.log('PASS: 13 v4 files match source commit and decode; master is 1920×640.');
  assert.deepEqual(assets.getVisualProductionObstacles(), []);
  const scene = { add: { image(x, y, key) {
    return { x, y, key, setOrigin(x, y) { this.origin = { x, y }; return this; },
      setDisplaySize(width, height) { this.size = { width, height }; return this; },
      setDepth(depth) { this.depth = depth; return this; } };
  } } };
  assert.deepEqual(runtime.createVisualProductionBuildings(scene), []);
  for (const p of assets.VISUAL_PRODUCTION_PLACEMENTS) {
    for (const stage of [1, 2, 3, 4]) {
      const [image] = runtime.createVisualProductionBuildings(scene, { [p.building]: stage });
      assert.equal(image.x, p.x); assert.equal(image.y, p.baseY);
      assert.equal(image.depth, 1000 + p.baseY);
      assert.deepEqual(image.size, { width: p.width, height: p.height });
      assert.deepEqual(image.origin, assets.VISUAL_PRODUCTION_ORIGIN);
    }
  }
  console.log('PASS: opening sites have no images/obstacles; 12 rendered stages retain calibrated anchors/envelopes.');
  let checked = 0;
  // Check every revealed/hidden combination without changing live progression.
  for (let mask = 0; mask < 8; mask++) {
    const stages = Object.fromEntries(assets.VISUAL_PRODUCTION_PLACEMENTS
      .filter((_, index) => mask & (1 << index)).map(p => [p.building, 4]));
    const blocking = [...nav.STATIC_OBSTACLES, ...assets.getVisualProductionObstacles(stages)];
    const points = Object.entries(nav.REQUIRED_APPROACHES);
    for (const p of assets.VISUAL_PRODUCTION_PLACEMENTS) points.push([p.building, p.approach]);
    for (const [name, point] of points) assert(nav.isWalkable(point, blocking), `${mask}: ${name} walkable`);
    for (const [from, start] of points) for (const [to, end] of points) {
      if (from === to) continue;
      const path = nav.findPath(start, end, blocking);
      assert(path.length, `${mask}: ${from} -> ${to} connected`);
      // Simulate the actual axis-separated steering at 60 Hz to detect corner stalls.
      const position = { ...start };
      for (const target of path) {
        let steps = 0;
        while (Math.hypot(target.x - position.x, target.y - position.y) >= 4 && steps++ < 1000) {
          const angle = Math.atan2(target.y - position.y, target.x - position.x);
          const nx = { x: position.x + Math.cos(angle) * 3, y: position.y };
          if (nav.isWalkable(nx, blocking)) position.x = nx.x;
          const ny = { x: position.x, y: position.y + Math.sin(angle) * 3 };
          if (nav.isWalkable(ny, blocking)) position.y = ny.y;
        }
        assert(steps < 1000, `${mask}: ${from} -> ${to} stalled`);
      }
      checked++;
    }
  }
  console.log(`PASS: ${checked} directed paths and simulated traversal, across all 8 building visibility combinations.`);
} finally { rmSync(temporary, { recursive: true, force: true }); }
