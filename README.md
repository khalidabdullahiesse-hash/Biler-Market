<p align="center">\n  <img src=".github/assets/project-banner.svg" alt="Animated Biler Market project banner" width="100%" />\n</p>\n\n# Biler Market

A full-stack business management dashboard for products, users, and loans. The project demonstrates authenticated REST APIs, a TypeScript React frontend, MongoDB persistence, and a Docker-based development environment.

## ✨ Verified features

- User registration and login with bcrypt password hashing and JWT-based sessions
- Authenticated profile viewing, updating, deletion, and session logout
- User-scoped product creation, listing, updating, deletion, and total-value calculation
- User-scoped loan creation, listing, payment recording, and deletion
- Dashboard pages for products, users, loans, profile settings, and summary data
- Docker Compose development services for the frontend and API

## 🧰 Technology

| Area | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Axios |
| UI | Material UI, Radix UI components, Tailwind CSS 4 |
| Backend | Node.js, Express |
| Data | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Development | Docker, Docker Compose, npm |

## 🗂️ Repository structure

```text
.
├── client/
│   └── Biler-Market/       # React and TypeScript frontend
├── Server/                 # Express API, routes, controllers, and models
├── .env.example            # Safe environment-variable template
├── .gitignore
└── docker-compose.yml
```

## 🔐 Environment variables

Create a local environment file from the committed template:

```powershell
Copy-Item .env.example .env
```

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Express API port | `5000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret used to sign JWTs | Required |

Use a long, random JWT secret and a least-privilege MongoDB user. Never commit `.env` files or real credentials.

## 🐳 Run with Docker

From the repository root:

```powershell
Copy-Item .env.example .env
# Replace the placeholders in .env with local development values.
docker compose up --build
```

The API is exposed at <http://localhost:5000> and the Vite development server at <http://localhost:5173>.

## 💻 Run without Docker

Start the API:

```powershell
Set-Location Server
npm install
Copy-Item ..\.env.example .env
# Replace the placeholders in Server/.env with local development values.
npm run dev
```

In a second terminal, start the frontend:

```powershell
Set-Location client\Biler-Market
npm install --legacy-peer-deps
npm run dev
```

The frontend currently defines its API base URL in `client/Biler-Market/src/app/api/api.ts`. Point that value at `http://localhost:5000` when testing entirely locally.

## 🔌 REST API

All product, loan, and profile routes require an `Authorization: Bearer <token>` header. Registration and login are public.

| Method | Route | Behavior |
|---|---|---|
| `POST` | `/users` | Register a user and return a token |
| `POST` | `/users/login` | Authenticate a user |
| `GET` | `/users/me` | Return the authenticated profile |
| `PATCH` | `/users/me` | Update allowed profile fields |
| `DELETE` | `/users/me` | Delete the authenticated profile |
| `POST` | `/users/logout` | End the current session |
| `POST` | `/users/logoutAll` | End all sessions |
| `GET` | `/users` | List users for an authenticated request |
| `POST` | `/products` | Create a user-owned product |
| `GET` | `/products` | List the authenticated user's products |
| `GET` | `/products/total` | Calculate total product price |
| `GET` | `/products/:id` | Get one owned product |
| `PATCH` | `/products/:id` | Update one owned product |
| `DELETE` | `/products/:id` | Delete one owned product |
| `POST` | `/loans` | Create a loan |
| `GET` | `/loans` | List the authenticated user's loans |
| `GET` | `/loans/:id` | Get one owned loan |
| `PATCH` | `/loans/:id/pay` | Record a payment |
| `DELETE` | `/loans/:id` | Delete one owned loan |

## 🎯 Skills demonstrated

- Connecting a typed React client to an Express REST API
- Designing user-owned MongoDB resources with Mongoose
- Implementing token authentication and password hashing
- Organizing routes, controllers, middleware, and data models
- Running a multi-service development environment with Docker Compose

## 📌 Project status

This is a portfolio and learning project. It does not currently include an automated test suite.

## 👤 Author

Khalid Abdullahi Isse

[GitHub](https://github.com/khalidabdullahiesse-hash) · [LinkedIn](https://www.linkedin.com/in/khalid-abdullahi-isse-0461a3366)
