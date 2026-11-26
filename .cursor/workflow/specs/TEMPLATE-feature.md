# Spec: <Nome da Feature>

- Status: `draft` | `aprovada` | `em_implementacao` | `done`
- Data: YYYY-MM-DD
- Autonomia: `tight` | `medium` | `loose`
- Projeto:
- Pedido original:

## 1. Objetivo

Em 1–3 frases: qual resultado de negócio essa feature entrega.

## 2. Tela

Contrato de UI do Claude Sonnet 5.5 (`claude-sonnet-5-5-high`), colado na íntegra. O modelo que escreve a spec não reescreve arranjo, cópia nem composição.

PNG:

- `research/figma/desktop-<tela>.png`
- `research/figma/mobile-<tela>.png`

<colar aqui a resposta do subagente>

## 3. Fora de escopo

Liste o que NÃO entra agora. Inclua o que a imagem não mostra.

## 4. Atores e pré-condições

- Quem usa:
- O que precisa existir antes:

## 5. Comportamento esperado (cenários)

Escreva em linguagem de domínio. Evite leakage técnico (`POST /api/...`, nome de tabela, nome de classe).

### Cenário 1: <caminho feliz>

- Dado:
- Quando:
- Então:

### Cenário 2: <erro / borda>

- Dado:
- Quando:
- Então:

### Cenário 3: <outro caso importante>

- Dado:
- Quando:
- Então:

## 6. Regras de negócio

- Regra 1:
- Regra 2:

## 7. Critérios de Done desta feature

- [ ] A tela entregue segue a seção Tela (os PNG de `research/figma/`)
- [ ] Todos os cenários acima passam
- [ ] Testes unitários da feature passam
- [ ] `typecheck` passa
- [ ] `lint` passa
- [ ] Nenhuma mudança fora do escopo sem aprovação

## 8. Escopo de arquivos permitido

- Pode editar:
  - `src/features/<feature>/**`
- Não pode editar sem pedido:
  - `src/domain/core/**`
  - auth / billing / schema / .env

## 9. Riscos e dúvidas abertas

- 

## 10. Aprovação humana

- Aprovado por:
- Data:
- Observações:
