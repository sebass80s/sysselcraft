#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
const story=fs.readFileSync("docs/ACT3_STORY_MANIFEST.md","utf8");
const files=["A3-PARK-002","A3-PARK-003"];
for(const beatId of files){
 const c=JSON.parse(fs.readFileSync(`image-pipeline/contracts/${beatId}.json`,"utf8"));
 const start=story.indexOf(c.storyHeading);
 assert.ok(start>=0,`Missing canon beat ${beatId}`);
 const end=story.indexOf("\n### ",start+c.storyHeading.length);
 const scene=story.slice(start,end<0?undefined:end);
 assert.ok(c.verbatimStoryQuotes.length>=2 && c.verbatimStoryQuotes.every(q=>scene.includes(q)),`Script evidence drift: ${beatId}`);
 assert.deepEqual([...c.cast].sort(),["alve","barnet","nova"].sort());
 assert.ok(c.requiredVisuals.every(x=>c.finalPrompt.toLowerCase().includes(x.toLowerCase())),`Missing required visual: ${beatId}`);
 assert.ok(c.forbiddenVisuals.every(x=>!c.finalPrompt.toLowerCase().includes(x.toLowerCase())),`Forbidden visual in prompt: ${beatId}`);
 assert.ok(c.finalPrompt.includes("Barnet") && c.finalPrompt.includes("Nova") && c.finalPrompt.includes("Alve"));
}
const stage=JSON.parse(fs.readFileSync("image-pipeline/contracts/A3-PARK-003.json","utf8"));
assert.match(stage.finalPrompt,/outdoor stage/i);
assert.match(stage.finalPrompt,/two teenage musicians/i);
assert.match(stage.finalPrompt,/semicircle/i);
assert.match(stage.finalPrompt,/blue-green sweatshirt/i);
assert.match(stage.finalPrompt,/dark-red hoodie/i);
assert.match(stage.finalPrompt,/cargo shorts/i);
const script=fs.readFileSync("scripts/preflight-art-job.mjs","utf8");
assert.match(script,/Final renderer prompt differs from LOCKED scene contract/);
assert.match(script,/approvedFinalPromptSha256/);
assert.match(script,/attached-to-renderer/);
// The chapter-three cast must be resolvable from the same verified PNG root.
const registry=JSON.parse(fs.readFileSync("image-pipeline/character-registry.json","utf8"));
const canonicalRoot="public/assets/character-sheets";
assert.equal(registry.characterSheetRoot,canonicalRoot);
for(const id of ["nova","barnet","alve","mira","sol","linus","henning","puppy","rebecka","mamma-nova","pappa-nova","henrik"]){
 const ref=registry.characters[id];
 assert.ok(ref,`Unregistered canonical character: ${id}`);
 assert.equal(ref.characterSheet,`${canonicalRoot}/${id}.png`);
 assert.ok(fs.existsSync(ref.characterSheet),`Missing canonical reference PNG for ${id}`);
 assert.ok(typeof ref.chatLibraryPath==="string" && ref.chatLibraryPath.length>0,`No expected Library locator for ${id}`);
}
const pipelineSource=fs.readFileSync("scripts/lib/art-pipeline.mjs","utf8");
assert.match(pipelineSource,/CANONICAL_SHEET_ROOT = "public\\/assets\\/character-sheets\\/"/);

console.log("art pipeline 2.1 contract regression: PASS");
