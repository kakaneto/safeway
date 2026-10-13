# Glossário

Palavras técnicas usadas no projeto, explicadas para quem nunca programou. Encontrou uma palavra que não está aqui? Acrescente, em ordem alfabética.

**AGENTS.md:** arquivo com as regras do projeto. O Codex e o Claude Code leem este arquivo antes de trabalhar.

**API:** a "porta de atendimento" de um serviço na internet. O app manda um pedido (por exemplo, "rota daqui até ali") e recebe uma resposta com os dados.

**Atribuição (crédito):** o aviso de quem produziu os dados, como "© OpenStreetMap contributors". Muitas licenças exigem que ele fique visível.

**Autocompletar:** sugerir resultados enquanto a pessoa ainda está digitando.

**bbox:** abreviação de _bounding box_, um retângulo no mapa definido por quatro números (oeste, sul, leste, norte). Serve para limitar uma busca a uma região.

**Branch:** uma "linha paralela" do projeto no Git, onde você faz mudanças sem mexer na versão principal (`main`) até estar pronto.

**Cache:** uma cópia guardada de algo que já foi baixado, para não pedir de novo à internet.

**CAP (Common Alerting Protocol):** formato padrão internacional de alertas de emergência. O INMET usa esse formato.

**Cell broadcast:** mensagem de alerta que as antenas de celular mandam para todos os aparelhos de uma área, sem cadastro. No Brasil se chama "Defesa Civil Alerta".

**Chave de API:** uma senha que alguns serviços pedem para responder. É um segredo: nunca vai para o código nem para o navegador.

**Codespaces:** um computador na nuvem do GitHub que abre o projeto já pronto, sem instalar nada no seu computador.

**Código HTTP:** o número que vem em toda resposta de um serviço.

- **200:** deu certo.
- **204:** deu certo, sem conteúdo.
- **400:** o pedido estava errado.
- **401:** falta autorização (chave ou senha).
- **404:** não encontrado.
- **429:** pedidos demais, espere.
- **504:** o servidor demorou ou está ocupado demais.

**Commit:** uma "foto" salva das mudanças no projeto, com uma mensagem explicando o que mudou.

**Componente:** um pedaço da tela feito em React (um botão, um aviso, uma tela inteira), que pode ser reaproveitado.

**CORS:** regra dos navegadores que decide se um site pode ler a resposta de um serviço de outro endereço. Se o serviço não "liberar" (cabeçalho `Access-Control-Allow-Origin`), o app não consegue usar a resposta.

**Costing (perfil de rota):** no Valhalla, o tipo de deslocamento: `pedestrian` (a pé), `bicycle` (bicicleta), `auto` (carro). Usar o perfil errado dá uma rota errada.

**CRLF e LF:** dois jeitos de marcar o fim de uma linha num arquivo. O Windows costuma usar CRLF e o Linux e o Mac usam LF. O projeto usa LF em tudo.

**Dependência:** uma biblioteca feita por outras pessoas que o projeto usa. Fica listada no `package.json`.

**Devcontainer:** a "receita" do computador do Codespaces: qual Node.js usar, quais extensões instalar.

**ECA Digital:** a Lei 15.211/2025, que protege crianças e adolescentes em produtos digitais.

**Engenharia reversa:** descobrir como um programa funciona por dentro, observando o que ele faz. Só fazemos isso com alvos autorizados.

**ESLint:** ferramenta que lê o código e aponta erros comuns antes de o app rodar.

**Etiqueta (tag) do OpenStreetMap:** uma informação presa a um lugar do mapa, no formato `chave=valor`. Exemplos: `amenity=hospital` (é um hospital) e `lit=yes` (é iluminado).

**Função pura:** função que, para a mesma entrada, sempre dá a mesma resposta e não mexe em nada fora dela. É fácil de testar. As regras do app (`src/regras/`) são assim.

**Geocodificação:** transformar um endereço ou nome de lugar em coordenadas no mapa. A **geocodificação reversa** faz o contrário: de coordenadas para endereço.

**Git:** programa que guarda o histórico de mudanças do projeto.

**GitHub:** site que guarda projetos Git na internet e ajuda a trabalhar em equipe.

**GitHub Actions:** automações do GitHub. No nosso projeto, conferem, testam e constroem o app a cada pull request e publicam o app quando algo entra na `main`.

**GitHub Pages:** serviço do GitHub que publica um site de graça. É onde o SAFEWAY vai ficar.

**IBGE (código do município):** número oficial de cada cidade brasileira. O de Foz do Iguaçu é 4108304.

**Impeccable:** skill (conjunto de instruções) que ajuda as IAs a fazer um design de qualidade.

**Issue:** um registro no GitHub para uma ideia ou um problema. Usamos os modelos "Ideia" e "Problema".

**JSON:** formato de texto para guardar dados, com chaves e valores: `{"nome": "SAFEWAY"}`.

**LGPD:** Lei Geral de Proteção de Dados (Lei 13.709/2018), que regula o uso de dados pessoais no Brasil.

**Licença:** as regras de uso de um código ou de dados.

- **MIT:** a nossa. Bem aberta; só pede para manter o aviso de autoria.
- **GPL:** obriga quem copia a usar a mesma licença; não combina com a MIT.
- **Apache 2.0:** aberta, com alguns avisos obrigatórios.
- **ODbL:** a licença dos dados do OpenStreetMap; exige crédito.
- **CC BY:** permite usar, desde que se dê o crédito.

**lit:** etiqueta do OpenStreetMap que diz se um lugar é iluminado à noite (`lit=yes`) ou não (`lit=no`). Quando ela não existe, **não sabemos**: é "sem dado", não "apagado".

**localStorage:** espaço do navegador onde o app guarda pequenas informações no próprio aparelho, como o idioma e os favoritos.

**Mapa vetorial e mapa raster:** o vetorial é desenhado pelo próprio celular a partir de linhas e pontos, e dá para mudar as cores. O raster vem como imagem pronta.

**Markdown:** formato simples de texto com marcações (`#` para título, `**` para negrito). Os documentos do projeto (`.md`) usam esse formato.

**MCP:** um jeito padrão de ligar ferramentas extras a assistentes de IA. O REA é um servidor MCP.

**min-release-age:** configuração do npm (no arquivo `.npmrc`) que só deixa instalar versões publicadas há um número mínimo de dias. Usamos 7 dias, por segurança.

**Node.js:** programa que roda JavaScript fora do navegador. Usamos para as ferramentas do projeto (Vite, testes).

**npm:** o gerenciador de bibliotecas do Node.js. `npm install` baixa as bibliotecas e `npm run` roda os comandos do projeto.

**OpenStreetMap (OSM):** um mapa do mundo feito por voluntários, livre para usar com crédito. A turma pode ajudar a melhorar o mapa de Foz.

**Overpass:** serviço que responde perguntas sobre os dados do OpenStreetMap, como "quais farmácias existem em Foz?".

**package.json e package-lock.json:** o `package.json` lista as bibliotecas e os comandos do projeto. O `package-lock.json` anota a versão exata de cada biblioteca instalada.

**Polígono:** uma área no mapa desenhada por pontos ligados. O Valhalla pode desviar de polígonos (`exclude_polygons`).

**Preflight (checagem prévia):** um pedido de "posso?" (`OPTIONS`) que o navegador faz sozinho antes de alguns pedidos, para checar o CORS.

**Prettier:** ferramenta que arruma a formatação do código (espaços, aspas, quebras de linha) do mesmo jeito para todo mundo.

**PRODUCT.md:** resumo do produto (para quem é, o que faz, compromissos) usado pelas ferramentas de design.

**Pull request (PR):** um pedido para juntar as mudanças de uma branch à versão principal. Outras pessoas revisam antes.

**PWA (Progressive Web App):** um site que se comporta como aplicativo: pode ser instalado na tela inicial e funcionar sem internet em partes.

**React:** biblioteca para construir telas com componentes.

**REA (Reverse Engineer Anything):** ferramenta de engenharia reversa que liga programas de análise aos assistentes de IA.

**Referer:** cabeçalho que o navegador manda dizendo de qual site veio o pedido. Alguns serviços (como os tiles do OpenStreetMap) exigem que ele chegue.

**Repositório:** a pasta do projeto com todo o histórico do Git.

**Requisição e resposta:** o pedido que o app faz a um serviço na internet e o que volta dele.

**RLS (Row Level Security):** na fase 2, regra do banco de dados (Supabase) que decide quem pode ler ou mudar cada linha. É obrigatória e precisa ter testes.

**RSS:** formato de lista de novidades que outros programas conseguem ler. O INMET publica os avisos assim.

**Servidor:** computador que fica ligado na internet respondendo pedidos. Na fase 1, o SAFEWAY não tem servidor próprio.

**SLA:** acordo de nível de serviço, uma promessa de que o serviço vai ficar no ar. Os serviços gratuitos que usamos **não** têm SLA.

**Tailwind CSS:** ferramenta de estilos em que a aparência é escrita com classes curtas, como `text-lg` (texto grande) e `px-4` (espaço nas laterais).

**Teste automático:** código que confere se outro código funciona. Roda com `npm run testar`.

**Tile:** um "ladrilho" do mapa. O mapa é montado juntando vários tiles, de acordo com o zoom.

**TypeScript:** JavaScript com tipos. O computador avisa antes se você usar algo do jeito errado.

**User-Agent:** cabeçalho que diz qual programa está fazendo o pedido (o navegador, por exemplo).

**Valhalla:** programa de rotas que usa os dados do OpenStreetMap. Calcula caminhos a pé, de bicicleta e de carro.

**Variável de ambiente (`.env`):** configuração guardada fora do código. Segredos ficam no `.env`, que nunca vai para o Git. **Cuidado:** variáveis que começam com `VITE_` vão para o navegador e ficam públicas.

**Via, nó e relação (OpenStreetMap):** os três tipos de elemento do mapa. Uma **via** (_way_) é uma linha, como uma rua. Um **nó** (_node_) é um ponto, como um poste. Uma **relação** junta elementos, como os limites de uma cidade.

**Vite:** ferramenta que roda o app enquanto você programa e gera a versão final.

**Vitest:** ferramenta que roda os testes automáticos.
