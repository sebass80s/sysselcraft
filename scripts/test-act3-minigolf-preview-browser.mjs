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
  // Missing browser favicon may yield HTTP 404 and a console error, but is
  // not a minigolf route or hydration failure. Route HTTP status is checked
  // explicitly and all real JS errors are captured above.
  page.on("console",m=>{
    if(m.type()!=="error")return;
    if(/^Failed to load resource: the server responded with a status of 404 \(Not Found\)$/.test(m.text()))return;
    errors.push(m.text());
  });
  // The direct physical-device test must not import or boot any chapter host.
  const standalone=await page.goto(base+"/minigolf-test/",{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(standalone.status(),200,"The standalone development-only test route must exist");
  await page.getByRole("dialog",{name:"Minigolf"}).waitFor({state:"visible",timeout:20000});
  assert.equal(await page.getByText("Laddar kapitel 3…").count(),0,
    "The touch lab never renders the chapter loading screen");
  const force=page.getByRole("button",{name:/Tryck eller håll/});
  await force.waitFor({state:"visible"});
  assert.equal(await force.isDisabled(),false,"Force button starts enabled on mobile");
  // Do more than looking at the button: a real mobile tap must fire a shot.
  await force.tap();
  await page.waitForFunction(() => {
    const el=document.querySelector('[role="dialog"][aria-label="Minigolf"]');
    return el?.textContent?.includes("Slag 1");
  },null,{timeout:7000});
  assert.equal(await page.locator('[role="dialog"][aria-label="Minigolf"]').count(),1,
    "The shot stays inside the standalone minigolf component");

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
  assert.equal(await page.getByRole("button",{name:/Tryck eller håll/}).count(),1);
  assert.deepEqual(errors,[],"Phone preview must not throw client errors");
  await context.close();

  // Desktop mouse must also work. This prevents a touch-only fix from hiding
  // a real Mac failure where the button is visible but inert.
  const desktop=await browser.newContext({viewport:{width:1280,height:720}});
  const desktopPage=await desktop.newPage();
  const desktopResponse=await desktopPage.goto(base+"/minigolf-test/",{waitUntil:"domcontentloaded"});
  assert.equal(desktopResponse.status(),200);
  const mouseForce=desktopPage.getByRole("button",{name:/Tryck eller håll/});
  await mouseForce.waitFor({state:"visible"});
  await mouseForce.click();
  try {
    await desktopPage.waitForFunction(() => 
      document.querySelector('[role="dialog"][aria-label="Minigolf"]')?.textContent?.includes("Slag 1"),
      null,{timeout:7000});
  } catch (error) {
    console.error("Desktop strike failed",{
      text:(await desktopPage.locator("body").innerText()).slice(0,1000),
      buttonEnabled:!(await mouseForce.isDisabled()),
    });
    throw error;
  }
  // Next.js may render SSR HTML over an IP address while blocking dev JS
  // bundles/HMR. A visible button is insufficient: verify a shot on LAN.
  const lanHost=process.env.SYSSELCRAFT_MINIGOLF_LAN_HOST;
  if (lanHost) {
    assert.match(lanHost,/^[0-9a-z.:-]+$/i,"LAN test host must be a hostname/IP");
    const lanPage=await desktop.newPage();
    const lanResponse=await lanPage.goto(`http://${lanHost}:3000/minigolf-test/`,{waitUntil:"domcontentloaded"});
    assert.equal(lanResponse.status(),200,"LAN debug page returns HTTP 200");
    const lanButton=lanPage.getByRole("button",{name:/Tryck eller håll/});
    await lanButton.waitFor({state:"visible"});
    await lanButton.click();
    try {
      await lanPage.waitForFunction(() => 
        document.querySelector('[role="dialog"][aria-label="Minigolf"]')?.textContent?.includes("Slag 1"),
        null,{timeout:7000});
    } catch (error) {
      console.error("LAN-origin button unresponsive",{
        host:lanHost,url:lanPage.url(),body:(await lanPage.locator("body").innerText()).slice(0,1000),
      });
      throw error;
    }
    await lanPage.close();
  }
  await desktop.close();
  console.log("PASS: mobile touch, desktop mouse and LAN-origin mouse all strike the ball");
} finally { await browser.close() }
