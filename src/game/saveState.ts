import { Preferences } from "@capacitor/preferences";
import type { QuestState } from "./createVillageGame";
import { linusIntroDialogue } from "./dialogues";
import {
  applyQuestProgression,
  createEmptyProgression,
  makeBedQuest,
  type ProgressionKey,
  type ProgressionState,
  type QuestId,
} from "./quests";
import {
  normalizeRecyclingCenterStage,
  type RecyclingCenterStage,
} from "./worldProgression";

const SAVE_KEY = "sysselcraft.save.v1";
const CHILD_NAME_STEP = linusIntroDialogue.findIndex((step) => step.kind === "name-child");
const DOG_REVEAL_STEP = linusIntroDialogue.findIndex((step) => step.kind === "reveal-dog");
const LAST_DIALOGUE_STEP = Math.max(0, linusIntroDialogue.length - 1);
const PROGRESSION_KEYS: ProgressionKey[] = [
  "orderEnvironment",
  "knowledgeCreativity",
  "wellbeingRoutine",
  "movementActivity",
  "community",
];

let saveWriteQueue: Promise<void> = Promise.resolve();

export type SaveStateV1 = {
  version: 1;
  questStates: {
    makeBed: QuestState;
  };
  completedQuestIds: QuestId[];
  progression: ProgressionState;
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
    recyclingCenterStage: RecyclingCenterStage;
  };
};

export function createDefaultSaveState(): SaveStateV1 {
  return {
    version: 1,
    questStates: { makeBed: "available" },
    completedQuestIds: [],
    progression: createEmptyProgression(),
    diamonds: 0,
    sysselBux: 0,
    introComplete: false,
    dialogueOpen: false,
    dialogueIndex: 0,
    childName: "",
    dogName: "",
    dogVisible: false,
    worldFlags: {
      firstDeliveryComplete: false,
      recyclingCenterStage: 0,
    },
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

function normalizeProgression(value: unknown): ProgressionState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Record<ProgressionKey, unknown>>;
  const normalized = createEmptyProgression();

  for (const key of PROGRESSION_KEYS) {
    normalized[key] = normalizeNonNegativeNumber(candidate[key], 0);
  }

  return normalized;
}

function normalizeCompletedQuestIds(value: unknown): QuestId[] {
  if (!Array.isArray(value)) return [];
  return value.includes("makeBed") ? ["makeBed"] : [];
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

  let completedQuestIds = normalizeCompletedQuestIds(candidate.completedQuestIds);
  let progression = normalizeProgression(candidate.progression);

  // Older v1 saves predate hidden progression. Approval is authoritative and progression
  // cannot be spent, so it is safe to reconstruct the first quest exactly once.
  if (makeBed === "approved" && !completedQuestIds.includes(makeBedQuest.id)) {
    completedQuestIds = [makeBedQuest.id];
    if (!progression) progression = applyQuestProgression(createEmptyProgression(), makeBedQuest);
  }
  progression ??= createEmptyProgression();

  const recyclingCenterStage = normalizeRecyclingCenterStage(
    candidate.worldFlags?.recyclingCenterStage,
    progression,
  );

  let dialogueIndex =
    typeof candidate.dialogueIndex === "number" && Number.isInteger(candidate.dialogueIndex)
      ? Math.min(LAST_DIALOGUE_STEP, Math.max(0, candidate.dialogueIndex))
      : defaults.dialogueIndex;

  if (!childName && CHILD_NAME_STEP >= 0 && dialogueIndex > CHILD_NAME_STEP) {
    dialogueIndex = CHILD_NAME_STEP;
  }

  const questHasStarted = makeBed === "pending" || makeBed === "approved";
  const introComplete = questHasStarted
    ? true
    : typeof candidate.introComplete === "boolean"
      ? candidate.introComplete
      : defaults.introComplete;

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
    completedQuestIds,
    progression,
    diamonds: normalizeNonNegativeNumber(candidate.diamonds, defaults.diamonds),
    sysselBux: normalizeNonNegativeNumber(candidate.sysselBux, defaults.sysselBux),
    introComplete,
    dialogueOpen,
    dialogueIndex,
    childName,
    dogName,
    dogVisible,
    worldFlags: {
      firstDeliveryComplete: recyclingCenterStage >= 1,
      recyclingCenterStage,
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

export function saveSaveState(state: SaveStateV1): Promise<void> {
  const snapshot = JSON.stringify(state);
  saveWriteQueue = saveWriteQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        await Preferences.set({ key: SAVE_KEY, value: snapshot });
      } catch (error) {
        console.warn("Sysselcraft save could not be written", error);
      }
    });
  return saveWriteQueue;
}

export async function clearSaveState(): Promise<void> {
  try {
    await saveWriteQueue.catch(() => undefined);
    await Preferences.remove({ key: SAVE_KEY });
  } catch (error) {
    console.warn("Sysselcraft save could not be cleared", error);
    throw error;
  }
}
