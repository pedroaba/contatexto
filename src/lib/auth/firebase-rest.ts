import { env } from "@/env.ts";

const FIREBASE_AUTH_BASE_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts";

export class FirebaseAuthApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "FirebaseAuthApiError";
    this.code = code;
  }
}

function getFirebaseApiKey() {
  return env.FIREBASE_API_KEY ?? env.PUBLIC_FIREBASE_API_KEY;
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const response = await fetch(
    `${FIREBASE_AUTH_BASE_URL}:signInWithPassword?key=${getFirebaseApiKey()}`,
    {
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    },
  );

  const payload = (await response.json()) as
    | {
        error?: {
          message?: string;
        };
      }
    | {
        email: string;
        idToken: string;
        localId: string;
      };

  if (!response.ok || !("idToken" in payload)) {
    const errorCode = "error" in payload ? payload.error?.message : undefined;

    throw new FirebaseAuthApiError(
      "Firebase Auth REST sign-in failed.",
      errorCode,
    );
  }

  return payload;
}
