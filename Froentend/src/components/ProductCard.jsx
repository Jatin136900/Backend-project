import { PiCurrencyInrLight } from "react-icons/pi";
import { useState } from "react";

function ProductCard({ product }) {
  if (!product) return null;

  const [adding, setAdding] = useState(false);

  function handleAddToCart() {
    if (adding) return;

    setAdding(true);

    // 🔥 future API call yahin lagegi
    setTimeout(() => {
      setAdding(false);
    }, 3000);



    
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300">

      {/* IMAGE */}
      <div className="flex justify-center">
        <img
          src={`http://localhost:3000/${product.img}`}
          alt={product.name}
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* NAME */}
      <h3 className="mt-4 text-lg font-semibold text-gray-800 truncate">
        {product.name}
      </h3>

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

      {/* BUTTON */}
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
