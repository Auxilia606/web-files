import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal as MuiModal,
  Stack,
  Typography,
} from "@mui/material";

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  content: ReactNode;
  title?: ReactNode;
  disableBackdropClose?: boolean;
  hideClose?: boolean;
};

const ModalEntity = (props: ModalProps) => {
  const { setOpen } = props;
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <MuiModal
      open={props.open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Stack
        sx={{
          position: "relative",
          bgcolor: "white",
          padding: "24px",
          borderRadius: "16px",
        }}
      >
        {!props.title ? null : typeof props.title === "string" ? (
          <Typography fontSize={20} fontWeight={700} sx={{ minWidth: "160px" }}>
            {props.title}
          </Typography>
        ) : (
          props.title
        )}
        {props.content}
        {!props.hideClose && (
          <IconButton
            sx={{ position: "absolute", top: 16, right: 16 }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        )}
      </Stack>
    </MuiModal>
  );
};

type ModalContentProps = {
  tag?: ReactNode;
  title?: string;
  subTitle?: string;
  content?: ReactNode;
  hideCancel?: boolean;
  onConfirm: () => void;
};

const ModalContent = (props: ModalContentProps) => {
  return (
    <Stack gap="16px" sx={{ minWidth: "320px" }}>
      {props.tag}
      <Typography fontWeight={700}>{props.title}</Typography>
      <Typography>{props.subTitle}</Typography>
      <Stack direction="row" justifyContent="flex-end" gap="8px">
        {!props.hideCancel && (
          <Button variant="text" size="small">
            취소
          </Button>
        )}
        <Button variant="contained" size="small" onClick={props.onConfirm}>
          확인
        </Button>
      </Stack>
    </Stack>
  );
};

export type modalControl = {
  open: () => void;
  close: () => void;
  props: (p: UseModalInputParams) => modalControl;
};

type UseModalInputParams = Omit<ModalProps, "open" | "setOpen">;

const useModal = (props?: UseModalInputParams) => {
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<UseModalInputParams>({
    content: <></>,
    ...props,
  });

  const modalControl = useRef<modalControl>({} as modalControl);

  if (!modalControl.current.open) {
    const controller = {
      open: () => setOpen(true),
      close: () => setOpen(false),
      props: (item: UseModalInputParams) => {
        setModalState((prev) => ({
          ...prev,
          ...item,
        }));

        return controller;
      },
    };

    modalControl.current = controller;
  }

  return {
    modalProps: { ...modalState, open, setOpen },
    modalControl: modalControl.current,
  };
};

const Modal = Object.assign(ModalEntity, { Content: ModalContent, useModal });

export default Modal;
