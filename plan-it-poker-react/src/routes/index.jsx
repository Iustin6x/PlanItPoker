import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";
import Logout from "../pages/auth/Logout";
import Home from "../pages/Home";
import Rooms from "../pages/rooms/Rooms";
import Room from "../pages/rooms/Room"
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
      ],
    },
    {
      element: <ProtectedRoute />,
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
          path: "rooms",
          children: [
            {
              index: true,
              element: <Rooms />,
            },
            {
              path: ":roomId",
              element: <Room />,
            },
          ],
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
