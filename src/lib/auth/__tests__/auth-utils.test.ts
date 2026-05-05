import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTH_ERROR_MESSAGES,
  buildSessionCookieOptions,
  normalizePrivateKey,
  resolveAuthErrorMessage,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "../auth-utils.ts";

test("normalizePrivateKey converts escaped newlines into real line breaks", () => {
  const normalized = normalizePrivateKey("line-1\\nline-2\\nline-3");

  assert.equal(normalized, "line-1\nline-2\nline-3");
});

test("buildSessionCookieOptions enables secure cookies only in production", () => {
  const developmentOptions = buildSessionCookieOptions(false);
  const productionOptions = buildSessionCookieOptions(true);

  assert.equal(developmentOptions.httpOnly, true);
  assert.equal(developmentOptions.sameSite, "lax");
  assert.equal(developmentOptions.secure, false);
  assert.equal(developmentOptions.path, "/");
  assert.equal(developmentOptions.maxAge, SESSION_MAX_AGE_SECONDS);

  assert.equal(productionOptions.secure, true);
});

test("resolveAuthErrorMessage maps known Firebase REST errors and falls back safely", () => {
  assert.equal(
    resolveAuthErrorMessage("INVALID_LOGIN_CREDENTIALS"),
    AUTH_ERROR_MESSAGES.invalidCredentials,
  );
  assert.equal(
    resolveAuthErrorMessage("EMAIL_EXISTS"),
    AUTH_ERROR_MESSAGES.emailAlreadyInUse,
  );
  assert.equal(
    resolveAuthErrorMessage("SOMETHING_ELSE"),
    AUTH_ERROR_MESSAGES.default,
  );
  assert.equal(SESSION_COOKIE_NAME, "__session");
});
