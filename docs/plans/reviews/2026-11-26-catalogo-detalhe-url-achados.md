# Achados: Catálogo e detalhe, estado na URL

- Data: 2026-11-26
- Slug: `catalogo-detalhe-url`
- Plano: `docs/plans/reviews/2026-11-26-catalogo-detalhe-url-plano.md`
- Revisor: contexto limpo, só leitura

1. `GET /api/nfts/:nftId` responde 404 com `{ message: 'NFT não encontrado.' }`. Axios trata status fora de 2xx como falha, e o plano separa a frase de ausência da frase de falha de leitura.
muda a spec: 404 da peça mostra `NFT não encontrado.` A frase `Não foi possível carregar a peça.` fica para a simulação desligada e para as outras falhas.

2. A comparação é pelo nome, sem diferenciar maiúsculas, e `neon` deixa só Neon Vessel #552. Prefixo e contém chegam ao mesmo resultado nesse exemplo.
muda a spec: o recorte precisa ser contém ou prefixo. Com contém, `nomad` deixa Sage Nomad #009 e Violet Nomad #314, e `552` deixa Neon Vessel #552. Com prefixo, esses textos esvaziam a grade.

3. O coração é um `button` com estado local dentro do `article`. O plano transforma o card em link e mantém o coração local.
muda a spec: o clique no coração não abre `/nfts/$nftId` e não altera `q`.

4. O campo fica na casca, em toda rota. O plano diz que ele escreve `q` e que a lupa do desktop abre o campo. Não diz que o texto visível nasce de `q`.
muda a spec: em `/` e em `/nfts/$nftId`, o campo mostra o `q` atual. No desktop, com `q` presente, o campo já aparece aberto. Sem `q`, a lupa é que abre o campo.

5. Cada tecla usa `replace`, e de qualquer tela a busca vai para `/?q=`. O mesmo campo está em `/carrinho` e no detalhe.
muda a spec: definir se a primeira ida de outra rota para `/?q=` substitui a entrada atual. Se substituir, o voltar do navegador não retorna a essa rota.
