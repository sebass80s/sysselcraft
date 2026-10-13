import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RUNTIME_BROWSER_URL || 'http://127.0.0.1:3013';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));

// Isolated real-React fixture: production map/dialog/CSS, explicit visibility props.
// Only Next Image is replaced with its DOM image equivalent. No debug unlock route.
const modules = {}, mappings = {};
function collect(file) {
  if (modules[file]) return file;
  if (file.endsWith('.css')) { modules[file] = 'module.exports.default = new Proxy({}, { get: (_, key) => key });'; return file; }
  let code = fs.readFileSync(file, 'utf8');
  if (/\.tsx?$/.test(file)) code = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
  modules[file] = code; mappings[file] = {};
  for (const match of code.matchAll(/require\(["']([^"']+)["']\)/g)) {
    const name = match[1];
    let dependency;
    if (name === 'next/image') {
      dependency = 'image-stub';
      modules[dependency] = `module.exports.default = function Image({fill, preload, sizes, ...props}) { return require('react').createElement('img', {...props, style: fill ? {position:'absolute',inset:0,width:'100%',height:'100%'} : {}}); };`;
      mappings[dependency] = { react: collect(require.resolve('react')) };
    } else if (name.startsWith('.')) {
      const candidate = path.resolve(path.dirname(file), name);
      dependency = ['', '.ts', '.tsx', '.js'].map(ext => candidate + ext).find(p => fs.existsSync(p));
    } else dependency = require.resolve(name);
    assert.ok(dependency, `Cannot resolve ${name}`);
    mappings[file][name] = dependency;
    if (dependency !== 'image-stub') collect(dependency);
  }
  return file;
}
const component = collect(path.resolve('src/components/Act3CityMap.tsx'));
const client = collect(require.resolve('react-dom/client'));
const react = collect(require.resolve('react'));
const css = ['src/app/globals.css', 'src/components/Act3CityMap.module.css', 'src/components/story/ConfirmationDialog.module.css'].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const script = `const sources=${JSON.stringify(modules)}, mapping=${JSON.stringify(mappings)}, cache={};
function load(id) { if(cache[id]) return cache[id].exports; const module=cache[id]={exports:{}}; new Function('module','exports','require','process',sources[id])(module,module.exports,n=>load(mapping[id][n]),{env:{NODE_ENV:'production'}}); return module.exports; }
const React=load(${JSON.stringify(react)}), root=load(${JSON.stringify(client)}).createRoot(document.getElementById('root')), CityMap=load(${JSON.stringify(component)}).Act3CityMap;
window.intents=[]; window.renderMap=visibility=>root.render(React.createElement(CityMap,{visibility,onConfirmNode:id=>window.intents.push(id)}));`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE || undefined, headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.route(base + '/__map_fixture', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>${css}</style></head><body><main id="root" class="page"></main><script>${script.replaceAll('</script', '<\\/script')}</script></body></html>` }));
  await page.goto(base + '/__map_fixture');
  const initial = { discoveredPermanentIds: [], huntActive: false, arcadeRevealed: false, activeNodeId: null };
  const all = { ...initial, discoveredPermanentIds: ['folkpark', 'nova-home', 'game-shop'], huntActive: true, activeNodeId: 'folkpark' };
  await page.evaluate(value => window.renderMap(value), initial);
  const harbor = page.getByRole('button', { name: 'Hamnen', exact: true });
  await harbor.waitFor();
  assert.equal(await page.locator('[data-act3-node]').count(), 1);
  await harbor.tap();
  await page.getByRole('dialog', { name: 'Vi går till hamnen.' }).waitFor();
  await page.getByRole('button', { name: 'Gå tillbaka', exact: true }).tap();
  assert.deepEqual(await page.evaluate(() => window.intents), []);
  await harbor.click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').count(), 0);
  assert.equal(await harbor.evaluate(el => el === document.activeElement), true);
  await harbor.tap();
  await page.getByRole('button', { name: 'OK', exact: true }).tap();
  assert.deepEqual(await page.evaluate(() => window.intents), ['harbor']);
  await page.evaluate(value => window.renderMap(value), all);
  await page.getByRole('button', { name: 'Novas hem' }).waitFor();
  assert.equal(await page.locator('[aria-current="location"]').getAttribute('aria-label'), 'Folkparken');
  for (const viewport of [{width:844,height:390},{width:667,height:375},{width:932,height:430},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(80);
    const layout = await page.evaluate(() => {
      const rect = document.querySelector('[data-act3-map-image]').getBoundingClientRect();
      return { ratio: rect.width / rect.height, overflow: document.documentElement.scrollWidth > innerWidth,
        pins: [...document.querySelectorAll('[data-act3-node]')].map(el => {
          const b = el.getBoundingClientRect(); return {id:el.dataset.act3Node,width:b.width,height:b.height,left:b.left,top:b.top,right:b.right,bottom:b.bottom,x:(b.left+b.width/2-rect.left)/rect.width*100,y:(b.top+b.height*102/136-rect.top)/rect.height*100};
        }) };
    });
    assert.ok(Math.abs(layout.ratio - 1672/941) < .001);
    assert.equal(layout.overflow, false);
    const coordinates = {'harbor':[18.9,62.5],folkpark:[75.4,66.8],'nova-home':[81.8,20.2],'game-shop':[54.3,43.3],'treasure-hunt':[39.2,62.6]};
    for (const pin of layout.pins) {
      assert.ok(pin.width >= 44 && pin.height >= 44);
      assert.ok(pin.left >= 0 && pin.top >= 0 && pin.right <= viewport.width && pin.bottom <= viewport.height);
      assert.ok(Math.abs(pin.x-coordinates[pin.id][0]) < .02 && Math.abs(pin.y-coordinates[pin.id][1]) < .02);
    }
    await page.getByRole('button', {name:'Folkparken',exact:true}).tap();
    const dialog = page.getByRole('dialog', { name:'Vi går till parken.' });
    await dialog.waitFor();
    const box = await dialog.boundingBox();
    assert.ok(box.y >= 0 && box.y+box.height <= viewport.height);
    for (let i=0;i<4;i++) { await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('dialog'))); }
    await page.getByRole('button', {name:'Gå tillbaka',exact:true}).tap();
  }
  await page.setViewportSize({width:844,height:390});
  await page.waitForTimeout(80);
  await page.screenshot({path:'/tmp/sysselcraft-act3-map-all-nodes.png'});
  await page.getByRole('button', {name:'Spelbutiken',exact:true}).tap();
  await page.getByRole('dialog', {name:'Vi går till spelbutiken.'}).waitFor();
  await page.screenshot({path:'/tmp/sysselcraft-act3-map-confirmation.png'});
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name:'Skattjakten',exact:true}).tap();
  await page.evaluate(value => window.renderMap(value), {...all,huntActive:false});
  await page.locator('dialog').waitFor({state:'detached'});
  await page.evaluate(value => window.renderMap(value), {...all,arcadeRevealed:true});
  await page.getByRole('button', {name:'Arkaden',exact:true}).waitFor();
  assert.equal(await page.locator('dialog').count(),0);
  assert.deepEqual(errors, []);
  console.log('PASS: real React browser map: touch, modal focus/Escape, visibility changes, arcade label, 4 viewports, exact tip geometry; isolated fixture, not physical iPhone');
  await context.close();
} finally { await browser.close(); }
