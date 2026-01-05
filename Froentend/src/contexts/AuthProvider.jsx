import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axios.Config";

const authContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);

  // ✅ CART GLOBAL STATE
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    checkIsLoggedIn();
    fetchCartCount();
  }, []);

  /* ======================
     CHECK LOGIN
  ====================== */
  async function checkIsLoggedIn() {
    try {
      const response = await instance.get(
        "/check/login?refresh=user",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        setLoggedinUser(response.data.user);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setLoggedinUser(null);
      setCartCount(0);
    }
  }

  /* ======================
     CART COUNT UPDATE
  ====================== */
  function updateCartCount(type, qty = 1) {
    setCartCount((prev) => {
      if (type === "add") return prev + qty;
      if (type === "remove") return Math.max(prev - qty, 0);
      if (type === "reset") return 0;
      return prev;
    });
  }

  /* ======================
     LOGOUT
  ====================== */
  async function logout() {
    try {
      await instance.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setLoggedinUser(null);
      setCartCount(0);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  /* ======================
     FETCH CART (NO NAVIGATE)
  ====================== */
  async function fetchCart() {
    try {
      const res = await instance.get("/cart", {
        withCredentials: true,
      });
      return res.data;          // ✅ RETURN DATA ONLY
    } catch (err) {
      throw err;                // ✅ ERROR PAGE HANDLE KAREGA
    }
  }

  /* ======================
     CART COUNT FROM BACKEND
  ====================== */
  async function fetchCartCount() {
    try {
      const res = await instance.get("/cart", {
        withCredentials: true,
      });

      const totalQty = res.data.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);
    } catch (err) {
      setCartCount(0);
    }
  }

  // ⚠️ legacy (avoid using)
  function increaseCart(qty = 1) {
    setCartCount((prev) => prev + qty);
  }

  function resetCart() {
    setCartCount(0);
  }

  return (
    <authContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedinUser,
        setLoggedinUser,
        checkIsLoggedIn,

        // ✅ CART
        cartCount,
        updateCartCount,
        fetchCart,
        fetchCartCount,
        resetCart,

        // ⚠️ legacy
        increaseCart,

        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

export default AuthProvider;
