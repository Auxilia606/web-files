import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  AccountCircleOutlined,
  ArrowBackIosNewOutlined,
  ArrowRightOutlined,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { directoryDetailApi } from "@shared/api/directory/[id]/detail/route";

const Header = () => {
  const params = useParams<{ directoryId: string }>();
  const navigate = useNavigate();

  const directoryId = Number(params.directoryId);

  const { data: directoryData } = useQuery({
    queryKey: ["directory", params.directoryId, "detail"],
    queryFn: async () => {
      return directoryDetailApi.GET({ directoryId });
    },
    enabled: !!directoryId && !isNaN(directoryId),
  });

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
        <IconButton sx={{ marginLeft: "auto" }}>
          <AccountCircleOutlined />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        sx={{ padding: "0 16px" }}
      >
        <Typography>루트</Typography>
        {directoryData?.directory.fullPath
          .split("/")
          .filter((path) => path)
          .map((pathName, index, arr) => {
            const isLast = arr.length - 1 === index;
            return (
              <React.Fragment>
                <ArrowRightOutlined />
                <Typography
                  fontWeight={isLast ? 700 : 400}
                  color={isLast ? "primary" : "textPrimary"}
                >
                  {pathName}
                </Typography>
              </React.Fragment>
            );
          })}
      </Stack>
    </Stack>
  );
};

export default Header;
