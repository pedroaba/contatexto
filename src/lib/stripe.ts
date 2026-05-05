import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/env";

const STRIPE_API_BASE_URL = "https://api.stripe.com/v1";

export class StripeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StripeApiError";
    this.status = status;
  }
}

interface StripeListResponse<T> {
  data: T[];
}

interface StripeCustomer {
  email: string | null;
  id: string;
  metadata?: Record<string, string>;
}

interface StripeCheckoutSession {
  customer: string | null;
  id: string;
  subscription: string | null;
  url: string | null;
}

interface StripePortalSession {
  url: string;
}

interface StripeSubscription {
  cancel_at_period_end: boolean;
  current_period_end: number;
  customer: string;
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

export interface StripeWebhookEvent<T = unknown> {
  data: {
    object: T;
  };
  type: string;
}

function getStripeSecretKey() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new StripeApiError("STRIPE_SECRET_KEY não configurada.", 500);
  }

  return env.STRIPE_SECRET_KEY;
}

function getStripeWebhookSecret() {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new StripeApiError("STRIPE_WEBHOOK_SECRET não configurada.", 500);
  }

  return env.STRIPE_WEBHOOK_SECRET;
}

function buildHeaders(contentType?: string) {
  return {
    Authorization: `Bearer ${getStripeSecretKey()}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

async function parseStripeResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | { error?: { message?: string } };

  if (!response.ok) {
    const errorBody =
      typeof body === "object" && body !== null && "error" in body
        ? (body as { error?: { message?: string } })
        : null;
    const message =
      errorBody?.error?.message
        ? errorBody.error.message
        : "Não foi possível concluir a operação no Stripe.";
    throw new StripeApiError(message, response.status);
  }

  return body as T;
}

export async function createCheckoutSession(input: {
  cancelUrl: string;
  customerEmail?: string | null;
  customerId?: string | null;
  firebaseUid: string;
  priceId: string;
  successUrl: string;
}) {
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("success_url", input.successUrl);
  form.set("cancel_url", input.cancelUrl);
  form.set("allow_promotion_codes", "true");
  form.set("client_reference_id", input.firebaseUid);
  form.set("line_items[0][price]", input.priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("metadata[firebaseUid]", input.firebaseUid);
  form.set("subscription_data[metadata][firebaseUid]", input.firebaseUid);

  if (input.customerId) {
    form.set("customer", input.customerId);
  } else if (input.customerEmail) {
    form.set("customer_email", input.customerEmail);
  }

  const response = await fetch(`${STRIPE_API_BASE_URL}/checkout/sessions`, {
    method: "POST",
    headers: buildHeaders("application/x-www-form-urlencoded"),
    body: form.toString(),
  });

  return parseStripeResponse<StripeCheckoutSession>(response);
}

export async function createBillingPortalSession(input: {
  customerId: string;
  returnUrl: string;
}) {
  const form = new URLSearchParams();
  form.set("customer", input.customerId);
  form.set("return_url", input.returnUrl);

  const response = await fetch(`${STRIPE_API_BASE_URL}/billing_portal/sessions`, {
    method: "POST",
    headers: buildHeaders("application/x-www-form-urlencoded"),
    body: form.toString(),
  });

  return parseStripeResponse<StripePortalSession>(response);
}

export async function listCustomersByEmail(email: string) {
  const params = new URLSearchParams({ email, limit: "1" });
  const response = await fetch(`${STRIPE_API_BASE_URL}/customers?${params.toString()}`, {
    headers: buildHeaders(),
    method: "GET",
  });

  return parseStripeResponse<StripeListResponse<StripeCustomer>>(response);
}

export async function getCustomer(customerId: string) {
  const response = await fetch(`${STRIPE_API_BASE_URL}/customers/${customerId}`, {
    headers: buildHeaders(),
    method: "GET",
  });

  return parseStripeResponse<StripeCustomer>(response);
}

export async function getSubscription(subscriptionId: string) {
  const response = await fetch(
    `${STRIPE_API_BASE_URL}/subscriptions/${subscriptionId}`,
    {
      headers: buildHeaders(),
      method: "GET",
    },
  );

  return parseStripeResponse<StripeSubscription>(response);
}

function hexToBuffer(value: string) {
  return Buffer.from(value, "hex");
}

export function verifyStripeWebhookSignature(payload: string, signature: string | null) {
  if (!signature) {
    throw new StripeApiError("Cabeçalho stripe-signature ausente.", 400);
  }

  const entries = signature.split(",").map((item) => item.trim());
  const timestamp = entries.find((item) => item.startsWith("t="))?.slice(2);
  const v1 = entries.find((item) => item.startsWith("v1="))?.slice(3);

  if (!timestamp || !v1) {
    throw new StripeApiError("Assinatura do webhook inválida.", 400);
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac("sha256", getStripeWebhookSecret())
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = hexToBuffer(expectedSignature);
  const receivedBuffer = hexToBuffer(v1);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new StripeApiError("Assinatura do webhook inválida.", 400);
  }
}

export function getAppUrl() {
  return env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getProPriceId(interval: "monthly" | "yearly") {
  if (interval === "yearly") {
    if (!env.STRIPE_PRICE_PRO_YEARLY_ID) {
      throw new StripeApiError("STRIPE_PRICE_PRO_YEARLY_ID não configurada.", 500);
    }

    return env.STRIPE_PRICE_PRO_YEARLY_ID;
  }

  if (!env.STRIPE_PRICE_PRO_MONTHLY_ID) {
    throw new StripeApiError("STRIPE_PRICE_PRO_MONTHLY_ID não configurada.", 500);
  }

  return env.STRIPE_PRICE_PRO_MONTHLY_ID;
}
