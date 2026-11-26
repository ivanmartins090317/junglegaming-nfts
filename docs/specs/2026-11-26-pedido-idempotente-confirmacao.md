# Spec: Pedido idempotente, confirmação e recibo

- Status: `done`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a rota `/pedidos/$pedidoId` mostra o recibo gravado na criação. O pedido nasce da cotação do carrinho de quem está na sessão, espera a resposta e não muda depois. A tela de pagamento não entra.
- Plano: `docs/plans/reviews/2026-11-26-pedido-idempotente-confirmacao-plano.md`
- Decisão do plano: o arquivo não tem seção Decisão. A revisão de contexto limpo não foi pedida. Esta spec fecha o corpo do plano. Aprovar esta spec adota as lacunas da seção 6.

## 1. Objetivo

Quem está na sessão abre o próprio pedido e vê a fotografia gravada quando o carrinho foi fechado: peças, quantidades, totais, taxa, carteira, data e identificador da transação. A mesma chave, da mesma pessoa, com as mesmas linhas, devolve esse mesmo pedido. O preço do catálogo pode mudar depois. O recibo fica. Ada e Bruno continuam com os pedidos da semente. O pagamento não cria pedido nesta fatia.

## 2. Tela

Contrato de UI do Claude Sonnet 5.5 (`claude-sonnet-5-5-high`), colado na íntegra. O modelo que escreve a spec não reescreve arranjo, cópia nem composição.

PNG:

- `research/figma/desktop-confirmacao.png`
- `research/figma/mobile-confirmacao.png` ausente

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

## 3. Fora de escopo

- Tela de pagamento. `Conectar e finalizar` continua indo para `/pagamento`. O miolo dessa rota não muda.
- Botão do carrinho passa a criar pedido. Esta fatia não põe gatilho visível de fechar o carrinho.
- Socket, preço ao vivo e pedido `recusado`.
- Versão de evento. O pedido desta fatia nasce `confirmado` e não muda de estado.
- Conexão de carteira, perfil e a rota de carteiras.
- Destino real do Etherscan.
- Header, sidebar, rodapé, película escura, segundo botão, cópia do identificador, carregamento desenhado, erro desenhado e linha que não esteja no recibo.
- Composição mobile própria. O frame não existe.
- Dependência nova.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- O que a seção Tela marca em "O que não construir".

## 4. Atores e pré-condições

- Quem usa: Ada, Bruno e quem cria conta nesta sessão da loja. Sem sessão, a confirmação abre a entrada que já existe.
- O que precisa existir antes: a loja simulada já nasce com o catálogo, com Ada e Bruno, com o carrinho da semente e com o recomeço que devolve essa semente. A sessão já entra, cria conta e sai. A cotação do carrinho já devolve o total de fechar. `/pedidos/$pedidoId` existe, com guarda, e o miolo ainda é vazio. A simulação liga por padrão e desliga pela configuração já existente.

Pedidos da semente. Os números já homologados continuam. O recibo completa nome, imagem e os campos que a tela lê. A taxa da semente é `0.00`, para o total continuar `1.79` e `0.39`.

| Pessoa | Pedido | Peça | Quantidade | Total da linha | Taxa | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ada | `ped-ada-1` | `ivory-baron-088` | 1 | `1.79` | `0.00` | `1.79` | `confirmado` |
| Bruno | `ped-bruno-1` | `golden-signal-160` | 1 | `0.39` | `0.00` | `0.39` | `confirmado` |

Os dois recibos da semente usam a carteira `MetaMask` e a data `29 Jul, 2026`. O identificador da transação da Ada é `0xADA1000000000000000000000000A1E1`. O do Bruno é `0xB200000000000000000000000000B2E2`. O nome e a imagem são os da peça no catálogo no momento da semente: Ivory Baron #088 e Golden Signal #160.

Carrinho da semente, que esta fatia pode fechar e que o recomeço devolve:

| Pessoa | Linha |
| --- | --- |
| Ada | Sage Nomad #009, quantidade 1 |
| Bruno | Cosmic Bloom #118, quantidade 2 |

## 5. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. A cópia fixa e o arranjo são os da seção Tela. Cenário não pede bloco que o contrato marcou como ausente. As três linhas do desenho, a taxa `0.016 ETH` e o total `26.846 ETH` são a composição do PNG. A tela pinta o recibo gravado. Emerald Ape, Violet Nomad e Ivory Baron com quantidade 9 não são o pedido da Ada.

A confirmação só pinta o recibo depois da leitura. Não há pedido otimista. Abaixo de 1440 vale o cenário 8. Não há outra composição.

### Cenário 1: Ada vê o recibo da semente

- Dado: Ada está na sessão, a loja está na semente e a largura é de 1440 ou mais.
- Quando: ela abre `/pedidos/ped-ada-1`.
- Então: o fundo é `ink`, sem cabeçalho do site, sem barra inferior, sem película e sem conteúdo atrás do modal. O modal é o único bloco. O fechar é o `×` em `color/primary`. O ícone traz `THANK` e `YOU`. O título é `Seus NFTs agora estão na sua carteira`. A faixa mostra `ID da transação` `0xADA1…A1E1`, `Data` `29 Jul, 2026`, `Total` `1.79 ETH` e `Carteira` `MetaMask`. O bloco se chama `Detalhes da transação`, com os rótulos `NFTs`, `Edições` e `Subtotal`. A única linha é Ivory Baron #088, `ID do token: ivory-baron-088`, `(x 1)` e `1.79 ETH`, com a miniatura dessa peça. A taxa de rede é `0.00 ETH`. O total do bloco é `1.79 ETH`. O parágrafo é `Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.` O botão é `Ver no Etherscan`. A barra de base é `color/primary`. Emerald Ape #042, Violet Nomad #314, `26.846 ETH` e `(x 9)` não aparecem. Não há selo de confirmado, segundo botão nem cópia do identificador.

### Cenário 2: Bruno não vê o pedido da Ada

- Dado: Bruno está na sessão e a loja está na semente.
- Quando: ele abre `/pedidos/ped-bruno-1`.
- Então: a linha é Golden Signal #160, `ID do token: golden-signal-160`, `(x 1)` e `0.39 ETH`. A taxa é `0.00 ETH`. Os dois totais mostram `0.39 ETH`. O identificador visível é `0xB200…B2E2`. Ivory Baron #088 não aparece.
- Quando: ele abre `/pedidos/ped-ada-1`.
- Então: o modal do recibo não aparece. A página mostra `Pedido não encontrado.` O recibo da Ada não entra na leitura do Bruno.

### Cenário 3: Sem sessão a entrada abre e o caminho volta

- Dado: não há sessão.
- Quando: a pessoa abre `/pedidos/ped-ada-1`.
- Então: a guarda que já existe abre a entrada e guarda esse caminho para depois do sucesso. O recibo não aparece antes da sessão.
- Quando: Ada entra com sucesso.
- Então: ela volta a `/pedidos/ped-ada-1` e vê o cenário 1.
- Quando: a pessoa sem sessão entra como Bruno a partir de `/pedidos/ped-ada-1`.
- Então: o endereço volta a esse pedido e a frase é `Pedido não encontrado.`

### Cenário 4: Identificador ausente

- Dado: Ada está na sessão.
- Quando: ela abre `/pedidos/ped-9`, ou outro identificador que não é um pedido dela.
- Então: a frase é `Pedido não encontrado.` O modal do recibo não aparece. O carrinho dela não muda.

### Cenário 5: A leitura ainda não voltou

- Dado: Ada abriu `/pedidos/ped-ada-1` e a leitura ainda não voltou.
- Quando: a tela espera.
- Então: a página, sem cabeçalho e sem barra inferior, mostra `Carregando`. O modal não mostra os números do desenho no lugar do recibo.

### Cenário 6: A leitura falha

- Dado: Ada está na sessão e a simulação está desligada, ou a leitura do pedido falha.
- Quando: ela abre `/pedidos/ped-ada-1`.
- Então: a página mostra `Não foi possível carregar o pedido.` O recibo de outra pessoa não aparece.

### Cenário 7: O X volta ao início e o pedido continua

- Dado: Ada está em `/pedidos/ped-ada-1` com o recibo visível.
- Quando: ela aciona o `×`.
- Então: o endereço vai para `/`. Não aparece sucesso. O pedido `ped-ada-1` continua no endereço. Abrir de novo mostra o mesmo recibo.
- Quando: ela aciona o fundo `ink` fora do modal.
- Então: o endereço continua em `/pedidos/ped-ada-1`.

### Cenário 8: Ver no Etherscan fica visível e parado

- Dado: o recibo está visível.
- Quando: a pessoa aciona `Ver no Etherscan`.
- Então: o endereço não muda. Não aparece sucesso. O identificador completo não abre. Não há botão de copiar.

### Cenário 9: Abaixo de 1440 o mesmo modal encaixa na coluna

- Dado: Ada está na sessão com a semente e a largura é 768 ou 390.
- Quando: ela abre `/pedidos/ped-ada-1`.
- Então: a página é uma coluna, fundo `ink`, padding horizontal 28, sem cabeçalho, sem barra inferior e sem bloco novo. Os blocos do modal ficam na mesma ordem do cenário 1, com os mesmos valores. A largura do modal é a da coluna, no máximo a largura do desktop. Em 390 ele cabe nessa coluna. As quatro colunas de metadados continuam na mesma linha. O texto de cada valor continua em uma linha. Não há composição mobile própria.

### Cenário 10: A casca some só na confirmação

- Dado: Ada está na sessão.
- Quando: ela abre `/`, `/carrinho` ou `/perfil`.
- Então: o cabeçalho do site continua. Abaixo de 1440, a barra inferior continua nas rotas que já a mostram. Em `/carrinho`, a barra inferior continua oculta, como a spec do carrinho já fechou.
- Quando: ela abre `/pedidos/ped-ada-1`, em 1440 ou em 390.
- Então: esse endereço não mostra o cabeçalho nem a barra inferior.

### Cenário 11: Fechar o carrinho grava o recibo e esvazia só na primeira vez

- Dado: Ada está na sessão, a loja está na semente e o carrinho dela tem Sage Nomad #009 na quantidade 1. Ela apresenta a chave `chave-ada-1` e as linhas desse carrinho. Ela não envia o total.
- Quando: ela pede para fechar o carrinho e espera a resposta.
- Então: nasce um pedido novo, já `confirmado`, só dela. O recibo guarda Sage Nomad #009, a imagem dessa peça, o identificador `sage-nomad-009`, a quantidade 1, o total da linha `1.69`, a taxa `0.016` e o total `1.706`. A carteira é `MetaMask`. A data é `29 Jul, 2026`. O identificador da transação nasce uma vez e não muda. O carrinho dela fica vazio. O pedido `ped-ada-1` continua. O carrinho do Bruno continua com Cosmic Bloom #118 na quantidade 2.
- Quando: ela abre o endereço desse pedido novo.
- Então: a linha mostra `(x 1)` e `1.69 ETH`. A taxa mostra `0.016 ETH`. Os dois totais mostram `1.706 ETH`. O identificador visível usa a reticência no meio, no formato do cenário 1.

### Cenário 12: A mesma chave e as mesmas linhas devolvem o mesmo pedido

- Dado: o cenário 11 já gravou o pedido da Ada com a chave `chave-ada-1`, e o carrinho dela está vazio.
- Quando: ela pede de novo o fecho com a mesma chave e as mesmas linhas, Sage Nomad #009 na quantidade 1.
- Então: a resposta é o mesmo pedido. Não nasce outro. O preço não é recalculado. O carrinho continua vazio. O identificador da transação é o mesmo.

### Cenário 13: Linhas diferentes na mesma chave conflitam

- Dado: a chave `chave-ada-1` já gravou o pedido do cenário 11.
- Quando: Ada pede o fecho com essa chave e com outras linhas, por exemplo Sage Nomad #009 na quantidade 2.
- Então: a loja recusa com `Esta chave já fechou outro pedido.` O pedido gravado continua o do cenário 11. Não nasce outro. O carrinho não ganha linha.

### Cenário 14: A chave de outra pessoa é outra chave

- Dado: a chave `chave-ada-1` já é da Ada. Bruno está na sessão, com Cosmic Bloom #118 na quantidade 2, e apresenta as mesmas letras `chave-ada-1` com as linhas do carrinho dele.
- Quando: ele pede o fecho e espera.
- Então: nasce o pedido do Bruno. A linha é Cosmic Bloom #118, quantidade 2, total da linha `2.58`, taxa `0.016`, total `2.596`. O carrinho dele fica vazio. O pedido da Ada não muda. O carrinho da Ada, se já estava vazio, continua vazio.

### Cenário 15: O carrinho que não confere não fecha

- Dado: Ada está na semente, com Sage Nomad #009 na quantidade 1, e apresenta uma chave nova com Ivory Baron #088 na quantidade 1.
- Quando: ela pede o fecho.
- Então: não nasce pedido. O carrinho continua com Sage Nomad #009. A frase é `O carrinho não confere com o pedido.`
- Dado: o carrinho dela está vazio e a chave ainda não gravou pedido.
- Quando: ela pede o fecho.
- Então: não nasce pedido. A frase é `O carrinho está vazio.`

### Cenário 16: Sem sessão o fecho não grava

- Dado: não há sessão.
- Quando: alguém pede o fecho com uma chave e com linhas.
- Então: não nasce pedido. O carrinho da Ada e o do Bruno continuam os da semente, se ninguém os alterou.

### Cenário 17: Falha no fecho não consome a chave

- Dado: Ada está na semente e a simulação falha no momento do fecho.
- Quando: ela pede o fecho com a chave `chave-ada-2` e com Sage Nomad #009 na quantidade 1.
- Então: não nasce pedido. O carrinho continua. A chave não fica gravada. A frase é `Não foi possível registrar o pedido.`
- Quando: a simulação volta e ela repete a mesma chave com as mesmas linhas.
- Então: o pedido nasce, como no cenário 11.

### Cenário 18: O preço que muda depois não altera o recibo

- Dado: o pedido do cenário 11 está gravado, com total da linha `1.69` e total `1.706`.
- Quando: o preço de Sage Nomad #009 muda no catálogo.
- Então: abrir o pedido ainda mostra `1.69 ETH`, taxa `0.016 ETH` e total `1.706 ETH`. O nome e a imagem gravados continuam. Repetir a chave `chave-ada-1` com as mesmas linhas devolve esses mesmos números.

### Cenário 19: Sair esquece a leitura do pedido

- Dado: Ada leu `/pedidos/ped-ada-1`.
- Quando: ela aciona `Sair`.
- Então: a sessão acaba. A leitura daquele pedido, ligada a ela, sai junto com o restante do que é privado. O catálogo permanece. O pedido continua na loja.
- Quando: Bruno entra na mesma aba e abre `/pedidos/ped-ada-1`.
- Então: ele vê `Pedido não encontrado.`, e não o recibo que a Ada tinha lido.

### Cenário 20: O recomeço devolve a semente e apaga a chave

- Dado: Ada e Bruno fecharam carrinho depois da semente, e existem chaves gravadas.
- Quando: a loja recomeça.
- Então: a sessão acaba, como já acontece. Voltam `ped-ada-1` e `ped-bruno-1`, com os números da seção 4. Os pedidos criados depois somem. As chaves criadas depois somem. O carrinho volta ao da semente, como a spec do carrinho já manda. A mesma chave pode fechar de novo, e esse fecho é um pedido novo.

### Cenário 21: O carrinho não ganha gatilho de pedido

- Dado: Ada está em `/carrinho` com ao menos uma linha.
- Quando: ela aciona `Conectar e finalizar`.
- Então: o endereço vai para `/pagamento`. O miolo dessa rota não muda. Não nasce pedido. O carrinho não esvazia por causa desse botão.

## 6. Regras de negócio

- Regra 1: `/pedidos/$pedidoId` continua com a guarda. Sem sessão, abre a entrada e volta ao caminho depois do sucesso. Com sessão, a página é fundo `ink`, sem cabeçalho, sem barra inferior e sem película. As outras rotas conservam a casca que já têm.
- Regra 2: a partir de 1440 o modal segue a seção Tela, centrado na horizontal, com margem superior, sem centralizar na vertical. Abaixo de 1440, inclusive 768 e 390, a página é uma coluna, padding horizontal 28, os mesmos blocos, na mesma ordem. A largura do modal é a da coluna, no máximo a do desktop. Não há bloco novo nem composição mobile.
- Regra 3: o recibo é a fotografia da criação. Guarda, por linha, nome, imagem, identificador da peça, quantidade inteira e total da linha. Guarda também a taxa de rede, o total, a carteira, a data, o identificador da transação e o status. A tela não soma ETH. O total de fechar é o total da cotação no momento da criação.
- Regra 4: a cotação usada no fecho é a cotação já fechada do carrinho. Com linha, a taxa é `0.016` e o total é o subtotal mais essa taxa. O desconto não aparece nesta tela. A pessoa não envia o total. Total enviado não entra na fotografia.
- Regra 5: o fecho só acontece com sessão, com o carrinho não vazio, e com as mesmas peças, as mesmas quantidades e a mesma ordem do carrinho. Uma linha por peça. A primeira criação com sucesso esvazia o carrinho dessa pessoa. A repetição não esvazia de novo e não recalcula.
- Regra 6: a chave de idempotência é da pessoa. A mesma chave, da mesma pessoa, com as mesmas linhas, devolve o mesmo pedido, mesmo com o carrinho já vazio. As mesmas letras na chave de outra pessoa são outra chave. A mesma chave com linhas diferentes conflita, não cria outro pedido e não altera o que já foi gravado. Falha no fecho não grava chave.
- Regra 7: pedido de outra pessoa, ou identificador ausente, não devolve o recibo. A tela espera a leitura. Sair apaga a leitura do pedido junto com o restante do que é privado. A chave de leitura inclui a pessoa.
- Regra 8: o pedido desta fatia nasce `confirmado`. Não há passagem para `recusado`. Não há evento com versão. O recibo não regride porque não muda.
- Regra 9: a carteira do recibo é o rótulo `MetaMask`. Não há conexão de carteira. A data gravada nesta fatia, na semente e no pedido novo, é `29 Jul, 2026`. A tela não lê o relógio do navegador.
- Regra 10: o identificador da transação é estável e gravado no recibo. A tela mostra os 6 primeiros caracteres, a reticência `…` e os 4 últimos. O valor completo não ganha cópia nem tooltip. Os identificadores da semente são os da seção 4. No pedido novo, o identificador nasce no primeiro sucesso e a repetição devolve o mesmo.
- Regra 11: a linha secundária é `ID do token:` mais o identificador da peça. A quantidade aparece como `(x N)`. Os valores em ETH levam o sufixo ` ETH`. A semente mostra `1.79 ETH`, `0.39 ETH` e taxa `0.00 ETH`, sem casa extra.
- Regra 12: a cópia fixa é a da seção Tela: título, rótulos, parágrafo, `THANK`, `YOU`, `×` e `Ver no Etherscan`. O `×` vai para `/` e o pedido continua no endereço. Clique no fundo não fecha. `Ver no Etherscan` fica visível, não navega e não mostra sucesso.
- Regra 13: a tabela mostra as linhas do recibo, na ordem gravada. Uma linha ou várias. Não completa até três. Não pagina. Não cria rolagem interna. Não acrescenta linha que não esteja no recibo.
- Regra 14: o recomeço devolve os pedidos à semente, apaga as chaves de idempotência criadas depois e acaba a sessão, como o recomeço já acaba. O carrinho volta como a spec do carrinho já manda.
- Regra 15: a tela não fala com o cliente HTTP. Pede o pedido pelo cache de leitura. Componente e gancho não importam o atendimento da simulação. `Conectar e finalizar` não pede o fecho.
- Regra 16: as frases da confirmação são `Carregando`, `Pedido não encontrado.` e `Não foi possível carregar o pedido.` Elas substituem o modal. Não são um estado desenhado dentro dele. As frases do fecho, lidas por quem pede e pela prova automática, são `O carrinho não confere com o pedido.`, `O carrinho está vazio.`, `Esta chave já fechou outro pedido.` e `Não foi possível registrar o pedido.`
- Regra 17: raio 5 no modal, inclusive nos cantos de baixo, com a barra de base no mesmo card. Raio 6 no botão. Miniatura com raio 15 e corte `cover`. Sem `box-shadow`, sem hex novo e sem segunda fonte. O título do modal fica no tamanho do corpo pequeno, peso 500. Nome da peça, peso 700. Valores da faixa, peso 400. Tamanho de fonte: a hierarquia do contrato, sem número inventado.
- Regra 18: as linhas de 1 px em volta da faixa de metadados, e as divisórias verticais dessa faixa, usam `color/primary`. As linhas sob o cabeçalho da tabela e sob o total usam `color/border`. O nome começa alinhado à esquerda, as edições ficam centradas e o subtotal fica à direita.
- Regra 19: o teste da casca passa a exigir confirmação sem cabeçalho e sem barra inferior, e as outras rotas com o cabeçalho que já têm. Os números `ped-ada-1`, `ivory-baron-088`, `1.79`, `ped-bruno-1`, `golden-signal-160`, `0.39` e `confirmado` continuam verdadeiros. Nenhuma dependência nova.

Lacunas do contrato que esta spec fecha, sem reescrever a seção Tela:

- As três linhas, a taxa `0.016 ETH` e o total `26.846 ETH` do desenho são amostra. A tela usa o recibo da regra 3.
- `ID do token: #0042` é amostra. A linha viva usa a regra 11.
- O `×` vai para `/`. `Ver no Etherscan` não navega.
- Abaixo de 1440 o modal encaixa na coluna da regra 2. Não nasce outra tela.
- O modal tem margem superior e não fica centralizado na vertical. A escala em px do PNG não vira tamanho de heading.
- Miniatura com raio 15. Modal com raio 5 nos quatro cantos.
- Título do modal em peso 500. Nome da peça em peso 700. Valores da faixa em peso 400.
- Faixa de metadados em `color/primary`. Linhas internas da tabela em `color/border`.
- Alinhamento: nome à esquerda, edições ao centro, subtotal à direita.
- A data desta fatia é a string `29 Jul, 2026`, na semente e no pedido novo.
- Carregando, ausência e falha são frase no fundo `ink`, porque o PNG não desenha esses estados.

## 7. Critérios de Done desta feature

- [ ] A tela entregue segue a seção Tela, com as lacunas fechadas na seção 6
- [ ] Os cenários acima passam
- [ ] A prova automática cobre a mesma chave, o corpo diferente, a pessoa diferente, o preço que muda depois, o isolamento do recibo e o recomeço da semente
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, em 1440 e em 390: Ada abre o pedido da semente, o `×` volta ao início, `Ver no Etherscan` não navega, e o pedido de Bruno não abre na sessão da Ada
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/contracts/order.ts`, `src/lib/api/order.ts`, `src/mocks/**`, `src/features/order/**` e `src/features/session/use-end-session.ts` fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 8. Escopo de arquivos permitido

- Pode criar ou editar:
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
  - `src/features/session/use-end-session.ts`, só o bastante para a leitura do pedido sair junto com o restante do que é privado
- Não pode editar sem pedido:
  - `src/routes/pagamento.tsx`
  - `src/features/checkout/**`
  - `src/features/cart/**`
  - `src/lib/socket/**`
  - `src/lib/contracts/cart.ts`
  - `src/lib/contracts/nft.ts`
  - `src/lib/contracts/session.ts`
  - `src/lib/money.ts`
  - `src/styles/tokens.css`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - spec já aprovada

`src/lib/contracts/order.ts`, `src/lib/api/order.ts`, `src/mocks/**`, `src/features/order/**` e o trecho de `src/features/session/use-end-session.ts` são path crítico. Entram só com esta spec aprovada e com review humano do diff.

Se o fecho precisar de um controle que já existe no carrinho, a implementação para e pede aprovação. Esta spec não pede esse gatilho.

## 9. Riscos e dúvidas abertas

O plano não tem seção Decisão. Nenhum achado de revisão entrou nem saiu. O restante desta spec fecha o corpo do plano. Aprovar esta spec adota as lacunas da seção 6.

- O PNG tem cerca de 890 px, não 1440. A spec não converte essa escala em tamanho de heading.
- Em 390 o modal de largura fixa não cabe na coluna com padding 28. A regra 2 encolhe a largura até a coluna e mantém os mesmos blocos. As quatro colunas continuam na mesma linha.
- A semente tem um item e taxa `0.00`. O PNG tem três itens, taxa `0.016 ETH` e total `26.846 ETH`. A homologação visual confere rótulos, ordem e o recibo da Ada, não aqueles três valores.
- Estender o pedido da semente mexe em `src/mocks/**`. Os números já assertados precisam continuar verdadeiros.
- Esconder a casca só na confirmação pode levar o cabeçalho das outras rotas. O cenário 10 cobre isso.
- O gatilho visível de criar um pedido novo não está nesta fatia. A criação idempotente fica comprovada na loja e no cliente. A tela de pagamento, se for o gatilho, precisa do contrato dos dois PNG de pagamento antes de outra spec.
- A data `29 Jul, 2026` também no pedido novo evita o relógio da máquina. É decisão desta spec.
- Os identificadores `0xADA1…A1E1` e `0xB200…B2E2` são a semente desta spec. O `0xA91F…E82C` do PNG continua amostra.

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:
