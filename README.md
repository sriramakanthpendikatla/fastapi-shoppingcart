# FastAPI Shopping Cart

Full-stack shopping cart — FastAPI + PostgreSQL backend, React frontend.

## Quick Start (Docker)

```bash
# 1. Clone
git clone https://github.com/sriramakanthpendikatla/fastapi-shoppingcart.git
cd fastapi-shoppingcart

# 2. Start everything
docker compose up --build

# 3. Open
#   Frontend → http://localhost
#   API docs  → http://localhost:8000/docs
```

## Local Development (without Docker)

### Backend
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set DB connection
export DATABASE_URL=postgresql://postgres:admin123@localhost:5432/shoppingcart

uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

## API Endpoints

| Method | Path            | Description        |
|--------|-----------------|--------------------|
| GET    | /products       | List all products  |
| GET    | /products/{id}  | Get one product    |
| POST   | /products       | Create product     |
| PUT    | /products/{id}  | Update product     |
| DELETE | /products/{id}  | Delete product     |
