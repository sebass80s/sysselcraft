from pathlib import Path

path = Path("src/game/createVillageGame.ts")
text = path.read_text()

needle = '      this.load.image("master-scene", "/assets/village/reboot/sysselcraft-hero-master.webp");\n'
insert = needle + '      this.load.image("linus-painted", "/assets/village/reboot/linus-painted.png");\n'
if 'this.load.image("linus-painted"' not in text:
    if needle not in text:
        raise SystemExit("Could not find preload insertion point")
    text = text.replace(needle, insert, 1)

old = '''      this.linus = this.add.image(720, 450, "linus")
        .setOrigin(0.5, 0.9)
        .setDepth(1450)
        .setInteractive({ useHandCursor: true });'''
new = '''      this.linus = this.add.image(720, 450, "linus-painted")
        .setOrigin(0.5, 0.96)
        .setDisplaySize(128, 125)
        .setDepth(1450)
        .setInteractive({ useHandCursor: true });'''
if old not in text:
    raise SystemExit("Could not find Linus image block")
text = text.replace(old, new, 1)

# Stop the old SVG blink animation from swapping the painted texture away.
old_blink = '''          if (!this.linus) return;
          this.linus.setTexture("linus-idle-b");
          this.time.delayedCall(260, () => this.linus?.setTexture("linus"));'''
new_blink = '''          if (!this.linus) return;'''
if old_blink in text:
    text = text.replace(old_blink, new_blink, 1)

# The painted figure is self-identifying visually; remove the temporary debug name tag.
old_label = '''      this.add.text(694, 390, "Linus", {
        color: "#4b3b2b", fontSize: "14px", fontStyle: "bold", fontFamily: "Trebuchet MS",
        backgroundColor: "#f7e9cce8", padding: { x: 8, y: 4 },
      }).setDepth(2900);\n'''
text = text.replace(old_label, "", 1)

path.write_text(text)
