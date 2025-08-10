# Instruções para Execução do Projeto

## 1. Pré-requisitos

-   Certifique-se de que o **Docker** está instalado em sua máquina.

## 2. Configuração do Ambiente

1. Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo.
2. Substitua `seu_usuario`, `sua_senha` e `seu_banco` pelos valores do seu ambiente.

```env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=seu_banco
NODE_ENV=development
```

## 3. Inicializando o Docker

-   No terminal, execute para subir o container:

    ```bash
    docker compose up -d
    ```

-   Para verificar se o container está rodando:

    ```bash
    docker ps
    ```

## 4. Executando Migrations

-   As migrations criam as tabelas do banco de dados. Execute:

    ```bash
    npx knex migrate:latest
    ```

## 5. Executando Seeds

-   As seeds populam o banco de dados para facilitar o desenvolvimento e testes.
-   Execute o comando:

    ```bash
    npx knex seed:run --specific=agentes.js && npx knex seed:run --specific=casos.js
    ```

-   Após a execução, o banco estará populado.

## 6. Resetando o Banco (Script Extra)

-   O projeto possui um script que derruba o container, cria novamente, executa as migrations e popula o banco com as seeds.
-   Para utilizá-lo, execute:

    ```bash
    npm run db:reset
    ```
