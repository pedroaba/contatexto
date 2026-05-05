import { z } from "zod";

import { AUTH_ERROR_MESSAGES } from "./auth-utils.ts";

const authInputBaseSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, AUTH_ERROR_MESSAGES.missingFields)
    .email(AUTH_ERROR_MESSAGES.invalidEmail),
  password: z.string().min(1, AUTH_ERROR_MESSAGES.missingFields),
});

export const loginInputSchema = authInputBaseSchema;

export const signupInputSchema = authInputBaseSchema.extend({
  name: z
    .string()
    .trim()
    .min(1, AUTH_ERROR_MESSAGES.invalidName),
  password: z
    .string()
    .min(1, AUTH_ERROR_MESSAGES.missingFields)
    .min(8, AUTH_ERROR_MESSAGES.weakPasswordLength)
    .regex(/[A-Z]/, AUTH_ERROR_MESSAGES.weakPasswordUppercase)
    .regex(/[a-z]/, AUTH_ERROR_MESSAGES.weakPasswordLowercase)
    .regex(/[0-9]/, AUTH_ERROR_MESSAGES.weakPasswordNumber)
    .regex(/[^A-Za-z0-9\s_]/, AUTH_ERROR_MESSAGES.weakPasswordSpecial)
    .regex(/^[^\s_]+$/, AUTH_ERROR_MESSAGES.weakPasswordInvalidCharacters),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;

export function getAuthInputErrorMessage(result: z.ZodError) {
  return result.issues[0]?.message ?? AUTH_ERROR_MESSAGES.default;
}
