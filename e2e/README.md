# Playwright · Kurio

Suíte E2E alinhada ao mapa `docs/relatorio-testes-manuais.html` (FL-01 a FL-13).

## Pré-requisito

```bash
pnpm install
pnpm exec playwright install chromium
```

## Comandos

```bash
pnpm playwright
pnpm exec playwright test --ui
pnpm exec playwright test --project=chromium-desktop
pnpm exec playwright test --update-snapshots
pnpm exec playwright show-report
```

O `playwright.config.ts` sobe o Vite na porta `5173` (mock ligado) e na `5174` (`VITE_ENABLE_MOCK=false`).

## Projetos

| Projeto | Escopo |
| --- | --- |
| `chromium-desktop` | Fluxos principais em 1440 |
| `chromium-mobile` | Casos com tag `@mobile` |
| `visual-desktop` / `visual-mobile` | Regressão visual (FL-13) |
| `mock-off` | TC-08, TC-14, TC-39 sem mock |

Contas de teste: `ada@kurio.test` e `bruno@kurio.test`, senha `kurio`.