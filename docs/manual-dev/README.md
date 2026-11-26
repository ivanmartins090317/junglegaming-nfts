# Manual do desenvolvedor

Como o app funciona e como homologar.

O app abre com `pnpm install` e `pnpm dev`. O mock sobe ligado. Para abrir sem ele: `VITE_ENABLE_MOCK=false` no ambiente, ou num `.env` local.

Stack fechada: Vite, React, TypeScript, TanStack Router, TanStack Query, Axios, Socket.IO, Tailwind 4, shadcn, MSW, Playwright.

| Documento | Conteúdo |
| --- | --- |
| [01-fase-1-tokens-casca-rotas.md](01-fase-1-tokens-casca-rotas.md) | Casca medida, rotas vazias e simulação antes da pintura |
| [02-fase-2-msw-usuarios-reset-catalogo.md](02-fase-2-msw-usuarios-reset-catalogo.md) | Catálogo feliz, Ada e Bruno, e recomeço da loja simulada |
| [03-fase-3-catalogo-detalhe-url.md](03-fase-3-catalogo-detalhe-url.md) | Grade da loja, busca no endereço e detalhe da peça |

Ao fechar uma fase, o capítulo entra nesta tabela.
