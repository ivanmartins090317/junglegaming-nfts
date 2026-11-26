# Fase 7 · Preço ao vivo e estado do pedido

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-socket-preco-estado-pedido-plano.md` |
| **Spec** | `docs/specs/2026-11-26-socket-preco-estado-pedido.md` |

## Objetivo

Com a simulação ligada, Neon Vessel #552 alterna `1.99` e `2.09` na grade, no detalhe e na cotação quando a peça está no carrinho. Pedido novo nasce `pendente`, mostra frase de espera e, após o aviso, abre o recibo ou `Pedido recusado.` quando há Golden Signal #160. A fotografia do recibo não acompanha preço novo. Sair encerra a escuta privada do pedido e mantém o preço público.

## Entregue

| Área | Arquivos |
| --- | --- |
| Contrato | `src/lib/contracts/order.ts` (`OrderStatus`, frases `awaiting` e `refused`) |
| Socket cliente | `src/lib/socket/` (`events`, `apply-notice`, `client`, `use-live-notices`) |
| Loja viva | `src/mocks/live-rules.ts`, `src/mocks/live-clock.ts`, `src/mocks/live-socket.ts`, `src/mocks/store.ts`, `src/mocks/order-store.ts`, `src/mocks/handlers.ts` |
| Confirmação | `src/features/order/order-page.tsx` |
| Casca e sessão | `src/components/layout/app-shell.tsx`, `src/features/session/use-end-session.ts`, `src/main.tsx` |
| Dependências | `socket.io-client`, `@mswjs/socket.io-binding` |

Marca de ordem (`version`) fica só na loja e no cache do cliente, fora do JSON de catálogo e recibo.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, avisos já conhecidos do oxlint nas rotas |
| `pnpm test` | OK, 22 arquivos, 106 testes |
| Playwright | fora desta fatia |

## Fora desta fase (correto)

- Bloco novo de UI, Playwright, Lighthouse e `ARCHITECTURE.md`
- Perfil, carteiras e pagamento
- Aviso de falha novo quando a simulação está desligada (continua a frase HTTP existente)

## Manual do dev

[`docs/manual-dev/07-fase-7-socket-preco-estado-pedido.md`](../manual-dev/07-fase-7-socket-preco-estado-pedido.md)

## Review humano

Diff crítico para review: `src/lib/socket/**`, `src/lib/contracts/order.ts`, `src/mocks/**`, `src/features/order/order-page.tsx`, `src/features/session/use-end-session.ts`.