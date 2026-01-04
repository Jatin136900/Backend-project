import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ LOADING STATE

  const navigate = useNavigate();

  /* ======================
     HANDLE INPUT CHANGE
  ====================== */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setData({ ...data, [name]: value });
  }

  /* ======================
     HANDLE REGISTER
  ====================== */
  async function handleSubmit(e) {
    e.preventDefault();

    if (data.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true); // 🔄 START LOADER

      const response = await instance.post("/api/auth/register", data);

      toast.success("🎉 Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

      console.log("User Registered:", response.data);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
      console.error(error);
    } finally {
      setLoading(false); // 🔄 STOP LOADER
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Register to Our E-commerce
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={data.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={data.phone}
                onChange={handleChange}
                required
                inputMode="numeric"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={data.username}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={data.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-lg font-medium transition 
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"}
              `}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-gray-600 mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className={`text-blue-600 hover:underline ${loading ? "pointer-events-none opacity-60" : ""}`}
              >
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
