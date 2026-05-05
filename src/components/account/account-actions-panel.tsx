"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RiArrowRightLine, RiBarChartBoxLine, RiLogoutBoxRLine, RiPriceTag3Line, RiQuestionLine } from "@remixicon/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/lib/auth/client-logout.ts";
import { consumeFlashToast } from "@/lib/toast.ts";

interface AccountActionsPanelProps {
  isPro: boolean;
}

export function AccountActionsPanel({ isPro }: AccountActionsPanelProps) {
  useEffect(() => {
    const flashToast = consumeFlashToast();

    if (!flashToast) {
      return;
    }

    toast[flashToast.type](flashToast.title, {
      description: flashToast.description,
    });
  }, []);

  return (
    <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <CardHeader className="px-6 py-5">
        <CardDescription>Ações</CardDescription>
        <CardTitle className="mt-1 text-xl">Gerenciar conta</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 px-6 pb-6">
        <Button
          render={<Link href="/dashboard/analyses" />}
          className="w-full justify-between rounded-xl"
          variant="outline"
        >
          <span className="inline-flex items-center gap-2">
            <RiBarChartBoxLine className="size-4" />
            Abrir análises
          </span>
          <RiArrowRightLine className="size-4" />
        </Button>

        <Button
          render={
            <Link href={isPro ? "/api/stripe/portal" : "/api/stripe/checkout?interval=monthly"} />
          }
          className="w-full justify-between rounded-xl"
          variant={isPro ? "outline" : "default"}
        >
          <span className="inline-flex items-center gap-2">
            <RiPriceTag3Line className="size-4" />
            {isPro ? "Gerenciar assinatura" : "Fazer upgrade"}
          </span>
          <RiArrowRightLine className="size-4" />
        </Button>

        <Button
          render={<Link href="/docs" />}
          className="w-full justify-between rounded-xl"
          variant="outline"
        >
          <span className="inline-flex items-center gap-2">
            <RiQuestionLine className="size-4" />
            Ver ajuda
          </span>
          <RiArrowRightLine className="size-4" />
        </Button>

        <Button
          className="w-full justify-between rounded-xl"
          onClick={() => void logoutUser()}
          variant="destructive"
        >
          <span className="inline-flex items-center gap-2">
            <RiLogoutBoxRLine className="size-4" />
            Sair da conta
          </span>
          <RiArrowRightLine className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
