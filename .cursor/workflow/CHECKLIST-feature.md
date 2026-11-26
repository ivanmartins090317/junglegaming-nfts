# Checklist: 1 feature (uso diário)

## Antes de pedir código (fluxo cheio)

- [ ] Feature nomeada
- [ ] Autonomia definida (`tight` / `medium` / `loose`)
- [ ] Research feito
- [ ] Plano curto feito
- [ ] Plano revisado por outro agente, contexto limpo
- [ ] Eu aceitei ou descartei os achados
- [ ] Spec criada em `docs/specs/`
- [ ] Spec aprovada por mim

## Lite (bug, refactor, mudança pequena)

Não usar se houver comportamento novo, path crítico ou autonomia `tight`.

- [ ] Crítica feita, sem código
- [ ] Checklist em `docs/specs/YYYY-MM-DD-<slug>.md` (`Tipo: lite`) e eu aprovei
- [ ] Revisor chamado se o portão disparou (dois ou mais arquivos de produção, API pública, concorrência, premissa não verificada, path crítico)
- [ ] Done pelo prompt 05, com o arquivo lite no lugar da spec longa

## Durante a implementação

- [ ] Agente só mexeu no escopo permitido
- [ ] Paths críticos só com pedido explícito
- [ ] Código por feature (vizinhos), não layers distantes
- [ ] Deep Modules (sem microfunções espalhadas)

## Done

- [ ] Cenários da Spec em verde
- [ ] Unit tests em verde
- [ ] typecheck em verde
- [ ] lint em verde
- [ ] **Docs vivos:** plano e spec em `done` (`docs/plans/README.md`, `docs/specs/README.md`). No fluxo cheio, também `docs/implementation/`, `docs/manual-dev/` e `docs/state/PENDENCIAS.md`. No lite, capítulo novo só se o comportamento ou a homologação mudou
- [ ] Relatório final com arquivos + riscos + links dos docs

## Review

- [ ] Se `medium/loose` e verde: conferi Spec vs resultado
- [ ] Se `tight` / crítico / falhou: li o diff
- [ ] Commit/PR pequeno
