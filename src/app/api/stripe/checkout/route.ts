import { getSessionUser } from "@/lib/auth/session";
import { createCheckoutSession, getAppUrl, getProPriceId } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (sessionUser.plan === "Pro") {
    return Response.redirect(new URL("/api/stripe/portal", request.url));
  }

  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval") === "yearly" ? "yearly" : "monthly";
  const appUrl = getAppUrl();
  const session = await createCheckoutSession({
    cancelUrl: `${appUrl}/pricing?checkout=canceled`,
    customerEmail: sessionUser.email,
    customerId: sessionUser.stripeCustomerId,
    firebaseUid: sessionUser.uid,
    priceId: getProPriceId(interval),
    successUrl: `${appUrl}/dashboard/billing?checkout=success`,
  });

  return Response.redirect(session.url ?? `${appUrl}/dashboard/billing`);
}
