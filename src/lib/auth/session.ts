import "server-only";

import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

import {
  buildSessionCookieOptions,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/auth-utils.ts";
import { resolveBillingState } from "@/lib/auth/billing";
import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin.ts";
import { resolveUserPlan } from "@/lib/auth/user-plan.ts";

export interface SessionUser {
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  billingInterval: "month" | "year" | null;
  plan: "Free" | "Pro";
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
}

function getAuthClient() {
  return getAuth(getFirebaseAdminApp());
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function createUserSession(
  cookieStore: CookieStore,
  idToken: string,
  isProduction: boolean,
) {
  const expiresIn = SESSION_MAX_AGE_SECONDS * 1000;
  const sessionCookie = await getAuthClient().createSessionCookie(idToken, {
    expiresIn,
  });

  cookieStore.set(
    SESSION_COOKIE_NAME,
    sessionCookie,
    buildSessionCookieOptions(isProduction),
  );
}

export function clearUserSession(cookieStore: CookieStore, isProduction: boolean) {
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...buildSessionCookieOptions(isProduction),
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await getAuthClient().verifySessionCookie(
      sessionCookie,
      true,
    );
    const userRecord = await getAuthClient().getUser(decodedToken.uid);
    const billingState = resolveBillingState(userRecord.customClaims);

    return {
      cancelAtPeriodEnd: billingState.cancelAtPeriodEnd,
      currentPeriodEnd: billingState.currentPeriodEnd,
      displayName: userRecord.displayName ?? null,
      email: userRecord.email ?? decodedToken.email ?? null,
      emailVerified: userRecord.emailVerified,
      photoURL: userRecord.photoURL ?? null,
      plan: resolveUserPlan(
        userRecord.customClaims?.plan ?? decodedToken.plan ?? decodedToken.role,
      ),
      billingInterval: billingState.interval,
      stripeCustomerId: billingState.stripeCustomerId,
      stripePriceId: billingState.stripePriceId,
      stripeSubscriptionId: billingState.stripeSubscriptionId,
      subscriptionStatus: billingState.subscriptionStatus,
      uid: userRecord.uid,
    };
  } catch {
    return null;
  }
}
