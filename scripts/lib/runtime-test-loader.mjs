import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

export function runtimeTestLoader(stubs = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
    }}).outputText;
    vm.runInNewContext(code, {exports, require(name) {
      if (name in stubs) return stubs[name];
      assert.ok(name.startsWith('.'), `Unexpected dependency ${name}`);
      return load(path.resolve(path.dirname(file), name + '.ts'));
    }});
    return exports;
  }
  return load;
}
export const clean = value => JSON.parse(JSON.stringify(value));
