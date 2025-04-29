type ResDTO = {
  message: string;
  result: { accessToken: string };
};

async function POST() {
  const res = await fetch("/api/auth/refresh-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: ResDTO = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const authRefreshTokenApi = {
  POST,
};
