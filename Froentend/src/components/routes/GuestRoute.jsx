import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "../FullScreenLoader";
import { useAuth } from "../../contexts/AuthProvider";

export default function GuestRoute({ role }) {
  const location = useLocation();
  const {
    isLoggedIn,
    isAdminLoggedIn,
    userStatus,
    adminStatus,
  } = useAuth();

  const status = role === "admin" ? adminStatus : userStatus;
  const isAuthenticated = role === "admin" ? isAdminLoggedIn : isLoggedIn;
  const redirectPath =
    role === "admin"
      ? "/admin/dashboard"
      : location.state?.redirectTo || "/";

  if (status === "loading") {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
