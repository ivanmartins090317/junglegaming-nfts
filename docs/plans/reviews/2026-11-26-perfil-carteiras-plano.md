# Plano: Perfil e carteiras

- Status: `aguardando aprovação`
- Data: 2026-11-26
- Slug: `perfil-carteiras`
- Autonomia: `tight`
- Spec: ainda não escrita
- Frames: `research/figma/desktop-perfil.png`, `research/figma/desktop-carteiras.png`. Não existem `research/figma/mobile-perfil.png` nem `research/figma/mobile-carteiras.png`
- Contrato de UI: [Contrato de UI da tela](15405055-1ec7-4411-aaf2-2df3c1ab6782), colado na íntegra abaixo
- Revisão de contexto limpo: não pedida neste turno

## Plano

Uma fatia só. O miolo de `/perfil` e de `/carteiras` segue o contrato de UI abaixo. A guarda dessas rotas continua. A pessoa logada vê a sidebar e o formulário da rota. Salvar grava o dado dela na loja viva e espera a simulação. Pagamento, recibo e carteira do pedido ficam fora.

Decisões deste plano:

- A parte de UI é o contrato colado na seção Contrato de UI. A implementação não reescreve região, cópia nem bloco do miolo.
- Não há frame mobile. O contrato registra a ausência e não descreve outra composição. Abaixo de 1440 vale a regra já fechada das telas sem frame próprio: uma coluna, padding horizontal 28, os mesmos blocos, na mesma ordem. 390 usa essa coluna. A sidebar fica acima do formulário. Em cada linha da grade, o campo da esquerda vem antes do da direita. O par `.eth` mais o campo, a linha do avatar e o grupo do título da carteira secundária continuam controles únicos. A casca não muda o padding que já aplica.
- O cabeçalho e a barra inferior continuam os da casca já entregue. Esta fatia não pinta um segundo header. Com sessão, o botão do topo continua `Sair`. O selo do carrinho continua a quantidade viva. `Início` continua ativo só em `/`. O header desenhado no PNG, com `Entrar`, selo `6` e `Início` ativo, é a casca no export, não um miolo novo.
- A guarda de `/perfil` e `/carteiras` permanece. Sem sessão, a rota abre a entrada e volta ao caminho depois do sucesso. As duas rotas continuam com cabeçalho. A confirmação do pedido continua sem cabeçalho.
- A sidebar é a mesma nas duas rotas. `Dados do perfil` abre `/perfil`. `Carteiras` abre `/carteiras`. A barra de `color/primary` marca a rota atual. `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados` e `Suporte` ficam visíveis. O clique não navega e não mostra sucesso. `Sair` na sidebar encerra a sessão, o mesmo gesto do `Sair` do topo.
- O formulário do perfil troca o parágrafo atual de e-mail. Os campos vazios não ganham placeholder: o PNG não traz. O valor salvo aparece no mesmo campo. Ada e Bruno começam com o nome da conta em `Nome de exibição` e o e-mail da conta em `E-mail`. `Nome de usuário`, `Nome ENS` e `Apelido da carteira` começam vazios. Conta nova nasce assim: nome do cadastro na exibição, e-mail da conta, o resto vazio.
- `Nome de exibição`, `Nome de usuário`, `E-mail`, `Nome ENS` e `Apelido da carteira` são obrigatórios no salvar do perfil. E-mail vazio, ou igual ao de outra conta sem diferenciar maiúsculas, não grava. A frase de e-mail usado continua `Este e-mail já tem conta.` Campo obrigatório vazio: `Informe os campos obrigatórios do perfil.`
- Salvar o perfil atualiza o nome e o e-mail da sessão. `GET /api/sessao` continua devolvendo identificador, nome e e-mail. O nome da sessão passa a ser o nome de exibição. A senha não volta na resposta.
- `Alterar senha` entra no mesmo salvar. Os três campos vazios deixam a senha como está. Se um deles vier preenchido, os três são obrigatórios. A senha atual tem de ser a gravada. A nova tem de ser igual à confirmação. Frases: `A senha atual não confere.` e `As senhas não conferem.` Senha errada não grava o restante do formulário. Senha certa troca a senha da próxima entrada e mantém a sessão aberta.
- O olho dos três campos de senha alterna a visibilidade, com o mesmo comportamento já entregue no entrar. O PNG desta fatia só mostra o olho cortado. O ícone fica no próprio formulário, sem biblioteca.
- `Alterar` e `Remover` do avatar ficam visíveis. O clique não abre modal, não envia arquivo, não navega e não mostra sucesso. Não há avatar na resposta.
- A carteira principal é outro formulário, de outra rota. `Apelido da carteira`, `Nome ENS`, `E-mail` e `Nome de exibição` do perfil não preenchem os campos de mesmo rótulo na carteira, nem o contrário. Ada, Bruno e conta nova começam com a carteira principal vazia.
- O salvar da carteira exige texto em `Nome de exibição`, `Apelido da carteira`, `Nome do perfil`, `Endereço da carteira`, `Código de indicação`, `E-mail` e `Nome ENS`. Campo vazio: `Informe os campos obrigatórios da carteira.` O endereço é string. Não há validação de `0x`. O sufixo desenhado continua `.eth`, fixo, sem outra opção.
- `Rede` e `Tipo de carteira` permanecem no placeholder do contrato (`Selecione uma rede`, `Selecione uma carteira`). O menu aberto não está no PNG e não entra. Os dois vão vazios no corpo. O asterisco continua visível. O salvar não espera um valor que a pessoa não pode escolher. O campo sem rótulo, com `ENS ou carteira secundária (opcional)`, é opcional e não cria a carteira secundária.
- A carteira secundária fica no estado vazio do contrato: `Você ainda não adicionou uma carteira secundária.` `Adicionar`, nas duas faixas, fica visível. O clique não navega e não mostra sucesso. O marcador `Igual à carteira principal` permanece vazio. O clique não preenche e não mostra sucesso.
- O texto `Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.` é cópia. Esta fatia não liga a carteira salva ao pagamento nem ao recibo. O recibo continua com o rótulo `MetaMask`.
- Não há toast de sucesso. Depois do salvar, os campos mostram o valor gravado. Antes da leitura, a coluna do formulário mostra `Carregando`. Falha de leitura ou de salvar mostra `Não foi possível carregar o perfil.`, `Não foi possível salvar o perfil.`, `Não foi possível carregar as carteiras.` ou `Não foi possível salvar a carteira.` A sidebar continua no lugar, com `Sair`. O PNG não desenha esses estados. Eles entram como frase, sem bloco novo.
- Endereços: `GET /api/perfil` e `PUT /api/perfil`. `GET /api/carteiras` e `PUT /api/carteiras/principal`. Sem sessão, 401. A pessoa só lê e grava o próprio dado. `POST /api/dev/reset` devolve perfil e carteira à semente.
- Cache: `['usuario', id, 'perfil']` e `['usuario', id, 'carteiras']`. Sair já apaga chave que contém o identificador. Não há chave de idempotência. Dois salvamentos seguidos gravam o último corpo. O cliente espera a resposta. Não há atualização otimista.
- Sem dependência nova. Sem hex novo. Sem `box-shadow`.

### Passos

1. Gravar o contrato do perfil e o da carteira principal. A semente e o cadastro nascem com os campos desta fatia. A resposta da sessão continua sem senha.
2. Atender os quatro endereços na loja viva, isolados por pessoa. Reset volta à semente. O teste de handler cobre Ada contra Bruno, e-mail já usado, senha atual errada, senha nova, carteira vazia na semente e o reset.
3. Ligar o cliente HTTP e o cache privado. Sair limpa as duas chaves porque elas carregam o identificador. O salvar espera a simulação.
4. Trocar o miolo de `/perfil` pela sidebar e pelo formulário do contrato. `Sair` da sidebar encerra a sessão. Avatar, olho e itens fora de escopo ficam visíveis no comportamento acima.
5. Trocar o miolo de `/carteiras` pela mesma sidebar e pelos dois blocos do contrato. `Adicionar` e o marcador não gravam.
6. Ajustar o teste da sessão que hoje espera `/perfil` sem campo e lê o e-mail no texto solto. Ele passa a ler o valor do campo `E-mail` e o `Sair` dentro do miolo. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, em 1440 e em 390: Ada vê o próprio e-mail, salva o perfil sem levar o dado ao Bruno, a senha nova entra de novo, a carteira salva não muda o recibo, e os cliques fora de escopo não navegam.

### Arquivos

- Criar ou alterar:
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
- Não mexer:
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

### Fora de escopo

- Frame mobile de perfil e de carteiras. Os arquivos não estão em `research/figma/`.
- Menu aberto de `Rede`, de `Tipo de carteira` e de sufixo além de `.eth`.
- Lista de opções dessas seleções. O PNG não traz os nomes.
- Upload, modal e remoção real de avatar.
- Carteira secundária preenchida, lista de carteiras salvas e segundo formulário.
- Ligar a carteira salva ao pagamento, ao fechar pedido ou ao rótulo `MetaMask` do recibo.
- `Atividade`, `Lista de interesse`, `Ofertas`, `Arquivos baixados`, `Suporte`, `Criadores` e `Aprenda` navegando.
- Favorito, coleção, oferta e arquivo para baixar.
- Toast, estado de erro desenhado, hover desenhado e foco desenhado fora do campo que a casca já usa.
- Chave de idempotência e socket.
- Dependência nova. Hex novo. `box-shadow`.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- O teste da sessão em `auth-entry.test.tsx` exige `ada@kurio.test` no texto e `main input` vazio em `/perfil`. O campo novo guarda o e-mail no valor, não num parágrafo. O teste muda junto com a tela. `Sair` continua dentro do miolo, senão o clique desse teste perde o botão.
- `Rede` e `Tipo de carteira` têm asterisco e não têm lista. Esta fatia grava os dois vazios. Se o aceite exigir a lista, a spec espera os nomes antes da implementação. O PNG não os traz.
- O mesmo rótulo aparece no perfil e na carteira. São registros separados. Juntar os dois faria um salvar apagar o outro.
- Em 390, o grupo `Igual à carteira principal` mais `Adicionar` pode quebrar a linha. A quebra não cria bloco. A spec descreve o encaixe.
- A casca abaixo de `md` usa padding horizontal 24 (`px-6`). A regra fechada fala em 28. Esta fatia não reabre o padding da casca.
- Estender a semente mexe em `src/mocks/**`. Nome, e-mail, senha `kurio`, favorito, carrinho e pedido de Ada e Bruno continuam os já homologados.
- O header do PNG mostra `Entrar` e o selo `6`. Reverter a casca para esse desenho apagaria `Sair` e a quantidade viva.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/lib/contracts/**`, `src/lib/api/**`, `src/mocks/**`, e `src/features/session/**` na página de perfil que sai e no teste da guarda. Isolamento por pessoa no perfil, na carteira e no cache. Sair limpa esse cache. Não há chave de idempotência nem evento de socket nesta fatia. A senha gravada muda, e a resposta da sessão continua sem ela.

## Decisão

Preenchida depois da triagem dos achados. Até lá, deixe em branco.

- Entrou:
- Saiu:

## Contrato de UI

Fonte lida: `research/figma/desktop-perfil.png` e `research/figma/desktop-carteiras.png`.

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
