import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axios.Config"; // ✅ AXIOS INSTANCE

function Register() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  /* ======================
     HANDLE INPUT CHANGE
  ====================== */
  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  /* ======================
     HANDLE REGISTER
  ====================== */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await instance.post("/auth/register", data);

      console.log("User Registered:", response.data);
      alert("User registered successfully");

      navigate("/login");

    } catch (error) {
      console.log("Register Error:", error);
      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }

  return (
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
              placeholder="Enter phone number"
              value={data.phone}
              onChange={handleChange}
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Register
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
