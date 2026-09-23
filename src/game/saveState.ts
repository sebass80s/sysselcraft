import { initialConstruction, normalizeConstruction, syncConstructionProgression, type ConstructionState } from "./construction";
import { Preferences } from "@capacitor/preferences";
import { linusIntroDialogue } from "./dialogues";
import {
  applyQuestProgression,
  createDefaultQuestStates,
  createEmptyProgression,
  isQuestState,
  makeBedQuest,
  type ProgressionKey,
  type ProgressionState,
  type QuestId,
  type QuestStateMap,
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
  questStates: QuestStateMap;
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
  construction: ConstructionState;
  worldFlags: {
    firstDeliveryComplete: boolean;
    recyclingCenterStage: RecyclingCenterStage;
    henningArrivalSeen?: boolean;
    miraArrivalSeen?: boolean;
    bakeryClaimBaseline?: number;
    bakeryClaimBaselineStage?: 0 | 1 | 2 | 3 | 4;
  };
};

export function createDefaultSaveState(): SaveStateV1 {
  return {
    version: 1,
    questStates: createDefaultQuestStates(),
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
    construction: initialConstruction(),
    worldFlags: {
      firstDeliveryComplete: false,
      recyclingCenterStage: 0,
      henningArrivalSeen: false,
      miraArrivalSeen: false,
      bakeryClaimBaseline: undefined,
      bakeryClaimBaselineStage: undefined,
    },
  };
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

function normalizeQuestStates(value: unknown): QuestStateMap {
  const defaults = createDefaultQuestStates();
  if (!value || typeof value !== "object") return defaults;
  const candidate = value as Partial<Record<QuestId, unknown>>;
  return {
    makeBed: isQuestState(candidate.makeBed) ? candidate.makeBed : defaults.makeBed,
  };
}

export function normalizeSaveState(value: unknown): SaveStateV1 | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SaveStateV1>;
  if (candidate.version !== 1) return null;

  const defaults = createDefaultSaveState();
  const questStates = normalizeQuestStates(candidate.questStates);
  const makeBed = questStates.makeBed;
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

  const legacyRecyclingStage = normalizeRecyclingCenterStage(
    candidate.worldFlags?.recyclingCenterStage,
    progression,
  );

  // With construction state present, revealed is authoritative. The legacy earned-stage
  // field must never turn a new pending delivery into an already visible building.
  const construction = syncConstructionProgression(
    normalizeConstruction(candidate.construction, legacyRecyclingStage), progression,
  );
  const recyclingCenterStage = construction.revealed.recycling;

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
    questStates,
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
    construction,
    worldFlags: {
      firstDeliveryComplete: recyclingCenterStage >= 1,
      recyclingCenterStage,
      henningArrivalSeen: candidate.worldFlags?.henningArrivalSeen === true,
      miraArrivalSeen: candidate.worldFlags?.miraArrivalSeen === true,
      bakeryClaimBaseline: typeof candidate.worldFlags?.bakeryClaimBaseline === "number" && Number.isInteger(candidate.worldFlags.bakeryClaimBaseline) && candidate.worldFlags.bakeryClaimBaseline >= 0 ? candidate.worldFlags.bakeryClaimBaseline : undefined,
      bakeryClaimBaselineStage: [0, 1, 2, 3, 4].includes(candidate.worldFlags?.bakeryClaimBaselineStage as number) ? candidate.worldFlags?.bakeryClaimBaselineStage : undefined,
    },
  };
}

/** Keep legacy presentation flags consistent with the committed visible world. */
export function withConstructionState(state: SaveStateV1, construction: ConstructionState): SaveStateV1 {
  return { ...state, construction, worldFlags: {
    ...state.worldFlags,
    recyclingCenterStage: construction.revealed.recycling,
    firstDeliveryComplete: construction.revealed.recycling >= 1,
  } };
}

export async function loadSaveState(requireReadable = false): Promise<SaveStateV1 | null> {
  try {
    const { value } = await Preferences.get({ key: SAVE_KEY });
    if (value === null) return null;
    const saved = normalizeSaveState(JSON.parse(value));
    if (!saved && requireReadable) throw new Error("Unsupported local save format");
    return saved;
  } catch (error) {
    console.warn("Sysselcraft save could not be loaded", error);
    if (requireReadable) throw new Error("Sparningen kunde inte läsas. Inga nya framsteg sparas förrän den kan läsas igen.");
    return null;
  }
}

export function saveSaveState(state: SaveStateV1, requireSuccess = false): Promise<void> {
  const snapshot = JSON.stringify(state);
  saveWriteQueue = saveWriteQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        await Preferences.set({ key: SAVE_KEY, value: snapshot });
      } catch (error) {
        console.warn("Sysselcraft save could not be written", error);
        if (requireSuccess) throw error;
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
