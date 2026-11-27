# Kurio

Marketplace de NFTs. A marca visível é Kurio. É a prova frontend da Jungle: uma SPA que roda inteira no navegador, com dados simulados e sem backend de produção.

Aplicação publicada: [https://junglegaming-nfts.vercel.app/](https://junglegaming-nfts.vercel.app/)

## Acesso rápido para o avaliador

### Contas de teste

| Pessoa | E-mail | Senha |
| --- | --- | --- |
| Ada | `ada@kurio.test` | `kurio` |
| Bruno | `bruno@kurio.test` | `kurio` |

O e-mail não diferencia maiúsculas. A senha é exata. Também dá para criar uma conta nova em `Cadastro`: quem se cadastra já entra na sessão.

### O que cada conta já tem

| | Ada | Bruno |
| --- | --- | --- |
| Favoritos | Emerald Ape #042, Neon Vessel #552 | Golden Beat #207 |
| Carrinho | Sage Nomad #009 (1) | Cosmic Bloom #118 (2) |
| Pedido | `ped-ada-1`: Ivory Baron #088, total `1.79 ETH` | `ped-bruno-1`: Golden Signal #160, total `0.39 ETH` |

As duas contas são isoladas. Na sessão da Ada, `/pedidos/ped-bruno-1` responde `Pedido não encontrado.`

### Como entrar

1. Abra a aplicação.
2. Clique em `Entrar` no topo.
   - Em telas de 1440 px ou mais, abre um painel sobre a página atual (o endereço ganha `?conta=entrar`).
   - Abaixo de 1440 px, inclusive 768 e 390, é uma tela cheia em `/entrar`.
3. Preencha `ada@kurio.test` e `kurio`.

### Pontos de atenção

- **A sessão não sobrevive ao recarregar a página.** O mock vive na memória da aba. F5 devolve a loja à semente e encerra a sessão. É o comportamento esperado, não um erro.
- Para ver os dados da semente de novo sem recarregar, use `POST /api/dev/reset` (responde 204).
- Itens desenhados no Figma e fora do escopo ficam visíveis e **não navegam nem mostram sucesso**: Blog, Criadores, Aprenda, Activity, Watchlist, Offers, Downloads, Support, `Esqueceu a senha?`, `Continuar com Google`, `Continuar com Facebook`, cupom e `Ver no Etherscan`.
- A tela `/pagamento` é uma rota protegida com o título `Revisão e envio`, sem formulário. Não há botão na interface que crie pedido. A criação do pedido (idempotência, recibo, confirmação ao vivo) está implementada e coberta pelos testes, e os pedidos da semente mostram o recibo.

## Roteiro sugerido de avaliação

1. **Catálogo** em `/`: oito peças. Busque `neon` (o termo vai para `?q=neon` na URL). Apague a busca e `q` some. Use a faixa de preço.
2. **Detalhe** em `/nfts/emerald-ape-042`: galeria, ficha, abas e mais da coleção. `COMPRAR` soma a quantidade escolhida e abre `/carrinho`. `/nfts/nao-existe` mostra `NFT não encontrado.`
3. **Preço ao vivo**: a cada 3 s, Neon Vessel #552 alterna entre `1.99` e `2.09` na grade, no detalhe e no carrinho. O preço de comparação `2.29` não muda.
4. **Carrinho de visitante**: inclua uma peça sem entrar. O rascunho persiste nesta aba. Ao entrar como Ada, a mesma peça soma a quantidade.
5. **Sessão e guarda**: sem entrar, abra `/perfil`, `/carteiras`, `/pagamento` ou `/pedidos/ped-ada-1`. A entrada abre e, no sucesso, volta ao caminho pedido. Senha errada mostra `E-mail ou senha não conferem.`
6. **Favoritos**: o coração alterna no card sem abrir a peça. É otimista, com rollback se a chamada falhar.
7. **Recibo**: logada como Ada, abra `/pedidos/ped-ada-1`. O recibo mostra Ivory Baron #088, taxa `0.00 ETH`, total `1.79 ETH`, data `29 Jul, 2026`. O `×` volta ao início.
8. **Perfil e carteira** em `/perfil` e `/carteiras`: edite nome e carteira. Troque a senha e entre de novo com a nova. Alterar a carteira não muda o recibo já gravado.
9. **Isolamento**: Ada e Bruno não enxergam os dados um do outro. Sair limpa o cache privado.
10. **Responsivo**: compare 1440, 768 e 390.

## Como rodar localmente

Requisitos: Node 24 ou superior e pnpm 9.

```bash
pnpm install
pnpm dev
```

Abra o endereço que o Vite mostrar, em geral `http://localhost:5173`.

O mock liga por padrão. Para abrir sem ele (as telas mostram as frases de falha):

```powershell
$env:VITE_ENABLE_MOCK="false"; pnpm dev
```

A mesma chave pode ir num `.env` local, copiado de `.env.example`. O `.env` não entra no Git.

### Outros comandos

```bash
pnpm typecheck     # tsc -b
pnpm lint          # oxlint
pnpm test          # vitest
pnpm build         # build de produção
pnpm preview       # serve a build
pnpm exec playwright install chromium   # uma vez
pnpm playwright    # suíte E2E (precisa do Chromium instalado)
```

A suíte E2E sobe o Vite sozinha, na `5173` com mock e na `5174` sem mock. Detalhes em `e2e/README.md`.

## Sobre o projeto

### Stack

Vite, React 19, TypeScript, TanStack Router (rotas por arquivo), TanStack Query, Axios, Socket.IO no cliente (só websocket), Tailwind 4, componentes no padrão shadcn, MSW com `@mswjs/socket.io-binding`, Playwright. Gerenciador: pnpm.

### Como funciona sem backend

O MSW intercepta as chamadas HTTP no service worker e responde como uma API real. O socket de tempo real também é simulado por `@mswjs/socket.io-binding`. O componente chama hook, o hook usa TanStack Query, a query usa o cliente Axios. Nenhum componente importa handler de mock. Desligar o mock desliga a API inteira.

Rotas:

| Rota | Acesso |
| --- | --- |
| `/` | público |
| `/nfts/$nftId` | público |
| `/carrinho` | público |
| `/entrar`, `/cadastro` | público |
| `/perfil`, `/carteiras`, `/pagamento`, `/pedidos/$pedidoId` | exigem sessão |

### Regras de comportamento

- ETH é string decimal. Quantidade é inteiro. O total de fechar vem da cotação, nunca de soma no cliente.
- Favorito é otimista, com rollback. Pedido espera a simulação.
- A mesma chave de idempotência com o mesmo corpo devolve o mesmo pedido. Corpo diferente conflita.
- O cache privado inclui o usuário. O logout limpa esse cache e a subscription do socket.
- Evento com versão igual ou menor não regride o estado. `confirmado` e `recusado` são terminais.
- O recibo é uma fotografia gravada na criação. Mudar preço ou carteira depois não o altera.

### Tempo real (socket)

- `preco`: público, alterado a cada 3 s só em Neon Vessel #552.
- `pedido`: por pessoa. Um pedido novo nasce `pendente` (`Aguardando confirmação do pedido.`) e, cerca de 2 s depois, vira `confirmado` (modal do recibo) ou `recusado` (`Pedido recusado.`, caso do Golden Signal #160).
- Sair corta a escuta do pedido. O preço público continua.

### Visual

Roboto Mono (400, 500 e 700) como única família, nove cores medidas no Figma, sem `box-shadow`. Os tokens estão em `src/styles/tokens.css`. Layout de referência: desktop 1440 com padding horizontal 120 e mobile no frame de 414 (390 usa essa composição). Os frames do Figma não entram neste repositório.

### Estrutura de pastas

```text
src/routes/            rotas por arquivo (TanStack Router)
src/features/          catálogo, detalhe, carrinho, checkout, pedido, sessão, perfil, carteira
src/lib/contracts/     contratos de dados
src/lib/api/           clientes Axios
src/lib/query/         chaves e cache
src/lib/socket/        socket.io no cliente
src/lib/money.ts       aritmética de ETH em string decimal
src/mocks/             handlers, fixtures e relógio do mock
src/components/        shadcn (ui) e casca (layout)
src/styles/tokens.css  tokens visuais
e2e/                   Playwright (12 fluxos + regressão visual)
docs/                  specs, planos, entregas, manual do desenvolvedor, pendências
```

### Testes

- Unitários e de integração com Vitest.
- E2E com Playwright, cobrindo os 12 fluxos do enunciado e regressão visual em desktop e mobile.
- Evidências dos testes manuais em `docs/evidencias/`.

### Observabilidade

Sentry fica de fora de propósito. Não há `@sentry/*` nem DSN. A limitação está registrada em `ARCHITECTURE.md`.

## Documentação

| Documento | Conteúdo |
| --- | --- |
| `ARCHITECTURE.md` | Stack, mock e paths críticos |
| `AGENTS.md` | Regras do projeto e do fluxo com agentes de IA |
| `docs/specs/` | Uma spec por feature |
| `docs/plans/` | Planos e revisões |
| `docs/implementation/` | O que cada fase entregou |
| `docs/manual-dev/` | Como cada fase funciona e como homologar |
| `docs/state/PENDENCIAS.md` | O que está feito e o que falta homologar |
| `e2e/README.md` | Como rodar o Playwright |

O projeto foi construído com um fluxo AI-native: research, plano, revisão em contexto limpo, spec aprovada e só então implementação. Os documentos acima guardam esse histórico.
