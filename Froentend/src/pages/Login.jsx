import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import FullScreenLoader from "../components/FullScreenLoader";
import instance from "../axios.Config";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { checkIsLoggedIn } = useAuth();

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
      // ✅ NORMAL LOGIN
      await instance.post("/api/auth/login", data);

      toast.success("User login successfully");

      // 🔥 ADD: SEND LOGIN OTP
      await instance.post("/api/auth/send-login-otp", {
        email: data.email,
      });

      checkIsLoggedIn();

      // 🔥 ADD: REDIRECT TO OTP PAGE
      navigate("/verify-otp", {
        state: { email: data.email },
      });

    } catch (error) {
      setLoading(false);

      toast.error(
        error.response?.data?.message ||
        "Wrong details, please check your information"
      );

      setErrorMsg(
        error.response?.data?.message || "Login failed"
      );
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      await instance.post("/api/auth/googleLogin", {
        token: credentialResponse.credential,
      });

      toast.success("Google login successful");
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  }

  function handleGithubLogin() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:5173/github-callback";

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=user:email read:user`;
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

            <GoogleLogin onSuccess={handleGoogleSuccess} />

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-3 bg-black text-white rounded-lg"
            >
              Continue with GitHub
            </button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
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
