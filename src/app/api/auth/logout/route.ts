import { cookies } from "next/headers";

import { clearUserSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  clearUserSession(cookieStore, process.env.NODE_ENV === "production");

  return new Response(null, {
    status: 204,
  });
}
