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
const {ACT3_FIRST_QUEST_GATE:adapter,nextAct3Park002State,previousAct3Park002State}=load('src/game/act3FirstQuestGate.ts');
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
 assert.equal(s.version,3);assert.equal(s.entered,entered);assert.equal(s.claimGate.baseline,null);
}
for(let b=0;b<=6;b++){
 const l=b===6?0:ACT3_OPENING_BEATS[b].lines.length-1;
 storage.set(key,JSON.stringify({version:2,entered:true,openingBeatIndex:b,openingLineIndex:l}));
 const s=await state.loadAct3RuntimeState(guard);
 assert.equal(s.openingBeatIndex,b);assert.equal(s.openingLineIndex,l);assert.equal(s.park002Phase,'waiting');assert.equal(s.claimGate.baseline,null);
}
for(const invalid of [{version:1,entered:'yes'},{version:4}, {...state.createDefaultAct3RuntimeState(),openingLineIndex:999}, {...state.createDefaultAct3RuntimeState(),park002Phase:'playing'}, {...state.createDefaultAct3RuntimeState(),claimGate:{baseline:0,consumed:-1}}]){
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
await bridge.start();assert.equal((await state.loadAct3RuntimeState()).park002Phase,'waiting','Approval-only unchanged counter');
snapshot=evidence(83);await bridge.refresh();
assert.equal((await state.loadAct3RuntimeState()).park002Phase,'waiting','Poll/backlog never auto-start');
fail=true;await assert.rejects(bridge.start());fail=false;
assert.equal((await state.loadAct3RuntimeState()).claimGate.consumed,0);
snapshot=new Error('offline');await assert.rejects(bridge.start());
snapshot={...evidence(84),childId:'b'};await assert.rejects(bridge.start());
snapshot=evidence(83);
await Promise.all([bridge.start(),bridge.start(),bridge.refresh()]);
s=await state.loadAct3RuntimeState();assert.equal(s.park002Phase,'playing');assert.equal(s.claimGate.consumed,1);assert.equal(s.park002LineIndex,0);
const cursor=s=>`${s.park002Phase}:${s.park002LineIndex}`;
// Write-before-show: every story paragraph survives a fresh persistence-host instance.
for(let i=0;i<beat.lines.length;i++){
 s=await state.loadAct3RuntimeState();assert.equal(s.park002LineIndex,i);assert.equal(s.claimGate.consumed,1);
 const before=storage.get(key);fail=true;
 await assert.rejects(updateChapterFromView(persistence,s,cursor,nextAct3Park002State,guard));fail=false;
 assert.equal(storage.get(key),before);
 await Promise.all([updateChapterFromView(persistence,s,cursor,nextAct3Park002State,guard),updateChapterFromView(persistence,s,cursor,nextAct3Park002State,guard)]);
}
s=await state.loadAct3RuntimeState();assert.equal(s.park002Phase,'complete');assert.equal(s.claimGate.consumed,1);
const completed=storage.get(key);snapshot=evidence(200);await bridge.refresh();await bridge.start();
assert.equal(storage.get(key),completed,'Slice stops; no replay or later beat/backlog consumption');
assert.equal(s.claimGate.observedCount-s.claimGate.baseline-s.claimGate.consumed,2);
assert.equal(previousAct3Park002State(s),s);
// Lifecycle and identity changes during a cursor write roll back before presentation.
const playing={...s,park002Phase:'playing',park002LineIndex:2};await state.saveAct3RuntimeState(playing);
staleWrite=()=>{child='b';};await assert.rejects(updateChapterFromView(persistence,playing,cursor,nextAct3Park002State,guard));child='a';
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
console.log('PASS: actual PARK-002 v1/v2→v3, strict cursors, baseline race, authority, one beat, backlog, every-line restart/failure/duplicate, stale child and complete canon/Du QA');
