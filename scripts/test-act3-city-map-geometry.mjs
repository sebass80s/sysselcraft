#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { ACT3_CITY_NODES, ACT3_CITY_MAP_REFERENCE } from "../src/game/act3CityMapNodes.ts";

// Repo TS uses extensionless imports (bundler convention), which Node's native
// --experimental-strip-types resolver does not load directly. Use the same
// TypeScript+vm contract-test loader already used in test-act3-empty-skeleton.
const code=fs.readFileSync("src/game/act3CityMapGeometry.ts","utf8");
const exports={};
const js=ts.transpileModule(code,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,
}}).outputText;
vm.runInNewContext(js,{exports,require(name){
  assert.equal(name,"./act3CityMapNodes","Unexpected map geometry dependency");
  return {ACT3_CITY_MAP_REFERENCE};
}});
const {getContainedAct3MapRect,getAct3NodeTipPosition,getAct3PinBoxPosition}=exports;

const same=getContainedAct3MapRect(1672,941);
assert.deepEqual({...same},{left:0,top:0,width:1672,height:941});
const exact=ACT3_CITY_NODES.find(n=>n.id==="folkpark");
assert.ok(exact);
const tip=getAct3NodeTipPosition(exact,same);
assert.ok(Math.abs(tip.x-1672*.754)<1e-9);
assert.ok(Math.abs(tip.y-941*.668)<1e-9);
const rendered=getAct3PinBoxPosition(tip,62);
assert.ok(rendered);
assert.equal(rendered.width,62);
assert.equal(rendered.height,68);
assert.ok(Math.abs(rendered.left+31-tip.x)<1e-9);
assert.ok(Math.abs(rendered.top+51-tip.y)<1e-9);
const letterbox=getContainedAct3MapRect(1672,1500);
assert.equal(letterbox.width,1672);
assert.equal(letterbox.height,941);
assert.equal(letterbox.left,0);
assert.equal(letterbox.top,(1500-941)/2);
const pillar=getContainedAct3MapRect(844,390);
assert.equal(pillar.height,390);
assert.ok(pillar.left>0);
assert.ok(pillar.left+pillar.width<844);
const shifted=getAct3NodeTipPosition({xPct:0,yPct:100},pillar);
assert.equal(shifted.x,pillar.left);
assert.equal(shifted.y,pillar.top+pillar.height);
for(const [w,h] of [[0,300],[300,0],[-1,300],[NaN,300],[Infinity,300]])assert.equal(getContainedAct3MapRect(w,h),null);
assert.equal(getAct3PinBoxPosition(tip,0),null);
assert.equal(ACT3_CITY_MAP_REFERENCE.pinTipY,102);
console.log("Act 3 map geometry: full-bleed, letterbox, pillarbox, svg pin-tip alignment: PASS");
