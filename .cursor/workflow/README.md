# Workflow AI-Native (templates prontos)

Kit pra começar a usar amanhã em qualquer projeto (Cursor).

Baseado no estudo: [[2026-08-03-clean-code-evolution-coding-for-agents]]  
Atualização 2026-09-17: o workshop TLC confirma o kit. Gargalo = prova, não digitação. Ver [[2026-09-17-workshop-ia-assistida-avancado]].  
Atualização 2026-11-18: revisor de contexto limpo entre o plano e a spec. Fluxo lite para mudança pequena.

## Como usar (primeira vez no projeto)

1. Copie `template-AGENTS.md` para a raiz do projeto como `AGENTS.md`
2. Ajuste stack, pastas e bloqueios ao seu repo
3. Crie `docs/specs/` e `docs/plans/reviews/`. Copie `docs-vivos/template-specs-README.md` para `docs/specs/README.md` e `docs-vivos/template-plans-README.md` para `docs/plans/README.md`. Copie `specs/TEMPLATE-feature.md` para `docs/specs/TEMPLATE-feature.md`
4. (Opcional) Copie `template-cursor-rule.mdc` para `.cursor/rules/ai-native-workflow.mdc`
5. Para cada feature nova, a spec nasce em `docs/specs/YYYY-MM-DD-nome-da-feature.md`

## Dois caminhos

### Feature (comportamento novo ou path crítico)

Use os prompts em ordem (`prompts/`):

1. Research → `prompts/01-research.md`
2. Plano → `prompts/02-plano.md`
3. Revisar o plano com outro agente → `prompts/02b-revisar-plano.md`
4. Você aceita ou descarta os achados. O plano é atualizado.
5. Spec → `prompts/03-spec.md` (você aprova antes do código)
6. Implementar → `prompts/04-implementar.md`
7. **Fechar docs vivos** → [[docs-vivos-projeto|docs-vivos/]] (specs + plans + implementation + manual-dev + PENDENCIAS)
8. Verificar Done → `prompts/05-verificar.md`

O revisor vê só o plano e os arquivos que ele cita. Não vê o chat. Devolve no máximo 5 achados, e só o que muda a spec. Sem subagente de contexto limpo, a revisão para.

### Lite (bug, refactor, mudança pequena)

`prompts/lite.md`. O checklist aprovado em `docs/specs/` vale como spec. O revisor entra se o portão disparar (dois ou mais arquivos de produção, API pública, concorrência, premissa não verificada, path crítico). O fecho continua no prompt 05.

Checklist rápido: [[CHECKLIST-feature]]

## Docs vivos no repo (padrão Ivan)

No fluxo cheio, as pastas abaixo atualizam ao fechar a fase. No lite, capítulo novo de implementation e manual-dev só quando o comportamento ou a homologação mudam.

- `docs/specs/` — todas as specs. Nasce no prompt 03 ou no lite. Spec aprovada não muda sem pedido. No Done, o índice marca `done`.
- `docs/plans/` — os planos (`docs/plans/reviews/`). Nasce no 02b. No Done, o índice marca `done`.
- `docs/implementation/` — o que foi entregue
- `docs/manual-dev/` — como funciona e homologar
- `docs/state/PENDENCIAS.md` — o que falta

Wiki: [[2026-08-18-arquitetura-docs-vivos-projeto-software]] · Templates: [[docs-vivos-projeto]]

## Arquivos deste kit

| Arquivo | Função |
| --- | --- |
| `template-AGENTS.md` | Constituição do projeto (pode / não pode / done) |
| `template-cursor-rule.mdc` | Rule Cursor com o fluxo |
| `specs/TEMPLATE-feature.md` | Modelo da spec. No projeto, copiar para `docs/specs/` |
| `CHECKLIST-feature.md` | Checklist diário |
| `docs-vivos/` | Templates dos docs vivos (plans, implementation, manual-dev, PENDENCIAS) + skill close-phase |
| `docs-vivos-projeto.md` | Índice do kit docs vivos |
| `prompts/01` a `05` | Fluxo cheio: research, plano, spec, implementar, verificar |
| `prompts/02b-revisar-plano.md` | Outro agente revisa o plano antes da spec |
| `prompts/lite.md` | Bug, refactor, mudança pequena |

## Regra de ouro

Spec aprovada = Source of Truth. No lite, o checklist aprovado ocupa esse lugar.  
Achado do revisor só entra no plano se você aceitar.  
Done = Spec atendida + comandos objetivos passando.  
Código crítico = autonomia tight + review humano. Fluxo cheio, sem lite.
