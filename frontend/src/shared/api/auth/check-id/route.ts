type ReqDTO = {
  loginId: string;
};

type ResDTO = {
  message: string;
};

async function POST(body: ReqDTO) {
  const res = await fetch("/api/auth/check-id", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ResDTO = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const authCheckIdApi = {
  POST,
};
