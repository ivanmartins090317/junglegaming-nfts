# Fase 1 · Tokens, casca e rotas vazias

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-25-tokens-casca-rotas.md` |

## O que esta fase entrega

- A mesma casca em toda tela nomeada: marca `KURIO`, Início, Mercado, Criadores, Aprenda, busca, Carrinho e Entrar.
- O miolo mostra só o nome da tela. Nas rotas dinâmicas, o identificador aparece ao lado do nome.
- Um endereço desconhecido explica que a página não existe e oferece voltar ao início.
- A simulação sobe antes da pintura. O miolo não mostra "Mock ligado" nem "Mock desligado".

Não entrega: catálogo, detalhe com dado, carrinho com item, cotação, pedido, sessão, perfil com dado, carteira com dado, hero, blog, rodapé e barra inferior.

---

## Arquitetura da feature

```text
src/styles/tokens.css          # nove cores, raios 5, 6 e 15
src/styles/globals.css         # Tailwind aponta para esses tokens
src/components/ui/             # botão de página e campo
src/components/layout/         # casca, topo e miolo vazio
src/routes/                    # uma rota por tela, sem dado
src/main.tsx                   # simulação, depois o router
```

### Fluxo principal

1. `main.tsx` sobe o mock quando `VITE_ENABLE_MOCK` não é `false`.
2. Se a simulação falha, a tela mostra a frase da falha e o router não pinta.
3. Com a simulação pronta, ou desligada, o router pinta a casca e o miolo da rota.
4. Início e Mercado abrem `/`. Só Início fica ativo, e só em `/`.
5. Criadores e Aprenda não trocam o endereço.

---

## Homologação manual

- [ ] Em `/`, o fundo é ink, a marca é `KURIO`, e o miolo é só "Início". Início está ativo. Mercado não está.
- [ ] Não aparecem "Mock ligado", hero, grade, promo, blog nem rodapé.
- [ ] Carrinho abre `/carrinho`, com o badge vazio. Nenhum item da navegação fica ativo.
- [ ] Entrar abre `/entrar`. Criadores e Aprenda não mudam o endereço e não mostram sucesso.
- [ ] O clique em `KURIO` não troca de tela.
- [ ] A busca tem o nome "Busca", é somente leitura, não tem texto de exemplo e não grava `q` no endereço.
- [ ] `/nfts/rune-1` mostra "Detalhe rune-1". `/pedidos/ped-9` mostra "Confirmação ped-9".
- [ ] `/pagamento`, `/cadastro`, `/perfil` e `/carteiras` mostram só o nome da tela.
- [ ] `/blog` mostra "Esta página não existe." e o botão Início leva a `/`, com Início ativo.
- [ ] Em 1440 ou mais, o recuo horizontal é 120. Em 768, 414 e 390, o recuo é 28, numa coluna, sem barra inferior.
- [ ] Com `VITE_ENABLE_MOCK=false`, a casca é a mesma e não aparece "Mock desligado".

---

## Comandos

```bash
pnpm install
pnpm dev
pnpm test
```

Para abrir sem a simulação, no PowerShell:

```powershell
$env:VITE_ENABLE_MOCK="false"; pnpm dev
```

---

## Próxima fase

Link: [`docs/state/PENDENCIAS.md`](../state/PENDENCIAS.md)

Registro objetivo: [`docs/implementation/F1-tokens-casca-rotas.md`](../implementation/F1-tokens-casca-rotas.md)
