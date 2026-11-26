# Fase 2 · MSW com dois usuários, reset e catálogo feliz

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-msw-usuarios-reset-catalogo.md` |

## O que esta fase entrega

- A loja simulada sobe com as oito peças que a tela de início já desenha, na mesma ordem e com os mesmos valores.
- Ada e Bruno nascem com favorito, carrinho e pedido diferentes. Esses três ficam só na semente.
- `POST /api/dev/reset` devolve preço, favorito, carrinho e pedido a um clone da semente.
- A pessoa que abre `/` continua na lista estática. A rota de detalhe continua com o miolo vazio.

Não entrega: detalhe com dado, entrar, cadastro, favorito, carrinho, cotação, pedido nem tempo real.

---

## Arquitetura da feature

```text
src/lib/contracts/nft.ts          # leitura do NFT: id, nome, preço, comparação, imagem, raro
src/mocks/fixtures/catalog.ts     # as oito peças da semente
src/mocks/fixtures/users.ts       # Ada e Bruno
src/mocks/store.ts                # loja viva, clone da semente, recomeço
src/mocks/handlers.ts             # os três endereços
src/mocks/browser.ts              # worker
```

A tela, o hook e a rota não importam a semente nem o atendimento.

### Fluxo principal

1. `main.tsx` sobe o `worker` quando a simulação está ligada.
2. `GET /api/nfts` lê o catálogo vivo.
3. `GET /api/nfts/<identificador>` lê uma peça. Se o identificador não está nas oito, a resposta é 404 e a mensagem é `NFT não encontrado.`
4. Uma alteração na loja viva não muda a semente guardada.
5. `POST /api/dev/reset` substitui a loja viva por um clone novo da semente e responde 204, sem corpo.
6. Um pedido em outro endereço não é respondido pela simulação.

### Semente das pessoas

| Pessoa | Identificador | E-mail | Favoritos | Carrinho | Pedido |
| --- | --- | --- | --- | --- | --- |
| Ada | `usr-ada` | `ada@kurio.test` | `emerald-ape-042`, `neon-vessel-552` | `sage-nomad-009`, quantidade 1 | `ped-ada-1`, item `ivory-baron-088`, quantidade 1, total `1.79`, status `confirmado` |
| Bruno | `usr-bruno` | `bruno@kurio.test` | `golden-beat-207` | `cosmic-bloom-118`, quantidade 2 | `ped-bruno-1`, item `golden-signal-160`, quantidade 1, total `0.39`, status `confirmado` |

Preço e total são string decimal. Quantidade é inteiro. `confirmado` aqui só marca o pedido que já nasce encerrado. Não é o contrato da fatia de pedido.

---

## Homologação manual

- [ ] Em `/`, as oito peças aparecem a partir da lista estática. A pintura não espera `GET /api/nfts`.
- [ ] A aba, a busca, o filtro, a ordenação e a página do início não consultam a loja.
- [ ] `GET /api/nfts` devolve as oito peças, nesta ordem: Emerald Ape #042, Sage Nomad #009, Neon Vessel #552, Cosmic Bloom #118, Violet Nomad #314, Ivory Baron #088, Golden Beat #207, Golden Signal #160.
- [ ] Neon Vessel #552 traz preço `1.99`, comparação `2.29`, imagem `/home/neon.png` e a marca de raro.
- [ ] `GET /api/nfts/fora-da-semente` responde 404 com a mensagem `NFT não encontrado.`
- [ ] `POST /api/dev/reset`, sem corpo, responde 204. Outro `GET /api/nfts` continua igual à semente.
- [ ] `/nfts/neon-vessel-552` mostra "Detalhe neon-vessel-552" e não desenha a peça.

No DevTools do navegador, com `pnpm dev` aberto:

```js
await fetch('/api/nfts').then((response) => response.json())
await fetch('/api/dev/reset', { method: 'POST' })
```

---

## Comandos

```bash
pnpm install
pnpm dev
pnpm test
```

A prova automática está em `src/mocks/handlers.test.ts`. Cada caso começa na semente. O servidor dessa prova abre e fecha nesse arquivo.

---

## Próxima fase

Link: [`docs/state/PENDENCIAS.md`](../state/PENDENCIAS.md)

Registro objetivo: [`docs/implementation/F2-msw-usuarios-reset-catalogo.md`](../implementation/F2-msw-usuarios-reset-catalogo.md)
