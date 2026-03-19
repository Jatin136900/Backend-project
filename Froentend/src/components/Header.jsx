import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import logo from "../images/logo.png";
import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../contexts/AuthProvider";

function Header() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartCount, isLoggedIn, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold"
      : "hover:text-yellow-300 transition";

  function delayedNavigate(path) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 2000);
  }

  async function handleUserLogout() {
    setLoading(true);
    await logout("user");

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000);
  }

  return (
    <>
      {loading && <FullScreenLoader />}

      <header className="bg-amber-700 text-white sticky top-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 md:h-14" />
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-lg">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>

            <div className="flex items-center gap-6 text-2xl">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    delayedNavigate("/login");
                  }}
                >
                  <FaUser />
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  to="/cart"
                  className="relative"
                  onClick={(e) => {
                    e.preventDefault();
                    delayedNavigate("/cart");
                  }}
                >
                  <FaShoppingCart />
                  <span className="absolute -top-2 -right-3 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                </Link>
              )}

              <Link
                to="/admin/login"
                onClick={(e) => {
                  e.preventDefault();
                  delayedNavigate("/admin/login");
                }}
              >
                <RiAdminFill />
              </Link>

              {isLoggedIn && (
                <button type="button" onClick={handleUserLogout}>
                  <IoMdLogOut />
                </button>
              )}
            </div>
          </nav>

          <button className="md:hidden text-3xl" onClick={() => setOpen(true)}>
            <FaBars />
          </button>
        </div>

        <div
          className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed top-0 right-0 w-72 h-full bg-amber-800 text-white z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-3xl"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>

          <nav className="flex flex-col gap-6 p-6 pt-16 text-lg">
            <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Contact
            </NavLink>

            <hr className="border-white/30" />

            <div className="flex justify-around text-2xl text-white">
              {!isLoggedIn && <FaUser onClick={() => delayedNavigate("/login")} />}
              {isLoggedIn && (
                <FaShoppingCart onClick={() => delayedNavigate("/cart")} />
              )}
              <RiAdminFill onClick={() => delayedNavigate("/admin/login")} />
              {isLoggedIn && <IoMdLogOut onClick={handleUserLogout} />}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
