import { PiCurrencyInrLight } from "react-icons/pi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();
  const [adding, setAdding] = useState(false);

  const BASEURL = import.meta.env.VITE_BASEURL;

  function formatCategory(slug) {
    return slug
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function handleAddToCart() {
    if (adding) return;

    try {
      setAdding(true);

      const cartRes = await instance.get("/cart");
      const alreadyAdded = cartRes.data.products.find(
        (item) => item.productId._id === product._id
      );

      if (alreadyAdded) {
        toast.info("Product already in cart");
        return;
      }

      await instance.post("/cart/add", {
        productId: product._id,
        qty: 1,
      });

      updateCartCount("add", 1);
      toast.success("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.warning("Please login to add items to cart");
        navigate("/login", { state: { redirectTo: "/" } });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* IMAGE */}
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="bg-gray-50 flex justify-center items-center h-52 p-4">
          <img
            src={
              product.img?.startsWith("http")
                ? product.img
                : `${BASEURL}/${product.img}`
            }
            alt={product.name}
            className="max-h-44 object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = "/no-image.png";
            }}
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4">

        {/* CATEGORY */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {formatCategory(product.category)}
        </p>

        {/* NAME (FIXED HEIGHT) */}
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2">
          <PiCurrencyInrLight className="text-lg text-gray-600" />
          {product.discountedPrice ? (
            <>
              <del className="text-sm text-gray-400">
                {product.originalPrice}
              </del>
              <span className="text-lg font-bold text-green-600">
                {product.discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* PUSH BUTTON TO BOTTOM */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`
              mt-4 w-full py-2 rounded-xl text-sm font-semibold
              bg-amber-700 cursor-pointer text-white
              transition-all duration-300
              ${adding
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-amber-800 hover:shadow-md"}
            `}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
