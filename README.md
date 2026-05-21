# DevPulse Backend API

DevPulse is a robust, production-ready backend API for managing developer issues, bugs, and feature requests. It is built with a focus on clean architecture, strict typings, and optimized database interactions.

**Key Technical Highlight:** This project exclusively uses raw SQL queries via the `pg` package. There is absolutely **no ORM** (like Prisma, Sequelize, or TypeORM), no query builders (like Knex or Drizzle), and **no SQL JOINs** used anywhere in the application. All complex data aggregation is handled efficiently at the application layer to meet strict architectural constraints.

---

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (`maintainer` and `contributor`).
- **Issue Management**: Full lifecycle management for issues (bugs and feature requests).
- **Strict Role Permissions**: 
  - Maintainers can edit any issue.
  - Contributors can only edit their own issues, and only when the status is `open`.
- **Centralized Error Handling**: A unified architecture for catching, transforming, and formatting errors consistently.
- **Raw SQL Database Interactions**: Direct execution of highly optimized PostgreSQL queries.
- **Application-Layer Joins**: Complex relationships (like attaching a reporter to an issue) are resolved using highly efficient `ANY($1)` SQL queries and O(1) Map-based merges in memory, strictly avoiding database-level `JOIN`s.

---

## 💻 Tech Stack

- **Runtime**: Node.js (LTS)
- **Language**: TypeScript (Strict Mode, NO `any` types)
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB)
- **Database Driver**: `pg` (node-postgres)
- **Security**: `bcrypt` (password hashing), `jsonwebtoken` (auth tokens)
- **Validation**: Custom validation logic with robust sanitization

---

## 📁 Folder Structure

```
src/
├── app.ts                 # Express application setup and middleware registration
├── server.ts              # Server entry point
├── config/                # Database connection, query helpers, and test scripts
├── constants/             # Enums, roles, issue types, and error messages
├── errors/                # Custom AppError class
├── interfaces/            # Strict TypeScript interfaces and type definitions
├── middleware/            # JWT authentication and centralized error handlers
├── modules/               # Feature modules (Auth, Health, Issues)
│   ├── auth/              # Signup, login, auth validation, and queries
│   ├── health/            # Server health checks
│   └── issues/            # Issue creation, retrieval, updates, and queries
└── utils/                 # Helpers (jwt sign/verify, catchAsync, sendResponse)
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (LTS version)
- PostgreSQL database (e.g., NeonDB)

### 1. Clone the repository
```bash
git clone <repository-url>
cd DevPulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env
```

Ensure the following variables are populated in your `.env` file:
```env
PORT=5000
DATABASE_URL=postgres://user:password@host/dbname?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

### 4. Database Setup
The schema definitions can be found in `src/config/schema.sql`. Execute this SQL script against your PostgreSQL database to create the required tables and constraints.

### 5. Development Commands
Start the development server with hot-reloading:
```bash
npm run dev
```

Compile TypeScript to JavaScript for production:
```bash
npm run build
```

Start the compiled production build:
```bash
npm start
```

---

## 🗄️ Database Schema Summary

The database consists of two core tables, utilizing raw SQL constraints instead of foreign keys or ORM definitions.

### `users` table
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR
- `email`: VARCHAR UNIQUE
- `password`: VARCHAR (bcrypt hashed)
- `role`: VARCHAR (CHECK constraint: 'contributor' OR 'maintainer')

### `issues` table
- `id`: SERIAL PRIMARY KEY
- `title`: VARCHAR (Max 150)
- `description`: TEXT (Min 20 chars enforced via app validation)
- `type`: VARCHAR (CHECK constraint: 'bug' OR 'feature_request')
- `status`: VARCHAR (CHECK constraint: 'open' OR 'in_progress' OR 'resolved')
- `reporter_id`: INTEGER (References user id, but NO Foreign Key constraint)

---

## 📖 API Documentation

### Authentication Format
All protected routes require the JWT token to be passed directly in the Authorization header.
**Format**: `Authorization: <JWT_TOKEN>` *(Note: Do NOT prefix with "Bearer ")*

### Endpoints

#### `POST /api/auth/signup`
Register a new user.
- **Body**: `{ "name": "John", "email": "john@example.com", "password": "password123", "role": "contributor" }`

#### `POST /api/auth/login`
Authenticate a user and receive a JWT.
- **Body**: `{ "email": "john@example.com", "password": "password123" }`

#### `POST /api/issues`
Create a new issue (Authenticated). Status defaults to `open`.
- **Body**: `{ "title": "App crashes on login", "description": "When clicking the login button, the app crashes completely.", "type": "bug" }`

#### `GET /api/issues`
Retrieve all issues with their respective reporters (Public). Supports filtering and sorting.
- **Query Params**: `?sort=newest&type=bug&status=open`

#### `GET /api/issues/:id`
Retrieve a single issue by its ID (Public).

#### `PATCH /api/issues/:id`
Update an issue's details (Authenticated).
- **Body**: `{ "title": "Updated title", "status": "in_progress" }`
- **Permissions**: Maintainers can update anything. Contributors can only update their own issues if the status is currently `open`.

---

## 🔍 Example Request & Response

**GET /api/issues/1**

*Response (200 OK):*
```json
{
  "success": true,
  "message": "Issue fetched successfully",
  "data": {
    "id": 1,
    "title": "API Rate Limiting Issue",
    "description": "The API rate limiting is too strict for legitimate users.",
    "type": "bug",
    "status": "open",
    "reporter_id": 4,
    "created_at": "2026-05-21T10:00:00.000Z",
    "updated_at": "2026-05-21T10:00:00.000Z",
    "reporter": {
      "id": 4,
      "name": "Alice Developer",
      "role": "contributor"
    }
  }
}
```

---

## 🛡️ Error Handling System

DevPulse implements a highly robust, centralized error handling mechanism:

1. **`catchAsync` Wrapper**: Completely eliminates `try/catch` repetition in controllers. Any unhandled Promise rejection is automatically forwarded to the Express `next()` function.
2. **`AppError` Class**: A custom operational error class that standardizes status codes, messages, and optional validation error arrays.
3. **Global Error Handler**: A centralized middleware that intercepts all errors before they reach the user. It intercepts and transforms:
   - PostgreSQL Errors (e.g., transforming unique constraint violations into clean `409 Conflict` responses).
   - JWT Errors (handling expired or malformed tokens cleanly).
   - Validation Failures (returning formatted arrays of field-specific errors).

**Standardized Error Response Format:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```
