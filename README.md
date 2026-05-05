# ContaTexto

Contador de texto moderno para analisar **caracteres, palavras, frases,
paragrafos** e **tempo estimado de leitura** com foco em produtividade,
conteudo e SEO.

## Preview

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## Recursos

- Contagem instantanea de caracteres e palavras.
- Analise de frases, paragrafos e estimativa de leitura.
- Interface limpa e responsiva para desktop e mobile.
- Paginas institucionais prontas para SEO.
- Estrutura preparada para monetizacao com Google AdSense.

## Stack

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `pnpm`

## Comecando

### Pre-requisitos

- `Node.js` >= `22.12.0`
- `pnpm` instalado globalmente

### Instalacao

```bash
pnpm install
```

### Ambiente local

```bash
pnpm dev
```

Aplicacao disponivel em `http://localhost:3000`.

## Scripts

| Comando | Descricao |
| :-- | :-- |
| `pnpm dev` | inicia o ambiente local |
| `pnpm test` | executa os testes |
| `pnpm build` | gera o build de producao |
| `pnpm start` | inicia o servidor de producao |

## Variaveis de ambiente

Crie um arquivo `.env` na raiz com:

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

## Deploy

O projeto pode ser publicado facilmente na Vercel:

```bash
pnpm build
pnpm start
```

Para deploy em producao, conecte o repositorio na plataforma e configure as
variaveis de ambiente.

## Licenca

Distribuido sob a licenca MIT. Veja o arquivo `LICENSE` para mais detalhes.
