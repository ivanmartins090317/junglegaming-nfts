# Plano: Tokens, casca e rotas vazias

- Status: `done`
- Data: 2026-11-25
- Slug: `tokens-casca-rotas`
- Autonomia: `medium`
- Spec: (preencher depois, em `docs/specs/2026-11-25-tokens-casca-rotas.md`)

## Plano

Casca visual medida, com rotas nomeadas e miolo vazio. O mock continua subindo antes da pintura. Nenhuma tela de domínio.

Decisões deste plano:

- A casca é header e miolo. Promos, Blog e Footer ficam de fora: o miolo dessas camadas não foi medido.
- Rota conhecida mostra só o nome da tela, em `color/foreground`. Rota dinâmica também mostra o parâmetro em texto. Sem dado de NFT, carrinho ou sessão.
- Rota desconhecida usa a mesma casca, a frase "Esta página não existe." em `color/text-coral`, Body/14 Regular, e um botão de página "Início" (primary, raio 6, rótulo em ink) para `/`.
- Início e Mercado apontam para `/`. O estilo ativo (peso 700, accent, sublinhado 3 px em primary) fica só em Início, e só em `/`. Criadores e Aprenda aparecem e não navegam.
- Busca é um Input somente leitura, sem placeholder inventado, com nome acessível "Busca". Não grava `q` na URL.
- Carrinho é o texto "Carrinho" para `/carrinho`, com o badge 16 x 16 sem dígito. Sem biblioteca de ícone.
- Entrar é o botão de página para `/entrar`. Login em modal fica para a fatia de sessão.
- Padding horizontal: 120 a partir de 1440. Abaixo disso, 28, numa coluna, as mesmas peças, com a nav podendo quebrar linha. Sem tab bar.
- shadcn nesta fatia: Button e Input. Dialog, Label e Skeleton entram quando um frame pedir. As variáveis do shadcn já apontam para as cores medidas.
- Fonte: `@fontsource/roboto-mono`, pesos 400, 500 e 700, no próprio build.

### Passos

1. Pedir a aprovação das dependências e instalá-las: `@tanstack/react-router`, `@tanstack/router-plugin`, `tailwindcss`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`, `@fontsource/roboto-mono`. No Vite, o plugin do Router vem antes do React, com `autoCodeSplitting`. Tailwind entra no mesmo config. Alias `@/` no Vite e no `tsconfig.app.json`.
2. Gravar `src/styles/tokens.css` com as nove cores, a família, os raios 5, 6 e 15, e as variáveis do shadcn (`background`, `foreground`, `primary`, `border`, `card`) apontando para essas cores. Sem hex novo, sem `box-shadow`, sem token de Heading. A entrada do Tailwind importa esses tokens. A paleta default do shadcn não fica visível.
3. Gerar Button e Input no tema medido, com `cn` em `src/lib/utils.ts`. Botão de página: raio 6, primary, rótulo em ink. Campo: raio 5, borda `color/border`, sem preenchimento inventado.
4. Montar a casca: fundo `color/ink`, header (wordmark `KURIO`, nav, busca, carrinho, Entrar) e `<Outlet />`. Wordmark é texto, Body/14 Bold, tracking 10%. Trocar a raiz: `main.tsx` sobe o mock e só então renderiza o router. O texto "Mock ligado" sai.
5. Criar as rotas vazias e a rota desconhecida. `routeTree.gen.ts` entra no Git. Sem guarda, sem search param tipado, sem chamada de API.

### Arquivos

- Criar ou alterar:
  - `package.json`, `pnpm-lock.yaml`
  - `vite.config.ts`, `tsconfig.app.json`, `components.json`
  - `src/main.tsx` (remover `src/App.tsx`)
  - `src/styles/tokens.css`, `src/styles/globals.css`
  - `src/lib/utils.ts`
  - `src/components/ui/button.tsx`, `src/components/ui/input.tsx`
  - `src/components/layout/app-shell.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/empty-route.tsx`
  - `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/nfts/$nftId.tsx`, `src/routes/carrinho.tsx`, `src/routes/pagamento.tsx`, `src/routes/pedidos/$pedidoId.tsx`, `src/routes/entrar.tsx`, `src/routes/cadastro.tsx`, `src/routes/perfil.tsx`, `src/routes/carteiras.tsx`
  - `src/routeTree.gen.ts`
- Não mexer:
  - `src/mocks/**`
  - `src/lib/contracts/**`, `src/lib/api/**`, `src/lib/socket/**`, `src/lib/money.ts`
  - `src/features/**`
  - `.env*`
  - `AGENTS.md`
  - `docs/specs/**` neste turno

### Fora de escopo

- Hero, sidebar de filtros, grade, abas, paginação, Promos, Blog e miolo do Footer.
- Tab bar e screen header do mobile. Modal de login e de cadastro.
- Guarda de sessão, search param, catálogo, detalhe, carrinho, cotação, pedido, socket, perfil e carteira.
- Dialog, Label, Skeleton, ícone e arquivo de logo.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- A frase da rota desconhecida e o badge sem dígito não foram lidos no Figma. São composição com peça medida. A aprovação deste plano aceita esse texto.
- Início e Mercado caem na mesma URL. Só Início parece ativo. Mercado não ganha rota própria.
- Busca somente leitura parece campo de verdade e ainda não filtra. A URL de busca nasce na fatia do catálogo.
- Abaixo de 1440 o header quebra linha. Não há frame dessa casca em 768 nem em 414.
- Tailwind ou o tema default do shadcn pode vazar hex ou sombra. O token medido tem que ser a única fonte.
- `main.tsx` muda, e o mock precisa continuar antes da pintura. Os arquivos de mock não mudam.
- `src/lib/utils.ts` existe só por causa do `cn` do shadcn. Não vira pasta de helper genérico.

### Paths críticos

- Toca path crítico: não
- Quais: nenhum. A fatia não edita contrato, API, socket, dinheiro, mock, sessão, checkout, pedido nem `.env`.

## Decisão

Preenchida depois da triagem dos achados. Até lá, deixe em branco.

- Entrou:
- Saiu:
