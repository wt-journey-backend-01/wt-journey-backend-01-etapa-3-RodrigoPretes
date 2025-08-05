## Etapa 3 — Persistência de Dados com PostgreSQL e Knex.js

Nesta etapa, a API de gerenciamento de agentes e casos policiais passa a armazenar os dados em um banco PostgreSQL usando **Knex.js**, **migrations** e **seeds**.

---

## 1) Pré-requisitos

- Node.js (>= 18)
- npm ou yarn
- Docker e Docker Compose
- Porta **5432** livre (ou ajuste no `docker-compose.yml`)

---

## 2) Configurar Variáveis de Ambiente

Na raiz do projeto, crie um arquivo `.env` com:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
````

⚠️ **Não altere esses valores**

---

## 3) Subir o Banco de Dados com Docker

Verifique a existência do arquivo `docker-compose.yml`:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16
    container_name: policia_db_pg
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Suba o banco:

```bash
docker compose up -d
docker compose logs -f postgres
```
---

## 4)Executar Migrations


Aplicar migrations:

```bash
npx knex migrate:latest
```

Refazer do zero (dev):

```bash
npx knex migrate:rollback --all
npx knex migrate:latest
```

---

## 5) Executar Seeds


```bash
npx knex seed:run
```

---

## 6) Troubleshooting

* **Conexão recusada**:
  Verifique se o container está rodando (`docker compose ps`) e a porta **5432** está livre.
* **Migration não atualiza**:
  Use `npx knex migrate:rollback --all` antes de rodar novamente.
* **Erro de FK em seeds**:
  Certifique-se de executar os seeds de `agentes` antes de `casos`.

---

