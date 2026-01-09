import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
    ${isActive
      ? "bg-white text-orange-600 shadow-md"
      : "text-orange-100 hover:bg-orange-500 hover:text-white"
    }
  `;

  return (
    <div className="w-64 min-h-screen bg-orange-600 p-5 hidden md:block">
      {/* TITLE */}
      <h2 className="text-white text-xl font-bold mb-6 tracking-wide">
        Admin Panel
      </h2>

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

        <NavLink to="/admin/category" className={linkClasses}>
          Add Category
        </NavLink>
      </nav>
    </div>
  );
}
