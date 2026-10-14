#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const ui=read("src/components/Act3Skeleton.tsx");
const state=read("src/game/act3RuntimeState.ts");
const progress=read("src/game/act3OpeningProgress.ts");
const debug=read("src/game/act3DebugFixture.ts");
const parent=read("src/components/Act2Runtime.tsx");
assert.match(ui,/<StoryRunner[\s\S]*onNext=\{playingPark002[^}]+nextAct3Park002State[^}]+advanceOpening\}/,"Shared StoryRunner must present Act 3 opening");
assert.match(ui,/storyLineAt\(currentBeat\.lines, lineIndex\)/);
assert.match(ui,/speaker: currentLine\.speaker \?\? undefined/);
assert.match(ui,/currentLine\.speaker === "Du" \? "child"/);
assert.match(ui,/renderAct3OpeningText\(currentLine\.text, context\.childName\)/);
assert.match(ui,/loadSaveState\(\)/,"Resolve player's real name from existing Act 1 save");
assert.match(ui,/consumeAct3PreviewEntry\(window\.sessionStorage\)/);
assert.ok(ui.indexOf("consumeAct3PreviewEntry(window.sessionStorage)")<ui.indexOf("loadAct3RuntimeState({ expectedChildId:"),"Never access chapter save without adult grant");
assert.match(ui,/async function advanceOpening\(\)[\s\S]*await commitFromView/);
assert.match(ui,/async function rewindOpening\(\)[\s\S]*await commitFromView/);
assert.match(ui,/onPrevious=\{lineIndex > 0[\s\S]*rewindOpening/);
assert.match(ui,/setWaitingAtPark\(true\)/);
assert.match(ui,/PARK-002 är låst/);
assert.match(ui,/nodeId === "harbor"[\s\S]*router\.push\(chapterRoute\("act2"\)\)/);
assert.match(ui,/act3OpeningMapVisibility\(state\)/);
assert.match(ui,/ACT3_FREE_OPENING_BEAT_COUNT/);
assert.match(progress,/openingBeatIndex: state\.openingBeatIndex \+ 1/);
assert.match(progress,/parkDiscovered = state\.entered && state\.openingBeatIndex === ACT3_FREE_OPENING_BEAT_COUNT/);
assert.match(state,/migrate: migrateAct3RuntimeState/);
assert.match(state,/createChapterPersistenceHost<Act3RuntimeState>/);
assert.match(debug,/childName: "Testspelaren"/);
assert.match(parent,/Kapitel 3 kommer snart/,"Do not unlock production Act 3 from normal Act 2");
for (const forbidden of ["@capacitor/preferences","@supabase/supabase-js","purchaseStoryItem","incrementQuest","wallet","setInterval("]) {
 assert.ok(!ui.includes(forbidden),"No parallel quest/backend/save engine in Act 3 skeleton: "+forbidden);
}
console.log("PASS: Act 3 opening uses shared StoryRunner, preview boundary, save-first cursor and locked first quest");
