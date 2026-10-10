import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProduct } from "../api/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;

  if (error) {
    return (
      <section className="center">
        <h2>❌ {error}</h2>
        <Link to="/products" className="btn btn-primary">
          ← Back to Products
        </Link>
      </section>
    );
  }

  if (!product) return <p>Product not found.</p>;

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} (×${qty}) added to cart`, "success");
  };

  return (
    <div className="detail">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
      />
      <div>
        <h2>{product.name}</h2>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        {product.category && (
          <p style={{ color: "#64748b" }}>{product.category}</p>
        )}
        <p>Stock: {product.stock}</p>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
          }}
        >
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            style={{
              width: 70,
              padding: ".5rem",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : `Add ${qty} to Cart`}
          </button>
        </div>

        <Link
          to="/products"
          className="btn"
          style={{ marginTop: "1.5rem", display: "inline-block" }}
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
