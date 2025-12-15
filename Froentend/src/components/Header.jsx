import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser } from "react-icons/fa";
import logo from "../images/logo.png";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-amber-700 text-white sticky top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12 w-auto md:h-14" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-lg">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
            }
          >
            Contact
          </NavLink>

          {/* Icons */}
          <div className="flex items-center gap-6 text-2xl">

            <Link to="/login" className="hover:text-yellow-300">
              <FaUser />
            </Link>

            <Link to="/cart" className="relative hover:text-yellow-300">
              <FaShoppingCart />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>

          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-amber-800 transition-all duration-300 overflow-hidden ${open ? "max-h-screen" : "max-h-0"
          }`}
      >
        <nav className="flex flex-col gap-4 p-4 text-lg">

          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/about" onClick={() => setOpen(false)}>
            About
          </NavLink>

          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          <div className="flex justify-center gap-6 text-xl mt-2">
            <Link to="/login">
              <FaUser />
            </Link>
            <Link to="/cart">
              <FaShoppingCart /> <span>0</span>
            </Link>
          </div>

        </nav>
      </div>
    </header>
  );
}

export default Header;
