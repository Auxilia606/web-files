import { Controller, useForm } from "react-hook-form";
import { NavLink, redirect, useNavigate } from "react-router";
import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import { authLoginApi } from "shared/api/auth/login/route";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, setError } = useForm<
    Parameters<typeof authLoginApi.POST>[0]
  >({
    defaultValues: {
      loginId: "",
      password: "",
    },
  });
  const { mutate } = useMutation({
    mutationFn: authLoginApi.POST,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (data) => {
      setError("loginId", { message: data.message });
      setError("password", { message: data.message });
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack flex={1} justifyContent="center" alignItems="center">
      <Stack
        gap="40px"
        sx={({ breakpoints, palette }) => ({
          borderRadius: "12px",
          boxShadow: "2px 5px 13px 3px rgba(0,0,0,0.25)",
          width: "600px",
          padding: "40px",
          [breakpoints.down("sm")]: {
            width: "320px",
            padding: "24px",
          },
          bgcolor: palette.background.paper,
        })}
        component="form"
        onSubmit={handleSubmit((data) => {
          mutate(data);
        })}
      >
        <Typography textAlign="center" fontWeight={700} fontSize="2rem">
          서비스 로그인
        </Typography>
        <Controller
          control={control}
          name="loginId"
          rules={{ required: "아이디를 입력해주세요." }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              size={isMobile ? "small" : "medium"}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="아이디"
              placeholder="아이디를 입력해주세요."
              autoComplete="email"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: "비밀번호를 입력해주세요." }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              size={isMobile ? "small" : "medium"}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              type="password"
              autoComplete="current-password"
            />
          )}
        />
        <Stack gap="16px">
          <Button variant="contained" size="large" type="submit">
            로그인
          </Button>
          <Stack direction="row" justifyContent="center">
            <NavLink to="/signup">
              <Typography component="span" color="primary">
                회원가입
              </Typography>
            </NavLink>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Login = Object.assign(LoginPage, { loader });

export default Login;

async function loader() {
  const accessToken = sessionStorage.getItem("access-token");

  if (accessToken) {
    return redirect("/");
  }

  return null;
}
