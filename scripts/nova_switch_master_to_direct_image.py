from pathlib import Path

path = Path("src/game/createVillageGame.ts")
text = path.read_text()

needle = '      this.load.image("child-painted", "/assets/village/reboot/child.webp");\n'
insert = needle + '      this.load.image("master-scene", "/assets/village/reboot/sysselcraft-hero-master.webp");\n'
if 'this.load.image("master-scene"' not in text:
    if needle not in text:
        raise SystemExit("Could not find preload insertion point")
    text = text.replace(needle, insert, 1)

old = '''      this.add.tileSprite(
        (WORLD_MIN_X + WORLD_MAX_X) / 2,
        WORLD_HEIGHT / 2,
        WORLD_WIDTH,
        WORLD_HEIGHT,
        "grass-tile",
      ).setDepth(0);'''
new = '''      this.add.image(
        (WORLD_MIN_X + WORLD_MAX_X) / 2,
        WORLD_HEIGHT / 2,
        "master-scene",
      ).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setDepth(0);'''
if old not in text:
    raise SystemExit("Could not find painted master tileSprite block")
text = text.replace(old, new, 1)

path.write_text(text)
