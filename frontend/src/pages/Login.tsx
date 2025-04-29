import { Controller, useForm } from "react-hook-form";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import { authLoginApi } from "shared/api/auth/login/route";

const Login = () => {
  const { handleSubmit, control } =
    useForm<Parameters<typeof authLoginApi.POST>[0]>();
  const { mutate } = useMutation({
    mutationFn: authLoginApi.POST,
  });

  return (
    <Stack flex={1} justifyContent="center" alignItems="center">
      <Stack
        gap="24px"
        sx={{
          width: "400px",
          borderRadius: "12px",
          boxShadow: "2px 5px 13px 3px rgba(0,0,0,0.25)",
          padding: "40px",
        }}
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
          name="email"
          rules={{ required: "아이디를 입력해주세요." }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="아이디"
              placeholder="아이디를 입력해주세요."
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
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              type="password"
            />
          )}
        />
        <Button variant="contained" size="large" type="submit">
          로그인
        </Button>
      </Stack>
    </Stack>
  );
};

export default Login;
