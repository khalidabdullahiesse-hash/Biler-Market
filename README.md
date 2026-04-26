# 🛒 Biler Market – Full Stack E-commerce App

> A scalable full-stack e-commerce application built with **React** on the frontend and **Node.js** on the backend, following a clean **MVC + Service Layer** architecture.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | CSS / Tailwind (or your choice) |

---

## ✨ Features

- 🔐 JWT-based Authentication (Register / Login)
- 👤 User Management
- 🛍️ Product CRUD (Create, Read, Update, Delete)
- 🛒 Shopping Cart Logic
- 📦 Order Processing *(in progress)*
- ⚡ Clean REST API
- ⚛️ React SPA Frontend with component-based architecture
- 🧱 Scalable MVC + Service Layer backend

---

## 🧱 Architecture

### Backend — MVC + Service Layer

```
Routes → Controllers → Services → Database
```

| Layer | Role |
|-------|------|
| **Routes** | Define API endpoints |
| **Controllers** | Handle request & response |
| **Services** | Core business logic 🔥 |
| **Middleware** | Auth, error handling |
| **DB** | MongoDB connection & models |

### Frontend — React SPA

```
Pages → Components → API Calls (Axios) → Backend REST API
```

| Layer | Role |
|-------|------|
| **Pages** | Route-level views (Home, Cart, Login…) |
| **Components** | Reusable UI pieces |
| **Context / State** | Global state (Auth, Cart) |
| **Services / API** | Axios calls to backend |

---

## 📁 Project Structure

```
my-fullstack-app/
│
├── client/                   # ⚛️ React Frontend
│   ├── public/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level pages
│       ├── context/          # Auth & Cart context
│       ├── services/         # Axios API calls
│       ├── App.jsx
│       └── main.jsx
│
├── controllers/              # Handle request & response logic
├── services/                 # Business logic (core of app 🔥)
├── routes/                   # API endpoints
├── middleware/               # Auth & error middleware
├── db/                       # Database connection & models
│
├── .env                      # Environment variables
├── package.json              # Backend dependencies
└── package-lock.json
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/my-fullstack-app.git
cd my-fullstack-app
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Run the app

**Backend:**
```bash
# From root folder
npm run dev
```

**Frontend:**
```bash
# From /client folder
npm run dev
```

> ✅ Backend runs on `http://localhost:5000`  
> ✅ Frontend runs on `http://localhost:5173` (Vite) or `3000` (CRA)

---

## 🔑 Environment Variables

Create a `.env` file in the **root** of the project:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

## 📡 API Overview

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Login & receive JWT |

### 🛍️ Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### 🛒 Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |

---

## 🧠 What I Learned

- Building scalable backend architecture (MVC + Services)
- Separating concerns cleanly between layers
- JWT authentication & protected routes
- Building a React SPA that consumes a REST API
- Managing global state with React Context
- Structuring a real-world full-stack project

---

## 📌 Future Improvements

- [ ] 💳 Payment Integration (Stripe)
- [ ] 🔍 Product search & category filters
- [ ] 🧑‍💼 Admin dashboard (React)
- [ ] ⭐ Reviews & ratings system
- [ ] 📱 Fully responsive UI
- [ ] 🚀 Deployment (Render + Vercel / Netlify)
- [ ] 🧪 Unit & integration tests (Jest + React Testing Library)

---

## 🖼️ Screenshots

> 📸 Add screenshots of your UI here — this is **very important** for GitHub!

---

## 🌐 Live Demo

> 🔗 Add your deployed link here

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to fork the repo and open a PR.

---

## 📄 License

MIT License © 2024 Khalid Abdullahi Isse

---

## 👨‍💻 Author

**Khalid Abdullahi Isse**  
[![GitHub](https://img.shields.io/badge/GitHub-your--username-181717?style=flat&logo=github)](https://github.com/your-username)

---

## 🔥 Senior-Level Improvements (Next Steps)

To push this project from mid to **senior level**:

| Improvement | Tool / Approach |
|-------------|----------------|
| ✅ Input Validation | `Joi` or `express-validator` |
| ✅ Global Error Handler | Custom Express middleware |
| ✅ Logging | `Morgan` (HTTP) + `Winston` (app logs) |
| ✅ API Documentation | `Swagger` / `swagger-ui-express` |
| ✅ React Query / SWR | Better data fetching & caching |
| ✅ Protected Routes | React Router + Auth Context |
| ✅ Docker | `Dockerfile` + `docker-compose.yml` |
| ✅ Tests | Jest (backend) + React Testing Library |

---

> 💡 **This project already shows strong architectural thinking — the Service Layer alone puts it ahead of most junior portfolios.**
