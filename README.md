# Cadastro de Animais - 1ª Avaliação DW3

Projeto desenvolvido com Next.js, React e TypeScript para a disciplina de Desenvolvimento Web 3.

A funcionalidade trabalhada nesta avaliação foi o **Cadastro de Vacinas**, com integração entre front-end, API Express.js e banco de dados SQL Server.

## Tecnologias utilizadas

- Next.js, React e TypeScript no front-end
- Node.js e Express.js na API
- Microsoft SQL Server 2022 como banco de dados
- Docker para executar o SQL Server

## Como executar

**Pré-requisitos:** Node.js 22.13 ou superior, npm e Docker com Docker Compose.

### 1. Iniciar o banco de dados

Na pasta principal do projeto, copie o arquivo `.env.example` para `.env` e configure uma senha forte na variável `MSSQL_SA_PASSWORD`.

Para criar o contêiner em um computador novo:

`docker compose up -d`

Se estiver usando o contêiner `sqlserver-fatec` já criado anteriormente, basta executar `docker start sqlserver-fatec` em vez do comando acima. Não execute os dois ao mesmo tempo.

### 2. Criar o banco e a tabela

O arquivo `banco.sql` contém os comandos para criar o banco `cadastro_animais` e a tabela `vacinas`.

Com o contêiner criado pelo Docker Compose, execute:

`docker compose cp banco.sql sqlserver:/tmp/banco.sql`

`docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -i /tmp/banco.sql`

Informe a senha do SQL Server quando solicitada.

### 3. Iniciar a API

Entre na pasta `api`.

Copie `api/.env.example` para `api/.env` e configure a conexão com o SQL Server, utilizando a mesma senha.

Execute:

`npm install`

`npm start`

A API ficará disponível em `http://localhost:3011`.

### 4. Iniciar o site

Em outro terminal, na pasta principal do projeto, execute:

`npm install`

`npm run dev`

Acesse `http://localhost:3000`.

Entre em **Cadastro > Cadastro de Vacinas** para utilizar o sistema.

## Funcionalidades

O cadastro de vacinas permite:

- Cadastrar uma vacina
- Consultar as vacinas cadastradas
- Editar os dados de uma vacina
- Excluir uma vacina

A API utiliza os métodos HTTP GET, POST, PUT e DELETE.

Os dados são armazenados no SQL Server e continuam salvos depois de fechar e reiniciar a aplicação.

## Organização

- `src/`: telas e componentes do front-end
- `api/servidor-sqlserver.js`: rotas da API Express.js
- `api/conexao.js`: conexão com o SQL Server
- `banco.sql`: criação do banco e da tabela
- `compose.yaml`: configuração do SQL Server no Docker

Os arquivos `.env` contêm configurações locais e senhas, por isso não são enviados ao GitHub.

As demais telas do projeto original foram mantidas. A integração com o SQL Server foi realizada na funcionalidade de vacinas.
