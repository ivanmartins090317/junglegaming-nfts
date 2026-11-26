# Plano: Carrinho e cotação

- Status: `done`
- Data: 2026-11-26
- Slug: `carrinho-cotacao`
- Autonomia: `tight`
- Spec: ainda não escrita
- Frames: `research/figma/desktop-carrinho.png`, `research/figma/mobile-carrinho.png`
- Contrato de UI: [Contrato de UI da tela](55a1be96-fb2e-40d8-b879-89cb45b89d61), colado na íntegra abaixo
- Revisão de contexto limpo: não pedida neste turno

## Plano

Uma fatia só. A rota `/carrinho` segue o contrato de UI abaixo. Cotação não é tela e não tem PNG: é a leitura que devolve o total de fechar (subtotal, desconto, taxa de rede e total) a partir das linhas e do preço do catálogo. Pagamento, pedido e socket ficam fora.

Decisões deste plano:

- A parte de UI é o contrato colado na seção Contrato de UI. A implementação não reescreve região, cópia nem bloco.
- Cotação entra na mesma fatia, como dado do resumo (`Subtotal`, `Desconto do lançamento`, `Taxa de rede`, `Taxa estimada`, `Total`). ETH continua string decimal. Quantidade continua inteiro. O total de fechar vem dessa cotação, não de soma feita só na tela.
- `/carrinho` continua público. Sem guarda de rota.
- Visitante é a opção B. Sem sessão, as linhas ficam no `sessionStorage` desta aba. Atualizar a página mantém o carrinho do visitante. Outra aba não compartilha esse rascunho. A loja simulada não grava linha de visitante.
- Na entrada ou no cadastro, com sucesso, o cliente envia essas linhas para a loja da pessoa e depois esvazia o `sessionStorage`. Peça que já está no carrinho da pessoa soma as quantidades (inteiros). Peça nova entra como linha. Peça que não existe no catálogo é ignorada. Se a fusão falhar, o rascunho permanece e a tela mostra a falha. Um segundo sucesso não soma de novo, porque o rascunho já foi apagado.
- Sair não copia o carrinho da pessoa de volta para o visitante. O rascunho fica vazio. O carrinho da pessoa continua na loja.
- Com sessão, a loja viva guarda as linhas por pessoa. Ada e Bruno leem a semente. Conta nova continua com carrinho vazio até a fusão, se houver rascunho. `POST /api/dev/reset` devolve o carrinho da loja ao fixture. O rascunho do navegador só some se o cliente limpar o `sessionStorage` no mesmo gesto de reset.
- Cotação do visitante usa as linhas do rascunho. Cotação de quem está na sessão usa as linhas da loja. As duas passam pelo mesmo cálculo no mock. A tela não soma ETH por conta própria.
- Cache do carrinho e da cotação de quem está na sessão inclui o identificador da pessoa. Sair apaga esse cache junto com o restante do cache privado. O rascunho do visitante não entra nessa chave.
- O selo do carrinho no header deixa o `5` fixo e passa a mostrar a quantidade real (o contrato desktop desenha o selo `0`; o número vivo entra como comportamento, não como cópia decorativa).
- Sem socket nesta fatia. Cupom, newsletter, carrossel e links fora de escopo ficam visíveis como no contrato e não gravam sucesso.
- 768 não tem PNG. A regra já fechada vale: uma coluna, padding horizontal 28. Quais blocos do desktop cabem nessa largura fica para a spec, sem inventar composição.

### Passos

1. Gravar contrato de linha, carrinho enriquecido e cotação. A cotação devolve subtotal, desconto, taxa e total em string decimal.
2. A loja viva lê e escreve o carrinho de quem está na sessão. A cotação aceita as linhas da loja ou, sem sessão, as linhas enviadas no corpo. Reset devolve a semente. Teste de handler cobre Ada, Bruno, a soma na fusão e o reset.
3. Rascunho do visitante no `sessionStorage`. Cliente HTTP e cache com chave privada para quem está na sessão. Entrar e criar conta disparam a fusão e só então apagam o rascunho. Sair limpa a chave privada e não restaura rascunho.
4. Trocar o miolo de `/carrinho` pelo contrato de UI, desktop e mobile. Estados de lista vazia, carregando e falha de leitura entram como comportamento, porque o PNG não desenha esses estados.
5. O selo do header (e o do mobile, se a casca já tiver o ícone) lê a mesma quantidade. Busca a partir do carrinho continua como já homologado.
6. Ajustar testes da casca, dos handlers e da fusão. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, em 1440 e em 390: visitante com rascunho, Ada com a semente, fusão somando quantidade, sair sem devolver o carrinho ao visitante.

### Arquivos

- Criar ou alterar:
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
  - `src/components/layout/mobile-tabs.tsx`, se o selo do carrinho existir nessa barra
  - `src/components/layout/app-shell.test.tsx`
  - `src/features/detail/nft-detail.tsx`, só se a spec aprovada pedir incluir a peça a partir do detalhe
  - `src/features/cart/guest-cart.ts`
  - `src/features/session/auth-form.tsx`, só o bastante para fundir o rascunho depois do sucesso
  - `src/features/session/use-end-session.ts`, só o bastante para limpar a chave do carrinho ao sair
- Não mexer:
  - `src/routes/pagamento.tsx`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/lib/socket/**`
  - `src/lib/contracts/nft.ts`
  - `src/lib/contracts/session.ts`
  - `src/styles/tokens.css`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

### Fora de escopo

- Tela e fluxo de pagamento.
- Pedido, confirmação, recibo e chave de idempotência.
- Favorito persistido.
- Socket de preço ou de cotação.
- Guarda na rota `/carrinho`.
- Rota ou PNG de cotação.
- Aplicar cupom de verdade, enviar e-mail do rodapé, rolar o carrossel além do que o PNG mostra como estático.
- Estado vazio, carregando, erro de cupom e cupom aplicado desenhados (o PNG não tem; a spec só cobre o mínimo de leitura vazia e falha).
- Dependência nova. Hex novo. `box-shadow`.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- O que o contrato marca em "O que não construir".

### Riscos

- A opção A saiu. A fusão no login toca `src/features/session/**`. Um duplo envio antes de apagar o rascunho somaria a quantidade duas vezes. O cliente apaga o rascunho só depois da resposta de sucesso.
- O frame de início fixou o selo em `5`. O contrato do carrinho desenha `0` com itens na lista. O plano usa a quantidade real. A cópia `5` e a cópia `0` deixam de ser decoração.
- Os totais desenhados (26.846 no desktop, 8.936 no mobile) não fecham com a soma das linhas do PNG. A tela mostra a cotação calculada, não esses números como fixture visual.
- Desktop e mobile não usam a mesma lista nem o mesmo rótulo de edição (`ID do token` contra `Edição: x/y`, coluna Total só no desktop). A spec precisa cravar qual dado a API devolve e o que cada viewport esconde.
- Campo e botão do mobile aparecem em pílula e com gradiente. A regra medida manda raio 5 no campo, raio 6 no botão de página e cor sólida. A spec escolhe a regra medida, salvo aprovação em contrário.
- A faixa 2 do rodapé não casa com um token. A casca já construída no início permanece; esta fatia não inventa hex para o rodapé.
- 768 não tem desenho.
- Duas abas com a mesma sessão: a última escrita ganha. Fora do escopo formal.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/mocks/**`, `src/lib/api/**`, `src/lib/contracts/**` (contrato novo de carrinho e cotação), `src/features/session/**` na fusão do login e na limpeza ao sair, e `src/lib/money.ts` se a soma entrar lá. Cache privado por pessoa. O rascunho do visitante fica no `sessionStorage`, fora da sessão autenticada. Não há chave de idempotência nem evento de socket nesta fatia.

## Contrato de UI

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

## Decisão

Revisão de contexto limpo não foi pedida. A escolha do visitante entrou em 2026-11-26. O restante do plano ainda espera aprovação humana antes da spec.

- Entrou: visitante B. Rascunho no `sessionStorage` da aba. Na entrada ou no cadastro, a loja soma a quantidade da mesma peça e acrescenta a peça nova. O rascunho só é apagado depois do sucesso. Sair não devolve o carrinho da pessoa ao visitante.
- Saiu: visitante A (carrinho vazio sem sessão e escrita só depois do login).
