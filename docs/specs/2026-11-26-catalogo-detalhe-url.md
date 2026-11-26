# Spec: Catálogo e detalhe, estado na URL

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a grade do início passa a mostrar as peças da loja. O card abre o detalhe da peça. O texto da busca vive no endereço e recorta a grade pelo nome. Aba, coleção, rede, faixa de preço, ordenação e página continuam só visuais.
- Plano: `docs/plans/reviews/2026-11-26-catalogo-detalhe-url-plano.md`
- Decisão do plano: triagem de 2026-11-26. Entrou o recorte só no começo do nome, o campo que mostra `q` e já abre no desktop quando `q` existe, e a primeira ida a `/?q=` que deixa o voltar do navegador retornar à tela anterior. Saiu o recorte por trecho no meio do nome, a lupa como único jeito de ver o campo com `q` presente, e a primeira ida substituindo a tela de origem.

## 1. Objetivo

Quem abre o início vê as oito peças da loja, na ordem da semente. Quem digita um nome recorta essa grade e leva o texto no endereço. Quem escolhe um card abre a peça, com imagem, nome, preço e os sinais que a peça já tem. A casca permanece. O restante do início continua estático.

## 2. Fora de escopo

- Filtro, ordenação ou página pedidos à loja. A leitura do catálogo continua sem recorte no pedido.
- Aba, coleção, rede, faixa de preço, ordenação e número de página no endereço.
- Favorito guardado, carrinho, cotação, pedido, sessão e tempo real.
- Campo novo na peça (coleção, rede, data). O formato da peça não muda.
- Contrato da peça, simulação, dinheiro, socket, sessão, checkout e pedido.
- Hero, oferta em destaque, artigos e rodapé.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- Dependência além do cliente HTTP e do cache de leitura já previstos na stack.

## 3. Atores e pré-condições

- Quem usa: visitante, sem conta. Não há sessão nesta fatia.
- O que precisa existir antes: a loja simulada já devolve as oito peças e, para um identificador ausente, a frase `NFT não encontrado.` A grade do início ainda sai da lista estática. A rota da peça existe com o miolo vazio. O campo `Explorar coleções` no mobile é somente leitura. No desktop, a busca é só a lupa. A simulação liga por padrão e desliga pela configuração já existente.

## 4. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. O texto da busca no endereço se chama `q`. Preço é a string decimal da peça. A lista de referência são as oito peças da semente, na ordem já definida.

### Cenário 1: A grade nasce da loja

- Dado: a simulação está ligada e a loja está na semente.
- Quando: a pessoa abre `/`.
- Então: a grade mostra as oito peças, nesta ordem: Emerald Ape #042, Sage Nomad #009, Neon Vessel #552, Cosmic Bloom #118, Violet Nomad #314, Ivory Baron #088, Golden Beat #207, Golden Signal #160. Cada card repete nome, preço, imagem, preço de comparação só quando a peça tiver, e a marca `RARO` só quando a peça for rara. O destaque do topo, a oferta, os artigos e o rodapé continuam os de sempre.

### Cenário 2: Busca que encontra uma peça

- Dado: a pessoa está em `/` e a grade mostra as oito peças.
- Quando: ela digita `neon` no campo de busca.
- Então: o endereço fica `/?q=neon`. A grade mostra só Neon Vessel #552. O texto precisa ser o começo do nome, sem diferenciar maiúsculas. `NEON` também deixa só essa peça. `sage` deixa só Sage Nomad #009. Já na busca do início, cada letra substitui a entrada atual. Não nasce uma entrada nova por letra.

### Cenário 3: Busca vazia

- Dado: o endereço é `/?q=neon`.
- Quando: a pessoa apaga o texto.
- Então: `q` sai do endereço e a grade volta às oito peças.

### Cenário 4: Nome que não existe

- Dado: a pessoa está na grade.
- Quando: o texto de `q` não é o começo do nome de nenhuma das oito peças.
- Então: a grade fica vazia e a tela mostra `Nenhuma peça com esse nome.` `nomad` e `552` esvaziam a grade. Sage Nomad #009 e Neon Vessel #552 ficam de fora nesses dois textos.

### Cenário 5: Controles visuais não recortam

- Dado: a grade está visível, com ou sem `q`.
- Quando: a pessoa muda a aba, a coleção, a rede, a faixa de preço, a ordenação ou o número da página.
- Então: a lista desenhada não muda por causa desse controle. O endereço não ganha esses valores. O destaque visual do controle pode mudar.

### Cenário 6: O card abre a peça

- Dado: Neon Vessel #552 está na grade.
- Quando: a pessoa aciona o card, fora do coração.
- Então: o endereço vai para `/nfts/neon-vessel-552`. Se havia `q`, o mesmo texto segue nesse endereço.

### Cenário 7: O coração fica no card

- Dado: um card está na grade e o coração dele está livre.
- Quando: a pessoa aciona o coração.
- Então: o coração alterna o estado local de salvo. A tela não abre a peça. `q` não muda. Não há pedido à loja e não há desfazer por falha. Trocar de tela esquece esse estado.

### Cenário 8: Peça que existe

- Dado: a simulação está ligada.
- Quando: a pessoa abre `/nfts/neon-vessel-552`.
- Então: a casca permanece. O miolo mostra a imagem, o nome Neon Vessel #552, o preço `1.99`, o preço de comparação `2.29` e a marca `RARO`. A composição usa as cores e os raios já medidos. Não há frame novo.

### Cenário 9: Peça que não existe

- Dado: a simulação está ligada.
- Quando: a pessoa abre `/nfts/nao-existe`.
- Então: a casca permanece e o miolo mostra `NFT não encontrado.` Não mostra `Não foi possível carregar a peça.`

### Cenário 10: A leitura ainda não voltou

- Dado: a pessoa abriu a grade ou uma peça e a leitura ainda não voltou.
- Quando: a tela espera a loja.
- Então: a grade ou o miolo da peça mostra `Carregando`. O destaque, a oferta, os artigos e o rodapé do início continuam no lugar.

### Cenário 11: A leitura falha

- Dado: a simulação está desligada, ou a leitura do catálogo ou da peça falha por outro motivo que não seja a ausência da peça.
- Quando: a pessoa abre `/` ou uma peça.
- Então: a grade mostra `Não foi possível carregar o catálogo.` O miolo da peça mostra `Não foi possível carregar a peça.` O restante do início continua.

### Cenário 12: A busca acompanha a peça e o Voltar devolve

- Dado: a pessoa chegou ao detalhe com `q=neon`.
- Quando: ela olha a peça e depois aciona Voltar.
- Então: `q` não esconde nem troca a peça. Voltar reabre `/?q=neon` e a grade recortada por esse texto.

### Cenário 13: Detalhe aberto sem busca

- Dado: a pessoa abre `/nfts/neon-vessel-552` direto, sem `q`.
- Quando: ela aciona Voltar.
- Então: o endereço volta para `/` e a grade mostra as oito peças.

### Cenário 14: Onde a busca é digitada

- Dado: a casca está visível em `/` ou no detalhe da peça.
- Quando: existe `q`.
- Então: o campo mostra esse texto. No mobile, `Explorar coleções` deixa de ser somente leitura e grava `q`. No desktop, o campo já está aberto no topo, com o ícone à esquerda, raio 5 e a borda medida.
- Quando: não existe `q` e, no desktop, a pessoa aciona a lupa.
- Então: o mesmo campo abre no topo. Não abre modal nem painel novo.
- Quando: a pessoa busca a partir de outra tela, como o carrinho ou o detalhe.
- Então: a busca leva a `/?q=` com o texto digitado.

### Cenário 15: O voltar do navegador devolve a tela de origem

- Dado: a pessoa está numa tela que não é a busca do início, como `/carrinho` ou o detalhe de uma peça.
- Quando: ela digita `neon` no campo.
- Então: o endereço vai para `/?q=neon` numa entrada nova. As letras seguintes substituem essa entrada da busca. Não fica uma entrada por letra.
- Quando: ela aciona o voltar do navegador.
- Então: a tela anterior volta. O carrinho reabre o carrinho. O detalhe reabre a peça de onde a busca saiu.

## 5. Regras de negócio

- Regra 1: a grade deixa a lista estática e passa a pintar a resposta da loja. Artigos, coleções, redes e as contagens ao lado dos filtros continuam estáticos.
- Regra 2: a loja entrega as oito peças inteiras. O recorte por nome acontece na tela, numa função pura, só pelo começo do nome, sem diferenciar maiúsculas. Trecho no meio ou no fim do nome não entra.
- Regra 3: `q` vazio não fica no endereço. Em `/` e no detalhe, o campo mostra o `q` atual. No desktop, com `q`, o campo já abre. Sem `q`, a lupa abre o campo. `q` na peça não filtra a peça. Serve para o campo e para o Voltar.
- Regra 4: a primeira ida de outra tela para `/?q=` cria uma entrada nova no navegador. O voltar do navegador retorna a essa tela. As letras seguintes substituem a entrada da busca.
- Regra 5: aba, coleção, rede, faixa de preço, ordenação e página são estado local da tela. Não alteram a lista nem o endereço.
- Regra 6: ausência da peça e falha de leitura são frases diferentes. Ausência é `NFT não encontrado.` Falha é `Não foi possível carregar a peça.` No catálogo, a falha é `Não foi possível carregar o catálogo.`
- Regra 7: o coração do card é local. Não há sessão, pedido nem restauração.
- Regra 8: a leitura do catálogo é pública. Não depende de quem está olhando. A leitura da peça depende só do identificador.
- Regra 9: componente de tela não fala com o cliente HTTP. A tela pede o catálogo e a peça pelo cache de leitura.
- Regra 10: o teste da casca que exige a busca somente leitura passa a cobrir este comportamento.
- Regra 11: as dependências novas são só `axios` e `@tanstack/react-query`, instaladas depois desta spec aprovada.

## 6. Critérios de Done desta feature

- [ ] Os cenários acima passam
- [ ] A função pura do recorte por nome tem teste unitário
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador: `/`, `/?q=neon`, `/?q=nomad`, `/?q=552`, `/?q=inexistente`, `/nfts/neon-vessel-552`, `/nfts/nao-existe`, Voltar da peça com `q` preservado, campo do desktop já aberto quando `q` existe, e voltar do navegador devolvendo a tela de onde a busca saiu. O campo foi conferido no desktop e no mobile
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/api/**` fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 7. Escopo de arquivos permitido

- Pode criar ou editar:
  - `package.json`
  - `pnpm-lock.yaml`
  - `src/main.tsx`
  - `src/lib/api/client.ts`
  - `src/lib/api/nfts.ts`
  - `src/lib/query/nfts.ts`
  - `src/features/catalog/`
  - `src/features/detail/`
  - `src/features/home/home-market.tsx`
  - `src/features/home/home-data.ts`
  - `src/routes/index.tsx`
  - `src/routes/nfts/$nftId.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.test.tsx`
- Não pode editar sem pedido:
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
  - spec já aprovada

`src/lib/api/**` é path crítico. Entra só com esta spec aprovada e com review humano do diff.

## 8. Riscos e dúvidas abertas

As três dúvidas que bloqueavam a implementação foram respondidas em 2026-11-26. O recorte é só o começo do nome. O campo mostra `q` e, no desktop, já abre quando `q` existe. A primeira ida a `/?q=` deixa o voltar do navegador retornar à tela anterior.

- O campo no topo desktop muda o frame medido, que hoje só tem a lupa. Isso foi aceito: com `q`, o campo já está aberto. Sem `q`, a lupa abre o campo.
- Aba, filtro, ordenação e página continuam sem efeito na lista.
- A tela de detalhe não tem frame. A composição usa os campos do card e as cores já medidas.
- Com a simulação desligada, a grade e o detalhe ficam na frase de falha. O restante do início continua.
- A grade deixa de ter duas fontes. A lista estática das oito peças sai. Artigos e contagens de filtro continuam estáticos.

## 9. Aprovação humana

- Aprovado por:
- Data:
- Observações:
