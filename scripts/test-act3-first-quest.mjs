import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runtimeTestLoader,clean} from './lib/runtime-test-loader.mjs';
let child='a', fail=false, staleWrite=null;
const storage=new Map();
const load=runtimeTestLoader({'@capacitor/preferences':{Preferences:{
 get:async({key})=>({value:key==='sysselcraft.backend.childId'?child:storage.get(key)??null}),
 set:async({key,value})=>{if(fail)throw Error('disk');storage.set(key,value);if(staleWrite){const f=staleWrite;staleWrite=null;f();}},
 remove:async({key})=>storage.delete(key),
}}});
const state=load('src/game/act3RuntimeState.ts');
const {ACT3_FIRST_QUEST_GATE:adapter,nextAct3GatedState,previousAct3GatedState}=load('src/game/act3FirstQuestGate.ts');
const {createClaimGateBridge}=load('src/runtime/progression/claimGateBridge.ts');
const {updateChapterFromView}=load('src/runtime/save/updateChapterFromView.ts');
const {ACT3_PARK_002:beat}=load('src/game/act3Park002Content.ts');
const {ACT3_OPENING_BEATS}=load('src/game/act3OpeningContent.ts');
const {nextAct3OpeningState}=load('src/game/act3OpeningProgress.ts');
const key='sysselcraft.act3.runtime.v1.a';
const guard={expectedChildId:'a',isActive:()=>true};
const persistence={update:state.updateAct3RuntimeState};
const evidence=count=>({childId:'a',count,updatedAt:new Date(1800000000000+count).toISOString()});
let snapshot=evidence(80), loads=0;
const bridge=createClaimGateBridge({adapter,persistence,guard,loadEvidence:async()=>{loads++;if(snapshot instanceof Error)throw snapshot;return snapshot;}});
for(const entered of [false,true]){
 storage.set(key,JSON.stringify({version:1,entered}));
 const s=await state.loadAct3RuntimeState(guard);
 assert.equal(s.version,4);assert.equal(s.entered,entered);assert.equal(s.claimGate.baseline,null);
}
// A real v3 save that finished PARK-002 must resume at the PARK-003 gate,
// preserving the consumed first claim without creating a free replay.
const priorV3={version:3,entered:true,openingBeatIndex:6,openingLineIndex:0,
 claimGate:{baseline:80,consumed:1,observedCount:83,observedAt:1800000000083},
 park002Phase:'complete',park002LineIndex:0};
storage.set(key,JSON.stringify(priorV3));
const migrated3=await state.loadAct3RuntimeState(guard);
assert.equal(migrated3.version,4);assert.equal(migrated3.gatedBeatIndex,1);
assert.equal(migrated3.gatedPhase,'waiting');assert.equal(migrated3.claimGate.consumed,1);
assert.equal(migrated3.claimGate.baseline,80);
for(let b=0;b<=6;b++){
 const l=b===6?0:ACT3_OPENING_BEATS[b].lines.length-1;
 storage.set(key,JSON.stringify({version:2,entered:true,openingBeatIndex:b,openingLineIndex:l}));
 const s=await state.loadAct3RuntimeState(guard);
 assert.equal(s.openingBeatIndex,b);assert.equal(s.openingLineIndex,l);assert.equal(s.gatedPhase,'waiting');assert.equal(s.claimGate.baseline,null);
}
for(const invalid of [{version:1,entered:'yes'},{version:5}, {...state.createDefaultAct3RuntimeState(),openingLineIndex:999}, {...state.createDefaultAct3RuntimeState(),gatedPhase:'playing'}, {...state.createDefaultAct3RuntimeState(),claimGate:{baseline:0,consumed:-1}}]){
 storage.set(key,JSON.stringify(invalid));await assert.rejects(state.loadAct3RuntimeState(guard));
 assert.equal(storage.get(key),JSON.stringify(invalid),'Corrupt/future saves preserved, never reset');
}
// Last opening line, poll and duplicate advance share the same persistence queue.
let s={...state.createDefaultAct3RuntimeState(),entered:true,openingBeatIndex:5,openingLineIndex:ACT3_OPENING_BEATS[5].lines.length-1};
await state.saveAct3RuntimeState(s,guard);
await bridge.refresh();assert.equal(loads,0,'Never read/capture evidence during free story');
const openingCursor=s=>`${s.openingBeatIndex}:${s.openingLineIndex}`;
const advance=()=>updateChapterFromView(persistence,s,openingCursor,c=>nextAct3OpeningState(c,ACT3_OPENING_BEATS[5].lines.length),guard);
await Promise.all([advance(),bridge.refresh(),advance()]);
s=await state.loadAct3RuntimeState(guard);
assert.equal(s.openingBeatIndex,6);assert.equal(s.claimGate.baseline,80);assert.equal(s.claimGate.consumed,0);
await bridge.start();assert.equal((await state.loadAct3RuntimeState()).gatedPhase,'waiting','Approval-only unchanged counter');
snapshot=evidence(83);await bridge.refresh();
assert.equal((await state.loadAct3RuntimeState()).gatedPhase,'waiting','Poll/backlog never auto-start');
fail=true;await assert.rejects(bridge.start());fail=false;
assert.equal((await state.loadAct3RuntimeState()).claimGate.consumed,0);
snapshot=new Error('offline');await assert.rejects(bridge.start());
snapshot={...evidence(84),childId:'b'};await assert.rejects(bridge.start());
snapshot=evidence(83);
await Promise.all([bridge.start(),bridge.start(),bridge.refresh()]);
s=await state.loadAct3RuntimeState();assert.equal(s.gatedPhase,'playing');assert.equal(s.claimGate.consumed,1);assert.equal(s.gatedLineIndex,0);
const cursor=s=>`${s.gatedBeatIndex}:${s.gatedPhase}:${s.gatedLineIndex}`;
// Write-before-show: every story paragraph survives a fresh persistence-host instance.
for(let i=0;i<beat.lines.length;i++){
 s=await state.loadAct3RuntimeState();assert.equal(s.gatedLineIndex,i);assert.equal(s.claimGate.consumed,1);
 const before=storage.get(key);fail=true;
 await assert.rejects(updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard));fail=false;
 assert.equal(storage.get(key),before);
 await Promise.all([updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard),updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard)]);
}
s=await state.loadAct3RuntimeState();
assert.equal(s.gatedPhase,'waiting');
assert.equal(s.gatedBeatIndex,1);
assert.equal(s.claimGate.consumed,1);
assert.equal(previousAct3GatedState(s),s,'Completed PARK-002 must never replay');
const park003=load('src/game/act3Park003Content.ts').ACT3_PARK_003;
assert.equal(park003.lines.length,23);
await bridge.refresh();
assert.equal((await state.loadAct3RuntimeState()).gatedPhase,'waiting','Polling cannot auto-start PARK-003');
// The first claim was already consumed for PARK-002; a second distinct claim
// from the verified backlog is required to start PARK-003.
await Promise.all([bridge.start(),bridge.start()]);
s=await state.loadAct3RuntimeState();
assert.equal(s.gatedBeatIndex,1);assert.equal(s.gatedPhase,'playing');assert.equal(s.claimGate.consumed,2);
for(let i=0;i<park003.lines.length;i++){
  s=await state.loadAct3RuntimeState();assert.equal(s.gatedLineIndex,i);assert.equal(s.claimGate.consumed,2);
  const before=storage.get(key);fail=true;
  await assert.rejects(updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard));fail=false;
  assert.equal(storage.get(key),before,'PARK-003 failed write is rolled back');
  await Promise.all([updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard),
    updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard)]);
}
s=await state.loadAct3RuntimeState();assert.equal(s.gatedPhase,'waiting');
assert.equal(s.gatedBeatIndex,2);assert.equal(s.claimGate.consumed,2);
// One engine-level regression for an arbitrary contiguous batch.
// No separate test logic per PARK-004..008: reuse the same adapter/cursor API.
const batch=load('src/game/act3Park004To008.generated.ts').ACT3_PARK_BATCH_004_008;
assert.equal(batch.length,5);
for(let i=0;i<batch.length;i++){
 if(i>0){ snapshot=evidence(83+i); await bridge.refresh(); }
 s=await state.loadAct3RuntimeState();
 assert.equal(s.gatedBeatIndex,2+i);
 assert.equal(s.gatedPhase,'waiting');
 const before=storage.get(key);
 await bridge.refresh();
 assert.equal(storage.get(key),before,'Polling never auto-starts the next beat');
 await Promise.all([bridge.start(),bridge.start()]);
 s=await state.loadAct3RuntimeState();
 assert.equal(s.gatedPhase,'playing');
 assert.equal(s.claimGate.consumed,3+i,'One new claim per beat, despite double click');
 for(let line=0;line<batch[i].lines.length;line++){
  s=await state.loadAct3RuntimeState();
  await updateChapterFromView(persistence,s,cursor,nextAct3GatedState,guard);
 }
}
s=await state.loadAct3RuntimeState();
assert.equal(s.gatedPhase,'waiting');
assert.equal(s.gatedBeatIndex,2+batch.length);
assert.equal(s.claimGate.consumed,2+batch.length);
const completed=storage.get(key);snapshot=evidence(200);await bridge.refresh();await bridge.start();
assert.equal(storage.get(key),completed,'No speculative PARK-009/minigolf unlock');
assert.equal(previousAct3GatedState(s),s);
// Lifecycle and identity changes during a cursor write roll back before presentation.
const playing={...s,gatedBeatIndex:2+batch.length-1,gatedPhase:'playing',gatedLineIndex:2};await state.saveAct3RuntimeState(playing);
staleWrite=()=>{child='b';};await assert.rejects(updateChapterFromView(persistence,playing,cursor,nextAct3GatedState,guard));child='a';
assert.deepEqual(clean(await state.loadAct3RuntimeState()),clean(playing));
// Canon QA: entire paragraph inventory and exact speaker/body, not just a digest label.
const source=fs.readFileSync('docs/ACT3_STORY_MANIFEST.md','utf8');
const canonical=/^### A3-PARK-002 — Bana sju\n([\s\S]*?)(?=\n### )/m.exec(source)[1].trim();
let digest=2166136261;for(let i=0;i<canonical.length;i++)digest=Math.imul(digest^canonical.charCodeAt(i),16777619)>>>0;
assert.equal(digest.toString(16),'da09a1b3');assert.equal(beat.sourceDigest,'da09a1b3');
const paragraphs=canonical.split(/\n\s*\n/);
assert.equal(beat.lines.length,paragraphs.length);
paragraphs.forEach((p,i)=>{const m=/^\*\*([^:]+):\*\*\s*(.*)$/s.exec(p);
 assert.equal(beat.lines[i].speaker,m?(m[1]==='Barnet'?'Du':m[1]):null);assert.equal(beat.lines[i].text,m?m[2]:p);
});
assert.ok(beat.lines.some(l=>l.speaker==='Du'));
const row=JSON.parse(fs.readFileSync('src/game/act3ContentRegistry.json','utf8')).beats.find(b=>b.id===beat.id);
assert.equal(beat.image,row.image.publicUrl);assert.equal(row.mapLocationId,null);
const canonical3=/^### A3-PARK-003 — Den gamla scenen\n([\s\S]*?)(?=\n### )/m.exec(source)[1].trim();
let digest3=2166136261;for(let i=0;i<canonical3.length;i++)digest3=Math.imul(digest3^canonical3.charCodeAt(i),16777619)>>>0;
assert.equal(digest3.toString(16),'dbb1a3a2');assert.equal(park003.sourceDigest,'dbb1a3a2');
const paragraphs3=canonical3.split(/\n\s*\n/);
assert.equal(park003.lines.length,paragraphs3.length);
paragraphs3.forEach((p,i)=>{const m=/^\*\*([^:]+):\*\*\s*(.*)$/s.exec(p);
 assert.equal(park003.lines[i].speaker,m?(m[1]==='Barnet'?'Du':m[1]):null);
 assert.equal(park003.lines[i].text,m?m[2]:p);
});
const row3=JSON.parse(fs.readFileSync('src/game/act3ContentRegistry.json','utf8')).beats.find(b=>b.id===park003.id);
assert.equal(park003.image,row3.image.publicUrl);assert.equal(row3.progression.questNumber,2);

console.log('PASS: reusable Act 3 gated engine, v1-v4 migration, generic 5-beat data batch, 7 distinct claims, no autoplay, write rollback, stale identity and canon');
