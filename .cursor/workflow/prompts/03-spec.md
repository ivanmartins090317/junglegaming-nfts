# Prompt 03: Spec

Cole no chat do Cursor depois da triagem dos achados do plano.

```text
Plano revisado. Os achados que eu aceitei já estão na seção Decisão de docs/plans/reviews/YYYY-MM-DD-<slug>-plano.md.

Agora escreva a Spec da feature. NÃO implemente código.

Use o template em docs/specs/TEMPLATE-feature.md (ou o equivalente deste projeto).
Salve em: docs/specs/YYYY-MM-DD-<slug-da-feature>.md
Inclua uma linha no índice docs/specs/README.md (tipo feature, status draft). Se o índice não existir, crie a tabela: Data, Slug, Tipo, Status, Spec.

A seção Tela é o contrato do Claude Sonnet 5.5, colado na íntegra. Se ele não estiver nesta conversa nem no plano, siga .cursor/workflow/prompts/00-tela-sonnet.md e chame de novo (model claude-sonnet-5-5-high). Não leia o PNG você mesmo. Não resuma o contrato.

Regras da Spec:
- Linguagem de domínio (sem endpoint, tabela, classe)
- Seção Tela igual à resposta do Sonnet, com o caminho de cada PNG. Cenário não pede bloco que o contrato marcou como ausente
- Incluir caminho feliz + erros/bordas
- Incluir critérios de Done
- Incluir escopo de arquivos permitido
- Status inicial: draft

Ao terminar, peça minha aprovação explícita antes de qualquer implementação.
```
