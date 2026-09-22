import assert from "node:assert/strict";
import { createQuestRequestGuard } from "../src/game/questRequestGuard.ts";

const guard = createQuestRequestGuard();
assert.equal(guard.isActive(), false);
guard.activate();

const first = guard.begin();
const second = guard.begin();
assert.equal(first(), false, "a newer refresh must invalidate an older response");
assert.equal(second(), true, "the newest refresh may publish");

guard.invalidate();
assert.equal(second(), false, "selection/auth invalidation must reject an in-flight response");

const beforeAction = guard.begin();
assert.equal(guard.startAction(), true);
assert.equal(beforeAction(), false, "a user action must invalidate an earlier background refresh");
assert.equal(guard.startAction(), false, "overlapping guarded actions must be rejected");
guard.finishAction();
assert.equal(guard.isBusy(), false);

const afterAction = guard.begin();
assert.equal(afterAction(), true);
guard.deactivate();
assert.equal(afterAction(), false, "unmount/sign-out must reject late responses");
assert.equal(guard.isActive(), false);

console.log("PASS: quest request guard rejects stale refreshes, invalidated selections and late unmount responses");
