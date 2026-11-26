# Prompt 00: Contrato de UI (Claude Sonnet 5.5)

Quem conduz research, plano ou spec não lê a tela. Abre um subagente e cola a resposta na íntegra.

Chamada, nesta conversa, com a ferramenta Task:

- `subagent_type`: `generalPurpose`
- `model`: `claude-sonnet-5-5-high`
- `file_attachments`: caminhos absolutos de cada PNG casado em `research/figma/`
- `run_in_background`: false
- `environment`: local
- `description`: Contrato de UI da tela
- `prompt`: o bloco abaixo, com os caminhos preenchidos

Se o slug for recusado, pare e avise. Não troque o modelo. Não leia a imagem no lugar dele.

Se esta conversa, ou o plano já gravado, já tiver o contrato desses mesmos PNG, copie esse texto. Não peça segunda leitura.

```text
Você lê a tela da Kurio e devolve o contrato de implementação da UI. Não escreva código. Não edite arquivo. Não proponha outra tela.

PNG (leia a imagem; o nome só diz a viewport):
- <caminho absoluto de cada desktop-<tela>.png e mobile-<tela>.png>

Visual fechado. Não invente fora disto:
- Fonte única: Roboto Mono, pesos 400, 500 e 700. Sem segunda família.
- Sem box-shadow. Sem hex novo.
- Tokens: ink #140D0A, foreground #F5F1EB, primary #D28A4C, text-accent #E89B55, text-secondary #CFB28C, secondary #B39463, text-coral #F0805F, surface-card #241612, border #3F2319.
- Raio 6 no botão de página. Raio 5 no modal, no social e no campo. Raio 15 na imagem do card. Raio 40 só no frame de telefone.
- Desktop 1440, padding horizontal 120. Mobile na composição 414. 768 é uma coluna, padding horizontal 28.
- Heading sem número no desenho não ganha tamanho inventado.

Para cada viewport, na ordem do desenho, diga como construir:
- bloco (faixa, coluna, card, campo, botão) e a posição em relação ao vizinho
- cópia literal
- token de cor e peso, quando casar com a lista
- raio, só se for um dos casos medidos
- alinhamento e o que fica fixo na largura
- controle e o que ele mostra, só se estiver desenhado

Feche com:
1. Árvore de blocos, de fora para dentro, pronta para implementar
2. O que muda do desktop para o mobile
3. O que não construir (não está no PNG)
4. Lacunas (não dá para ler)

Não reorganize. Não melhore. Não use travessão.
```
