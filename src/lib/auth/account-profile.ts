import { z } from "zod";

export const ACCOUNT_PROFILE_ERROR_MESSAGES = {
  default: "Não foi possível atualizar sua conta agora.",
  invalidAvatarUrl: "Digite uma URL válida para o avatar.",
  invalidEmail: "Digite um e-mail válido.",
  invalidName: "Digite um nome para continuar.",
} as const;

function isAppAvatarProxyPath(value: string) {
  return value.startsWith("/api/account/avatar");
}

function tryParseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function normalizeAvatarUrlInput(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  const parsedUrl = tryParseUrl(trimmedValue);

  if (!parsedUrl) {
    return trimmedValue;
  }

  const host = parsedUrl.hostname.replace(/^www\./, "");
  const embeddedImageUrl = parsedUrl.searchParams.get("imgurl");

  if (
    host === "google.com" &&
    parsedUrl.pathname === "/imgres" &&
    embeddedImageUrl
  ) {
    return embeddedImageUrl.trim();
  }

  return trimmedValue;
}

export const accountProfileInputSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, ACCOUNT_PROFILE_ERROR_MESSAGES.invalidName)
    .max(80, ACCOUNT_PROFILE_ERROR_MESSAGES.invalidName),
  email: z
    .string()
    .trim()
    .min(1, ACCOUNT_PROFILE_ERROR_MESSAGES.invalidEmail)
    .email(ACCOUNT_PROFILE_ERROR_MESSAGES.invalidEmail),
  photoURL: z
    .string()
    .transform(normalizeAvatarUrlInput)
    .refine(
      (value) =>
        value.length === 0 ||
        isAppAvatarProxyPath(value) ||
        z.url().safeParse(value).success,
      ACCOUNT_PROFILE_ERROR_MESSAGES.invalidAvatarUrl,
    ),
});

export type AccountProfileInput = z.infer<typeof accountProfileInputSchema>;

export function getAccountProfileInputErrorMessage(result: z.ZodError) {
  return result.issues[0]?.message ?? ACCOUNT_PROFILE_ERROR_MESSAGES.default;
}

export function buildAccountProfileUpdatePayload(input: AccountProfileInput) {
  return {
    displayName: input.displayName,
    email: input.email,
    photoURL: normalizeAvatarUrlInput(input.photoURL) || null,
  };
}
