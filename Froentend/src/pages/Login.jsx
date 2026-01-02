import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import FullScreenLoader from "../components/FullScreenLoader";
import instance from "../axios.Config"; // ✅ AXIOS INSTANCE
import { GoogleLogin } from "@react-oauth/google";


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
      // ✅ INSTANCE USED (NO FULL URL, NO withCredentials)
      const response = await instance.post("/api/auth/login", data);

      // // ✅ AUTH STATE
      // setIsLoggedIn(true);
      // setLoggedinUser(response.data.user);

      alert("User Login Successful!");

      checkIsLoggedIn();

      // ⏳ Loader Delay
      setTimeout(() => {
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
        setLoading(false);
      }, 3000);

    } catch (error) {
      setLoading(false);
      setErrorMsg(
        error.response?.data?.message || "Login failed"
      );
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      await instance.post("/user/google-login", {
        token: credentialResponse.credential,
      });

      alert("Google login successful");
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  }

  function handleGoogleError() {
    alert("Google Login Failed");
  }


  return (
    <>
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

            {/* PASSWORD */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Enter your password"
              />
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
                  onError={handleGoogleError}
                  width="100%"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
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
