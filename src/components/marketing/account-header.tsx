import Image from "next/image";
import Link from "next/link";
import { ArrowRightToLine } from "lucide-react";

import { ModeToggle } from "@/components/toggle-mode";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth/session";

interface AccountHeaderProps {
  currentPath?: string;
  sessionUser?: SessionUser | null;
}

export function AccountHeader({
  currentPath = "/",
  sessionUser = null,
}: AccountHeaderProps) {
  const userLabel =
    sessionUser?.displayName?.trim() || sessionUser?.email?.trim() || "Minha conta";
  const avatarText = userLabel.charAt(0).toUpperCase();
  const isDashboard = currentPath === "/dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-muted px-4 py-4 sm:px-6">
      <Link className="flex items-center gap-2" href="/">
        <Image src="/logo.png" alt="Logo da aplicacao" width={32} height={32} />
        <span className="text-sm font-bold tracking-tight font-heading">TextoTools</span>
      </Link>

      {sessionUser ? (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              "hidden items-center gap-3 rounded-2xl border border-border/80 bg-background/80 px-3 py-2 text-left shadow-soft backdrop-blur-sm transition hover:border-primary/30 hover:bg-background/95 sm:flex",
              isDashboard ? "ring-2 ring-primary/15" : "",
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {avatarText}
            </span>

            <span className="flex flex-col leading-tight">
              <span className="max-w-44 truncate text-sm font-semibold text-foreground">
                {userLabel}
              </span>
              <span className="max-w-44 truncate text-xs text-muted-foreground">
                {sessionUser.email ?? "Area da conta"}
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-glow sm:hidden"
            aria-label="Abrir dashboard"
            title="Abrir dashboard"
          >
            {avatarText}
          </Link>

          <ModeToggle />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "text-foreground hover:no-underline hover:opacity-90",
              }),
            )}
          >
            <ArrowRightToLine className="size-3" />
            <span className="text-xs">Entrar</span>
          </Link>

          <Link
            href="/signup"
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "text-foreground hover:no-underline hover:opacity-90",
              }),
            )}
          >
            <span className="text-xs">Cadastrar-se</span>
          </Link>

          <ModeToggle />
        </div>
      )}
    </header>
  );
}
