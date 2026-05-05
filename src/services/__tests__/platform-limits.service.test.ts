import test from "node:test";
import assert from "node:assert/strict";

import { PlatformLimitsService } from "../platform-limits.service.ts";

const service = new PlatformLimitsService();

test("marks limits as good when comfortably below the maximum", () => {
  const [limit] = service.build(20);

  assert.equal(limit.status, "good");
  assert.equal(limit.current, 20);
  assert.equal(limit.percent, 33.33);
});

test("marks limits as warning when close to the maximum", () => {
  const [limit] = service.build(58);

  assert.equal(limit.status, "warning");
  assert.equal(limit.current, 58);
});

test("marks limits as danger when above the maximum", () => {
  const [limit] = service.build(80);

  assert.equal(limit.status, "danger");
  assert.equal(limit.current, 80);
  assert.equal(limit.percent, 100);
});
