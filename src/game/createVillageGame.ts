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
  return !obstacles.some((obstacle) => {
    if (obstacle.type === "rect") return Math.abs(point.x - obstacle.x) <= obstacle.width / 2 + PLAYER_RADIUS && Math.abs(point.y - obstacle.y) <= obstacle.height / 2 + PLAYER_RADIUS;
    return distance(point, obstacle) <= obstacle.radius + PLAYER_RADIUS;
  });
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
    create(){
      this.cameras.main.setBackgroundColor("#88b96f"); this.drawVillage(); this.player=this.drawPerson(430,405,0xe0a34d,0x3f6e9d,false).setDepth(20);
      this.targetMarker=this.add.circle(430,405,7,0xffffff,0.3).setStrokeStyle(2,0x5b633c,0.65).setVisible(false); this.createQuestMarker(); this.applyQuestState(requestedQuestState);
      if(this.input.keyboard){ this.cursors=this.input.keyboard.createCursorKeys(); this.wasd=this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"}) as Record<"up"|"down"|"left"|"right",Input.Keyboard.Key>; }
      this.input.on("pointerdown",(pointer:Input.Pointer)=>{ if(!this.player)return; this.path=findPath({x:this.player.x,y:this.player.y},{x:pointer.worldX,y:pointer.worldY}); const finalPoint=this.path.at(-1); if(finalPoint)this.targetMarker?.setPosition(finalPoint.x,finalPoint.y).setVisible(true); });
    }
    applyQuestState(state:QuestState){ requestedQuestState=state; if(!this.questMarker)return; const label=this.questMarker.getByName("label") as GameObjects.Text; if(state==="available"){this.questMarker.setVisible(true).setAlpha(1);label.setText("!");} else if(state==="pending"){this.questMarker.setVisible(true).setAlpha(.72);label.setText("…");} else {this.questMarker.setVisible(false);this.triggerApprovalEvent();} }
    update(_:number,delta:number){ if(!this.player)return; const v=this.getKeyboardVector(); if(v.lengthSq()>0){this.path=[];this.targetMarker?.setVisible(false);v.normalize().scale(190*(delta/1000));this.tryMove(v.x,v.y);return;} const next=this.path[0];if(!next)return;const current={x:this.player.x,y:this.player.y},remaining=distance(current,next);if(remaining<4){this.path.shift();if(!this.path.length)this.targetMarker?.setVisible(false);return;}const speed=Math.min(180*(delta/1000),remaining),angle=Math.atan2(next.y-current.y,next.x-current.x);this.tryMove(Math.cos(angle)*speed,Math.sin(angle)*speed); }
    private drawPerson(x:number,y:number,shirt:number,trousers:number,cane:boolean){
      const c=this.add.container(x,y); const shadow=this.add.ellipse(0,18,30,10,0x31502c,.25); const legs=this.add.rectangle(0,9,18,18,trousers).setStrokeStyle(2,0x263b49); const body=this.add.rectangle(0,-7,22,24,shirt).setStrokeStyle(2,0x5c4535); const head=this.add.rectangle(0,-27,16,16,0xf1c58f).setStrokeStyle(2,0x6d4b34); const hair=this.add.rectangle(0,-34,16,5,0x74513a); c.add([shadow,legs,body,head,hair]); if(cane)c.add(this.add.rectangle(15,7,3,31,0x704a2d).setAngle(7)); return c;
    }
    private drawTree(x:number,y:number){ this.add.rectangle(x,y+17,12,35,0x765136).setDepth(5); this.add.rectangle(x-21,y-20,42,38,0x3f7f48).setStrokeStyle(4,0x315f37).setDepth(7); this.add.rectangle(x+7,y-12,30,30,0x559550).setDepth(8); this.add.rectangle(x-13,y-28,28,24,0x65a85b).setDepth(9); }
    private drawHouse(){
      this.add.rectangle(150,183,190,89,0xd9b17c).setStrokeStyle(5,0x6f513a).setDepth(5); this.add.triangle(150,112,55,70,245,70,150,12,0x9d5542).setStrokeStyle(5,0x693a31).setDepth(6);
      this.add.rectangle(150,192,34,70,0x81543a).setStrokeStyle(3,0x5d3929).setDepth(7); this.add.rectangle(100,166,38,34,0x8fc5d1).setStrokeStyle(4,0x694b37).setDepth(7); this.add.rectangle(200,166,38,34,0x8fc5d1).setStrokeStyle(4,0x694b37).setDepth(7);
      this.add.rectangle(210,91,22,40,0x735044).setDepth(5); this.add.rectangle(150,235,210,12,0x7d6a4b,.22).setDepth(3);
    }
    private createQuestMarker(){ const bubble=this.add.rectangle(0,0,42,42,0xf7d154).setStrokeStyle(4,0x745418); const label=this.add.text(0,-1,"!",{color:"#493507",fontSize:"25px",fontStyle:"bold"}).setOrigin(.5).setName("label"); this.questMarker=this.add.container(150,72,[bubble,label]).setDepth(40).setSize(54,54).setInteractive({useHandCursor:true}); this.questMarker.on("pointerdown",(_p:Input.Pointer,_x:number,_y:number,event:Types.Input.EventData)=>{event.stopPropagation();callbacks.onQuestOpen();}); this.tweens.add({targets:this.questMarker,y:65,duration:850,yoyo:true,repeat:-1,ease:"Sine.InOut"}); }
    private triggerApprovalEvent(){ if(this.approvedTriggered)return;this.approvedTriggered=true;const truck=this.add.container(1030,350).setDepth(25);truck.add([this.add.rectangle(0,0,88,42,0xc95843).setStrokeStyle(4,0x65372e),this.add.rectangle(30,-11,28,20,0xe8c98e).setStrokeStyle(3,0x65372e),this.add.rectangle(-31,25,20,20,0x303030),this.add.rectangle(31,25,20,20,0x303030)]);this.tweens.add({targets:truck,x:785,y:365,duration:1700,ease:"Sine.Out",onComplete:()=>{this.add.rectangle(735,445,54,34,0xb88955).setStrokeStyle(3,0x6e543a).setDepth(12);this.add.rectangle(790,447,44,28,0xc69a64).setStrokeStyle(3,0x6e543a).setDepth(12);this.tweens.add({targets:this.linus,y:"-=10",duration:180,yoyo:true,repeat:3});this.time.delayedCall(900,()=>this.tweens.add({targets:truck,x:1030,y:350,duration:1500,ease:"Sine.In",onComplete:()=>truck.destroy(true)}));}}); }
    private getKeyboardVector(){ const v=new Phaser.Math.Vector2();if(this.cursors?.up.isDown||this.wasd?.up.isDown)v.y--;if(this.cursors?.down.isDown||this.wasd?.down.isDown)v.y++;if(this.cursors?.left.isDown||this.wasd?.left.isDown)v.x--;if(this.cursors?.right.isDown||this.wasd?.right.isDown)v.x++;return v; }
    private tryMove(dx:number,dy:number){if(!this.player)return;const nx={x:this.player.x+dx,y:this.player.y};if(isWalkable(nx))this.player.x=nx.x;const ny={x:this.player.x,y:this.player.y+dy};if(isWalkable(ny))this.player.y=ny.y;}
    private drawVillage(){
      for(let y=0;y<WORLD_HEIGHT;y+=32)for(let x=0;x<WORLD_WIDTH;x+=32){const shade=((x/32+y/32)%3===0)?0x91bf73:0x8bb86e;this.add.rectangle(x+16,y+16,32,32,shade).setDepth(0);}
      const road=this.add.rectangle(490,360,1100,86,0xc5aa78).setAngle(-18).setDepth(1);road.setStrokeStyle(5,0xa78e65,.7);
      for(let i=0;i<13;i++)this.add.rectangle(80+i*76,492-i*24,34,5,0xd7c18e,.55).setAngle(-18).setDepth(2);
      this.drawHouse();
      this.linus=this.drawPerson(575,285,0x4c78b8,0x315f8c,true).setDepth(12);this.add.text(550,238,"Linus",{color:"#263f53",fontSize:"13px",backgroundColor:"#fff7dfdd",padding:{x:5,y:3}}).setDepth(13);
      this.add.rectangle(675,405,180,105,0x8eb26b,.18).setStrokeStyle(3,0x728f58,.35).setDepth(3);
      [[105,115],[155,485],[410,105],[790,120],[875,475]].forEach(([x,y])=>this.drawTree(x,y));
      [[320,530],[350,520],[630,110],[720,535],[535,505]].forEach(([x,y])=>{this.add.rectangle(x,y,5,5,0x6f814c).setDepth(2);this.add.rectangle(x+7,y-5,4,4,0xd7d06a).setDepth(2);});
      this.add.text(18,18,"Sysselcraft · byn vaknar",{color:"#31412b",fontSize:"14px",backgroundColor:"#fff7dfcc",padding:{x:7,y:5}}).setDepth(30);
    }
  }
  const game=new Phaser.Game({type:Phaser.AUTO,parent,width:WORLD_WIDTH,height:WORLD_HEIGHT,backgroundColor:"#88b96f",pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:WORLD_WIDTH,height:WORLD_HEIGHT},scene:VillageScene});
  return {destroy:()=>game.destroy(true),setQuestState:(state:QuestState)=>{requestedQuestState=state;if(game.scene.isActive("VillageScene"))(game.scene.getScene("VillageScene") as VillageScene).applyQuestState(state);}};
}
