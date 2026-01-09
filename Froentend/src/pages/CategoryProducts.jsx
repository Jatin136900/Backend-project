import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../axios.Config";
import ProductCard from "../components/ProductCard";

function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug]);

  async function fetchCategoryProducts() {
    try {
      const res = await instance.get(`/product?category=${slug}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch category products");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link
        to="/product"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-center">
        {slug.replace(/-/g, " ").toUpperCase()}
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found in this category
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryProducts;
