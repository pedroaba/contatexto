import { Footer } from "@/components/marketing/footer";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/terms",
  title: "Termos de Uso",
  description:
    "Leia os Termos de Uso do ContaTexto para entender regras, limites, responsabilidades e condicoes gerais da plataforma.",
  keywords: [
    "termos de uso contatexto",
    "contador de caracteres",
    "termos",
    "plataforma de texto",
  ],
});

const sections = [
  {
    title: "Uso da plataforma",
    body: "O ContaTexto foi criado para apoiar fluxos legítimos de escrita, revisão, contagem de caracteres, contagem de palavras e análise textual. O uso da plataforma deve respeitar a legislação aplicável e não pode comprometer a segurança, estabilidade ou disponibilidade do serviço.",
  },
  {
    title: "Conteúdo enviado pelo usuário",
    body: "Você continua responsável pelo conteúdo que escrever, colar, revisar ou processar na ferramenta. Isso inclui garantir que possui autorização para usar o material e que ele não viola direitos autorais, direitos de terceiros, normas legais ou políticas aplicáveis.",
  },
  {
    title: "Disponibilidade e evolução do serviço",
    body: "Podemos ajustar recursos, limites e interface ao longo do tempo para melhorar a experiência do usuário e a qualidade do produto. Também podemos corrigir, pausar ou remover funcionalidades quando isso for necessário por motivos de manutenção, segurança e desempenho.",
  },
  {
    title: "Monetizacao por anuncios",
    body: "O serviço e gratuito para todos os usuarios. Para manter a operacao, exibimos espacos publicitarios na interface.",
  },
  {
    title: "Resultados gerados pela ferramenta",
    body: "O ContaTexto oferece recursos de apoio para contagem de caracteres, análise de texto, revisão, SEO e otimização de conteúdo. Apesar de buscarmos precisão e qualidade, o usuário deve revisar resultados importantes antes de tomar decisões profissionais, jurídicas, financeiras, acadêmicas ou editoriais com base neles.",
  },
  {
    title: "Responsabilidade do usuário",
    body: "Ao utilizar o ContaTexto, você concorda em usar a plataforma de forma responsável, ética e compatível com sua finalidade. Não é permitido tentar explorar vulnerabilidades, automatizar acessos abusivos, prejudicar outros usuários ou utilizar o serviço de maneira que comprometa sua operação.",
  },
  {
    title: "Privacidade e tratamento de dados",
    body: "A privacidade faz parte da proposta do ContaTexto. Sempre que possível, priorizamos o processamento local no navegador e buscamos reduzir a coleta desnecessária de dados. Informações sobre tratamento de dados, privacidade e segurança estão descritas na nossa Política de Privacidade.",
  },
  {
    title: "Atualizações destes termos",
    body: "Estes Termos de Uso podem ser atualizados conforme o ContaTexto evolui. Quando isso acontecer, a versão publicada nesta página passará a refletir as regras vigentes para uso da plataforma.",
  },
];

export default async function TermsPage() {
  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/terms",
          title: "Termos de Uso do ContaTexto",
          description:
            "Leia os Termos de Uso do ContaTexto para entender regras, limites, responsabilidades e condicoes gerais da plataforma.",
        })}
      />
      <ProductBar />

      <main className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
        <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-10 md:py-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Termos de Uso
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Termos de Uso do ContaTexto: regras para usar nossas ferramentas
              de texto com segurança
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              Estes Termos de Uso explicam as condições gerais para utilizar o
              ContaTexto, incluindo o contador de caracteres online, o contador
              de palavras, os recursos de análise de texto e as funcionalidades
              gerais. O objetivo é apresentar regras claras, sem juridiquês
              desnecessário, para que você entenda suas responsabilidades e
              saiba como o serviço pode evoluir ao longo do tempo.
            </p>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-border bg-background p-6"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
