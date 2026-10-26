# Avaliação - Cadastro de Vacinas

Este projeto usa Next.js no front-end, Express.js na API HTTP e SQLite no banco de dados.
Apenas a funcionalidade de vacinas foi integrada à API Express. As outras telas foram mantidas.

## Requisitos

- Node.js 22.13 ou superior (com suporte a `node:sqlite`)
- npm

## 1. Iniciar a API

Abra o terminal na pasta do projeto:

```bash
cd api
npm install
npm start
```

A API ficará em **http://localhost:3010**. Na primeira inicialização, o arquivo `api/dados/vacinas.db` é criado automaticamente e recebe oito vacinas de exemplo. Depois disso, os registros são lidos e gravados no banco SQLite. Os dados persistem ao reiniciar o servidor.

## 2. Iniciar a aplicação

Abra outro terminal, volte à raiz do projeto e execute:

```bash
npm install
npm run dev
```

Entre em **http://localhost:3000** e acesse **Cadastro > Cadastro de Vacinas**.

## 3. Verificar a integração

1. Cadastre uma vacina, preenchendo os campos obrigatórios.
2. Abra **Lista de Vacinas** e confira se a vacina foi adicionada.
3. Clique em **Detalhes > Editar** e altere um dado; salve e confira na listagem.
4. Clique em **Detalhes > Excluir** e confirme a remoção.
5. Reinicie a API e atualize a lista para confirmar a persistência.

## Rotas da API HTTP

| Método | Endereço | Uso |
| --- | --- | --- |
| GET | `/vacinas` | Listar vacinas |
| GET | `/vacinas/:id` | Consultar uma vacina |
| GET | `/qtdvacinas` | Contar vacinas |
| POST | `/vacinas` | Cadastrar vacina |
| PUT | `/vacinas/:id` | Atualizar vacina |
| DELETE | `/vacinas/:id` | Excluir vacina |

Para conferir o retorno no navegador, abra **http://localhost:3010/vacinas**.

### Teste rápido por terminal

```bash
curl http://localhost:3010/vacinas
curl http://localhost:3010/qtdvacinas
```

Com a API ligada, execute também `npm test` dentro da pasta `api` para testar automaticamente inclusão, consulta, edição e exclusão. O teste apaga o próprio registro ao terminar.

## Observações

- As vacinas passam diretamente do React para a API Express via HTTP. Nenhum cadastro de vacina é gravado em arquivo JSON.
- O arquivo `src/data/vacinas.json` é utilizado somente na criação inicial do banco.
- O arquivo SQLite é gerado em `api/dados/vacinas.db` e não deve ser enviado ao GitHub.
- Se a API estiver desligada, o cadastro e a consulta de vacinas não funcionarão. Execute os **dois** servidores.
- Em máquinas com outro endereço de API, configure `NEXT_PUBLIC_API_URL` no `.env.local` da raiz, por exemplo `NEXT_PUBLIC_API_URL=http://localhost:3010`.
