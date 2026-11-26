# Spec: Perfil e carteiras

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a pessoa logada vê a sidebar e o formulário de `/perfil` e de `/carteiras`. Salvar grava o dado dela e espera a simulação. Abaixo de 1440, os mesmos blocos descem numa coluna. Pagamento, recibo e carteira do pedido ficam fora.
- Plano: `docs/plans/reviews/2026-11-26-perfil-carteiras-plano.md`
- Execução: seção 11 deste arquivo. Um passo por vez. Quem implementa não marca passo e não edita esta spec.
- Decisão do plano: a seção Decisão está sem item em Entrou e sem item em Saiu. Esta spec repete o corpo do plano. O ajuste abaixo de 1440 está no cenário 16 e na regra 4. Não há PNG mobile para colar.

## 1. Objetivo

Quem está na sessão abre o próprio perfil e a própria carteira principal, corrige os dados e grava. Ada não vê nem grava o que é de Bruno. A carteira salva não entra no pagamento nem no recibo. Sem sessão, as duas rotas continuam pedindo a entrada.

## 2. Tela

Contrato de UI do Claude Sonnet 5.5 (`claude-sonnet-5-5-high`), colado na íntegra. O modelo que escreve a spec não reescreve arranjo, cópia nem composição.

PNG:

- `research/figma/desktop-perfil.png`
- `research/figma/desktop-carteiras.png`

Não existem `research/figma/mobile-perfil.png` nem `research/figma/mobile-carteiras.png`. O contrato registra essa ausência e não descreve outra composição. O encaixe abaixo de 1440 está fora desta seção, no cenário 16.

# Contrato de UI: Perfil e Carteiras (desktop)

Li os dois PNG com este modelo. Cada PNG tem 1024×768. As medidas abaixo estão em px do PNG, com o valor equivalente em 1440 entre parênteses (fator 1,40625). O padding lateral de 85 px do PNG corresponde ao padding de 120 do projeto, então as proporções batem. Os valores em 1440 são derivados, não cotados no desenho.

Não existe `mobile-perfil.png` nem `mobile-carteiras.png`. Não descrevo mobile.

## Parte comum às duas telas

### Fundo
- Fundo da página em `color/ink`. Todo o conteúdo fica entre x=85 e x=939 (padding horizontal 120 em 1440).
- Abaixo do conteúdo há fundo vazio até o fim do frame. Nada de rodapé desenhado.

### Faixa de header
Altura até a linha: 48 px (68 em 1440).

- **Esquerda, x=85:** "KURIO" em maiúsculas, 700, `color/foreground`, com espaçamento entre letras visível.
- **Centro, quatro itens em linha:** "Início", "Mercado", "Criadores", "Aprenda".
  - "Início" é o ativo: `color/text-accent`, peso 700, com sublinhado de 1 a 2 px em `color/primary` ou `color/text-accent`, na largura do texto. Esse sublinhado fica sobre a linha do header.
  - Os outros três: `color/foreground`, peso 400.
  - O "Início" é o ativo nas duas telas. Não existe item "Perfil" no menu.
- **Direita, da esquerda para a direita:**
  - Ícone de lupa em `color/foreground`.
  - Ícone de carrinho em `color/foreground`, com selo circular pequeno em `color/primary` e o número "6" em `color/ink`.
  - Botão "Entrar" com ícone de entrada à esquerda do texto: preenchimento `color/primary`, texto `color/ink`, raio 6, altura próxima de 24 px (34 em 1440), alinhado a x=939.
- **Linha de base:** linha de 1 px em `color/border` de x=85 a x=939, logo abaixo dos itens.

### Coluna esquerda: sidebar "Meu perfil"
Card x=85 a 306, largura 221 (311 em 1440). Vai de y=72 a y=361. Fundo `color/surface-card`, sem raio e sem sombra. Fica a 24 px abaixo da linha do header. A largura é fixa.

- **Título:** "Meu perfil", peso 700, `color/foreground`, a 8 px da borda esquerda do card. Parece maior que o texto dos itens, mas o desenho não dá número de tamanho.
- **Itens:** linhas de 32 px de altura (45 em 1440), cada uma com ícone linear à esquerda e rótulo. Rótulos em `color/text-accent`, peso 400. Ícones em `color/text-secondary`, contorno fino, cerca de 12 px. A ordem é:
  1. Ícone de pessoa, "Dados do perfil"
  2. Ícone de pin, "Carteiras"
  3. Ícone de carrinho, "Atividade"
  4. Ícone de coração, "Lista de interesse"
  5. Ícone de gráfico em quadrado, "Ofertas"
  6. Ícone de download, "Arquivos baixados"
  7. Ícone de alerta em triângulo, "Suporte"
- **Item ativo:** barra vertical de 4 px de largura, na altura da linha (32 px), colada na borda esquerda do card, em `color/primary`.
  - Em Perfil, o ativo é "Dados do perfil".
  - Em Carteiras, o ativo é "Carteiras".
  - O ativo não muda de peso nem de cor do texto no desenho. Só a barra o distingue.
- **Último item:** "Sair", com ícone de saída. Fica separado por uma linha de 1 px em `color/border` na largura do card. Texto em `color/text-accent`, peso 700.

### Coluna direita: conteúdo
Começa em x=325 e vai até x=939. Largura 614 (863 em 1440). Fica a 19 px da sidebar (27 em 1440). O topo alinha com o topo da sidebar (y=72).

Quando há formulário em duas colunas:
- Cada coluna tem 297 px (418 em 1440).
- A coluna esquerda vai de x=325 a x=622.
- A coluna direita vai de x=642 a x=939.
- O vão entre colunas é 20 px (28 em 1440).

### Padrão de campo
- **Rótulo:** `color/foreground`, peso 400, acima do campo, alinhado à esquerda.
- **Asterisco de obrigatório:** `color/text-coral`, maior que o rótulo, colado ao fim do texto. A exceção é "Rede *" e "Nome ENS *", que têm um espaço antes do asterisco.
- **Campo de texto:** altura 28 px (39 em 1440), largura total da coluna.
  - Borda de 1 px em `color/border`.
  - Raio 5.
  - Fundo igual ao do fundo da página, sem preenchimento distinto.
  - Sem sombra.
- **Placeholder:** tom claro de `color/text-secondary`, peso 400.

### Controle "Nome ENS"
É um par de controles na mesma linha, a 8 px um do outro:
- **Seleção "`.eth`":** x=642 a 697, largura 55. Mostra o valor `.eth` e um chevron para baixo à direita. Mesmo estilo e raio do campo.
- **Campo de texto:** vai de x=705 a x=939, vazio.

## Tela Perfil (`desktop-perfil.png`)

### Cabeçalho do conteúdo
"Perfil do colecionador", peso 700, `color/foreground`, em x=325, y≈77. Sem número de tamanho no desenho. Não há texto de apoio abaixo.

### Grade de campos
Cada linha vai de rótulo até campo. A distância entre uma linha e a próxima é 73 px (103 em 1440). O rótulo fica 18 px acima do topo do campo.

| Linha | Coluna esquerda | Coluna direita |
|---|---|---|
| 1 (rótulo em y=116, campo y=134 a 162) | "Nome de exibição" + asterisco | "Nome de usuário" + asterisco |
| 2 (rótulo em y=189, campo y=207 a 235) | "E-mail" + asterisco | "Nome ENS " + asterisco, com seleção `.eth` + campo |
| 3 (rótulo em y=262, campo y=280 a 308) | "Apelido da carteira" + asterisco | Bloco de avatar |

Os campos de texto aparecem vazios, sem placeholder.

### Bloco de avatar (coluna direita, linha 3)
- Rótulo "Avatar", `color/foreground`, sem asterisco, em x=642, y=258.
- Círculo de 36 px de diâmetro (51 em 1440), em x=642 a 678, `color/surface-card`, com ícone de imagem em `color/text-accent`.
- Botão "Alterar" a 17 px do círculo, de x=695 a 764 (largura 69), altura 28. Preenchimento `color/primary`, texto `color/ink`, raio 6. O peso do texto parece 500 ou 700.
- "Remover", texto sem preenchimento e sem borda, `color/foreground`, peso 400, a 15 px à direita do botão "Alterar". Alinhado verticalmente ao centro com ele.

### Seção "Alterar senha" (só coluna esquerda)
- Subtítulo "Alterar senha", peso 700, `color/foreground`, em y=337. Fica 29 px abaixo do último campo do bloco acima.
- Três campos empilhados, sem asterisco nos rótulos. Passo de 65 px entre linhas (91 em 1440). O rótulo fica a 14 px acima do campo.
  1. Rótulo "Senha atual", campo y=379 a 407.
  2. Rótulo "Nova senha", campo y=444 a 472.
  3. Rótulo "Confirmar nova senha", campo y=509 a 537.
- Cada campo tem um ícone de olho cortado dentro dele, à direita (x≈603, a 19 px da borda direita), em `color/text-secondary`. Na imagem aparece só o estado "olho cortado". O comportamento de alternar a visibilidade não está desenhado.
- A coluna direita fica vazia ao lado dessa seção.

### Botão de envio
"Salvar", em x=325 a 419 (largura 94, 132 em 1440), y=560 a 588, altura 28. Preenchimento `color/primary`, texto `color/ink`, raio 6. Texto centralizado, peso 500 ou 700. Fica alinhado à esquerda da coluna esquerda, a 23 px abaixo do último campo.

## Tela Carteiras (`desktop-carteiras.png`)

### Bloco "Carteira principal"

**Cabeçalho do bloco:**
- "Carteira principal", peso 700, `color/foreground`, em x=325, y≈77. Parece que a base das letras com descendente ("p") está cortada. Veja Lacunas.
- À direita, alinhado a x=939: "Adicionar", `color/text-accent`, peso 400 ou 500. Texto sem preenchimento e sem borda, na mesma linha do título.
- Abaixo do título, a 18 px (y≈95): "Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados." em `color/text-secondary`, peso 400, menor que o título. Ocupa a largura da coluna, sem quebra de linha.

**Grade de campos em duas colunas.** O passo de linha é 63 px (89 em 1440). O rótulo fica 8 px acima do topo do campo, mais perto do que em Perfil.

| Linha | Esquerda | Direita |
|---|---|---|
| 1 (rótulo y=132, campo y=140 a 168) | "Nome de exibição" + asterisco, texto, vazio | "Apelido da carteira" + asterisco, texto, vazio |
| 2 (rótulo y=195, campo y=203 a 231) | "Rede *", seleção com placeholder "Selecione uma rede" e chevron para baixo | "Nome do perfil" + asterisco, texto, vazio |
| 3 (rótulo y=258, campo y=266 a 294) | "Endereço da carteira" + asterisco, texto com placeholder "Endereço 0x da carteira" | Sem rótulo. Campo de texto com placeholder "ENS ou carteira secundária (opcional)" |
| 4 (rótulo y=322, campo y=330 a 358) | "Tipo de carteira" + asterisco, seleção com placeholder "Selecione uma carteira" e chevron para baixo | "Código de indicação" + asterisco, texto, vazio |
| 5 (rótulo y=385, campo y=393 a 421) | "E-mail" + asterisco, texto, vazio | "Nome ENS *", com seleção `.eth` + campo |

A seleção ocupa a largura total da coluna, com chevron a 13 px da borda direita.

**Botão do bloco:** "Salvar carteira", em x=325 a 419 (largura 94), y=445 a 473, altura 28. Preenchimento `color/primary`, texto `color/ink`, raio 6. O texto é peso 700, e cabe quase inteiro na largura. Fica alinhado à esquerda, a 24 px abaixo do último campo.

### Bloco "Carteira secundária"
Começa a 29 px abaixo do botão (y≈502). Sem linha divisória no desenho.

- **Título:** "Carteira secundária", peso 700, `color/foreground`, em x=325.
- **Lado direito, alinhado a x=939, mesma linha do título:**
  - Marcador circular vazio, com contorno de 1 px em `color/primary`, diâmetro ≈ 10 px, em x=695 a 706.
  - Rótulo "Igual à carteira principal" em `color/foreground`, peso 400, a 6 px do marcador.
  - "Adicionar" em `color/text-accent`, texto sem preenchimento, a 6 px do rótulo.
- **Texto de apoio**, a 19 px abaixo do título: "Você ainda não adicionou uma carteira secundária." em `color/text-secondary`, peso 400, menor que o título.
- Não há campo, card de carteira nem botão adicional abaixo.

## 1. Árvore de blocos, de fora para dentro

```
Página (fundo color/ink, padding horizontal 120 em 1440)
├─ Header (altura até a linha: 68 em 1440)
│  ├─ Marca "KURIO" (esquerda)
│  ├─ Nav central: Início (ativo, text-accent, 700, sublinhado), Mercado, Criadores, Aprenda
│  ├─ Ações (direita): lupa, carrinho + selo "6", botão "Entrar" (primary, raio 6)
│  └─ Linha de 1 px, color/border
└─ Corpo (duas colunas, sem vão de padding extra, vão de 27 em 1440 entre elas)
   ├─ Sidebar "Meu perfil" (311 em 1440, surface-card)
   │  ├─ Título "Meu perfil" (700)
   │  ├─ Item "Dados do perfil"
   │  ├─ Item "Carteiras"
   │  ├─ Item "Atividade"
   │  ├─ Item "Lista de interesse"
   │  ├─ Item "Ofertas"
   │  ├─ Item "Arquivos baixados"
   │  ├─ Item "Suporte"
   │  ├─ Linha divisória (color/border)
   │  └─ Item "Sair" (700)
   │  (item ativo: barra lateral de 4 px, color/primary)
   └─ Conteúdo (863 em 1440)
      ├─ [Perfil]
      │  ├─ Título "Perfil do colecionador"
      │  ├─ Grade 2 colunas
      │  │  ├─ Esq: Nome de exibição*, E-mail*, Apelido da carteira*
      │  │  └─ Dir: Nome de usuário*, Nome ENS * (seleção .eth + campo), Avatar (círculo + "Alterar" + "Remover")
      │  ├─ Subtítulo "Alterar senha" (coluna esquerda)
      │  ├─ Senha atual, Nova senha, Confirmar nova senha (campos com ícone de olho cortado)
      │  └─ Botão "Salvar"
      └─ [Carteiras]
         ├─ Bloco "Carteira principal"
         │  ├─ Título + "Adicionar" (direita)
         │  ├─ Texto de apoio
         │  ├─ Grade 2 colunas
         │  │  ├─ Esq: Nome de exibição*, Rede *, Endereço da carteira*, Tipo de carteira*, E-mail*
         │  │  └─ Dir: Apelido da carteira*, Nome do perfil*, (campo sem rótulo ENS/carteira secundária), Código de indicação*, Nome ENS *
         │  └─ Botão "Salvar carteira"
         └─ Bloco "Carteira secundária"
            ├─ Título + (marcador "Igual à carteira principal" + "Adicionar") à direita
            └─ Texto de apoio (estado vazio)
```

## 2. O que muda do desktop para o mobile

Os PNG não mostram mobile. O que sei vem só das regras do projeto, não do desenho:

- 768 é uma coluna, com padding horizontal 28.
- 390 usa a composição do frame de 414.

Como a sidebar, o header e a grade de duas colunas se rearranjam abaixo de 1440 não está desenhado. Não defino isso aqui.

## 3. O que não construir (não está no PNG)

- Qualquer mobile ou tablet de Perfil ou Carteiras.
- Estado preenchido, estado de erro, estado de foco, estado hover ou estado desabilitado de campo, botão ou item.
- Mensagem de validação, toast de sucesso, texto de ajuda sob campo.
- Lista de carteiras salvas, card de carteira secundária, formulário da carteira secundária.
- Dropdown aberto de Rede, Tipo de carteira e `.eth` (opções, ordem, valor padrão).
- Modal de troca ou remoção de avatar.
- Estado do ícone de olho com a senha visível.
- Itens de menu além dos listados, e qualquer sombra, gradiente ou cor fora da lista.
- Navegação real em "Atividade", "Lista de interesse", "Ofertas", "Arquivos baixados", "Suporte", "Criadores", "Aprenda" e "Adicionar". Não estão no escopo de navegação.
- Qualquer tamanho de fonte em px para títulos.

## 4. Lacunas (não dá para ler)

- **Tamanhos de fonte:** nenhum número está no PNG. Só dá para comparar: "Meu perfil" parece maior que os demais títulos, e os textos de apoio são menores que os rótulos.
- **Pesos 500 versus 700:** em "Alterar", "Salvar", "Início" e "Adicionar" não dá para separar com certeza.
- **Sublinhado do "Início":** a cor e a espessura exatas não são legíveis. Parece `color/primary`.
- **Fundo do item ativo da sidebar:** parece igual ao do card. A barra de 4 px é o único marcador legível.
- **Alinhamento horizontal dos rótulos da sidebar:** o início do texto varia de 116 a 121 px entre itens. Pode ser centralização do rótulo numa caixa fixa, ou desalinhamento do desenho. Não dá para decidir.
- **Cor dos ícones da sidebar e do olho:** parecem tons de `color/text-secondary` ou `color/secondary`. Não distingo entre os dois.
- **Cor do placeholder:** parece um tom mais apagado de `color/text-secondary`. A opacidade exata não é legível, e hex novo não entra.
- **Borda e fundo do botão "Entrar":** parece haver uma borda ou tom levemente diferente do preenchimento. Não dá para ler.
- **Corte visual no título "Carteira principal":** o descendente do "p" parece cortado, o que pode ser artefato do export. Não replico.
- **Distância título-subtítulo em Carteiras:** o título e o texto de apoio ficam colados (18 px entre linhas de base). A altura de linha não é legível.
- **Posição do selo "6" no carrinho:** o canto exato (superior direito) é aproximado.
- **Comportamento do marcador "Igual à carteira principal":** só se vê o estado vazio. Não sei se é rádio ou caixa de seleção.
- **Campo sem rótulo na linha 3 de Carteiras (coluna direita):** não dá para ler se ele é irmão do campo "Endereço da carteira" (segundo endereço) ou algo independente. O placeholder diz "ENS ou carteira secundária (opcional)".
- **Altura da página abaixo do conteúdo:** o PNG termina em y=768 com espaço vazio. Não dá para ler altura mínima, rolagem nem rodapé.
- **Escala do 1440:** os valores em 1440 são projeção do PNG de 1024. A cota real do Figma não está no arquivo.

## 3. Fora de escopo

- Frame mobile de perfil e de carteiras. Os arquivos não estão em `research/figma/`. O cenário 16 só empilha os blocos que o desktop já tem.
- Menu aberto de `Rede`, de `Tipo de carteira` e de sufixo além de `.eth`.
- Lista de opções dessas seleções. O PNG não traz os nomes.
- Upload, modal e remoção real de avatar.
- Carteira secundária preenchida, lista de carteiras salvas e segundo formulário.
- Ligar a carteira salva ao pagamento, ao fechar pedido ou ao rótulo `MetaMask` do recibo.
- `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados`, `Suporte`, `Criadores` e `Aprenda` navegando.
- Favorito, coleção, oferta e arquivo para baixar.
- Toast, estado de erro desenhado, hover desenhado e foco desenhado fora do campo que a casca já usa.
- Segundo cabeçalho. O cabeçalho e a barra inferior continuam os da casca já entregue.
- Chave de idempotência e socket.
- Dependência nova. Hex novo. `box-shadow`.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- O que a seção Tela marca em "O que não construir".

## 4. Atores e pré-condições

- Quem usa: Ada, Bruno e quem cria conta nesta sessão da loja. Sem sessão, `/perfil` e `/carteiras` abrem a entrada que já existe e, depois do sucesso, voltam ao caminho pedido.
- O que precisa existir antes: a loja simulada já nasce com Ada e Bruno, senha `kurio`, favorito, carrinho e pedido da semente. A sessão já entra, cria conta, sai e guarda a leitura numa chave própria. Sair já apaga chave que contém o identificador da pessoa. O cabeçalho, com sessão, já mostra `Sair` e o selo vivo do carrinho. `Início` já fica ativo só em `/`. A confirmação do pedido já abre sem cabeçalho. A simulação liga por padrão e desliga pela configuração já existente.

Perfil da semente. Nome, e-mail, senha, favorito, carrinho e pedido já homologados continuam. Esta fatia só completa os campos novos.

| Pessoa | Nome de exibição | Nome de usuário | E-mail | Nome ENS | Apelido da carteira | Senha |
| --- | --- | --- | --- | --- | --- | --- |
| Ada | Ada | vazio | `ada@kurio.test` | vazio | vazio | `kurio` |
| Bruno | Bruno | vazio | `bruno@kurio.test` | vazio | vazio | `kurio` |

Conta nova nasce com o nome do cadastro em `Nome de exibição`, o e-mail da conta em `E-mail`, e o restante do perfil vazio. A senha é a do cadastro.

Carteira principal da semente, de Ada, de Bruno e de conta nova: todos os textos vazios. `Rede` mostra `Selecione uma rede`. `Tipo de carteira` mostra `Selecione uma carteira`. O sufixo mostra `.eth`. Não há carteira secundária.

## 5. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. A cópia fixa e o arranjo em 1440 são os da seção Tela. Cenário não pede bloco que o contrato marcou como ausente. O cabeçalho desenhado no PNG, com `Entrar`, selo `6` e `Início` ativo, é a casca no export. Com sessão, o botão do topo continua `Sair`, o selo continua a quantidade viva e `Início` continua ativo só em `/`.

A coluna do formulário só mostra os campos depois da leitura. Não há gravação otimista. A pessoa espera a resposta. Abaixo de 1440 vale o cenário 16. Não há outra composição.

### Cenário 1: Ada vê o próprio perfil

- Dado: Ada está na sessão, a loja está na semente e a largura é de 1440 ou mais.
- Quando: ela abre `/perfil`.
- Então: a casca permanece, com cabeçalho. O miolo é a sidebar `Meu perfil` e o formulário `Perfil do colecionador` da seção Tela. A barra de `color/primary` marca `Dados do perfil`. `Nome de exibição` vale `Ada`. `E-mail` vale `ada@kurio.test`. `Nome de usuário`, `Nome ENS` e `Apelido da carteira` estão vazios, sem placeholder. O sufixo ao lado de `Nome ENS` é `.eth`. O avatar é o círculo com `Alterar` e `Remover`. `Alterar senha` mostra os três campos vazios, cada um com o olho cortado. O botão é `Salvar`. Não há parágrafo solto com o e-mail. A senha não aparece.

### Cenário 2: Bruno não vê o perfil da Ada

- Dado: Bruno está na sessão e a loja está na semente.
- Quando: ele abre `/perfil`.
- Então: `Nome de exibição` vale `Bruno` e `E-mail` vale `bruno@kurio.test`. O e-mail da Ada não está no campo. O dado gravado da Ada não muda.

### Cenário 3: Conta nova abre vazia, fora nome e e-mail

- Dado: Lia acabou de criar a conta com o nome `Lia` e o e-mail `lia@kurio.test`.
- Quando: ela abre `/perfil` e, em seguida, `/carteiras`.
- Então: no perfil, `Nome de exibição` vale `Lia`, `E-mail` vale `lia@kurio.test` e os outros textos começam vazios. Na carteira, a principal está vazia e a secundária mostra `Você ainda não adicionou uma carteira secundária.`

### Cenário 4: Salvar o perfil grava e atualiza a sessão

- Dado: Ada está na sessão, no perfil da semente.
- Quando: ela preenche `Nome de exibição` com `Ada Costa`, `Nome de usuário` com `ada`, `E-mail` com `ada.costa@kurio.test`, `Nome ENS` com `ada`, `Apelido da carteira` com `principal`, deixa os três campos de senha vazios e aciona `Salvar`.
- Então: a loja grava esse perfil só para Ada. A sessão continua aberta. O nome da sessão passa a ser `Ada Costa`. O e-mail da sessão passa a ser `ada.costa@kurio.test`. A senha continua `kurio` e não volta na sessão. Os campos mostram o texto gravado. Os três campos de senha ficam vazios. Não há toast. Bruno continua com `Bruno` e `bruno@kurio.test`.

### Cenário 5: Perfil recusado

- Dado: Ada está no perfil.
- Quando: um destes está vazio, ou só com espaço: `Nome de exibição`, `Nome de usuário`, `E-mail`, `Nome ENS`, `Apelido da carteira`.
- Então: nada grava e a coluna do formulário mostra `Informe os campos obrigatórios do perfil.` A sidebar continua, com `Sair`.
- Quando: os cinco têm texto e o e-mail é o de Bruno, sem diferenciar maiúsculas, como `Bruno@kurio.test`.
- Então: nada grava, a sessão de Ada não troca de e-mail e a frase é `Este e-mail já tem conta.`
- Quando: o e-mail é o dela mesma, com outra caixa, como `Ada@kurio.test`, e os outros obrigatórios têm texto.
- Então: grava. É a mesma conta, não outra.

### Cenário 6: Senha no mesmo salvar

- Dado: Ada está no perfil com os cinco obrigatórios preenchidos.
- Quando: os três campos de senha ficam vazios e ela salva.
- Então: a senha gravada não muda. O restante do perfil grava se o cenário 5 permitir.
- Quando: ela preenche só um ou dois dos três, ou a senha atual não é a gravada.
- Então: nada grava, nem o nome nem o e-mail desta tentativa. A frase é `A senha atual não confere.` A sessão continua aberta. A próxima entrada ainda usa a senha anterior.
- Quando: a senha atual confere e `Nova senha` é diferente de `Confirmar nova senha`, inclusive se uma das duas está vazia.
- Então: nada grava. A frase é `As senhas não conferem.`
- Quando: a senha atual é `kurio`, a nova é `kurio-nova` e a confirmação é `kurio-nova`.
- Então: o perfil grava, a senha da próxima entrada passa a ser `kurio-nova` e a sessão não fecha. Os três campos de senha voltam vazios. `kurio` deixa de entrar.

### Cenário 7: O olho só mostra a senha daquele campo

- Dado: os três campos de senha estão visíveis, no estado cortado da seção Tela.
- Quando: a pessoa aciona o olho de `Nova senha`.
- Então: só esse campo alterna entre oculta e visível. Os outros dois não mudam. Não há frame do olho aberto. O ícone fica no próprio formulário, sem biblioteca. Enquanto a senha está visível, o olho fica sem o corte.

### Cenário 8: Avatar e atalhos ficam visíveis e não entram

- Dado: Ada está em `/perfil` ou em `/carteiras`.
- Quando: ela aciona `Alterar`, `Remover`, `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados` ou `Suporte`.
- Então: o endereço não muda, nada grava, não abre modal, não pede arquivo e não aparece sucesso. O avatar não entra na leitura do perfil.

### Cenário 9: Salvar a carteira principal

- Dado: Ada está na sessão, em `/carteiras`, na semente, com largura de 1440 ou mais.
- Quando: a rota abre.
- Então: a mesma sidebar marca `Carteiras`. O bloco `Carteira principal` e o bloco `Carteira secundária` seguem a seção Tela. Os textos da principal estão vazios. `Rede` mostra `Selecione uma rede`. `Tipo de carteira` mostra `Selecione uma carteira`. O campo sem rótulo mostra `ENS ou carteira secundária (opcional)`. O endereço vazio mostra `Endereço 0x da carteira`. A secundária mostra o marcador vazio e `Você ainda não adicionou uma carteira secundária.`
- Quando: ela preenche `Nome de exibição`, `Apelido da carteira`, `Nome do perfil`, `Endereço da carteira` com `carteira-ada`, `Código de indicação`, `E-mail` e `Nome ENS`, deixa `Rede`, `Tipo de carteira` e o campo sem rótulo vazios, e aciona `Salvar carteira`.
- Então: a loja grava a carteira principal só da Ada. `Rede` e `Tipo de carteira` ficam vazios. O asterisco dos dois continua visível. O salvar não espera um valor que ela não pode escolher. O menu desses dois não abre. O sufixo continua `.eth`, sem outra opção. O campo sem rótulo, vazio, não cria carteira secundária. Os campos com texto mostram o valor gravado. Não há toast. O perfil da Ada não muda.

### Cenário 10: Carteira recusada e endereço livre

- Dado: Ada está na carteira principal.
- Quando: falta texto, ou o texto é só espaço, em `Nome de exibição`, `Apelido da carteira`, `Nome do perfil`, `Endereço da carteira`, `Código de indicação`, `E-mail` ou `Nome ENS`.
- Então: nada grava e a frase é `Informe os campos obrigatórios da carteira.`
- Quando: o endereço é `nao-e-hex` e os outros obrigatórios têm texto.
- Então: grava. Não há validação de `0x`. O e-mail da carteira pode repetir o de outra conta. Ele não é o e-mail da sessão.

### Cenário 11: O mesmo rótulo não copia de um formulário para o outro

- Dado: Ada gravou no perfil `Nome de exibição` `Ada Costa`, `Apelido da carteira` `principal`, `E-mail` `ada.costa@kurio.test` e `Nome ENS` `ada`.
- Quando: ela abre `/carteiras` sem ter gravado a carteira.
- Então: os campos de mesmo rótulo na carteira continuam vazios.
- Quando: ela grava a carteira com outros textos e volta ao perfil.
- Então: o perfil continua com `Ada Costa`, `principal`, `ada.costa@kurio.test` e `ada`. Um salvar não apaga o outro.

### Cenário 12: A carteira salva não muda o recibo

- Dado: Ada gravou a carteira principal com endereço `carteira-ada`.
- Quando: ela abre o recibo do pedido da semente.
- Então: o rótulo da carteira no recibo continua `MetaMask`. O pagamento não passa a usar `carteira-ada`. A frase `Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.` continua só como cópia.

### Cenário 13: Sidebar, guarda e sair

- Dado: Ada está na sessão.
- Quando: em `/perfil` ela aciona `Carteiras`.
- Então: abre `/carteiras` e a barra marca `Carteiras`.
- Quando: em `/carteiras` ela aciona `Dados do perfil`.
- Então: abre `/perfil` e a barra marca `Dados do perfil`.
- Quando: ela aciona `Sair` na sidebar.
- Então: a sessão acaba, do mesmo modo que o `Sair` do topo. O que a tela guardou só para Ada sai, inclusive o perfil e a carteira em cache. O catálogo permanece. A guarda abre a entrada de novo.
- Dado: não há sessão.
- Quando: a pessoa abre `/perfil` ou `/carteiras`.
- Então: o formulário não aparece. A entrada abre e, depois do sucesso, volta a esse caminho. As duas rotas, com sessão, continuam com cabeçalho. A confirmação do pedido continua sem cabeçalho.

### Cenário 14: Cada pessoa só lê e grava o próprio dado

- Dado: Ada está na sessão.
- Quando: a leitura ou a gravação é do perfil ou da carteira dela.
- Então: volta o dado da Ada.
- Quando: não há sessão.
- Então: a loja recusa a leitura e a gravação. A tela não mostra o formulário preenchido.
- Quando: dois salvamentos do mesmo formulário seguem um ao outro, com corpos diferentes.
- Então: fica o último corpo. Não há chave de idempotência. A tela espera cada resposta antes de mostrar o valor gravado.

### Cenário 15: Carregando e falha

- Dado: Ada está na sessão e a leitura ainda não voltou.
- Quando: ela está em `/perfil` ou em `/carteiras`.
- Então: a coluna do formulário mostra `Carregando`. A sidebar continua no lugar, com `Sair`. Não há bloco novo.
- Quando: a leitura do perfil falha, ou a gravação do perfil falha depois de um corpo que o cenário 5 e o cenário 6 aceitariam.
- Então: a frase é `Não foi possível carregar o perfil.` ou `Não foi possível salvar o perfil.` A sidebar continua.
- Quando: a leitura ou a gravação da carteira falha do mesmo modo.
- Então: a frase é `Não foi possível carregar as carteiras.` ou `Não foi possível salvar a carteira.`
- Quando: a frase aparece.
- Então: é texto na coluna do formulário. Não há toast, card de erro nem estado desenhado. O dado anterior da loja permanece se a gravação não chegou a valer.

### Cenário 16: Abaixo de 1440, a mesma página em uma coluna

- Dado: a largura é menor que 1440, inclusive 768 e 390.
- Quando: Ada abre `/perfil` ou `/carteiras`.
- Então: não há segunda tela nem frame de telefone. O raio 40 não entra. O cabeçalho e a barra inferior continuam os da casca. O miolo é uma coluna: a sidebar inteira e, abaixo dela, o formulário. Os blocos e a cópia são os da seção Tela, na ordem abaixo. A casca não ganha outro padding. O formulário não soma um padding horizontal próprio.
- Ordem em `/perfil`:
  1. Sidebar, com os itens na ordem da seção Tela e `Sair` no fim.
  2. `Perfil do colecionador`.
  3. `Nome de exibição`.
  4. `Nome de usuário`.
  5. `E-mail`.
  6. `Nome ENS`, com `.eth` e o campo lado a lado, um controle só.
  7. `Apelido da carteira`.
  8. `Avatar`, com círculo, `Alterar` e `Remover` na mesma faixa. Se a faixa não couber, ela quebra dentro do bloco e não vira outra seção.
  9. `Alterar senha`.
  10. `Senha atual`, `Nova senha`, `Confirmar nova senha`.
  11. `Salvar`, alinhado à esquerda.
- Ordem em `/carteiras`:
  1. Sidebar.
  2. Faixa de `Carteira principal` com `Adicionar` no fim. Se não couber, `Adicionar` desce na mesma faixa.
  3. `Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.`
  4. `Nome de exibição`, `Apelido da carteira`, `Rede`, `Nome do perfil`, `Endereço da carteira`, o campo sem rótulo, `Tipo de carteira`, `Código de indicação`, `E-mail`, `Nome ENS` com o par `.eth` ainda lado a lado.
  5. `Salvar carteira`, alinhado à esquerda.
  6. Faixa de `Carteira secundária`: marcador vazio, `Igual à carteira principal`, `Adicionar`, nessa ordem. Em 390 essa faixa pode quebrar. A quebra não cria bloco, card nem formulário.
  7. `Você ainda não adicionou uma carteira secundária.`
- Quando: ela aciona `Adicionar`, em qualquer uma das duas faixas, ou o marcador `Igual à carteira principal`.
- Então: o endereço não muda, o marcador continua vazio, nada é copiado da carteira principal e não aparece sucesso.

### Cenário 17: Recomeço devolve a semente

- Dado: Ada mudou o perfil e a carteira, e Lia criou conta.
- Quando: a loja recomeça.
- Então: perfil e carteira de Ada e de Bruno voltam à tabela da seção 4. A senha dos dois volta a `kurio`. Favorito, carrinho e pedido deles continuam os já homologados. Lia deixa de existir. A carteira principal volta vazia. A secundária continua ausente.

## 6. Regras de negócio

- Regra 1: a partir de 1440 o miolo segue a seção Tela, sidebar à esquerda e formulário à direita. Abaixo de 1440 vale o cenário 16. Não há terceiro desenho.
- Regra 2: esta fatia não pinta outro cabeçalho. Com sessão, o topo continua `Sair`. O selo do carrinho continua a quantidade viva. `Início` continua ativo só em `/`. O `Entrar` e o selo `6` do PNG não voltam.
- Regra 3: a guarda de `/perfil` e `/carteiras` permanece. Sem sessão, a rota abre a entrada e volta ao caminho depois do sucesso. As duas rotas continuam com cabeçalho. A confirmação do pedido continua sem cabeçalho.
- Regra 4: abaixo de 1440 a coluna usa a casca que já existe. No desktop o recuo horizontal da casca já é 120. Do breakpoint médio até o desktop, a casca já usa 28. Abaixo do breakpoint médio, a casca já usa 24. Esta fatia não reabre esse recuo e não soma outro. A barra inferior e a folga que a casca já deixa para ela permanecem.
- Regra 5: campo usa raio 5, borda `color/border` e fundo `color/ink`. Botão de página (`Salvar`, `Salvar carteira`, `Alterar`) usa raio 6, preenchimento `color/primary` e texto `color/ink`. Sem `box-shadow`. Sem hex novo. Título sem número de tamanho.
- Regra 6: `Dados do perfil` abre `/perfil`. `Carteiras` abre `/carteiras`. A barra de `color/primary` marca a rota atual, sem mudar peso nem cor do texto. `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados` e `Suporte` ficam visíveis. O clique não navega e não mostra sucesso. `Sair` na sidebar encerra a sessão como o `Sair` do topo.
- Regra 7: no perfil, `Nome de exibição`, `Nome de usuário`, `E-mail`, `Nome ENS` e `Apelido da carteira` são obrigatórios. Vazio, ou só espaço, mostra `Informe os campos obrigatórios do perfil.` e não grava. E-mail igual ao de outra conta, sem diferenciar maiúsculas, mostra `Este e-mail já tem conta.` e não grava. O e-mail da própria conta, mesmo com outra caixa, grava.
- Regra 8: `Alterar senha` entra no mesmo salvar. Os três vazios deixam a senha. Se um vier preenchido, os três entram na conferência. Senha atual vazia ou diferente da gravada: `A senha atual não confere.` Senha atual certa e nova diferente da confirmação, inclusive uma delas vazia: `As senhas não conferem.` Nos dois casos nada grava, nem o resto do formulário. Senha atual certa e nova igual à confirmação, com texto: troca a senha da próxima entrada e mantém a sessão. A ordem da recusa é a regra 7, depois o e-mail de outra conta, depois esta regra.
- Regra 9: a resposta da sessão continua com identificador, nome e e-mail. O nome da sessão passa a ser o nome de exibição. A senha não volta. A leitura do perfil também não traz senha. Depois de um salvar aceito, os três campos de senha ficam vazios e os outros campos mostram o texto gravado.
- Regra 10: perfil e carteira principal são registros separados. O mesmo rótulo não preenche o outro formulário. Salvar um não apaga o outro.
- Regra 11: na carteira, `Nome de exibição`, `Apelido da carteira`, `Nome do perfil`, `Endereço da carteira`, `Código de indicação`, `E-mail` e `Nome ENS` exigem texto. Vazio, ou só espaço, mostra `Informe os campos obrigatórios da carteira.` O endereço é texto livre. `Rede` e `Tipo de carteira` permanecem no placeholder, vão vazios e não bloqueiam o salvar. O asterisco deles continua. O campo sem rótulo é opcional. Se tiver texto, esse texto volta no mesmo campo. Ele não cria a carteira secundária. O e-mail da carteira não precisa ser único e não altera o e-mail da sessão.
- Regra 12: o sufixo desenhado é `.eth`, fixo, no perfil e na carteira. O chevron não abre lista. O texto gravado é o do campo ao lado.
- Regra 13: a carteira secundária permanece no estado vazio do contrato. `Adicionar` e o marcador `Igual à carteira principal` ficam visíveis. O clique não navega, não preenche e não mostra sucesso.
- Regra 14: `Alterar` e `Remover` ficam visíveis. O clique não abre modal, não envia arquivo, não navega e não mostra sucesso. Não há avatar na leitura.
- Regra 15: o olho alterna só o próprio campo, como no entrar. A cor do ícone nesta tela é `color/text-secondary`. O desenho fica no formulário, sem biblioteca.
- Regra 16: não há toast. Frase de recusa ou de falha aparece na coluna do formulário, sem bloco novo. Antes da leitura, essa coluna mostra `Carregando` e a sidebar continua.
- Regra 17: a pessoa só lê e grava o próprio perfil e a própria carteira. Sem sessão, a loja recusa. O cliente espera a resposta. Não há atualização otimista. Dois salvamentos seguidos ficam com o último corpo. Não há chave de idempotência.
- Regra 18: o cache privado do perfil é `['usuario', id, 'perfil']`. O da carteira é `['usuario', id, 'carteiras']`. Sair já apaga chave que contém o identificador. Esta fatia não muda essa limpeza. As chaves novas carregam o identificador para serem apagadas.
- Regra 19: o recomeço devolve perfil e carteira à semente da seção 4, junto com nome, e-mail, senha `kurio`, favorito, carrinho e pedido já homologados.
- Regra 20: a carteira salva não liga ao pagamento, ao fechar pedido nem ao rótulo `MetaMask` do recibo.
- Regra 21: a tela não fala com o cliente HTTP. Pede o perfil e a carteira pelo cache de leitura. Componente e hook não importam o atendimento da simulação.
- Regra 22: os endereços estáveis desta fatia são a leitura e a gravação do perfil, e a leitura e a gravação da carteira principal, mais o recomeço que já existia. Estão aqui porque a implementação segue esta spec: `GET /api/perfil`, `PUT /api/perfil`, `GET /api/carteiras`, `PUT /api/carteiras/principal`. Sem sessão, a resposta é não autorizado. A pessoa não lê nem grava o dado de outra. Campo obrigatório vazio e senha que não confere respondem como pedido inválido, com as frases das regras 7, 8 e 11. E-mail de outra conta responde como conflito, com `Este e-mail já tem conta.` Falha de leitura ou de gravação usa as frases do cenário 15. `POST /api/dev/reset` devolve perfil e carteira à semente. `GET /api/sessao` continua devolvendo identificador, nome e e-mail, sem senha.
- Regra 23: o teste da sessão que hoje espera `ada@kurio.test` no texto solto e nenhum campo em `/perfil` passa a ler o valor do campo `E-mail` e o `Sair` dentro do miolo. A prova da loja cobre Ada contra Bruno, e-mail já usado, senha atual errada, senha nova, carteira vazia na semente e o recomeço.
- Regra 24: ícones da sidebar, olho, chevron, círculo do avatar e marcador são desenho no próprio componente, sem dependência nova. Placeholder usa `color/text-secondary`, sem opacidade nova e sem hex novo. `Alterar`, `Salvar` e `Salvar carteira` usam peso 700. `Adicionar` usa peso 400. O "p" de `Carteira principal` não fica cortado.

Lacunas do contrato que esta spec fecha, sem reescrever a seção Tela:

- Abaixo de 1440: cenário 16. Mesmos blocos, uma coluna, sem tela mobile nova.
- Olho aberto: cenário 7. Sem frame novo.
- Marcador `Igual à carteira principal`: continua vazio. O clique não marca.
- Campo sem rótulo: opcional, gravado no mesmo campo se tiver texto, sem criar carteira secundária.
- Peso dos botões e cor do ícone: regra 24.
- Tamanho de título: sem número inventado.

## 7. Critérios de Done desta feature

- [ ] O miolo de `/perfil` e de `/carteiras` segue a seção Tela em 1440
- [ ] Abaixo de 1440, inclusive 390, a coluna do cenário 16 aparece, com a casca atual
- [ ] Os cenários acima passam
- [ ] A prova automática cobre isolamento entre Ada e Bruno, e-mail já usado, senha atual errada, senha nova, carteira vazia na semente, recomeço e o teste da sessão ajustado na regra 23
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, em 1440 e em 390: Ada vê o próprio e-mail, salva o perfil sem levar o dado ao Bruno, a senha nova entra de novo, a carteira salva não muda o recibo, e os cliques fora de escopo não navegam
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/contracts/profile.ts`, `src/lib/contracts/wallet.ts`, `src/lib/api/profile.ts`, `src/lib/api/wallet.ts`, `src/mocks/**` e o teste da sessão fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 8. Escopo de arquivos permitido

- Pode criar ou editar:
  - `src/lib/contracts/profile.ts`
  - `src/lib/contracts/wallet.ts`
  - `src/lib/api/profile.ts`
  - `src/lib/api/wallet.ts`
  - `src/lib/query/profile.ts`
  - `src/lib/query/wallet.ts`
  - `src/features/profile/`
  - `src/features/wallet/`
  - `src/routes/perfil.tsx`
  - `src/routes/carteiras.tsx`
  - `src/features/session/profile-page.tsx` (sai: a rota deixa de usar esta página)
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/features/session/auth-entry.test.tsx`
- Não pode editar sem pedido:
  - `src/lib/contracts/session.ts`
  - `src/lib/contracts/order.ts`
  - `src/lib/contracts/nft.ts`
  - `src/lib/contracts/cart.ts`
  - `src/lib/money.ts`
  - `src/lib/socket/**`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/features/cart/**`
  - `src/features/catalog/**`
  - `src/features/home/**`
  - `src/routes/pagamento.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.tsx`
  - `src/components/layout/mobile-tabs.tsx`
  - `src/styles/tokens.css`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

`src/lib/contracts/**`, `src/lib/api/**`, `src/mocks/**` e o toque em `src/features/session/**` são path crítico. Entram só com esta spec aprovada e com review humano do diff. A senha gravada muda. A resposta da sessão continua sem ela. Não há chave de idempotência nem evento de socket nesta fatia.

Se a sidebar ou a coluna abaixo de 1440 não couber nesses arquivos, a implementação para e pede aprovação. Não amplia o escopo para a casca, o pagamento nem o recibo por conta própria.

## 9. Riscos e dúvidas abertas

A seção Decisão do plano está em branco. Não houve item aceito nem item descartado para repetir aqui. O corpo do plano entra nesta spec.

O contrato não rearranja a sidebar nem a grade abaixo de 1440, e marca "qualquer mobile ou tablet" como o que não construir. Aprovar esta spec adota o cenário 16: uma coluna com os mesmos blocos, sem PNG mobile e sem bloco novo. Também adota os fechamentos da regra 24 e das lacunas no fim da seção 6.

Outros riscos:

- `Rede` e `Tipo de carteira` têm asterisco e não têm lista. Esta fatia grava os dois vazios. Se o aceite exigir a lista, a implementação espera os nomes. O PNG não os traz.
- O mesmo rótulo aparece no perfil e na carteira. São registros separados. Juntar os dois faria um salvar apagar o outro.
- Em 390, a faixa `Igual à carteira principal` mais `Adicionar` pode quebrar a linha. A quebra não cria bloco. O cenário 16 descreve o encaixe.
- A casca abaixo do breakpoint médio usa padding horizontal 24. A regra já fechada das telas sem frame fala em 28. Esta fatia não reabre o padding da casca.
- Estender a semente mexe em `src/mocks/**`. Nome, e-mail, senha `kurio`, favorito, carrinho e pedido de Ada e Bruno continuam os já homologados.
- O teste da sessão em `auth-entry.test.tsx` exige `ada@kurio.test` no texto e `main input` vazio em `/perfil`. O campo novo guarda o e-mail no valor, não num parágrafo. O teste muda junto com a tela. `Sair` continua dentro do miolo, senão o clique desse teste perde o botão.
- O header do PNG mostra `Entrar` e o selo `6`. Reverter a casca para esse desenho apagaria `Sair` e a quantidade viva.
- A resposta do perfil não traz senha. Se a implementação devolver a senha no perfil ou na sessão, a spec não foi atendida.

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:

## 11. Tarefas de implementação

Instrução para quem implementa. As seções 1 a 10 continuam valendo. Se um passo daqui divergir de um cenário ou de uma regra, pare e siga o cenário. A seção 2 continua sendo a UI: este passo não redesenha região, cópia nem composição.

Como executar:

- Faça um passo e só então o próximo. O critério "Pronto quando" desse passo vale antes de abrir o arquivo do passo seguinte.
- Importe tipo com `import type`. Importe valor com sufixo `.ts` ou `.tsx`, como o resto de `src`.
- Exporte função nomeada. Sem `enum`. Sem classe de componente. A classe de erro do cliente HTTP segue `OrderActionError` em `src/lib/api/order.ts`.
- Não crie dependência, hex, `box-shadow`, toast, `<select>`, `<input type="file">` nem arquivo fora do mapa abaixo.
- Não edite `src/lib/query/session.ts`, `src/lib/contracts/session.ts`, `src/components/ui/input.tsx`, `src/components/ui/button.tsx`, `src/components/layout/**`, `src/routeTree.gen.ts` nem os arquivos da lista "Não pode editar" da seção 8.
- Não importe `src/mocks/**` em componente, hook, `src/lib/api/**` nem `src/lib/query/**`.
- Não importe `src/features/session/auth-icons.tsx`. A cor do olho de lá é outra.
- Não faça commit.

### Mapa de arquivos

Criar, com estes nomes:

- `src/lib/contracts/profile.ts`
- `src/lib/contracts/wallet.ts`
- `src/lib/api/profile.ts`
- `src/lib/api/wallet.ts`
- `src/lib/query/profile.ts`
- `src/lib/query/wallet.ts`
- `src/features/profile/account-icons.tsx`
- `src/features/profile/account-sidebar.tsx`
- `src/features/profile/password-fields.tsx`
- `src/features/profile/profile-fields.tsx`
- `src/features/profile/profile-form.tsx`
- `src/features/profile/profile-page.tsx`
- `src/features/profile/profile-wallet.test.tsx`
- `src/features/wallet/wallet-fields.tsx`
- `src/features/wallet/wallet-primary-form.tsx`
- `src/features/wallet/wallet-secondary.tsx`
- `src/features/wallet/wallet-page.tsx`

Editar:

- `src/mocks/fixtures/users.ts`
- `src/mocks/store.ts`
- `src/mocks/handlers.ts`
- `src/mocks/handlers.test.ts`
- `src/routes/perfil.tsx`
- `src/routes/carteiras.tsx`
- `src/features/session/auth-entry.test.tsx`

Apagar, no passo 19:

- `src/features/session/profile-page.tsx`

A função de loja fica em `src/mocks/store.ts`. Não crie outro módulo em `src/mocks/`.

### Chaves fechadas

O JSON e o TypeScript usam estas chaves. A tela usa os rótulos da seção 2. Não traduza a chave para o rótulo e não invente outra chave.

| Chave | Onde vive | Rótulo na tela |
| --- | --- | --- |
| `displayName` | resposta do perfil e corpo dos dois PUT. No perfil gravado, é `user.name` | Nome de exibição |
| `username` | `user.profile` | Nome de usuário |
| `email` | no perfil, é `user.email`. Na carteira, é `user.wallet.email` | E-mail |
| `ensName` | texto ao lado de `.eth`. O sufixo não entra no JSON | Nome ENS |
| `walletNickname` | `user.profile` | Apelido da carteira, só no perfil |
| `nickname` | `user.wallet` | Apelido da carteira, só na carteira |
| `profileName` | `user.wallet` | Nome do perfil |
| `address` | `user.wallet` | Endereço da carteira |
| `secondaryAddress` | `user.wallet`. Campo sem rótulo | placeholder `ENS ou carteira secundária (opcional)` |
| `network` | `user.wallet`, sempre `''` | Rede |
| `walletType` | `user.wallet`, sempre `''` | Tipo de carteira |
| `referralCode` | `user.wallet` | Código de indicação |
| `currentPassword` | só o corpo do `PUT /api/perfil` | Senha atual |
| `nextPassword` | só o corpo do `PUT /api/perfil` | Nova senha |
| `confirmPassword` | só o corpo do `PUT /api/perfil` | Confirmar nova senha |

`user.password` não sai em `GET /api/perfil`, `PUT /api/perfil`, `GET /api/carteiras`, `PUT /api/carteiras/principal` nem `GET /api/sessao`.

Perfil e carteira são objetos diferentes. Gravar um deixa o outro como está.

### Medidas fechadas

Use estas classes. Os números vêm da coluna 1440 da seção 2. Não recalcule a partir do PNG de 1024 e não troque o token de cor.

- Moldura das duas rotas: `flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-[27px]`. Sem padding horizontal próprio.
- Sidebar: `w-full bg-surface-card desktop:w-[311px] desktop:shrink-0`. Sem `rounded-*` e sem sombra.
- Linha da sidebar: `relative flex h-[45px] items-center gap-2 px-2`.
- Barra do item ativo: `absolute inset-y-0 left-0 w-1 bg-primary`. O texto do item ativo continua `font-normal text-text-accent`.
- Grade dos dois formulários: `grid grid-cols-1 gap-y-[23px] desktop:grid-cols-2 desktop:gap-x-7`.
- Rótulo do perfil: `mb-[25px] block font-normal text-foreground`. Sem classe de tamanho.
- Rótulo da carteira: `mb-[11px] block font-normal text-foreground`.
- Rótulo da senha: `mb-[20px] block font-normal text-foreground`. Sem asterisco.
- Campo: o `Input` de `@/components/ui/input.tsx` com `h-[39px] bg-ink placeholder:text-text-secondary`. Não edite o componente.
- Botão de página (`Salvar`, `Salvar carteira`, `Alterar`): o `Button` de `@/components/ui/button.tsx` com `h-[39px] font-bold`. `Salvar` e `Salvar carteira` usam `w-[132px]`. `Alterar` usa `w-[97px]`. Os outros controles são `button` nativo, não o `Button`.
- Par `.eth`: `flex flex-nowrap items-center gap-[11px]`. A seleção tem `h-[39px] w-[77px] shrink-0`.
- Círculo do avatar: `size-[51px] shrink-0 rounded-full bg-surface-card`.
- Título de bloco: `font-bold text-foreground`. Sem `text-[Npx]`, sem `overflow-hidden`, sem altura fixa. O "p" de `Carteira principal` fica inteiro.
- Frase de recusa ou de falha: `<p className="m-0 text-text-coral">`. `Carregando` usa `<p className="m-0 text-foreground">`. Sem card, sem toast, sem `role="alert"` com moldura.

Asterisco em `text-text-coral`, colado no fim do rótulo. `Rede` e `Nome ENS` têm um espaço antes do asterisco. Os outros obrigatórios não têm esse espaço. Senha, avatar e o campo sem rótulo não têm asterisco.

### Passo 1. Contrato do perfil

Arquivo: `src/lib/contracts/profile.ts`

Exporte estas declarações e nada além delas:

```ts
export interface ProfileDetails {
  username: string
  ensName: string
  walletNickname: string
}

export interface Profile {
  displayName: string
  username: string
  email: string
  ensName: string
  walletNickname: string
}

export interface ProfileUpdate {
  displayName: string
  username: string
  email: string
  ensName: string
  walletNickname: string
  currentPassword: string
  nextPassword: string
  confirmPassword: string
}

export const profileMessages = {
  required: 'Informe os campos obrigatórios do perfil.',
  emailTaken: 'Este e-mail já tem conta.',
  currentPassword: 'A senha atual não confere.',
  passwordMismatch: 'As senhas não conferem.',
  loadFailed: 'Não foi possível carregar o perfil.',
  saveFailed: 'Não foi possível salvar o perfil.',
  loading: 'Carregando',
} as const
```

Pronto quando: `pnpm typecheck` passa. Nenhum outro arquivo mudou.

### Passo 2. Contrato da carteira

Arquivo: `src/lib/contracts/wallet.ts`

```ts
export interface PrimaryWallet {
  displayName: string
  nickname: string
  network: string
  profileName: string
  address: string
  secondaryAddress: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
}

export const walletMessages = {
  required: 'Informe os campos obrigatórios da carteira.',
  loadFailed: 'Não foi possível carregar as carteiras.',
  saveFailed: 'Não foi possível salvar a carteira.',
  loading: 'Carregando',
  emptySecondary: 'Você ainda não adicionou uma carteira secundária.',
  paymentCopy: 'Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.',
} as const

export const walletPlaceholders = {
  network: 'Selecione uma rede',
  walletType: 'Selecione uma carteira',
  address: 'Endereço 0x da carteira',
  secondaryAddress: 'ENS ou carteira secundária (opcional)',
  ensSuffix: '.eth',
} as const
```

Não crie tipo de carteira secundária. Não crie lista de redes.

Pronto quando: `pnpm typecheck` passa.

### Passo 3. Semente, cadastro e o teste que compara a semente

Arquivos: `src/mocks/fixtures/users.ts`, `src/mocks/store.ts`, `src/mocks/handlers.test.ts`.

Em `users.ts`:

- Importe `ProfileDetails` de `@/lib/contracts/profile.ts` e `PrimaryWallet` de `@/lib/contracts/wallet.ts`.
- Acrescente em `SeedUser` os campos `profile: ProfileDetails` e `wallet: PrimaryWallet`.
- Exporte `blankProfile()` e `blankWallet()`, cada chamada devolvendo um objeto novo.

```ts
export function blankProfile(): ProfileDetails {
  return { username: '', ensName: '', walletNickname: '' }
}

export function blankWallet(): PrimaryWallet {
  return {
    displayName: '',
    nickname: '',
    network: '',
    profileName: '',
    address: '',
    secondaryAddress: '',
    walletType: '',
    referralCode: '',
    email: '',
    ensName: '',
  }
}
```

- Ada e Bruno ganham `profile: blankProfile()` e `wallet: blankWallet()`. `name`, `email`, `password`, `favorites`, `cart` e `orders` ficam como já estão.

Em `signUpUser`, o objeto da conta nova inclui `profile: blankProfile()` e `wallet: blankWallet()`. `name` e `email` continuam os do cadastro, já com `trim`. A senha continua a do cadastro.

Em `handlers.test.ts`, o array `happyUsers` ganha, em Ada e em Bruno, os mesmos dois objetos vazios escritos por extenso (não chame a função ali). Não mude o restante de `happyUsers`. O `it` que já faz `expect(readUsers()).toEqual(happyUsers)` precisa continuar verdadeiro.

Pronto quando: `pnpm test -- src/mocks/handlers.test.ts` passa. `GET /api/perfil` ainda não existe.

### Passo 4. Leitura e gravação do perfil na loja

Arquivo: `src/mocks/store.ts` somente.

Importe `Profile` e `profileMessages` de `@/lib/contracts/profile.ts`. Acrescente o tipo e as duas funções. A validação mora aqui. O handler do passo 6 só chama.

```ts
export type ProfileResult =
  | { ok: true; profile: Profile }
  | { ok: false; status: 400 | 401 | 409; message: string }
```

`readProfile()`:

- Sem `currentUser()`, devolve `{ ok: false, status: 401, message: 'Não autorizado.' }`.
- Com usuário, devolve um objeto novo: `displayName` é `user.name`, `email` é `user.email`, o resto vem de `user.profile`. Não inclua `password` nem `wallet`.

`saveProfile(input)` recebe os oito campos como `unknown`, nesta ordem de decisão. Qualquer retorno de falha acontece antes de escrever em `user`:

1. Sem usuário: 401 e `'Não autorizado.'`.
2. `filled` faz `trim` em string e devolve `''` para o resto. Aplique nos cinco textos do perfil e nas três senhas.
3. Se um dos cinco textos ficar `''`, devolva 400 com `profileMessages.required`.
4. Se outro usuário tiver o mesmo e-mail por `sameEmail`, devolva 409 com `profileMessages.emailTaken`. O e-mail da própria conta, com outra caixa, passa.
5. `passwordTouched` é verdadeiro quando alguma das três senhas, depois do `trim`, não é `''`.
6. Se `passwordTouched` e a senha atual com `trim` for diferente de `user.password`, devolva 400 com `profileMessages.currentPassword`. Senha atual vazia cai aqui.
7. Se `passwordTouched` e a nova, com `trim`, for `''` ou for diferente da confirmação com `trim`, devolva 400 com `profileMessages.passwordMismatch`.
8. Escreva `user.name`, `user.email` e `user.profile`. Se `passwordTouched`, escreva `user.password` com a nova já com `trim`. Não mexa em `user.wallet`, favorito, carrinho, pedido nem `sessionUserId`.
9. Devolva `{ ok: true, profile }` com as cinco chaves do perfil. Sem senha.

Pronto quando: `pnpm typecheck` passa. Os testes atuais da loja continuam passando.

### Passo 5. Leitura e gravação da carteira na loja

Arquivo: `src/mocks/store.ts` somente.

Importe `PrimaryWallet` e `walletMessages` de `@/lib/contracts/wallet.ts`.

```ts
export type WalletResult =
  | { ok: true; wallet: PrimaryWallet }
  | { ok: false; status: 400 | 401; message: string }
```

`readWallet()` segue o 401 de `readProfile` e devolve `{ ...user.wallet }` num objeto novo.

`saveWallet(input)` recebe as dez chaves de `PrimaryWallet` como `unknown`:

1. Sem usuário: 401 e `'Não autorizado.'`.
2. `filled` nos dez campos.
3. Obrigatórios: `displayName`, `nickname`, `profileName`, `address`, `referralCode`, `email`, `ensName`. Se um ficar `''`, devolva 400 com `walletMessages.required` e não escreva.
4. Grave `user.wallet` com esses sete textos, `secondaryAddress` com o texto já com `trim` (pode ser `''`) e `network: ''`, `walletType: ''`. Ignore o que tiver vindo nesses dois.
5. Não consulte unicidade de e-mail. Não olhe prefixo `0x`. Não crie outra carteira. Não altere `user.name`, `user.email`, `user.password` nem `user.profile`.

Pronto quando: `pnpm typecheck` passa.

### Passo 6. Quatro rotas HTTP

Arquivo: `src/mocks/handlers.ts` somente.

Importe `readProfile`, `saveProfile`, `readWallet` e `saveWallet`. Coloque os quatro handlers depois de `POST /api/cadastro`. Reuse `readBody`.

- `GET /api/perfil` chama `readProfile()`.
- `PUT /api/perfil` chama `saveProfile` com as oito chaves do corpo.
- `GET /api/carteiras` chama `readWallet()`.
- `PUT /api/carteiras/principal` chama `saveWallet` com as dez chaves do corpo.

Resposta de falha: `HttpResponse.json({ message }, { status })`. Resposta de sucesso: o objeto `profile` ou `wallet`, status 200. `POST /api/dev/reset` continua chamando `resetStore()` e não ganha lógica nova.

A validação não é reescrita no handler.

Pronto quando: `pnpm typecheck` passa.

### Passo 7. Prova HTTP do perfil

Arquivo: `src/mocks/handlers.test.ts` somente.

Acrescente `putJson` ao lado de `postJson`, com `method: 'PUT'`. Use o `enter` que já existe. Cada `it` abaixo é independente. O `beforeEach` já chama `resetStore()`.

O corpo cheio do perfil, daqui em diante `perfilCheio`, é:

```json
{
  "displayName": "Ada Costa",
  "username": "ada",
  "email": "ada.costa@kurio.test",
  "ensName": "ada",
  "walletNickname": "principal",
  "currentPassword": "",
  "nextPassword": "",
  "confirmPassword": ""
}
```

1. `recusa perfil e carteira sem sessão`: `GET /api/perfil`, `PUT /api/perfil`, `GET /api/carteiras` e `PUT /api/carteiras/principal` respondem 401. O corpo tem `message: 'Não autorizado.'`. O `PUT` pode ir com `{}`.
2. `Ada e Bruno leem o próprio perfil`: depois de `enter('bruno@kurio.test')`, o JSON é `displayName: 'Bruno'`, `email: 'bruno@kurio.test'` e os outros três textos `''`. `readUsers()` da Ada continua com `name: 'Ada'`, `email: 'ada@kurio.test'`, `password: 'kurio'`.
3. `conta nova nasce com nome e e-mail no perfil`: `POST /api/cadastro` com `name: 'Lia'`, `email: 'lia@kurio.test'`, `password: 'kurio'`, `confirmPassword: 'kurio'`. O `GET /api/perfil` devolve `displayName: 'Lia'`, `email: 'lia@kurio.test'` e o resto `''`. O `GET /api/carteiras` devolve o objeto de `blankWallet()`.
4. `perfil vazio não grava`: entre como Ada. `PUT` com `perfilCheio` e `displayName: '   '`. Status 400, `message` igual a `profileMessages.required`. `readUsers()` da Ada continua `name: 'Ada'` e `email: 'ada@kurio.test'`.
5. `e-mail de outra conta não grava`: entre como Ada. `PUT` com `perfilCheio`, `email: 'Bruno@kurio.test'` e `currentPassword: 'errada'`. Status 409 e a frase `Este e-mail já tem conta.` A Ada continua `ada@kurio.test` e senha `kurio`. A frase da senha não vem nessa resposta.
6. `a própria conta aceita outra caixa`: entre como Ada. `PUT` com `displayName: 'Ada'`, `username: 'ada'`, `email: 'Ada@kurio.test'`, `ensName: 'ada'`, `walletNickname: 'principal'` e as três senhas `''`. Status 200. `user.email` fica `Ada@kurio.test`. `user.name` fica `Ada`. `GET /api/sessao` devolve `{ id: 'usr-ada', name: 'Ada', email: 'Ada@kurio.test' }` sem chave `password`.
7. `salvar o perfil troca nome e e-mail da sessão`: entre como Ada. `PUT` com `perfilCheio`. Status 200. As chaves do JSON, ordenadas, são `displayName`, `email`, `ensName`, `username`, `walletNickname`. `GET /api/sessao` devolve `{ id: 'usr-ada', name: 'Ada Costa', email: 'ada.costa@kurio.test' }`. Senha continua `kurio`. Bruno continua `Bruno` / `bruno@kurio.test`. `user.wallet.displayName` continua `''`.
8. `senha parcial ou errada não grava o nome`: entre como Ada. Quatro `PUT`, todos partindo de `perfilCheio`. (a) só `nextPassword: 'kurio-nova'`. (b) `currentPassword: 'errada'`. (c) `currentPassword: 'kurio'`, `nextPassword: 'kurio-nova'`, `confirmPassword: ''`. (d) `currentPassword: 'kurio'`, `nextPassword: 'kurio-nova'`, `confirmPassword: 'outra'`. (a) e (b) respondem 400 com `A senha atual não confere.` (c) e (d) respondem 400 com `As senhas não conferem.` Depois de cada uma, `name` continua `Ada`, `email` continua `ada@kurio.test` e `password` continua `kurio`.
9. `senha nova entra e a sessão continua`: entre como Ada. `PUT` com `displayName: 'Ada'`, `username: 'ada'`, `email: 'ada@kurio.test'`, `ensName: 'ada'`, `walletNickname: 'principal'`, `currentPassword: 'kurio'`, `nextPassword: 'kurio-nova'`, `confirmPassword: 'kurio-nova'`. Status 200. `user.password` é `kurio-nova`. `user.name` continua `Ada`. `GET /api/sessao` devolve a Ada, sem chave `password`. `DELETE /api/sessao`. `POST /api/sessao` com `ada@kurio.test` e `kurio` responde 401. O mesmo `POST` com `kurio-nova` responde 200.

Pronto quando: `pnpm test -- src/mocks/handlers.test.ts` passa.

### Passo 8. Prova HTTP da carteira, do recibo e do recomeço

Arquivo: `src/mocks/handlers.test.ts` somente.

O corpo cheio da carteira, daqui em diante `carteiraAda`, é:

```json
{
  "displayName": "Ada carteira",
  "nickname": "apelido",
  "network": "",
  "profileName": "perfil",
  "address": "carteira-ada",
  "secondaryAddress": "",
  "walletType": "",
  "referralCode": "codigo",
  "email": "bruno@kurio.test",
  "ensName": "ada"
}
```

1. `carteira da semente vem vazia`: entre como Ada. `GET /api/carteiras` é o objeto de `blankWallet()`. As chaves ordenadas são `address`, `displayName`, `email`, `ensName`, `network`, `nickname`, `profileName`, `referralCode`, `secondaryAddress`, `walletType`.
2. `carteira sem texto obrigatório não grava`: entre como Ada. `PUT /api/carteiras/principal` com `carteiraAda` e `address: '   '`. Status 400 e `Informe os campos obrigatórios da carteira.` `user.wallet.address` continua `''`. `user.name` continua `Ada`. `user.email` continua `ada@kurio.test`.
3. `endereço livre grava e rede vazia não bloqueia`: entre como Ada. `PUT` com `carteiraAda`, `address: 'nao-e-hex'`, `network: 'ethereum'` e `walletType: 'metamask'`. Status 200. O JSON volta `address: 'nao-e-hex'`, `network: ''`, `walletType: ''`, `email: 'bruno@kurio.test'`. `user.profile.username` continua `''`. `user.email` continua `ada@kurio.test`.
4. `campo sem rótulo não cria outra carteira`: entre como Ada. `PUT` com `carteiraAda` e `secondaryAddress: 'extra.eth'`. O JSON volta `secondaryAddress: 'extra.eth'`. `Object.keys` continua com as dez chaves, sem chave nova.
5. `perfil e carteira não se copiam`: entre como Ada. `PUT /api/perfil` com `perfilCheio`. `GET /api/carteiras` continua igual a `blankWallet()`. `PUT /api/carteiras/principal` com `carteiraAda`. `GET /api/perfil` continua com `displayName: 'Ada Costa'`, `email: 'ada.costa@kurio.test'`, `username: 'ada'`.
6. `carteira salva não muda o recibo`: entre como Ada. `PUT` com `carteiraAda`. `GET /api/pedidos/ped-ada-1` continua com `wallet: 'MetaMask'`.
7. `recomeço devolve perfil, carteira e senha`: entre como Ada. `PUT /api/perfil` com o corpo do passo 7 item 9 (senha `kurio-nova`). `PUT` da carteira com `carteiraAda`. `DELETE /api/sessao`. `POST /api/cadastro` da Lia, como no passo 7 item 3. `POST /api/dev/reset`. `readUsers()` volta a ser `happyUsers`. A senha da Ada e a do Bruno são `kurio`. Sem sessão, `GET /api/perfil` responde 401.

Pronto quando: `pnpm test -- src/mocks/handlers.test.ts` passa.

### Passo 9. Cliente HTTP do perfil

Arquivo: `src/lib/api/profile.ts`

Copie o desenho de `src/lib/api/order.ts`: classe `ProfileActionError`, conjunto com os valores de `profileMessages`, e `toProfileError`. Mensagem do corpo só passa se estiver nesse conjunto. Qualquer outra vira o fallback.

- `fetchProfile(signal?: AbortSignal)` faz `GET /api/perfil`. Fallback: `profileMessages.loadFailed`.
- `saveProfile(body: ProfileUpdate)` faz `PUT /api/perfil` com o corpo inteiro. Fallback: `profileMessages.saveFailed`.

401 com `'Não autorizado.'` cai no fallback, porque essa frase não está em `profileMessages`. Não converta 401 em `null`. Quem faz isso é só `fetchSession`.

Pronto quando: `pnpm typecheck` passa.

### Passo 10. Cliente HTTP da carteira

Arquivo: `src/lib/api/wallet.ts`

O mesmo desenho, com `WalletActionError` e `walletMessages`.

- `fetchWallet(signal?)` faz `GET /api/carteiras`. Fallback: `walletMessages.loadFailed`.
- `saveWallet(body: PrimaryWallet)` faz `PUT /api/carteiras/principal`. Fallback: `walletMessages.saveFailed`.

Pronto quando: `pnpm typecheck` passa.

### Passo 11. Cache do perfil

Arquivo: `src/lib/query/profile.ts`

```ts
export function profileQueryKey(userId: string) {
  return ['usuario', userId, 'perfil'] as const
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(userId ?? 'sem-sessao'),
    queryFn: ({ signal }) => fetchProfile(signal),
    enabled: Boolean(userId),
    retry: false,
  })
}
```

A chave com o id real é a da regra 18. `sem-sessao` só existe com a query desligada e não dispara GET. Não edite `clearSessionCache`: sair já apaga chave que contém o id.

Pronto quando: `pnpm typecheck` passa.

### Passo 12. Cache da carteira

Arquivo: `src/lib/query/wallet.ts`

Igual ao passo 11, com `walletQueryKey` devolvendo `['usuario', userId, 'carteiras']`, `fetchWallet` e o fallback `'sem-sessao'` na mesma condição.

Pronto quando: `pnpm typecheck` passa.

### Passo 13. Ícones no próprio componente

Arquivo: `src/features/profile/account-icons.tsx`

Exporte `PersonIcon`, `PinIcon`, `SidebarCartIcon`, `HeartIcon`, `ChartIcon`, `DownloadIcon`, `AlertIcon`, `ExitIcon`, `ChevronIcon`, `ImageIcon`, `EyeIcon`, `EyeOffIcon`.

Cada um é um `<svg viewBox="0 0 24 24" aria-hidden="true" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">`. A cor vem de quem usa. `EyeOffIcon` é o olho com um traço por cima, no mesmo desenho de `EyeOffIcon` em `auth-icons.tsx`, copiado para cá. `EyeIcon` é o olho sem o traço.

Não instale pacote de ícone e não importe ícone de `src/components/layout` nem de `src/features/session`.

Pronto quando: o arquivo exporta os doze e `pnpm typecheck` passa.

### Passo 14. Sidebar

Arquivo: `src/features/profile/account-sidebar.tsx`

Exporte `AccountFrame` e `AccountSidebar`.

```tsx
export function AccountFrame({
  active,
  children,
}: {
  active: 'perfil' | 'carteiras'
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-[27px]">
      <AccountSidebar active={active} />
      <div className="min-w-0 w-full desktop:flex-1">{children}</div>
    </div>
  )
}
```

`AccountSidebar`:

- Título `Meu perfil`, classe `px-2 pt-2 font-bold text-foreground`, sem tamanho.
- Itens, nesta ordem, com o ícone em `text-text-secondary` e o rótulo em `font-normal text-text-accent`: `Dados do perfil` (`PersonIcon`, `Link` para `/perfil`), `Carteiras` (`PinIcon`, `Link` para `/carteiras`), `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados`, `Suporte`.
- Os cinco últimos são `button type="button"`. O `onClick` não chama `navigate`, não escreve estado e não mostra texto de sucesso.
- A barra `bg-primary` só no item cujo `active` é a rota. `perfil` marca `Dados do perfil`. `carteiras` marca `Carteiras`.
- Linha `h-px w-full bg-border`.
- `Sair` é `button type="button"`, texto `font-bold text-text-accent`, ícone `ExitIcon`. O clique chama `useEndSession()` de `@/features/session/use-end-session.ts`. Não navegue por conta própria: o hook já sai.
- `Link` e `button` da lista usam `no-underline` quando forem link, fundo transparente e `p-0` no que não for a linha inteira. A linha tem `h-[45px]`.

Pronto quando: `pnpm typecheck` passa. Nenhuma rota importa este arquivo ainda.

### Passo 15. Olho da senha

Arquivo: `src/features/profile/password-fields.tsx`

Exporte `PasswordFields` com três valores e três setters: `currentPassword`, `nextPassword`, `confirmPassword`.

Cada campo:

- Rótulo visível `Senha atual`, `Nova senha` ou `Confirmar nova senha`, sem asterisco.
- `Input` com `aria-label` igual ao rótulo, `type` `password` no início, `value` controlado, sem `placeholder`.
- Um `div` com `relative` em volta do input. O botão do olho é irmão do input, `type="button"`, `aria-label` `Mostrar senha` ou `Ocultar senha`, classe `absolute top-1/2 right-3 -translate-y-1/2 bg-transparent p-0 text-text-secondary`.
- Estado `visible` é local daquele campo. O clique troca só o `type` daquele input. Visível mostra `EyeIcon`. Oculta mostra `EyeOffIcon`.
- Os três campos ficam numa coluna `flex flex-col gap-4`.

Pronto quando: `pnpm typecheck` passa.

### Passo 16. Campos do perfil, sufixo e avatar

Arquivo: `src/features/profile/profile-fields.tsx`

Exporte três peças:

1. `ProfileTextField`: rótulo, `aria-label` igual ao rótulo, asterisco colado, `Input` sem `placeholder`.
2. `EnsField`: rótulo `Nome ENS` com espaço antes do asterisco. Na mesma linha, um `button type="button"` com texto `.eth`, `ChevronIcon` e `aria-label="Sufixo ENS"`, classes de campo (`h-[39px] w-[77px]`, borda `border-border`, raio `rounded-[var(--radius-field)]`, fundo `bg-ink`, texto `text-foreground`). O clique não abre lista e não muda o texto. Ao lado, `Input` com `aria-label="Nome ENS"`, sem placeholder. A linha é `flex flex-nowrap`.
3. `AvatarRow`: rótulo `Avatar` sem asterisco. Círculo com `ImageIcon` em `text-text-accent`. `Button` `Alterar`. `button` nativo `Remover`, sem borda e sem fundo, `text-foreground`. Os dois cliques não chamam nada: sem `input` de arquivo, sem diálogo, sem `navigate`. A faixa é `flex flex-wrap items-center`. `Alterar` tem `ml-6`. `Remover` tem `ml-[21px]`.

Pronto quando: `pnpm typecheck` passa.

### Passo 17. Formulário que grava o perfil

Arquivo: `src/features/profile/profile-form.tsx`

Exporte `ProfileForm({ userId, initial }: { userId: string; initial: Profile })`.

Estado inicial: os cinco textos saem de `initial`. As três senhas começam `''`. `message` começa `null`. `pending` começa `false`.

Não use `useEffect` para copiar `initial` de novo. Não use atualização otimista.

Acima da grade, um `h1` com o texto `Perfil do colecionador`, classe `m-0 font-bold text-foreground`, sem classe de tamanho.

A ordem dos filhos da grade, que também é a ordem abaixo de 1440:

1. Nome de exibição
2. Nome de usuário
3. E-mail
4. `EnsField`
5. Apelido da carteira
6. `AvatarRow`
7. Um único bloco `desktop:col-start-1` com o subtítulo `Alterar senha` (`mt-[18px] font-bold text-foreground`), `PasswordFields`, a frase `message` se existir, e o `Button` `Salvar` `type="submit"` com `mt-8`.

O `onSubmit` faz `preventDefault`. Se `pending` já for verdadeiro, retorne. Então:

1. `setPending(true)` e `setMessage(null)`.
2. `await saveProfile` com os cinco textos e as três senhas do estado.
3. `queryClient.setQueryData(profileQueryKey(userId), saved)`.
4. Atualize a sessão com `setQueryData` em `sessionQueryKey`. O valor novo é exatamente `{ id: current.id, name: saved.displayName, email: saved.email }`. Se `current` for nulo, deixe como está. Não espalhe senha nesse objeto.
5. Zere os três estados de senha. Os outros campos continuam com o texto que a pessoa digitou.
6. No `catch`, `setMessage` com `error.message` quando `error` for `Error`. Senão, `profileMessages.saveFailed`.
7. No `finally`, `setPending(false)`.

Não chame `invalidateQueries`. Não desabilite o botão com estilo novo: o segundo clique só encontra `pending` e volta.

Pronto quando: `pnpm typecheck` passa.

### Passo 18. Página do perfil

Arquivo: `src/features/profile/profile-page.tsx`

Exporte `ProfilePage`. Ela lê `useSessionQuery` e `useProfileQuery(session.data?.id)` e renderiza `AccountFrame` com `active="perfil"`.

A coluna, nesta ordem de `if`:

1. `profile.isError`: a frase `profileMessages.loadFailed`.
2. Sem `session.data?.id`, ou `profile.isPending`, ou sem `profile.data`: a frase `profileMessages.loading`.
3. `ProfileForm` com esse `userId` e `initial={profile.data}`.

O título `Perfil do colecionador` fica dentro do formulário, acima da grade, `font-bold text-foreground`, sem tamanho. A coluna de erro e a de carregando não mostram os campos. A sidebar continua no `AccountFrame` nos três casos.

`isError` vem antes do teste de `data`. Se a ordem inverter, a falha aparece como `Carregando`.

Pronto quando: `pnpm typecheck` passa.

### Passo 19. Rota `/perfil`, página antiga e teste da sessão

Arquivos: `src/routes/perfil.tsx`, `src/features/session/profile-page.tsx`, `src/features/session/auth-entry.test.tsx`.

Em `perfil.tsx`, troque o componente por `ProfilePage` de `@/features/profile/profile-page.tsx`. O `beforeLoad` com `requireSession` fica. Não edite `routeTree.gen.ts`.

Apague `src/features/session/profile-page.tsx`. Nada mais importa esse arquivo.

Em `auth-entry.test.tsx`, mude só as leituras de `/perfil`. O e-mail agora é o `value` do input, e `textContent` não carrega `value`.

- No teste da tela privada, o `waitFor` que espera `ada@kurio.test` no `textContent` passa a esperar o input `main [aria-label="E-mail"]` com `value` `ada@kurio.test`.
- Apague `expect(blocked.container.querySelector('main input')).toBeNull()`. No lugar: esse input existe e o `value` é `ada@kurio.test`.
- O clique de `Sair` continua em `buttonNamed` do `main`. O botão da sidebar tem o texto `Sair`.
- No teste que navega de `/pedidos/ped-9` para `/perfil`, a espera de `textContent` com `ada@kurio.test` passa a esperar o mesmo `value` do campo `E-mail`.
- Deixe as outras asserções desse arquivo como estão. `textContent` sem o e-mail, antes do login, continua válido.

Pronto quando: `pnpm test -- src/features/session/auth-entry.test.tsx` passa.

### Passo 20. Campos da carteira

Arquivo: `src/features/wallet/wallet-fields.tsx`

Exporte:

1. `WalletTextField`, igual ao campo de texto do perfil, com a margem de rótulo da carteira (`mb-[11px]`). Sem placeholder, salvo quando o passo disser.
2. `WalletChoice`: recebe o rótulo e o texto do placeholder. Desenha o rótulo com `mb-[11px]` e, abaixo, um `button type="button"` na largura da coluna, `h-[39px]`, borda, raio e fundo do campo, texto `text-text-secondary`, `ChevronIcon` à direita. O texto visível do botão é o placeholder. `aria-label` do botão é `Rede` ou `Tipo de carteira`, sem o asterisco. O clique não abre lista e não guarda valor. Não use `<select>`.
3. `WalletEnsField`: o mesmo par do perfil, com o rótulo `Nome ENS` e o espaço antes do asterisco. O input tem `aria-label="Nome ENS"`.

`Endereço da carteira` usa `placeholder={walletPlaceholders.address}`. O campo sem rótulo não tem `<label>`. O `Input` tem `aria-label` e `placeholder` iguais a `walletPlaceholders.secondaryAddress`.

Pronto quando: `pnpm typecheck` passa.

### Passo 21. Formulário da carteira principal

Arquivo: `src/features/wallet/wallet-primary-form.tsx`

Exporte `WalletPrimaryForm({ userId, initial }: { userId: string; initial: PrimaryWallet })`.

Estado inicial: as dez chaves saem de `initial`. `network` e `walletType` ficam `''` mesmo que `initial` traga texto.

A grade, nesta ordem:

1. Nome de exibição, com asterisco
2. Apelido da carteira, com asterisco
3. `WalletChoice` de Rede, rótulo `Rede *` com espaço
4. Nome do perfil, com asterisco
5. Endereço da carteira, com asterisco e placeholder
6. Campo sem rótulo
7. `WalletChoice` de Tipo de carteira, rótulo `Tipo de carteira` com asterisco colado
8. Código de indicação, com asterisco
9. E-mail, com asterisco
10. `WalletEnsField`
11. Bloco `desktop:col-start-1` com a frase e o `Button` `Salvar carteira` `type="submit"` `mt-[34px]`

O submit repete o trinco do perfil: espera `saveWallet`, `setQueryData(walletQueryKey(userId), saved)`, não mexe na chave `sessionQueryKey` nem na chave do perfil, não chama `invalidateQueries`. O corpo manda `network: ''` e `walletType: ''`. `secondaryAddress` vai com o texto do estado.

O cabeçalho visual deste bloco fica na página, fora do `<form>`, para o `Adicionar` não ser submit. Este arquivo é o `<form>` e a grade.

Pronto quando: `pnpm typecheck` passa.

### Passo 22. Carteira secundária vazia

Arquivo: `src/features/wallet/wallet-secondary.tsx`

Exporte `WalletSecondary`. Sem estado de marcado. Sem campo. Sem lista.

```tsx
<section className="mt-[41px]">
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
    <h2 className="mr-auto font-bold text-foreground">Carteira secundária</h2>
    <button type="button" aria-label="Igual à carteira principal" className="inline-flex items-center gap-1.5 bg-transparent p-0 font-normal text-foreground">
      <span className="size-2.5 rounded-full border border-primary bg-transparent" />
      Igual à carteira principal
    </button>
    <button type="button" className="bg-transparent p-0 font-normal text-text-accent">Adicionar</button>
  </div>
  <p className="m-0 mt-[27px] font-normal text-text-secondary">{walletMessages.emptySecondary}</p>
</section>
```

Os dois botões não têm `onClick` que navegue, copie a carteira principal ou escreva sucesso. O círculo continua vazio.

Pronto quando: `pnpm typecheck` passa.

### Passo 23. Página e rota `/carteiras`

Arquivos: `src/features/wallet/wallet-page.tsx`, `src/routes/carteiras.tsx`.

`WalletPage` usa `AccountFrame` com `active="carteiras"`. A coluna segue a mesma ordem de `if` do perfil, com `walletMessages.loading` e `walletMessages.loadFailed`.

Com dado, a coluna é:

1. Faixa `flex flex-wrap items-center gap-2`. Título `Carteira principal` com `mr-auto`. `button type="button"` `Adicionar`, `font-normal text-text-accent`, sem `onClick` de navegação.
2. Parágrafo `mt-[25px] font-normal text-text-secondary` com `walletMessages.paymentCopy`.
3. `WalletPrimaryForm`.
4. `WalletSecondary`.

Em `carteiras.tsx`, troque `EmptyRoute` por `WalletPage`. O `beforeLoad` fica. Apague o import de `EmptyRoute` desse arquivo. Não apague o componente `EmptyRoute`.

Pronto quando: `pnpm typecheck` passa e `pnpm test -- src/features/session/auth-entry.test.tsx` continua passando.

### Passo 24. Prova da tela

Arquivo: `src/features/profile/profile-wallet.test.tsx`

Copie para este arquivo o `mount`, o `field`, o `buttonNamed`, o `fill` e o `signIn` de `auth-entry.test.tsx`. Não exporte esses helpers de lá e não importe o teste. O servidor MSW sobe com `handlers`, e o `afterEach` chama `resetStore()`.

Casos, um `it` cada:

1. `Ada vê o próprio e-mail no campo`. Largura 1440. Entre como Ada em `/perfil`. O `value` de `main [aria-label="E-mail"]` é `ada@kurio.test`. O `value` de `Nome de exibição` é `Ada`. `Nome de usuário` é `''`. O `textContent` do `main` contém `Meu perfil`, `Perfil do colecionador`, `Alterar`, `Remover` e `Salvar`, e não contém `ada@kurio.test`. Os três inputs de senha estão `type="password"` e com `value` `''`.
2. `o olho troca só a nova senha`. No `parentElement` do input `Nova senha`, acione `[aria-label="Mostrar senha"]`. Esse input fica `type="text"`. `Senha atual` e `Confirmar nova senha` continuam `type="password"`.
3. `atalhos do perfil ficam na página`. Clique em `Alterar`, `Remover` e no botão `Atividade`. `pathname` continua `/perfil`.
4. `abaixo de 1440 a sidebar vem antes do formulário`. Monte `/perfil` em 390. No `textContent` do `main`, o índice de `Meu perfil` é menor que o de `Perfil do colecionador`, e este é menor que o de `Nome de exibição`. O primeiro filho do `main` tem classe `flex-col` e `desktop:flex-row`.
5. `falha de leitura deixa a sidebar`. Antes do mount, `server.use` devolve 500 em `GET /api/perfil`. Entre como Ada. O `main` mostra `Não foi possível carregar o perfil.` e um botão `Sair`. Não mostra o input `Nome de exibição`.
6. `salvar não leva o nome da Ada ao Bruno`. Em `/perfil`, preencha os cinco textos (`Ada Costa`, `ada`, `ada.costa@kurio.test`, `ada`, `principal`), deixe as senhas vazias e acione `Salvar`. Espere o `value` de `Nome de exibição` continuar `Ada Costa`. Saia pelo `Sair` do `main`. Entre como Bruno, abra `/perfil`. `Nome de exibição` é `Bruno` e `E-mail` é `bruno@kurio.test`.
7. `carteira da semente e cliques vazios`. Em 1440, Ada abre `/carteiras`. O `main` contém `Carteira principal`, a frase de pagamento, `Salvar carteira`, `Carteira secundária` e `Você ainda não adicionou uma carteira secundária.` O botão `Rede` mostra `Selecione uma rede`. O botão `Tipo de carteira` mostra `Selecione uma carteira`. O input sem rótulo tem o placeholder `ENS ou carteira secundária (opcional)`. Clique no primeiro `Adicionar` e em `Igual à carteira principal`. `pathname` continua `/carteiras`. O círculo não ganha fundo `bg-primary`.
8. `falha da carteira deixa a sidebar`. `GET /api/carteiras` responde 500. A frase é `Não foi possível carregar as carteiras.` O `Sair` do `main` continua.

Pronto quando: `pnpm test -- src/features/profile/profile-wallet.test.tsx` passa.

### Passo 25. Comandos e docs vivos

Rode, nesta ordem:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Com os três verdes, feche a fatia pela skill `.cursor/skills/close-phase/SKILL.md`: plano, spec, implementation, manual-dev e pendências. Não rode Playwright. Não declare Done de feature no commit. Não faça commit neste passo, a menos que a pessoa peça.

A prova no navegador, em 1440 e em 390, continua a da seção 7: Ada vê o próprio e-mail, salvar o perfil não muda o Bruno, a senha nova entra de novo, a carteira salva não muda o recibo `MetaMask`, e `Alterar`, `Remover`, `Atividade`, `Adicionar` e o marcador não trocam o endereço.

### Ordem

1. Contrato do perfil
2. Contrato da carteira
3. Semente, cadastro e `happyUsers`
4. Loja do perfil
5. Loja da carteira
6. Quatro rotas HTTP
7. Prova HTTP do perfil
8. Prova HTTP da carteira
9. Cliente HTTP do perfil
10. Cliente HTTP da carteira
11. Cache do perfil
12. Cache da carteira
13. Ícones
14. Sidebar
15. Olho da senha
16. Campos do perfil
17. Formulário do perfil
18. Página do perfil
19. Rota `/perfil` e teste da sessão
20. Campos da carteira
21. Formulário da carteira
22. Carteira secundária
23. Página e rota `/carteiras`
24. Prova da tela
25. Comandos e docs vivos
