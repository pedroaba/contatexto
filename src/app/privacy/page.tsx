import { Footer } from "@/components/marketing/footer";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/privacy",
  title: "Política de Privacidade",
  description:
    "Entenda como o ContaTexto trata dados, prioriza processamento local no navegador e reduz coleta desnecessária de informações.",
  keywords: [
    "privacidade contatexto",
    "contador de caracteres privado",
    "processamento local",
    "política de privacidade",
  ],
});

const principles = [
  "O ContaTexto foi criado para priorizar o processamento local no navegador sempre que isso fizer sentido para a funcionalidade utilizada.",
  "Nosso objetivo é reduzir a coleta desnecessária de dados e manter uma experiência simples, rápida, privada e transparente.",
  "Não usamos login, assinatura ou dashboard. O produto é gratuito e focado em uso direto na página.",
];

const sections = [
  {
    title: "O que fazemos com o seu texto",
    body: "O ContaTexto ajuda você a contar caracteres, contar palavras, analisar textos e revisar conteúdos com rapidez. A experiência principal da ferramenta foi pensada para funcionar diretamente no navegador, reduzindo a necessidade de envio constante do conteúdo digitado para servidores externos.",
  },
  {
    title: "Quais dados podemos coletar",
    body: "Podemos coletar dados técnicos básicos para manter a plataforma funcionando corretamente, como informações de acesso, diagnóstico, preferências de uso e métricas essenciais de funcionamento.",
  },
  {
    title: "Publicidade, cookies e tecnologias do Google",
    body: "O ContaTexto pode usar produtos e serviços do Google, incluindo Google AdSense, para validar o site, exibir publicidade e manter a ferramenta gratuita. Esses serviços podem usar cookies, beacons da Web, endereços IP, identificadores de dispositivo e outros identificadores para operar anúncios, medir desempenho, prevenir fraudes, limitar abuso e cumprir requisitos técnicos e legais.",
  },
  {
    title: "Anúncios personalizados e não personalizados",
    body: "Quando anúncios estiverem ativos, o Google e seus parceiros podem usar dados para exibir anúncios personalizados ou não personalizados, conforme as configurações do usuário, a região de acesso, o consentimento aplicável e as políticas do Google. O usuário pode gerenciar preferências de anúncios e privacidade diretamente nas ferramentas disponibilizadas pelo Google.",
  },
  {
    title: "O que evitamos coletar",
    body: "Não queremos transformar o ContaTexto em uma ferramenta de rastreamento. Por isso, buscamos evitar coleta excessiva, criação de perfis invasivos e uso desnecessário do conteúdo digitado pelo usuário. A privacidade é uma parte importante da experiência do produto.",
  },
  {
    title: "Como protegemos as informações",
    body: "Adotamos uma abordagem de minimização de dados: coletar apenas o necessário, restringir acessos internos e revisar continuamente quais informações realmente precisam ser armazenadas. Essa prática ajuda a reduzir riscos operacionais, proteger o usuário e tornar o tratamento de dados mais transparente.",
  },
  {
    title: "Seus controles e transparência",
    body: "Sempre que possível, buscamos deixar claro quais dados fazem parte do fluxo do produto e por qual motivo eles são utilizados. Também mantemos textos públicos e políticas simples para que você entenda como a ferramenta funciona e o que pode esperar ao usar o ContaTexto.",
  },
];

export default async function PrivacyPage() {
  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/privacy",
          title: "Política de Privacidade do ContaTexto",
          description:
            "Entenda como o ContaTexto trata dados, prioriza processamento local no navegador e reduz coleta desnecessária de informações.",
        })}
      />

      <ProductBar />

      <main className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
        <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-10 md:py-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Política de Privacidade
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Privacidade no ContaTexto: como tratamos dados e protegemos seus
              textos
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              Esta página explica, em linguagem clara, como o ContaTexto trata
              dados durante o uso do contador de caracteres online, contador de
              palavras e ferramentas de análise de texto. Nossa ideia central é
              simples: usar o mínimo de dados necessário, priorizar o
              processamento local no navegador sempre que possível e evitar
              qualquer complexidade que não agregue valor ao usuário.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </article>
          ))}
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
