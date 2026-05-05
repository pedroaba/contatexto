import { toast } from "sonner";

import { saveFlashToast } from "@/lib/toast.ts";

export async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    toast.error("Nao foi possivel sair", {
      description: "Tente novamente em instantes.",
    });
    return false;
  }

  saveFlashToast({
    description: "Sua sessao foi encerrada com sucesso.",
    title: "Logout realizado",
    type: "success",
  });

  window.location.href = "/login";
  return true;
}
