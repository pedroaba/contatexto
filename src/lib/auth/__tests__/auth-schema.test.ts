import test from "node:test";
import assert from "node:assert/strict";

import {
  getAuthInputErrorMessage,
  loginInputSchema,
  signupInputSchema,
} from "../auth-schema.ts";
import { AUTH_ERROR_MESSAGES } from "../auth-utils.ts";

test("login schema trims email and accepts valid credentials", () => {
  const result = loginInputSchema.parse({
    email: "  user@example.com  ",
    password: "123456",
  });

  assert.equal(result.email, "user@example.com");
  assert.equal(result.password, "123456");
});

test("login schema rejects invalid email with user-friendly message", () => {
  const result = loginInputSchema.safeParse({
    email: "invalid-email",
    password: "123456",
  });

  assert.equal(result.success, false);

  if (!result.success) {
    assert.equal(
      getAuthInputErrorMessage(result.error),
      AUTH_ERROR_MESSAGES.invalidEmail,
    );
  }
});

test("signup schema rejects short passwords with user-friendly message", () => {
  const result = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "123",
  });

  assert.equal(result.success, false);

  if (!result.success) {
    assert.equal(
      getAuthInputErrorMessage(result.error),
      AUTH_ERROR_MESSAGES.weakPasswordLength,
    );
  }
});

test("signup schema requires name and trims it before submit", () => {
  const parsed = signupInputSchema.parse({
    name: "  Pedro Augusto  ",
    email: "user@example.com",
    password: "Senha123!",
  });

  assert.equal(parsed.name, "Pedro Augusto");

  const invalid = signupInputSchema.safeParse({
    name: "   ",
    email: "user@example.com",
    password: "Senha123!",
  });

  assert.equal(invalid.success, false);

  if (!invalid.success) {
    assert.equal(
      getAuthInputErrorMessage(invalid.error),
      AUTH_ERROR_MESSAGES.invalidName,
    );
  }
});

test("signup schema enforces password complexity rules", () => {
  const uppercase = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "senha123!",
  });
  assert.equal(uppercase.success, false);
  if (!uppercase.success) {
    assert.equal(
      getAuthInputErrorMessage(uppercase.error),
      AUTH_ERROR_MESSAGES.weakPasswordUppercase,
    );
  }

  const lowercase = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "SENHA123!",
  });
  assert.equal(lowercase.success, false);
  if (!lowercase.success) {
    assert.equal(
      getAuthInputErrorMessage(lowercase.error),
      AUTH_ERROR_MESSAGES.weakPasswordLowercase,
    );
  }

  const number = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "SenhaABC!",
  });
  assert.equal(number.success, false);
  if (!number.success) {
    assert.equal(
      getAuthInputErrorMessage(number.error),
      AUTH_ERROR_MESSAGES.weakPasswordNumber,
    );
  }

  const special = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "Senha1234",
  });
  assert.equal(special.success, false);
  if (!special.success) {
    assert.equal(
      getAuthInputErrorMessage(special.error),
      AUTH_ERROR_MESSAGES.weakPasswordSpecial,
    );
  }

  const invalidCharacters = signupInputSchema.safeParse({
    name: "Pedro",
    email: "user@example.com",
    password: "Senha_123!",
  });
  assert.equal(invalidCharacters.success, false);
  if (!invalidCharacters.success) {
    assert.equal(
      getAuthInputErrorMessage(invalidCharacters.error),
      AUTH_ERROR_MESSAGES.weakPasswordInvalidCharacters,
    );
  }
});
