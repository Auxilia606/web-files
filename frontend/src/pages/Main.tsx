import { Outlet, redirect } from "react-router";
import { Stack } from "@mui/material";

import Header from "@widgets/Header";
import { authCheckStatusApi } from "@shared/api/auth/check-status/route";

const MainPage = () => {
  return (
    <Stack>
      <Header />
      <Outlet />
    </Stack>
  );
};

const Main = Object.assign(MainPage, { loader });

export default Main;

async function loader() {
  try {
    await authCheckStatusApi.GET();
    return null;
  } catch {
    return redirect("/login");
  }
}
