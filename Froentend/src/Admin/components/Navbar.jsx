import { useNavigate } from "react-router-dom";
import instance from '..//../axios.Config';

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await instance.post("/admin/logout"); // 👈 API call
      navigate("/admin/login");             // 👈 redirect
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  }

  return (
    <div className="w-full px-6 py-4 bg-white/30 backdrop-blur-lg shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
