# Fase 1 · Tokens, casca e rotas vazias

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-25-tokens-casca-rotas-plano.md` |
| **Spec** | `docs/specs/2026-11-25-tokens-casca-rotas.md` |

## Objetivo

A pessoa abre a Kurio e encontra a mesma casca em toda tela nomeada. O miolo mostra só o nome da tela. A simulação continua subindo antes da pintura.

## Entregue

### Casca

| Área | Arquivos |
| --- | --- |
| Tokens e estilo | `src/styles/tokens.css`, `src/styles/globals.css` |
| Peças | `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/lib/utils.ts` |
| Casca | `src/components/layout/app-shell.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/empty-route.tsx` |
| Rotas | `src/routes/**`, `src/routeTree.gen.ts` |
| Entrada | `src/main.tsx` (removido `src/App.tsx`) |
| Empacotador | `vite.config.ts`, `tsconfig.app.json`, `components.json` |

### Telas

- `/` Início
- `/nfts/<identificador>` Detalhe, com o identificador ao lado
- `/carrinho` Carrinho
- `/pagamento` Revisão e envio
- `/pedidos/<identificador>` Confirmação, com o identificador ao lado
- `/entrar` Entrar
- `/cadastro` Cadastro
- `/perfil` Perfil
- `/carteiras` Carteiras
- endereço fora dessa lista: "Esta página não existe." e botão Início

### Testes automatizados

- `src/components/layout/app-shell.test.tsx` cobre a casca, as telas nomeadas, o endereço desconhecido, a navegação e a busca
- `src/main.test.tsx` cobre a simulação antes da pintura, a simulação desligada e a falha ao subir
- `src/test/setup.ts` prepara o ambiente desses testes

Vitest entrou como dependência de desenvolvimento porque o prompt de implementação pediu teste de unidade. A spec desta fatia não inclui Playwright.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com aviso do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 15 testes |
| `pnpm exec vite build` | OK, um chunk por tela |
| `pnpm exec playwright test` | não rodou: Playwright não está instalado e fica fora desta fatia |

No navegador, em `pnpm dev`: início, carrinho, entrar, Mercado, Criadores, Aprenda, marca, busca, `/blog`, `/nfts/rune-1` e `/cadastro`. Recuo 120 a partir de 1440 e 28 em 768 e 390. Com `VITE_ENABLE_MOCK=false`, a casca aparece sem a frase "Mock desligado".

## Pendências menores desta fase

- Homologação manual: ver `docs/state/PENDENCIAS.md`
- A triagem dos achados do plano continua em branco

## Fora desta fase (correto)

- Hero, filtros, grade, promo, blog e rodapé
- Barra inferior, modal de entrar e de cadastro
- Catálogo, carrinho com item, cotação, pedido, sessão, perfil com dado e carteira com dado
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/01-fase-1-tokens-casca-rotas.md`](../manual-dev/01-fase-1-tokens-casca-rotas.md)
