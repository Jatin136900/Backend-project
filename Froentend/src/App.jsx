import { createBrowserRouter, RouterProvider } from "react-router-dom";
import First from "./pages/First";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./contexts/AuthProvider";

import AdminLogin from "./Admin/pages/AdminLogin";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Settings from "./Admin/pages/Settings";
import AdminLayout from "./Admin/AdminLayout";

import Product from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Coupon from "./Admin/pages/Coupon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <First />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      
      /* ---------- ADMIN ---------- */
      { path: "admin/login", element: <AdminLogin /> },
      
      {
        path: "admin",
        element: <AdminLayout />,   // 👈 LAYOUT
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "users", element: <Users /> },
          { path: "settings", element: <Settings /> },
          { path: "Coupon", element: <Coupon /> },
        ]
      },

      /* ---------- USER ---------- */
      { path: "product", element: <Product /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> }
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
