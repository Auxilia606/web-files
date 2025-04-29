import {
  createBrowserRouter,
  Navigate,
  RouterProvider as ReactRouterProvider,
} from "react-router";

import Login from "@pages/Login";
import Main from "@pages/Main";

function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: Main.loader,
  },
  {
    path: "/login",
    element: <Login />,
    loader: Login.loader,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default RouterProvider;
