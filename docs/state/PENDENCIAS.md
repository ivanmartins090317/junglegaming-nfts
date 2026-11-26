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
- [ ] Sessão, login, cadastro e guarda
- [ ] Carrinho e cotação
- [ ] Pedido idempotente, confirmação e recibo snapshot
- [ ] Socket no preço e no estado do pedido
- [ ] Perfil e carteiras
- [ ] Mapa de teste pela skill `C:\projetos\manual-report`
- [ ] Playwright dos 12 fluxos e regressão visual
- [ ] Lighthouse, três medições, mediana, e deploy da mesma build
- [ ] Segunda rodada do mapa, antes da entrega

## Fora deste repositório

- [ ] Sentry, só como limitação no `ARCHITECTURE.md` quando ele for escrito
