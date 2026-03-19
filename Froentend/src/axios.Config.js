import axios from "axios";

const authFailureHandlers = {
  user: null,
  admin: null,
};

export function withAuthRole(role, config = {}) {
  return {
    ...config,
    authRole: role,
  };
}

export function registerAuthFailureHandlers(handlers) {
  authFailureHandlers.user = handlers.user || null;
  authFailureHandlers.admin = handlers.admin || null;

  return () => {
    authFailureHandlers.user = null;
    authFailureHandlers.admin = null;
  };
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const role = error.config?.authRole;
    const isAuthError = error.response?.data?.authError === true;

    if (
      !error.config?.skipSessionHandler &&
      role &&
      isAuthError &&
      (status === 401 || status === 403)
    ) {
      authFailureHandlers[role]?.(error);
    }

    return Promise.reject(error);
  }
);

export default instance;
