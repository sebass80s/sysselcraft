export const CHILD_PAIRING_OPEN_EVENT = "sysselcraft:child-pairing-open";

export function requestChildPairingOpen() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHILD_PAIRING_OPEN_EVENT));
}
