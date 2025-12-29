import { createBrowserRouter, RouterProvider } from "react-router-dom";
import First from "./pages/First";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./contexts/AuthProvider";
import Dashboard from "./Admin/pages/Dashboard";
import AdminLogin from "./Admin/pages/AdminLogin";
import Users from './Admin/pages/Users'
import Settings from "./Admin/pages/Settings";
import Product from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from './pages/Cart.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <First />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "admin/admin/login",
        element: <AdminLogin />
      },
      {
        path: "admin/dashboard",
        element: <Dashboard />
      },
      {
        path: "admin/users",
        element: <Users />
      },
      {
        path: "admin/settings",
        element: <Settings />
      },
      {
        path: "product",
        element: <Product />
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />
      },
      {
        path: "Cart",
        element: <Cart />
      },


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
