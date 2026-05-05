"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { consumeFlashToast, saveFlashToast } from "@/lib/toast.ts";

interface AuthCardProps {
  mode: "login" | "signup";
}

const cardClassName =
  "w-full max-w-md rounded-3xl border border-border/70 bg-background/90 p-6 shadow-elegant backdrop-blur-sm sm:p-8";
const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

export function AuthCard({ mode }: AuthCardProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isLogin = mode === "login";

  React.useEffect(() => {
    const flashToast = consumeFlashToast();

    if (!flashToast) {
      return;
    }

    toast[flashToast.type](flashToast.title, {
      description: flashToast.description,
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch(
        isLogin ? "/api/auth/login" : "/api/auth/signup",
        {
          body: JSON.stringify(
            isLogin ? { email, password } : { name, email, password },
          ),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        },
      );

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error("Nao foi possivel continuar", {
          description: payload.error ?? "Tente novamente em instantes.",
        });
        return;
      }

      saveFlashToast({
        description: isLogin
          ? "Seu acesso foi validado com sucesso."
          : "Sua conta foi criada e a sessao ja esta ativa.",
        title: isLogin ? "Login realizado" : "Conta criada com sucesso",
        type: "success",
      });
      window.location.href = "/dashboard";
    } catch {
      toast.error("Falha de conexao", {
        description: "Nao foi possivel se conectar ao servidor.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cardClassName}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {isLogin ? "Entrar" : "Criar conta"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {isLogin
            ? "Entre com email e senha para acessar seu dashboard."
            : "Crie sua conta com nome, email e senha para acessar a area logada."}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {!isLogin ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Nome</span>
            <input
              autoComplete="name"
              className={inputClassName}
              name="name"
              placeholder="Seu nome"
              required
              type="text"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            autoComplete="email"
            className={inputClassName}
            name="email"
            placeholder="voce@empresa.com"
            required
            type="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Senha</span>
          <input
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputClassName}
            minLength={8}
            name="password"
            placeholder="Minimo 8 caracteres"
            required
            type="password"
          />
        </label>

        <Button
          className="h-12 w-full text-sm font-semibold"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Carregando..."
            : isLogin
              ? "Entrar na conta"
              : "Criar conta e continuar"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {isLogin ? "Ainda nao tem conta?" : "Ja possui uma conta?"}{" "}
        <a
          className="font-semibold text-primary hover:underline"
          href={isLogin ? "/signup" : "/login"}
        >
          {isLogin ? "Criar agora" : "Entrar"}
        </a>
      </p>
    </div>
  );
}
