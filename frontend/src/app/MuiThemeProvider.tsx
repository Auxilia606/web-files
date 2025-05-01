import { PropsWithChildren } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const MuiThemeProvider = (props: PropsWithChildren) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

const theme = createTheme({
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
  },
});

export default MuiThemeProvider;
