import { Preferences } from "@capacitor/preferences";

export type Act2Project = "cabin" | "dock" | "boathouse" | "motorboat";

export type Act2RuntimeState = {
  version: 1;
  entered: boolean;
  openingIndex: number;
  openingComplete: boolean;
  bicycleSeen: boolean;
  alveIntroIndex: number;
  alveIntroComplete: boolean;
  selectedProject: Exclude<Act2Project, "motorboat"> | null;
};

const KEY = "sysselcraft.act2.runtime.v1";

export function createDefaultAct2RuntimeState(): Act2RuntimeState {
  return {
    version: 1,
    entered: false,
    openingIndex: 0,
    openingComplete: false,
    bicycleSeen: false,
    alveIntroIndex: 0,
    alveIntroComplete: false,
    selectedProject: null,
  };
}

export function normalizeAct2RuntimeState(value: unknown): Act2RuntimeState {
  const defaults = createDefaultAct2RuntimeState();
  if (!value || typeof value !== "object") return defaults;
  const candidate = value as Partial<Act2RuntimeState>;
  const project = candidate.selectedProject;
  return {
    version: 1,
    entered: candidate.entered === true,
    openingIndex: Number.isInteger(candidate.openingIndex)
      ? Math.max(0, Math.min(4, candidate.openingIndex as number))
      : 0,
    openingComplete: candidate.openingComplete === true,
    bicycleSeen: candidate.bicycleSeen === true,
    alveIntroIndex: Number.isInteger(candidate.alveIntroIndex)
      ? Math.max(0, candidate.alveIntroIndex as number)
      : 0,
    alveIntroComplete: candidate.alveIntroComplete === true,
    selectedProject: project === "cabin" || project === "dock" || project === "boathouse"
      ? project
      : null,
  };
}

export async function loadAct2RuntimeState(): Promise<Act2RuntimeState> {
  const { value } = await Preferences.get({ key: KEY });
  if (!value) return createDefaultAct2RuntimeState();
  try {
    return normalizeAct2RuntimeState(JSON.parse(value));
  } catch {
    return createDefaultAct2RuntimeState();
  }
}

export async function saveAct2RuntimeState(state: Act2RuntimeState): Promise<void> {
  await Preferences.set({ key: KEY, value: JSON.stringify(normalizeAct2RuntimeState(state)) });
}
