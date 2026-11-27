# Plano: Entrega de hoje

- Status: `in_progress`
- Data: 2026-11-27
- Slug: `entrega-hoje`
- Autonomia: `medium`. `tight` só se mexer path crítico. Nesta entrega não mexer path crítico.
- Spec: nenhuma spec nova. Entregar o que as fases 1 a 8 já implementaram.
- Prazo: hoje, 27/11/2026, antes das 12:00.

## Meta

Homologar e entregar o código já existente. Fechar a prova com ARCHITECTURE.md, build única, Lighthouse, deploy da mesma build e segunda rodada do mapa. Sem feature nova.

## Ordem

1. Homologar F1 a F8 (o que já existe).
2. ARCHITECTURE.md agora (CP-0, não espera a homologação).
3. Depois: Playwright visual (não bloqueia a homologação).
4. `pnpm build` uma vez. Guardar o artefato.
5. Lighthouse: 3 medições, mediana, na mesma build.
6. Deploy da mesma build. Só depois da homologação fechar.
7. Segunda rodada da skill `C:\projetos\manual-report` (HTML e evidências fora deste Git).
8. Fechar pendências de entrega em `docs/state/PENDENCIAS.md`.

O artefato de CP-3 alimenta Lighthouse e o deploy. Se a medição for no host publicado, rode CP-5 e em seguida CP-4, sem gerar outra build.

## Checkpoints

### CP-0 · Docs desta entrega

- [x] Este plano em `docs/plans/2026-11-27-entrega-hoje.md`
- [x] `ARCHITECTURE.md` na raiz, com Sentry fora do `package.json`

Como marcar: caixa neste arquivo. Já feito neste turno.

### CP-1 · Homologação F1 a F8

- [ ] Marcar os itens manuais das fases 1 a 8 em `docs/state/PENDENCIAS.md`

Como marcar: cada checkbox da fase correspondente em `docs/state/PENDENCIAS.md`. Não marcar aqui no lugar da homologação. FL-01 (TC-01 a TC-05) aprovado em 2026-11-27; o restante das fases 1 a 8 continua aberto.

Bloqueia a entrega e o deploy (CP-5). Não bloqueia CP-0.

### CP-2 · Playwright 55/55 (depois, não bloqueia homologação)

- [ ] Os 4 visuais restantes em `e2e/visual.spec.ts`: TC-52 carrinho com linha; TC-53 pagamento (desktop sem snapshot; mobile timeout/login)

Estado atual: 51/55. `pnpm typecheck`, `pnpm lint` e `pnpm test` (130 vitest) passam.

Como marcar: caixa neste arquivo. Quando a suíte inteira passar, marcar também a linha Playwright em `docs/state/PENDENCIAS.md`.

### CP-3 · Build única

- [ ] `pnpm build` uma vez. Guardar o artefato. Lighthouse e deploy usam só essa build.

Como marcar: caixa neste arquivo. Não gerar segunda build.

### CP-4 · Lighthouse

- [ ] Três medições, mediana, sobre a build de CP-3. Não há config de Lighthouse neste repo.

Como marcar: caixa neste arquivo. Quando a mediana estiver registrada, marcar a linha Lighthouse em `docs/state/PENDENCIAS.md` (junto com o deploy da mesma build).

### CP-5 · Deploy da mesma build

- [ ] Publicar o artefato de CP-3. Só depois de CP-1 fechar. Sem outra build.

Como marcar: caixa neste arquivo. Host não está neste plano.

### CP-6 · Segunda rodada do mapa

- [ ] Skill `C:\projetos\manual-report`. HTML e evidências fora deste Git. No relatório do repo, a segunda rodada está em andamento: FL-01 aprovado (TC-01 a TC-05).

Como marcar: caixa neste arquivo. Marcar a linha "Segunda rodada do mapa" em `docs/state/PENDENCIAS.md`. Não copiar o HTML da skill para este Git.

### CP-7 · Fechar pendências de entrega

- [ ] Playwright, Lighthouse, segunda rodada e Sentry no `ARCHITECTURE.md` refletidos em `docs/state/PENDENCIAS.md`
- [ ] Este plano e a linha do índice em `done`

Como marcar: `docs/state/PENDENCIAS.md` (Construção e Fora deste repositório) e `docs/plans/README.md` (status desta entrega). Sentry já está no `ARCHITECTURE.md`; falta só confirmar a linha correspondente.

## O que não entra hoje

Não abrir spec, não implementar, não tratar como fase aberta:

- FL-01 filtros, ordem e página não mudam a lista
- FL-03 reload perde a sessão
- FL-04 coração não grava favorito
- FL-05 cupom não altera desconto
- FL-06 e FL-07 `/pagamento` só título; o pedido nasce no `POST /api/pedidos`
- FL-12 Carregando sem skeleton
- FL-13 baseline de pagamento registra página vazia

## Não mexer

- `AGENTS.md`, specs aprovadas, `src/`, `e2e/` (exceto no CP-2, depois), `package.json`, `.env*`
- Path crítico: `src/lib/contracts/**`, `src/lib/api/**`, `src/lib/socket/**`, `src/lib/money.ts`, `src/mocks/**`, `src/features/session/**`, `src/features/checkout/**`, `src/features/order/**`, `.env*`
- `git commit`, push, merge, deploy (deploy só no CP-5, pedido explícito)
- `@sentry/*` e DSN. Sentry não entra no `package.json`

## Comandos Done (`AGENTS.md`)

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm exec playwright test
```

Também, nesta entrega: `pnpm build` (CP-3). Lighthouse não tem script no repo.

Done da entrega: CP-1 a CP-7 marcados, suíte Playwright verde, mediana Lighthouse na mesma build, docs vivos atualizados. Não marcar Done de feature neste turno de docs.

## Paths críticos

- Toca path crítico: não
- Quais: nenhum neste turno. CP-2 (Playwright visual) também não deve alterar path crítico.
