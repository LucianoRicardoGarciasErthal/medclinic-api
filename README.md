# MedClinic API

API REST para gerenciamento de clínica médica — Etapa 1: Autenticação e Autorização.

## 📋 Escopo desta etapa

Esta é a primeira etapa do projeto MedClinic API. Nesta fase, foi construída a base de autenticação e autorização do sistema:

- Cadastro de usuários com senha criptografada (bcryptjs)
- Login com emissão de token JWT
- Middleware de autenticação (validação de JWT)
- Autorização baseada em perfis (RBAC) com dois papéis: `ADMIN` e `ATENDENTE`
- Endpoints de verificação (`GET /users/me` e `GET /admin/ping`)
- Tratamento centralizado de erros com status HTTP semânticos

As funcionalidades de gerenciamento de especialidades, médicos, pacientes e consultas serão implementadas em etapas futuras.

## 🛠 Tecnologias

- **Node.js** 20+
- **TypeScript** 5
- **Express** 4
- **TypeORM** 0.3 (Data Mapper)
- **PostgreSQL** 14+
- **JWT** (jsonwebtoken)
- **bcryptjs** (hash de senha)
- **dotenv** (variáveis de ambiente)
- **cors** (política de tráfego interdomínio)
- **express-async-errors** (captura de erros assíncronos)
- **tsx** (execução em desenvolvimento)
- **ts-node** (CLI de migrations)

## 📦 Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL 14 ou superior em execução
- npm 10 ou superior

## ⚙️ Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/LucianoRicardoGarciasErthal/medclinic-api.git
cd medclinic-api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=medclinic
DB_SYNCHRONIZE=false
DB_LOGGING=true

JWT_SECRET=troque-esta-chave-em-producao
JWT_EXPIRES_IN=1h
```

### 4. Criar o banco de dados

```bash
createdb -U postgres medclinic
```

Ou via `psql`:

```sql
CREATE DATABASE medclinic;
```

### 5. Executar as migrations

```bash
npm run migration:run
```

Isso cria as tabelas `users` e `migrations`.

### 6. Iniciar a aplicação

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## 🏗 Arquitetura

O projeto segue o padrão **MVC em camadas**, com separação de responsabilidades:

```
src/
├── config/         # DataSource do TypeORM
├── controllers/    # Recebem requisições HTTP e retornam respostas
├── database/       # Migrations versionadas
│   └── migrations/
├── dtos/           # Data Transfer Objects (entrada/saída)
├── entities/       # Entidades TypeORM
├── errors/         # AppError (erros de negócio)
├── middlewares/    # Autenticação (JWT), autorização (RBAC) e erros
├── repositories/   # Acesso ao banco (TypeORM)
├── routes/         # Definição de endpoints
├── services/       # Regras de negócio
├── utils/          # Hash de senha e geração/validação de JWT
└── server.ts       # Bootstrap da aplicação
```

**Fluxo de uma requisição:**

```
Cliente HTTP → Route → Middleware (Auth/RBAC) → Controller → Service → Repository → PostgreSQL
```

## 🔐 Endpoints

### POST /auth/register

Cadastra um novo usuário.

**Body:**
```json
{
  "nome": "Admin",
  "email": "admin@medclinic.com",
  "senha": "admin123",
  "role": "ADMIN"
}
```

**Resposta 201:**
```json
{
  "id": "uuid",
  "nome": "Admin",
  "email": "admin@medclinic.com",
  "role": "ADMIN",
  "createdAt": "2026-09-13T11:31:56.369Z"
}
```

**Erros:**
- `400` — campos obrigatórios ausentes, e-mail inválido ou senha curta
- `409` — e-mail já cadastrado

---

### POST /auth/login

Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "admin@medclinic.com",
  "senha": "admin123"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "nome": "Admin",
    "email": "admin@medclinic.com",
    "role": "ADMIN",
    "createdAt": "2026-09-13T11:31:56.369Z"
  }
}
```

**Erros:**
- `400` — campos obrigatórios ausentes
- `401` — credenciais inválidas

---

### GET /users/me

Retorna os dados do usuário autenticado. Requer token JWT.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta 200:**
```json
{
  "id": "uuid",
  "nome": "Admin",
  "email": "admin@medclinic.com",
  "role": "ADMIN",
  "createdAt": "2026-09-13T11:31:56.369Z"
}
```

**Erros:**
- `401` — token ausente, inválido ou expirado

---

### GET /admin/ping

Endpoint restrito ao perfil `ADMIN`. Requer token JWT com `role: "ADMIN"`.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta 200:**
```json
{
  "status": "ok",
  "message": "pong",
  "timestamp": "2026-09-13T11:49:18.594Z"
}
```

**Erros:**
- `401` — token ausente, inválido ou expirado
- `403` — usuário autenticado sem permissão (não é ADMIN)

## 👥 Perfis de acesso

| Perfil | Descrição |
|---|---|
| `ADMIN` | Acesso completo à API |
| `ATENDENTE` | Acesso operacional restrito |

O controle é feito pelo `roleMiddleware`, que verifica o papel do usuário autenticado antes de permitir o acesso ao endpoint.

## 📜 Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em desenvolvimento com watch |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa o build de produção |
| `npm run migration:run` | Executa migrations pendentes |
| `npm run migration:revert` | Reverte a última migration |
| `npm run migration:show` | Lista migrations executadas |

## 🗄 Banco de dados

### Tabela `users`

| Coluna | Tipo | Restrição |
|---|---|---|
| `id` | uuid | PK, default `uuid_generate_v4()` |
| `nome` | varchar(100) | NOT NULL |
| `email` | varchar(150) | NOT NULL, UNIQUE |
| `senha` | varchar(255) | NOT NULL (hash bcrypt) |
| `role` | enum `users_role_enum` | NOT NULL, default `'ATENDENTE'` |
| `created_at` | timestamp | NOT NULL, default `CURRENT_TIMESTAMP` |

### Tabela `migrations`

Controla as migrations executadas no banco.

## 🔒 Segurança

- Senhas armazenadas com hash bcrypt (nunca em texto puro)
- Token JWT com tempo de expiração configurável
- Credenciais do banco e chave JWT em arquivo `.env` (não versionado)
- Validação de permissão por papel (RBAC)
- Middleware central de tratamento de erros

## 🐛 Troubleshooting

### Erro: `Cannot find module 'ts-node'`

Rode:
```bash
npm install -D ts-node

## 📝 Licença

ISC