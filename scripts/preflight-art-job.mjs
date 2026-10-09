#!/usr/bin/env node
// Fail-closed art preflight. Never invokes an image generator.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
const args = Object.fromEntries(process.argv.slice(2).filter(v => v.startsWith("--")).map(v => { const i=v.indexOf("="); return i<0?[v.slice(2),true]:[v.slice(2,i),v.slice(i+1)]; }));
function block(reason) { console.error("ART PREFLIGHT BLOCKED: "+reason); process.exit(2); }
function readJson(p) { try { return JSON.parse(fs.readFileSync(p,"utf8")); } catch(e) { block("Cannot read "+p+": "+e.message); } }
if(!args.job || !args.story || !args.evidence) block("Usage: --job=<job.json> --story=<story.md> --evidence=<receipt.json>");
const job=readJson(args.job), ev=readJson(args.evidence);
if(job.version!==2 || !job.beatId || !job.prompt || !job.outputContract?.repoOutputPath) block("Invalid v2 art job");
if(ev.beatId!==job.beatId) block("Beat ID mismatch");
let story;
try { story=fs.readFileSync(args.story,"utf8"); } catch(e) { block("Missing canonical story: "+e.message); }
const heading="### "+job.beatId+" —";
const index=story.indexOf(heading);
if(index<0) block("Exact story heading missing: "+heading);
const next=story.indexOf("\n### ",index+heading.length);
const scene=story.slice(index,next<0?undefined:next);
if(!Array.isArray(ev.sceneQuotes) || ev.sceneQuotes.length<2 || ev.sceneQuotes.some(q=>typeof q!=="string" || q.trim().length<12 || !scene.includes(q))) block("Verbatim story evidence missing");
if(typeof ev.sceneIntent!=="string" || ev.sceneIntent.trim().length<30) block("Scene intent missing for semantic audit");
if(!Array.isArray(job.characters) || !Array.isArray(ev.cast) || JSON.stringify([...ev.cast].sort())!==JSON.stringify([...job.characters].sort())) block("Cast mismatch");
if(job.exactCastOnly!==true || job.wardrobeLock!==true) block("Cast or wardrobe not locked");
if(job.characters.includes("barnet") && !job.qa?.requiredCheckIds?.includes("barnet-face-hidden")) block("Barnet face-hidden check missing");
if(!Array.isArray(job.characterRefs) || job.characterRefs.length!==job.characters.length) block("Missing canonical character reference");
const files=[...job.characterRefs.map(r=>r.repoPath),...(job.environmentReferencePaths||[]),...(job.anchorReferencePaths||[])];
if(files.some(p=>!p || !fs.existsSync(p))) block("Missing physical image reference");
if(!Array.isArray(ev.imageInputs) || ev.imageInputs.length!==files.length) block("Renderer input receipt count mismatch");
for(let i=0;i<files.length;i++){
 const p=files[i], input=ev.imageInputs[i];
 const sha256=crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
 if(input?.path!==p || input?.status!=="attached-to-renderer" || input?.sha256!==sha256) block("Unverified image reference: "+p);
}
if(ev.confirmedStoryMatch!==true || ev.confirmedReferenceVisibility!==true || ev.confirmedLocationContinuity!==true) block("Pre-render semantic checks incomplete");
const result={status:"PREFLIGHT_PASSED",beatId:job.beatId,storySha256:crypto.createHash("sha256").update(story).digest("hex"),jobSha256:crypto.createHash("sha256").update(fs.readFileSync(args.job)).digest("hex"),inputCount:files.length};
const out=args.out||path.join("image-pipeline/out",job.productionId,job.beatId+".preflight.json");
fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");
console.log("ART PREFLIGHT PASS: "+job.beatId+" ("+files.length+" image inputs)");
