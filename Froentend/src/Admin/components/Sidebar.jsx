import { Link } from "react-router-dom";
import { Home, Users, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-60 bg-gray-900 text-white p-6 shadow-xl flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <Link
        to="/admin/dashboard"
        className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg"
      >
        <Home size={20} /> Dashboard
      </Link>

      <Link
        to="/admin/users"
        className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg"
      >
        <Users size={20} /> Users
      </Link>

      <Link
        to="/admin/settings"
        className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg"
      >
        <Settings size={20} /> Settings
      </Link>
    </div>
  );
}
