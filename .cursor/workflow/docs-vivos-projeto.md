# Docs vivos no repositório (kit)

Padrão de **cinco documentos vivos** + índices, para todo projeto que usa [[README|Workflow AI-Native]]. Spec aprovada não muda sem pedido. O índice de specs acompanha o status.

Wiki completa: [[2026-08-18-arquitetura-docs-vivos-projeto-software]]

---

## Os cinco docs

| Pasta | Pergunta | Quando atualizar |
| --- | --- | --- |
| `docs/specs/` | O que a feature deve fazer? | No prompt 03 ou no lite. No Done, marca `done` no índice |
| `docs/plans/` | Qual foi o plano? | No 02b (grava o plano em `docs/plans/reviews/`). No Done, marca `done` no índice |
| `docs/implementation/` | O que foi entregue? | Ao fechar fase/feature |
| `docs/manual-dev/` | Como funciona e homologar? | Ao fechar fase/feature |
| `docs/state/PENDENCIAS.md` | O que ainda falta? | Sempre que mudar estado |

---

## Arquivos deste kit (`docs-vivos/`)

| Arquivo | Uso |
| --- | --- |
| `template-specs-README.md` | Copiar → `docs/specs/README.md` (primeira vez) |
| `template-plans-README.md` | Copiar → `docs/plans/README.md` (primeira vez) |
| `template-plan.md` | Forma de cada `docs/plans/reviews/YYYY-MM-DD-<slug>-plano.md` |
| `template-implementation-FN.md` | Copiar → `docs/implementation/F{N}-slug.md` |
| `template-manual-dev-fase.md` | Copiar → `docs/manual-dev/{NN}-fase-{N}-slug.md` |
| `template-PENDENCIAS.md` | Copiar → `docs/state/PENDENCIAS.md` (primeira vez) |
| `template-close-phase-SKILL.md` | Copiar → `.cursor/skills/close-phase/SKILL.md` |
| `template-docs-section-AGENTS.md` | Colar no `AGENTS.md` do projeto |
| `template-docs-section-cursor-rule.mdc` | Colar na rule always-on do projeto |

---

## Bootstrap (5 minutos)

1. Criar pastas `docs/specs/`, `docs/plans/reviews/`, `docs/implementation/`, `docs/manual-dev/`, `docs/state/`
2. Copiar `template-specs-README.md` → `docs/specs/README.md` e `template-plans-README.md` → `docs/plans/README.md`
3. Copiar `template-PENDENCIAS.md` → `docs/state/PENDENCIAS.md`
4. Criar `docs/implementation/README.md` e `docs/manual-dev/README.md` (índices)
5. Adicionar seção DoD em `AGENTS.md`
6. Copiar skill `close-phase` para `.cursor/skills/`
7. Incluir no DoD de cada Spec os itens de documentação

Referência implementada: ClinRoma (`C:\projetos\clinroma`).
