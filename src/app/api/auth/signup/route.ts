import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

import {
  getAuthInputErrorMessage,
  signupInputSchema,
} from "@/lib/auth/auth-schema";
import {
  AUTH_ERROR_MESSAGES,
  resolveAuthErrorMessage,
} from "@/lib/auth/auth-utils";
import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin";
import {
  FirebaseAuthApiError,
  signInWithEmailAndPassword,
} from "@/lib/auth/firebase-rest";
import { createUserSession } from "@/lib/auth/session";
import { json } from "@/utils/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = signupInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return json(
        { error: getAuthInputErrorMessage(parsedBody.error) },
        { status: 400 },
      );
    }

    const { email, name, password } = parsedBody.data;

    await getAuth(getFirebaseAdminApp()).createUser({
      displayName: name,
      email,
      password,
    });

    const signInResult = await signInWithEmailAndPassword(email, password);
    const cookieStore = await cookies();

    await createUserSession(
      cookieStore,
      signInResult.idToken,
      process.env.NODE_ENV === "production",
    );

    return json({ ok: "true" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return json(
        { error: AUTH_ERROR_MESSAGES.missingFields },
        { status: 400 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
    ) {
      return json(
        { error: resolveAuthErrorMessage(error.code) },
        { status: 400 },
      );
    }

    if (error instanceof FirebaseAuthApiError) {
      return json(
        { error: resolveAuthErrorMessage(error.code) },
        { status: 401 },
      );
    }

    return json({ error: AUTH_ERROR_MESSAGES.default }, { status: 500 });
  }
}
