import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmStripeOrder } from "../api/api";
import { useCart } from "../context/CartContext";

export default function Success() {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing session id.");
      return;
    }

    confirmStripeOrder(sessionId)
      .then((data) => {
        clearCart();
        setStatus("success");
        setOrderId(data?.order?._id || "");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Something went wrong.");
      });
  }, [params, clearCart]);

  // LOADING
  if (status === "loading") {
    return (
      <section style={pageStyle}>
        <div style={spinnerStyle} />
        <h2 style={{ fontSize: "1.2rem", color: "#334155", marginTop: "1.5rem" }}>
          Confirming your payment…
        </h2>
        <p style={{ color: "#94a3b8", fontSize: ".9rem", marginTop: ".5rem" }}>
          Please don't close this window.
        </p>
      </section>
    );
  }

  // ERROR
  if (status === "error") {
    return (
      <section style={pageStyle}>
        <div style={{ ...badgeStyle, background: "#fee2e2" }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h2 style={titleStyle}>Payment couldn't be verified</h2>
        <p style={subtitleStyle}>{message}</p>

        <div style={btnRowStyle}>
          <Link to="/checkout" style={primaryBtnStyle}>
            Try again
          </Link>
          <Link to="/products" style={secondaryBtnStyle}>
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  // SUCCESS
  return (
    <section style={pageStyle}>
     
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

      <h2 style={titleStyle}>Payment successful</h2>
      

      {/* Order ID row */}
      {orderId && (
        <div style={metaRowStyle}>
          <span style={{ color: "#94a3b8" }}>Order ID</span>
          <span style={{ fontWeight: 600, color: "#334155" }}>
            #{orderId.slice(-6)}
          </span>
        </div>
      )}
      

      <div style={btnRowStyle}>
        <Link to="/orders" style={primaryBtnStyle}>
          View my orders
        </Link>
        <Link to="/products" style={secondaryBtnStyle}>
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

/* STYLES */

const pageStyle = {
  minHeight: "calc(100vh - 200px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem 1rem",
  textAlign: "center",
  animation: "fadeIn .3s ease",
};

const badgeStyle = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "#dcfce7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1.25rem",
  animation: "popIn .4s cubic-bezier(.2,.9,.3,1.2)",
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: ".5rem",
  letterSpacing: "-.01em",
};

const subtitleStyle = {
  color: "#64748b",
  fontSize: ".95rem",
  maxWidth: 420,
  marginBottom: "1.5rem",
  lineHeight: 1.5,
};

const metaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "2rem",
  fontSize: ".85rem",
  padding: ".6rem 1rem",
  borderTop: "1px solid #f1f5f9",
  borderBottom: "1px solid #f1f5f9",
  width: "100%",
  maxWidth: 380,
  marginBottom: "1rem",
};

const amountBoxStyle = {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: 10,
  padding: ".85rem 1.5rem",
  marginBottom: "1.75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const btnRowStyle = {
  display: "flex",
  gap: ".75rem",
  flexWrap: "wrap",
  justifyContent: "center",
};

const primaryBtnStyle = {
  padding: ".75rem 1.5rem",
  borderRadius: 10,
  background: "#0f172a",
  color: "#fff",
  fontWeight: 600,
  fontSize: ".95rem",
  textDecoration: "none",
  transition: "background .2s",
};

const secondaryBtnStyle = {
  padding: ".75rem 1.5rem",
  borderRadius: 10,
  background: "#fff",
  color: "#334155",
  fontWeight: 600,
  fontSize: ".95rem",
  textDecoration: "none",
  border: "1px solid #e2e8f0",
  transition: "all .2s",
};

const spinnerStyle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "3px solid #e2e8f0",
  borderTopColor: "#0f172a",
  animation: "spin 1s linear infinite",
};