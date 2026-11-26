# Plano: Catálogo e detalhe, estado na URL

- Status: `done`
- Data: 2026-11-26
- Slug: `catalogo-detalhe-url`
- Autonomia: `tight`
- Spec: `docs/specs/2026-11-26-catalogo-detalhe-url.md`

## Plano

A grade do início passa a ler `GET /api/nfts`. O card abre `/nfts/$nftId`, e essa rota pinta a peça de `GET /api/nfts/:nftId`. O texto da busca vive no endereço como `q`. A lista de oito peças continua vindo inteira da loja. O recorte por nome acontece na tela. Aba, coleção, rede, faixa de preço, ordenação e página permanecem só visuais: a semente não tem campo para elas, e a spec da fase 2 impede a loja de filtrar.

Decisões deste plano:

- O contrato `Nft` não muda. `GET /api/nfts` e `GET /api/nfts/:nftId` continuam como na fase 2. Ausência segue 404 com `NFT não encontrado.`
- A busca grava `q` na rota `/`. Valor vazio sai do endereço. Cada tecla substitui a entrada atual (`replace`), sem empilhar uma entrada por letra. A comparação é pelo nome, sem diferenciar maiúsculas. `neon` deixa só Neon Vessel #552. Nome que não existe esvazia a grade e mostra `Nenhuma peça com esse nome.`
- No mobile, o campo `Explorar coleções` deixa de ser somente leitura e escreve `q`. No desktop, a lupa abre esse mesmo campo no topo, com o ícone à esquerda, raio 5 e borda medida. Sem modal e sem painel novo. De qualquer tela, buscar leva a `/?q=`.
- `q` também viaja em `/nfts/$nftId`, sem filtrar a peça. O link Voltar reabre `/?q=` com o mesmo texto. Abrir o detalhe direto, sem `q`, volta para `/`.
- O card da grade é um link para o detalhe. O detalhe mostra imagem, nome, preço, comparação quando houver, e `RARO` quando a peça for rara. Identificador ausente mostra `NFT não encontrado.` A casca permanece.
- Enquanto a leitura não volta, a grade ou o detalhe mostram `Carregando`. Se a simulação estiver desligada ou a leitura falhar, mostram `Não foi possível carregar o catálogo.` ou `Não foi possível carregar a peça.` Hero, promo, blog e rodapé continuam estáticos.
- O coração do card continua local, sem pedido e sem rollback. Não há sessão nesta fatia.
- Dependências pedidas, da stack já fechada: `axios` e `@tanstack/react-query`. Nenhuma outra.

### Passos

1. Instalar `axios` e `@tanstack/react-query` depois da spec aprovada. Subir o cliente HTTP e o cache no arranque. Componente não chama Axios. Chave do catálogo: `['nfts']`. Chave da peça: `['nfts', nftId]`. Catálogo é público, sem usuário na chave.
2. Na rota `/`, validar `q` opcional. A grade deixa `homeNfts` e passa a pintar a resposta da loja, recortada por `q` numa função pura. Aba, coleção, rede, preço, ordenação e página seguem estado local e não alteram a lista nem o endereço.
3. O campo de busca e a lupa do desktop passam a gravar `q`. O teste da casca que hoje exige busca somente leitura é substituído por este comportamento.
4. A rota `/nfts/$nftId` deixa o miolo vazio. Lê a peça, mostra os campos acima, ou a frase de ausência. `q` opcional só serve para o Voltar.
5. Testar a função do recorte por nome. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador: `/`, `/?q=neon`, `/?q=inexistente`, `/nfts/neon-vessel-552`, `/nfts/nao-existe`, e Voltar com `q` preservado. Conferir o campo no desktop e no mobile.

### Arquivos

- Criar ou alterar:
  - `package.json`, `pnpm-lock.yaml`
  - `src/main.tsx`
  - `src/lib/api/client.ts`
  - `src/lib/api/nfts.ts`
  - `src/lib/query/nfts.ts`
  - `src/features/catalog/` (recorte por nome e grade ligada à loja)
  - `src/features/detail/`
  - `src/features/home/home-market.tsx`
  - `src/features/home/home-data.ts` (a lista estática das oito peças sai; artigos, coleções e redes ficam)
  - `src/routes/index.tsx`
  - `src/routes/nfts/$nftId.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.test.tsx`
- Não mexer:
  - `src/mocks/**`
  - `src/lib/contracts/**`
  - `src/lib/socket/**`
  - `src/lib/money.ts`
  - `src/features/session/**`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/features/home/home-hero.tsx`
  - `src/features/home/home-lower.tsx`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

### Fora de escopo

- Filtro, ordenação ou página na loja. `GET /api/nfts` segue sem query.
- Aba, coleção, rede, faixa de preço, ordenação e número de página no endereço.
- Favorito persistido, carrinho, cotação, pedido, sessão e socket.
- Campo novo no contrato do NFT (coleção, rede, data).
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- O topo desktop medido tem só a lupa. O campo que a lupa abre muda esse frame. Se recusado, a busca que grava `q` fica só no mobile e a lupa desktop continua sem efeito.
- Aba, filtro, ordenação e página continuam sem efeito na lista. Colocar isso no endereço sem dado na semente só restauraria um destaque visual.
- A tela de detalhe não tem frame. A composição usa os campos do card e as cores já medidas.
- Com a simulação desligada, a grade e o detalhe ficam na frase de falha. O restante da página de início continua.
- `homeNfts` e a semente deixam de ser duas fontes da grade. Artigos e contagens de filtro continuam estáticos.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/lib/api/**`, arquivo novo. Contrato, mock, sessão, checkout e pedido ficam de fora.

## Decisão

Triagem em 2026-11-26. A spec `docs/specs/2026-11-26-catalogo-detalhe-url.md` permanece `draft` até aprovação explícita.

- Entrou: o recorte compara o começo do nome, sem diferenciar maiúsculas. `nomad` e `552` esvaziam a grade. Em `/` e no detalhe, o campo mostra o `q` atual. No desktop, com `q` presente, o campo já abre. Sem `q`, a lupa abre o campo. A primeira ida de outra tela para `/?q=` cria uma entrada nova. O voltar do navegador retorna a essa tela. As letras seguintes substituem a entrada da busca.
- Saiu: recorte por trecho no meio ou no fim do nome. Lupa como único jeito de ver o campo quando `q` já está no endereço. Primeira ida para `/?q=` substituindo a tela de origem.
