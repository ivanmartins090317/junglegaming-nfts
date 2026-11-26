# Pendências · Kurio

Fonte viva do que ainda falta implementar ou validar. Atualizar ao concluir cada fase.

Última revisão: 2026-11-26

## Fase 1 · Homologação

Código entregue em `docs/implementation/F1-tokens-casca-rotas.md`. Homologação manual pendente:

- [ ] Casca do início, telas nomeadas e endereço desconhecido
- [ ] Início desktop (1440) e mobile (390) contra os frames do Figma
- [ ] Navegação do topo, busca sem efeito e larguras 1440, 768 e 390
- [ ] Simulação ligada, desligada e falha ao subir

## Fase 2 · Homologação

Código entregue em `docs/implementation/F2-msw-usuarios-reset-catalogo.md`. Homologação manual pendente:

- [ ] Início continua na lista estática, com as oito peças, sem pedir `/api/nfts` para pintar
- [ ] `GET /api/nfts` devolve as oito peças na ordem da semente
- [ ] `GET /api/nfts/neon-vessel-552` devolve a peça rara e um identificador ausente responde 404
- [ ] `POST /api/dev/reset` responde 204 e a loja volta à semente
- [ ] `/nfts/neon-vessel-552` continua só com "Detalhe neon-vessel-552"

## Setup

- [x] Workflow em `.cursor/workflow/`
- [x] `AGENTS.md` e rules do projeto
- [x] Esqueleto Vite, com mock ligado ou desligado por configuração
- [x] `.gitignore` do app (dependência, build, ambiente)

## Construção

- [x] Tokens, casca e rotas vazias
- [x] Tela de início fiel aos frames desktop e mobile (dados estáticos, sem catálogo)
- [x] MSW com dois usuários, reset e catálogo feliz
- [ ] Catálogo e detalhe, estado na URL
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
