# Fases do projeto

Cada fase tem um objetivo e um **critério de pronto**. Uma fase só começa quando a anterior cumpriu o critério, e antes de cada fase mostramos um plano curto e esperamos a aprovação de um adulto responsável.

**Fase atual: 0, preparação** (13/10/2026).

## Fase 0: preparação

**Objetivo:** conhecer as fontes de dados e deixar o ambiente pronto para qualquer pessoa da turma trabalhar.

**Critério de pronto:**

- [x] Pasta inspecionada antes de mexer (passo 1).
- [x] Cada fonte de dados testada com uma chamada real e documentada em [fontes-de-dados.md](fontes-de-dados.md) (passo 2).
- [x] Estrutura de pastas, documentação, modelos do GitHub, automações, Codespaces e licença criados (passo 3).
- [x] `npm run conferir`, `npm run testar` e `npm run construir` passam no computador.
- [ ] O GitHub Actions fica verde no repositório publicado. Para isso, o projeto precisa ir para o GitHub, com a sua confirmação.
- [ ] Plano da fase 1 aprovado (passo 4).

## Fase 1: MVP sem servidor próprio e sem cadastro

**Objetivo:** a primeira versão que dá para usar no piloto.

1. Mapa com tema escuro (MapLibre), centrado em Foz do Iguaçu, com o crédito do OpenStreetMap.
2. Botão "Onde estou", que pede permissão só na hora e explica por que precisa.
3. Busca de destino com autocompletar (Photon) e escolha de ponto tocando no mapa.
4. Rota a pé com o Valhalla, preferindo ruas iluminadas, mostrando distância e tempo, e alternativas quando houver.
5. "Por que esta rota": uma explicação curta, gerada só a partir dos dados realmente usados. Se faltar informação de iluminação num trecho, a explicação diz isso.
6. Camada "Pontos de apoio" (arquivo gerado a partir da Overpass + arquivo curado pela turma), que a pessoa liga e desliga.
7. Tela "Ajuda agora", que funciona sem internet:
   - botões para ligar para 190, 192, 193, 199, 100, 180, 188, Conselho Tutelar e o telefone do projeto;
   - como receber alertas grátis da Defesa Civil por SMS (enviar o CEP para 40199).
8. Botão "Cheguei bem": abre o compartilhamento do celular (WhatsApp ou SMS) com uma mensagem pronta, sem passar por nenhum servidor.
9. Favoritos (casa, escola, projeto) salvos só no aparelho, com botão "apagar tudo".
10. Troca de idioma entre português e espanhol.
11. Tela "Privacidade", em linguagem simples.
12. Instalável como PWA. Se uma API falhar, a tela mostra uma mensagem clara e o resto continua funcionando.

**Critério de pronto:**

- `npm run conferir` e `npm run testar` passam, e o GitHub Actions fica verde.
- Há testes para as regras de rota e de explicação, incluindo o caso sem dados.
- Funciona no celular e no computador.
- Nenhum dado pessoal sai do aparelho. Cada requisição de rede e o que ela envia estão listados em [privacidade.md](privacidade.md).
- O README explica como rodar em 5 passos, e alguém que nunca programou consegue seguir.

## Fase 2: avisos e relatos

**Objetivo:** avisos ligados à rota e relatos anônimos, com moderação.

- Fogo Cruzado onde houver cobertura. **Foz do Iguaçu não tem cobertura** (conferido em 13/10/2026).
- Relatos anônimos:
  - com categorias fixas;
  - com o local arredondado;
  - sem foto e sem texto livre que identifique alguém.
- Status dos relatos: pendente, em verificação, confirmado, rejeitado, resolvido e expirado.
  - Um relato sozinho fica "em verificação" até ser confirmado por relatos independentes ou por fonte oficial.
  - Os relatos expiram automaticamente.
- Moderação feita por adultos do projeto, com registro de auditoria.
- Canal para contestar um aviso.
- Proteção contra abuso, com limite de envios.
- Supabase (plano grátis) com RLS obrigatório e testado. As chaves ficam escondidas numa função de servidor.

**Critério de pronto:** será detalhado no plano da fase 2. No mínimo:

- as regras de RLS têm testes;
- nenhum relato guarda a localização exata de quem relatou;
- a moderação funciona do começo ao fim.

## Fase 3: navegação a pé e voz

**Objetivo:** acompanhar a pessoa no caminho.

- Acompanhar o trajeto, avisar quando a pessoa sair da rota e recalcular.
- Instruções faladas em português e espanhol (Web Speech API), pensadas para o fone, com o celular no bolso.
- Explicar quando um aviso muda a rota.

**Critério de pronto:** será detalhado no plano da fase 3.

## Fase 4: evolução

**Objetivo:** ampliar o app.

- Comandos de voz onde o navegador permitir.
- Clima (Open-Meteo).
- Bicicleta e transporte público.
- Globo 3D do MapLibre.
- Mais idiomas.

**Critério de pronto:** será detalhado no plano da fase 4.
