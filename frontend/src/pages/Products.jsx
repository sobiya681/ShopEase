import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setProducts(await getProducts());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Products</h2>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {!products.length && <p>No products yet. Seed some via API.</p>}
    </section>
  );
}
