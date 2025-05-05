import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import Header from "@widgets/Header";
import { authCheckStatusApi } from "@shared/api/auth/check-status/route";

const MainPage = () => {
  const navigate = useNavigate();
  const { mutate: mutateCheck } = useMutation({
    mutationFn: authCheckStatusApi.GET,
    onSuccess: () => {
      navigate("/explorer", { replace: true });
    },
    onError: () => {
      navigate("/explorer", { replace: true });
    },
  });

  useEffect(() => {
    mutateCheck();
  }, [mutateCheck]);

  return (
    <Stack>
      <Header />
      <Outlet />
    </Stack>
  );
};

const Main = Object.assign(MainPage, { loader });

export default Main;

async function loader() {}
