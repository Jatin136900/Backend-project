import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axios.Config";

const authContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);


  // ✅ ADD: CART GLOBAL STATE
  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    checkIsLoggedIn();
    fetchCartCount();

  }, []);

  async function checkIsLoggedIn() {
    try {
      const response = await instance.get(
        "/check/login?refresh=user",
        { withCredentials: true }
      );

      // ✅ user logged in
      if (response.status === 200) {
        setIsLoggedIn(true);
        setLoggedinUser(response.data.user);
        // ✅ FETCH CART COUNT
        fetchCartCount();
      }
    } catch (error) {
      // ❌ user not logged in
      setIsLoggedIn(false);
      setLoggedinUser(null);
      setCartCount(0); // ✅ logout pe cart reset
      console.log("Not logged in");
    }
  }


  // ✅ ADD: FETCH CART FROM BACKEND

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


  // ✅ ADD: CART FUNCTIONS
  function increaseCart(qty = 1) {
    setCartCount(prev => prev + qty);
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
        increaseCart,
        resetCart,


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
