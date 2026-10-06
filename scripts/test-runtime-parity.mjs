import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { deriveGameUiShell } from "../src/game/uiShellState.ts";
import { SYSTEM_ASSETS, SYSTEM_COMPONENT_IDS, CANONICAL_SYSTEMS } from "../src/runtime/systemRegistry.ts";
import { createStoryRegistry } from "../src/runtime/story/storyRegistry.ts";
import { historyEntriesFor, resolveReplayRequest } from "../src/runtime/story/storyHistory.ts";
import { resolveInteraction, worldInputEnabled } from "../src/runtime/interaction/interactionContract.ts";
import { resolveInteractionPriority } from "../src/runtime/interaction/interactionPriority.ts";
import { resolveDirectMovementIntent } from "../src/runtime/world/movement.ts";
import { WORLD_CAMERA, worldCameraDeadzone } from "../src/runtime/world/worldCamera.ts";
import {
  WORLD_MIN_VIEW_WIDTH,
  WORLD_VIEW_HEIGHT,
  worldViewportSize,
} from "../src/runtime/world/worldViewport.ts";
import { WORLD_ENTITY_DEPTH_BASE, worldEntityDepth } from "../src/runtime/world/worldDepth.ts";
import { runSequentialMigrations } from "../src/runtime/save/migrations.ts";
import { authoritativeProgressDelta } from "../src/runtime/progression/authoritativeDelta.ts";
import { ACT2_PURCHASE_CATALOG } from "../src/game/act2PurchaseCatalog.ts";
import { progressGateRequired } from "../src/runtime/progression/progressGate.ts";
import { ACT2_OPENING_BEATS } from "../src/game/act2OpeningStory.ts";
import { CABIN_CONTRIBUTION_BEATS } from "../src/game/act2CabinStory.ts";
import { JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT, JETTY_COMPLETION_REACTION } from "../src/game/act2JettyStory.ts";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../src/game/act2BoathouseStory.ts";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../src/game/act2MotorboatStory.ts";
import { ACT2_FINALE_BEATS } from "../src/game/act2FinaleStory.ts";


function loadTsModule(file, dependencies) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected parity dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

const saveMigrationModule = loadTsModule("../src/runtime/save/migrations.ts", {});
const progressionDeltaModule = loadTsModule("../src/runtime/progression/authoritativeDelta.ts", {});
const progressGateModule = loadTsModule("../src/runtime/progression/progressGate.ts", {});
const chapterRegistryModule = loadTsModule("../src/runtime/chapter/chapterRegistry.ts", {});
const {
  act2PurchaseShopHref,
  act2ResumeHref,
  parseAct2PurchaseProject,
} = loadTsModule("../src/game/act2PurchaseHandoff.ts", {
  "../runtime/chapter/chapterRegistry": chapterRegistryModule,
});
const {
  createDefaultAct2RuntimeState,
  act2ContributionBlockedByStoryGate,
  jettyPurchaseRequired,
  boathousePurchaseRequired,
  motorboatPartsPurchaseRequired,
  motorboatNamingRequired,
} = loadTsModule("../src/game/act2RuntimeState.ts", {
  "@capacitor/preferences": { Preferences: {} },
  "../runtime/save/migrations": saveMigrationModule,
  "../runtime/progression/authoritativeDelta": progressionDeltaModule,
  "../runtime/progression/progressGate": progressGateModule,
});

const {
  ACT2_STORY_REGISTRY,
  ACT2_STORYLINE_IDS,
  act2HistoryProgress,
} = loadTsModule("../src/runtime/story/act2StoryRegistry.ts", {
  "../../game/act2OpeningStory": { ACT2_OPENING_BEATS },
  "../../game/act2CabinStory": { CABIN_CONTRIBUTION_BEATS },
  "../../game/act2JettyStory": { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT },
  "../../game/act2BoathouseStory": { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT },
  "../../game/act2MotorboatStory": { MOTORBOAT_CONTRIBUTION_BEATS },
  "../../game/act2FinaleStory": { ACT2_FINALE_BEATS },
  "./storyRegistry": { createStoryRegistry },
});

const villagePointerTargetFixtures = [
  {
    name: "scene pointer keeps Recycling ahead of overlapping Linus target",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: false },
      { id: "shop", priority: 30, enabled: false },
      { id: "linus", priority: 40, enabled: true },
      { id: "recycling", priority: 50, enabled: true },
    ],
    expected: "recycling",
  },
  {
    name: "scene pointer keeps Shop ahead of overlapping Henning target",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: true },
      { id: "shop", priority: 30, enabled: true },
      { id: "linus", priority: 40, enabled: false },
      { id: "recycling", priority: 50, enabled: false },
    ],
    expected: "shop",
  },
  {
    name: "scene pointer falls back to ground when no world target is hit",
    candidates: [
      { id: "ground", priority: 10, enabled: true },
      { id: "henning", priority: 20, enabled: false },
      { id: "shop", priority: 30, enabled: false },
      { id: "linus", priority: 40, enabled: false },
      { id: "recycling", priority: 50, enabled: false },
    ],
    expected: "ground",
  },
];

for (const fixture of villagePointerTargetFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const henningPriorityFixtures = [
  {
    name: "Henning construction attention outranks story CTA and backend quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "construction-attention", priority: 40, enabled: true },
    ],
    expected: "construction-attention",
  },
  {
    name: "Henning Sol-tour CTA outranks backend quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "story-cta",
  },
  {
    name: "Henning backend quest outranks ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "quest-source",
  },
  {
    name: "Henning falls back to ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: false },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "construction-attention", priority: 40, enabled: false },
    ],
    expected: "resident",
  },
];

for (const fixture of henningPriorityFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const linusPriorityFixtures = [
  {
    name: "Linus construction attention outranks intro and quest",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "intro", priority: 40, enabled: true },
      { id: "construction-attention", priority: 50, enabled: true },
    ],
    expected: "construction-attention",
  },
  {
    name: "Linus intro outranks backend quest before onboarding completes",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: true },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "intro",
  },
  {
    name: "Linus Sol-tour CTA outranks backend quest after onboarding",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: true },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "story-cta",
  },
  {
    name: "Linus backend quest outranks ordinary resident interaction after intro",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: true },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "quest-source",
  },
  {
    name: "Linus falls back to ordinary resident interaction",
    candidates: [
      { id: "resident", priority: 10, enabled: true },
      { id: "quest-source", priority: 20, enabled: false },
      { id: "story-cta", priority: 30, enabled: false },
      { id: "intro", priority: 40, enabled: false },
      { id: "construction-attention", priority: 50, enabled: false },
    ],
    expected: "resident",
  },
];

for (const fixture of linusPriorityFixtures) {
  assert.equal(resolveInteractionPriority(fixture.candidates)?.id, fixture.expected, fixture.name);
}

const worldDepthFixtures = [
  { name: "world depth rounds down below the half-pixel boundary", y: 427.4, expected: 1427 },
  { name: "world depth rounds up above the half-pixel boundary", y: 427.6, expected: 1428 },
  { name: "world depth preserves integer authored y values", y: 452, expected: 1452 },
];

assert.equal(WORLD_ENTITY_DEPTH_BASE, 1000);
for (const fixture of worldDepthFixtures) {
  assert.equal(worldEntityDepth(fixture.y), fixture.expected, fixture.name);
}

// Execute both building renderers against the pre-extraction depth oracle.
const depthDependencies = { "../runtime/world/worldDepth": { worldEntityDepth } };
const decor = loadTsModule("../src/game/worldDecor.ts", depthDependencies);
const productionAssets = loadTsModule("../src/game/visualProductionAssets.ts", {});
const productionRuntime = loadTsModule("../src/game/visualProductionRuntime.ts", {
  ...depthDependencies, "./visualProductionAssets": productionAssets,
});
const depthScene = { add: { image(x, y, key) {
  return { x, y, key,
    setOrigin() { return this; }, setDisplaySize() { return this; },
    setCrop() { return this; }, setDepth(depth) { this.depth = depth; return this; },
  };
} } };
for (const y of [0, 427.4, 427.5, 427.6, -0.5, -1.5]) {
  assert.equal(worldEntityDepth(y), 1000 + Math.round(y));
  const building = decor.STAGE4_PLAYTEST_BUILDINGS[0];
  const previousY = building.y;
  building.y = y;
  assert.equal(decor.createStage4PlaytestBuildings(depthScene)[0].depth, 1000 + Math.round(y));
  building.y = previousY;
  const placement = productionAssets.VISUAL_PRODUCTION_PLACEMENTS[0];
  const previousBaseY = placement.baseY;
  placement.baseY = y;
  for (const stage of [1, 2, 3, 4]) {
    const [image] = productionRuntime.createVisualProductionBuildings(depthScene, { [placement.building]: stage });
    assert.equal(image.depth, 1000 + Math.round(y));
    assert.equal(image.y, y);
  }
  placement.baseY = previousBaseY;
}

const legacyAct2PurchaseCatalog = {
  dock: {
    price: 200,
    gateTitle: "Bryggan · nästa steg",
    gateText: "Sol vill att ni skaffar en riktig livboj innan arbetet fortsätter.",
    gateDetail: "Mira kan ordna den i lanthandeln för 200 SysselBux.",
    shopIcon: "🛟",
    shopTitle: "Livboj till bryggan",
    shopDescription: "Sol vill att badplatsen har en riktig livboj innan ni fortsätter.",
    shopRequirement: "⭐ Behövs till Bryggan",
  },
  boathouse: {
    price: 200,
    gateTitle: "Båthuset · nästa steg",
    gateText: "Lådbilen behöver en riktig ratt innan ni kan bygga vidare.",
    gateDetail: "Mira har en som passar för 200 SysselBux.",
    shopIcon: "🛞",
    shopTitle: "Ratt till lådbilen",
    shopDescription: "Den sista delen Alve behöver för att kunna bygga lådbilen.",
    shopRequirement: "⭐ Behövs till Båthuset",
  },
  motorboat: {
    price: 200,
    gateTitle: "Motorbåten · nästa steg",
    gateText: "Linus har konstaterat att några delar inte går att rädda.",
    gateDetail: "Mira kan beställa reservdelspaketet för 200 SysselBux.",
    shopIcon: "📦",
    shopTitle: "Reservdelspaket till motorbåten",
    shopDescription: "Delarna Linus behöver för att arbetet ska kunna fortsätta.",
    shopRequirement: "⭐ Behövs till Motorbåten",
  },
};

for (const [project, item] of Object.entries(legacyAct2PurchaseCatalog)) {
  assert.equal(item.price, 200, `${project} accepted display price must remain 200 SysselBux`);
  assert.ok(item.gateDetail.includes(`${item.price} SysselBux`), `${project} lake gate copy must agree with its display price`);
  assert.ok(item.shopTitle.length > 0 && item.shopDescription.length > 0 && item.shopRequirement.length > 0);

  const shared = ACT2_PURCHASE_CATALOG[project];
  assert.equal(shared.price, item.price, `${project} shared display price drifted`);
  assert.equal(shared.gate.title, item.gateTitle, `${project} gate title drifted`);
  assert.equal(shared.gate.text, item.gateText, `${project} gate text drifted`);
  assert.equal(shared.gate.detail, item.gateDetail, `${project} gate detail drifted`);
  assert.equal(shared.shop.icon, item.shopIcon, `${project} shop icon drifted`);
  assert.equal(shared.shop.title, item.shopTitle, `${project} shop title drifted`);
  assert.equal(shared.shop.description, item.shopDescription, `${project} shop description drifted`);
  assert.equal(shared.shop.requirement, item.shopRequirement, `${project} shop requirement drifted`);
}

const act2PurchaseHandoffFixtures = [
  { value: "dock", expected: "dock" },
  { value: "boathouse", expected: "boathouse" },
  { value: "motorboat", expected: "motorboat" },
  { value: "cabin", expected: null },
  { value: "DOCK", expected: null },
  { value: "", expected: null },
  { value: null, expected: null },
];

function legacyParseAct2PurchaseProject(value) {
  return value === "dock" || value === "boathouse" || value === "motorboat"
    ? value
    : null;
}

function legacyAct2PurchaseShopHref(project) {
  return `/?act2-purchase=${project}`;
}

function legacyAct2ResumeHref(project) {
  return `/act2?resume=${project}`;
}

for (const fixture of act2PurchaseHandoffFixtures) {
  assert.equal(
    legacyParseAct2PurchaseProject(fixture.value),
    fixture.expected,
    `Act 2 purchase handoff parse oracle failed for ${String(fixture.value)}`,
  );
  assert.equal(
    parseAct2PurchaseProject(fixture.value),
    legacyParseAct2PurchaseProject(fixture.value),
    `shared Act 2 purchase parser parity failed for ${String(fixture.value)}`,
  );
}
for (const project of ["dock", "boathouse", "motorboat"]) {
  assert.equal(legacyAct2PurchaseShopHref(project), `/?act2-purchase=${project}`);
  assert.equal(legacyAct2ResumeHref(project), `/act2?resume=${project}`);
  assert.equal(act2PurchaseShopHref(project), legacyAct2PurchaseShopHref(project));
  assert.equal(act2ResumeHref(project), legacyAct2ResumeHref(project));
}

function legacyAct2UiStoryGateBlocked(state) {
  const project = state.selectedProject;
  if (!project) return false;
  return (project === "dock" && jettyPurchaseRequired(state))
    || (project === "boathouse" && boathousePurchaseRequired(state))
    || (project === "motorboat" && (
      motorboatPartsPurchaseRequired(state)
      || motorboatNamingRequired(state)
    ));
}

const act2GateArbitrationFixtures = [
  {
    name: "cabin never receives a story gate",
    project: "cabin",
    contributions: 12,
    flags: {},
  },
  {
    name: "dock lifebuoy gate wins at contribution six",
    project: "dock",
    contributions: 6,
    flags: {},
  },
  {
    name: "dock ownership releases lifebuoy gate",
    project: "dock",
    contributions: 6,
    flags: { jettyLifebuoyOwned: true },
  },
  {
    name: "boathouse steering-wheel gate wins at contribution nine",
    project: "boathouse",
    contributions: 9,
    flags: {},
  },
  {
    name: "motorboat parts gate wins before naming threshold",
    project: "motorboat",
    contributions: 5,
    flags: {},
  },
  {
    name: "motorboat naming gate remains after parts are owned",
    project: "motorboat",
    contributions: 12,
    flags: { motorboatPartsOwned: true },
  },
  {
    name: "motorboat clears both gates when parts and name are resolved",
    project: "motorboat",
    contributions: 12,
    flags: { motorboatPartsOwned: true, motorboatName: "Alve" },
  },
];

for (const fixture of act2GateArbitrationFixtures) {
  const base = createDefaultAct2RuntimeState();
  const state = {
    ...base,
    selectedProject: fixture.project,
    ...fixture.flags,
    projects: {
      ...base.projects,
      [fixture.project]: {
        ...base.projects[fixture.project],
        contributions: fixture.contributions,
        visibleStage: Math.min(4, 1 + Math.floor(Math.max(0, fixture.contributions - 1) / 4)),
        complete: fixture.contributions >= 16,
      },
    },
  };
  assert.equal(
    act2ContributionBlockedByStoryGate(state, fixture.project),
    legacyAct2UiStoryGateBlocked(state),
    `Act 2 UI/state gate arbitration parity failed: ${fixture.name}`,
  );
}

const progressGateParityFixtures = [
  { name: "below threshold stays open", progress: 5, threshold: 6, completion: 16, resolved: false, expected: false },
  { name: "threshold activates unresolved gate", progress: 6, threshold: 6, completion: 16, resolved: false, expected: true },
  { name: "mid-arc unresolved gate remains active", progress: 11, threshold: 6, completion: 16, resolved: false, expected: true },
  { name: "resolved requirement releases active window", progress: 11, threshold: 6, completion: 16, resolved: true, expected: false },
  { name: "completion boundary retires unresolved gate", progress: 16, threshold: 6, completion: 16, resolved: false, expected: false },
  { name: "past completion remains retired", progress: 20, threshold: 6, completion: 16, resolved: false, expected: false },
  { name: "motorboat parts threshold preserves beat five boundary", progress: 5, threshold: 5, completion: 16, resolved: false, expected: true },
  { name: "motorboat naming threshold preserves beat twelve boundary", progress: 12, threshold: 12, completion: 16, resolved: false, expected: true },
];

function legacyProgressGateRequired(progress, threshold, completion, resolved) {
  return progress >= threshold && progress < completion && !resolved;
}

for (const fixture of progressGateParityFixtures) {
  assert.equal(
    legacyProgressGateRequired(fixture.progress, fixture.threshold, fixture.completion, fixture.resolved),
    fixture.expected,
    fixture.name,
  );
  assert.equal(
    progressGateRequired(fixture.progress, fixture.threshold, fixture.completion, fixture.resolved),
    legacyProgressGateRequired(fixture.progress, fixture.threshold, fixture.completion, fixture.resolved),
    `shared progress gate parity failed: ${fixture.name}`,
  );
}

const authoritativeDeltaParityFixtures = [
  { name: "equal authoritative and baseline counts produce zero delta", authoritative: 12, baseline: 12, expected: 0 },
  { name: "authoritative count above baseline preserves whole contribution delta", authoritative: 17, baseline: 12, expected: 5 },
  { name: "authoritative count below baseline clamps at zero", authoritative: 8, baseline: 12, expected: 0 },
  { name: "fractional authoritative values preserve historical floor semantics", authoritative: 14.9, baseline: 10.2, expected: 4 },
  { name: "negative authoritative values cannot create negative progression", authoritative: -3, baseline: 2, expected: 0 },
];

function legacyAuthoritativeDelta(authoritative, baseline) {
  return Math.max(0, Math.floor(authoritative) - Math.floor(baseline));
}

for (const fixture of authoritativeDeltaParityFixtures) {
  assert.equal(
    legacyAuthoritativeDelta(fixture.authoritative, fixture.baseline),
    fixture.expected,
    fixture.name,
  );
  assert.equal(
    authoritativeProgressDelta(fixture.authoritative, fixture.baseline),
    legacyAuthoritativeDelta(fixture.authoritative, fixture.baseline),
    `shared authoritative delta parity failed: ${fixture.name}`,
  );
}

const migrationFixtures = [
  {
    name: "sequential migration applies every version exactly once",
    currentVersion: 1,
    targetVersion: 3,
    value: { steps: [] },
    migrations: [
      { from: 1, to: 2, migrate: (value) => ({ steps: [...value.steps, "1->2"] }) },
      { from: 2, to: 3, migrate: (value) => ({ steps: [...value.steps, "2->3"] }) },
    ],
    expected: { value: { steps: ["1->2", "2->3"] }, version: 3 },
  },
  {
    name: "already-current schema is idempotent",
    currentVersion: 3,
    targetVersion: 3,
    value: { steps: ["stable"] },
    migrations: [],
    expected: { value: { steps: ["stable"] }, version: 3 },
  },
];

for (const fixture of migrationFixtures) {
  assert.deepEqual(
    runSequentialMigrations(
      fixture.value,
      fixture.currentVersion,
      fixture.targetVersion,
      fixture.migrations,
    ),
    fixture.expected,
    fixture.name,
  );
}

assert.throws(
  () => runSequentialMigrations({}, 1, 2, []),
  /Missing migration 1 -> 2/,
  "versioned save migration must fail closed when a sequential step is missing",
);

const worldViewportFixtures = [
  {
    name: "phone-ish parent keeps the accepted 960px minimum render width",
    parentWidth: 667,
    parentHeight: 375,
    worldWidth: 1920,
    expected: 1138,
  },
  {
    name: "portrait-ish parent clamps to the accepted 960px minimum",
    parentWidth: 375,
    parentHeight: 667,
    worldWidth: 1920,
    expected: 960,
  },
  {
    name: "wide parent caps render width at the authored world width",
    parentWidth: 2000,
    parentHeight: 640,
    worldWidth: 1766,
    expected: 1766,
  },
  {
    name: "zero-sized parent preserves historical min-one input guards",
    parentWidth: 0,
    parentHeight: 0,
    worldWidth: 1920,
    expected: 960,
  },
];

function legacyWorldViewWidth(parentWidth, parentHeight, worldWidth) {
  const safeParentWidth = Math.max(parentWidth, 1);
  const safeParentHeight = Math.max(parentHeight, 1);
  return Math.min(
    worldWidth,
    Math.max(960, Math.round(640 * (safeParentWidth / safeParentHeight))),
  );
}

assert.equal(WORLD_VIEW_HEIGHT, 640);
assert.equal(WORLD_MIN_VIEW_WIDTH, 960);
for (const fixture of worldViewportFixtures) {
  const legacyWidth = legacyWorldViewWidth(
    fixture.parentWidth,
    fixture.parentHeight,
    fixture.worldWidth,
  );
  assert.equal(legacyWidth, fixture.expected, fixture.name);
  assert.deepEqual(
    worldViewportSize(fixture.parentWidth, fixture.parentHeight, fixture.worldWidth),
    { width: legacyWidth, height: 640 },
    `shared viewport parity failed: ${fixture.name}`,
  );
}

const cameraDeadzoneFixtures = [
  { name: "phone-width camera deadzone preserves the accepted 32% width", viewWidth: 667, expected: { width: 213.44, height: 180 } },
  { name: "wide camera deadzone preserves the accepted 340px width cap", viewWidth: 1536, expected: { width: 340, height: 180 } },
];

assert.equal(WORLD_CAMERA.backgroundColor, "#789a68");
assert.equal(WORLD_CAMERA.followLerpX, 0.08);
assert.equal(WORLD_CAMERA.followLerpY, 0.08);
for (const fixture of cameraDeadzoneFixtures) {
  assert.deepEqual(worldCameraDeadzone(fixture.viewWidth), fixture.expected, fixture.name);
}

const directMovementFixtures = [
  {
    name: "keyboard movement clears an existing tap target and normalizes diagonals",
    input: { left: false, right: true, up: true, down: false },
    player: { x: 100, y: 100 },
    target: { x: 300, y: 300 },
    arrivalRadius: 8,
    expectedDirection: { x: Math.SQRT1_2, y: -Math.SQRT1_2 },
    expectedClearTarget: true,
    expectedTargetReached: false,
  },
  {
    name: "tap target resolves to normalized movement when keyboard is idle",
    input: { left: false, right: false, up: false, down: false },
    player: { x: 100, y: 100 },
    target: { x: 103, y: 104 },
    arrivalRadius: 4,
    expectedDirection: { x: 0.6, y: 0.8 },
    expectedClearTarget: false,
    expectedTargetReached: false,
  },
  {
    name: "Lake direct movement clears target inside accepted 8px arrival threshold",
    input: { left: false, right: false, up: false, down: false },
    player: { x: 100, y: 100 },
    target: { x: 107, y: 100 },
    arrivalRadius: 8,
    expectedDirection: null,
    expectedClearTarget: true,
    expectedTargetReached: true,
  },
  {
    name: "Lake direct movement keeps moving at exactly 8px because legacy threshold is strict",
    input: { left: false, right: false, up: false, down: false },
    player: { x: 100, y: 100 },
    target: { x: 108, y: 100 },
    arrivalRadius: 8,
    expectedDirection: { x: 1, y: 0 },
    expectedClearTarget: false,
    expectedTargetReached: false,
  },
];

for (const fixture of directMovementFixtures) {
  const result = resolveDirectMovementIntent(
    fixture.input,
    fixture.player,
    fixture.target,
    fixture.arrivalRadius,
  );
  assert.equal(result.clearTarget, fixture.expectedClearTarget, fixture.name);
  assert.equal(result.targetReached, fixture.expectedTargetReached, fixture.name);
  if (fixture.expectedDirection === null) {
    assert.equal(result.direction, null, fixture.name);
  } else {
    assert.ok(result.direction, fixture.name);
    assert.ok(Math.abs(result.direction.x - fixture.expectedDirection.x) < 1e-9, fixture.name);
    assert.ok(Math.abs(result.direction.y - fixture.expectedDirection.y) < 1e-9, fixture.name);
  }
}

const worldInputFixtures = [
  {
    name: "explicitly enabled world without blocking overlay accepts input",
    state: { enabled: true, blockingOverlayVisible: false },
    expected: true,
  },
  {
    name: "explicitly disabled world rejects input",
    state: { enabled: false, blockingOverlayVisible: false },
    expected: false,
  },
  {
    name: "blocking overlay rejects input even when world is otherwise enabled",
    state: { enabled: true, blockingOverlayVisible: true },
    expected: false,
  },
];

for (const fixture of worldInputFixtures) {
  assert.equal(worldInputEnabled(fixture.state), fixture.expected, fixture.name);
}

const multiZoneInteractionFixtures = [
  {
    name: "interaction activates inside primary resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "multi-zone",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [{ anchor: { x: 230, y: 460 }, interactionRadius: 18 }],
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "interaction activates inside authored arrival zone",
    playerPosition: { x: 248, y: 460 },
    interaction: {
      id: "multi-zone",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [{ anchor: { x: 230, y: 460 }, interactionRadius: 18 }],
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "interaction keeps approaching outside both activation zones",
    playerPosition: { x: 249, y: 460 },
    interaction: {
      id: "multi-zone",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [{ anchor: { x: 230, y: 460 }, interactionRadius: 18 }],
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 230, y: 460 },
  },
];

for (const fixture of multiZoneInteractionFixtures) {
  const resolution = resolveInteraction(
    [fixture.interaction],
    { interactionId: fixture.interaction.id, requestedAt: fixture.interaction.approachPoint },
    fixture.playerPosition,
  );
  assert.equal(resolution.status, fixture.expectedStatus, fixture.name);
  if ("expectedTarget" in fixture && resolution.status === "approach") {
    assert.deepEqual(resolution.target, fixture.expectedTarget, fixture.name);
  }
}

const interactionFixtures = [
  {
    name: "Alve turn-in activates inside accepted legacy radius",
    playerPosition: { x: 100, y: 100 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 100 },
      approachPoint: { x: 200, y: 158 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Alve turn-in resolves to authored approach point outside radius",
    playerPosition: { x: 20, y: 20 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 200 },
      approachPoint: { x: 200, y: 258 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 200, y: 258 },
  },
  {
    name: "disabled interaction cannot activate or approach",
    playerPosition: { x: 200, y: 200 },
    interaction: {
      id: "act2:alve-turn-in",
      kind: "npc",
      anchor: { x: 200, y: 200 },
      approachPoint: { x: 200, y: 258 },
      interactionRadius: 135,
      marker: "quest-turn-in",
      enabled: false,
    },
    expectedStatus: "disabled",
  },
  {
    name: "Village noticeboard activates within accepted 36px arrival radius",
    playerPosition: { x: 175, y: 394 },
    interaction: {
      id: "village:noticeboard",
      kind: "quest-source",
      anchor: { x: 175, y: 430 },
      approachPoint: { x: 175, y: 430 },
      interactionRadius: 36,
      marker: "quest-available",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village noticeboard keeps approaching outside accepted arrival radius",
    playerPosition: { x: 175, y: 393 },
    interaction: {
      id: "village:noticeboard",
      kind: "quest-source",
      anchor: { x: 175, y: 430 },
      approachPoint: { x: 175, y: 430 },
      interactionRadius: 36,
      marker: "quest-available",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 175, y: 430 },
  },
  {
    name: "Village Recycling activates within accepted 40px arrival radius",
    playerPosition: { x: 100, y: 140 },
    interaction: {
      id: "village:recycling",
      kind: "hotspot",
      anchor: { x: 100, y: 100 },
      approachPoint: { x: 100, y: 100 },
      interactionRadius: 40,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Recycling keeps approaching outside accepted arrival radius",
    playerPosition: { x: 100, y: 141 },
    interaction: {
      id: "village:recycling",
      kind: "hotspot",
      anchor: { x: 100, y: 100 },
      approachPoint: { x: 100, y: 100 },
      interactionRadius: 40,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 100, y: 100 },
  },
  {
    name: "Village bottle message activates within accepted 38px arrival radius",
    playerPosition: { x: 835, y: 538 },
    interaction: {
      id: "village:bottle-message",
      kind: "hotspot",
      anchor: { x: 835, y: 500 },
      approachPoint: { x: 835, y: 500 },
      interactionRadius: 38,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village bottle message keeps approaching outside accepted arrival radius",
    playerPosition: { x: 835, y: 539 },
    interaction: {
      id: "village:bottle-message",
      kind: "hotspot",
      anchor: { x: 835, y: 500 },
      approachPoint: { x: 835, y: 500 },
      interactionRadius: 38,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 835, y: 500 },
  },
  {
    name: "Village Sol activates at accepted 95px resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "village:sol",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 835, y: 485 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Sol keeps approaching outside accepted 95px resident radius",
    playerPosition: { x: 96, y: 0 },
    interaction: {
      id: "village:sol",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 835, y: 485 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 835, y: 485 },
  },
  {
    name: "Village closed shop activates at accepted 42px shop radius",
    playerPosition: { x: 42, y: 0 },
    interaction: {
      id: "village:shop",
      kind: "hotspot",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 0, y: 0 },
      interactionRadius: 42,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village closed shop keeps approaching outside accepted 42px shop radius",
    playerPosition: { x: 43, y: 0 },
    interaction: {
      id: "village:shop",
      kind: "hotspot",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 0, y: 0 },
      interactionRadius: 42,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 0, y: 0 },
  },
  {
    name: "Village open shop activates at accepted 42px Mira approach zone",
    playerPosition: { x: 142, y: 0 },
    interaction: {
      id: "village:shop",
      kind: "hotspot",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 0, y: 0 },
      interactionRadius: 42,
      activationZones: [
        { anchor: { x: 100, y: 0 }, interactionRadius: 42 },
      ],
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village open shop keeps approaching outside shop and Mira arrival zones",
    playerPosition: { x: 143, y: 0 },
    interaction: {
      id: "village:shop",
      kind: "hotspot",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 0, y: 0 },
      interactionRadius: 42,
      activationZones: [
        { anchor: { x: 100, y: 0 }, interactionRadius: 42 },
      ],
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 0, y: 0 },
  },
  {
    name: "Village Linus activates inside accepted 95px resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "village:linus",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [
        { anchor: { x: 230, y: 460 }, interactionRadius: 18 },
      ],
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Linus activates at authored approach within accepted 18px arrival zone",
    playerPosition: { x: 230, y: 478 },
    interaction: {
      id: "village:linus",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [
        { anchor: { x: 230, y: 460 }, interactionRadius: 18 },
      ],
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Linus keeps approaching outside both accepted arrival zones",
    playerPosition: { x: 230, y: 479 },
    interaction: {
      id: "village:linus",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 230, y: 460 },
      interactionRadius: 95,
      activationZones: [
        { anchor: { x: 230, y: 460 }, interactionRadius: 18 },
      ],
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 230, y: 460 },
  },
  {
    name: "Village Henning activates at accepted 95px resident radius",
    playerPosition: { x: 95, y: 0 },
    interaction: {
      id: "village:henning",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 370, y: 468 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village Henning keeps approaching outside accepted 95px resident radius",
    playerPosition: { x: 96, y: 0 },
    interaction: {
      id: "village:henning",
      kind: "npc",
      anchor: { x: 0, y: 0 },
      approachPoint: { x: 370, y: 468 },
      interactionRadius: 95,
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 370, y: 468 },
  },
  {
    name: "Village construction attention activates within accepted 32px arrival radius",
    playerPosition: { x: 500, y: 532 },
    interaction: {
      id: "village:construction-attention:test",
      kind: "npc",
      anchor: { x: 500, y: 500 },
      approachPoint: { x: 500, y: 500 },
      interactionRadius: 32,
      marker: "npc-attention",
      enabled: true,
    },
    expectedStatus: "activate",
  },
  {
    name: "Village construction attention keeps approaching outside accepted arrival radius",
    playerPosition: { x: 500, y: 533 },
    interaction: {
      id: "village:construction-attention:test",
      kind: "npc",
      anchor: { x: 500, y: 500 },
      approachPoint: { x: 500, y: 500 },
      interactionRadius: 32,
      marker: "npc-attention",
      enabled: true,
    },
    expectedStatus: "approach",
    expectedTarget: { x: 500, y: 500 },
  },
];

for (const fixture of interactionFixtures) {
  const resolution = resolveInteraction(
    [fixture.interaction],
    { interactionId: fixture.interaction.id, requestedAt: fixture.interaction.anchor },
    fixture.playerPosition,
  );
  assert.equal(resolution.status, fixture.expectedStatus, fixture.name);
  if (fixture.expectedTarget) {
    assert.deepEqual(resolution.target, fixture.expectedTarget, fixture.name);
  }
}

const shellFixtures = [
  {
    name: "loading world hides global chrome",
    input: { worldReady: false, blockingOverlayVisible: false },
    expected: { mode: "loading", showHud: false, showProjectStatus: false },
  },
  {
    name: "blocking story overlay hides global chrome",
    input: { worldReady: true, blockingOverlayVisible: true },
    expected: { mode: "overlay", showHud: false, showProjectStatus: false },
  },
  {
    name: "playable world shows the same global chrome",
    input: { worldReady: true, blockingOverlayVisible: false },
    expected: { mode: "world", showHud: true, showProjectStatus: false },
  },
  {
    name: "contextual status never owns HUD visibility",
    input: { worldReady: true, blockingOverlayVisible: false, projectStatusAvailable: true },
    expected: { mode: "world", showHud: true, showProjectStatus: true },
  },
  {
    name: "debug harness does not render production chrome",
    input: { debug: true, worldReady: true, blockingOverlayVisible: false },
    expected: { mode: "debug", showHud: false, showProjectStatus: false },
  },
];

for (const fixture of shellFixtures) {
  assert.deepEqual(deriveGameUiShell(fixture.input), fixture.expected, fixture.name);
}

assert.equal(
  SYSTEM_ASSETS.brandLogo,
  "/assets/village/sysselcraft-logo.png",
  "Runtime 1.0 must reuse the accepted canonical SysselCraft logo",
);

const ids = new Set(CANONICAL_SYSTEMS.map((entry) => entry.id));
for (const id of Object.values(SYSTEM_COMPONENT_IDS)) {
  assert.ok(ids.has(id), `canonical system registry must register ${id}`);
}

const purchaseGateRegistration = CANONICAL_SYSTEMS.find(
  (entry) => entry.id === SYSTEM_COMPONENT_IDS.purchaseGate,
);
assert.equal(
  purchaseGateRegistration?.status,
  "canonical",
  "purchase gate must be canonical after gate, handoff and presentation convergence",
);

const interactableRegistration = CANONICAL_SYSTEMS.find(
  (entry) => entry.id === SYSTEM_COMPONENT_IDS.interactable,
);
assert.equal(
  interactableRegistration?.status,
  "canonical",
  "interactable must be canonical once Village and Lake share resolution, markers, input locking and priority contracts",
);

const act2PurchaseCatalogSource = fs.readFileSync(
  new URL("../src/game/act2PurchaseCatalog.ts", import.meta.url),
  "utf8",
);
assert.equal(
  act2PurchaseCatalogSource.includes("../backend/"),
  false,
  "Act 2 purchase presentation catalog must remain backend-independent",
);
assert.equal(
  act2PurchaseCatalogSource.toLowerCase().includes("supabase"),
  false,
  "Act 2 purchase presentation catalog must not own purchase transport",
);

const villageInteractionSource = fs.readFileSync(
  new URL("../src/game/createVillageGame.ts", import.meta.url),
  "utf8",
);
const lakeInteractionSource = fs.readFileSync(
  new URL("../src/game/createAct2LakeGame.ts", import.meta.url),
  "utf8",
);

for (const [label, source] of [
  ["Village", villageInteractionSource],
  ["Act 2 Lake", lakeInteractionSource],
]) {
  assert.ok(
    source.includes('from "../runtime/interaction/interactionContract"'),
    `${label} must consume the canonical Interaction contract`,
  );
  assert.ok(
    source.includes("resolveInteraction("),
    `${label} must resolve world interactions through the canonical resolver`,
  );
  assert.ok(
    source.includes("worldInputEnabled("),
    `${label} must consume canonical world-input locking`,
  );
  assert.ok(
    source.includes('from "../runtime/interaction/markerRenderer"'),
    `${label} must consume the canonical interaction marker renderer`,
  );
}
assert.ok(
  villageInteractionSource.includes("resolveInteractionPriority("),
  "Village mixed interaction arbitration must consume canonical priority resolution",
);

const shellSource = fs.readFileSync(new URL("../src/runtime/ui/GameUiShell.tsx", import.meta.url), "utf8");
assert.ok(
  shellSource.includes("SYSTEM_ASSETS.brandLogo"),
  "GameUiShell must resolve the brand logo through the Canonical System Registry",
);
assert.ok(
  !shellSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "GameUiShell must not hardcode the canonical logo path",
);
assert.ok(
  shellSource.includes('aria-label="Öppna SysselCraft-menyn"'),
  "Runtime 1.0 must preserve the accepted menu affordance",
);
assert.ok(
  shellSource.includes('aria-label="Resurser"'),
  "Runtime 1.0 must preserve the accepted resource HUD semantics",
);



const storyRegistry = createStoryRegistry([
  {
    id: "act2:cabin:01",
    chapterId: "act2",
    storylineId: "act2:cabin",
    title: "Stugan 1",
    body: ["Alve: Första raden.", "Barnet: Andra raden."],
    history: { mode: "after-storyline-complete" },
  },
  {
    id: "act2:cabin:02",
    chapterId: "act2",
    storylineId: "act2:cabin",
    title: "Stugan 2",
    body: ["Alve: Tredje raden."],
    history: { mode: "after-storyline-complete" },
  },
  {
    id: "act2:opening:01",
    chapterId: "act2",
    storylineId: "act2:opening",
    title: "Inledning",
    body: ["Barnet: Valpen?"],
    history: { mode: "after-beat-complete" },
  },
  {
    id: "act3:intro:01",
    chapterId: "act3",
    storylineId: "act3:intro",
    title: "På andra sidan",
    body: ["Barnet: Här är det nytt."],
    history: { mode: "after-storyline-complete" },
  },
]);

const hiddenHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:cabin:01"]),
  completedStorylineIds: new Set(),
});
assert.deepEqual(
  hiddenHistory.map(({ beat }) => beat.id),
  [],
  "storyline-gated beats must stay hidden until the whole storyline is complete",
);

const openingOnlyHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:opening:01"]),
  completedStorylineIds: new Set(),
});
assert.deepEqual(
  openingOnlyHistory.map(({ beat }) => beat.id),
  ["act2:opening:01"],
  "beat-level history policy must expose only the completed beat",
);

const completedCabinHistory = historyEntriesFor(storyRegistry, {
  completedBeatIds: new Set(["act2:cabin:01", "act2:cabin:02"]),
  completedStorylineIds: new Set(["act2:cabin"]),
});
assert.deepEqual(
  completedCabinHistory.map(({ beat }) => beat.id),
  ["act2:cabin:01", "act2:cabin:02"],
  "completed storyline must expose its registered beats in authored order",
);

const replay = resolveReplayRequest(
  storyRegistry,
  {
    completedBeatIds: new Set(["act2:cabin:01", "act2:cabin:02"]),
    completedStorylineIds: new Set(["act2:cabin"]),
  },
  { beatId: "act2:cabin:01", startLineIndex: 999 },
);
assert.equal(replay?.lineIndex, 1, "history replay must clamp line index without mutating progress");

assert.throws(
  () => createStoryRegistry([
    {
      id: "bad:01",
      chapterId: "act3",
      storylineId: "cabin",
      title: "Bad",
      body: ["Nope"],
      history: { mode: "never" },
    },
  ]),
  /must be chapter-qualified/,
  "storyline ids must be globally stable and chapter-qualified",
);


const expectedAct2BeatCount =
  ACT2_OPENING_BEATS.length + CABIN_CONTRIBUTION_BEATS.length
  + JETTY_CONTRIBUTION_BEATS.length + BOATHOUSE_CONTRIBUTION_BEATS.length
  + MOTORBOAT_CONTRIBUTION_BEATS.length + ACT2_FINALE_BEATS.length + 3;

assert.equal(ACT2_STORY_REGISTRY.beats.length, expectedAct2BeatCount, "Act 2 registry must contain every replayable legacy beat exactly once");

const emptyAct2 = createDefaultAct2RuntimeState();
assert.equal(historyEntriesFor(ACT2_STORY_REGISTRY, act2HistoryProgress(emptyAct2)).length, 0, "fresh Act 2 exposes no History");

const cabinDone = {
  ...emptyAct2,
  openingComplete: true,
  projects: {
    ...emptyAct2.projects,
    cabin: { contributions:16, visibleStage:4, consumedBeatIds:CABIN_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
};
const cabinDoneHistory = historyEntriesFor(ACT2_STORY_REGISTRY, act2HistoryProgress(cabinDone));
assert.equal(cabinDoneHistory.filter((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.opening).length, ACT2_OPENING_BEATS.length);
assert.equal(cabinDoneHistory.filter((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.cabin).length, CABIN_CONTRIBUTION_BEATS.length);
assert.equal(cabinDoneHistory.some((entry)=>entry.storylineId===ACT2_STORYLINE_IDS.dock), false, "unfinished Act 2 projects stay hidden");



function legacyAct2HistoryProjection(state) {
  const projected = [];
  if (state.openingComplete) {
    ACT2_OPENING_BEATS.forEach((beat,index)=>projected.push({
      group:"Inledning",
      id:`act2:opening:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  const sources = {
    cabin:["Stugan",CABIN_CONTRIBUTION_BEATS],
    dock:["Bryggan",JETTY_CONTRIBUTION_BEATS],
    boathouse:["Båthuset",BOATHOUSE_CONTRIBUTION_BEATS],
    motorboat:["Motorbåten",MOTORBOAT_CONTRIBUTION_BEATS],
  };
  for (const project of ["cabin","dock","boathouse","motorboat"]) {
    if (!state.projects[project].complete) continue;
    const [group,beats]=sources[project];
    beats.forEach((beat,index)=>projected.push({
      group,
      id:`act2:${project}:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  if (state.projects.dock.complete && state.jettyLifebuoyOwned) projected.push({
    group:"Bryggan", id:"act2:dock:lifebuoy", title:JETTY_LIFEBUOY_BEAT.title,
  });
  if (state.projects.boathouse.complete && state.boathouseSteeringWheelOwned) projected.push({
    group:"Båthuset", id:"act2:boathouse:steering-wheel", title:BOATHOUSE_STEERING_WHEEL_BEAT.title,
  });
  if (state.projects.dock.complete && state.consumedProjectCompletionIds.includes("dock:completion-reaction")) projected.push({
    group:"Bryggan", id:"act2:dock:completion-reaction", title:JETTY_COMPLETION_REACTION.title,
  });
  if (state.epilogueConsumed) {
    ACT2_FINALE_BEATS.forEach((beat,index)=>projected.push({
      group:"Finalen",
      id:`act2:finale:${String(index+1).padStart(2,"0")}`,
      title:beat.title,
    }));
  }
  return projected;
}

const historyGroupByStoryline = {
  [ACT2_STORYLINE_IDS.opening]:"Inledning",
  [ACT2_STORYLINE_IDS.cabin]:"Stugan",
  [ACT2_STORYLINE_IDS.dock]:"Bryggan",
  [ACT2_STORYLINE_IDS.boathouse]:"Båthuset",
  [ACT2_STORYLINE_IDS.motorboat]:"Motorbåten",
  [ACT2_STORYLINE_IDS.finale]:"Finalen",
};

function registryAct2HistoryProjection(state) {
  return historyEntriesFor(ACT2_STORY_REGISTRY,act2HistoryProgress(state)).map((entry)=>({
    group:historyGroupByStoryline[entry.storylineId],
    id:entry.beat.id,
    title:entry.beat.title,
  }));
}

function groupHistoryProjection(entries) {
  return entries.reduce((groups,entry)=>{
    let group=groups.find((candidate)=>candidate.label===entry.group);
    if(!group) {
      group={ label:entry.group, entries:[] };
      groups.push(group);
    }
    group.entries.push({ id:entry.id, title:entry.title });
    return groups;
  },[]);
}

function assertAct2HistoryParity(name,state) {
  assert.deepEqual(
    groupHistoryProjection(registryAct2HistoryProjection(state)),
    groupHistoryProjection(legacyAct2HistoryProjection(state)),
    `Act 2 History parity failed: ${name}`,
  );
}

assertAct2HistoryParity("fresh", emptyAct2);
assertAct2HistoryParity("opening + cabin complete", cabinDone);

const dockDone = {
  ...emptyAct2,
  projects:{
    ...emptyAct2.projects,
    dock:{ contributions:16, visibleStage:4, consumedBeatIds:JETTY_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  jettyLifebuoyOwned:true,
  consumedProjectCompletionIds:["dock:completion-reaction"],
};
assertAct2HistoryParity("dock special beats",dockDone);

const boathouseDone = {
  ...emptyAct2,
  projects:{
    ...emptyAct2.projects,
    boathouse:{ contributions:16, visibleStage:4, consumedBeatIds:BOATHOUSE_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  boathouseSteeringWheelOwned:true,
};
assertAct2HistoryParity("boathouse steering wheel",boathouseDone);

const fullyCompletedAct2 = {
  ...emptyAct2,
  openingComplete:true,
  projects:{
    cabin:{ contributions:16, visibleStage:4, consumedBeatIds:CABIN_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    dock:{ contributions:16, visibleStage:4, consumedBeatIds:JETTY_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    boathouse:{ contributions:16, visibleStage:4, consumedBeatIds:BOATHOUSE_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
    motorboat:{ contributions:16, visibleStage:4, consumedBeatIds:MOTORBOAT_CONTRIBUTION_BEATS.map((beat)=>beat.id), complete:true },
  },
  jettyLifebuoyOwned:true,
  boathouseSteeringWheelOwned:true,
  consumedProjectCompletionIds:["dock:completion-reaction"],
  epilogueConsumed:true,
};
assertAct2HistoryParity("fully completed Act 2",fullyCompletedAct2);



const act2RuntimeSource = fs.readFileSync(new URL("../src/components/Act2Runtime.tsx", import.meta.url), "utf8");
assert.ok(
  act2RuntimeSource.includes("parseAct2PurchaseProject(")
    && act2RuntimeSource.includes("act2PurchaseShopHref("),
  "Act 2 Lake must consume the canonical chapter purchase handoff adapter",
);
assert.ok(
  act2RuntimeSource.includes("act2ContributionBlockedByStoryGate(candidateState, candidateState.selectedProject)"),
  "Act 2 Alve turn-in visibility must consume canonical state-layer story-gate arbitration",
);
assert.equal(
  act2RuntimeSource.includes("const blockedByPurchase ="),
  false,
  "Act 2 UI must not retain parallel purchase-gate arbitration for Alve turn-in",
);
assert.equal(
  act2RuntimeSource.includes("const blockedByNaming ="),
  false,
  "Act 2 UI must not retain parallel naming-gate arbitration for Alve turn-in",
);
assert.ok(
  act2RuntimeSource.includes("<GameUiShell"),
  "Act 2 development runtime must consume the shared GameUiShell",
);
assert.ok(
  !act2RuntimeSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "Act 2 runtime must not hardcode the global brand asset once migrated to GameUiShell",
);
assert.ok(
  !act2RuntimeSource.includes('<header className="prototype-header act2-hud-input-shield"'),
  "Act 2 runtime must not keep a parallel legacy HUD implementation",
);



const villageRuntimeSource = fs.readFileSync(new URL("../src/components/VillagePrototype.tsx", import.meta.url), "utf8");
assert.ok(
  villageRuntimeSource.includes("parseAct2PurchaseProject(")
    && villageRuntimeSource.includes("act2ResumeHref("),
  "Village shop must consume the canonical Act 2 purchase handoff adapter",
);
assert.equal(
  villageRuntimeSource.includes('project !== "dock" && project !== "boathouse" && project !== "motorboat"'),
  false,
  "Village shop must not retain a parallel Act 2 purchase-project whitelist",
);
assert.ok(
  villageRuntimeSource.includes("<GameUiShell"),
  "Village development runtime must consume the shared GameUiShell",
);
assert.ok(
  !villageRuntimeSource.includes('src="/assets/village/sysselcraft-logo.png"'),
  "Village runtime must not hardcode the global brand asset once migrated to GameUiShell",
);
assert.ok(
  !villageRuntimeSource.includes('<header className="prototype-header">'),
  "Village runtime must not keep a parallel legacy HUD implementation",
);
assert.ok(
  villageRuntimeSource.includes("const villageBlockingOverlayVisible ="),
  "Village presentation must derive one blocking-overlay authority",
);
for (const stateName of ["dialogueOpen", "mainMenuOpen", "parentMenuOpen", "childPairingOpen", "roomOpen", "dogHomeOpen", "saveError"]) {
  assert.ok(
    villageRuntimeSource.includes(stateName),
    `Village blocking-overlay authority must account for ${stateName}`,
  );
}
assert.ok(
  !villageRuntimeSource.includes("setConstructionDialogueOpen"),
  "Village presentation must not manually toggle the retired construction-dialogue input lock",
);



const markerRendererSource = fs.readFileSync(new URL("../src/runtime/interaction/markerRenderer.ts", import.meta.url), "utf8");
const act2RuntimeStateSource = fs.readFileSync(new URL("../src/game/act2RuntimeState.ts", import.meta.url), "utf8");
assert.ok(
  act2RuntimeStateSource.includes("runSequentialMigrations(")
    && act2RuntimeStateSource.includes("ACT2_FINALE_SCHEMA_VERSION = 3"),
  "Act 2 finale compatibility must run through the shared save migration engine",
);
assert.equal(
  act2RuntimeStateSource.includes("const preEpilogueSchemaComplete ="),
  false,
  "Act 2 normalizer must not retain the old inline finale schema migration",
);
assert.equal(
  act2RuntimeStateSource.includes("const legacyFamilyComplete ="),
  false,
  "Act 2 normalizer must not retain the old family-finale compatibility branch",
);
assert.ok(
  act2RuntimeStateSource.includes("from: 2") && act2RuntimeStateSource.includes("to: 3"),
  "Act 2 family-finale compatibility must use the explicit schema migration",
);
const act2LakeSource = fs.readFileSync(new URL("../src/game/createAct2LakeGame.ts", import.meta.url), "utf8");
assert.ok(
  act2LakeSource.includes("worldViewportSize(")
    && act2LakeSource.includes("ACT2_WORLD.width"),
  "Act 2 Lake must consume the canonical World/Area viewport contract",
);
assert.ok(
  act2LakeSource.includes("backgroundColor: WORLD_CAMERA.backgroundColor"),
  "Act 2 Lake Phaser config must consume the canonical world background",
);
assert.ok(
  act2LakeSource.includes("worldInputEnabled({ enabled: requestedWorldInputEnabled"),
  "Act 2 Lake must consume the shared world-input authority",
);
assert.ok(
  act2LakeSource.includes("resolveDirectMovementIntent("),
  "Act 2 Lake must consume the shared World/Area movement-intent primitive",
);
assert.ok(
  act2LakeSource.includes("WORLD_CAMERA.followLerpX")
    && act2LakeSource.includes("worldCameraDeadzone(viewWidth)"),
  "Act 2 Lake must consume the shared World/Area camera contract",
);
assert.ok(
  act2LakeSource.includes("worldEntityDepth(this.player.y)")
    && act2LakeSource.includes("worldEntityDepth(this.dog.y)")
    && act2LakeSource.includes("worldEntityDepth(position.y)"),
  "Act 2 Lake dynamic entities must consume shared world depth ordering",
);
assert.ok(
  act2LakeSource.includes("update(_time: number, delta: number)"),
  "Act 2 Lake update loop must remain present for world-input parity coverage",
);
assert.ok(
  markerRendererSource.includes('options.kind === "quest-turn-in" ? "!" : "?"')
    && markerRendererSource.includes('options.kind === "npc-attention"'),
  "Interaction System must own the canonical quest-turn-in, quest-available and NPC-attention marker mapping",
);
assert.ok(
  act2LakeSource.includes('createInteractionMarker(this, {'),
  "Act 2 must consume the canonical interaction marker renderer",
);
assert.ok(
  !act2LakeSource.includes('const turnInBubble = this.add.circle'),
  "Act 2 must not keep a local turn-in marker implementation",
);



const villageGameSource = fs.readFileSync(new URL("../src/game/createVillageGame.ts", import.meta.url), "utf8");
assert.ok(
  villageGameSource.includes("worldViewportSize(parent.clientWidth, parent.clientHeight, WORLD_WIDTH)"),
  "Village must consume the canonical World/Area viewport contract",
);
assert.ok(
  villageGameSource.includes("backgroundColor: WORLD_CAMERA.backgroundColor"),
  "Village Phaser config must consume the canonical world background",
);
assert.ok(
  villageGameSource.includes("WORLD_CAMERA.followLerpX")
    && villageGameSource.includes("worldCameraDeadzone(viewWidth)"),
  "Village must consume the shared World/Area camera contract",
);
assert.ok(
  villageGameSource.includes("worldEntityDepth(this.player.y)")
    && villageGameSource.includes("worldEntityDepth(this.dog.y)")
    && villageGameSource.includes("worldEntityDepth(truck.y)"),
  "Village dynamic entities must consume shared world depth ordering",
);
assert.ok(
  villageGameSource.includes("setWorldInputEnabled: (enabled: boolean) => void"),
  "Village handle must expose the canonical world-input contract",
);
assert.ok(
  villageGameSource.includes("worldInputEnabled({"),
  "Village movement/input must consume the shared world-input authority",
);
assert.ok(
  villageGameSource.includes("private acceptsWorldInput()"),
  "Village object interactions must share one world-input guard",
);
assert.ok(
  !villageGameSource.includes("constructionDialogueOpen"),
  "Village Phaser runtime must not retain the retired local dialogue-lock flag",
);
assert.ok(
  !villageGameSource.includes("setConstructionDialogueOpen"),
  "Village Phaser handle must not expose the retired dialogue-lock setter",
);
assert.ok(
  villageGameSource.includes("private resolveLinusIntent()"),
  "Village must centralize Linus base interaction priority",
);
assert.equal(
  (villageGameSource.match(/const linusIntent = this\.resolveLinusIntent\(\);/g) ?? []).length,
  3,
  "All three Linus base pointer entrypoints must consume the shared priority decision",
);
assert.equal(
  (villageGameSource.match(/requestedConstruction\.attention\?\.resident === \"linus\"/g) ?? []).length,
  1,
  "Linus base priority must not duplicate construction-attention checks outside resolveLinusIntent",
);
assert.ok(
  villageGameSource.includes("private syncLinusPriorityMarkers()"),
  "Linus marker presentation must consume the same centralized priority",
);
assert.ok(
  !villageGameSource.includes("syncLinusStoryMarker"),
  "Legacy Linus story-only marker sync must remain retired",
);
assert.equal(
  (villageGameSource.match(/this\.linusStoryMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Linus story marker must have one canonical creation path",
);
assert.equal(
  (villageGameSource.match(/this\.linusQuestMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Linus quest marker must have one canonical creation path",
);
assert.ok(
  villageGameSource.includes('if (intent === "intro")'),
  "Linus priority marker sync must render onboarding attention only when intro wins",
);
assert.ok(
  villageGameSource.includes('if (intent === "quest-source")'),
  "Linus priority marker sync must render quest marker only when quest intent wins",
);
assert.ok(
  villageGameSource.includes("private resolveHenningIntent()"),
  "Village must centralize Henning base interaction priority",
);
assert.ok(
  villageGameSource.includes('id: "village:henning"') &&
    villageGameSource.includes("interactionRadius: HENNING_INTERACTION_RADIUS"),
  "Village Henning arrival must use shared interaction resolution",
);
assert.ok(
  villageGameSource.includes("const HENNING_INTERACTION_RADIUS = 95"),
  "Village Henning must preserve the accepted 95px interaction radius",
);
assert.ok(
  villageGameSource.includes('id: "village:sol"') &&
    villageGameSource.includes("interactionRadius: SOL_INTERACTION_RADIUS"),
  "Village Sol arrival must use shared interaction resolution",
);
assert.ok(
  villageGameSource.includes("const SOL_INTERACTION_RADIUS = 95"),
  "Village Sol must preserve the accepted 95px interaction radius",
);
assert.ok(
  villageGameSource.includes('const scenePointerTarget = resolveInteractionPriority(['),
  "Village scene-level pointer hits must use explicit shared arbitration",
);
for (const [id, priority] of [["ground", 10], ["henning", 20], ["shop", 30], ["linus", 40], ["recycling", 50]]) {
  assert.ok(
    villageGameSource.includes(`{ id: "${id}", priority: ${priority},`),
    `Village scene pointer target ${id} must retain priority ${priority}`,
  );
}
assert.equal(
  (villageGameSource.match(/const henningIntent = this\.resolveHenningIntent\(\);/g) ?? []).length,
  2,
  "Henning scene and sprite entrypoints must consume the same priority decision",
);
assert.equal(
  (villageGameSource.match(/requestedConstruction\.attention\?\.resident === \"henning\"/g) ?? []).length,
  1,
  "Henning base priority must not duplicate construction-attention checks outside resolveHenningIntent",
);
assert.ok(
  villageGameSource.includes("private syncHenningPriorityMarker()"),
  "Henning quest marker must consume the centralized priority decision",
);
assert.equal(
  (villageGameSource.match(/this\.henningQuestMarker = createInteractionMarker/g) ?? []).length,
  1,
  "Henning quest marker must have one canonical creation path",
);
assert.ok(
  villageGameSource.includes('{ id: "story-cta", priority: 30, enabled: this.introComplete && requestedSolTourStop === "linus" }'),
  "Linus priority must include Sol-tour story CTA after onboarding",
);
assert.ok(
  villageGameSource.includes('{ id: "story-cta", priority: 30, enabled: requestedSolTourStop === "bakery" }'),
  "Henning priority must include Sol-tour story CTA",
);
assert.ok(
  villageGameSource.includes("private syncSolTourMarker()"),
  "Sol-tour marker presentation must have one explicit synchronization path",
);
assert.ok(
  villageGameSource.includes('if (stop === "bakery" && this.resolveHenningIntent() !== "story-cta") return;'),
  "Bakery Sol-tour marker must render only when story CTA wins",
);
assert.ok(
  villageGameSource.includes('if (stop === "linus" && this.resolveLinusIntent() !== "story-cta") return;'),
  "Linus Sol-tour marker must render only when story CTA wins",
);
assert.ok(
  villageGameSource.includes('if (this.resolveHenningIntent() === "quest-source") callbacks.onQuestSourceInteract?.("bakery");'),
  "Henning arrival must route to quest callback only when quest intent still wins",
);
assert.ok(
  villageGameSource.includes('if (this.resolveLinusIntent() === "quest-source") callbacks.onQuestSourceInteract?.("linus");'),
  "Linus arrival must route to quest callback only when quest intent still wins",
);
assert.ok(
  villageGameSource.includes('id: "village:linus"')
    && villageGameSource.includes("interactionRadius: LINUS_INTERACTION_RADIUS")
    && villageGameSource.includes("activationZones: ["),
  "Village Linus arrival must use shared multi-zone interaction resolution",
);
assert.ok(
  villageGameSource.includes("const LINUS_INTERACTION_RADIUS = 95")
    && villageGameSource.includes("const LINUS_APPROACH_RADIUS = 18"),
  "Village Linus must preserve the accepted 95px resident and 18px authored-arrival radii",
);
assert.ok(
  villageGameSource.includes('id: "village:shop"')
    && villageGameSource.includes("anchor: SHOP_APPROACH")
    && villageGameSource.includes("activationZones: requestedShopOpen")
    && villageGameSource.includes("anchor: MIRA_APPROACH"),
  "Village Shop/Mira arrival must use shared multi-zone interaction resolution",
);
assert.ok(
  villageGameSource.includes("const SHOP_INTERACTION_RADIUS = 42"),
  "Village Shop/Mira must preserve the accepted 42px interaction radius",
);
assert.equal(
  villageGameSource.includes("const linusApproachReached ="),
  false,
  "Village Linus must not retain the legacy hand-written dual-distance arrival check",
);
assert.ok(
  villageGameSource.includes("this.residents.linus = this.linus;\n      this.syncLinusPriorityMarkers();"),
  "Linus marker arbitration must initialize immediately after the sprite exists",
);
assert.ok(
  villageGameSource.includes("resident.setPosition(attention.position.x, attention.position.y)") &&
    villageGameSource.includes("this.syncLinusPriorityMarkers();"),
  "Linus priority markers must resync when construction presentation moves a resident",
);
for (const markerOwner of [
  "this.linusStoryMarker = createInteractionMarker(this, {",
  "this.linusQuestMarker = createInteractionMarker(this, {",
  "this.henningQuestMarker = createInteractionMarker(this, {",
  "this.noticeboardMarker = createInteractionMarker(this, {",
  "this.attentionMarker = createInteractionMarker(this, {",
]) {
  assert.ok(
    villageGameSource.includes(markerOwner),
    `Village marker owner must use the canonical renderer: ${markerOwner}`,
  );
}
assert.ok(
  !villageGameSource.includes("fillCircle(0, 0, 27)"),
  "Village must not retain local quest badge drawing after marker migration",
);



assert.equal(
  (villageGameSource.match(/kind: "npc-attention"/g) ?? []).length,
  2,
  "Village story/NPC attention markers must use the canonical npc-attention renderer",
);
assert.ok(
  !villageGameSource.includes("fillRoundedRect(-29, -21, 58, 42, 14)"),
  "Village must not retain local story-attention bubble drawing",
);

console.log(`Runtime 1.0 parity slice PASS (${shellFixtures.length} shell fixtures + ${villagePointerTargetFixtures.length} pointer-target fixtures + ${linusPriorityFixtures.length} Linus-priority fixtures + ${henningPriorityFixtures.length} Henning-priority fixtures + ${worldDepthFixtures.length} depth fixtures + ${cameraDeadzoneFixtures.length} camera fixtures + ${directMovementFixtures.length} direct-movement fixtures + ${worldInputFixtures.length} world-input fixtures + ${interactionFixtures.length} interaction fixtures + story/history fixtures)`);
