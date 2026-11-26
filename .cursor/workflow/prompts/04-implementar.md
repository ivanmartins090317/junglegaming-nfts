# Prompt 04: Implementar

Cole no chat do Cursor (só depois da Spec aprovada):

```text
Spec aprovada: docs/specs/<arquivo-da-spec>.md
Autonomia: <tight|medium|loose>

Implemente SOMENTE o que a Spec pede.

Regras:
1. Respeite AGENTS.md (pode / não pode)
2. Não altere a Spec
2b. A UI segue a seção Tela, que é o contrato do Claude Sonnet 5.5. Não redesenhe a partir de outra leitura do PNG
3. Package by feature / Deep Modules
4. Helpers no mesmo arquivo quando fizer sentido
5. Crie unit tests da feature
6. Não mexa em path crítico sem eu ter pedido explicitamente
7. Ao final, rode os comandos de Done do AGENTS.md e reporte evidências
8. Antes de declarar Done, atualize docs vivos: `docs/plans/README.md` e `docs/specs/README.md` (status `done`), `docs/implementation/`, `docs/manual-dev/`, `docs/state/PENDENCIAS.md` (ver `.cursor/skills/close-phase/SKILL.md` ou playbook no segundo-cerebro)
```
