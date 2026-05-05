import { getAuth } from "firebase-admin/auth";

import {
  accountProfileInputSchema,
  buildAccountProfileUpdatePayload,
  getAccountProfileInputErrorMessage,
} from "@/lib/auth/account-profile";
import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin";
import { getSessionUser } from "@/lib/auth/session";
import { resolveAuthErrorMessage } from "@/lib/auth/auth-utils";
import { json } from "@/utils/http";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = accountProfileInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return json(
        { error: getAccountProfileInputErrorMessage(parsedBody.error) },
        { status: 400 },
      );
    }

    const authClient = getAuth(getFirebaseAdminApp());
    const updatePayload = buildAccountProfileUpdatePayload(parsedBody.data);
    const userRecord = await authClient.updateUser(sessionUser.uid, updatePayload);

    return json(
      {
        user: {
          displayName: userRecord.displayName ?? null,
          email: userRecord.email ?? null,
          emailVerified: userRecord.emailVerified,
          photoURL: userRecord.photoURL ?? null,
          uid: userRecord.uid,
        },
      },
      { status: 200 },
    );
  } catch (error) {
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

    return json(
      { error: "Não foi possível atualizar sua conta agora." },
      { status: 500 },
    );
  }
}
