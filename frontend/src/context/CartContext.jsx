import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) }
            : i,
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQty = (id, quantity) =>
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, quantity } : i)));

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        selectedItems,
        setSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
