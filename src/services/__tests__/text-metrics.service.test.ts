import test from "node:test";
import assert from "node:assert/strict";

import { TextMetricsService } from "../text-metrics.service.ts";

const service = new TextMetricsService();

test("returns zeroed metrics for empty text", () => {
  const result = service.analyze("");

  assert.equal(result.characters, 0);
  assert.equal(result.charactersWithoutSpaces, 0);
  assert.equal(result.words, 0);
  assert.equal(result.uniqueWords, 0);
  assert.equal(result.sentences, 0);
  assert.equal(result.paragraphs, 0);
  assert.equal(result.lines, 0);
  assert.equal(result.readingTimeSeconds, 0);
});

test("normalizes extra spaces when counting words and unique words", () => {
  const result = service.analyze("ola   mundo   ola");

  assert.equal(result.characters, 17);
  assert.equal(result.charactersWithoutSpaces, 11);
  assert.equal(result.words, 3);
  assert.equal(result.uniqueWords, 2);
});

test("counts lines and paragraphs independently", () => {
  const result = service.analyze("primeira linha\nsegunda linha\n\nterceiro bloco");

  assert.equal(result.lines, 4);
  assert.equal(result.paragraphs, 2);
});

test("counts simple sentences using common punctuation", () => {
  const result = service.analyze("Uma frase. Duas frases! Tres frases?");

  assert.equal(result.sentences, 3);
});

test("calculates reading time from a fixed words per minute rate", () => {
  const text = new Array(225).fill("palavra").join(" ");

  const result = service.analyze(text);

  assert.equal(result.words, 225);
  assert.equal(result.readingTimeSeconds, 60);
});
