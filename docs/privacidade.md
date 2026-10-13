# Privacidade

Este documento é para **quem desenvolve** o app. A tela "Privacidade" do app (fase 1) vai trazer uma versão curta, em linguagem simples, para quem usa.

**Regra geral:** coletar o mínimo possível. A localização nunca sai do aparelho sem uma ação clara da pessoa e nunca fica guardada em servidor. Seguimos a LGPD e, como adolescentes também usam o app, o ECA Digital (Lei 15.211/2025).

## O que o app guarda

Tudo fica **só no aparelho**, no armazenamento local do navegador (`localStorage`):

| O quê                                                | Quando                        | Como apagar         |
| ---------------------------------------------------- | ----------------------------- | ------------------- |
| Idioma escolhido                                     | Fase 1                        | Botão "apagar tudo" |
| Favoritos (casa, escola, projeto)                    | Fase 1, só se a pessoa salvar | Botão "apagar tudo" |
| Preferências (tema claro ou escuro, camadas ligadas) | Fase 1                        | Botão "apagar tudo" |

## O que o app nunca guarda

- Nome, telefone, e-mail ou documento da pessoa.
- Histórico de rotas ou de lugares visitados, nem no aparelho, a não ser os favoritos que a pessoa salvou.
- Localização num servidor, de nenhum jeito.
- Contatos da agenda: o botão "Cheguei bem" só abre o compartilhamento do celular, e quem escolhe para quem mandar é a pessoa.
- Nenhum sistema de propaganda, rastreamento ou estatística de uso.

## Requisições de rede

Cada vez que o app busca alguma coisa na internet, alguém do outro lado recebe o pedido. Junto com qualquer pedido vão sempre o **endereço IP** do aparelho e o tipo de navegador. Por isso listamos **cada** requisição aqui.

### Versão atual (em construção, fase 0)

| Para onde                  | Quando         | O que envia                                             | Por quê                                                                                                                                                                                   |
| -------------------------- | -------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Pages (`github.io`) | Ao abrir o app | O pedido da página (IP e navegador, como qualquer site) | É onde o app fica hospedado. O GitHub explica o que registra na sua [declaração de privacidade](https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement) |

Nenhuma outra requisição. A tela atual não usa mapa nem busca.

### Planejadas para a fase 1 (a confirmar no plano)

| Para onde                              | Quando                                               | O que vai enviar                                                                    | Cuidado combinado                                                                 |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| OpenFreeMap (`tiles.openfreemap.org`)  | Ao mostrar o mapa                                    | Quais pedaços do mapa a pessoa está vendo, o que revela a região aproximada         | Nunca pré-baixar áreas                                                            |
| Tiles do OpenStreetMap (reserva)       | Só se o OpenFreeMap falhar                           | Quais pedaços do mapa a pessoa está vendo                                           | Nunca guardar para uso offline                                                    |
| Photon (`photon.komoot.io`)            | Enquanto a pessoa digita um destino                  | O texto digitado e o retângulo da região do piloto, **não** a localização da pessoa | Esperar a pessoa parar de digitar                                                 |
| Nominatim (reserva)                    | Só quando a pessoa aperta "buscar" e o Photon falhou | O texto digitado                                                                    | 1 pedido por segundo, com cache                                                   |
| Valhalla (servidor da FOSSGIS)         | Quando a pessoa pede uma rota                        | **As coordenadas de origem e de destino**                                           | Só depois de a pessoa apertar "traçar rota"; nada fica guardado no app            |
| Arquivos do próprio app (GitHub Pages) | Ao ligar a camada de pontos de apoio                 | Nada além do pedido do arquivo                                                      | Os pontos são gerados antes, sem consultar a Overpass com a localização da pessoa |

O **"Onde estou"** usa o GPS do aparelho e não manda nada para lugar nenhum. A posição só sai do aparelho se a pessoa usar essa posição como origem de uma rota, e aí vai para o Valhalla, como mostra a tabela.

Toda requisição nova precisa entrar nesta lista **antes** do pull request ser aceito.
