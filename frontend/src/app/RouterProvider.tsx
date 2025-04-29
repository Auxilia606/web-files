import {
  createBrowserRouter,
  Navigate,
  RouterProvider as ReactRouterProvider,
} from "react-router";

import Login from "@pages/Login";
import Main from "@pages/Main";
import Signup from "@pages/Signup";

function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: Main.loader,
    hydrateFallbackElement: <></>,
  },
  {
    path: "/login",
    element: <Login />,
    loader: Login.loader,
    hydrateFallbackElement: <></>,
  },
  { path: "/signup", element: <Signup /> },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default RouterProvider;
