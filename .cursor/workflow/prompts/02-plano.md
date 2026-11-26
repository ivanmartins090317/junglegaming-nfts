# Prompt 02: Plano

Cole no chat do Cursor (depois do research):

```text
Com base no research acima, monte um plano curto. NÃO escreva código.

A parte de UI do plano é o contrato do Claude Sonnet 5.5, colado na íntegra. Se ele não estiver nesta conversa nem no plano gravado, siga .cursor/workflow/prompts/00-tela-sonnet.md e chame de novo (model claude-sonnet-5-5-high). Não leia o PNG você mesmo. Não mude região, cópia ou bloco que o contrato mandou construir.

Inclua:
1. Abordagem em 3 a 6 passos. O passo de tela aponta para o contrato, sem reescrever a composição
2. Arquivos que devem ser criados/alterados
3. O que fica fora de escopo (inclusive bloco que a imagem não mostra)
4. Riscos técnicos
5. Se a feature toca path crítico (sim/não e quais)

Pare e espere minha aprovação do plano.
Não escreva a spec neste turno.
```

Depois da aprovação, use `prompts/02b-revisar-plano.md`.
