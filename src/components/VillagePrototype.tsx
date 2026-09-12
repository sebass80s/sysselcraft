"use client";

import { useEffect, useRef } from "react";

export default function VillagePrototype() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let cancelled = false;

    async function boot() {
      const Phaser = (await import("phaser")).default;
      if (cancelled || !hostRef.current) return;

      class VillageScene extends Phaser.Scene {
        private player?: Phaser.GameObjects.Arc;
        private target = new Phaser.Math.Vector2(420, 330);

        create() {
          const { width, height } = this.scale;
          this.cameras.main.setBackgroundColor("#9fc77c");

          const road = this.add.rectangle(width * 0.5, height * 0.56, width * 1.2, 80, 0xc8b384).setAngle(-18);
          road.setStrokeStyle(3, 0xb49d72, 0.8);

          this.add.rectangle(width * 0.28, height * 0.42, 130, 90, 0xd7c2a1).setStrokeStyle(4, 0x755c45);
          this.add.text(width * 0.28 - 48, height * 0.42 - 8, "Familjens hus", { color: "#2b241e", fontSize: "15px" });

          const linus = this.add.circle(width * 0.60, height * 0.46, 18, 0x3d6fb6).setStrokeStyle(4, 0x1f3e69);
          this.add.text(linus.x - 22, linus.y - 42, "Linus", { color: "#17324f", fontSize: "14px", backgroundColor: "#ffffffcc", padding: { x: 4, y: 2 } });
          this.add.rectangle(linus.x + 21, linus.y + 12, 4, 34, 0x6c4a2f).setAngle(8);

          this.add.rectangle(width * 0.76, height * 0.66, 145, 76, 0xa8845b).setStrokeStyle(3, 0x6e543a);
          this.add.text(width * 0.76 - 58, height * 0.66 - 8, "Tom byggplats", { color: "#fff5dc", fontSize: "14px" });

          [
            [0.12, 0.23], [0.18, 0.72], [0.42, 0.18], [0.82, 0.22], [0.90, 0.70],
          ].forEach(([x, y]) => {
            this.add.circle(width * x, height * y, 24, 0x4f8a46).setStrokeStyle(5, 0x376d31);
          });

          this.player = this.add.circle(width * 0.44, height * 0.62, 16, 0xefc04f).setStrokeStyle(4, 0x6e531d);
          this.add.text(18, 18, "Sysselcraft 0.1 · village movement prototype", { color: "#203020", fontSize: "15px", backgroundColor: "#ffffffcc", padding: { x: 7, y: 5 } });

          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.target.set(pointer.worldX, pointer.worldY);
          });
        }

        update(_: number, delta: number) {
          if (!this.player) return;
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
          if (distance < 3) return;
          const speed = 180 * (delta / 1000);
          const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y);
          this.player.x += Math.cos(angle) * Math.min(speed, distance);
          this.player.y += Math.sin(angle) * Math.min(speed, distance);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#9fc77c",
        scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
        scene: VillageScene,
      });
    }

    boot();
    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return (
    <section className="prototype-shell">
      <header className="prototype-header">
        <div>
          <h1>Sysselcraft</h1>
          <p>Första tekniska prototypen</p>
        </div>
        <strong>🏘️ 0.1</strong>
      </header>
      <div className="game-wrap">
        <div ref={hostRef} id="sysselcraft-game" aria-label="Sysselcraft village prototype" />
        <div className="game-hint">Tryck eller klicka i byn för att gå dit</div>
      </div>
    </section>
  );
}
