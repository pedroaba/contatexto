import test from "node:test";
import assert from "node:assert/strict";

import { CounterService } from "../counter.service.ts";

const service = new CounterService();

test("returns summary, metrics, quality and platform limits from the input text", () => {
  const result = service.analyze("Uma frase.\n\nOutra frase.");

  assert.deepEqual(result.summary, {
    characters: 24,
    words: 4,
    sentences: 2,
  });

  assert.equal(result.metrics.length, 8);
  assert.equal(result.metrics[0]?.id, "characters");
  assert.equal(result.metrics[0]?.value, "24");
  assert.equal(result.metrics[1]?.id, "charactersWithoutSpaces");
  assert.equal(result.metrics[4]?.id, "sentences");
  assert.equal(result.metrics[7]?.id, "readingTime");
  assert.equal(result.quality.items.length, 4);
  assert.equal(result.quality.items[0]?.id, "readingTime");
  assert.equal(result.platformLimits.length, 5);
});
