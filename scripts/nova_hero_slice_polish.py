from pathlib import Path

GAME = Path('src/game/createVillageGame.ts')
ART = Path('docs/ART_DIRECTION.md')

s = GAME.read_text()

old_marker = '''    private createQuestMarker() {
      const shadow = this.add.ellipse(3, 7, 43, 18, 0x3c4d34, 0.2);
      const bubble = this.add.circle(0, 0, 21, 0xf2c95d, 1).setStrokeStyle(2, 0xffe9a0, 0.95);
      const inner = this.add.circle(-5, -6, 12, 0xffdf79, 0.65);
      const label = this.add.text(0, -1, "?", {
        color: "#5b4425", fontSize: "27px", fontStyle: "bold", fontFamily: "Trebuchet MS",
      }).setOrigin(0.5).setName("label");
      this.questMarker = this.add.container(720, 335, [shadow, bubble, inner, label])
        .setDepth(3000).setSize(52, 52).setInteractive({ useHandCursor: true });
      this.questMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete) callbacks.onQuestOpen();
        else callbacks.onLinusInteract();
      });
      this.tweens.add({ targets: this.questMarker, y: "-=5", duration: 850, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }
'''

new_marker = '''    private createQuestMarker() {
      // UI geometry is intentionally code-drawn, but styled as a soft storybook speech marker
      // rather than a generic bright RPG orb. It remains directly tappable by design.
      const shadow = this.add.ellipse(2, 10, 39, 15, 0x3a2a1d, 0.18);
      const bubble = this.add.graphics();
      bubble.fillStyle(0xfff2cf, 0.98);
      bubble.lineStyle(2, 0x6b4b31, 0.9);
      bubble.fillRoundedRect(-22, -22, 44, 39, 12);
      bubble.strokeRoundedRect(-22, -22, 44, 39, 12);
      bubble.fillTriangle(-5, 16, 5, 16, 0, 24);
      bubble.lineBetween(-5, 16, 0, 24);
      bubble.lineBetween(0, 24, 5, 16);
      const highlight = this.add.ellipse(-7, -10, 13, 7, 0xffffff, 0.22);
      const label = this.add.text(0, -3, "?", {
        color: "#5a3f28", fontSize: "25px", fontStyle: "bold", fontFamily: "Trebuchet MS",
      }).setOrigin(0.5).setName("label");
      this.questMarker = this.add.container(720, 335, [shadow, bubble, highlight, label])
        .setDepth(3000).setSize(54, 56).setInteractive({ useHandCursor: true });
      this.questMarker.on("pointerdown", (_pointer: Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
        event.stopPropagation();
        if (this.introComplete) callbacks.onQuestOpen();
        else callbacks.onLinusInteract();
      });
      this.tweens.add({ targets: this.questMarker, y: "-=4", duration: 950, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    }
'''

if old_marker not in s:
    raise SystemExit('Quest marker block not found; refusing to patch')
s = s.replace(old_marker, new_marker, 1)

s = s.replace(
    '      // Linus stays dynamic so onboarding remains testable.\n',
    '      // Painted Linus stays dynamic so onboarding remains testable.\n',
    1,
)

old_debug = '''\n      this.add.text(18, 18, "Sysselcraft · master-scene experiment", {
        color: "#4b3a29", fontSize: "14px", fontStyle: "bold", fontFamily: "Trebuchet MS",
        backgroundColor: "#f5e5cbd9", padding: { x: 10, y: 7 },
      }).setDepth(3000).setScrollFactor(0);
'''
if old_debug not in s:
    raise SystemExit('Debug label block not found; refusing to patch')
s = s.replace(old_debug, '\n', 1)
GAME.write_text(s)

art = ART.read_text()
marker = '## ✅ 2026-09-14 proof of concept — FEASIBILITY CONFIRMED\n'
if marker not in art:
    raise SystemExit('POC status section not found; refusing to patch docs')

replacement = '''## 🧪 2026-09-14 hero-slice proof of concept — PARTIALLY VERIFIED

The current experiment has moved beyond the earlier two-asset feasibility check, but **the full visual POC is not yet accepted**. For this project, POC means that one playable hero slice demonstrates the complete visible visual stack in the new standard, without old SVG/game-asset styling leaking through.

### Verified in the running Phaser game

- the coherent painted **master scene** renders sharply as the static visual authority for terrain, cottage, roads, permanent vegetation and fixed props;
- the painted **child avatar** renders and remains fully controllable with tap-to-move/pathfinding and keyboard movement;
- a separate painted **Linus NPC** renders correctly over the master scene and remains interactive;
- the player participates in Y/base-depth sorting;
- painted scenery from the master can be reused as a **masked foreground layer**, allowing the child to pass visibly behind and in front of master-scene objects without rebuilding those objects as flat SVG assets;
- this masked-master occlusion has been confirmed by the user in local runtime;
- collision/navigation remains independent of the artwork. The current collision shapes are deliberately rough POC geometry and are not accepted as final traversal tuning.

### Still required before the hero-slice POC can be called complete

- replace or remove every remaining visible legacy-style dynamic asset in the hero slice, especially the puppy and progression/delivery objects when they appear;
- finish the quest-marker/UI visual integration so the visible UI belongs to the same storybook language;
- ensure foreground/occlusion coverage is sufficient for the hero slice, not only the notice-board cluster used for the architecture proof;
- confirm the complete visible hero slice in runtime after those elements are integrated;
- preserve the already verified onboarding / quest / parent approval / delivery loop while doing the visual replacement.

### Current decision

**The static painted master-scene architecture is technically validated, including independent dynamic characters and real 2.5D foreground occlusion. The complete Sysselcraft visual POC remains IN PROGRESS until the whole visible hero slice uses the approved standard and is confirmed in runtime.**
'''

art = art.split(marker, 1)[0] + replacement
ART.write_text(art)
