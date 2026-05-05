import * as React from "react";
import { toast } from "sonner";

import type { SessionUser } from "@/lib/auth/session.ts";
import { consumeFlashToast } from "@/lib/toast.ts";

interface DashboardCardProps {
  user: SessionUser;
}

export function DashboardCard({ user }: DashboardCardProps) {
  React.useEffect(() => {
    const flashToast = consumeFlashToast();

    if (!flashToast) {
      return;
    }

    toast[flashToast.type](flashToast.title, {
      description: flashToast.description,
    });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-[#1a1a1a] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-medium text-white/55">Dados do usuario</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Sua conta
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Voce esta logado e sua sessao esta ativa.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="text-sm text-white/50">Nome</span>
            <span className="text-right text-sm font-medium text-white">
              {user.displayName ?? "Nao definido"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="text-sm text-white/50">Email</span>
            <span className="break-all text-right text-sm font-medium text-white">
              {user.email ?? "Nao informado"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="text-sm text-white/50">UID</span>
            <span className="break-all text-right text-sm font-medium text-white">
              {user.uid}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <span className="text-sm text-white/50">Verificacao</span>
            <span className="text-right text-sm font-medium text-white">
              {user.emailVerified ? "Email verificado" : "Pendente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
