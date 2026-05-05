import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SessionUser } from "@/lib/auth/session";
import {
  dashboardMainRoutes,
  dashboardSecondaryRoutes,
  type DashboardRoutePath,
} from "@/lib/dashboard-routes";

import Image from "next/image";
import LogoPng from "@/assets/logo.png";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPath: DashboardRoutePath;
  user: SessionUser;
}

export function AppSidebar({ currentPath, user, ...props }: AppSidebarProps) {
  const data = {
    navMain: dashboardMainRoutes,
    navSecondary: dashboardSecondaryRoutes,
    user: {
      avatar: user.photoURL ?? "",
      email: user.email ?? "Conta conectada",
      name: user.displayName?.trim() || user.email?.trim() || "Minha conta",
      plan: user.plan,
    },
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <Image src={LogoPng} alt="TextoTools" className="size-6!" />
              <span className="text-base font-semibold">TextoTools</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain currentPath={currentPath} items={data.navMain} />
        {data.navSecondary.length > 0 ? (
          <NavSecondary
            currentPath={currentPath}
            items={data.navSecondary}
            className="mt-auto"
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
