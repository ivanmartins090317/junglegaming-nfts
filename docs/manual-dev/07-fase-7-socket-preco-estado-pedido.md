# Fase 7 · Preço ao vivo e estado do pedido

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-socket-preco-estado-pedido.md` |

## O que esta fase entrega

- Eventos websocket `preco` (público) e `pedido` (por pessoa), com `entrar` e `sair`.
- Relógio no worker do mock: a cada 3 s altera só Neon Vessel #552; ~2 s após fechar, confirma ou recusa o pedido `pendente`.
- Cache TanStack Query aplica o aviso sem `fetch` extra quando a leitura já existe.
- Confirmação: modal só em `confirmado`; `pendente` e `recusado` usam as frases da spec no lugar do modal.
- `pnpm dev` com mock ligado chama `startLiveClock` depois do worker. Com `VITE_ENABLE_MOCK=false`, não há socket nem relógio.

## Como homologar no navegador

```bash
pnpm install
pnpm dev
```

1. Abra `/` e espere ~3 s: Neon Vessel #552 alterna entre `1.99` e `2.09`; comparação `2.29` não muda.
2. Ada (`ada@kurio.test` / `kurio`): feche o carrinho com Sage Nomad #009. Abra o pedido novo: `Aguardando confirmação do pedido.`; depois de ~2 s, o recibo aparece.
3. Repita com carrinho contendo Golden Signal #160: frase de recusa, sem modal.
4. Abra `ped-ada-1`: total `1.79` permanece mesmo com o relógio ativo.
5. Saia com pedido `pendente` aberto: preço público continua; estado do pedido não atualiza na aba sem sessão.
6. `VITE_ENABLE_MOCK=false`: mesmas telas sem escuta (frases de falha HTTP inalteradas).

## Prova automática relevante

- `src/mocks/live-rules.test.ts`: loja, fecho `pendente`, resolução, reset, sem timers em teste.
- `src/lib/socket/apply-notice.test.ts`: cache, versão, carrinho e isolamento.
- `src/features/order/order-page.test.tsx`: frases sem modal.

## Riscos anotados na spec

- Recomeço sem aviso: aba pode manter preço até marca maior que a local.
- Homologação do socket real no navegador fica manual.