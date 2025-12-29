import React, { useEffect, useState } from "react";
import instance from "../axios.Config";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const { updateCartCount } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const res = await instance.get("/cart", { withCredentials: true });
    setCart(res.data);
  }

  async function changeQty(productId, type) {
    const res = await instance.patch(
      "/cart/qty",
      { productId, type },
      { withCredentials: true }
    );

    setCart(res.data);

    if (type === "inc") updateCartCount("add", 1);
    if (type === "dec") updateCartCount("remove", 1);
  }

  async function removeItem(productId) {
    const item = cart.products.find(
      (i) => i.productId._id === productId
    );

    const res = await instance.delete(`/cart/${productId}`, {
      withCredentials: true
    });

    setCart(res.data);
    updateCartCount("remove", item.quantity);
  }

  const total =
    cart?.products.reduce(
      (sum, i) => sum + i.productId.discountedPrice * i.quantity,
      0
    ) || 0;

  if (!cart || cart.products.length === 0)
    return <div className="p-8 text-xl">Cart is empty 🛒</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <Link to="/product" className="text-blue-600 font-medium">
          ← Continue Shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Your Cart 🛒
        </h1>
      </div>

      {/* CART BOX */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        {cart.products.map((item) => (
          <div
            key={item.productId._id}
            className="flex flex-col lg:flex-row justify-between gap-6 py-6 border-b"
          >
            {/* LEFT */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <img
                src={`http://localhost:3000/${item.productId.img}`}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {item.productId.name}
                </h2>
                <p className="text-gray-500">
                  Price: ₹{item.productId.discountedPrice}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* QTY */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    changeQty(item.productId._id, "dec")
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  −
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  onClick={() =>
                    changeQty(item.productId._id, "inc")
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              {/* PRICE */}
              <p className="font-bold text-lg">
                ₹{item.productId.discountedPrice * item.quantity}
              </p>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.productId._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <h2 className="text-2xl font-bold">
            Total: ₹{total}
          </h2>

          <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg w-full sm:w-auto">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
