from pathlib import Path

path = Path('src/game/createVillageGame.ts')
text = path.read_text()
needle = '  OPENING_AMBIENT_OBJECTS,\n'
if needle not in text:
    raise SystemExit('Expected unused import not found; refusing to modify file')
path.write_text(text.replace(needle, '', 1))
