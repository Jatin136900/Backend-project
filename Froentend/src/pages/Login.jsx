import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import FullScreenLoader from "../components/FullScreenLoader";
import instance from "../axios.Config"; // ✅ AXIOS INSTANCE
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

  /* ======================
     HANDLE INPUT CHANGE
  ====================== */
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  /* ======================
     HANDLE LOGIN SUBMIT
  ====================== */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await instance.post("/api/auth/login", data);

      console.log("User Login Successful!");

      // ✅ SUCCESS TOAST
      toast.success("User login successfully");

      checkIsLoggedIn();

      setTimeout(() => {
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
        setLoading(false);
      }, 3000);

    } catch (error) {
      setLoading(false);

      // ❌ ERROR TOAST
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
      console.error(error);
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
      {/* 🔔 TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* 🔥 FULL SCREEN LOADER */}
      {loading && <FullScreenLoader />}

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md hover:shadow-2xl transition duration-300">

          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            User Login
          </h2>

          {/* ❌ ERROR MESSAGE */}
          {errorMsg && (
            <p className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-center text-sm">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition pr-10"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all duration-300
                ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                }
              `}
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            <div className="flex justify-center">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  width="100%"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <div className="flex justify-center mt-3">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition cursor-pointer"
              >
                Continue with GitHub
              </button>
            </div>

            {/* REGISTER LINK */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <NavLink
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
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
