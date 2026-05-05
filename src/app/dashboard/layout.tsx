import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayoutFrame } from "@/components/dashboard-layout-frame";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  return <DashboardLayoutFrame user={sessionUser}>{children}</DashboardLayoutFrame>;
}
