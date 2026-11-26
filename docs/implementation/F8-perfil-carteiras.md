# Fase 8 · Perfil e carteiras

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação manual pendente |
| **Plano** | `docs/plans/reviews/2026-11-26-perfil-carteiras-plano.md` |
| **Spec** | `docs/specs/2026-11-26-perfil-carteiras.md` |

## Objetivo

Quem está na sessão edita o próprio perfil e a carteira principal em `/perfil` e `/carteiras`, com sidebar compartilhada, validação na loja simulada e cache privado por usuário. Perfil e carteira são registros separados. A carteira salva não altera pagamento nem recibo.

## Entregue

| Área | Arquivos |
| --- | --- |
| Contratos e HTTP | `src/lib/contracts/profile.ts`, `src/lib/contracts/wallet.ts`, `src/lib/api/profile.ts`, `src/lib/api/wallet.ts` |
| Cache | `src/lib/query/profile.ts`, `src/lib/query/wallet.ts` |
| Tela | `src/features/profile/**`, `src/features/wallet/**` |
| Loja viva | `src/mocks/fixtures/users.ts`, `src/mocks/store.ts`, `src/mocks/handlers.ts` |
| Rotas | `src/routes/perfil.tsx`, `src/routes/carteiras.tsx` |
| Testes | `src/mocks/handlers.test.ts`, `src/features/profile/profile-wallet.test.tsx`, `src/features/session/auth-entry.test.tsx` |

Removido: `src/features/session/profile-page.tsx`.

### Endereços

- `GET /api/perfil` e `PUT /api/perfil` leem e gravam perfil (oito campos no PUT, sem senha na resposta).
- `GET /api/carteiras` e `PUT /api/carteiras/principal` leem e gravam a carteira principal.
- Sem sessão: 401, `Não autorizado.`
- Validação: frases de `profileMessages` e `walletMessages` conforme a spec.
- `POST /api/dev/reset` devolve perfil e carteira à semente.

Chaves de cache: `['usuario', id, 'perfil']` e `['usuario', id, 'carteiras']`. Sair continua apagando chaves que contêm o identificador.

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK (avisos pré-existentes de fast refresh nas rotas) |
| `pnpm test` | OK · 130 testes |

Playwright fora desta fatia, conforme spec.

## Riscos para review humano

Diff em paths críticos: contratos, API, mocks e ajuste em `auth-entry.test.tsx`. Senha gravada pode mudar nos cenários de teste HTTP.