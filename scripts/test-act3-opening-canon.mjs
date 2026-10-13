#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const registry=JSON.parse(fs.readFileSync("src/game/act3ContentRegistry.json","utf8"));
const source=fs.readFileSync("docs/ACT3_STORY_MANIFEST.md","utf8");
const code=fs.readFileSync("src/game/act3OpeningContent.ts","utf8");
const exports={};
vm.runInNewContext(ts.transpileModule(code,{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText,{exports});
const {ACT3_OPENING_BEATS,renderAct3OpeningText}=exports;
const rows=registry.beats.slice(1,7);
const headings=[...source.matchAll(/^#{2,3}\s+(A3-[A-Z]+-\d{3})\s+[—–-]\s*(.*)$/gm)];
const digest=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,"0")};
assert.equal(ACT3_OPENING_BEATS.length,6);
assert.deepEqual(Array.from(ACT3_OPENING_BEATS,b=>b.id),rows.map(b=>b.id));
for(let i=0;i<rows.length;i++){
  const row=rows[i],out=ACT3_OPENING_BEATS[i];
  const matches=headings.filter(m=>m[1]===row.id);
  assert.equal(matches.length,1,"Ambiguous opening heading: "+row.id);
  const h=matches[0],tail=source.slice(h.index+h[0].length),end=tail.search(/\n#{2,3} /);
  const canonical=(end<0?tail:tail.slice(0,end)).trim();
  assert.equal(digest(canonical),row.script.selectedSceneDigestFnv1a32,"Source drift "+row.id);
  assert.equal(out.sourceDigest,digest(canonical),"Export drift "+row.id);
  assert.equal(out.image,row.image.publicUrl);
  const parts=canonical.split(/\n\s*\n/g).map(p=>p.trim()).filter(Boolean).filter(p=>!p.startsWith("**Continuity notes:**"));
  assert.equal(out.lines.length,parts.length,"Missing dialogue/narrative line "+row.id);
  for(let j=0;j<parts.length;j++){
    const p=parts[j],m=/^\*\*([^*\n:]+):\*\*\s*([\s\S]+)$/.exec(p);
    assert.equal(out.lines[j].speaker,m?(m[1]==="Barnet"?"Du":m[1]):null,row.id+" speaker "+j);
    assert.ok(out.lines[j].text.trim());
    assert.doesNotMatch(out.lines[j].text,/\bBarnet\b|Continuity notes/,"No player label or editorial notes in game text");
    if(m && m[1]!=="Barnet")assert.equal(out.lines[j].text,m[2].replaceAll("**","").replaceAll("*","").replace(/\s*\n\s*/g," ").trim(),row.id+" canon dialogue "+j);
  }
}
assert.equal(renderAct3OpeningText("Tack! Jag heter {childName}.","Adam"),"Tack! Jag heter Adam.");
assert.equal(renderAct3OpeningText("Tack! Jag heter {childName}.","Barnet"),"Tack!");
assert.equal(renderAct3OpeningText("Tack! Jag heter {childName}.",""),"Tack!");
console.log("PASS: six Act 3 opening scenes pinned to canon, Du address, actual child name and no production notes");
