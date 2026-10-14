#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { runtimeTestLoader } from "./lib/runtime-test-loader.mjs";
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base=process.env.RUNTIME_BROWSER_URL || "http://127.0.0.1:3000";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname));
const compiled=ts.transpileModule(fs.readFileSync("src/game/act3OpeningContent.ts","utf8"),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText;
const exported={};
vm.runInNewContext(compiled,{exports:exported});
const {ACT3_OPENING_BEATS,renderAct3OpeningText}=exported;
const load=runtimeTestLoader();
const {storySpeakerDisplayName,storyNarrationDisplayText}=load("src/runtime/story/speakerIdentity.ts");
const {ACT3_SPEAKER_REVEALS}=load("src/game/act3SpeakerReveals.ts");
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||undefined,headless:true});
const errors=[];
try {
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/act3-test",{waitUntil:"domcontentloaded"});
  let total=0;
  for(const [i,beat] of ACT3_OPENING_BEATS.entries()){
    for(let index=0;index<beat.lines.length;index++){
      const line=beat.lines[index];
      const cursor={beatIndex:i,lineIndex:index};
      const canonicalText=renderAct3OpeningText(line.text,"Testspelaren");
      const expected=line.speaker===null
        ? storyNarrationDisplayText(canonicalText,cursor,ACT3_SPEAKER_REVEALS)
        : canonicalText;
      await page.getByText(expected,{exact:true}).waitFor({state:"visible",timeout:15000});
      await page.getByRole("dialog",{name:beat.title}).waitFor({state:"visible"});
      assert.equal(await page.locator(".shared-story-heading").count(),0,"Regular story beats never show scene headings");
      const speakerNode=page.locator(".shared-story-dialogue .dialogue-speaker");
      const expectedSpeaker=storySpeakerDisplayName(line.speaker,cursor,ACT3_SPEAKER_REVEALS);
      assert.equal(await speakerNode.count(),expectedSpeaker===null?0:1,"One nameplate per spoken line");
      if(expectedSpeaker!==null)assert.equal(await speakerNode.textContent(),expectedSpeaker,"Character identity must follow the authored reveal cursor");
      const button=i===ACT3_OPENING_BEATS.length-1 && index===beat.lines.length-1?"Till kartan":"Fortsätt";
      await page.getByRole("button",{name:button,exact:true}).click();
      total++;
    }
  }
  assert.equal(total,139,"No authored opening paragraph or spoken line was skipped");
  await page.getByText(/PARK-002 är låst/).waitFor();
  // The map lays out its contained background/pins through ResizeObserver;
  // wait for the actual rendered pins rather than assuming a synchronous paint.
  await page.locator('[data-act3-node="folkpark"]').waitFor({state:"attached"});
  assert.equal(await page.locator('[data-act3-node]').count(),2,"Only harbor + discovered Folkparken");
  await page.getByRole("button",{name:"Till kartan",exact:true}).click();
  assert.equal(await page.locator('[data-act3-node]').count(),2);
  assert.equal(await page.locator('[aria-current="location"]').getAttribute("aria-label"),"Folkparken");
  await page.getByRole("button",{name:"Folkparken",exact:true}).tap();
  await page.getByRole("dialog",{name:"Vi går till parken."}).waitFor();
  await page.getByRole("button",{name:"Gå tillbaka",exact:true}).tap();
  assert.equal(await page.getByText(/PARK-002 är låst/).count(),0,"Cancel must never start quest-gated story");
  await page.getByRole("button",{name:"Folkparken",exact:true}).tap();
  await page.getByRole("button",{name:"OK",exact:true}).tap();
  await page.getByText(/PARK-002 är låst/).waitFor();
  assert.deepEqual(errors,[],"Browser must not report uncaught exceptions");
  console.log("PASS: 139 authored Act 3 story lines, real Du nameplates, park discovery and closed PARK-002 gate in React browser");
  await context.close();
} finally {
  await browser.close();
}
