const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// AUTH
export const registerUser = (payload) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const loginUser = (payload) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });

// PRODUCTS
export const getProducts = () => apiFetch("/products");
export const getProduct = (id) => apiFetch(`/products/${id}`);
export const createProduct = (payload) =>
  apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
export const updateProduct = (id, payload) =>
  apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteProduct = (id) =>
  apiFetch(`/products/${id}`, { method: "DELETE" });

// COD
export const placeCodOrder = (items, shippingAddress = "") =>
  apiFetch("/orders/cod", {
    method: "POST",
    body: JSON.stringify({
      items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
      shippingAddress,
    }),
  });

// STRIPE
export const startStripeCheckout = (items, shippingAddress = "") =>
  apiFetch("/checkout/create-session", {
    method: "POST",
    body: JSON.stringify({
      items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
      shippingAddress,
    }),
  });

export const confirmStripeOrder = (sessionId) =>
  apiFetch(`/checkout/confirm/${sessionId}`, { method: "POST" });

// ORDERS
export const getMyOrders = () => apiFetch("/orders/mine");
