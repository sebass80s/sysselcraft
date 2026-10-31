#!/usr/bin/env node
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const base=process.env.RUNTIME_BROWSER_URL||"http://127.0.0.1:3000";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname));
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||undefined,headless:true});
try {
  const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.stack||e.message));
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  // The direct physical-device test must not import or boot any chapter host.
  const standalone=await page.goto(base+"/minigolf-test/",{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(standalone.status(),200,"The standalone development-only test route must exist");
  await page.getByRole("dialog",{name:"Minigolf"}).waitFor({state:"visible",timeout:20000});
  assert.equal(await page.getByText("Laddar kapitel 3…").count(),0,
    "The touch lab never renders the chapter loading screen");
  await page.getByRole("button",{name:/Håll för styrka/}).waitFor({state:"visible"});
  assert.deepEqual(errors,[],"Standalone phone preview must not throw client errors");

  const url=base+"/act3-test/?scene=park009&play=1";
  const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response.status(),200);
  try {
    await page.getByRole("dialog",{name:"Minigolf"}).waitFor({state:"visible",timeout:20000});
  } catch(error) {
    console.error("Minigolf preview did not hydrate:",JSON.stringify({
      url:page.url(),body:(await page.locator("body").innerText()).slice(0,1600),
      errors,source:(await page.content()).slice(-500)
    },null,2));
    throw error;
  }
  assert.equal(await page.getByText("Laddar kapitel 3…").count(),0);
  assert.equal(await page.getByRole("button",{name:/Håll för styrka/}).count(),1);
  assert.deepEqual(errors,[],"Phone preview must not throw client errors");
  await context.close();
  console.log("PASS: standalone touch lab and Act 3 debug route both boot minigolf on mobile viewport");
} finally { await browser.close() }
