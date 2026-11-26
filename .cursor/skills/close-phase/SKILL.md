---
name: close-phase
description: >-
  Checklist para fechar fase ou spec: marcar o plano em docs/plans/README.md,
  a spec em docs/specs/README.md, e atualizar docs/implementation,
  docs/manual-dev e docs/state/PENDENCIAS.md
  após implementação técnica.
  Use ao concluir feature, fechar fase ou antes de marcar spec como pronta.
---

# Fechamento de fase

## Pré-requisito técnico

Rodar e registrar evidências, quando o esqueleto existir:

```bash
pnpm lint
pnpm build
pnpm test
pnpm exec playwright test
```

## Checklist de documentação (obrigatório)

1. `docs/plans/README.md` e `docs/specs/README.md`: status desta feature em `done`.
2. `docs/implementation/F{N}-*.md` e o índice `docs/implementation/README.md`.
3. `docs/manual-dev/{NN}-fase-{N}-*.md` e o índice `docs/manual-dev/README.md`.
4. `docs/state/PENDENCIAS.md`: `[x]` no que foi implementado, `[ ]` na homologação manual.

## Ordem

1. Evidências técnicas.
2. Plans e specs: status `done` no índice e no arquivo.
3. Implementation e o índice.
4. Manual-dev e o índice.
5. PENDENCIAS.md.
6. Reportar os links ao humano.

## Não fazer

- Alterar spec sem pedido explícito.
- Marcar homologação formal como feita se não rodou.
- Copiar o HTML da skill `manual-report` para este repositório.
