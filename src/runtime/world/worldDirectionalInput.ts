export type WorldInputKey = {
  isDown: boolean;
};

export type WorldCursorKeys = {
  up: WorldInputKey;
  down: WorldInputKey;
  left: WorldInputKey;
  right: WorldInputKey;
};

export type WorldWasdKeys = Record<"up" | "down" | "left" | "right", WorldInputKey>;

export type WorldKeyboardAdapter = {
  createCursorKeys: () => WorldCursorKeys;
  addKeys: (keys: { up: string; down: string; left: string; right: string }) => unknown;
};

export type WorldDirectionalInput = {
  cursors: WorldCursorKeys;
  wasd: WorldWasdKeys;
};

export type WorldDirectionState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export function createWorldDirectionalInput(
  keyboard: WorldKeyboardAdapter | null | undefined,
): WorldDirectionalInput | null {
  if (!keyboard) return null;
  return {
    cursors: keyboard.createCursorKeys(),
    wasd: keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" }) as WorldWasdKeys,
  };
}

export function readWorldDirection(
  input: WorldDirectionalInput | null | undefined,
): WorldDirectionState {
  return {
    up: Boolean(input?.cursors.up.isDown || input?.wasd.up.isDown),
    down: Boolean(input?.cursors.down.isDown || input?.wasd.down.isDown),
    left: Boolean(input?.cursors.left.isDown || input?.wasd.left.isDown),
    right: Boolean(input?.cursors.right.isDown || input?.wasd.right.isDown),
  };
}
