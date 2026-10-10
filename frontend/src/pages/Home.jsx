import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trending = products.slice(0, 4);
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <>
     {/* HERO */}
      <section style={heroWrapStyle}>
        <div style={heroInnerStyle}>
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <span style={eyebrowStyle}>Discover the secrets</span>

            <h1 style={heroTitleStyle}>
              Discover your <em style={heroAccentStyle}>glow</em>
            </h1>

            <p style={heroSubtitleStyle}>
              Transform your daily routine with clean, thoughtful beauty,
              skincare, makeup, and fragrance, delivered to your door.
            </p>

            <div style={ctaRowStyle}>
              <Link to="/products" style={primaryBtnStyle}>
                Shop now
              </Link>
              <Link to="/orders" style={linkBtnStyle}>
                Track order
              </Link>
            </div>
          </div>

          <div style={heroImageWrapStyle}>
            <img
              src="https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?q=80&w=880&auto=format&fit=crop"
              alt="Beauty essentials"
              style={heroImageStyle}
            />
            <div style={heroBadgeStyle}>
              <span
                style={{
                  fontSize: ".72rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#9a3412",
                }}
              >
                Bestseller
              </span>
              <span
                style={{
                  fontSize: ".85rem",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginTop: ".15rem",
                }}
              >
                Vitamin C Serum
              </span>
            </div>
          </div>
        </div>
      </section>

   {/* TRUST BAR */}
      <section style={trustWrapStyle}>
        <div style={trustInnerStyle}>
          {[
            { icon: "✦", label: "100% Authentic" },
            { icon: "↩", label: "Free Returns" },
            { icon: "🚚", label: "Free Shipping" },
            { icon: "🌿", label: "Clean Ingredients" },
            { icon: "💬", label: "24/7 Support" },
          ].map((item) => (
            <div key={item.label} style={trustItemStyle}>
              <span style={{ fontSize: "1.1rem", color: "#c2410c" }}>
                {item.icon}
              </span>
              <span
                style={{ fontSize: ".8rem", color: "#475569", fontWeight: 500 }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

   {/* PROMO BANNERS */}
      <section style={promoWrapStyle}>
        <div style={promoInnerStyle}>
          <div style={promoCardStyle("#fef3c7", "#fde68a")}>
            <div>
              <span style={promoTagStyle}>Limited offer</span>
              <h3 style={promoTitleStyle}>Buy 2, Get 1 Free</h3>
              <p style={promoSubStyle}>Mix and match across all skincare.</p>
            </div>
            <Link to="/products" style={promoBtnStyle}>
              Shop offer
            </Link>
          </div>

          <div style={promoCardStyle("#fee2e2", "#fecaca")}>
            <div>
              <span style={promoTagStyle}>Season sale</span>
              <h3 style={promoTitleStyle}>Save 20% off</h3>
              <p style={promoSubStyle}>On all makeup this week only.</p>
            </div>
            <Link to="/products" style={promoBtnStyle}>
              Shop sale
            </Link>
          </div>
        </div>
      </section>
{/* CATEGORIES */}
      <section style={sectionFullWrapStyle}>
        <div style={sectionInnerStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Shop by category</h2>
              <p style={sectionSubStyle}>Find your everyday essentials</p>
            </div>
          </div>

          <div style={categoryGridStyle}>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                to="/products"
                state={{ category: cat }}
                style={categoryCardStyle}
              >
                <span style={categoryIconStyle}>
                  {cat === "Skincare"
                    ? "🧴"
                    : cat === "Makeup"
                      ? "💄"
                      : cat === "Haircare"
                        ? "💇‍♀️"
                        : cat === "Fragrance"
                          ? "🌸"
                          : cat === "Body Care"
                            ? "🧼"
                            : "✨"}
                </span>
                <span style={categoryLabelStyle}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    {/* TRENDING */}
      <section style={{ ...sectionFullWrapStyle, paddingBottom: "5rem" }}>
        <div style={sectionInnerStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Trending now</h2>
              <p style={sectionSubStyle}>Loved by our community this week</p>
            </div>
            <Link to="/products" style={seeAllStyle}>
              See all
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
              Just a moment…
            </p>
          ) : (
            <div className="grid">
              {trending.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// STYLES

// HERO

const heroWrapStyle = {
  background: "linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)",
  padding: "4rem 1.5rem",
  borderBottom: "1px solid #f1f5f9",
};

const heroInnerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  gap: "3rem",
  flexWrap: "wrap",
};

const eyebrowStyle = {
  display: "inline-block",
  fontSize: ".72rem",
  fontWeight: 500,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "#9a3412",
  marginBottom: "1rem",
};

const heroTitleStyle = {
  fontSize: "clamp(2rem, 4.5vw, 3rem)",
  fontWeight: 400,
  lineHeight: 1.15,
  color: "#0f172a",
  letterSpacing: "-.02em",
  marginBottom: "1.25rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const heroAccentStyle = {
  fontStyle: "italic",
  color: "#c2410c",
};

const heroSubtitleStyle = {
  fontSize: "1rem",
  color: "#64748b",
  lineHeight: 1.7,
  maxWidth: 440,
  marginBottom: "2rem",
};

const ctaRowStyle = {
  display: "flex",
  gap: "1.25rem",
  alignItems: "center",
  flexWrap: "wrap",
};

const primaryBtnStyle = {
  padding: ".85rem 1.75rem",
  borderRadius: 999,
  background: "#0f172a",
  color: "#fff",
  fontWeight: 500,
  fontSize: ".92rem",
  textDecoration: "none",
  display: "inline-block",
};

const linkBtnStyle = {
  fontSize: ".92rem",
  fontWeight: 500,
  color: "#334155",
  textDecoration: "underline",
  textUnderlineOffset: 4,
  textDecorationColor: "#cbd5e1",
};

const heroImageWrapStyle = {
  flex: "1 1 340px",
  minWidth: 0,
  position: "relative",
  display: "flex",
  justifyContent: "center",
};

const heroImageStyle = {
  width: "100%",
  maxWidth: 440,
  height: 420,
  borderRadius: 24,
  objectFit: "cover",
  boxShadow: "0 30px 60px -30px rgba(194, 65, 12, 0.35)",
};

const heroBadgeStyle = {
  position: "absolute",
  bottom: 24,
  left: 24,
  background: "#fff",
  padding: ".7rem 1rem",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,.12)",
  display: "flex",
  flexDirection: "column",
};

//  TRUST BAR
const trustWrapStyle = {
  background: "#fff",
  borderBottom: "1px solid #f1f5f9",
  padding: "1.25rem 1.5rem",
};

const trustInnerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5rem",
  flexWrap: "wrap",
};

const trustItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: ".55rem",
};

// PROMO
const promoWrapStyle = {
  padding: "3rem 1.5rem 1.5rem",
  background: "#fff",
};

const promoInnerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.25rem",
};

const promoCardStyle = (from, to) => ({
  background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  padding: "1.75rem",
  borderRadius: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
});

const promoTagStyle = {
  fontSize: ".7rem",
  fontWeight: 600,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "#92400e",
  marginBottom: ".35rem",
  display: "inline-block",
};

const promoTitleStyle = {
  fontSize: "1.4rem",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: ".25rem",
  letterSpacing: "-.01em",
};

const promoSubStyle = {
  fontSize: ".85rem",
  color: "#78350f",
  opacity: 0.85,
};

const promoBtnStyle = {
  padding: ".6rem 1.1rem",
  borderRadius: 999,
  background: "#0f172a",
  color: "#fff",
  fontSize: ".82rem",
  fontWeight: 500,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

  // SECTIONS
const sectionFullWrapStyle = {
  padding: "3rem 1.5rem 1rem",
  background: "#fff",
};

const sectionInnerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginBottom: "1.75rem",
  flexWrap: "wrap",
  gap: "1rem",
};

const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 400,
  color: "#0f172a",
  letterSpacing: "-.01em",
  margin: 0,
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const sectionSubStyle = {
  fontSize: ".88rem",
  color: "#94a3b8",
  marginTop: ".35rem",
  fontStyle: "italic",
};

const seeAllStyle = {
  fontSize: ".85rem",
  fontWeight: 500,
  color: "#c2410c",
  textDecoration: "none",
  letterSpacing: ".02em",
};

// CATEGORY CARDS
const categoryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "1rem",
};

const categoryCardStyle = {
  background: "#fff",
  border: "1px solid #f1f5f9",
  borderRadius: 14,
  padding: "1.5rem .75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: ".6rem",
  textDecoration: "none",
  transition: "all .2s",
};

const categoryIconStyle = {
  fontSize: "1.75rem",
};

const categoryLabelStyle = {
  fontSize: ".9rem",
  fontWeight: 500,
  color: "#334155",
};
