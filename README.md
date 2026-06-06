# Aivacol Fleet API

API Backend para gerenciamento de marcas, modelos e veiculos, desenvolvida para o teste tecnico Backend da Aivacol.

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
- `CORS_ORIGIN`: origens permitidas para CORS, separadas por virgula.

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
http://localhost:3000/docs
```

O Swagger fica disponivel em ambientes diferentes de `production`.

## Endpoints principais

A API usa o prefixo global `/api`.

- `POST /api/auth/login`
- `POST /api/users`
- `GET /api/users/:id`
- `GET /api/users/email/:email`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/brands`
- `GET /api/brands/:id`
- `PUT /api/brands/:id`
- `DELETE /api/brands/:id`
- `POST /api/models`
- `GET /api/models/:id`
- `PUT /api/models/:id`
- `DELETE /api/models/:id`
- `POST /api/vehicles`
- `GET /api/vehicles`
- `GET /api/vehicles/:id`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

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
GET /api/vehicles?page=1&limit=10&renavam=12345678901&year=2024
```

## Modelagem

A relacao principal da frota segue:

```text
brands 1:N models
models 1:N vehicles
```

Campos principais:

- `brands`: `id`, `name`, `created_at`, `updated_at`, `created_by`.
- `models`: `id`, `name`, `brand_id`, `created_at`, `updated_at`, `created_by`.
- `vehicles`: `id`, `license_plate`, `chassis`, `renavam`, `year`, `model_id`, `created_at`, `updated_at`, `created_by`.

Campos unicos:

- `users.email`
- `brands.name`
- `models.name`
- `vehicles.license_plate`
- `vehicles.chassis`
- `vehicles.renavam`

As regras de unicidade sao validadas nos casos de uso antes da persistencia e tambem protegidas por constraints no banco.

## Redis Cache

As consultas de veiculos utilizam Redis:

- `GET /vehicles/:id` usa cache por veiculo.
- `GET /vehicles` usa cache para listagem paginada e filtrada.
- `POST /vehicles`, `PUT /vehicles/:id` e `DELETE /vehicles/:id` invalidam automaticamente o cache de listagem.
- `PUT /vehicles/:id` e `DELETE /vehicles/:id` invalidam tambem o cache individual do veiculo.

O tempo de expiracao e configurado por `REDIS_TTL`.

## Seed de veiculos

O arquivo `seed_vehicles.json` contem a base solicitada para entrega, incluindo marca, modelo e veiculo.

Para importar automaticamente as marcas, modelos e veiculos do arquivo:

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

Rodar auditoria de dependencias para vulnerabilidades altas ou criticas:

```bash
npm run audit:high
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

As migrations criam as tabelas `users`, `brands`, `models`, `vehicles`, a chave estrangeira entre `models` e `brands`, a chave estrangeira entre `vehicles` e `models`, e o usuario padrao `aivacol`.

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
POST /api/auth/login

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
