import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, "success");
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div style={cardStyle}>
    
      <div style={imageWrapStyle}>
        <img
          src={product.image || "https://via.placeholder.com/300x200"}
          alt={product.name}
          style={imageStyle}
        />
        {isOutOfStock && <span style={soldOutBadgeStyle}>Sold out</span>}
      </div>

      {/* Category tag */}
      {product.category && (
        <span style={categoryTagStyle}>{product.category}</span>
      )}

      <h3 style={titleStyle}>{product.name}</h3>
      <p style={priceStyle}>${Number(product.price).toFixed(2)}</p>
      <p style={stockStyle}>
        <span style={stockDotStyle(isOutOfStock)} />
        {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
      </p>

      <div style={actionsStyle}>
        <Link to={`/products/${product._id}`} style={viewBtnStyle}>
          View
        </Link>
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          style={addBtnStyle(isOutOfStock)}
          onMouseEnter={(e) => {
            if (!isOutOfStock) {
              e.currentTarget.style.background = "#9a3412";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOutOfStock) {
              e.currentTarget.style.background = "#c2410c";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// styles

const cardStyle = {
  background: "#fff",
  border: "1px solid #f1f5f9",
  borderRadius: 12,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: ".55rem",
  transition: "box-shadow .2s, transform .2s",
};

const imageWrapStyle = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 10,
  background: "#fafafa",
};

const imageStyle = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  display: "block",
  transition: "transform .35s ease",
};

const soldOutBadgeStyle = {
  position: "absolute",
  top: 10,
  left: 10,
  background: "rgba(15,23,42,.85)",
  color: "#fff",
  fontSize: ".7rem",
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  padding: ".3rem .7rem",
  borderRadius: 999,
};

const categoryTagStyle = {
  alignSelf: "flex-start",
  fontSize: ".7rem",
  fontWeight: 600,
  color: "#9a3412",
  background: "#fff7ed",
  padding: ".25rem .6rem",
  borderRadius: 999,
  letterSpacing: ".03em",
  textTransform: "uppercase",
  marginTop: ".25rem",
};

const titleStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#0f172a",
  lineHeight: 1.35,
  margin: 0,
};

const priceStyle = {
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "#c2410c",
  margin: 0,
};

const stockStyle = {
  fontSize: ".82rem",
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  gap: ".4rem",
  margin: 0,
};

const stockDotStyle = (out) => ({
  width: 7,
  height: 7,
  borderRadius: "50%",
  background: out ? "#dc2626" : "#16a34a",
  display: "inline-block",
});

const actionsStyle = {
  display: "flex",
  gap: ".5rem",
  marginTop: ".5rem",
};

const viewBtnStyle = {
  flex: "0 0 auto",
  padding: ".55rem 1rem",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#475569",
  fontWeight: 600,
  fontSize: ".85rem",
  textDecoration: "none",
  textAlign: "center",
  transition: "background .15s",
};

const addBtnStyle = (out) => ({
  flex: 1,
  padding: ".55rem 1rem",
  borderRadius: 8,
  border: "none",
  background: out ? "#e2e8f0" : "#c2410c",
  color: out ? "#94a3b8" : "#fff",
  fontWeight: 600,
  fontSize: ".85rem",
  cursor: out ? "not-allowed" : "pointer",
  transition: "background .2s, transform .15s",
});
