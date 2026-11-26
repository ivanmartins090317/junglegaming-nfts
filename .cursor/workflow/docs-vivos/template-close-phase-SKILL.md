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

Rodar e registrar evidências (ajuste comandos ao projeto):

```bash
npm run lint
npm run build
npm run test
# npm run db:push   # se migration
# npm run db:types  # se schema mudou
```

## Checklist de documentação (obrigatório)

1. **`docs/plans/README.md`** e **`docs/specs/README.md`**: status desta feature em `done`
2. **`docs/implementation/F{N}-*.md`** + atualizar `docs/implementation/README.md`
3. **`docs/manual-dev/{NN}-fase-{N}-*.md`** + atualizar `docs/manual-dev/README.md`
4. **`docs/state/PENDENCIAS.md`**: `[x]` implementado, `[ ]` homologação manual

## Ordem

1. Evidências técnicas
2. Plans e specs: status `done` no índice e no arquivo
3. Implementation + README
4. Manual-dev + README
5. PENDENCIAS.md
6. Reportar links ao humano

## Não fazer

- Alterar Spec sem pedido explícito
- Marcar homologação formal como feita se não rodou

Referência: [[2026-08-18-arquitetura-docs-vivos-projeto-software]]
