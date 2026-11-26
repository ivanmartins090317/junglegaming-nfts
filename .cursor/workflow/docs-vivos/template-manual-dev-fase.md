# Fase {N} · {Nome da fase}

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/{arquivo-spec}.md` |

## O que esta fase entrega

{Bullets do valor entregue.}

Não entrega: {escopo explícito fora da fase}.

---

## Arquitetura da feature

```text
src/features/{dominio}/
├── domain/           # regras puras testáveis
├── queries.ts        # leitura (RSC)
├── actions.ts        # escrita (Server Actions)
├── schemas.ts        # Zod
├── types.ts
└── components/
```

### Fluxo principal (happy path)

1. {passo}
2. {passo}
3. {passo}

---

## Contas de teste

Senha / credencial: `{valor dev}`

| Papel | Login | Cenário |
| --- | --- | --- |
| {papel} | `{email}` | {o que validar} |

---

## Homologação manual

- [ ] {cenário 1}
- [ ] {cenário 2}

---

## Comandos

```bash
npm run dev
npm run test
# outros específicos da fase
```

---

## Próxima fase

Link: [`docs/state/PENDENCIAS.md`](../state/PENDENCIAS.md#{ancora})

Registro objetivo: [`docs/implementation/F{N}-*.md`](../implementation/F{N}-slug.md)
