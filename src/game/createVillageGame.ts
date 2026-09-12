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
    private player?: GameObjects.Container; private path: Point[]=[]; private cursors?: Types.Input.Keyboard.CursorKeys;
    private wasd?: Record<"up"|"down"|"left"|"right",Input.Keyboard.Key>; private targetMarker?: GameObjects.Arc;
    private questMarker?: GameObjects.Container; private linus?: GameObjects.Container; private approvedTriggered=false;
    constructor(){ super("VillageScene"); }
    preload(){ this.load.svg("family-house", "/assets/village/family-house.svg"); }
    create(){
      this.cameras.main.setBackgroundColor("#82ad68"); this.drawVillage(); this.player=this.drawPerson(430,405,0xdca14d,0x3d688e,false).setDepth(20);
      this.targetMarker=this.add.circle(430,405,7,0xfff4c7,.35).setStrokeStyle(2,0x53623e,.7).setVisible(false); this.createQuestMarker(); this.applyQuestState(requestedQuestState);
      if(this.input.keyboard){ this.cursors=this.input.keyboard.createCursorKeys(); this.wasd=this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"}) as Record<"up"|"down"|"left"|"right",Input.Keyboard.Key>; }
      this.input.on("pointerdown",(pointer:Input.Pointer)=>{ if(!this.player)return; this.path=findPath({x:this.player.x,y:this.player.y},{x:pointer.worldX,y:pointer.worldY}); const finalPoint=this.path.at(-1); if(finalPoint)this.targetMarker?.setPosition(finalPoint.x,finalPoint.y).setVisible(true); });
    }
    applyQuestState(state:QuestState){ requestedQuestState=state; if(!this.questMarker)return; const label=this.questMarker.getByName("label") as GameObjects.Text; if(state==="available"){this.questMarker.setVisible(true).setAlpha(1);label.setText("!");} else if(state==="pending"){this.questMarker.setVisible(true).setAlpha(.72);label.setText("…");} else {this.questMarker.setVisible(false);this.triggerApprovalEvent();} }
    update(_:number,delta:number){ if(!this.player)return; const v=this.getKeyboardVector(); if(v.lengthSq()>0){this.path=[];this.targetMarker?.setVisible(false);v.normalize().scale(190*(delta/1000));this.tryMove(v.x,v.y);return;} const next=this.path[0];if(!next)return;const current={x:this.player.x,y:this.player.y},remaining=distance(current,next);if(remaining<4){this.path.shift();if(!this.path.length)this.targetMarker?.setVisible(false);return;}const speed=Math.min(180*(delta/1000),remaining),angle=Math.atan2(next.y-current.y,next.x-current.x);this.tryMove(Math.cos(angle)*speed,Math.sin(angle)*speed); }
    private px(x:number,y:number,w:number,h:number,color:number,depth=2,alpha=1){ return this.add.rectangle(x,y,w,h,color,alpha).setDepth(depth); }
    private drawPerson(x:number,y:number,shirt:number,trousers:number,cane:boolean){
      const c=this.add.container(x,y); const shadow=this.add.ellipse(1,19,31,9,0x30482c,.25); const shoes=this.add.rectangle(0,17,19,5,0x493c32); const legs=this.add.rectangle(0,9,17,17,trousers).setStrokeStyle(2,0x293943); const shirtShape=this.add.rectangle(0,-7,22,24,shirt).setStrokeStyle(2,0x5a4435); const neck=this.add.rectangle(0,-18,8,5,0xd9a873); const head=this.add.rectangle(0,-27,16,17,0xefc18a).setStrokeStyle(2,0x694a35); const hair=this.add.rectangle(-1,-35,17,5,0x6c4b36); const hairSide=this.add.rectangle(-8,-30,3,8,0x6c4b36); const eye=this.add.rectangle(5,-28,2,2,0x3d342e); c.add([shadow,shoes,legs,shirtShape,neck,head,hair,hairSide,eye]); if(cane)c.add(this.add.rectangle(15,7,3,31,0x704a2d).setAngle(7)); return c;
    }
    private drawTree(x:number,y:number){
      this.px(x+5,y+22,18,8,0x426038,4,.22); this.px(x,y+17,12,37,0x715038,5); this.px(x+3,y+8,5,21,0x966846,6);
      this.px(x-22,y-16,35,31,0x356d3d,7); this.px(x+12,y-12,32,34,0x427f43,7); this.px(x-5,y-29,37,30,0x4f914a,8); this.px(x+8,y-28,18,14,0x69a95b,9);
      this.px(x-25,y-21,7,7,0x5b9d51,9); this.px(x+17,y-6,6,6,0x2e6337,9);
    }
    private drawHouse(){ this.add.image(150,250,"family-house").setOrigin(.5,1).setDepth(7); }
    private drawFence(x:number,y:number,count:number){ for(let i=0;i<count;i++){this.px(x+i*20,y,5,27,0x98734d,4);this.px(x+i*20,y-11,7,5,0xb58b5b,5);} this.px(x+(count-1)*10,y-5,count*20,4,0x8a6747,4); }
    private drawQuestBoard(){ this.px(315,257,8,39,0x70513a,5); this.px(315,235,54,34,0x8a603d,6); this.px(315,235,45,25,0xd2b476,7); this.px(302,230,9,7,0xe9dfb3,8); this.px(322,240,13,8,0xe8d9a8,8); }
    private createQuestMarker(){ const shadow=this.add.rectangle(3,4,42,42,0x4b3d21,.2); const bubble=this.add.rectangle(0,0,42,42,0xf4cf55).setStrokeStyle(4,0x704f17); const shine=this.add.rectangle(-11,-11,8,5,0xffed98); const label=this.add.text(0,-1,"!",{color:"#493507",fontSize:"25px",fontStyle:"bold"}).setOrigin(.5).setName("label"); this.questMarker=this.add.container(150,72,[shadow,bubble,shine,label]).setDepth(40).setSize(54,54).setInteractive({useHandCursor:true}); this.questMarker.on("pointerdown",(_p:Input.Pointer,_x:number,_y:number,event:Types.Input.EventData)=>{event.stopPropagation();callbacks.onQuestOpen();}); this.tweens.add({targets:this.questMarker,y:65,duration:850,yoyo:true,repeat:-1,ease:"Sine.InOut"}); }
    private triggerApprovalEvent(){ if(this.approvedTriggered)return;this.approvedTriggered=true;const truck=this.add.container(1030,350).setDepth(25);truck.add([this.add.rectangle(0,0,88,42,0xc95843).setStrokeStyle(4,0x65372e),this.add.rectangle(30,-11,28,20,0xe8c98e).setStrokeStyle(3,0x65372e),this.add.rectangle(-31,25,20,20,0x303030),this.add.rectangle(31,25,20,20,0x303030)]);this.tweens.add({targets:truck,x:785,y:365,duration:1700,ease:"Sine.Out",onComplete:()=>{this.add.rectangle(735,445,54,34,0xb88955).setStrokeStyle(3,0x6e543a).setDepth(12);this.add.rectangle(790,447,44,28,0xc69a64).setStrokeStyle(3,0x6e543a).setDepth(12);this.tweens.add({targets:this.linus,y:"-=10",duration:180,yoyo:true,repeat:3});this.time.delayedCall(900,()=>this.tweens.add({targets:truck,x:1030,y:350,duration:1500,ease:"Sine.In",onComplete:()=>truck.destroy(true)}));}}); }
    private getKeyboardVector(){ const v=new Phaser.Math.Vector2();if(this.cursors?.up.isDown||this.wasd?.up.isDown)v.y--;if(this.cursors?.down.isDown||this.wasd?.down.isDown)v.y++;if(this.cursors?.left.isDown||this.wasd?.left.isDown)v.x--;if(this.cursors?.right.isDown||this.wasd?.right.isDown)v.x++;return v; }
    private tryMove(dx:number,dy:number){if(!this.player)return;const nx={x:this.player.x+dx,y:this.player.y};if(isWalkable(nx))this.player.x=nx.x;const ny={x:this.player.x,y:this.player.y+dy};if(isWalkable(ny))this.player.y=ny.y;}
    private drawVillage(){
      const grass=[0x87b66b,0x8cba6e,0x83b168,0x91bd73]; for(let y=0;y<WORLD_HEIGHT;y+=24)for(let x=0;x<WORLD_WIDTH;x+=24)this.px(x+12,y+12,24,24,grass[(x/24*3+y/24*5)%grass.length],0);
      for(let i=0;i<95;i++){const x=(i*137+53)%WORLD_WIDTH,y=(i*83+71)%WORLD_HEIGHT;this.px(x,y,3+(i%2)*2,2, i%4===0?0x6d9858:0x79a45e,1,.75);}
      const road=this.add.rectangle(490,360,1100,90,0xc4aa78).setAngle(-18).setDepth(1);road.setStrokeStyle(6,0xa98e62,.55);
      for(let i=0;i<15;i++){this.px(25+i*70,520-i*23,34,5,0xd7c08c,2,.48).setAngle(-18); if(i%2===0)this.px(55+i*70,500-i*23,9,6,0x9b815e,2,.45).setAngle(-18);}
      this.drawHouse(); this.drawFence(50,270,7); this.drawFence(820,238,6); this.drawQuestBoard();
      this.linus=this.drawPerson(575,285,0x4a75b2,0x315f8c,true).setDepth(12);this.add.text(549,236,"Linus",{color:"#263f53",fontSize:"13px",backgroundColor:"#fff4d9e8",padding:{x:5,y:3}}).setDepth(13);
      this.px(675,405,180,105,0x6e955b,3,.12); [[105,115],[155,485],[410,105],[790,120],[875,475]].forEach(([x,y])=>this.drawTree(x,y));
      [[320,530],[350,520],[630,110],[720,535],[535,505],[260,92],[450,560],[742,180],[905,320]].forEach(([x,y],i)=>{this.px(x,y,4,7,0x537b45,2);this.px(x+5,y-4,4,4,i%3===0?0xe3cf68:0xd6e2b0,3);});
      [[365,300],[610,475],[695,260],[245,455],[840,365]].forEach(([x,y],i)=>{this.px(x,y,10+i%2*4,5,0x7d8062,2);this.px(x-2,y-2,6,2,0xa3a07a,3);});
      this.px(282,296,44,8,0x76573c,4); this.px(268,280,6,36,0x76573c,4); this.px(296,280,6,36,0x76573c,4);
      this.px(34,385,20,16,0x71634c,3); this.px(40,379,10,5,0x9d8c68,4); this.px(925,190,16,12,0x786c55,3);
      this.add.text(18,18,"Sysselcraft · byn vaknar",{color:"#31412b",fontSize:"14px",backgroundColor:"#fff4d9dd",padding:{x:7,y:5}}).setDepth(30);
    }
  }
  const game=new Phaser.Game({type:Phaser.AUTO,parent,width:WORLD_WIDTH,height:WORLD_HEIGHT,backgroundColor:"#82ad68",pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:WORLD_WIDTH,height:WORLD_HEIGHT},scene:VillageScene});
  return {destroy:()=>game.destroy(true),setQuestState:(state:QuestState)=>{requestedQuestState=state;if(game.scene.isActive("VillageScene"))(game.scene.getScene("VillageScene") as VillageScene).applyQuestState(state);}};
}
