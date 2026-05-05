import "server-only";

import { getAuth } from "firebase-admin/auth";

import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin";
import type { UserPlan } from "@/lib/auth/user-plan";

export type BillingInterval = "month" | "year";

export interface BillingState {
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  interval: BillingInterval | null;
  plan: UserPlan;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
}

function getAuthClient() {
  return getAuth(getFirebaseAdminApp());
}

function parseBoolean(value: unknown) {
  return value === true;
}

function parseString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function parseInterval(value: unknown): BillingInterval | null {
  return value === "month" || value === "year" ? value : null;
}

export function resolveBillingState(claims: Record<string, unknown> | undefined): BillingState {
  return {
    cancelAtPeriodEnd: parseBoolean(claims?.cancelAtPeriodEnd),
    currentPeriodEnd: parseString(claims?.currentPeriodEnd),
    interval: parseInterval(claims?.billingInterval),
    plan: claims?.plan === "Pro" ? "Pro" : "Free",
    stripeCustomerId: parseString(claims?.stripeCustomerId),
    stripePriceId: parseString(claims?.stripePriceId),
    stripeSubscriptionId: parseString(claims?.stripeSubscriptionId),
    subscriptionStatus: parseString(claims?.subscriptionStatus),
  };
}

export async function upsertBillingState(
  uid: string,
  state: Partial<BillingState> & { plan: UserPlan },
) {
  const authClient = getAuthClient();
  const userRecord = await authClient.getUser(uid);
  const currentClaims = (userRecord.customClaims ?? {}) as Record<string, unknown>;

  const {
    billingInterval: _billingInterval,
    cancelAtPeriodEnd: _cancelAtPeriodEnd,
    currentPeriodEnd: _currentPeriodEnd,
    stripeCustomerId: _stripeCustomerId,
    stripePriceId: _stripePriceId,
    stripeSubscriptionId: _stripeSubscriptionId,
    subscriptionStatus: _subscriptionStatus,
    ...baseClaims
  } = currentClaims;

  const nextClaims: Record<string, unknown> = {
    ...baseClaims,
    plan: state.plan,
  };

  if (state.stripeCustomerId) {
    nextClaims.stripeCustomerId = state.stripeCustomerId;
  }

  if (state.stripePriceId) {
    nextClaims.stripePriceId = state.stripePriceId;
  }

  if (state.stripeSubscriptionId) {
    nextClaims.stripeSubscriptionId = state.stripeSubscriptionId;
  }

  if (state.subscriptionStatus) {
    nextClaims.subscriptionStatus = state.subscriptionStatus;
  }

  if (state.currentPeriodEnd) {
    nextClaims.currentPeriodEnd = state.currentPeriodEnd;
  }

  if (typeof state.cancelAtPeriodEnd === "boolean") {
    nextClaims.cancelAtPeriodEnd = state.cancelAtPeriodEnd;
  }

  if (state.interval) {
    nextClaims.billingInterval = state.interval;
  }

  await authClient.setCustomUserClaims(uid, nextClaims);
}

export async function findUidByEmail(email: string) {
  try {
    const userRecord = await getAuthClient().getUserByEmail(email);
    return userRecord.uid;
  } catch {
    return null;
  }
}
