# Spec: MSW com dois usuários, reset e catálogo feliz

- Status: `draft`
- Data: 2026-11-26
- Autonomia: `tight`
- Projeto: Kurio
- Pedido original: a simulação passa a nascer com o catálogo que a tela de início já desenha, com duas pessoas de semente (favorito, carrinho e pedido diferentes) e com um recomeço que devolve a loja a essa semente. A tela de início continua nos dados estáticos.
- Plano: `docs/plans/reviews/2026-11-26-msw-usuarios-reset-catalogo.md`
- Decisão do plano: a seção Decisão está sem item em Entrou e sem item em Saiu. Esta spec repete o plano aprovado.

## 1. Objetivo

A loja simulada deixa de subir vazia. Quem pede o catálogo recebe as oito peças do início, na mesma ordem e com os mesmos valores. Quem pede uma peça recebe essa peça, ou a frase de ausência. Ada e Bruno nascem com favorito, carrinho e pedido distintos. Um recomeço devolve preço, favorito, carrinho e pedido à semente. A pessoa que abre o início continua vendo a tela estática.

## 2. Fora de escopo

- Trocar a grade, a busca, a aba, o filtro, a ordenação ou a página do início para a loja simulada.
- Tela de detalhe com dado e estado no endereço.
- Entrar, cadastro, guarda e qualquer leitura de sessão.
- Leitura ou escrita de favorito, carrinho, cotação ou pedido. O registro desses três existe só na semente.
- Tempo real, catálogo vazio, erro de catálogo, lentidão, cupom inválido e preço que mudou.
- Cliente HTTP, cache de tela e socket.
- Playwright, Lighthouse e `ARCHITECTURE.md`.
- Dependência nova.

## 3. Atores e pré-condições

- Quem usa: a prova da loja simulada. A visitante do início não ganha comportamento novo.
- O que precisa existir antes: a simulação liga por padrão e desliga pela configuração já existente. O worker sobe vazio e deixa passar pedido que não conhece. A tela de início já desenha as oito peças a partir da lista estática. A rota de detalhe existe com miolo vazio. O runner de teste já existe. Não há contrato de NFT ainda.

## 4. Comportamento esperado (cenários)

Linguagem da loja. Preço e total são string decimal. Quantidade é inteiro. A tela de início não é a prova destes cenários.

### Cenário 1: Catálogo feliz

- Dado: a loja acabou de nascer da semente.
- Quando: alguém pede o catálogo, em `/api/nfts`.
- Então: a resposta traz sucesso e as oito peças abaixo, nesta ordem, sem filtro, sem atraso, sem corpo vazio e sem erro. Cada peça repete o card estático do início: identificador, nome, preço, imagem, preço de comparação só quando a peça tiver, e a marca de raro só quando a peça for rara.

| Ordem | Identificador | Nome | Preço | Comparação | Imagem | Raro |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `emerald-ape-042` | Emerald Ape #042 | `1.19` | | `/home/emerald.png` | |
| 2 | `sage-nomad-009` | Sage Nomad #009 | `1.69` | | `/home/sage.png` | |
| 3 | `neon-vessel-552` | Neon Vessel #552 | `1.99` | `2.29` | `/home/neon.png` | sim |
| 4 | `cosmic-bloom-118` | Cosmic Bloom #118 | `1.29` | | `/home/cosmic.png` | |
| 5 | `violet-nomad-314` | Violet Nomad #314 | `1.39` | | `/home/violet.png` | |
| 6 | `ivory-baron-088` | Ivory Baron #088 | `1.79` | | `/home/ivory.png` | |
| 7 | `golden-beat-207` | Golden Beat #207 | `0.99` | | `/home/golden.png` | |
| 8 | `golden-signal-160` | Golden Signal #160 | `0.39` | | `/home/golden.png` | |

### Cenário 2: Peça que existe

- Dado: a loja está na semente.
- Quando: alguém pede `neon-vessel-552` em `/api/nfts/neon-vessel-552`.
- Então: a resposta traz sucesso e essa peça: nome Neon Vessel #552, preço `1.99`, comparação `2.29`, imagem `/home/neon.png`, rara.

### Cenário 3: Peça que não existe

- Dado: a loja está na semente.
- Quando: alguém pede um identificador que não está nas oito peças.
- Então: a resposta é não encontrado (404) e a mensagem é `NFT não encontrado.` A rota `/nfts/<identificador>` continua com o miolo vazio: esta fatia não pinta a peça na tela.

### Cenário 4: Ada e Bruno nascem separados

- Dado: a loja acabou de nascer da semente.
- Quando: a prova olha as duas pessoas.
- Então: não há favorito, linha de carrinho nem pedido em comum.

| Pessoa | Identificador | E-mail | Favoritos | Carrinho | Pedido |
| --- | --- | --- | --- | --- | --- |
| Ada | `usr-ada` | `ada@kurio.test` | `emerald-ape-042`, `neon-vessel-552` | `sage-nomad-009`, quantidade 1 | `ped-ada-1`: item `ivory-baron-088`, quantidade 1, total `1.79`, status `confirmado` |
| Bruno | `usr-bruno` | `bruno@kurio.test` | `golden-beat-207` | `cosmic-bloom-118`, quantidade 2 | `ped-bruno-1`: item `golden-signal-160`, quantidade 1, total `0.39`, status `confirmado` |

### Cenário 5: Recomeço devolve a semente

- Dado: a loja viva foi alterada depois de nascer. A alteração pode ser preço, favorito, carrinho ou pedido. A semente guardada não muda com essa alteração.
- Quando: alguém pede o recomeço em `/api/dev/reset`, sem corpo.
- Então: a resposta não traz conteúdo (204). Preço, favorito, carrinho e pedido voltam a um clone da semente, iguais ao cenário 1 e ao cenário 4.
- Quando: a prova altera a loja de novo e pede o recomeço outra vez.
- Então: a fotografia é a mesma da semente. O segundo recomeço não acumula a alteração anterior.

### Cenário 6: O início não passa a ler a loja

- Dado: a simulação está ligada e a loja tem o catálogo feliz.
- Quando: a pessoa abre `/`.
- Então: a grade continua saindo da lista estática do início. Busca, aba, filtro, ordenação e página do início não consultam a loja simulada.

### Cenário 7: Pedido que a loja não atende

- Dado: a simulação está ligada.
- Quando: chega um pedido que não é o catálogo, a peça nem o recomeço.
- Então: a simulação não responde no lugar dele. O worker continua exportado como `worker`.

## 5. Regras de negócio

- Regra 1: o catálogo feliz é a lista estática das oito peças do início. Mesma ordem, mesmo identificador, mesmo nome, mesmo preço, mesma comparação quando houver, mesma imagem e a mesma marca de raro quando houver.
- Regra 2: preço de peça e total de pedido permanecem string decimal. Quantidade permanece inteiro.
- Regra 3: a leitura desta fatia é só o catálogo e a peça. Favorito, carrinho e pedido ficam na semente. Não ganham leitura nem escrita próprias.
- Regra 4: Ada e Bruno não compartilham favorito, linha de carrinho nem pedido. Violet Nomad #314 está no catálogo e não entra na semente de nenhuma das duas.
- Regra 5: `confirmado` nesta semente só marca o pedido como já nascido em estado terminal. Não é o contrato da fatia de pedido.
- Regra 6: o recomeço não exige corpo. Ele substitui a loja viva por um clone da semente. Alterar a loja viva não suja a semente.
- Regra 7: a loja não filtra, não pagina, não atrasa, não devolve catálogo vazio e não falha a leitura feliz.
- Regra 8: os três endereços estáveis são `/api/nfts`, `/api/nfts/<identificador>` e `/api/dev/reset`. Estão aqui porque a implementação segue esta spec.
- Regra 9: componente, hook e rota não importam a semente nem o atendimento da simulação.
- Regra 10: nenhuma dependência nova. Cliente HTTP, cache de tela e socket ficam para a fatia em que a tela for chamá-los.

## 6. Critérios de Done desta feature

- [ ] Os sete cenários acima passam
- [ ] A prova automática começa na semente a cada caso. O servidor dessa prova abre e fecha no próprio arquivo de teste. Ela cobre as oito peças, a ausência, o recomeço depois de uma alteração na loja, e a diferença de favorito, carrinho e pedido entre Ada e Bruno
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm test` passa
- [ ] No navegador, `/` continua a tela estática e a leitura do catálogo devolve as oito peças
- [ ] Nenhuma mudança fora do escopo sem aprovação
- [ ] No fechamento da fatia, os docs vivos acompanham o status: plano, spec, implementation, manual-dev e pendências

Playwright não faz parte desta fatia.

## 7. Escopo de arquivos permitido

- Pode criar ou editar:
  - `src/lib/contracts/nft.ts`
  - `src/mocks/fixtures/catalog.ts`
  - `src/mocks/fixtures/users.ts`
  - `src/mocks/store.ts`
  - `src/mocks/handlers.ts`
  - `src/mocks/handlers.test.ts`
  - `src/mocks/browser.ts`
- Não pode editar sem pedido:
  - `src/features/home/**`
  - `src/routes/**`
  - `src/components/**`
  - `src/main.tsx`
  - `src/main.test.tsx`
  - `src/lib/api/**`
  - `src/lib/query/**`
  - `src/lib/socket/**`
  - `src/lib/money.ts`
  - `src/lib/utils.ts`
  - `src/features/session/**`
  - `src/features/checkout/**`
  - `src/features/order/**`
  - `public/mockServiceWorker.js`
  - `package.json`
  - `.env*`
  - `AGENTS.md`
  - spec já aprovada

## 8. Riscos e dúvidas abertas

- A lista das oito peças passa a existir na semente e na lista estática do início. A fatia do catálogo na tela aposenta a lista estática.
- Carrinho e pedido desta semente não são o contrato da fatia de pedido.
- O recomeço fica aberto em todo build que sobe a simulação. Esta prova não tem loja real.
- Os nomes Ada e Bruno não vêm de frame. Se o enunciado trouxer outras pessoas, a spec troca os identificadores antes do código.
- O contrato novo em `src/lib/contracts/nft.ts` é path crítico. Esta fatia grava só a leitura do NFT. O diff pede review humano.
- A semente isola favorito, carrinho e pedido por pessoa. Não há chave de idempotência nem evento de socket nesta fatia.
- A seção Decisão do plano segue vazia, e o índice de planos ainda marca os achados como pendentes. Nenhum achado de revisão entrou nesta spec.

## 9. Aprovação humana

- Aprovado por:
- Data:
- Observações:
