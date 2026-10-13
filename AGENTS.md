# AGENTS.md: regras do projeto SAFEWAY

Este arquivo vale para o **Codex**, o **Claude Code**, qualquer outra IA e qualquer pessoa que mexa no projeto. Leia inteiro antes de começar.

Se um pedido entrar em conflito com uma regra daqui, **pare e pergunte** antes de seguir.

## 1. O projeto

- **O que é:** o SAFEWAY é um PWA (site que pode ser instalado no celular) que sugere **rotas a pé com mais iluminação e mais pontos de apoio**, e ajuda a **pedir ajuda rápido**.
- **Para quem:** **público geral** que anda a pé, de todas as idades.
  - O piloto é em **Foz do Iguaçu (PR)**, na tríplice fronteira com Ciudad del Este (Paraguai) e Puerto Iguazú (Argentina).
  - Muita gente usa celular simples e tem pouca internet.
- **Idiomas:** português do Brasil (padrão) e espanhol. Quem lê em espanhol inclui moradores da fronteira, migrantes e refugiados.
- **Quem desenvolve:** adolescentes de um projeto social que aprendem a programar com IA, acompanhados por adultos responsáveis. **Explique tudo em linguagem simples**, como um professor paciente.
- **Em que fase estamos:** veja [docs/fases.md](docs/fases.md).

## 2. Regras inegociáveis

Quebrar qualquer uma destas regras é um **bug grave**, mesmo que o código funcione.

### Sobre as pessoas

1. **Privacidade em primeiro lugar, para todas as idades,** seguindo a LGPD. Como adolescentes também usam o app, seguimos também o ECA Digital (Lei 15.211/2025). Colete o mínimo possível.
2. **A localização nunca sai do aparelho** sem uma ação clara da pessoa e nunca fica guardada em servidor.
3. **Não há cadastro na fase 1.** Favoritos, contatos e preferências ficam só no aparelho, com um botão para apagar tudo.
4. **Nunca prometa segurança.**
   - O app diz "rota sugerida", nunca "rota segura", e avisa que os dados podem estar desatualizados.
   - O nome SAFEWAY é uma exceção registrada em [docs/decisoes.md](docs/decisoes.md). Os textos do app nunca dizem "seguro" ou "segura".
5. **Ausência de registro não significa segurança.** Quando faltar dado, mostre "dados insuficientes".
6. **Não estigmatize:**
   - nada de pintar bairros ou comunidades de vermelho;
   - nada de mapa de calor ou ranking de bairros;
   - mostre o que protege (ruas iluminadas, comércio aberto, pontos de apoio);
   - avisos ficam ligados à rota e sempre têm prazo de validade.
7. **Relatos (fase 2) falam do lugar e do horário, nunca de pessoas.** Não podem ter nomes nem fotos, não podem apontar grupos ou pontos ligados a crimes, e não guardamos a localização exata de quem relatou.
8. **Nunca invente dados.** Dados de exemplo ficam em `src/dados/demonstrativo/` e aparecem na tela com o selo **"DEMONSTRATIVO"**.
9. **Separe sempre o tipo de informação:** oficial, confirmado, não confirmado, histórico e desconhecido. Mostre a fonte e o horário.
10. **O app não substitui os serviços de emergência** e nunca aciona polícia ou órgãos públicos automaticamente.

### Sobre o código

11. **Nenhum segredo (chave, senha, token) no código, nos commits ou nos logs.**
    - Segredos ficam em `.env`, que fica fora do Git. O `.env.example` lista os nomes, sem valores.
    - **Atenção:** toda variável que começa com `VITE_` vai parar no navegador e qualquer pessoa pode ver. Nunca coloque segredo nela.
12. **Respeite licenças e limites.**
    - O crédito "© OpenStreetMap contributors" fica sempre visível.
    - No Nominatim: no máximo 1 pedido por segundo **somando todos os usuários** e nunca para autocompletar.
    - Servidores públicos de teste não são infraestrutura de produção.
13. **Antes de instalar uma biblioteca,** confira se ela existe, é a oficial e está mantida. **Pergunte antes de adicionar uma dependência grande.** O `.npmrc` só deixa instalar versões publicadas há pelo menos 7 dias; não mude isso.
14. **Nenhum comando destrutivo sem pedir confirmação:** apagar arquivos em massa, reescrever o histórico do Git, publicar.
15. **Funcionar não basta: confira se o resultado faz sentido.** Exemplo: uma rota "a pé" calculada com perfil de carro desenha uma linha no mapa, mas está errada.

### Regras aprendidas na validação técnica (13/10/2026)

Os detalhes estão em [docs/fontes-de-dados.md](docs/fontes-de-dados.md).

- **"Falhou", "sem dado" e "com dado" são três coisas diferentes.**
  - Todo serviço em `src/servicos/` devolve qual das três aconteceu.
  - A tela diz a verdade: "não foi possível consultar" é diferente de "dados insuficientes".
  - Isso tem teste em `src/regras/`.
- **A Overpass não é consultada a cada uso do app,** porque está sobrecarregada e a política dela desaconselha. Os pontos de apoio vêm de arquivos gerados antes.
- **Photon:**
  - use `lang=default`, porque ele não aceita `pt` nem `es`;
  - limite a busca à região do piloto com `bbox`;
  - espere a pessoa parar de digitar antes de buscar.
- **Nominatim:** só quando a pessoa aperta "buscar" e com os resultados guardados em cache. Política: <https://operations.osmfoundation.org/policies/nominatim/>.
- **Tiles do OpenStreetMap:**
  - nunca guarde para uso offline nem pré-baixe áreas;
  - não bloqueie o cabeçalho `Referer` (nada de `Referrer-Policy: no-referrer`).
- **OpenFreeMap:** não pré-baixe áreas. Quem publica o app precisa ser uma pessoa adulta ou a organização.
- **Valhalla (servidor da FOSSGIS):**
  - no máximo 1 pedido por segundo;
  - mande o cabeçalho `X-Client-Id`;
  - crédito do OSM com link para <https://www.openstreetmap.org/fixthemap>;
  - e-mail de contato visível;
  - o endereço do servidor fica configurável, nunca fixo no código.
- **Rua sem a etiqueta `lit` não é "rua apagada": é "sem dado".** O Valhalla trata como apagada na hora de calcular a rota, mas a tela nunca diz "sem luz" quando o certo é "sem dado".
- **Chaves de serviços (OpenRouteService, Fogo Cruzado) só numa função de servidor** (fase 2 em diante), nunca no navegador.
- **Toda nova requisição de rede entra em [docs/privacidade.md](docs/privacidade.md):** o que envia, para quem e por quê.

## 3. Stack

Não troque nenhuma peça sem registrar o motivo em [docs/decisoes.md](docs/decisoes.md).

| Parte           | Escolha                                                                             | Observação                                                                                               |
| --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| App             | React 19 + TypeScript 6.0 + Vite 8                                                  | TypeScript 6.0 e não 7.0, porque o typescript-eslint ainda não aceita o 7.0                              |
| Visual          | Tailwind CSS 4                                                                      |                                                                                                          |
| PWA             | vite-plugin-pwa                                                                     | Entra na fase 1                                                                                          |
| Mapa            | MapLibre GL JS + OpenFreeMap (estilo claro `liberty`)                               | Entra na fase 1. Reserva: tiles do OpenStreetMap                                                         |
| Busca           | Photon (autocompletar)                                                              | Reserva: Nominatim, sem autocompletar                                                                    |
| Rota a pé       | Valhalla, perfil `pedestrian`, com `use_lit` e `exclude_polygons`                   | Servidor da FOSSGIS só para desenvolvimento e piloto pequeno. Reserva: OpenRouteService, só com servidor |
| Pontos de apoio | Overpass (arquivo gerado antes) + `src/dados/pontos-de-apoio.json`                  | O arquivo `.json` é curado pela turma e só tem lugares públicos                                          |
| Dados pessoais  | Só no armazenamento local do navegador                                              |                                                                                                          |
| Qualidade       | Vitest, ESLint, Prettier, GitHub Actions                                            |                                                                                                          |
| Publicação      | GitHub Pages                                                                        |                                                                                                          |
| Ambiente        | Node.js 24 LTS (`.nvmrc`)                                                           |                                                                                                          |
| Licença         | MIT para o código                                                                   | Dados do OpenStreetMap seguem a ODbL                                                                     |
| Fase 2          | Supabase (plano grátis) com RLS obrigatório e testado; Fogo Cruzado (não cobre Foz) | Chave escondida numa função de servidor                                                                  |
| Fase 3          | Síntese de voz do navegador (Web Speech API)                                        |                                                                                                          |

## 4. Comandos

| Comando             | Para quê                                                                      |
| ------------------- | ----------------------------------------------------------------------------- |
| `npm install`       | Instalar as bibliotecas (primeira vez ou quando o `package.json` mudar)       |
| `npm run iniciar`   | Rodar o app em <http://localhost:5173>                                        |
| `npm run celular`   | Rodar o app visível para o celular na mesma rede Wi-Fi                        |
| `npm run testar`    | Rodar os testes (Vitest)                                                      |
| `npm run conferir`  | ESLint + Prettier + TypeScript. **Precisa passar antes de todo pull request** |
| `npm run formatar`  | Arrumar a formatação (Prettier)                                               |
| `npm run construir` | Gerar a versão final em `dist/`                                               |

Os nomes padrão também existem: `dev`, `test`, `lint`, `format` e `build`.

## 5. Combinados de código

- **Nomes em português simples, sem acento:** `calcularRota`, `pontosDeApoio`.
  - Componentes React em `PascalCase`: `TelaAjudaAgora.tsx`.
  - Outros arquivos em `camelCase`: `escolherIdioma.ts`.
  - Pastas de tela em `kebab-case`: `src/telas/ajuda-agora/`.
- **Arquivos pequenos,** com uma responsabilidade cada.
- **Todo arquivo começa com um comentário de uma a três linhas** dizendo o que faz, em linguagem simples.
  - Arquivos JSON não aceitam comentário: usam a chave `"_sobre"`.
  - Arquivos que não aceitam comentário nenhum (como o `.nvmrc`) são explicados no README.
- **Comentários explicam o porquê,** não o óbvio.
- **Nenhum texto de tela no código.**
  - Tudo fica em `src/textos/pt-BR.json` e `src/textos/es.json`, com as mesmas chaves. Um teste confere isso.
  - O espanhol usa "tú" de forma provisória, até a revisão por falantes nativos.
- **Regras de decisão ficam em `src/regras/`,** como funções puras, com teste ao lado (`nome.test.ts`). Exemplo: `escolherIdioma.ts`.
- **Conversa com APIs só em `src/servicos/`,** um arquivo por serviço.
- **Visual:**
  - toda cor vem junto de ícone e texto;
  - botões com pelo menos 48 px;
  - contraste alto e frases curtas;
  - teste com tela de 360 px de largura.
- **Cores com significado fixo:**
  - ciano: rota sugerida;
  - âmbar: iluminação e pontos de apoio;
  - laranja: atenção;
  - vermelho: só para avisos sérios.

## 6. Decisões, glossário e design

- **Decisões:** toda escolha que muda o projeto vai para [docs/decisoes.md](docs/decisoes.md), com **data, decisão, motivo e alternativas**. Se trocar uma peça da stack, registre antes.
- **Glossário:** quando usar um termo novo, acrescente-o a [docs/glossario.md](docs/glossario.md), explicado para quem nunca programou.
- **Design:**
  - o [PRODUCT.md](PRODUCT.md) resume o produto para as ferramentas de design, como a skill Impeccable;
  - a identidade visual será registrada no `DESIGN.md` na fase 1;
  - se a visão do produto mudar, atualize o [docs/visao.md](docs/visao.md) e o PRODUCT.md juntos.

## 7. Investigações com o REA

O REA (Reverse Engineer Anything) ajuda a entender como outros programas funcionam por dentro.

- **Só investigue alvos autorizados:**
  - este projeto;
  - projetos de código aberto;
  - programas cujo dono deu **autorização por escrito**.
- **Nunca use o REA** em app fechado de terceiros, nem para burlar proteção, licença ou termos de uso.
- **Antes de reaproveitar qualquer trecho de código,** confira a licença do alvo e registre se ela é compatível com a MIT.
- **Cada investigação vira um relatório** em `docs/investigacoes/AAAA-MM-DD-nome-do-alvo.md`, seguindo o [modelo](docs/investigacoes/modelo.md).
- **Se o REA não estiver disponível na sessão,** siga sem ele e anote a investigação em [docs/investigacoes/pendentes.md](docs/investigacoes/pendentes.md).

## 8. Como trabalhar

- **Passos pequenos,** com um commit por passo que funciona.
- **Mensagens de commit em português** que um iniciante entenda. Exemplo: "adiciona botão Cheguei bem".
- **Antes de cada fase,** mostre um plano curto e espere a aprovação de um adulto responsável.
- **Não comece uma fase** antes de a anterior cumprir o critério de pronto ([docs/fases.md](docs/fases.md)).
- **Ao fim de cada passo,** explique em linguagem simples:
  - o que fez;
  - quais arquivos mudou;
  - como testar no celular;
  - o que falta.
- **Se algo não puder ser feito de graça ou não tiver fonte confiável,** diga isso claramente em vez de simular.
- **Privacidade de quem desenvolve:** configure o Git com o e-mail `noreply` do GitHub (Configurações > Emails > "Keep my email addresses private"), para não expor seu e-mail no histórico, que é público.

## 9. Descrição de um pull request (para iniciantes)

O modelo aparece sozinho ao abrir um pull request ([.github/pull_request_template.md](.github/pull_request_template.md)). Responda em frases curtas:

1. **O que mudou:** o que a pessoa vai ver ou o que o código faz de diferente.
2. **Por que:** o problema que isso resolve. Se houver issue, use "Resolve #número".
3. **Como testar no celular:** os passos, do jeito que alguém que nunca viu o app conseguiria seguir.
4. **Checklist:**
   - não adicionei dados pessoais;
   - testei no celular;
   - textos novos existem em pt-BR e es;
   - `npm run conferir` e `npm run testar` passaram.
