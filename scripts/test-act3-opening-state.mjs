#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import {runtimeTestLoader} from "./lib/runtime-test-loader.mjs";
function load(path, dependencies) {
  const source=fs.readFileSync(path,"utf8");
  const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const exports={};
  vm.runInNewContext(js,{exports,require(name){
    assert.ok(name in dependencies,"Unexpected dependency: "+name);
    return dependencies[name];
  }});
  return exports;
}
let definition;
const state=runtimeTestLoader({"../runtime/save/chapterPersistence":{
  createChapterPersistenceHost(input){definition=input;return {load:async()=>input.createDefaultState(),save:async x=>assert.ok(input.normalize(x)),clear:async()=>{}}}
}})("src/game/act3RuntimeState.ts");
const clean=x=>JSON.parse(JSON.stringify(x));
const first=state.createDefaultAct3RuntimeState();
assert.deepEqual(clean(first),{version:4,entered:false,openingBeatIndex:0,openingLineIndex:0,claimGate:{baseline:null,consumed:0,observedCount:null,observedAt:null},gatedBeatIndex:0,gatedPhase:"waiting",gatedLineIndex:0});
assert.equal(definition.chapterId,"act3");
assert.equal(definition.storageKey,"sysselcraft.act3.runtime.v1");
assert.equal(definition.version,4);
assert.deepEqual(clean(definition.normalize(definition.migrate({version:1,entered:true}))),{
  ...clean(first),entered:true
});
assert.deepEqual(clean(definition.normalize(definition.migrate({version:1,entered:false}))),clean(first));
for (const rejected of [
 null, {}, {version:3,entered:true,openingBeatIndex:0,openingLineIndex:0},
 {version:2,entered:false,openingBeatIndex:1,openingLineIndex:0},
 {version:2,entered:true,openingBeatIndex:7,openingLineIndex:0},
 {version:2,entered:true,openingBeatIndex:6,openingLineIndex:1},
 {version:2,entered:true,openingBeatIndex:0,openingLineIndex:-1},
 {version:2,entered:true,openingBeatIndex:0,openingLineIndex:1.5},
]){
  assert.equal(state.normalizeAct3RuntimeState(rejected),null,"Rejected invalid/corrupted/future save");
}
assert.equal(state.migrateAct3RuntimeState({version:5}).version,5,"Future saves must not be rewritten");
const story=load("src/runtime/story/storySequence.ts",{});
const progress=load("src/game/act3OpeningProgress.ts",{
 "../runtime/story/storySequence":story,
 "./act3RuntimeState":state
});
let cursor={...first,entered:true};
assert.deepEqual(Array.from(progress.act3OpeningMapVisibility(cursor).discoveredPermanentIds),[]);
for(let beat=0;beat<6;beat++){
  for(let line=0;line<3;line++){
    assert.equal(cursor.openingBeatIndex,beat);
    assert.equal(cursor.openingLineIndex,line);
    cursor=progress.nextAct3OpeningState(cursor,3);
  }
}
assert.equal(cursor.openingBeatIndex,6);
assert.equal(cursor.openingLineIndex,0);
assert.deepEqual(Array.from(progress.act3OpeningMapVisibility(cursor).discoveredPermanentIds),["folkpark"]);
assert.equal(progress.act3OpeningMapVisibility(cursor).activeNodeId,"folkpark");
assert.strictEqual(progress.nextAct3OpeningState(cursor,100),cursor,"No progression past quest gate");
assert.deepEqual(clean(progress.previousAct3OpeningState(cursor,99)),clean(cursor));
const midway={...first,entered:true,openingBeatIndex:2,openingLineIndex:1};
assert.equal(progress.previousAct3OpeningState(midway,8).openingLineIndex,0);
assert.equal(progress.previousAct3OpeningState({...midway,openingLineIndex:0},8).openingLineIndex,0);
assert.equal(progress.act3OpeningMapVisibility(midway).discoveredPermanentIds.length,0,"Mentioning park is not discovery");
console.log("PASS: Act 3 legacy v1 migration, closed PARK-002 gate, 6-beat cursor and authored park discovery");
