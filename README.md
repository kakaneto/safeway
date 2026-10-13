# SAFEWAY

**Rotas a pé sugeridas, com mais iluminação e mais pontos de apoio, e ajuda rápida quando precisar.**

O SAFEWAY é um app para celular e computador. Tecnicamente é um **PWA**: um site que também pode ser instalado na tela inicial do celular.

Ele é feito por adolescentes de um projeto social que estão aprendendo a programar com a ajuda de inteligência artificial. O piloto acontece em **Foz do Iguaçu (PR)**, com textos em **português** e **espanhol**.

> ⚠️ **O app está em construção. Ainda não use para planejar caminhos.**
>
> O SAFEWAY sugere rotas; ele **nunca** garante que um caminho é seguro, e os dados podem estar desatualizados. Ele também não substitui os serviços de emergência: em perigo, ligue **190** (Polícia Militar) ou **192** (SAMU).

## Rodar no seu computador em 5 passos

1. **Instale o Node.js 24 e o Git.** Veja [como instalar no seu sistema](#instalar-o-nodejs-e-o-git).
2. **Baixe o projeto.** Na página do projeto no GitHub, clique no botão verde **Code** e copie o endereço. Depois rode no terminal, trocando `ENDERECO-COPIADO` pelo que você copiou:

   ```bash
   git clone ENDERECO-COPIADO
   ```

3. **Entre na pasta que o Git criou e instale as bibliotecas.** Isso só é preciso na primeira vez:

   ```bash
   cd safeway
   npm install
   ```

4. **Abra o app:**

   ```bash
   npm run iniciar
   ```

   Depois abra <http://localhost:5173> no navegador. Para parar, volte ao terminal e aperte `Ctrl + C`.

5. **Antes de enviar uma mudança, confira e teste:**

   ```bash
   npm run conferir
   npm run testar
   ```

   Se os dois terminarem sem erro, está tudo certo.

> Prefere não instalar nada? Use o [GitHub Codespaces](#abrir-no-github-codespaces-sem-instalar-nada).

## Instalar o Node.js e o Git

O projeto usa o **Node.js 24**; a versão está anotada no arquivo `.nvmrc`. Para ver o que já está instalado no seu computador:

```bash
node --version
git --version
```

O primeiro comando deve mostrar algo como `v24.20.0`.

### Windows

1. Baixe o Node.js em <https://nodejs.org/pt/download>, escolha a **versão 24** e instale com as opções padrão.
2. Baixe o Git em <https://git-scm.com/downloads/win> e instale com as opções padrão.
3. Feche e abra de novo o terminal (PowerShell ou Git Bash) e confira as versões.

### Mac

1. Baixe o instalador do Node.js em <https://nodejs.org/pt/download>, escolhendo a **versão 24**.
2. No Terminal, rode `git --version`. Se o Git não estiver instalado, o Mac oferece instalar as "Command Line Tools": aceite.

### Linux (Ubuntu, Debian e parecidos)

1. Em <https://nodejs.org/pt/download>, escolha **Linux**, **nvm** e a **versão 24**, e rode os comandos que a página mostrar.
2. Instale o Git: `sudo apt update && sudo apt install git`.
3. Dentro da pasta do projeto, `nvm use` escolhe sozinho a versão anotada no `.nvmrc`.

## Abrir no GitHub Codespaces (sem instalar nada)

O Codespaces é um computador na nuvem do GitHub que abre o projeto já pronto, com tudo instalado.

1. Entre na sua conta do GitHub e abra a página do projeto.
2. Clique em **Code**, depois na aba **Codespaces**, depois em **Create codespace on main**.
3. Espere a instalação terminar; na primeira vez leva alguns minutos. O terminal aparece na parte de baixo da tela.
4. Rode `npm run iniciar`.
5. Vai aparecer um aviso dizendo que a porta **5173** está disponível. Clique para abrir no navegador, ou use a aba **Ports (Portas)** e o ícone de globo.

A conta grátis do GitHub tem um limite mensal de uso do Codespaces. Quando terminar, desligue o Codespace: menu **Codespaces**, depois **Stop Current Codespace**.

## Testar no celular

| Jeito            | Como                                                                                                                                              | Limite                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Mesma rede Wi-Fi | Rode `npm run celular` e abra no celular o endereço que aparece em "Network" (por exemplo, `http://192.168.0.10:5173`)                            | Sem HTTPS, a localização e a instalação do app não funcionam                  |
| Codespaces       | Na aba **Ports (Portas)**, clique com o botão direito na porta 5173, escolha **Port Visibility**, depois **Public**, e abra o endereço no celular | Qualquer pessoa com o link consegue abrir; volte para **Private** ao terminar |
| Versão publicada | Abra o endereço do GitHub Pages do projeto                                                                                                        | Só mostra o que já entrou na branch `main`                                    |

Para testar no computador com a tela estreita, use o Chrome: aperte `F12`, clique no ícone de celular e escolha a largura **360**.

## Publicar no GitHub Pages (tarefa de um adulto responsável)

Os termos do OpenFreeMap exigem que quem publica o app tenha 18 anos ou mais. A publicação fica com uma pessoa adulta ou com a organização.

1. Envie o projeto para um repositório no GitHub.
2. No repositório, abra **Settings**, depois **Pages**, e em **Source** escolha **GitHub Actions**.
3. A partir daí, cada mudança que entra na `main` é conferida, testada e publicada sozinha pelo workflow **Publicar**, no endereço `https://CONTA.github.io/NOME-DO-REPOSITORIO/`.

Antes de publicar a versão que pede rotas, avise o projeto Valhalla, como pedem os termos do servidor da FOSSGIS. Os detalhes estão em [docs/fontes-de-dados.md](docs/fontes-de-dados.md).

## Comandos

| Comando             | O que faz                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `npm install`       | Instala as bibliotecas. Rode na primeira vez e sempre que o `package.json` mudar          |
| `npm run iniciar`   | Abre o app para desenvolvimento em <http://localhost:5173>                                |
| `npm run celular`   | Igual ao anterior, mas visível para o celular na mesma rede Wi-Fi                         |
| `npm run testar`    | Roda os testes automáticos                                                                |
| `npm run conferir`  | Procura erros no código (ESLint), confere a formatação (Prettier) e os tipos (TypeScript) |
| `npm run formatar`  | Arruma a formatação de todos os arquivos                                                  |
| `npm run construir` | Gera a versão final do app na pasta `dist/`                                               |

Os nomes em inglês também funcionam: `dev`, `test`, `lint`, `format` e `build`.

## Mapa das pastas

```text
README.md            este manual
AGENTS.md            regras do projeto para pessoas e IAs (Codex, Claude Code)
CLAUDE.md            faz o Claude Code ler o AGENTS.md
PRODUCT.md           resumo do produto para as ferramentas de design
docs/                documentação: visão, decisões, fontes de dados, privacidade, glossário, fases
  investigacoes/     relatórios de investigações
src/                 código do app
  telas/             uma pasta por tela
  componentes/       peças reaproveitáveis
  servicos/          conversa com as APIs (mapa, busca, rotas)
  regras/            regras de decisão, com testes
  textos/            todos os textos da tela (pt-BR.json e es.json)
  dados/             pontos de apoio e dados DEMONSTRATIVOS
public/              arquivos copiados direto para o site (ícones etc.)
.github/             modelos de issue, checklist de pull request e automações
.devcontainer/       configuração do Codespaces
```

## Como contribuir

1. Leia o [AGENTS.md](AGENTS.md). As regras valem para pessoas e para IAs.
2. Abra uma _issue_ com o modelo **Ideia** ou **Problema**.
3. Faça a mudança numa _branch_, rode `npm run conferir` e `npm run testar` e abra um _pull request_. O checklist aparece sozinho.

Encontrou uma palavra nova? Veja o [glossário](docs/glossario.md).

## Créditos e licenças

- **Código:** licença [MIT](LICENSE).
- **Dados de mapa:** © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licença ODbL.
- **Outros serviços:** a lista completa, com a licença de cada um, está em [docs/fontes-de-dados.md](docs/fontes-de-dados.md).
