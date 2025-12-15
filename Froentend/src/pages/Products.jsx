import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import instance from "../axios.Config";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    setLoading(true);
    const response = await instance.get("/product");
    setProducts(response.data);
    setLoading(false);
  }

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">
      
      {/* HEADING */}
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Our Products
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      {/* PRODUCT GRID */}
      <div
        className="
          grid gap-8
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
        "
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Product;
