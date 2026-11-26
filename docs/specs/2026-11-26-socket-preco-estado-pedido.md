# Spec: Preço ao vivo e estado do pedido

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: o preço do catálogo e o estado do pedido passam a chegar ao vivo. A grade, o detalhe, a linha do carrinho e a cotação acompanham o preço aceito. O recibo continua a fotografia da criação. A tela não ganha bloco novo.
- Plano: `docs/plans/reviews/2026-11-26-socket-preco-estado-pedido-plano.md`
- Passos: seção 11. Executar na ordem. Um passo acaba antes do próximo.
- Decisão do plano: a seção Decisão ainda está em branco. Entrou: nada além do corpo do plano. Saiu: nada. Esta spec fecha esse corpo. Se algum achado aceito não foi gravado nessa seção, a aprovação precisa dizer o que muda antes da implementação.

## 1. Objetivo

Quem está com a loja simulada aberta vê o preço de Neon Vessel #552 mudar na grade, no detalhe e na cotação de um carrinho que tenha essa peça. Quem fecha um carrinho espera a resposta, vê o pedido nascer pendente e, em seguida, o recibo ou a frase de recusa. O recibo da Ada não acompanha o preço novo. Sair corta o estado do pedido e o preço continua público.

## 2. Tela

Não há PNG novo. Esta fatia não pede segunda leitura. A composição que vale já está gravada, e esta spec não reescreve região, cópia nem bloco.

PNG que continuam fonte, sem leitura nova:

- `research/figma/desktop-inicio.png`
- `research/figma/mobile-inicio.png`
- `research/figma/desktop-detalhe.png`
- `research/figma/mobile-detalhe.png`
- `research/figma/desktop-carrinho.png`
- `research/figma/mobile-carrinho.png`
- `research/figma/desktop-confirmacao.png`
- `research/figma/mobile-confirmacao.png` ausente

Contratos já colados:

- Início e detalhe: `docs/plans/reviews/2026-11-26-catalogo-detalhe-url-plano.md`. Esse plano não cola um contrato de arranjo. A grade e o detalhe permanecem como a spec `docs/specs/2026-11-26-catalogo-detalhe-url.md` já entregou. Nesta fatia, o número do preço é o que muda.
- Carrinho: seção Contrato de UI de `docs/plans/reviews/2026-11-26-carrinho-cotacao-plano.md`, também na seção 2 de `docs/specs/2026-11-26-carrinho-cotacao.md`.
- Confirmação: seção Contrato de UI de `docs/plans/reviews/2026-11-26-pedido-idempotente-confirmacao-plano.md`, também na seção 2 de `docs/specs/2026-11-26-pedido-idempotente-confirmacao.md`. Fonte: `research/figma/desktop-confirmacao.png`.

O contrato da confirmação marca como ausente estado de carregamento, erro, pedido pendente e pedido recusado dentro do modal. Esta fatia respeita isso. O modal, com o parágrafo `Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.`, só aparece quando o estado é `confirmado`. `pendente` e `recusado` não ganham bloco, selo, película nem segundo botão. Entram como frase, no mesmo lugar em que a confirmação já coloca `Pedido não encontrado.`:

- `Aguardando confirmação do pedido.`
- `Pedido recusado.`

Grade, detalhe e carrinho não trocam composição.

## 3. Fora de escopo

- Bloco, cópia ou composição novos no início, no detalhe, no carrinho e na confirmação.
- Estado desenhado de carregamento, erro, película, segundo botão ou rótulo de status. O PNG não traz.
- Frame mobile da confirmação.
- Preço de comparação, favorito, cupom, carteira, perfil e a tela de pagamento.
- Marca de ordem no texto do catálogo que a tela já lê, e no recibo.
- Pedido otimista e soma de ETH na tela.
- Aviso ao vivo com a simulação desligada, e frase nova para falha desse aviso.
- Relógio dentro da prova automática em Node.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- Edição das specs já aprovadas. O nascimento `pendente` fica dito nesta spec. A spec do pedido idempotente permanece como está.
- O que os contratos citados marcam em "O que não construir", salvo as duas frases desta seção 2, fora do modal.

## 4. Atores e pré-condições

- Quem usa: visitante, Ada, Bruno e quem cria conta nesta sessão da loja.
- O que precisa existir antes: a loja simulada com as oito peças, Ada e Bruno, o carrinho, a cotação, a sessão e o recibo da fase anterior. A simulação liga por padrão e desliga pela configuração já existente. O preço é string decimal. A quantidade é inteiro. O total de fechar sai da cotação.

A marca de ordem nasce em 1, ao lado da peça e ao lado do pedido. Ela não aparece no catálogo que a tela já lê nem no recibo. O texto feliz do catálogo e os pedidos da Ada e do Bruno continuam iguais.

| Pessoa | Pedido | Estado na semente | Marca de ordem |
| --- | --- | --- | --- |
| Ada | `ped-ada-1` | `confirmado` | 1 |
| Bruno | `ped-bruno-1` | `confirmado` | 1 |

Neon Vessel #552 nasce com preço `1.99`, preço de comparação `2.29` e marca de ordem 1. As outras peças nascem com a marca 1 e não entram no relógio.

## 5. Comportamento esperado (cenários)

Linguagem de quem usa a Kurio. A cópia e o arranjo são os da seção 2. Cenário não pede bloco que o contrato marcou como ausente. O aviso de preço é público. O aviso de estado do pedido chega só para a pessoa da sessão.

### Cenário 1: O preço de Neon Vessel alterna na grade, no detalhe e na cotação

- Dado: a simulação está ligada, a loja está na semente e a pessoa já tem o catálogo em leitura. Neon Vessel #552 está em `1.99`, com comparação `2.29`.
- Quando: no navegador, passam 3 segundos.
- Então: o preço visível passa a `2.09`. A marca de ordem passa a 2. O nome, a imagem, a quantidade e o `2.29` de comparação continuam. A grade e o detalhe dessa peça mostram `2.09`.
- Quando: passam mais 3 segundos.
- Então: o preço volta a `1.99`, com a marca seguinte. A comparação continua `2.29`.
- Dado: o carrinho, da sessão ou do rascunho do visitante, tem Neon Vessel #552.
- Quando: um preço novo dessa peça é aceito.
- Então: a linha mostra o preço aceito. A cotação é lida de novo. O total de fechar é o dessa cotação. A tela não soma ETH.
- Dado: essa peça não está na leitura aberta.
- Quando: o aviso de preço chega.
- Então: não há leitura extra do catálogo, do carrinho nem da cotação.

### Cenário 2: Marca igual ou menor não muda o preço

- Dado: a leitura de Neon Vessel #552 já aceitou a marca 3, com preço `1.99`.
- Quando: chega aviso com a mesma peça, preço `2.09` e marca 3, ou marca 2.
- Então: o preço visível continua `1.99`. A comparação continua `2.29`.

### Cenário 3: O recibo da Ada não acompanha o preço

- Dado: Ada está na sessão e abre `/pedidos/ped-ada-1`. O recibo mostra Ivory Baron #088, taxa `0.00 ETH` e total `1.79 ETH`.
- Quando: o preço de Ivory Baron #088 muda no catálogo, ou o relógio muda Neon Vessel #552.
- Então: o recibo continua `1.79 ETH`, com as mesmas linhas, taxa, carteira, data e transação. O modal continua o da seção 2. O parágrafo de transação confirmada continua visível, porque o estado segue `confirmado`.

### Cenário 4: Pedido novo nasce pendente e depois confirma

- Dado: Ada está na sessão, o carrinho dela confere com as linhas que ela apresenta, e nenhuma linha é Golden Signal #160. A chave ainda não gravou pedido.
- Quando: ela pede o fecho e espera a resposta.
- Então: nasce um pedido só dela, estado `pendente`, marca de ordem 1. Não há pedido otimista. O carrinho dela esvazia nessa primeira criação, como a spec do pedido já manda. A fotografia guarda linhas, taxa, total, carteira, data e transação da cotação desse instante.
- Quando: ela abre esse pedido antes do aviso seguinte.
- Então: o modal não aparece. A página, no lugar do modal, mostra `Aguardando confirmação do pedido.`
- Quando: no navegador, cerca de 2 segundos depois do nascimento, chega o aviso com marca maior e estado `confirmado`.
- Então: a frase some. O modal do recibo aparece, com o parágrafo de transação confirmada e com os números da fotografia. O preço que mudou no catálogo depois da criação não entra nesse recibo.

### Cenário 5: Golden Signal #160 nasce pendente e é recusado

- Dado: a pessoa na sessão fecha um carrinho que confere e que tem ao menos uma linha de Golden Signal #160. A chave é nova.
- Quando: ela espera a resposta e abre o pedido.
- Então: a frase é `Aguardando confirmação do pedido.` O modal não aparece.
- Quando: no navegador, cerca de 2 segundos depois, chega o aviso com marca maior e estado `recusado`.
- Então: a frase passa a `Pedido recusado.` O modal não aparece. O parágrafo de transação confirmada não aparece. A fotografia gravada na criação permanece na loja, com o estado `recusado`.

### Cenário 6: Confirmado e recusado não voltam atrás

- Dado: o pedido do cenário 4 está `confirmado`.
- Quando: chega outro aviso para esse pedido, com marca maior, seja `confirmado`, `recusado` ou `pendente`.
- Então: o modal continua. A fotografia não muda.
- Dado: o pedido do cenário 5 está `recusado`.
- Quando: chega aviso com marca maior e estado `confirmado`.
- Então: a frase continua `Pedido recusado.` O modal não aparece.

### Cenário 7: A mesma chave devolve o estado em que o pedido estiver

- Dado: a chave da Ada já gravou o pedido do cenário 4, ainda `pendente`, ou já `confirmado`.
- Quando: ela pede de novo o fecho com a mesma chave e as mesmas linhas, e espera.
- Então: a resposta é esse mesmo pedido, no estado em que ele estiver nesse instante. Não nasce outro. O preço não é recalculado. O carrinho não é esvaziado de novo.
- Quando: ela usa a mesma chave com linhas diferentes.
- Então: a loja recusa com `Esta chave já fechou outro pedido.` O pedido gravado continua.

### Cenário 8: O aviso de pedido não atravessa de uma pessoa para outra

- Dado: Ada e Bruno estão em sessões separadas. Ada tem um pedido `pendente` aberto na leitura dela.
- Quando: o pedido da Ada passa a `confirmado`.
- Então: a tela da Ada troca a frase pelo recibo. A tela do Bruno não recebe esse aviso. Se Bruno abre o pedido da Ada, continua `Pedido não encontrado.`
- Quando: Bruno está na sessão e o preço de Neon Vessel #552 é aceito.
- Então: Bruno vê o preço novo, porque o preço é público. O pedido da Ada não entra na leitura dele.

### Cenário 9: Sair corta o pedido e o preço continua

- Dado: Ada está na sessão, com um pedido `pendente` em leitura, e o catálogo em leitura.
- Quando: ela aciona `Sair`.
- Então: a sessão acaba. A escuta do pedido dela acaba. A leitura privada, inclusive esse pedido, sai. O catálogo permanece. A escuta do preço permanece.
- Quando: o pedido que era dela muda de estado, e em seguida o preço de Neon Vessel #552 muda.
- Então: a aba, agora de visitante, não mostra o recibo dela. O preço novo aparece na grade, se o catálogo continuar em leitura.

### Cenário 10: Sem simulação o aviso não liga

- Dado: a simulação está desligada.
- Quando: a pessoa abre o início, o detalhe, o carrinho ou um pedido.
- Então: não há escuta de preço nem de pedido. A frase de falha continua `Não foi possível carregar o catálogo.`, `Não foi possível carregar a peça.` ou `Não foi possível carregar o pedido.`, conforme a tela. Não nasce frase nova de falha do aviso.

### Cenário 11: A confirmação ouve o estado mesmo sem cabeçalho

- Dado: Ada acabou de criar o pedido do cenário 4 e o endereço já é `/pedidos/` desse pedido. A página está sem cabeçalho e sem barra inferior, como a confirmação já é.
- Quando: o aviso de `confirmado` chega com marca maior, e o pedido já está na leitura dela.
- Então: a frase de espera some e o recibo aparece nessa mesma página.
- Dado: o aviso chega para um pedido que ainda não está na leitura dela.
- Quando: a tela ainda não guardou esse pedido.
- Então: o aviso não busca o pedido. A resposta do fecho, quando chegar, traz o estado guardado naquele instante.

### Cenário 12: A semente não entra no relógio

- Dado: a loja está na semente e ninguém criou pedido depois dela.
- Quando: passam 3 segundos no navegador, e também os 2 segundos do pedido.
- Então: `ped-ada-1` e `ped-bruno-1` continuam `confirmado`, com os mesmos totais. Nenhuma outra peça além de Neon Vessel #552 muda de preço. Emerald Ape #042 continua `1.19`.

### Cenário 13: A prova automática não espera o relógio

- Dado: a prova roda em Node, com a simulação da loja.
- Quando: ela publica na hora um preço com marca maior, um preço com marca menor, um estado terminal com marca maior, um aviso de pedido de outra pessoa, e uma mudança de preço depois do recibo gravado.
- Então: a marca maior muda o preço aceito. A marca menor não muda. `confirmado` e `recusado` ignoram o aviso seguinte. O aviso da Ada não altera a leitura do Bruno. O recibo gravado conserva linhas, taxa, total, carteira, data e transação. Nenhum intervalo de 3 segundos nem de 2 segundos é armado nessa prova.

### Cenário 14: O recomeço devolve a semente e não avisa

- Dado: Neon Vessel #552 já foi aceito com marca maior que 1, e existem pedidos criados depois da semente.
- Quando: a loja recomeça.
- Então: a loja volta o preço, o estado e a marca de ordem à semente, sem enviar aviso. `ped-ada-1` e `ped-bruno-1` voltam `confirmado`. Os pedidos criados depois somem. A sessão acaba, como o recomeço já acaba. As chaves de fecho criadas depois somem, como a spec do pedido já manda.
- Dado: uma aba já aceitou uma marca maior do que a da semente.
- Quando: o recomeço não envia aviso.
- Então: essa aba pode continuar com o preço da marca maior até chegar um aviso com marca acima da que ela guarda. Isso fica registrado como risco, não como bloco novo de tela.

### Cenário 15: Visitante vê o preço e não escuta pedido

- Dado: não há sessão e o catálogo está em leitura.
- Quando: o preço de Neon Vessel #552 é aceito.
- Então: a grade mostra o preço novo. Não há escuta de pedido. Abrir `/pedidos/ped-ada-1` continua levando à entrada, como a guarda já faz.

## 6. Regras de negócio

- Regra 1: há dois avisos. O de preço é público e traz a peça, o preço em string decimal e a marca de ordem inteira. O de pedido é da pessoa e traz o pedido, o estado `confirmado` ou `recusado`, e a marca de ordem inteira. A pessoa entra só na escuta dos próprios pedidos. O aviso de outra pessoa não chega nessa escuta.
- Regra 2: a marca de ordem fica ao lado da peça e ao lado do pedido. A semente começa em 1. Marca igual ou menor deixa preço e estado como estão.
- Regra 3: `confirmado` e `recusado` são terminais. Qualquer aviso posterior, mesmo com marca maior, é ignorado. `pendente` aceita marca maior.
- Regra 4: o preço aceito atualiza a peça na loja e nas leituras do catálogo e dessa peça. Se o carrinho da sessão, ou o rascunho do visitante, tem a peça, a cotação é lida de novo. Sem a peça em leitura, não há leitura extra. Nome, imagem, quantidade e preço de comparação não mudam com o preço.
- Regra 5: o estado aceito só altera a leitura daquele pedido se ela já existir para aquela pessoa. Sem essa leitura, o aviso não busca o pedido.
- Regra 6: pedido novo nasce `pendente`, marca 1. A pessoa espera a resposta. Não há pedido otimista. A mesma chave, da mesma pessoa, com as mesmas linhas, devolve o pedido guardado, no estado em que ele estiver. Corpo diferente conflita. A semente da Ada e do Bruno continua `confirmado` e não entra no relógio.
- Regra 7: a fotografia continua na criação: linhas, taxa, total, carteira, data e transação. O preço que muda depois não altera o recibo. O total de fechar continua saindo da cotação. A tela não soma ETH.
- Regra 8: o modal da confirmação, inclusive o parágrafo de transação confirmada, só aparece em `confirmado`. `pendente` mostra `Aguardando confirmação do pedido.` `recusado` mostra `Pedido recusado.` As duas frases ficam no lugar de `Pedido não encontrado.` e não desenham estado dentro do modal. `Carregando`, `Pedido não encontrado.` e `Não foi possível carregar o pedido.` continuam as frases já fechadas da leitura.
- Regra 9: a escuta do pedido existe só com sessão, inclusive na confirmação sem cabeçalho. Sair deixa essa escuta, apaga a leitura privada e mantém o catálogo e a escuta de preço. Sem simulação, nenhuma das duas escutas liga. A frase de falha continua a do carregamento que já existe.
- Regra 10: o relógio fica só no worker do navegador, com a simulação ligada. A cada 3 segundos, Neon Vessel #552 alterna `1.99` e `2.09`, com a marca seguinte, e a comparação permanece `2.29`. Pedido novo `pendente` recebe, cerca de 2 segundos depois, `recusado` se alguma linha for Golden Signal #160, e `confirmado` nos outros casos. A prova em Node publica o aviso na hora e não arma intervalo.
- Regra 11: o recomeço devolve preço, estado e marca de ordem à semente e não envia aviso. Quem já guardou marca maior pode manter o preço anterior até um aviso com marca acima dessa.
- Regra 12: o estado do pedido passa a ser `pendente`, `confirmado` ou `recusado`. As provas que hoje exigem pedido novo já `confirmado` passam a acompanhar este nascimento. Os números da semente da Ada e do Bruno permanecem.
- Regra 13: transporte do aviso só por websocket. Dependências pedidas, depois desta spec aprovada: `socket.io-client` e `@mswjs/socket.io-binding`. Nenhuma outra. Componente e gancho não importam o atendimento da simulação.
- Regra 14: a tela de pagamento, o perfil, a carteira, o favorito e o preço de comparação ficam como estão. `compareAt` de Neon Vessel #552 permanece `2.29` enquanto o preço alterna.

## 7. Critérios de Done desta feature

- [ ] A tela segue a seção 2: sem bloco novo, recibo só em `confirmado`, e as duas frases no lugar da ausência
- [ ] Os cenários acima passam
- [ ] A prova automática cobre marca velha, estado terminal, isolamento por pessoa, recibo intacto e pedido novo que nasce `pendente`, sem armar o relógio
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, com a simulação ligada: Neon Vessel #552 alterna na grade, no detalhe e na cotação de um carrinho que o tenha. O recibo da Ada não muda. Um pedido novo mostra a frase e depois o recibo, ou `Pedido recusado.` quando a linha é Golden Signal #160. Sair corta o estado do pedido e o próximo preço continua
- [ ] Com a simulação desligada, a escuta não abre
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] O diff de `src/lib/socket/**`, `src/lib/contracts/order.ts`, `src/mocks/**`, `src/features/order/**` e o trecho de `src/features/session/**` que larga a escuta fica para review humano
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia. Não marcar Done de feature no commit desta spec.

## 8. Escopo de arquivos permitido

- Pode criar ou editar:
  - `package.json` e `pnpm-lock.yaml`, só para `socket.io-client` e `@mswjs/socket.io-binding`
  - `src/lib/socket/`
  - `src/lib/contracts/order.ts`, para o estado aceitar `pendente` e `recusado`
  - `src/lib/query/nfts.ts`, `src/lib/query/cart.ts` e `src/lib/query/order.ts`, só o bastante para a leitura aplicar o aviso
  - `src/features/order/order-page.tsx`
  - `src/features/session/use-end-session.ts`, só para largar a escuta do pedido ao sair
  - `src/components/layout/app-shell.tsx`, só para chamar o gancho em todo caminho, inclusive na confirmação
  - `src/main.tsx`, só para não ligar a escuta com a simulação desligada
  - `src/mocks/browser.ts`
  - `src/mocks/store.ts`
  - `src/mocks/order-store.ts`
  - `src/mocks/live-socket.ts`
  - `src/mocks/handlers.test.ts` e as provas de fecho que hoje exigem pedido novo já `confirmado`
- Pode editar só se o cliente ao vivo precisar de um ponto único, com o diff no review humano:
  - `src/lib/api/**`
- Não pode editar sem pedido:
  - `src/lib/contracts/nft.ts`
  - `src/lib/money.ts`
  - `src/features/order/order-receipt.tsx`
  - `src/features/catalog/**`
  - `src/features/detail/**`
  - `src/features/cart/**`
  - `src/routes/pagamento.tsx`
  - `src/features/checkout/**`
  - `src/styles/tokens.css`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

`src/lib/socket/**`, `src/lib/contracts/order.ts`, `src/mocks/**`, `src/features/order/**` e o trecho de saída em `src/features/session/**` são path crítico. Entram só com esta spec aprovada e com review humano do diff. Não há chave de idempotência nova.

## 9. Riscos e dúvidas abertas

A seção Decisão do plano está em branco. Nenhum achado de revisão entrou nem saiu. Aprovar esta spec adota o corpo do plano e as regras da seção 6.

- O pedido novo deixa de nascer `confirmado`. As provas da fase do recibo que leem esse nascimento precisam acompanhar. A semente da Ada e do Bruno permanece `confirmado`, com os mesmos totais.
- Golden Signal #160 como gatilho de `recusado` não está no desenho. Se a aprovação recusar esse gatilho, o navegador só emite `confirmado` e `recusado` fica coberto na prova em Node.
- O recomeço não avisa. Quem já aceitou uma marca maior pode ignorar o preço da semente até chegar uma marca acima da que a leitura guarda.
- A ida e volta do fio no servidor de teste em Node pode não falar. A regra fica provada na loja e na leitura. A ida e volta no navegador fica na homologação.
- A confirmação hoje aparece sem o cabeçalho. A escuta precisa valer nesse caminho, senão o recibo não ouve o estado. O cenário 11 cobre isso.
- O relógio de 3 segundos mexe no preço visível das fases anteriores enquanto a simulação está ligada. É o comportamento desta fatia.
- O plano do catálogo, citado como contrato de início e detalhe, não cola o arranjo do Sonnet. Esta spec não redesenha essas telas. Se a aprovação exigir esse texto dentro desta spec, a leitura pede o contrato já gravado, sem segunda leitura dos PNG.

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:

## 11. Passos de implementação

Executar do passo 1 ao passo 16, nessa ordem. Não começar o passo seguinte com o anterior incompleto. Não editar este arquivo durante a implementação. Não editar as seções 1 a 10. Não redesenhar tela. Não criar bloco, cópia ou composição fora das duas frases da seção 2.

Nomes fechados, para não inventar outros:

| Nome | Valor |
| --- | --- |
| Peça do relógio | `neon-vessel-552` |
| Preços do relógio | `1.99` e `2.09` |
| Comparação que não muda | `2.29` |
| Peça que recusa | `golden-signal-160` |
| Evento público | `preco` |
| Evento da pessoa | `pedido` |
| Entrar na escuta da pessoa | `entrar` |
| Largar a escuta da pessoa | `sair` |
| Frase pendente | `Aguardando confirmação do pedido.` |
| Frase recusada | `Pedido recusado.` |

A marca de ordem do plano é o campo `version` no fio e nos mapas da loja. Ela não entra no objeto `Nft`, nem no JSON de `GET /api/nfts`, nem no objeto `OrderReceipt`.

### Passo 1. Instalar só as duas dependências

Arquivo: `package.json` e `pnpm-lock.yaml`.

O binding publicado `@mswjs/socket.io-binding@0.2.0` declara peer `msw` 2. Este repo está em `msw@3.0.8`. Não rebaixar o `msw`. Não instalar `socket.io` de servidor. Não instalar outra dependência.

Antes do install, acrescentar em `package.json`, sem mexer no bloco `msw` que já existe:

```json
"pnpm": {
  "peerDependencyRules": {
    "allowedVersions": {
      "@mswjs/socket.io-binding>msw": "3"
    }
  }
}
```

Depois, na raiz do repo:

```bash
pnpm add socket.io-client @mswjs/socket.io-binding
```

As duas entram em `dependencies`, porque `src/lib/socket/` e `src/mocks/` importam em runtime. Não colocar nenhuma das duas só em `devDependencies`.

Pronto quando: `package.json` lista as duas, o lockfile mudou, e nenhuma outra dependência entrou.

### Passo 2. Abrir o estado do pedido no contrato

Arquivo: `src/lib/contracts/order.ts`. Só este arquivo neste passo.

Trocar `status: 'confirmado'` por um status que aceite os três:

```ts
export type OrderStatus = 'pendente' | 'confirmado' | 'recusado'
```

Em `OrderReceipt`, o campo fica `status: OrderStatus`. Não adicionar `version` em `OrderReceipt`, nem em `OrderLine`.

Em `orderMessages`, acrescentar duas chaves e não alterar as que já existem:

```ts
awaiting: 'Aguardando confirmação do pedido.',
refused: 'Pedido recusado.',
```

Não editar `src/lib/contracts/nft.ts`. Não editar `src/lib/api/order.ts`: `knownMessages` já lê `Object.values(orderMessages)`.

A semente em `src/mocks/fixtures/users.ts` continua com `status: 'confirmado'`. Não editar esse arquivo.

Pronto quando: o tipo compila com `pendente`, `confirmado` e `recusado`, e o recibo ainda não tem marca de ordem.

### Passo 3. Guardar a marca ao lado da peça e do pedido

Arquivo: `src/mocks/store.ts`. Só este arquivo neste passo.

Em `LiveStore`, acrescentar dois mapas:

```ts
nftVersions: Record<string, number>
orderVersions: Record<string, number>
```

No `seed`, a marca de cada peça de `catalogSeed` nasce `1`. A marca de `ped-ada-1` e de `ped-bruno-1` nasce `1`. Montar os mapas no seed, não dentro de `Nft` e não dentro de `OrderReceipt`.

`resetStore` já faz `cloneStore(seed)`. Não emitir aviso dentro de `resetStore`. Não agendar `setTimeout` nem `setInterval` neste arquivo.

`readCatalog` e `readNft` continuam devolvendo `Nft` sem marca. `readUsers` continua devolvendo o pedido sem marca.

Pronto quando: um reset devolve preço, status e marca da semente, e `GET /api/nfts` segue igual ao catálogo feliz que `src/mocks/handlers.test.ts` já compara.

### Passo 4. Aceitar ou ignorar o aviso na loja

Criar `src/mocks/live-rules.ts`. Não colocar esta lógica em `store.ts`, para esse arquivo não passar de 300 linhas.

Exportar funções nomeadas. Sem classe. Sem importar `socket.io-client`, sem importar o binding, sem `setInterval`, sem `setTimeout`.

```ts
export function readNftVersion(nftId: string): number
export function readOrderVersion(orderId: string): number
export function acceptNftPrice(nftId: string, price: string, version: number): boolean
export function acceptOrderStatus(userId: string, orderId: string, status: OrderStatus, version: number): boolean
```

`readNftVersion` e `readOrderVersion` leem o mapa. Se a chave não existir, devolvem `1`.

`acceptNftPrice` devolve `false` e não muda nada quando qualquer item abaixo for verdadeiro:

- `version` não é inteiro seguro maior ou igual a `1`
- `price` não é string no formato de decimal com ponto, por exemplo `1.99`
- a peça não existe
- `version` é igual ou menor que a marca atual da peça

Quando devolve `true`, grava só `nft.price` e `nftVersions[nftId]`. Não muda `name`, `image`, `compareAt`, `rare`.

`acceptOrderStatus` devolve `false` e não muda nada quando qualquer item abaixo for verdadeiro:

- `version` não é inteiro seguro maior ou igual a `1`
- `status` não é `pendente`, `confirmado` ou `recusado`
- o pedido não existe nessa pessoa
- o status atual já é `confirmado` ou `recusado`, mesmo com marca maior
- `version` é igual ou menor que a marca atual do pedido

Quando devolve `true`, grava só `order.status` e `orderVersions[orderId]`. Não muda `lines`, `networkFee`, `total`, `wallet`, `date`, `transactionId`.

Usar `withStore` de `src/mocks/store.ts`. Não clonar a loja para escrever: a escrita é no objeto vivo, no mesmo padrão de `updateLiveStore`.

Pronto quando: as quatro funções existem e nenhuma delas arma relógio.

### Passo 5. Pedido novo nasce pendente

Arquivos: `src/mocks/order-store.ts` e `src/mocks/live-clock.ts`.

Em `closeSessionOrder`, no objeto do pedido novo, trocar `status: 'confirmado'` por `status: 'pendente'`. No mesmo `withStore`, gravar `store.orderVersions[order.id] = 1`.

O ramo `if (previous)` não muda de regra: mesma chave, mesma pessoa, mesmas linhas, devolve o pedido já guardado, no status em que ele estiver nesse instante. Não recalcular preço. Não fotografar de novo. Não esvaziar o carrinho de novo. Corpo diferente continua `409` com `Esta chave já fechou outro pedido.`

Criar `src/mocks/live-clock.ts` com quatro funções:

```ts
export function tickNeonPrice(): boolean
export function resolvePendingOrder(userId: string, orderId: string): boolean
export function scheduleOrderResolution(userId: string, orderId: string): void
export function startLiveClock(): void
```

`tickNeonPrice` lê `neon-vessel-552`. Se o preço atual é `1.99`, o próximo é `2.09`. Qualquer outro preço dessa peça volta para `1.99`. A marca enviada é a marca atual mais `1`. Chama `acceptNftPrice`. Não mexe em outra peça. Não mexe em `compareAt`.

`resolvePendingOrder` só age se o pedido dessa pessoa existe e está `pendente`. Se alguma linha tem `nftId === 'golden-signal-160'`, o status novo é `recusado`. Nos outros casos, `confirmado`. A marca enviada é a marca atual mais `1`. Chama `acceptOrderStatus`. Se o pedido da semente está `confirmado`, devolve `false` e não muda o recibo.

`scheduleOrderResolution` e `startLiveClock`, neste passo, retornam imediatamente quando `import.meta.env.MODE === 'test'`. Fora do teste, ainda não ligam o fio: só agendam a função pura.

```ts
export function scheduleOrderResolution(userId: string, orderId: string) {
  if (import.meta.env.MODE === 'test') return
  setTimeout(() => {
    resolvePendingOrder(userId, orderId)
  }, 2000)
}

let clockOn = false

export function startLiveClock() {
  if (import.meta.env.MODE === 'test') return
  if (clockOn) return
  clockOn = true
  setInterval(() => {
    tickNeonPrice()
  }, 3000)
}
```

No fim da criação bem sucedida, dentro do `withStore`, chamar `scheduleOrderResolution(user.id, order.id)`. Não chamar isso no ramo da chave repetida. Não chamar isso para `ped-ada-1` nem `ped-bruno-1`.

Não chamar `startLiveClock` em `order-store.ts`. O passo 15 liga o relógio.

Pronto quando: pedido novo nasce `pendente` com marca `1`, e em teste nenhum dos dois agendamentos chama `setTimeout` ou `setInterval`.

### Passo 6. Tipos do fio, ainda sem conectar

Criar `src/lib/socket/events.ts`. Sem import de `socket.io-client`. Sem import de `src/mocks/`.

```ts
export interface PriceNotice {
  nftId: string
  price: string
  version: number
}

export interface OrderNotice {
  orderId: string
  status: 'pendente' | 'confirmado' | 'recusado'
  version: number
}

export const priceEvent = 'preco'
export const orderEvent = 'pedido'
export const joinEvent = 'entrar'
export const leaveEvent = 'sair'
```

O relógio só publica `confirmado` ou `recusado`. O tipo aceita `pendente` porque a regra 3 ignora um aviso posterior com esse status quando o pedido já é terminal.

Pronto quando: o arquivo só exporta esses tipos e essas quatro strings.

### Passo 7. Aplicar o aviso na leitura, sem buscar de novo

Criar `src/lib/socket/apply-notice.ts`. Este arquivo não importa `src/mocks/handlers.ts`, `src/mocks/browser.ts`, `src/mocks/store.ts`, `src/mocks/live-rules.ts`, `src/mocks/live-clock.ts` nem `src/mocks/live-socket.ts`.

Usar as chaves que já existem:

- catálogo: `catalogQueryKey` em `src/lib/query/nfts.ts`
- peça: `nftQueryKey`
- carrinho e cotação: `cartQueryKey`, `quoteQueryKey`, `invalidateCart` em `src/lib/query/cart.ts`
- pedido: `orderQueryKey` em `src/lib/query/order.ts`
- sessão: `sessionQueryKey` em `src/lib/query/session.ts`

Memória da marca no cliente, fora do JSON:

```ts
const nftVersions = new Map<string, number>()
const orderVersions = new Map<string, number>()
```

Marca ausente no mapa vale `1`, que é a semente.

Exportar:

```ts
export function applyPriceNotice(queryClient: QueryClient, notice: PriceNotice): boolean
export function applyOrderNotice(queryClient: QueryClient, userId: string, notice: OrderNotice): boolean
export function forgetOrderVersions(userId: string): void
```

`applyPriceNotice`:

1. Se `version` não é inteiro seguro maior ou igual a `1`, ou `price` não é decimal com ponto, devolver `false`.
2. Se `version` é igual ou menor que a marca que o mapa guarda para `nftId`, devolver `false`. Não escrever cache.
3. Guardar a marca nova no mapa, mesmo quando a peça não está em cache. Isso impede um aviso atrasado de cobrir um preço que a leitura ainda vai buscar.
4. Se `['nfts']` existe e contém a peça, trocar só `price` nesse item. Manter `name`, `image`, `compareAt`, `rare`.
5. Se `['nfts', nftId]` existe, trocar só `price`.
6. Ler o cache do carrinho do visitante, `cartQueryKey(null)`, e o cache do carrinho da sessão, `cartQueryKey(userId)`, quando `sessionQueryKey` tiver usuário. Só para cada cache que já existe e cuja `lines` contém `nftId`, chamar `invalidateCart(queryClient, userId)`. `userId` é `null` no visitante.
7. Não chamar `fetch`. Não criar chave que não existia. Não somar ETH. Não escrever total na mão.

`applyOrderNotice`:

1. Ler só `orderQueryKey(userId, notice.orderId)`.
2. Se essa chave não tem dado, devolver `false`. Não buscar o pedido.
3. Se o status guardado é `confirmado` ou `recusado`, devolver `false`. Não mudar a fotografia.
4. Se `version` é igual ou menor que a marca do mapa dessa pessoa e desse pedido, devolver `false`.
5. Guardar a marca e fazer `setQueryData` com o mesmo objeto, trocando só `status`. Manter linhas, taxa, total, carteira, data e transação.

`forgetOrderVersions` apaga as chaves desse `userId`. Não apaga marca de peça.

Pronto quando: um aviso de peça ausente no cache não cria query, e um aviso de pedido ausente no cache não cria query.

### Passo 8. Prova automática da loja e da leitura, sem relógio

Criar dois arquivos de teste. Não usar `vi.useFakeTimers`. Não esperar 3 segundos nem 2 segundos. Não chamar `startLiveClock` esperando que ele arme intervalo: em teste ele tem de voltar sem chamar `setInterval`.

`src/mocks/live-rules.test.ts`, com `setupServer(...handlers)` no mesmo padrão de `src/features/order/close-order.test.ts`, e `resetStore()` no `beforeEach`. Cobrir, em testes separados:

1. `tickNeonPrice` uma vez: preço de `neon-vessel-552` fica `2.09`, marca `2`, `compareAt` continua `2.29`, `emerald-ape-042` continua `1.19`.
2. `tickNeonPrice` de novo: preço volta a `1.99`, marca `3`, comparação continua `2.29`.
3. `acceptNftPrice` com marca igual e com marca menor não muda o preço já aceito.
4. `acceptNftPrice` em `ivory-baron-088` não muda o recibo `ped-ada-1`: total `1.79`, taxa `0.00`, linha `ivory-baron-088`.
5. `GET /api/nfts` não tem propriedade `version` em nenhuma peça. `GET /api/pedidos/ped-ada-1`, com a Ada na sessão, não tem propriedade `version`.
6. Fechar o carrinho da Ada (`sage-nomad-009`, quantidade `1`, chave nova) devolve `pendente`. Carrinho dela fica `[]`. `resolvePendingOrder` passa esse pedido a `confirmado`. Linhas, taxa, total, carteira, data e transação ficam os da resposta do fecho. A mesma chave e as mesmas linhas devolvem esse pedido já `confirmado`. O carrinho continua vazio.
7. Carrinho com `golden-signal-160` nasce `pendente`. `resolvePendingOrder` passa a `recusado`. A fotografia não muda. Outro aviso `confirmado` com marca maior não volta para `confirmado`.
8. `resolvePendingOrder('usr-ada', 'ped-ada-1')` devolve `false`. `ped-ada-1` e `ped-bruno-1` continuam `confirmado`, com os totais `1.79` e `0.39`.
9. Aviso de pedido da Ada não altera o pedido do Bruno.
10. Depois de uma marca maior e de um pedido novo, `POST /api/dev/reset` devolve Neon Vessel a `1.99`, as marcas a `1`, apaga o pedido novo e não deixa a sessão. Não afirmar que um evento saiu: `resetStore` não emite.
11. Espionar `setInterval` e `setTimeout`, chamar `startLiveClock()` e `scheduleOrderResolution('usr-ada', 'ped-ada-1')`, e esperar que os dois espiões não tenham sido chamados. Restaurar os espiões no fim do teste.

`src/lib/socket/apply-notice.test.ts`, com `QueryClient`, sem MSW e sem relógio:

1. Catálogo em cache com Neon Vessel `1.99` e `compareAt` `2.29`. Aviso marca `2` e preço `2.09` troca só o preço. Nome e comparação ficam.
2. Aviso seguinte com marca `2` ou marca `1` não muda o preço.
3. Sem `['nfts']` e sem `['nfts', nftId]`, o aviso não cria essas chaves.
4. Carrinho em cache com a peça: `invalidateCart` deixa carrinho e cotação invalidados. Carrinho em cache sem a peça: essas chaves não ficam invalidadas.
5. Pedido da Ada em cache, `pendente`, marca maior `confirmado`: só o status muda. Total antigo permanece.
6. O mesmo pedido já `confirmado`: aviso `recusado` com marca maior não muda o objeto.
7. Pedido do Bruno em outra chave: o aviso aplicado na Ada não muda a chave do Bruno.
8. Chave do pedido ausente: `applyOrderNotice` devolve `false` e não cria a chave.
9. `forgetOrderVersions` não apaga a marca da peça.

Para o item 4, medir `queryClient.getQueryState(chave)?.isInvalidated`. Não somar ETH no teste.

Pronto quando: `pnpm test` desses dois arquivos passa, e nenhum teste novo espera o relógio.

### Passo 9. Acompanhar o nascimento pendente nas provas que já existem

Arquivos: `src/mocks/handlers.test.ts` e `src/features/order/close-order.test.ts`. Só o status do pedido novo.

Em `handlers.test.ts`, no teste que grava o recibo, a resposta do `POST /api/pedidos` da Ada hoje espera `status: 'confirmado'`. Trocar essa espera para `pendente`. Não trocar `ped-ada-1` nem `ped-bruno-1`: eles continuam `confirmado`. Não trocar totais, taxa, linhas, carteira, data, transação, conflito, isolamento nem reset.

Em `close-order.test.ts`, depois do primeiro `closeOrder`, esperar `created.status` igual a `pendente`. O resto do teste continua: a mesma chave devolve o mesmo objeto, e a chave com linhas diferentes rejeita com `Esta chave já fechou outro pedido.`

Pronto quando: os dois arquivos passam e a semente da Ada continua `confirmado`.

### Passo 10. Frases no lugar do modal

Arquivo: `src/features/order/order-page.tsx`. Não editar `src/features/order/order-receipt.tsx`.

`OrderReceiptView` só renderiza quando `order.data.status === 'confirmado'`. `pendente` e `recusado` não renderizam o `<article>`.

`pageMessage` ganha o status. A ordem das frases fica:

1. Sem usuário, ou leitura pendente: `orderMessages.loading` (`Carregando`).
2. Erro: a mensagem de `OrderActionError`, ou `orderMessages.loadFailed`.
3. Status `pendente`: `orderMessages.awaiting`.
4. Status `recusado`: `orderMessages.refused`.
5. Status `confirmado`, ou sem dado: `null`.

O parágrafo continua o mesmo `<p className="m-0 text-[14px] leading-[16px]">`. Não criar selo, película, segundo botão nem rótulo de status.

Em `src/features/order/order-page.test.tsx`, acrescentar dois testes, sem relógio:

1. Ada na sessão, fecho do carrinho dela, abrir `/pedidos/` do id devolvido. O texto contém `Aguardando confirmação do pedido.` Não contém `Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.` O `article` é nulo.
2. No mesmo pedido, `updateLiveStore` grava `status: 'recusado'`. Montar de novo. O texto contém `Pedido recusado.` O `article` é nulo. O parágrafo de transação confirmada não aparece.

O teste que já abre `ped-ada-1` continua vendo o recibo, porque a semente segue `confirmado`.

Pronto quando: a confirmação da Ada seed não muda, e as duas frases aparecem sem modal.

### Passo 11. Cliente do fio, desligado em teste e sem simulação

Criar `src/lib/socket/client.ts` e `src/lib/socket/use-live-notices.ts`.

O gancho pode importar `isMockEnabled` de `src/mocks/config.ts`. Não pode importar handler, store, relógio nem `live-socket`.

`connectLiveSocket`:

- devolve `undefined` se `isMockEnabled()` é falso
- devolve `undefined` se `import.meta.env.MODE === 'test'`
- senão cria um único `io` de `socket.io-client`, com `transports: ['websocket']` e `upgrade: false`
- chamadas seguintes devolvem o mesmo socket
- não chama `io.disconnect` ao sair

`leaveOrderListen(userId: string | undefined)`:

- se não há socket ou não há `userId`, só chama `forgetOrderVersions` quando houver `userId`
- senão emite `sair` com `{ userId }` e remove os listeners de `pedido`
- não remove o listener de `preco`
- não apaga `['nfts']`
- não desconecta o socket

`useLiveNotices`:

- primeiro efeito: se o mock está ligado e o modo não é teste, escuta `preco` e chama `applyPriceNotice`
- a limpeza desse efeito tira só o listener de `preco`
- segundo efeito: se há `userId`, emite `entrar` com `{ userId }`, escuta `pedido` e chama `applyOrderNotice(queryClient, userId, notice)`
- a limpeza desse efeito emite `sair` e tira o listener de `pedido`

Não criar socket dentro do render. Não guardar aviso em estado local do componente.

Pronto quando: em teste e com `VITE_ENABLE_MOCK=false`, `connectLiveSocket` devolve `undefined` e não chama `io`.

### Passo 12. A casca chama o gancho em todo caminho

Arquivo: `src/components/layout/app-shell.tsx`. Uma chamada só.

A primeira linha de `AppShell`, antes de `useRouterState` e antes de qualquer `return`, é `useLiveNotices()`. O retorno cedo de `/pedidos/` e o retorno cedo de `/entrar` e `/cadastro` continuam iguais. Não desenhar cabeçalho na confirmação. Não desenhar barra inferior na confirmação.

Pronto quando: o gancho roda na confirmação, e `src/components/layout/app-shell.test.tsx` continua sem cabeçalho em `/pedidos/ped-ada-1`.

### Passo 13. Sair larga a escuta do pedido

Arquivo: `src/features/session/use-end-session.ts`.

No `finally`, antes de `clearSessionCache`, chamar `leaveOrderListen(current?.id)`. Não remover o catálogo. Não desconectar o preço. O resto da função permanece: sessão nula, cache privado limpo, carrinho e cotação de visitante removidos, navegação só em caminho privado.

Pronto quando: sair ainda limpa a leitura privada e a chamada nova não exige socket em teste.

### Passo 14. O mock fala com quem entrou, e o relógio só fora do teste

Criar `src/mocks/live-socket.ts`. Registrar o handler no array `handlers` de `src/mocks/handlers.ts`, no fim do array. `src/mocks/browser.ts` continua com `setupWorker(...handlers)`. Não passar um handler a mais fora do array: `handlers.test.ts` compara `workerState.handlers.length` com `handlers.length`.

O pacote instalado exporta `toSocketIo`, não sala. Não chamar `join`. Não usar namespace customizado. A pessoa fica num `Map` deste arquivo.

```ts
import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'

export const liveSocketHandler = ws.link('*/socket.io/*').addEventListener('connection', (connection) => {
  const io = toSocketIo(connection)
  // guardar io e o userId desta conexão
})
```

Contrato deste arquivo:

- `entrar` com `{ userId: string }` grava o id dessa conexão
- `sair` apaga o id dessa conexão
- `emitPrice(notice)` envia `preco` para toda conexão guardada
- `emitOrder(userId, notice)` envia `pedido` só para a conexão com esse `userId`
- ao fechar a conexão, tirar ela do mapa. Usar `close` em `io.rawClient`, se existir. Se o tipo não tiver `rawClient`, usar o evento de fechamento que o objeto de `toSocketIo` realmente expõe. Não deixar a conexão no mapa para sempre.

O listener de `io.client.on`, no `.d.ts` de `0.2.0`, é `(event, ...data) => void`. O comentário desse arquivo omite o `MessageEvent`. Ler o corpo assim: se o primeiro argumento já tem `userId` string, usar ele; senão usar o segundo. Não inventar um terceiro formato.

Ligar a loja ao fio em `src/mocks/live-clock.ts`:

- `tickNeonPrice`, quando `acceptNftPrice` devolve `true`, chama `emitPrice`
- `resolvePendingOrder`, quando `acceptOrderStatus` devolve `true`, chama `emitOrder`
- se a aceitação devolve `false`, não emitir

Não importar `live-socket.ts` em `src/lib/socket/`. Componente e gancho não importam este arquivo.

Se `toSocketIo(connection)` não passar no `pnpm typecheck` porque o argumento de `connection` do MSW 3 não é o `WebSocketHandlerConnection` que o binding declara, pare este passo e reporte o erro. Não usar `any`. Não rebaixar o `msw`. Não trocar o binding por outro pacote. Os passos 1 a 13 e as provas do passo 8 continuam válidos sem este arquivo ligado ao array, mas não entregue o passo 14 pela metade: o handler só entra em `handlers` quando o typecheck desse arquivo passa.

Pronto quando: o handler está em `handlers`, o typecheck passa, e um aviso de pedido não tem função de sala.

### Passo 15. A simulação desligada não liga escuta nem relógio

Arquivo: `src/main.tsx`. Só dentro de `startMock`.

`startMock` já volta imediatamente quando `isMockEnabled()` é falso. Não chamar socket nem relógio antes desse retorno. Depois de `worker.start`, importar e chamar `startLiveClock`:

```ts
const { worker } = await import('./mocks/browser.ts')
await worker.start({ onUnhandledFrame: 'bypass' })
const { startLiveClock } = await import('./mocks/live-clock.ts')
startLiveClock()
```

Não criar outra condição de ambiente. Não ler `.env`. Não conectar o socket em `main.tsx`: quem conecta é o gancho, e ele já volta cedo sem simulação e em teste.

Pronto quando: com a simulação desligada, `startMock` não importa o relógio, e com ela ligada o relógio só arma fora de `MODE === 'test'`.

### Passo 16. Verificar e parar

Rodar, na raiz:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Não rodar Playwright. Não editar `AGENTS.md`, `src/lib/contracts/nft.ts`, `src/lib/money.ts`, `src/features/order/order-receipt.tsx`, `src/features/catalog/**`, `src/features/detail/**`, `src/features/cart/**`, `src/routes/pagamento.tsx`, `src/features/checkout/**`, `src/styles/tokens.css`, `.env*` nem specs já aprovadas.

Não marcar esta spec como `done` neste passo. O fechamento dos docs vivos (`docs/plans/README.md`, `docs/specs/README.md`, `docs/implementation/`, `docs/manual-dev/`, `docs/state/PENDENCIAS.md`) só vem depois destes três comandos verdes, pela skill `.cursor/skills/close-phase/SKILL.md`.

O diff de `src/lib/socket/**`, `src/lib/contracts/order.ts`, `src/mocks/**`, `src/features/order/**` e o trecho de `src/features/session/use-end-session.ts` fica para review humano.

No navegador, a homologação manual desta fatia é a da seção 7: Neon Vessel alterna na grade, no detalhe e na cotação; o recibo da Ada não muda; o pedido novo mostra a frase e depois o recibo, ou `Pedido recusado.` com Golden Signal #160; sair corta o pedido e o preço seguinte continua; com a simulação desligada a escuta não abre.
