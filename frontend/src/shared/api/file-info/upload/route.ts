import dayjs from "dayjs";

import { ApiResponse } from "@shared/types";

async function POST(
  body: { file: File; directoryId: number },
  onProgress?: (percent: number) => void
): Promise<ApiResponse<{ directoryId: number }>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", body.file);
    formData.append("directoryId", String(body.directoryId));
    formData.append(
      "mediaCreatedAt",
      dayjs(body.file.lastModified).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("comment", "");

    xhr.open("POST", "/api/file-info/upload");

    // 업로드 진행률
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    // 응답 수신
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } catch {
          reject(new Error("서버 응답 파싱 실패"));
        }
      } else {
        reject(new Error(`업로드 실패: ${xhr.statusText}`));
      }
    };

    // 네트워크 오류
    xhr.onerror = () => reject(new Error("요청 중 네트워크 오류 발생"));
    xhr.ontimeout = () => reject(new Error("요청 시간이 초과되었습니다"));

    xhr.send(formData);
  });
}

export const fileUploadApi = {
  POST,
};
