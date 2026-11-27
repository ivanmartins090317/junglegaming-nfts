# Detalhe da peça alinhado à referência

Tipo: lite
Autonomia: medium
Status: implementado, homologação manual pendente

## Pedido

Ajustar `/nfts/<id>` para seguir fielmente a imagem de referência entregue pelo humano em 2026-11-27 (desktop 1440). A pasta `research/figma/` estava vazia, então a imagem da conversa vale como desenho.

## Decisões do humano

- `COMPRAR` substitui `Incluir no carrinho`, soma ao carrinho e abre `/carrinho`.
- O seletor de quantidade soma a quantidade escolhida (1 a 99).
- O conteúdo extra (descrição, avaliações, edição, token, coleção, atributos, rede, contrato) é dado estático em `src/features/detail/nft-detail-content.ts`. O contrato `Nft` não muda.
- Escopo completo: miolo, `Mercado` ativo no topo em `/nfts/*` e rodapé compartilhado.
- Mobile e tablet: uma coluna com os mesmos blocos.
- `Favoritar` é só visual.

## Divergência declarada de spec aprovada

`docs/specs/2026-11-26-carrinho-cotacao.md`, Regra 11 (rótulo `Incluir no carrinho`, sem navegação) fica superada nesta tela. A spec aprovada não foi editada.

## Checklist

- [x] Trilha `Início / Mercado`. `Mercado` volta à grade preservando `q`.
- [x] Galeria com quatro miniaturas e imagem principal com raio 15, marca `RARO` quando a peça é rara.
- [x] Título, preço, avaliações, `Sobre este NFT:`, edição, quantidade, `COMPRAR`, `Favoritar`, ficha e compartilhar.
- [x] Abas `Detalhes do NFT` e `Avaliações de colecionadores (19)`. A segunda não troca de painel (sem desenho).
- [x] `Mais desta coleção`: as cinco últimas peças do catálogo sem a atual, com pontos decorativos.
- [x] Rodapé extraído para `src/components/layout/site-footer.tsx`. A home segue igual.
- [x] `Mercado` ativo no topo em `/nfts/*`.
- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test` e Playwright (desktop, mobile, mock-off) verdes.

## Pontos que a referência deixa em aberto

- Os rótulos `Contrato:` e `Direitos autorais:` aparecem trocados em relação ao texto na imagem. A tela copia a imagem.
- Os três pontos do carrossel não têm comportamento e o ponto do meio fica ativo, como na imagem.
