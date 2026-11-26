# Fase 4 · Sessão, login, cadastro e guarda

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-sessao-login-cadastro-guarda.md` |

## O que esta fase entrega

- Ada entra com `ada@kurio.test` e a senha `kurio`. Bruno entra com `bruno@kurio.test` e a mesma senha.
- Quem cria a conta já fica na sessão. O e-mail é comparado sem diferenciar maiúsculas. A senha é exata.
- A partir de 1440, a entrada é um painel sobre a página atual. Abaixo de 1440, `/entrar` e `/cadastro` ocupam a tela inteira.
- Sem sessão, perfil, carteiras, pagamento e a confirmação do pedido abrem essa entrada e, depois, voltam ao caminho pedido.
- Sair apaga a sessão e o cache privado da pessoa. O catálogo permanece.

Não entrega: carteira, pagamento, favorito guardado, carrinho, cotação, pedido nem tempo real.

---

## Arquitetura da feature

```text
src/lib/contracts/session.ts          # pessoa da sessão e frases
src/lib/api/session.ts                # entrar, ler, sair e cadastrar
src/lib/query/session.ts              # chave ['sessao'] e limpeza privada
src/features/session/                 # painel, telas, guarda e saída
src/mocks/                            # Ada, Bruno e a conta nova na loja viva
```

A tela não chama o cliente HTTP. O componente pede o cache. A guarda, que roda antes da rota, usa o mesmo cache. O componente e o gancho não importam o handler da simulação.

A sessão mora só na loja viva. O navegador não a grava. Recarregar a página faz a loja nascer de novo na semente, sem sessão. `POST /api/dev/reset` também zera a sessão e devolve o próximo identificador para `usr-3`.

### Onde a entrada aparece

1. A largura é lida de `window.innerWidth` no momento da ação ou da carga. Não há ouvinte de redimensionamento.
2. A partir de 1440, o botão Entrar do topo não troca de página. O endereço ganha `conta=entrar` ou `conta=cadastro` e conserva o caminho e a busca que já existia, inclusive `q`.
3. O X e a tecla Esc tiram `conta` e `retorno`. As abas trocam o formulário no mesmo painel.
4. Abrir `/entrar` ou `/cadastro` nesse desktop cai em `/?conta=entrar` ou `/?conta=cadastro`. O início continua atrás do painel.
5. Abaixo de 1440, inclusive 768 e 390, as duas rotas são a tela cheia, com margem 28, sem cabeçalho, sem menu e sem a página do mercado. O raio 40 não entra.
6. Quem já está na sessão e abre a entrada segue o `retorno` válido, ou vai para `/`. Não vê o formulário.

### Depois do sucesso

- Com `retorno` válido, a pessoa vai para esse caminho, inclusive a busca, como `/nfts/neon-vessel-552?q=neon`.
- `retorno` externo, com `//`, ou que aponte para `/entrar` ou `/cadastro`, cai em `/`.
- Sem `retorno`, o desktop fica na página que estava atrás do painel. Abaixo de 1440, vai para `/`.

### Guarda e saída

- Sem sessão, `/perfil`, `/carteiras`, `/pagamento` e `/pedidos/$pedidoId` não abrem.
- Abaixo de 1440 o destino é `/entrar?retorno=<caminho>`. A partir de 1440 é `/?conta=entrar&retorno=<caminho>`.
- `/`, o detalhe e `/carrinho` continuam públicos.
- No desktop, o lugar do Entrar vira `Sair`. Em `/perfil`, a pessoa vê o próprio e-mail e outro `Sair`. Esse é o sair no mobile.
- Sair numa página privada reabre a entrada. Sair numa página pública só encerra a sessão.
- Carteiras continua com o título `Carteiras`. Pagamento continua com `Revisão e envio`. A confirmação continua `Confirmação` mais o identificador do pedido.
- Blog, Criadores e Aprenda continuam visíveis e não navegam.
- `Esqueceu a senha?`, `Continuar com Google` e `Continuar com Facebook` ficam visíveis. O clique não navega e não mostra sucesso.
- Simulação desligada, ou falha de leitura que não seja o 401 do visitante, mostra `Não foi possível carregar a sessão.` e não abre a página privada.

### Frases

| Situação | Frase |
| --- | --- |
| Credencial errada | `E-mail ou senha não conferem.` |
| Nome, e-mail ou senha vazios | `Informe nome, e-mail e senha.` |
| Senhas diferentes | `As senhas não conferem.` |
| E-mail já usado | `Este e-mail já tem conta.` |
| Falha ao ler a sessão | `Não foi possível carregar a sessão.` |

---

## Homologação manual

- [ ] Em 1440, Entrar na home abre o painel em `/?conta=entrar`. O início continua visível, sem película escura.
- [ ] A aba `Criar conta` troca o formulário. O X e Esc fecham o painel e tiram `conta` do endereço.
- [ ] `/entrar` e `/cadastro` em 1440 viram `/?conta=entrar` e `/?conta=cadastro`.
- [ ] Em 390, `/entrar` e `/cadastro` são telas cheias, sem cabeçalho. O cadastro mostra `Criar perfil de colecionador` e `Criar perfil`.
- [ ] Ada entra com `ada@kurio.test` e `kurio`. Uma senha errada mostra `E-mail ou senha não conferem.`
- [ ] Um e-mail novo cria a conta e abre a sessão. O mesmo e-mail de novo mostra `Este e-mail já tem conta.` e não entra como Ada.
- [ ] Nome só com espaço, ou senhas diferentes, não cria a conta.
- [ ] Sem sessão, `/perfil`, `/carteiras`, `/pagamento` e `/pedidos/ped-9` abrem a entrada. Depois do sucesso, a pessoa volta ao caminho pedido.
- [ ] `retorno` com `https://fora.exemplo`, `//fora.exemplo`, `/entrar` ou `/cadastro` cai em `/`.
- [ ] Sem `retorno`, o desktop permanece na página de trás. Em 390, vai para `/`.
- [ ] Em `/perfil`, o e-mail da pessoa e `Sair` aparecem. Sair reabre a entrada.
- [ ] Recarregar a página perde a sessão. `POST /api/dev/reset` também zera a sessão.
- [ ] Esqueceu a senha, Google e Facebook não navegam.
- [ ] Com `VITE_ENABLE_MOCK=false`, a guarda não abre a página privada e o formulário mostra `Não foi possível carregar a sessão.`

---

## Comandos

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
```

O caminho de retorno está em `src/features/session/entry-location.test.ts`. O cache está em `src/features/session/session-cache.test.ts`. Os endereços estão em `src/features/session/session-http.test.ts`. O painel, as telas e a guarda estão em `src/features/session/auth-entry.test.tsx`.

## Próximo passo

Carrinho e cotação. A sessão desta fase é a guarda que essas telas passam a usar.
