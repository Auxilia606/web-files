import { Link, useLocation, useParams } from "react-router";
import { DriveFolderUploadOutlined, FolderOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { directoryDetailApi } from "@shared/api/directory/[id]/detail/route";
import { directoryApi } from "@shared/api/directory/[id]/route";
import { fileListApi } from "@shared/api/file-info/files/routes";
import { UnwrapApiResponse } from "@shared/types";
import { FileDTO, FileListReqDTO } from "@dto/file-info.dto";

const Explorer = () => {
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

  const { data: directoryDetailData } = useQuery({
    queryKey: ["directory", params.directoryId, "detail"],
    queryFn: async () => {
      return directoryDetailApi.GET({ directoryId });
    },
    enabled: !!directoryId && !isNaN(directoryId),
  });

  const { data: directoriesData } = useQuery({
    queryKey: ["directory", params.directoryId],
    queryFn: async () => {
      return directoryApi.GET({ directoryId });
    },
    enabled: !isNaN(directoryId),
  });

  const { data: fileList } = useQuery({
    queryKey: ["fileList", fileListPayload],
    queryFn: async () => {
      const response = await fileListApi.GET(fileListPayload);

      return response;
    },
  });

  return (
    <Stack direction="column">
      <DirectoryItem
        back
        id={directoryDetailData?.directory.parentId || 0}
        directoryName=".."
        updatedAt=""
      />
      {directoriesData?.directory.map((v) => (
        <DirectoryItem key={v.id} {...v} />
      ))}
      {fileList?.files.map((v) => (
        <FileItem key={v.id} {...v} />
      ))}
    </Stack>
  );
};

type Directory = UnwrapApiResponse<
  typeof directoryApi.GET
>["directory"][number];

const DirectoryItem = (
  props: Pick<Directory, "id" | "directoryName" | "updatedAt"> & {
    back?: boolean;
  }
) => {
  return (
    <Stack
      direction="row"
      height="64px"
      alignItems="center"
      gap="16px"
      sx={{
        padding: "0 16px",
        color: "text.primary",
        "&:visited": { color: "text.primary" },
      }}
      component={Link}
      to={`/explorer/${props.id}`}
    >
      {props.back ? (
        <DriveFolderUploadOutlined sx={{ margin: "0 8px" }} />
      ) : (
        <FolderOutlined sx={{ margin: "0 8px" }} />
      )}
      <Stack direction="column" flex="1">
        <Typography color="textPrimary">{props.directoryName}</Typography>
        <Typography color="textSecondary">
          {props.updatedAt && new Date(props.updatedAt).toLocaleString()}
        </Typography>
      </Stack>
    </Stack>
  );
};

type FileItemProps = FileDTO;

const FileItem = (props: FileItemProps) => {
  return (
    <Stack
      component="button"
      direction="row"
      height="64px"
      alignItems="center"
      justifyContent="flex-start"
      gap="16px"
      sx={({ palette }) => ({
        padding: "0 16px",
        color: "text.primary",
        bgcolor: palette.background.default,
        border: "none",
        "&:visited": { color: "text.primary" },
        textAlign: "start",
        img: {
          borderRadius: "8px",
        },
      })}
    >
      <img
        src={`/api/file-info/thumbnail/${props.id}`}
        width={48}
        height={48}
      />
      <Stack direction="column" flex="1">
        <Typography color="textPrimary">{props.original_name}</Typography>
        <Typography color="textSecondary">
          {props.media_created_at &&
            new Date(props.media_created_at).toLocaleString()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Explorer;
