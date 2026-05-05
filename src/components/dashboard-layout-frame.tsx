"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { SessionUser } from "@/lib/auth/session";
import {
  dashboardRouteMeta,
  type DashboardRoutePath,
} from "@/lib/dashboard-routes";

interface DashboardLayoutFrameProps {
  children: ReactNode;
  user: SessionUser;
}

export function DashboardLayoutFrame({
  children,
  user,
}: DashboardLayoutFrameProps) {
  const pathname = usePathname();
  const currentPath =
    (pathname in dashboardRouteMeta
      ? pathname
      : "/dashboard") as DashboardRoutePath;
  const route = dashboardRouteMeta[currentPath];

  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as CSSProperties
      }
    >
      <AppSidebar
        currentPath={currentPath}
        user={user}
        variant="inset"
      />
      <SidebarInset className="bg-background">
        <SiteHeader title={route.title} />
        <div className="flex flex-1 flex-col bg-background">
          <div className="@container/main flex flex-1 flex-col gap-2 rounded-lg">
            <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
