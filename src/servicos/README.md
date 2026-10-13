# Serviços

Aqui fica toda conversa com a internet: mapa, busca, rotas. Um arquivo por serviço (exemplo: `valhalla.ts`).

Antes de criar ou mudar um serviço:

1. Leia o que ele permite em `docs/fontes-de-dados.md` (limites, crédito, chave).
2. Liste a requisição em `docs/privacidade.md`: o que envia, para quem e por quê.
3. Devolva sempre um destes três resultados: **falhou**, **sem dado** ou **com dado**. Eles são diferentes e a tela mostra cada um de um jeito.
4. Nunca coloque chave ou senha aqui: tudo que está nesta pasta vai para o navegador.
