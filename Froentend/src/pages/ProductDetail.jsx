import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  /* ======================
     FETCH PRODUCT
  ====================== */
  async function fetchProduct() {
    try {
      const res = await instance.get(`/product/${slug}`);

      if (!res.data) {
        setError("Product not found");
        return;
      }

      setProduct(res.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     ADD TO CART
  ====================== */



  async function handleAddToCart() {

    try {
      await instance.post("/cart/add", {
        productId: product._id,
        qty: qty,
      });

      // navigate("/cart");
      navigate("/Product/" + slug);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { redirectTo: "/Product/" + slug  },
        });
        return;
      }

    }
  }


  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading product...
      </div>
    );
  }

  /* ======================
     ERROR / NOT FOUND
  ====================== */
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-600 text-xl mb-4">
          {error || "Product not found"}
        </p>
        <Link
          to="/product"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  /* ======================
     MAIN UI
  ====================== */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link
        to="/product"
        className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={`http://localhost:3000/${product.img}`}
            alt={product.name}
            className="w-96 cursor-pointer object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <p className="text-red-600 text-3xl font-bold mb-2">
            ₹{product.discountedPrice}
          </p>

          <p className="text-gray-500 mb-6">
            Category: {product.category}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              −
            </button>

            <span className="text-xl font-semibold">{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3 cursor-pointer bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Add to Cart 🛒
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
