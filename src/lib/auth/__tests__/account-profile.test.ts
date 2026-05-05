import test from "node:test";
import assert from "node:assert/strict";

import {
  accountProfileInputSchema,
  buildAccountProfileUpdatePayload,
  getAccountProfileInputErrorMessage,
  normalizeAvatarUrlInput,
} from "../account-profile.ts";

test("account profile schema trims values and accepts optional avatar URL", () => {
  const result = accountProfileInputSchema.parse({
    displayName: "  Pedro Augusto  ",
    email: "  user@example.com  ",
    photoURL: "  https://example.com/avatar.png  ",
  });

  assert.equal(result.displayName, "Pedro Augusto");
  assert.equal(result.email, "user@example.com");
  assert.equal(result.photoURL, "https://example.com/avatar.png");
});

test("account profile schema accepts internal avatar proxy URLs", () => {
  const result = accountProfileInputSchema.parse({
    displayName: "Pedro Augusto",
    email: "user@example.com",
    photoURL: "/api/account/avatar?v=123&ext=png",
  });

  assert.equal(result.photoURL, "/api/account/avatar?v=123&ext=png");
});

test("account profile schema rejects invalid email and avatar URL", () => {
  const result = accountProfileInputSchema.safeParse({
    displayName: "Pedro",
    email: "email-invalido",
    photoURL: "not-a-url",
  });

  assert.equal(result.success, false);

  if (!result.success) {
    assert.match(getAccountProfileInputErrorMessage(result.error), /e-mail|avatar/i);
  }
});

test("buildAccountProfileUpdatePayload converts blank avatar to null", () => {
  const payload = buildAccountProfileUpdatePayload({
    displayName: "Pedro",
    email: "user@example.com",
    photoURL: "",
  });

  assert.deepEqual(payload, {
    displayName: "Pedro",
    email: "user@example.com",
    photoURL: null,
  });
});

test("normalizeAvatarUrlInput extracts direct image URL from google imgres links", () => {
  const result = normalizeAvatarUrlInput(
    "https://www.google.com/imgres?q=anime&imgurl=https%3A%2F%2Fplay-lh.googleusercontent.com%2FBIE1R3FVOpIoCPxkx3Erfuw5sVc5wVIbeHAcRuTUGesuvc1S1Cr6KYumGVbn7xABuLc&imgrefurl=https%3A%2F%2Fplay.google.com",
  );

  assert.equal(
    result,
    "https://play-lh.googleusercontent.com/BIE1R3FVOpIoCPxkx3Erfuw5sVc5wVIbeHAcRuTUGesuvc1S1Cr6KYumGVbn7xABuLc",
  );
});
