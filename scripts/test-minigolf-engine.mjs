import assert from "node:assert/strict";
import { runtimeTestLoader } from "./lib/runtime-test-loader.mjs";
const e = runtimeTestLoader()("src/runtime/minigames/minigolfEngine.ts");
let state = e.startMinigolf();
assert.deepEqual({x:state.x,y:state.y,strokes:state.strokes,holed:state.holed},
  {x:e.MINI_GOLF_START.x,y:e.MINI_GOLF_START.y,strokes:0,holed:false});
assert.strictEqual(e.strikeMinigolf(state,{x:state.x,y:state.y},0.5),state,"No meaningless tap");
state=e.strikeMinigolf(state,{x:650,y:182},.35);
assert.equal(state.strokes,1);
assert.ok(e.minigolfMoving(state));
assert.strictEqual(e.strikeMinigolf(state,{x:650,y:182},1),state,"No second strike while rolling");
for(let i=0;i<900 && e.minigolfMoving(state);i++) {
 state=e.advanceMinigolf(state,1/60);
 assert.ok(state.x>=33-1e-4 && state.x<=687+1e-4,"Ball remains in course x");
 assert.ok(state.y>=33-1e-4 && state.y<=327+1e-4,"Ball remains in course y");
 assert.ok(Number.isFinite(state.x) && Number.isFinite(state.vx));
}
assert.ok(!e.minigolfMoving(state),"Roll eventually stops");
assert.equal(state.strokes,1);
const near={x:e.MINI_GOLF_HOLE.x+20,y:e.MINI_GOLF_HOLE.y,vx:-60,vy:0,strokes:3,holed:false};
let pocket=near;
for(let i=0;i<60 && !pocket.holed;i++)pocket=e.advanceMinigolf(pocket,1/60);
assert.equal(pocket.holed,true,"Ball enters pocket at appropriate speed");
assert.strictEqual(e.strikeMinigolf(pocket,{x:100,y:100},1),pocket,"Holed ball cannot be shot again");
assert.strictEqual(e.advanceMinigolf(pocket,1),pocket,"Holed physics is frozen");
const fresh=e.startMinigolf();
assert.strictEqual(e.strikeMinigolf(fresh,{x:NaN,y:90},1),fresh,"Reject invalid aim");
console.log("PASS: shared minigolf physics, aim/force, frame stepping, rails, pocket and game completion");
