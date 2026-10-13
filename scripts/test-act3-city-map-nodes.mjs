#!/usr/bin/env node
import assert from "node:assert/strict";
import { ACT3_CITY_NODES, ACT3_CITY_MAP_REFERENCE, ACT3_CITY_CONFIRM_BUTTONS, getVisibleAct3CityNodes, getAct3CityNodeConfirmation } from "../src/game/act3CityMapNodes.ts";
assert.deepEqual(ACT3_CITY_NODES.map(n=>n.id),["harbor","folkpark","nova-home","game-shop","treasure-hunt"]);
assert.equal(new Set(ACT3_CITY_NODES.map(n=>n.id)).size,5);
assert.equal(ACT3_CITY_MAP_REFERENCE.width,1672);
assert.equal(ACT3_CITY_MAP_REFERENCE.height,941);
assert.equal(ACT3_CITY_MAP_REFERENCE.backgroundPublicUrl,"/assets/village/act3-map/city-background.png");
for(const n of ACT3_CITY_NODES){assert.ok(n.xPct>0&&n.xPct<100,"x "+n.id);assert.ok(n.yPct>0&&n.yPct<100,"y "+n.id);assert.ok(n.confirmText.length>4);}
const start={discoveredPermanentIds:[],huntActive:false,arcadeRevealed:false,activeNodeId:null};
assert.deepEqual(getVisibleAct3CityNodes(start).map(n=>n.id),["harbor"]);
assert.equal(getAct3CityNodeConfirmation("folkpark",start),null);
assert.deepEqual(ACT3_CITY_CONFIRM_BUTTONS,{accept:"OK",cancel:"Gå tillbaka"});
assert.deepEqual(getAct3CityNodeConfirmation("harbor",start),{nodeId:"harbor",text:"Vi går till hamnen.",buttons:ACT3_CITY_CONFIRM_BUTTONS});
const park={...start,discoveredPermanentIds:["folkpark"],activeNodeId:"folkpark"};
assert.deepEqual(getVisibleAct3CityNodes(park).map(n=>n.id),["harbor","folkpark"]);
assert.equal(getVisibleAct3CityNodes(park)[1].active,true);
assert.equal(getAct3CityNodeConfirmation("folkpark",park).text,"Vi går till parken.");
const shop={...start,discoveredPermanentIds:["game-shop"]};
assert.equal(getVisibleAct3CityNodes(shop).find(n=>n.id==="game-shop").label,"Spelbutiken");
const arcade={...shop,arcadeRevealed:true};
assert.equal(getVisibleAct3CityNodes(arcade).find(n=>n.id==="game-shop").label,"Arkaden");
assert.equal(getAct3CityNodeConfirmation("game-shop",arcade).text,"Vi går till arkaden.");
assert.deepEqual(getVisibleAct3CityNodes({...start,huntActive:true}).map(n=>n.id),["harbor","treasure-hunt"]);
assert.equal(getAct3CityNodeConfirmation("treasure-hunt",{...start,huntActive:true}).text,"Vi fortsätter skattjakten.");
assert.equal(getAct3CityNodeConfirmation("treasure-hunt",start),null);
assert.deepEqual(getVisibleAct3CityNodes({...start,discoveredPermanentIds:["nova-home","game-shop","folkpark"],activeNodeId:"nova-home"}).map(n=>n.id),["harbor","folkpark","nova-home","game-shop"]);
console.log("Act 3 city node schema: 5 positions / discovery / arcade reveal / hunt expiry / confirmation: PASS");
