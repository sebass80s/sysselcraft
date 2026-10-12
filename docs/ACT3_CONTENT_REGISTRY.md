# Akt 3: Innehållsregister och kodningshandover (2026-10-12)

**Status:** Maskinläsbar innehålls- och bildinventering verifierad mot GitHub. Detta är INTE en export av färdiggranskade runtime-dialoger. Berättelsen och Runtime 1.1 har inte ändrats.

## Filer och roller

- src/game/act3ContentRegistry.json: 140 beats i låst kronologisk ordning. Varje rad har bildväg, kanonisk manusmarkör, källurval, kontrolldigest, talande karaktärer, narrativt platsförslag och questregel.
- scripts/test-act3-content-registry.mjs: validerar ordning, bildfiler, manusdrift, de tre extrabilderna och questgrindarna. Kör npm run test:act3-content-registry, även tillagd i npm run verify.
- script.speakerIds är bara de som har repliker i valt avsnitt, INTE bildens kompletta rollista.
- narrativeLocationHint är enbart berättelsekontext. mapLocationId är null för ALLA beats, eftersom de exakta karttriggrarna inte är låsta. Använd aldrig hint som automatisk navigation.

## GitHub-bildinventering

142 PNG-filer ligger under public/assets/village/story-moments/act3/: 139 beatillustrationer plus 3 extrabilder. OPEN-000 använder gemensamt kapitelkort och ska inte ha någon PNG.
Extras, kvar oförändrade: open/Golden-Hour Harbor Conversation.png, open/Golden-Hour Harbor Encounter.png och park/passardennanånstans .png.
FAMILY-015/016/017 är avsiktligt identiska, uttryckligen bekräftat av användaren. OPEN-001–005 är omdöpta och kopplade. Existens i GitHub är INTE samma sak som bildkvalitetsgodkännande.

## Manusurval (viktig säkerhetsregel)

Huvudmanifestet innehåller 139 olika formella beat-rubriker plus godkända VILLAGE-009 som en fristående 11N-sektion. 32 beat-ID:n förekommer under flera rubriker. Vald källa är senast förekommande fullständiga beatavsnitt, med ett explicit specialfall för 11N/VILLAGE-009. Kontrollera alltid mot ACT3_DIALOG_CANON_RESOLUTION.md innan faktisk dialogexport.
Den återfunna originaltexten för PARK-019–022 finns i 11AU med ## A3-PARK-rubriker. En parser som bara läser ### väljer felaktigt äldre engelska synopsis. PARK-021 har en godkänd revidering i 11AU. CITY-001–003 ska komma från senast godkända 11AX, utan arkadspoiler. VILLAGE-009 ska använda reviderade 11N, inte gammal synopsis.
SelectedSceneDigestFnv1a32 är en enkel textdriftkontroll, inte ett godkännandebevis. Flera källavsnitt behöver fortfarande rad-för-rad-kontroll. Ett rött driftprov måste utredas mot kanon, inte kringgås genom att skriva om registret automatiskt.

## Låst progression

OPEN-000–005 + PARK-001: 7 gratis beats. PARK-002 till SECRET-006: 106 beats, vart och ett kräver en separat auktoritativ föräldragodkänd och barnclaimad IRL-quest. FAMILY-001–021: sammanhängande utan fler quests, efter EN slutlig inköpsgrind och det beslutade FAMILY-vuxenmeddelandet. Därefter en separat, 107:e, questgrind för EPILOG-001; EPILOG-001–006 löper utan fler quests. Inget lokalt belöningsmyntande eller progression utanför Runtime 1.1.

## Nästa etapp

Rita/godkänn separat stadskarta, bestäm exakta ikoner/triggers och bygg en första slice: X-port → OPEN-000–005 → PARK-001 → första questgrinden vid PARK-002. Återanvänd gemensam Story Engine, chapter host, persistence och backend-claiming. Låt befintliga Act 1/2-save och wallet vara intakta.

**Verifieringsgräns:** strukturell kontroll mot GitHub är utförd; Node-testet är incheckat men inte kört i riktig checkout här. Full npm run verify, CI och fysisk iPhone-acceptans måste göras i ett separat testpass.
