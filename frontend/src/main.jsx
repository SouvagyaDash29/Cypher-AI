import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chatpage from "./pages/Chatpage";
import LayoutPage from "./layouts/LayoutPage";
import DashboardLayout from "./layouts/DashboardLayout";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const router = createBrowserRouter([
  {
    element: <LayoutPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-in/*",
        element: <SignIn />,
      },
      {
        path: "/sign-up/*",
        element: <SignUp />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage />
          }
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
