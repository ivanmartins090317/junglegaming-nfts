# Plano: MSW com dois usuários, reset e catálogo feliz

- Status: `done`
- Data: 2026-11-26
- Slug: `msw-usuarios-reset-catalogo`
- Autonomia: `tight`
- Spec: `docs/specs/2026-11-26-msw-usuarios-reset-catalogo.md` (`done`)

## Plano

A primeira carga de domínio entra no worker que hoje sobe vazio. A loja em memória nasce de um fixture. O catálogo feliz responde a lista que a tela de início já desenha. Dois usuários guardam favorito, carrinho e pedido diferentes. Um reset devolve a loja ao fixture. A tela de início continua nos dados estáticos. Autonomia `tight`: a fatia edita `src/mocks/**` e cria o contrato de leitura do NFT.

Decisões deste plano:

- O catálogo feliz é a lista dos 8 NFTs de `src/features/home/home-data.ts`, na mesma ordem, com o mesmo `id`, nome, `price` em string decimal, `compareAt` quando existir, `image` e `rare`. `GET /api/nfts` devolve essa lista em 200, sem filtro, sem atraso, sem corpo vazio e sem erro.
- `GET /api/nfts/:nftId` devolve o item em 200. Identificador ausente responde 404 com `{ message: "NFT não encontrado." }`. A rota `/nfts/$nftId` continua com o miolo vazio.
- O contrato compartilhado fica em `src/lib/contracts/nft.ts` e cobre só essa leitura. Favorito, carrinho e pedido ficam no fixture do mock. Não viram contrato HTTP nesta fatia.
- Dois usuários, sem favorito, linha de carrinho ou pedido em comum:
  - Ada, `usr-ada`, `ada@kurio.test`. Favoritos: `emerald-ape-042`, `neon-vessel-552`. Carrinho: `sage-nomad-009`, quantidade 1. Pedido: `ped-ada-1`, item `ivory-baron-088`, quantidade 1, total `1.79`, status `confirmado`.
  - Bruno, `usr-bruno`, `bruno@kurio.test`. Favorito: `golden-beat-207`. Carrinho: `cosmic-bloom-118`, quantidade 2. Pedido: `ped-bruno-1`, item `golden-signal-160`, quantidade 1, total `0.39`, status `confirmado`.
- `POST /api/dev/reset` não exige corpo. Responde 204 e a loja volta a um clone do fixture, inclusive preço, favorito, carrinho e pedido. Um segundo reset entrega o mesmo snapshot.
- O worker continua o export `worker` e o `onUnhandledRequest: 'bypass'`. Nenhuma dependência nova. Axios, TanStack Query e Socket.IO ficam para as fatias que a tela for chamar.

### Passos

1. Gravar o contrato de leitura do NFT com os campos do card estático. Preço e total permanecem string decimal. Quantidade permanece inteiro.
2. Gravar o fixture do catálogo e o fixture dos dois usuários. A loja em memória nasce de um clone desse fixture e expõe leitura e reset para os handlers.
3. Registrar os três handlers e passá-los ao `setupWorker`. Componente, hook e rota não importam handler nem fixture.
4. Testar a loja e os handlers com `setupServer` de `msw/node`, no Vitest que já existe. Cada teste começa no fixture. O servidor desse arquivo abre e fecha nele. A prova cobre a lista de 8 itens, o 404, o reset depois de uma mutação na loja, e a diferença de favorito, carrinho e pedido entre Ada e Bruno.
5. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, `/` continua a tela estática e `GET /api/nfts` devolve os 8 itens.

### Arquivos

- Criar ou alterar:
  - `src/lib/contracts/nft.ts`
  - `src/mocks/fixtures/catalog.ts`
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/mocks/browser.ts`
- Não mexer:
  - `src/features/home/**`
  - `src/routes/**`
  - `src/components/**`
  - `src/main.tsx`
  - `src/main.test.tsx`
  - `src/lib/api/**`
  - `src/lib/query/**`
  - `src/lib/socket/**`
  - `src/lib/money.ts`
  - `src/lib/utils.ts`
  - `src/features/session/**`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `public/mockServiceWorker.js`
  - `package.json`
  - `.env*`
  - `AGENTS.md`

### Fora de escopo

- Trocar a grade, a busca, a aba, o filtro, a ordenação ou a página do início para a API.
- Tela de detalhe com dado e estado na URL.
- Login, cadastro, guarda e qualquer endpoint de sessão.
- Endpoint de favorito, carrinho, cotação ou pedido. O registro desses três existe só na semente.
- Socket, cenário vazio, erro, lentidão, cupom inválido e preço que mudou.
- Axios, TanStack Query, `socket.io-client` e `@mswjs/socket.io-binding`.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- A lista dos 8 NFTs passa a existir no fixture e em `home-data.ts`. A fatia do catálogo na tela aposenta a lista estática.
- Carrinho e pedido desta semente não são o contrato da fatia de pedido. Status `confirmado` entra só para a semente nascer num estado terminal.
- `POST /api/dev/reset` fica aberto em todo build que sobe o worker. Esta prova não tem backend real.
- Os nomes Ada e Bruno não vêm de frame. Se o enunciado trouxer outras pessoas, a spec troca os identificadores antes do código.
- O contrato novo em `src/lib/contracts/` é path crítico. Esta fatia grava só a leitura do NFT.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/mocks/**` e `src/lib/contracts/nft.ts`. A semente isola favorito, carrinho e pedido por usuário. Não há chave de idempotência nem evento de socket nesta fatia.

## Decisão

Preenchida depois da triagem dos achados. Até lá, deixe em branco.

- Entrou:
- Saiu:
