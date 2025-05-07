import dayjs from "dayjs";

import { ApiResponse } from "@shared/types";

async function POST(body: { file: File; directoryId: number }) {
  const formData = new FormData();
  formData.append("file", body.file);
  formData.append("directoryId", String(body.directoryId));
  formData.append(
    "mediaCreatedAt",
    dayjs(body.file.lastModified).format("YYYY-MM-DD HH:mm:ss")
  );
  formData.append("comment", "");

  const res = await fetch(`/api/file-info/upload`, {
    method: "POST",
    body: formData,
    headers: {},
    credentials: "include",
  });

  const data: ApiResponse<{
    directoryId: number;
  }> = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const fileUploadApi = {
  POST,
};
