import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-orange-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="w-64 min-h-screen bg-black p-5 hidden md:block">
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClasses}>
          Users
        </NavLink>

        <NavLink to="/admin/settings" className={linkClasses}>
          Product Settings 
        </NavLink>

        <NavLink to="/admin/coupon" className={linkClasses}>
          Create Coupon
        </NavLink>
      </nav>
    </div>
  );
}
