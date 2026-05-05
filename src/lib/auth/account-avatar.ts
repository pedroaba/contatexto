export const ACCOUNT_AVATAR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCOUNT_AVATAR_MAX_BYTES = 5 * 1024 * 1024;

const ACCOUNT_AVATAR_PROXY_PATH = "/api/account/avatar";

type SupportedAccountAvatarMimeType =
  (typeof ACCOUNT_AVATAR_ALLOWED_MIME_TYPES)[number];

const AVATAR_EXTENSION_BY_MIME_TYPE: Record<SupportedAccountAvatarMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isSupportedAccountAvatarMimeType(
  value: string,
): value is SupportedAccountAvatarMimeType {
  return ACCOUNT_AVATAR_ALLOWED_MIME_TYPES.includes(
    value as SupportedAccountAvatarMimeType,
  );
}

export function getAccountAvatarExtension(
  mimeType: SupportedAccountAvatarMimeType,
) {
  return AVATAR_EXTENSION_BY_MIME_TYPE[mimeType];
}

export function buildAccountAvatarObjectPath(
  userId: string,
  mimeType: SupportedAccountAvatarMimeType,
) {
  return `avatars/${userId}/avatar.${getAccountAvatarExtension(mimeType)}`;
}

export function buildAccountAvatarProxyUrl(version: number, ext?: string) {
  const searchParams = new URLSearchParams({
    v: String(version),
  });

  if (ext) {
    searchParams.set("ext", ext);
  }

  return `${ACCOUNT_AVATAR_PROXY_PATH}?${searchParams.toString()}`;
}

export function buildAbsoluteAccountAvatarUrl(
  requestUrl: string,
  version: number,
  ext?: string,
) {
  return new URL(buildAccountAvatarProxyUrl(version, ext), requestUrl).toString();
}

export function validateAccountAvatarFile(file: {
  size: number;
  type: string;
}) {
  if (!isSupportedAccountAvatarMimeType(file.type)) {
    return {
      ok: false as const,
      error: "Envie uma imagem PNG, JPG ou WEBP.",
    };
  }

  if (file.size > ACCOUNT_AVATAR_MAX_BYTES) {
    return {
      ok: false as const,
      error: "A imagem deve ter no máximo 5 MB.",
    };
  }

  return {
    ok: true as const,
  };
}
