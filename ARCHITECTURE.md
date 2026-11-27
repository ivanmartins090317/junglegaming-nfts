# Arquitetura · Kurio

SPA Vite. Prova frontend da Jungle. Marketplace de NFTs com marca visível Kurio. Dados simulados no cliente. Sem backend de produção.

## Stack

Lista fechada. Sem dependência nova sem aprovação.

- Casca: Vite, React, TypeScript. SPA.
- Roteamento: TanStack Router por arquivo (`src/routes`, árvore em `src/routeTree.gen.ts`). O plugin do Router vem antes do plugin do React.
- Estado remoto: TanStack Query. HTTP: Axios. Componente não chama Axios.
- Tempo real: `socket.io-client`, só transporte websocket.
- Estilo: Tailwind 4. Componentes: shadcn/ui, no tema medido (`src/styles/tokens.css`). Família única Roboto Mono (400, 500, 700). Sem segunda família. Sem `box-shadow`.
- Mock: MSW e `@mswjs/socket.io-binding`. Componente e hook não importam handler de mock.
- Teste: Playwright. Auditoria: Lighthouse.
- Package manager: pnpm.

## Mock

O mock liga por padrão. Desliga com `VITE_ENABLE_MOCK=false`.

Handlers, fixtures e cenários ficam em `src/mocks/`. A loja viva nasce de novo a cada subida do mock.

## Paths críticos

Só alterar com pedido explícito, spec aprovada e review humano:

- `src/lib/contracts/**`
- `src/lib/api/**`
- `src/lib/socket/**`
- `src/lib/money.ts`
- `src/mocks/**`
- `src/features/session/**`
- `src/features/checkout/**`
- `src/features/order/**`
- `.env*`

Pedido com chave de idempotência, isolamento por usuário e evento que não regride estado são sempre autonomia `tight`.

## Observabilidade

Sentry fica fora do `package.json`. Observabilidade não faz parte desta prova. Não adicionar `@sentry/*` nem DSN.
