"use client";

import Image from "next/image";
import { SYSTEM_ASSETS } from "../systemRegistry";

export type GameUiMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  hidden?: boolean;
  disabled?: boolean;
};

export type GameUiShellProps = {
  visible: boolean;
  diamonds: number | string;
  sysselBux: number | string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  menuItems: readonly GameUiMenuItem[];
  resourceActions?: React.ReactNode;
  contextualActions?: React.ReactNode;
};

export function GameUiShell({
  visible,
  diamonds,
  sysselBux,
  menuOpen,
  onMenuToggle,
  menuItems,
  resourceActions,
  contextualActions,
}: GameUiShellProps) {
  if (!visible) return null;

  return (
    <header className="prototype-header game-ui-shell" aria-label="SysselCraft HUD">
      <div className="prototype-brand-row">
        <button
          className="prototype-brand-button"
          type="button"
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Öppna SysselCraft-menyn"
        >
          <Image
            className="prototype-brand-logo"
            src={SYSTEM_ASSETS.brandLogo}
            alt="SysselCraft"
            width={360}
            height={124}
            priority
          />
        </button>

        {menuOpen && (
          <div className="main-menu-popover" role="menu">
            {menuItems.filter((item) => !item.hidden).map((item) => (
              <button
                className="parent-menu-button"
                role="menuitem"
                type="button"
                key={item.id}
                disabled={item.disabled}
                onClick={item.onSelect}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {contextualActions}
      </div>

      <div className="resource-hud" aria-label="Resurser">
        {resourceActions}
        <strong>💎 {diamonds}</strong>
        <strong>🪙 {sysselBux}</strong>
      </div>
    </header>
  );
}
