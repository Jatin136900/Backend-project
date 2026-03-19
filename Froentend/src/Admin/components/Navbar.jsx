import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout("admin");
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
      console.error("Logout failed", error);
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
