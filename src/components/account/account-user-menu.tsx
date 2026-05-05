import * as React from "react";
import {
  RiArrowRightUpLine,
  RiLogoutBoxRLine,
  RiMoreFill,
  RiUserLine,
  RiVipCrownLine,
} from "@remixicon/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/auth/session.ts";
import { logoutUser } from "@/lib/auth/client-logout.ts";
import { UserAvatar } from "@/components/user-avatar";

interface AccountUserMenuProps {
  user: SessionUser;
}

interface AccountMenuActionListProps {
  className?: string;
}

function AccountMenuActionList({ className }: AccountMenuActionListProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleLogout() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await logoutUser();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={className}>
      <a
        className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/88 transition hover:bg-white/[0.04]"
        href="/dashboard/account"
      >
        <RiUserLine className="size-4" />
        <span>Account</span>
      </a>

      <a
        className="mt-1 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/88 transition hover:bg-white/[0.04]"
        href="/api/stripe/checkout?interval=monthly"
      >
        <RiVipCrownLine className="size-4" />
        <span>Upgrade plan</span>
        <span className="ml-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-white/55">
          Free
        </span>
      </a>

      <button
        className="mt-1 flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-[#ffb4b4] transition hover:bg-white/[0.04]"
        disabled={isSubmitting}
        onClick={() => void handleLogout()}
        type="button"
      >
        <RiLogoutBoxRLine className="size-4" />
        <span>{isSubmitting ? "Saindo..." : "Logout"}</span>
        <RiArrowRightUpLine className="ml-auto size-4 text-white/35" />
      </button>
    </div>
  );
}

export function AccountUserMenu({ user }: AccountUserMenuProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const displayName =
    user.displayName?.trim() || user.email?.trim() || "Minha conta";
  const emailLabel = user.email ?? "Conta conectada";
  const billingHref =
    user.plan === "Pro" ? "/api/stripe/portal" : "/api/stripe/checkout?interval=monthly";

  async function handleLogout() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await logoutUser();
    } finally {
      setIsSubmitting(false);
    }
  }

  function navigateTo(path: string) {
    window.location.href = path;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.06] px-3 py-3 text-left outline-none transition hover:bg-white/[0.09] data-[popup-open]:bg-white/[0.09]">
        <UserAvatar
          name={displayName}
          src={user.photoURL}
          className="size-10 bg-white"
          fallbackClassName="bg-white text-sm font-semibold text-black"
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">
            {displayName}
          </span>
          <span className="block truncate text-xs text-white/50">
            {emailLabel}
          </span>
        </span>

        <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60">
          <RiMoreFill className="size-4" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl border border-white/10 bg-[#151515] p-1.5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        side="top"
        sideOffset={10}
      >
        <div className="flex items-center gap-3 rounded-[1rem] px-3 py-3">
          <UserAvatar
            name={displayName}
            src={user.photoURL}
            className="size-12 bg-white"
            fallbackClassName="bg-white text-base font-semibold text-black"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-sm text-white/55">{emailLabel}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-sm text-white/88 focus:bg-white/[0.08] focus:text-white"
          onClick={() => navigateTo("/dashboard/account")}
        >
          <RiUserLine className="size-4" />
          <span>Account</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-sm text-white/88 focus:bg-white/[0.08] focus:text-white"
          onClick={() => navigateTo(billingHref)}
        >
          <RiVipCrownLine className="size-4" />
          <span>{user.plan === "Pro" ? "Manage billing" : "Upgrade plan"}</span>
          <span className="ml-auto inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-white/55">
            {user.plan}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-sm text-white/88 focus:bg-white/[0.08] focus:text-white"
          disabled={isSubmitting}
          onClick={() => void handleLogout()}
          variant="destructive"
        >
          <RiLogoutBoxRLine className="size-4" />
          <span>{isSubmitting ? "Saindo..." : "Logout"}</span>
          <RiArrowRightUpLine className="ml-auto size-4 text-white/35" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AccountMobileMenuActions() {
  return <AccountMenuActionList className="mt-3 border-t border-white/10 pt-3" />;
}
