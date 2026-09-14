from pathlib import Path
p=Path('src/game/createVillageGame.ts')
s=p.read_text()
needle='      this.load.image("linus-painted", "/assets/village/reboot/linus-painted.png");\n'
if needle not in s: raise SystemExit('preload anchor missing')
s=s.replace(needle, needle+'      this.load.image("puppy-painted", "/assets/village/reboot/puppy-painted.png");\n',1)
old='''      this.dog = this.add.image(548, 303, "dog-puppy")
        .setOrigin(0.5, 0.88)
        .setDepth(1303)
        .setVisible(requestedDogVisible);'''
new='''      this.dog = this.add.image(548, 303, "puppy-painted")
        .setOrigin(0.5, 0.88)
        .setDisplaySize(66, 55)
        .setDepth(1303)
        .setVisible(requestedDogVisible);'''
if old not in s: raise SystemExit('dog block missing')
s=s.replace(old,new,1)
p.write_text(s)
