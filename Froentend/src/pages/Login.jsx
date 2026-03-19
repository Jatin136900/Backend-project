import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import instance from "../axios.Config";
import { useAuth } from "../contexts/AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  githubCallbackUrl,
  githubClientId,
  googleClientId,
} from "../config/env";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticatedSession } = useAuth();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await instance.post("/api/auth/login", data);
      setAuthenticatedSession("user", response.data);

      toast.success(
        response.data?.message || "Login successful"
      );

      navigate(location.state?.redirectTo || "/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Wrong details, please check your information";

      toast.error(message);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const response = await instance.post("/api/auth/googleLogin", {
        token: credentialResponse.credential,
      });

      setAuthenticatedSession("user", response.data);
      toast.success("Google login successful");
      navigate(location.state?.redirectTo || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  }

  function createGithubState() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return Math.random().toString(36).slice(2);
  }

  function handleGithubLogin() {
    if (!githubClientId) {
      toast.error("GitHub login is not configured.");
      return;
    }

    const redirectTo = location.state?.redirectTo || "/";
    const oauthState = createGithubState();
    const authUrl = new URL("https://github.com/login/oauth/authorize");

    sessionStorage.setItem("github_oauth_state", oauthState);
    sessionStorage.setItem("post_login_redirect", redirectTo);

    authUrl.searchParams.set("client_id", githubClientId);
    authUrl.searchParams.set("redirect_uri", githubCallbackUrl);
    authUrl.searchParams.set("scope", "read:user user:email");
    authUrl.searchParams.set("state", oauthState);

    window.location.assign(authUrl.toString());
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      {loading && <FullScreenLoader />}

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            User Login
          </h2>

          {errorMsg && (
            <p className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-center text-sm">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
              className="w-full p-3 border rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full p-3 border rounded-lg pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            {googleClientId ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
              />
            ) : (
              <p className="text-center text-sm text-gray-500">
                Google login is unavailable right now.
              </p>
            )}

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-3 bg-black text-white rounded-lg"
            >
              Continue with GitHub
            </button>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <NavLink to="/register" className="text-blue-600">
                Register
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
