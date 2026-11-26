# Spec: Tokens, casca e rotas vazias

- Status: `draft`
- Data: 2026-11-25
- Autonomia: `medium`
- Projeto: Kurio
- Pedido original: primeira fatia da construção. Casca visual medida, com telas nomeadas e miolo vazio. A simulação continua subindo antes da pintura. Nenhuma tela de domínio.
- Plano: `docs/plans/reviews/2026-11-25-tokens-casca-rotas-plano.md`
- Decisão do plano: a seção Decisão está sem item em Entrou e sem item em Saiu. Esta spec repete o plano aprovado.

## 1. Objetivo

A pessoa abre a Kurio e encontra a mesma casca em toda tela nomeada: marca, navegação, busca, carrinho e Entrar, no fundo medido. O miolo mostra só o nome da tela. Um endereço desconhecido explica que a página não existe e oferece voltar ao início. Catálogo, compra, sessão e conta ficam para as fatias seguintes.

## 2. Fora de escopo

- Hero, filtros, grade, abas, paginação, promos, blog e rodapé.
- Barra inferior e cabeçalho de tela do mobile. Modal de entrar e de cadastro.
- Guarda de sessão, busca gravada no endereço, catálogo, detalhe com dado, carrinho com item, cotação, pedido, tempo real, perfil e carteira.
- Peças de diálogo, rótulo de formulário, esqueleto de espera, ícone e arquivo de logo.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

## 3. Atores e pré-condições

- Quem usa: visitante, sem conta.
- O que precisa existir antes: o app abre no navegador. A simulação liga por padrão e desliga pela configuração já existente. As nove cores, a família Roboto Mono e os raios 5, 6 e 15 já foram medidos. O texto "Mock ligado" ainda está na tela atual e sai nesta fatia.

## 4. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. Endereço de tela é o caminho visível no navegador.

### Cenário 1: Início com a casca medida

- Dado: a simulação sobe.
- Quando: a pessoa abre o início (`/`).
- Então: o fundo é `color/ink`. O topo mostra, nesta ordem, a marca `KURIO`, os itens Início, Mercado, Criadores e Aprenda, o campo de busca, o texto Carrinho com um badge 16 x 16 sem dígito, e o botão Entrar. O miolo mostra só a palavra Início, em `color/foreground`. Início está ativo: peso 700, `color/text-accent`, sublinhado de 3 px em `color/primary`. Mercado aponta para o mesmo início e não fica ativo. As frases "Mock ligado" e "Mock desligado" não aparecem. Não há hero, grade, promo, blog nem rodapé.

### Cenário 2: Telas nomeadas, miolo vazio

- Dado: a casca já pintou.
- Quando: a pessoa abre o endereço direto, ou atualiza a página, em qualquer linha abaixo.
- Então: a casca permanece. O miolo mostra só o nome da tela, em `color/foreground`. Na tela dinâmica, o trecho variável do endereço aparece em texto, ao lado do nome. Não aparece dado de NFT, linha de carrinho, cotação, pedido, perfil, carteira ou sessão. Nenhuma dessas telas pede entrada.

| Endereço | Nome no miolo | Texto extra |
| --- | --- | --- |
| `/` | Início | nenhum |
| `/nfts/<identificador>` | Detalhe | o identificador, como veio no endereço |
| `/carrinho` | Carrinho | nenhum |
| `/pagamento` | Revisão e envio | nenhum |
| `/pedidos/<identificador>` | Confirmação | o identificador, como veio no endereço |
| `/entrar` | Entrar | nenhum |
| `/cadastro` | Cadastro | nenhum |
| `/perfil` | Perfil | nenhum |
| `/carteiras` | Carteiras | nenhum |

### Cenário 3: Endereço desconhecido

- Dado: a pessoa pede um caminho que não está na tabela acima.
- Quando: a página abre.
- Então: a casca é a mesma. O miolo mostra a frase "Esta página não existe." em `color/text-coral`, no estilo Body/14 Regular (entrelinha 16, a do texto curto, não a do parágrafo de hero). Há um botão de página "Início": preenchimento `color/primary`, raio 6, rótulo em `color/ink`. O botão leva a `/`, e só então o item Início fica ativo.

### Cenário 4: Navegação do topo

- Dado: a pessoa está em qualquer tela nomeada.
- Quando: ela aciona um item do topo.
- Então:
  - Início abre `/`. O item Início fica ativo. Mercado não fica ativo.
  - Mercado abre `/`. O item Início fica ativo. Mercado não fica ativo em nenhum endereço, inclusive em `/`.
  - Criadores permanece na mesma tela. O endereço não muda. Não aparece mensagem de sucesso.
  - Aprenda permanece na mesma tela. O endereço não muda. Não aparece mensagem de sucesso.
  - Carrinho abre `/carrinho`. Nenhum item da navegação fica ativo. O badge continua sem dígito.
  - Entrar abre `/entrar`.
  - A marca `KURIO` é texto. O clique nela não troca de tela.

### Cenário 5: Busca que ainda não filtra

- Dado: a casca está visível.
- Quando: a pessoa olha ou aciona o campo de busca.
- Então: o campo é somente leitura, com nome acessível "Busca", sem texto de exemplo. O endereço não ganha `q` nem outro parâmetro. A lista de NFTs não existe nesta fatia, então nada é filtrado.

### Cenário 6: Largura

- Dado: as mesmas peças do topo e o mesmo miolo.
- Quando: a largura da janela é 1440 ou maior.
- Então: o recuo horizontal do conteúdo é 120.
- Quando: a largura é menor que 1440, inclusive 768, 414 e 390.
- Então: o recuo horizontal é 28. A página é uma coluna, com as mesmas peças. A navegação pode quebrar linha. Não há barra inferior de abas. O raio 40 não entra: ele é só o frame de telefone medido, e esta fatia não desenha esse frame.

### Cenário 7: Simulação antes da pintura

- Dado: a configuração liga a simulação e ela sobe.
- Quando: a pessoa abre qualquer tela nomeada.
- Então: a casca só aparece depois que a simulação subiu. O miolo não mostra o estado da simulação.
- Dado: a configuração desliga a simulação.
- Quando: a pessoa abre o início.
- Então: a casca aparece do mesmo jeito, sem a frase "Mock desligado".
- Dado: a simulação está ligada e falha ao subir.
- Quando: o app tenta pintar.
- Então: a casca não aparece. A pessoa vê a frase da falha. Não fica uma tela pela metade.

## 5. Regras de negócio

- Regra 1: a casca desta fatia é o topo e o miolo. Promo, blog e rodapé ficam de fora porque o miolo dessas camadas não foi medido.
- Regra 2: só existem as nove cores medidas (`color/ink`, `color/foreground`, `color/primary`, `color/text-accent`, `color/text-secondary`, `color/secondary`, `color/text-coral`, `color/surface-card`, `color/border`). Sem hex novo. Sem `box-shadow`. Heading não tem número medido e não ganha estilo.
- Regra 3: a família é Roboto Mono, pesos 400, 500 e 700, entregue no próprio build. Sem segunda família.
- Regra 4: a marca é o texto `KURIO`, Body/14 Bold, entrelinha 100%, tracking 10%, em `color/foreground`. Não há arquivo de logo.
- Regra 5: item de navegação inativo usa Body Large/16 Regular, entrelinha 100%, em `color/foreground`. O espaço entre os itens é 40. O ativo usa Body Large/16 Bold, entrelinha 100%, em `color/text-accent`, com sublinhado de 3 px em `color/primary`. Esse ativo existe só no item Início, e só em `/`.
- Regra 6: o botão de página tem raio 6, preenchimento `color/primary` e rótulo em `color/ink`. O Entrar do topo mede 100 x 35 e o rótulo usa Body Large/16 Medium, entrelinha 100%. O botão Início da tela desconhecida usa o mesmo tratamento de botão de página.
- Regra 7: o campo tem raio 5, borda de 1 px em `color/border` e nenhum preenchimento inventado. A borda não muda de cor.
- Regra 8: o badge mede 16 x 16, preenchimento `color/primary`, borda de 2 px em `color/ink`, e não mostra dígito. Sem biblioteca de ícone.
- Regra 9: os raios guardados são 5 (campo, e no futuro o botão de modal e o social), 6 (botão de página) e 15 (no futuro, a imagem do card). O 15 não aparece numa peça desta fatia.
- Regra 10: as variáveis visuais da biblioteca de componentes apontam para as cores medidas. A paleta padrão dessa biblioteca não fica visível. Nesta fatia as peças são o botão e o campo. Diálogo, rótulo e esqueleto de espera esperam o frame que for usá-los.
- Regra 11: Início e Mercado caem no mesmo endereço. Mercado não ganha tela própria.
- Regra 12: Criadores e Aprenda ficam visíveis e não navegam. Blog, Activity, Watchlist, Offers, Downloads e Support não são desenhados nesta fatia: o topo medido não os inclui, e o miolo de blog não foi medido.
- Regra 13: a busca não grava parâmetro no endereço. O endereço de busca nasce na fatia do catálogo.
- Regra 14: entrar em modal fica na fatia de sessão. Nesta fatia, Entrar abre a tela vazia `/entrar`.
- Regra 15: quantidade, preço, cotação e pedido não aparecem. ETH e total de fechar não têm regra nova aqui.

## 6. Critérios de Done desta feature

- [ ] Os sete cenários acima passam, observados no navegador (caminho feliz, tela desconhecida, navegação que não sai do lugar, busca sem efeito, largura abaixo de 1440, simulação desligada e falha ao subir a simulação)
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Teste automatizado e Playwright não fazem parte desta fatia. Eles nascem na fatia do mapa.

## 7. Escopo de arquivos permitido

- Pode editar ou criar:
  - `package.json`, `pnpm-lock.yaml`
  - `vite.config.ts`, `tsconfig.app.json`, `components.json`
  - `src/main.tsx` (remover `src/App.tsx`)
  - `src/styles/tokens.css`, `src/styles/globals.css`
  - `src/lib/utils.ts` (só o auxílio de classe do botão e do campo; não vira pasta de helper genérico)
  - `src/components/ui/button.tsx`, `src/components/ui/input.tsx`
  - `src/components/layout/app-shell.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/empty-route.tsx`
  - `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/nfts/$nftId.tsx`, `src/routes/carrinho.tsx`, `src/routes/pagamento.tsx`, `src/routes/pedidos/$pedidoId.tsx`, `src/routes/entrar.tsx`, `src/routes/cadastro.tsx`, `src/routes/perfil.tsx`, `src/routes/carteiras.tsx`
  - `src/routeTree.gen.ts` (gerado, e entra no Git)
- Pode instalar, nesta lista fechada, quando a spec for aprovada:
  - `@tanstack/react-router`, `@tanstack/router-plugin`
  - `tailwindcss`, `@tailwindcss/vite`
  - `class-variance-authority`, `clsx`, `tailwind-merge`
  - `@radix-ui/react-slot`
  - `@fontsource/roboto-mono`
- Restrição do empacotador: o registro das rotas vem antes do React, com divisão por tela ligada. O atalho `@/` vale no empacotador e no `tsconfig.app.json`.
- Não pode editar sem pedido:
  - `src/mocks/**`
  - `src/lib/contracts/**`, `src/lib/api/**`, `src/lib/socket/**`, `src/lib/money.ts`
  - `src/features/**`
  - `.env*`
  - `AGENTS.md`
  - spec já aprovada

## 8. Riscos e dúvidas abertas

- A frase da tela desconhecida e o badge sem dígito não foram lidos no Figma. São composição com peça medida. A aprovação do plano aceita esse texto e esse badge vazio. O chrome do badge (16 x 16, primary, borda 2 px em ink) é a peça medida.
- O plano não diz se a marca abre o início. Esta spec trata `KURIO` como texto, sem navegação.
- Os nomes visíveis "Revisão e envio" e "Confirmação" vêm da tabela de telas já decidida. O endereço continua `/pagamento` e `/pedidos/<identificador>`. Se a aprovação preferir o rótulo "Pagamento" no miolo, a spec muda antes do código.
- Body/14 Regular tem duas entrelinhas medidas (16 no texto curto, 24 no parágrafo de hero). A frase da tela desconhecida usa a entrelinha 16.
- Início e Mercado caem no mesmo endereço. Só Início parece ativo.
- A busca parece um campo de verdade e ainda não filtra.
- Abaixo de 1440 o topo pode quebrar linha. Não há frame dessa casca em 768 nem em 414.
- A ferramenta de estilo ou o tema padrão da biblioteca de componentes pode vazar hex ou sombra. O token medido é a única fonte.
- A entrada do app muda, e a simulação precisa continuar antes da pintura. Os arquivos da simulação não mudam.
- A seção Decisão do plano segue vazia, e o índice de planos ainda marca os achados como pendentes. Nenhum achado de revisão entrou nesta spec.

## 9. Aprovação humana

- Aprovado por:
- Data:
- Observações:
