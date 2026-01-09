import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import instance from "../axios.Config";
import "../App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiChevronDown } from "react-icons/hi";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
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

      const uniqueCategories = [
        ...new Set(response.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     CATEGORY FILTER
  ====================== */
  async function handleCategoryChange(e) {
    const value = e.target.value;
    setSelectedCategory(value);
    setLoading(true);

    try {
      const url = value
        ? `/product?category=${value}`
        : `/product`;

      const response = await instance.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Filter error:", error);
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
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-gray-50 min-h-screen px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

          <h1 className="text-3xl font-bold text-gray-800">
            Our Products
          </h1>

          {/* 🔥 MODERN DROPDOWN */}
          <div className="relative w-64">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="
                peer w-full appearance-none bg-white
                border border-gray-300 rounded-xl
                px-4 py-3 pr-10 text-sm
                focus:outline-none focus:ring-2 focus:ring-amber-500
                focus:border-amber-500
                transition
              "
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>

            {/* CHEVRON ICON */}
            <HiChevronDown
              className="
                pointer-events-none
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-500 text-xl
              "
            />
          </div>
        </div>

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
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found
            </p>
          )}
        </div>

      </div>
    </>
  );
};

export default Product;
