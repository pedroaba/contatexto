import test from "node:test";
import assert from "node:assert/strict";

import {
  ACCOUNT_AVATAR_ALLOWED_MIME_TYPES,
  ACCOUNT_AVATAR_MAX_BYTES,
  buildAbsoluteAccountAvatarUrl,
  buildAccountAvatarObjectPath,
  buildAccountAvatarProxyUrl,
  getAccountAvatarExtension,
  isSupportedAccountAvatarMimeType,
  validateAccountAvatarFile,
} from "../account-avatar.ts";

test("supports only expected avatar mime types", () => {
  assert.equal(isSupportedAccountAvatarMimeType("image/png"), true);
  assert.equal(isSupportedAccountAvatarMimeType("image/webp"), true);
  assert.equal(isSupportedAccountAvatarMimeType("application/pdf"), false);
  assert.deepEqual(ACCOUNT_AVATAR_ALLOWED_MIME_TYPES, [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);
});

test("maps avatar mime types to safe file extensions", () => {
  assert.equal(getAccountAvatarExtension("image/jpeg"), "jpg");
  assert.equal(getAccountAvatarExtension("image/png"), "png");
  assert.equal(getAccountAvatarExtension("image/webp"), "webp");
});

test("builds stable private storage path and proxy url", () => {
  assert.equal(
    buildAccountAvatarObjectPath("user-123", "image/png"),
    "avatars/user-123/avatar.png",
  );
  assert.equal(
    buildAccountAvatarProxyUrl(1714771200000),
    "/api/account/avatar?v=1714771200000",
  );
  assert.equal(
    buildAbsoluteAccountAvatarUrl(
      "https://textotools.com/dashboard/account",
      1714771200000,
      "png",
    ),
    "https://textotools.com/api/account/avatar?v=1714771200000&ext=png",
  );
});

test("validateAccountAvatarFile accepts supported images within size limit", () => {
  const result = validateAccountAvatarFile({
    size: 1024,
    type: "image/png",
  });

  assert.equal(result.ok, true);
});

test("validateAccountAvatarFile rejects unsupported mime type", () => {
  const result = validateAccountAvatarFile({
    size: 1024,
    type: "image/gif",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /PNG|JPG|WEBP/i);
  }
});

test("validateAccountAvatarFile rejects oversized images", () => {
  const result = validateAccountAvatarFile({
    size: ACCOUNT_AVATAR_MAX_BYTES + 1,
    type: "image/jpeg",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /5 MB/i);
  }
});
