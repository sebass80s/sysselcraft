import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {runtimeTestLoader} from './lib/runtime-test-loader.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.RUNTIME_BROWSER_URL||'http://127.0.0.1:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const {ACT3_PARK_002:beat}=runtimeTestLoader()('src/game/act3Park002Content.ts');
const child='00000000-0000-4000-8000-000000000014';
const key=`CapacitorStorage.sysselcraft.act3.runtime.v1.${child}`;
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||undefined,headless:true});
try {
 const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let total=100, stamp=0, offline=false, responseChild=child, requests=0;
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(['127.0.0.1','localhost'].includes(url.hostname))return route.continue();
  if(url.pathname==='/rest/v1/child_game_state'){
   assert.equal(route.request().method(),'GET','Act 3 must never mutate backend');requests++;
   return route.fulfill({status:offline?503:200,contentType:'application/json',body:JSON.stringify(offline?{message:'offline'}:{child_id:responseChild,progression:{worldProgression:total},updated_at:new Date(1800000000000+stamp).toISOString()})});
  }
  return route.fulfill({status:503,contentType:'application/json',body:'{"message":"isolated test"}'});
 });
 await page.addInitScript(({child,key})=>{
  if(!localStorage.getItem(key)){
   localStorage.setItem('CapacitorStorage.sysselcraft.backend.childId',child);
   localStorage.setItem(key,JSON.stringify({version:2,entered:true,openingBeatIndex:6,openingLineIndex:0}));
  }
  const set=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(window.failChapterWrite && k===key)throw Error('test disk failure');return set.call(this,k,v);};
 },{child,key});
 const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 const until=async predicate=>{for(let i=0;i<300;i++){if(await predicate())return;await page.waitForTimeout(50);}assert.fail('Timed out waiting for persisted state');};
 async function enter(){await page.evaluate(()=>sessionStorage.setItem('sysselcraft.act3.preview-entry.v1','1'));await page.reload();}
 async function openPark(){await page.getByRole('button',{name:'Folkparken',exact:true}).tap();await page.getByRole('button',{name:'OK',exact:true}).tap();await page.getByRole('dialog',{name:'Väntar på uppdrag'}).waitFor();}
 async function check(){const before=requests;await page.getByRole('button',{name:'Kontrollera uppdrag',exact:true}).click();await until(async()=>requests>before);await until(async()=>!(await page.getByRole('button',{name:'Kontrollera uppdrag',exact:true}).isDisabled()));}
 await page.goto(base+'/act3');
 await page.getByRole('heading',{name:'Kapitel 3 är låst'}).waitFor();assert.equal(requests,0,'X gate precedes evidence reads');
 await enter();await page.getByRole('region',{name:'Stadskarta'}).waitFor();
 await until(async()=>(await saved()).claimGate?.baseline===100);
 assert.equal((await saved()).version,3);
 await openPark();
 stamp++;await check();assert.equal((await saved()).claimGate.consumed,0,'Approval-only does not change counter');
 total='101';stamp++;await check();await page.getByRole('dialog',{name:'Väntar på uppdrag'}).getByRole('alert').waitFor();assert.equal((await saved()).park002Phase,'waiting','Malformed evidence rejected');
 total=101;responseChild='other-child';await check();assert.equal((await saved()).park002Phase,'waiting');responseChild=child;
 offline=true;await check();assert.equal((await saved()).park002Phase,'waiting');offline=false;
 total=103;stamp++;
 await page.evaluate(()=>window.failChapterWrite=true);await check();await page.getByRole('dialog',{name:'Väntar på uppdrag'}).getByRole('alert').waitFor();
 assert.equal((await saved()).claimGate.consumed,0,'No presentation/consumption after failed write');
 await page.evaluate(()=>window.failChapterWrite=false);
 await page.getByRole('button',{name:'Kontrollera uppdrag',exact:true}).click();
 await page.getByRole('dialog',{name:'Bana sju'}).waitFor();
 assert.equal((await saved()).claimGate.consumed,1);assert.equal((await saved()).claimGate.baseline,100);
 assert.equal((await saved()).claimGate.observedCount,103);
 for(let index=0;index<beat.lines.length;index++){
  const line=beat.lines[index];
  await page.getByText(line.text,{exact:true}).waitFor();
  assert.equal(await page.locator(".shared-story-heading").count(),0,"PARK-002 must share title-free story presentation");
  if(line.speaker)assert.equal(await page.locator('.dialogue-speaker').textContent(),line.speaker);
  assert.equal((await saved()).park002LineIndex,index);
  if(index===4){
   await enter();await page.getByText(line.text,{exact:true}).waitFor();
   assert.equal((await saved()).claimGate.consumed,1,'Reload does not consume twice');
   await page.getByRole('button',{name:'Föregående',exact:true}).click();
   await page.getByText(beat.lines[index-1].text,{exact:true}).waitFor();
   await page.getByRole('button',{name:'Fortsätt',exact:true}).click();
   await page.getByText(line.text,{exact:true}).waitFor();
  }
  await page.getByRole('button',{name:index===beat.lines.length-1?'Till kartan':'Fortsätt',exact:true}).click();
 }
 await page.getByRole('button',{name:'Folkparken',exact:true}).waitFor();
 assert.equal((await saved()).park002Phase,'complete');assert.equal((await saved()).claimGate.consumed,1);
 await openPark();await page.getByText('Du har spelat klart den här delen av testversionen.').waitFor();
 assert.equal(await page.getByRole('button',{name:'Kontrollera uppdrag'}).count(),0);
 await page.getByRole('button',{name:'Till kartan',exact:true}).click();
 const before=JSON.stringify(await saved());
 await page.getByRole('button',{name:'Hamnen',exact:true}).tap();await page.getByRole('button',{name:'Gå tillbaka',exact:true}).tap();
 assert.equal(JSON.stringify(await saved()),before);
 await page.getByRole('button',{name:'Hamnen',exact:true}).tap();await page.getByRole('button',{name:'OK',exact:true}).tap();
 await page.waitForURL(/\/act2\/?$/);assert.equal(JSON.stringify(await saved()),before,'Hamn does not consume BOAT or PARK progress');
 assert.deepEqual(errors,[]);
 console.log('PASS: production React PARK-002, X guard, v2 migration, baseline, approval-only/invalid/offline/wrong child/write failure, actual 28 Du paragraphs, reload/previous, one claim, backlog and harbor');
 await context.close();
}finally{await browser.close();}
