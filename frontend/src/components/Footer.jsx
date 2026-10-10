import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
      
        <div style={brandColStyle}>
          <Link to="/" style={brandLinkStyle}>
            🛒 ShopEase
          </Link>
          <p style={taglineStyle}>
            Clean beauty essentials, thoughtfully picked.
            <br />
            Crafted with care, delivered to your glow.
          </p>

          {/* Social icons */}
          <div style={socialRowStyle}>
            <a
              href="#"
              aria-label="Instagram"
              style={socialIconStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c2410c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
            >
              📷
            </a>
            <a
              href="#"
              aria-label="Facebook"
              style={socialIconStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c2410c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
            >
              👍
            </a>
            <a
              href="#"
              aria-label="Twitter"
              style={socialIconStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c2410c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
            >
              🐦
            </a>
          </div>
        </div>

    
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Shop</h4>
          <Link to="/products" style={linkStyle}>
            All products
          </Link>
          <Link to="/products" style={linkStyle}>
            Skincare
          </Link>
          <Link to="/products" style={linkStyle}>
            Makeup
          </Link>
          <Link to="/products" style={linkStyle}>
            Fragrance
          </Link>
        </div>

      
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Help</h4>
          <Link to="/orders" style={linkStyle}>
            Track your order
          </Link>
          <Link to="/cart" style={linkStyle}>
            Your cart
          </Link>
          <a href="#" style={linkStyle}>
            Shipping & returns
          </a>
          <a href="#" style={linkStyle}>
            Contact us
          </a>
        </div>

     
        <div style={colStyle}>
          <h4 style={colTitleStyle}>Company</h4>
          <a href="#" style={linkStyle}>
            About us
          </a>
          <a href="#" style={linkStyle}>
            Sustainability
          </a>
          <a href="#" style={linkStyle}>
            Privacy policy
          </a>
          <a href="#" style={linkStyle}>
            Terms of service
          </a>
        </div>
      </div>

      <div style={bottomStyle}>
        <p style={copyStyle}>© {year} ShopEase. All rights reserved.</p>
        <p style={madeStyle}>Made with care ✦ Karachi, PK</p>
      </div>
    </footer>
  );
}

// CSS

const footerStyle = {
  marginTop: "4rem",
  background: "#fafaf9",
  borderTop: "1px solid #f1f5f9",
};

const innerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "3rem 1.5rem 2rem",
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  gap: "2.5rem",
};

const brandColStyle = {
  minWidth: 0,
};

const brandLinkStyle = {
  fontSize: "1.15rem",
  fontWeight: 700,
  color: "#0f172a",
  textDecoration: "none",
  letterSpacing: "-.01em",
};

const taglineStyle = {
  marginTop: ".75rem",
  fontSize: ".85rem",
  color: "#78716c",
  lineHeight: 1.65,
  fontStyle: "italic",
};

const socialRowStyle = {
  display: "flex",
  gap: ".5rem",
  marginTop: "1.25rem",
};

const socialIconStyle = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "#f8fafc",
  border: "1px solid #f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: ".95rem",
  textDecoration: "none",
  transition: "all .2s",
  cursor: "pointer",
};

const colStyle = {
  display: "flex",
  flexDirection: "column",
  gap: ".55rem",
  minWidth: 0,
};

const colTitleStyle = {
  fontSize: ".85rem",
  fontWeight: 700,
  color: "#0f172a",
  letterSpacing: ".08em",
  textTransform: "uppercase",
  marginBottom: ".5rem",
};

const linkStyle = {
  fontSize: ".85rem",
  color: "#78716c",
  textDecoration: "none",
  transition: "color .15s",
  lineHeight: 1.5,
};

const bottomStyle = {
  borderTop: "1px solid #f1f5f9",
  padding: "1.25rem 1.5rem",
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const copyStyle = {
  fontSize: ".8rem",
  color: "#a8a29e",
  margin: 0,
};

const madeStyle = {
  fontSize: ".8rem",
  color: "#a8a29e",
  margin: 0,
  fontStyle: "italic",
};
