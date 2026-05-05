import type { ReactNode } from "react";

import { AccountHeader } from "@/components/marketing/account-header";
import type { SessionUser } from "@/lib/auth/session";

interface AuthPageShellProps {
  children: ReactNode;
  currentPath?: string;
  eyebrow: string;
  helperText: string;
  sessionUser?: SessionUser | null;
  title: string;
  badges?: string[];
}

export async function AuthPageShell({
  children,
  currentPath = "/",
  eyebrow,
  helperText,
  sessionUser = null,
  title,
  badges = [],
}: AuthPageShellProps) {
  return (
    <>
      <AccountHeader currentPath={currentPath} sessionUser={sessionUser} />

      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-mesh">
        <div className="absolute inset-0 grid-pattern opacity-45" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_68%)]" />

        <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-6">
              <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </span>

              <div className="max-w-2xl space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {helperText}
                </p>
              </div>

              {badges.length > 0 && (
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {badges.map((badge) => {
                    return (
                      <span
                        key={badge}
                        className="rounded-full border border-border/80 bg-background/70 px-3 py-1 backdrop-blur-sm"
                      >
                        {badge}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">{children}</div>
          </div>
        </section>
      </main>
    </>
  );
}
