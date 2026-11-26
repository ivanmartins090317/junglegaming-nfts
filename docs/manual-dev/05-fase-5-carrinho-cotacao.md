# Fase 5 · Carrinho e cotação

| Status | Spec |
| --- | --- |
| concluída (código) · homologação manual pendente | `docs/specs/2026-11-26-carrinho-cotacao.md` |

## O que esta fase entrega

- `/carrinho` continua público. A casca e a busca já homologada ficam nas duas larguras.
- A partir de 1440 o corpo é a tabela, o resumo, as recomendações e o rodapé. Abaixo de 1440, inclusive 768 e 390, o corpo é uma coluna, com margem 28, barra de voltar e painel fixo no pé. A barra de atalhos some nessa rota.
- O visitante guarda as linhas em `sessionStorage` desta aba, na chave `kurio.carrinho.rascunho`. Recarregar mantém. Outra aba não vê. Fechar a aba esquece.
- Entrar ou criar conta funde o rascunho na loja da pessoa. A mesma peça soma a quantidade. Peça nova entra na ordem do rascunho. Identificador fora do catálogo é ignorado. O rascunho só some depois do sucesso.
- A cotação usa o preço atual do catálogo. A tela não soma ETH. Com linha, a taxa é `0.016 ETH` e o total tem três casas. Sem linha, subtotal, taxa e total são `0.00 ETH`. O desconto desta fatia é `(-) 00.00`.
- O selo do topo e o selo do carrinho na barra de baixo, nas telas que mostram essa barra, são a soma das quantidades. O `2` do atalho do centro continua `2`.

Não entrega: pagamento além da rota já existente, pedido, socket, cupom que muda o desconto, nem um botão de reset.

---

## Arquitetura da feature

```text
src/lib/contracts/cart.ts             # linha, cotação e frases
src/lib/money.ts                      # soma decimal em milésimos
src/lib/api/cart.ts                   # leitura, gravação, fusão e cotação
src/lib/query/cart.ts                 # chaves do cache
src/features/cart/                    # rascunho, tela e fusão
src/mocks/                            # loja viva das linhas
```

A tela não chama o cliente HTTP. O componente pede o cache. O componente e o gancho não importam o handler da simulação.

A sessão continua só na loja viva. Recarregar a página faz a loja nascer de novo na semente, sem sessão. O rascunho do visitante sobrevive a esse recarregar porque está no `sessionStorage` da aba.

### Quem está olhando

1. Sem sessão, `+`, `−` e a lixeira escrevem o rascunho e pedem de novo a leitura e a cotação.
2. Com sessão, os mesmos gestos gravam a loja da pessoa. A chave do cache inclui o identificador.
3. A quantidade mínima é 1. O `−` em 1 fica visível e desligado. A lixeira só existe a partir de 1440 e tira a linha sem modal.
4. No detalhe da peça carregada, `Incluir no carrinho` soma 1 para quem está olhando. O rótulo não muda. Não há aviso de sucesso.

### Fusão e saída

- O sucesso da entrada ou do cadastro envia o rascunho uma vez. Enquanto a tentativa não termina, não há segundo envio.
- Falha mantém a sessão, mantém o rascunho e mostra `Não foi possível guardar o carrinho.` na entrada e em `/carrinho`.
- Rascunho vazio não mostra essa frase e não soma de novo.
- Sair não copia o carrinho da pessoa para o rascunho. O topo volta a `Entrar`. Se a fusão tinha falhado e o rascunho ainda tem a peça, ele continua na aba.

### Fechar e o que não navega

- `Conectar e finalizar` vai para `/pagamento` só quando a lista já mostra ao menos uma linha. Vazio, carregando ou falha de leitura ficam em `/carrinho`.
- Sem sessão, a guarda já existente pede a entrada. Depois do sucesso, a fusão acontece antes de chegar em `/pagamento`.
- `Continuar explorando` só aparece a partir de 1440 e vai para `/`.
- Aplicar o cupom, os pontos do carrossel, Enviar, o chip de carteiras e os atalhos que já não navegavam continuam visíveis. O clique não navega e não mostra sucesso.
- O card de recomendação abre a peça. `Meu perfil` do rodapé do carrinho vai para `/perfil`.
- Em `/carrinho` nenhum item do topo fica ativo. Com sessão o botão do topo é `Sair`.

### Frases

| Situação | Frase |
| --- | --- |
| Lista ainda não chegou | `Carregando` |
| Lista vazia | `Seu carrinho está vazio.` |
| Falha ao ler | `Não foi possível carregar o carrinho.` |
| Falha da cotação | `Não foi possível calcular o total.` |
| Falha ao gravar uma linha | `Não foi possível atualizar o carrinho.` |
| Falha da fusão | `Não foi possível guardar o carrinho.` |

Na falha da cotação as linhas ficam. O resumo mostra a frase. A coluna Total e o preço grande do mobile ficam sem número. A tela não substitui o total por uma soma local.

---

## Homologação manual

- [ ] Visitante em `/nfts/emerald-ape-042` clica `Incluir no carrinho`. O rótulo continua o mesmo, a página não troca e o selo passa a `1`.
- [ ] `/carrinho` mostra a linha, `ID do token: emerald-ape-042`, subtotal `1.19 ETH`, taxa `0.016 ETH` e total `1.206 ETH`.
- [ ] Recarregar a aba mantém o rascunho. Outra aba abre o carrinho vazio.
- [ ] Ada entra com `ada@kurio.test` e `kurio` tendo Sage quantidade 2 e Emerald quantidade 1 no rascunho. A loja fica Sage quantidade 3 e Emerald quantidade 1, total `6.276 ETH`, selo `4`. O rascunho fica vazio.
- [ ] Sair mostra `Entrar` e `Seu carrinho está vazio.` Entrar de novo devolve o carrinho da Ada.
- [ ] Carrinho vazio: `Conectar e finalizar` permanece em `/carrinho`. Com linha e sessão, abre `/pagamento`.
- [ ] Aplicar um código deixa `(-) 00.00` e não muda o endereço. O ponto do meio das recomendações continua o ativo.
- [ ] Em 1440 aparecem a trilha, a tabela, as cinco recomendações e o rodapé. Mercado não fica ativo.
- [ ] Em 390 e em 768 a margem é 28, o título `Carrinho de NFTs` fica no centro, o painel fica no pé e a barra de atalhos não aparece. O voltar retorna à tela anterior, ou vai para `/` se a visita começou no carrinho.
