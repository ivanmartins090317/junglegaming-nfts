# Prompt lite: mudança pequena

Use no lugar de research, plano e spec longa.

Cabe: bug, refactor, ajuste pequeno, sem comportamento novo de produto.

Não cabe: feature nova, comportamento novo, ou path crítico do `AGENTS.md`. Esses seguem `01` → `02` → `02b` → `03` → `04` → docs vivos → `05`. Autonomia `tight` também segue o fluxo cheio.

Cole uma vez. Depois responda só com `checklist`, `goldfish` ou `exec`.

```text
Mudança pequena. Fluxo lite.

Tarefa: <o que mudar>
Autonomia: <medium|loose>

Se a autonomia for tight, ou a mudança tocar path crítico, ou criar comportamento novo: pare e me mande para o fluxo cheio. Não escreva código.

Fase 1, agora. Sem código:
1. Leia AGENTS.md, os arquivos que a mudança toca, quem chama e o teste que já existe.
2. Me devolva uma crítica curta: dá para fazer, o que está frágil, o que fica de fora.
3. Pare e espere eu mandar checklist.

Fase 2, quando eu mandar checklist. Sem código:
Grave docs/specs/YYYY-MM-DD-<slug>.md com:
- Tipo: lite
- Status: draft
- Objetivo
- Fora de escopo
- Arquivos (criar, alterar, não mexer)
- Riscos e premissas não verificadas
- Critério de Done observável

Inclua uma linha no índice docs/specs/README.md (tipo lite, status draft). Se o índice não existir, crie a tabela: Data, Slug, Tipo, Status, Spec.

Portão do revisor. Recomende goldfish antes de executar se qualquer um for verdade:
- dois ou mais arquivos de produção
- API pública
- concorrência
- premissa não verificada
- path crítico

Se nenhum disparar, diga que exec é razoável. Sempre ofereça os dois: goldfish ou exec. Pare.

Fase 3, quando eu mandar goldfish. Sem código:
Abra um subagente de contexto limpo. Entregue só o arquivo lite e os caminhos que ele cita. Sem o histórico deste chat.
Se não houver subagente de contexto limpo, pare. Revisão no mesmo chat não vale.
O subagente só lê. Grave os achados em docs/plans/reviews/YYYY-MM-DD-<slug>-achados.md.
No máximo 5. Cada um só entra se mudar o checklist. Rubrica: premissa escondida, borda, código que já existe, escopo que dá para cortar, path crítico, o que muda o checklist.
Me devolva o caminho e a lista. Pare até eu triar. Atualize o arquivo lite com o que eu aceitar e então espere exec.

Fase 4, quando eu mandar exec:
O arquivo lite aprovado é a spec. Implemente só o que ele pede.
Não altere a spec. Não mexa em path crítico sem eu ter pedido.
Crie ou ajuste o teste da mudança. Rode os comandos de Done do AGENTS.md.

Docs vivos:
- Se o comportamento ou o jeito de homologar mudou: atualize docs/implementation/, docs/manual-dev/ e docs/state/PENDENCIAS.md.
- Se for refactor sem mudança de comportamento: não abra capítulo novo. Atualize PENDENCIAS.md só se o que falta mudou.

Revisor do diff, só neste caso: autonomia loose, ou o diff tocou path crítico. Aí repita a fase 3 em cima dos arquivos alterados, sem histórico, e pare para eu triar.
No resto, o fecho é o prompt 05-verificar.md, com o arquivo lite no lugar da spec longa.
```
