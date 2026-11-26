# AGENTS.md

Constituição do projeto para agentes de IA. Este arquivo é contrato read-only: o agente não altera sem aprovação explícita.

## Stack

- Framework: Next.js (App Router) / ajuste aqui
- Linguagem: TypeScript
- UI: React + Tailwind / ajuste aqui
- Testes: Vitest / Playwright / ajuste aqui
- Package manager: pnpm / npm / yarn

## Estrutura preferida

- Features em fatias verticais: `src/features/<feature>/`
- Specs em: `docs/specs/<feature>.md`
- Evitar layers horizontais distantes para a mesma feature
- Preferir Deep Modules (interface estreita, lógica junta, helpers no mesmo arquivo)
- Nomes grepáveis e específicos (evitar `dataProcessor`, `utils2`, `helper`)
- Arquivo ideal até ~1000 linhas; nunca passar de ~2000

## Pode

- Criar e editar arquivos dentro de `src/features/<feature-atual>/`
- Criar testes unitários e de aceite relacionados à Spec aprovada
- Rodar comandos de verificação locais (typecheck, lint, test)
- Ler o restante do codebase para contexto
- Propor mudanças fora do escopo (sem aplicar até eu aprovar)

## Não pode

- Alterar este `AGENTS.md` sem eu pedir
- Alterar Spec aprovada em `docs/specs/` sem eu pedir
- Mexer em paths críticos sem pedido explícito (liste abaixo)
- Criar migration / mudar schema de banco sem aprovação
- Adicionar dependência nova sem aprovação
- `git push`, merge em `main`/`master`, deploy

## Paths críticos (autonomia tight)

Só alterar com pedido explícito + Spec aprovada + review humano:

- `src/domain/core/**`
- `src/**/auth/**`
- `src/**/billing/**`
- `**/prisma/schema.prisma` (ou equivalente)
- `.env*`
- CI/CD e configs de produção

## Autonomia por tarefa

No início de cada feature, declarar um nível:

- `tight`: reviso plano, Spec e diff. Fluxo cheio, sem lite.
- `medium`: reviso Spec e resultado dos testes
- `loose`: reviso só Done (Spec + comandos verdes)

Default: `medium`. Paths críticos sempre `tight`.

## Fluxo obrigatório por feature

Comportamento novo ou path crítico:

1. Research (sem código)
2. Plano curto (sem código)
3. Outro agente, contexto limpo, revisa o plano. Eu aceito ou descarto os achados.
4. Spec em `docs/specs/` → esperar aprovação humana
5. Implementar só o que a Spec pede
6. **Atualizar docs vivos** (`docs/plans/README.md` e `docs/specs/README.md` marcam `done`, `docs/implementation/`, `docs/manual-dev/`, `docs/state/PENDENCIAS.md`)
7. Verificar Done
8. Parar e reportar evidências

Sem subagente de contexto limpo, o passo 3 para. Revisão no mesmo chat não vale.

## Fluxo lite

Bug, refactor ou mudança pequena, sem comportamento novo e sem path crítico. Autonomia `tight` não usa lite.

O checklist aprovado em `docs/specs/YYYY-MM-DD-<slug>.md` (`Tipo: lite`) vale como spec. O revisor entra se disparar o portão: dois ou mais arquivos de produção, API pública, concorrência, premissa não verificada, ou path crítico.

Prompt: `prompts/lite.md` do kit workflow-ai-native (segundo-cerebro).

## Estrutura de documentação no repo

```text
docs/
  specs/              # índice + uma spec por feature (aprovada não muda sem pedido)
  plans/
    README.md         # índice vivo dos planos
    reviews/          # YYYY-MM-DD-<slug>-plano.md e achados
  implementation/     # o que foi entregue por fase
  manual-dev/         # como funciona (manual do dev)
  state/PENDENCIAS.md # o que falta implementar ou homologar
```

Templates: `10 Dev/Referencias/workflow-ai-native/docs-vivos/` (segundo-cerebro)  
Wiki: [[2026-08-18-arquitetura-docs-vivos-projeto-software]]

## Done (definição objetiva)

Só declarar Done quando TODOS passarem:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

E também:

- Cenários da Spec da feature em verde
- Nenhuma mudança fora do escopo sem aprovação
- **Docs vivos atualizados** (`docs/plans` e `docs/specs` em `done`, implementation, manual-dev, PENDENCIAS)
- Resumo do que mudou + arquivos tocados + links dos docs

Ajuste os comandos acima ao projeto real.

## Como reportar ao final

```md
## Resultado
- Autonomia usada:
- Spec:
- Comandos Done:
- Arquivos alterados:
- Riscos / dúvidas:
- Diff crítico para review humano: sim/não
```
