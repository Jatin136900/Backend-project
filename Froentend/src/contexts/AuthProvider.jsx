import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import instance, {
  registerAuthFailureHandlers,
  withAuthRole,
} from "../axios.Config";

const authContext = createContext();

const initialSessionState = {
  status: "loading",
  user: null,
  expiresAt: null,
};

function AuthProvider({ children }) {
  const [userSession, setUserSession] = useState(initialSessionState);
  const [adminSession, setAdminSession] = useState(initialSessionState);
  const [cartCount, setCartCount] = useState(0);
  const expiryTimersRef = useRef({
    user: null,
    admin: null,
  });

  const clearExpiryTimer = useCallback((role) => {
    const timer = expiryTimersRef.current[role];

    if (timer) {
      window.clearTimeout(timer);
      expiryTimersRef.current[role] = null;
    }
  }, []);

  const clearSession = useCallback(
    (role) => {
      clearExpiryTimer(role);

      const setSession = role === "admin" ? setAdminSession : setUserSession;
      setSession({
        status: "anonymous",
        user: null,
        expiresAt: null,
      });

      if (role === "user") {
        setCartCount(0);
      }
    },
    [clearExpiryTimer]
  );

  const scheduleExpiry = useCallback(
    (role, expiresAt) => {
      clearExpiryTimer(role);

      if (!expiresAt) {
        return;
      }

      const expiresInMs = new Date(expiresAt).getTime() - Date.now();

      if (expiresInMs <= 0) {
        clearSession(role);
        return;
      }

      expiryTimersRef.current[role] = window.setTimeout(() => {
        clearSession(role);
      }, expiresInMs);
    },
    [clearExpiryTimer, clearSession]
  );

  const setAuthenticatedSession = useCallback(
    (role, sessionData) => {
      const setSession = role === "admin" ? setAdminSession : setUserSession;
      const nextSession = {
        status: "authenticated",
        user: sessionData.user,
        expiresAt: sessionData.expiresAt || null,
      };

      setSession(nextSession);
      scheduleExpiry(role, nextSession.expiresAt);
    },
    [scheduleExpiry]
  );

  const refreshSession = useCallback(
    async (role, options = {}) => {
      const setSession = role === "admin" ? setAdminSession : setUserSession;
      const shouldMarkLoading = options.markLoading !== false;

      if (shouldMarkLoading) {
        setSession((current) => ({
          ...current,
          status: "loading",
        }));
      }

      try {
        const response = await instance.get(
          "/check/login",
          withAuthRole(role, {
            params: { referer: role },
            skipSessionHandler: true,
          })
        );

        setAuthenticatedSession(role, response.data);
        return response.data;
      } catch (error) {
        clearSession(role);
        return null;
      }
    },
    [clearSession, setAuthenticatedSession]
  );

  const checkIsLoggedIn = useCallback(() => {
    return refreshSession("user", { markLoading: false });
  }, [refreshSession]);

  const checkAdminLogin = useCallback(() => {
    return refreshSession("admin", { markLoading: false });
  }, [refreshSession]);

  const fetchCart = useCallback(async () => {
    const res = await instance.get("/cart", withAuthRole("user"));
    return res.data;
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await instance.get("/cart", withAuthRole("user"));

      const totalQty = res.data.products.reduce(
        (sum, item) => sum + (item?.quantity || 0),
        0
      );

      setCartCount(totalQty);
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  async function logout(role = "user") {
    const endpoint = role === "admin" ? "/admin/logout" : "/api/auth/logout";

    try {
      await instance.post(endpoint, {}, { skipSessionHandler: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearSession(role);
    }
  }

  function updateCartCount(type, qty = 1) {
    setCartCount((prev) => {
      if (type === "set") return Math.max(qty, 0);
      if (type === "add") return prev + qty;
      if (type === "remove") return Math.max(prev - qty, 0);
      if (type === "reset") return 0;
      return prev;
    });
  }

  function increaseCart(qty = 1) {
    setCartCount((prev) => prev + qty);
  }

  function resetCart() {
    setCartCount(0);
  }

  useEffect(() => {
    refreshSession("user");
    refreshSession("admin");
  }, [refreshSession]);

  useEffect(() => {
    return registerAuthFailureHandlers({
      user: () => clearSession("user"),
      admin: () => clearSession("admin"),
    });
  }, [clearSession]);

  useEffect(() => {
    if (userSession.status !== "authenticated") {
      setCartCount(0);
      return;
    }

    fetchCartCount();
  }, [fetchCartCount, userSession.status]);

  useEffect(() => {
    function refreshActiveSessions() {
      if (userSession.status === "authenticated") {
        refreshSession("user", { markLoading: false });
      }

      if (adminSession.status === "authenticated") {
        refreshSession("admin", { markLoading: false });
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshActiveSessions();
      }
    }

    window.addEventListener("focus", refreshActiveSessions);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshActiveSessions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [adminSession.status, refreshSession, userSession.status]);

  useEffect(() => {
    return () => {
      clearExpiryTimer("user");
      clearExpiryTimer("admin");
    };
  }, [clearExpiryTimer]);

  return (
    <authContext.Provider
      value={{
        isLoggedIn: userSession.status === "authenticated",
        isAdminLoggedIn: adminSession.status === "authenticated",
        userStatus: userSession.status,
        adminStatus: adminSession.status,
        loggedinUser: userSession.user,
        adminUser: adminSession.user,
        checkIsLoggedIn,
        checkAdminLogin,
        setAuthenticatedSession,
        clearSession,
        cartCount,
        updateCartCount,
        fetchCart,
        fetchCartCount,
        resetCart,
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
