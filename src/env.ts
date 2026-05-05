import { z } from "zod";

const optionalString = z.string().trim().min(1).optional();

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalString,
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: optionalString,
});

export type Env = z.infer<typeof envSchema>;

function getRuntimeEnvSource() {
  return typeof process !== "undefined"
    ? (process.env as Record<string, string | undefined>)
    : {};
}

export function parseEnv(input = getRuntimeEnvSource()) {
  return envSchema.parse({
    NEXT_PUBLIC_APP_URL: input.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: input.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  });
}

export const env = parseEnv();

export { envSchema };
