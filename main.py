import os
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import database_models
from models import Product


app = FastAPI(title="Shopping Cart API", version="1.0.0")

# BUG FIX: CORS allow_credentials=True was missing; also support env-configurable origins
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:80,http://frontend:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,      # BUG FIX: was missing
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
database_models.Base.metadata.create_all(bind=database.engine)


# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Seed data ---
SEED_PRODUCTS = [
    {"name": "Laptop",       "description": "Lightweight laptop",           "price": 999.99, "quantity": 10},
    {"name": "Smartphone",   "description": "Android smartphone",           "price": 599.99, "quantity": 25},
    {"name": "Headphones",   "description": "Noise-cancelling headphones",  "price": 199.99, "quantity": 15},
    {"name": "Backpack",     "description": "Waterproof backpack",          "price":  49.99, "quantity": 40},
    {"name": "Smartwatch",   "description": "Fitness smartwatch",           "price": 149.99, "quantity": 20},
    {"name": "Keyboard",     "description": "Mechanical keyboard",          "price":  89.99, "quantity": 30},
    {"name": "Mouse",        "description": "Wireless mouse",               "price":  29.99, "quantity": 50},
    {"name": "Monitor",      "description": "24-inch monitor",              "price": 179.99, "quantity": 12},
    {"name": "External SSD", "description": "Portable SSD drive",          "price": 129.99, "quantity": 18},
    {"name": "Webcam",       "description": "HD webcam",                    "price":  59.99, "quantity": 22},
]


def init_db():
    """Seed the DB if empty — called once at startup."""
    db = database.SessionLocal()
    try:
        if db.query(database_models.Product).count() == 0:
            for p in SEED_PRODUCTS:
                db.add(database_models.Product(**p))
            db.commit()
    finally:
        db.close()


init_db()


# --- Helpers ---
def product_to_dict(product: database_models.Product) -> dict:
    return {
        "id":          product.id,
        "name":        product.name,
        "description": product.description,
        "price":       product.price,
        "quantity":    product.quantity,
    }


# --- Routes ---
@app.get("/")
def welcome():
    return {"message": "Welcome to Shopping Cart API"}


@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    return [product_to_dict(p) for p in db.query(database_models.Product).all()]


@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_to_dict(product)


@app.post("/products", status_code=201)   # BUG FIX: POST should return 201 Created
def add_product(product: Product, db: Session = Depends(get_db)):
    # BUG FIX: exclude id from dump so DB auto-increments it
    data = product.model_dump(exclude={"id"})
    db_product = database_models.Product(**data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {"message": "Product created successfully", "product": product_to_dict(db_product)}


@app.put("/products/{id}")
def update_product(id: int, updated: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.name        = updated.name
    db_product.description = updated.description
    db_product.price       = updated.price
    db_product.quantity    = updated.quantity
    db.commit()
    db.refresh(db_product)
    return {"message": "Product updated successfully", "product": product_to_dict(db_product)}


@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
