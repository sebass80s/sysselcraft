export type WorldPoint = {
  x: number;
  y: number;
};

type DirectionalInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type DirectMovementIntent = {
  direction: WorldPoint | null;
  clearTarget: boolean;
  targetReached: boolean;
};

function normalize(vector: WorldPoint): WorldPoint | null {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return null;
  return { x: vector.x / length, y: vector.y / length };
}

function directionalInputVector(input: DirectionalInput): WorldPoint {
  return {
    x: Number(input.right) - Number(input.left),
    y: Number(input.down) - Number(input.up),
  };
}

export function resolveDirectMovementIntent(
  input: DirectionalInput,
  playerPosition: WorldPoint,
  moveTarget: WorldPoint | null,
  arrivalRadius: number,
): DirectMovementIntent {
  const keyboardDirection = normalize(directionalInputVector(input));
  if (keyboardDirection) {
    return {
      direction: keyboardDirection,
      clearTarget: true,
      targetReached: false,
    };
  }

  if (!moveTarget) {
    return {
      direction: null,
      clearTarget: false,
      targetReached: false,
    };
  }

  const towardTarget = {
    x: moveTarget.x - playerPosition.x,
    y: moveTarget.y - playerPosition.y,
  };
  if (Math.hypot(towardTarget.x, towardTarget.y) < arrivalRadius) {
    return {
      direction: null,
      clearTarget: true,
      targetReached: true,
    };
  }

  return {
    direction: normalize(towardTarget),
    clearTarget: false,
    targetReached: false,
  };
}
