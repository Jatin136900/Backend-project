import React, { useEffect, useState } from "react";
import instance from "../axios.Config";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

// 🔹 Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const { updateCartCount, fetchCart } = useAuth();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_BASEURL;

  useEffect(() => {
    loadCart();
  }, []);

  /* ======================
     FETCH CART
  ====================== */
  async function loadCart() {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.warning("Please login to view cart");
        navigate("/login", { state: { redirectTo: "/cart" } });
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
      const res = await instance.patch("/cart/qty", { productId, type });
      setCart(res.data);

      setCouponApplied(false);
      setDiscount(0);
      setFinalPrice(0);

      if (type === "inc") {
        updateCartCount("add", 1);
        toast.success("Quantity increased");
      }

      if (type === "dec") {
        updateCartCount("remove", 1);
        toast.info("Quantity decreased");
      }
    } catch (err) {
      toast.error("Unable to update quantity");
    }
  }

  /* ======================
     REMOVE ITEM (SAFE)
  ====================== */
  async function removeItem(productId) {
    try {
      const item = cart.products.find(
        (i) => i?.productId?._id === productId
      );

      if (!item) return;

      const res = await instance.delete(`/cart/${productId}`);
      setCart(res.data);

      setCouponApplied(false);
      setDiscount(0);
      setFinalPrice(0);

      updateCartCount("remove", item.quantity);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Unable to remove item");
    }
  }

  /* ======================
     TOTAL (SAFE)
  ====================== */
  const total =
    cart?.products.reduce((sum, i) => {
      if (!i?.productId) return sum;
      return sum + i.productId.discountedPrice * i.quantity;
    }, 0) || 0;

  /* ======================
     APPLY COUPON
  ====================== */
  async function applyCoupon() {
    try {
      setCouponError("");

      const res = await instance.post("/coupon/apply", {
        code: couponCode,
        cartTotal: total,
      });

      setDiscount(res.data.discountAmount);
      setFinalPrice(res.data.finalPrice);
      setCouponApplied(true);

      toast.success(`Coupon applied! You saved ₹${res.data.discountAmount}`);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid coupon";

      setCouponApplied(false);
      setDiscount(0);
      setFinalPrice(0);
      setCouponError(msg);

      toast.error(msg);
    }
  }

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

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  /* ======================
     UI (UNCHANGED)
  ====================== */
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <Link to="/product" className="text-blue-600 font-medium">
          ← Continue Shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">Your Cart 🛒</h1>
      </div>

      {/* CART BOX */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        {cart.products
          .filter(item => item?.productId)
          .map((item) => (
            <div
              key={item.productId._id}
              className="flex flex-col lg:flex-row justify-between gap-6 py-6 border-b"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.productId.img?.startsWith("http")
                      ? item.productId.img
                      : `${BASEURL}/${item.productId.img}`
                  }
                  alt={item.productId.name}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-500">
                    ₹{item.productId.discountedPrice}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    changeQty(item.productId._id, "dec")
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    changeQty(item.productId._id, "inc")
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>

                <p className="font-bold">
                  ₹{item.productId.discountedPrice * item.quantity}
                </p>

                <button
                  onClick={() =>
                    removeItem(item.productId._id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

        {/* COUPON */}
        <div className="mt-6 p-4 border rounded-xl">
          <h3 className="font-semibold mb-2">Apply Coupon</h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="border px-4 py-2 rounded-lg w-full"
            />
            <button
              onClick={applyCoupon}
              className="bg-blue-600 text-white px-6 rounded-lg"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <p className="text-red-500 mt-2">{couponError}</p>
          )}

          {couponApplied && (
            <p className="text-green-600 mt-2">
              Coupon applied! You saved ₹{discount}
            </p>
          )}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold">
            Total: ₹{couponApplied ? finalPrice : total}
          </h2>

          <button
            onClick={() => toast.success("Proceeding to checkout")}
            className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* TOAST */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
