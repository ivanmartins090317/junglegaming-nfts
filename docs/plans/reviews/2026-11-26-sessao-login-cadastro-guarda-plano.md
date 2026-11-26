# Plano: Sessão, login, cadastro e guarda

- Status: `done`
- Data: 2026-11-26
- Slug: `sessao-login-cadastro-guarda`
- Autonomia: `tight`
- Spec: `docs/specs/2026-11-26-sessao-login-cadastro-guarda.md`
- Frames: `research/figma/desktop-login.png`, `research/figma/desktop-cadastro.png`, `research/figma/mobile-login.png`, `research/figma/mobile-cadastro.png`

## Plano

A pessoa entra ou cria a conta na composição do frame. No desktop, isso é o modal sobre a página atual. Abaixo de 1440, são as duas telas cheias. A sessão mora na loja viva. Sem sessão, perfil, carteiras, pagamento e a confirmação do pedido abrem essa mesma entrada e, depois, voltam ao caminho pedido. Sair apaga a sessão e o cache privado.

Decisões deste plano:

- A partir de 1440, Entrar não troca de página. Abre o modal. A aba `Criar conta` troca o formulário no mesmo painel. Fechar, ou a tecla Esc, devolve a página. O endereço ganha `conta=entrar` ou `conta=cadastro` para o painel continuar se a página for atualizada. Abrir `/entrar` ou `/cadastro` nesse desktop cai em `/?conta=entrar` ou `/?conta=cadastro`, com o início atrás do painel.
- Abaixo de 1440, `/entrar` e `/cadastro` são as telas cheias. A casca do mercado não aparece. `Crie uma conta` abre `/cadastro`. `Entre` abre `/entrar`. O raio 40 não entra: ele é só o frame do telefone.
- Textos, nesta ordem, como no frame. Desktop, aba Entrar: `Entre para gerenciar sua carteira, coleção e perfil de criador.` Desktop, aba Criar conta: `Crie seu perfil de colecionador e conecte sua carteira quando quiser.` O botão dessa aba é `Criar conta`. Mobile, cadastro: título `Criar perfil de colecionador` e botão `Criar perfil`. Login, exemplo do e-mail: `contato@email.com`. Cadastro, exemplos: `Nome de usuário`, `Digite seu e-mail`, `Senha`, `Confirmar senha`.
- O painel usa `color/surface-card` e borda medida, sem `box-shadow`. Campo, botão do modal e botão social usam raio 5. O botão das telas cheias usa raio 6. A borda do campo nestas telas é `color/primary`, a mesma do botão no frame. O exemplo do campo usa `color/secondary`. `Esqueceu a senha?` usa `color/primary`. Aba ativa de entrar usa `color/foreground`. Aba ativa de criar conta usa `color/text-accent`. Aba inativa usa `color/secondary`. Medida fina de espaço e de tipo sai do PNG na implementação, sem hex novo.
- Olho, fechar, Google e Facebook são SVG no próprio componente, sem biblioteca. As cores de marca do Google e do Facebook ficam só dentro desses dois desenhos, não em `tokens.css`.
- Ada e Bruno entram com a senha `kurio` e passam a ter nome `Ada` e `Bruno`. A resposta da sessão traz identificador, nome e e-mail. A senha não volta. E-mail é comparado sem diferenciar maiúsculas. Senha é exata. Confirmar senha precisa ser igual à senha. Nome vazio não cria conta.
- Endereços: `POST /api/sessao` entra, `GET /api/sessao` lê, `DELETE /api/sessao` sai, `POST /api/cadastro` cria. Credencial errada: 401, `E-mail ou senha não conferem.` E-mail já usado: 409, `Este e-mail já tem conta.` Campo obrigatório vazio: 400, `Informe nome, e-mail e senha.` Senhas diferentes: 400, `As senhas não conferem.` Visitante no `GET` recebe 401, e a tela trata como sem sessão.
- Cadastro grava a pessoa na loja viva, com favorito, carrinho e pedido vazios, e já abre a sessão. O identificador seguinte é `usr-3`. `POST /api/dev/reset` zera a sessão e devolve a semente. O cliente não guarda a sessão por conta própria.
- Guarda em `/perfil`, `/carteiras`, `/pagamento` e `/pedidos/$pedidoId`. Sem sessão, abaixo de 1440 a rota vai para `/entrar?retorno=<caminho>`. No desktop, vai para `/?conta=entrar&retorno=<caminho>`. `retorno` só vale se for caminho interno desta app e não for entrar nem cadastro. Caminho inválido cai em `/`. `/`, o detalhe e `/carrinho` continuam públicos.
- Chave `['sessao']`. Chave privada inclui o identificador da pessoa. Sair remove `['sessao']` e toda chave com esse identificador. `['nfts']` fica. Não há socket nesta fatia.
- Simulação desligada ou falha de leitura: a guarda não abre a tela privada e o formulário mostra `Não foi possível carregar a sessão.`
- Os frames não desenham a sessão aberta. No desktop, o lugar do Entrar vira `Sair`, na mesma peça de botão. Em `/perfil`, a pessoa vê o próprio e-mail e `Sair`, que é a saída no mobile. Carteiras, pagamento e confirmação continuam só com o nome da tela.
- `Esqueceu a senha?`, `Continuar com Google` e `Continuar com Facebook` ficam visíveis. O clique não navega e não mostra sucesso.

### Passos

1. Gravar o contrato da sessão e o nome e a senha na semente. A loja viva passa a saber quem está na sessão. Reset limpa essa sessão.
2. Atender os quatro endereços. O teste que hoje espera `GET /api/sessao` sem resposta passa a usar outro caminho desconhecido.
3. Ligar o cliente HTTP e o cache. O router consulta a sessão antes de pintar a rota privada.
4. Montar um formulário só, nas duas composições. Desktop: modal sobre a página, abas e fechar. Abaixo de 1440: as telas cheias, sem a casca. Google, Facebook e `Esqueceu a senha?` não navegam.
5. A guarda honra `retorno`. A casca que hoje exige o nome cru nas rotas privadas passa a esperar a entrada quando não há sessão. O teste que exige o link Entrar para `/entrar` passa a esperar o modal no desktop.
6. Testar `retorno`, a chave privada e os handlers. Rodar `pnpm typecheck`, `pnpm lint` e `pnpm test`. No navegador, em 1440 e em 390: modal, telas cheias, Ada, cadastro, guarda e sair.

### Arquivos

- Criar ou alterar:
  - `src/lib/contracts/session.ts`
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/lib/api/session.ts`
  - `src/lib/query/session.ts`
  - `src/features/session/`
  - `src/routes/entrar.tsx`
  - `src/routes/cadastro.tsx`
  - `src/routes/perfil.tsx`
  - `src/routes/carteiras.tsx`
  - `src/routes/pagamento.tsx`
  - `src/routes/pedidos/$pedidoId.tsx`
  - `src/routes/index.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/app-shell.tsx`
  - `src/components/layout/app-shell.test.tsx`
  - `src/main.tsx`
- Não mexer:
  - `src/lib/contracts/nft.ts`
  - `src/lib/money.ts`
  - `src/lib/socket/**`
  - `src/styles/tokens.css`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `src/features/catalog/**`
  - `src/features/home/**`
  - `src/features/detail/**`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - specs já aprovadas

### Fora de escopo

- Recuperar senha. Entrar de verdade com Google ou Facebook.
- Favorito guardado, carrinho com item, cotação, pedido, recibo e socket.
- Dados de perfil além do e-mail, e qualquer dado de carteira.
- Guarda no carrinho e no catálogo.
- Sessão gravada no navegador e sessão em mais de uma aba.
- Dependência nova. Hex novo em `tokens.css`. `box-shadow`.
- Playwright, Lighthouse e `ARCHITECTURE.md`.

### Riscos

- A borda `color/primary` no campo destas telas é leitura do frame. O campo de busca do topo continua na borda já usada hoje.
- As marcas Google e Facebook trazem cor fora das nove. Elas ficam presas no SVG. Se isso for recusado, o botão social fica só com o texto, na cor medida.
- Não há frame de sessão aberta. `Sair` reutiliza a peça do Entrar até existir esse desenho.
- `retorno` mal filtrado abriria um endereço de fora. A função só aceita caminho interno.
- O modal no desktop muda o teste da casca que hoje exige `href="/entrar"`.

### Paths críticos

- Toca path crítico: sim
- Quais: `src/features/session/**`, `src/lib/contracts/session.ts`, `src/lib/api/session.ts`, `src/mocks/**`. Isolamento por pessoa entra na chave do cache. Sair limpa esse cache. Não há chave de idempotência nem evento de socket nesta fatia.

## Decisão

Preenchida depois da triagem dos achados. Até lá, deixe em branco.

- Entrou:
- Saiu:
