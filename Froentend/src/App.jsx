import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import First from "./pages/First";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import GithubCallback from "./pages/GithubCallback";
import Unauthorized from "./pages/Unauthorized";

import AuthProvider from "./contexts/AuthProvider";

import AdminLogin from "./Admin/pages/AdminLogin";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Settings from "./Admin/pages/Settings";
import Coupon from "./Admin/pages/Coupon";
import AdminLayout from "./Admin/AdminLayout";
import AddCategory from "./Admin/pages/AddCategory";
import CategoryProducts from "./pages/CategoryProducts";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <First />,
    children: [
      {
        element: <GuestRoute role="user" />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "github-callback", element: <GithubCallback /> },
        ],
      },
      {
        element: <ProtectedRoute role="user" />,
        children: [
          { index: true, element: <Home /> },
          { path: "product", element: <Product /> },
          { path: "product/:slug", element: <ProductDetail /> },
          { path: "cart", element: <Cart /> },
          { path: "category/:slug", element: <CategoryProducts /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin/login",
    element: <GuestRoute role="admin" />,
    children: [{ index: true, element: <AdminLogin /> }],
  },
  {
    path: "/admin",
    element: <ProtectedRoute role="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "users", element: <Users /> },
          { path: "settings", element: <Settings /> },
          { path: "coupon", element: <Coupon /> },
          { path: "category", element: <AddCategory /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
