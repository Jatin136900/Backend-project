import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AIChatBox from "../components/Chat.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { updateCartCount } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const BASEURL = import.meta.env.VITE_BASEURL;

  useEffect(() => {
    fetchProduct();
    setAddedToCart(false);
  }, [slug]);

  async function fetchProduct() {
    try {
      const res = await instance.get(`/product/${slug}`);

      if (!res.data) {
        setError("Product not found");
        return;
      }

      setProduct(res.data);
      fetchRelatedProducts(res.data);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelatedProducts(prod) {
    try {
      const res = await instance.post("/api/ai/related-products", {
        name: prod.name,
        category: prod.category,
        description: prod.description,
        productId: prod._id,
      });

      setRelatedProducts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  /* ===== FIXED PART ===== */
  async function handleAddToCart() {
    try {
      const cartRes = await instance.get("/cart");

      const alreadyAdded = cartRes.data.products.find(
        (item) => item?.productId?._id === product._id
      );

      if (alreadyAdded) {
        toast.info("Product already in cart");
        navigate("/cart");
        return;
      }

      await instance.post("/cart/add", {
        productId: product._id,
        qty,
      });

      updateCartCount("add", qty);
      toast.success("Added to cart 🛒");
      navigate("/cart");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { redirectTo: "/Product/" + slug },
        });
      } else {
        toast.error("Something went wrong");
        console.log(err);
      }
    }
  }
  /* ===== FIX END ===== */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-600 text-xl mb-4">
          {error || "Product not found"}
        </p>
        <Link to="/product" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="min-h-screen bg-gray-50 p-8">
        <Link
          to="/product"
          className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-10">
          <div className="flex justify-center">
            <img
              src={
                product.img?.startsWith("http")
                  ? product.img
                  : `${BASEURL}/${product.img}`
              }
              alt={product.name}
              className="w-96 object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="mb-4">{product.description}</p>

            <p className="text-red-600 text-3xl font-bold mb-2">
              ₹{product.discountedPrice}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => qty > 1 && setQty(qty - 1)} className="px-3 py-1 bg-gray-200 rounded">−</button>
              <span className="text-lg font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-xl text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Add to Cart 🛒
            </button>
          </div>
        </div>

        {showChat && (
          <div className="mt-8">
            <AIChatBox productName={product.name} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
