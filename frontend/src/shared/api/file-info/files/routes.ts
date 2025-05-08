import { FileListReqDTO, FileListResDTO } from "@dto/file-info.dto";

async function GET(body: FileListReqDTO) {
  const params = new URLSearchParams();
  Object.entries(body).forEach(([field, value]) => {
    params.append(field, String(value));
  });
  const res = await fetch(`/api/file-info/files?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: FileListResDTO = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const fileListApi = {
  GET,
};
