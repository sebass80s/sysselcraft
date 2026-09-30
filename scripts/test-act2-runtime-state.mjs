import assert from "node:assert/strict";
import fs from "node:fs";
import { createDefaultAct2RuntimeState, normalizeAct2RuntimeState } from "../src/game/act2RuntimeState.ts";

const empty = createDefaultAct2RuntimeState();
assert.equal(empty.openingIndex, 0);
assert.equal(empty.openingComplete, false);
assert.equal(empty.selectedProject, null);

const restored = normalizeAct2RuntimeState({
  version: 1,
  entered: true,
  openingIndex: 4,
  openingComplete: true,
  bicycleSeen: true,
  alveIntroIndex: 999,
  alveIntroComplete: true,
  selectedProject: "dock",
});
assert.equal(restored.entered, true);
assert.equal(restored.openingIndex, 4);
assert.equal(restored.openingComplete, true);
assert.equal(restored.bicycleSeen, true);
assert.equal(restored.alveIntroComplete, true);
assert.equal(restored.selectedProject, "dock");

assert.equal(normalizeAct2RuntimeState({ version: 1, selectedProject: "motorboat" }).selectedProject, null);
assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: 99 }).openingIndex, 4);
assert.equal(normalizeAct2RuntimeState({ version: 1, openingIndex: -4 }).openingIndex, 0);

const page = fs.readFileSync(new URL("../src/app/act2/page.tsx", import.meta.url), "utf8");
for (const required of [
  "01-dog-runs-off.png",
  "02-into-the-forest.png",
  "03-through-the-trees.png",
  "04-first-view-of-the-lake.png",
  "05-the-bicycle.png",
  "meeting-alve/bike.png",
  "meeting-alve/first-hello.png",
  "Vad börjar vi med?",
  "Laga {PROJECT_COPY[previewProject].object}",
]) assert.ok(page.includes(required), `missing Act 2 runtime contract: ${required}`);

const village = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(village.includes('clinicCompletionSeen && <a href="/act2/"'), "Act 2 trigger must remain gated by completed Clinic finale");

console.log("Act 2 vertical-slice state/route contract PASS");
