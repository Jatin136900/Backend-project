import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsData();
  }, []);

  async function getProductsData() {
    const url = "https://fakestoreapi.com/products";

    let response = await fetch(url);
    response = await response.json();
    setProducts(response);
  }

  return (
    <div className="px-6 py-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Our Products
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="
              bg-white rounded-2xl shadow-lg p-6 
              hover:shadow-2xl hover:-translate-y-2 
              transition-all duration-300 cursor-pointer
              border border-gray-200
            "
          >
            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-40 h-40 object-contain mb-4 transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-700 h-14 overflow-hidden leading-tight">
              {item.title}
            </h3>

            {/* CATEGORY */}
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {item.category}
            </p>

            {/* PRICE */}
            <p className="text-red-600 font-bold text-2xl mt-3">
              ₹{(item.price * 83).toFixed(0)}
            </p>

            {/* BUTTON */}
            <button
              className="
                w-full mt-4 py-2 rounded-xl 
                bg-gradient-to-r from-blue-500 cursor-pointer to-blue-600 
                text-white font-medium 
                hover:opacity-90 transition
                
              "
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
