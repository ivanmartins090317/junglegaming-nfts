# Fase 6 · Pedido idempotente, confirmação e recibo

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-pedido-idempotente-confirmacao-plano.md` |
| **Spec** | `docs/specs/2026-11-26-pedido-idempotente-confirmacao.md` |

## Objetivo

`/pedidos/$pedidoId` mostra o recibo gravado na criação. O fecho usa a cotação do carrinho de quem está na sessão, espera a resposta e esvazia o carrinho só na primeira vez. A mesma chave, da mesma pessoa, com as mesmas linhas, devolve o mesmo pedido. A tela de pagamento não cria pedido.

## Entregue

| Área | Arquivos |
| --- | --- |
| Contrato e HTTP | `src/lib/contracts/order.ts`, `src/lib/api/order.ts` |
| Cache | `src/lib/query/order.ts` |
| Confirmação | `src/features/order/` |
| Loja viva | `src/mocks/order-store.ts`, `src/mocks/store.ts`, `src/mocks/handlers.ts`, `src/mocks/fixtures/users.ts` |
| Rota | `src/routes/pedidos/$pedidoId.tsx` |
| Casca | `src/components/layout/app-shell.tsx` |

A semente continua com `ped-ada-1`, Ivory Baron #088, quantidade 1, total `1.79`, status `confirmado`, e com `ped-bruno-1`, Golden Signal #160, total `0.39`. A taxa da semente é `0.00`. O recibo completa nome, imagem, carteira `MetaMask`, data `29 Jul, 2026` e o identificador da transação.

### Endereços

- `GET /api/pedidos/:pedidoId` devolve o recibo de quem está na sessão. Pedido de outra pessoa ou identificador ausente responde ausência. Sem sessão, não devolve o recibo.
- `POST /api/pedidos` recebe a chave e as linhas. Não usa total enviado. A primeira criação com sucesso esvazia o carrinho e grava a fotografia da cotação. A repetição da mesma chave e das mesmas linhas devolve o pedido gravado. Linhas diferentes na mesma chave conflitam. A mesma chave em outra pessoa é outra chave.
- `POST /api/dev/reset` devolve os pedidos à semente e apaga as chaves criadas depois.

A chave de leitura inclui a pessoa. Sair já apagava toda chave privada que contém o identificador dela, então a leitura do pedido sai junto. O catálogo permanece.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com o aviso já conhecido do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 20 arquivos, 85 testes |
| `pnpm build` | OK |
| `pnpm exec playwright test` | Playwright não está nesta fatia |

No navegador, com `pnpm dev`: sem sessão, `/pedidos/ped-ada-1` abre a entrada e volta ao pedido depois do sucesso. Ada vê Ivory Baron #088, `(x 1)`, taxa `0.00 ETH`, total `1.79 ETH`, data `29 Jul, 2026` e `0xADA1…A1E1`, sem cabeçalho e sem barra inferior. Em 1440 o modal tem 358 px e fica centrado. Em 390 a página tem padding 28 e o modal cabe na coluna, com 334 px. `Ver no Etherscan` não muda o endereço. O `×` vai para `/`. O pedido do Bruno, na sessão da Ada, mostra `Pedido não encontrado.`

## Fora desta fase (correto)

- Tela de pagamento e gatilho visível de fechar o carrinho
- Socket, `recusado` e versão de evento
- Conexão de carteira e link real do Etherscan
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/06-fase-6-pedido-idempotente-confirmacao.md`](../manual-dev/06-fase-6-pedido-idempotente-confirmacao.md)

## Review humano

O diff pede review humano. `src/lib/contracts/order.ts`, `src/lib/api/order.ts`, `src/mocks/**` e `src/features/order/**` são paths críticos. `src/features/session/use-end-session.ts` não mudou: a chave do pedido já entra na limpeza privada. Esta fatia cria o contrato do pedido, a loja viva da chave de idempotência e o recibo da confirmação.
