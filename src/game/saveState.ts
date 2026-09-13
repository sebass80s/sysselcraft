import { Preferences } from "@capacitor/preferences";
import type { QuestState } from "./createVillageGame";
import { linusIntroDialogue } from "./dialogues";

const SAVE_KEY = "sysselcraft.save.v1";
const CHILD_NAME_STEP = linusIntroDialogue.findIndex((step) => step.kind === "name-child");
const DOG_REVEAL_STEP = linusIntroDialogue.findIndex((step) => step.kind === "reveal-dog");
const LAST_DIALOGUE_STEP = Math.max(0, linusIntroDialogue.length - 1);

export type SaveStateV1 = {
  version: 1;
  questStates: {
    makeBed: QuestState;
  };
  diamonds: number;
  sysselBux: number;
  introComplete: boolean;
  dialogueOpen: boolean;
  dialogueIndex: number;
  childName: string;
  dogName: string;
  dogVisible: boolean;
  worldFlags: {
    firstDeliveryComplete: boolean;
  };
};

export function createDefaultSaveState(): SaveStateV1 {
  return {
    version: 1,
    questStates: { makeBed: "available" },
    diamonds: 0,
    sysselBux: 0,
    introComplete: false,
    dialogueOpen: false,
    dialogueIndex: 0,
    childName: "",
    dogName: "",
    dogVisible: false,
    worldFlags: { firstDeliveryComplete: false },
  };
}

function isQuestState(value: unknown): value is QuestState {
  return value === "available" || value === "pending" || value === "approved";
}

function normalizeName(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 18) : "";
}

function normalizeNonNegativeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function normalizeSaveState(value: unknown): SaveStateV1 | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SaveStateV1>;
  if (candidate.version !== 1) return null;

  const defaults = createDefaultSaveState();
  const rawMakeBed = candidate.questStates?.makeBed;
  const makeBed = isQuestState(rawMakeBed) ? rawMakeBed : defaults.questStates.makeBed;
  const childName = normalizeName(candidate.childName);
  const dogName = normalizeName(candidate.dogName);

  let dialogueIndex =
    typeof candidate.dialogueIndex === "number" && Number.isInteger(candidate.dialogueIndex)
      ? Math.min(LAST_DIALOGUE_STEP, Math.max(0, candidate.dialogueIndex))
      : defaults.dialogueIndex;

  // A save cannot legitimately have passed the child-name prompt without a child name.
  if (!childName && CHILD_NAME_STEP >= 0 && dialogueIndex > CHILD_NAME_STEP) {
    dialogueIndex = CHILD_NAME_STEP;
  }

  // Once a quest has been submitted, the intro necessarily finished first.
  const questHasStarted = makeBed === "pending" || makeBed === "approved";
  const introComplete = questHasStarted
    ? true
    : typeof candidate.introComplete === "boolean"
      ? candidate.introComplete
      : defaults.introComplete;

  // Finished intro/active quest and an open intro dialogue are mutually exclusive.
  const dialogueOpen = introComplete
    ? false
    : typeof candidate.dialogueOpen === "boolean"
      ? candidate.dialogueOpen
      : defaults.dialogueOpen;

  const reachedDogReveal = DOG_REVEAL_STEP >= 0 && dialogueIndex > DOG_REVEAL_STEP;
  const dogVisible =
    introComplete ||
    Boolean(dogName) ||
    reachedDogReveal ||
    (typeof candidate.dogVisible === "boolean" ? candidate.dogVisible : defaults.dogVisible);

  return {
    version: 1,
    questStates: { makeBed },
    diamonds: normalizeNonNegativeNumber(candidate.diamonds, defaults.diamonds),
    sysselBux: normalizeNonNegativeNumber(candidate.sysselBux, defaults.sysselBux),
    introComplete,
    dialogueOpen,
    dialogueIndex,
    childName,
    dogName,
    dogVisible,
    worldFlags: {
      // The first delivery is the visible consequence of approving this quest.
      // Derive it from the authoritative quest state so stale flags cannot replay or erase it.
      firstDeliveryComplete: makeBed === "approved",
    },
  };
}

export async function loadSaveState(): Promise<SaveStateV1 | null> {
  try {
    const { value } = await Preferences.get({ key: SAVE_KEY });
    if (!value) return null;
    return normalizeSaveState(JSON.parse(value));
  } catch (error) {
    console.warn("Sysselcraft save could not be loaded", error);
    return null;
  }
}

export async function saveSaveState(state: SaveStateV1): Promise<void> {
  try {
    await Preferences.set({ key: SAVE_KEY, value: JSON.stringify(state) });
  } catch (error) {
    console.warn("Sysselcraft save could not be written", error);
  }
}

export async function clearSaveState(): Promise<void> {
  try {
    await Preferences.remove({ key: SAVE_KEY });
  } catch (error) {
    console.warn("Sysselcraft save could not be cleared", error);
    throw error;
  }
}
