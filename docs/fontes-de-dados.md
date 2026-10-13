# Fontes de dados

Este documento lista os serviços de que o SAFEWAY depende ou pode depender: o que cada um oferece, os limites, se pede chave, a licença e quanto custaria se o app crescer.

- **Atualizado em:** 13/10/2026.
- **Provas dos testes** (o que pedimos e o que voltou): [investigacoes/2026-10-13-validacao-tecnica.md](investigacoes/2026-10-13-validacao-tecnica.md).
- **Legenda:**
  - ✅ testado de verdade;
  - 📄 tirado da documentação oficial;
  - ❓ **não confirmado** (não achamos fonte oficial; não presuma).

## Resumo

| Fonte                           | O que fornece                                                                                          | Tempo real ou histórico                                        | Cobertura                                                       | Limites                                                                                              | Precisa de chave?                                                                                  | Licença                                                              | Limitações                                                                                                             | Custo se o app crescer                                                                                       | Teste (13/10)                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **OpenFreeMap**                 | Mapa vetorial, estilos prontos (inclusive escuro, `dark`), fontes e ícones                             | Atualizado toda semana. No teste, dados de 11/10/2026          | Mundo                                                           | Nenhum limite publicado. Proibido coletar dados de forma automática                                  | Não                                                                                                | Dados ODbL; estilos CC BY 4.0. Crédito obrigatório                   | Sem garantia; pode acabar sem aviso. Quem integra precisa ter 18 anos ou mais                                          | Grátis. Servidor próprio: 200 a 400 GB de disco                                                              | ✅ 200, CORS liberado                        |
| **Tiles do OpenStreetMap**      | Imagens prontas do mapa padrão (reserva)                                                               | Quase tempo real (minutos)                                     | Mundo                                                           | Sem número. Proibido uso offline e pré-baixar. Cache de no mínimo 7 dias                             | Não                                                                                                | Dados ODbL. Crédito "© OpenStreetMap contributors" visível           | Sem garantia. Pode bloquear sem aviso. "Serviços que pedem doações" podem perder o acesso                              | Não há plano pago. Provedor comercial ou servidor próprio (preço ❓)                                         | ✅ 200                                       |
| **Photon**                      | Busca de endereço enquanto a pessoa digita                                                             | Dados atualizados a cada minuto (📄)                           | Mundo                                                           | "Uso razoável"; abuso é bloqueado                                                                    | Não                                                                                                | Software Apache 2.0; dados ODbL                                      | **Não aceita `pt` nem `es`.** Lento (2 a 4,5 s). Trouxe resultados de outros países                                    | Servidor próprio ou GraphHopper (grátis só não comercial; 69 €/mês)                                          | ✅ 200; ❌ 400 com `pt` e `es`               |
| **Nominatim**                   | Busca de endereço (sem autocompletar) e endereço de um ponto                                           | Minutos                                                        | Mundo                                                           | **1 pedido por segundo somando todos os usuários do app.** Proibido autocompletar. Guardar em cache  | Não                                                                                                | Software GPL; dados ODbL                                             | Sem garantia. O app deve poder trocar de serviço sem atualização. Regra especial para IA (ver abaixo)                  | Servidor próprio (mundo: 1 TB) ou provedores (LocationIQ grátis até 5.000/dia)                               | ✅ 200                                       |
| **Valhalla (servidor FOSSGIS)** | Rota a pé com instruções em português, alternativas, desvio de áreas e preferência por ruas iluminadas | Mapa de rotas refeito todo dia. No teste, gerado em 13/10/2026 | Mundo                                                           | 1 pedido por segundo. Sites com muito tráfego não são permitidos                                     | Não. Apps publicados devem avisar e mandar `X-Client-Id`                                           | Software MIT; dados ODbL                                             | Servidor da comunidade, sem garantia. **Não informa a iluminação de cada trecho.** Rua sem etiqueta conta como apagada | Servidor próprio (custo ❓) ou Stadia Maps (grátis para uso não comercial até cerca de 10 mil rotas por mês) | ✅ 200 em 0,25 s; alternativas ✅; desvio ✅ |
| **OpenRouteService**            | Rota a pé, até 3 alternativas, desvio de áreas                                                         | Edições do OSM levam de 2 a 3 semanas para aparecer            | Mundo                                                           | 2.000 rotas por dia e 40 por minuto                                                                  | **Sim, e a chave não pode ficar no navegador**                                                     | Software GPL-3.0; resultados CC BY-SA 4.0                            | Nada sobre iluminação. Precisa de servidor para esconder a chave                                                       | Grátis. Há plano para ONGs (limites ❓)                                                                      | ✅ 401 sem chave (esperado)                  |
| **Overpass API**                | Consulta aos dados do OSM (pontos de apoio, etiquetas das ruas)                                        | Quase tempo real (minutos)                                     | Mundo                                                           | Cerca de 10.000 consultas e 1 GB por dia, somando todos os usuários. Uso recorrente: dividir por 100 | Não                                                                                                | Dados ODbL; software AGPL-3.0                                        | **Sobrecarregada: 4 de 6 consultas falharam.** A documentação desaconselha usar como base de um app                    | Gerar arquivo antes (grátis) ou serviço pago (a partir de 40 €/mês)                                          | ⚠️ instável                                  |
| **Fogo Cruzado**                | Registros de tiroteios (local, data, vítimas)                                                          | Tempo real e histórico desde 2016                              | Grande Rio, Recife, Salvador e Belém. **Foz do Iguaçu não tem** | Não documentados                                                                                     | **Sim:** cadastro aprovado, depois login com e-mail e senha                                        | "Uso livre", com selo Creative Commons sem tipo definido (❓)        | Não serve para o piloto. A senha exige servidor (fase 2)                                                               | Grátis                                                                                                       | ✅ 401 sem token (esperado)                  |
| **Open-Meteo**                  | Clima atual, previsão e hora do nascer e do pôr do sol                                                 | Previsão (de modelo, não de estação) e histórico               | Mundo                                                           | 600 por minuto, 10.000 por dia, 300.000 por mês. Só uso não comercial                                | Não                                                                                                | Dados CC BY 4.0. Link "Weather data by Open-Meteo.com" junto do dado | Sem garantia. Anúncio ou assinatura no app viram uso comercial                                                         | A partir de 29 €/mês                                                                                         | ✅ 200                                       |
| **Defesa Civil (alertas)**      | Alertas oficiais de desastre (chuva forte, vendaval etc.)                                              | Tempo real                                                     | Brasil inteiro, inclusive Foz                                   | Não se aplica: não há API pública                                                                    | Não há API. A pessoa se cadastra por SMS 40199 ou WhatsApp. O alerta no celular chega sem cadastro | ❓                                                                   | Nenhum feed público encontrado. O alerta no celular só sai em português                                                | Grátis                                                                                                       | — (sem API para testar)                      |
| **INMET (avisos de tempo)**     | Avisos meteorológicos oficiais, com a lista de municípios e o polígono da área                         | Tempo real                                                     | Brasil                                                          | Não publicados (❓)                                                                                  | Não                                                                                                | ❓                                                                   | O detalhe de cada aviso não pode ser lido direto pelo navegador (sem CORS)                                             | Grátis                                                                                                       | ✅ 200; Foz aparece pelo código IBGE 4108304 |

## Detalhes por fonte

### OpenFreeMap

- **Endereços:** `https://tiles.openfreemap.org/styles/dark` (escuro), `/styles/liberty`, `/styles/bright`, `/styles/positron`, `/styles/fiord` e o TileJSON `https://tiles.openfreemap.org/planet`.
- **Estilo escuro:** é uma cópia do estilo do OpenMapTiles, que o próprio OpenFreeMap chama de "not yet complete". Vamos ajustar as cores do nosso tema por cima dele.
- **Termos de uso** (atualizados em 09/09/2026, 📄):
  - "You must be at least 18 years old" vale para quem integra o mapa. Quem só usa o mapa pode ter qualquer idade. **Quem publica o SAFEWAY precisa ser uma pessoa adulta ou a organização.**
  - Proíbe "collect data from the service in automated ways without permission": **não vamos pré-baixar áreas do mapa.**
- **Crédito:** vem pronto no estilo: "OpenFreeMap © OpenMapTiles Data from OpenStreetMap".
- **Fontes:** <https://openfreemap.org/>, <https://openfreemap.org/tos/>, <https://github.com/hyperknot/openfreemap>.

### Tiles do OpenStreetMap (reserva)

- **Endereço:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
- **Política de uso** (📄):
  - "Offline use is not permitted".
  - Proíbe pré-baixar cidades "just in case".
  - Cache de "at least 7 days".
  - O navegador precisa mandar o cabeçalho Referer, então o app não pode usar uma `Referrer-Policy` que o bloqueie.
  - O crédito precisa ficar visível no mapa: "Do not hide attribution beneath UI".
  - Avisa que "Commercial services, or those that seek donations" podem perder o acesso a qualquer momento.
- **Fonte:** <https://operations.osmfoundation.org/policies/tiles/>.

### Photon

- **Endereço:** `https://photon.komoot.io/api/?q=...&bbox=...&limit=...` (e `/reverse`).
- **Idiomas:** o servidor público só aceita `lang=default`, `de`, `en` e `fr` (✅ testado). Em Foz, `default` devolve os nomes locais, em português.
- **Parâmetros úteis:** `bbox` (limita à região), `lat`/`lon` (dá preferência a um lugar), `limit`, `layer`.
- **Uso justo:** a komoot pede um limite razoável. O abuso é "throttled or completely banned". Não há garantia de funcionamento.
- **Fontes:** <https://photon.komoot.io/>, <https://github.com/komoot/photon>.

### Nominatim

> **Política de uso:** <https://operations.osmfoundation.org/policies/nominatim/>. A própria política exige que assistentes de IA que sugerem o Nominatim mostrem esse link e expliquem as restrições. Ela também diz que o código gerado por IA precisa seguir todas as regras. As restrições principais são as quatro a seguir.

1. **No máximo 1 pedido por segundo para o app inteiro**, somando todos os usuários.
2. **Proibido autocompletar** ("you must not implement such a service on the client side").
3. **Guardar os resultados em cache.** O app também precisa conseguir trocar de serviço sem atualização de software.
4. A política proíbe que plataformas de "no-code, low-code ou vibe-coding" ofereçam o Nominatim como serviço genérico de busca. No SAFEWAY, o uso é uma decisão consciente da equipe, só como reserva, quando a pessoa aperta "buscar". Essa decisão está registrada em [decisoes.md](decisoes.md).

### Valhalla (servidor da FOSSGIS)

- **Endereço:** `https://valhalla1.openstreetmap.de/route` (versão 3.9.1 no teste).
- **Navegador:** o servidor aceita a checagem prévia do navegador (`OPTIONS` respondeu 204, liberando `Content-Type` e `X-Client-Id`).
- **Opções a pé que importam:**
  - `use_lit`: de 0 a 1. Multiplica o "custo" de trechos sem luz por ×1 (com 0), ×2 (com 0,5) ou ×8 (com 1). Conferido no código: `src/sif/dynamiccost.cc`, linha 456.
  - **Quais valores contam como aceso.** Contam como aceso: `yes`, `24/7`, `automatic`, `dusk-dawn` e `sunset-sunrise`. Contam como apagado: `no`, `limited`, `disused` **e a falta da etiqueta** (`lua/graph.lua`, linhas 421 a 429).
  - `alternates`: até 2 alternativas, só com 2 pontos (origem e destino).
  - `exclude_polygons`: até 10 km de perímetro somado e 100 vértices (padrão do software).
  - `shortest: true` desliga todas as preferências, inclusive `use_lit`.
- **Termos da FOSSGIS** (📄):
  - "Maximum one request per second".
  - Identificar o app.
  - Crédito do OSM com link para <https://www.openstreetmap.org/fixthemap>.
  - E-mail de contato visível.
  - Sites de muito tráfego não são permitidos.
  - Recomendam não fixar o endereço do servidor no código.
  - O README pede que apps publicados avisem nas _Discussions_ do GitHub e mandem o cabeçalho `X-Client-Id`.
- **Fontes:** <https://valhalla.github.io/valhalla/api/route/api-reference/>, <https://fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen/>, <https://github.com/valhalla/valhalla>.

### OpenRouteService

- **Novo endereço:** `https://api.heigit.org/openrouteservice`. O antigo, `api.openrouteservice.org`, está marcado como "deprecated" (📄).
- **A chave "must not be used client-side"** (FAQ oficial). Num site estático como o nosso, ela ficaria visível para qualquer pessoa, o que quebra a regra 11. Por isso o ORS só pode entrar quando houver uma função de servidor (fase 2 ou depois).
- **Os termos alertam** contra uso em que um erro possa causar "death, loss or injury". É mais um motivo para o app nunca prometer segurança.
- **Fontes:** <https://giscience.github.io/openrouteservice/frequently-asked-questions>, <https://openrouteservice.org/restrictions/>.

### Overpass API

- **Endereço principal:** `https://overpass-api.de/api/interpreter`. Alternativas sem chave: `overpass.private.coffee` e `maps.mail.ru` (VK Maps).
- **Política** (📄):
  - Cerca de 10.000 consultas e 1 GB por dia.
  - "If you have an app or website, then the usage counts towards the sum of requests made by all your users".
  - A documentação considera problemático "relying on the public instances as backend" de um app.
- **No teste:** a principal respondeu 504 ("server is probably too busy") em 4 de 6 consultas, e a alternativa levou 222 s.
- **Fontes:** <https://dev.overpass-api.de/overpass-doc/en/preface/commons.html>, <https://wiki.openstreetmap.org/wiki/Overpass_API>.

### Fogo Cruzado

- **Cobertura:** "todas as cidades das regiões metropolitanas do Rio de Janeiro, Recife, Salvador e Belém" (57 municípios). **Foz do Iguaçu e o Paraná não têm cobertura.**
- **Acesso:**
  - pedido pelo formulário <https://api.fogocruzado.org.br/sign-up>;
  - depois `POST /auth/login` com e-mail e senha, que devolve um token válido por 1 hora.
- **Fontes:** <https://api.fogocruzado.org.br/>, <https://fogocruzado.org.br/perguntas-frequentes/>.

### Open-Meteo

- **Uso não comercial** inclui "non-profit websites or apps that do not have subscriptions or advertising" e conteúdo educativo.
- **Crédito:** "You must include a link next to any location Open-Meteo data are displayed".
- **Fontes:** <https://open-meteo.com/en/terms>, <https://open-meteo.com/en/pricing>.

### Defesa Civil e INMET

- **SMS 40199:**
  - Para cadastrar, envie o CEP. Envie um SMS para cada CEP.
  - `CONSULTAR` lista os CEPs cadastrados. `SAIR` + CEP cancela um deles. `AJUDA` mostra os comandos.
  - Gratuito para enviar e receber.
  - Fontes: <https://www.gov.br/pt-br/servicos/solicitar-cadastro-para-recebimento-de-avisos-e-alertas-de-desastres>, <https://www.defesacivil.pr.gov.br/Pagina/Alertas-da-Defesa-Civil>.
- **WhatsApp:** (61) 2034-4611. Mande "oi" e cadastre a sua localização, o CEP ou o município.
- **Defesa Civil Alerta (alerta no celular):**
  - Sem cadastro.
  - Funciona no Brasil inteiro desde 01/10/2025 e no Paraná desde 04/12/2024.
  - Só chega a celulares 4G/5G lançados a partir de 2020.
  - Hoje só em português.
- **Incidente:** em 20/06/2026, uma invasão fez disparar um alerta falso no Paraná (nota oficial do Governo do PR). O app nunca deve repetir alertas sem mostrar a fonte e o horário (regra 9).
- **Feed público:** a Idap, plataforma da Defesa Civil que envia os alertas, deve guardar os alertas em formato CAP, mas **não achamos nenhum endereço público** (❓).
- **INMET:**
  - O feed `https://apiprevmet3.inmet.gov.br/avisos/rss` funciona (✅) e libera o navegador.
  - Cada aviso tem um detalhe em CAP 1.2, com municípios e polígono, mas sem CORS.

## Outras fontes que encontramos

| Fonte                                                                                        | O que tem                                                                                                           | Licença                            | Como podemos usar                                                                                                                                             |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CNES** (Ministério da Saúde)                                                               | Postos de saúde e hospitais com endereço, telefone, turno e coordenadas                                             | Creative Commons Atribuição (📄)   | Gerar um arquivo antes (a API não libera o navegador). Fonte: <https://dadosabertos.saude.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude> |
| **Iluminação pública de Foz** (concessão assinada em 10/11/2025, cerca de 42 mil luminárias) | Painel com mapa e lista de pontos com endereço, tipo de lâmpada e data da troca                                     | **"Todos os direitos reservados"** | **Só com autorização por escrito** da Prefeitura ou da concessionária. Fonte: <https://dashboard.ipfoz.com.br>                                                |
| **Prefeitura de Foz do Iguaçu**                                                              | Telefones do Conselho Tutelar: **(45) 2105-8633** (Conselho I) e **(45) 3901-3265** (Conselho II); lista dos 5 CRAS | ❓                                 | Telefones na tela "Ajuda agora", sempre com fonte e data. Fonte: <https://www.foz.pr.gov.br/mapa-site/> (página de 12/06/2026)                                |
| **Polícia Civil do PR**                                                                      | 20 unidades em Foz com endereço e telefone, sem coordenadas                                                         | ❓                                 | Curadoria manual para `src/dados/pontos-de-apoio.json`. Fonte: <https://www.policiacivil.pr.gov.br/webservices/listaTelefonica>                               |

## Números de emergência (para a tela "Ajuda agora")

- **No Brasil, segundo a Anatel:**
  - "Todas as chamadas para os serviços públicos de emergência são gratuitas", incluindo 100, 180, 188, 190, 192, 193 e 199.
  - No celular, **112 e 911 também levam à Polícia Militar**.
  - Com o crédito pré-pago acabado, ainda dá para ligar para emergência.
  - Fontes: <https://www.gov.br/anatel/pt-br/regulado/numeracao/codigos-nacionais/servicos-de-utilidade-publica-e-de-emergencia>, <https://www.gov.br/anatel/pt-br/consumidor/conheca-seus-direitos/suspensao>.
- **No Paraguai (Ciudad del Este):**
  - 911: sistema único que inclui polícia ([Lei 4739](https://www.bacn.gov.py/leyes-paraguayas/3143/crea-el-sistema-911-de-atencion-despacho-y-seguimiento-de-comunicaciones-de-emergencias));
  - 141: ambulância ([Ministério da Saúde do Paraguai](https://www.mspbs.gov.py/portal/157/ciudadania-puede-solicitar-atencion-en-salud-llamando-al-141.html));
  - 132: bombeiros.
- **Na Argentina (Misiones):**
  - 911: polícia ([Polícia de Misiones](https://policiamisiones.gob.ar/));
  - 107: ambulância ([Saúde de Misiones](https://salud.misiones.gob.ar/unidad-central-de-emergcias-y-traslados/));
  - 100: bombeiros.
- **Perto da fronteira:**
  - A Claro avisa que o celular "poderá ser registrado na rede da operadora estrangeira".
  - **O que acontece ao discar 190 nessa situação: ❓ não confirmado.**
  - Fonte: <https://www.claro.com.br/celular/roaming-internacional/como-usar-celular-no-exterior>.

## O que isso muda no projeto

As decisões ficam registradas em [decisoes.md](decisoes.md). As propostas que dependem de aprovação vão para o plano da fase 1.

1. **Quase não há dado de iluminação no OSM em Foz.** O app precisa dizer "dados insuficientes" com honestidade. Para melhorar isso, há dois caminhos:
   - a turma mapear a iluminação no OpenStreetMap;
   - pedir à Prefeitura autorização para usar o cadastro oficial.
2. **Overpass:** gerar os arquivos antes, em vez de consultar a cada uso. Isso também protege a privacidade.
3. **Busca:**
   - Photon com `lang=default` e limitado à região;
   - Nominatim só quando a pessoa aperta "buscar".
4. **Rotas na versão publicada:** o servidor da FOSSGIS serve para desenvolver e para um piloto pequeno, seguindo os termos dele. Para crescer, será preciso decidir entre a Stadia Maps (grátis para uso não comercial) e um servidor próprio.
5. **ORS e Fogo Cruzado** só com servidor (fase 2), e o Fogo Cruzado não cobre Foz.
6. **Quem publica o app** precisa ser uma pessoa adulta ou a organização, por causa dos termos do OpenFreeMap.

## Como repetir um teste

Qualquer pessoa pode testar um serviço pelo navegador. Abra o endereço abaixo numa aba nova; ele pede uma rota a pé do centro de Foz até o Colégio Bartolomeu Mitre:

```text
https://valhalla1.openstreetmap.de/route?json={"locations":[{"lat":-25.5304,"lon":-54.5831},{"lat":-25.5463,"lon":-54.5844}],"costing":"pedestrian","language":"pt-BR"}
```

Se aparecer um texto com `"trip"`, o serviço está no ar. Por respeito aos servidores, faça poucos testes e nunca repita em sequência rápida.
