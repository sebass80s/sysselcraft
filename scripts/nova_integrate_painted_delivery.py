from pathlib import Path

GAME = Path('src/game/createVillageGame.ts')
TRUCK = Path('public/assets/village/reboot/truck-painted.png')
MATERIALS = Path('public/assets/village/reboot/materials-painted.png')

if not (TRUCK.exists() and MATERIALS.exists()):
    raise SystemExit('Painted delivery assets not both present yet; no code change.')

s = GAME.read_text()

anchor = '      this.load.image("puppy-painted", "/assets/village/reboot/puppy-painted.png");\n'
loads = (
    '      this.load.image("truck-painted", "/assets/village/reboot/truck-painted.png");\n'
    '      this.load.image("materials-painted", "/assets/village/reboot/materials-painted.png");\n'
)
if 'this.load.image("truck-painted"' not in s:
    if anchor not in s:
        raise SystemExit('Preload anchor missing; refusing to patch')
    s = s.replace(anchor, anchor + loads, 1)

old_material = '      this.materialStack = this.worldImage(760, 458, "material-stack", 1);\n'
new_material = '''      this.materialStack = this.add.image(760, 458, "materials-painted")
        .setOrigin(0.5, 0.92)
        .setDisplaySize(190, 106)
        .setDepth(1458);
'''
if old_material in s:
    s = s.replace(old_material, new_material, 1)
elif '"materials-painted"' not in s:
    raise SystemExit('Material stack anchor missing; refusing to patch')

old_truck = '      const truck = this.add.image(1030, 350, "truck").setOrigin(0.5, 1).setDepth(1350);\n'
new_truck = '''      const truck = this.add.image(1030, 350, "truck-painted")
        .setOrigin(0.5, 0.92)
        .setDisplaySize(245, 160)
        .setDepth(1350);
'''
if old_truck in s:
    s = s.replace(old_truck, new_truck, 1)
elif '"truck-painted"' not in s:
    raise SystemExit('Truck anchor missing; refusing to patch')

GAME.write_text(s)
