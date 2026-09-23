"use client";

export type BackendWalletSnapshot = {
  diamonds: number;
  sysselBux: number;
  worldProgression?: number;
};

export const BACKEND_WALLET_EVENT = "sysselcraft:backend-wallet";

let latestWallet: BackendWalletSnapshot | null = null;

export function publishBackendWallet(wallet: BackendWalletSnapshot | null) {
  latestWallet = wallet;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BackendWalletSnapshot | null>(BACKEND_WALLET_EVENT, { detail: wallet }));
}

export function getLatestBackendWallet() {
  return latestWallet;
}
