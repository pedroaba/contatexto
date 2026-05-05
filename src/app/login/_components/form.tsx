"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  email: z.email({
    message: "Email inválido",
  }),
  password: z.string({
    error: "A senha é obrigatória",
  }),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  async function handleLogin(data: z.infer<typeof schema>) {
    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error("Não foi possivel continuar", {
          description: payload.error ?? "Tente novamente em instantes.",
        });
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      toast.error("Falha de conexão", {
        description: "Não foi possivel se conectar ao servidor.",
      });
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border/70 bg-background/90 p-6 shadow-elegant backdrop-blur-sm sm:p-8">
      <div className="space-y-0">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Entrar
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Entre com email e senha para acessar seu dashboard.
        </p>
      </div>

      <form
        className="mt-4 space-y-2"
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <Field>
          <FieldContent className="gap-2">
            <FieldLabel>Email</FieldLabel>
            <Input
              autoComplete="email"
              name="email"
              placeholder="voce@empresa.com"
              required
              type="email"
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel>Senha</FieldLabel>
            <Input
              autoComplete="billing current-password webauthn"
              minLength={8}
              name="password"
              placeholder="Minimo 8 caracteres"
              required
              type="password"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner />}
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="flex items-center gap-2 text-muted-foreground mt-2">
        <span className="text-xs">Não tem uma conta?</span>
        <Link
          href="/signup"
          className="text-xs text-sky-700 underline underline-offset-2 hover:brightness-125"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}
