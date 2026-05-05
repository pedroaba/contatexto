import { cookies } from "next/headers";

import {
  getAuthInputErrorMessage,
  loginInputSchema,
} from "@/lib/auth/auth-schema";
import {
  AUTH_ERROR_MESSAGES,
  resolveAuthErrorMessage,
} from "@/lib/auth/auth-utils";
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
    const parsedBody = loginInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return json(
        { error: getAuthInputErrorMessage(parsedBody.error) },
        { status: 400 },
      );
    }

    const { email, password } = parsedBody.data;
    const signInResult = await signInWithEmailAndPassword(email, password);
    const cookieStore = await cookies();

    await createUserSession(
      cookieStore,
      signInResult.idToken,
      process.env.NODE_ENV === "production",
    );

    return json({ ok: "true" }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return json(
        { error: AUTH_ERROR_MESSAGES.missingFields },
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
