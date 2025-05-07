import { ApiResponse } from "@shared/types";

async function POST(body: { parentId: number | null; directoryName: string }) {
  const res = await fetch(`/api/directory/create`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
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

export const directoryCreateApi = {
  POST,
};
