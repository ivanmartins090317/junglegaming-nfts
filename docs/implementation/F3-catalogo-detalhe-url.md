# Fase 3 · Catálogo e detalhe, estado na URL

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-catalogo-detalhe-url-plano.md` |
| **Spec** | `docs/specs/2026-11-26-catalogo-detalhe-url.md` |

## Objetivo

A grade do início pinta as oito peças da loja. O texto da busca vive no endereço como `q` e recorta a grade pelo começo do nome. O card abre o detalhe da peça. Aba, coleção, rede, faixa de preço, ordenação e página continuam só visuais.

## Entregue

| Área | Arquivos |
| --- | --- |
| Cliente HTTP | `src/lib/api/client.ts`, `src/lib/api/nfts.ts` |
| Cache de leitura | `src/lib/query/nfts.ts` |
| Busca e grade | `src/features/catalog/` |
| Detalhe | `src/features/detail/nft-detail.tsx` |
| Início | `src/features/home/home-market.tsx`, `src/features/home/home-data.ts` |
| Rotas | `src/routes/index.tsx`, `src/routes/nfts/$nftId.tsx` |
| Casca | `src/components/layout/site-header.tsx`, `src/main.tsx` |

A lista estática das oito peças saiu de `home-data.ts`. Artigos, coleções, redes e contagens continuam estáticos. O coração do card é estado local e se perde ao trocar de tela.

### Endereços

- `GET /api/nfts` continua sem filtro. A tela recorta pelo começo do nome.
- `q` vazio não fica no endereço. Em `/` e em `/nfts/$nftId`, o campo mostra o `q` atual.
- A primeira ida de outra tela para `/?q=` cria uma entrada nova. As letras seguintes substituem essa entrada.
- Ausência da peça: `NFT não encontrado.` Falha de leitura da peça: `Não foi possível carregar a peça.` Falha do catálogo: `Não foi possível carregar o catálogo.`

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK, com o aviso já conhecido do oxlint nas rotas que exportam `Route` |
| `pnpm test` | OK, 39 testes |
| `pnpm exec playwright test` | Playwright não está nesta fatia |

No navegador, em `pnpm dev`: `/` mostra as oito peças na ordem da semente. `/?q=neon` e `/?q=NEON` deixam só Neon Vessel #552. `/?q=nomad`, `/?q=552` e `/?q=inexistente` esvaziam a grade. O card abre `/nfts/neon-vessel-552` com `q` preservado. `/nfts/nao-existe` mostra `NFT não encontrado.` Voltar e o voltar do navegador reabrem a grade recortada. No desktop, com `q`, o campo já está aberto, com raio 5 e a borda medida. Sem `q`, a lupa abre o campo. No mobile, `Explorar coleções` grava `q`. Buscar a partir de `/carrinho` cria uma entrada; o voltar do navegador reabre o carrinho.

## Fora desta fase (correto)

- Filtro, ordenação ou página pedidos à loja
- Favorito guardado, carrinho, cotação, pedido, sessão e tempo real
- Playwright, Lighthouse e `ARCHITECTURE.md`

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/03-fase-3-catalogo-detalhe-url.md`](../manual-dev/03-fase-3-catalogo-detalhe-url.md)

## Review humano

O diff pede review humano: `src/lib/api/**` é path crítico. Esta fatia cria o cliente HTTP e a leitura do catálogo e da peça. Contrato, mock, sessão, checkout e pedido não mudam.
