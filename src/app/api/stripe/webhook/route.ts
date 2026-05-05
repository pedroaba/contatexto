import { getCustomer, getSubscription, verifyStripeWebhookSignature } from "@/lib/stripe";
import { findUidByEmail, upsertBillingState } from "@/lib/auth/billing";
import { json } from "@/utils/http";

export const runtime = "nodejs";

interface StripeCheckoutSessionPayload {
  client_reference_id?: string | null;
  customer: { id?: string | null } | string | null;
  customer_email?: string | null;
  metadata?: Record<string, string>;
  subscription: { id?: string | null } | string | null;
}

interface StripeSubscriptionPayload {
  cancel_at_period_end: boolean;
  current_period_end: number;
  customer: { id?: string | null; email?: string | null } | string;
  id: string;
  items?: {
    data?: Array<{
      price?: {
        id: string;
        recurring?: {
          interval?: "month" | "year";
        };
      };
    }>;
  };
  metadata?: Record<string, string>;
  status: string;
}

function toIsoDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toISOString();
}

function extractExpandableId(
  value: { id?: string | null } | string | null | undefined,
) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.id ?? null;
}

function resolvePlanFromStatus(status: string) {
  return ["active", "trialing", "past_due", "unpaid"].includes(status) ? "Pro" : "Free";
}

async function resolveUidFromCustomer(
  customerId: string,
  fallbackEmail?: string | null,
  metadataUid?: string | null,
) {
  if (metadataUid) {
    return metadataUid;
  }

  if (fallbackEmail) {
    const uidFromEmail = await findUidByEmail(fallbackEmail);

    if (uidFromEmail) {
      return uidFromEmail;
    }
  }

  const customer = await getCustomer(customerId);
  const uidFromMetadata = customer.metadata?.firebaseUid;

  if (uidFromMetadata) {
    return uidFromMetadata;
  }

  const email = customer.email ?? fallbackEmail ?? null;

  if (!email) {
    return null;
  }

  return findUidByEmail(email);
}

async function handleCheckoutCompleted(payload: StripeCheckoutSessionPayload) {
  const customerId = extractExpandableId(payload.customer);
  const subscriptionId = extractExpandableId(payload.subscription);
  const uid =
    payload.client_reference_id ??
    payload.metadata?.firebaseUid ??
    (payload.customer_email ? await findUidByEmail(payload.customer_email) : null);

  if (!uid) {
    return;
  }

  if (!customerId || !subscriptionId) {
    await upsertBillingState(uid, {
      plan: "Pro",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
    });
    return;
  }

  try {
    const subscription = await getSubscription(subscriptionId);
    const resolvedUid =
      (await resolveUidFromCustomer(
        customerId,
        payload.customer_email,
        payload.client_reference_id ??
          payload.metadata?.firebaseUid ??
          subscription.metadata?.firebaseUid ??
          null,
      )) ?? uid;

    await upsertBillingState(resolvedUid, {
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: toIsoDate(subscription.current_period_end),
      interval: subscription.items?.data?.[0]?.price?.recurring?.interval ?? null,
      plan: resolvePlanFromStatus(subscription.status),
      stripeCustomerId: customerId,
      stripePriceId: subscription.items?.data?.[0]?.price?.id ?? null,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    });
  } catch (error) {
    console.error("Stripe checkout completion fallback", error);

    await upsertBillingState(uid, {
      plan: "Pro",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
    });
  }
}

async function handleSubscriptionUpdated(payload: StripeSubscriptionPayload) {
  const customerId = extractExpandableId(payload.customer);

  if (!customerId) {
    return;
  }

  const uid = await resolveUidFromCustomer(
    customerId,
    null,
    payload.metadata?.firebaseUid ?? null,
  );

  if (!uid) {
    return;
  }

  await upsertBillingState(uid, {
    cancelAtPeriodEnd: payload.cancel_at_period_end,
    currentPeriodEnd: toIsoDate(payload.current_period_end),
    interval: payload.items?.data?.[0]?.price?.recurring?.interval ?? null,
    plan: resolvePlanFromStatus(payload.status),
    stripeCustomerId: customerId,
    stripePriceId: payload.items?.data?.[0]?.price?.id ?? null,
    stripeSubscriptionId: payload.id,
    subscriptionStatus: payload.status,
  });
}

export async function POST(request: Request) {
  const payload = await request.text();

  try {
    verifyStripeWebhookSignature(payload, request.headers.get("stripe-signature"));

    const event = JSON.parse(payload) as {
      data: { object: StripeCheckoutSessionPayload | StripeSubscriptionPayload };
      type: string;
    };

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as StripeCheckoutSessionPayload);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionUpdated(event.data.object as StripeSubscriptionPayload);
        break;
      default:
        break;
    }

    return json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error", error);

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível processar webhook Stripe.",
      },
      { status: 400 },
    );
  }
}
