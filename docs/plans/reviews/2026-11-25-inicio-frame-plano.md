# Plano: Tela de início fiel ao frame

- Status: `decidido`
- Data: 2026-11-25
- Slug: `inicio-frame`
- Autonomia: `medium`
- Spec: (preencher depois, em `docs/specs/2026-11-25-inicio-frame.md`)

## Plano

A rota `/` deixa de mostrar só a palavra Início e passa a seguir o frame desktop `research/figma/desktop-inicio.png` (1440×3668). O header compartilhado também passa a seguir esse frame. A spec nova substitui o cenário 1 e as peças de busca e carrinho da spec `docs/specs/2026-11-25-tokens-casca-rotas.md`. Essa spec antiga não é reescrita neste passo. As outras rotas vazias continuam como estão.

Autonomia `medium`. Não é path crítico.

### Passos

1. Spec nova da tela de início, marcada como substituta do cenário 1 e das peças de busca e carrinho da spec da fase 1. A spec antiga não é reescrita neste passo.
2. Ajustar o header compartilhado para o frame: ícones em SVG no próprio componente, sem biblioteca nova. Busca continua sem gravar `q`. Carrinho abre `/carrinho` e mostra `0`. Entrar abre `/entrar`. Criadores e Aprenda continuam sem navegar. A marca continua sem clique.
3. Montar o miolo só em `/`, em `src/features/home/`, com os textos lidos do frame e as imagens recortadas do PNG local. Preço fica string decimal, como no desenho. Raio 15 na imagem do card. Só as nove cores. Sem sombra.
4. Interação desta fatia é visual. EXPLORAR desce até a grade. Aba, filtro, ordenação e página trocam só o estado visual, sem catálogo e sem URL. Card, artigo, Ler mais, newsletter, redes e links de Blog, Criadores, Aprenda, Activity, Watchlist, Offers, Downloads e Support não navegam e não mostram sucesso. Meu perfil pode ir para `/perfil`, que já existe vazia.
5. Atualizar o teste da casca que hoje exige o miolo "Início" e o campo de busca. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`, e conferir `/` no navegador em 1440 e em 390.

### Arquivos

- Criar ou alterar:
  - `docs/specs/2026-11-25-inicio-frame.md` (no passo da spec, não neste plano)
  - `src/features/home/`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.tsx`
  - `src/routes/index.tsx`
  - `src/components/layout/app-shell.test.tsx`
- Não mexer:
  - `docs/specs/2026-11-25-tokens-casca-rotas.md`
  - `src/mocks/**`
  - `src/lib/contracts/**`
  - `src/lib/api/**`
  - `src/lib/socket/**`
  - `src/lib/money.ts`
  - `src/features/session/**`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `.env*`
  - `AGENTS.md`
  - rotas vazias que não são `/`

### Fora de escopo

- Catálogo de verdade, detalhe com dado e filtro que altera a lista.
- Newsletter que envia.
- Modal de entrar.
- Barra inferior do mobile.
- Qualquer arquivo em `src/mocks/`.

### Riscos

- O tamanho do título do hero não está nos tokens. Na implementação ele entra medido no PNG de 1440, não estimado no olho.
- O badge `0` contradiz o badge vazio da fase 1.
- O frame mobile em `research/figma/mobile-inicio.png` é só o recorte 414×896. Abaixo de 1440 a página empilha as mesmas peças com recuo 28, sem inventar um frame que não existe.

### Paths críticos

- Toca path crítico: não
- Quais: nenhum

## Decisão

O pedido de ajustar a tela agora, seguindo os dois frames, fecha a triagem.

- Entrou: os achados 1 a 4. O miolo de `/` substitui a linha do cenário 2 e o critério de largura da fase 1 quando o endereço é `/`. No desktop a busca é o ícone, sem campo. No mobile a busca é o campo "Explorar coleções", somente leitura. O badge do carrinho no header desktop mostra `5`, como no frame, e vale em qualquer rota com a casca. O teste deixa de exigir o parágrafo único "Início".
- Saiu: o achado 5. O frame mobile é referência abaixo de 1440: hero próprio, grade em duas colunas, barra inferior. Não se empilha a página desktop.
