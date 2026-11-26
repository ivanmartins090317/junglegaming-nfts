# Prompt 01: Research

Cole no chat do Cursor:

```text
Vamos iniciar uma feature nova. NÃO escreva código ainda.

Feature: <NOME>
Autonomia: <tight|medium|loose>
Contexto extra: <cole links, restrições, conversa com cliente>

Tarefa:
1. Leia AGENTS.md e a estrutura do projeto
2. Contrato de UI antes do resto do research. Siga .cursor/workflow/prompts/00-tela-sonnet.md
   - Liste research/figma e case desktop-<tela>.png e mobile-<tela>.png
   - Abra um subagente Task: generalPurpose, model claude-sonnet-5-5-high, file_attachments com o caminho absoluto de cada PNG, run_in_background false
   - Cole a resposta dele na íntegra. Não leia a imagem você mesmo. Não resuma. Não reorganize
   - Slug recusado: pare e me avise. Não troque o modelo
   - Sem PNG com esse nome: pare, liste a pasta e pergunte qual tela vale
3. Faça research do que já existe de relacionado
4. Liste arquivos relevantes (código e os PNG lidos)
5. Liste dúvidas e riscos. Divergência entre desktop e mobile entra aqui
6. Pare e me devolva só o research (sem plano detalhado ainda, sem código)
```
