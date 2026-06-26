from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    id: Optional[int] = None   # BUG FIX: id was required on POST; make it optional
    name: str
    description: str
    price: float
    quantity: int
