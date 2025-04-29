import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import Login from "@pages/Login";
import Main from "@pages/Main";

function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterProvider;
