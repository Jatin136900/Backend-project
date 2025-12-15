import { PiCurrencyInrLight } from "react-icons/pi";

function ProductCard({ product }) {
  if (!product) return null;

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
        className="
          mt-4 w-full py-2 rounded-xl
          bg-gradient-to-r from-orange-500 to-orange-600
          text-white font-medium
          hover:opacity-90 transition
        "
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
