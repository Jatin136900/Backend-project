import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "../FullScreenLoader";
import { useAuth } from "../../contexts/AuthProvider";

function getRequestedPath(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}

export default function ProtectedRoute({ role }) {
  const location = useLocation();
  const {
    isLoggedIn,
    isAdminLoggedIn,
    userStatus,
    adminStatus,
  } = useAuth();

  const requiredStatus = role === "admin" ? adminStatus : userStatus;
  const oppositeStatus = role === "admin" ? userStatus : adminStatus;
  const hasRequiredSession = role === "admin" ? isAdminLoggedIn : isLoggedIn;
  const hasOppositeSession = role === "admin" ? isLoggedIn : isAdminLoggedIn;
  const loginPath = role === "admin" ? "/admin/login" : "/login";
  const requestedPath = getRequestedPath(location);

  if (requiredStatus === "loading" || oppositeStatus === "loading") {
    return <FullScreenLoader />;
  }

  if (hasRequiredSession) {
    return <Outlet />;
  }

  if (hasOppositeSession) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: requestedPath, requiredRole: role }}
      />
    );
  }

  return (
    <Navigate
      to={loginPath}
      replace
      state={{ redirectTo: requestedPath, requiredRole: role }}
    />
  );
}
