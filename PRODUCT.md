# Product

<!-- impeccable:product-schema 1 -->

Registro do produto usado pelas ferramentas de design (skill Impeccable). A versão para pessoas está em [docs/visao.md](docs/visao.md); quando uma mudar, atualize a outra.

## Platform

web

## Stack

Decidida pela coordenação do projeto no briefing (não delegada): PWA com React, TypeScript e Vite; Tailwind CSS; MapLibre GL JS com mapas vetoriais do OpenFreeMap; publicação no GitHub Pages. Detalhes e versões em [AGENTS.md](AGENTS.md).

## Users

- **Quem usa:** público geral que anda a pé em Foz do Iguaçu (PR), de todas as idades. Inclui adolescentes, moradores da fronteira com o Paraguai e a Argentina, migrantes e refugiados.
- **Situação:** a pessoa vai sair a pé (muitas vezes à noite ou por um caminho que não conhece) e quer uma rota com mais iluminação e mais pontos de apoio. Ou precisa de ajuda agora.
- **Celular:** muitos usam celular simples, com tela pequena e pouca internet.
- **Quem constrói:** adolescentes de um projeto social aprendendo a programar com IA, com adultos responsáveis. O código precisa ser fácil de entender.

## Product Purpose

Ajudar a escolher, entre caminhos possíveis, o que tem mais iluminação e mais pontos de apoio, explicando com honestidade o porquê. Também ajuda a pedir ajuda rápido (tela que funciona sem internet) e a avisar "cheguei bem" para alguém de confiança.

Sucesso é a pessoa entender a sugestão e confiar nela pelo motivo certo: sabe de onde veio cada informação e o que o app não sabe.

## Positioning

Sugestão honesta em vez de promessa:

- mostra o que protege (ruas iluminadas, lugares abertos, pontos de apoio públicos), sempre com fonte e horário;
- diz "dados insuficientes" quando falta informação;
- nunca diz "rota segura" e nunca pinta bairros como perigosos;
- funciona sem cadastro, e os dados pessoais ficam no aparelho.

## Operating Context

- **Onde se usa:** na rua, muitas vezes à noite, andando. Às vezes com uma mão só, com pressa ou com medo. Na fase 3, com o celular no bolso e fone de ouvido.
- **Aparelhos:** Android simples e iPhone, a partir de 360 px de largura. Internet lenta ou cara, às vezes nenhuma. A tela "Ajuda agora" precisa funcionar offline.
- **Fronteira:** o celular pode se conectar à rede do Paraguai ou da Argentina, onde os números de emergência são outros (Paraguai: 911, 141, 132; Misiones: 911, 107, 100). No Brasil, 112 e 911 no celular também levam à Polícia Militar.
- **Idiomas:** português do Brasil (padrão) e espanhol. No espanhol, provisoriamente "tú", até a revisão por falantes nativos.

## Capabilities and Constraints

- **Fase 1:**
  - mapa claro (estilo `liberty`) com crédito do OpenStreetMap, dentro da interface escura;
  - botão "Onde estou";
  - busca com autocompletar e escolha tocando no mapa;
  - rota a pé com alternativas;
  - explicação "Por que esta rota";
  - camada de pontos de apoio;
  - tela "Ajuda agora", que funciona offline;
  - botão "Cheguei bem";
  - favoritos guardados só no aparelho;
  - troca de idioma;
  - tela de privacidade;
  - instalação como PWA.
- **Fato dos dados:** em 13/10/2026, nenhuma das 30 ruas das rotas testadas em Foz tinha a informação de iluminação no OpenStreetMap. Na maioria das rotas, a explicação vai dizer "dados insuficientes de iluminação". Isso precisa estar previsto no design, e não escondido.
- **Restrições:**
  - as regras inegociáveis do [AGENTS.md](AGENTS.md);
  - os limites de cada serviço, listados em [docs/fontes-de-dados.md](docs/fontes-de-dados.md).
- **Ainda não decidido:**
  - qual servidor de rotas usar na versão publicada;
  - se a turma vai mapear a iluminação no OpenStreetMap;
  - se haverá autorização para usar o cadastro oficial de iluminação de Foz;
  - qual o telefone do projeto.

## Brand Commitments

- **Nome:** SAFEWAY. Foi mantido por decisão da coordenação, mesmo dizendo "safe". Os textos nunca dizem "seguro" ou "segura"; sempre "rota sugerida".
- **Compromissos visuais do briefing** (obrigatórios):
  - tema escuro por padrão (azul-noite), com tema claro opcional;
  - ciano para a rota sugerida; âmbar para iluminação e pontos de apoio; laranja para atenção; vermelho só para avisos sérios;
  - toda cor vem junto de ícone e texto;
  - botões de pelo menos 48 px, contraste alto e frases curtas;
  - testar com tela de 360 px.
- **Voz:** linguagem simples, frases curtas, respeito, sem alarmismo e sem promessas.

## Evidence on Hand

- **Ainda não temos:** usuários reais, depoimentos ou parceiros. Não inventar nenhum.
- **Dados reais:** OpenStreetMap (pelos serviços listados) e telefones oficiais conferidos em 13/10/2026: Conselho Tutelar I (45) 2105-8633 e Conselho Tutelar II (45) 3901-3265, fonte foz.pr.gov.br.
- **Dados de exemplo:** só em `src/dados/demonstrativo/`, com o selo "DEMONSTRATIVO".

## Product Principles

1. **Honestidade antes de conforto:** mostrar fonte, horário e lacunas; nunca "seguro".
2. **Proteger sem estigmatizar:** mostrar o que ajuda, não onde "é perigoso".
3. **Privado por padrão:** nada sai do aparelho sem uma ação clara da pessoa.
4. **Funcionar na pior hora:** sem internet, com uma mão, com botões grandes e rápido.
5. **Feito para ser entendido:** linguagem simples para quem usa e para quem programa.

## Accessibility & Inclusion

- **Padrão mínimo:** WCAG 2.2 nível AA. Alvos de toque de pelo menos 48 px. A cor nunca é a única pista.
- **Textos:** bilíngues (pt-BR e es), simples para quem tem pouca familiaridade com leitura.
- **Tela e movimento:** funciona em 360 px e respeita "reduzir movimento".
- **Leitor de tela:** botões e mapa com rótulos.
