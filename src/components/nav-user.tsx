"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  RiArrowRightUpLine,
  RiLogoutBoxLine,
  RiMore2Line,
  RiPriceTag3Line,
  RiUserLine,
} from "@remixicon/react";

import { logoutUser } from "@/lib/auth/client-logout.ts";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import type { UserPlan } from "@/services/analysis.types.ts";
import { UserAvatar } from "@/components/user-avatar";

export function NavUser({
  user,
}: {
  user: {
    avatar: string;
    email: string;
    name: string;
    plan: UserPlan;
  };
}) {
  const { isMobile } = useSidebar();
  const [isLogoutting, startLogout] = useTransition();

  const router = useRouter();
  async function handleLogout() {
    startLogout(async () => {
      await logoutUser();
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <UserAvatar
              name={user.name}
              src={user.avatar}
              className="size-8 rounded-lg grayscale"
              imageClassName="rounded-lg"
              fallbackClassName="rounded-lg"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <RiMore2Line className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar
                    name={user.name}
                    src={user.avatar}
                    className="size-8 rounded-lg"
                    imageClassName="rounded-lg"
                    fallbackClassName="rounded-lg"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/account")}
              >
                <RiUserLine />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/billing")}
              >
                <RiPriceTag3Line />
                Cobranca
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    user.plan === "Pro"
                      ? "/api/stripe/portal"
                      : "/api/stripe/checkout?interval=monthly",
                  )
                }
              >
                <RiPriceTag3Line />
                {user.plan === "Pro" ? "Gerenciar assinatura" : "Upgrade plan"}
                <Badge className="ml-auto">{user.plan}</Badge>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLogoutting}
              onClick={() => void handleLogout()}
            >
              <RiLogoutBoxLine />
              {isLogoutting ? "Saindo..." : "Logout"}
              <RiArrowRightUpLine className="ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
