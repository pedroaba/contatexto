import Link from "next/link";

import { AdSlot } from "@/components/marketing/ad-slot";
import { Footer } from "@/components/marketing/footer";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import { buildFaqSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/docs",
  title: "Documentacao",
  description:
    "Guia do TextoTools para contar caracteres, revisar textos, ajustar meta title, meta description e melhorar conteudos para SEO e redes sociais.",
  keywords: [
    "documentacao textotools",
    "contador de caracteres",
    "meta title",
    "meta description",
    "seo para textos",
    "redes sociais",
  ],
});

const quickLinks = [
  {
    href: "/#tool",
    title: "Abrir a ferramenta",
    description:
      "Cole seu texto, veja a contagem em tempo real e use os painéis de qualidade e SEO.",
  },
  {
    href: "/privacy",
    title: "Política de privacidade",
    description:
      "Veja como o TextoTools trata dados, minimiza coleta e prioriza processamento local no navegador.",
  },
  {
    href: "/terms",
    title: "Termos de uso",
    description:
      "Entenda as regras da plataforma, limites de uso e responsabilidades gerais.",
  },
];

const seoTips = [
  {
    title: "SEO para redes sociais",
    description:
      "Use textos claros, escaneáveis e com palavras-chave relevantes para melhorar legendas, posts, bios, descrições e títulos em plataformas como Instagram, LinkedIn, TikTok, YouTube e X.",
  },
  {
    title: "Legendas de Instagram",
    description:
      "Crie legendas diretas, com boa abertura, informação útil e chamada para ação. O TextoTools ajuda a revisar tamanho, clareza, estrutura e repetição de palavras.",
  },
  {
    title: "Posts para LinkedIn",
    description:
      "Organize ideias em frases curtas, com começo forte e leitura fluida. Textos mais claros tendem a gerar mais retenção, comentários e compartilhamentos.",
  },
  {
    title: "Títulos e descrições para YouTube",
    description:
      "Use palavras-chave no título e na descrição do vídeo sem exagerar. O contador ajuda a manter o texto objetivo e otimizado para busca dentro da plataforma.",
  },
  {
    title: "Meta title e meta description",
    description:
      "Para páginas, blogs e aplicações web, use títulos objetivos com a palavra-chave principal no início. Meta titles costumam funcionar melhor entre 50 e 60 caracteres, e meta descriptions entre 140 e 160 caracteres.",
  },
  {
    title: "Palavra-chave principal",
    description:
      "Defina uma intenção principal para cada texto. Em redes sociais, isso pode ser o tema do post; em páginas web, pode ser a busca que você quer alcançar.",
  },
  {
    title: "Clareza e retenção",
    description:
      "SEO também depende de experiência. Textos fáceis de ler, com boa estrutura e mensagem clara, ajudam o usuário a permanecer, interagir e entender melhor o conteúdo.",
  },
  {
    title: "Hashtags e termos relacionados",
    description:
      "Use hashtags e termos relacionados com intenção. Evite excesso e priorize palavras que realmente descrevem o conteúdo, o público e o contexto da publicação.",
  },
];

const faqItems = [
  {
    question: "Preciso criar conta para usar?",
    answer:
      "Não. A ferramenta principal pode ser usada imediatamente no navegador para contar caracteres, palavras e revisar textos rapidamente.",
  },
  {
    question: "Onde o texto é processado?",
    answer:
      "A experiência foi desenhada para priorizar o processamento local no navegador, com foco em privacidade, velocidade e simplicidade.",
  },
  {
    question: "Como usar o TextoTools para SEO?",
    answer:
      "Você pode usar o TextoTools para revisar meta titles, meta descriptions, descrições de produtos, títulos de páginas, posts de blog, legendas de redes sociais, bios, títulos de YouTube e textos de landing pages.",
  },
  {
    question: "Criadores de conteúdo podem usar a ferramenta?",
    answer:
      "Sim. Criadores de conteúdo, social media, redatores, copywriters e profissionais de marketing podem usar o TextoTools para melhorar posts, legendas, descrições, títulos, chamadas para ação e textos de campanhas.",
  },
  {
    question: "A ferramenta e paga?",
    answer:
      "Nao. O TextoTools e totalmente gratuito. A monetizacao acontece por blocos de anuncio na interface.",
  },
];

export default function DocsPage() {
  return (
    <>
      <StructuredData
        data={[
          buildWebPageSchema({
            path: "/docs",
            title: "Documentacao do TextoTools",
            description:
              "Guia do TextoTools para contar caracteres, revisar textos, ajustar meta title, meta description e melhorar conteudos para SEO e redes sociais.",
          }),
          buildFaqSchema(faqItems),
        ]}
      />
      <ProductBar />

      <main className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
        <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-10 md:py-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Documentação
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Guia do TextoTools para contar, revisar e otimizar textos
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              Aprenda a usar o TextoTools para contar caracteres, contar palavras,
              revisar textos e otimizar conteúdos para SEO. Este guia reúne os
              principais atalhos do produto, boas práticas de escrita e dicas para
              melhorar títulos, descrições, legendas de redes sociais, posts,
              páginas e conteúdos antes da publicação.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="text-sm font-semibold">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </section>

        <AdSlot size="leaderboard" className="mt-8" />

        <section className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <article
            id="getting-started"
            className="scroll-mt-24 rounded-3xl border border-border bg-background p-6"
          >
            <h2 className="text-xl font-semibold tracking-tight">Primeiros passos</h2>

            <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>1. Abra a ferramenta principal para colar ou escrever seu texto.</li>
              <li>
                2. Revise a contagem de caracteres, palavras, frases, parágrafos e
                tempo estimado de leitura.
              </li>
              <li>
                3. Compare seu texto com limites comuns de SEO, redes sociais,
                anúncios e conteúdos digitais.
              </li>
              <li>
                4. Use os indicadores para melhorar clareza, estrutura, repetição de
                palavras e legibilidade.
              </li>
              <li>
                5. Exporte seu texto e aplique os ajustes antes de publicar.
              </li>
            </ol>
          </article>

          <article className="rounded-3xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Para que serve o TextoTools?
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              O TextoTools é uma suíte de ferramentas de texto para quem precisa
              escrever melhor, revisar com rapidez e publicar com mais segurança.
              Ele ajuda em tarefas como contador de caracteres, contador de
              palavras, revisão de conteúdo, SEO, copywriting, posts, anúncios,
              landing pages, descrições de produtos e textos para redes sociais.
            </p>
          </article>
        </section>

        <AdSlot size="inline" className="mx-auto mt-8 max-w-3xl" />

        <section
          id="seo-guide"
          className="mt-8 scroll-mt-24 rounded-3xl border border-border bg-background p-6 md:p-8"
        >
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Guia de SEO para textos
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Como usar o TextoTools para melhorar textos, SEO e conteúdos de redes sociais
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              O TextoTools ajuda você a escrever textos mais claros, objetivos e
              otimizados para diferentes canais. Use a ferramenta para revisar
              conteúdos de sites, blogs, landing pages, anúncios, descrições de
              produtos, legendas de Instagram, posts do LinkedIn, títulos de
              YouTube, descrições de vídeos, bios e outros textos usados em redes
              sociais.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {seoTips.map((tip) => (
              <article key={tip.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {tip.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="content-sizes"
          className="mt-8 scroll-mt-24 grid gap-6 md:grid-cols-2"
        >
          <article className="rounded-3xl border border-border bg-background p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Tamanhos recomendados para SEO, redes sociais e conteúdo digital
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                <strong className="font-semibold text-foreground">Meta title:</strong>{" "}
                tente manter entre 50 e 60 caracteres, com a palavra-chave principal próxima
                do início.
              </p>
              <p>
                <strong className="font-semibold text-foreground">Meta description:</strong>{" "}
                geralmente funciona melhor entre 140 e 160 caracteres, com uma promessa
                clara e motivo para o usuário clicar.
              </p>
              <p>
                <strong className="font-semibold text-foreground">Títulos de YouTube:</strong>{" "}
                devem ser claros, pesquisáveis e atrativos, com a palavra-chave ou tema
                principal aparecendo de forma natural.
              </p>
              <p>
                <strong className="font-semibold text-foreground">Legendas de redes sociais:</strong>{" "}
                devem prender atenção nas primeiras linhas, entregar valor rápido e terminar
                com uma chamada para ação quando fizer sentido.
              </p>
              <p>
                <strong className="font-semibold text-foreground">Bios e descrições:</strong>{" "}
                precisam explicar rapidamente quem você é, o que oferece e por que alguém
                deveria continuar lendo, seguir seu perfil ou clicar no link.
              </p>
              <p>
                <strong className="font-semibold text-foreground">Descrições de produto:</strong>{" "}
                devem combinar palavras-chave, benefícios reais e informações úteis para
                a decisão de compra.
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Checklist rápido antes de publicar
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>• O texto tem uma intenção principal clara?</li>
              <li>• A primeira frase prende atenção?</li>
              <li>• A palavra-chave ou tema principal aparece naturalmente?</li>
              <li>• O texto está fácil de ler em telas pequenas?</li>
              <li>• Os parágrafos estão curtos e escaneáveis?</li>
              <li>• A mensagem entrega valor antes de pedir uma ação?</li>
              <li>• Existe uma chamada para ação quando fizer sentido?</li>
              <li>• O texto evita repetição exagerada de palavras-chave?</li>
              <li>
                • O conteúdo está adequado ao canal: Google, Instagram, LinkedIn,
                YouTube, TikTok, blog ou landing page?
              </li>
            </ul>
          </article>
        </section>

        <AdSlot size="leaderboard" className="mt-8" />

        <section
          id="use-cases"
          className="mt-8 scroll-mt-24 rounded-3xl border border-border bg-background p-6"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            Como aplicar em cada tipo de conteúdo
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Sites, blogs e landing pages</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use o TextoTools para revisar H1, títulos de seção, meta title,
                meta description, chamadas e descrições antes de publicar páginas importantes.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Redes sociais e vídeos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ajuste bios, legendas, títulos, descrições e CTAs para manter
                clareza, ritmo de leitura e tamanho adequado ao canal.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
