import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ✅ SINGLE useAuth call (clean)
  const {
    isLoggedIn,
    updateCartCount,
  } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const BASEURL = import.meta.env.VITE_BASEURL


  console.log(isLoggedIn);

  useEffect(() => {
    fetchProduct();
    setAddedToCart(false);
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
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     ADD TO CART
  ====================== */
  // async function handleAddToCart() {
  //   try {
  //     // 🔥 Cart fetch via instance
  //     const cartRes = await instance.get("/cart");

  //     const alreadyAdded = cartRes.data.products.find(
  //       (item) => item.productId._id === product._id
  //     );

  //     if (alreadyAdded) {
  //       console.log("You have already added this product");
  //       setAddedToCart(true);
  //       return;
  //     }

  //     // 🔥 Add to cart
  //     await instance.post("/cart/add", {
  //       productId: product._id,
  //       qty,
  //     });

  //     updateCartCount("add", qty);
  //     setAddedToCart(true);

  //     navigate("/Product/" + slug);

  //   } catch (err) {
  //     // 🔐 Not logged in → redirect to login
  //     if (err.response?.status === 401) {
  //       navigate("/login", {
  //         state: { redirectTo: "/Product/" + slug },
  //       });
  //     }
  //   }
  // }

  async function handleAddToCart() {
    try {
      const cartRes = await instance.get("/cart");

      const alreadyAdded = cartRes.data.products.find(
        (item) => item.productId._id === product._id
      );

      if (alreadyAdded) {
        setAddedToCart(true);
        navigate("/cart");
        return;
      }

      await instance.post("/cart/add", {
        productId: product._id,
        qty,
      });

      updateCartCount("add", qty);
      setAddedToCart(true);

      navigate("/cart"); // 👈 ADD TO CART ke baad direct CART page

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { redirectTo: "/Product/" + slug },
        });
      }
    }
  }


  /* ======================
     LOADING
  ====================== */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading product...
      </div>
    );
  }

  /* ======================
     ERROR
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
     UI
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
            src={product.img?.startsWith("http")
              ? product.img
              : `${BASEURL}/${product.img}`}
            alt={product.name}
            className="w-96 object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-4">{product.description}</p>

          <p className="text-red-600 text-3xl font-bold mb-2">
            ₹{product.discountedPrice}
          </p>

          <p className="mb-6">Category: {product.category}</p>

          {/* QTY */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              −
            </button>

            <span className="text-lg font-semibold">{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={addedToCart}
            className={`w-full cursor-pointer py-3 rounded-xl text-lg font-semibold transition
              ${addedToCart
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {addedToCart ? "✅ Added to Cart" : "Add to Cart 🛒"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
