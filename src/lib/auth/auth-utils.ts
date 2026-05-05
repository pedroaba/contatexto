export const SESSION_COOKIE_NAME = "__session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

export const AUTH_ERROR_MESSAGES = {
  default: "Nao foi possivel concluir a autenticacao. Tente novamente.",
  emailAlreadyInUse: "Este email ja esta em uso.",
  invalidCredentials: "Email ou senha invalidos.",
  invalidEmail: "Digite um email valido.",
  invalidName: "Digite seu nome para continuar.",
  missingFields: "Preencha email e senha para continuar.",
  weakPasswordLength: "A senha deve ter pelo menos 8 caracteres.",
  weakPasswordUppercase: "A senha deve ter pelo menos uma letra maiuscula.",
  weakPasswordLowercase: "A senha deve ter pelo menos uma letra minuscula.",
  weakPasswordNumber: "A senha deve ter pelo menos um numero.",
  weakPasswordSpecial:
    "A senha deve ter pelo menos um caractere especial.",
  weakPasswordInvalidCharacters:
    "A senha nao pode conter espacos nem underscore.",
} as const;

export function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

export function buildSessionCookieOptions(
  isProduction: boolean,
): {
  httpOnly: boolean;
  maxAge: number;
  path: string;
  sameSite: "lax";
  secure: boolean;
} {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  };
}

export function resolveAuthErrorMessage(code?: string) {
  switch (code) {
    case "EMAIL_EXISTS":
    case "auth/email-already-exists":
      return AUTH_ERROR_MESSAGES.emailAlreadyInUse;
    case "INVALID_EMAIL":
    case "auth/invalid-email":
      return AUTH_ERROR_MESSAGES.invalidEmail;
    case "INVALID_LOGIN_CREDENTIALS":
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return AUTH_ERROR_MESSAGES.invalidCredentials;
    case "WEAK_PASSWORD : Password should be at least 6 characters":
    case "auth/weak-password":
      return AUTH_ERROR_MESSAGES.weakPasswordLength;
    default:
      return AUTH_ERROR_MESSAGES.default;
  }
}
