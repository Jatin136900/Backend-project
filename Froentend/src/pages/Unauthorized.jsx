import { Link, useLocation } from "react-router-dom";

export default function Unauthorized() {
  const location = useLocation();
  const requiredRole =
    location.state?.requiredRole === "admin" ? "admin" : "user";
  const loginPath = requiredRole === "admin" ? "/admin/login" : "/login";
  const requestedPath = location.state?.from || null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          Access denied
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          You do not have permission to view this page.
        </h1>

        <p className="mt-4 text-gray-600">
          This area requires an active {requiredRole} session.
        </p>

        {requestedPath && (
          <p className="mt-2 text-sm text-gray-500">
            Requested route: {requestedPath}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={loginPath}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Go to {requiredRole === "admin" ? "Admin" : "User"} Login
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
