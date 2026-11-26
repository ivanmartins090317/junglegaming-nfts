# Achados: Tela de início fiel ao frame

- Data: 2026-11-25
- Slug: `inicio-frame`
- Plano: `docs/plans/reviews/2026-11-25-inicio-frame-plano.md`
- Revisor: contexto limpo, só leitura

1. A spec `docs/specs/2026-11-25-tokens-casca-rotas.md` mantém o cenário 2 com miolo «Início» em `/` e o cenário 6 com o mesmo miolo em qualquer largura; o plano só fala em substituir o cenário 1 e trechos de busca/carrinho. muda a spec: declarar substituto explícito para a linha `/` do cenário 2 e para o critério de largura quando o endereço for `/`.

2. No frame `research/figma/desktop-inicio.png` a busca no topo é ícone de lupa; no código e no cenário 5 da fase 1 a busca é `Input` somente leitura com `aria-label` «Busca». O plano cita SVG e «busca sem gravar `q`», mas não diz que o campo some. muda a spec: definir a peça de busca do header (ícone vs campo), inclusive acessibilidade, e revogar o cenário 5 enquanto valer só para outras telas ou o novo header.

3. `src/components/layout/app-shell.test.tsx` ainda fixa `main p` com «Início» no `it.each` de `/`, no fluxo de 404 que volta ao início, badge de carrinho sem dígito e ordem do header com `INPUT`; o plano cita só ajustar o teste do miolo e do campo. muda a spec: critérios de Done ou cenários que descrevam o miolo de `/` (não mais `EmptyRoute` com parágrafo único) e o badge `0` em qualquer rota com a casca.

4. A regra 8 da fase 1 exige badge 16×16 sem dígito; o plano pede badge `0` e o risco já aponta conflito, mas a substituição anunciada cobre só busca e carrinho nos cenários. muda a spec: revogar ou substituir a regra 8 para o badge do carrinho no header compartilhado.

5. O recorte `research/figma/mobile-inicio.png` traz headline «SEJA DONO DA CULTURA DIGITAL», campo «Explorar coleções», grade em duas colunas e barra inferior; o plano empilha as peças do desktop com recuo 28 e exclui a barra inferior. muda a spec: em larguras abaixo de 1440 (incluindo 390), textos e composição vêm só do desktop empilhado; o PNG mobile não é referência de aceite, salvo o que o plano já fixar (recuo 28, sem barra inferior).
