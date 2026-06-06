# Aivacol Fleet API

API Backend para gerenciamento de modelos e veiculos, desenvolvida para o teste tecnico Backend da Aivacol.

## Tecnologias

- NestJS
- TypeORM
- SQL Server
- Redis Cache
- JWT
- Jest
- Docker

## Arquitetura

O projeto segue Clean Architecture dentro de `src/app`:

- `domain`: entidades, contratos de repositorio e regras de dominio.
- `application`: inputs, outputs e casos de uso.
- `modules`: integracao com NestJS, TypeORM, mappers, repositories e providers.
- `presentation`: controllers, DTOs, response mappers e Swagger.

## Requisitos

- Node.js 18 ou superior
- npm
- Docker e Docker Compose

## Configuracao

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variaveis principais:

- `PORT`: porta da API.
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: conexao SQL Server.
- `JWT_SECRET`, `JWT_EXPIRES_IN`: configuracao do JWT.
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL`: configuracao do cache Redis.

## Executando com Docker

```bash
docker compose up --build
```

O compose sobe:

- API em `http://localhost:3000`
- SQL Server em `localhost:1433`
- Redis em `localhost:6379`

Depois que o SQL Server estiver pronto, execute migrations e seed de veiculos:

```bash
npm run db:setup
```

## Executando localmente

Instale as dependencias:

```bash
npm install
```

Suba SQL Server e Redis:

```bash
docker compose up sqlserver redis
```

Execute migrations e seed de veiculos:

```bash
npm run db:setup
```

Inicie a API:

```bash
npm run start:dev
```

## Usuario padrao

A migration `SeedDefaultAivacolUser1780661000000` cria o usuario padrao solicitado no teste:

- Email: `aivacol@email.com`
- Senha: `aivacol`

Use essas credenciais no endpoint de login para obter o JWT.

## Swagger

Com a API rodando, acesse:

```text
http://localhost:3000/api/docs
```

## Endpoints principais

- `POST /auth/login`
- `POST /users`
- `GET /users/:id`
- `GET /users/email/:email`
- `PUT /users/:id`
- `DELETE /users/:id`
- `POST /models`
- `GET /models/:id`
- `PUT /models/:id`
- `DELETE /models/:id`
- `POST /vehicles`
- `GET /vehicles`
- `GET /vehicles/:id`
- `PUT /vehicles/:id`
- `DELETE /vehicles/:id`

O endpoint `GET /vehicles` suporta paginacao e filtros combinaveis:

- `page`
- `limit`
- `licensePlate`
- `chassis`
- `renavam`
- `year`
- `modelId`

Exemplo:

```text
GET /vehicles?page=1&limit=10&renavam=12345678901&year=2024
```

## Redis Cache

As consultas de veiculos utilizam Redis:

- `GET /vehicles/:id` usa cache por veiculo.
- `GET /vehicles` usa cache para listagem paginada e filtrada.
- `POST /vehicles`, `PUT /vehicles/:id` e `DELETE /vehicles/:id` invalidam automaticamente o cache de listagem.
- `PUT /vehicles/:id` e `DELETE /vehicles/:id` invalidam tambem o cache individual do veiculo.

O tempo de expiracao e configurado por `REDIS_TTL`.

## Seed de veiculos

O arquivo `seed_vehicles.json` contem a base solicitada para entrega.

Para importar automaticamente os modelos e veiculos do arquivo:

```bash
npm run seed:vehicles
```

O comando `npm run db:setup` executa migrations e depois importa os veiculos do seed.

## Testes

Rodar testes unitarios:

```bash
npm run test:unit
```

Rodar coverage unitario:

```bash
npm run test:unit:cov
```

Rodar lint:

```bash
npm run lint
```

Rodar build:

```bash
npm run build
```

## Migrations

Executar migrations:

```bash
npm run migration:run
```

Reverter ultima migration:

```bash
npm run migration:revert
```

As migrations criam as tabelas `users`, `models`, `vehicles`, a chave estrangeira entre `vehicles` e `models`, e o usuario padrao `aivacol`.

## Sequencia sugerida para avaliacao

1. Clonar o projeto:

```bash
git clone <url-do-repositorio>
cd aivacol-fleet-api
```

2. Criar o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Instalar as dependencias:

```bash
npm install
```

4. Subir API, SQL Server e Redis com Docker Compose:

```bash
docker compose up -d --build
```

5. Executar migrations e seed de veiculos:

```bash
npm run db:setup
```

6. Fazer login com o usuario padrao:

```text
POST /auth/login

email: aivacol@email.com
password: aivacol
```

7. Acessar o Swagger:

```text
http://localhost:3000/docs
```

8. Rodar os testes unitarios:

```bash
npm run test:unit
```

9. Rodar o coverage unitario:

```bash
npm run test:unit:cov
```
