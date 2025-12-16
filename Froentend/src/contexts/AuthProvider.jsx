import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axios.Config";

const authContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);

  useEffect(() => {
    checkIsLoggedIn();
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
      }
    } catch (error) {
      // ❌ user not logged in
      setIsLoggedIn(false);
      setLoggedinUser(null);
      console.log("Not logged in");
    }
  }

  return (
    <authContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedinUser,
        setLoggedinUser,
        checkIsLoggedIn
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
