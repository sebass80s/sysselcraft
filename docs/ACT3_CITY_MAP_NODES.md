# Akt 3: Stadskartans node-schema 2026-10-12

Status: FÖRSLAG TILL KARTKOORDINATER OCH TESTAT RENT DATASKIKT. Användaren har valt den filmiskt illustrerade 16:9-kartan, fristående textlösa SVG-pins och en bekräftelseruta vid ikontryck. Koordinaterna kräver fortfarande visuell kontroll på fysisk iPhone.

## Referens och källor

Dataskikt: src/game/act3CityMapNodes.ts. Test: scripts/test-act3-city-map-nodes.mjs, via npm run test:act3-city-map-nodes.
Basbilden utan inbakade pins bör laddas upp till public/assets/village/act3-map/city-background.png, och SVG:erna separat till public/assets/village/act3-map/nodes/. Dessa assets finns INTE ännu i GitHub. Inga sökvägar i schemat utger sig för att vara tillgängliga runtime-assets.
Den godkända kartan MED redan målade ikoner är endast en mockup. Runtime måste använda den RENA bakgrunden för att undvika dubbla ikoner.

## Normaliserade positioner

Referensytan är 1672 × 941 px, ungefär 16:9. xPct/yPct mäts från övre vänstra hörnet, avser ikonens SPETS och placeras relativt samma okroppade contain-bildyta. Letterboxing får inte förskjuta noderna.

| ID | Ikon | xPct | yPct | Roll |
| --- | --- | ---: | ---: | --- |
| harbor | harbor | 18.9 | 62.5 | Båt och retur via befintliga Akt 2 |
| folkpark | folkpark | 75.4 | 66.8 | Parkens storybeats |
| nova-home | home | 81.8 | 20.2 | Novas mammas lägenhet |
| game-shop | game-shop | 54.3 | 43.3 | Spelbutiken som byter namn till Arkaden efter avslöjandet |
| treasure-hunt | treasure-hunt | 39.2 | 62.6 | En enda tillfällig plats under HUNT-001–006 |

## Synlighet och bekräftelse

Endast Hamnen visas initialt på en öppnad stadskarta. De permanenta platserna syns först efter ett uttryckligt storyintroduktions-event, inte bara för att de omnämns. Exakt trigger-beat för varje permanent plats är fortfarande öppet. Visade permanenta platser bevaras via chapter save i kommande integrationssteg. Skattjakten syns enbart i sin HUNT-sekvens och försvinner sedan. Retrospelbutiken byter namn till Arkaden först efter DRAMA-010 när spelets hemliga arkad faktiskt introduceras. Samma node-ID används hela tiden.
Tryck på synlig node visar separat bekräftelseruta, exempelvis 'Vi går till parken.' med knapparna 'OK' och 'Gå tillbaka'. Ett ikontryck eller ett avbrytande får ALDRIG mutera progression. Efter OK beslutar Runtime 1.1:s storyvärd om nästa beat, väntedialog, deadbeat eller normal retur via hamnen. Vanlig hamnresa får inte konsumera BOAT-beats.
Active-state är en visuell markering även när storyn väntar på nytt föräldragodkänt och claimat IRL-quest. Oupptäckta nodes renderas inte alls.

## Gränser

Schemat är ren data och ändrar INTE Akt 3-saveformat, de 140 beatens mapLocationId (fortsatt null), backend, questmotor eller storydialog. Inga positionskoordinater är slutligt telefonverifierade. Nästa slice är att lägga in ren baskarta + riktiga SVG-filer, skapa kartoverlay och koppla chapter host utan parallell storymotor.
