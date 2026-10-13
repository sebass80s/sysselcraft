#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
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
      const expected=renderAct3OpeningText(line.text,"Testspelaren");
      await page.getByText(expected,{exact:true}).waitFor({state:"visible",timeout:15000});
      await page.getByRole("dialog",{name:beat.title}).waitFor({state:"visible"});
      if(line.speaker)await page.locator(".dialogue-speaker",{hasText:line.speaker}).first().waitFor();
      const button=i===ACT3_OPENING_BEATS.length-1 && index===beat.lines.length-1?"Till kartan":"Fortsätt";
      await page.getByRole("button",{name:button,exact:true}).click();
      total++;
    }
  }
  assert.equal(total,139,"No authored opening paragraph or spoken line was skipped");
  await page.getByText(/PARK-002 är låst/).waitFor();
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
