# Fase 5 · Carrinho e cotação

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-carrinho-cotacao-plano.md` |
| **Spec** | `docs/specs/2026-11-26-carrinho-cotacao.md` |

## Objetivo

`/carrinho` continua público e pinta o carrinho vivo com a cotação calculada. O visitante guarda as linhas no `sessionStorage` desta aba. Quem entra ou cria conta funde esse rascunho na loja da pessoa. A tela não soma ETH. O total de fechar vem da cotação.

## Entregue

| Área | Arquivos |
| --- | --- |
| Contrato, dinheiro e HTTP | `src/lib/contracts/cart.ts`, `src/lib/money.ts`, `src/lib/api/cart.ts` |
| Cache | `src/lib/query/cart.ts` |
| Carrinho | `src/features/cart/` |
| Loja viva | `src/mocks/store.ts`, `src/mocks/handlers.ts` |
| Rota | `src/routes/carrinho.tsx` |
| Casca | `src/components/layout/app-shell.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/mobile-tabs.tsx` |
| Incluir a peça | `src/features/detail/nft-detail.tsx` |
| Fusão e saída | `src/features/session/auth-form.tsx`, `src/features/session/use-end-session.ts` |

A semente da Ada continua `sage-nomad-009` com quantidade 1. A do Bruno continua `cosmic-bloom-118` com quantidade 2. Conta nova começa vazia. O preço unitário é o preço atual do catálogo.

### Endereços

- `GET /api/carrinho` lê a loja de quem está na sessão. Visitante recebe 401.
- `POST /api/carrinho/leitura` enriquece as linhas enviadas. Não grava a loja.
- `POST /api/carrinho/itens` soma 1 na peça. `PUT /api/carrinho/itens/:nftId` grava a quantidade. `DELETE` tira a linha.
- `POST /api/carrinho/fusao` soma quantidades da mesma peça, acrescenta peça nova e ignora identificador ausente no catálogo.
- `POST /api/cotacao` calcula. Com sessão, ignora o corpo e usa a loja. Sem sessão, usa o corpo. Com linha, a taxa é `0.016` e o total tem três casas. Sem linha, subtotal, taxa e total são `0.00`.
- `POST /api/dev/reset` devolve Ada e Bruno à semente e encerra a sessão. O rascunho do navegador não faz parte da semente.

A chave de quem está na sessão inclui o identificador da pessoa. Sair remove essas chaves junto com o restante do cache privado e avisa o topo, que volta a `Entrar`. O rascunho não entra nessa chave e não recebe o carrinho da pessoa.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com o aviso já conhecido do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 16 arquivos, 75 testes |
| `pnpm build` | OK |
| `pnpm exec playwright test` | Playwright não está nesta fatia. O comando não encontra o executável |

No navegador, com `pnpm dev`: o visitante inclui Emerald Ape e duas unidades de Sage Nomad. O selo vai a `3`. O recarregar mantém o rascunho e a cotação `4.586 ETH`. Aplicar um cupom deixa o desconto em `(-) 00.00` e o endereço em `/carrinho`. Ada entra e a fusão fica Sage quantidade 3 mais Emerald quantidade 1, total `6.276 ETH`, selo `4`, rascunho vazio. Sair mostra `Entrar`, `Seu carrinho está vazio.` e total `0.00 ETH`. Entrar de novo devolve o carrinho da Ada. `Conectar e finalizar` abre `/pagamento` com o título `Revisão e envio`. Em 390 e em 768 a coluna é a do mobile: margem 28, título centralizado, painel fixo no pé, sem barra de atalhos, sem recomendações e sem rodapé. O voltar, vindo de outra tela, retorna a ela.

## Fora desta fase (correto)

- Pagamento, pedido e socket
- Cupom que altera o desconto
- Botão de reset na tela
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/05-fase-5-carrinho-cotacao.md`](../manual-dev/05-fase-5-carrinho-cotacao.md)

## Review humano

O diff pede review humano. `src/lib/contracts/cart.ts`, `src/lib/api/cart.ts`, `src/lib/money.ts`, `src/mocks/**`, `src/features/session/auth-form.tsx` e `src/features/session/use-end-session.ts` são paths críticos. Esta fatia cria o contrato do carrinho, o cálculo decimal, a loja viva das linhas e a fusão na entrada.
