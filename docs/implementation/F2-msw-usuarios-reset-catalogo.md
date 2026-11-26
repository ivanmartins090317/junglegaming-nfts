# Fase 2 · MSW com dois usuários, reset e catálogo feliz

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-msw-usuarios-reset-catalogo-plano.md` |
| **Spec** | `docs/specs/2026-11-26-msw-usuarios-reset-catalogo.md` |

## Objetivo

A loja simulada nasce com as oito peças do início, com Ada e Bruno separados, e com um recomeço que devolve essa semente. A tela de início continua na lista estática.

## Entregue

| Área | Arquivos |
| --- | --- |
| Leitura do NFT | `src/lib/contracts/nft.ts` |
| Semente | `src/mocks/fixtures/catalog.ts`, `src/mocks/fixtures/users.ts` |
| Loja viva | `src/mocks/store.ts` |
| Atendimento | `src/mocks/handlers.ts`, `src/mocks/browser.ts` |
| Prova | `src/mocks/handlers.test.ts` |

### Endereços

- `GET /api/nfts` devolve as oito peças, nesta ordem, em 200
- `GET /api/nfts/<identificador>` devolve a peça em 200, ou 404 com `{ message: "NFT não encontrado." }`
- `POST /api/dev/reset` não exige corpo, responde 204 e troca a loja viva por um clone da semente

Ada (`usr-ada`, `ada@kurio.test`) e Bruno (`usr-bruno`, `bruno@kurio.test`) não compartilham favorito, linha de carrinho nem pedido. Violet Nomad #314 fica só no catálogo. Favorito, carrinho e pedido não têm leitura nem escrita HTTP nesta fatia.

O worker continua exportado como `worker`. Pedido que não é um desses três endereços segue sem resposta da simulação.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com o aviso já conhecido do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 20 testes |
| `pnpm exec playwright test` | comando ausente neste projeto; Playwright fica fora desta fatia |

No navegador, em `pnpm dev`: `/` mostra as oito peças estáticas e não pede `/api/nfts` para pintar. A aba "Novos lançamentos" continua em `/` e a grade segue as mesmas oito. `GET /api/nfts` devolve as oito na ordem da semente. `GET /api/nfts/neon-vessel-552` devolve a peça rara. Identificador ausente responde 404 com a frase da spec. `POST /api/dev/reset` responde 204 sem corpo. `/nfts/neon-vessel-552` continua "Detalhe neon-vessel-552". `GET /api/sessao` não recebe JSON da loja.

## Fora desta fase (correto)

- Grade, busca, aba, filtro, ordenação e página do início ligados à loja
- Detalhe com dado, sessão, favorito, carrinho, cotação, pedido e socket
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/02-fase-2-msw-usuarios-reset-catalogo.md`](../manual-dev/02-fase-2-msw-usuarios-reset-catalogo.md)

## Review humano

O diff pede review humano: `src/lib/contracts/nft.ts` e `src/mocks/**` são path crítico. Esta fatia grava só a leitura do NFT. Não há chave de idempotência nem evento de socket.
