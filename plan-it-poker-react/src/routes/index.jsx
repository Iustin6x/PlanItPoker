import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute"; 
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";
import Logout from "../pages/auth/Logout";
import Home from "../pages/Home";
import PublicHome from "../pages/PublicHome";
import ErrorPage from "../pages/ErrorPage";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />, 
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <PublicHome />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "about-us",
          element: <div>About Us</div>,
        },
        {
          path: "service",
          element: <div>Service Page</div>,
        },
      ],
    },
    {
      element: <ProtectedRoute />, // Rută protejată principală
      children: [
        {
          path: "dashboard",
          element: <Home />,
        },
        {
          path: "profile",
          element: <div>User Profile</div>,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    {
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;