import React, {
  Dispatch,
  Fragment,
  memo,
  SetStateAction,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  AccountCircleOutlined,
  AddPhotoAlternateOutlined,
  ArrowBackIosNewOutlined,
  ArrowRightOutlined,
  CreateNewFolderOutlined,
} from "@mui/icons-material";
import {
  Button,
  Drawer,
  IconButton,
  IconButtonProps,
  LinearProgress,
  linearProgressClasses,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";

import GlobalSnackbar from "@entities/GlobalSnackbar";
import { directoryDetailApi } from "@shared/api/directory/[id]/detail/route";
import { directoryApi } from "@shared/api/directory/[id]/route";
import { directoryCreateApi } from "@shared/api/directory/create/route";
import { fileListApi } from "@shared/api/file-info/files/routes";
import { fileUploadApi } from "@shared/api/file-info/upload/route";
import { FileListReqDTO } from "@dto/file-info.dto";

const Header = () => {
  const params = useParams<{ directoryId: string }>();

  const directoryId = Number(params.directoryId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const toggleCreateDrawer = (newOpen: boolean) => () => {
    setIsCreateOpen(newOpen);
  };

  const pathRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, setError } = useForm<
    Parameters<typeof directoryCreateApi.POST>[0]
  >({
    defaultValues: {
      parentId: null,
      directoryName: "",
    },
  });

  const { data: directoryData } = useQuery({
    queryKey: ["directory", params.directoryId, "detail"],
    queryFn: async () => {
      return directoryDetailApi.GET({ directoryId });
    },
    enabled: !!directoryId && !isNaN(directoryId),
  });

  const { refetch: refetchDirectory } = useQuery({
    queryKey: ["directory", params.directoryId],
    queryFn: async () => {
      return directoryApi.GET({ directoryId });
    },
    enabled: !isNaN(directoryId),
  });

  const { mutate: mutateCreate } = useMutation({
    mutationFn: directoryCreateApi.POST,
    onSuccess: () => {
      refetchDirectory();
      toggleCreateDrawer(false)();
    },
    onError: (error) => {
      setError("directoryName", { message: error.message });
    },
  });

  useLayoutEffect(() => {
    pathRef.current?.scrollTo({ behavior: "smooth", left: 9999 });
  }, [directoryId]);

  return (
    <Stack
      direction="column"
      position="sticky"
      top="0"
      sx={({ palette }) => ({
        bgcolor: palette.background.default,
        paddingBottom: "8px",
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        height="64px"
        sx={{ padding: "0 8px" }}
      >
        <BackButton />
        <CreateNewDirectoryButton onClick={toggleCreateDrawer(true)} />
        <FileAddButton />
        <AccountButton />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        overflow="hidden"
        sx={{ margin: "0 16px" }}
        ref={pathRef}
      >
        <Typography flex="0 0 auto">루트</Typography>
        {directoryData?.directory.fullPath
          .split("/")
          .filter((path) => path)
          .map((pathName, index, arr) => {
            const isLast = arr.length - 1 === index;
            return (
              <React.Fragment key={pathName}>
                <ArrowRightOutlined />
                <Typography
                  fontWeight={isLast ? 700 : 400}
                  color={isLast ? "primary" : "textPrimary"}
                  flex="0 0 auto"
                >
                  {pathName}
                </Typography>
              </React.Fragment>
            );
          })}
      </Stack>
      <Drawer
        anchor="bottom"
        open={isCreateOpen}
        onClose={toggleCreateDrawer(false)}
      >
        <Stack
          component="form"
          direction="column"
          padding="16px 24px"
          gap="16px"
          onSubmit={handleSubmit((data) => {
            mutateCreate({
              parentId: directoryId || null,
              directoryName: data.directoryName,
            });
          })}
        >
          <Controller
            control={control}
            name="directoryName"
            rules={{ required: "폴더 이름을 입력해주세요" }}
            render={({ field, fieldState }) => (
              <TextField
                variant="outlined"
                size="small"
                label="폴더 이름"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Stack direction="row" justifyContent="center">
            <Button
              type="button"
              variant="text"
              color="inherit"
              size="large"
              sx={{ flex: "1" }}
              onClick={toggleCreateDrawer(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="text"
              color="primary"
              size="large"
              sx={{ flex: "1" }}
            >
              확인
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  const params = useParams<{ directoryId: string }>();

  const directoryId = Number(params.directoryId);

  return (
    <IconButton
      onClick={() => {
        navigate(-1);
      }}
      disabled={!directoryId}
    >
      <ArrowBackIosNewOutlined />
    </IconButton>
  );
};

const CreateNewDirectoryButton = (props: Pick<IconButtonProps, "onClick">) => {
  return (
    <IconButton sx={{ marginLeft: "auto" }} onClick={props.onClick}>
      <CreateNewFolderOutlined />
    </IconButton>
  );
};

/**
 * 이미지 또는 영상 추가하기
 */
const FileAddButton = () => {
  const params = useParams<{ directoryId: string }>();

  const directoryId = Number(params.directoryId);

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progressList, setProgressList] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Fragment>
      <IconButton
        onClick={() => {
          fileInputRef.current?.click();
        }}
        disabled={!directoryId}
      >
        <AddPhotoAlternateOutlined />
        <input
          hidden
          multiple
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={(event) => {
            if (!event.target.files) return;

            setOpen(true);
            setFiles([...event.target.files]);
            setProgressList([...event.target.files].map(() => 0));
            // mutateUpload({
            //   file: event.target.files[0],
            //   directoryId,
            // });
          }}
        />
      </IconButton>
      <FileUploader
        open={open}
        setOpen={setOpen}
        files={files}
        progressList={progressList}
        setProgressList={setProgressList}
      />
    </Fragment>
  );
};

/**
 * 계정 정보 확인
 */
const AccountButton = () => {
  return (
    <IconButton>
      <AccountCircleOutlined />
    </IconButton>
  );
};

type FileUploaderProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  progressList: number[];
  setProgressList: Dispatch<SetStateAction<number[]>>;
  files: File[];
};

const FileUploader = (props: FileUploaderProps) => {
  const params = useParams<{ directoryId: string }>();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const directoryId = Number(params.directoryId);
  const fileListPayload: FileListReqDTO = {
    directoryId,
    page: Number(searchParams.get("page")) || 0,
    size: Number(searchParams.get("size")) || 0,
    sort: searchParams.get("sort") || "created_at",
    order: searchParams.get("order") || "desc",
  };
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const { handleOpen } = GlobalSnackbar.use();

  const { refetch: refetchFileList } = useQuery({
    queryKey: ["fileList", fileListPayload],
    queryFn: async () => {
      const response = await fileListApi.GET(fileListPayload);

      return response;
    },
  });

  const uploadAll = async () => {
    dispatch({ type: "START_UPLOAD" });
    for (let i = 0; i < props.files.length; i++) {
      const file = props.files[i];
      await fileUploadApi.POST({ file, directoryId }, (percent) => {
        props.setProgressList((prev) => {
          const updated = [...prev];
          updated[i] = percent;
          return updated;
        });
      });
    }

    handleOpen({ message: `업로드 완료`, severity: "success" });
    dispatch({ type: "FINISH_UPLOAD" });
    setTimeout(() => {
      props.setOpen(false);
      dispatch({ type: "RESET" });
    }, 1000);
  };

  return (
    <Modal
      open={props.open}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClose={() => {
        props.setOpen(false);
        refetchFileList();
      }}
    >
      <Stack
        direction="column"
        gap="16px"
        sx={({ breakpoints, palette }) => ({
          bgcolor: palette.background.paper,
          padding: "24px",
          borderRadius: "12px",
          [breakpoints.down("sm")]: {
            alignSelf: "stretch",
            margin: "16px",
            padding: "24px",
            maxHeight: "400px",
          },
        })}
      >
        <Typography>파일 업로드</Typography>
        <Stack direction="column" gap="12px">
          {props.files.map((v, i) => (
            <UploaderItem
              key={v.name}
              file={v}
              progress={props.progressList[i]}
            />
          ))}
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button color="warning" onClick={() => props.setOpen(false)}>
            취소
          </Button>
          <Button color="primary" onClick={uploadAll} disabled={state.disabled}>
            {state.buttonLabel}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

type UploadStatus = "idle" | "uploading" | "done";

type State = {
  status: UploadStatus;
  buttonLabel: string;
  disabled: boolean;
};

type Action =
  | { type: "START_UPLOAD" }
  | { type: "FINISH_UPLOAD" }
  | { type: "RESET" };
const uploadReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_UPLOAD":
      return {
        status: "uploading",
        buttonLabel: "업로드 중...",
        disabled: true,
      };
    case "FINISH_UPLOAD":
      return { status: "done", buttonLabel: "완료", disabled: true };
    case "RESET":
      return { status: "idle", buttonLabel: "업로드", disabled: false };
    default:
      return state;
  }
};
const initialState: State = {
  status: "idle",
  buttonLabel: "업로드",
  disabled: false,
};

type UploaderItemProps = {
  file: File;
  progress: number;
};

const UploaderItem = memo((props: UploaderItemProps) => {
  return (
    <Stack key={props.file.name} direction="row" alignItems="center" gap="8px">
      <Stack
        direction="row"
        flex="1"
        justifyContent="space-between"
        overflow="hidden"
      >
        <Typography
          flex="1 1 0"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {props.file.name}
        </Typography>
        <Typography flex="0 0 auto">{`${Math.round(
          props.file.size / 1024
        ).toLocaleString()}KB`}</Typography>
      </Stack>
      <Stack flex="0 0 64px">
        <LinearProgress
          variant="determinate"
          value={props.progress}
          sx={({ palette }) => ({
            height: "16px",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: palette.text.secondary,
            bgcolor: palette.background.paper,
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: "16px",
            },
          })}
        />
      </Stack>
    </Stack>
  );
});

export default Header;
