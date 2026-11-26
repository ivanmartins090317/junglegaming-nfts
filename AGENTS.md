# AGENTS.md

Constituição do projeto para agentes de IA. Este arquivo é contrato read-only: o agente não altera sem aprovação explícita.

Marketplace Kurio, prova frontend da Jungle. SPA no cliente. Dados simulados. Sem backend de produção.

## Stack

- Casca: Vite, React, TypeScript. SPA.
- Roteamento: TanStack Router por arquivo (`src/routes`, árvore em `src/routeTree.gen.ts`). O plugin do Router vem antes do plugin do React.
- Estado remoto: TanStack Query. HTTP: Axios. Componente não chama Axios.
- Tempo real: `socket.io-client`, só transporte websocket.
- Estilo: Tailwind 4. Componentes: shadcn/ui, no tema medido.
- Mock: MSW e `@mswjs/socket.io-binding`. Componente e hook não importam handler de mock.
- Teste: Playwright. Auditoria: Lighthouse.
- Package manager: pnpm.

O esqueleto Vite está neste repositório. O mock liga por padrão e desliga com `VITE_ENABLE_MOCK=false`. Tela, token, rota e mock de domínio esperam a spec da fatia.

## Estrutura preferida

- Rotas em `src/routes/`: path, search param, guarda, composição.
- Features em `src/features/<feature>/`: catálogo, detalhe, carrinho, checkout, pedido, sessão, perfil, carteira.
- Contratos em `src/lib/contracts/`. Axios em `src/lib/api/`.
- Chaves e cache em `src/lib/query/`. Socket em `src/lib/socket/`.
- ETH em string decimal: `src/lib/money.ts`. Quantidade é inteiro.
- Mock, fixture e cenário em `src/mocks/`.
- shadcn em `src/components/ui/`. Casca visual em `src/components/layout/`.
- Tokens em `src/styles/tokens.css`.
- Specs em `docs/specs/`. Planos em `docs/plans/reviews/`.

Nomes grepáveis. Arquivo ideal até ~300 linhas. Não passar de ~1000.

## Visual

Família única: Roboto Mono, pesos 400, 500 e 700. Nove cores medidas, sem hex novo e sem `box-shadow`. Raio 6 no botão de página. Raio 5 no botão de modal, no botão social e no campo. Heading sem número não ganha estilo. Borda do campo permanece a cor medida.

Tela sem frame usa a composição já decidida, com esse visual. Blog, Criadores, Aprenda e os itens fora de escopo da sidebar ficam visíveis e não navegam.

## Pode

- Criar e editar arquivos dentro da feature da spec aprovada.
- Criar teste de Playwright ligado a um caso do mapa.
- Rodar typecheck, lint, test e Playwright quando os scripts existirem.
- Ler o restante do codebase para contexto.
- Propor mudança fora do escopo, sem aplicar até eu aprovar.

## Não pode

- Alterar este `AGENTS.md` sem eu pedir.
- Alterar spec aprovada em `docs/specs/` sem eu pedir.
- Mexer em path crítico sem pedido explícito.
- Adicionar dependência sem aprovação. Sentry não entra no `package.json`.
- Sobrescrever `.env` sem confirmação.
- `git push`, merge em `main`/`master`, deploy.
- Inventar paleta, segunda fonte, sombra ou página editorial.
- Copiar a skill `manual-report` para este repositório.

## Paths críticos (autonomia tight)

Só alterar com pedido explícito, spec aprovada e review humano:

- `src/lib/contracts/**`
- `src/lib/api/**`
- `src/lib/socket/**`
- `src/lib/money.ts`
- `src/mocks/**`
- `src/features/session/**`
- `src/features/checkout/**`
- `src/features/order/**`
- `.env*`

Pedido com chave de idempotência, isolamento por usuário e evento que não regride estado são sempre `tight`.

## Autonomia por tarefa

No início de cada feature, declarar um nível:

- `tight`: reviso plano, spec e diff. Fluxo cheio, sem lite.
- `medium`: reviso spec e resultado dos testes.
- `loose`: reviso só Done (spec + comandos verdes).

Default: `medium`. Paths críticos sempre `tight`.

## Fluxo obrigatório por feature

Comportamento novo ou path crítico:

1. Research (sem código).
2. Plano curto (sem código).
3. Outro agente, contexto limpo, revisa o plano. Eu aceito ou descarto os achados.
4. Spec em `docs/specs/` e esperar aprovação humana.
5. Implementar só o que a spec pede.
6. Atualizar docs vivos (`docs/plans/README.md`, `docs/specs/README.md`, `docs/implementation/`, `docs/manual-dev/`, `docs/state/PENDENCIAS.md`).
7. Verificar Done.
8. Parar e reportar evidências.

Sem subagente de contexto limpo, o passo 3 para. Revisão no mesmo chat não vale.

Prompts do fluxo: `.cursor/workflow/prompts/`.

## Fluxo lite

Bug, refactor ou mudança pequena, sem comportamento novo e sem path crítico. Autonomia `tight` não usa lite.

O checklist aprovado em `docs/specs/YYYY-MM-DD-<slug>.md` (`Tipo: lite`) vale como spec. O revisor entra se disparar o portão: dois ou mais arquivos de produção, API pública, concorrência, premissa não verificada, ou path crítico.

Prompt: `.cursor/workflow/prompts/lite.md`.

## Mapa de teste

Antes da entrega do projeto inteiro, rodar a skill em `C:\projetos\manual-report`. Ela fornece o mapa (`FL` e `TC`). A primeira rodada abre a fatia de teste, com casos pendentes. O Playwright nasce desse mapa. A segunda rodada, antes da entrega, preenche status e evidência. O HTML e as evidências ficam fora deste Git. A casca visual desse relatório não entra no tema da Kurio.

## Estrutura de documentação no repo

```text
docs/
  specs/              # índice + uma spec por feature
  plans/
    README.md
    reviews/
  implementation/
  manual-dev/
  state/PENDENCIAS.md
```

Templates e prompts: `.cursor/workflow/`.
Checklist diário: `.cursor/workflow/CHECKLIST-feature.md`.
Fechamento: `.cursor/skills/close-phase/SKILL.md`.

Research, plano interno e mapa de teste não entram neste Git.

## DoD de documentação (obrigatório ao fechar fase)

Depois de lint, build e test, atualizar:

| Documento | Conteúdo |
| --- | --- |
| `docs/plans/README.md` | Plano desta feature em `done` |
| `docs/specs/README.md` | Spec desta feature em `done` |
| `docs/implementation/F{N}-*.md` | O que foi entregue |
| `docs/manual-dev/{NN}-fase-{N}-*.md` | Como funciona e como homologar |
| `docs/state/PENDENCIAS.md` | Implementado e homologação pendente |
| Índices de implementation e manual-dev | Status da fase |

## Done (definição objetiva)

Só declarar Done quando todos passarem, a partir do esqueleto:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm exec playwright test
```

E também:

- Cenários da spec em verde.
- Nenhuma mudança fora do escopo sem aprovação.
- Docs vivos atualizados.
- Resumo do que mudou, arquivos tocados e links dos docs.

`pnpm typecheck` e `pnpm lint` existem neste esqueleto. `pnpm test` e Playwright entram nas fatias de teste. Não marcar Done de feature neste commit.

## Como reportar ao final

```md
## Resultado
- Autonomia usada:
- Spec:
- Comandos Done:
- Arquivos alterados:
- Riscos / dúvidas:
- Diff crítico para review humano: sim/não
```
