import React, { useLayoutEffect, useRef, useState } from "react";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    <Stack direction="column">
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refetch: refetchFileList } = useQuery({
    queryKey: ["fileList", fileListPayload],
    queryFn: async () => {
      const response = await fileListApi.GET(fileListPayload);

      return response;
    },
  });

  const { mutate: mutateUpload } = useMutation({
    mutationFn: fileUploadApi.POST,
    onSuccess: () => {
      refetchFileList();
    },
  });

  return (
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

          mutateUpload({
            file: event.target.files[0],
            directoryId,
          });
        }}
      />
    </IconButton>
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

export default Header;
