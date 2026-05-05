import { z } from "zod";

const optionalString = z.string().trim().min(1).optional();

const envSchema = z
  .object({
    FIREBASE_API_KEY: z.string().trim().min(1),
    FIREBASE_APP_ID: optionalString,
    FIREBASE_AUTH_DOMAIN: optionalString,
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: optionalString,
    FIREBASE_AUTH_URI: optionalString,
    FIREBASE_CLIENT_EMAIL: optionalString,
    FIREBASE_CLIENT_ID: optionalString,
    FIREBASE_CLIENT_X509_CERT_URL: optionalString,
    FIREBASE_MEASUREMENT_ID: optionalString,
    FIREBASE_MESSAGING_SENDER_ID: optionalString,
    GOOGLE_GENERATIVE_AI_API_KEY: optionalString,
    FIREBASE_PRIVATE_KEY: optionalString,
    FIREBASE_PRIVATE_KEY_ID: optionalString,
    FIREBASE_PROJECT_ID: optionalString,
    FIREBASE_SERVICE_ACCOUNT_JSON: optionalString,
    FIREBASE_STORAGE_BUCKET: optionalString,
    FIREBASE_TOKEN_URI: optionalString,
    FIREBASE_UNIVERSE_DOMAIN: optionalString,
    PUBLIC_FIREBASE_API_KEY: optionalString,
    NEXT_PUBLIC_APP_URL: optionalString,
    STRIPE_SECRET_KEY: optionalString,
    STRIPE_WEBHOOK_SECRET: optionalString,
    STRIPE_PRICE_PRO_MONTHLY_ID: optionalString,
    STRIPE_PRICE_PRO_YEARLY_ID: optionalString,
    STRIPE_PRODUCT_PRO_ID: optionalString,
  })
  .superRefine((input, ctx) => {
    const hasServiceAccountJson = Boolean(input.FIREBASE_SERVICE_ACCOUNT_JSON);
    const hasDiscreteAdminConfig = Boolean(
      input.FIREBASE_PROJECT_ID &&
        input.FIREBASE_CLIENT_EMAIL &&
        input.FIREBASE_PRIVATE_KEY,
    );

    if (!hasServiceAccountJson && !hasDiscreteAdminConfig) {
      ctx.addIssue({
        code: "custom",
        message:
          "Configure FIREBASE_SERVICE_ACCOUNT_JSON ou o trio FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.",
        path: ["FIREBASE_SERVICE_ACCOUNT_JSON"],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

function getRuntimeEnvSource() {
  return typeof process !== "undefined"
    ? (process.env as Record<string, string | undefined>)
    : {};
}

export function parseEnv(input = getRuntimeEnvSource()) {
  return envSchema.parse({
    FIREBASE_API_KEY: input.FIREBASE_API_KEY,
    FIREBASE_APP_ID: input.FIREBASE_APP_ID,
    FIREBASE_AUTH_DOMAIN: input.FIREBASE_AUTH_DOMAIN,
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL:
      input.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_AUTH_URI: input.FIREBASE_AUTH_URI,
    FIREBASE_CLIENT_EMAIL: input.FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID: input.FIREBASE_CLIENT_ID,
    FIREBASE_CLIENT_X509_CERT_URL: input.FIREBASE_CLIENT_X509_CERT_URL,
    FIREBASE_MEASUREMENT_ID: input.FIREBASE_MEASUREMENT_ID,
    FIREBASE_MESSAGING_SENDER_ID: input.FIREBASE_MESSAGING_SENDER_ID,
    GOOGLE_GENERATIVE_AI_API_KEY: input.GOOGLE_GENERATIVE_AI_API_KEY,
    FIREBASE_PRIVATE_KEY: input.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_ID: input.FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_PROJECT_ID: input.FIREBASE_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT_JSON: input.FIREBASE_SERVICE_ACCOUNT_JSON,
    FIREBASE_STORAGE_BUCKET: input.FIREBASE_STORAGE_BUCKET,
    FIREBASE_TOKEN_URI: input.FIREBASE_TOKEN_URI,
    FIREBASE_UNIVERSE_DOMAIN: input.FIREBASE_UNIVERSE_DOMAIN,
    PUBLIC_FIREBASE_API_KEY: input.PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_APP_URL: input.NEXT_PUBLIC_APP_URL,
    STRIPE_SECRET_KEY: input.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: input.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_PRO_MONTHLY_ID: input.STRIPE_PRICE_PRO_MONTHLY_ID,
    STRIPE_PRICE_PRO_YEARLY_ID: input.STRIPE_PRICE_PRO_YEARLY_ID,
    STRIPE_PRODUCT_PRO_ID: input.STRIPE_PRODUCT_PRO_ID,
  });
}

export const env = parseEnv();

export { envSchema };
