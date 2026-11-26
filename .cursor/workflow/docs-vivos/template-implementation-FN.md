# Fase {N} · {Nome da fase}

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/PLANO.md` §{N} |
| **Spec** | `docs/specs/{arquivo-spec}.md` |

## Objetivo

{1–2 frases: valor de negócio desta fase.}

## Entregue

### Banco / infra (se aplicável)

| Arquivo | Conteúdo |
| --- | --- |
| `{NNN}_*.sql` | {descrição} |

### Feature `src/features/{dominio}/`

| Área | Arquivos |
| --- | --- |
| Domínio | `{arquivos}` |
| Dados | `queries.ts`, `types.ts` |
| Escrita | `actions.ts`, `schemas.ts` |
| UI | `{componentes}` |

### Páginas integradas

- `{rota}` — {o que mudou}

### Testes automatizados

- `{arquivo.test.ts}` — {o que cobre}

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK / falhou |
| `npm run build` | OK / falhou |
| `npm run test` | OK · N passed |
| `npm run db:push` | {se migration} |

## Pendências menores desta fase

- Homologação manual: ver `docs/state/PENDENCIAS.md`
- {dívida técnica conhecida}

## Fora desta fase (correto)

- {escopo explicitamente não entregue}

## Manual do dev

Explicação e fluxos: [`docs/manual-dev/{NN}-fase-{N}-*.md`](../manual-dev/{NN}-fase-{N}-slug.md)
