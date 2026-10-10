import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = "success", duration = 2500) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              ...toastStyle,
              background: t.type === "error" ? "#dc2626" : "#16a34a",
            }}
            onClick={() => removeToast(t.id)}
          >
            <span style={{ fontSize: "1.2rem" }}>
              {t.type === "error" ? "⚠️" : "✅"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

/* styles */
const containerStyle = {
  position: "fixed",
  top: "80px",
  right: "20px",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  pointerEvents: "none",
};

const toastStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#fff",
  padding: ".85rem 1.2rem",
  borderRadius: 10,
  boxShadow: "0 10px 30px rgba(0,0,0,.2)",
  fontSize: ".95rem",
  fontWeight: 500,
  minWidth: 240,
  pointerEvents: "auto",
  cursor: "pointer",
  animation: "slideInRight .3s ease, fadeOut .3s ease 2.2s forwards",
};
