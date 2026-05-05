# TextoTools

Aplicacao Next.js 16 com App Router, area publica e uma area autenticada com Firebase no backend.

## Comandos

| Command | Action |
| :-- | :-- |
| `pnpm install` | instala as dependencias |
| `pnpm dev` | inicia o ambiente local |
| `pnpm test` | roda os testes automatizados |
| `pnpm build` | gera o build de producao |
| `pnpm start` | inicia o servidor de producao |

## Firebase

O fluxo de account usa:

- `firebase-admin` no backend para criar usuarios e validar cookies de sessao
- Firebase Auth REST API no backend para autenticar `email + senha`
- cookie `httpOnly` para proteger a rota `/dashboard`

### Variaveis de ambiente

Defina estas variaveis no ambiente do servidor:

```bash
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=
```

Opcionalmente, voce pode usar uma unica variavel:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON=
```

Se usar `FIREBASE_SERVICE_ACCOUNT_JSON`, ela deve conter o JSON completo da service account do Firebase Admin.

## Stripe

Para integrar checkout, assinatura anual/mensal e portal do cliente, adicione:

```bash
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRODUCT_PRO_ID=
STRIPE_PRICE_PRO_MONTHLY_ID=
STRIPE_PRICE_PRO_YEARLY_ID=
```

Sugestao de uso:

- `NEXT_PUBLIC_APP_URL`: URL base do app, ex. `http://localhost:3000` ou dominio de producao
- `STRIPE_SECRET_KEY`: chave secreta da conta Stripe
- `STRIPE_WEBHOOK_SECRET`: segredo do endpoint de webhook Stripe
- `STRIPE_PRODUCT_PRO_ID`: product id do Pro, ex. `prod_...`
- `STRIPE_PRICE_PRO_MONTHLY_ID`: price id mensal, ex. `price_...`
- `STRIPE_PRICE_PRO_YEARLY_ID`: price id anual, ex. `price_...`
