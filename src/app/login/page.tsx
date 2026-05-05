import { redirect } from "next/navigation";

import { AuthCard } from "@/components/account/auth-card";
import { AuthPageShell } from "@/components/marketing/auth-page-shell";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "./_components/form";

export const metadata = buildMetadata({
  path: "/login",
  title: "Login",
  description:
    "Entre na sua conta para acessar a area autenticada do TextoTools.",
});

export default async function LoginPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect("/dashboard");
  }

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/login",
          title: "Login",
          description:
            "Entre na sua conta para acessar a area autenticada do TextoTools.",
        })}
      />
      <AuthPageShell
        currentPath="/login"
        eyebrow="Sua conta"
        helperText="Entre para acessar seus textos salvos, acompanhar suas análises e continuar melhorando seus conteúdos."
        title="Continue de onde parou."
        badges={["Textos salvos", "Análises recentes", "Tudo em um só lugar"]}
      >
        {/*<AuthCard mode="login" />*/}
        <LoginForm />
      </AuthPageShell>
    </>
  );
}
