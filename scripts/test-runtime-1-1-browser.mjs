import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

const loadDependency = createRequire(import.meta.url);
const { chromium } = loadDependency(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.RUNTIME_BROWSER_URL || "http://127.0.0.1:3000";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Use a local runtime test server only");

function read(path) {
  return fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
}

function loadTsModule(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected browser-fixture dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

const saveMigrations = loadTsModule("src/runtime/save/migrations.ts");
const progressionDelta = loadTsModule("src/runtime/progression/authoritativeDelta.ts");
const progressGate = loadTsModule("src/runtime/progression/progressGate.ts");
const progressTrack = loadTsModule("src/runtime/progression/progressTrack.ts");
const authoritativeTrack = loadTsModule("src/runtime/progression/authoritativeTrack.ts", {
  "./authoritativeDelta": progressionDelta,
  "./progressTrack": progressTrack,
});
const projectProgressEngine = loadTsModule("src/runtime/progression/projectProgressEngine.ts", {
  "./progressTrack": progressTrack,
  "./authoritativeTrack": authoritativeTrack,
});
const persistenceStub = {
  createChapterPersistenceHost: () => ({
    load: async () => { throw new Error("browser fixture does not perform persistence I/O"); },
    save: async () => undefined,
    clear: async () => undefined,
  }),
};
const act2 = loadTsModule("src/game/act2RuntimeState.ts", {
  "../runtime/save/chapterPersistence": persistenceStub,
  "../runtime/save/migrations": saveMigrations,
  "../runtime/progression/authoritativeDelta": progressionDelta,
  "../runtime/progression/progressGate": progressGate,
  "../runtime/progression/progressTrack": progressTrack,
  "../runtime/progression/authoritativeTrack": authoritativeTrack,
  "../runtime/progression/projectProgressEngine": projectProgressEngine,
});

const pad = (number) => String(number).padStart(2, "0");

function baseAct2State() {
  return {
    ...act2.prepareAct2ProductionEntry(act2.createDefaultAct2RuntimeState()),
    entered: true,
    openingComplete: true,
    bicycleSeen: true,
    alveIntroComplete: true,
    backendClaimBaseline: 0,
  };
}

function dockPurchaseGateState() {
  let state = act2.withSelectedProject(baseAct2State(), "dock");
  for (let number = 1; number <= 6; number += 1) {
    state = act2.withPresentedContribution(state, "dock", `dock:${pad(number)}`);
  }
  assert.equal(act2.jettyPurchaseRequired(state), true);
  return state;
}

function completeProject(state, project) {
  let current = act2.withSelectedProject(state, project);
  for (let number = 1; number <= 16; number += 1) {
    if (project === "dock" && act2.jettyPurchaseRequired(current)) {
      current = act2.withBackendStoryFlags(current, { act2JettyLifebuoyOwned: true });
    }
    if (project === "boathouse" && act2.boathousePurchaseRequired(current)) {
      current = act2.withBackendStoryFlags(current, { act2BoathouseSteeringWheelOwned: true });
    }
    if (project === "motorboat" && act2.motorboatPartsPurchaseRequired(current)) {
      current = act2.withBackendStoryFlags(current, { act2MotorboatPartsOwned: true });
    }
    if (project === "motorboat" && act2.motorboatNamingRequired(current)) {
      current = act2.withMotorboatName(current, "Browserbåten");
    }
    current = act2.withPresentedContribution(current, project, `${project}:${pad(number)}`);
  }
  if (act2.projectCompletionReactionPending(current, project)) {
    current = act2.consumeProjectCompletionReaction(current, project);
  }
  return current;
}

function completedAct2State() {
  let state = baseAct2State();
  for (const project of ["cabin", "dock", "boathouse", "motorboat"]) {
    state = completeProject(state, project);
  }
  while (act2.act2FinalePending(state)) state = act2.advanceAct2Finale(state);
  state = act2.normalizeAct2RuntimeState({ ...state, endCardSeen: true });
  assert.equal(state.act2Complete, true);
  assert.equal(state.endCardSeen, true);
  return state;
}

function idleWorldAct2State() {
  return act2.withSelectedProject(baseAct2State(), "cabin");
}

const completedAct2 = completedAct2State();
const gateAct2 = dockPurchaseGateState();
const idleAct2 = idleWorldAct2State();

const completedAct1 = {
  version: 1,
  progression: {
    orderEnvironment: 0,
    knowledgeCreativity: 0,
    wellbeingRoutine: 0,
    movementActivity: 0,
    community: 0,
  },
  diamonds: 0,
  sysselBux: 0,
  introComplete: true,
  dialogueOpen: false,
  dialogueIndex: 0,
  childName: "Browserbarnet",
  dogName: "Valpen",
  dogVisible: true,
  construction: {
    earned: { recycling: 0, bakery: 0, clinic: 0 },
    revealed: { recycling: 0, bakery: 0, clinic: 0 },
    pending: [],
    completedStoryBeats: [],
  },
  worldFlags: {
    firstDeliveryComplete: false,
    recyclingCenterStage: 0,
    henningArrivalSeen: false,
    miraArrivalSeen: false,
    bottleMessagePurchased: false,
    roomFootballRugOwned: false,
    roomFootballPosterOwned: false,
    roomComputerDeskOwned: false,
    roomTrophyShelfOwned: false,
    roomStringLightsOwned: false,
    roomAquariumOwned: false,
    dogHomeStage: 0,
    bottleMessageSent: false,
    solArrivalSeen: false,
    solTourBakerySeen: false,
    solTourShopSeen: false,
    solTourLinusSeen: false,
    solChoseToStay: false,
    clinicContinuityBaselineLocked: false,
    clinicCompletionSeen: true,
    act1ChapterFinaleSeen: true,
    act1EndCardSeen: true,
  },
};

async function enterAct3Chapter(page) {
  const intro = page.getByRole("dialog", { name: "Kapitel 3 · På andra sidan sjön", exact: true });
  await intro.waitFor();
  const button = intro.getByRole("button", { name: "Fortsätt", exact: true });
  await button.click();
  await page.getByText("På andra sidan sjön", { exact: true }).first().waitFor();
  await button.click();
  await intro.waitFor({ state: "hidden" });
  await page.getByRole("heading", { name: "På andra sidan sjön", exact: true }).waitFor();
}

async function setupPage(context, {
  act1 = completedAct1,
  act2State = null,
  pairedChildId = null,
} = {}) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      await route.continue();
    } else {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"message":"offline runtime browser test"}',
      });
    }
  });
  await page.addInitScript(({ act1Save, act2Save, childId }) => {
    if (act1Save) {
      localStorage.setItem("CapacitorStorage.sysselcraft.save.v1", JSON.stringify(act1Save));
    }
    if (childId) {
      localStorage.setItem("CapacitorStorage.sysselcraft.backend.childId", childId);
    }
    if (act2Save) {
      const key = childId
        ? `CapacitorStorage.sysselcraft.act2.runtime.v1.${childId}`
        : "CapacitorStorage.sysselcraft.act2.runtime.v1";
      localStorage.setItem(key, JSON.stringify(act2Save));
    }
  }, { act1Save: act1, act2Save: act2State, childId: pairedChildId });
  return { page, errors };
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE || undefined,
  headless: true,
});

try {
  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const { page, errors } = await setupPage(context, { act2State: act2.createDefaultAct2RuntimeState() });
    await page.goto(base + "/act2");
    await page.getByRole("button", { name: "Fortsätt", exact: true }).first().waitFor();
    assert.equal(await page.getByLabel("SysselCraft HUD").count(), 0, "Story overlay must hide the gameplay HUD");
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 Story overlay blocks HUD during Act 2 opening");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const { page, errors } = await setupPage(context, { act2State: idleAct2 });
    await page.goto(base + "/act2");
    await page.getByLabel("SysselCraft HUD").waitFor();
    await page.getByLabel("Sjön i Act 2").waitFor();
    await page.locator("canvas").waitFor();
    await page.keyboard.down("ArrowRight");
    await page.keyboard.up("ArrowRight");
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 world/HUD mounts with keyboard input after blockers clear");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const { page, errors } = await setupPage(context, { act2State: gateAct2 });
    await page.goto(base + "/?act2-purchase=dock");
    await page.getByRole("dialog", { name: "Miras lanthandel" }).waitFor();
    await page.getByText("Livboj till bryggan", { exact: true }).waitFor();
    await page.getByText("⭐ Behövs till Bryggan", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Gå tillbaka till berättelsen" }).click();
    await page.getByRole("dialog", { name: "Miras lanthandel" }).waitFor({ state: "hidden" });
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 Story Purchase handoff opens Mira and has a safe no-purchase exit");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const pairedChildId = "iphone-existing-child";
    const { page, errors } = await setupPage(context, {
      act2State: completedAct2,
      pairedChildId,
    });
    const act1Key = "CapacitorStorage.sysselcraft.save.v1";
    const act2Key = `CapacitorStorage.sysselcraft.act2.runtime.v1.${pairedChildId}`;
    await page.goto(base + "/act2");
    const act1BeforeTransition = await page.evaluate((key) => localStorage.getItem(key), act1Key);
    const act2BeforeTransition = await page.evaluate((key) => localStorage.getItem(key), act2Key);
    const nextChapter = page.getByRole("button", { name: "Till kapitel 3 →", exact: true });
    await nextChapter.waitFor();
    await nextChapter.click();
    await page.waitForURL("**/act3/");
    await enterAct3Chapter(page);
    await page.reload();
    await page.getByRole("heading", { name: "På andra sidan sjön", exact: true }).waitFor();
    assert.equal(
      await page.getByRole("dialog", { name: "Kapitel 3 · På andra sidan sjön", exact: true }).count(),
      0,
      "acknowledged Act 3 chapter intro must not replay after reload",
    );
    const act1AfterReload = await page.evaluate((key) => localStorage.getItem(key), act1Key);
    const act2AfterReload = await page.evaluate((key) => localStorage.getItem(key), act2Key);
    assert.equal(
      act1AfterReload,
      act1BeforeTransition,
      "existing Act 1 save bytes must survive paired-child Act 2 -> Act 3 update-in-place navigation",
    );
    assert.equal(
      act2AfterReload,
      act2BeforeTransition,
      "child-scoped Act 2 completion bytes must survive Act 3 reload unchanged",
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem("CapacitorStorage.sysselcraft.act2.runtime.v1")),
      null,
      "paired-child runtime must not leak completion state back into the unscoped legacy Act 2 key",
    );
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 paired-child update-in-place preserves Act 1 + scoped Act 2 across Act 3 reload");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const { page, errors } = await setupPage(context, { act2State: completedAct2 });
    await page.goto(base + "/act3");
    await enterAct3Chapter(page);
    await page.getByRole("button", { name: "← Tillbaka till sjön", exact: true }).click();
    await page.waitForURL("**/act2");
    await page.getByLabel("SysselCraft HUD").waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 Act 3 return control routes back to Act 2 lake runtime");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const { page, errors } = await setupPage(context, { act2State: completedAct2 });
    await page.goto(base + "/act3-test");
    await page.getByRole("heading", { name: "På andra sidan sjön", exact: true }).waitFor();
    await page.getByText("DEBUG · production UI", { exact: true }).waitFor();
    await page.getByText("✅ Chapter entry", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS Runtime 1.1 Act 3 uses the shared debug/acceptance harness in-browser");
    await context.close();
  }
} finally {
  await browser.close();
}
