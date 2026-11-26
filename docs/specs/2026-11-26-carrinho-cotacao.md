# Spec: Carrinho e cotação

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a rota `/carrinho` passa a mostrar as linhas e o resumo do contrato de UI. A cotação, lida da loja, é quem devolve o total de fechar. O visitante guarda um rascunho nesta aba. Na entrada ou no cadastro, a loja soma a quantidade da mesma peça e acrescenta a peça nova. Pagamento, pedido e tempo real ficam fora.
- Plano: `docs/plans/reviews/2026-11-26-carrinho-cotacao-plano.md`
- Decisão do plano: revisão de contexto limpo não foi pedida. Entrou o visitante com rascunho nesta aba. Na entrada ou no cadastro a loja soma a quantidade da mesma peça e acrescenta a peça nova. O rascunho só sai depois do sucesso. Sair não devolve o carrinho da pessoa ao visitante. Saiu o visitante com carrinho vazio sem sessão e escrita só depois da entrada.

## 1. Objetivo

Quem abre `/carrinho` vê as peças que está levando, muda a quantidade e lê o total de fechar na cotação. Sem sessão, esse carrinho é o rascunho da aba. Com sessão, é o carrinho da pessoa na loja. Ada e Bruno continuam com as linhas da semente, cada um com as suas. O pagamento não começa nesta fatia.

## 2. Tela

Contrato de UI do Claude Sonnet 5.5 (`claude-sonnet-5-5-high`), colado na íntegra. O modelo que escreve a spec não reescreve arranjo, cópia nem composição.

PNG:

- `research/figma/desktop-carrinho.png`
- `research/figma/mobile-carrinho.png`


# Contrato de UI: Carrinho (Kurio)

Li os dois PNG. O desktop tem 841 px de largura no arquivo, o que equivale a 1440 na composição (fator 1,71). O mobile tem 414 de largura. Medidas em px abaixo são leitura aproximada do desenho. Onde não dá para ler, o item vai para as Lacunas. Não há número de tamanho de fonte no desenho, então uso só "maior" e "menor" entre elementos.

Arquivos lidos:
- `research/figma/desktop-carrinho.png`
- `research/figma/mobile-carrinho.png`

---

## DESKTOP (1440, padding horizontal 120)

Fundo da página: `ink`. Todo o conteúdo fica numa coluna única de 1200 de largura (120 a 1320). Os blocos aparecem de cima para baixo nesta ordem.

### D1. Cabeçalho (faixa, sem fundo próprio, sem linha inferior visível)
- **Esquerda:** "KURIO", `foreground`, 700, no alinhamento esquerdo dos 1200.
- **Centro:** quatro itens em linha, `foreground` 400:
  - "Início"
  - "Mercado"
  - "Criadores"
  - "Aprenda"
- **Item ativo, "Mercado":**
  - `text-accent`, 500 ou 700.
  - Sublinhado de traço fino em `primary`, abaixo da palavra, com a largura da palavra.
  - Fica a uma pequena distância da palavra.
- **Direita, alinhada ao fim dos 1200**, da esquerda para a direita:
  - Ícone de lupa, `foreground`, contorno.
  - Ícone de carrinho, contorno, com selo circular de `primary` no canto superior direito. O selo traz o texto "0".
  - Botão "Entrar", com fundo `primary`, texto `ink` 700 e ícone de entrada (seta entrando em porta) à esquerda do texto. Raio 6, que é o botão de página.
- Os três grupos ficam na mesma linha horizontal. O centro fica um pouco à esquerda do centro exato da página.

### D2. Corpo em duas colunas (logo abaixo do cabeçalho, com pouco espaço entre eles)
- **Coluna esquerda:** de 120 até cerca de 902, largura aproximada de 780.
- **Coluna direita:** de cerca de 988 até 1320, largura aproximada de 330.
- O vão entre as colunas é de cerca de 85.
- A coluna direita fica fixa na largura. A esquerda ocupa o resto.
- O topo do cabeçalho da tabela e o topo do título "Resumo da carteira" ficam na mesma linha horizontal.

### D3. Coluna esquerda

**Breadcrumb.** Fica acima do cabeçalho da tabela, só nesta coluna.
- Cópia: "Início / Mercado / Carrinho".
- `foreground`, 700, menor que o resto.
- Alinhado à esquerda.

**Cabeçalho da tabela.** Uma linha com quatro rótulos, alinhados à esquerda de cada coluna:
- "NFTs" em x 120.
- "Preço" em cerca de 431.
- "Edições" em cerca de 570.
- "Total" em cerca de 705.
- Peso 500, `foreground`.
- Sob a linha de rótulos há um traço horizontal de 1 px na cor `border`, na largura toda da coluna esquerda.
- Há uma quinta coluna sem rótulo, para a lixeira, perto da borda direita da coluna.

**Linhas de item.** São três, empilhadas, com um espaço pequeno e constante entre elas.
- Cada linha é um card: fundo `surface-card`, largura toda da coluna esquerda, altura baixa (cerca de 68).
- Dentro da linha:
  - Miniatura quadrada à esquerda. Ocupa quase toda a altura, encostada no padding esquerdo da linha. Raio da miniatura: ver Lacunas.
  - À direita da miniatura, duas linhas de texto:
    - O nome, `foreground` 700.
    - O "ID do token", `text-secondary` 400, menor que o nome.
  - Coluna Preço: texto `text-accent` 700, formato "1.19 ETH".
  - Coluna Edições: controle de quantidade, em linha: botão "−", número, botão "+".
    - Os botões são circulares, preenchidos com `primary`, com o sinal em `ink`.
    - O número é `foreground` 400, entre os dois botões.
  - Coluna Total: `text-accent` 700.
  - Ícone de lixeira, contorno, `text-secondary`, no fim da linha.
- Cópia literal das três linhas:

| Linha | Nome | ID do token | Preço | Edições | Total |
| --- | --- | --- | --- | --- | --- |
| 1 | "Emerald Ape #042" | "ID do token: #0042" | "1.19 ETH" | 2 | "2.38 ETH" |
| 2 | "Violet Nomad #314" | "ID do token: #0009" | "1.39 ETH" | 6 | "8.34 ETH" |
| 3 | "Ivory Baron #088" | "ID do token: #0552" | "1.79 ETH" | 9 | "16.11 ETH" |

### D4. Coluna direita (sem card de fundo, só `ink`)
Os blocos aparecem de cima para baixo:
1. **Título** "Resumo da carteira", `foreground` 700. Abaixo dele fica um traço de 1 px em `border`, na largura da coluna.
2. **Rótulo** "Código promocional", `foreground` 700, menor que o título. Alinhado à esquerda.
3. **Campo mais botão, numa única linha, colados:**
   - Campo com fundo `ink`, borda `border`, raio 5, ocupando a maior parte da largura. Placeholder: "Digite o código promocional...", `text-secondary` 400.
   - Botão "Aplicar" encostado na direita do campo, sem vão. Fundo `primary`, texto `ink` 700. A altura é a mesma do campo.
4. **Linhas de totais.** Cada uma tem rótulo à esquerda (`foreground` 400) e valor alinhado à direita (`foreground` 400):
   - "Subtotal", "26.83 ETH"
   - "Desconto do lançamento", "(-) 00.00"
   - "Taxa de rede", "0.016 ETH"
   - Sob o valor da taxa, alinhado à direita, fica o texto "Taxa estimada", menor, em `text-accent`.
5. **Linha final.** O rótulo "Total" é `foreground` 700. O valor "26.846 ETH" é `text-accent` 700 e é o maior valor da coluna.
6. **Botão** "Conectar e finalizar":
   - Largura total da coluna.
   - Fundo `primary`, texto `ink` 700, centralizado. Raio 6.
   - Altura um pouco maior que a do campo.
7. **Link** "Continuar explorando":
   - Centralizado sob o botão.
   - `text-accent` 400, sem sublinhado visível.

### D5. Faixa "Colecionadores também viram"
Ocupa os 1200 de largura. Fica abaixo da área do corpo, com um vão grande (cerca de 60 a 70).
- **Título:** "Colecionadores também viram", `text-accent` 700, alinhado à esquerda. Abaixo dele há um traço de 1 px em `border`, nos 1200.
- **Fila de cinco cards**, de largura igual e com vão pequeno e constante entre eles. Ocupam os 1200 inteiros.
- **Cada card:**
  - Bloco superior com fundo `surface-card`, com padding interno. Dentro dele fica a imagem do NFT, quadrada, com raio 15.
  - Abaixo do bloco, sobre o fundo `ink` e fora dele, o nome em `foreground` 400 e o preço em `text-accent` 700. Ambos alinhados à esquerda do card.
- Cópia:

| Card | Nome | Preço |
| --- | --- | --- |
| 1 | "Cosmic Bloom #118" | "1.29 ETH" |
| 2 | "Violet Nomad #314" | "1.39 ETH" |
| 3 | "Ivory Baron #088" | "1.79 ETH" |
| 4 | "Golden Beat #207" | "0.99 ETH" |
| 5 | "Golden Signal #160" | "0.39 ETH" |

- **Indicadores do carrossel:**
  - Três pontos pequenos, centralizados, abaixo da fila.
  - Os pontos 1 e 3 são anéis só com contorno em `text-accent`.
  - O ponto 2 é preenchido com `primary`, que é o estado ativo.

### D6. Rodapé (largura dos 1200, três faixas empilhadas, sem espaço entre elas)

**Faixa 1: destaques e e-mail.**
- Fundo `surface-card`.
- Quatro colunas lado a lado.
- Entre as colunas há um traço vertical fino.
- Colunas 1 a 3, todas com a mesma estrutura:
  - Círculo cheio em `primary`, com uma letra em `ink` 700, centralizada.
  - Título abaixo do círculo, `foreground` 700.
  - Texto de apoio em `text-secondary` 400, alinhado à esquerda, em várias linhas.
- Cópia:
  - Coluna 1: letra "W", título "Segurança da carteira", texto "Proteja sua carteira e colecione arte digital verificada com confiança."
  - Coluna 2: letra "C", título "Criadores em destaque", texto "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede."
  - Coluna 3: letra "D", título "Alertas de lançamentos", texto "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado."
- Coluna 4:
  - Título "Antecipe-se ao próximo lançamento", `foreground` 700, em duas linhas.
  - Campo mais botão colados, como o do cupom:
    - Campo com placeholder "digite seu e-mail..." em `text-secondary`. Raio 5, fundo mais escuro que a faixa.
    - Botão "Enviar", `primary`, texto `ink` 700.
  - Texto de apoio abaixo: "Receba lançamentos selecionados, histórias de criadores e novidades do mercado." em `text-secondary` 400.

**Faixa 2: contato.**
- Faixa mais baixa, com fundo de tom marrom mais quente que as outras faixas. Ver Lacunas para a cor.
- Quatro colunas alinhadas à esquerda, na mesma linha, com centralização vertical:
  - "KURIO" em `foreground` 700.
  - "Feito para colecionadores, criadores e cultura", em duas linhas, `foreground` 400.
  - "contato@email.com", `foreground` 400.
  - "+55 11 4002 8922", `foreground` 400.

**Faixa 3: links e redes.**
- Fundo `surface-card`.
- Padding interno horizontal maior que o das faixas acima. Quatro colunas.
- Em cada coluna há um título em `foreground` 700 e uma lista vertical de links em `text-secondary` 400, alinhada à esquerda:
  - "Meu perfil": Meu perfil, Minha coleção, Atividade, Estúdio do criador, Lista de interesse.
  - "Central de ajuda": Central de ajuda, Como comprar NFTs, Carteira e segurança, Política do mercado, Denunciar item.
  - "Coleções": Arte digital, Fotografia, Música, Arte 3D, Utilidade.
  - "Redes sociais":
    - Cinco botões quadrados em fila, com contorno em `primary`, ícone em `primary`, raio 5.
    - Ordem dos ícones: f, Instagram, Twitter (pássaro), "in", YouTube.
    - Abaixo, o título "Carteiras compatíveis", `foreground` 700.
    - Abaixo do título, um chip de contorno fino com o texto "METAMASK · WALLETCONNECT · COINBASE". Texto muito pequeno, maiúsculo, `primary`, com tamanho de chip largo.

**Linha final.**
- Fora das faixas, sobre `ink`.
- Texto "© 2026 Kurio. Propriedade digital para todos." em `text-secondary` 400, centralizado.

---

## MOBILE (composição 414; 390 usa a mesma)

O desenho é uma tela de app. Não há cabeçalho de site, breadcrumb, recomendações nem rodapé. Os cantos arredondados externos do PNG pertencem ao frame de telefone (raio 40) e não são bloco da tela.

Fundo: `ink`. A tela tem duas áreas verticais:
- A lista, rolável, no topo.
- O painel do resumo, fixo e encostado no pé da tela, que cobre a parte de baixo da lista.

### M1. Barra de topo (altura baixa, sem fundo próprio)
- **Botão voltar, à esquerda:**
  - Circular, fundo `surface-card` com contorno `border`.
  - Seta "<" em `text-accent`.
  - Padding esquerdo cerca de 28.
- **Título "Carrinho de NFTs":**
  - `foreground` 700, centralizado na tela (não no vão que sobra ao lado do botão).
  - Mesma linha horizontal do botão.

### M2. Lista de itens (abaixo da barra, margem lateral cerca de 28)
Quatro cards empilhados, cada um com largura de cerca de 358 e vão vertical pequeno e constante. A lista continua por baixo do painel (o quarto card é cortado por ele).

**Cada card:**
- Fundo `surface-card`, cantos arredondados (raio do card: ver Lacunas).
- **Esquerda:** imagem do NFT, sangrando a altura toda do card e encostada nas bordas esquerda, superior e inferior. Largura cerca de 100. Raio 15 nos cantos externos esquerdos.
- **Meio, ao lado da imagem, alinhado à esquerda, de cima para baixo:**
  - Nome, `foreground` 700.
  - "Edição: x/y", `text-secondary` 400, menor.
  - Preço, `text-accent` 700, maior que o nome.
- **Direita:** controle de quantidade em linha: botão "−", número, botão "+".
  - Botões circulares. O "+" é preenchido em `primary`. O "−" é preenchido em `primary` no cartão 3 e 4.
  - Nos cartões 1 e 2 (quantidade 1) o "−" aparece apagado, com menos contraste: estado desabilitado.
  - O número fica em `foreground` 400, entre os botões.
  - O controle fica alinhado verticalmente ao centro do card.

| Card | Nome | Edição | Preço | Quantidade |
| --- | --- | --- | --- | --- |
| 1 | "Emerald Ape #042" | "Edição: 1/50" | "1.19 ETH" | 1 |
| 2 | "Violet Nomad #314" | "Edição: 1/1" | "1.39 ETH" | 1 |
| 3 | "Ivory Baron #088" | "Edição: 1/10" | "3.58 ETH" | 2 |
| 4 | "Golden Beat #207" | "Edição: 1/50" | "1.98 ETH" | 2 |

- O desenho do card 3 mostra um ícone de lixeira sobre o botão "+". Ver Lacunas.

### M3. Painel do resumo (fixo no pé, largura total da tela)
- Fundo `surface-card`.
- Cantos superiores bem arredondados. O raio não é um dos medidos. Ver Lacunas.
- Padding horizontal cerca de 24. O conteúdo vai de 24 a 390.

De cima para baixo:
1. **Campo mais botão de cupom, numa linha:**
   - Contêiner com formato de pílula, borda `border`.
   - Placeholder "Digite o código promocional...", `text-secondary` 400, alinhado à esquerda.
   - Botão "Aplicar" dentro do contêiner, encostado à direita, também em pílula, com fundo `primary`. Texto "Aplicar", `ink` 700.
   - O desenho mostra gradiente no botão. Ver Lacunas.
2. **Linhas de totais.** Cada linha tem rótulo à esquerda e valor alinhado à direita, em `foreground` 400:
   - "Subtotal", "8.92 ETH"
   - "Desconto do lançamento", "(-) 00.00"
   - "Taxa de rede", "0.016 ETH"
   - Sob o valor da taxa, alinhado à direita: "Taxa estimada", menor, `text-accent`.
3. **Linha final:** "Total" em `foreground` 700 à esquerda. O valor "8.936 ETH" em `text-accent` 700, o maior valor do painel, à direita.
4. **Botão** "Conectar e finalizar":
   - Largura total do painel (24 a 390).
   - Altura bem maior que a do botão do desktop.
   - Fundo `primary`, texto `ink` 700 centralizado.
   - Formato de pílula e gradiente no desenho. Ver Lacunas.
- Não há link "Continuar explorando" no mobile.

---

## 1. Árvore de blocos, de fora para dentro

### Desktop
```
Página (fundo ink, container 1200, padding horizontal 120)
├─ Cabeçalho
│  ├─ Logo "KURIO"
│  ├─ Nav central (Início, Mercado ativo com sublinhado primary, Criadores, Aprenda)
│  └─ Ações (lupa, carrinho com selo "0", botão "Entrar" raio 6)
├─ Corpo em 2 colunas
│  ├─ Coluna esquerda (~780, flexível)
│  │  ├─ Breadcrumb "Início / Mercado / Carrinho"
│  │  ├─ Cabeçalho de tabela (NFTs, Preço, Edições, Total) + traço border
│  │  └─ Lista de 3 linhas card (surface-card)
│  │     └─ Linha: miniatura, nome + ID do token, Preço, stepper (−, n, +), Total, lixeira
│  └─ Coluna direita (~330, fixa)
│     ├─ Título "Resumo da carteira" + traço border
│     ├─ Rótulo "Código promocional"
│     ├─ Campo (raio 5) + botão "Aplicar" colado
│     ├─ Linhas: Subtotal, Desconto do lançamento, Taxa de rede + "Taxa estimada"
│     ├─ Linha Total (destaque)
│     ├─ Botão "Conectar e finalizar" (raio 6, largura total)
│     └─ Link "Continuar explorando" (centralizado)
├─ Faixa "Colecionadores também viram"
│  ├─ Título + traço border
│  ├─ Fila de 5 cards
│  │  └─ Card: bloco surface-card com imagem raio 15, nome, preço
│  └─ Indicadores (3 pontos, o 2º ativo)
└─ Rodapé
   ├─ Faixa 1 (surface-card): colunas W, C, D, e "Antecipe-se ao próximo lançamento" com campo + "Enviar"
   ├─ Faixa 2 (tom quente): KURIO, frase, e-mail, telefone
   ├─ Faixa 3 (surface-card): Meu perfil, Central de ajuda, Coleções, Redes sociais + Carteiras compatíveis
   └─ Linha final "© 2026 Kurio. Propriedade digital para todos."
```

### Mobile
```
Tela (fundo ink, 414)
├─ Barra de topo
│  ├─ Botão voltar (circular, "<")
│  └─ Título "Carrinho de NFTs" (centralizado)
├─ Lista rolável (margem lateral ~28)
│  └─ Card x4 (surface-card)
│     ├─ Imagem à esquerda (sangra, raio 15 nos cantos externos)
│     ├─ Nome, "Edição: x/y", preço
│     └─ Stepper (−, n, +)
└─ Painel do resumo (fixo no pé, surface-card, padding 24)
   ├─ Campo de cupom com botão "Aplicar" dentro
   ├─ Linhas: Subtotal, Desconto do lançamento, Taxa de rede + "Taxa estimada"
   ├─ Linha Total (destaque)
   └─ Botão "Conectar e finalizar" (largura total)
```

---

## 2. O que muda do desktop para o mobile

- **Casca:**
  - Some o cabeçalho de site: logo, nav, lupa, carrinho, "Entrar".
  - Aparece uma barra de topo com botão voltar circular e o título "Carrinho de NFTs".
  - Some o breadcrumb.
- **Lista:**
  - A tabela com cabeçalho "NFTs / Preço / Edições / Total" vira uma pilha de cards.
  - A imagem passa a ocupar a altura toda do card.
  - O ID do token ("ID do token: #0042") é substituído por "Edição: x/y".
  - A coluna Total por linha some. O Preço mostrado já é o valor da linha (1.19 vezes a quantidade).
  - A lixeira por linha não é desenhada, exceto o ícone sobreposto no card 3.
- **Resumo:**
  - A coluna lateral vira um painel fixo no pé, com largura total, cantos superiores arredondados e fundo `surface-card`.
  - O título "Resumo da carteira" e o rótulo "Código promocional" somem.
  - O cupom passa a ser uma pílula com o botão dentro, em vez de campo mais botão colados.
  - O link "Continuar explorando" some.
  - O botão "Conectar e finalizar" fica maior.
- **Some:** "Colecionadores também viram" com o carrossel e os pontos, o rodapé inteiro e a linha de copyright.
- **Valores:** a lista mostra 4 itens (não 3) e os totais têm outros números (8.92, 8.936). Os números do mobile não conferem com a lista. Ver Lacunas.

---

## 3. O que não construir (não está no PNG)

- Cabeçalho, breadcrumb, recomendações e rodapé no mobile.
- Barra de abas inferior (não aparece no desenho).
- Link "Continuar explorando" no mobile.
- Coluna "Total" por item e cabeçalho de tabela no mobile.
- Lixeira por item em todo item do mobile (só aparece sobreposta no card 3).
- Card de fundo na coluna direita do desktop (ela é só `ink` com traços).
- Estado vazio do carrinho, estado de carregamento, mensagem de erro de cupom, mensagem de cupom aplicado.
- Modal, toast, drawer.
- Imagem dedicada para o link ou o selo de carteiras além do chip de texto.
- Sombra de qualquer tipo.
- Cor, fonte ou raio fora da lista fechada.
- Navegação real nos itens fora de escopo (Criadores, Aprenda, Activity, Watchlist, Offers, Downloads, Support).
- Frame de telefone com raio 40 dentro do app (é só o frame do desenho).

---

## 4. Lacunas (não dá para ler)

**Lacunas no desktop**
1. **Cor da faixa 2 do rodapé.**
   - O tom é mais marrom quente e claro que `surface-card` e parece não ser `border`.
   - Não casa com nenhum token. Decisão humana: qual dos nove tokens usar.
2. **Cor das divisórias verticais da faixa 1.** O tom parece mais claro que `border`. Pode ser `border`, `secondary` ou `primary`.
3. **Raio da miniatura** nas linhas da tabela. Não é um caso medido.
4. **Cor do texto "Taxa estimada".** Li como `text-accent`. Pode ser `primary`.
5. **Cor dos preços "0.99 ETH" e "0.39 ETH"** dos cards 4 e 5 das recomendações. Parecem mais claros que os outros três preços. Li como `text-accent` para todos.
6. **Selo do carrinho "0"** com três itens na lista. A cópia é literal, mas o valor parece inconsistente com a tela.
7. **Cor dos links do rodapé** (`text-secondary` ou `secondary`). Li como `text-secondary`.
8. **Tamanho exato do chip de carteiras e do texto dentro dele.** Texto muito pequeno e pouco legível.
9. **Estado "Mercado" ativo:** não dá para dizer se o peso é 500 ou 700.

**Lacunas no mobile**
10. **Formato de pílula** no campo de cupom, no botão "Aplicar" e no botão "Conectar e finalizar". Isso conflita com as regras fechadas (campo raio 5, botão de página raio 6). Decisão humana: seguir o desenho ou as regras.
11. **Gradiente** no botão "Aplicar" e no botão "Conectar e finalizar". Não existe token de gradiente. Decisão humana: usar `primary` sólido.
12. **Raio dos cards** de item e **raio dos cantos superiores** do painel do resumo. Não são casos medidos.
13. **Ícone de lixeira sobreposto ao botão "+"** no card 3. O desenho não mostra lixeira nos outros cards. Não dá para saber se é um erro do desenho ou um estado.
14. **Significado de "Edição: 1/50"** com quantidade 2 ou 1. No desktop a coluna "Edições" mostra a quantidade. Não dá para reconciliar os dois significados.
15. **Totais do mobile não conferem com a lista.** Os quatro cards somam 8.14 ETH, mas o subtotal é "8.92 ETH" e o total "8.936 ETH". Pode haver itens abaixo da dobra, escondidos pelo painel.
16. **Margem lateral:** os cards usam cerca de 28 e o painel cerca de 24. Não dá para saber se é intencional.
17. **Barra de topo:** não dá para ler a posição horizontal exata do título (centralizado na tela ou no vão ao lado do botão).
18. **Se o painel do resumo cobre sempre o pé** ou se rola com a lista.

**Lacunas gerais**
19. **768:** não há PNG. A regra diz uma coluna e padding horizontal 28. O desenho não diz quais blocos entram (cabeçalho, recomendações, rodapé, painel fixo).
20. **Comportamento dos controles** (mínimo e máximo do stepper, o que a lixeira faz, o que "Aplicar" valida, rolagem do carrossel). Não está no PNG. Fica fora do contrato e vai para a spec como dúvida de comportamento.

## 3. Fora de escopo

- Tela e fluxo de pagamento, além de abrir a rota `/pagamento` que já existe. Esta fatia não muda o miolo dela.
- Pedido, confirmação, recibo e chave de idempotência.
- Favorito guardado.
- Tempo real de preço ou de cotação.
- Guarda na rota `/carrinho`. A rota continua pública.
- Rota ou desenho próprios da cotação.
- Aplicar cupom de verdade, enviar o e-mail do rodapé e trocar a fila do carrossel.
- Estado vazio, carregando, erro de cupom e cupom aplicado desenhados. As frases desta spec aparecem em texto, sem bloco novo no frame.
- Modal, toast e drawer.
- Película, sombra, hex novo, segunda fonte e dependência nova.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- O que a seção Tela marca em "O que não construir".
- Duas abas com a mesma sessão. A última escrita fica. Esta fatia não resolve o conflito.
- Redesenhar o início. No detalhe, entra só o botão de incluir. Na casca, entram o selo e, em `/carrinho` abaixo de 1440, ocultar a barra inferior. O item ativo do topo permanece o que a casca já homologou.

## 4. Atores e pré-condições

- Quem usa: visitante, Ada, Bruno e quem cria conta nesta sessão da loja.
- O que precisa existir antes: a loja simulada já nasce com o catálogo das oito peças, com Ada e Bruno, e com o recomeço que devolve a semente. A sessão da fase anterior já entra, cria conta e sai. `/carrinho` existe, público, com o miolo vazio. O detalhe da peça existe, sem controle de carrinho. A busca a partir do carrinho já grava `q` e o voltar do navegador reabre o carrinho. A simulação liga por padrão e desliga pela configuração já existente.

Preços unitários da semente, em string decimal:

| Peça | Identificador | Preço |
| --- | --- | --- |
| Emerald Ape #042 | `emerald-ape-042` | `1.19` |
| Sage Nomad #009 | `sage-nomad-009` | `1.69` |
| Neon Vessel #552 | `neon-vessel-552` | `1.99` |
| Cosmic Bloom #118 | `cosmic-bloom-118` | `1.29` |
| Violet Nomad #314 | `violet-nomad-314` | `1.39` |
| Ivory Baron #088 | `ivory-baron-088` | `1.79` |
| Golden Beat #207 | `golden-beat-207` | `0.99` |
| Golden Signal #160 | `golden-signal-160` | `0.39` |

Carrinho da semente:

| Pessoa | Linha |
| --- | --- |
| Ada | Sage Nomad #009, quantidade 1 |
| Bruno | Cosmic Bloom #118, quantidade 2 |

Conta nova nasce com carrinho vazio. Violet Nomad #314 está no catálogo e não está na semente de Ada nem na de Bruno.

## 5. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. A cópia e o arranjo são os da seção Tela. Cenário não pede bloco que o contrato marcou como ausente. As três linhas do desktop e os quatro cards do mobile, com os totais `26.846` e `8.936`, são o desenho. A tela pinta o carrinho vivo e a cotação calculada.

A partir de 1440 a composição é a do desktop. Abaixo de 1440, inclusive 768 e 390, a composição é a do mobile. O cabeçalho da casca, com a busca já homologada, permanece nas duas. O estado com sessão aberta não está no PNG. Ele entra aqui porque o plano o pediu.

### Cenário 1: Ada vê o carrinho da semente

- Dado: Ada está na sessão, a loja está na semente e a largura é de 1440 ou mais.
- Quando: ela abre `/carrinho`.
- Então: a casca permanece. Mercado não vira o item ativo. O miolo deixa de ser só a palavra Carrinho. A lista tem uma linha, Sage Nomad #009. Abaixo do nome está `ID do token: sage-nomad-009`. A coluna Preço mostra `1.69 ETH`. A quantidade é 1. A coluna Total mostra `1.69 ETH`. O resumo mostra `Subtotal` `1.69 ETH`, `Desconto do lançamento` `(-) 00.00`, `Taxa de rede` `0.016 ETH`, o texto `Taxa estimada` e `Total` `1.706 ETH`. O selo do carrinho no topo mostra `1`.

### Cenário 2: Bruno não vê o carrinho da Ada

- Dado: Bruno está na sessão e a loja está na semente.
- Quando: ele abre `/carrinho`.
- Então: a lista tem Cosmic Bloom #118, quantidade 2. O preço unitário é `1.29 ETH`. O valor da linha é `2.58 ETH`. O subtotal é `2.58 ETH` e o total é `2.596 ETH`. O selo mostra `2`. Sage Nomad #009 não aparece.

### Cenário 3: O visitante inclui a peça e o rascunho fica nesta aba

- Dado: não há sessão e o rascunho desta aba está vazio.
- Quando: a pessoa abre Emerald Ape #042 e aciona `Incluir no carrinho`.
- Então: a tela da peça continua. Não aparece aviso de sucesso. O selo passa a `1`.
- Quando: ela abre `/carrinho`.
- Então: a lista tem Emerald Ape #042, quantidade 1, preço unitário `1.19 ETH`, valor da linha `1.19 ETH`, subtotal `1.19 ETH` e total `1.206 ETH`.
- Quando: ela atualiza a página.
- Então: a mesma linha continua.
- Quando: outra aba abre `/carrinho` sem sessão.
- Então: essa outra aba não mostra a linha. O rascunho não atravessa a aba.
- Quando: ela fecha a aba e abre uma nova.
- Então: o rascunho se foi. O carrinho do visitante começa vazio.

### Cenário 4: A quantidade muda o valor da linha, o total e o selo

- Dado: o visitante está em `/carrinho` com Emerald Ape #042 na quantidade 1.
- Quando: ele aciona `+`.
- Então: a quantidade fica 2. O valor da linha e o subtotal ficam `2.38 ETH`. O total fica `2.396 ETH`. O selo fica `2`. O desconto continua `(-) 00.00`. A taxa continua `0.016 ETH`.
- Quando: ele aciona `−`.
- Então: a quantidade volta a 1 e os valores voltam aos do cenário 3.

### Cenário 5: A lixeira tira a linha no desktop

- Dado: Ada está na sessão, em `/carrinho`, a 1440, com Sage Nomad #009.
- Quando: ela aciona a lixeira da linha.
- Então: não abre modal. A linha sai. O carrinho fica vazio, como no cenário 7. O selo fica `0`. A loja da Ada fica sem essa linha. Bruno continua com Cosmic Bloom #118.

### Cenário 6: Na quantidade 1 o menos não tira a linha

- Dado: uma linha está com quantidade 1, no desktop ou abaixo de 1440.
- Quando: a pessoa olha o controle.
- Então: `−` está visível e desabilitado. `+` continua habilitado. Acionar `−` não muda a quantidade e não remove a linha.
- Quando: a largura é menor que 1440.
- Então: o card não ganha lixeira. A linha permanece.

### Cenário 7: Carrinho vazio

- Dado: a pessoa está na sessão com carrinho vazio, ou é visitante sem rascunho.
- Quando: ela abre `/carrinho`.
- Então: a lista mostra `Seu carrinho está vazio.` O resumo mostra subtotal `0.00 ETH`, desconto `(-) 00.00`, taxa `0.00 ETH`, `Taxa estimada` e total `0.00 ETH`. O selo mostra `0`. O campo de cupom e o botão `Conectar e finalizar` continuam visíveis.

### Cenário 8: A leitura ainda não voltou

- Dado: a pessoa abriu `/carrinho` e a leitura ainda não voltou.
- Quando: a tela espera.
- Então: a área da lista mostra `Carregando`. O resumo não mostra os números do desenho no lugar da cotação.

### Cenário 9: A leitura falha

- Dado: a simulação está desligada, ou a leitura do carrinho falha.
- Quando: a pessoa abre `/carrinho`.
- Então: a lista mostra `Não foi possível carregar o carrinho.` O resumo não mostra carrinho de outra pessoa. O rascunho do visitante, se havia, continua na aba.

### Cenário 10: A cotação falha e a linha permanece

- Dado: as linhas já apareceram e a cotação falha.
- Quando: a tela pede o total.
- Então: as linhas continuam. O resumo mostra `Não foi possível calcular o total.` A tela não substitui esse total por uma soma feita nela.

### Cenário 11: Falha ao mudar a linha

- Dado: Ada está na sessão com Sage Nomad #009 na quantidade 1.
- Quando: ela aciona `+` ou a lixeira e a loja recusa.
- Então: a quantidade e a linha continuam como estavam. A tela mostra `Não foi possível atualizar o carrinho.`

### Cenário 12: Entrar funde o rascunho

- Dado: não há sessão. O rascunho tem Sage Nomad #009 na quantidade 2 e Emerald Ape #042 na quantidade 1. Ada ainda tem só Sage Nomad #009 na quantidade 1.
- Quando: Ada entra com sucesso.
- Então: a sessão abre. A loja dela fica com Sage Nomad #009 na quantidade 3 e Emerald Ape #042 na quantidade 1, nesta ordem. O subtotal é `6.26 ETH` e o total é `6.276 ETH`. O selo é `4`. O rascunho desta aba fica vazio.
- Quando: ela sai e entra de novo, com o rascunho vazio.
- Então: as quantidades não sobem outra vez.

### Cenário 13: Peça fora do catálogo não entra na fusão

- Dado: o rascunho tem uma peça que não está no catálogo e Golden Signal #160 na quantidade 1. Ada está na semente.
- Quando: Ada entra com sucesso.
- Então: a peça desconhecida não vira linha. A loja dela fica com Sage Nomad #009 na quantidade 1 e Golden Signal #160 na quantidade 1. O subtotal é `2.08 ETH` e o total é `2.096 ETH`. O rascunho fica vazio.

### Cenário 14: Se a fusão falha, o rascunho fica

- Dado: o rascunho tem Emerald Ape #042 na quantidade 1 e Ada está na semente.
- Quando: Ada entra e a gravação das linhas do rascunho falha.
- Então: a sessão de Ada fica aberta. O carrinho dela na loja continua só com Sage Nomad #009. O rascunho continua com Emerald Ape #042. A entrada mostra `Não foi possível guardar o carrinho.` Em `/carrinho`, a lista é a da loja e a mesma frase aparece. A tela não envia o rascunho de novo enquanto essa tentativa não terminou.
- Quando: uma entrada seguinte consegue gravar.
- Então: Emerald Ape #042 entra na loja, o rascunho fica vazio e a frase sai.

### Cenário 15: Criar conta também funde

- Dado: não há sessão e o rascunho tem Violet Nomad #314 na quantidade 1.
- Quando: a pessoa cria a conta da Lia, como na spec de sessão, com sucesso.
- Então: Lia nasce com carrinho vazio e, em seguida, a fusão acrescenta Violet Nomad #314 na quantidade 1. O rascunho fica vazio. O subtotal é `1.39 ETH` e o total é `1.406 ETH`.
- Quando: o rascunho está vazio e a conta nasce.
- Então: o carrinho continua vazio. Não há frase de falha.

### Cenário 16: Sair não devolve o carrinho da pessoa

- Dado: Ada entrou, a fusão esvaziou o rascunho e a loja dela tem as linhas dela.
- Quando: ela aciona `Sair`.
- Então: a sessão acaba. O rascunho continua vazio. O próximo visitante nesta aba vê o carrinho vazio, não o da Ada. O carrinho da Ada continua na loja. O que a tela guardou só para Ada sai, inclusive carrinho e cotação. O catálogo permanece.
- Dado: a fusão tinha falhado e o rascunho ainda tem Emerald Ape #042.
- Quando: Ada sai.
- Então: o rascunho continua com essa peça. A loja da Ada não é copiada para o rascunho.

### Cenário 17: O selo é a soma das quantidades

- Dado: a casca está visível.
- Quando: o carrinho da pessoa, ou o rascunho do visitante, tem quantidades.
- Então: o selo do topo mostra a soma dessas quantidades. Carrinho vazio mostra `0`. O número `5` do início deixa de ser o selo. Abaixo de 1440, nas telas que mostram a barra inferior, o ícone do carrinho mostra a mesma soma. O selo `2` do atalho do meio dessa barra permanece.
- Quando: a pessoa está em `/carrinho` abaixo de 1440.
- Então: essa barra inferior não aparece. O painel do resumo encosta no pé da tela.

### Cenário 18: Cupom, e-mail, carrossel e atalhos fora de escopo

- Dado: `/carrinho` está visível a 1440, com ou sem linhas.
- Quando: a pessoa digita no código promocional e aciona `Aplicar`.
- Então: o desconto continua `(-) 00.00`. O endereço não muda. Não aparece sucesso nem erro de cupom.
- Quando: ela aciona um ponto do carrossel.
- Então: a fila continua os cinco cards, o ponto do meio continua o ativo e não aparece sucesso.
- Quando: ela aciona um card de `Colecionadores também viram`.
- Então: abre a peça daquele card. A fila não muda.
- Quando: ela aciona `Enviar` no rodapé, um botão de rede social, o chip de carteiras, ou um atalho que já não navegava.
- Então: o endereço não muda e não aparece sucesso.
- Quando: ela aciona `Meu perfil` no rodapé.
- Então: o caminho é `/perfil`, como no rodapé do início.

### Cenário 19: Finalizar e continuar explorando

- Dado: o carrinho mostra ao menos uma linha.
- Quando: a pessoa aciona `Conectar e finalizar`.
- Então: o endereço vai para `/pagamento`. O miolo dessa rota não muda nesta fatia. Sem sessão, a guarda que já existe pede a entrada e, depois do sucesso, a fusão do cenário 12 acontece antes de chegar em `/pagamento`. O botão não abre escolha de carteira. O rótulo continua `Conectar e finalizar`.
- Quando: o carrinho está vazio, carregando ou em falha de leitura.
- Então: o botão não abre `/pagamento`.
- Quando: a 1440, a pessoa aciona `Continuar explorando`.
- Então: o endereço vai para `/`.
- Quando: a largura é menor que 1440.
- Então: esse link não está na tela.

### Cenário 20: Abaixo de 1440 a lista é a mesma, no arranjo mobile

- Dado: Ada está na sessão com a semente e a largura é 768 ou 390.
- Quando: ela abre `/carrinho`.
- Então: a página é uma coluna, com padding horizontal 28. A barra do carrinho mostra o voltar e o título `Carrinho de NFTs`, centralizado na tela. A busca da casca continua acima dessa barra. Não há breadcrumb, cabeçalho de tabela, coluna Total, recomendações, rodapé nem copyright. O card mostra a imagem na altura da linha, o nome, o identificador `sage-nomad-009`, o valor da linha `1.69 ETH` no lugar do preço grande e a quantidade 1. `−` está desabilitado. O resumo é o painel fixo no pé, fundo `surface-card`, cantos superiores com raio 15, com os mesmos números do cenário 1.
- Quando: ela aciona o voltar e a visita começou em outra tela.
- Então: essa tela volta.
- Quando: a visita começou em `/carrinho`.
- Então: o voltar vai para `/`.

### Cenário 21: A busca a partir do carrinho continua

- Dado: a pessoa está em `/carrinho`, no desktop ou abaixo de 1440.
- Quando: ela busca `neon`.
- Então: o endereço vai para `/?q=neon` numa entrada nova. O voltar do navegador reabre `/carrinho`. O campo e a lupa seguem a spec do catálogo.

### Cenário 22: A rota continua pública

- Dado: não há sessão.
- Quando: a pessoa abre `/carrinho`.
- Então: a entrada não aparece sozinha. Criadores, Aprenda e os atalhos que já não navegavam continuam sem navegar e sem sucesso.

### Cenário 23: O recomeço devolve o carrinho da semente

- Dado: a loja da Ada foi alterada e Lia existe.
- Quando: a loja recomeça.
- Então: a sessão acaba, como na spec de sessão. Ada volta a Sage Nomad #009 na quantidade 1. Bruno volta a Cosmic Bloom #118 na quantidade 2. Lia deixa de existir. O rascunho da aba não faz parte dessa semente e só some se o mesmo gesto de recomeço o limpar. Esta fatia não cria botão de recomeço.

### Cenário 24: Incluir de novo soma um

- Dado: Emerald Ape #042 já está no carrinho de quem olha, com quantidade 2.
- Quando: a pessoa abre a peça e aciona `Incluir no carrinho`.
- Então: a quantidade fica 3. O botão continua `Incluir no carrinho`.
- Quando: a peça não existe, ainda carrega ou a leitura da peça falhou.
- Então: o botão não aparece.
- Quando: a gravação falha.
- Então: a quantidade continua 2 e a peça mostra `Não foi possível atualizar o carrinho.`

## 6. Regras de negócio

- Regra 1: `/carrinho` é público. A casca permanece, com a busca já homologada. A partir de 1440 o miolo segue o desktop da seção Tela. Abaixo de 1440, inclusive 768 e 390, o miolo segue o mobile da seção Tela, numa coluna, padding horizontal 28. 768 não ganha terceiro desenho. No carrinho abaixo de 1440 a barra inferior da casca fica oculta.
- Regra 2: as linhas do desktop e as do mobile são o mesmo carrinho. O desenho com três linhas e o desenho com quatro cards não são duas lojas. O que cada largura esconde está no cenário 20.
- Regra 3: cada linha guarda o identificador da peça e a quantidade inteira. O preço unitário é o preço atual do catálogo. A linha não congela o preço. A peça não tem número de token nem tiragem. No desktop, a linha secundária é `ID do token:` mais o identificador. Abaixo de 1440, a linha secundária é o identificador, sem o rótulo `Edição:` e sem um total inventado de tiragem.
- Regra 4: a quantidade mínima é 1. `+` soma 1. Não há teto nesta fatia. `−` na quantidade 1 fica desabilitado. A lixeira existe no desktop e remove a linha, sem confirmação. Abaixo de 1440 o card não tem lixeira.
- Regra 5: a cotação usa as linhas e o preço do catálogo. O visitante cota o rascunho. Quem está na sessão cota as linhas da loja. O cálculo é o mesmo. A tela não soma ETH.
- Regra 6: o valor da linha é o preço unitário vezes a quantidade, em soma decimal exata. O subtotal é a soma dos valores das linhas. O desconto desta fatia é zero e aparece como `(-) 00.00`. Com ao menos uma linha, a taxa de rede estimada é `0.016` e o total é o subtotal mais essa taxa, com três casas. Sem linha, subtotal, taxa e total são `0.00`. Os valores de ETH na tela levam o sufixo ` ETH`. O desconto não leva.
- Regra 7: o rascunho do visitante fica no armazenamento desta aba. Atualizar a página mantém. Outra aba não vê. Fechar a aba esquece. A loja não grava linha de visitante. Com sessão, a loja guarda as linhas por pessoa. A chave de carrinho e a de cotação dessa pessoa incluem o identificador dela. Sair apaga essas chaves junto com o restante do que é privado. O rascunho não entra nessa chave.
- Regra 8: na entrada ou no cadastro, depois do sucesso, o rascunho vai para a loja da pessoa. A mesma peça soma as quantidades. Peça nova entra no fim, na ordem do rascunho. Peça fora do catálogo é ignorada. O rascunho só é apagado depois do sucesso. Enquanto a tentativa não termina, não há segundo envio. Falha mantém a sessão aberta, mantém o rascunho e mostra `Não foi possível guardar o carrinho.`
- Regra 9: sair não copia o carrinho da pessoa para o rascunho. Rascunho já vazio continua vazio. Rascunho que a fusão não conseguiu gravar continua. O carrinho da pessoa continua na loja.
- Regra 10: conta nova nasce vazia e depois recebe a fusão, se houver rascunho. O recomeço devolve Ada e Bruno à semente e apaga a conta nova. O rascunho só é limpo no mesmo gesto de recomeço. Esta fatia não cria esse gesto.
- Regra 11: incluir a peça soma 1 no carrinho de quem olha. O controle fica no detalhe, sob o preço, com o rótulo `Incluir no carrinho`, raio 6, fundo `color/primary` sólido e texto `color/ink`. Ele não aparece sem a peça carregada.
- Regra 12: o selo é a soma das quantidades. Vazio mostra `0`. O `5` fixo sai de todas as rotas que usam o selo do topo. O ícone de carrinho da barra inferior, quando a barra está visível, mostra a mesma soma.
- Regra 13: `Aplicar`, `Enviar`, os pontos do carrossel, as redes, o chip de carteiras e os atalhos fora de escopo ficam visíveis. O clique não grava sucesso. O card de recomendação abre a peça. `Continuar explorando` abre `/`. `Conectar e finalizar` abre `/pagamento` só quando a lista já mostra ao menos uma linha.
- Regra 14: campo com raio 5, borda `color/border` e fundo `color/ink`. Botão de página com raio 6 e `color/primary` sólido. Sem pílula, sem gradiente e sem `box-shadow`. Imagem com raio 15. O painel móvel usa raio 15 nos cantos superiores. A faixa de contato do rodapé usa `color/border`. A divisória vertical do rodapé usa `color/primary`. `Taxa estimada` e os cinco preços da recomendação usam `color/text-accent`. Sem hex novo.
- Regra 15: a recomendação é estática, nesta ordem: Cosmic Bloom #118 `1.29 ETH`, Violet Nomad #314 `1.39 ETH`, Ivory Baron #088 `1.79 ETH`, Golden Beat #207 `0.99 ETH`, Golden Signal #160 `0.39 ETH`. O ponto do meio permanece o ativo.
- Regra 16: a tela não fala com o cliente HTTP. Pede o carrinho e a cotação pelo cache de leitura. Componente e gancho não importam o atendimento da simulação. A fusão mora no carrinho. O formulário de entrada só a dispara depois do sucesso.
- Regra 17: as frases são `Carregando`, `Seu carrinho está vazio.`, `Não foi possível carregar o carrinho.`, `Não foi possível calcular o total.`, `Não foi possível atualizar o carrinho.` e `Não foi possível guardar o carrinho.`
- Regra 18: o teste da casca que exige o selo `5` passa a exigir a soma real. No visitante sem rascunho, essa soma é `0`. O teste que exige o miolo de `/carrinho` só com a palavra Carrinho deixa esta rota de fora. A busca a partir do carrinho e o voltar do navegador permanecem. Nenhuma dependência nova.

Lacunas do contrato que esta spec fecha, sem reescrever a seção Tela:

- As linhas e os totais desenhados são amostra. A tela usa a semente, o rascunho e a cotação da regra 6.
- Token e `Edição: x/y` não são campos da peça. Vale a regra 3.
- O selo desenhado `0`, com itens na lista, vira a soma da regra 12. Com carrinho vazio, `0` é a soma.
- Pílula e gradiente do mobile cedem à regra 14.
- A faixa de contato usa `color/border`. A divisória vertical usa `color/primary`. São os tons que o início já usa. Esta fatia não cria cor.
- Miniatura, imagem e cantos superiores do painel móvel usam raio 15. O raio 40 não entra.
- `Taxa estimada` e os preços `0.99 ETH` e `0.39 ETH` ficam em `color/text-accent`.
- A margem abaixo de 1440 é 28 na lista e no conteúdo do painel.
- O título `Carrinho de NFTs` fica centralizado na tela.
- O painel do resumo fica fixo no pé abaixo de 1440.
- 768 usa a composição mobile. Não empilha a tabela, a recomendação nem o rodapé.
- O menos na quantidade 1 fica desabilitado. A lixeira do desktop remove a linha. O ícone de lixeira sobre o `+` de um card do desenho não é controle.
- `Aplicar` não muda o desconto. O carrossel não troca a fila. O card da recomendação abre a peça.
- Tamanho de fonte: a hierarquia do contrato, sem número inventado.
- O peso de Mercado no topo não muda. A casca já homologada permanece: em `/carrinho` nenhum item do topo fica ativo. No início, Início continua ativo.
- Com sessão, o botão do topo continua `Sair`, como a sessão já entregou. O desenho mostra `Entrar` porque não há sessão nele.

## 7. Critérios de Done desta feature

- [ ] A tela entregue segue a seção Tela, com as lacunas fechadas na seção 6
- [ ] Os cenários acima passam
- [ ] A prova automática cobre Ada, Bruno, a soma na fusão, a peça ignorada, o recomeço da semente, a cotação da regra 6 e o rascunho que só sai depois do sucesso
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, em 1440 e em 390: visitante com rascunho, Ada com a semente, fusão somando quantidade, sair sem devolver o carrinho ao visitante. Em 768, a coluna é a do mobile, com padding horizontal 28
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/contracts/cart.ts`, `src/lib/api/cart.ts`, `src/lib/money.ts` se ele nascer, `src/mocks/**` e `src/features/session/auth-form.tsx` fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 8. Escopo de arquivos permitido

- Pode criar ou editar:
  - `src/lib/contracts/cart.ts`
  - `src/lib/money.ts`, só se a soma decimal precisar de helper compartilhado
  - `src/lib/api/cart.ts`
  - `src/lib/query/cart.ts`
  - `src/features/cart/`
  - `src/routes/carrinho.tsx`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/mobile-tabs.tsx`
  - `src/components/layout/app-shell.tsx`, só para ocultar a barra inferior em `/carrinho` abaixo de 1440 e não deixar o respiro dessa barra sobre o painel
  - `src/components/layout/app-shell.test.tsx`
  - `src/features/detail/nft-detail.tsx`
  - `src/features/detail/nft-detail.test.tsx`
  - `src/features/session/auth-form.tsx`, só o bastante para disparar a fusão depois do sucesso
  - `src/features/session/use-end-session.ts`, só se a chave do carrinho ainda sobreviver à limpeza que já apaga toda chave com o identificador da pessoa
  - testes da sessão que precisem afirmar a fusão ou o sair
- Não pode editar sem pedido:
  - `src/routes/pagamento.tsx`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/lib/socket/**`
  - `src/lib/contracts/nft.ts`
  - `src/lib/contracts/session.ts`
  - `src/lib/query/session.ts`
  - `src/styles/tokens.css`
  - `src/features/home/**`
  - `src/features/catalog/**`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - spec já aprovada

`src/mocks/**`, `src/lib/api/**`, `src/lib/contracts/cart.ts`, `src/features/session/auth-form.tsx` e `src/lib/money.ts`, se a soma entrar lá, são path crítico. Entram só com esta spec aprovada e com review humano do diff.

Se ocultar a barra inferior não couber em `app-shell.tsx`, a implementação para e pede aprovação. Não amplia o escopo para o pagamento nem para o pedido.

## 9. Riscos e dúvidas abertas

A seção Decisão do plano entrou com o visitante de rascunho nesta aba e saiu com o visitante de carrinho vazio. O restante desta spec fecha o corpo do plano. Aprovar esta spec adota as lacunas da seção 6.

O contrato e a casca já homologada divergem nestes pontos. A seção Tela permanece a leitura. A implementação segue a seção 6:

- O desenho mobile não tem o cabeçalho do site. A busca a partir do carrinho já está homologada, então o cabeçalho da casca permanece, com a barra `Carrinho de NFTs` abaixo dele.
- O desenho marca Mercado como item ativo. Em `/carrinho`, nenhum item do topo fica ativo.
- O desenho mostra `Entrar`. Com sessão, o topo continua `Sair`.
- O desenho mostra pílula e gradiente. A regra medida vale: raio 5 no campo, raio 6 no botão, cor sólida.
- O rodapé do carrinho repete a cópia do contrato e usa `color/border` e `color/primary`, como o início. O início não é reescrito. O rodapé fica duplicado nesta fatia.
- Abaixo de 1440 não há lixeira. A quantidade 1 permanece até a pessoa remover a linha no desktop, ou até outra ação desta spec tirar a linha.
- Não há teto de quantidade.
- Duas abas com a mesma sessão: a última escrita fica.
- Os totais `26.846` e `8.936` não são fixture. A taxa `0.016` é regra desta fatia, nos dois desenhos o total da amostra é o subtotal desenhado mais essa taxa. No mobile a soma dos quatro cards desenhados não é o subtotal desenhado. A tela ignora essa amostra.

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:
