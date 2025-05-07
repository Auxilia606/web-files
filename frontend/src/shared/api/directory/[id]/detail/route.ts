async function GET(params: { directoryId: number }) {
  const res = await fetch(`/api/directory/${params.directoryId}/detail`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: {
    message: string;
    directory: {
      id: number;
      parentId: number;
      directoryName: string;
      fullPath: string;
      createdAt: string;
      updatedAt: string;
      isDeleted: boolean;
      createdBy: boolean;
      isPrivate: boolean;
    };
  } = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const directoryDetailApi = {
  GET,
};
