import { Preferences } from "@capacitor/preferences";
import type { QuestState } from "./createVillageGame";

const SAVE_KEY = "sysselcraft.save.v1";

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
    dogName: "",
    dogVisible: false,
    worldFlags: { firstDeliveryComplete: false },
  };
}

function isQuestState(value: unknown): value is QuestState {
  return value === "available" || value === "pending" || value === "approved";
}

function normalizeSaveState(value: unknown): SaveStateV1 | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SaveStateV1>;
  if (candidate.version !== 1) return null;

  const defaults = createDefaultSaveState();
  const makeBed = candidate.questStates?.makeBed;

  return {
    version: 1,
    questStates: {
      makeBed: isQuestState(makeBed) ? makeBed : defaults.questStates.makeBed,
    },
    diamonds:
      typeof candidate.diamonds === "number" && Number.isFinite(candidate.diamonds)
        ? Math.max(0, candidate.diamonds)
        : defaults.diamonds,
    sysselBux:
      typeof candidate.sysselBux === "number" && Number.isFinite(candidate.sysselBux)
        ? Math.max(0, candidate.sysselBux)
        : defaults.sysselBux,
    introComplete:
      typeof candidate.introComplete === "boolean"
        ? candidate.introComplete
        : defaults.introComplete,
    dialogueOpen:
      typeof candidate.dialogueOpen === "boolean"
        ? candidate.dialogueOpen
        : defaults.dialogueOpen,
    dialogueIndex:
      typeof candidate.dialogueIndex === "number" && Number.isInteger(candidate.dialogueIndex)
        ? Math.max(0, candidate.dialogueIndex)
        : defaults.dialogueIndex,
    dogName: typeof candidate.dogName === "string" ? candidate.dogName.slice(0, 18) : "",
    dogVisible:
      typeof candidate.dogVisible === "boolean" ? candidate.dogVisible : defaults.dogVisible,
    worldFlags: {
      firstDeliveryComplete:
        typeof candidate.worldFlags?.firstDeliveryComplete === "boolean"
          ? candidate.worldFlags.firstDeliveryComplete
          : makeBed === "approved",
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
