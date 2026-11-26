# Plano: Socket no preço e no estado do pedido

- Status: `aguardando aprovação`
- Data: 2026-11-26
- Slug: `socket-preco-estado-pedido`
- Autonomia: `tight`
- Spec: (preencher depois, em `docs/specs/2026-11-26-socket-preco-estado-pedido.md`)
- Frames: nenhum novo. Preço e recibo já têm contrato nos planos gravados. Esta fatia não pede segunda leitura.

## Plano

Uma fatia só. O preço do catálogo e o estado do pedido passam a andar por websocket. A grade, o detalhe, a linha do carrinho e a cotação acompanham o preço aceito. O recibo continua a fotografia da criação. A tela não ganha bloco novo.

Decisões deste plano:

- A parte de UI é o contrato já gravado. Início e detalhe: `docs/plans/reviews/2026-11-26-catalogo-detalhe-url-plano.md`. Carrinho: `docs/plans/reviews/2026-11-26-carrinho-cotacao-plano.md`. Confirmação: `docs/plans/reviews/2026-11-26-pedido-idempotente-confirmacao-plano.md`, fonte `research/figma/desktop-confirmacao.png`. Não existe frame mobile da confirmação. Este plano não reescreve região, cópia nem bloco.
- O parágrafo `Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.` só aparece com o recibo, e o recibo só aparece quando o estado é `confirmado`. `pendente` e `recusado` não estão no PNG. Entram como frase, no mesmo lugar em que a fase 6 já coloca ausência e falha: `Aguardando confirmação do pedido.` e `Pedido recusado.`
- Dependências pedidas, da stack já fechada: `socket.io-client` e `@mswjs/socket.io-binding`. Transporte só websocket. Nenhuma outra.
- Dois canais. `preco` é público: `nftId`, `price` em string decimal e `version` inteira. `pedido` é da pessoa: `orderId`, `status` (`confirmado` ou `recusado`) e `version` inteira. O cliente entra na sala do próprio usuário. O evento de outra pessoa não chega nessa sala.
- A versão não entra no JSON de `GET /api/nfts` nem no recibo. A loja guarda a versão ao lado da peça e ao lado do pedido. A semente começa em 1. O corpo feliz do catálogo e os pedidos da Ada e do Bruno continuam iguais.
- Versão igual ou menor não muda o preço nem o estado. `confirmado` e `recusado` ignoram qualquer evento, mesmo com versão maior. `compareAt`, nome, imagem e quantidade não mudam com o preço.
- Pedido novo nasce `pendente`, versão 1. A semente continua `confirmado`. A spec da fase 6 não é editada. Esta fatia é quem passa a dizer o nascimento. A mesma chave, da mesma pessoa, com as mesmas linhas, devolve o pedido guardado, já no estado em que ele estiver. Corpo diferente continua conflitando. O cliente espera a resposta. Não há pedido otimista.
- A fotografia continua na criação: linhas, taxa, total, carteira, data e transação. O preço que muda depois não altera o recibo. O total de fechar continua saindo da cotação. A tela não soma ETH.
- Preço aceito atualiza a peça na loja e nas chaves `['nfts']` e `['nfts', nftId]`. Carrinho e cotação que tenham essa peça são relidos. Visitante e sessão. Sem a peça no cache, não há leitura extra.
- A subscription de pedido só existe com sessão. Sair sai da sala, apaga o cache privado e mantém o catálogo e o canal de preço. Sem simulação, o socket não liga. A frase de falha continua sendo a do HTTP.
- O relógio fica só no worker do navegador. O teste em Node não arma intervalo. No navegador, a cada 3 segundos, Neon Vessel #552 alterna `1.99` e `2.09`, com versão seguinte, e `compareAt` permanece `2.29`. Pedido novo `pendente` recebe um evento 2 segundos depois: `recusado` se alguma linha for `golden-signal-160`, `confirmado` nos outros casos. A semente não entra nesse relógio.
- `POST /api/dev/reset` devolve preço, estado e versão à semente e não emite evento.

### Passos

1. Instalar as duas dependências depois da spec aprovada. Subir o cliente em `src/lib/socket/`, só websocket, sem importar handler de mock. A casca chama o gancho em todo caminho, inclusive na confirmação, que hoje retorna antes do cabeçalho.
2. A loja passa a aplicar preço e estado pela regra da versão. Pedido novo nasce `pendente`. Reset devolve a semente. O worker do navegador emite o relógio. O teste em Node publica o evento na hora e prova versão velha, estado terminal, isolamento e recibo intacto.
3. O cliente aplica o evento no cache. Preço aceito relê carrinho e cotação. Estado aceito só mexe na chave `['usuario', userId, 'pedido', orderId]` se esse pedido já estiver no cache. Sair larga a sala do pedido.
4. A confirmação pinta o recibo já contratado só em `confirmado`. `pendente` e `recusado` mostram a frase e não mostram o modal. Grade, detalhe e carrinho não trocam composição: o número do preço é o que muda.
5. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, com a simulação ligada: o preço de Neon Vessel #552 alterna na grade, no detalhe e na cotação de um carrinho que o tenha; o recibo da Ada não muda; um pedido novo mostra a frase e depois o recibo, ou `Pedido recusado.` quando a linha é Golden Signal #160. Sair corta o estado do pedido e o próximo preço continua. Com a simulação desligada, o socket não abre.

### Arquivos

- Criar ou alterar:
  - `package.json`, `pnpm-lock.yaml`
  - `src/lib/socket/`
  - `src/lib/contracts/order.ts` (o estado passa a aceitar `pendente`)
  - `src/lib/query/nfts.ts`, `src/lib/query/cart.ts`, `src/lib/query/order.ts`, só o bastante para o cache aplicar o evento
  - `src/features/order/order-page.tsx`
  - `src/features/session/use-end-session.ts`, só para largar a sala ao sair
  - `src/components/layout/app-shell.tsx`, só para chamar o gancho
  - `src/main.tsx`, só para não ligar o socket com a simulação desligada
  - `src/mocks/browser.ts`
  - `src/mocks/store.ts`
  - `src/mocks/order-store.ts`
  - `src/mocks/live-socket.ts`
  - `src/mocks/handlers.test.ts` e os testes de fecho que hoje exigem pedido novo já `confirmado`
- Não mexer:
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

### Fora de escopo

- Bloco, cópia ou composição novos no início, no detalhe, no carrinho e na confirmação.
- Estado de carregamento, erro, película, segundo botão ou rótulo de status desenhado. O PNG não traz.
- Frame mobile da confirmação.
- `compareAt`, favorito, cupom, carteira, perfil e a tela de pagamento.
- Versão no corpo de `GET /api/nfts` ou no JSON do recibo.
- Pedido otimista e soma de ETH na tela.
- Socket com a simulação desligada, e frase nova para falha de socket.
- Relógio dentro do teste em Node.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- O pedido novo deixa de nascer `confirmado`. Os testes da fase 6 que leem esse nascimento precisam acompanhar. A semente da Ada e do Bruno permanece `confirmado`, com os mesmos totais.
- `golden-signal-160` como gatilho de `recusado` não está no desenho. Se for recusado na aprovação, o navegador só emite `confirmado` e `recusado` fica coberto no teste em Node.
- O recomeço não emite. Quem já aplicou uma versão maior pode ignorar o preço da semente até chegar uma versão acima da que o cache guarda.
- `@mswjs/socket.io-binding` pode não falar no servidor de teste em Node. A regra fica provada na loja e no cache. A ida e volta do fio fica na homologação do navegador.
- A confirmação hoje retorna cedo, sem cabeçalho. O gancho precisa ser chamado antes desse retorno, senão o recibo não ouve o estado.
- O relógio de 3 segundos mexe no preço visível das fases anteriores enquanto a simulação está ligada. É o comportamento desta fatia.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/lib/socket/**`, `src/lib/contracts/order.ts`, `src/lib/api/**` se o cliente de socket precisar de um ponto único, `src/mocks/**`, `src/features/order/**` e `src/features/session/**` só ao largar a sala. Evento com versão e isolamento por pessoa. Não há chave de idempotência nova.

## Contrato de UI

Não há PNG desta fatia. O contrato que vale é o já colado nos três planos citados acima. O que esta fatia acrescenta fora do desenho são as duas frases de estado, no mesmo padrão da frase `Pedido não encontrado.`

## Decisão

Preenchida depois da triagem dos achados. Até lá, deixe em branco.

- Entrou:
- Saiu:
