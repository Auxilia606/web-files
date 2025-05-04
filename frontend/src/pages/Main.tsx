import { redirect } from "react-router-dom";
import { Stack } from "@mui/material";

import Header from "@widgets/Header";
import { authCheckStatusApi } from "@shared/api/auth/check-status/route";

const MainPage = () => {
  return (
    <Stack>
      <Header />
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
