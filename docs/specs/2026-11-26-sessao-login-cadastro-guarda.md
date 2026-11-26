# Spec: Sessão, login, cadastro e guarda

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a pessoa entra ou cria a conta na composição do frame. No desktop, o painel fica sobre a página atual. Abaixo de 1440, são as duas telas cheias. A sessão mora na loja viva. Sem sessão, perfil, carteiras, pagamento e a confirmação do pedido abrem essa entrada e, depois, voltam ao caminho pedido. Sair apaga a sessão e o que é privado da pessoa.
- Plano: `docs/plans/reviews/2026-11-26-sessao-login-cadastro-guarda-plano.md`
- Decisão do plano: a seção Decisão está sem item em Entrou e sem item em Saiu. Esta spec repete o corpo do plano aprovado. Onde esse corpo diverge do contrato de UI em cópia ou cor, a seção Tela manda. A divergência está na seção 9.

## 1. Objetivo

Quem já tem conta entra. Quem não tem cria a conta e já fica na sessão. A entrada segue o frame: painel sobre a página a partir de 1440, tela cheia abaixo disso. Perfil, carteiras, pagamento e a confirmação do pedido só abrem com sessão e, sem ela, devolvem a pessoa ao caminho que ela pedia. Sair encerra a sessão.

## 2. Tela

Contrato de UI do Claude Sonnet 5.5 (`claude-sonnet-5-5-high`), colado na íntegra. O modelo que escreve a spec não reescreve arranjo, cópia nem composição.

PNG:

- `research/figma/desktop-login.png`
- `research/figma/desktop-cadastro.png`
- `research/figma/mobile-login.png`
- `research/figma/mobile-cadastro.png`

# Contrato de UI: Entrar e Criar conta (Kurio)

Li os quatro PNG. Os dois desktop têm 744 px de largura. A escala para 1440 é 0,517, e eu a confirmei: o padding de 62 px no PNG vira 120 px. As medidas em px do desktop vêm do PNG. As marcadas com "(≈1440)" são o valor convertido por essa escala e são aproximadas. As medidas do mobile estão em 414, sem conversão.

---

## 1. Desktop, tela Entrar (`desktop-login.png`)

### 1.1 Composição geral
- **O que é a tela:** um **modal sobre a página Início já desenhada**. Não é uma página própria.
- **O que está atrás do modal:** cabeçalho, hero, sidebar de filtros e grade de cards. Tudo isso pertence à tela Início, fora deste contrato.
- **Camada:** o modal fica por cima do hero. Cobre a metade direita do heading e do parágrafo, a borda esquerda da imagem do hero e a primeira linha de cards.
- **Sem película escura:** o fundo atrás do modal aparece sem escurecer. Não construir película.
- **Posição:**
  - Centralizado na horizontal. Eixo do modal em x=372 de 744, ou seja 720 no 1440.
  - Topo em y=83 (≈1440: 161). Fica abaixo da linha do cabeçalho (y=36), com folga de cerca de 47 px (≈91 no 1440).
  - Largura 258 px (≈1440: 500).
  - Altura 83 a 394, ou seja 311 px (≈1440: 602).
- **Fundo do modal:** `color/surface-card`.
- **Raio:** 5. Os cantos mal se leem no PNG.
- **Faixa de base:**
  - Faixa horizontal em `color/primary` rente à borda inferior do modal.
  - Ocupa a largura total do modal.
  - Altura de cerca de 5 px (≈1440: 10).
  - Aparece também no cadastro.

### 1.2 Conteúdo do modal, de cima para baixo (y em px do PNG)
Todo o conteúdo fica **centralizado em uma coluna** de 176 px de largura (x 284 a 460), com margem lateral de 41 px (≈1440: 80). A coluna tem **largura fixa dentro do modal**. Os campos e botões ocupam 100% dessa coluna.

1. **Botão fechar (X)**
   - Canto superior direito do modal (x≈490, y≈93).
   - Ícone pequeno em `color/primary`.
   - Sem moldura nem fundo.
2. **Alternador de abas** (y≈113), centralizado
   - Dois rótulos lado a lado: `Entrar` e `Criar conta`.
   - Entre eles, uma **linha vertical fina**.
   - **Aba ativa = `Entrar`**, em `color/text-accent`.
   - **Aba inativa = `Criar conta`**, em `color/foreground`.
   - Peso 500, por leitura.
   - Sem tamanho numérico no desenho. É o maior texto do modal, maior que o parágrafo e que os campos.
   - Não há sublinhado sob nenhuma aba.
3. **Parágrafo de apoio** (duas linhas, y≈142 e 151)
   - Centralizado, em corpo pequeno.
   - Cor mais clara, lida como `color/foreground`.
   - Cópia literal, quebrando depois de "perfil de":
     `Entre para gerenciar sua carteira, coleção e perfil de criador.`
4. **Campo e-mail** (y 167 a 189)
   - Largura total da coluna, altura de cerca de 22 px (≈1440: 43).
   - Raio 5.
   - Borda `color/border`.
   - Fundo `color/ink`.
   - Texto interno alinhado à esquerda, com padding interno pequeno.
   - Placeholder literal: `contato@email.com`. Cor `color/secondary`, peso 400.
5. **Campo senha** (y 194 a 215), logo abaixo do e-mail, com folga de cerca de 5 px
   - Mesmas medidas e raio do campo e-mail.
   - **Borda em `color/primary`.** É o único campo desenhado em foco.
   - Valor preenchido: 11 asteriscos (`***********`), em `color/foreground`.
   - **Ícone de olho cortado por uma barra** no canto direito, dentro do campo.
   - A cor do ícone é clara no desktop. Ver Lacunas.
6. **Link `Esqueceu a senha?`** (y≈226)
   - Alinhado à **direita**, à altura do fim do campo senha.
   - Cor `color/text-accent`, peso 400.
   - Sem sublinhado.
7. **Botão principal** (y 242 a 265)
   - Largura total da coluna, altura de cerca de 23 px (≈1440: 45).
   - Preenchido com `color/primary`.
   - Raio 5, por ser botão de modal.
   - Texto centralizado `Entrar` em `color/ink`, peso 500 por leitura.
   - Folga de cerca de 16 px acima, vinda do link.
8. **Divisor** (y≈281)
   - **Linha horizontal de ponta a ponta do modal**, não só da coluna, em `color/border`.
   - Logo abaixo da linha, centralizado, o rótulo `Ou continue com`.
   - Rótulo em `color/foreground`, corpo pequeno.
   - Aqui o rótulo fica **abaixo** da linha, não dentro dela.
9. **Botão Google** (y 292 a 313)
   - Largura total da coluna, raio 5.
   - Borda `color/border`, fundo transparente sobre o card.
   - Conteúdo centralizado: logo G multicolor à esquerda do texto.
   - Texto literal: `Continuar com Google`. Cor `color/text-secondary`, peso 400.
10. **Botão Facebook** (y 319 a 340)
    - Igual ao Google, com folga de cerca de 6 px entre os dois.
    - Logo "f" azul à esquerda do texto.
    - Texto literal: `Continuar com Facebook`.
11. **Respiro inferior**
    - Cerca de 48 px (≈1440: 93) entre o botão Facebook e a faixa de base.
    - Esse espaço é vazio.

### 1.3 Controles e o que mostram
- **Olho:** o desenho mostra só o estado mascarado, com olho riscado. O estado revelado não está desenhado.
- **Aba `Criar conta`:** a tela do cadastro (item 2 abaixo) mostra o que ela abre. A aba ativa troca a cor para `color/text-accent`.
- **Campo senha com borda `color/primary`:** é o único estado de foco ou ativo desenhado.

---

## 2. Desktop, tela Criar conta (`desktop-cadastro.png`)

Mesma moldura da tela Entrar: mesmo fundo, mesma posição, mesma faixa de base. A diferença está dentro do modal. Topo em y=82 e base em y=421, ou seja 339 px (≈1440: 656). É mais alto que o de Entrar.

1. **X de fechar:** igual.
2. **Alternador de abas** (y≈112)
   - **Aba ativa = `Criar conta`**, em `color/text-accent`.
   - **Aba inativa = `Entrar`**, em `color/foreground`.
   - Linha vertical entre as duas.
3. **Parágrafo de apoio** (y 141 e 150), centralizado, em `color/foreground`. Cópia literal, quebrando depois de "conecte uma":
   `Crie seu perfil de colecionador e conecte uma carteira quando quiser.`
4. **Quatro campos empilhados**
   - Mesma largura, raio 5, borda `color/border`, fundo `color/ink`.
   - Altura de cerca de 21 px cada (≈1440: 40).
   - Folga entre eles de cerca de 6 px.
   - Posições em y: 166 a 187, 193 a 214, 220 a 241, 247 a 268.
   - **Nenhum campo está em foco.** Todas as bordas são `color/border`.
   - Os placeholders ficam alinhados à esquerda, em `color/secondary`, peso 400:
     - `Nome de usuário`
     - `Digite seu e-mail`
     - `Senha`, com ícone de olho riscado à direita
     - `Confirmar senha`, **sem ícone de olho** no desktop
5. **Botão principal** (y 281 a 303)
   - Preenchido com `color/primary`, raio 5.
   - Texto `Criar conta` em `color/ink`, centralizado.
   - A largura total e a folga acima seguem a mesma regra do botão de Entrar.
6. **Divisor** (y≈319)
   - Linha horizontal de ponta a ponta do modal em `color/border`.
   - Rótulo `Ou continue com` abaixo da linha, centralizado, em `color/foreground`.
7. **Google** (y 332 a 353) e **Facebook** (y 360 a 381)
   - Mesmo desenho e mesma cópia da tela Entrar.
   - Folga entre os dois de cerca de 7 px.
8. **Respiro inferior:** cerca de 34 px até a faixa de base `color/primary`.

---

## 3. Mobile, tela Entrar (`mobile-login.png`)

### 3.1 Composição geral
- **O que é a tela:** uma **tela cheia**, sem cabeçalho, sem menu e sem fundo da Início. Não é modal.
- **Fundo:** `color/ink`.
- **Moldura do desenho:**
  - O PNG tem 414 × 896 com cantos de raio 40.
  - O raio 40 pertence ao frame do telefone, não à tela.
  - Os 896 px de altura são a altura do frame do desenho.
- **Eixo:** coluna única centralizada. Margens laterais de **28 px**. Campos e botões ocupam 358 px (x 28 a 386).
- **Largura fluida:** os blocos esticam com a margem fixa de 28.
- **Alinhamento:**
  - Marca e título centralizados.
  - Campos, botão e botões sociais em largura total da coluna.
  - O link de senha à direita.
  - O rodapé centralizado.

### 3.2 Blocos, de cima para baixo (y em px de 414 × 896)
1. **Marca `KURIO`** (y≈148)
   - Centralizada, em caixa alta.
   - `color/foreground`, peso 700.
   - Espaçamento de letras aberto, por leitura.
   - É o maior texto da tela. Sem número no desenho.
2. **Título `Entrar`** (y≈265)
   - Centralizado, `color/foreground`, peso 700.
   - Menor que a marca, sem tamanho numérico.
   - Folga grande acima, de cerca de 100 px entre marca e título.
3. **Campo e-mail** (y 312 a 362)
   - Largura 358, altura 50, raio 5.
   - Borda `color/border`, fundo `color/ink`.
   - Placeholder `contato@email.com` alinhado à esquerda, em `color/secondary`, peso 400.
4. **Campo senha** (y 374 a 424), com folga de 12 px do e-mail
   - Mesma altura e raio.
   - **Borda `color/primary`.**
   - Valor `***********` (11 asteriscos) em `color/foreground`.
   - Ícone de olho riscado à direita. No mobile ele é escuro e discreto.
5. **Link `Esqueceu a senha?`** (y≈444)
   - À direita, alinhado à borda direita do campo.
   - `color/text-accent`, peso 400.
6. **Botão `Entrar`** (y 492 a 552)
   - Largura 358, altura 60.
   - Preenchido com `color/primary`.
   - Texto `Entrar` centralizado, em `color/ink`, peso 700.
   - Folga de cerca de 40 px acima.
   - Raio: ver Lacunas.
7. **Divisor** (y≈600)
   - Rótulo `Ou continue com` centralizado, em `color/foreground`.
   - **Linhas finas à esquerda e à direita do rótulo**, em `color/border`, indo até as margens de 28.
   - Aqui o rótulo fica **dentro** da linha, ao contrário do desktop.
8. **Botão Google** (y 620 a 660)
   - Largura 358, altura 40, raio 5.
   - Borda `color/border`, fundo transparente.
   - Logo G multicolor mais texto `Continuar com Google`, centralizados.
   - Texto em `color/text-secondary`, peso 400.
9. **Botão Facebook** (y 676 a 716), folga de 16 px do Google
   - Mesmo desenho.
   - Logo "f" azul mais texto `Continuar com Facebook`.
10. **Rodapé** (y≈767)
    - Frase única, centralizada, em `color/text-secondary`, peso 400:
      `Novo na Kurio? Crie uma conta`
    - Sem sublinhado, sem destaque de cor em parte da frase.

---

## 4. Mobile, tela Criar conta (`mobile-cadastro.png`)

Mesma moldura do mobile Entrar: mesmo fundo, mesma margem de 28, mesma marca `KURIO` em y≈148.

1. **Título** (y≈265)
   - Texto literal: `Criar perfil de colecionador`.
   - Centralizado, `color/foreground`, peso 700.
   - Cabe em uma linha na largura útil.
2. **Quatro campos** (largura 358, altura 50, raio 5, borda `color/border`, fundo `color/ink`)
   - Folga de 12 px entre eles. Posições em y: 312 a 362, 374 a 424, 436 a 486, 498 a 548.
   - **Nenhum em foco.**
   - Placeholders em `color/secondary`, peso 400:
     - `Nome de usuário`: **centralizado** no campo, como desenhado. Os outros três estão alinhados à esquerda.
     - `Digite seu e-mail`
     - `Senha`, com ícone de olho riscado à direita
     - `Confirmar senha`, com ícone de olho riscado à direita
3. **Botão** (y 588 a 648)
   - Largura 358, altura 60, `color/primary`.
   - Texto literal `Criar perfil`, em `color/ink`, peso 700.
   - A folga de cerca de 40 px acima vem do último campo.
4. **Divisor** (y≈696): igual ao do mobile Entrar, com `Ou continue com` entre linhas finas.
5. **Google** (y 716 a 756) e **Facebook** (y 772 a 812): idênticos ao mobile Entrar.
6. **Rodapé** (y≈862)
   - Texto literal: `Já tem uma conta? Entre`
   - Centralizado, `color/text-secondary`, peso 400.
   - Fica a cerca de 34 px da base do frame.

---

## 5. Fechamento

### 5.1 Árvore de blocos, de fora para dentro

**Desktop (1440)**
```
Página Início (existente, fora do contrato)
└─ Modal de autenticação (camada sobre a Início, sem película)
   ├─ [fundo surface-card, raio 5, centralizado, largura ≈500]
   ├─ Botão fechar (X, primary, canto superior direito)
   ├─ Abas: [Entrar | Criar conta]   (ativa em text-accent, inativa em foreground)
   ├─ Parágrafo de apoio (depende da aba)
   ├─ Coluna de conteúdo (margem lateral ≈80)
   │  ├─ Formulário Entrar:
   │  │   ├─ Campo e-mail
   │  │   ├─ Campo senha + olho
   │  │   ├─ Link "Esqueceu a senha?" (à direita)
   │  │   └─ Botão "Entrar"
   │  └─ Formulário Criar conta:
   │      ├─ Campo Nome de usuário
   │      ├─ Campo e-mail
   │      ├─ Campo Senha + olho
   │      ├─ Campo Confirmar senha (sem olho)
   │      └─ Botão "Criar conta"
   ├─ Divisor de ponta a ponta + rótulo "Ou continue com" abaixo da linha
   ├─ Coluna social:
   │   ├─ Botão "Continuar com Google"
   │   └─ Botão "Continuar com Facebook"
   └─ Faixa de base em primary, largura total do modal
```

**Mobile (414, e 390 na mesma composição)**
```
Tela cheia (fundo ink, sem cabeçalho, sem menu)
└─ Coluna única, margem lateral 28, tudo centralizado
   ├─ Marca "KURIO"
   ├─ Título ("Entrar" ou "Criar perfil de colecionador")
   ├─ Formulário Entrar:
   │   ├─ Campo e-mail
   │   ├─ Campo senha + olho
   │   ├─ Link "Esqueceu a senha?" (à direita)
   │   └─ Botão "Entrar"
   │  OU Formulário Criar conta:
   │   ├─ Campo Nome de usuário (texto centralizado)
   │   ├─ Campo e-mail
   │   ├─ Campo Senha + olho
   │   ├─ Campo Confirmar senha + olho
   │   └─ Botão "Criar perfil"
   ├─ Divisor com rótulo "Ou continue com" entre linhas
   ├─ Botão "Continuar com Google"
   ├─ Botão "Continuar com Facebook"
   └─ Rodapé de troca ("Novo na Kurio? Crie uma conta" ou "Já tem uma conta? Entre")
```

### 5.2 O que muda do desktop para o mobile

| Item | Desktop | Mobile |
| --- | --- | --- |
| Contêiner | Modal sobre a Início, sem película | Tela cheia em `color/ink` |
| Cabeçalho, menu, hero e grade | Aparecem atrás do modal | Ausentes |
| Marca `KURIO` grande | Ausente (só o wordmark pequeno do cabeçalho da Início) | Presente no topo, centralizada, peso 700 |
| Botão fechar (X) | Presente | Ausente |
| Abas `Entrar` / `Criar conta` | Presentes | Ausentes. A troca vai por link no rodapé |
| Título | Vem das abas | `Entrar` ou `Criar perfil de colecionador`, peso 700 |
| Parágrafo de apoio | Presente | Ausente |
| Texto do botão do cadastro | `Criar conta` | `Criar perfil` |
| Olho em `Confirmar senha` | Ausente | Presente |
| `Nome de usuário` | Alinhado à esquerda | Centralizado |
| Divisor | Linha de ponta a ponta, rótulo abaixo dela | Rótulo entre duas linhas, até as margens de 28 |
| Faixa `color/primary` de base | Presente | Ausente |
| Rodapé de troca de tela | Ausente | Presente |
| Medidas | Modal de largura fixa (≈500 no 1440), colunas com margem ≈80 | Margem 28 e largura fluida |
| Alturas | Campo ≈40 a 44, botão ≈45 | Campo 50, botão 60, social 40 |
| Foco desenhado | Senha de Entrar | Senha de Entrar (igual) |

### 5.3 O que não construir (não está no PNG)
- Película escura, desfoque ou qualquer camada atrás do modal.
- `box-shadow` no modal, nos campos ou nos botões.
- Cabeçalho, menu ou rodapé do site na versão mobile.
- Aba sublinhada ou indicador animado entre as abas.
- Mensagens de erro, estados de carregamento ou campo desabilitado.
- Texto de ajuda sob os campos, contador de força de senha ou checklist de senha.
- Caixa de "lembrar de mim" ou de aceite de termos.
- Link de termos, de política ou de suporte.
- Botão para voltar ou fechar no mobile.
- O ícone de olho em `Confirmar senha` no desktop.
- Logos de provedores além de Google e Facebook.
- Segunda coluna, ilustração ou imagem na tela de autenticação.
- Qualquer comportamento do Google e do Facebook além do desenhado: o botão e o texto.
- O frame de telefone com raio 40 e o recorte de cantos como elemento da tela.

### 5.4 Lacunas (não dá para ler no PNG)
1. **Tamanhos de fonte:** nenhum PNG traz o número. Só há hierarquia relativa (marca > título ou aba > corpo > campo). O contrato não define pt ou px.
2. **Peso do título das abas e do botão no desktop:** a escala de 0,517 deixa ambíguo entre 500 e 700. Mobile é 700 nos títulos e botões.
3. **Cor do ícone de olho:** no desktop de Entrar parece clara, no mobile parece um marrom escuro. Não casa com certeza com nenhum token. Escolher só entre os nove tokens.
4. **Cor da linha vertical entre as abas e cor do `X`:** lidas como laranja, mas a espessura de 1 px não permite confirmar entre `color/primary` e `color/text-accent`.
5. **Borda do modal:** não há linha de borda visível ao redor. Só a faixa de base.
6. **Raio dos campos e botões no mobile:** os cantos no PNG parecem maiores que 5 e 6. A regra fechada manda 5 nos campos e nos botões sociais. Seguir a regra e tratar a diferença como arte.
7. **Raio do botão principal no mobile:** é botão de página (6) ou botão de formulário (5)? O desenho parece um pouco maior que 6 e não decide.
8. **Estado revelado da senha:** não há PNG com o olho aberto.
9. **Destino e comportamento de:**
   - `X`
   - `Esqueceu a senha?`
   - botões Google e Facebook
   - links do rodapé mobile
   - cada aba

   Nada disso está desenhado.
10. **Frase do rodapé mobile:** não dá para saber se só `Crie uma conta` e `Entre` são clicáveis. No desenho a frase é uma cor só, sem sublinhado.
11. **768:** não há PNG. Só está dito que é uma coluna com padding horizontal de 28. Largura máxima da coluna e ponto de troca entre modal e tela cheia não estão no desenho.
12. **Alinhamento do placeholder de `Nome de usuário` no mobile:** centralizado só neste campo, o que parece inconsistência do desenho. Deixei como desenhado.
13. **Descendentes cortados em `Criar perfil de colecionador`:** o "p" aparece cortado por baixo no PNG. Parece artefato da exportação e não deve ser reproduzido.
14. **Largura útil do modal entre 768 e 1440:** só o 1440 está desenhado.
15. **Cor das logos de Google e Facebook:** vêm da marca, não dos tokens. O desenho as mostra coloridas.
16. **Cópia escondida atrás do modal:** o heading do hero está cortado (`SEJA DONO DO`, `DA ARTE DIGI`) e o parágrafo também (`Descubra NFTs selecionados de criado`, `arte digital verificada.`). O contrato não lê nem completa esse texto.

## 3. Fora de escopo

- Recuperar senha. Entrar de verdade com Google ou Facebook.
- Favorito guardado, carrinho com item, cotação, pedido, recibo e tempo real.
- Dados de perfil além do e-mail, e qualquer dado de carteira.
- Guarda no carrinho, no início e no detalhe da peça.
- Sessão gravada no navegador e sessão combinada entre abas.
- Película, sombra, hex novo em token e dependência nova.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- Redesenhar a página que fica atrás do painel. O hero cortado no PNG não se completa por esta spec.
- Mensagem de erro desenhada. As frases desta spec aparecem em texto, sem bloco novo no frame.
- Troca ao vivo ao redimensionar a janela. A prova é abrir em 1440 e abrir em 390.

## 4. Atores e pré-condições

- Quem usa: visitante, Ada, Bruno e quem cria conta nesta sessão da loja.
- O que precisa existir antes: a loja simulada já nasce com Ada e Bruno, favorito, carrinho e pedido distintos, e com o catálogo das oito peças. O recomeço devolve essa semente. O início, o detalhe e o carrinho já funcionam. Perfil, carteiras, pagamento e a confirmação mostram só o nome da tela, dentro da casca. No desktop, o botão Entrar do topo aponta para `/entrar`. A simulação liga por padrão e desliga pela configuração já existente. Não há sessão.

Ada e Bruno passam a ter nome e senha, sem perder o que a semente já guarda:

| Pessoa | Identificador | Nome | E-mail | Senha |
| --- | --- | --- | --- | --- |
| Ada | `usr-ada` | Ada | `ada@kurio.test` | `kurio` |
| Bruno | `usr-bruno` | Bruno | `bruno@kurio.test` | `kurio` |

## 5. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. `conta` e `retorno` são o que aparece no endereço. A cópia e o arranjo da entrada são os da seção Tela. Cenário não pede bloco que o contrato marcou como ausente. O estado com sessão aberta não está nos PNG. Ele entra aqui porque o plano o pediu.

### Cenário 1: No desktop, Entrar abre o painel na página atual

- Dado: a largura é de 1440 ou mais e a pessoa está numa página pública, como `/` ou `/carrinho`.
- Quando: ela aciona Entrar no topo.
- Então: a página não troca. O painel de Entrar abre por cima, sem película, no arranjo da seção Tela. O endereço ganha `conta=entrar` e conserva o caminho e a busca que já existiam. Atualizar a página deixa o mesmo painel sobre a mesma página.

### Cenário 2: A aba troca o formulário no mesmo painel

- Dado: o painel de Entrar está aberto no desktop.
- Quando: a pessoa aciona `Criar conta`.
- Então: o mesmo painel mostra o formulário de criar conta da seção Tela, com o parágrafo `Crie seu perfil de colecionador e conecte uma carteira quando quiser.` e o botão `Criar conta`. O endereço passa a `conta=cadastro`. A aba `Entrar` volta ao formulário de entrar e a `conta=entrar`. Fechar não acontece só por trocar a aba.

### Cenário 3: Fechar devolve a página

- Dado: o painel está aberto, com ou sem `retorno`.
- Quando: a pessoa aciona o X ou a tecla Esc.
- Então: o painel some, `conta` sai do endereço e a página de trás continua. A pessoa não entra numa tela privada. `retorno` sai junto.

### Cenário 4: Endereço direto no desktop

- Dado: a largura é de 1440 ou mais.
- Quando: a pessoa abre `/entrar` ou `/cadastro`.
- Então: o endereço vira `/?conta=entrar` ou `/?conta=cadastro`, com o início atrás do painel. Se havia `retorno` válido, ele segue. A casca do início permanece visível atrás do painel.

### Cenário 5: Abaixo de 1440, as telas cheias

- Dado: a largura é menor que 1440, inclusive 768 e 390.
- Quando: a pessoa abre `/entrar` ou `/cadastro`.
- Então: a tela é a coluna cheia da seção Tela, fundo `color/ink`, margem 28, sem cabeçalho, sem menu e sem a página de mercado atrás. O raio 40 não entra. Em `/cadastro`, o título é `Criar perfil de colecionador` e o botão é `Criar perfil`. O placeholder `Nome de usuário` fica centralizado. Os outros exemplos ficam à esquerda. `Confirmar senha` tem olho. Não há aba, não há X e não há parágrafo de apoio.
- Quando: na tela de entrar ela aciona a frase `Novo na Kurio? Crie uma conta`.
- Então: abre `/cadastro`. Se havia `retorno` válido, ele segue.
- Quando: na tela de cadastro ela aciona `Já tem uma conta? Entre`.
- Então: abre `/entrar`, com o mesmo `retorno` se ele for válido.

### Cenário 6: Ada entra

- Dado: não há sessão e o formulário de entrar está visível.
- Quando: Ada informa `ada@kurio.test` e a senha `kurio`.
- Então: a sessão fica aberta com identificador `usr-ada`, nome Ada e e-mail `ada@kurio.test`. A senha não volta. Favorito, carrinho e pedido de Ada continuam os da semente. Bruno entra do mesmo modo, com `bruno@kurio.test`, nome Bruno e identificador `usr-bruno`.
- Quando: o e-mail é `Ada@kurio.test` e a senha continua `kurio`.
- Então: entra a mesma Ada. A comparação do e-mail não diferencia maiúsculas. A senha é exata: `Kurio` não entra.

### Cenário 7: Credencial que não confere

- Dado: o formulário de entrar está visível.
- Quando: o e-mail não existe, a senha não é a gravada, ou e-mail ou senha estão vazios.
- Então: a sessão não abre. A tela mostra `E-mail ou senha não conferem.` O painel ou a tela cheia continuam. `retorno`, se havia, continua.

### Cenário 8: Criar conta abre a sessão

- Dado: não há sessão e o e-mail ainda não tem conta.
- Quando: a pessoa informa nome `Lia`, e-mail `lia@kurio.test`, senha `kurio` e a mesma senha de novo, e aciona `Criar conta` no desktop ou `Criar perfil` abaixo de 1440.
- Então: a loja grava Lia com favorito, carrinho e pedido vazios. A primeira conta nova recebe o identificador `usr-3`. A seguinte, se a loja não recomeçou, recebe o próximo inteiro. A sessão abre com esse identificador, o nome Lia e o e-mail `lia@kurio.test`. A senha não volta.

### Cenário 9: Cadastro recusado

- Dado: o formulário de criar conta está visível.
- Quando: nome, e-mail ou senha estão vazios, ou o nome só tem espaço.
- Então: a conta não nasce e a tela mostra `Informe nome, e-mail e senha.`
- Quando: nome, e-mail e senha estão preenchidos e confirmar senha está vazio ou diferente.
- Então: a conta não nasce e a tela mostra `As senhas não conferem.`
- Quando: o e-mail já é o de Ada, sem diferenciar maiúsculas, como `ADA@kurio.test`.
- Então: a conta não nasce, a sessão de Ada não abre por causa disso e a tela mostra `Este e-mail já tem conta.`

### Cenário 10: Sem sessão, a tela privada pede a entrada e volta

- Dado: não há sessão.
- Quando: a pessoa abre `/perfil`, `/carteiras`, `/pagamento` ou `/pedidos/ped-9`.
- Então: a tela privada não aparece. Abaixo de 1440 o endereço vai para `/entrar?retorno=` com esse caminho. A partir de 1440 vai para `/?conta=entrar&retorno=` com esse caminho.
- Quando: ela entra como Ada, ou cria uma conta, com esse `retorno` ainda válido.
- Então: a sessão abre e a pessoa chega no caminho pedido. Em `/perfil`, vê o próprio e-mail.

### Cenário 11: retorno que não vale

- Dado: a entrada está aberta com `retorno`.
- Quando: o valor não é um caminho interno desta app, ou é `/entrar`, ou é `/cadastro`, ou começa como endereço de fora.
- Então: depois de entrar ou criar conta, a pessoa vai para `/`. Exemplos que caem em `/`: `https://fora.exemplo`, `//fora.exemplo`, `/entrar`, `/cadastro`.
- Quando: o caminho é interno e não é entrar nem cadastro, mesmo público, como `/carrinho` ou `/nfts/neon-vessel-552?q=neon`.
- Então: a pessoa volta a esse caminho, com a busca que ele já tinha.

### Cenário 12: Início, peça e carrinho continuam públicos

- Dado: não há sessão.
- Quando: a pessoa abre `/`, o detalhe de uma peça ou `/carrinho`.
- Então: a tela abre. A entrada não aparece sozinha. Blog, Criadores, Aprenda e os atalhos que já não navegavam continuam sem navegar e sem mostrar sucesso.

### Cenário 13: Sair

- Dado: Ada está na sessão.
- Quando: no desktop, ela aciona `Sair` no lugar do botão Entrar.
- Então: a sessão acaba. O que a tela guardou só para Ada sai. O catálogo permanece. O botão volta a dizer Entrar. Se ela estava em perfil, carteiras, pagamento ou confirmação, a guarda abre a entrada de novo.
- Quando: em `/perfil`, abaixo de 1440, ela aciona `Sair`.
- Então: o mesmo fim de sessão. Esse `Sair` é a saída no mobile.

### Cenário 14: Com sessão, o que cada tela privada mostra

- Dado: Ada está na sessão.
- Quando: ela abre `/perfil`.
- Então: vê o e-mail `ada@kurio.test` e `Sair`. Não vê a senha.
- Quando: ela abre `/carteiras`, `/pagamento` ou `/pedidos/ped-9`.
- Então: a casca permanece e o miolo continua só com o nome da tela. Confirmação continua `Confirmação` mais o identificador do pedido. Não há dado de carteira nem de pagamento.

### Cenário 15: Falha ao saber se há sessão

- Dado: a simulação está desligada, ou a leitura da sessão falha por outro motivo que não seja a ausência de sessão.
- Quando: a pessoa abre uma tela privada ou a entrada.
- Então: a tela privada não abre. O formulário mostra `Não foi possível carregar a sessão.` Visitante, com a loja no ar e sem sessão, não vê essa frase. Para a tela, visitante é ausência de sessão.

### Cenário 16: Atalhos que ficam visíveis e não entram

- Dado: a entrada está visível, no painel ou na tela cheia.
- Quando: a pessoa aciona `Esqueceu a senha?`, `Continuar com Google` ou `Continuar com Facebook`.
- Então: o endereço não muda, a sessão não abre e não aparece sucesso.

### Cenário 17: Recomeço e sessão que o navegador não guarda

- Dado: Lia criou conta e está na sessão, ou Ada entrou.
- Quando: a loja recomeça.
- Então: a sessão acaba. Ada e Bruno voltam à semente, com nome, senha, favorito, carrinho e pedido de antes. Lia deixa de existir. A próxima conta nova volta a ser `usr-3`.
- Quando: a pessoa atualiza o navegador.
- Então: o navegador não traz a sessão por conta própria. A tela pergunta de novo à loja. Se a loja viva ainda tiver a sessão, ela continua. Se a loja nasceu de novo na semente, não há sessão.

### Cenário 18: Quem já entrou não vê o formulário de novo

- Dado: Ada está na sessão.
- Quando: ela abre `/entrar`, `/cadastro` ou um endereço com `conta=entrar` ou `conta=cadastro`.
- Então: o formulário não pede de novo. Se havia `retorno` válido, ela vai para esse caminho. Sem `retorno`, vai para `/`.

### Cenário 19: O olho só mostra a senha daquele campo

- Dado: um campo de senha com olho está visível. No desktop, confirmar senha não tem olho.
- Quando: a pessoa aciona o olho.
- Então: a senha daquele campo alterna entre oculta e visível. O outro campo não muda. Não há frame do olho aberto. O ícone fica sem a barra enquanto a senha está visível, na cor fechada na seção 9.

## 6. Regras de negócio

- Regra 1: a partir de 1440 a entrada é o painel sobre a página atual. Abaixo de 1440, inclusive 768 e 390, `/entrar` e `/cadastro` são as telas cheias, sem a casca. O raio 40 não entra.
- Regra 2: arranjo, cópia e cor da entrada seguem a seção Tela. Aprovar esta spec adota essa leitura nos pontos em que o corpo do plano divergiu. A seção 9 lista a divergência.
- Regra 3: no desktop, `conta=entrar` ou `conta=cadastro` mantém o painel se a página for atualizada. Fechar ou Esc tira `conta` e `retorno`. Abaixo de 1440 a troca de formulário é pelas frases do rodapé, a frase inteira, uma cor só.
- Regra 4: o botão principal do painel usa raio 5. O botão principal das telas cheias usa raio 6. Campo, botão social e o próprio painel usam raio 5. Sem `box-shadow`. Sem hex novo em token.
- Regra 5: a borda `color/primary` nestas telas é a do campo senha de Entrar, como o contrato leu. Os outros campos usam `color/border`. A busca do topo não muda de borda.
- Regra 6: olho, X, Google e Facebook são desenho no próprio componente, sem biblioteca. A cor de marca do Google e do Facebook fica só dentro desses dois desenhos, não em token.
- Regra 7: a loja viva guarda uma sessão. Entrar ou criar conta substitui quem estava. A resposta da sessão traz identificador, nome e e-mail. A senha não volta. O navegador não grava a sessão.
- Regra 8: e-mail é comparado sem diferenciar maiúsculas. Senha é exata. Confirmar senha precisa ser igual à senha. Nome vazio, ou só com espaço, não cria conta. Campo vazio no entrar usa a frase de credencial. Campo vazio no cadastro usa `Informe nome, e-mail e senha.` Senhas diferentes usam `As senhas não conferem.` E-mail já usado usa `Este e-mail já tem conta.`
- Regra 9: conta nova nasce com favorito, carrinho e pedido vazios e já abre a sessão. O identificador da primeira é `usr-3`. Ada continua `usr-ada` e Bruno continua `usr-bruno`. O recomeço zera a sessão e devolve a semente, inclusive o próximo identificador.
- Regra 10: sem sessão, `/perfil`, `/carteiras`, `/pagamento` e `/pedidos/$pedidoId` abrem a entrada. `retorno` só vale se for caminho interno desta app e não for entrar nem cadastro. Caminho inválido cai em `/`. `/`, o detalhe e `/carrinho` continuam públicos.
- Regra 11: a leitura da sessão fica numa chave própria, `['sessao']`. O que é privado da pessoa fica numa chave que inclui o identificador dela. Sair remove `['sessao']` e toda chave com esse identificador. `['nfts']` fica. Não há socket nesta fatia. Não há chave de idempotência.
- Regra 12: visitante na leitura da sessão é ausência de sessão. Simulação desligada ou falha dessa leitura não abre tela privada e o formulário mostra `Não foi possível carregar a sessão.`
- Regra 13: os frames não desenham a sessão aberta. No desktop, o lugar do Entrar vira `Sair`, na mesma peça de botão. Em `/perfil`, a pessoa vê o próprio e-mail e `Sair`. Carteiras, pagamento e confirmação continuam só com o nome da tela.
- Regra 14: `Esqueceu a senha?`, `Continuar com Google` e `Continuar com Facebook` ficam visíveis. O clique não navega e não mostra sucesso.
- Regra 15: a tela não fala com o cliente HTTP. Pede a sessão pelo cache de leitura. Componente e hook não importam o atendimento da simulação.
- Regra 16: os endereços estáveis desta fatia são entrar na sessão, ler a sessão, sair da sessão e criar a conta, mais o recomeço que já existia. Estão aqui porque a implementação segue esta spec: `POST /api/sessao`, `GET /api/sessao`, `DELETE /api/sessao`, `POST /api/cadastro`, `POST /api/dev/reset`. Credencial errada responde como não autorizado. E-mail já usado responde como conflito. Campo vazio ou senhas diferentes respondem como pedido inválido, com as frases da regra 8. Visitante na leitura responde como não autorizado e a tela trata como sem sessão.
- Regra 17: o teste que hoje espera a leitura da sessão sem resposta passa a usar outro caminho desconhecido. O teste da casca que exige o link Entrar para `/entrar` passa a esperar o painel no desktop. Abaixo de 1440, `/entrar` e `/cadastro` deixam de mostrar só o nome dentro da casca.
- Regra 18: nenhuma dependência nova. O campo compartilhado e o botão compartilhado não mudam de tema para o resto da Kurio.

Lacunas do contrato que esta spec fecha, sem reescrever a seção Tela:

- Tamanho de fonte: hierarquia do contrato, sem número inventado.
- Peso das abas e do botão no desktop: 500, como a leitura do contrato. No mobile, título e botão principal em 700.
- Olho, X e a linha entre as abas: `color/primary`.
- Raio do botão principal das telas cheias: 6.
- Ponto de troca: 1440. Abaixo disso, a tela cheia com margem 28. 768 não ganha terceiro desenho.
- X, Esc, abas, rodapé, `Esqueceu a senha?`, Google e Facebook: cenários 2, 3, 5 e 16.
- Olho aberto: cenário 19. Sem frame novo.
- A frase inteira do rodapé é o controle.
- O "p" de `Criar perfil de colecionador` não fica cortado.
- `Nome de usuário` no mobile permanece centralizado, como desenhado.

## 7. Critérios de Done desta feature

- [ ] A entrada entregue segue a seção Tela
- [ ] Os cenários acima passam
- [ ] A prova automática cobre credencial, cadastro recusado, `retorno` válido e inválido, a chave privada que sai no logout e o catálogo que permanece
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, em 1440 e em 390: painel, telas cheias, Ada, cadastro, guarda e sair
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/contracts/session.ts`, `src/lib/api/session.ts`, `src/features/session/**` e `src/mocks/**` fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 8. Escopo de arquivos permitido

- Pode criar ou editar:
  - `src/lib/contracts/session.ts`
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/lib/api/session.ts`
  - `src/lib/query/session.ts`
  - `src/features/session/`
  - `src/routes/entrar.tsx`
  - `src/routes/cadastro.tsx`
  - `src/routes/perfil.tsx`
  - `src/routes/carteiras.tsx`
  - `src/routes/pagamento.tsx`
  - `src/routes/pedidos/$pedidoId.tsx`
  - `src/routes/index.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.tsx`
  - `src/components/layout/app-shell.test.tsx`
  - `src/main.tsx`
- Não pode editar sem pedido:
  - `src/lib/contracts/nft.ts`
  - `src/lib/money.ts`
  - `src/lib/socket/**`
  - `src/styles/tokens.css`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/features/catalog/**`
  - `src/features/home/**`
  - `src/features/detail/**`
  - `src/routes/carrinho.tsx`
  - `src/routes/nfts/$nftId.tsx`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - spec já aprovada

`src/features/session/**`, `src/lib/contracts/session.ts`, `src/lib/api/session.ts` e `src/mocks/**` são path crítico. Entram só com esta spec aprovada e com review humano do diff.

Se o painel sobre a página atual não couber nesses arquivos, a implementação para e pede aprovação. Não amplia o escopo para o carrinho nem para o detalhe por conta própria.

## 9. Riscos e dúvidas abertas

A seção Decisão do plano está em branco. Não houve item aceito nem item descartado para repetir aqui.

O corpo do plano e o contrato de UI divergem. Aprovar esta spec escolhe o contrato:

- Abas: o plano pedia a aba ativa de Entrar em `color/foreground`, a aba ativa de Criar conta em `color/text-accent` e a inativa em `color/secondary`. O contrato lê a aba ativa, nas duas, em `color/text-accent`, e a inativa em `color/foreground`.
- `Esqueceu a senha?`: o plano pedia `color/primary`. O contrato lê `color/text-accent`.
- Borda dos campos: o plano pedia `color/primary` em todos os campos destas telas. O contrato lê essa borda só no campo senha de Entrar. Os demais ficam em `color/border`, com fundo `color/ink`.
- Moldura do painel: o plano pedia borda medida. O contrato não vê borda ao redor. Vê a faixa de base em `color/primary`.
- Parágrafo de criar conta: o plano escreveu "conecte sua carteira". O contrato lê "conecte uma carteira".

Fechamentos desta spec que o PNG não decidia, e que a aprovação também cobre:

- Olho, X e a linha entre as abas usam `color/primary`.
- O botão das telas cheias usa raio 6.
- A frase inteira do rodapé troca de tela.
- Entrar com campo vazio usa `E-mail ou senha não conferem.` A frase com nome fica no cadastro.
- Sem `retorno`, no desktop, entrar ou criar conta fecha o painel e a página de trás continua. Abaixo de 1440, vai para `/`.
- Quem já está na sessão e abre a entrada segue o `retorno` válido ou vai para `/`.

Outros riscos:

- Não há frame de sessão aberta. `Sair` reutiliza a peça do Entrar até existir esse desenho.
- `retorno` mal filtrado abriria um endereço de fora. A função só aceita caminho interno, e recusa entrar e cadastro.
- O painel no desktop muda o teste da casca que hoje exige `href="/entrar"`. A prova da casca precisa distinguir 1440 de abaixo de 1440.
- A semente já aprovada ganha nome e senha. Favorito, carrinho e pedido de Ada e Bruno permanecem.
- A cor de marca do Google e do Facebook fica presa no desenho. Se isso for recusado na aprovação, o botão social fica só com o texto, na cor medida.
- O painel sobre `/carrinho` ou sobre o detalhe pode não caber nos arquivos desta lista. Nesse caso a implementação para.

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:
