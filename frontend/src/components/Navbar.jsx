import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          🛒 ShopEase
        </Link>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li>
            <NavLink to="/products" onClick={() => setOpen(false)}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" onClick={() => setOpen(false)}>
              Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/orders" onClick={() => setOpen(false)}>
                Orders
              </NavLink>
            </li>
          )}
          {user ? (
            <>
              <li className="greeting">Hi, {user.name}</li>
              <li>
                <button onClick={handleLogout} className="btn-link">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={() => setOpen(false)}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={() => setOpen(false)}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
