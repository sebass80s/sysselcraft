# NOVA HANDOVER: Quest V2 explicit templates · 2026-10-14

## Läs detta först

Detta är en **pågående uppgift, inte en ny projektstart**. Verifiera alltid GitHub HEAD, diff och Actions innan du ändrar, mergar eller deployar. All generell gameplay hör till **Runtime Architecture 1.1**, med kapitelkonfiguration/tunna adapters och fuel-test vid ny motormekanik.

- Repo: `sebass80s/sysselcraft`. Integrationsbranch: `nova/runtime-architecture-v1`. Senast observerad bas HEAD efter PR #17: `fe313bd1be89fbd22111e97bceaa2549bf48a31f`.
- **PR #18 ÖPPEN:** https://github.com/sebass80s/sysselcraft/pull/18. Arbetsbranch: `nova/quest-v2-explicit-template-save`, bas `nova/runtime-architecture-v1`.
- Kodcheckpoint före detta docs-closeout: `9625a26c0b9c491426fd766d50172ba73a0ef914`. [CI #38598284568](https://github.com/sebass80s/sysselcraft/actions/runs/38598284568) **SUCCESS**, [Runtime Browser Closeout #38598284587](https://github.com/sebass80s/sysselcraft/actions/runs/38598284587) **SUCCESS**, samma SHA. Kontrollera också status på docs-HEAD innan merge.
- **PR #18 är INTE mergad, databas-migrationen är INTE applicerad och ingen Vercel-deploy för denna ändring har skett.** Befintlig webbproduktion kör i stället PR #17-lösningen.
- Tidigare **PR #17 MERGAD** på integration (merge `fe313bd1`) och deployad via ett kontrollerat Vercel-produktionsbygge. SQL-migration `quest_v2_recurring_expiry_and_parent_cancel` är redan i live Supabase. Kontrollerat: `Bädda sängen` från 12 och 13 okt blev `expired`, den 14 okt förblev aktiv, 109 belöningshändelser bevarades. PR #17 ger `Ta bort instans` för nya/pågående quests på `/parent`.

## Produktbeslut: mallar ska vara ett medvetet val

Gamla flödet lagrade varje `parent_quests`-definition och visade allt som `Uppdragsmallar`, även rena engångsuppdrag. Detta ska **inte** längre ske automatiskt.

1. **Skicka uppdrag:** anropar befintlig `create_parent_quest_v2`; skapar verklig child quest/ett schemalagt uppdrag men **ingen sparad mall**.
2. **Skapa mall:** anropar nya `create_parent_quest_template_v1`; sparar återanvändbart innehåll utan child `quest_instance`, belöning eller worldProgression. Ingen automatiserad utskickning.
3. **Använd mall:** fyller i uppdragsformuläret. Föräldern måste därefter uttryckligen trycka **Skicka uppdrag**.
4. **Ta bort mall:** endast `saved_as_template=false` via `remove_parent_quest_template_v1`; påverkar inga pågående instanser, scheman eller belöningar.
5. **Återkommande uppdrag:** separat sektion med redigera/återaktivera/stoppa schema. Dessa är verkliga backenddefinitioner som fortsätter fungera även om de inte sparats som mallar.

Bakåtkompatibilitet: migreringen markerar tidigare `parent_quests` med barninstans som gamla sparade mallar, så redan visad bibliotekshistorik inte försvinner. Föräldern kan nu ta bort dessa en och en. Nytt fält `saved_as_template=false` gäller bara NYA definitioner och standalone-mallar får `template_child_id`.

## Filkarta

- `supabase/migrations/20261014_quest_v2_explicit_parent_templates.sql`: de två fälten, legacy-backfill och tre parent-only RPC:er (create/list/remove). Ingen instans, valutamutation eller questbelöning från `Skapa mall`.
- `src/backend/database.types.ts`, `src/backend/familyRepository.ts`: schema/RPC-typer och `createParentQuestTemplate`, `listParentQuestTemplates`, `removeParentQuestTemplate`. `listParentQuestDefinitions` finns kvar för aktiva scheman.
- `src/app/parent/page.tsx`: `Skicka uppdrag` plus separat `Skapa mall`, `Sparade mallar` (Använd/Ta bort), `Återkommande uppdrag`. Barnets iOS-kod oförändrad.
- `scripts/test-quest-v2-explicit-templates.mjs` registrerad i `npm run verify`. Canonical domänbeskrivning: `docs/QUEST_V2_EXPLICIT_TEMPLATES_2026-10-14.md`, tillsammans med `docs/QUEST_SYSTEM_V2.md`.

## Release och kvarvarande kontroller

**Nästa Nova ska INTE hoppa direkt till deploy utan verifiera!**

1. Kontrollera PR #18/branchens slut-HEAD och båda Actions-pipelines. Granska SQL särskilt för child scope, parent-auth, legacy migration och att template-only-definition inte kan materialisera en quest. Automattester verifierar kodkontrakt/browser, men **inte genomkörd riktig migrations-SQL**.
2. Innan live-release: testa migreringen i säker isolerad miljö om möjligt. Kontrollera att befintliga återkommande quests (t.ex. `Bädda sängen`) inte påverkas, och att tidigare belöningar/sparningar består. Inga retroaktiva automatiska mallskapanden efter migreringsögonblicket.
3. **Efter godkännande för live-release:** koordinera Supabase-migration via `apply_migration` och EN Vercel-produktionsdeploy från integrationsbranch med den mergade PR #18. Vercel-projekt `sysselcraft` har avsiktligt **Ignored Build Step `exit 0`**. Vid kontrollerad deploy: tillfälligt tillåt bygg (`exit 1`), kontrollera READY + produktionsalias + korrekt commit, **återställ `exit 0`**. Ingen automatisk deploy varje GitHub-push, inga onödiga builds.
4. Föräldraacceptans: (a) skicka engångsquest => synligt hos barnet men inte i sparade mallar; (b) skapa mall => synlig enbart i föräldrabibliotek, inte hos barnet; (c) använd mall och skicka => ett nytt quest; (d) ta bort mall => gamla instanser och upprepningsschema lever vidare; (e) dagligt schema producerar högst dagens öppna instans, äldre ogjorda expirerar; (f) parent-behörighet och barnspecifik mallbehörighet.
5. **OBS:** PR #13, #15 och #16 är separata **öppna stackade Akt 3-PR:er**; får inte oavsiktligt mergas/deployas i denna Quest V2-release. Akt 3-spelningen på fysisk iPhone nådde PARK-002 efter riktigt backend-testquest; rubrik-/Nova-nameplate-rättning ligger separat i PR #16.

## Begränsningar

- Legacybiblioteket ser fortfarande fullt ut tills föräldern avlägsnar gamla mallar själv: bakåtkompatibilitet valdes i stället för destruktiv städning.
- Den nya mallen är en förifyllnadsprofil, inte ett aktivt quest. För vidare mallredigering bör en isolerad template-RPC införas, inte ändring av en verklig pågående questdefinition.
- Befintliga svenska dags-/veckoscheman och barnets installerade app kräver ingen uppdatering från denna PR. Endast förälderns webbfrontend och Supabase RPC/schema ändras.
