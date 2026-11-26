# Plano: Pedido idempotente, confirmação e recibo snapshot

- Status: `done`
- Data: 2026-11-26
- Slug: `pedido-idempotente-confirmacao`
- Autonomia: `tight`
- Spec: `docs/specs/2026-11-26-pedido-idempotente-confirmacao.md`
- Frames: `research/figma/desktop-confirmacao.png`. Não existe `research/figma/mobile-confirmacao.png`
- Contrato de UI: [Contrato de UI da tela](7d0df376-2690-4292-a538-ba22120c6bfe), colado na íntegra abaixo
- Revisão de contexto limpo: não pedida neste turno

## Plano

Uma fatia só. A rota `/pedidos/$pedidoId` segue o contrato de UI abaixo. O pedido nasce da cotação do carrinho de quem está na sessão, espera a simulação e guarda um recibo que não muda depois. A tela de pagamento não entra.

Decisões deste plano:

- A parte de UI é o contrato colado na seção Contrato de UI. A implementação não reescreve região, cópia nem bloco.
- Não há frame mobile. O contrato registra a ausência e não descreve outra composição. Abaixo de 1440 vale a regra já fechada das telas sem frame próprio: uma coluna, padding horizontal 28, os mesmos blocos, na mesma ordem. Sem header, sem barra de baixo, sem bloco novo. 390 usa essa coluna. A largura fixa do modal no PNG pode não caber em 390. Isso fica na dúvida, sem desenhar outra tela.
- A rota de confirmação fica em fundo `ink`, sem o cabeçalho do site e sem a barra inferior. O contrato não desenha casca atrás do modal.
- A guarda que já existe permanece. Sem sessão, `/pedidos/$pedidoId` abre a entrada e volta ao caminho depois do sucesso.
- O recibo é a fotografia gravada na criação. Nome, imagem, identificador do token, quantidade, totais da linha, taxa de rede, total, carteira, data e identificador da transação saem dessa fotografia. Mudar o preço no catálogo depois não altera o recibo.
- ETH continua string decimal. Quantidade continua inteiro. O total de fechar é o total da cotação no momento da criação, não uma soma feita na tela.
- A mesma chave de idempotência, da mesma pessoa, com o mesmo corpo, devolve o mesmo pedido. Corpo diferente conflita e não cria outro. A chave de outra pessoa é outra chave. O cliente espera a resposta. Não há pedido otimista.
- O corpo da criação são as linhas (`nftId` e quantidade). A loja confere essas linhas com o carrinho da sessão, calcula a cotação e grava o recibo. O cliente não envia o total.
- A primeira criação com sucesso esvazia o carrinho dessa pessoa. A repetição da mesma chave e do mesmo corpo devolve o pedido já gravado, mesmo com o carrinho já vazio, e não cria outro nem recalcula o preço.
- Pedido de outra pessoa, ou identificador ausente, não devolve o recibo. A frase de ausência entra como comportamento, porque o PNG não desenha erro, vazio nem carregamento.
- A semente de Ada e Bruno continua com os mesmos identificadores, a mesma peça, a mesma quantidade, o mesmo total e o status `confirmado`. O recibo da semente completa nome, imagem e os campos que a tela lê, sem mudar esses números já homologados. A taxa da semente fica `0.00`, para o total continuar `1.79` e `0.39`.
- O pedido desta fatia já nasce `confirmado`. `recusado`, versão de evento e socket ficam na fatia seguinte.
- A carteira do recibo é o rótulo `MetaMask`, porque a fatia de carteiras ainda não existe. Não há conexão de carteira.
- O identificador da transação é um valor estável do pedido, gravado no recibo. A tela mostra o miolo com reticências, no formato do contrato.
- A data do recibo é gravada no pedido, no formato do contrato (`29 Jul, 2026`). Não usa o relógio do navegador. A data da semente é fixa na fixture.
- O X fecha a confirmação e vai para `/`. O pedido continua no endereço.
- `Ver no Etherscan` fica visível, não navega e não mostra sucesso. O contrato não traz destino.
- A cópia fixa do contrato (título, rótulos, parágrafo, botão, ícone) é a da tela. Os valores das linhas são os do recibo. O exemplo Emerald Ape, Violet Nomad e Ivory Baron é a composição do PNG, não o pedido da Ada.
- `POST /api/dev/reset` devolve os pedidos à semente e apaga chave de idempotência criada depois.
- A chave de cache do pedido inclui a pessoa. Sair apaga esse cache junto com o restante do cache privado.
- Sem dependência nova.

### Passos

1. Gravar o contrato do pedido e do recibo. A criação devolve o pedido já fotografado. A leitura devolve essa fotografia.
2. A loja viva cria o pedido com chave de idempotência, isola por pessoa e esvazia o carrinho só na primeira vez. Reset volta à semente. Teste de handler cobre a mesma chave, o corpo diferente, a pessoa diferente, o preço que muda depois e o reset.
3. Cliente HTTP e cache privado. A confirmação só pinta o pedido depois da leitura. Sair limpa essa chave.
4. Trocar o miolo de `/pedidos/$pedidoId` pelo contrato de UI. A casca some nessa rota. Estados de ausência, carregando e falha entram como comportamento, porque o PNG não desenha esses estados.
5. Ajustar o teste da casca para a confirmação sem cabeçalho e para as outras rotas com cabeçalho. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, em 1440 e em 390: Ada abre o pedido da semente, o X volta ao início, o botão do Etherscan não navega, e o pedido de Bruno não abre na sessão da Ada.

### Arquivos

- Criar ou alterar:
  - `src/lib/contracts/order.ts`
  - `src/lib/api/order.ts`
  - `src/lib/query/order.ts`
  - `src/features/order/`
  - `src/routes/pedidos/$pedidoId.tsx`
  - `src/components/layout/app-shell.tsx`
  - `src/components/layout/app-shell.test.tsx`
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/features/session/use-end-session.ts`, só o bastante para limpar a chave do pedido ao sair
- Não mexer:
  - `src/routes/pagamento.tsx`
  - `src/features/checkout/**`
  - `src/features/cart/**`, salvo se a spec aprovada pedir o gatilho de criação num controle que já existe
  - `src/lib/socket/**`
  - `src/lib/contracts/cart.ts`
  - `src/lib/contracts/nft.ts`
  - `src/lib/contracts/session.ts`
  - `src/lib/money.ts`
  - `src/styles/tokens.css`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

### Fora de escopo

- Tela de pagamento (`research/figma/desktop-pagamento.png` e `research/figma/mobile-pagamento.png`).
- Botão do carrinho passa a criar pedido. `Conectar e finalizar` continua indo para `/pagamento`.
- Socket, preço ao vivo e transição para `recusado`.
- Evento com versão. O pedido desta fatia não regride porque não muda de estado.
- Conexão de carteira, perfil e carteiras.
- Link real para o Etherscan.
- Header, sidebar, rodapé, película escura, segundo botão, cópia do hash, carregamento desenhado, erro desenhado e lista além das linhas do recibo.
- Composição mobile própria. O frame não existe.
- Dependência nova.

### Riscos

- O PNG tem cerca de 890 px, não 1440. A escala do modal e o raio das miniaturas ficam nas lacunas do contrato. A spec não inventa tamanho de heading.
- Em 390, o modal de largura fixa pode passar da coluna com padding 28. Sem frame mobile, a spec precisa dizer o encaixe sem criar bloco.
- A semente homologada tem um item e um total sem taxa. O PNG tem três itens, taxa `0.016 ETH` e total `26.846 ETH`. A tela da Ada não reproduz esses três valores. A homologação visual confere rótulos, ordem e um recibo real.
- Estender o pedido da semente mexe em `src/mocks/**`. Os números já assertados (`ped-ada-1`, `ivory-baron-088`, `1.79`, `ped-bruno-1`, `golden-signal-160`, `0.39`, `confirmado`) precisam continuar verdadeiros.
- Esconder a casca só na confirmação pode levar o cabeçalho das outras rotas. O teste da casca cobre isso.
- O gatilho visível de criar um pedido novo não está nesta fatia. A criação idempotente fica comprovada no handler e no cliente. Quem quiser o gatilho na tela de pagamento precisa de outro contrato, com os dois PNG de pagamento, antes da spec.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/lib/contracts/**`, `src/lib/api/**`, `src/mocks/**`, `src/features/order/**`, e `src/features/session/**` só na limpeza do cache ao sair. Chave de idempotência e isolamento por pessoa. Não há evento de socket nesta fatia.

## Contrato de UI

Fonte lida: `research/figma/desktop-confirmacao.png`.

# Contrato de UI: Confirmação (desktop)

Fonte lida: `research/figma/desktop-confirmacao.png`.

Medidas no PNG, que tem cerca de 890 x 1024 px, não 1440. Todo valor em px abaixo é o do PNG. O arquivo não mostra a escala para o frame 1440 (ver Lacunas).

## Desktop

### 1. Fundo da tela
- Preenchimento total do frame em `color/ink` `#140D0A`.
- Não há header, sidebar, rodapé nem conteúdo atrás do modal. Só o fundo liso.
- O modal fica centrado na horizontal, com o eixo em x ≈ 445 de 890.
- O modal não está centrado na vertical. O topo dele fica a ≈ 102 px do topo do frame. O frame segue vazio abaixo dele até 1024.

### 2. Modal
- Um card único, `color/surface-card` `#241612`.
- Largura fixa ≈ 358 px (x 266 a 624). Altura ≈ 508 px (y 102 a 610), definida pelo conteúdo.
- Raio 5 pelo contrato do modal. Nos cantos do PNG o raio não se distingue (ver Lacunas).
- Sem `box-shadow`. Sem borda externa visível.
- O modal empilha as faixas de cima para baixo, nesta ordem: cabeçalho, faixa de metadados, detalhes, barra de base.

### 3. Cabeçalho do modal (faixa 1, y 102 a 199)
- **Botão fechar.** Ícone "×" fino, no canto superior direito. Centro em ≈ (609, 118), com ≈ 10 px de glifo e ≈ 12 px de recuo do canto.
  - Cor `color/primary` `#D28A4C`, traço fino.
  - É o único controle de dispensar. O desenho não mostra o que ele faz.
- **Ícone central.** Ilustração de envelope aberto com um papel dentro, contornada em `color/primary`.
  - O papel traz o texto literal "THANK YOU" em duas linhas: "THANK" e "YOU".
  - Centrado no eixo do modal. Tamanho ≈ 40 de largura por ≈ 50 de altura, topo em y ≈ 117.
  - É contorno sem preenchimento, em traço único.
- **Título.** Cópia literal: `Seus NFTs agora estão na sua carteira`.
  - Uma linha, centrada, em y ≈ 180.
  - Cor `color/text-secondary` `#CFB28C`, peso 500 ou 700. No PNG parece médio ou negrito, então o peso exato não é conclusivo.
  - Heading sem número no desenho: fica no tamanho do corpo pequeno, sem tamanho inventado.
- **Divisória inferior.** Linha de 1 px em largura total do modal (x 266 a 624), em y ≈ 199.
  - Tom de `color/primary` ou `color/secondary`, mais claro que `color/border`. O PNG não distingue qual dos dois.

### 4. Faixa de metadados (faixa 2, y 199 a 240)
- Faixa de largura total do modal, em `surface-card`.
- Linha superior em y ≈ 199 (a divisória do item 3). Linha inferior em y ≈ 240, em `color/primary`.
- Quatro colunas lado a lado, separadas por três divisórias verticais finas em tom `primary` ou `secondary`.
  - As divisórias ficam em x ≈ 378, 467 e 545.
  - A altura de cada divisória é a do texto (≈ 20 px).
- Cada coluna tem duas linhas: rótulo em cima, valor embaixo. Alinhamento à esquerda, e a coluna tem o tamanho do conteúdo. As larguras não são iguais.
- Texto pequeno, em uma linha, sem quebra.

| Col. | Rótulo (literal) | Peso do rótulo | Valor (literal) | x inicial |
|---|---|---|---|---|
| 1 | `ID da transação` | 700, `text-secondary` | `0xA91F…E82C` | ≈ 289 |
| 2 | `Data` | 400, `text-secondary` | `29 Jul, 2026` | ≈ 389 |
| 3 | `Total` | 400, `text-secondary` | `26.846 ETH` | ≈ 478 |
| 4 | `Carteira` | 700, `text-secondary` | `MetaMask` | ≈ 556 |

- O valor da coluna 1 usa a reticência "…" no meio, como está no PNG: `0xA91F…E82C`.
- Os valores usam `color/text-secondary` em peso 400. No PNG ficam um pouco mais apagados que os rótulos em negrito.
- Os rótulos das colunas 1 e 4 são negrito. Os das colunas 2 e 3 são regulares. Reproduzir assim.
- O "ETH" do Total segue o formato do projeto: string decimal, espaço, "ETH".

### 5. Bloco "Detalhes da transação" (faixa 3, y 240 a 604)
- Corpo em `surface-card`.
- Padding horizontal interno ≈ 27 px. A coluna de conteúdo vai de x ≈ 293 a ≈ 597, com ≈ 304 px úteis.
- Todo o conteúdo abaixo fica dentro dessa coluna.

#### 5.1 Título da seção
- Cópia literal: `Detalhes da transação`.
- Alinhado à esquerda em x ≈ 293, em y ≈ 258.
- `color/foreground` `#F5F1EB`, peso 700, corpo pequeno.

#### 5.2 Linha de cabeçalho da tabela (y ≈ 275)
- Três rótulos em uma linha, todos em `foreground`, peso 700:
  - `NFTs`, alinhado à esquerda em x ≈ 293.
  - `Edições`, centrado na coluna do meio, x ≈ 477 a 518.
  - `Subtotal`, alinhado à direita, terminando em x ≈ 596.
- Abaixo dela, linha de 1 px na largura da coluna (x 293 a 597), em y ≈ 287. Cor `color/border` `#3F2319`, ou tom próximo do `primary` apagado. O PNG mostra um marrom discreto, então `border`.

#### 5.3 Linhas de item (3 itens, passo vertical ≈ 51 px)
Cada linha tem três células na mesma baixada, alinhadas pelo centro vertical da miniatura:

- **Célula NFT** (esquerda):
  - Miniatura quadrada ≈ 43 x 43 px, em x ≈ 293. É imagem de NFT com corte `cover`.
  - À direita da miniatura, com folga ≈ 7 px, um bloco de duas linhas alinhado à esquerda:
    - Linha 1, nome em `foreground`, peso 700.
    - Linha 2, `ID do token: #NNNN`, em `color/secondary` `#B39463`, peso 400, menor que o nome.
- **Célula Edições** (meio): `(x N)` em `color/text-secondary`, peso 400, centrado na coluna "Edições".
- **Célula Subtotal** (direita): valor em ETH, `color/text-accent` `#E89B55`, peso 700, tamanho de corpo um pouco maior que o nome, alinhado à direita da coluna.

Linhas literais, na ordem do desenho:

| # | Nome | Linha do token | Edições | Subtotal |
|---|---|---|---|---|
| 1 | `Emerald Ape #042` | `ID do token: #0042` | `(x 2)` | `2.38 ETH` |
| 2 | `Violet Nomad #314` | `ID do token: #0314` | `(x 6)` | `8.34 ETH` |
| 3 | `Ivory Baron #088` | `ID do token: #0088` | `(x 9)` | `16.11 ETH` |

- As miniaturas mostram imagens de macacos em ilustração. Fundos claros: verde na 1, lilás na 2 e verde claro na 3. Cada uma é um avatar de NFT do catálogo.
- Sem separadores entre as linhas de item. Só o espaço vertical.

#### 5.4 Totais (y ≈ 453 e 471)
Duas linhas alinhadas à direita da coluna, com a coluna de rótulo começando em x ≈ 398:

- **Taxa de rede.** Rótulo `Taxa de rede` e valor `0.016 ETH`. Os dois em `foreground`, peso 400. O valor tem corpo um pouco maior que o rótulo e termina em x ≈ 596.
- **Total.** Rótulo `Total` em `foreground`, peso 700. Valor `26.846 ETH` em `color/text-accent`, peso 700, terminando em x ≈ 596.
- Abaixo do Total, linha de 1 px em largura da coluna (x 293 a 597), em y ≈ 483. Cor `color/border`.

#### 5.5 Texto de confirmação (y ≈ 498 a 525)
- Cópia literal, um parágrafo:
  `Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.`
- Centrado, em três linhas, na largura da coluna de conteúdo. As quebras do PNG:
  1. `Transação confirmada na Ethereum. A propriedade foi`
  2. `transferida para sua carteira conectada e registrada na`
  3. `rede.`
- `color/text-secondary`, peso 400. Corpo menor que o dos itens. Entrelinha confortável, ≈ 12 px.

#### 5.6 Botão "Ver no Etherscan" (y ≈ 545 a 574)
- Centrado no eixo do modal. Um só botão. É o único CTA do modal.
- Cópia literal: `Ver no Etherscan`.
- Preenchimento `color/primary` `#D28A4C`. Texto `color/ink` `#140D0A`, peso 700, uma linha.
- Raio 6, que é o do botão de página.
- Tamanho ≈ 115 x 29 px. Largura pelo conteúdo, com padding horizontal ≈ 10 px.
- Sem borda. Sem `box-shadow`.
- O desenho não mostra destino, ícone nem estados de hover, foco ou desabilitado.

### 6. Barra de base do modal (y ≈ 604 a 610)
- Faixa sólida de ≈ 6 px, na largura total do modal (x 266 a 624), em `color/primary` `#D28A4C`.
- Fecha o modal por baixo. Não tem texto nem controle.
- O espaço entre o botão (fim ≈ 574) e a barra (início ≈ 604) é ≈ 30 px, em `surface-card`.

## 1. Árvore de blocos (de fora para dentro)

```text
Tela de confirmação (desktop)
└─ Fundo da tela: ink #140D0A, frame inteiro, sem outro conteúdo
   └─ Modal (surface-card #241612, largura fixa ≈ 358, raio 5, topo a ≈ 102 do topo, centrado na horizontal)
      ├─ Cabeçalho (centrado)
      │  ├─ Botão fechar "×" (canto superior direito, primary)
      │  ├─ Ícone envelope "THANK YOU" (primary, contorno)
      │  └─ Título: "Seus NFTs agora estão na sua carteira" (text-secondary)
      ├─ Linha de 1 px, largura total (tom primary ou secondary)
      ├─ Faixa de metadados (4 colunas, divisórias verticais)
      │  ├─ Col 1: "ID da transação" (700) / "0xA91F…E82C"
      │  ├─ Col 2: "Data" (400) / "29 Jul, 2026"
      │  ├─ Col 3: "Total" (400) / "26.846 ETH"
      │  └─ Col 4: "Carteira" (700) / "MetaMask"
      ├─ Linha de 1 px, largura total, primary
      ├─ Bloco de detalhes (padding horizontal ≈ 27, coluna útil ≈ 304)
      │  ├─ Título "Detalhes da transação" (foreground, 700)
      │  ├─ Cabeçalho da tabela: "NFTs" | "Edições" | "Subtotal" (foreground, 700)
      │  ├─ Linha de 1 px (border)
      │  ├─ Item 1: miniatura + "Emerald Ape #042" / "ID do token: #0042" | "(x 2)" | "2.38 ETH"
      │  ├─ Item 2: miniatura + "Violet Nomad #314" / "ID do token: #0314" | "(x 6)" | "8.34 ETH"
      │  ├─ Item 3: miniatura + "Ivory Baron #088" / "ID do token: #0088" | "(x 9)" | "16.11 ETH"
      │  ├─ Linha "Taxa de rede" | "0.016 ETH" (foreground, 400, à direita)
      │  ├─ Linha "Total" | "26.846 ETH" (700, valor em text-accent)
      │  ├─ Linha de 1 px (border)
      │  ├─ Parágrafo de confirmação (text-secondary, centrado, 3 linhas)
      │  └─ Botão "Ver no Etherscan" (primary, texto ink 700, raio 6, centrado)
      └─ Barra de base ≈ 6 px, primary, largura total
```

## 2. O que muda do desktop para o mobile

O frame mobile está ausente. Não existe `mobile-confirmacao.png` em `research/figma/`.

- Não há composição mobile desenhada para esta tela. Nenhuma mudança é registrada.
- As regras gerais do projeto (414, 390 usando a composição de 414, e 768 em coluna única com padding horizontal 28) ficam como estão. Nenhuma delas diz como o modal da confirmação se reorganiza.
- Não construir variante mobile a partir deste contrato sem o desenho.

## 3. O que não construir (não está no PNG)

- Header, sidebar, navegação ou rodapé do site atrás do modal.
- Backdrop, overlay escurecido ou animação de entrada.
- Qualquer `box-shadow` no modal, no botão ou nas miniaturas.
- Segundo botão ou link (Copiar ID, Ver pedido, Voltar ao início, Compartilhar).
- Botão de copiar no ID da transação, e tooltip com o hash completo.
- Estado de carregamento, erro, pedido recusado ou pendente.
- Barra de progresso, selo ou ícone de confirmado.
- Cabeçalho de seção além de "Detalhes da transação".
- Paginação ou rolagem interna da lista de itens. O desenho mostra só 3 itens.
- Qualquer texto, tooltip ou rodapé além do que está transcrito acima.
- Qualquer composição mobile.
- Fonte, cor, raio ou tamanho de heading fora do que o contrato fechou.

## 4. Lacunas (não dá para ler)

- **Escala.** O PNG tem ≈ 890 px de largura, não 1440. Não dá para provar quanto vale cada px no frame de 1440 nem a proporção do modal. Todas as medidas acima estão no espaço do PNG.
- **Posição vertical.** O modal está a ≈ 102 px do topo do frame de ≈ 1024. Não dá para dizer se isso é alinhamento ao topo com margem fixa ou centralização de um frame maior.
- **Raio do modal.** Os cantos parecem retos nesta resolução. O contrato manda raio 5 no modal. Não dá para confirmar se o desenho aplica o raio nos quatro cantos nem se a barra de base o corta.
- **Raio das miniaturas.** Os cantos parecem pequenos, perto de 5 ou 6. O contrato fala em raio 15 para a imagem do card, e esta miniatura é menor. Não dá para ler o valor exato.
- **Desalinhamentos do desenho nas linhas de item.**
  - O início do texto do nome varia, em x ≈ 344, 341 e 341.
  - O fim do Subtotal varia, em x ≈ 590, 591 e 599.
  - A coluna "Edições" também varia, e o "(x 9)" está deslocado para a direita.
  - A miniatura da linha 3 é um pouco mais estreita que as outras.
  - Não dá para saber qual é a regra de alinhamento. A leitura mais provável é nome com início fixo, edições centradas e subtotal à direita. Isso precisa de decisão humana, não de invenção.
- **Pesos exatos.** O título do cabeçalho está entre 500 e 700. Os valores da faixa de metadados e o nome das NFTs estão entre 400 e 700, e o PNG não permite separar.
- **Cor das linhas.** As linhas em y ≈ 199 e 240 e as divisórias verticais da faixa de metadados parecem `primary` ou `secondary`. As de y ≈ 287 e 483 parecem `border`. Não dá para distinguir `secondary` de `primary` nessa espessura.
- **Tamanhos de fonte.** O desenho não traz números. Há apenas uma hierarquia relativa: título do bloco, cabeçalho e itens, valores de ETH um pouco maiores que o nome, texto pequeno nos metadados e no parágrafo.
- **Ícone "THANK YOU".** Não dá para ler os detalhes do traço, como espessura e cantos. É um contorno em `primary`, sem fundo.
- **Botão fechar.** O desenho não diz se "×" fecha a confirmação e leva a outra rota. Também não diz qual a área clicável.
- **Botão "Ver no Etherscan".** Sem destino e sem estados. As regras do projeto só cobrem link fora do escopo para os itens listados, e este não está entre eles.
- **Mobile.** O frame não existe. Nada pode ser lido sobre 414, 390 ou 768 para esta tela.
