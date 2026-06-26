import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import TaglineSection from "./TaglineSection";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    const q = filter.trim().toLowerCase();
    if (q) {
      filtered = products.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "id" || sortField === "price" || sortField === "quantity") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, filter, sortField, sortDirection]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setMessage("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    setEditId(product.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      setError("Delete failed");
    }
    setLoading(false);
  };

  const currency = (n) =>
    typeof n === "number" ? n.toFixed(2) : Number(n || 0).toFixed(2);

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">🛒</span>
          <div>
            <h1>Sriram Shopping Cart</h1>
            <p className="brand-subtitle">Fast inventory control with a premium shopping dashboard.</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn btn-light" onClick={fetchProducts} disabled={loading}>
            Sync
          </button>
        </div>
      </header>

      <div className="container">
        <div className="stats">
          <div className="chip">Catalog items: {products.length}</div>
          <div className="search">
            <input
              type="text"
              placeholder="Search names or descriptions..."
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="content-grid">
          <div className="card form-card">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
              <div className="form-actions">
                <button className="btn" type="submit" disabled={loading}>
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMessage("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}
          </div>

          <div className="card list-card">
            <div className="section-header">
              <div>
                <h2>Product Catalog</h2>
                <p>Manage items, edit stock, and keep the cart ready for customers.</p>
              </div>
            </div>
            {loading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className="scroll-x">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th
                        className={`sortable ${sortField === "name" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("name")}
                      >
                        Name
                      </th>
                      <th>Description</th>
                      <th
                        className={`sortable ${sortField === "price" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("price")}
                      >
                        Price
                      </th>
                      <th
                        className={`sortable ${sortField === "quantity" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("quantity")}
                      >
                        Quantity
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, index) => (
                      <tr key={p.id}>
                        <td>{index + 1}</td>
                        <td className="name-cell">{p.name}</td>
                        <td className="desc-cell" title={p.description}>{p.description}</td>
                        <td className="price-cell">${currency(p.price)}</td>
                        <td>
                          <span className="qty-badge">{p.quantity}</span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button className="btn btn-edit" onClick={() => handleEdit(p)}>
                              Edit
                            </button>
                            <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="footer-section">
        <TaglineSection />
      </footer>
    </div>
  );
}

export default App;