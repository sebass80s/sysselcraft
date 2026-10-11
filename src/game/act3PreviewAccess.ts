/**
 * Temporary, child-facing spoiler gate for unfinished Act 3.
 *
 * This is deliberately NOT a security boundary. The passcode is static and
 * present in the client bundle. It only prevents accidental discovery by
 * children while the chapter is being developed.
 *
 * A launch grant is single-use and tab/WebView-session-scoped: going to /act3
 * directly does not work, and visiting again requires Vuxenläge → X.
 */
export const ACT3_PREVIEW_PASSWORD = "nova3";

const ACT3_PREVIEW_GRANT_KEY = "sysselcraft.act3.preview-entry.v1";

type PreviewGrantStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function grantAct3PreviewEntry(
  password: string,
  storage: PreviewGrantStorage,
): boolean {
  if (password.trim() !== ACT3_PREVIEW_PASSWORD) return false;
  try {
    storage.setItem(ACT3_PREVIEW_GRANT_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function consumeAct3PreviewEntry(storage: PreviewGrantStorage): boolean {
  try {
    const granted = storage.getItem(ACT3_PREVIEW_GRANT_KEY) === "1";
    storage.removeItem(ACT3_PREVIEW_GRANT_KEY);
    return granted;
  } catch {
    return false;
  }
}
