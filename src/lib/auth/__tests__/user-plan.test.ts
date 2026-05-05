import test from "node:test";
import assert from "node:assert/strict";

import { resolveUserPlan } from "../user-plan.ts";

test("defaults unknown or missing plan claims to Free", () => {
  assert.equal(resolveUserPlan(undefined), "Free");
  assert.equal(resolveUserPlan("enterprise"), "Free");
});

test("accepts explicit Free and Pro claims", () => {
  assert.equal(resolveUserPlan("Free"), "Free");
  assert.equal(resolveUserPlan("free"), "Free");
  assert.equal(resolveUserPlan("PRO"), "Pro");
});
