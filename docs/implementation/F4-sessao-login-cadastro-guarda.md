# Fase 4 · Sessão, login, cadastro e guarda

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-sessao-login-cadastro-guarda-plano.md` |
| **Spec** | `docs/specs/2026-11-26-sessao-login-cadastro-guarda.md` |

## Objetivo

Quem já tem conta entra. Quem não tem cria a conta e já fica na sessão. A partir de 1440 a entrada é um painel sobre a página atual. Abaixo disso, `/entrar` e `/cadastro` são telas cheias. Perfil, carteiras, pagamento e a confirmação do pedido só abrem com sessão. Sair apaga a sessão e o cache privado.

## Entregue

| Área | Arquivos |
| --- | --- |
| Contrato e HTTP | `src/lib/contracts/session.ts`, `src/lib/api/session.ts` |
| Cache | `src/lib/query/session.ts` |
| Entrada, guarda e saída | `src/features/session/` |
| Loja viva | `src/mocks/fixtures/users.ts`, `src/mocks/store.ts`, `src/mocks/handlers.ts` |
| Rotas | `src/routes/index.tsx`, `src/routes/entrar.tsx`, `src/routes/cadastro.tsx`, `src/routes/perfil.tsx`, `src/routes/carteiras.tsx`, `src/routes/pagamento.tsx`, `src/routes/pedidos/$pedidoId.tsx` |
| Casca | `src/components/layout/app-shell.tsx`, `src/components/layout/site-header.tsx`, `src/main.tsx` |

Ada e Bruno passam a ter nome e senha `kurio`. A resposta da sessão traz só identificador, nome e e-mail. O navegador não grava a sessão. Recarregar a página faz a loja nascer de novo na semente, sem sessão.

### Endereços

- `POST /api/sessao` entra. Credencial errada: 401, `E-mail ou senha não conferem.`
- `GET /api/sessao` lê. Visitante recebe 401 e a tela trata como ausência de sessão.
- `DELETE /api/sessao` sai e responde 204.
- `POST /api/cadastro` cria. Nome, e-mail ou senha vazios: 400, `Informe nome, e-mail e senha.` Senhas diferentes: 400, `As senhas não conferem.` E-mail já usado: 409, `Este e-mail já tem conta.`
- Conta nova começa com favorito, carrinho e pedido vazios. O identificador seguinte é `usr-3`. `POST /api/dev/reset` zera a sessão e devolve a semente.

A chave da sessão é `['sessao']`. A chave privada inclui o identificador da pessoa. Sair remove as duas. `['nfts']` fica.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com o aviso já conhecido do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 11 arquivos, 52 testes |
| `pnpm exec playwright test` | Playwright não está nesta fatia |

No navegador, com `pnpm dev`: em 1440, Entrar na home abre o painel em `/?conta=entrar`, com o início atrás. Ada entra e o topo passa a `Sair`. Recarregar perde a sessão. `/perfil` sem sessão abre `/?conta=entrar&retorno=/perfil`. Depois do sucesso, a tela mostra `ada@kurio.test` e `Sair`. Sair reabre o painel com o mesmo retorno. Em 390, `/entrar` e `/cadastro` são telas cheias, sem cabeçalho. `/perfil` sem sessão vai para `/entrar?retorno=/perfil`. `/entrar` em 1440 vira `/?conta=entrar`, com o painel e o hero.

## Fora desta fase (correto)

- Dados de carteira, pagamento ou pedido além do nome da tela
- Favorito, carrinho e cotação persistidos nesta fatia
- Esqueceu a senha, Google e Facebook com navegação ou sucesso
- Troca ao vivo entre painel e tela cheia enquanto a janela muda de largura
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/04-fase-4-sessao-login-cadastro-guarda.md`](../manual-dev/04-fase-4-sessao-login-cadastro-guarda.md)

## Review humano

O diff pede review humano. `src/lib/contracts/session.ts`, `src/lib/api/session.ts`, `src/features/session/**` e `src/mocks/**` são paths críticos. Esta fatia cria o contrato da sessão, o cliente HTTP, a guarda e a loja viva da conta.
