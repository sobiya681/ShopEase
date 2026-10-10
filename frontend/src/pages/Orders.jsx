import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, apiFetch } from "../api/api";
import { useToast } from "../context/ToastContext";

const statusMeta = {
  "cod-pending": { text: "Cash on Delivery", color: "#d97706" },
  paid: { text: "Paid", color: "#16a34a" },
  pending: { text: "Awaiting Payment", color: "#d97706" },
  cancelled: { text: "Cancelled", color: "#dc2626" },
  refunded: { text: "Refunded", color: "#7c3aed" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const { showToast } = useToast();

  const loadOrders = () => {
    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

// CANCEL
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: "PUT" });
      showToast("Order cancelled", "error");
      loadOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // TRACK
  const handleTrack = async (orderId) => {
    try {
      const data = await apiFetch(`/orders/${orderId}/track`, {
        method: "PUT",
      });
      setTracking(data);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // REMOVE 
  const handleRemoveClick = (orderId, wasCancelled) => {
    setConfirmModal({ orderId, wasCancelled });
  };

  // CONFIRM REMOVE
  const confirmRemove = async () => {
    if (!confirmModal) return;
    const { orderId, wasCancelled } = confirmModal;
    try {
     
      if (!wasCancelled) {
        await apiFetch(`/orders/${orderId}/cancel`, { method: "PUT" });
      }
      await apiFetch(`/orders/${orderId}`, { method: "DELETE" });
      showToast(
        wasCancelled ? "Order removed" : "Order cancelled and removed",
        "error",
      );
      setConfirmModal(null);
      loadOrders();
    } catch (err) {
      showToast(err.message, "error");
      setConfirmModal(null);
    }
  };

  if (loading)
    return <p style={{ padding: "2rem", color: "#64748b" }}>Loading…</p>;
  if (error)
    return <p style={{ padding: "2rem", color: "#dc2626" }}>{error}</p>;

  if (!orders.length) {
    return (
      <section style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: ".5rem" }}>No orders yet</h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
          Your orders will show up here.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section style={{ padding: "2rem 0", maxWidth: 1000, margin: "0 auto" }}>
      {/* Page heading */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={pageTitleStyle}>My Orders</h1>
        <p style={pageSubtitleStyle}>
          View and track all your recent orders here.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {orders.map((o) => {
          const status = statusMeta[o.paymentStatus] || {
            text: o.paymentStatus,
            color: "#64748b",
          };
          const canCancel =
            o.paymentStatus !== "cancelled" && o.paymentStatus !== "paid";
          const isCancelled = o.paymentStatus === "cancelled";

          return (
            <article key={o._id} style={cardStyle}>
            {/* header */}
              <div style={headerStyle}>
                <div style={headerLeftStyle}>
                  <span style={orderIdPillStyle}>
                    Order <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                  </span>
                  <span style={headerDateStyle}>
                    Order placed:{" "}
                    {new Date(o.createdAt).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <button
                  onClick={() => handleTrack(o._id)}
                  style={trackBtnStyle}
                >
                  Track Order
                </button>
              </div>

              {/* ITEMS */}
              <div style={itemsContainerStyle}>
                {o.items.map((item, idx) => (
                  <div key={idx} style={itemRowStyle}>
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      style={itemImgStyle}
                    />

                    <div style={itemInfoStyle}>
                      <h3 style={itemNameStyle}>{item.name}</h3>
                      <p style={itemMetaStyle}>
                        Size: &nbsp; Qty: <strong>{item.quantity}</strong>
                      </p>
                      <p style={itemPriceStyle}>${item.price.toFixed(2)}</p>
                    </div>

                    <div style={columnStyle}>
                      <div style={columnLabelStyle}>Status</div>
                      <div style={{ ...columnValueStyle, color: status.color }}>
                        {status.text}
                      </div>
                    </div>

                    <div style={columnStyle}>
                      <div style={columnLabelStyle}>Delivery Expected by</div>
                      <div style={columnValueStyle}>
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            {/* FOOTER */}
              <div style={footerStyle}>
                <div style={footerLeftStyle}>
                  {isCancelled ? (
                    // Show Remove only for cancelled orders
                    <button
                      onClick={() => handleRemoveClick(o._id, true)}
                      style={removeBtnStyle}
                    >
                      🗑 Remove
                    </button>
                  ) : canCancel ? (
                    // COD pending 
                    <>
                      <button
                        onClick={() => handleCancel(o._id)}
                        style={cancelBtnStyle}
                      >
                        × Cancel Order
                      </button>
                      <button
                        onClick={() => handleRemoveClick(o._id, false)}
                        style={removeBtnStyle}
                      >
                        🗑 Remove
                      </button>
                    </>
                  ) : (
                    
                    <button
                      onClick={() => handleRemoveClick(o._id, false)}
                      style={removeBtnStyle}
                    >
                      🗑 Remove
                    </button>
                  )}
                </div>

                <div style={footerCenterStyle}>
                  {o.paymentStatus === "paid"
                    ? "Paid via Stripe"
                    : o.paymentStatus === "cod-pending"
                      ? "Cash on Delivery: pay at your doorstep"
                      : o.paymentStatus === "cancelled"
                        ? "Order cancelled"
                        : "Payment pending"}
                </div>

                <div style={footerTotalStyle}>${o.totalAmount.toFixed(2)}</div>
              </div>
            </article>
          );
        })}
      </div>

    {/* TRACK MODAL */}
      {tracking && (
        <div style={modalOverlayStyle} onClick={() => setTracking(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: ".25rem" }}>Order Tracking</h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: ".85rem",
                marginBottom: "1.25rem",
              }}
            >
              Order #{tracking.order._id.slice(-6).toUpperCase()}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".85rem",
                textAlign: "left",
              }}
            >
              {tracking.timeline.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".75rem",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: step.done ? "#16a34a" : "#e2e8f0",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.done ? "✓" : ""}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {step.step}
                    </div>
                    {step.date && (
                      <div style={{ fontSize: ".75rem", color: "#94a3b8" }}>
                        {new Date(step.date).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTracking(null)}
              className="btn btn-primary"
              style={{ marginTop: "1.5rem", width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

     {/* CONFIRM REMOVE MODAL */}
      {confirmModal && (
        <div style={modalOverlayStyle} onClick={() => setConfirmModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {confirmModal.wasCancelled ? (
              <>
                <h3 style={{ marginBottom: ".5rem" }}>Remove this order?</h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: ".9rem",
                    marginBottom: "1.5rem",
                    lineHeight: 1.5,
                  }}
                >
                  This order is already cancelled. Removing it will delete it
                  permanently from your order history.
                </p>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: ".5rem", color: "#dc2626" }}>
                  ⚠️ Removing will cancel your order
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: ".9rem",
                    marginBottom: "1.5rem",
                    lineHeight: 1.5,
                  }}
                >
                  This order is still active. Removing it will{" "}
                  <strong>cancel the order</strong> (items restocked) and then
                  delete it from your history.
                </p>
              </>
            )}

            <div style={{ display: "flex", gap: ".75rem" }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={secondaryBtnStyle}
              >
                Keep order
              </button>
              <button onClick={confirmRemove} style={dangerBtnStyle}>
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// STYLES

const pageTitleStyle = {
  fontSize: "1.9rem",
  fontWeight: 500,
  color: "#1e293b",
  letterSpacing: "-.01em",
  marginBottom: ".35rem",
};
const pageSubtitleStyle = {
  fontSize: ".9rem",
  color: "#94a3b8",
  fontWeight: 400,
};

const cardStyle = {
  background: "#fff",
  borderRadius: 4,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 3px rgba(15,23,42,.04)",
  overflow: "hidden",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1.5rem",
  borderBottom: "1px solid #f1f5f9",
  flexWrap: "wrap",
  gap: ".75rem",
};
const headerLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};
const orderIdPillStyle = {
  display: "inline-block",
  padding: ".35rem .9rem",
  borderRadius: 999,
  background: "#f1f5f9",
  fontSize: ".82rem",
  color: "#64748b",
  fontWeight: 500,
};
const headerDateStyle = { fontSize: ".82rem", color: "#94a3b8" };

const trackBtnStyle = {
  padding: ".55rem 1.5rem",
  borderRadius: 999,
  border: "none",
  background: "#f59e0b",
  color: "#fff",
  fontWeight: 700,
  fontSize: ".78rem",
  letterSpacing: ".08em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const itemsContainerStyle = { padding: "0 1.5rem" };
const itemRowStyle = {
  display: "grid",
  gridTemplateColumns: "80px 1fr 140px 180px",
  gap: "1.25rem",
  alignItems: "center",
  padding: "1.25rem 0",
  borderBottom: "1px solid #f8fafc",
};
const itemImgStyle = {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 4,
  background: "#f8fafc",
};
const itemInfoStyle = { minWidth: 0 };
const itemNameStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#1e293b",
  marginBottom: ".3rem",
};
const itemMetaStyle = {
  fontSize: ".8rem",
  color: "#94a3b8",
  marginBottom: ".35rem",
};
const itemPriceStyle = {
  fontSize: ".95rem",
  fontWeight: 700,
  color: "#1e293b",
};

const columnStyle = { minWidth: 0 };
const columnLabelStyle = {
  fontSize: ".72rem",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: ".05em",
  marginBottom: ".35rem",
};
const columnValueStyle = {
  fontSize: ".85rem",
  fontWeight: 600,
  color: "#1e293b",
};

const footerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  alignItems: "center",
  padding: "1rem 1.5rem",
  background: "#fafafa",
  borderTop: "1px solid #f1f5f9",
  gap: "1rem",
};
const footerLeftStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
};
const cancelBtnStyle = {
  background: "none",
  border: "none",
  color: "#dc2626",
  fontWeight: 700,
  fontSize: ".78rem",
  letterSpacing: ".05em",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: 0,
};
const removeBtnStyle = {
  background: "none",
  border: "none",
  color: "#64748b",
  fontWeight: 700,
  fontSize: ".78rem",
  letterSpacing: ".05em",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: 0,
};
const footerCenterStyle = {
  fontSize: ".82rem",
  color: "#64748b",
  textAlign: "center",
};
const footerTotalStyle = {
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "#1e293b",
  textAlign: "right",
};

/* Modal */
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "1rem",
};
const modalStyle = {
  background: "#fff",
  padding: "1.75rem",
  borderRadius: 12,
  maxWidth: 400,
  width: "100%",
  boxShadow: "0 20px 60px rgba(0,0,0,.2)",
};

const secondaryBtnStyle = {
  flex: 1,
  padding: ".7rem",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#334155",
  fontWeight: 600,
  fontSize: ".9rem",
  cursor: "pointer",
};
const dangerBtnStyle = {
  flex: 1,
  padding: ".7rem",
  borderRadius: 8,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontWeight: 600,
  fontSize: ".9rem",
  cursor: "pointer",
};
