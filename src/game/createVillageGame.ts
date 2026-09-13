import type { GameObjects, Input, Types } from "phaser";

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 640;
const GRID = 32;
const PLAYER_RADIUS = 14;

export type QuestState = "available" | "pending" | "approved";
export type VillageGameHandle = { destroy: () => void; setQuestState: (state: QuestState) => void };
type Callbacks = { onQuestOpen: () => void };
type Point = { x: number; y: number };
type Obstacle = { type: "rect"; x: number; y: number; width: number; height: number } | { type: "circle"; x: number; y: number; radius: number };
type WorldObjectDefinition = { x: number; y: number; texture: string; scale?: number; originY?: number };

const obstacles: Obstacle[] = [
  { type: "rect", x: 150, y: 165, width: 190, height: 125 },
  { type: "rect", x: 675, y: 405, width: 180, height: 105 },
  { type: "circle", x: 105, y: 115, radius: 28 }, { type: "circle", x: 155, y: 485, radius: 28 },
  { type: "circle", x: 410, y: 105, radius: 28 }, { type: "circle", x: 790, y: 120, radius: 28 },
  { type: "circle", x: 875, y: 475, radius: 28 },
];

function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function isWalkable(point: Point) {
  if (point.x < PLAYER_RADIUS || point.y < PLAYER_RADIUS || point.x > WORLD_WIDTH - PLAYER_RADIUS || point.y > WORLD_HEIGHT - PLAYER_RADIUS) return false;
  return !obstacles.some((obstacle) => obstacle.type === "rect"
    ? Math.abs(point.x - obstacle.x) <= obstacle.width / 2 + PLAYER_RADIUS && Math.abs(point.y - obstacle.y) <= obstacle.height / 2 + PLAYER_RADIUS
    : distance(point, obstacle) <= obstacle.radius + PLAYER_RADIUS);
}
function cellToPoint(cx: number, cy: number): Point { return { x: cx * GRID + GRID / 2, y: cy * GRID + GRID / 2 }; }
function pointToCell(point: Point) { return { x: clamp(Math.floor(point.x / GRID), 0, Math.floor(WORLD_WIDTH / GRID) - 1), y: clamp(Math.floor(point.y / GRID), 0, Math.floor(WORLD_HEIGHT / GRID) - 1) }; }
function findNearestWalkableCell(point: Point) {
  const origin = pointToCell(point);
  for (let radius = 0; radius <= 8; radius += 1) for (let y = origin.y - radius; y <= origin.y + radius; y += 1) for (let x = origin.x - radius; x <= origin.x + radius; x += 1) {
    if (x >= 0 && y >= 0 && x < WORLD_WIDTH / GRID && y < WORLD_HEIGHT / GRID && isWalkable(cellToPoint(x, y))) return { x, y };
  }
  return origin;
}
function findPath(startPoint: Point, endPoint: Point): Point[] {
  const start = findNearestWalkableCell(startPoint), goal = findNearestWalkableCell(endPoint);
  const key = (x: number, y: number) => `${x},${y}`;
  const open = new Map<string, { x: number; y: number; g: number; f: number }>();
  const cameFrom = new Map<string, string>(); const closed = new Set<string>();
  const heuristic = (x: number, y: number) => Math.hypot(goal.x - x, goal.y - y);
  open.set(key(start.x, start.y), { ...start, g: 0, f: heuristic(start.x, start.y) });
  const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while (open.size) {
    const current = [...open.values()].reduce((best, node) => node.f < best.f ? node : best); const currentKey = key(current.x, current.y); open.delete(currentKey);
    if (current.x === goal.x && current.y === goal.y) {
      const cells = [{ x: current.x, y: current.y }]; let cursor = currentKey;
      while (cameFrom.has(cursor)) { cursor = cameFrom.get(cursor)!; const [x,y] = cursor.split(",").map(Number); cells.push({x,y}); }
      return cells.reverse().slice(1).map((cell) => cellToPoint(cell.x, cell.y));
    }
    closed.add(currentKey);
    for (const [dx,dy] of directions) {
      const x=current.x+dx, y=current.y+dy, nextKey=key(x,y);
      if (closed.has(nextKey) || x<0 || y<0 || x>=WORLD_WIDTH/GRID || y>=WORLD_HEIGHT/GRID || !isWalkable(cellToPoint(x,y))) continue;
      if (dx && dy && (!isWalkable(cellToPoint(current.x+dx,current.y)) || !isWalkable(cellToPoint(current.x,current.y+dy)))) continue;
      const g=current.g+(dx&&dy?Math.SQRT2:1), existing=open.get(nextKey); if (existing && g>=existing.g) continue;
      cameFrom.set(nextKey,currentKey); open.set(nextKey,{x,y,g,f:g+heuristic(x,y)});
    }
  }
  return [];
}

export async function createVillageGame(parent: HTMLElement, callbacks: Callbacks): Promise<VillageGameHandle> {
  const Phaser = await import("phaser"); let requestedQuestState: QuestState = "available";
  class VillageScene extends Phaser.Scene {
    private player?: GameObjects.Image; private path: Point[]=[]; private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up"|"down"|"left"|"right",Input.Keyboard.Key>; private targetMarker?: GameObjects.Arc;
    private questMarker?: GameObjects.Container; private linus?: GameObjects.Image; private approvedTriggered=false;
    private playerFrameClock=0; private playerFrameIndex=0;
    constructor(){ super("VillageScene"); }
    preload(){
      this.load.svg("family-house", "/assets/village/family-house.svg");
      this.load.svg("tree-oak", "/assets/village/tree-oak.svg");
      this.load.svg("tree-birch", "/assets/village/tree-birch.svg");
      this.load.svg("tree-pine", "/assets/village/tree-pine.svg");
      this.load.svg("child", "/assets/village/child.svg");
      this.load.svg("child-walk-a", "/assets/village/child-walk-a.svg");
      this.load.svg("child-walk-b", "/assets/village/child-walk-b.svg");
      this.load.svg("linus", "/assets/village/linus.svg");
      this.load.svg("linus-idle-b", "/assets/village/linus-idle-b.svg");
      this.load.svg("truck", "/assets/village/truck.svg");
      this.load.svg("material-stack", "/assets/village/material-stack.svg");
      this.load.svg("road-dirt", "/assets/village/road-dirt.svg");
      this.load.svg("road-edge-grass", "/assets/village/road-edge-grass.svg");
      this.load.svg("grass-tile", "/assets/village/grass-tile.svg");
      this.load.svg("grass-tuft", "/assets/village/grass-tuft.svg");
      this.load.svg("dirt-patch", "/assets/village/dirt-patch.svg");
      this.load.svg("fence-segment", "/assets/village/fence-segment.svg");
      this.load.svg("quest-board", "/assets/village/quest-board.svg");
      this.load.svg("bench", "/assets/village/bench.svg");
      this.load.svg("crate", "/assets/village/crate.svg");
      this.load.svg("flower-patch", "/assets/village/flower-patch.svg");
      this.load.svg("rock-cluster", "/assets/village/rock-cluster.svg");
      this.load.svg("signpost", "/assets/village/signpost.svg");
      this.load.svg("lamp-post", "/assets/village/lamp-post.svg");
      this.load.svg("woodpile", "/assets/village/woodpile.svg");
      this.load.svg("mailbox", "/assets/village/mailbox.svg");
    }
    create(){
      this.cameras.main.setBackgroundColor("#82ad68"); this.drawVillage();
      this.player=this.add.image(430,405,"child").setOrigin(.5,.86).setDepth(1405);
      this.targetMarker=this.add.circle(430,405,7,0xfff4c7,.35).setStrokeStyle(2,0x53623e,.7).setVisible(false).setDepth(900);
      this.createQuestMarker(); this.applyQuestState(requestedQuestState);
      this.time.addEvent({delay:1800,loop:true,callback:()=>{if(!this.linus)return;this.linus.setTexture("linus-idle-b");this.time.delayedCall(260,()=>this.linus?.setTexture("linus"));}});
      if(this.input.keyboard){ this.cursors=this.input.keyboard.createCursorKeys(); this.wasd=this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"}) as Record<"up"|"down"|"left"|"right",Input.Keyboard.Key>; }
      this.input.on("pointerdown",(pointer:Input.Pointer)=>{ if(!this.player)return; this.path=findPath({x:this.player.x,y:this.player.y},{x:pointer.worldX,y:pointer.worldY}); const finalPoint=this.path.at(-1); if(finalPoint)this.targetMarker?.setPosition(finalPoint.x,finalPoint.y).setVisible(true); });
    }
    applyQuestState(state:QuestState){ requestedQuestState=state; if(!this.questMarker)return; const label=this.questMarker.getByName("label") as GameObjects.Text; if(state==="available"){this.questMarker.setVisible(true).setAlpha(1);label.setText("!");} else if(state==="pending"){this.questMarker.setVisible(true).setAlpha(.72);label.setText("…");} else {this.questMarker.setVisible(false);this.triggerApprovalEvent();} }
    update(_:number,delta:number){
      if(!this.player)return; this.player.setDepth(1000+Math.round(this.player.y));
      const v=this.getKeyboardVector();
      if(v.lengthSq()>0){this.path=[];this.targetMarker?.setVisible(false);v.normalize();this.animatePlayer(v.x,true,delta);v.scale(190*(delta/1000));this.tryMove(v.x,v.y);return;}
      const next=this.path[0];
      if(!next){this.animatePlayer(0,false,delta);return;}
      const current={x:this.player.x,y:this.player.y},remaining=distance(current,next);
      if(remaining<4){this.path.shift();if(!this.path.length)this.targetMarker?.setVisible(false);this.animatePlayer(0,this.path.length>0,delta);return;}
      const speed=Math.min(180*(delta/1000),remaining),angle=Math.atan2(next.y-current.y,next.x-current.x),dx=Math.cos(angle),dy=Math.sin(angle);
      this.animatePlayer(dx,true,delta);this.tryMove(dx*speed,dy*speed);
    }
    private animatePlayer(dx:number,moving:boolean,delta:number){
      if(!this.player)return;
      if(dx<-.1)this.player.setFlipX(true);else if(dx>.1)this.player.setFlipX(false);
      if(!moving){this.playerFrameClock=0;this.playerFrameIndex=0;if(this.player.texture.key!=="child")this.player.setTexture("child");return;}
      this.playerFrameClock+=delta;
      if(this.playerFrameClock<120)return;
      this.playerFrameClock=0;this.playerFrameIndex=(this.playerFrameIndex+1)%2;this.player.setTexture(this.playerFrameIndex===0?"child-walk-a":"child-walk-b");
    }
    private worldImage(x:number,y:number,key:string,scale=1,originY=1){ return this.add.image(x,y,key).setOrigin(.5,originY).setScale(scale).setDepth(1000+Math.round(y)); }
    private placeWorldObjects(objects:WorldObjectDefinition[]){objects.forEach(({x,y,texture,scale=1,originY=1})=>this.worldImage(x,y,texture,scale,originY));}
    private drawTree(x:number,y:number,key="tree-oak",scale=1){ this.worldImage(x,y+32,key,scale); }
    private drawHouse(){ this.add.image(150,250,"family-house").setOrigin(.5,1).setDepth(1250); }
    private drawFence(x:number,y:number,count:number){ this.add.image(x+count*10,y,"fence-segment").setDisplaySize(count*20,48).setDepth(1000+y); }
    private drawQuestBoard(){ this.worldImage(315,267,"quest-board"); }
    private createQuestMarker(){ const shadow=this.add.rectangle(3,4,42,42,0x4b3d21,.2); const bubble=this.add.rectangle(0,0,42,42,0xf4cf55).setStrokeStyle(4,0x704f17); const shine=this.add.rectangle(-11,-11,8,5,0xffed98); const label=this.add.text(0,-1,"!",{color:"#493507",fontSize:"25px",fontStyle:"bold"}).setOrigin(.5).setName("label"); this.questMarker=this.add.container(150,72,[shadow,bubble,shine,label]).setDepth(3000).setSize(54,54).setInteractive({useHandCursor:true}); this.questMarker.on("pointerdown",(_p:Input.Pointer,_x:number,_y:number,event:Types.Input.EventData)=>{event.stopPropagation();callbacks.onQuestOpen();}); this.tweens.add({targets:this.questMarker,y:65,duration:850,yoyo:true,repeat:-1,ease:"Sine.InOut"}); }
    private triggerApprovalEvent(){
      if(this.approvedTriggered)return;this.approvedTriggered=true;
      const truck=this.add.image(1030,350,"truck").setOrigin(.5,1).setDepth(1350);
      this.tweens.add({targets:truck,x:785,y:365,duration:1700,ease:"Sine.Out",onUpdate:()=>truck.setDepth(1000+Math.round(truck.y)),onComplete:()=>{
        this.worldImage(760,458,"material-stack",1);
        this.tweens.add({targets:this.linus,y:"-=10",duration:180,yoyo:true,repeat:3});
        this.time.delayedCall(900,()=>this.tweens.add({targets:truck,x:1030,y:350,duration:1500,ease:"Sine.In",onUpdate:()=>truck.setDepth(1000+Math.round(truck.y)),onComplete:()=>truck.destroy()}));
      }});
    }
    private getKeyboardVector(){ const v=new Phaser.Math.Vector2();if(this.cursors?.up.isDown||this.wasd?.up.isDown)v.y--;if(this.cursors?.down.isDown||this.wasd?.down.isDown)v.y++;if(this.cursors?.left.isDown||this.wasd?.left.isDown)v.x--;if(this.cursors?.right.isDown||this.wasd?.right.isDown)v.x++;return v; }
    private tryMove(dx:number,dy:number){if(!this.player)return;const nx={x:this.player.x+dx,y:this.player.y};if(isWalkable(nx))this.player.x=nx.x;const ny={x:this.player.x,y:this.player.y+dy};if(isWalkable(ny))this.player.y=ny.y;}
    private drawVillage(){
      this.add.tileSprite(WORLD_WIDTH/2,WORLD_HEIGHT/2,WORLD_WIDTH,WORLD_HEIGHT,"grass-tile").setDepth(0);
      this.add.image(490,360,"road-dirt").setScale(1.8,.95).setAngle(-18).setDepth(20);
      this.add.image(490,360,"road-edge-grass").setScale(1.8,.95).setAngle(-18).setDepth(21);

      this.drawHouse(); this.drawFence(50,270,7); this.drawFence(820,238,6); this.drawQuestBoard();
      this.placeWorldObjects([
        {x:282,y:298,texture:"bench"},{x:34,y:400,texture:"crate",scale:.8},{x:925,y:205,texture:"crate",scale:.65},
        {x:257,y:266,texture:"mailbox",scale:.82},{x:78,y:261,texture:"woodpile",scale:.72},{x:660,y:300,texture:"signpost",scale:.78},{x:365,y:337,texture:"lamp-post",scale:.72}
      ]);

      this.linus=this.add.image(575,285,"linus").setOrigin(.5,.9).setDepth(1285);
      this.add.text(549,236,"Linus",{color:"#f8edcf",fontSize:"13px",backgroundColor:"#26342bea",padding:{x:5,y:3}}).setDepth(2900);

      this.add.rectangle(675,405,180,105,0x6e955b,.10).setDepth(8);
      this.drawTree(105,115,"tree-birch",.95); this.drawTree(155,485,"tree-oak",1.05); this.drawTree(410,105,"tree-pine",.9); this.drawTree(790,120,"tree-birch",1); this.drawTree(875,475,"tree-pine",1.05);

      this.placeWorldObjects([
        {x:310,y:527,texture:"flower-patch",scale:.8},{x:347,y:514,texture:"flower-patch",scale:.65},{x:623,y:112,texture:"flower-patch",scale:.75},{x:718,y:532,texture:"flower-patch",scale:.8},{x:529,y:504,texture:"flower-patch",scale:.7},{x:255,y:91,texture:"flower-patch",scale:.65},{x:445,y:559,texture:"flower-patch",scale:.8},{x:744,y:181,texture:"flower-patch",scale:.7},{x:903,y:320,texture:"flower-patch",scale:.75},{x:208,y:294,texture:"flower-patch",scale:.65},{x:805,y:287,texture:"flower-patch",scale:.72},
        {x:365,y:300,texture:"rock-cluster",scale:.72},{x:610,y:475,texture:"rock-cluster",scale:.78},{x:695,y:260,texture:"rock-cluster",scale:.65},{x:245,y:455,texture:"rock-cluster",scale:.7},{x:840,y:365,texture:"rock-cluster",scale:.75},{x:520,y:126,texture:"rock-cluster",scale:.62},{x:90,y:350,texture:"rock-cluster",scale:.65},
        {x:132,y:340,texture:"grass-tuft",scale:.75},{x:192,y:385,texture:"grass-tuft",scale:.65},{x:470,y:182,texture:"grass-tuft",scale:.7},{x:575,y:565,texture:"grass-tuft",scale:.8},{x:689,y:190,texture:"grass-tuft",scale:.68},{x:854,y:257,texture:"grass-tuft",scale:.72},{x:934,y:520,texture:"grass-tuft",scale:.82},
        {x:220,y:150,texture:"dirt-patch",scale:.62},{x:517,y:438,texture:"dirt-patch",scale:.7},{x:736,y:346,texture:"dirt-patch",scale:.58},{x:380,y:590,texture:"dirt-patch",scale:.65}
      ]);

      this.add.text(18,18,"Sysselcraft · byn vaknar",{color:"#f6edcf",fontSize:"14px",backgroundColor:"#26342bea",padding:{x:8,y:6}}).setDepth(3000);
    }
  }
  const game=new Phaser.Game({type:Phaser.AUTO,parent,width:WORLD_WIDTH,height:WORLD_HEIGHT,backgroundColor:"#82ad68",pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:WORLD_WIDTH,height:WORLD_HEIGHT},scene:VillageScene});
  return {destroy:()=>game.destroy(true),setQuestState:(state:QuestState)=>{requestedQuestState=state;if(game.scene.isActive("VillageScene"))(game.scene.getScene("VillageScene") as VillageScene).applyQuestState(state);}};
}