# Visão do SAFEWAY

## O que é

O SAFEWAY é um app para celular e computador que ajuda quem anda a pé a:

1. **escolher um caminho** com mais iluminação e mais pontos de apoio;
2. **entender por que** aquele caminho foi sugerido, com a fonte de cada informação;
3. **pedir ajuda rápido**, até sem internet;
4. **avisar "cheguei bem"** para alguém de confiança.

Ele é um PWA: um site que também pode ser instalado na tela inicial do celular, em Android e iPhone.

## Para quem

- **Público geral que anda a pé, de todas as idades.** O piloto é em **Foz do Iguaçu (PR)**, na tríplice fronteira com o Paraguai e a Argentina.
- **Quem fala espanhol:** moradores da fronteira, migrantes, refugiados e visitantes.
- **Quem tem celular simples e pouca internet:** por isso o app precisa ser leve e a tela de ajuda precisa funcionar offline.

O app é construído por **adolescentes de um projeto social** que estão aprendendo a programar com inteligência artificial, com adultos responsáveis.

## O que o app NÃO é

- **Não garante segurança.** Ele sugere rotas; quem decide é sempre a pessoa.
- **Não substitui os serviços de emergência** (190, 192, 193...) e nunca chama a polícia sozinho.
- **Não é um mapa de "lugares perigosos".** Não pinta bairros de vermelho nem faz ranking de bairros.
- **Não coleta dados pessoais.** Não tem cadastro na fase 1, e o que a pessoa salva fica só no aparelho dela.

## Valores

1. **Honestidade.** Mostramos de onde vem cada informação e quando ela foi atualizada. Quando não sabemos, dizemos "dados insuficientes". Ausência de registro não significa que um lugar é seguro.
2. **Proteger sem estigmatizar.** Mostramos o que ajuda (luz, comércio aberto, pontos de apoio), não onde "é perigoso". Avisos falam de lugar e horário, nunca de pessoas, e têm prazo de validade.
3. **Privacidade para todas as idades.** Seguimos a LGPD e, como adolescentes também usam o app, o ECA Digital. A localização nunca sai do aparelho sem uma ação clara da pessoa.
4. **Funcionar na pior hora.** Botões grandes, frases curtas, contraste alto, poucos toques e ajuda offline.
5. **Aprender fazendo.** O código e a documentação são escritos para que alguém que nunca programou consiga entender e continuar.

## Um problema real que já conhecemos

Na validação técnica de 13/10/2026, **nenhuma das 30 ruas** das rotas testadas no centro de Foz tinha a informação de iluminação no OpenStreetMap. Por enquanto, o app vai dizer "dados insuficientes de iluminação" na maior parte dos caminhos.

Há dois jeitos de melhorar isso:

- a turma ajudar a **mapear a iluminação** no OpenStreetMap, de dia, em grupo e com adultos;
- **pedir autorização** à Prefeitura para usar o cadastro oficial de iluminação pública.

Os detalhes estão em [fontes-de-dados.md](fontes-de-dados.md).

> As ferramentas de design (skill Impeccable) usam um resumo desta visão, que fica no [PRODUCT.md](../PRODUCT.md). Se mudar algo aqui, atualize lá também.
