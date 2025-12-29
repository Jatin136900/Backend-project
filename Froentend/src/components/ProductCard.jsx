import { PiCurrencyInrLight } from "react-icons/pi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";

function ProductCard({ product }) {
  // if (!product) return null;

  const navigate = useNavigate();
  const { updateCartCount } = useAuth();
  const [adding, setAdding] = useState(false);

  /* ======================
     ADD TO CART
  ====================== */
  async function handleAddToCart() {
    if (adding) return;

    try {
      setAdding(true);

      const cartRes = await instance.get("/cart");

      const alreadyAdded = cartRes.data.products.find(
        (item) => item.productId._id === product._id
      );

      if (alreadyAdded) {
        alert("Product already in cart");
        return;
      }

      await instance.post("/cart/add", {
        productId: product._id,
        qty: 1,
      });

      updateCartCount("add", 1);
      alert("Added to cart 🛒");

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { redirectTo: "/" },
        });
      } else {
        alert("Something went wrong");
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300">

      {/* IMAGE + NAME (CLICKABLE) */}
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="flex justify-center">
          <img
            src={`${import.meta.env.VITE_BASEURL}/${product.img}`}
            alt={product.name}
            className="w-48 h-48 object-contain"
            onError={(e) => {
              e.target.src = "/no-image.png"; // 🔥 fallback image
            }}
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-800 truncate hover:text-blue-600">
          {product.name}
        </h3>
      </Link>

      {/* PRICE */}
      <p className="mt-2 flex items-center gap-1 text-lg">
        <PiCurrencyInrLight className="text-xl" />
        {product.discountedPrice ? (
          <>
            <del className="text-gray-400 mr-2">
              {product.originalPrice}
            </del>
            <span className="text-green-600 font-bold">
              {product.discountedPrice}
            </span>
          </>
        ) : (
          <span className="font-bold text-gray-900">
            {product.originalPrice}
          </span>
        )}
      </p>

      {/* ADD TO CART BUTTON */}
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className={`
          mt-4 w-full py-2 rounded-xl
          bg-amber-700
          text-white font-medium
          transition
          ${adding ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
        `}
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
