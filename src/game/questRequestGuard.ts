/** UI request lifetime only; backend remains authoritative for quests and rewards. */
export function createQuestRequestGuard() {
  let active = false;
  let generation = 0;
  let action = false;
  return {
    activate() { active = true; },
    deactivate() { active = false; generation++; },
    invalidate() { generation++; },
    isActive: () => active,
    isBusy: () => action,
    begin() {
      const ticket = ++generation;
      return () => active && ticket === generation;
    },
    startAction() {
      if (!active || action) return false;
      action = true;
      generation++; // An earlier poll must not undo the result of this action.
      return true;
    },
    finishAction() { action = false; },
  };
}
