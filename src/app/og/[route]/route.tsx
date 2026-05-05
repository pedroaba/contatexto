import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const imageSize = {
  width: 1200,
  height: 630,
} as const;

const routeCopy: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  home: {
    eyebrow: "TextoTools",
    title: "Contador de caracteres com analise de texto",
    description:
      "Conte caracteres, palavras, frases e paragrafos com foco em clareza, SEO e produtividade.",
  },
  docs: {
    eyebrow: "Documentacao",
    title: "Guia para contar, revisar e otimizar textos",
    description:
      "Aprenda a usar o TextoTools para SEO, redes sociais, meta titles e descricoes.",
  },
  pricing: {
    eyebrow: "Planos",
    title: "Free para comecar. Pro para ganhar profundidade.",
    description:
      "Compare os planos do TextoTools para salvar analises e melhorar textos com mais contexto.",
  },
  about: {
    eyebrow: "Sobre",
    title: "Ferramentas de texto criadas para quem escreve melhor",
    description:
      "Conheca a proposta do TextoTools para privacidade, clareza e produtividade no dia a dia.",
  },
  privacy: {
    eyebrow: "Privacidade",
    title: "Privacidade em primeiro lugar",
    description:
      "Veja como o TextoTools minimiza coleta e prioriza o processamento local no navegador.",
  },
  terms: {
    eyebrow: "Termos",
    title: "Regras de uso do TextoTools",
    description:
      "Entenda os termos gerais da plataforma, limites de uso e responsabilidades.",
  },
  login: {
    eyebrow: "Conta",
    title: "Entre e continue suas analises",
    description:
      "Acesse sua conta para salvar historico, revisar textos e retomar seu fluxo.",
  },
  signup: {
    eyebrow: "Criar conta",
    title: "Comece gratis no TextoTools",
    description:
      "Crie sua conta para salvar analises e evoluir seu fluxo de escrita e revisao.",
  },
};

function getRouteSlug(url: string) {
  const { pathname } = new URL(url);
  const rawSegment = pathname.split("/").filter(Boolean).pop() ?? "home";
  const slug = rawSegment.replace(/\.png$/i, "");

  return slug || "home";
}

function getImageCopy(slug: string) {
  return routeCopy[slug] ?? routeCopy.home;
}

export async function GET(request: Request) {
  const slug = getRouteSlug(request.url);
  const copy = getImageCopy(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgb(248 250 252) 0%, rgb(240 249 255) 42%, rgb(224 242 254) 100%)",
          color: "rgb(15 23 42)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(14,165,233,0.20), transparent 30%), radial-gradient(circle at bottom left, rgba(56,189,248,0.16), transparent 32%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(14,165,233,0.14)",
            filter: "blur(8px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(2,132,199,0.10)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 52,
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  background: "rgba(14,165,233,0.12)",
                  color: "rgb(3 105 161)",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                T
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                  }}
                >
                  TextoTools
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "rgb(71 85 105)",
                  }}
                >
                  Contador de caracteres e analise de texto
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: 9999,
                border: "1px solid rgba(148,163,184,0.28)",
                background: "rgba(255,255,255,0.7)",
                padding: "10px 16px",
                fontSize: 16,
                fontWeight: 600,
                color: "rgb(3 105 161)",
              }}
            >
              {copy.eyebrow}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: 920,
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "rgb(14 116 144)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              {copy.eyebrow}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              {copy.title}
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 780,
                fontSize: 28,
                lineHeight: 1.35,
                color: "rgb(51 65 85)",
              }}
            >
              {copy.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 18,
                color: "rgb(71 85 105)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  borderRadius: 9999,
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "rgba(255,255,255,0.68)",
                  padding: "10px 14px",
                }}
              >
                SEO
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: 9999,
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "rgba(255,255,255,0.68)",
                  padding: "10px 14px",
                }}
              >
                Clareza
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: 9999,
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "rgba(255,255,255,0.68)",
                  padding: "10px 14px",
                }}
              >
                Produtividade
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "rgb(2 132 199)",
              }}
            >
              textotools.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...imageSize,
    },
  );
}
