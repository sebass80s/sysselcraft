from pathlib import Path

path = Path('src/game/createVillageGame.ts')
text = path.read_text()

unused_import = '  OPENING_AMBIENT_OBJECTS,\n'
if unused_import in text:
    text = text.replace(unused_import, '', 1)

old_mask = 'this.make.graphics({ x: 0, y: 0, add: false })'
new_mask = 'this.make.graphics({ x: 0, y: 0 }, false)'
if old_mask in text:
    text = text.replace(old_mask, new_mask, 1)

if unused_import in text or old_mask in text:
    raise SystemExit('Cleanup patch did not fully apply')

path.write_text(text)
