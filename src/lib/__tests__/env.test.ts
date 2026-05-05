import test from "node:test";
import assert from "node:assert/strict";

async function loadEnvModule() {
  process.env.FIREBASE_API_KEY = "runtime-api-key";
  process.env.FIREBASE_CLIENT_EMAIL =
    "firebase-adminsdk@test.iam.gserviceaccount.com";
  process.env.FIREBASE_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\\nruntime\\n-----END PRIVATE KEY-----\\n";
  process.env.FIREBASE_PROJECT_ID = "runtime-project";

  return import("../../env.ts");
}

test("env schema accepts Firebase service account json as admin source", async () => {
  const { envSchema } = await loadEnvModule();
  const parsed = envSchema.parse({
    FIREBASE_API_KEY: "api-key",
    FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({
      client_email: "firebase-adminsdk@test.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
      project_id: "texttools-test",
    }),
  });

  assert.equal(parsed.FIREBASE_API_KEY, "api-key");
  assert.equal(typeof parsed.FIREBASE_SERVICE_ACCOUNT_JSON, "string");
});

test("env schema accepts discrete Firebase admin credentials", async () => {
  const { envSchema } = await loadEnvModule();
  const parsed = envSchema.parse({
    FIREBASE_API_KEY: "api-key",
    FIREBASE_CLIENT_EMAIL: "firebase-adminsdk@test.iam.gserviceaccount.com",
    FIREBASE_PRIVATE_KEY:
      "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
    FIREBASE_PROJECT_ID: "texttools-test",
  });

  assert.equal(parsed.FIREBASE_PROJECT_ID, "texttools-test");
});

test("env schema rejects config without admin credentials", async () => {
  const { envSchema } = await loadEnvModule();

  assert.throws(
    () =>
      envSchema.parse({
        FIREBASE_API_KEY: "api-key",
      }),
    /FIREBASE_SERVICE_ACCOUNT_JSON/,
  );
});
