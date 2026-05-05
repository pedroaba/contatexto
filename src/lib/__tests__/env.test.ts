import test from "node:test";
import assert from "node:assert/strict";

async function loadEnvModule() {
  process.env.NEXT_PUBLIC_APP_URL = "https://contatexto.com";
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

  return import("../../env.ts");
}

test("env schema accepts app URL and AdSense client ID", async () => {
  const { envSchema } = await loadEnvModule();
  const parsed = envSchema.parse({
    NEXT_PUBLIC_APP_URL: "https://contatexto.com",
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: "ca-pub-1111111111111111",
  });

  assert.equal(parsed.NEXT_PUBLIC_APP_URL, "https://contatexto.com");
  assert.equal(parsed.NEXT_PUBLIC_ADSENSE_CLIENT_ID, "ca-pub-1111111111111111");
});

test("env schema accepts optional empty config", async () => {
  const { envSchema } = await loadEnvModule();
  const parsed = envSchema.parse({});

  assert.equal(parsed.NEXT_PUBLIC_APP_URL, undefined);
});

test("env schema rejects invalid app URL type", async () => {
  const { envSchema } = await loadEnvModule();

  assert.throws(
    () =>
      envSchema.parse({
        NEXT_PUBLIC_APP_URL: 42 as unknown as string,
      }),
    /string/,
  );
});
