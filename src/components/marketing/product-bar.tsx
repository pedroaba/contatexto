import { getSessionUser } from "@/lib/auth/session";

import { ProductBarClient } from "./product-bar-client";

export async function ProductBar() {
  const sessionUser = await getSessionUser();

  return <ProductBarClient isAuthenticated={Boolean(sessionUser)} />;
}
