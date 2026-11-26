# Prompt 02b: Revisar o plano

Cole no chat do Cursor depois que você aprovar o plano. Ainda sem spec e sem código.

```text
Plano aprovado por mim. NÃO escreva a spec. NÃO escreva código.

Tarefa:
1. Grave o plano como ficou depois da minha aprovação em:
   docs/plans/reviews/YYYY-MM-DD-<slug>-plano.md
   Nesse arquivo entra só o plano (passos, arquivos, fora de escopo, riscos, paths críticos, e a seção Decisão vazia). Sem o histórico do chat.
   Status inicial: aprovado.
   Inclua uma linha no índice docs/plans/README.md. Se o índice não existir, crie a tabela: Data, Slug, Status, Plano, Achados.
2. Abra um subagente de contexto limpo. Entregue somente:
   - o texto desse arquivo
   - os caminhos de arquivo que o plano cita, para ele ler o código
   Não passe o histórico desta conversa nem a sua opinião sobre o plano.
3. Se este ambiente não abrir subagente de contexto limpo, pare e me avise. Revisão no mesmo chat não vale.
4. O subagente só lê. Quem grava o relatório é você, em:
   docs/plans/reviews/YYYY-MM-DD-<slug>-achados.md
5. Rubrica. No máximo 5 achados. Cada achado só entra se mudar a spec:
   - Premissa que o plano usa e não escreveu
   - Erro ou borda que muda o comportamento
   - Código que já existe e o plano ignora
   - Escopo que dá para cortar
   - Path crítico sem autonomia tight
   - O que, se estiver errado, muda a spec
   Formato de cada achado: fato, e a frase "muda a spec: ...".
   Se nada mudar a spec, o relatório diz isso e para.
6. Me devolva só os dois caminhos e a lista curta, como o revisor escreveu. Não acrescente achado seu nessa lista.
7. Pare. Eu digo o que entra e o que sai.
8. Quando eu triar, atualize o plano com a seção "## Decisão" (o que entrou, o que saiu) e marque o status decidido no arquivo e no índice. Só então o próximo passo é a spec.
```
