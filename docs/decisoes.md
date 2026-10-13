# Decisões

Cada decisão importante fica registrada aqui, com **data, decisão, motivo e alternativas**. Assim, quem chegar depois entende por que o projeto é como é.

**Como registrar:** copie o bloco abaixo para o fim da lista, troque o número e preencha.

```markdown
### D00: título curto

- **Data:** AAAA-MM-DD
- **Decisão:** o que foi decidido.
- **Motivo:** por que.
- **Alternativas:** o que mais foi considerado e por que ficou de fora.
```

---

### D01: começar do zero

- **Data:** 2026-10-13
- **Decisão:** criar o projeto do zero.
- **Motivo:** a pasta do projeto estava vazia; não havia protótipo para preservar.
- **Alternativas:** nenhuma.

### D02: piloto em Foz do Iguaçu (PR)

- **Data:** 2026-10-13
- **Decisão:** o piloto é em Foz do Iguaçu. O mapa abre centrado na cidade (relação 297473 do OpenStreetMap; centro -25,5304, -54,5831).
- **Motivo:** escolha da coordenação. Por ser tríplice fronteira, explica a necessidade do espanhol.
- **Alternativas:** nenhuma registrada.

### D03: público geral, não só adolescentes

- **Data:** 2026-10-13
- **Decisão:** o app é para o **público geral** que anda a pé, de todas as idades. O briefing original falava em adolescentes de 12 a 18 anos.
- **Motivo:** pedido da coordenação.
  - As regras de privacidade continuam as mesmas, porque protegem pessoas de qualquer idade.
  - O ECA Digital (Lei 15.211/2025) continua valendo, porque o app é de acesso provável por adolescentes.
- **Alternativas:** manter só adolescentes (substituída por este pedido).

### D04: manter o nome SAFEWAY

- **Data:** 2026-10-13
- **Decisão:** o app se chama SAFEWAY.
- **Motivo:** escolha da coordenação.
- **Riscos conhecidos:**
  1. "Safe way" quer dizer "caminho seguro" em inglês, o que contraria a regra 4 (nunca prometer segurança). Para diminuir esse risco, os textos do app nunca dizem "seguro" ou "segura" e sempre dizem "rota sugerida".
  2. "Safeway" é o nome de uma grande rede de supermercados dos Estados Unidos (marca registrada). Antes de divulgar o app amplamente, vale uma consulta jurídica.
- **Alternativas:** usar um nome provisório e deixar a turma escolher o definitivo (oferecida e não escolhida).

### D05: repositório na conta kakaneto e commits com e-mail noreply

- **Data:** 2026-10-13
- **Decisão:** o projeto vai para a conta `kakaneto` do GitHub. Os commits usam o e-mail `86269446+kakaneto@users.noreply.github.com`, configurado só neste repositório.
- **Motivo:** o histórico do Git fica público. O e-mail `noreply` evita expor um e-mail pessoal.
- **Alternativas:** usar um e-mail pessoal (descartado por privacidade).

### D06: quebras de linha no padrão LF

- **Data:** 2026-10-13
- **Decisão:** o `.gitattributes` obriga todo arquivo de texto a usar quebra de linha LF.
- **Motivo:** o Git do Windows deste computador troca as quebras para CRLF (`core.autocrlf=true`), e aí o Prettier acusaria erro em todos os arquivos.
- **Alternativas:** pedir que cada pessoa configure o próprio Git (frágil: alguém sempre esquece).

### D07: só instalar versões com pelo menos 7 dias

- **Data:** 2026-10-13
- **Decisão:** o `.npmrc` tem `min-release-age=7` e `engine-strict=true`.
- **Motivo:**
  - Quando um pacote do npm é invadido, isso costuma ser descoberto nos primeiros dias. Esperar 7 dias reduz muito o risco.
  - Na instalação, o npm escolheu sozinho versões um pouco mais antigas para vite (8.3.3), vitest (5.0.3), typescript-eslint (8.71.1) e prettier (3.9.9).
  - O `engine-strict` impede instalar com uma versão errada do Node.
- **Alternativas:** instalar sempre a última versão (mais risco).

### D08: TypeScript 6.0, e não 7.0

- **Data:** 2026-10-13
- **Decisão:** usar `typescript@~6.0.3`.
- **Motivo:** o TypeScript 7.0 (a versão nova, reescrita) saiu, mas o typescript-eslint 8.71 só aceita versões abaixo de 6.1. Com o 7.0, o ESLint não funcionaria.
- **Alternativas:** TypeScript 7.0 sem ESLint para TypeScript (perderíamos a conferência de erros).
- **Rever quando:** o typescript-eslint passar a aceitar o 7.0.

### D09: bibliotecas instaladas no passo 3

- **Data:** 2026-10-13
- **Decisão:** além das peças da stack (React, TypeScript, Vite, Tailwind, Vitest, ESLint, Prettier), instalamos os complementos oficiais de cada uma:
  - `@vitejs/plugin-react`
  - `@tailwindcss/vite`
  - `@types/react`, `@types/react-dom` e `@types/node`
  - `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`
  - `globals`
  - `eslint-config-prettier`
- **Motivo:** são pequenas e são as ligações oficiais entre as peças da stack. Todas foram conferidas no npm em 13/10/2026: existem, vêm do repositório oficial e estão mantidas.
- **Alternativas:** nenhuma razoável.
- **Ficam para a fase 1:** MapLibre GL JS e vite-plugin-pwa, que também já são da stack e foram conferidas.

### D10: Photon com idioma "default" e limitado à região

- **Data:** 2026-10-13
- **Decisão:** chamar o Photon com `lang=default` e um `bbox` da região do piloto.
- **Motivo:** o servidor público recusa `lang=pt` e `lang=es` (erro 400). Sem o `bbox`, a busca por "Terminal de Transp" trouxe Chapecó e a Colômbia.
- **Alternativas:** servidor próprio do Photon com português e espanhol (custo e manutenção; talvez no futuro).

### D11: OpenRouteService só com servidor

- **Data:** 2026-10-13
- **Decisão:** o OpenRouteService não entra no app da fase 1. Ele só será a reserva das rotas quando houver uma função de servidor (fase 2 em diante).
- **Motivo:** ele exige chave, e a documentação oficial diz que ela "must not be used client-side". Num site estático, a chave ficaria visível para qualquer pessoa, o que quebra a regra 11.
- **Alternativas:** colocar a chave no navegador (proibido pela regra 11 e pelo próprio ORS).

### D12: Nominatim só como reserva, quando a pessoa aperta "buscar"

- **Data:** 2026-10-13
- **Decisão:** usar o Nominatim só quando o Photon falhar e a pessoa apertar "buscar".
  - Nunca para autocompletar.
  - Com cache dos resultados.
  - Com o endereço do serviço configurável.
- **Motivo:** a política do Nominatim (<https://operations.osmfoundation.org/policies/nominatim/>) limita a 1 pedido por segundo **somando todos os usuários** e proíbe autocompletar. A política também exige uma decisão consciente de quem desenvolve. Esta decisão é esse registro, e a responsabilidade é da coordenação do projeto.
- **Alternativas:** não ter reserva de busca, ou usar um provedor pago (LocationIQ, OpenCage).

### D13: textos em JSON com a chave "\_sobre"

- **Data:** 2026-10-13
- **Decisão:** cada arquivo de textos (`src/textos/*.json`) começa com a chave `"_sobre"`, que explica o arquivo.
- **Motivo:** o combinado pede um comentário no início de todo arquivo, mas JSON não aceita comentários.
- **Alternativas:** um README separado (fácil de esquecer).

### D14: espanhol com "tú", de forma provisória

- **Data:** 2026-10-13
- **Decisão:** por enquanto, os textos em espanhol tratam a pessoa por "tú".
- **Motivo:** é a forma mais entendida em toda a América Latina. Na fronteira também se usa "vos" (Argentina e Paraguai).
- **Rever quando:** falantes nativos da turma ou da comunidade revisarem os textos.

### D15: investigações do REA ficam pendentes

- **Data:** 2026-10-13
- **Decisão:** as investigações com o REA ficam anotadas em [investigacoes/pendentes.md](investigacoes/pendentes.md).
- **Motivo:** o REA não está instalado neste computador. A instalação (`npx rea-agents setup`) faz perguntas e pede aprovação, então precisa ser feita por um adulto responsável num terminal.
- **Alternativas:** ler o código aberto dos alvos diretamente, o que é possível para os projetos de código aberto da lista.

### D16: quem publica precisa ser adulto

- **Data:** 2026-10-13
- **Decisão:** a publicação do app (GitHub Pages) fica sob responsabilidade de uma pessoa adulta ou da organização.
- **Motivo:** os termos do OpenFreeMap (09/09/2026) dizem "You must be at least 18 years old" para quem integra o serviço. A regra não vale para quem só usa o mapa.
- **Alternativas:** outro provedor de mapa (todos têm regras parecidas ou custo).
