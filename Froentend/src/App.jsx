import { createBrowserRouter, RouterProvider } from "react-router-dom";

import First from "./pages/First";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import GithubCallback from "./pages/GithubCallback";

import AuthProvider from "./contexts/AuthProvider";

// ADMIN
import AdminLogin from "./Admin/pages/AdminLogin";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Settings from "./Admin/pages/Settings";
import Coupon from "./Admin/pages/Coupon";
import AdminLayout from "./Admin/AdminLayout";

const router = createBrowserRouter([

  /* ================= USER LAYOUT ================= */
  {
    path: "/",
    element: <First />,     // ✅ USER HEADER + FOOTER
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "product", element: <Product /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "github-callback", element: <GithubCallback /> }
    ]
  },

  /* ================= ADMIN (NO HEADER / FOOTER) ================= */
  { path: "/admin/login", element: <AdminLogin /> },

  {
    path: "/admin",
    element: <AdminLayout />,   // ❌ NO USER HEADER / FOOTER
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
      { path: "coupon", element: <Coupon /> },
    ]
  }

]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
