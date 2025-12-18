// import React, { useEffect, useState } from "react";
// import instance from "../axios.Config";
// import { Link } from "react-router-dom";

// export default function Cart() {
//   const [cart, setCart] = useState(null);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   async function fetchCart() {
//     const res = await instance.get("/cart", { withCredentials: true });
//     setCart(res.data);
//   }

//   async function changeQty(productId, type) {
//     const res = await instance.patch(
//       "/cart/qty",
//       { productId, type },
//       { withCredentials: true }
//     );
//     setCart(res.data);
//   }

//   async function removeItem(productId) {
//     const res = await instance.delete(`/cart/${productId}`, {
//       withCredentials: true
//     });
//     setCart(res.data);
//   }

//   const total =
//     cart?.products.reduce(
//       (sum, i) => sum + i.productId.discountedPrice * i.quantity,
//       0
//     ) || 0;

//   if (!cart || cart.products.length === 0)
//     return <div className="p-8 text-xl">Cart is empty 🛒</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <Link to="/product" className="text-blue-600 font-medium">
//           ← Continue Shopping
//         </Link>
//         <h1 className="text-3xl font-bold flex items-center gap-2">
//           Your Cart 🛒
//         </h1>
//       </div>

//       {/* CART BOX */}
//       <div className="bg-white rounded-2xl shadow-xl p-6">
//         {cart.products.map(item => (
//           <div
//             key={item.productId._id}
//             className="flex justify-between items-center py-6 border-b"
//           >
//             {/* LEFT */}
//             <div className="flex items-center gap-6">
//               <img
//                 src={`http://localhost:3000/${item.productId.img}`}
//                 className="w-24 h-24 object-contain"
//               />

//               <div>
//                 <h2 className="font-semibold text-lg">
//                   {item.productId.name}
//                 </h2>
//                 <p className="text-gray-500">
//                   Price: ₹{item.productId.discountedPrice}
//                 </p>
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-6">
//               {/* QTY */}
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() =>
//                     changeQty(item.productId._id, "dec")
//                   }
//                   className="px-3 py-1 bg-gray-200 rounded"
//                 >
//                   −
//                 </button>
//                 <span>{item.quantity}</span>
//                 <button
//                   onClick={() =>
//                     changeQty(item.productId._id, "inc")
//                   }
//                   className="px-3 py-1 bg-gray-200 rounded"
//                 >
//                   +
//                 </button>
//               </div>

//               {/* PRICE */}
//               <p className="font-bold text-lg">
//                 ₹{item.productId.discountedPrice * item.quantity}
//               </p>

//               {/* REMOVE */}
//               <button
//                 onClick={() => removeItem(item.productId._id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* TOTAL */}
//         <div className="flex justify-between items-center mt-6">
//           <h2 className="text-2xl font-bold">
//             Total: ₹{total}
//           </h2>

//           <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg">
//             Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import instance from "../axios.Config";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider"; // 🔥 ADD

export default function Cart() {
  const [cart, setCart] = useState(null);

  const { updateCartCount } = useAuth(); // 🔥 ADD

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

    // 🔥 ADD: HEADER CART COUNT UPDATE
    if (type === "inc") updateCartCount("add", 1);
    if (type === "dec") updateCartCount("remove", 1);
  }

  async function removeItem(productId) {
    // 🔥 ADD: find item quantity before remove
    const item = cart.products.find(
      (i) => i.productId._id === productId
    );

    const res = await instance.delete(`/cart/${productId}`, {
      withCredentials: true
    });

    setCart(res.data);

    // 🔥 ADD: remove full quantity from header count
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/product" className="text-blue-600 font-medium">
          ← Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Your Cart 🛒
        </h1>
      </div>

      {/* CART BOX */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {cart.products.map((item) => (
          <div
            key={item.productId._id}
            className="flex justify-between items-center py-6 border-b"
          >
            {/* LEFT */}
            <div className="flex items-center gap-6">
              <img
                src={`http://localhost:3000/${item.productId.img}`}
                className="w-24 h-24 object-contain"
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
            <div className="flex items-center gap-6">
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

                <span>{item.quantity}</span>

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
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold">
            Total: ₹{total}
          </h2>

          <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
