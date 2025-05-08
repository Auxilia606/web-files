import { PropsWithChildren, useMemo } from "react";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";

const MuiThemeProvider = (props: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          background: {
            default: "#121212",
            paper: "#1E1E1E",
          },
          primary: {
            main: "#90caf9",
          },
          text: {
            primary: "#ffffff",
            secondary: "#aaaaaa",
          },
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: () => ({
                ".MuiFormHelperText-root": {
                  position: "absolute",
                  bottom: -2,
                  transform: "translate(0, 100%)",
                },
              }),
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                position: "relative",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: ({ theme }) => ({
                color: theme.palette.text.primary,
                "&.Mui-disabled": {
                  color: theme.palette.text.secondary,
                },
              }),
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 🌙 다크모드 배경 및 텍스트 색 자동 초기화 */}
      {props.children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
