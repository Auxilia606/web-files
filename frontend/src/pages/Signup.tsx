import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import Modal from "@entities/Modal";
import GlobalModal from "@shared/components/GlobalModal";

import { authCheckIdApi } from "shared/api/auth/check-id/route";
import { authRegisterApi } from "shared/api/auth/register/route";

const Signup = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<
    Parameters<typeof authRegisterApi.POST>[0] & {
      passwordCheck: string;
    }
  >({
    defaultValues: {
      loginId: "",
      password: "",
      passwordCheck: "",
    },
  });
  const { modal1Control } = GlobalModal.use();
  const { mutate: mutateRegister } = useMutation({
    mutationFn: authRegisterApi.POST,
    onSuccess: () => {
      modal1Control
        ?.props({
          title: "",
          content: (
            <Modal.Content
              tag="가입완료"
              title="회원 가입이 완료되었습니다."
              hideCancel
              onConfirm={() => {
                modal1Control.close();
                navigate("/login");
              }}
            />
          ),
        })
        .open();
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack flex={1} justifyContent="center" alignItems="center">
      <Stack
        gap={isMobile ? "24px" : "40px"}
        sx={{
          borderRadius: "12px",
          boxShadow: "2px 5px 13px 3px rgba(0,0,0,0.25)",
          width: isMobile ? "320px" : "600px",
          padding: isMobile ? "24px" : "40px",
        }}
        component="form"
        onSubmit={handleSubmit((data) => {
          mutateRegister({
            loginId: data.loginId,
            password: data.password,
            nickname: data.nickname,
          });
        })}
      >
        <Typography textAlign="center" fontWeight={700} fontSize="2rem">
          회원가입
        </Typography>
        <Controller
          control={control}
          name="loginId"
          rules={{
            required: "아이디를 입력해주세요.",
            validate: async (value) => {
              if (/^[a-z][a-z0-9]{3,19}$/.test(value)) {
                try {
                  await authCheckIdApi.POST({ loginId: value });

                  return true;
                } catch (error) {
                  return (error as Error).message;
                }
              } else {
                return "4자 이상 20자 이하, 영소문자와 숫자를 조합해주세요";
              }
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="아이디"
              placeholder="아이디를 입력해주세요."
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: "비밀번호를 입력해주세요.",
            validate: (value) => {
              if (
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(
                  value
                )
              ) {
                return true;
              } else {
                return "비밀번호는 최소 8자, 영어와 숫자 및 특수문자로 입력해주세요.";
              }
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              type="password"
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          control={control}
          name="passwordCheck"
          rules={{
            required: "비밀번호를 다시 입력해주세요.",
            validate: (value, formValues) => {
              if (formValues.password !== value) {
                return "비밀번호가 일치하지 않습니다.";
              }
              if (
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(
                  value
                )
              ) {
                return true;
              } else {
                return "비밀번호는 최소 8자, 영어와 숫자 및 특수문자로 입력해주세요.";
              }
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요."
              type="password"
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          control={control}
          name="nickname"
          rules={{
            required: "닉네임을 입력해주세요.",
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              label="닉네임"
              placeholder="닉네임을 입력해주세요."
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Button variant="contained" size="large" type="submit">
          회원가입
        </Button>
      </Stack>
    </Stack>
  );
};

export default Signup;
