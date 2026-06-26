# 🛒 Sriram Shopping Cart

A full-stack product inventory management system built with **FastAPI** + **PostgreSQL** backend and **React** frontend, fully deployed on the web.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![Deploy](https://img.shields.io/badge/Deploy-Live-brightgreen)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | https://sriramakanthpendikatla.github.io/fastapi-shoppingcart |
| ⚙️ Backend API | https://fastapi-shoppingcart.onrender.com |
| 📖 API Docs | https://fastapi-shoppingcart.onrender.com/docs |

> ⚠️ The backend is hosted on Render's free tier — first request may take ~50 seconds to wake up.

---

## ✨ Features

- 📦 **Full CRUD** — Create, Read, Update, Delete products
- 🔍 **Live Search** — Filter products by name or description
- ↕️ **Sortable Columns** — Sort by name, price, or quantity
- 🔢 **Auto Row Numbers** — Clean sequential numbering regardless of deletions
- ✅ **Form Validation** — Required fields with error feedback
- 🔔 **Auto-dismiss Alerts** — Success/error messages fade after 5 seconds
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Database | PostgreSQL 16 (Neon.tech - free tier) |
| Frontend | React 18, Axios |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages (frontend), Render (backend) |

---

## 📁 Project Structure

```
fastapi-shoppingcart/
├── main.py               # FastAPI app & all routes
├── database.py           # SQLAlchemy engine & session
├── database_models.py    # ORM models (Product table)
├── models.py             # Pydantic schemas
├── requirements.txt      # Python dependencies
├── Dockerfile            # Backend container
├── docker-compose.yml    # Full stack local setup
├── .env.example          # Environment variable template
└── frontend/
    ├── src/
    │   ├── App.js        # Main React component
    │   ├── App.css       # Styles
    │   └── TaglineSection.js
    ├── Dockerfile        # Frontend container (nginx)
    ├── nginx.conf        # Nginx config
    └── package.json
```

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
git clone https://github.com/sriramakanthpendikatla/fastapi-shoppingcart.git
cd fastapi-shoppingcart
docker compose up --build
```

- Frontend → http://localhost
- API Docs → http://localhost:8000/docs

### Option 2 — Local Development

**Backend:**
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Run
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/products` | Get all products |
| `GET` | `/products/{id}` | Get product by ID |
| `POST` | `/products` | Create new product |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |

### Example Request

```bash
# Create a product
curl -X POST https://fastapi-shoppingcart.onrender.com/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "Gaming laptop", "price": 999.99, "quantity": 5}'
```

### Example Response

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 999.99,
    "quantity": 5
  }
}
```

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000` |

---

## 🔄 CI/CD Pipeline

Every push to `main` automatically:

1. ✅ **Builds** the React frontend
2. ✅ **Runs** Python syntax checks on the backend
3. ✅ **Deploys** the frontend to GitHub Pages

---

## 👨‍💻 Author

**Sri RamaKanth Pendikatla**  
B.Tech CSE (AI & ML) — VVIT, Andhra Pradesh  
ACM Chapter Chairperson | Backend Python Developer | AI/ML Engineer

[![GitHub](https://img.shields.io/badge/GitHub-sriramakanthpendikatla-181717?logo=github)](https://github.com/sriramakanthpendikatla)
