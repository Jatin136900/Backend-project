import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import instance from "../axios.Config";
import "../App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  /* ======================
     FETCH PRODUCTS
  ====================== */
  async function getProducts() {
    try {
      const response = await instance.get("/product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     LOADER
  ====================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      {/* 🔔 TOAST CONTAINER (ONLY ONCE) */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-gray-50 min-h-screen px-6 py-10">

        {/* HEADING */}
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Our Products
        </h1>

        {/* GRID */}
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
    </>
  );
};

export default Product;
