import { Preferences } from "@capacitor/preferences";

export const CHILD_BINDING_CHANGED = "sysselcraft:child-binding-changed";

const CHILD_ID_KEY = "sysselcraft.backend.childId";

function normalizeChildId(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed || null;
}

export async function getPairedChildId(): Promise<string | null> {
  const { value } = await Preferences.get({ key: CHILD_ID_KEY });
  const normalized = normalizeChildId(value);
  if (normalized) return normalized;

  // One-time migration from the first web-only pairing implementation.
  if (typeof window !== "undefined") {
    const legacy = normalizeChildId(window.localStorage.getItem(CHILD_ID_KEY));
    if (legacy) {
      await Preferences.set({ key: CHILD_ID_KEY, value: legacy });
      window.localStorage.removeItem(CHILD_ID_KEY);
      return legacy;
    }
  }

  return null;
}

export async function setPairedChildId(childId: string): Promise<void> {
  const normalized = normalizeChildId(childId);
  if (!normalized) throw new Error("Child id is required.");
  await Preferences.set({ key: CHILD_ID_KEY, value: normalized });
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHILD_BINDING_CHANGED));
}

export async function clearPairedChildId(): Promise<void> {
  await Preferences.remove({ key: CHILD_ID_KEY });
  if (typeof window !== "undefined") window.localStorage.removeItem(CHILD_ID_KEY);
}
