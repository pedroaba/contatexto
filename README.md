# ContaTexto

Contador de texto moderno para analisar **caracteres, palavras, frases,
parágrafos** e **tempo estimado de leitura** com foco em produtividade,
conteúdo e SEO.

## Preview

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## Recursos

- Contagem instantânea de caracteres e palavras.
- Análise de frases, parágrafos e estimativa de leitura.
- Interface limpa e responsiva para desktop e mobile.
- Páginas institucionais prontas para SEO.
- Estrutura preparada para validação com Google AdSense.

## Stack

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `pnpm`

## Começando

### Pré-requisitos

- `Node.js` >= `22.12.0`
- `pnpm` instalado globalmente

### Instalação

```bash
pnpm install
```

### Ambiente local

```bash
pnpm dev
```

Aplicação disponível em `http://localhost:3000`.

## Scripts

| Comando | Descrição |
| :-- | :-- |
| `pnpm dev` | inicia o ambiente local |
| `pnpm test` | executa os testes |
| `pnpm build` | gera o build de produção |
| `pnpm start` | inicia o servidor de produção |

## Variáveis de ambiente

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

Para deploy em produção, conecte o repositório na plataforma e configure as
variáveis de ambiente.

## Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
