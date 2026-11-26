# Prompt 05: Verificar Done

Cole no chat do Cursor (se o agente não tiver fechado sozinho):

```text
Valide Done desta feature contra a Spec aprovada.

Checklist:
1. Abrir a Spec e marcar cenários atendidos / não atendidos
2. Rodar comandos de Done do AGENTS.md
3. Confirmar docs vivos: `docs/plans/README.md` e `docs/specs/README.md` com status `done`, `docs/implementation/F{N}-*.md`, `docs/manual-dev/{NN}-fase-{N}-*.md`, `docs/state/PENDENCIAS.md`
4. Listar arquivos alterados
5. Dizer se houve mudança fora de escopo
6. Dizer se preciso revisar diff crítico (sim/não e por quê)
7. Só declare Done se Spec + comandos + docs vivos estiverem verdes

Formato de resposta:
## Resultado
- Autonomia usada:
- Spec:
- Comandos Done:
- Docs vivos (links):
- Arquivos alterados:
- Riscos / dúvidas:
- Diff crítico para review humano: sim/não
```
