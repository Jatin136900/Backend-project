import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/login",
        data,
        { withCredentials: true }
      );

      alert("Admin Login Successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-blue-600">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Admin Login
        </h2>

        {errorMsg && (
          <p className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-center">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium text-gray-700">Admin Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter admin email"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Admin Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter admin password"
              value={data.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-lg font-medium transition 
            ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
