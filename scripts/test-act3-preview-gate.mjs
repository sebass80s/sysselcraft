import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function read(path) {
  return fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
}

const code = ts.transpileModule(read("src/game/act3PreviewAccess.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exports = {};
vm.runInNewContext(code, { exports });
const { grantAct3PreviewEntry, consumeAct3PreviewEntry, ACT3_PREVIEW_PASSWORD } = exports;

function fakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

const storage = fakeStorage();
assert.equal(ACT3_PREVIEW_PASSWORD, "nova3");
assert.equal(consumeAct3PreviewEntry(storage), false, "Direct visits never receive preview access");
assert.equal(grantAct3PreviewEntry("wrong", storage), false, "Wrong password cannot unlock Act 3");
assert.equal(consumeAct3PreviewEntry(storage), false);
assert.equal(grantAct3PreviewEntry("nova3", storage), true, "Adult can unlock Act 3");
assert.equal(consumeAct3PreviewEntry(storage), true, "One requested navigation is allowed");
assert.equal(consumeAct3PreviewEntry(storage), false, "Grant cannot be replayed");
assert.equal(grantAct3PreviewEntry("nova3", storage), true);
assert.equal(consumeAct3PreviewEntry(storage), true, "Adult can start another preview session");
assert.equal(grantAct3PreviewEntry("nova3", { setItem() { throw Error("Unavailable"); } }), false, "No storage means no access");

const act1 = read("src/components/VillagePrototype.tsx");
const adultLauncher = read("src/components/Act3PreviewLauncher.tsx");
const act2 = read("src/components/Act2Runtime.tsx");
const act3 = read("src/components/Act3Skeleton.tsx");
const debugRoute = read("src/app/act3-test/page.tsx");

assert.match(act1, /<Act3PreviewLauncher \/>/, "X launcher must be in Vuxenläge");
assert.match(adultLauncher, />\s*X\s*<\/button>/, "Adult button is labeled X");
assert.match(adultLauncher, /grantAct3PreviewEntry\(password, window\.sessionStorage\)/, "Password required before navigating");
assert.match(act2, /Kapitel 3 kommer snart/, "Normal Act 2 must show the shipping lock");
assert.doesNotMatch(act2, /Till kapitel 3 →/, "Normal Act 2 may not link to unfinished Act 3");
assert.match(act3, /consumeAct3PreviewEntry\(window\.sessionStorage\)/, "Production Act 3 consumes the one-use grant");
assert.ok(act3.indexOf("consumeAct3PreviewEntry") < act3.indexOf("loadAct3RuntimeState({ expectedChildId:"), "Unauthorized visits must not read/modify Act 3 saves");
assert.match(debugRoute, /NODE_ENV !== "production"/, "Developer-only debug page stays disabled in production");
console.log("PASS: Act 3 can only be previewed through Vuxenläge → X while normal chapter entry remains locked");
