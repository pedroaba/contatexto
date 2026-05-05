import { redirect } from "next/navigation";

import { AuthCard } from "@/components/account/auth-card";
import { AuthPageShell } from "@/components/marketing/auth-page-shell";
import { StructuredData } from "@/components/structured-data";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { SignupForm } from "./_components/form";

export const metadata = buildMetadata({
  path: "/signup",
  title: "Criar conta",
  description: "Crie sua conta para acessar a area autenticada do TextoTools.",
});

export default async function SignupPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect("/dashboard");
  }

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/signup",
          title: "Criar conta",
          description:
            "Crie sua conta para acessar a area autenticada do TextoTools.",
        })}
      />

      <AuthPageShell
        currentPath="/signup"
        eyebrow="Sua conta"
        helperText="Crie sua conta para salvar textos, acompanhar análises e continuar melhorando seus conteúdos quando quiser."
        title="Organize seus textos em um só lugar."
        badges={[
          "Textos salvos",
          "Análises organizadas",
          "SEO e redes sociais",
        ]}
      >
        <SignupForm />
      </AuthPageShell>
    </>
  );
}
