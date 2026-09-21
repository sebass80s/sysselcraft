import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const loadDependency = createRequire(import.meta.url);
// Optional browser check: install Playwright separately or set PLAYWRIGHT_MODULE.
const {chromium}=loadDependency(process.env.PLAYWRIGHT_MODULE || 'playwright');
loadDependency('@next/env').loadEnvConfig(process.cwd(),false,{info(){},error(){}});
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const base=process.env.ALPHA_TEST_URL || 'http://127.0.0.1:8766';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname), 'Use a local test server only');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE,headless:true});
try {
async function pageSetup(noConfig=false,native=false){
 const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{const u=route.request().url();if(u.startsWith(base)){
  if(noConfig&&u.endsWith('.js')){let body=readFileSync('out'+new URL(u).pathname,'utf8');for(const v of [url,key])if(v)body=body.split(JSON.stringify(v)).join('""');await route.fulfill({status:200,contentType:'application/javascript',body});}else await route.continue();
 }else await route.fulfill({status:503,contentType:'application/json',body:'{"message":"offline test"}'});});
 if(native)await page.addInitScript(()=>{window.CapacitorCustomPlatform={name:'ios'};});
 return {page,errors};
}
{
 const {page,errors}=await pageSetup();await page.addInitScript(()=>localStorage.setItem('CapacitorStorage.sysselcraft.save.v1','{broken'));
 await page.goto(base);await page.getByText('Sparningen kunde inte öppnas',{exact:true}).waitFor();
 assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('CapacitorStorage.sysselcraft.save.v1')),'{broken');assert.deepEqual(errors,[]);
 console.log('PASS corrupt save: blocked startup, unchanged bytes, retry visible');await page.unrouteAll({behavior:'wait'});await page.close();
}
{
 const {page,errors}=await pageSetup();
 await page.addInitScript(()=>{
  window.failTestSave=true;const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(window.failTestSave&&k==='CapacitorStorage.sysselcraft.save.v1')throw new Error('test storage full');return original.call(this,k,v);};
 });
 await page.goto(base);await page.getByText('Framstegen kunde inte sparas',{exact:true}).waitFor();
 await page.evaluate(()=>window.failTestSave=false);await page.getByRole('button',{name:'Försök spara igen',exact:true}).click();
 await page.getByText('Framstegen kunde inte sparas',{exact:true}).waitFor({state:'hidden'});
 assert(await page.evaluate(()=>JSON.parse(localStorage.getItem('CapacitorStorage.sysselcraft.save.v1')).version===1));assert.deepEqual(errors,[]);
 console.log('PASS autosave failure: visible error, retry persists without reset/reload');await page.unrouteAll({behavior:'wait'});await page.close();
}
{
 const {page,errors}=await pageSetup(true);await page.goto(base+'/parent/');await page.getByText('Supabase is not configured.',{exact:false}).waitFor();assert.deepEqual(errors,[]);await page.getByRole('link',{name:'← Tillbaka till byn'}).click();await page.getByRole('button',{name:'Öppna vuxenläge',exact:true}).waitFor();console.log('PASS missing config parent route: visible error, no crash, return to village');await page.unrouteAll({behavior:'wait'});await page.close();
}
{
 assert(url,'public config required for mocked pairing test');const {page,errors}=await pageSetup(false,true);
 const storageKey='sb-'+new URL(url).hostname.split('.')[0]+'-auth-token';const exp=Math.floor(Date.now()/1000)+3600;
 const token='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({sub:'test-user',exp})).toString('base64url')+'.test';
 await page.addInitScript(({storageKey,token,exp})=>localStorage.setItem(storageKey,JSON.stringify({access_token:token,refresh_token:'test-refresh',expires_at:exp,expires_in:3600,token_type:'bearer',user:{id:'test-user',is_anonymous:true,aud:'authenticated'}})),{storageKey,token,exp});
 let reads=0, offline=false;await page.route(url+'/**',async route=>{const u=route.request().url();let result=null;if(offline)return route.fulfill({status:503,contentType:'application/json',body:'{"message":"offline test"}'});
 if(u.includes('/rpc/redeem_child_pairing_code'))result='test-child';
 else if(u.includes('/rpc/is_bound_child'))result=true;
 else if(u.includes('/child_game_state'))result={child_id:'test-child',diamonds:0,syssel_bux:0,progression:{},world_flags:{}};
 else if(u.includes('/rpc/list_child_quests')){reads++;result=[{instance_id:'test-instance',quest_id:'test-quest',household_id:'test-household',child_id:'test-child',title:'Alpha test quest',description:'Mock only',progression_class:'community',reward_diamonds:1,reward_syssel_bux:1,state:'available',created_at:new Date().toISOString()}];}
 else throw new Error('Unexpected mock API path '+new URL(u).pathname);
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
 });
 await page.goto(base);await page.locator('canvas').waitFor();await page.evaluate(()=>window.originalCanvas=document.querySelector('canvas'));
 await page.getByRole('button',{name:'📱 Koppla enhet',exact:true}).click();assert.equal(page.url(),base+'/');
 await page.getByLabel('Parningskod').fill('1234abcd');await page.getByRole('button',{name:'Koppla enheten',exact:true}).click();await page.getByText('Enheten är kopplad! 🎉',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Stäng parning',exact:true}).click();await page.getByRole('button',{name:/📜 Uppdrag/}).click();await page.getByText('Alpha test quest',{exact:true}).waitFor();
 assert(reads>0);assert(await page.evaluate(()=>window.originalCanvas===document.querySelector('canvas')));assert.deepEqual(errors,[]);
 console.log('PASS mocked native pairing: no navigation, binding refreshes quest panel, canvas retained');
 offline=true;await page.reload();await page.getByRole('button',{name:/📜 Uppdrag/}).click();
 await page.getByText(/Kunde inte hämta uppdragen|Kunde inte synka uppdragen/).waitFor();
 offline=false;await page.getByRole('button',{name:'↻ Uppdatera',exact:true}).click();await page.getByText('Uppdragen är uppdaterade.',{exact:true}).waitFor();await page.getByText('Alpha test quest',{exact:true}).waitFor();
 console.log('PASS offline initial load: manual retry recovers without re-pairing');await page.unrouteAll({behavior:'wait'});await page.close();
}
// Stateful transport fixture: asserts client actions and rendering, not SQL idempotency.
{
 const {page,errors}=await pageSetup(false,true);
 const storageKey='sb-'+new URL(url).hostname.split('.')[0]+'-auth-token';
 const exp=Math.floor(Date.now()/1000)+3600;
 const token='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({sub:'test-user',exp})).toString('base64url')+'.test';
 await page.addInitScript(({storageKey,token,exp})=>{
  localStorage.setItem(storageKey,JSON.stringify({access_token:token,refresh_token:'test-refresh',expires_at:exp,expires_in:3600,token_type:'bearer',user:{id:'test-user',is_anonymous:true,aud:'authenticated'}}));
  localStorage.setItem('CapacitorStorage.sysselcraft.backend.childId','child-one');
  window.CapacitorCustomPlatform={name:'ios'};
 },{storageKey,token,exp});
 let state='available', reward=0, nextDay=false, submissions=0, reads=0, holdNext=false, releaseOld, held;
 const childReads=[];
 const row=(id,child,state)=>({instance_id:id,quest_id:'daily-definition',household_id:'household',child_id:child,title:child==='child-two'?'Second child quest':'Daily alpha quest',description:'Mock occurrence',progression_class:'community',reward_diamonds:2,reward_syssel_bux:3,state,created_at:new Date().toISOString()});
 await page.route(url+'/**',async route=>{
  const u=new URL(route.request().url());let result;
  const args=route.request().postDataJSON();
  if(u.pathname.endsWith('/is_bound_child')) result=true;
  else if(u.pathname.endsWith('/redeem_child_pairing_code')) result='child-two';
  else if(u.pathname.endsWith('/submit_quest')) {
   submissions++;assert.equal(args.p_instance_id,'day-one');state='pending';result=null;
  } else if(u.pathname.endsWith('/list_child_quests')) {
   reads++;childReads.push(args.p_child_id);
   result=args.p_child_id==='child-two'?[row('other-day','child-two','available')]:[row('day-one','child-one',state),...(nextDay?[row('day-two','child-one','available')]:[])];
   if(holdNext){holdNext=false;held=true;await new Promise(resolve=>releaseOld=resolve);}
  } else if(u.pathname.endsWith('/child_game_state')) result={child_id:'child-one',diamonds:reward,syssel_bux:reward?3:0,progression:{},world_flags:{}};
  else throw Error('Unexpected backend operation: '+u.pathname);
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
 });
 const until=async predicate=>{for(let n=0;n<100;n++){if(predicate())return;await new Promise(r=>setTimeout(r,20));}assert(predicate(),'expected mocked request did not arrive');};
 await page.goto(base);await page.getByRole('button',{name:/📜 Uppdrag/}).click();
 await page.getByText('Daily alpha quest',{exact:true}).waitFor();
 // Hold an available snapshot across submit. Its late response must not resurrect the button.
 holdNext=true;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await until(()=>held);
 await page.getByRole('button',{name:'Jag är klar',exact:true}).evaluate(button=>{button.click();button.click();});
 await page.getByText('⏳ Väntar på en vuxen',{exact:true}).waitFor();
 releaseOld();await page.waitForTimeout(150);
 assert.equal(await page.getByRole('button',{name:'Jag är klar',exact:true}).count(),0);
 assert.equal(submissions,1,'same-tick double tap sends exactly one mutation');
 // Server approval is a fixture transition, not a call to live parent auth/review.
 state='approved';reward=2;
 await page.getByRole('button',{name:'↻ Uppdatera',exact:true}).click();
 await page.getByText('Alla uppdrag är klara just nu. 🌱',{exact:true}).waitFor();
 for(let n=0;n<3;n++){
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await page.waitForTimeout(80);
 }
 assert.equal(await page.getByText('Daily alpha quest',{exact:true}).count(),0);
 assert.equal(submissions,1,'background reads cannot submit/reward again');
 assert.match(await page.locator('aside[aria-label="Föräldrauppdrag"] header').innerText(),/💎 2 · 🪙 3/);
 nextDay=true;
 await page.getByRole('button',{name:'↻ Uppdatera',exact:true}).click();
 await page.getByRole('button',{name:'Jag är klar',exact:true}).waitFor();
 assert.equal(await page.getByText('Daily alpha quest',{exact:true}).count(),1,'new occurrence appears once; approved history stays hidden');
 assert.equal(await page.getByText('⏳ Väntar på en vuxen',{exact:true}).count(),0);
 // The bridge has one owner, even when several requests arrive in the same tick.
 await page.evaluate(()=>{for(let n=0;n<3;n++)window.dispatchEvent(new CustomEvent('sysselcraft:child-pairing-open'));});
 await page.getByRole('button',{name:'Koppla om till ett annat barn',exact:true}).waitFor();
 assert.equal(await page.getByRole('dialog',{name:'Koppla Sysselcraft',exact:true}).count(),1);
 // Rebind while an old-child response is still in flight.
 held=false;holdNext=true;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await until(()=>held);
 await page.getByRole('button',{name:'Koppla om till ett annat barn',exact:true}).click();
 await page.getByLabel('Parningskod').fill('1234abcd');
 await page.getByRole('button',{name:'Koppla om enheten',exact:true}).click();
 await page.getByText('Enheten är kopplad! 🎉',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Stäng parning',exact:true}).click();
 await page.getByRole('button',{name:/📜 Uppdrag/}).click();
 await page.getByText('Second child quest',{exact:true}).waitFor();
 releaseOld();await page.waitForTimeout(150);
 assert.equal(await page.getByText('Daily alpha quest',{exact:true}).count(),0);
 assert(childReads.includes('child-two'));
 const focusReads=reads;
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await until(()=>reads>focusReads);await page.waitForTimeout(150);
 assert.equal(reads,focusReads+1,'rebind leaves only one focus listener');
 // Verify actual timer cadence and cleanup with a browser clock (no real 30 s wait).
 await page.clock.install();
 await page.getByRole('button',{name:/📜 Uppdrag/}).click(); // installs closed timer under fake clock
 const closedReads=reads;await page.clock.fastForward(30_000);await until(()=>reads>closedReads);await page.waitForTimeout(150);assert.equal(reads,closedReads+1,"one closed poll at 30 s");
 await page.getByRole('button',{name:/📜 Uppdrag/}).click(); // replaces it with open timer
 const openReads=reads;await page.clock.fastForward(15_000);await until(()=>reads>openReads);await page.waitForTimeout(150);assert.equal(reads,openReads+1,"one open poll at 15 s");
 assert.equal(submissions,1);
 assert.deepEqual(errors,[]);
 // Web navigation unmounts the child inbox; its timers/listeners must stop.
 await page.evaluate(()=>{window.CapacitorCustomPlatform.name="web";});
 await page.getByRole('button',{name:'Koppla om',exact:true}).click();
 await page.waitForURL('**/pair/');
 const afterUnmount=reads;
 await page.clock.fastForward(60_000);
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await page.waitForTimeout(150);
 assert.equal(reads,afterUnmount,'no quest polling after unmount');
 console.log('PASS lifecycle, stale poll after submit, single mutation, recurring history, rebind, single overlay, 15/30 s timers and unmount');
 await page.unrouteAll({behavior:'wait'});await page.close();
}

} finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
