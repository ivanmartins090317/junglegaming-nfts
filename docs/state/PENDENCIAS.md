# Pendências · Kurio

Fonte viva do que ainda falta implementar ou validar. Atualizar ao concluir cada fase.

Última revisão: 2026-11-26

## Fase 1 · Homologação

Código entregue em `docs/implementation/F1-tokens-casca-rotas.md`. Homologação manual pendente:

- [ ] Casca do início, telas nomeadas e endereço desconhecido
- [ ] Início desktop (1440) e mobile (390) contra os frames do Figma
- [ ] Navegação do topo e larguras 1440, 768 e 390. A busca sem efeito era desta fase; a fase 3 passou a gravar `q`
- [ ] Simulação ligada, desligada e falha ao subir

## Fase 2 · Homologação

Código entregue em `docs/implementation/F2-msw-usuarios-reset-catalogo.md`. Homologação manual pendente. A fase 3 substituiu a lista estática e o miolo vazio do detalhe.

- [ ] `GET /api/nfts` devolve as oito peças na ordem da semente
- [ ] `GET /api/nfts/neon-vessel-552` devolve a peça rara e um identificador ausente responde 404
- [ ] `POST /api/dev/reset` responde 204 e a loja volta à semente

## Fase 3 · Homologação

Código entregue em `docs/implementation/F3-catalogo-detalhe-url.md`. Homologação manual pendente:

- [ ] `/` mostra as oito peças da loja, nesta ordem, com hero, oferta, artigos e rodapé
- [ ] `/?q=neon` e `/?q=NEON` deixam só Neon Vessel #552. `/?q=nomad`, `/?q=552` e `/?q=inexistente` esvaziam a grade com `Nenhuma peça com esse nome.`
- [ ] Apagar a busca tira `q` do endereço e devolve as oito peças
- [ ] Aba, coleção, rede, faixa de preço, ordenação e página não mudam a lista nem o endereço
- [ ] O card abre `/nfts/neon-vessel-552` e preserva `q`. O coração alterna no card e não abre a peça
- [ ] O detalhe mostra imagem, nome, `1.99`, `2.29` e `RARO`. `/nfts/nao-existe` mostra `NFT não encontrado.`
- [ ] Voltar da peça com `q` reabre a grade recortada. Sem `q`, reabre `/`
- [ ] No desktop, com `q`, o campo já está aberto. Sem `q`, a lupa abre o campo. No mobile, `Explorar coleções` grava `q`
- [ ] Buscar a partir do carrinho cria uma entrada nova. O voltar do navegador reabre o carrinho
- [ ] Com a simulação desligada, a grade e o detalhe mostram a frase de falha e o restante do início continua

## Fase 4 · Homologação

Código entregue em `docs/implementation/F4-sessao-login-cadastro-guarda.md`. Homologação manual pendente:

- [ ] No desktop (1440), Entrar abre o painel sobre a página atual, com `conta=entrar`, sem película escura. A aba, o X e Esc trocam ou fecham o painel
- [ ] `/entrar` e `/cadastro` no desktop viram `/?conta=entrar` e `/?conta=cadastro`, com o início atrás do painel
- [ ] Abaixo de 1440, inclusive 390, `/entrar` e `/cadastro` são telas cheias, sem cabeçalho, sem mercado e sem o raio 40 do frame
- [ ] Ada entra com `ada@kurio.test` e `kurio`. Senha errada mostra `E-mail ou senha não conferem.`
- [ ] Cadastro de um e-mail novo abre a sessão. E-mail já usado, senhas diferentes e nome vazio mostram as frases da spec e não entram na conta da Ada
- [ ] Sem sessão, `/perfil`, `/carteiras`, `/pagamento` e `/pedidos/ped-9` abrem a entrada e voltam ao caminho válido depois do sucesso
- [ ] `retorno` externo, `//` ou a própria entrada caem em `/`. Sem `retorno`, o desktop fica na página de trás e o mobile vai para `/`
- [ ] Sair no topo e em `/perfil` encerra a sessão. A página privada reabre a entrada. Recarregar a página também perde a sessão, porque a loja viva nasce de novo
- [ ] Esqueceu a senha, Google e Facebook continuam visíveis e o clique não navega
- [ ] Com a simulação desligada, a guarda não abre a página privada e o formulário mostra `Não foi possível carregar a sessão.`

## Fase 5 · Homologação

Código entregue em `docs/implementation/F5-carrinho-cotacao.md`. Homologação manual pendente:

- [ ] Visitante inclui uma peça, vê o selo e a cotação, e o recarregar mantém o rascunho desta aba
- [ ] Ada entra com o rascunho e a quantidade da mesma peça soma. Sair deixa o visitante vazio e a loja da Ada intacta
- [ ] Carrinho vazio mostra `Seu carrinho está vazio.` e totais `0.00`. `Conectar e finalizar` não sai da rota
- [ ] Com linha, `Conectar e finalizar` vai para `/pagamento`. Sem sessão, a guarda pede a entrada antes
- [ ] Cupom, pontos do carrossel, Enviar e atalhos fora de escopo não navegam e não mostram sucesso
- [ ] Em 1440, a tabela, as recomendações e o rodapé aparecem. Abaixo de 1440, inclusive 768 e 390, a coluna é a do mobile, com margem 28, sem a barra de baixo

## Fase 7 · Homologação

Código entregue em `docs/implementation/F7-socket-preco-estado-pedido.md`. Homologação manual pendente:

- [ ] Com simulação ligada, Neon Vessel #552 alterna na grade, no detalhe e na cotação quando a peça está no carrinho
- [ ] Pedido novo mostra `Aguardando confirmação do pedido.` e depois o recibo, ou `Pedido recusado.` com Golden Signal #160
- [ ] Recibo da Ada (`ped-ada-1`) não muda com o relógio de preço
- [ ] Sair corta escuta do pedido; preço público continua
- [ ] Com `VITE_ENABLE_MOCK=false`, não há escuta de preço nem de pedido

## Fase 8 · Homologação

Código entregue em `docs/implementation/F8-perfil-carteiras.md`. Homologação manual pendente:

- [ ] `/perfil` e `/carteiras` em 1440 e 390 conforme `docs/manual-dev/08-fase-8-perfil-carteiras.md`
- [ ] Isolamento Ada/Bruno, senha nova, carteira sem mudar recibo `MetaMask`
- [ ] Cliques fora de escopo (sidebar, avatar, Adicionar) não navegam

## Fase 6 · Homologação

Código entregue em `docs/implementation/F6-pedido-idempotente-confirmacao.md`. Homologação manual pendente:

- [ ] Sem sessão, `/pedidos/ped-ada-1` abre a entrada e volta ao pedido depois do sucesso
- [ ] Ada vê Ivory Baron #088, quantidade 1, taxa `0.00 ETH`, total `1.79 ETH`, data `29 Jul, 2026` e `0xADA1…A1E1`, sem cabeçalho
- [ ] O `×` volta ao início. `Ver no Etherscan` não navega e não mostra sucesso
- [ ] Em 390 o modal cabe na coluna com padding 28, sem barra inferior
- [ ] O pedido do Bruno não abre na sessão da Ada
- [ ] `/`, `/carrinho` e `/perfil` continuam com cabeçalho

## Setup

- [x] Workflow em `.cursor/workflow/`
- [x] `AGENTS.md` e rules do projeto
- [x] Esqueleto Vite, com mock ligado ou desligado por configuração
- [x] `.gitignore` do app (dependência, build, ambiente)

## Construção

- [x] Tokens, casca e rotas vazias
- [x] Tela de início fiel aos frames desktop e mobile (dados estáticos, sem catálogo)
- [x] MSW com dois usuários, reset e catálogo feliz
- [x] Catálogo e detalhe, estado na URL
- [x] Sessão, login, cadastro e guarda
- [x] Carrinho e cotação
- [x] Pedido idempotente, confirmação e recibo snapshot
- [x] Socket no preço e no estado do pedido
- [x] Perfil e carteiras
- [x] Mapa de teste pela skill `C:\projetos\manual-report`. Primeira rodada, casos em Pendente: `docs/relatorio-testes-manuais.html` e `docs/evidencias/`
- [ ] Playwright dos 12 fluxos e regressão visual (suíte em `e2e/`; ver `e2e/README.md`. Rodar `pnpm playwright`. Ainda há casos vermelhos a ajustar.)
- [ ] Lighthouse, três medições, mediana, e deploy da mesma build
- [ ] Segunda rodada do mapa, antes da entrega

## Fora deste repositório

- [ ] Sentry, só como limitação no `ARCHITECTURE.md` quando ele for escrito
