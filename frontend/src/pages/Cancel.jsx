import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        textAlign: "center",
        animation: "fadeIn .3s ease",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#fef3c7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          animation: "popIn .4s cubic-bezier(.2,.9,.3,1.2)",
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b45309"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: ".5rem",
        }}
      >
        Payment cancelled
      </h2>
      <p
        style={{
          color: "#64748b",
          fontSize: ".95rem",
          maxWidth: 420,
          marginBottom: "1.75rem",
          lineHeight: 1.5,
        }}
      >
        Your cart is still saved. You can try again or choose Cash on Delivery.
      </p>

      <div
        style={{
          display: "flex",
          gap: ".75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          to="/checkout"
          style={{
            padding: ".75rem 1.5rem",
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
            fontWeight: 600,
            fontSize: ".95rem",
            textDecoration: "none",
          }}
        >
          Back to Checkout
        </Link>
        <Link
          to="/products"
          style={{
            padding: ".75rem 1.5rem",
            borderRadius: 10,
            background: "#fff",
            color: "#334155",
            fontWeight: 600,
            fontSize: ".95rem",
            textDecoration: "none",
            border: "1px solid #e2e8f0",
          }}
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
