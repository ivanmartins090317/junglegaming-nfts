# Prompt 03: Spec

Cole no chat do Cursor depois da triagem dos achados do plano.

```text
Plano revisado. Os achados que eu aceitei já estão na seção Decisão de docs/plans/reviews/YYYY-MM-DD-<slug>-plano.md.

Agora escreva a Spec da feature. NÃO implemente código.

Use o template em docs/specs/TEMPLATE-feature.md (ou o equivalente deste projeto).
Salve em: docs/specs/YYYY-MM-DD-<slug-da-feature>.md
Inclua uma linha no índice docs/specs/README.md (tipo feature, status draft). Se o índice não existir, crie a tabela: Data, Slug, Tipo, Status, Spec.

Regras da Spec:
- Linguagem de domínio (sem endpoint, tabela, classe)
- Incluir caminho feliz + erros/bordas
- Incluir critérios de Done
- Incluir escopo de arquivos permitido
- Status inicial: draft

Ao terminar, peça minha aprovação explícita antes de qualquer implementação.
```
