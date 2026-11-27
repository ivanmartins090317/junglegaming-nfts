# Fase 3 · Catálogo e detalhe, estado na URL

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-catalogo-detalhe-url.md` |

## O que esta fase entrega

- A grade do início pede `GET /api/nfts` e desenha as oito peças da loja, na ordem da semente.
- O texto da busca fica no endereço como `q`. A tela recorta pelo começo do nome, sem diferenciar maiúsculas.
- O card abre `/nfts/$nftId`. O detalhe mostra imagem, nome, preço, comparação quando houver, e `RARO` quando a peça for rara.
- Aba, coleção, rede, ordenação e página mudam só o destaque visual.
- A faixa de preço recorta a grade quando a pessoa toca em `Aplicar`. Os limites ficam na barra lateral, em estado local, sem parâmetro no endereço.

Não entrega: favorito guardado, carrinho, cotação, pedido, sessão nem tempo real.

---

## Arquitetura da feature

```text
src/lib/api/client.ts                 # cliente HTTP
src/lib/api/nfts.ts                   # leitura do catálogo e da peça
src/lib/query/nfts.ts                 # cache: ['nfts'] e ['nfts', nftId]
src/features/catalog/                 # q, recorte e grade
src/features/detail/nft-detail.tsx    # miolo da peça
src/features/home/home-market.tsx     # filtros visuais em volta da grade
src/components/layout/site-header.tsx # campo que grava q
```

A tela não chama o cliente HTTP. O componente pede o cache de leitura. O catálogo é público: a chave não inclui usuário.

### Fluxo principal

1. `main.tsx` sobe o cache de leitura e o leitor de `q` como texto puro.
2. Em `/`, a grade espera a loja. Enquanto isso, mostra `Carregando`. O hero, a oferta, os artigos e o rodapé ficam no lugar.
3. Cada letra em `/` substitui a entrada atual. `q` vazio sai do endereço.
4. `neon` e `NEON` deixam só Neon Vessel #552. `sage` deixa só Sage Nomad #009. `nomad`, `552` e um nome que não existe esvaziam a grade e mostram `Nenhuma peça com esse nome.`
5. O card, fora do coração, abre `/nfts/<id>`. Se havia `q`, o mesmo texto segue no endereço. O coração só alterna o estado local.
6. A primeira busca feita em outra tela, como o carrinho, cria uma entrada nova em `/?q=`. O voltar do navegador retorna a essa tela. As letras seguintes substituem a entrada da busca.
7. No detalhe, `q` não esconde a peça. Voltar reabre `/?q=` com o mesmo texto, ou `/` quando não havia busca.
8. Identificador ausente mostra `NFT não encontrado.` Outra falha de leitura mostra `Não foi possível carregar a peça.` Falha do catálogo mostra `Não foi possível carregar o catálogo.`

### Onde a busca aparece

- No mobile, `Explorar coleções` deixa de ser somente leitura e grava `q`.
- No desktop, com `q`, o campo já está aberto no topo, com o ícone à esquerda, raio 5 e a borda medida.
- Sem `q`, a lupa abre o mesmo campo. Não abre modal.

---

## Homologação manual

- [x] Em `/`, as oito peças aparecem nesta ordem: Emerald Ape #042, Sage Nomad #009, Neon Vessel #552, Cosmic Bloom #118, Violet Nomad #314, Ivory Baron #088, Golden Beat #207, Golden Signal #160. (TC-01, 2026-11-27)
- [ ] Neon Vessel #552 mostra `1.99`, `2.29` e `RARO`. O hero, a oferta, os artigos e o rodapé continuam.
- [ ] Digitar `neon` leva a `/?q=neon` e deixa só essa peça. Cada letra substitui a entrada atual.
- [ ] `/?q=nomad`, `/?q=552` e `/?q=inexistente` mostram `Nenhuma peça com esse nome.`
- [ ] Apagar o texto tira `q` do endereço e devolve as oito peças.
- [x] Trocar a aba, a coleção, a rede, a ordenação ou a página não muda a lista nem o endereço. (TC-04, 2026-11-27)
- [x] Ajustar a faixa de preço e tocar `Aplicar` mostra só peças no intervalo. Faixa vazia mostra `Nenhuma peça nessa faixa de preço.` Combina com `q` quando os dois estão ativos. (TC-04, 2026-11-27)
- [x] O card abre `/nfts/neon-vessel-552`. Com `q`, o mesmo texto continua no endereço. (TC-03, 2026-11-27)
- [ ] O coração alterna e a tela não muda de rota.
- [ ] `/nfts/nao-existe` mostra `NFT não encontrado.` e a casca permanece.
- [x] Voltar da peça com `q=neon` reabre a grade recortada. Sem `q`, volta para `/`. (TC-03, 2026-11-27)
- [x] No desktop, com `q`, o campo já está aberto. Sem `q`, a lupa abre o campo. (TC-05, 2026-11-27)
- [x] No mobile, o campo `Explorar coleções` grava `q`. (TC-05, 2026-11-27, `docs/evidencias/tc05-explorar-colecoes.jpeg`)
- [x] Em `/carrinho`, digitar `neon` vai para `/?q=neon` numa entrada nova. O voltar do navegador reabre o carrinho. (TC-03, 2026-11-27)
- [ ] Com `VITE_ENABLE_MOCK=false`, a grade mostra `Não foi possível carregar o catálogo.` e o detalhe mostra `Não foi possível carregar a peça.` O restante do início continua.

---

## Comandos

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
```

A prova da função de recorte está em `src/features/catalog/nfts-by-name-prefix.test.ts`. A grade e o detalhe são provados com a loja simulada em `src/features/catalog/catalog-grade.test.tsx` e `src/features/detail/nft-detail.test.tsx`.

Playwright fica fora desta fatia.
