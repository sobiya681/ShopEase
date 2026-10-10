import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeCodOrder, startStripeCheckout } from "../api/api";

export default function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
    selectedItems,
    setSelectedItems,
    removeFromCart,
  } = useCart();

  const itemsToBuy = selectedItems.length > 0 ? selectedItems : cart;
  const itemsTotal = itemsToBuy.reduce((s, i) => s + i.price * i.quantity, 0);

  const navigate = useNavigate();

  const [loadingCod, setLoadingCod] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const buildShippingString = () =>
    `${address.fullName}, ${address.phone}, ${address.street}, ${address.city} ${address.postalCode}`;

  const validateAddress = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city
    ) {
      setError("Please fill in all delivery details.");
      return false;
    }
    return true;
  };

  
  const cleanupAfterOrder = () => {
    const purchasedIds = itemsToBuy.map((i) => i._id);
    purchasedIds.forEach((id) => removeFromCart(id));
    setSelectedItems([]);
  };

 
  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/orders");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handlePopupClose();
    }
  };

  // COD
    const handleCod = async () => {
    setError("");
    if (!validateAddress()) return;

    setLoadingCod(true);
    try {
      const { order } = await placeCodOrder(itemsToBuy, buildShippingString());
      setOrderId(order._id);
      setOrderTotal(itemsTotal);
      setShowPopup(true);
      cleanupAfterOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCod(false);
    }
  };
// Stripe
  const handleStripe = async () => {
    setError("");
    if (!validateAddress()) return;

    setLoadingStripe(true);
    try {
      const { url } = await startStripeCheckout(
        itemsToBuy,
        buildShippingString(),
      );
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoadingStripe(false);
    }
  };


  if (!cart.length && !showPopup) {
    navigate("/cart");
    return null;
  }

  return (
    <section className="center">
      <h2>Checkout</h2>
      {error && <p className="error">{error}</p>}

      {/* ORDER SUMMARY */}
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "left" }}>
        <h3 style={{ marginBottom: ".75rem" }}>Order Summary</h3>

        {itemsToBuy.map((i) => (
          <div
            key={i._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: ".4rem 0",
            }}
          >
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>${(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}

        <hr style={{ margin: "1rem 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          <span>Total</span>
          <span>${itemsTotal.toFixed(2)}</span>
        </div>

        {/* DELIVERY DETAILS */}
        <h3 style={{ margin: "1.5rem 0 .75rem" }}>Delivery Details</h3>

        <input
          name="fullName"
          placeholder="Full Name"
          value={address.fullName}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={address.phone}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="street"
          placeholder="Street Address"
          value={address.street}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="postalCode"
          placeholder="Postal Code (optional)"
          value={address.postalCode}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* PAYMENT OPTIONS */}
      <h3 style={{ margin: "2rem 0 1rem" }}>Choose Payment Method</h3>

      <div
        style={{
          display: "flex",
          gap: ".75rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: ".5rem",
        }}
      >
        <button
          onClick={handleCod}
          disabled={loadingCod || loadingStripe}
          style={{
            padding: ".75rem 1.5rem",
            borderRadius: 999,
            border: "2px solid #16a34a",
            background: "#f0fdf4",
            color: "#15803d",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: ".95rem",
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#16a34a";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.color = "#15803d";
          }}
        >
          💵 {loadingCod ? "Placing…" : "Cash on Delivery"}
        </button>

        <button
          onClick={handleStripe}
          disabled={loadingCod || loadingStripe}
          style={{
            padding: ".75rem 1.5rem",
            borderRadius: 999,
            border: "2px solid #ea580c",
            background: "#fff7ed",
            color: "#c2410c",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: ".95rem",
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ea580c";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff7ed";
            e.currentTarget.style.color = "#c2410c";
          }}
        >
          💳 {loadingStripe ? "Redirecting…" : "Pay Online"}
        </button>
      </div>

      {showPopup && (
        <div style={overlayStyle} onClick={handleBackdropClick}>
          <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
            <div style={badgeStyle}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#15803d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={titleStyle}>Order placed</h2>
            <p style={subtitleStyle}>
              Thanks, {address.fullName.split(" ")[0] || "friend"}. Your order
              is on its way.
            </p>

            <div style={metaRowStyle}>
              <span style={{ color: "#94a3b8" }}>Order ID</span>
              <span style={{ fontWeight: 600, color: "#334155" }}>
                #{orderId.slice(-6)}
              </span>
            </div>

            <div style={amountBoxStyle}>
              <span style={{ fontSize: ".85rem", color: "#78350f" }}>
                Please have ready at delivery
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#78350f",
                  marginTop: ".15rem",
                }}
              >
                ${orderTotal.toFixed(2)}
              </span>
            </div>

            <button onClick={handlePopupClose} style={primaryBtnStyle}>
              View my orders
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
// STYLES

const inputStyle = {
  display: "block",
  width: "100%",
  padding: ".7rem",
  marginBottom: ".75rem",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  fontSize: "1rem",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "1rem",
  animation: "fadeIn .2s ease",
};

const popupStyle = {
  background: "#fff",
  padding: "2rem 1.75rem 1.5rem",
  borderRadius: 16,
  maxWidth: 400,
  width: "100%",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,.15), 0 4px 12px rgba(0,0,0,.06)",
  animation: "popIn .3s cubic-bezier(.2,.9,.3,1.2)",
};

const badgeStyle = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "#dcfce7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1rem",
};

const titleStyle = {
  fontSize: "1.35rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: ".35rem",
};

const subtitleStyle = {
  color: "#64748b",
  fontSize: ".9rem",
  marginBottom: "1.5rem",
};

const metaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: ".85rem",
  padding: ".5rem .75rem",
  borderTop: "1px solid #f1f5f9",
  borderBottom: "1px solid #f1f5f9",
};

const amountBoxStyle = {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: 10,
  padding: ".85rem",
  margin: "1rem 0 1.25rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const primaryBtnStyle = {
  width: "100%",
  padding: ".8rem",
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 600,
  fontSize: ".95rem",
  cursor: "pointer",
};

const hintStyle = {
  fontSize: ".75rem",
  color: "#94a3b8",
  marginTop: ".75rem",
};
