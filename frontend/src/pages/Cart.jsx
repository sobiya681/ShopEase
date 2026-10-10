import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    setSelectedItems, 
  } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

 
  const [selectedIds, setSelectedIds] = useState(
    () => cart.map((item) => item._id) 
  );

  const allSelected = cart.length > 0 && selectedIds.length === cart.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(cart.map((i) => i._id));
  };

  const handleRemove = (item) => {
    removeFromCart(item._id);
    setSelectedIds((prev) => prev.filter((x) => x !== item._id));
    showToast(`${item.name} removed from cart`, "error");
  };

  const handleClear = () => {
    clearCart();
    setSelectedIds([]);
    showToast("Cart cleared", "error");
  };

  const handleCheckout = () => {
    if (!selectedIds.length) {
      showToast("Select at least one item to checkout", "error");
      return;
    }

    const selectedCart = cart.filter((i) => selectedIds.includes(i._id));

    setSelectedItems(selectedCart);

    navigate("/checkout");
  };


  const selectedCart = cart.filter((i) => selectedIds.includes(i._id));
  const selectedCount = selectedCart.reduce((s, i) => s + i.quantity, 0);
  const selectedTotal = selectedCart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  if (!cart.length) {
    return (
      <section className="center" style={{ padding: "4rem 1rem" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🛒</div>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section style={{ padding: "1rem 0" }}>
     {/* HEADER */}
      <div style={headerRowStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={toggleAll}
            style={checkboxStyle}
            id="select-all"
          />
          <label htmlFor="select-all" style={selectAllLabelStyle}>
            Select all ({cart.length})
          </label>
        </div>
        <span style={{ color: "#64748b", fontSize: ".9rem" }}>
          {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
        </span>
      </div>

      <div style={layoutStyle}>
       {/* LEFT: ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          {cart.map((item) => {
            const checked = selectedIds.includes(item._id);
            return (
              <div
                key={item._id}
                style={{
                  ...cartItemStyle,
                  borderColor: checked ? "#c2410c" : "#f1f5f9",
                  background: checked ? "#fffbf7" : "#fff",
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(item._id)}
                  style={checkboxStyle}
                />

                {/* Image */}
                <Link to={`/products/${item._id}`} style={{ flexShrink: 0 }}>
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    style={imageStyle}
                  />
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/products/${item._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 style={titleStyle}>{item.name}</h3>
                  </Link>
                  {item.category && (
                    <p style={categoryStyle}>{item.category}</p>
                  )}
                  <p style={priceStyle}>
                    ${Number(item.price).toFixed(2)} each
                  </p>
                </div>

                {/* Qty */}
                <div style={qtyWrapperStyle}>
                  <button
                    style={qtyBtnStyle}
                    onClick={() =>
                      updateQty(item._id, Math.max(1, item.quantity - 1))
                    }
                  >
                    −
                  </button>
                  <span style={qtyValueStyle}>{item.quantity}</span>
                  <button
                    style={qtyBtnStyle}
                    onClick={() =>
                      updateQty(
                        item._id,
                        Math.min(item.stock, item.quantity + 1)
                      )
                    }
                  >
                    +
                  </button>
                </div>

              
                <div style={lineTotalStyle}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item)}
                  style={removeBtnStyle}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

       {/* SUMMARY */}
        <aside style={summaryStyle}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.15rem" }}>
            Order Summary
          </h3>

          <div style={summaryRowStyle}>
            <span style={{ color: "#64748b" }}>
              Selected ({selectedCount} item
              {selectedCount !== 1 ? "s" : ""})
            </span>
            <span>${selectedTotal.toFixed(2)}</span>
          </div>

          <div style={summaryRowStyle}>
            <span style={{ color: "#64748b" }}>Shipping</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
          </div>

          <div style={summaryRowStyle}>
            <span style={{ color: "#64748b" }}>Tax</span>
            <span>$0.00</span>
          </div>

          <hr
            style={{
              margin: "1rem 0",
              border: "none",
              borderTop: "1px solid #e2e8f0",
            }}
          />

          <div
            style={{ ...summaryRowStyle, fontSize: "1.15rem", fontWeight: 700 }}
          >
            <span>Total</span>
            <span style={{ color: "#c2410c" }}>
              ${selectedTotal.toFixed(2)}
            </span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleCheckout}
            disabled={!selectedIds.length}
            style={{
              width: "100%",
              marginTop: "1.25rem",
              padding: ".9rem",
              opacity: selectedIds.length ? 1 : 0.5,
              cursor: selectedIds.length ? "pointer" : "not-allowed",
            }}
          >
            {selectedIds.length
              ? `Checkout ${selectedCount} item${
                  selectedCount !== 1 ? "s" : ""
                }`
              : "Select items to checkout"}
          </button>

          <button
            onClick={handleClear}
            style={{
              width: "100%",
              marginTop: ".5rem",
              padding: ".7rem",
              background: "none",
              border: "none",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: ".9rem",
            }}
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </section>
  );
}

// STYLES

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.25rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #f1f5f9",
  flexWrap: "wrap",
  gap: ".75rem",
};

const selectAllLabelStyle = {
  fontSize: ".9rem",
  fontWeight: 500,
  color: "#334155",
  cursor: "pointer",
  userSelect: "none",
};

const checkboxStyle = {
  width: 18,
  height: 18,
  accentColor: "#c2410c",
  cursor: "pointer",
  flexShrink: 0,
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "1.5rem",
  alignItems: "start",
};

const cartItemStyle = {
  display: "grid",
  gridTemplateColumns: "auto 90px 1fr auto auto auto",
  gap: ".85rem",
  alignItems: "center",
  padding: ".85rem",
  background: "#fff",
  borderRadius: 12,
  border: "1.5px solid #f1f5f9",
  transition: "border-color .15s, background .15s",
};

const imageStyle = {
  width: 90,
  height: 90,
  objectFit: "cover",
  borderRadius: 10,
  display: "block",
};

const titleStyle = {
  fontSize: ".95rem",
  fontWeight: 600,
  marginBottom: ".15rem",
  lineHeight: 1.35,
};

const categoryStyle = {
  fontSize: ".78rem",
  color: "#94a3b8",
  marginBottom: ".3rem",
  textTransform: "uppercase",
  letterSpacing: ".04em",
  fontWeight: 500,
};

const priceStyle = {
  color: "#c2410c",
  fontWeight: 600,
  fontSize: ".9rem",
  margin: 0,
};

const qtyWrapperStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  overflow: "hidden",
};

const qtyBtnStyle = {
  background: "#f8fafc",
  border: "none",
  width: 30,
  height: 34,
  cursor: "pointer",
  fontSize: ".95rem",
  fontWeight: 600,
  color: "#0f172a",
};

const qtyValueStyle = {
  width: 36,
  textAlign: "center",
  fontWeight: 600,
  fontSize: ".9rem",
};

const lineTotalStyle = {
  fontWeight: 700,
  fontSize: ".95rem",
  minWidth: 76,
  textAlign: "right",
  color: "#0f172a",
};

const removeBtnStyle = {
  background: "none",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
  fontSize: "1.05rem",
  padding: ".35rem .5rem",
  borderRadius: 6,
};

const summaryStyle = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: 12,
  border: "1px solid #f1f5f9",
  position: "sticky",
  top: "90px",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: ".4rem 0",
  fontSize: ".92rem",
};