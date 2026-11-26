# Fase 8 · Perfil e carteiras

## O que foi feito

`/perfil` mostra a sidebar `Meu perfil` e o formulário `Perfil do colecionador`. `/carteiras` mostra o mesmo miolo lateral com `Carteira principal`, texto de pagamento, formulário e bloco vazio de carteira secundária. A partir de 1440, sidebar e conteúdo ficam lado a lado; abaixo disso, a sidebar vem primeiro (cenário 16 da spec).

Ada e Bruno nascem com perfil e carteira vazios, exceto nome e e-mail no perfil. Conta nova herda nome e e-mail do cadastro.

## Como homologar

Pré-requisito: `pnpm dev`, mock ligado. Ada: `ada@kurio.test` / `kurio`.

- [ ] Em 1440, `/perfil` segue o contrato desktop: sidebar, grade em duas colunas, `Salvar`, avatar e `Alterar senha`.
- [ ] Em 390, mesma página em uma coluna, sidebar antes do formulário.
- [ ] Ada vê `Ada` e `ada@kurio.test` nos campos. Bruno vê os dados dele, não os da Ada.
- [ ] Salvar perfil válido atualiza sessão (nome e e-mail) e limpa os três campos de senha. E-mail de outra conta recusa. Senha com regras da spec.
- [ ] `/carteiras` na semente: placeholders de rede, tipo e endereço; secundária vazia.
- [ ] Salvar carteira grava só da pessoa logada; não copia do perfil; recibo da Ada continua `MetaMask`.
- [ ] `Alterar`, `Remover`, `Adicionar`, itens fora de escopo da sidebar e `Igual à carteira principal` não navegam.
- [ ] Sair na sidebar equivale ao Sair do topo e limpa cache privado.
- [ ] `POST /api/dev/reset` devolve perfil e carteira à semente.

## Endereços úteis

| Método | Caminho |
| --- | --- |
| GET | `/api/perfil` |
| PUT | `/api/perfil` |
| GET | `/api/carteiras` |
| PUT | `/api/carteiras/principal` |