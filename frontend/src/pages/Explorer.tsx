import { Link, useParams } from "react-router";
import { FolderOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { directoryDetailApi } from "@shared/api/directory/[id]/detail/route";
import { directoryApi } from "@shared/api/directory/[id]/route";
import { UnwrapApiResponse } from "@shared/types";

const Explorer = () => {
  const params = useParams<{ directoryId: string }>();

  const directoryId = Number(params.directoryId);

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

  return (
    <Stack direction="column">
      <DirectoryItem
        id={directoryDetailData?.directory.parentId || 0}
        directoryName=".."
        updatedAt=""
      />
      {directoriesData?.directory.map((v) => (
        <DirectoryItem key={v.id} {...v} />
      ))}
    </Stack>
  );
};

type Directory = UnwrapApiResponse<
  typeof directoryApi.GET
>["directory"][number];

const DirectoryItem = (
  props: Pick<Directory, "id" | "directoryName" | "updatedAt">
) => {
  return (
    <Stack
      direction="row"
      height="48px"
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
      <FolderOutlined />
      <Stack direction="column" flex="1">
        <Typography color="textPrimary">{props.directoryName}</Typography>
        <Typography color="textSecondary">
          {props.updatedAt && new Date(props.updatedAt).toLocaleString()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Explorer;
