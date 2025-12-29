import React, { useEffect, useState } from "react";
import instance from "../axios.Config";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { updateCartCount } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  /* ======================
     FETCH CART
  ====================== */
  async function fetchCart() {
    try {
      const res = await instance.get("/cart");
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { redirectTo: "/cart" },
        });
      }
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     CHANGE QTY
  ====================== */
  async function changeQty(productId, type) {
    try {
      const res = await instance.patch("/cart/qty", {
        productId,
        type,
      });

      setCart(res.data);

      if (type === "inc") updateCartCount("add", 1);
      if (type === "dec") updateCartCount("remove", 1);
    } catch (err) {
      alert("Unable to update quantity");
    }
  }

  /* ======================
     REMOVE ITEM
  ====================== */
  async function removeItem(productId) {
    try {
      const item = cart.products.find(
        (i) => i.productId._id === productId
      );

      const res = await instance.delete(`/cart/${productId}`);

      setCart(res.data);
      updateCartCount("remove", item.quantity);
    } catch (err) {
      alert("Unable to remove item");
    }
  }

  /* ======================
     TOTAL
  ====================== */
  const total =
    cart?.products.reduce(
      (sum, i) =>
        sum + i.productId.discountedPrice * i.quantity,
      0
    ) || 0;

  /* ======================
     LOADING
  ====================== */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading cart...
      </div>
    );
  }

  /* ======================
     EMPTY CART
  ====================== */
  if (!cart || cart.products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-xl">Cart is empty 🛒</p>
        <Link
          to="/product"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ======================
     UI
  ====================== */
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
                src={`${import.meta.env.VITE_BASEURL}/${item.productId.img}`}
                alt={item.productId.name}
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

                <span className="font-medium">
                  {item.quantity}
                </span>

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
                ₹
                {item.productId.discountedPrice *
                  item.quantity}
              </p>

              {/* REMOVE */}
              <button
                onClick={() =>
                  removeItem(item.productId._id)
                }
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
