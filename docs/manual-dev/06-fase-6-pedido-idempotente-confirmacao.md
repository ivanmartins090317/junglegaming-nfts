# Fase 6 · Pedido idempotente, confirmação e recibo

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-pedido-idempotente-confirmacao.md` |

## O que esta fase entrega

- `/pedidos/$pedidoId` continua com a guarda. Sem sessão, abre a entrada e volta ao pedido depois do sucesso.
- Com sessão, a página é fundo `ink`, sem cabeçalho e sem barra inferior. As outras rotas conservam a casca.
- Abaixo de 1440, inclusive 768 e 390, a página é uma coluna com padding horizontal 28. O modal tem no máximo 358 px e encolhe até a coluna. Os blocos ficam na mesma ordem.
- O recibo é a fotografia da criação: nome, imagem, identificador da peça, quantidade, total da linha, taxa, total, carteira `MetaMask`, data `29 Jul, 2026` e identificador da transação. A tela não soma ETH.
- A mesma chave, da mesma pessoa, com as mesmas linhas, devolve o mesmo pedido, mesmo com o carrinho já vazio. Linhas diferentes conflitam. A chave de outra pessoa é outra chave.
- `Conectar e finalizar` continua indo para `/pagamento` e não cria pedido.

Não entrega: pagamento, socket, pedido `recusado`, conexão de carteira e destino real do Etherscan.

---

## Arquitetura da feature

```text
src/lib/contracts/order.ts            # recibo, frases, data e carteira
src/lib/api/order.ts                  # leitura e fecho
src/lib/query/order.ts                # chave da leitura, com a pessoa
src/features/order/                   # modal da confirmação
src/mocks/order-store.ts              # fotografia, chave e isolamento
```

A tela não chama o cliente HTTP. O componente pede o cache. O componente e o gancho não importam o atendimento da simulação.

A sessão continua só na loja viva. Recarregar a página faz a loja nascer de novo na semente, sem sessão.

### Recibo

1. A semente da Ada é `ped-ada-1`: Ivory Baron #088, quantidade 1, taxa `0.00`, total `1.79`, transação `0xADA1…A1E1`.
2. A semente do Bruno é `ped-bruno-1`: Golden Signal #160, quantidade 1, taxa `0.00`, total `0.39`, transação `0xB200…B2E2`.
3. Um fecho novo fotografa a cotação já fechada do carrinho. Com linha, a taxa é `0.016`. Sage Nomad #009 na quantidade 1 vira total da linha `1.69` e total `1.706`.
4. Mudar o preço ou o nome no catálogo depois não altera o recibo já gravado.
5. O identificador visível mostra 6 caracteres, a reticência `…` e os 4 últimos. Não há cópia.

### Fecho

O corpo são as linhas: identificador da peça e quantidade, na mesma ordem do carrinho. O total enviado é ignorado. A primeira criação com sucesso esvazia o carrinho dessa pessoa. Falha não grava a chave. Carrinho vazio, com chave nova, responde `O carrinho está vazio.` Linhas que não conferem respondem `O carrinho não confere com o pedido.`

Não há botão de fechar o carrinho nesta fatia. A prova está na loja e no cliente.

### Confirmação

As frases no lugar do modal são `Carregando`, `Pedido não encontrado.` e `Não foi possível carregar o pedido.` O `×` vai para `/`. O fundo `ink` não fecha. `Ver no Etherscan` fica visível e não navega.

## Como rodar

```bash
pnpm install
pnpm dev
```

Entre como Ada (`ada@kurio.test` / `kurio`) a partir de `/pedidos/ped-ada-1`. O retorno da entrada volta a esse pedido.

Para recomeçar a loja simulada, o recomeço que já existe devolve os dois pedidos da semente e apaga as chaves criadas depois. Recarregar o navegador também nasce a semente, porque a loja vive na memória da página.

## Como homologar

1. Sem sessão, abra `/pedidos/ped-ada-1`. A entrada abre. Depois do sucesso, o endereço volta ao pedido.
2. Em 1440, confira o modal centrado, sem cabeçalho: título, `THANK` / `YOU`, faixa, uma linha do Ivory Baron, taxa `0.00 ETH`, total `1.79 ETH` e o parágrafo.
3. Acione `Ver no Etherscan`. O endereço não muda e não aparece sucesso.
4. Acione o `×`. O endereço vai para `/` e o cabeçalho volta. Abrir o pedido de novo mostra o mesmo recibo.
5. Em 390, a coluna tem padding 28, sem barra inferior, e o modal cabe na largura. Os quatro metadados continuam na mesma linha.
6. Na sessão da Ada, abra `/pedidos/ped-bruno-1`. A frase é `Pedido não encontrado.` Golden Signal não aparece.
7. Em `/`, `/carrinho` e `/perfil`, o cabeçalho continua. Em `/carrinho` abaixo de 1440, a barra inferior continua oculta.

## O que esta fase não faz

- Não cria pedido pelo botão `Conectar e finalizar`.
- Não liga socket nem muda o pedido para `recusado`.
- Não conecta carteira e não abre o Etherscan.
