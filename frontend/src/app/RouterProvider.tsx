import {
  createBrowserRouter,
  Navigate,
  RouterProvider as ReactRouterProvider,
} from "react-router";

import Explorer from "@pages/Explorer";
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
    children: [
      { path: "", element: <Navigate to="/explorer/0" replace /> },
      {
        path: "explorer/:directoryId",
        element: <Explorer />,
      },
    ],
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
