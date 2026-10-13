# Investigações pendentes (REA)

Lista do que queremos investigar com o **REA (Reverse Engineer Anything)**, a ferramenta que ajuda a entender como outros programas funcionam por dentro.

## Situação

- **13/10/2026, de manhã:** o REA não estava instalado neste computador.
- **13/10/2026, à tarde:** instalado e registrado no **Claude Code** e no **Codex**, versão **6.4.0** (decisão D17 em [../decisoes.md](../decisoes.md)).
  - O servidor foi testado: ligou como `rea` 6.4.0 e ofereceu 170 ferramentas, entre elas `inspect_web_page`, `inspect_web_network_capture`, `analyze_web_bundle` e `recover_javascript_sources`.
  - As ferramentas só aparecem numa sessão nova. Depois de instalar, recarregue o VS Code com o comando "Developer: Reload Window".

As investigações abaixo podem começar na próxima sessão.

## Como instalar ou reinstalar (tarefa de uma pessoa adulta responsável)

1. Abra um terminal **fora da pasta do projeto**. Dentro dela, a regra do `.npmrc` (só versões com 7 dias ou mais) faz o npm escolher uma versão antiga do REA.
2. Primeiro veja o plano, sem mudar nada:

   ```bash
   npx rea-agents@6.4.0 setup --client claude_code --client codex --dry-run
   ```

3. Se estiver de acordo, aplique:

   ```bash
   npx rea-agents@6.4.0 setup --client claude_code --client codex --yes
   ```

4. Recarregue o VS Code ("Developer: Reload Window") e reinicie o Codex.

**Se o REA parar de funcionar** depois de limpar o cache do npm ou atualizar o Node.js, rode de novo o passo 3. O registro aponta para a cópia do REA guardada no cache do npm e para a versão atual do Node.

O pacote foi conferido em 13/10/2026: `rea-agents`, licença MIT, código em <https://github.com/morluto/rea>.

Para analisar sites, o REA usa um navegador da família Chrome. Os programas Ghidra, Hopper e IDA só servem para programas compilados, que não são o nosso caso.

## Regras (iguais às do AGENTS.md)

- **Só investigamos alvos autorizados:**
  - este projeto;
  - projetos de código aberto;
  - programas cujo dono deu **autorização por escrito**.
- **Nunca usamos o REA** em app fechado de terceiros (Waze, Google Maps, Moovit, apps comerciais de segurança etc.), nem para burlar proteção, licença ou termos de uso.
- **Antes de copiar qualquer trecho de código**, conferimos se a licença do alvo é compatível com a MIT e registramos isso no relatório.
- **Cada investigação vira um relatório** em `docs/investigacoes/AAAA-MM-DD-nome-do-alvo.md`, seguindo o [modelo](modelo.md).

## Fila de investigações (apps de código aberto)

As licenças foram conferidas no GitHub em 13/10/2026.

| #   | Alvo                                                                                                                                                            | Pergunta                                                                                                                              | Licença                                                         | Podemos copiar código?                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Site do OpenStreetMap ([openstreetmap-website](https://github.com/openstreetmap/openstreetmap-website))                                                         | Como pede e desenha uma rota a pé no Valhalla da FOSSGIS? Que parâmetros envia? Onde mostra o crédito?                                | GPL-2.0                                                         | **Não.** A GPL não é compatível com a MIT. Só podemos aprender a ideia. |
| 2   | App de demonstração do Valhalla ([valhalla/web-app](https://github.com/valhalla/web-app))                                                                       | Como monta as opções de pedestre (`use_lit` e outras) e como mostra as alternativas?                                                  | MIT                                                             | Sim, mantendo o aviso de copyright.                                     |
| 3   | Overpass Turbo ([tyrasd/overpass-turbo](https://github.com/tyrasd/overpass-turbo))                                                                              | Como monta as consultas e dá estilo aos resultados no mapa?                                                                           | MIT                                                             | Sim, mantendo o aviso de copyright.                                     |
| 4   | StreetComplete ([streetcomplete/StreetComplete](https://github.com/streetcomplete/StreetComplete))                                                              | Como a pergunta "esta rua é iluminada?" escolhe as vias e grava a etiqueta `lit`? Isso serve para a atividade de mapeamento da turma. | GPL-3.0                                                         | **Não.** Usamos o app como ferramenta, sem copiar código.               |
| 5   | GraphHopper e GraphHopper Maps ([graphhopper](https://github.com/graphhopper/graphhopper), [graphhopper-maps](https://github.com/graphhopper/graphhopper-maps)) | Como mostra alternativas? Como trata etiquetas como `lit` em rotas a pé?                                                              | Apache-2.0                                                      | Sim, com o aviso e o arquivo NOTICE. Pedir ajuda a um adulto antes.     |
| 6   | BRouter e brouter-web ([abrensch/brouter](https://github.com/abrensch/brouter), [nrenner/brouter-web](https://github.com/nrenner/brouter-web))                  | Como os perfis de rota usam `lit`? Como o site mostra a qualidade de cada trecho?                                                     | MIT                                                             | Sim, mantendo o aviso de copyright.                                     |
| 7   | Organic Maps ([organicmaps](https://github.com/organicmaps/organicmaps))                                                                                        | Como mostra a rota a pé, funciona sem internet e cuida da acessibilidade?                                                             | Apache-2.0                                                      | Sim, com o aviso e o arquivo NOTICE.                                    |
| 8   | OsmAnd ([osmandapp/OsmAnd](https://github.com/osmandapp/OsmAnd))                                                                                                | Como separa vias iluminadas, vias sem luz e vias sem dado?                                                                            | GPL-3.0 no código; CC BY-NC-ND na arte; algumas partes fechadas | **Não.**                                                                |

## Apps fechados: só comparação pública, sem engenharia reversa

Waze, Google Maps, Moovit, Citymapper, apps comerciais de segurança e o app do Fogo Cruzado só podem ser estudados **pela parte pública**:

- página na loja de apps;
- central de ajuda e termos de uso;
- uso normal do app.

Nada de descompilar, interceptar o tráfego de rede ou burlar proteção. O relatório usa o mesmo [modelo](modelo.md), com "comparação pública" no título.
