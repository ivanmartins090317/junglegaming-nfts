# Lighthouse · O que melhoramos

| Campo | Valor |
| --- | --- |
| **Status** | código entregue · recaptura no deploy pendente |
| **Data** | 2026-11-27 |
| **Deploy** | [https://junglegaming-nfts.vercel.app/](https://junglegaming-nfts.vercel.app/) |
| **Regra** | sem mudar o visual: cores, raios, fontes e arranjo do Figma permaneceram |

Meta do enunciado e notas. A captura antiga está em `docs/evidencias/lighthouse.png`. As notas "depois" saíram do Lighthouse mobile contra `http://localhost:5173/` depois destas correções. Recapture no deploy em janela anônima.

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Meta | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 90 |
| Antes (DevTools, deploy) | 99 | 94 | 96 | 90 |
| Depois (local, mobile) | 99 | 100 | 96 | 100 |

## Por que a acessibilidade estava em 94

O Lighthouse mobile na home apontou três auditorias. Nenhuma era contraste de cor. Paleta medida não mudou.

1. **Ordem dos headings.** No mobile a aside do filtro fica `display: none`, então a árvore ia do `h1` do hero para o `h3` do card. Falta um `h2`.
2. **Nome acessível vs texto visível.** O botão da carteira mostra `2` e o atalho do carrinho mostra a quantidade. O `aria-label` era só `Carteira` ou `Carrinho`, sem o número.
3. **Alvo de toque.** Os três pontos do hero mobile tinham 6 px e eram `<button>`. O clique não trocava a imagem.

## O que fizemos

### Acessibilidade (94 → 100)

| Problema | Correção | Arquivo | Visual |
| --- | --- | --- | --- |
| `h1` → `h3` no catálogo mobile | `h2` oculto com `sr-only`: `Catálogo` | `src/features/home/home-market.tsx` | invisível |
| Selo `2` fora do nome | `aria-label="Carteira 2"` | `src/components/layout/mobile-tabs.tsx` | igual |
| Quantidade do carrinho fora do nome | `aria-label={`Carrinho ${cartCount}`}` no topo e nas abas | `src/components/layout/site-header.tsx`, `mobile-tabs.tsx` | igual |
| Pontos de 6 px como botão | viraram `span` decorativo com `aria-hidden`. O estado `slide` não alterava a foto | `src/features/home/home-hero-mobile.tsx`, `home-hero.tsx` | mesmo tamanho e cor |
| Área de toque dos ícones de compartilhar | botão 24 px com margem negativa, ícone no mesmo lugar | `src/features/detail/nft-detail-info.tsx` | igual |

Testes que buscavam `aria-label="Carrinho"` passaram a `aria-label^="Carrinho"`.

### SEO (90 → 100)

| Problema | Correção | Arquivo |
| --- | --- | --- |
| Sem meta description | `Kurio, marketplace de NFTs. Colecione arte digital, explore o catálogo e compre peças com ETH.` | `index.html` |
| `/robots.txt` devolvia o HTML da SPA | `User-agent: *` / `Allow: /` | `public/robots.txt` |
| Canonical ausente | `https://junglegaming-nfts.vercel.app/` | `index.html` |
| `theme-color` | `#140D0A` (token `ink`) | `index.html` |

### Performance (99, já na meta)

Não era o gargalo. Entraram só dicas de LCP, sem redesenhar:

- `rel="preload"` da `/home/hero.png` no `index.html`
- `fetchPriority="high"` e `decoding="async"` na foto do hero desktop e mobile

Não convertemos PNG para WebP para não mexer nos snapshots visuais.

### Best Practices (96, já na meta)

Não alteramos. O Chrome registra `Failed to load resource: 401` em `GET /api/sessao` quando não há sessão. A spec de sessão manda esse 401 para o visitante. Mudar para 200 quebraria o contrato. A nota 96 já atende ≥ 95.

## Arquivos

- `index.html`
- `public/robots.txt`
- `src/features/home/home-hero.tsx`
- `src/features/home/home-hero-mobile.tsx`
- `src/features/home/home-market.tsx`
- `src/features/detail/nft-detail-info.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/mobile-tabs.tsx`
- testes em `src/components/layout/app-shell.test.tsx`, `src/features/cart/*`, `src/features/detail/nft-detail.test.tsx`, `e2e/helpers.ts`
- `README.md`

## Como recapturar no deploy

1. Publicar este commit.
2. Abrir [https://junglegaming-nfts.vercel.app/](https://junglegaming-nfts.vercel.app/) em janela anônima (sem extensão).
3. DevTools → Lighthouse → modo mobile → gerar relatório.
4. Conferir as quatro notas contra a tabela acima.
5. Trocar `docs/evidencias/lighthouse.png` pela captura nova.

Visitante sem login: o 401 de `/api/sessao` no console é esperado. Recarregar a página encerra a sessão.

Ada: `ada@kurio.test` / `kurio`. Bruno: `bruno@kurio.test` / `kurio`.
