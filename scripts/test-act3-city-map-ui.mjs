import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute production components with isolated hooks, following test-act2-closeout.
let slots = [], cursor = 0, effects = [], resize;
const hooks = {
  useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = value; }]; },
  useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
  useEffect(effect) { effects.push(effect); },
};
const jsx = (type, props) => ({ type, props });
const css = new Proxy({}, { get: (_, key) => key });
function load(file, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, document: { activeElement: null }, HTMLElement: class {}, ResizeObserver: class {
    constructor(callback) { resize = callback; } observe() {} disconnect() {}
  }, require(name) {
    if (name === 'react') return hooks;
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (name.endsWith('.module.css')) return { default: css };
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  } });
  return exports;
}
const nodes = load('src/game/act3CityMapNodes.ts');
const geometry = load('src/game/act3CityMapGeometry.ts', { './act3CityMapNodes': nodes });
const { DialogueCard } = load('src/components/story/DialogueCard.tsx');
const { ConfirmationDialog } = load('src/components/story/ConfirmationDialog.tsx', { './DialogueCard': { DialogueCard } });
const { Act3CityMap } = load('src/components/Act3CityMap.tsx', {
  'next/image': { default: 'img' },
  '../game/act3CityMapNodes': nodes,
  '../game/act3CityMapGeometry': geometry,
  './story/ConfirmationDialog': { ConfirmationDialog },
});
const calls = [];
let visibility = { discoveredPermanentIds: [], huntActive: false, arcadeRevealed: false, activeNodeId: null };
const original = JSON.stringify(visibility);
function render() { cursor = 0; effects = []; return Act3CityMap({ visibility, onConfirmNode: id => calls.push(id) }); }
function all(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => all(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...all(tree.props?.children, predicate)];
}
const pins = tree => all(tree, el => !!el.props?.['data-act3-node']);
const modal = tree => all(tree, el => el.type === ConfirmationDialog)[0];
let tree = render();
tree.props.ref.current = {};
effects[0]();
resize([{ contentRect: { width: 828, height: 374 } }]);
tree = render();
assert.deepEqual(pins(tree).map(pin => pin.props['data-act3-node']), ['harbor']);
assert.equal(modal(tree), undefined);
pins(tree)[0].props.onClick();
tree = render();
assert.equal(modal(tree).props.text, 'Vi går till hamnen.');
assert.equal(modal(tree).props.acceptLabel, 'OK');
assert.equal(modal(tree).props.cancelLabel, 'Gå tillbaka');
modal(tree).props.onCancel();
assert.equal(modal(render()), undefined);
assert.deepEqual(calls, []);
assert.equal(JSON.stringify(visibility), original);
pins(render())[0].props.onClick();
modal(render()).props.onAccept();
assert.deepEqual(calls, ['harbor']);
assert.equal(modal(render()), undefined);

visibility = { discoveredPermanentIds: ['folkpark', 'nova-home', 'game-shop'], huntActive: true, arcadeRevealed: false, activeNodeId: 'folkpark' };
tree = render();
assert.equal(pins(tree).length, 5);
assert.equal(pins(tree).find(pin => pin.props['aria-current']).props['aria-label'], 'Folkparken');
assert.equal(pins(tree).find(pin => pin.props['data-act3-node'] === 'game-shop').props['aria-label'], 'Spelbutiken');
for (const node of nodes.ACT3_CITY_NODES) {
  const pin = pins(tree).find(pin => pin.props['data-act3-node'] === node.id);
  pin.props.onClick();
  assert.equal(modal(render()).props.text, node.confirmText);
  modal(render()).props.onAccept();
  assert.equal(calls.at(-1), node.id);
}
visibility = { ...visibility, arcadeRevealed: true };
assert.equal(pins(render()).find(pin => pin.props['data-act3-node'] === 'game-shop').props['aria-label'], 'Arkaden');
pins(render()).find(pin => pin.props['data-act3-node'] === 'treasure-hunt').props.onClick();
visibility = { ...visibility, huntActive: false, activeNodeId: 'treasure-hunt' };
assert.equal(modal(render()), undefined);
for (const effect of effects.slice(1)) effect();
assert.equal(pins(render()).length, 4);
assert.equal(pins(render()).some(pin => pin.props['aria-current']), false);
visibility = { ...visibility, huntActive: true };
assert.equal(modal(render()), undefined, 'Expired selection must not reopen when hunt returns');

// Actual rendered pin box must anchor the exact SVG tip at each schema coordinate.
for (const [width, height] of [[844, 390], [667, 375], [932, 430], [390, 844], [1200, 500]]) {
  resize([{ contentRect: { width, height } }]);
  tree = render();
  const area = all(tree, el => el.props?.['data-act3-map-image'])[0].props.style;
  assert.ok(Math.abs(area.width / area.height - 1672 / 941) < 1e-9);
  for (const pin of pins(tree)) {
    const node = nodes.ACT3_CITY_NODES.find(node => node.id === pin.props['data-act3-node']);
    const box = pin.props.style;
    assert.ok(box.width >= 44 && box.height >= 44);
    assert.ok(Math.abs(box.left + box.width * .5 - area.width * node.xPct / 100) < 1e-9);
    assert.ok(Math.abs(box.top + box.height * 102 / 136 - area.height * node.yPct / 100) < 1e-9);
  }
}
// Shared confirmation uses real DialogueCard, native modality, cleanup and single accept.
slots = []; cursor = 0; effects = [];
let accepted = 0, cancelled = 0, opened = 0, closed = 0;
const dialog = ConfirmationDialog({ text: 'Vi går till parken.', acceptLabel: 'OK', cancelLabel: 'Gå tillbaka', onAccept: () => accepted++, onCancel: () => cancelled++ });
dialog.props.ref.current = { showModal: () => opened++, close: () => closed++ };
const cleanup = effects[0]();
assert.equal(opened, 1);
const card = dialog.props.children;
assert.equal(card.type, DialogueCard);
card.props.onPrevious();
assert.equal(cancelled, 1);
let prevented = false;
dialog.props.onCancel({ preventDefault: () => { prevented = true; } });
assert.equal(prevented, true);
assert.equal(cancelled, 2);
card.props.onNext(); card.props.onNext();
assert.equal(accepted, 1);
cleanup(); assert.equal(closed, 1);
console.log('PASS: Act 3 map rendering, clicks, cancel/confirm, live visibility, labels, active state, resize geometry and shared modal');
