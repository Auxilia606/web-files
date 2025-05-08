import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Alert,
  AlertProps,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarProps,
} from "@mui/material";

const GlobalSnackbarProvider = (props: PropsWithChildren) => {
  const [snackbarState, setSnackbarState] = useState<
    SnackbarProps & Pick<AlertProps, "severity">
  >({
    open: false,
    slots: { transition: SlideTransition },
    severity: "success",
  });

  const handleOpen = useCallback(
    (params: Omit<SnackbarProps, "open"> & Pick<AlertProps, "severity">) => {
      setSnackbarState((prev) => ({ ...prev, ...params, open: true }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <GlobalSnackbarContext.Provider value={{ handleOpen, handleClose }}>
      {props.children}
      <Snackbar
        autoHideDuration={5000}
        onClose={handleClose}
        {...snackbarState}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </GlobalSnackbarContext.Provider>
  );
};

const GlobalSnackbarContext = createContext<{
  handleOpen: (
    params: Omit<SnackbarProps, "open"> & Pick<AlertProps, "severity">
  ) => void;
  handleClose: () => void;
}>({
  handleOpen: () => {},
  handleClose: () => {},
});

const useGlobalSnackbar = () => {
  const { handleOpen, handleClose } = useContext(GlobalSnackbarContext);

  return { handleOpen, handleClose };
};

const GlobalSnackbar = Object.assign(GlobalSnackbarProvider, {
  use: useGlobalSnackbar,
});

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

export default GlobalSnackbar;
