import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  AccountCircleOutlined,
  ArrowBackIosNewOutlined,
  ArrowRightOutlined,
  CreateNewFolderOutlined,
} from "@mui/icons-material";
import {
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";

import { directoryDetailApi } from "@shared/api/directory/[id]/detail/route";
import { directoryApi } from "@shared/api/directory/[id]/route";
import { directoryCreateApi } from "@shared/api/directory/create/route";

const Header = () => {
  const params = useParams<{ directoryId: string }>();
  const navigate = useNavigate();

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
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosNewOutlined />
        </IconButton>
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={toggleCreateDrawer(true)}
        >
          <CreateNewFolderOutlined />
        </IconButton>
        <IconButton>
          <AccountCircleOutlined />
        </IconButton>
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

export default Header;
