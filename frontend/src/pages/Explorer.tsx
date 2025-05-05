import { Stack } from "@mui/material";

const Explorer = () => {
  return (
    <Stack>
      <video width="640" height="360" controls>
        <source src="/api/video/test.mp4" type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.111
      </video>
    </Stack>
  );
};

export default Explorer;
