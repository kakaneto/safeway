# Validação técnica das fontes de dados (13/10/2026)

Relatório do **passo 2**: testamos cada serviço com uma chamada de verdade, antes de escrever qualquer código do app. O resumo de cada fonte (limites, chave, licença) está em [../fontes-de-dados.md](../fontes-de-dados.md). Aqui ficam as **provas**: o que pedimos, o que voltou e o que isso muda.

> O REA não estava disponível nesta sessão. Esta investigação não é engenharia reversa: usamos as APIs públicas do jeito que a documentação de cada uma manda.

## Pergunta

1. Cada serviço do plano funciona de verdade para **Foz do Iguaçu**, chamado do navegador, de graça?
2. Dá para saber se **cada trecho** de uma rota a pé é iluminado?
3. O Valhalla devolve **rotas alternativas** para quem anda a pé?

## Alvo e licença

Serviços públicos de mapa, busca, rota, clima e alertas. Não copiamos código de nenhum deles. As licenças dos dados (ODbL, CC BY 4.0 etc.) estão em [../fontes-de-dados.md](../fontes-de-dados.md).

## Como testamos

- **Quando:** 13/10/2026, entre 14h40 e 15h40 (horário de Brasília).
- **Com quê:** `fetch` do Node.js 24, que é a mesma função que o navegador usa. O `curl` deste computador Windows falhou com o erro 43, que é um defeito do próprio curl com o Windows e não dos serviços.
- **Educação com os servidores:** um pedido por vez, com pausa entre eles, e um `User-Agent` dizendo quem somos (`SAFEWAY-validacao/0.1 (projeto social educativo ...)`). Mandamos também o cabeçalho `Origin` do GitHub Pages para ver se o navegador teria permissão de ler a resposta (CORS).
- **Lugares de teste**, todos encontrados pelos próprios testes:
  - Centro: Av. Juscelino Kubitschek (-25.5304, -54.5831)
  - Colégio Estadual Bartolomeu Mitre (-25.5463, -54.5844)
  - Hospital Municipal Padre Germano Lauck (-25.5194, -54.5763)

## Evidências encontradas

### Mapa

| Chamada                                                               | Resultado                                                                                | Tempo     | CORS |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- | ---- |
| OpenFreeMap, estilos `liberty`, `bright`, `positron`, `dark`, `fiord` | Todos HTTP 200. O estilo **`dark` existe** (47 camadas).                                 | 0,2–0,6 s | `*`  |
| OpenFreeMap, TileJSON `/planet`                                       | HTTP 200. Dados da versão `20261011_080001_pt`, ou seja, de **11/10/2026**. Zoom 0 a 14. | 0,2 s     | `*`  |
| OpenFreeMap, tile vetorial z14 do centro de Foz                       | HTTP 200, cerca de 200 KB, guardado em cache por até 10 anos.                            | 0,7 s     | `*`  |
| Tile raster do OpenStreetMap, z14 do centro de Foz                    | HTTP 200, imagem PNG de 35 KB.                                                           | 0,1 s     | `*`  |

### Busca de endereços

| Chamada                                                   | Resultado                                                                                     | Tempo     | CORS |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------- | ---- |
| Nominatim: buscar "Foz do Iguaçu, Paraná, Brasil"         | HTTP 200. Achou a cidade: relação OSM 297473, centro -25.5304, -54.5831.                      | 0,6 s     | `*`  |
| Nominatim: endereço do centro (reverse)                   | HTTP 200: "Avenida Juscelino Kubitschek, Jardim das Nações, ... 85864-190".                   | 0,8 s     | `*`  |
| Photon: "Hospital Municipal" perto de Foz, `lang=default` | HTTP 200. Primeiro resultado: Hospital Municipal Padre Germano Lauck.                         | **4,5 s** | `*`  |
| Photon: a mesma busca com `lang=pt` e com `lang=es`       | **HTTP 400:** "Language is not supported. Supported are: default, de, en, fr".                | 1,5–2,2 s | `*`  |
| Photon: autocompletar "Terminal de Transp" perto de Foz   | HTTP 200, mas **nenhum resultado em Foz**: vieram Chapecó (SC), Uribia e Medellín (Colômbia). | 2,6 s     | `*`  |
| Photon: "Colegio Estadual Bartolomeu Mitre"               | HTTP 200. Achou o colégio em Foz, mesmo com a palavra digitada sem acento.                    | 2,1 s     | `*`  |

### Rota a pé (Valhalla, servidor da FOSSGIS)

| Chamada                                                                         | Resultado                                                                                                                                 |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/status`                                                                       | Versão **3.9.1**. Mapa de rotas gerado em **13/10/2026 às 08:26** (atualizado no mesmo dia).                                              |
| Rota A (centro → colégio), `use_lit` 0 e depois 1                               | HTTP 200 em cerca de 0,25 s. **2,07 km, 27 min nos dois casos: rotas idênticas.** Instruções em português ("Caminhe para sul.").          |
| Rota B (hospital → colégio), `use_lit` 0 e depois 1                             | **4,05 km, 49 min nos dois casos: rotas idênticas.**                                                                                      |
| Rota A com `alternates: 2`                                                      | **2 alternativas**: 2,11 km (27 min) e 1,99 km (26 min).                                                                                  |
| Rota B com `alternates: 2`                                                      | **1 alternativa**: 4,62 km (57 min).                                                                                                      |
| Rota A com `exclude_polygons` (um quadrado de cerca de 80 m no meio do caminho) | A rota **desviou**: 2,11 km, sem nenhum ponto dentro do quadrado.                                                                         |
| `trace_attributes` pedindo `edge.lit`                                           | HTTP 200, mas **o campo de iluminação não vem**. Para cada trecho vêm só: `way_id`, `length`, `use`, `road_class`, `surface`, `sidewalk`. |
| `locate` com `verbose`                                                          | Também **não traz** informação de iluminação.                                                                                             |

O CORS veio `*` em todas as chamadas ao Valhalla.

### Iluminação nas ruas das rotas

Pegamos as **30 vias diferentes** que aparecem nas 5 rotas acima (as 2 principais e as 3 alternativas) e conferimos as etiquetas de cada uma.

| Fonte da conferência                                                | Resultado                                                                                                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API oficial do OpenStreetMap (`/api/0.6/ways.json`, uma chamada só) | 30 de 30 vias recebidas. **0 têm a etiqueta `lit`**, nem as avenidas principais (Brasil, Juscelino Kubitschek, República Argentina, Paraná, Jorge Schimmelpfeng). Só 1 tem `sidewalk` (calçada). |
| Overpass, instância alternativa `overpass.private.coffee`           | A mesma resposta: nenhuma via com `lit`. Levou **222 s**.                                                                                                                                        |

**Resultado: 0 m iluminados, 0 m sem luz e 100% "sem dado"** em todas as 5 rotas.

### Overpass (pontos de apoio e cobertura da cidade)

| Chamada                                                | Resultado                                                                                                  |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Instância principal `overpass-api.de`                  | **HTTP 504 em 4 de 6 consultas**, com a mensagem "The server is probably too busy to handle your request". |
| Pontos de apoio em Foz do Iguaçu (instância principal) | HTTP 200 em 11 s. **432 lugares**, dos quais só **52 (12%) informam o horário de funcionamento**.          |
| Cobertura de `lit` em todas as vias da cidade          | **Não foi possível medir.** As três instâncias falharam: duas com 504 e uma (`maps.mail.ru`) sem conexão.  |

Os 432 pontos de apoio, por tipo:

| Tipo no OSM                                                                      | Quantos | Com horário | Com telefone |
| -------------------------------------------------------------------------------- | ------: | ----------: | -----------: |
| Escola (`amenity=school`)                                                        |     165 |           1 |            1 |
| Farmácia (`amenity=pharmacy`)                                                    |      69 |           3 |            4 |
| Posto de combustível (`amenity=fuel`)                                            |      48 |          10 |            0 |
| Supermercado (`shop=supermarket`)                                                |      43 |          15 |            6 |
| Loja de conveniência (`shop=convenience`)                                        |      25 |           4 |            4 |
| Clínica/posto de saúde (`amenity=clinic`)                                        |      20 |           4 |            5 |
| Órgão público (`office=government`)                                              |      16 |           3 |            5 |
| Hospital (`amenity=hospital`)                                                    |      13 |           1 |            1 |
| Polícia (`amenity=police`)                                                       |      12 |           5 |            4 |
| Centro comunitário (`amenity=community_centre`)                                  |       5 |           0 |            0 |
| Bombeiros (`amenity=fire_station`)                                               |       4 |           0 |            0 |
| Biblioteca (`amenity=library`)                                                   |       4 |           1 |            0 |
| Outros (consultório, dentista, prefeitura, assistência social, doação de sangue) |       8 |           6 |            3 |

Conselho Tutelar, CRAS e CREAS aparecem pouco e com nomes despadronizados: "CRAS Leste", "CRAS LESTE", "Cras", "conselho tutelar 2".

### Outras fontes

| Chamada                                                              | Resultado                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Open-Meteo, previsão para Foz                                        | HTTP 200 em 0,9 s. 23,6 °C, garoa fraca (código 51). Nascer do sol às 06:06 e pôr do sol às 18:43. CORS `*`.                                                                                                                                                                   |
| OpenRouteService, rota a pé **sem chave**                            | HTTP 401: "Authorization field missing". A resposta de erro não traz CORS.                                                                                                                                                                                                     |
| Fogo Cruzado, `/api/v2/occurrences` e `/api/v2/states` **sem token** | HTTP 401: "Unauthorized access. Incorrect credentials."                                                                                                                                                                                                                        |
| INMET, feed RSS de avisos                                            | HTTP 200 em 1,2 s, com 97 avisos (73 citam o Paraná). O CORS libera o GitHub Pages.                                                                                                                                                                                            |
| INMET, detalhe de um aviso (formato CAP)                             | HTTP 200. Traz um **polígono** e a **lista de municípios com o código do IBGE**. Foz aparece como "Foz do Iguaçu - PR (4108304)" no aviso 56064 (tempestade, grau "Perigo", 14/10/2026). Esta resposta **não traz CORS**, então o navegador não consegue ler o detalhe direto. |

## O que aprendemos

1. **O mapa de Foz quase não diz quais ruas são iluminadas.** Nenhuma das 30 vias das rotas testadas tem a etiqueta `lit`, nem as avenidas do centro. Por isso o `use_lit` do Valhalla não mudou nenhuma rota: sem a informação, ele não tem como preferir ruas iluminadas. É a descoberta mais importante deste passo.
2. **Dá para saber a iluminação de cada trecho, juntando duas fontes.** O Valhalla não informa a iluminação, mas informa o `way_id` (o número da via no OpenStreetMap) e o comprimento de cada trecho. Com esses números, as etiquetas `lit` saem da Overpass ou de um arquivo preparado antes. Testamos esse caminho e ele funciona; hoje a resposta é "sem dado" em 100% das rotas.
3. **O Valhalla devolve rotas alternativas para pedestres:** 1 a 2 por pedido nos nossos testes.
4. **Desviar de áreas funciona:** o `exclude_polygons` tirou a rota de dentro do quadrado.
5. **A Overpass não aguenta uso em tempo real** pelo app: 4 de 6 consultas falharam no servidor principal, e a alternativa levou quase 4 minutos. Para os pontos de apoio, é melhor gerar um arquivo antes e não consultar a cada uso.
6. **O Photon não entende `pt` nem `es`** (só `default`, `de`, `en` e `fr`), é lento (2 a 4,5 s) e, mesmo com o viés de localização, trouxe resultados de outros países. Precisamos limitar a busca à região do piloto.
7. **"A consulta falhou" é diferente de "não há dado".** No primeiro teste, um erro 504 virou "100% sem dado" por um descuido do nosso script. No app, essa diferença precisa ser uma regra com teste em `src/regras/`.
8. **ORS e Fogo Cruzado exigem chave.** Num site estático (GitHub Pages), qualquer chave colocada no código fica visível para todo mundo. Isso vai contra a regra 11.
9. **Os avisos do INMET dá para filtrar por município** pelo código do IBGE (Foz = 4108304), mas o detalhe de cada aviso não pode ser lido direto pelo navegador.

## O que vamos usar e como

Estas são **propostas**. Elas serão decididas no plano da fase 1, com a sua aprovação.

- **Iluminação:** usar o caminho "Valhalla `way_id` + etiquetas `lit`" para a explicação "Por que esta rota". Enquanto o mapa não tiver dados, mostrar honestamente "dados insuficientes de iluminação", com a porcentagem de cada rota.
- **Cobrir a falta de dados de iluminação:** atividade da turma de mapear postes (`highway=street_lamp`) e ruas iluminadas (`lit=yes/no`) no OpenStreetMap. O trabalho seria feito de dia, em grupo e com adultos. O Valhalla da FOSSGIS atualiza o mapa de rotas todo dia, então o efeito apareceria rápido.
- **Pontos de apoio:** gerar um arquivo com os pontos de Foz a partir da Overpass por uma tarefa agendada no GitHub Actions, em vez de consultar a cada uso. Isso também protege a privacidade, porque a localização da pessoa não precisa ir para a Overpass.
- **Busca:** Photon com `lang=default` e `bbox` da região do piloto, esperando a pessoa parar de digitar antes de buscar. Nominatim só quando ela apertar "buscar".
- **Regra de erro:** separar "falhou", "sem dado" e "com dado" em todas as respostas.

## Dúvidas que ficaram

- **Quanto da cidade inteira tem `lit`?** Ainda não sabemos: não conseguimos medir com a Overpass sobrecarregada. Vamos repetir a medição em outro horário.
  - Como referência, o taginfo da Geofabrik mostra que só cerca de **2,8% das vias da Região Sul** têm a etiqueta `lit`. O dado é de 12/10/2026, levantado pela pesquisa de documentação.

## Dúvidas respondidas depois do teste

- **Como o Valhalla trata uma via sem `lit`?** **Como apagada.** O código mapeia `yes`, `24/7`, `automatic`, `dusk-dawn` e `sunset-sunrise` para aceso; `no`, `limited`, `disused` e a falta da etiqueta ficam como apagado (`lua/graph.lua`, linhas 421 a 429).
  - Com `use_lit=1`, um trecho apagado custa 8 vezes mais (`src/sif/dynamiccost.cc`, linha 456).
  - Como em Foz todas as vias testadas estão sem etiqueta, todas pagam o mesmo, e a rota não muda.
  - Quando algumas ruas ganharem `lit=yes`, a preferência por elas vai ser forte. Isso pode gerar desvios longos, então vamos testar valores menores.
- **Existe cadastro oficial de iluminação em Foz?** **Sim.** A concessão de iluminação pública foi assinada em 10/11/2025 e cobre cerca de 42 mil luminárias. Há um painel com mapa em <https://dashboard.ipfoz.com.br>.
  - O painel diz **"Todos os direitos reservados"**. Usar esses dados exige autorização por escrito da Prefeitura ou da concessionária.
- **Quem pode ter conta no OpenStreetMap?** Segundo os termos da OSMF, adotados em 2018:
  - **menores de 13 anos:** não podem usar;
  - **de 13 a 15 anos:** um adulto responsável cria a conta, sem dados pessoais, e o adolescente pode editar o mapa, mas não pode usar as partes sociais (diário, fóruns);
  - **16 anos ou mais:** a própria pessoa pode criar a conta.
  - Fonte: <https://osmfoundation.org/wiki/Terms_of_Use>.
- **O navegador consegue pedir rotas ao Valhalla?** **Sim.** O navegador faz uma checagem prévia (`OPTIONS`) antes de enviar JSON. O servidor respondeu 204, liberando `Content-Type` e `X-Client-Id` para qualquer origem.
