import assert from 'node:assert/strict';
import {runtimeTestLoader, clean} from './lib/runtime-test-loader.mjs';
const storage = new Map();
let child = 'child-a', fail = false, duringWrite = null, reads = 0;
const load = runtimeTestLoader({'@capacitor/preferences': {Preferences: {
  get: async ({key}) => ({value:key === 'sysselcraft.backend.childId' ? child : storage.get(key) ?? null}),
  set: async ({key,value}) => {if(fail) throw Error('disk'); storage.set(key,value); if(duringWrite) {const f=duringWrite;duringWrite=null;f();}},
  remove: async ({key}) => storage.delete(key),
}}});
const gate = load('src/runtime/progression/claimGate.ts');
const {createClaimGateBridge} = load('src/runtime/progression/claimGateBridge.ts');
const {createChapterPersistenceHost} = load('src/runtime/save/chapterPersistence.ts');
const evidence = (count, offset=0, childId='child-a') => ({childId,count,updatedAt:new Date(1800000000000+offset).toISOString()});
// Independent chapter configurations: different ids, cursors, baselines and consumed state.
for (const config of [
  {chapterId:'forest', ids:['TREE','STREAM'], baseline:20, consumed:0},
  {chapterId:'space', ids:['ORBIT','MOON','MARS'], baseline:80, consumed:1},
]) {
  storage.clear(); child='child-a'; let active=true;
  let remote=evidence(config.baseline+config.consumed);
  const initialLedger=config.consumed ? {...gate.emptyClaimGate(),baseline:config.baseline,consumed:config.consumed,observedCount:remote.count,observedAt:Date.parse(remote.updatedAt)} : gate.emptyClaimGate();
  const persistence=createChapterPersistenceHost({chapterId:config.chapterId,version:1,storageKey:config.chapterId,
    createDefaultState:()=>({gate:initialLedger,phase:'waiting',beat:null}),
    normalize:s=>gate.isClaimGateLedger(s.gate)?s:null});
  const adapter={beatIds:config.ids,waiting:s=>s.phase==='waiting',ledger:s=>s.gate,withLedger:(s,g)=>({...s,gate:g}),startBeat:(s,id)=>({...s,phase:'playing',beat:id})};
  const bridge=createClaimGateBridge({adapter,persistence,guard:{expectedChildId:'child-a',isActive:()=>active},loadEvidence:async()=>{reads++;if(remote instanceof Error)throw remote;return remote;}});
  // offline/null/identity/malformed never create a baseline.
  for (const invalid of [null, evidence(1,0,'child-b'),evidence(-1),evidence(NaN),evidence(1.5),evidence('4'),evidence(undefined),new Error('offline')]) {
    remote=invalid; await assert.rejects(bridge.refresh());
  }
  remote=evidence(config.baseline+config.consumed);
  let state=await bridge.refresh(); assert.equal(state.gate.baseline,config.baseline);
  assert.equal((await bridge.start()).phase,'waiting','Approval-only/unchanged total cannot start');
  remote=evidence(config.baseline+config.consumed+3,10);
  state=await bridge.refresh(); assert.equal(state.phase,'waiting','Poll cannot start story');
  assert.equal(state.gate.baseline,config.baseline,'Baseline captured exactly once');
  const before=clean(await persistence.load());
  fail=true; await assert.rejects(bridge.start()); fail=false;
  assert.deepEqual(clean(await persistence.load()),before,'Failed write leaves consumption/cursor untouched');
  remote=new Error('offline'); await assert.rejects(bridge.start(),'Cached evidence cannot unlock offline');
  remote=evidence(config.baseline+config.consumed,0); await assert.rejects(bridge.start(),'Old snapshot cannot unlock');
  remote=evidence(config.baseline+config.consumed+3,10);
  const [first,duplicate]=await Promise.all([bridge.start(),bridge.start()]);
  assert.equal(first.beat,config.ids[config.consumed]);
  assert.deepEqual(clean(first),clean(duplicate));
  assert.equal(first.gate.consumed,config.consumed+1);
  const reloaded=await persistence.load(); assert.equal(reloaded.phase,'playing');
  assert.equal(gate.nextClaimGateBeat(reloaded.gate,config.ids,true),null,'Active beat blocks backlog');
  assert.equal(reloaded.gate.observedCount-reloaded.gate.baseline-reloaded.gate.consumed,2,'Remaining backlog intact');
  // Simulate finishing authored story through the same transaction queue.
  await persistence.update(s=>({...s,phase:'waiting'}));
  const saved=clean(await persistence.load());
  duringWrite=()=>{child='child-b';};
  await assert.rejects(bridge.start()); child='child-a';
  assert.deepEqual(clean(await persistence.load()),saved,'Mid-write child switch rolls back');
  active=false; await assert.rejects(bridge.refresh()); active=true;
  assert.deepEqual(clean(await persistence.load()),saved);
  child='child-b'; await assert.rejects(bridge.start()); child='child-a';
  assert.deepEqual(clean(await persistence.load()),saved);
}
assert.ok(reads>10);
console.log('PASS: shared claim gate fuel proof with forest + space; strict authority, baseline, approval, backlog, duplicate, restart, failure, stale lifecycle/identity rollback');
// StrictMode/unmount generations are captured per operation, never reactivated.
let effect;
const guardHook=runtimeTestLoader({react:{
 useRef:()=>({current:0}),useEffect:fn=>{effect=fn;},useCallback:fn=>fn,
}})('src/runtime/save/useChapterPersistenceGuard.ts').useChapterPersistenceGuard;
const capture=guardHook('child-a',true);
assert.equal(capture().isActive(),false);
const stop=effect(), old=capture();assert.equal(old.isActive(),true);
stop();assert.equal(old.isActive(),false);
effect();assert.equal(old.isActive(),false);assert.equal(capture().isActive(),true);
// Raw backend adapter must not inherit the display normalizer's default zero.
let paired='child-a', row={child_id:'child-a',progression:{worldProgression:12},updated_at:new Date(1800000000000).toISOString()};
let changeDuringRead=false;
const raw=runtimeTestLoader({
 '../../backend/childDeviceBinding':{getPairedChildId:async()=>paired},
 '../../backend/supabaseClient':{getSupabaseBrowserClient:()=>({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>{if(changeDuringRead)paired='child-b';return {data:row,error:null};}})})})})},
})('src/runtime/backend/pairedClaimEvidence.ts');
assert.equal((await raw.loadPairedClaimEvidence()).count,12);
row={...row,progression:{}};await assert.rejects(raw.loadPairedClaimEvidence());
row={...row,progression:{worldProgression:12}};changeDuringRead=true;
assert.equal(await raw.loadPairedClaimEvidence(),null);
console.log('PASS: operation generation leases and raw paired evidence validation');
