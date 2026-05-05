"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email({
    error: "Insira um e-mail válido",
  }),
  name: z
    .string({
      error: "O nome é obrigatório",
    })
    .min(1, { error: "O nome é obrigatório" })
    .max(100, { error: "O nome deve ter no máximo 100 caracteres" }),
  password: z
    .string({
      error: "A senha é obrigatória",
    })
    .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
      error:
        "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais",
    }),
});

type Schema = z.infer<typeof schema>;

export function SignupForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  async function handleSignup(data: Schema) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error("Não foi possível realizar o cadastro", {
          description:
            result.error ??
            "Erro desconhecido, por favor tente novamente mais tarde",
        });
        return;
      }

      toast.success("Cadastro realizado com sucesso", {
        description: "Por favor, realize o login para acessar sua conta",
      });
    } catch (error) {
      toast.error("Não foi possível realizar o cadastro", {
        description: "Erro desconhecido, por favor tente novamente mais tarde",
      });
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border/70 bg-background/90 p-6 shadow-elegant backdrop-blur-sm sm:p-8">
      <div className="space-y-0">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Criar Conta
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Crie sua conta com nome, email e senha para acessar a area logada.
        </p>
      </div>

      <form
        className="mt-4 space-y-2"
        onSubmit={form.handleSubmit(handleSignup)}
      >
        <Field>
          <FieldContent className="gap-2">
            <FieldLabel>Nome</FieldLabel>
            <Input
              autoComplete="name"
              name="name"
              placeholder="João da Silva"
              required
              type="text"
              {...form.register("name")}
            />

            {form.formState.errors.email && (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            )}
          </FieldContent>
        </Field>

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
          {form.formState.isSubmitting ? "Criando..." : "Criar Conta"}
        </Button>
      </form>

      <div className="flex items-center gap-2 text-muted-foreground mt-2">
        <span className="text-xs">Já tem uma conta?</span>
        <Link
          href="/login"
          className="text-xs text-sky-700 underline underline-offset-2 hover:brightness-125"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
