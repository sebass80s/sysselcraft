#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const registry=JSON.parse(fs.readFileSync("src/game/act3ContentRegistry.json","utf8"));
const story=fs.readFileSync("docs/ACT3_STORY_MANIFEST.md","utf8");
const ranges=[["OPEN",0,5],["PARK",1,10],["CITY",1,3],["HOME",1,8],["BOAT",1,5],["VILLAGE",1,3],["HUNT",1,6],["PARK",11,22],["DRAMA",1,10],["ARCADE",1,6],["DRAMA",11,15],["VILLAGE",4,26],["PREP",1,6],["REVEAL",1,4],["SECRET",1,6],["FAMILY",1,21],["EPILOG",1,6]];
const ids=ranges.flatMap(([g,a,z])=>Array.from({length:z-a+1},(_,i)=>"A3-"+g+"-"+String(a+i).padStart(3,"0")));
const headings=[...story.matchAll(/^#{2,3}\s+(A3-[A-Z]+-\d{3})\s+[—–-]\s*(.*)$/gm)];
const names=new Set(["Barnet","Alve","Nova","Mira","Henning","Linus","Sol","Henrik","Mamma","Pappa","Rebecka"]);
function digest(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,"0")}
function speakers(s){return [...new Set([...s.matchAll(/\*\*([^*\n:]+):\*\*/g)].map(m=>m[1].trim().replace(/\s*\(.*\)$/,"")).filter(x=>names.has(x)))]}
function selectedScene(row){
 const ref=row.script;
 assert.equal(ref.document,"docs/ACT3_STORY_MANIFEST.md");
 if(ref.selection==="standalone_locked_section"){
   assert.equal(row.id,"A3-VILLAGE-009");
   const idx=story.indexOf(ref.headingMarker);
   assert.ok(idx>=0,"Missing 11N VILLAGE-009");
   const tail=story.slice(idx+ref.headingMarker.length),end=tail.search(/\n## /);
   return(end<0?tail:tail.slice(0,end)).trim();
 }
 const a=headings.filter(m=>m[1]===row.id);
 assert.ok(a.length>0,"No heading for "+row.id);
 assert.equal(a.length,ref.occurrence,"Manus occurrence drift "+row.id);
 const m=a.at(-1);
 assert.equal(m[0],ref.headingMarker,"Wrong source heading "+row.id);
 const tail=story.slice(m.index+m[0].length),end=tail.search(/\n#{2,3} /);
 return(end<0?tail:tail.slice(0,end)).trim();
}
assert.equal(registry.schemaVersion,1);
assert.equal(registry.status,"verified_asset_and_source_inventory_not_runtime_dialogue_export");
assert.deepEqual(registry.beats.map(r=>r.id),ids,"Chronology changed");
assert.equal(registry.beats.length,140);
const paths=new Set();
for(const [i,row] of registry.beats.entries()){
 assert.equal(row.index,i);
 assert.equal(row.mapLocationId,null,"Location hints are not route config");
 const scene=selectedScene(row);
 assert.equal(row.script.selectedSceneDigestFnv1a32,digest(scene),"Source dialogue drift "+row.id);
 assert.deepEqual(row.script.speakerIds,speakers(scene),"Speakers drift "+row.id);
 const kind=i<=6?"free_intro":i<=112?"one_new_claim_per_beat":i<=133?"family_continuation":i===134?"one_new_epilogue_claim":"epilogue_continuation";
 assert.equal(row.progression.gateKind,kind,"Quest rule drift "+row.id);
 assert.equal(row.progression.questNumber,i>=7&&i<=112?i-6:i===134?107:null);
 if(i===0){assert.equal(row.image,null,"OPEN-000 is a chapter card");continue;}
 const expected="public/assets/village/story-moments/act3/"+row.group.toLowerCase()+"/"+row.id.slice(3)+".png";
 assert.equal(row.image.repositoryPath,expected);
 assert.equal(row.image.publicUrl,"/"+expected.slice("public/".length));
 assert.ok(fs.existsSync(expected),"Missing art "+row.id);
 assert.ok(!paths.has(expected),"Duplicate path "+expected);
 paths.add(expected);
}
assert.equal(paths.size,139);
assert.equal(registry.beats.filter(r=>r.progression.gateKind==="one_new_claim_per_beat").length,106);
assert.equal(registry.beats.filter(r=>r.progression.gateKind==="family_continuation").length,21);
assert.equal(registry.beats.filter(r=>r.progression.gateKind==="epilogue_continuation").length,5);
for(const n of [19,20,21,22]){
 const row=registry.beats.find(r=>r.id==="A3-PARK-"+String(n).padStart(3,"0"));
 assert.ok(row.script.headingMarker.startsWith("## "),"Must use restored 11AU dialogue");
}
assert.equal(registry.beats.find(r=>r.id==="A3-VILLAGE-009").script.selection,"standalone_locked_section");
const extras=registry.unusedIllustrations.map(x=>x.repositoryPath);
assert.deepEqual(extras.slice().sort(),[
 "public/assets/village/story-moments/act3/open/Golden-Hour Harbor Conversation.png",
 "public/assets/village/story-moments/act3/open/Golden-Hour Harbor Encounter.png",
 "public/assets/village/story-moments/act3/park/passardennanånstans .png"
].sort());
const all=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith(".png"))all.push(p)}}
walk("public/assets/village/story-moments/act3");
assert.equal(all.length,142);
assert.deepEqual(all.filter(p=>!paths.has(p)).sort(),extras.slice().sort());
const duplicate=registry.intentionalImageReuse[0].map(id=>registry.beats.find(r=>r.id===id).image.repositoryPath);
assert.equal(duplicate.length,3);
assert.ok(fs.readFileSync(duplicate[0]).equals(fs.readFileSync(duplicate[1])),"FAMILY-015/016 must match");
assert.ok(fs.readFileSync(duplicate[1]).equals(fs.readFileSync(duplicate[2])),"FAMILY-016/017 must match");
assert.equal(registry.beats.find(r=>r.id==="A3-PARK-009").minigame,"minigolf");
assert.equal(registry.beats.find(r=>r.id==="A3-PARK-020").minigame,"shuffleboard");
assert.equal(registry.beats.find(r=>r.id==="A3-FAMILY-006").minigame,"shuffleboard");
console.log("Act 3 content registry: 140 beats / 139 beat images / 3 extras / 107 quest claims: PASS");
