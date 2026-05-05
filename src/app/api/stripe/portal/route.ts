import { getSessionUser } from "@/lib/auth/session";
import {
  createBillingPortalSession,
  getAppUrl,
  listCustomersByEmail,
} from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return Response.redirect(new URL("/login", request.url));
  }

  let customerId = sessionUser.stripeCustomerId;

  if (!customerId && sessionUser.email) {
    const customers = await listCustomersByEmail(sessionUser.email);
    customerId = customers.data[0]?.id ?? null;
  }

  if (!customerId) {
    return Response.redirect(new URL("/dashboard/billing", request.url));
  }

  const appUrl = getAppUrl();
  const portalSession = await createBillingPortalSession({
    customerId,
    returnUrl: `${appUrl}/dashboard/billing`,
  });

  return Response.redirect(portalSession.url);
}
