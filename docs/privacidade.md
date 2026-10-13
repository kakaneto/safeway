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

### Versão atual (protótipo da fase 1, 13/10/2026)

Esta lista foi conferida no código (`src/servicos/` e `src/componentes/MapaInterativo.tsx`) e num teste com o navegador.

| Para onde                                                | Quando                                                                      | O que envia                                                                                             | Por quê                                                                                                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Pages (`github.io`)                               | Ao abrir o app                                                              | O pedido da página e dos arquivos do app, incluindo os dados de Foz (`dados/*.json`)                    | É onde o app fica hospedado. O GitHub explica o que registra na sua [declaração de privacidade](https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement) |
| OpenFreeMap (`tiles.openfreemap.org`)                    | Ao mostrar o mapa                                                           | O estilo, as fontes, os ícones e quais pedaços do mapa a pessoa está vendo (revela a região aproximada) | Desenhar o mapa. O app não pré-baixa áreas                                                                                                                                                |
| Tiles do OpenStreetMap (`tile.openstreetmap.org`)        | Só se o OpenFreeMap falhar                                                  | Quais pedaços do mapa a pessoa está vendo                                                               | Mapa de reserva. Não é guardado para uso offline                                                                                                                                          |
| Photon (`photon.komoot.io`)                              | Enquanto a pessoa digita um destino (3 letras ou mais, depois de uma pausa) | O texto digitado e o retângulo de Foz, **não** a localização da pessoa                                  | Sugerir lugares                                                                                                                                                                           |
| Valhalla da FOSSGIS (`valhalla1.openstreetmap.de/route`) | Só quando a pessoa toca em "Traçar rota sugerida"                           | **As coordenadas de saída e de chegada** e o cabeçalho `X-Client-Id: safeway-prototipo`                 | Calcular a rota a pé                                                                                                                                                                      |
| Valhalla da FOSSGIS (`/trace_attributes`)                | Logo depois, uma vez para cada rota que a pessoa olhar                      | O desenho da rota (os mesmos pontos do pedido anterior)                                                 | Descobrir quais ruas formam a rota, para conferir a iluminação                                                                                                                            |
| Apps do próprio celular (telefone, SMS, WhatsApp)        | Quando a pessoa toca para ligar, em "Cheguei bem" ou no SMS 40199           | O que a pessoa decidir enviar, pelo próprio celular                                                     | O app não envia nada sozinho                                                                                                                                                              |

Nenhuma outra requisição. A Overpass e o Nominatim **não** são chamados pelo app: os pontos de apoio e a iluminação vêm de arquivos gerados antes (`scripts/gerar-dados.mjs`).

O **"Onde estou"** usa o GPS do aparelho e não manda nada para lugar nenhum. A posição só sai do aparelho se a pessoa usar essa posição como origem de uma rota, e aí vai para o Valhalla, como mostra a tabela.

Toda requisição nova precisa entrar nesta lista **antes** do pull request ser aceito.
